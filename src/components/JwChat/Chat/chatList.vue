<template>
    <div class="wrapper" :style="boxSize" ref="scroller">
        <div v-if="historyConfig.show && historyLoding" @click="handleHistory">
            {{ historyConfig.tip }}
        </div>
        <div class="scroller">
            <div class="web__main" ref="main">
                <div
                    class="web__main-item"
                    v-for="(item, k) in list"
                    :key="JSON.stringify(item) + k"
                    :class="{ 'web__main-item--mine': item.mine }"
                >
                    <div class="web__main-user">
                        <img
                            :src="item.avatar"
                            @click="
                                $emit('click', { type: 'avatar', data: item })
                            "
                        />
                        <cite
                            @click="
                                $emit('click', { type: 'nickname', data: item })
                            "
                        >
                            {{ item.name }}
                            <i>{{ item.createTime }}</i>
                        </cite>
                    </div>
                    <div class="web__main-text">
                        <div class="web__main-arrow"></div>
                        <itemTalk
                            v-if="item.content"
                            :content="item.content"
                            :type="item.type"
                            :mine="item.mine"
                            @systemEvent="taskEvent(item)"
                            @loadDone="loadDone"
                        />
                    </div>
                </div>
            </div>
        </div>
        <JwChat-empty v-if="list.length == 0" size="8rem" />
        <div
            class="downBtn"
            v-if="scroll && !scroll.isBottom"
            @click="scrollBottom"
        >
            <span v-if="unread">{{ unread }}</span>
        </div>
    </div>
</template>

<script>
import Scroll from "@/utils/scroll";
import Remind from "@/utils/remind";
import itemTalk from "./itemTalk";
import systemTalk from "./systemTalk";
// TODO: 提示功能单独拿出来
// TODO: 历史模块 拿出来
export default {
    name: "JwChat_list",
    components: { itemTalk, systemTalk },
    props: {
        pageConfig: {
            type: Object,
            default: () => ({
                width: "100vw",
            }),
        },
        list: {
            type: Array,
            default: () => [],
        },
        config: {
            type: Object,
            default: () => ({
                width: "525px",
                height: "382px",
            }),
        },
    },
    data() {
        return {
            scroll: null,
            remind: null, // 消息提示
            scrollTop: false,
            historyLoding: false,
            stopScroll: false,
            stopScrollTimer: null,
        };
    },
    watch: {
        list(newval) {
            if (newval.length == 0 && this.scroll) {
                this.destroyScroll();
            }
            if (newval.length != 0 && !this.scroll) {
                this.createScroll();
            }
            if (newval) {
                if (this.historyLoding) {
                    this.stopScroll = true;
                }
            }
        },
        "config.scrollToButton"(newval) {
            if (newval) {
                this.scrollBottom();
            }
        },
        unread(newval) {
            newval && Remind.showBrowser.call(this);
            if (!this.remind) return;
            if (newval) {
                this.remind.changeTitle(newval);
            } else {
                this.remind.resetTitle();
            }
        },
    },
    computed: {
        boxSize() {
            let { height = "382px", width = "525px" } = this.config || {};
            if (`${height}`.match(/\d$/)) {
                height += "px";
            }
            if (`${width}`.match(/\d$/)) {
                width += "px";
            }
            const style = { height, width };
            return style;
        },
        historyConfig() {
            const {
                historyConfig: { tip = "历史消息", show = false } = {},
            } = this.config;
            return { tip, show };
        },
        scrollType() {
            const { scrollType: type = "noroll" } = this.config;
            return type;
        },
        unread() {
            const { unread = 0 } = this.scroll || {};
            return unread;
        },
    },
    mounted() {
        this.createScroll();
        // this.remind = new Remind()
    },
    methods: {
        loadDone() {
            let callback = this.scrollBottom;
            if (this.scrollType === "noroll") {
                this.stopScroll = true;
                callback = null;
            }
            this.scrollRefresh(callback);
            this.childnodeLoad();
        },
        scrollBottom() {
            const stop = this.stopScroll;
            clearTimeout(this.stopScrollTimer);
            if (stop || this.historyLoding)
                return (this.stopScrollTimer = setTimeout(() => {
                    this.stopScroll = false;
                }, 500));
            if (this.scroll) {
                this.scroll.scrollTo(0, this.scroll.maxScrollY, 200);
            }
        },
        createScroll() {
            const that = this;
            const dom = this.$refs.scroller;
            this.scroll = new Scroll(dom, {
                click: true,
                scrollbars: true,
                mouseWheel: true,
                preventDefault: false,
                interactiveScrollbars: true,
                hijackInternalLinks: true,
                // useTransform: false,
            });
            // scroll done callback
            this.scroll.on("scrollEnd", function () {
                that.showHistoryBtn();
                if (that.historyLoding) return;
                that.scroll.savePosition(); // 保存当前滚动位置
            });
            let timer = null;
            this.scroll.on("scroll", function () {
                clearTimeout(timer);
                that.stopScroll = true;
                timer = setTimeout(() => {
                    that.stopScroll = false;
                }, 500);
            });
        },
        destroyScroll() {
            if (this.scroll) {
                this.scroll.destroy();
                this.scroll = null;
            }
        },
        initScroll() {
            this.destroyScroll();
            this.createScroll();
        },
        showHistoryBtn() {
            const { isTop } = this.scroll;
            // 当前滚动条是否在顶端
            if (isTop) {
                if (this.scrollTop) {
                    this.historyLoding = true;
                } else this.scrollTop = true;
                return;
            }
            this.resetHistoryFlag();
        },
        resetHistoryFlag() {
            this.scrollTop = false;
            this.historyLoding = false;
        },
        childnodeLoad() {
            if (this.scrollType !== "noroll") return;
            const parent = this.$refs.main;
            if (!parent) return;
            const childs = parent.children;
            this.scroll.saveNodes({ nodes: childs, dataList: this.list });
        },
        scrollRefresh(callback = null) {
            if (!this.scroll) return;
            this.scroll.refresh();
            callback &&
                this.$nextTick(() => {
                    callback();
                });
        },
        taskEvent(itemData) {
            this.$emit("click", { type: "taskItem", data: itemData });
        },
        handleHistory() {
            this.$emit("loadHistory");
            this.$nextTick(() => {
                this.resetHistoryFlag();
            });
        },
    },
};
</script>

