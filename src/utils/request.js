import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import _ from "lodash";


let loading;
let requestCount = 0;

function showLoading(target) {
    if (requestCount === 0 && !loading) {
        loading = Loading.service({
            lock: true,
            text: "加载中",
            background: "rgba(255, 255, 255, 0.5)",
            target: target || "body"
        })
    }
    requestCount++
}

function hideLoading() {
    requestCount--;
    requestCount = Math.max(requestCount, 0)
    if (requestCount === 0) {
        toHideLoading();
    }
}

var toHideLoading = _.debounce(() => {
    loading ? loading.close() : "";
    loading = null;
}, 300);

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        if (config.headers.showLoading !== false) {
            showLoading(config.headers.loadingTarget);
        }

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['token'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        if (config.headers.showLoading !== false) {
            hideLoading();
        }
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        hideLoading();

        const res = response.data

        const message = response.data.msg || "系统繁忙";

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {

            // login status expired;
            if (res.code === 401 || res.code === 403) {
                console.log('re-login')
                // to re-login
                MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/logout').then(() => {
                        location.reload()
                    })
                })
            } else if (res.code === 500) {
                Message({
                    message: message,
                    type: "error"
                });
                return Promise.reject(new Error(message));
            }


            return Promise.reject(new Error(message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        hideLoading()
        console.log('err:::' + error) // for debug
        console.log(error.code)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
