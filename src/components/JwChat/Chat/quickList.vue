<!--
 * @Author: your name
 * @Date: 2021-03-14 14:38:32
 * @LastEditTime: 2021-03-26 09:11:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \JChat\src\components\Chat\quickList.vue
-->
<template>
  <div class='quickListBox' v-if="showList.length" ref="quickListBox">
    <div class="quickList">
      <div v-for="(i,k) in showList" :key="k" class="quickItem">
        <span v-html="i.showtext"/>
         <i class="enterBtn el-icon-circle-check" title="选择" @click="submit(i)" />
        <!-- <el-button class="enterBtn" type="mini" @click.stop="submit(i)">选择</el-button> -->
    </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
       scroll: null,
       complete: null
    }
  },
  props: {
    list: {
      type: Array,
      default: ()=>([])
    },
    msg: {
      type: String,
      default: ''
    }
  },
  computed: {
    showList(){
      const msg = this.msg
      if(!msg) return []
      const originList = this.list
      const reg = new RegExp(msg)
      const result = []
      originList.forEach(i=>{
        const {text} = i
        if(reg.test(text)){
          const str = text.replace(reg,`<b>${msg}</b>`) 
          result.push({...i, showtext:str})
        }
      })
      return result
    }
  },
  methods: {
    submit (target) {
      this.$emit('submit',target)
    }
  }
}
</script>

<style lang='scss' scoped>
  //@import url(); 引入公共css类
  .quickListBox{
    padding: 0px;
    margin: 0px;
    text-align: left;
    max-height: 100px;
    overflow: auto;
    width: 100%;
    padding: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 2s;
    box-sizing: border-box;
    .quickItem{
      padding: 0.2rem 0;
      display: flex;
      &:hover{
        background: #fafafa;
      }
      span{
        display: inline-block;
        width: 100%;
        overflow: hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
      .enterBtn{
        align-self: center;
        cursor: pointer;
        &:hover{
          color: red;
        }
      }
    }
  }
</style>
