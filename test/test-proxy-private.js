var handler = require('../proxy-private').handler;

handler({},{},(err,data)=>{
    console.log('err',err);
    console.log('data',data);
});
