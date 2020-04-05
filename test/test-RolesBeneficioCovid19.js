const consulta = require("../getRolesBeneficioCovid19");
process.env.env = "dev";
(async () => {
    
    let inicio = Date.now();
    // let event = { 
    //     queryStringParameters: {
    //         rol: "166115450"
    //     }
    // };
    let event = {"pathParameters": {"rol":"9506254070"}}; // json entrada para buscar certificado        
    
  consulta.handler(event, null, ()=>{ console.log("fin")});
})();