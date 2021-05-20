<template>
  <div class="web__msg" @keyup.enter="handleSend">
    <textarea
      v-model="currentMsg"
      rows="3"
      :placeholder="placeholder"
      class="web__msg-input"
      ref="msgBox"
    />
    <div class="web__msg-menu">
      <el-button
        class="web__msg-submit"
        type="primary"
        size="mini"
        @click="handleSend"
        >发送</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'JwChat_enterbox',
  props: {
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    value: {
      type: String,
      default: ''
    },
    insert: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      currentMsg: ""
    }
  },
  watch: {
    value: {
      handler () {
        this.currentMsg = this.value;
      },
      immediate: true
    },
    currentMsg: {
      handler (newval) {
        const msg = newval.trim()
        this.$emit('input', msg)
      },
      immediate: true
    },
    insert (newval) {
      if (newval) {
        this.joinToMsg(newval)
      }
    }
  },
  methods: {
    //用户主动发送
    handleSend (e) {
      const shiftKey = e.shiftKey
      if (shiftKey) return
      this.$emit('submit', this.currentMsg);
      this.$nextTick(() => {
        this.currentMsg = ''
      })
    },
    joinToMsg (str) {
      /* eslint-disable */
      const myField = this.$refs.msgBox
      let afterMsg = this.currentMsg
      //IE浏览器
      if (document.selection) {
        var sel = null
        myField.focus();
        sel = document.selection.createRange();
        sel.text = str;
        sel.select();
      }

      //火狐/网景 浏览器
      else if (myField.selectionStart || myField.selectionStart == '0') {
        //得到光标前的位置
        var startPos = myField.selectionStart;
        //得到光标后的位置
        var endPos = myField.selectionEnd;
        // 在加入数据之前获得滚动条的高度
        var restoreTop = myField.scrollTop;
        afterMsg = afterMsg.substring(0, startPos) + str + afterMsg.substring(endPos, afterMsg.length);
        //如果滚动条高度大于0
        if (restoreTop > 0) {
          // 返回
          myField.scrollTop = restoreTop;
        }
        myField.focus();
        myField.selectionStart = startPos + str.length;
        myField.selectionEnd = startPos + str.length;
      }
      else {
        afterMsg += str;
        myField.focus();
      }
      this.currentMsg = afterMsg
    }
  },
}
</script>
<style scoped lang="scss">
.web__msg {
  padding: 0 10px;
  height: auto;
  overflow: hidden;
  &-input {
    display: block;
    width: 100%;
    height: 60px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    resize: none;
    outline: 0;
    background-color: #fff;
    border: 0;
    word-break: break-all;
    font-size: 13px;
    line-height: 17px;
    -webkit-appearance: none;
  }
  &-menu {
    text-align: right;
  }
  &-submit {
    display: inline-block;
    outline: none;
    cursor: pointer;
    text-align: center;
  }
}
</style>