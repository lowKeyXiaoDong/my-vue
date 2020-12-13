<template>
  <div>
    <!-- label -->
    <label v-if="label">{{ label }}</label>

    <!-- 插槽内容 -->
    <slot></slot>

    <!-- 错误提示 -->
    <p v-if="eroor">{{ eroor }}</p>
  </div>
</template>

<script>
import Schema from 'async-validator'

export default {
  inject: ['form'],
  props: {
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
    },
  },
  data() {
    return {
      eroor: '',
    }
  },
  methods: {
    valiate() {
      const value = this.form.model[this.prop]
      const rules = this.form.rule[this.prop]

      const validator = new Schema({ [this.prop]: rules })

      return validator.validate({ [this.prop]: value }, (eroors) => {
        if (eroors) {
          this.eroor = eroors[0].message
        } else {
          this.eroor = ''
        }
      })
    },
  },
  mounted() {
    this.$on('valiate', () => {
      this.valiate()
    })
  },
  name: 'HFromItem',
}
</script>

<style lang="scss" scoped></style>
