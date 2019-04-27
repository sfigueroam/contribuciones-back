'use strict';
const cryptoSecureRandomDigit = require('crypto-secure-random-digit');
const AWS = require('aws-sdk');
const ses = new AWS.SES({apiVersion: '2010-12-01'});
module.exports.preSignUp = (event, context, callback) => {

    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    callback(null, event);
};


module.exports.defineAuthChallenge = (event, context, callback) => {

    if (event.request.session &&
        event.request.session.length >= 3 &&
        event.request.session.slice(-1)[0].challengeResult === false) {
        // The user provided a wrong answer 3 times; fail auth
        event.response.issueTokens = false;
        event.response.failAuthentication = true;
    } else if (event.request.session &&
        event.request.session.length &&
        event.request.session.slice(-1)[0].challengeResult === true) {
        // The user provided the right answer; succeed auth
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
    } else {
        // The user did not provide a correct answer yet; present challenge
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'CUSTOM_CHALLENGE';
    }
    callback(null, event);
};

module.exports.createAuthChallenge = async (event, context, callback) => {

    let secretLoginCode;
    if (!event.request.session || !event.request.session.length) {
        secretLoginCode = cryptoSecureRandomDigit.randomDigits(6).join('');
        await sendEmail(event.request.userAttributes.email, secretLoginCode);
    } else {
        const previousChallenge = event.request.session.slice(-1)[0];
        secretLoginCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
    }
    event.response.publicChallengeParameters = {email: event.request.userAttributes.email};
    event.response.privateChallengeParameters = {secretLoginCode};
    event.response.challengeMetadata = 'CODE-'+secretLoginCode;

    callback(null, event);
};

async function sendEmail(emailAddress, secretLoginCode) {
    const params = {
        Destination: {ToAddresses: [emailAddress]},
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: "<html><body><p>This is your secret login code:</p> <h3>" + secretLoginCode + "</h3></body></html>"
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: 'Your secret login code: ' + secretLoginCode
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Your secret login code'
            }
        },
        Source: process.env.SES_FROM_ADDRESS
    };
    await ses.sendEmail(params).promise();
}

module.exports.verifyAuthChallenge = (event, context, callback) => {

    console.log(event.request);
    const expectedAnswer = event.request.privateChallengeParameters.secretLoginCode;
    if (event.request.challengeAnswer === expectedAnswer) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
    callback(null, event);
};
