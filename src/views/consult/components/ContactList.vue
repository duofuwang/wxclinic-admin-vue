<template>
    <div class="contact-list">
        <!-- 消息列表 -->
        <div class="padding-sm radius menu">
            <div
                class="cu-list menu-avatar"
                style="border-radius: 8px"
                v-for="(contact, index) in contactList"
                :key="index"
                @click="handleClickContact(contact)"
            >
                <div
                    class="cu-item-no-border-bottom contact-item"
                    :class="activeItem == contact.friendId ? 'active' : ''"
                >
                    <div class="cu-avatar sm bg-white">
                        <el-avatar
                            :src="contact.avatarUrl"
                        ></el-avatar>
                    </div>

                    <div class="content">
                        <div class="text-grey text-df flex">
                            {{ contact.realName || contact.nickname }}
                        </div>
                        <div class="text-gray text-sm flex">
                            <div class="text-cut" v-if="contact.type == 'text'">
                                {{ contact == null ? "" : contact.content }}
                            </div>
                            <div
                                class="text-cut"
                                v-if="contact.type == 'voice'"
                            >
                                {{ contact == null ? "" : "[语音]" }}
                            </div>
                            <div
                                class="text-cut"
                                v-if="contact.type == 'image'"
                            >
                                {{ contact == null ? "" : "[图片]" }}
                            </div>
                            <div
                                class="text-cut"
                                v-if="contact.type == 'location'"
                            >
                                {{ contact == null ? "" : "[定位]" }}
                            </div>
                        </div>
                    </div>
                    <div class="action">
                        <div
                            class="text-grey text-xs"
                            v-if="contact.createTime"
                        >
                            {{ contact.createTime }}
                        </div>
                        <div
                            class="cu-tag round bg-red sm"
                            v-if="contact.unreadNum != 0"
                        >
                            {{ contact.unreadNum }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        contactList: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data() {
        return {
            activeItem: ''
        }
    },
    methods: {
        handleClickContact(contact) {
            this.activeItem = contact.friendId;
            this.$emit('click', contact)
        },
    },
};
</script>

<style lang='scss' scoped>
.contact-list {
    width: 500px !important;
    background-color: #f3f3f3;
    height: calc(100vh - 50px);
    overflow: hidden;
    .active {
        background-color: #ecf5ff;
        .cu-avatar {
            background-color: #ecf5ff;
        }
    }
}

.contact-item:hover {
    cursor: pointer;
    background-color: #ecf5ff;
}
.contact-item:hover > .cu-avatar {
    background-color: #ecf5ff;
}
</style>