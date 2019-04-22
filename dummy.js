'use strict';

const dummyEmail = 'jmora@tgr.cl jcandia@tgr.cl';

function headers(method) {
    const accessControlAllowOrigin = process.env.accessControlAllowOrigin;
    if (accessControlAllowOrigin) {
        return {
            'Access-Control-Allow-Origin': accessControlAllowOrigin, // Required for CORS support to work
            'Access-Control-Allow-Methods': method
        }
    } else {
        return undefined;
    }
}

module.exports.enviarMailCodigoVerificacion = async (event, context, callback) => {
    let requestBody = JSON.parse(event.body);
    let response = {
        headers: headers('POST'),
    };

    if (requestBody && requestBody.correo) {
        response.statusCode = 200;
        if (dummyEmail.indexOf(requestBody.correo) !== -1) {
            response.body = JSON.stringify({
                resultado: '1',
                descripcion: 'Correo enviado'
            })
        } else {
            response.body = JSON.stringify({
                resultado: '0',
                descripcion: 'Correo no enviado'
            })
        }
    } else {
        response.statusCode = 400;
    }

    console.log(response);

    callback(null, response);
};

module.exports.validarCodigo = async (event, context, callback) => {
    let requestBody = JSON.parse(event.body);
    let response = {
        headers: headers('POST'),
    };

    if (requestBody && requestBody.correo && requestBody.codigo) {
        response.statusCode = 200;
        if (dummyEmail.indexOf(requestBody.correo) !== -1 && requestBody.codigo === '123456') {
            response.body = JSON.stringify({
                resultado: '1',
                descripcion: 'Codigo valido'
            })
        } else {
            response.body = JSON.stringify({
                cantidad: '0',
                descripcion: 'Codigo no valido'
            })
        }
    } else {
        response.statusCode = 400;
    }

    callback(null, response);
};
