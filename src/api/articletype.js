import request from '@/utils/request'

export function getArticleTypeList() {
    return request({
        url: '/article-type/getAllItems',
        method: 'get'
    })
}

export function getArticleTypeById(id) {
    return request({
        url: '/article-type/' + id,
        method: 'get'
    })
}