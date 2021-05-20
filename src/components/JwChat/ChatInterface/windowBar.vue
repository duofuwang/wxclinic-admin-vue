<!--
 * @Author: your name
 * @Date: 2021-03-04 17:23:51
 * @LastEditTime: 2021-04-25 15:21:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \JChat\src\components\ChatInterface\windowBar.vue
-->
<template>
  <div class="windowBar" :style="winBarStyle">
    <!-- <div class="toolBarBox">
      <img src="image/three.jpeg" alt="">
    </div> -->
    <div class="winBarBox" ref="windowBar">
      <div>
        <div
          v-for="item in winList" :key="item.id" :ref="`winItem${item.id}`"
          @click.stop="bindClick(item)" :style="winItemStyle"
          :class="{'winItem':true,'winActive': activeItem == item.id}" >
          <JwChat-item :config="item"/>
          <div class="itemOperation">
            <el-button type="info" icon="el-icon-close" circle size="mini"
             @click.stop="bindOperation({ type: 'remove', target: item})" />
          </div>
        </div>
        <template v-if="!winList.length">
          <JwChat-empty size="8rem" />
          <el-divider  style="padding: 0 5px;">
            <span style="font-size: 0.2rem;">暂无会话</span>
          </el-divider>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from '@/utils/scroll'
export default {
  props:{
    config:{
      typeof: Object,
      default:()=>({
        list: [],
        active: null,
        width: '150px',
        listHeight: '60px'
      })
    }
  },
  data () {
    return {
      activeItem: 0,
      moveObj: {},
      scroll: null,
      complete: null,
      operationTimer: null
    }
  },
  computed: {
    winList(){
      const { list = [] } = this.config
      const winList = list 
      return winList
    },
    winItemStyle() {
      const { listHeight: height = '60px' } = this.config 
      return {
        height
      }
    },
    winBarStyle() {
      const { width ='150px' } = this.config 
      return {
        width
      }
    }
  },
  watch: {
    'config.active': {
      handler(newVal) {
        if(newVal){
          this.activeItem = newVal
        }
      },
      deep:true,
      immediate:true
    },
    'config.list': {
      handler(newVal) {
        if(newVal){
          this.scrollRefresh()
        }
      },
      deep:true,
      immediate:true
    }
  },
  mounted () {
    const dom = this.$refs.windowBar
    this.scroll = new Scroll(dom, {
      click: true,
      scrollbars: true,
      mouseWheel: true,
      preventDefault: false,
      interactiveScrollbars: true,
      hijackInternalLinks: true,
      mouseWheelSpeed: 1
    })
  },
  methods: {
    bindClick(play){
      const {id} = play
      this.activeItem = id
      this.$emit('click',{type: 'winBar', data: play})
    },
    bindOperation(play) {
      this.$emit('click',{type: 'winBtn', data: play})
    },
    scrollRefresh () {
      if(!this.scroll) return
      const that = this
      that.complete = setInterval(function () {
        // 判断文档和所有子资源(图片、音视频等)已完成加载
        if (document.readyState === 'complete') {
          window.clearInterval(that.complete)
          that.scroll.refresh()
        }
      }, 50)
    },
  }
}
</script>

<style lang='scss' scoped>
.windowBar {
  background: #fff;
  height: 100%;
  min-width: 150px;
  overflow: hidden;
  display: flex;
  border-right: 1px solid #dcdfe6;
  .toolBarBox{
    $barSize: 60px;
    width: $barSize;
    border-right: 1px solid #dcdfe6;
    img{
      width: 50px;
    }
  }
  .winBarBox{
    padding:0 5px;
    margin-top: 15px;
    width: calc(100% - 10px);
    height: calc(100% - 20px);
  }
  .winItem {
    display: flex;
    align-items: center;
    position: relative;
    transition: transform 0.6s;
    background: #fff;
    user-select: none;
    border: 1px solid #f9f9f9;
    overflow: hidden;
    &:hover{
      background: #f9f9f9;
      .itemOperation{
        opacity: 1;
        transform: translateY(0);
      }
    }
    &.winActive{
      background: #f0f0f0;
    }
    .itemOperation{
      position: absolute;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 100%;
      padding: 0 5px;
      right: 0;
      opacity: 0;
      transform: translateY(100%);
      right: 0;
      ::v-deep .el-button{
        margin: 0;
        padding: .06rem;
        margin-bottom: .4rem;
        &:hover{
          background-color: #f56c6c;
          border-color: #f56c6c;
        }
      }
    }
  }
  ::v-deep .el-divider__text{
    padding: 0 5px;
  }
}
</style>
