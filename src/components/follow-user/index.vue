<template>
    <van-button
    v-if="is_followed"
    @click="followOrNoFollow"
    :loading="followLoading"
    round
    size="small"
    >已关注</van-button>
    <van-button
    v-else
    @click="followOrNoFollow"
    :loading="followLoading"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    >关注</van-button>
</template>

<script>
import { follow, noFollow } from '@/api/user'
export default {
  name: 'followUserIndex',
  model: {
    prop: 'is_followed',
    event: 'update-is_followed'
  },
  props: {
    is_followed: {
      type: Boolean,
      required: true
    },
    aut_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      followLoading: false
    }
  },
  methods: {
    async followOrNoFollow () {
      this.followLoading = true
      try {
        if (this.is_followed) {
        // 已关注，要发取消关注的请求
          await noFollow(this.aut_id)
        //   console.log('已经取消关注')
        } else {
          await follow(this.aut_id)
        //   console.log('已经增加关注')
        }
        this.$emit('update-is_followed', !this.is_followed)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast('不能关注自己！')
        }
      }
      this.followLoading = false
    }
  }
}
</script>
