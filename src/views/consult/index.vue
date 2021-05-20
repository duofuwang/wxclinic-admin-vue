<template>
    <div class="flex justify-start">
        <contact-list
            :contactList="contactList"
            @click="handleClickContact"
        ></contact-list>
        <div class="chat-box">
            <JwChat
                :taleList="taleList"
                @enter="bindEnter"
                @clickTalk="talkEvent"
                v-model="inputMsg"
                :toolConfig="tool"
                width="calc(100vw - 300px - 210px)"
                height="calc(100vh - 50px)"
            ></JwChat>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import util from "@/utils/util";
import { getContactList, getRecentMsg } from "@/api/message";
import ContactList from "./components/ContactList";
import storage from "@/utils/storage";
import { upload } from "@/api/obs";

export default {
    components: { ContactList },
    computed: {
        ...mapGetters(["avatar"]),
    },
    data() {
        return {
            list: [],
            inputMsg: "",
            activeContact: undefined,
            taleList: [],
            tool: {
                show: ["img"],
                showEmoji: false,
                callback: this.toolEvent,
            },
            contactList: [],
            userInfo: {},
        };
    },

    mounted() {
        this.getContactList();
        this.userInfo = storage.getUser();
        this.$socket.onSockMessage((res) => {
            this.onMessage(res);
        });
    },

    methods: {
        // 获取最近会话列表和最后一条聊天记录
        getContactList() {
            getContactList()
                .then((res) => {
                    this.contactList = res.data;
                })
                .catch((data) => {
                    console.log("getContactList error: ", data);
                });
        },

        // 输入框工具栏回调
        toolEvent(type) {
            if (!this.activeContact) {
                this.$message.warning("还没有选择联系人哦");
                return;
            }
            // 选择图片
            if (type == "img") {
                this.openFile((file) => {
                    console.log(file);
                    file.forEach((item) => {
                        var formData = new FormData();
                        // 添加参数
                        formData.append("file", item);
                        upload(formData).then((res) => {
                            console.log(res);
                            const msgObj = {
                                fromId: this.userInfo.id,
                                toId: this.activeContact.friendId,
                                createTime: util.getDateTime(),
                                content: res.data,
                                type: "image",
                                mine: true,
                                name: "我",
                                avatar: this.avatar,
                            };
                            var dataContent = this.GLOBAL.dataContent;
                            dataContent.action = this.GLOBAL.action.CHAT;
                            dataContent.message = msgObj;
                            this.$socket.sendSock(dataContent);
                            this.taleList.push(msgObj);
                            this.getContactList();
                        });
                    });
                });
            }
        },

        openFile(callback) {
            var input = document.createElement("input");
            input.type = "file";
            input.multiple = "multiple";
            input.click();
            input.onchange = function () {
                var file = input.files;
                callback(file);
            };
        },

        // 回车发送
        bindEnter() {
            if (!this.activeContact) {
                this.$message.warning("还没有选择联系人哦");
                return;
            }
            const msg = this.inputMsg;
            if (!msg) return;
            const msgObj = {
                fromId: this.userInfo.id,
                toId: this.activeContact.friendId,
                createTime: util.getDateTime(),
                content: msg,
                type: "text",
                mine: true,
                name: "我",
                avatar: this.avatar,
            };
            // 包装
            var dataContent = this.GLOBAL.dataContent;
            dataContent.action = this.GLOBAL.action.CHAT;
            dataContent.message = msgObj;
            this.$socket.sendSock(dataContent);
            this.taleList.push(msgObj);
            this.getContactList();
        },

        // 接收消息
        onMessage(res) {
            console.log("msg", res.message);
            const message = res.message;
            if (message) {
                if (this.activeContact) {
                    if (this.activeContact.friendId == message.fromId) {
                        // 当前联系人发来的消息
                        const msgObj = {
                            fromId: message.fromId,
                            toId: this.userInfo.id,
                            createTime: message.createTime,
                            content: message.content,
                            type: message.type,
                            mine: false,
                            name:
                                this.activeContact.realName ||
                                this.activeContact.nickname,
                            avatar: this.activeContact.avatarUrl,
                        };
                        this.taleList.push(msgObj);
                        this.signMessage(message.id);
                    }
                }
                // 更新消息列表
                this.getContactList();
            }
        },

        talkEvent(val) {
            console.log(val);
        },

        handleClickContact(contact) {
            if (
                this.activeContact &&
                this.activeContact.friendId == contact.friendId
            ) {
                return;
            }
            this.activeContact = contact;
            getRecentMsg({
                friendId: contact.friendId,
                num: 100,
            }).then((res) => {
                this.taleList = [];
                let data = res.data;
                data.forEach((item) => {
                    const msgObj = {
                        createTime: item.createTime,
                        content: item.content,
                        mine: item.mine == 1,
                        name: item.name,
                        avatar:
                            item.mine == 1 ? this.avatar : contact.avatarUrl,
                        type: item.type,
                    };
                    this.taleList.push(msgObj);
                });
                // 签收未读消息
                var unreadMsgList = data.filter(
                    (item) => item.sign == 0 && item.toId == this.userInfo.id
                );
                if (unreadMsgList.length > 0) {
                    var ids = "";
                    unreadMsgList.forEach((item) => {
                        ids += item.id + ",";
                    });
                    this.signMessage(ids);
                }
            });
        },

        // 将新消息标记为已读
        signMessage(ids) {
            var dataContent = this.GLOBAL.dataContent;
            dataContent.action = this.GLOBAL.action.SIGNED;
            dataContent.extend = ids;
            // 发送消息
            this.$socket.sendSock(dataContent);
            this.getContactList();
        },
    },
};
</script>

<style lang='scss' scoped>
.chat-box {
    height: calc(100vh - 50px);
}
</style>