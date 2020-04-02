const consulta = require("../getRolesBeneficioCovid19");
process.env.ENV = "dev";
(async () => {
    
    let inicio = Date.now();
    let event = { 
        queryStringParameters: {
            rol: "252648011"
        }
    };
        
    await consulta.handler(event).then((response)=>{
       console.log('CallBack Respuesta=>' + JSON.stringify(response)); 
       console.log( (Date.now() - inicio) + ' Milliseconds');
    });
    
})();