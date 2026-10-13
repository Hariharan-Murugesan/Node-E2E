import 'dotenv/config';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION
});

export const dynamoDB = DynamoDBDocumentClient.from(client);


import { randomUUID } from 'node:crypto';

import {
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand
} from '@aws-sdk/lib-dynamodb';

import { dynamoDB } from './dynamodb.js';

const TABLE_NAME = process.env.DYNAMODB_TABLE;

// CREATE
export async function createUser(name, email) {
    const user = {
        id: randomUUID(),
        name,
        email,
        createdAt: new Date().toISOString()
    };

    await dynamoDB.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: user,
            ConditionExpression: 'attribute_not_exists(id)'
        })
    );

    return user;
}

// READ ONE
export async function getUser(id) {
    const result = await dynamoDB.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: { id }
        })
    );

    return result.Item ?? null;
}

// UPDATE
export async function updateUser(id, name) {
    const result = await dynamoDB.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'SET #name = :name',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name
            },
            ConditionExpression: 'attribute_exists(id)',
            ReturnValues: 'ALL_NEW'
        })
    );

    return result.Attributes;
}

// DELETE
export async function deleteUser(id) {
    await dynamoDB.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id }
        })
    );

    return { message: 'User deleted successfully' };
}

// READ ALL (use Query for key-based access when possible)
export async function getAllUsers() {
    const result = await dynamoDB.send(
        new ScanCommand({
            TableName: TABLE_NAME
        })
    );

    return result.Items ?? [];
}