<style  scoped lang="scss">
::v-deep.iScrollVerticalScrollbar.iScrollLoneScrollbar {
    z-index: 1 !important;
}

.wrapper {
    position: relative;
    width: 525px;
    height: 382px;
    overflow: hidden;
    /* Prevent native touch events on Windows */
    touch-action: none;
    /* Prevent text resize on orientation change, useful for web-apps */
    text-size-adjust: none;
    .downBtn {
        position: absolute;
        cursor: pointer;
        right: 1rem;
        width: 2rem;
        height: 2rem;
        bottom: 2rem;
        &::before {
            content: "V";
            position: absolute;
            background: rgba(204, 204, 204, 0.2);
            width: 2rem;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            border-radius: 50%;
            top: 60%;
            left: 50%;
            transform: translateX(-50%);
        }
        span {
            background: #409eff;
            padding: 0.1rem 0.5rem;
            font-size: 0.7rem;
            border-radius: 0.5rem;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .scroller {
        position: absolute;
        width: calc(100% - 1.5rem);
        padding: 0.5rem;
        padding-right: 1.5rem;

        /* Prevent elements to be highlighted on tap */
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

        /* Put the scroller into the HW Compositing layer right from the start */
        transform: translateZ(0);
        .web__main-item {
            position: relative;
            font-size: 0;
            margin-bottom: 10px;
            padding-left: 60px;
            min-height: 68px;
            text-align: left;
        }

        .web__main-user,
        .web__main-text {
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
        }

        .web__main-user {
            position: absolute;
            cursor: pointer;
            left: 3px;
            img {
                width: 40px;
                height: 40px;
                border-radius: 100%;
            }
            cite {
                position: absolute;
                left: 60px;
                top: -2px;
                /* width: 500px; */
                line-height: 24px;
                font-size: 12px;
                white-space: nowrap;
                color: #999;
                text-align: left;
                font-style: normal;
                i {
                    padding-left: 15px;
                    font-style: normal;
                }
            }
        }

        .web__main-text {
            max-width: 75%;
            position: relative;
            line-height: 22px;
            margin-top: 25px;
            padding: 8px 15px;
            background-color: #f3f3f3;
            border-radius: 3px;
            border: 1px solid #f0f0f0;
            color: #000;
            word-break: break-all;
        }

        .web__main-arrow {
            top: 6px;
            left: -8px;
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            border-width: 8px;
            border-left-width: 0;
            border-right-color: #ebeef5;
            &::after {
                content: " ";
                top: -7px;
                left: 1px;
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                border-width: 7px;
                border-left-width: 0;
                border-right-color: #ebeef5;
            }
        }

        .web__main-item--mine .web__main-text .web__main-arrow {
            left: auto;
            right: -5px;
            border-color: transparent;
            border-style: solid;
            border-width: 8px;
            border-right-width: 0;
            border-left-color: #409eff;
            &::after {
                left: auto;
                right: -2px;
                border-color: transparent;
                border-style: solid;
                border-width: 7px;
                border-right-width: 0;
                border-left-color: #409eff;
            }
        }

        .web__main-list {
            margin: 10px 0;
            li {
                height: 30px;
                color: #409eff;
                line-height: 30px;
            }
        }

        .web__main-item--mine {
            text-align: right;
            padding-left: 0;
            padding-right: 60px;
            .web__main-user {
                left: auto;
                right: 3px;
                cite {
                    left: auto;
                    right: 60px;
                    text-align: right;
                    i {
                        padding-left: 0;
                        padding-right: 15px;
                    }
                }
            }
            .web__main-text {
                margin-left: 0;
                text-align: left;
                background-color: #409eff;
                color: #fff;
                img {
                    max-width: 200px;
                }
            }
        }

        .empty {
            margin-top: 20%;
        }
    }
}
</style>