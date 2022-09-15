<template>
  <div>
    <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择生日日期"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfirm"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { UpdateUserProfile } from '@/api/user'
export default {
  name: 'UpdateBirthday',
  props: {
    value: String
  },
  data () {
    return {
      minDate: new Date(1960, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm () {
      // 提示加载，不允许点击背景
      this.$toast.loading({
        duration: 0,
        message: '修改生日中...',
        forbidClick: true
      })
      try {
        const birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
        await UpdateUserProfile({
          birthday: birthday
        })
        this.$toast.success('修改成功')
        // 更新视图
        this.$emit('input', birthday)
        // 关闭弹层
        this.$emit('close')
      } catch (err) {
        this.$toast.fail('修改生日失败！')
        console.log(err)
      }
    }
  }
}
</script>
