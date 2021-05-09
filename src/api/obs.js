import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/system/obs/upload',
    method: 'post',
    data
  })
}