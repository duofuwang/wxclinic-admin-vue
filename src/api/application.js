import request from '@/utils/request'

export function getApplicationList(params) {
    return request({
        url: '/application/page',
        method: 'get',
        params
    })
}

export function approve(applicationId) {
    return request({
        url: '/application/approve/' + applicationId,
        method: 'put',
    })
}

export function reject(applicationId) {
    return request({
        url: '/application/reject/' + applicationId,
        method: 'put',
    })
}

export function getApplicationById(applicationId) {
    return request({
        url: '/application/' + applicationId,
        method: 'get'
    })
}