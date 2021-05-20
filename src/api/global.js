const action = {
	CONNECT: 1, // 第一次(或重连)初始化连接
	CHAT: 2, // 聊天消息
	SIGNED: 3, // 消息签收
	KEEPALIVE: 4, // 客户端保持心跳
	PULL_FRIEND: 5, // 重新拉取好友
}

const dataContent = {
	action: null,
	message: null,
	extend: null
}

const message = {
	id: null,
	fromId: null,
	toId: null,
	type: null,
	content: null,
	createTime: null,
	sign: null
}

export default {
	dataContent,
	message,
	action
}