import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 导入本地化语言
dayjs.locale('zh-cn')

dayjs.extend(relativeTime)
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
