<template>
  <div class="update-photo">
    <img :src="src" ref="img"/>
    <div class="toolBar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="complete" @click="update">完成</div>
    </div>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { UpdateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  data () {
    return {
      cropper: null
    }
  },
  props: {
    src: [String, Object]
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      background: false,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false
    })
  },
  methods: {
    update () {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updatePhoto(blob)
      })
    },
    async updatePhoto (blob) {
      // 显示loading
      this.$toast.loading({
        duration: 0,
        message: '更新头像中...',
        forbidClick: true
      })
      const formData = new FormData()
      formData.append('photo', blob)
      try {
        // 发送请求 拿到返回的data数据来更新视图
        const { data } = await UpdateUserPhoto(formData)
        // 更新视图
        this.$emit('update-photo', data.data.photo)
        // 提示更新完成
        this.$toast.success('更新头像成功！')
        // 关闭弹出层
        this.$emit('close')
      } catch (err) {
        this.$toast.fail('更新头像失败！')
        console.log(err)
      }
    }
  }
}
</script>
<style scoped lang="less">
img{
  display: block;
  max-width: 100%;
}
.update-photo{
  background-color: #000;
  height: 100%;
  .toolBar{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .complete{
      width: 90px;
      height: 90px;
      font-size: 30px;
      text-align: center;
      line-height: 90px;
      color: #fff;
    }
  }
}
</style>
