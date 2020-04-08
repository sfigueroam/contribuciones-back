'use strict';
const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1"
});
var docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const logger = require('./logger');
const dynamo = require('./aws/dynamodbServices');

const params = {
    rol: {
        transform: (field) => {
            try {
                return _.toString(field)
            } catch (e) {
                return -1
            }
        },
        isValid: (transformedField) => {
            return _.size(transformedField) > 0
        },
        message: `El parametro 'rol' es obligatorio`
    }
};

function validateFormat(event) {
    //let queryStringParameters = _.assign({}, event.queryStringParameters);
    let queryStringParameters = _.assign({}, event.pathParameters);
    console.log('parametros recibidos', queryStringParameters);
    let errors = [];
    let values = _.mapValues(params, (paramValue, paramName) => {
        let res;
        let field = queryStringParameters.hasOwnProperty(paramName) ?
            queryStringParameters[paramName] : paramValue.hasOwnProperty('default') ? paramValue.default : undefined;

        if (_.isUndefined(field)) {
            if (!paramValue.optional) {
                errors.push(paramValue.message);
            } else {
                res = undefined;
            }
        } else {
            let value = paramValue.transform(field);
            if (paramValue.isValid(value)) {
                res = value;
            } else {
                errors.push(paramValue.message);
            }
        }

        return res;
    });

    return {errors, values};
}

async function doit(values, callback) {
    console.log(values);
    let rol = values.rol;
    let resumenCompleto= {};
    let ini1 = null;
    let ini2 = null;
    let existeRol = 0;
    let cerosFaltantes = 0;
    var cero = "0";
    var beneficios ="NO";
    //let porcentajeBeneficio = 0;
    
    cerosFaltantes = 11 - rol.length;
    
    console.log('rol: ', rol)
    console.log('largo rol: ', rol.length)
    console.log('cerosFaltantes: ', cerosFaltantes)
    if (rol.length < 11) {
        for (var i = 0; i < cerosFaltantes; i++) {
           rol = cero.concat(rol);
        }
    }
    console.log('nuevo rol con 11 digitos: ', rol)
    
    //tgr-dev-contribuciones-roles-beneficios
    //1.- traer resumen
    var params = {
        TableName: `tgr-${process.env.env}-contribuciones-roles-beneficios`,
        //IndexName: `tgr-${process.env.ENV}-core-ordenes-pago-rut-fechaPago-idx`,
        //KeyConditionExpression: "rol = :rol and fechaPago between :fechaPagoIni and :fechaPagoFin",
        KeyConditionExpression: "rol = :rol",
        ScanIndexForward: false //descendente
    };
   //// console.log('parametros con nombre dela tabla', params);
    params.ExpressionAttributeValues = {
        ":rol": rol
    };
        
    var resumen = await dynamo.query(params);
    console.log('resumen consulta dynamo', resumen.Items)
    //resumenCompleto = resumen.Count;
    
    if(resumen.Count > 0){
        existeRol = "SI";
    }else{
        existeRol = "NO";
    }
    console.log("resumen.Items.count: ", resumen.Items.length);
    //resumenCompleto = resumen.Items;
    //resumenCompleto.pagos = replace_Elements(resumenCompleto.pagos);
    if (resumen.Items.length > 0){
        beneficios = resumen.Items;
    }
    let data = {
        "existeRol" : existeRol,
        "beneficios" : beneficios
    }
    // const response = {
    //     statusCode: 200,
    //     //body: JSON.stringify(resumen.Count),
    //     body: JSON.stringify(data),
    //     headers: {
    //         "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    //         "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    //         'Accept': 'application/json, text/plain, */*',
    //         'Content-Type': 'application/json'
    //     }
    // };
    console.log("existeRol: ", existeRol)
    return response(200,data,callback);
}


module.exports.handler = async (event, context, callback) => {
    console.log('Entree');
    logger.log('call', event);

    let {errors, values} = validateFormat(event);

    if (!_.isEmpty(errors)) {
        response(400, {errors: errors}, callback);
        return;
    }

    return doit(values, callback);
   
    
};

function response(code, resultado, callback) {
    const response = {
        statusCode: code,
        body: JSON.stringify(resultado),
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    };
    //console.log(JSON.stringify(resultado));
    console.log('response', response);
    callback(null, response);
}