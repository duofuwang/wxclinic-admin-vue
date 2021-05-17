import request from '@/utils/request'

export function getFinanceStatisticsList(params) {
    return request({
        url: '/finance/page',
        method: 'get',
        params
    })
}