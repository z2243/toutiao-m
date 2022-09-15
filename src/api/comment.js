import request from '../utils/request'

export const getComment = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}
export const likeComment = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target
    }
  })
}

export const noLikeComment = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
