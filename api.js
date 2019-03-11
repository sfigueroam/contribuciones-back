'use strict';
const util = require('./util');


module.exports.handler = (event, context, callback) => {

    let bucket = process.env.bucket;
    let path = event.path.replace('/api' , '');
    let clientId = process.env.clienteId;

    util.getTokenByKey(bucket, clientId, function (err, data) {
        util.obtenerDatos(data, event,path, callback)
    });

};
