import lodash from 'lodash'
import Sequelize from 'sequelize'
import SequelizeRepository from './sequelizeRepository'
import AuditLogRepository from './auditLogRepository'
import SequelizeFilterUtils from '../utils/sequelizeFilterUtils'
import Error404 from '../../errors/Error404'
import { IRepositoryOptions } from './IRepositoryOptions'

const { Op } = Sequelize

class ReportRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(options)

    const tenant = SequelizeRepository.getCurrentTenant(options)

    const transaction = SequelizeRepository.getTransaction(options)

    const record = await options.database.report.create(
      {
        ...lodash.pick(data, ['name', 'public', 'importHash']),

        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await record.setWidgets(data.widgets || [], {
      transaction,
    })

    await this._createAuditLog(AuditLogRepository.CREATE, record, data, options)

    return this.findById(record.id, options)
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(options)

    const transaction = SequelizeRepository.getTransaction(options)

    const currentTenant = SequelizeRepository.getCurrentTenant(options)

    let record = await options.database.report.findOne({
      where: {
        id,
        tenantId: currentTenant.id,
      },
      transaction,
    })

    if (!record) {
      throw new Error404()
    }

    record = await record.update(
      {
        ...lodash.pick(data, ['name', 'public', 'importHash']),

        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await record.setWidgets(data.widgets || [], {
      transaction,
    })

    await this._createAuditLog(AuditLogRepository.UPDATE, record, data, options)

    return this.findById(record.id, options)
  }

  static async destroy(id, options: IRepositoryOptions, force = false) {
    const transaction = SequelizeRepository.getTransaction(options)

    const currentTenant = SequelizeRepository.getCurrentTenant(options)

    const record = await options.database.report.findOne({
      where: {
        id,
        tenantId: currentTenant.id,
      },
      transaction,
    })

    if (!record) {
      throw new Error404()
    }

    await record.destroy({
      transaction,
      force,
    })

    await this._createAuditLog(AuditLogRepository.DELETE, record, record, options)
  }

  static async findById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(options)

    const include = []

    const currentTenant = SequelizeRepository.getCurrentTenant(options)

    const record = await options.database.report.findOne({
      where: {
        id,
        tenantId: currentTenant.id,
      },
      include,
      transaction,
    })

    if (!record) {
      throw new Error404()
    }

    return this._populateRelations(record, options)
  }

  static async filterIdInTenant(id, options: IRepositoryOptions) {
    return lodash.get(await this.filterIdsInTenant([id], options), '[0]', null)
  }

  static async filterIdsInTenant(ids, options: IRepositoryOptions) {
    if (!ids || !ids.length) {
      return []
    }

    const currentTenant = SequelizeRepository.getCurrentTenant(options)

    const where = {
      id: {
        [Op.in]: ids,
      },
      tenantId: currentTenant.id,
    }

    const records = await options.database.report.findAll({
      attributes: ['id'],
      where,
    })

    return records.map((record) => record.id)
  }

  static async count(filter, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(options)

    const tenant = SequelizeRepository.getCurrentTenant(options)

    return options.database.report.count({
      where: {
        ...filter,
        tenantId: tenant.id,
      },
      transaction,
    })
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const tenant = SequelizeRepository.getCurrentTenant(options)

    const whereAnd: Array<any> = []
    const include = []

    whereAnd.push({
      tenantId: tenant.id,
    })

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          id: SequelizeFilterUtils.uuid(filter.id),
        })
      }

      if (filter.name) {
        whereAnd.push(SequelizeFilterUtils.ilikeIncludes('report', 'name', filter.name))
      }

      if (filter.public !== undefined) {
        whereAnd.push({
          public: filter.public,
        })
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            createdAt: {
              [Op.gte]: start,
            },
          })
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            createdAt: {
              [Op.lte]: end,
            },
          })
        }
      }
    }

    const where = { [Op.and]: whereAnd }

    let {
      rows,
      count, // eslint-disable-line prefer-const
    } = await options.database.report.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy ? [orderBy.split('_')] : [['createdAt', 'DESC']],
      transaction: SequelizeRepository.getTransaction(options),
    })

    rows = await this._populateRelationsForRows(rows, options)

    return { rows, count }
  }

  static async findAllAutocomplete(query, limit, options: IRepositoryOptions) {
    const tenant = SequelizeRepository.getCurrentTenant(options)

    const whereAnd: Array<any> = [
      {
        tenantId: tenant.id,
      },
    ]

    if (query) {
      whereAnd.push({
        [Op.or]: [{ id: SequelizeFilterUtils.uuid(query) }],
      })
    }

    const where = { [Op.and]: whereAnd }

    const records = await options.database.report.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      order: [['id', 'ASC']],
    })

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }))
  }

  static async _createAuditLog(action, record, data, options: IRepositoryOptions) {
    let values = {}

    if (data) {
      values = {
        ...record.get({ plain: true }),
        widgetsIds: data.widgets,
      }
    }

    await AuditLogRepository.log(
      {
        entityName: 'report',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  static async _populateRelationsForRows(rows, options: IRepositoryOptions) {
    if (!rows) {
      return rows
    }

    return Promise.all(rows.map((record) => this._populateRelations(record, options)))
  }

  static async _populateRelations(record, options: IRepositoryOptions) {
    if (!record) {
      return record
    }

    const output = record.get({ plain: true })

    const transaction = SequelizeRepository.getTransaction(options)

    output.widgets = await record.getWidgets({
      transaction,
    })

    return output
  }
}

export default ReportRepository
