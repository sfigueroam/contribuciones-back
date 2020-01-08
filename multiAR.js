'use strict';

const servAmazon = require('./serviciosAmazon');
const genToken = require('./genToken');
const obtieneDeuda = require('./obtiene-deuda');

module.exports.handler = async (event, context, callback) => {

        console.log('tgr-api-consulta-deudaCut','call',event);
        var body = JSON.parse(event.body);
        //var id= "1AWS2019071000002333-CHPV";
        // console.log('tgr-certificado-api crearCertificado. JSON de Entrada:' , id);
        console.log("[INICIO PROCESO] Iniciando consulta a servicios");
        
        console.log("listaCid", body.listaCid);

        // listaCid = JSON.stringify(listaCid);
        
        let clienteId = process.env.clientIdAmazon;
        let scope = process.env.scopeAmazon;
        let clientSecret = process.env.clientSecretAmazon;
        let grantType = process.env.grantTypeAmazon;
        let token = obtieneDeuda.token;
        
        try{
            token = await genToken.obtenerToken(clienteId,scope,clientSecret,grantType);
            console.log("tokenGenerico calculado");
            console.log("token",token);
        } catch(err){
            console.log('Error al generar token nube', err);
        }
        
        let salida = await servAmazon.multiAR(body, token);
        let out= {};
        out["requestId"] = salida;
        
        console.log("salida consutla deuda:", salida);
        
        console.log("[FIN PROCESO]");

        const response = {
            statusCode: 201,
            body: JSON.stringify(salida),
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        };

        console.log('tgr-certificado-api createCertificado', 'response', response);
        callback(null, response);
};

