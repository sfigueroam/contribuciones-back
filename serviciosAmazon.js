const https = require('https');

if(process.env.env == 'stag'){
    process.env.env = 'prod'
}

function obtenerDeuda( rol, token) {
    return new Promise((resolve, reject) => {

        console.log("rol en servicioAmazon ", rol);
  
            let options = {
                // hostname: 'jx1wukpm36.execute-api.us-east-1.amazonaws.com' ,
                hostname: process.env.hostNameAmazon ,
                port: 443,
                path: "/api-servicios-cut/" + process.env.env + "/servicios-recaudacion/v1/liquidacion/deudasrol?rol="+rol,
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
                    console.log("options", options);
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
            console.log(error, 'Error en promesa BuscarDeuda');
        });
}
exports.obtenerDeuda = obtenerDeuda;

function multiAR(body, token) {
    return new Promise((resolve, reject) => {

        console.log("rmultiAr en Amazon ", body);
            let bodystring = JSON.stringify(body)
            console.log("bodystring", bodystring);
            let options = {
                // hostname: 'jx1wukpm36.execute-api.us-east-1.amazonaws.com' ,
                hostname: process.env.hostNameAmazon ,
                port: 443,
                path: "/api-servicios-cut/" + process.env.env + "/servicios-recaudacion/v1/liquidacion/ingresamultiar",
                method: 'POST',
                rejectUnauthorized: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: bodystring
                // console.log("body2", body):
            };

            let respuesta = '';
            let req = https.request(options, (res) => {
                    console.log("options2", options);
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
            req.write(JSON.stringify(body));
            req.on('close', () => {
                let salida = JSON.parse(respuesta);
                resolve(salida);
            });
            req.end();
        })
        .catch((error) => {
            console.log(error, 'Error en promesa calcular CidUnico');
        });
}
exports.multiAR = multiAR;

