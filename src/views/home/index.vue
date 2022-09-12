<template>
    <div class="home-container">
      <!-- 导航栏 -->
      <van-nav-bar class="page-nav-bar" fixed>
        <van-button slot="title" type="info" size="small" round icon="search" class="search-button" to="search">
          搜索
        </van-button>
      </van-nav-bar>
      <!-- 导航栏 -->

      <!-- 文章频道列表 -->
      <van-tabs v-model="active" animated swipeable class="channel-tabs">
        <van-tab
          v-for="channel in channels"
          :key="channel.id"
          :title="channel.name"
        >
          <ArticleList :channel="channel"></ArticleList>
        </van-tab>
        <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
        <div slot="nav-right" class="placeholder"></div>
      </van-tabs>
      <!-- 文章频道列表 -->
      <!-- 弹出频道编辑 -->
      <van-popup
      closeable
      close-icon-position="top-left"
      v-model="isChannelEditShow"
      position="bottom"
      :style="{ height: '100%' }">
        <channel-edit :myChannels="channels" :active="active" @update-active="updateActive"></channel-edit>
      </van-popup>
      <!-- 弹出频道编辑 -->
    </div>
</template>
<script>
import ArticleList from './components/article-list.vue'
import { getUserChannels } from '../../api/user'
import ChannelEdit from './components/channel-edit.vue'
import { getItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  created () {
    this.loadChannels()
  },
  name: 'HomeIndex',
  methods: {
    async loadChannels () {
      let channel = []
      // 如果是登录状态才请求获取
      if (this.user) {
        try {
          const { data } = await getUserChannels()
          channel = data.data.channels
          console.log(channel)
        } catch (err) {
          this.$toast('获取频道信息失败！请稍后再试！')
        }
      } else {
        // 没有登陆 就从localStorage里拿
        const getChannels = getItem('TOUTIAO_CHANNEL')
        if (getChannels) {
          channel = getChannels
        } else {
          const { data } = await getUserChannels()
          channel = data.data.channels
        }
      }
      this.channels = channel
    },
    updateActive (index, isClose) {
      this.active = index
      // 关闭弹出层
      this.isChannelEditShow = isClose
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
<style scoped lang="less">
  .home-container{
    padding-top: 174px;
    padding-bottom: 100px;
    .search-button{
      width: 555px;
      height: 64px;
      background-color: #56abfb;
      border: none;
      font-size: 28px;
      .van-icon{
        font-size: 32px;
      }
    }
    .van-nav-bar__title{
      max-width: unset;
    }
    /deep/ .channel-tabs{
      .van-tab{
        border-right: 1px solid #edeff3;
        min-width: 200px;
        font-size: 30px;
        color: #777777;
      }
      .van-tabs__wrap{
        position: fixed;
        top: 92px;
        z-index: 1;
        left: 0;
        right: 0;
        height: 82px;
      }
      .van-tabs__line{
        width: 31px!important;
        height: 6px;
        background-color: #3296fa;
        bottom: 8px;
      }
      .van-tabs__nav{
        padding-bottom: 0;
      }
      .van-tab--active{
        color: #333333;
      }
      .hamburger-btn{
        position: fixed;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 66px;
        height: 82px;
        background-color: #fff;
        opacity: 0.902;
        &::before{
          content: "";
          width: 1px;
          height: 100%;
          background-image: url(~@/assets/gradient-gray-line.png);
          position: absolute;
          left: 0;
          background-size: contain;
        }
        i.toutiao{
          font-size: 33px;
        }
      }
      .placeholder{
        width: 66px;
        height: 82px;
        flex-shrink: 0;
      }
    }
  }
</style>
