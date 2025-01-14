import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const activity = sequelize.define(
    'activity',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      platform: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      info: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      crowdInfo: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      isKeyAction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
      },
      sourceId: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      sourceParentId: {
        type: DataTypes.STRING(255),
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['importHash', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
        {
          fields: ['platform', 'tenantId', 'type', 'timestamp'],
          where: {
            deletedAt: null,
          },
        },
        {
          unique: false,
          fields: ['timestamp', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
        {
          fields: ['sourceId', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
        {
          unique: false,
          fields: ['communityMemberId', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
        {
          unique: false,
          fields: ['sourceParentId', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
        {
          unique: false,
          fields: ['deletedAt'],
        },
        {
          unique: false,
          fields: ['parentId', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
        {
          unique: false,
          fields: ['conversationId', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
      ],
      timestamps: true,
      paranoid: true,
    },
  )

  activity.associate = (models) => {
    models.activity.belongsTo(models.communityMember, {
      as: 'communityMember',
      onDelete: 'cascade',
      foreignKey: {
        allowNull: false,
      },
    })

    models.activity.belongsTo(models.conversation, {
      as: 'conversation',
    })

    models.activity.belongsTo(models.activity, {
      as: 'parent',
      // constraints: false,
    })

    models.activity.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    })

    models.activity.belongsTo(models.user, {
      as: 'createdBy',
    })

    models.activity.belongsTo(models.user, {
      as: 'updatedBy',
    })
  }

  return activity
}
