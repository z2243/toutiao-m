<template>
  <div class="search-container">
    <form action="/">
    <van-search
        class="search-form"
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
    />
    </form>
    <!-- 搜索结果 -->
    <search-results v-if="isResultShow" :searchText="searchText"/>
    <!-- 搜索结果 -->

    <!-- 搜索建议 -->
    <search-suggest v-else-if="searchText" :searchText="searchText"
    @search="onSearch"/>
    <!-- 搜索建议 -->

    <!-- 搜索历史 -->
    <search-history v-else :historyList="searchHistories" @searchHistory="onSearch" @deleteAllHistory="searchHistories=[]"/>
    <!-- 搜索历史 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggest from './components/search-suggest.vue'
import SearchResults from './components/search-results.vue'
import { setItem, getItem } from '../../utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggest,
    SearchResults
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORY') || []
    }
  },
  computed: {},
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORY', value)
    }
  },
  created () {},
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val

      // 收集历史记录 先判断这个val有没有在收集的数据里（数据不能重复）
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 如果有找到数据说明重复了 就把这个数据删除
        this.searchHistories.splice(index, 1)
      }
      // 走到这里说明数据已经没有重复的了 把val加入到最前面
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container{
    padding-top: 108px;
    .van-search__action{
        color: #fff;
    }
    .search-form{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 1;
    }
}
</style>
