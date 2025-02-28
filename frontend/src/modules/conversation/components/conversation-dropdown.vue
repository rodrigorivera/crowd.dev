<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
      <i class="text-xl ri-more-line"></i>
    </span>
    <template #dropdown>
      <el-dropdown-item
        v-if="conversation.published"
        :command="{
          action: 'conversationPublicUrl',
          conversation: conversation
        }"
        ><i class="ri-link mr-1" />Copy Public
        Url</el-dropdown-item
      >
      <el-dropdown-item
        v-if="showViewConversation"
        :command="{
          action: 'conversationView',
          conversation: conversation
        }"
        ><i class="ri-eye-line mr-1" />View
        Conversation</el-dropdown-item
      >
      <el-dropdown-item
        v-if="!conversation.published"
        :command="{
          action: 'conversationPublish',
          conversation: conversation
        }"
        ><i class="ri-upload-cloud-2-line mr-1" />Publish
        Conversation</el-dropdown-item
      >
      <el-dropdown-item
        v-else
        :command="{
          action: 'conversationUnpublish',
          conversation: conversation
        }"
        ><i class="ri-arrow-go-back-line mr-1" />Unpublish
        Conversation</el-dropdown-item
      >
      <el-dropdown-item
        :command="{
          action: 'conversationDelete',
          conversation: conversation
        }"
        ><i class="ri-delete-bin-line mr-1" />Delete
        Conversation</el-dropdown-item
      >
    </template>
  </el-dropdown>
</template>

<script>
import { i18n } from '@/i18n'
import { mapGetters, mapActions } from 'vuex'
import Message from '@/shared/message/message'
import config from '@/config'

export default {
  name: 'AppConversationDropdown',
  props: {
    conversation: {
      type: Object,
      default: () => {}
    },
    showViewConversation: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      currentTenant: 'auth/currentTenant'
    })
  },
  methods: {
    ...mapActions({
      doDestroy: 'conversation/doDestroy',
      doPublish: 'conversation/doPublish',
      doUnpublish: 'conversation/doUnpublish'
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
      if (command.action === 'conversationDelete') {
        return this.doDestroyWithConfirm(
          command.conversation.id
        )
      } else if (
        command.action === 'conversationPublicUrl'
      ) {
        const url = `${config.conversationPublicUrl}/${this.currentTenant.url}-c/${this.record.slug}`
        await navigator.clipboard.writeText(url)
        Message.success(
          'Conversation Public URL successfully copied to your clipboard'
        )
      } else if (command.action === 'conversationPublish') {
        this.editing = false
        await this.doPublish({
          id: command.conversation.id
        })
      } else if (
        command.action === 'conversationUnpublish'
      ) {
        this.editing = false
        await this.doUnpublish({
          id: command.conversation.id
        })
      } else {
        return this.$router.push({
          name: command.action,
          params: { id: command.conversation.id }
        })
      }
    }
  }
}
</script>
