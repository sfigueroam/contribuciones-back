process.env.clientIdAmazon= "4i65ld3cq12ddnp2th47g359os";
process.env.scopeAmazon= "tgr-dev-api-servicios-cut/all";
process.env.clientSecretAmazon= "67gpaamp8fp5387o6gfke7op4nt11dpfll94portn907sh6fpa";
process.env.grantTypeAmazon ="client_credentials" ;
process.env.hostTokenAmazon = "id-dev.tegere.info";
process.env.hostNameAmazon = "jx1wukpm36.execute-api.us-east-1.amazonaws.com"
// process.env.BUCKET_NAME="tgr-qa-api-certificados-data";
process.stage="dev";

const crear = require('../multiAR');

let obj = 
{ 
   "listaCid":[ 
      { 
         "idMoneda":0,
         "codigoBarra":"12059200005319123103014410",
         "montoTotal":877892
      },
      { 
         "idMoneda":0,
         "codigoBarra":"12059200005619123103014617",
         "montoTotal":645482
      }
   ],
   "usuario":"PruebaIngreso",
   "montoTotalPagar":"1523374"
}; 

console.log('Inicio de funcion');
let event = {body: JSON.stringify(obj)}; // json entrada para buscar certificado
// let event = {};

crear.handler(event, null, ()=>{});