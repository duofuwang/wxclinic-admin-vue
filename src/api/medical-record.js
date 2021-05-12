import request from '@/utils/request'

export function getMedicalRecordList(params) {
    return request({
        url: '/medical-record/page',
        method: 'get',
        params
    })
}