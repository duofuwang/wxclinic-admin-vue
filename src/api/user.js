import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: '/user/getUserInfo',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

export function save(data) {
    return request({
        url: '/user/save',
        method: 'post',
        data
    })
}

export function getUserList(params) {
    return request({
        url: '/user/page',
        method: 'get',
        params
    })
}

export function getUserById(userId) {
    return request({
        url: '/user/' + userId,
        method: 'get'
    })
}

export function changeStatus(id, status) {
    const data = {
        id,
        status
    };
    return request({
        url: '/user/changeStatus',
        method: 'put',
        data
    })
}

export function deleteUser(ids) {
    return request({
        url: '/user/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getNewVisitStatistics() {
    return request({
        url: '/user/getNewVisitStatistics',
        method: 'get'
    })
}