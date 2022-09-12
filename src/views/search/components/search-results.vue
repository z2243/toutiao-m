<template>
  <div class="search-results">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="加载失败，点击重试！"
    >
      <van-cell v-for="(result, index) in list" :key="index" :title="result.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'
export default {
  name: 'SearchResults',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    async onLoad () {
      // 异步更新数据
      try {
        // 1.获取数据
        const { data } = await getSearchResults({
          page: this.page,
          per_page: 20,
          q: this.searchText
        })
        // 2. 将数据放入list
        const results = data.data.results
        this.list.push(...results)
        // 3.将本次加载的loading关闭
        this.loading = false

        // 4.判断是否还有数据
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
