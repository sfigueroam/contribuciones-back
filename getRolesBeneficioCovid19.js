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
    let queryStringParameters = _.assign({}, event.queryStringParameters);

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
    let rol = values.rol;
    let resumenCompleto= {};
    let ini1 = null;
    let ini2 = null;
    let existeRol = 0;
    
    //1.- traer resumen
    var params = {
        TableName: `tgr-${process.env.ENV}-contribuciones-roles-covid19`,
        //IndexName: `tgr-${process.env.ENV}-core-ordenes-pago-rut-fechaPago-idx`,
        //KeyConditionExpression: "rol = :rol and fechaPago between :fechaPagoIni and :fechaPagoFin",
        KeyConditionExpression: "rol = :rol",
        ScanIndexForward: false //descendente
    };
    
    params.ExpressionAttributeValues = {
        ":rol": rol
    };
        
    var resumen = await dynamo.query(params);
    
    //resumenCompleto = resumen.Count;
    
    if(resumen.Count > 0){
        existeRol = "SI";
    }else{
        existeRol = "NO";
    }
    //resumenCompleto = resumen.Items;
    //resumenCompleto.pagos = replace_Elements(resumenCompleto.pagos);
    let data = {
        "existeRol" : existeRol
    }
    const response = {
        statusCode: 200,
        //body: JSON.stringify(resumen.Count),
        body: JSON.stringify(data),
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    };
    
    return response;
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

    console.log('response', response);
    callback(null, response);
}