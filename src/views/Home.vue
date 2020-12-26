<template>
  <div class="home">
    <HFrom :model="model" :rule="rule" ref="loginForm">
      <HFromItem label="userName" prop="userName">
        <HInput v-model="model.userName" placeholder="默认" />
      </HFromItem>
      <HFromItem label="password" prop="password">
        <HInput v-model="model.password" type="password" />
      </HFromItem>
      <HFromItem>
        <button @click="login">登录</button>
      </HFromItem>
    </HFrom>
    <svg-icon icon-class="wx"></svg-icon>

    <HTable></HTable>
  </div>
</template>

<script>
import HInput from '@/components/HInput.vue'
import HFromItem from '@/components/HFromItem.vue'
import HFrom from '@/components/HFrom.vue'
import HTable from '@/components/HTable'

export default {
  name: 'Home',
  data() {
    return {
      model: {
        userName: 'tom',
        password: '',
      },
      rule: {
        userName: [{ required: true, message: '用户名不能为空' }],
        password: [{ required: true, message: '密码不能为空' }],
      },
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((isValid) => {
        console.log(isValid)
        if (isValid) {
          console.log('submit login')
        } else {
          alert('检验失败')
        }
      })
    },
  },
  components: {
    HFrom,
    HFromItem,
    HInput,
    HTable,
  },
}
</script>
