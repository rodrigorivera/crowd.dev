<template>
  <div class="app-page-toolbar">
    <router-link
      v-if="record && hasPermissionToEdit"
      :to="{ path: `/user/${record.id}/edit` }"
    >
      <el-button class="btn btn--primary">
        <i class="ri-lg ri-pencil-line mr-1" />
        <app-i18n code="common.edit"></app-i18n>
      </el-button>
    </router-link>
  </div>
</template>

<script>
import { UserPermissions } from '@/premium/user/user-permissions'
import { AuditLogPermissions } from '@/modules/audit-log/audit-log-permissions'
import { mapGetters } from 'vuex'

export default {
  name: 'AppUserViewToolbar',

  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      currentTenant: 'auth/currentTenant',
      record: 'user/view/record',
      loading: 'user/view/loading'
    }),

    hasPermissionToEdit() {
      return new UserPermissions(
        this.currentTenant,
        this.currentUser
      ).edit
    },

    hasPermissionToAuditLogs() {
      return new AuditLogPermissions(
        this.currentTenant,
        this.currentUser
      ).read
    }
  }
}
</script>

<style></style>
