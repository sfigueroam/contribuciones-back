const https = require('https');
// const http = require('http')
// const token=require('./genToken');
const hostname=process.env.hostnameAmazon;
const env = process.env.env;

function obtenerDeuda( rol, token) {
    return new Promise((resolve, reject) => {

        console.log("rol en servicioAmazon ", rol);
  
            let options = {
                hostname,
                port: 443,
                path: "/" + env + "/servicios-recaudacion/v1/liquidacion/deudasrol?rol=" + rol,
                // path: "/" + "dev" + "/servicios-recaudacion/v1/liquidacion/deudasrol?rol="+rol,
                method: 'GET',
                rejectUnauthorized: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            };

            let respuesta = '';
            let req = https.request(options, (res) => {
                
                    console.log('Respuesta servicio tierra statusCode:', res.statusCode);
                   
                    if( res.statusCode != 200 && res.statusCode != 201){
                        console.log("Error al tratar de consumir el servicio tierra");
                        return("Por el momento no podemos atender su consulta");
                    }
                  
                res.on('data', (d) => {
                    respuesta += d;
                });

            }).on('error', (error) => {
                console.error(error);
                reject(error);
            });

            req.on('close', () => {
                let salida = JSON.parse(respuesta);
                //----------------------------Corregir salida en servicio web--------------------------------------//
                resolve(salida);
            });
            req.end();
        })
        .catch((error) => {
            console.log(error, 'Error en promesa validarCliente');
        });
}
exports.obtenerDeuda = obtenerDeuda;