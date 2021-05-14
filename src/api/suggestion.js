import request from '@/utils/request'

export function getSuggestionList(params) {
    return request({
        url: '/suggestion/page',
        method: 'get',
        params
    })
}

export function saveSuggestion(data) {
    return request({
        url: '/suggestion/save',
        method: 'put',
        data
    })
}

export function deleteSuggestion(ids) {
    return request({
        url: '/suggestion/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getSuggestionById(id) {
    return request({
        url: '/suggestion/' + id,
        method: 'get'
    })
}