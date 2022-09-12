<template>
    <div class="login-container">
      <!-- 导航栏 -->
      <van-nav-bar class="page-nav-bar" title="登录">
        <van-icon slot="left" name="cross" @click="$router.back()"/>
      </van-nav-bar>
      <!-- 导航栏 -->
      <van-form @submit="onSubmit" ref="loginForm">
        <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
        >
          <i slot="left-icon" class="toutiao toutiao-shouji"></i>
        </van-field>
        <van-field
          v-model="user.code"
          name="code"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
          type="number"
          maxlength="6"
        >
          <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
          <template #button>
            <van-count-down :time="1000 * 10" format="ss s" v-if="isCountDownShow" @finish="isCountDownShow=false"/>
            <van-button round size="small" type="default" class="send-sms-btn" @click="onSendsms" native-type="button" v-else>获取验证码</van-button>
          </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button block type="info" native-type="submit" class="login-btn">登录</van-button>
        </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号！'
          }, {
            pattern: /1[3|5|7|8|9]\d{6}/,
            message: '手机号格式有误！'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码！'
          }, {
            pattern: /^\d{6}$/,
            message: '验证码格式有误！'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      const user = this.user

      // 加载提示
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })

      try {
        const res = await login(user)
        console.log('登录成功！', res)
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功！')
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后再试！')
        }
      }
    },
    async onSendsms () {
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return this.$toast.fail('手机号验证失败！', err)
      }
      this.isCountDownShow = true
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送验证码成功')
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast.fail('手机号验证发送过于频繁，请稍后再试！')
        } else {
          this.$toast.fail('发送验证码失败，请稍后再试！')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    width: 162px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4f6;
      border: none;
    }
  }
}

</style>
