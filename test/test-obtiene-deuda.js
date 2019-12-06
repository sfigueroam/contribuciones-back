process.env.REST_TOKEN_CLIENT_ID= "4i65ld3cq12ddnp2th47g359os";
process.env.REST_TOKEN_SCOPE= "tgr-dev-api-servicios-cut/all";
process.env.REST_TOKEN_CLIENT_SECRET= "67gpaamp8fp5387o6gfke7op4nt11dpfll94portn907sh6fpa";
process.env.REST_TOKEN_GRANT_TYPE ="client_credentials" ;
process.env.HOST_NUBE = "id-dev.tegere.info";
process.env.endpoint = "2rk8a0tlcd.execute-api.us-east-1.amazonaws.com"
// process.env.BUCKET_NAME="tgr-qa-api-certificados-data";
process.env.ENV="dev";

const crear = require('../obtiene-deuda');

let event = {"pathParameters": {"rol":"1900102013"}}; // json entrada para buscar certificado
console.log('Inicio de funcion');
// let event = {};

crear.handler(event, null, ()=>{});