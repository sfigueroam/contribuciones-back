'use strict';
const util = require('./util');

module.exports.handler = async (event, context, callback) => {

    let device = {
        desktop : false,
        tablet: false,
        mobile: false,
        smartTv: false

    };

    if(event.headers['CloudFront-Is-Desktop-Viewer'] === 'true'){
        device.desktop = true;
    } else if(event.headers['CloudFront-Is-Tablet-Viewer'] === 'true'){
        device.tablet = true;
    } else if(event.headers['CloudFront-Is-Mobile-Viewer'] === 'true'){
        device.mobile = true;
    } else if(event.headers['CloudFront-Is-SmartTV-Viewer'] === 'true'){
        device.smartTv = true;
    }

    util.responseOk({device: device}, callback);

};
