<template>
  <div class="toolsBox">
    <template v-if="showEmoji">
      <el-popover placement="top-start" trigger="click" ref="popover">
        <ul class="emjioBox">
          <li v-for="item in Object.keys(emoji)" :key="item" @click="selectEmit(item)">
            <a v-if="emoji[item]&&emoji[item].position" :style="emojiStyle(item)"></a>
            <a v-else-if="emoji[item].length<5">{{emoji[item]}}</a>
            <img v-else :src="emoji[item]" />
          </li>
        </ul>
        <JwChat-icon slot="reference" type="icon-xiaolian" title="表情" />
      </el-popover>
    </template>
    <template v-for="(item,k) in showkeys">
      <span
        v-if="toolConfig[item]"
        :key="item"
      >
        <span @click="bindButton(item)">
          <JwChat-icon :type="toolConfig[item].icon" :title="iconTitle(item,k)" />
        </span>
      </span>
      <i :key="item" v-else :class="item" @click="bindButton(item)"></i>
    </template>
    <slot name="tools" />
  </div>
</template>

<script>
import emoji from '@/utils/emoji'
export default {
  name: "JwChat-tools",
  props: {
    tools: {
      type: Object,
      default: () => {
        return {
          show: ['file'],
          showEmoji: true,
          callback: () => { }
        }
      }
    }
  },
  data () {
    return {
      emoji,
      toolConfig: {
        'file': { icon: 'icon-wenjian', title: '文件' },
        'video': { icon: 'icon-shipin', title: '视频' },
        'img': { icon: 'icon-xiangce', title: '图片' },
        'hongbao': { icon: 'icon-hongbao', title: '红包' },
        'history': { icon: 'icon-lishi', title: '历史' },
        'more': { icon: 'icon-gengduo', title: '更多' },
      },
      newTitle: null
    }
  },
  computed:{
    showEmoji () {
      const { showEmoji = true } = this.tools || {}
      return showEmoji
    },
    showkeys () {
      let keys = Object.keys(this.toolConfig)
      const { show = [] } = this.tools || {}
      let _key = []
      if (show.length > 0) {
        show.forEach(i => {
          if (Array.isArray(i)) {
            this.newTitle = i
            return
          }
          if(keys.includes(i))
           _key.push(i)
        })
        // keys = _key
      }
      return _key
    }
  },
  methods: {
    iconTitle (key, index) {
      let title = ''
      // newTitle = ['自定义标题1', '自定义标题2']
      if (this.newTitle) {
        title = this.newTitle[index] || ''
      }
      if (!title) {
        title = this.toolConfig[key].title
      }
      return title
    },

    selectEmit (type) {
      this.$emit('emoji', type)
      this.$refs.popover.doClose()
    },
    bindButton (type) {
      if (!this.tools.callback) return console.warn('callback not find')
      if (type === 'file') {
        this.openFile(type, this.tools.callback)
      } else {
        this.tools.callback(type)
      }
    },
    openFile (type, callback) {
      var input = document.createElement("input")
      input.type = "file"
      input.multiple = 'multiple'
      input.click();
      input.onchange = function () {
        var file = input.files
        callback(type, file)
      }
    },
    emojiStyle (item) {
      const emojiitem = this.emoji[item]
      if (!emojiitem) return {}
      return {
        display: 'inline-block',
        background: `url('https://res.wx.qq.com/a/wx_fed/webwx/res/static/img/6AfH8-r.png')  no-repeat`,
        width: `28px`,
        height: `28px`,
        'background-position': emojiitem.position,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.toolsBox {
  position: relative;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 30px;
}
i {
  padding-left: 6px;
  font-size: 20px;
  color: #888a91;
}
i:hover {
  color: #76b1f9;
}
.emjioBox {
  background: #fff;
  height: 150px;
  width: 300px;
  overflow: auto;
  text-align: left;
  padding: 0;
  li {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
  }
}
</style>