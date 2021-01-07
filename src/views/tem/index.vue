<template>
  <div>
    tem

    <Couse>
      <!-- 具名插槽 -->
      <template #header> header </template>

      <template #footer> footer </template>

      Couse
    </Couse>

    <!-- 作用域插槽 -->
    <fun-couse>
      <template v-slot="{ user }">
        {{ user.firstName }}
      </template>

      <template v-slot:other="slotProps">
        {{ slotProps.user.other }}
      </template>
    </fun-couse>
  </div>
</template>

<script>
import Couse from './components/couse'
import funCouse from './components/funCouse'
export default {
  data() {
    return {}
  },
  components: {
    Couse,
    funCouse,
  },
}
</script>

<style lang="scss" scoped></style>
