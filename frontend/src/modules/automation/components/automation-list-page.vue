<template>
  <div>
    <div
      v-if="loading('table') && count === 0"
      v-loading="loading('table')"
      class="app-page-spinner"
    ></div>
    <div v-else-if="count > 0">
      <div class="flex items-center justify-between mt-6">
        <div class="text-gray-600 text-sm">
          {{ count }} webhook{{ count === 1 ? '' : 's' }}
        </div>
        <div>
          <el-button
            class="btn btn--primary"
            @click="newAutomationModal = true"
          >
            <i class="ri-lg ri-add-line mr-1"></i>
            New webhook
          </el-button>
        </div>
      </div>
      <app-automation-list-table class="mt-6" />
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center pt-20 pb-10"
    >
      <img
        src="/images/automations-empty-state.svg"
        alt=""
        class="w-80"
      />
      <div class="text-xl font-medium mt-10">
        Start to automate manual tasks
      </div>
      <div class="text-gray-600 text-sm mt-6">
        Create webhook actions for when a new activity
        happens, or a new member joins your community
      </div>
      <el-button
        class="btn btn--primary mt-10"
        @click="newAutomationModal = true"
      >
        <i class="ri-lg ri-add-line mr-1"></i>
        New webhook
      </el-button>
    </div>
    <el-dialog
      v-model="newAutomationModal"
      title="New webhook"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      custom-class="el-dialog--lg"
      @close="newAutomationModal = false"
    >
      <app-webhook-form
        v-model="newAutomation"
        @success="handleSuccess"
        @cancel="newAutomationModal = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import AppAutomationListTable from './automation-list-table'
import AppWebhookForm from './webhooks/webhook-form'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppAutomationListPage',
  components: {
    AppAutomationListTable,
    AppWebhookForm
  },
  data() {
    return {
      newAutomation: {
        type: 'webhook',
        settings: {}
      },
      newAutomationModal: false
    }
  },
  computed: {
    ...mapGetters({
      loading: 'automation/loading',
      filter: 'automation/filter',
      count: 'automation/count'
    })
  },
  async created() {
    await this.doFetch({
      filter: { ...this.filter },
      rawFilter: { ...this.filter }
    })
  },
  methods: {
    ...mapActions({
      doFetch: 'automation/doFetch'
    }),
    handleSuccess() {
      this.newAutomation = {
        type: 'webhook',
        settings: {}
      }
      this.newAutomationModal = false
    }
  }
}
</script>
