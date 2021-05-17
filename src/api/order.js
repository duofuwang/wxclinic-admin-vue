import request from '@/utils/request'

export function getOrderList(params) {
    return request({
        url: '/order/page',
        method: 'get',
        params
    })
}

export function saveOrder(data) {
    return request({
        url: '/order/save',
        method: 'put',
        data
    })
}

export function deleteOrder(ids) {
    return request({
        url: '/order/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getOrderById(id) {
    return request({
        url: '/order/' + id,
        method: 'get'
    })
}