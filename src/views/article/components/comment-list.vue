<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="评论加载失败！点击重试！"
    immediate-check="false"
  >
    <comment-view v-for="(item, index) in list" :key="index" :comment="item" @reply="$emit('reply',$event)"/>
</van-list>
</template>
<script>
import { getComment } from '@/api/comment.js'
import CommentView from './comment-view.vue'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      offset: null,
      error: false
    }
  },
  components: {
    CommentView
  },
  created () {
    this.onLoad()
    this.loading = true
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  methods: {
    async onLoad () {
      try {
        // 异步更新数据
        const { data } = await getComment({
          type: this.type,
          source: this.source,
          offset: this.offset,
          limit: 10
        })
        const { results } = data.data
        // 把数据放入list
        this.list.push(...results)
        // 给父组件传data.data的total_count
        this.$emit('count-comment', data.data)
        // 加载状态结束
        this.loading = false
        if (results.length) {
          // 如果还有数据就翻页
          this.offset = data.data.last_id
        } else {
          this.finished = true
          this.loading = false
        }
      } catch (err) {
        this.loading = false
        this.error = true
        this.$toast('获取评论失败！请稍后再试！')
      }
    }
  }
}
</script>
