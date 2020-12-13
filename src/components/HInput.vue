<template>
  <div>
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false, // 关闭继承属性
  props: {
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)

      // 校验
      this.$parent.$emit('valiate')
    },
  },
  name: 'HInput',
}
</script>

<style lang="scss" scoped></style>
