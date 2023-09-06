const aws = require("aws-sdk");
require("dotenv").config({});
aws.config.setPromisesDependency(require("bluebird"));
aws.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
});
module.exports = aws;
