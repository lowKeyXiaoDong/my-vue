<template>
  <div class="about">
    <p v-for="item in arr" :key="item">{{ item }}</p>
  </div>
</template>

<script>
  export default {
    created () {
      this.arr.splice(2, 'f');

      // ! 加key
      /**
       * 第一次patch
       * old: b c d e
       * new: b f c d e
       */
      /**
       * 第二次patch
       * old: c d e
       * new: f c d e
       */
      /**
       * 第三次patch
       * old: c d
       * new: f c d
       */
      /**
       * 第四次patch
       * old: c
       * new: f c
       */
      /**
       * 第五次patch
       * old:
       * new: f
       */
      // result: 以最后一次patch值为参照物，创建f插入



      // ! 不加key
      /**
       * 第一次patch
       * old: b c d e
       * new: b f c d e
       */
      /**
       * 第二次patch
       * old: c d e
       * new: f c d e
       */
      /**
       * 第三次patch
       * old: f d e
       * new: f c d e
       */
      /**
       * 第四次patch
       * old: f c e
       * new: f c d e
       */
      /**
       * 第五次patch
       * old: f c d
       * new: f c d e
       */
      // result: 不一样地方就开始替换3次替换，1次创建
    },
    data() {
      return {
        arr: ['a', 'b', 'c', 'd', 'e']
      }
    },
  }
</script>
