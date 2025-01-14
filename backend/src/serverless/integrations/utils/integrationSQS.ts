import { BaseOutput } from '../types/iteratorTypes'
import { IntegrationsMessage } from '../types/messageTypes'
import { sqs } from '../../../services/aws'

/**
 * Send a message to the integrations queue
 * @param body The message body
 * @returns Success or error codes
 */
async function sendIntegrationsMessage(
  body: IntegrationsMessage,
  queueUrl: string | undefined = '',
): Promise<BaseOutput> {
  const statusCode: number = 200

  console.log('SQS Message body: ', body)

  queueUrl = queueUrl || process.env.INTEGRATIONS_SQS_URL

  await sqs
    .sendMessage({
      QueueUrl: queueUrl,
      MessageGroupId: `${body.integration}-${body.tenant}`,
      MessageBody: JSON.stringify(body),
    })
    .promise()

  const message = 'Message accepted!'

  return {
    status: statusCode,
    msg: JSON.stringify({
      message,
    }),
  }
}

export default sendIntegrationsMessage
