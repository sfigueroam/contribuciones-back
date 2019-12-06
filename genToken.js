'use strict';
const https = require('https');
const querystring = require('querystring');
const host = process.env.HOST_NUBE;


function obtenerToken(clienteId, scope, clientSecret, grantType) {
    return new Promise((resolve, reject) => {
        let status = 0;
        console.log("host :" + host);
      //  let data = getToken(certificado);

let data = {
             "grant_type": grantType,
             "client_secret": clientSecret,
             "client_id": clienteId,
             "scope": scope
};
        
        console.log("data:",data)
        let postData = querystring.stringify(data);

    

        let options = {
            hostname: host,
            port: 443,
            path: '/oauth2/token',
            method: 'POST',
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        let respuesta = '';
        let token = null;
        let req = https.request(options, (res) => {
               
            if (res.statusCode != 200 && res.statusCode != 201) {
                console.log('Error en promesa al generar token');
                let status = {
                    id: 1,
                    mensaje: 'Error en promesa genToken',
                    error: "Erro al invocar el servicio"
                };
            return (status);
            }

            res.on('data', (d) => {
                respuesta += d;
            });
        });

        req.write(postData);
        req.on('error', (e) => {
            console.error(e);
            resolve(e);
        });

        req.on('close', () => {
            try {
                if (JSON.parse(respuesta).access_token != null)
                    token = JSON.parse(respuesta).access_token;

            } catch (error) {
                console.log("error al generar token :" + error);

            }

            resolve(token);
        });
        req.end();
    }).catch((error) => {

        console.log(error, 'Error en promesa genToken');

        let status = {
            id: 1,
            mensaje: 'Error en promesa genToken',
            error: error
        };

        return (status);
    });

}

exports.obtenerToken = obtenerToken;