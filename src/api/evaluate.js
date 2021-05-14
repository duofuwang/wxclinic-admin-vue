import request from '@/utils/request'

export function getEvaluateList(params) {
    return request({
        url: '/evaluate/page',
        method: 'get',
        params
    })
}

export function saveEvaluate(data) {
    return request({
        url: '/evaluate/save',
        method: 'put',
        data
    })
}

export function deleteEvaluate(ids) {
    return request({
        url: '/evaluate/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getEvaluateById(id) {
    return request({
        url: '/evaluate/' + id,
        method: 'get'
    })
}