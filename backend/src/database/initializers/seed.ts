/**
 * This script is responsible for seeding
 * test data with single tenant, single user,
 * members and activities using activityService.createWithMember
 * tags, reports and widgets using service & repo functions
 */

import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import SequelizeTestUtils from '../utils/sequelizeTestUtils'
import ActivityService from '../../services/activityService'
import TagService from '../../services/tagService'
import MemberService from '../../services/communityMemberService'
import WidgetRepository from '../repositories/widgetRepository'
import ReportRepository from '../repositories/reportRepository'

const path = require('path')

const environmentArg = process.argv[2]

const envFile = environmentArg === 'dev' ? '.env' : `.env-${environmentArg}`

const env = dotenv.config({
  path: path.resolve(__dirname, `../../../${envFile}`),
})

dotenvExpand.expand(env)

const db = null

async function createSingleTenant() {
  const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

  const activities = require('./activities.json')

  const as = new ActivityService(mockIRepositoryOptions)
  const ts = new TagService(mockIRepositoryOptions)
  const ms = new MemberService(mockIRepositoryOptions)

  console.log('Starting seeding the db...')

  // create activities with members
  for (const activity of activities) {
    if (activity.communityMember.email !== null) {
      await as.createWithMember(activity)
    }
  }

  const memberReferenceArray = (await ms.findAndCountAll({})).rows

  const tags = require('./tags.json')

  // create tags with member associations
  for (const tag of tags) {
    tag.communityMembers = []
    // select 0-5 members to associate with created tag
    const selectXMembers = Math.floor(Math.random() * 5)

    for (let i = 0; i < selectXMembers; i++) {
      const memberIdx = Math.floor(Math.random() * memberReferenceArray.length)

      // check member already added, if yes we don't need to readd
      if (!(memberReferenceArray[memberIdx].id in tag.communityMembers)) {
        tag.communityMembers.push(memberReferenceArray[memberIdx].id)
      }
    }

    await ts.create(tag)
  }

  // create reports with widgets
  const reports = require('./reports.json')

  for (const report of reports) {
    // first create the widgets with empty reports
    const widgetsArray: any = []
    for (const widget of report.widgets) {
      widgetsArray.push(await WidgetRepository.create(widget, mockIRepositoryOptions))
    }

    report.widgets = widgetsArray.map((i) => i.id)

    // create report with widgets
    await ReportRepository.create(report, mockIRepositoryOptions)
  }

  // create widgets that don't have report relationship
  const widgets = require('./widgets.json')

  for (const widget of widgets) {
    await WidgetRepository.create(widget, mockIRepositoryOptions)
  }

  console.log('Database seeded')
  console.log('User email: ', mockIRepositoryOptions.currentUser.email)
  console.log('User password: 12345')
  console.log('Tenant id: ', mockIRepositoryOptions.currentTenant.id)
  console.log(
    '# of members added: ',
    await mockIRepositoryOptions.database.communityMember.count({
      tenantId: mockIRepositoryOptions.currentTenant.id,
    }),
  )
  console.log(
    '# of activities added:',
    await mockIRepositoryOptions.database.activity.count({
      tenantId: mockIRepositoryOptions.currentTenant.id,
    }),
  )
  console.log(
    '# of tags added:',
    await mockIRepositoryOptions.database.tag.count({
      tenantId: mockIRepositoryOptions.currentTenant.id,
    }),
  )
  console.log(
    '# of reports added:',
    await mockIRepositoryOptions.database.report.count({
      tenantId: mockIRepositoryOptions.currentTenant.id,
    }),
  )
  console.log(
    '# of widgets added:',
    await mockIRepositoryOptions.database.widget.count({
      tenantId: mockIRepositoryOptions.currentTenant.id,
    }),
  )
}

createSingleTenant()
