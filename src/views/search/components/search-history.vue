<template>
   <div class="search-history">
    <van-cell title="搜索历史">
        <div v-if="isDelShow">
          <span @click="$emit('deleteAllHistory')">全部删除</span>
          &nbsp;
          <span @click="isDelShow = false">完成</span>
        </div>
        <van-icon name="delete" v-else @click="isDelShow = true"/>
    </van-cell>
    <van-cell v-for="(history, index) in historyList" :key="index" :title="history" @click="onSearchItemClick(history, index)">
        <van-icon name="close" v-show="isDelShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    historyList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDelShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onSearchItemClick (history, index) {
      // 判断是否在删除状态下 不在去调用父组件的onSearch 在就splice
      if (this.isDelShow) {
        this.historyList.splice(index, 1)
      } else {
        this.$emit('searchHistory', history)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
