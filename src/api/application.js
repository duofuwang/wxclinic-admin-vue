import request from '@/utils/request'

export function getApplicationList(params) {
    return request({
        url: '/application/page',
        method: 'get',
        params
    })
}

export function approve(applicationId, remark) {
    const data = {
        applicationId,
        remark
    }
    return request({
        url: '/application/approve',
        method: 'put',
        data: data
    })
}

export function reject(applicationId, remark) {
    const data = {
        applicationId,
        remark
    }
    return request({
        url: '/application/reject',
        method: 'put',
        data: data
    })
}

export function getApplicationById(applicationId) {
    return request({
        url: '/application/' + applicationId,
        method: 'get'
    })
}

export function deleteApplication(ids) {
    return request({
        url: '/application/delete?ids=' + ids,
        method: 'delete'
    })
}