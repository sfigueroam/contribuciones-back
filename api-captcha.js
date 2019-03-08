'use strict';
const util = require('./util');

module.exports.handler = (event, context, callback) => {

    let hostname = process.env.apiHostnameVerifyCaptcha;
    let path = process.env.apipathVerifyCaptcha;
    let idApp = process.env.idApp;
    let threshold = process.env.threshold;

    util.validaToken(hostname, path, JSON.parse(event.body.toString('utf-8')).token, idApp,function(err, data){

        if(JSON.parse(data.body.toString('utf-8')).success == 'false'){
            data.statusCode = 401;
            data.body = JSON.stringify({ error: 'Falló validación Recaptcha' });
        }
        if(parseFloat(threshold) === 0.0){
            callback(null, data);
        }else{
            let scoreRequest = JSON.parse(data.body.toString('utf-8')).score;
            if(parseFloat(scoreRequest) >= parseFloat(threshold)){
                callback(null, data);
            }else{
                data.statusCode = 401;
                data.body = JSON.stringify({ error: 'Falló validación Recaptcha' });
                callback(null, data);
            }
        }
    })

};
