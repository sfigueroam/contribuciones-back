const consulta = require("../getRolesBeneficioCovid19");
process.env.ENV = "dev";
(async () => {
    
    let inicio = Date.now();
    // let event = { 
    //     queryStringParameters: {
    //         rol: "166115450"
    //     }
    // };
    let event = {"pathParameters": {"rol":"166115450"}}; // json entrada para buscar certificado        
    
    await consulta.handler(event).then((response)=>{
       console.log('CallBack Respuesta=>' + JSON.stringify(response)); 
       console.log( (Date.now() - inicio) + ' Milliseconds');
    });

})();