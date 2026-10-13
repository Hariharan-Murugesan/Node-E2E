import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CONSTANT_MSG } from '../config/constant_messages.js';
import { v4 as uuidv4 } from 'uuid';
import { readS3File, fileUpload } from '../validator/validation.js';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const uploadToS3 = async (params) => {
    const result = await s3.send(new PutObjectCommand(params));
    return { ...result, Key: params.Key };
};

export async function multiFileUpload(req, res) {
    try {
        await fileUpload.validateAsync(req.query);

        if (!req.files?.length) {
            return res.status(400).send({
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: 'Provide any files'
            });
        }

        const folder = req.query.isConfidential === 'true'
            ? 'rs-files'
            : 'user-uploads';

        const arrayOfFile = [];

        for (const file of req.files) {
            const id = uuidv4();
            const key = `${folder}/${id}_${file.originalname.replace(/[^a-zA-Z-()/0-9.]/g, '')}`;

            await uploadToS3({
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                Body: file.buffer
            });

            arrayOfFile.push(key);
        }

        return res.status(200).send({
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: 'Uploaded successfully',
            data: arrayOfFile
        });
    } catch (error) {
        console.error(error);

        return res.status(500).send({
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        });
    }
}

export async function singleFileUpload(req, res) {
    try {
        await fileUpload.validateAsync(req.query);

        if (!req.file) {
            return res.status(400).send({
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: 'Provide a file'
            });
        }

        const folder = req.query.isConfidential === 'true'
            ? 'rs-files'
            : 'user-uploads';

        const id = uuidv4();
        const key = `${folder}/${id}_${req.file.originalname.replace(/[^a-zA-Z-()/0-9.]/g, '')}`;

        await uploadToS3({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: req.file.buffer
        });

        return res.status(200).send({
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: 'Uploaded successfully',
            data: key
        });
    } catch (error) {
        console.error(error);

        return res.status(500).send({
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        });
    }
}

export async function readS3Files(req, res) {
    try {
        await readS3File.validateAsync(req.query);

        const url = await getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: req.query.key
            }),
            { expiresIn: 600 }
        );

        return res.status(200).send({
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: 'File URL generated successfully',
            data: url
        });
    } catch (error) {
        console.error(error);

        return res.status(500).send({
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        });
    }
}

export async function productUpload(req, format) {
    const key = `user-uploads/${uuidv4()}${format}`;

    try {
        await uploadToS3({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: req
        });

        return key;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function pdfFileUpload(req, res) {
    try {
        const key = `user-uploads/${uuidv4()}_invoice.pdf`;

        return await uploadToS3({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: req.file.buffer
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function productTemplate(req, res) {
    try {
        const key = `user-uploads/${uuidv4()}_template.xlsx`;

        return await uploadToS3({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: req.file.buffer
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function downloadBulkUploadFile(fileUrl, res) {
    try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Download failed: HTTP ${response.status}`);
        }

        return Buffer.from(await response.arrayBuffer());
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function readS3FileBuffer(s3Key) {
    try {
        const response = await s3.send(
            new GetObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: s3Key
            })
        );

        const buffer = Buffer.from(await response.Body.transformToByteArray());

        return {
            ...response,
            Body: buffer
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}