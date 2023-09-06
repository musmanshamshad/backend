const aws = require("../config/aws");
const s3 = new aws.S3({});
const s3Imageupload = async (base64encoded, path = "users") => {
  return new Promise(async (resolve, reject) => {
    if (!base64encoded) {
      return reject({
        error: true,
        location: false,
      });
    }
    const base64Data = new Buffer.from(
      base64encoded.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    // Getting the file type, ie: jpeg, png or gif
    const type = base64encoded.split(";")[0].split("/")[1];
    const params = {
      Bucket: "octilearn-prod",
      Key: `${path}/${Date.now().toString()}.${type}`, // type is not required
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `image/${type}`, // required.
    };

    try {
      const { Location, Key } = await s3.upload(params).promise();
      location = Location;
      let key = Key;
      return resolve({
        error: null,
        key,
        location,
      });
    } catch (error) {
      // console.log(error)

      console.log("s3ImageuploadError", error);
      return reject({
        error: error,
        location: null,
        key: null,
      });
    }
  });
};

const uploadS3FileExtended = (
  buffer,
  fileName,
  folder = "learningObjectives"
) => {
  return new Promise((resolve, reject) => {
    const key = `${folder}/${fileName}`;
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: buffer,
      ACL: "public-read",
      ContentType: `image/${fileName.split(".")[1]}`,
    };

    s3.upload(s3Params, function (err, data) {
      if (err) {
        console.log("Error while uploading image to s3:", err);
        return reject({
          error: err,
          location: null,
          key: null,
        });
      } else {
        const { Location, Key } = data;
        return resolve({
          error: null,
          Location,
          Key,
        });
      }
    });
  });
};

module.exports = { s3Imageupload, uploadS3FileExtended };
