import request from '@/utils/request'

export function getMessageBoardList(params) {
    return request({
        url: '/message-board/page',
        method: 'get',
        params
    })
}

export function saveMessageBoard(data) {
    return request({
        url: '/message-board/save',
        method: 'put',
        data
    })
}

export function deleteMessageBoard(ids) {
    return request({
        url: '/message-board/delete?ids=' + ids,
        method: 'delete'
    })
}

export function getMessageBoardById(id) {
    return request({
        url: '/message-board/' + id,
        method: 'get'
    })
}