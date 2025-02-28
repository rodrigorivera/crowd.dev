<template>
  <div></div>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
      <i class="text-xl ri-more-line"></i>
    </span>
    <template #dropdown>
      <el-dropdown-item
        :command="{
          action: 'automationExecutions',
          automation: automation
        }"
        ><i class="ri-history-line mr-1" />View
        Executions</el-dropdown-item
      >
      <el-dropdown-item
        v-if="!isReadOnly"
        :command="{
          action: 'automationEdit',
          automation: automation
        }"
        ><i class="ri-pencil-line mr-1" />Edit
        Automation</el-dropdown-item
      >
      <el-dropdown-item
        v-if="!isReadOnly"
        :command="{
          action: 'automationDelete',
          automation: automation
        }"
        ><i class="ri-delete-bin-line mr-1" />Delete
        Automation</el-dropdown-item
      >
    </template>
  </el-dropdown>
  <app-teleport to="#teleport-modal">
    <el-dialog
      v-if="editModal"
      v-model="editModal"
      :close-on-click-modal="false"
      title="Edit webhook"
      :append-to-body="true"
      :destroy-on-close="true"
      custom-class="el-dialog--lg"
      @close="editModal = false"
    >
      <app-webhook-form
        v-model="model"
        @cancel="editModal = false"
      >
      </app-webhook-form>
    </el-dialog>
    <el-drawer
      v-model="executionsDrawer"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      title="Webhook executions"
      custom-class="webhook-executions-drawer"
    >
      <app-webhook-execution-list :webhook="automation" />
    </el-drawer>
  </app-teleport>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { AutomationPermissions } from '@/modules/automation/automation-permissions'
import AppWebhookForm from './webhooks/webhook-form'
import AppWebhookExecutionList from './webhooks/webhook-execution-list'
import { i18n } from '@/i18n'

export default {
  name: 'AppAutomationDropdown',
  components: {
    'app-webhook-form': AppWebhookForm,
    'app-webhook-execution-list': AppWebhookExecutionList
  },
  props: {
    automation: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      model: { ...this.automation },
      editModal: false,
      executionsDrawer: false
    }
  },
  computed: {
    ...mapGetters({
      currentTenant: 'auth/currentTenant',
      currentUser: 'auth/currentUser'
    }),
    isReadOnly() {
      return (
        new AutomationPermissions(
          this.currentTenant,
          this.currentUser
        ).edit === false
      )
    }
  },
  methods: {
    ...mapActions({
      doDestroy: 'automation/doDestroy'
    }),
    async doDestroyWithConfirm(id) {
      try {
        await this.$myConfirm(
          i18n('common.areYouSure'),
          i18n('common.confirm'),
          {
            confirmButtonText: i18n('common.yes'),
            cancelButtonText: i18n('common.no'),
            type: 'warning'
          }
        )

        return this.doDestroy(id)
      } catch (error) {
        // no
      }
    },
    async handleCommand(command) {
      if (command.action === 'automationDelete') {
        return this.doDestroyWithConfirm(
          command.automation.id
        )
      } else if (command.action === 'automationEdit') {
        this.editModal = true
      } else if (
        command.action === 'automationExecutions'
      ) {
        document.querySelector('body').click()
        this.executionsDrawer = true
      }
    }
  }
}
</script>
