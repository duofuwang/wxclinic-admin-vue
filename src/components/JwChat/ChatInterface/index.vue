<template>
  <div class="ChatPage" :style="faceSize">
    <WinBar v-if="JSON.stringify(winBarConfig)!=='{}'" class="winBar"  :config="winBarConfig" @click="winBarClick"/>
    <div class="header">
      <JwChat-item :config="config" @click="bindClick" />
      <slot name="header" />
    </div>
    <div class="main">
      <div class="chatBox">
        <JwChat
          :taleList="taleList"
          @enter="$emit('enter', $event)"
          v-model="msg"
          :toolConfig="toolConfig"
          :scrollType="scrollType"
          :width="realWidth"
          :height="chatHeight"
          :config="chatConfig"
          :quickList="quickList"
          @clickTalk="$emit('clickTalk',$event)"
        >
          <slot name="tools" slot="tools" />
        </JwChat>
      </div>
      <div class="rightBox" v-if="showRightBox">
        <span  @click="switchBox = !switchBox">
          <JwChat-icon class="switch" :type="switchIcon"/>
        </span>
        <slot v-if="switchBox"/>
      </div>
    </div>
  </div>
</template>

<script>
import WinBar from './windowBar'
export default {
  name: "JwChat-index",
  components:{
    WinBar
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        img: 'image/cover.png',
        name: 'JwChat',
        dept: '最简单、最便捷',
        callback: () => { }
      })
    },
    showRightBox: {
      type: Boolean,
      default: true
    },
    taleList: {
      type: Array,
      default: () => {
        return []
      }
    },
    height: {
      type: String,
      default: "570"
    },
    width: {
      default: "750"
    },
    value: {
      default: ''
    },
    toolConfig: {
      type: Object
    },
    winBarConfig:{
      type: Object,
      default: ()=>({})
    },
    scrollType: {
      default: "noroll"
    },
  },
  data () {
    return {
      chatHeight: '',
      msg: '',
      switchBox: true,
    }
  },
  computed: {
    faceSize () {
      let height = this.height
      let width = this.width + ''
      if (height.match(/\d$/)) {
        height += 'px'
      }
      if (width.match(/\d$/)) {
        width += 'px'
      }
      const style = { height, width }
      return style
    },
    chatConfig () {
      const { historyConfig = {} } = this.config || {}
      return { historyConfig }
    },
    switchIcon(){
      let result = 'icon-jiantou-xiangzuo'
      if(this.switchBox) result = 'icon-jiantou-xiangyou'
      return result
    },
    realWidth(){
      const width = this.width
      let ratio = 1
      if(this.showRightBox&&this.switchBox)  ratio = .7
      return width * ratio+''
    },
    quickList(){
      const { quickList=[]} = this.config
      return quickList
    }
  },
  watch: {
    height: {
      handler () {
        this.chatHeight = this.height - 60 + ''
      },
      immediate: true
    },
    value: {
      handler () {
        this.msg = this.value;
      },
      immediate: true
    },
    msg: {
      handler () {
        this.$emit('input', this.msg);
      },
      immediate: true
    },
    showRightBox:{
      handler (newval) {
        if(typeof newval === 'boolean')
          this.switchBox = newval
      },
      immediate: true
    }
  },
  methods: {
    bindClick (type) {
      const { callback } = this.config || {}
      if (callback) {
        callback(type)
      }
    },
    winBarClick(play) {
      const {callback = null} = this.winBarConfig
      if(callback){
        callback(play)
      }
    }
  }
}
</script>

<style  scoped lang="scss">
.ChatPage {
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  .winBar{
    position: absolute;
    transform: translateX(-100%);
  }
  .header {
    background-color: #409eff;
    display: flex;
    margin: 0 auto;
    padding-left: 12px;
    align-items: center;
    height: 60px;
    position: relative;
    color: #fff;
  }

  .main {
    display: flex;
    height: calc(100% - 60px);

    .rightBox {
      box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.1);
      width: 45%;
      position: relative;

      .switch {
        position: absolute;
        left: -1.2rem;
        top: 20%;
        background:rgba(204,204,204,0.5);
        padding: 0.3rem 0 0.3rem 0.1rem;
        border-radius: 100% 0 0 100%;
        color:#fff;
        cursor: pointer;
        &:hover{
          background:#409eff;
        }
      }

    }
  }
}

</style>
