import request from '@/utils/request'

export function getEmergencyList(params) {
    return request({
        url: '/emergency/page',
        method: 'get',
        params
    })
}

export function stop(emergencyId) {
    const params = {
        emergencyId
    }
    return request({
        url: '/emergency/stop',
        method: 'get',
        params
    })
}

export function getEmergencyById(emergencyId) {
    return request({
        url: '/emergency/' + emergencyId,
        method: 'get'
    })
}

export function deleteEmergency(ids) {
    return request({
        url: '/emergency/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getEmergencyStatistics() {
    return request({
        url: '/emergency/getEmergencyStatistics',
        method: 'get'
    })
}