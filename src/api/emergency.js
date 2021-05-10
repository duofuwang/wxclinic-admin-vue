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