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

// const conceptoMap = new Map();
// conceptoMap.set('PAGO_PROVEEDORES', 'PAGO PROVEEDORES DEL ESTADO');
// conceptoMap.set('FINANCIAMIENTO_PUBLICO_ELECTORAL', 'FINANCIAMIENTO PUBLICO ELECTORAL');
// conceptoMap.set('RENTA_ANTICIPADA', 'RENTA ANTICIPADA');

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
    // let rut = values.rut;
    // let mes = _.padStart(values.mes, 2, '0');
    // let anio= values.anio;
    let rol = values.rol;
    
    let resumenCompleto= {};
    //let fechaPagoIni = anio+"-"+mes+"-01T00:00:00";
    //let fechaPagoFin = anio+"-"+mes+"-31T23:59:59";
    let ini1 = null;
    let ini2 = null;
    let existeRol = 0;
    
    
    //1.- traer resumen
    var params = {
        TableName: `tgr-${process.env.ENV}-contribuciones-roles-covid19`,
        //IndexName: `tgr-${process.env.ENV}-core-ordenes-pago-rut-fechaPago-idx`,
        //KeyConditionExpression: "rol = :rol and fechaPago between :fechaPagoIni and :fechaPagoFin",
        KeyConditionExpression: "rol = :rol",
        // FilterExpression: 'begins_with(estado,:ini1) or begins_with(estado,:ini2) ',
        // ExpressionAttributeValues: {
        //     ":rut": Number(rut),
        //     ":fechaPagoIni": fechaPagoIni,
        //     ":fechaPagoFin": fechaPagoFin,
        //     ":ini1": ini1,
        //     ":ini2": ini2,
        // },
        ScanIndexForward: false //descendente
    };
    
    // if(estado=="CONFIRMADO"){
    //     ini1 = "C";
    //     params.ExpressionAttributeValues = {
    //         ":rut": Number(rut),
    //         ":fechaPagoIni": fechaPagoIni,
    //         ":fechaPagoFin": fechaPagoFin,
    //         ":ini1": ini1
    //     };
    //     params.FilterExpression = 'begins_with(estado,:ini1) ';
    // }else if(estado=="PENDIENTE"){
    //     ini1 = "P";
    //     params.ExpressionAttributeValues = {
    //         ":rut": Number(rut),
    //         ":fechaPagoIni": fechaPagoIni,
    //         ":fechaPagoFin": fechaPagoFin,
    //         ":ini1": ini1
    //     };
    //     params.FilterExpression = 'begins_with(estado,:ini1) ';
    // }else{
    //     ini1 = "C";
    //     ini2 = "P";
    //     params.ExpressionAttributeValues = {
    //         ":rut": Number(rut),
    //         ":fechaPagoIni": fechaPagoIni,
    //         ":fechaPagoFin": fechaPagoFin,
    //         ":ini1": ini1,
    //         ":ini2": ini2
    //     };
    //     params.FilterExpression = 'begins_with(estado,:ini1) or begins_with(estado,:ini2) ';
    // }
    
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
    
    const response = {
        statusCode: 200,
        //body: JSON.stringify(resumen.Count),
        body: JSON.stringify(existeRol),
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

// function replace_Elements(obj) {
//     for (var prop in obj) {
//         if (typeof obj[prop] === 'object') { // dive deeper in
//             replace_Elements(obj[prop]);
//         }
//         else if (prop == "concepto") { // delete elements that are empty strings
//             let concepto = conceptoMap.get(obj[prop]);

//             obj[prop+"Vista"] = concepto;
//         }
//     }
//     return obj;
// }