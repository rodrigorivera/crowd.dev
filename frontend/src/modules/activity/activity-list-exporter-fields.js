import { ActivityModel } from '@/modules/activity/activity-model'

const { fields } = ActivityModel

export default [
  fields.id,
  fields.type,
  fields.timestamp,
  fields.platform,
  fields.info,
  fields.communityMember,
  fields.createdAt,
  fields.updatedAt
]
