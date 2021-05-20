<!--
 * @Author: your name
 * @Date: 2021-03-02 21:17:22
 * @LastEditTime: 2021-03-09 22:34:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \JChat\src\components\Chat\sysTalk.vue
-->
<template>
  <div class='systemTalk'>
    <div class="title">{{text.title}}</div>
    <div class="subtitle">{{text.subtitle}}</div>
    <div v-for="item in text.content" :key="JSON.stringify(item)">
      <el-link type="primary" @click.stop="itemCallback(item)">{{item.text}}</el-link>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    text: {
      type: Object,
      default: ()=>({})
    }
  },
  methods: {
    itemCallback(itemData){
      this.$emit('systemEvent', itemData)
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.$emit('loadDone', {type: 'system', target: this.text})
    })
  }
}
</script>

<style lang='scss' scoped>
  //@import url(); 引入公共css类
  .systemTalk{
    padding: 0px;
    margin: 0px;
    display: inline-block;
    .title{
      width: 100%;
      font-weight: bold;
      border-bottom: 1px solid #dcdfe6;
    }
    .subtitle{
      font-size: .5rem;
    }
  }
</style>
