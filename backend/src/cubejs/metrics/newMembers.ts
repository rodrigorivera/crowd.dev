import CubeJsService from '../../services/cubejs/cubeJsService'
import CubeDimensions from '../../services/cubejs/cubeDimensions'
import CubeMeasures from '../../services/cubejs/cubeMeasures'

/**
 * Gets `new members` count for a given date range.
 * Members are new when member.joinedAt is in between given date range.
 * @param cjs cubejs service instance
 * @param startDate
 * @param endDate
 * @returns
 */
export default async (cjs: CubeJsService, startDate: moment.Moment, endDate: moment.Moment) => {
  const newMembers =
    (
      await cjs.load({
        measures: [CubeMeasures.MEMBER_COUNT],
        timeDimensions: [
          {
            dimension: CubeDimensions.MEMBER_JOINED_AT,
            dateRange: [startDate.toISOString(), endDate.toISOString()],
          },
        ],
        limit: 1,
        order: { [CubeDimensions.MEMBER_JOINED_AT]: 'asc' },
      })
    )[0][CubeMeasures.MEMBER_COUNT] ?? 0

  return newMembers
}
