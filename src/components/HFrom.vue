<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      form: this,
    }
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    rule: {
      type: Object,
    },
  },
  methods: {
    validate(cb) {
      console.log(cb)
      const tasks = this.$children.filter((item) => item.prop).map((item) => item.valiate())

      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false))
    },
  },
  name: 'HFrom',
}
</script>

<style lang="scss" scoped></style>
