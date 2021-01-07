<template>
  <div>
    <slot :user="user">{{ user.lastName }}</slot>
    <slot name='other' :user="user">{{ user.lastName }}</slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        lastName: 'wss',
        firstName: 'hxd',
        other: 'other'
      }
    }
  },
}
</script>

<style lang="scss" scoped></style>
