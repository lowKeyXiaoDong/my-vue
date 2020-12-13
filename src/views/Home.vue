<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <Child :nameParent="nameParent" value='hxd' @some="some" />
  </div>
</template>

<script>
import Child from '@/components/child.vue'

export default {
  name: 'Home',
  data () {
    return {
      nameParent: 'parent'
    }
  },
  provide() {
    return {
      foo: 'foo'
    }
  },
  methods: {
    some () {
      console.log('listeners');
    }
  },
  components: {
    Child
  }
}
</script>
