import Roles from './roles'
import Plans from './plans'
import Storage from './storage'

const storage = Storage.values
const roles = Roles.values
const plans = Plans.values

class Permissions {
  static get values() {
    return {
      tenantEdit: {
        id: 'tenantEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      tenantDestroy: {
        id: 'tenantDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      planEdit: {
        id: 'planEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      planRead: {
        id: 'planRead',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      userEdit: {
        id: 'userEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      userDestroy: {
        id: 'userDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      userCreate: {
        id: 'userCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      userImport: {
        id: 'userImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      userRead: {
        id: 'userRead',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      userAutocomplete: {
        id: 'userAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      auditLogRead: {
        id: 'auditLogRead',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      settingsRead: {
        id: 'settingsRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [storage.settingsBackgroundImages, storage.settingsLogos],
      },
      settingsEdit: {
        id: 'settingsEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [storage.settingsBackgroundImages, storage.settingsLogos],
      },
      communityMemberImport: {
        id: 'communityMemberImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      communityMemberCreate: {
        id: 'communityMemberCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      communityMemberEdit: {
        id: 'communityMemberEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      communityMemberDestroy: {
        id: 'communityMemberDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      communityMemberRead: {
        id: 'communityMemberRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      communityMemberAutocomplete: {
        id: 'communityMemberAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      activityImport: {
        id: 'activityImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      activityCreate: {
        id: 'activityCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      activityEdit: {
        id: 'activityEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      activityDestroy: {
        id: 'activityDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      activityRead: {
        id: 'activityRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      activityAutocomplete: {
        id: 'activityAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      automationCreate: {
        id: 'automationCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      automationUpdate: {
        id: 'automationUpdate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      automationDestroy: {
        id: 'automationDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      automationRead: {
        id: 'automationRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      tagImport: {
        id: 'tagImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      tagCreate: {
        id: 'tagCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      tagEdit: {
        id: 'tagEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      tagDestroy: {
        id: 'tagDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      tagRead: {
        id: 'tagRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      tagAutocomplete: {
        id: 'tagAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      widgetImport: {
        id: 'widgetImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      widgetCreate: {
        id: 'widgetCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      widgetEdit: {
        id: 'widgetEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      widgetDestroy: {
        id: 'widgetDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      widgetRead: {
        id: 'widgetRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      widgetAutocomplete: {
        id: 'widgetAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      reportImport: {
        id: 'reportImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      reportCreate: {
        id: 'reportCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      reportEdit: {
        id: 'reportEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      reportDestroy: {
        id: 'reportDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      reportRead: {
        id: 'reportRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      reportAutocomplete: {
        id: 'reportAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      integrationImport: {
        id: 'integrationImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      integrationControlLimit: {
        id: 'integrationControlLimit',
        allowedRoles: [],
        allowedPlans: [],
      },
      integrationCreate: {
        id: 'integrationCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      integrationEdit: {
        id: 'integrationEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      integrationDestroy: {
        id: 'integrationDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      integrationRead: {
        id: 'integrationRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      integrationAutocomplete: {
        id: 'integrationAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      microserviceImport: {
        id: 'microserviceImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      microserviceCreate: {
        id: 'microserviceCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      microserviceEdit: {
        id: 'microserviceEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      microserviceDestroy: {
        id: 'microserviceDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      microserviceRead: {
        id: 'microserviceRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      microserviceAutocomplete: {
        id: 'microserviceAutocomplete',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      microserviceVariantFree: {
        id: 'microserviceVariantFree',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      microserviceVariantPremium: {
        id: 'microserviceVariantPremium',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.beta, plans.premium, plans.enterprise],
      },
      conversationCreate: {
        id: 'conversationCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      conversationEdit: {
        id: 'conversationEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      conversationDestroy: {
        id: 'conversationDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
        allowedStorage: [],
      },
      conversationRead: {
        id: 'conversationRead',
        allowedRoles: [roles.admin, roles.readonly],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      eagleEyeContentRead: {
        id: 'eagleEyeContentRead',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      eagleEyeContentSearch: {
        id: 'eagleEyeContentSearch',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
      eagleEyeContentEdit: {
        id: 'eagleEyeContentEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.beta, plans.premium, plans.enterprise],
      },
    }
  }

  static get asArray() {
    return Object.keys(this.values).map((value) => this.values[value])
  }
}

export default Permissions
