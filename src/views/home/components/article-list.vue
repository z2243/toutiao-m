<template>
  <div class="article-list">
    <!-- 频道具体列表 -->
    <!-- load加载事件会触发onload方法 -->
    <van-pull-refresh v-model="isrefreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText" :success-duration="1000">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      >
      <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
      <articleItem v-for="(article, index) in list" :key="index" :article="article"
      >
      </articleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '../../../api/article'
import articleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    articleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      isrefreshLoading: false,
      refreshSuccessText: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now()
        })

        // if (Math.random() > 0.5) {
        //   JSON.parse('dsngdaf')
        // }

        const { results } = data.data
        this.list.push(...results)

        // 反复加载
        this.loading = false

        // 如果还没有加载完，我们需要更换时间戳了——这样不会导致数据重复渲染
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          // 数据加载完了
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      //   setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //       this.list.push(this.list.length + 1)
      //     }

      //     // 加载状态结束 但如果页面没有铺满，loading又会变true，再加载直到页面被铺满
      //     this.loading = false

      //     // 数据全部加载完成
      //     if (this.list.length >= 40) {
      //       this.finished = true
      //     }
      //   }, 1000)
    },
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now()
        })

        // if (Math.random() > 0.5) {
        //   JSON.parse('dsngdaf')
        // }

        const { results } = data.data
        this.list.unshift(...results)

        // 结束刷新
        this.isrefreshLoading = false
        this.refreshSuccessText = `刷新成功，已为您加载了${results.length}条数据`
      } catch (err) {
        this.isrefreshLoading = false
        this.refreshSuccessText = '刷新失败！'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list{
  height: 79vh;
  overflow-y: auto;
}
</style>
