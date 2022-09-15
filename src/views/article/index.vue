<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
    class="page-nav-bar"
    left-arrow
    title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
    <!-- 加载中 -->
    <div class="loading-wrap" v-if="loading">
        <van-loading
        color="#3296fa"
        vertical
        >加载中</van-loading>
    </div>
    <!-- /加载中 -->

    <!-- 加载完成-文章详情 -->
    <div class="article-detail" v-else-if="articleList.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articleList.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
        <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="articleList.aut_photo"
        />
        <div slot="title" class="user-name">{{ articleList.aut_name }}</div>
        <div slot="label" class="publish-date">{{ articleList.pubdate | relativeTime }}</div>
        <!-- 用v-model取代:is_followed="articleList.is_followed" 和 @update-is_followed="articleList.is_followed = $event"-->
        <follow-user class="follow-btn" :aut_id="articleList.aut_id" v-model="articleList.is_followed"/>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="articleList.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <comment-list :source="articleList.art_id" @count-comment="commentCount=$event.total_count" :list="commentList" @reply="onReplyClick"/>
        <!-- 底部区域 -->
        <div class="article-bottom">
        <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="showPopup"
        >写评论</van-button>
        <van-icon
            name="comment-o"
            :info="commentCount"
            color="#777"
        />
        <collect-article v-model="articleList.is_collected" :articleId="articleList.art_id"/>
        <article-like v-model="articleList.attitude" :articleId="articleList.art_id"/>
        <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 弹出评论 -->
        <van-popup v-model="commentShow" position="bottom">
          <comment-post :target="articleList.art_id" @addNewComment='addCommentFn'/>
        </van-popup>
        <!-- 弹出评论 -->
    </div>
    <!-- /加载完成-文章详情 -->

    <!-- 加载失败：404 -->
    <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
    </div>
    <!-- /加载失败：404 -->

    <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
    <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle(articleId)">点击重试</van-button>
    </div>
    <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 弹出评论的回复 -->
    <van-popup v-model="replayShow" position="bottom" style="height: 100%;">
      <comment-reply :comment="comment" @close="replayShow = false" v-if="replayShow"/>
    </van-popup>
    <!-- 弹出评论的回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import ArticleLike from '@/components/article-like'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    ArticleLike,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      articleList: {},
      loading: true,
      errStatus: 0,
      commentCount: 0,
      commentShow: false,
      commentList: [],
      replayShow: false,
      comment: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle(this.articleId)
  },
  mounted () {},
  methods: {
    async loadArticle (id) {
      this.loading = true
      try {
        const { data } = await getArticleById(id)

        // if (Math.random() > 0.5) {
        //   JSON.parse('adadfad')
        // }

        this.articleList = data.data
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      this.loading = false
    },
    previewImage () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgUrls = []
      imgs.forEach((img, index) => {
        // 把每一个图片的地址放进数组
        imgUrls.push(img.src)
        // 图片被点击的时候要进入预览
        img.onclick = () => {
          ImagePreview({
            images: imgUrls,
            startPosition: index
          })
        }
      })
    },
    showPopup () {
      this.commentShow = true
    },
    addCommentFn (comment) {
      // 关闭弹出层
      this.commentShow = false
      // commentlist的顶部加数据
      this.commentList.unshift(comment.new_obj)
      // 交互：提示用户发布成功
      this.$toast.success('发布成功')
      // commentCount要++
      this.commentCount++
    },
    onReplyClick (comment) {
      this.comment = comment
      this.replayShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
.main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
}
.article-detail {
    .article-title {
    font-size: 40px;
    padding: 50px 32px;
    margin: 0;
    color: #3a3a3a;
    }

    .user-info {
    padding: 0 32px;
    .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
    }
    .van-cell__label {
        margin-top: 0;
    }
    .user-name {
        font-size: 24px;
        color: #3a3a3a;
    }
    .publish-date {
        font-size: 23px;
        color: #b7b7b7;
    }
    .follow-btn {
        width: 170px;
        height: 58px;
    }
    }

    .article-content {
    padding: 55px 32px;
    /deep/ p {
        text-align: justify;
    }
    }
}

.loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
}

.error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
    font-size: 122px;
    color: #b4b4b4;
    }
    .text {
    font-size: 30px;
    color: #666666;
    margin: 33px 0 46px;
    }
    .retry-btn {
    width: 280px;
    height: 70px;
    line-height: 70px;
    border: 1px solid #c3c3c3;
    font-size: 30px;
    color: #666666;
    }
}

.article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
    }
    .van-icon {
    font-size: 40px;
        .van-info {
            font-size: 16px;
            background-color: #e22829;
        }
    }
}
}
</style>
