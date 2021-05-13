import request from '@/utils/request'

export function getMedicalRecordList(params) {
    return request({
        url: '/medical-record/page',
        method: 'get',
        params
    })
}

export function saveMedicalRecord(data) {
    return request({
        url: '/medical-record/save',
        method: 'put',
        data
    })
}

export function deleteMedicalRecord(ids) {
    return request({
        url: '/medical-record/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getMedicalRecordById(id) {
    return request({
        url: '/medical-record/' + id,
        method: 'get'
    })
}