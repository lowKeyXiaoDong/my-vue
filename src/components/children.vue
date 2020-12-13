<template>
  <div>
    children

    {{ foo }}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        childrenName: 'childrenName'
      }
    },
    inject: ['foo'],
    name: 'children'
  }
</script>

<style lang="scss" scoped>

</style>