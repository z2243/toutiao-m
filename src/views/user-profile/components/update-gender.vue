<template>
  <div>
    <van-picker
    title="性别"
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onChange"
    :default-index="value"
    />
  </div>
</template>
<script>
import { UpdateUserProfile } from '@/api/user'
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      gender: this.value
    }
  },
  methods: {
    async onConfirm () {
      // 提示加载，不允许点击背景
      this.$toast.loading({
        duration: 0,
        message: '修改性别中...',
        forbidClick: true
      })
      try {
        await UpdateUserProfile({
          gender: this.gender
        })
        this.$toast.success('修改成功')
        // 更新视图
        this.$emit('input', this.gender)
        // 关闭弹层
        this.$emit('close')
      } catch (err) {
        this.$toast.fail('修改性别失败！')
        console.log(err)
      }
    },
    onChange (picker, value, index) {
      this.gender = index
    },
    onCancel () {
      this.$emit('close')
    }
  }
}
</script>
