<template>
    <div class="my-container">
      <div class="header user-info" v-if="user">
        <div class="base-info">
          <div class="left">
            <van-image
              class="avatar"
              :src="userInfo.photo"
              round
              fit="cover"
            />
            <span>{{ userInfo.name }}</span>
          </div>
          <div class="right">
            <van-button size="mini" round to="/user/profile">编辑资料</van-button>
          </div>
        </div>
        <div class="base-stats">
          <div class="data-item">
            <span class="count">{{ userInfo.art_count }}</span>
            <span class="text">头条</span>
          </div>
          <div class="data-item">
            <span class="count">{{ userInfo.art_count }}</span>
            <span class="text">关注</span>
          </div>
          <div class="data-item">
            <span class="count">{{ userInfo.fans_count }}</span>
            <span class="text">粉丝</span>
          </div>
          <div class="data-item">
            <span class="count">{{ userInfo.like_count }}</span>
            <span class="text">获赞</span>
          </div>
        </div>
      </div>
      <div class="header not-login" v-else>
        <div class="login-btn" @click="$router.push('/login')">
          <img src="~@/assets/mobile.png" alt="">
          <span>登录 / 注册</span>
        </div>
      </div>
      <van-grid :column-num="2" class="grid-nav" clickable>
        <van-grid-item class="grid-item">
          <i slot="icon" class="toutiao toutiao-shoucang"></i>
          <span slot="text">收藏</span>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <i slot="icon" class="toutiao toutiao-lishi"></i>
          <span slot="text">历史</span>
        </van-grid-item>
      </van-grid>
      <div class="grid-nav">
        <van-cell title="消息通知" is-link/>
        <van-cell class="mb-9" title="小智同学" is-link/>
        <van-cell v-if="user" title="退出登录" class="logout-cell" @click="onLogout"/>
      </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  data () {
    return {
      userInfo: []
    }
  },
  name: 'MyIndex',
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onLogout () {
      this.$dialog.confirm({
        title: '确认要退出登录吗？'
      }).then(() => {
        // on confirm
        this.$store.commit('setUser', null)
      }).catch(() => {
      })
    },
    async loaduserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        console.log(this.userInfo)
      } catch (err) {
        this.$toast('获取数据失败，请稍后再试！')
      }
    }
  },
  created () {
    if (this.user) {
      this.loaduserInfo()
    }
  }
}
</script>
<style scoped lang="less">
  .my-container{
    .header{
      height: 361px;
      background-image: url("~@/assets/banner.png");
      background-size: cover;
      .login-btn{
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          justify-content: center;
          align-items: center;
          height: 132px;
          width: 132px;
          margin-bottom: 15px;
        }
        span{
          font-size: 28px;
          color: #fff;
        }
      }
      .base-info{
        height: 231px;
        padding: 76px 23px 23px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left{
          display: flex;
          align-items: center;
          .avatar{
            width: 132px;
            height: 132px;
            margin-right: 23px;
          }
          span{
            font-size: 30px;
            color: #fff;
          }
        }
      }
      .base-stats{
        display: flex;
        .data-item{
          flex:1;
          display: flex;
          flex-direction: column;
          text-align: center;
          color: #fff;
          .count{
            font-size: 36px;
          }
          .text{
            font-size: 23px;
          }
        }
      }
    }
    .grid-nav{
      height: 141px;
      .grid-item{
        i{
          font-size: 45px;
        }
        span{
          font-size: 28px;
        }
        .toutiao-shoucang{
          color: #eb5253;
        }
        .toutiao-lishi{
          color:#ff9d1d;
        }
      }
    }
    .logout-cell {
      text-align: center;
      color: #d86262;
    }

    .mb-9 {
      margin-bottom: 9px;
    }
  }
</style>
