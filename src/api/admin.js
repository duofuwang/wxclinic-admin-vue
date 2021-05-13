import request from '@/utils/request'

export function getAdminList(params) {
    return request({
        url: '/admin/page',
        method: 'get',
        params
    })
}

export function isAdmin(params) {
    return request({
        url: '/admin/isAdmin',
        method: 'get',
        params
    })
}

export function saveAdmin(data) {
    return request({
        url: '/admin/save',
        method: 'post',
        data
    })
}

export function deleteAdmin(ids) {
    return request({
        url: '/admin/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getAllAdminList() {
    return request({
        url: '/admin/getAllItems',
        method: 'get'
    })
}

export function resetPwd(data) {
    return request({
        url: '/admin/resetPwd',
        method: 'put',
        data
    })
}