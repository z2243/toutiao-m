<template>
  <van-icon
    :color="value ? '#ffa500' : '#777'"
    :name="value ? 'star' : 'star-o'"
    @click="onCollect"
  />
</template>
<script>
import { collectArticle, noCollectArticle } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onCollect () {
      try {
        if (this.value) {
          // 如果文章被收藏了，则取消收藏
          await noCollectArticle(this.articleId)
          this.$toast('取消收藏成功！')
        } else {
          await collectArticle(this.articleId)
          this.$toast('收藏成功！')
        }
        // 改变收藏icon的状态
        this.$emit('input', !this.value)
      } catch (err) {
        this.$toast('系统繁忙！请稍后再试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
