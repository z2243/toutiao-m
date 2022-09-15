import request from '../utils/request'

export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}

export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

export const collectArticle = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}

export const noCollectArticle = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

export const likeArticle = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}

export const noLikeArticle = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
