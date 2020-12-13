<template>
  <div>
    child
    {{ this.$parent.nameParent }}

    {{ this.$attrs.value }}
    <Children />

    <button @click="this.$listeners.some">listeners</button>
  </div>
</template>

<script>
  import Children from './children'

  export default {
    components: {
      Children,
    },
    mounted () {
      console.log(this.$children)
    },
    name: 'child'
  }
</script>

<style lang="scss" scoped>

</style>