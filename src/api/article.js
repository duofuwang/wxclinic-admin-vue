import request from '@/utils/request'

export function getArticleList(params) {
    return request({
        url: '/article/page',
        method: 'get',
        params
    })
}

export function getArticleById(articleId) {
    return request({
        url: '/article/' + articleId,
        method: 'get'
    })
}

export function saveArticle(data) {
    return request({
        url: '/article/save',
        method: 'post',
        data
    })
}

export function deleteArticle(ids) {
    return request({
        url: '/article/delete?ids=' + ids,
        method: 'delete'
    })
}