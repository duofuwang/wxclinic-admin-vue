import request from '@/utils/request'

export function getContactList() {
    return request({
        url: '/message/getContactList',
        headers: { 'showLoading': false },
        method: 'get'
    })
}

export function getRecentMsg(params) {
    return request({
        url: '/message/getRecentMsg',
        method: 'get',
        params
    })
}

export function getMessageStatistics() {
    return request({
        url: '/message/getMessageStatistics',
        method: 'get'
    })
}