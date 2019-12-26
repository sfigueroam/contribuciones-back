process.env.clientIdAmazon= "4i65ld3cq12ddnp2th47g359os";
process.env.scopeAmazon= "tgr-dev-api-servicios-cut/all";
process.env.clientSecretAmazon= "67gpaamp8fp5387o6gfke7op4nt11dpfll94portn907sh6fpa";
process.env.grantTypeAmazon ="client_credentials" ;
process.env.hostnameTokenAmazon = "id-dev.tegere.info";
process.env.hostnameAmazon = "jx1wukpm36.execute-api.us-east-1.amazonaws.com"
// process.env.BUCKET_NAME="tgr-qa-api-certificados-data";
process.env.env="dev";

const crear = require('../obtiene-deuda');

let event = {"pathParameters": {"rol":"7000617052"}}; // json entrada para buscar certificado
console.log('Inicio de funcion');
// let event = {};

crear.handler(event, null, ()=>{});