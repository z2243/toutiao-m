<template>
    <div class="article-item">
        <van-cell class="article-cell-item" size="large" :to="`/article/${article.art_id}`">
            <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
            <div slot="label">
                <div slot="default" v-if="article.cover.type === 3" class="triplePic">
                    <div class="triple-item" v-for="(img, index) in article.cover.images" :key="index">
                        <van-image class="item-img"
                        :src="img"
                        fit="cover"
                        />
                    </div>
                </div>
                <div class="article-info">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime }}</span>
                </div>
            </div>
            <div slot="default" v-if="this.article.cover.type === 1">
                <van-image
                :src="this.article.cover.images[0]"
                fit="cover"
                />
            </div>
        </van-cell>
    </div>
</template>
<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped lang="less">
.article-item{
  .article-cell-item{
    .title{
        font-size: 32px;
        color: #3a3a3a;
    }
    .van-cell__value{
        flex: unset;
        width: 232px;
        height: 146px;
        padding-left: 25px;
    }
    .cover-img{
        width: 232px;
        height: 146px;
    }
    .article-info{
        font-size: 22px;
        color: #b4b4b4;
        span{
            margin-right: 25px;
        }
    }
    .triplePic{
        display: flex;
        padding: 30px 0;
        .triple-item{
            flex: 1;
            height: 146px;
            &:not(:last-child){
                padding-right: 4px;
            }
            .item-img{
                width: 100%;
                height: 146px;
            }
        }
    }
  }
}
</style>
