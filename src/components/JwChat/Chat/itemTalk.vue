<template>
    <span class="item_msg" @click="itemCallback">
        <span v-if="type == 'text'">{{ content }}</span>
        <img
            class="web__msg--img"
            v-if="type == 'image'"
            :src="content"
            alt
            @click="showDialog({ tag: 'image' })"
            @load="load('img')"
        />
        <audio
            class="web__msg--audio"
            v-if="type == 'voice'"
            style="width: 20rem; height: 20px"
            :src="content | parseVoice"
            controls="controls"
            @canplaythrough="load('audio')"
        />
        <span
            v-if="type == 'location'"
            @click="showDialog({ tag: 'location' })"
            class="location"
            :class="mine ? 'text-white' : 'text-blue'"
            >{{ content | parseLocation }}<i class="el-icon-location"></i
        ></span>

        <!-- 查看区域 -->
        <el-dialog
            :visible.sync="show"
            width="40%"
            append-to-body
            :before-close="handleClose"
            class="web__dialog"
        >
            <img
                :src="imgSrc"
                v-if="imgSrc"
                style="width: 100%; object-fit: cover"
            />
            <tencent-map
                ref="mymap"
                v-if="location"
                :longitude="location.longitude"
                :latitude="location.latitude"
            ></tencent-map>
        </el-dialog>
    </span>
</template>

<script>
import TencentMap from "@/components/TencentMap";
export default {
    components: { TencentMap },
    filters: {
        parseLocation(content) {
            const location = JSON.parse(content);
            return location.name || location.address;
        },
        parseVoice(content) {
            const voice = JSON.parse(content);
            return voice.path;
        },
    },
    props: {
        content: String,
        type: {
            type: String,
            default: "text",
        },
        mine: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            tags: ["img", "video", "audio"],
            /* 查看文件详情 */
            show: false,
            imgSrc: "",
            videoSrc: "",
            audioSrc: "",
            loadState: false,

            location: undefined,
        };
    },
    computed: {
        getTag() {
            const str = this.text || "";
            let tag = "span";
            let type = "";
            if (str.match(/<\/?[^>]+>/)) {
                type = str.split(" ")[0].replace(/<|>/, "") || "";
                if (this.tags.includes(type)) {
                    tag = type;
                }
            }
            return tag;
        },
        getData() {
            const str = this.text || "";
            const dom = document.createElement("div");
            dom.innerHTML = str;
            const target = dom.firstChild;

            const src = target.getAttribute("data-src");
            const controls = target.getAttribute("controls") || false;
            return {
                src,
                controls,
            };
        },
    },
    mounted() {
        if (this.tags.includes(this.type)) return;
        this.$nextTick(() => {
            this.$emit("loadDone", { type: this.type, target: this.content });
        });
    },
    methods: {
        load(type) {
            if (this.loadState) return;
            this.loadState = true;
            this.$emit("loadDone", { type, target: this.text });
        },
        handleClose(done) {
            this.imgSrc = undefined;
            this.location = undefined;
            done();
        },
        showDialog({ tag }) {
            const content = this.content;
            const callback = () => {
                if (tag === "image") {
                    this.imgSrc = this.content;
                    this.show = true;
                } else if (tag === "location") {
                    this.location = JSON.parse(this.content);
                    this.show = true;
                }
            };
            if (typeof this.beforeOpen === "function") {
                this.beforeOpen({ tag, content }, callback);
            } else {
                callback();
            }
        },
        itemCallback() {
            this.$emit("systemEvent", this.text);
        },
        parseText() {
            let { text } = this;
            if (!text) return;
            text = text.replace(/\n/g, "<br/>");
            //   const html = emojiParser(text).replace(/<img src/g, '<img data-class="iconBox" src')
            return text;
        },
    },
};
</script>
<style lang="scss" scoped>
.item_msg {
    padding: 0px;
    margin: 0px;
    display: inline-block;
    display: flex;
    .web__msg--img,
    .web__msg--video,
    .web__msg--file {
        max-width: 250px;
        min-width: 50px;
        width: 100%;
        margin: 10px 0;
        border: 1px solid #eee;
        overflow: hidden;
        border-radius: 5px;
        cursor: pointer;
        display: block;
    }
    .web__msg--img[data-class="iconBox"] {
        max-width: 24px;
        min-width: unset;
        border: none;
        margin: 0;
        vertical-align: bottom;
        display: inline-block;
    }

    .location:hover {
        cursor: pointer;
    }
}
</style>