import request from '@/utils/request'

export function getConfigList(params) {
    return request({
        url: '/config/page',
        method: 'get',
        params
    })
}

export function getConfig() {
    return request({
        url: '/config',
        method: 'get',
    })
}

export function saveConfig(data) {
    return request({
        url: '/config/save',
        method: 'put',
        data
    })
}