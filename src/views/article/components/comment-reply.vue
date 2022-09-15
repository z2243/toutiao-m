<template>
    <div>
      <van-nav-bar
        :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
      >
      <van-icon name="cross" slot="left" @click="$emit('close')"/>
      </van-nav-bar>
      <div class="scroll-wrap">
        <!-- 当前评论项 -->
        <comment-view :comment="comment"/>
        <!-- 当前评论项 -->

        <!-- 评论的回复列表 -->
        <comment-list :source="comment.com_id" type="c" :list="commentList"/>
        <!-- 评论的回复列表 -->
      </div>

      <!-- 写评论 -->
      <div class="post-comment" @click="replayShow = true">
        <van-button>写评论</van-button>
      </div>
      <!-- 写评论 -->

      <!-- 发布评论 -->
      <van-popup v-model="replayShow" position="bottom" >
        <comment-post :target="comment.com_id" @addNewComment='addCommentFn'/>
      </van-popup>
      <!-- 发布评论 -->
    </div>
</template>
<script>
import CommentView from './comment-view.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  data () {
    return {
      commentList: [],
      replayShow: false,
      commentCount: 0
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    CommentView,
    CommentList,
    CommentPost
  },
  methods: {
    addCommentFn (comment) {
      // 关闭弹出层
      this.replayShow = false
      // commentlist的顶部加数据
      this.commentList.unshift(comment.new_obj)
      // 交互：提示用户发布成功
      this.$toast.success('发布成功')
      // commentCount要++
      this.commentCount++
    }
  }
}
</script>
<style scoped lang="less">
.post-comment{
  height: 88px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  border: 1px solid #d8d8d8;
  background-color: #fff;
  .van-button{
    width: 100%;
  }
}
.scroll-wrap{
  position: fixed;
  top: 92px;
  bottom: 88px;
  left: 0;
  right: 0;
  overflow-y: auto;
}
</style>
