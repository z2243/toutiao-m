<template>
  <div class="search-suggest">
    <van-cell v-for="(suggest, index) in suggestion" :key="index" icon="search" @click="$emit('search', suggest)">
        <div slot="title" v-html="highlight(suggest)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggest } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggest',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestion: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      handler: debounce(function (val) {
        this.loadSearchSuggest(val)
      }, 300),
      immediate: true
    }
  },
  created () {},
  methods: {
    async loadSearchSuggest (q) {
      try {
        const { data } = await getSearchSuggest(q)
        this.suggestion = data.data.options
      } catch (err) {
        this.$toast('系统繁忙！请稍后再试！')
      }
    },
    highlight (suggest) {
      const highlightStr = `<span style="color: #3296fa">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return suggest.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less"></style>
