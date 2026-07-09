import {
    DynamoDBClient
} from "@aws-sdk/client-dynamodb";

import {
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand
} from "@aws-sdk/lib-dynamodb";

import { randomUUID } from "crypto";

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async () => {

    try {

        // Current server timestamp
        const timestamp = Date.now();

        // Generate unique Fan ID
        const fanId = randomUUID();

        // Generate random token
        const randomToken = Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase();

        /*
            Demo Queue Position
            In production this should come from an atomic counter
        */

        const scanResult = await docClient.send(
            new ScanCommand({
                TableName: TABLE_NAME,
                Select: "COUNT"
            })
        );

        const queuePosition = (scanResult.Count ?? 0) + 1;

        const item = {

            fanId,

            queuePosition,

            entryTimestamp: timestamp,

            status: "WAITING",

            batchId: 0,

            randomToken,

            estimatedWait: "Calculating..."

        };

        await docClient.send(

            new PutCommand({

                TableName: TABLE_NAME,

                Item: item

            })

        );

        return {

            statusCode: 200,

            body: JSON.stringify({

                message: "Successfully joined queue.",

                fanId,

                queuePosition,

                status: "WAITING"

            })

        };

    } catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            body: JSON.stringify({

                message: "Failed to join queue."

            })

        };

    }

};
