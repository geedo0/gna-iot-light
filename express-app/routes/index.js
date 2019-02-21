var express = require('express');
var router = express.Router();

// Setup the AWS SDK
var IoTData = require('aws-sdk/clients/iotdata');
var iot = new IoTData({
  region: process.env.npm_package_config_aws_region,
  endpoint: process.env.npm_package_config_iot_endpoint
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/blink', function(req, res, next) {
  var options = {
    topic: process.env.npm_package_config_iot_topic
  };
  iot.publish(options, function(err, data) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log('Lights are blinking');
      res.sendStatus(200);
    }
  });
});

module.exports = router;
