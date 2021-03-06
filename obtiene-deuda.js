'use strict';

// const AWS = require('aws-sdk');
// AWS.config.update({ region: "us-east-1"});
const servAmazon = require('./serviciosAmazon');
const genToken = require('./genToken');
// const _ = require('lodash');

module.exports.handler = async (event, context, callback) => {

        var rol = event.pathParameters.rol;
        //var id= "1AWS2019071000002333-CHPV";
        // console.log('tgr-certificado-api crearCertificado. JSON de Entrada:' , id);
        console.log("[INICIO PROCESO] Iniciando consulta a servicios");
        
        let clienteId = process.env.clientIdAmazon;
        // let clienteId = "4i65ld3cq12ddnp2th47g359os";
        let scope = process.env.scopeAmazon;
        // let scope = "tgr-dev-api-servicios-cut/all";
        let clientSecret = process.env.clientSecretAmazon;
        // let clientSecret = "67gpaamp8fp5387o6gfke7op4nt11dpfll94portn907sh6fpa";
        let grantType = process.env.grantTypeAmazon;
        // let grantType = "client_credentials";
        // let host = process.env.hostnameTokenAmazon;
        // let host = "id-dev.tegere.info";
        let token;
        
        try{
            token = await genToken.obtenerToken(clienteId,scope,clientSecret,grantType);
            console.log("tokenGenerico calculado");
            console.log("token",token);
        } catch(err){
            console.log('Error al generar token nube', err);
        }
        
        let salida = await servAmazon.obtenerDeuda(rol, token);
        let out= {};
        out["requestId"] = salida;
        
        console.log("salida consutla deuda:", salida);
        
        /* transformacion para la vista del front */
  

        
        /* fin transformacion para la vista del front */
        
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

