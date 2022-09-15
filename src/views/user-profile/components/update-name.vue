<template>
  <div class="update-name-container">
    <van-nav-bar
    title="设置昵称"
    left-text="取消"
    right-text="完成"
    @click-left="onClickLeft"
    @click-right="onClickRight"
    />
    <!-- 输入文本 -->
    <div class="field-wrap">
        <van-field
        v-model.trim="name"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
        />
    </div>
  </div>
</template>
<script>
import { UpdateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: this.value
    }
  },
  methods: {
    onClickLeft () {
      this.$emit('close')
    },
    async onClickRight () {
      // 提示加载，不允许点击背景
      this.$toast.loading({
        duration: 0,
        message: '修改昵称中...',
        forbidClick: true
      })
      try {
        const name = this.name
        if (!name.length) {
          // 如果昵称长度为空就直接返回
          this.$toast.fail('昵称不能为空！')
          return
        }
        await UpdateUserProfile({
          name
        })
        this.$toast.success('修改成功')
        // 更新视图
        this.$emit('input', this.name)
        // 关闭弹层
        this.$emit('close')
      } catch (err) {
        this.$toast.fail('修改失败！')
      }
    }
  }
}
</script>
<style scoped lang="less">
.field-wrap{
    padding: 20px;
}
</style>
