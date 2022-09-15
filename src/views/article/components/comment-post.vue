<template>
  <div class="comment-post">
    <van-field
    class="post-field"
    v-model.trim="message"
    rows="2"
    autosize
    type="textarea"
    maxlength="50"
    placeholder="请输入留言"
    show-word-limit
    />
    <van-button
    class="post-btn"
    @click="onAddComment"
    :disabled="!message.length"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: [Number, String, Object]
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  inject: {
    articleId: {
      type: [String, Number, Object],
      default: null
    }
  },
  mounted () {},
  methods: {
    async onAddComment () {
      // 加载提示 展示登录中的loading
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await addComment({
          target: this.target,
          content: this.message,
          art_id: this.articleId ? this.articleId.toString() : this.articleId
        })
        this.message = ''
        this.$emit('addNewComment', data.data)
      } catch (err) {
        this.$toast('评论失败！请稍后再试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
display: flex;
align-items: center;
padding: 32px 0 32px 32px;
.post-field {
    background-color: #f5f7f9;
}
.post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
    display: none;
    }
}
}
</style>
