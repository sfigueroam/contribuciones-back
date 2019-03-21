'use strict';

module.exports.handler = async (event, context) => {

    let device = {
        desktop : false,
        tablet: false,
        mobile: false,
        smartTv: false

    };

    if(event.headers['CloudFront-Is-Desktop-Viewer'] == 'true'){
        device.desktop = true;
    } else if(event.headers['CloudFront-Is-Tablet-Viewer'] == 'true'){
        device.tablet = true;
    } else if(event.headers['CloudFront-Is-Mobile-Viewer'] == 'true'){
        device.mobile = true;
    } else if(event.headers['CloudFront-Is-SmartTV-Viewer'] == 'true'){
        device.smartTv = true;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            device: device,
            header: event.headers
        }),
    };

};
