process.env.clientIdAmazon= "4i65ld3cq12ddnp2th47g359os";
process.env.scopeAmazon= "tgr-dev-api-servicios-cut/all";
process.env.clientSecretAmazon= "67gpaamp8fp5387o6gfke7op4nt11dpfll94portn907sh6fpa";
process.env.grantTypeAmazon ="client_credentials" ;
process.env.hostTokenAmazon = "id-dev.tegere.info";
process.env.hostNameAmazon = "jx1wukpm36.execute-api.us-east-1.amazonaws.com"
// process.env.BUCKET_NAME="tgr-qa-api-certificados-data";
process.stage="dev";

const crear = require('../obtiene-deuda');

let event = {"pathParameters": {"rol":"1900102013"}}; // json entrada para buscar certificado
console.log('Inicio de funcion');
// let event = {};

crear.handler(event, null, ()=>{});