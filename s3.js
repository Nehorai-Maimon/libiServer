require("dotenv").config()
const S3 = require("aws-sdk/clients/s3"),
    fs = require("fs"),
    bucketName = process.env.AWS_BUCKET_NAME,
    region = process.env.AWS_BUCKET_REGION,
    accessKeyId = process.env.AWS_ACCESS_KEY,
    secretAccessKey = process.env.AWS_ACCESS_KEY_PASS;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

async function uploadFilesAWS(file, folder = "") {
    const filrestream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: filrestream,
        Key: folder + file.filename
    }
    return await s3.upload(uploadParams).promise()
}

async function getFileStrim(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return await s3.getObject(downloadParams).createReadStream()
}

async function getUrl(key) {
    const urlParams = {
        Bucket: bucketName,
        Key: key
    }
    const Url = await s3.getSignedUrl('getObject', urlParams)
    return Url
}

async function deleteFile(key) {
    const params = {
        Bucket: bucketName,
        Key: key
    }
    return await s3.deleteObject(params).promise()
}

module.exports = { uploadFilesAWS, getFileStrim, getUrl, deleteFile }