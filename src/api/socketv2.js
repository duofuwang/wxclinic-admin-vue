import vue from "@/main"
import storage from '@/utils/storage'
import { Notification } from 'element-ui';

var websock = null;
var global_callback = null;
var serverUri = 'ws://localhost:1024/channel';	// webSocket 连接地址

function initWebSocket() { // 初始化 weosocket
    const user = storage.getUser()
    if (!user) {
        return
    }
    // if (callback) {
    //     global_callback = callback;
    //     return
    // }
    websock = new WebSocket(serverUri);
    websock.onmessage = function (e) {
        websocketonmessage(e);
    }
    websock.onclose = function (e) {
        websocketclose(e);
    }
    websock.onopen = function () {
        websocketOpen();
    }

    // 连接发生错误的回调方法
    websock.onerror = function () {
        console.log("WebSocket连接发生错误");
    }
}

// 主动关闭连接
function closeWebSocket() {
    websock.close();
}

// 实际调用的方法
function sendSock(agentData) {
    if (websock.readyState === websock.OPEN) {
        //若是ws开启状态
        websocketsend(agentData)
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData);
        }, 1000);
    } else {
        // 若未开启 ，则等待 1s 后重新调用
        setTimeout(function () {
            sendSock(agentData);
        }, 1000);
    }
}

// 数据接收
function websocketonmessage(e) {

    var data = JSON.parse(e.data)
    console.log(data)
    if (data.newEmergency) {
        Notification.warning({
            title: "有新的呼救信息",
            message: data.newEmergency.message,
            duration: 0
        })
        return
    }

    if (global_callback) {
        global_callback(data);
    }
}

// 数据发送
function websocketsend(agentData) {
    websock.send(JSON.stringify(agentData));
}

// 关闭连接
function websocketclose(e) {
    console.log("connection closed (" + e.code + ")");
    setTimeout(() => {
        initWebSocket();
    }, 1000);
}

// 连接打开
function websocketOpen(e) {
    console.log("WebSocket连接已打开");
    var userInfo = storage.getUser();
    // 告诉服务器初始化 WebSocket 连接
    var dataContent = vue.GLOBAL.dataContent;
    var msg = vue.GLOBAL.message;
    msg.fromId = userInfo.id;
    dataContent.message = msg;
    dataContent.action = vue.GLOBAL.action.CONNECT;
    sendSock(dataContent)
}

function onSockMessage(callback) {
    if (callback) {
        global_callback = callback
    }
}

export { sendSock, initWebSocket, closeWebSocket, onSockMessage }