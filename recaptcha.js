'use strict';
const util = require('./util');
const api = require('./api');
const direccion = require('./direccion');

module.exports.handler = (event, context, callback) => {

    let hostname = process.env.apiHostnameVerifyCaptcha;
    let path = process.env.apipathVerifyCaptcha;
    let idApp = process.env.idApp;
    let threshold = process.env.threshold;

    let body = JSON.parse(event.body.toString('utf-8'));
    let token = body.token;
    body.token = undefined;
    event.body = JSON.stringify(body);

    util.validaToken(hostname, path, token, idApp,function(err, data){

        if(JSON.parse(data.body.toString('utf-8')).success == 'false'){
            data.statusCode = 401;
            data.body = JSON.stringify({ error: 'Falló validación Recaptcha' });
        }
        if(parseFloat(threshold) === 0.0){
            event.path = event.path.replace('captcha/v2/' , '');
            if(event.path.indexOf('elasticsearch') !== -1){
                direccion.handler(event, context, callback);
            }else{
                api.handler(event, context, callback);
            }
        }else{
            let scoreRequest = JSON.parse(data.body.toString('utf-8')).score;
            if(parseFloat(scoreRequest) >= parseFloat(threshold)){
                event.path = event.path.replace('captcha/v3/' , '');
                if(event.path.indexOf('elasticsearch') !== -1){
                    direccion.handler(event, context, callback);
                }else{
                    api.handler(event, context, callback);
                }
            }else{
                data.statusCode = 401;
                data.body = JSON.stringify({ error: 'Falló validación Recaptcha' });
                callback(null, data);
            }
        }
    })

};
