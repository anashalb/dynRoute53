const aws = require('aws-sdk');
const logger = require('./logger');

var route53Update = function(config){

  return {
    update: function(ipAddress) {

      aws.config.update({
      	"accessKeyId": config.AWS_ACCESS_KEY_ID,
      	"secretAccessKey": config.AWS_SECRET_ACCESS_KEY
      });
      
      const route53 = new aws.Route53();

      var changes = config.AWS_ROUTE53_RECORDSETNAMES.split(',').map((recordSetName) => {

        return {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: recordSetName,
            Type: 'A',
            ResourceRecords: [
              {
                Value: ipAddress
              }
            ],
            TTL: 10,
          }
        }

      });
      
      var params = {
        ChangeBatch: {
          Changes: changes,
          Comment: 'Auto Updated'
        },
        HostedZoneId: config.AWS_ROUTE53_HOSTEDZONEID
      };

     return route53.changeResourceRecordSets(params).promise();
    }
  }
}

module.exports = route53Update;
