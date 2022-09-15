<template>
  <van-icon
    :color="value === 1 ? '#e5645f' : '#777'"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    @click="onLike"
    :loading="loading"
  />
</template>
<script>
import { likeArticle, noLikeArticle } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onLike () {
      try {
        if (this.value === 1) {
          // 如果文章被喜欢了，则取消喜欢
          await noLikeArticle(this.articleId)
          this.$toast('取消点赞成功！')
          // 改变收藏icon的状态
          this.$emit('input', -1)
        } else {
          await likeArticle(this.articleId)
          this.$toast('点赞成功！')
          // 改变收藏icon的状态
          this.$emit('input', 1)
        }
      } catch (err) {
        this.$toast('系统繁忙！请稍后再试！')
      }
    }
  }
}
</script>
