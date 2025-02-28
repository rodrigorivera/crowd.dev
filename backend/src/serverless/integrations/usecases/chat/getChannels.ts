import { SuperfaceClient } from '@superfaceai/one-sdk'
import { Channel, Channels } from '../../types/regularTypes'
import isInvalid from '../isInvalid'
import BaseIterator from '../../iterators/baseIterator'

/**
 * Try if a channel is readable
 * @param accessToken Discord bot token
 * @param channel Channel ID
 * @returns Limit if the channel is readable, false otherwise
 */
async function tryChannel(
  client: SuperfaceClient,
  source: string,
  accessToken: string,
  channel: Channel,
): Promise<any> {
  try {
    const input = {
      destination: channel.id,
      limit: 1,
    }
    const profile = await client.getProfile('chat/messages')
    const provider = await client.getProvider(source)
    const result: any = await profile.getUseCase('GetMessages').perform(input, {
      provider,
      parameters: { accessToken },
    })

    if (result.value) {
      if ('rateLimit' in result.value) {
        return result.value.rateLimit.remainingRequests
      }
      return 10
    }
    return false
  } catch (err) {
    return false
  }
}

async function getChannels(
  client: SuperfaceClient,
  source: string,
  input: any,
  accessToken: string,
  tryChannels = true,
) {
  const profile = await client.getProfile('chat/channels')
  const provider = await client.getProvider(source)
  const parameters = { accessToken }
  const result: any = await profile
    .getUseCase('GetChannels')
    .perform(input, { provider, parameters })
  if (isInvalid(result, 'channels')) {
    console.log('Invalid request in getChannels')
    console.log('Inputs: ', input)
    console.log('Result: ', result)
  }
  if (tryChannels) {
    const out: Channels = []
    for (const channel of result.value.channels) {
      const limit = await tryChannel(client, source, accessToken, channel)
      if (limit) {
        const toOut: Channel = {
          name: channel.name,
          id: channel.id,
        }
        out.push(toOut)
        if (limit <= 1 && limit !== false) {
          await BaseIterator.sleep(5)
        }
      }
    }
    return out
  }

  return result.value.channels.map((c) => ({
    name: c.name,
    id: c.id,
  }))
}

export default getChannels

// getDestinations('877903817948147752', 'ODc3OTEwNjM0MzA4NzA2MzI0.YR5f_g.TrYuoK2yWA5-LpPlDQ0Nlzc8dOE')
