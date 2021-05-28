import vue from "@/main"
import storage from '@/utils/storage'
let websock = null
let messageCallback = null
let errorCallback = null
let wsUrl = 'wss://dopoiv.space/channel'

// 接收ws后端返回的数据
function websocketonmessage(e) {
    messageCallback(JSON.parse(e.data))
}

/**
 * 发送WebSocket消息
 * 
 * @param {Object} agentData 需要向后台传递的参数数据
 * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
 * @param {function} errCallback ws连接错误的回调函数
 */
function sendSock(agentData, successCallback, errCallback) {
    messageCallback = successCallback
    errorCallback = errCallback
    // 添加状态判断，当为OPEN时，发送消息
    if (websock.readyState === websock.OPEN) { // websock.OPEN = 1 
        // 发给后端的数据需要字符串化
        websock.send(JSON.stringify(agentData))
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData);
        }, 1000);
    }
    if (websock.readyState === websock.CLOSED) { // websock.CLOSED = 3 
        console.log('websock.CLOSED')
        errorCallback()
    }
}

// 关闭ws连接
function websocketclose(e) {
    // e.code === 1000  表示正常关闭。 无论为何目的而创建, 该链接都已成功完成任务。
    // e.code !== 1000  表示非正常关闭。
    if (e && e.code !== 1000) {
        errorCallback()
    }
    console.log('WebSocket连接已关闭')
}

// 建立ws连接
function websocketOpen(e) {
    console.log('WebSocket连接已打开')
    var userInfo = storage.getUser();
    console.log(userInfo)
    // 告诉服务器初始化 WebSocket 连接
    var dataContent = vue.GLOBAL.dataContent;
    var msg = vue.GLOBAL.message;
    msg.fromId = userInfo.id;
    dataContent.message = msg;
    dataContent.action = vue.GLOBAL.action.CONNECT;
    console.log(dataContent)
    sendSock(dataContent)
}

// 初始化weosocket
function initWebSocket() {
    if (typeof (WebSocket) === 'undefined') {
        return false
    }
    const user = storage.getUser()
    if (!user) {
        return
    }
    // ws请求完整地址
    const requstWsUrl = wsUrl
    websock = new WebSocket(requstWsUrl)

    websock.onmessage = function (e) {
        websocketonmessage(e)
    }
    websock.onopen = function () {
        websocketOpen()
    }
    websock.onerror = function () {
        console.log('WebSocket连接异常')
        errorCallback()
    }
    websock.onclose = function (e) {
        websocketclose(e)
    }
}

/**
 * 关闭websocket函数
 */
function closeWebSocket() {
    if (websock) {
        websock.close() // 关闭websocket
        websock.onclose() // 关闭websocket
    }
}

export { sendSock, initWebSocket, closeWebSocket }