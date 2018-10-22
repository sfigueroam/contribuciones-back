var handler = require('../tokens-renew.js').handler;

handler({},{},(err,data)=>{
    console.log('err',err);
    console.log('data',data);
});
