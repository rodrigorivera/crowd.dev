import ConversationRepository from '../conversationRepository'
import ActivityRepository from '../activityRepository'
import CommunityMemberRepository from '../communityMemberRepository'
import SequelizeTestUtils from '../../utils/sequelizeTestUtils'
import Error404 from '../../../errors/Error404'
import { PlatformType } from '../../../utils/platforms'

const db = null

describe('ConversationRepository tests', () => {
  beforeEach(async () => {
    await SequelizeTestUtils.wipeDatabase(db)
  })

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    SequelizeTestUtils.closeConnection(db)
    done()
  })

  describe('create method', () => {
    it('Should create a conversation succesfully with default values', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversation2Add = { title: 'some-title', slug: 'some-slug' }

      const conversationCreated = await ConversationRepository.create(
        conversation2Add,
        mockIRepositoryOptions,
      )

      conversationCreated.createdAt = conversationCreated.createdAt.toISOString().split('T')[0]
      conversationCreated.updatedAt = conversationCreated.updatedAt.toISOString().split('T')[0]

      const conversationExpected = {
        id: conversationCreated.id,
        title: conversation2Add.title,
        slug: conversation2Add.slug,
        published: false,
        activities: [],
        activityCount: 0,
        channel: null,
        platform: null,
        lastActive: null,
        createdAt: SequelizeTestUtils.getNowWithoutTime(),
        updatedAt: SequelizeTestUtils.getNowWithoutTime(),
        tenantId: mockIRepositoryOptions.currentTenant.id,
        createdById: mockIRepositoryOptions.currentUser.id,
        updatedById: mockIRepositoryOptions.currentUser.id,
      }

      expect(conversationCreated).toStrictEqual(conversationExpected)
    })

    it('Should create a conversation succesfully with given values', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversation2Add = { title: 'some-title', slug: 'some-slug', published: true }

      const conversationCreated = await ConversationRepository.create(
        conversation2Add,
        mockIRepositoryOptions,
      )

      conversationCreated.createdAt = conversationCreated.createdAt.toISOString().split('T')[0]
      conversationCreated.updatedAt = conversationCreated.updatedAt.toISOString().split('T')[0]

      const conversationExpected = {
        id: conversationCreated.id,
        title: conversation2Add.title,
        slug: conversation2Add.slug,
        published: conversation2Add.published,
        activities: [],
        activityCount: 0,
        platform: null,
        channel: null,
        lastActive: null,
        createdAt: SequelizeTestUtils.getNowWithoutTime(),
        updatedAt: SequelizeTestUtils.getNowWithoutTime(),
        tenantId: mockIRepositoryOptions.currentTenant.id,
        createdById: mockIRepositoryOptions.currentUser.id,
        updatedById: mockIRepositoryOptions.currentUser.id,
      }

      expect(conversationCreated).toStrictEqual(conversationExpected)
    })

    it('Should throw unique constraint error when creating a conversation with already existing slug for the same tenant', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      await ConversationRepository.create(
        { title: 'some-title', slug: 'some-slug', published: true },
        mockIRepositoryOptions,
      )

      await expect(() =>
        ConversationRepository.create(
          { title: 'some-other-title', slug: 'some-slug' },
          mockIRepositoryOptions,
        ),
      ).rejects.toThrow()
    })

    it('Should throw not null constraint error if no slug is given', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      await expect(() =>
        ConversationRepository.create({ title: 'some-title' }, mockIRepositoryOptions),
      ).rejects.toThrow()
    })

    it('Should throw not null constraint error if no title is given', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      await expect(() =>
        ConversationRepository.create({ slug: 'some-slug' }, mockIRepositoryOptions),
      ).rejects.toThrow()
    })

    it('Should throw validation error if title is empty', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      await expect(() =>
        ConversationRepository.create({ title: '' }, mockIRepositoryOptions),
      ).rejects.toThrow()
    })

    it('Should throw validation error if slug is empty', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      await expect(() =>
        ConversationRepository.create({ slug: '' }, mockIRepositoryOptions),
      ).rejects.toThrow()
    })
  })

  describe('findById method', () => {
    it('Should successfully find created conversation by id', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversation2Add = { title: 'some-title', slug: 'some-slug' }

      const conversationCreated = await ConversationRepository.create(
        conversation2Add,
        mockIRepositoryOptions,
      )

      const conversationExpected = {
        id: conversationCreated.id,
        title: conversation2Add.title,
        slug: conversation2Add.slug,
        published: false,
        activities: [],
        activityCount: 0,
        platform: null,
        channel: null,
        lastActive: null,
        createdAt: SequelizeTestUtils.getNowWithoutTime(),
        updatedAt: SequelizeTestUtils.getNowWithoutTime(),
        tenantId: mockIRepositoryOptions.currentTenant.id,
        createdById: mockIRepositoryOptions.currentUser.id,
        updatedById: mockIRepositoryOptions.currentUser.id,
      }

      const conversationById = await ConversationRepository.findById(
        conversationCreated.id,
        mockIRepositoryOptions,
      )

      conversationById.createdAt = conversationById.createdAt.toISOString().split('T')[0]
      conversationById.updatedAt = conversationById.updatedAt.toISOString().split('T')[0]

      expect(conversationById).toStrictEqual(conversationExpected)
    })

    it('Should throw 404 error when no conversation found with given id', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)
      const { randomUUID } = require('crypto')

      await expect(() =>
        ConversationRepository.findById(randomUUID(), mockIRepositoryOptions),
      ).rejects.toThrowError(new Error404())
    })
  })

  describe('filterIdsInTenant method', () => {
    it('Should return the given ids of previously created conversation entities', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversation1Created = await ConversationRepository.create(
        { title: 'some-title-1', slug: 'some-slug-1' },
        mockIRepositoryOptions,
      )
      const conversation2Created = await ConversationRepository.create(
        { title: 'some-title-2', slug: 'some-slug-2' },
        mockIRepositoryOptions,
      )

      const filterIdsReturned = await ConversationRepository.filterIdsInTenant(
        [conversation1Created.id, conversation2Created.id],
        mockIRepositoryOptions,
      )

      expect(filterIdsReturned).toStrictEqual([conversation1Created.id, conversation2Created.id])
    })

    it('Should only return the ids of previously created conversations and filter random uuids out', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversationCreated = await ConversationRepository.create(
        { title: 'some-title-1', slug: 'some-slug-1' },
        mockIRepositoryOptions,
      )

      const { randomUUID } = require('crypto')

      const filterIdsReturned = await ConversationRepository.filterIdsInTenant(
        [conversationCreated.id, randomUUID(), randomUUID()],
        mockIRepositoryOptions,
      )

      expect(filterIdsReturned).toStrictEqual([conversationCreated.id])
    })

    it('Should return an empty array for an irrelevant tenant', async () => {
      let mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversationCreated = await ConversationRepository.create(
        { title: 'some-title-1', slug: 'some-slug-1' },
        mockIRepositoryOptions,
      )

      // create a new tenant and bind options to it
      mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const filterIdsReturned = await ConversationRepository.filterIdsInTenant(
        [conversationCreated.id],
        mockIRepositoryOptions,
      )

      expect(filterIdsReturned).toStrictEqual([])
    })
  })

  describe('findAndCountAll method', () => {
    it('Should find and count all conversations, with various filters', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const memberCreated = await CommunityMemberRepository.create(
        {
          username: {
            crowdUsername: 'test',
            github: 'test',
          },
          platform: PlatformType.GITHUB,
          joinedAt: '2020-05-27T15:13:30Z',
        },
        mockIRepositoryOptions,
      )

      let conversation1Created = await ConversationRepository.create(
        { title: 'a cool title', slug: 'a-cool-title' },
        mockIRepositoryOptions,
      )

      const activity1Created = await ActivityRepository.create(
        {
          type: 'activity',
          timestamp: '2020-05-27T14:13:30Z',
          platform: PlatformType.GITHUB,
          crowdInfo: {
            replies: 12,
            body: 'Some Parent Activity',
            repo: 'https://github.com/CrowdDevHQ/crowd-web',
          },
          isKeyAction: true,
          communityMember: memberCreated.id,
          conversationId: conversation1Created.id,
          score: 1,
          sourceId: '#sourceId1',
        },
        mockIRepositoryOptions,
      )

      await ActivityRepository.create(
        {
          type: 'activity',
          timestamp: '2020-05-28T15:13:30Z',
          platform: PlatformType.GITHUB,
          crowdInfo: {
            replies: 12,
            body: 'Here',
            repo: 'https://github.com/CrowdDevHQ/crowd-web',
          },
          isKeyAction: true,
          communityMember: memberCreated.id,
          score: 1,
          parent: activity1Created.id,
          conversationId: conversation1Created.id,
          sourceId: '#sourceId2',
        },
        mockIRepositoryOptions,
      )

      await ActivityRepository.create(
        {
          type: 'activity',
          timestamp: '2020-05-29T16:13:30Z',
          platform: PlatformType.GITHUB,
          crowdInfo: {
            replies: 12,
            body: 'Here',
            repo: 'https://github.com/CrowdDevHQ/crowd-web',
          },
          isKeyAction: true,
          communityMember: memberCreated.id,
          score: 1,
          parent: activity1Created.id,
          conversationId: conversation1Created.id,
          sourceId: '#sourceId3',
        },
        mockIRepositoryOptions,
      )

      let conversation2Created = await ConversationRepository.create(
        { title: 'a cool title', slug: 'a-cool-title-2' },
        mockIRepositoryOptions,
      )

      await ActivityRepository.create(
        {
          type: 'message',
          timestamp: '2020-06-02T15:13:30Z',
          platform: PlatformType.DISCORD,
          crowdInfo: {
            url: 'https://parent-id-url.com',
            body: 'conversation activity 1',
            channel: 'Some-Channel',
          },
          isKeyAction: true,
          communityMember: memberCreated.id,
          score: 1,
          conversationId: conversation2Created.id,
          sourceId: '#sourceId4',
        },
        mockIRepositoryOptions,
      )

      await ActivityRepository.create(
        {
          type: 'message',
          timestamp: '2020-06-03T15:13:30Z',
          platform: PlatformType.DISCORD,
          crowdInfo: {
            body: 'conversation activity 2',
            channel: 'Some-Channel',
          },
          isKeyAction: true,
          communityMember: memberCreated.id,
          score: 1,
          conversationId: conversation2Created.id,
          sourceId: '#sourceId5',
        },
        mockIRepositoryOptions,
      )
      let conversation3Created = await ConversationRepository.create(
        { title: 'some other title', slug: 'some-other-title', published: true },
        mockIRepositoryOptions,
      )

      await ActivityRepository.create(
        {
          type: 'message',
          timestamp: '2020-06-05T15:13:30Z',
          platform: PlatformType.SLACK,
          crowdInfo: {
            url: 'https://parent-id-url.com',
            body: 'conversation activity 1',
            channel: 'Some-Channel',
          },
          isKeyAction: true,
          communityMember: memberCreated.id,
          score: 1,
          conversationId: conversation3Created.id,
          sourceId: '#sourceId6',
        },
        mockIRepositoryOptions,
      )

      // activities are not included in findandcountall
      conversation1Created = SequelizeTestUtils.objectWithoutKey(
        await ConversationRepository.findById(conversation1Created.id, mockIRepositoryOptions),
        'activities',
      )
      conversation2Created = SequelizeTestUtils.objectWithoutKey(
        await ConversationRepository.findById(conversation2Created.id, mockIRepositoryOptions),
        'activities',
      )
      conversation3Created = SequelizeTestUtils.objectWithoutKey(
        await ConversationRepository.findById(conversation3Created.id, mockIRepositoryOptions),
        'activities',
      )

      // filter by id
      let conversations = await ConversationRepository.findAndCountAll(
        { filter: { id: conversation1Created.id } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(1)
      expect(conversations.rows).toStrictEqual([conversation1Created])

      // filter by title
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { title: 'a cool title' } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(2)
      expect(conversations.rows).toStrictEqual([conversation2Created, conversation1Created])

      // filter by slug
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { slug: 'a-cool-title-2' } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(1)
      expect(conversations.rows).toStrictEqual([conversation2Created])

      // filter by published
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { published: true } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(1)
      expect(conversations.rows).toStrictEqual([conversation3Created])

      // filter by activityCount only start input
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { activityCountRange: [2] } },
        mockIRepositoryOptions,
      )
      expect(conversations.count).toEqual(2)
      expect(conversations.rows).toStrictEqual([conversation2Created, conversation1Created])

      // filter by activityCount start and end inputs
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { activityCountRange: [0, 1] } },
        mockIRepositoryOptions,
      )
      expect(conversations.count).toEqual(1)
      expect(conversations.rows).toStrictEqual([conversation3Created])

      // filter by platform
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { platform: PlatformType.DISCORD } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(1)
      expect(conversations.rows).toStrictEqual([conversation2Created])

      // filter by channel (channel)
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { channel: 'Some-Channel' } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(2)
      expect(conversations.rows).toStrictEqual([conversation3Created, conversation2Created])

      // filter by channel (repo)
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { channel: 'CrowdDevHQ/crowd-web' } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(1)
      expect(conversations.rows).toStrictEqual([conversation1Created])

      // filter by lastActive only start
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { lastActiveRange: ['2020-06-03T15:13:30Z'] } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(2)
      expect(conversations.rows).toStrictEqual([conversation3Created, conversation2Created])

      // filter by lastActive start and end
      conversations = await ConversationRepository.findAndCountAll(
        { filter: { lastActiveRange: ['2020-06-03T15:13:30Z', '2020-06-04T15:13:30Z'] } },
        mockIRepositoryOptions,
      )

      expect(conversations.count).toEqual(1)
      expect(conversations.rows).toStrictEqual([conversation2Created])
    })
  })

  describe('update method', () => {
    it('Should succesfully update previously created conversation', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversationCreated = await ConversationRepository.create(
        { title: 'a cool title', slug: 'a-cool-title' },
        mockIRepositoryOptions,
      )

      const conversationUpdated = await ConversationRepository.update(
        conversationCreated.id,
        {
          published: true,
          slug: 'some-other-slug',
        },
        mockIRepositoryOptions,
      )

      expect(conversationUpdated.updatedAt.getTime()).toBeGreaterThan(
        conversationUpdated.createdAt.getTime(),
      )

      const conversationExpected = {
        id: conversationCreated.id,
        title: conversationCreated.title,
        slug: conversationUpdated.slug,
        published: conversationUpdated.published,
        activities: [],
        activityCount: 0,
        channel: null,
        lastActive: null,
        platform: null,
        createdAt: conversationCreated.createdAt,
        updatedAt: conversationUpdated.updatedAt,
        tenantId: mockIRepositoryOptions.currentTenant.id,
        createdById: mockIRepositoryOptions.currentUser.id,
        updatedById: mockIRepositoryOptions.currentUser.id,
      }

      expect(conversationUpdated).toStrictEqual(conversationExpected)
    })
    it('Should throw 404 error when trying to update non existent conversation', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const { randomUUID } = require('crypto')

      await expect(() =>
        ConversationRepository.update(randomUUID(), { slug: 'some-slug' }, mockIRepositoryOptions),
      ).rejects.toThrowError(new Error404())
    })
  })

  describe('destroy method', () => {
    it('Should succesfully destroy previously created conversation', async () => {
      const mockIRepositoryOptions = await SequelizeTestUtils.getTestIRepositoryOptions(db)

      const conversationCreated = await ConversationRepository.create(
        { title: 'a cool title', slug: 'a-cool-title' },
        mockIRepositoryOptions,
      )

      await ConversationRepository.destroy(conversationCreated.id, mockIRepositoryOptions)

      // Try selecting it after destroy, should throw 404
      await expect(() =>
        ConversationRepository.findById(conversationCreated.id, mockIRepositoryOptions),
      ).rejects.toThrowError(new Error404())
    })
  })
})
