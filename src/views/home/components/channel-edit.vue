<template>
    <div class="channel-edit">
        <van-cell>
            <div slot="title" class="title">我的频道</div>
            <van-button type="danger" round plain size="mini" class="edit-button" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10" class="grid my-grid">
            <van-grid-item v-for="(channel, index) in myChannels" :key="index"
            @click="onMyChannelClick(channel,index)">
                <span class="text" slot="text" :class="{active: index === active}">{{ channel.name }}</span>
                <van-icon slot="icon" name="clear" v-show="isEdit && !fiexChannels.includes(channel.id)"></van-icon>
            </van-grid-item>
        </van-grid>
        <!-- 频道推荐 -->
        <van-cell>
            <div slot="title" class="title">频道推荐</div>
        </van-cell>
        <van-grid :gutter="10" class="grid recommend-grid">
            <van-grid-item v-for="(recommendChannel, index) in recommendChannels" :key="index" :text="recommendChannel.name" icon="plus" @click="onAddChannel(recommendChannel)"/>
        </van-grid>
        <!-- 频道推荐 -->
    </div>
</template>
<script>
import { getAllChannels, addUserChannel, delChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  data () {
    return {
      allChannels: [],
      isEdit: false,
      fiexChannels: [0]
    }
  },
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道列表失败！')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 如果是已登录状态
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败！请稍后再试！')
        }
      } else {
        // 未登录状态 放入localStorage
        setItem('TOUTIAO_CHANNEL', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 如果这个channel的id属于不能删除的数组里的id就不能删除
        if (this.fiexChannels.includes(channel.id)) {
          return
        }
        // 如果是编辑状态，删除这个channel
        this.myChannels.splice(index, 1)

        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }

        // 删除持久化操作
        this.deleteChannel(channel.id)
      } else {
        // 非编辑状态，要进入这个channel
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channelId) {
      if (this.user) {
        try {
          await delChannel(channelId)
        } catch (err) {
          this.$toast('删除失败！')
        }
      } else {
        setItem('TOUTIAO_CHANNEL', this.myChannels)
      }
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => { return channel.id === myChannel.id })
      })
    }
  }
}
</script>
<style scoped lang="less">
    .channel-edit{
        padding: 85px 0;
        .title{
            font-size: 32px;
            color: #333333;
        }
        .edit-button{
            width: 104px;
            height: 48px;
            font-size: 26px;
            color: #f85959;
            border: 1px solid #f85959;
        }
        /deep/ .grid{
            .van-grid-item{
                width: 160px;
                height: 86px;
            }
            .van-grid-item__content{
                white-space: nowrap;
                background-color: #f4f5f6;
            }
            .van-grid-item__text, .text{
                font-size: 28px;
                color: #222;
            }
            .active{
                color: red;
            }
        }
        /deep/ .recommend-grid{
            .van-grid-item__content{
                flex-direction: row;
                .van-grid-item__text{
                    margin-top: 0;
                }
                .van-icon-plus{
                    font-size: 28px;
                    margin-right: 6px;
                }
            }
        }
        /deep/ .my-grid{
            .van-icon-clear{
                position: absolute;
                right: -10px;
                top: -10px;
                font-size: 30px;
                color: #cacaca;
                z-index: 2;
            }
            .van-grid-item{
                .van-grid-item__text{
                    margin-top: 0;
                }
            }
            .van-grid-item__icon-wrapper{
                position: unset;
            }
        }
    }
</style>
