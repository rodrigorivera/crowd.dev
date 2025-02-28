/**
 * This script is responsible for generating non
 * existing parentIds for historical discord activities
 */

import fetch from 'node-fetch'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import TenantService from '../../services/tenantService'
import ActivityService from '../../services/activityService'
import IntegrationService from '../../services/integrationService'
import { getConfig } from '../../config'
import getUserContext from '../utils/getUserContext'
import { PlatformType } from '../../utils/platforms'

const path = require('path')

const env = dotenv.config({
  path: path.resolve(__dirname, `../../../.env.staging`),
})

dotenvExpand.expand(env)

async function discordSetParentForThreads() {
  const tenants = await TenantService._findAndCountAllForEveryUser({})

  tenants.rows = tenants.rows.filter((i) => i.id === 'b044af41-657a-4925-9541-cf8dfbdc687b')

  // for each tenant
  for (const t of tenants.rows) {
    const tenantId = t.id
    // get user context
    const userContext = await getUserContext(tenantId)
    // get discord message activities
    const integrationService = new IntegrationService(userContext)

    const discordIntegration = (
      await integrationService.findAndCountAll({ filter: { platform: PlatformType.DISCORD } })
    ).rows[0]

    if (
      discordIntegration &&
      discordIntegration.settings.channels &&
      discordIntegration.settings.channels.length > 0
    ) {
      const actService = new ActivityService(userContext)

      const discordChannelMapping = []

      console.log('Discord integration: ')
      console.log(discordIntegration)

      for (const channel of discordIntegration.settings.channels) {
        discordChannelMapping[channel.name] = { id: channel.id, type: 'channel' }
      }

      // Logging channel mapping:
      console.log(discordChannelMapping)

      // Get thread starter activities
      const acts = (
        await actService.findAndCountAll({
          filter: { platform: PlatformType.DISCORD, type: 'message' },
          orderBy: 'timestamp_ASC',
        })
      ).rows

      for (const act of acts) {
        if (
          act.crowdInfo.sample !== 'true' &&
          act.crowdInfo.sample !== true &&
          !(act.crowdInfo.discord && act.crowdInfo.discord.sample === 'true') &&
          act.sourceId
        ) {
          if (act.crowdInfo.threadStarter === true) {
            // get thread activities
            let threadActivitiesFromApi = await getThreadMessages(act.sourceId)

            // check thread has more activities
            let moreActsFromApi = await getThreadMessages(
              act.sourceId,
              threadActivitiesFromApi[threadActivitiesFromApi.length - 1].id,
            )

            while (moreActsFromApi.length > 0) {
              console.log(
                `getting next 50 thread messages... anchor is: ${
                  moreActsFromApi[moreActsFromApi.length - 1].id
                }`,
              )
              await new Promise((resolve) => {
                setTimeout(resolve, 500)
              })
              threadActivitiesFromApi = threadActivitiesFromApi.concat(moreActsFromApi)
              moreActsFromApi = await getThreadMessages(
                act.sourceId,
                moreActsFromApi[moreActsFromApi.length - 1].id,
              )
            }

            for (const threadActivityFromApi of threadActivitiesFromApi) {
              const childSourceId = threadActivityFromApi.id
              const childCrowdActivityRowsAndCount = await actService.findAndCountAll({
                filter: { sourceId: childSourceId },
              })

              if (childCrowdActivityRowsAndCount.count === 1) {
                // update both child.crowdInfo and child.parent
                const childCrowdInfo = childCrowdActivityRowsAndCount.rows[0].crowdInfo
                childCrowdInfo.url = `https://discordapp.com/channels/${discordIntegration.integrationIdentifier}/${act.crowdInfo.sourceId}/${childCrowdActivityRowsAndCount.rows[0].sourceId}`
                await actService.update(childCrowdActivityRowsAndCount.rows[0].id, {
                  childCrowdInfo,
                  sourceParentId: act.sourceId,
                  parent: act.id,
                })
                console.log(
                  `child activity [${childCrowdActivityRowsAndCount.rows[0].id}] crowdInfo and parent updated!`,
                )
              } else {
                console.log(`thread child cannot be found in the db sourceId: ${childSourceId}`)
                console.log(`found count is: ${childCrowdActivityRowsAndCount.count}`)
              }
            }

            // update parent.crowdInfo if mapping exists
            if (
              discordChannelMapping[act.crowdInfo.channel] &&
              discordChannelMapping[act.crowdInfo.channel].id
            ) {
              const parentCrowdInfo = act.crowdInfo
              parentCrowdInfo.url = `https://discordapp.com/channels/${
                discordIntegration.integrationIdentifier
              }/${discordChannelMapping[act.crowdInfo.channel].id}/${act.sourceId}`
              await actService.update(act.id, { crowdInfo: parentCrowdInfo })
              console.log(`parent activity [${act.id}] crowdInfo updated!`)
            }
          } else if (act.crowdInfo.thread === false || act.crowdInfo.thread === 'false') {
            // not a thread starter and not a thread message
            if (
              discordChannelMapping[act.crowdInfo.channel] &&
              discordChannelMapping[act.crowdInfo.channel].id
            ) {
              const parentCrowdInfo = act.crowdInfo
              parentCrowdInfo.url = `https://discordapp.com/channels/${
                discordIntegration.integrationIdentifier
              }/${discordChannelMapping[act.crowdInfo.channel].id}/${act.sourceId}`
              await actService.update(act.id, { crowdInfo: parentCrowdInfo })
              console.log(`activity [${act.id}] crowdInfo updated!`)
            }
          }
        }
      }
    }
  }
}

async function getThreadMessages(threadId, before = null) {
  console.log(`getting messages of threadID: ${threadId}`)
  let url = `https://discord.com/api/v9/channels/${threadId}/messages`
  if (before) {
    url += `?before=${before}`
    console.log(`paginated url is: ${url}`)
  }

  return fetch(url, {
    headers: { Authorization: `Bot ${getConfig().DISCORD_TOKEN}` },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log('Found thread activities in api: ', res)
      return res
    })
}

discordSetParentForThreads()
