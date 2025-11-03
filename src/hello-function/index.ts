import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import * as responseUtil from '../util/responseUtil';

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
  console.log(event);
  const TABLE_NAME = 'HelloTable'

  const client = new DynamoDBClient({});

  try {
    const cmd = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: 'hello' }
      },
    });

    const res = await client.send(cmd);
    const message = res.Item && res.Item.message && res.Item.message.S
      ? res.Item.message.S
      : 'Hello (default)';
    return responseUtil.success({ message });
  } catch (err) {
    console.error('dynamo error', err);
    return responseUtil.error('Internal Server Error');
  }
};
