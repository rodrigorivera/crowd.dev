import moment from 'moment'
import { IServiceOptions } from './IServiceOptions'
import ActivityService from './activityService'
import CommunityMemberService from './communityMemberService'
import TenantService from './tenantService'

export default class SampleDataService {
  options: IServiceOptions

  constructor(options) {
    this.options = options
  }

  /**
   * Generates sample data from a json file for currentTenant
   * For imported sample activities and members crowdInfo.sample is set to true
   * Sets currentTenant.hasSampleData to true
   * @param sampleMembersActivities members array included from json by require(json)
   *
   */
  async generateSampleData(sampleMembersActivities): Promise<void> {
    const activityService = new ActivityService(this.options)
    const tenantService = new TenantService(this.options)

    // we update this field first because api runs this endpoint asynchronously
    // and frontend expects it to be true after 2 seconds
    await tenantService.update(this.options.currentTenant.id, {
      hasSampleData: true,
    })

    // 2022-03-16 is the most recent activity date in sample-data.json
    // When importing, we pad that value in days so that most recent activity.timestamp = now()
    const timestampPaddingInDays = moment().utc().diff(moment('2022-03-16').utc(), 'days') - 1

    // create activities with members
    for (const member of sampleMembersActivities) {
      const { activities: _, ...memberPlain } = member

      memberPlain.crowdInfo.sample = true

      for (const activity of member.activities) {
        activity.communityMember = memberPlain
        activity.crowdInfo.sample = true

        // modify activity timestamp
        activity.timestamp = moment(activity.timestamp)
          .utc()
          .add(timestampPaddingInDays, 'days')
          .toDate()

        await activityService.createWithMember(activity)
      }
    }

    console.log(`Sample data for tenant ${this.options.currentTenant.id} created succesfully.`)
  }

  /**
   * Deletes sample data
   * Sample data is defined for all members and activities where crowdInfo.sample = true
   * Sets currentTenant.hasSampleData to false
   */
  async deleteSampleData(): Promise<void> {
    // deleting sample members should cascade to their activities as well
    const memberService = new CommunityMemberService(this.options)
    const tenantService = new TenantService(this.options)

    const memberIds = await (
      await memberService.findAndCountAll({
        filter: { crowdInfo: { sample: true } },
      })
    ).rows.reduce((acc, item) => {
      acc.push(item.id)
      return acc
    }, [])

    await memberService.destroyBulk(memberIds)

    await tenantService.update(this.options.currentTenant.id, {
      hasSampleData: false,
    })

    console.log(`Sample data for tenant ${this.options.currentTenant.id} deleted succesfully.`)
  }
}
