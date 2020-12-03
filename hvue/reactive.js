// Object.defineProperty

function defineReactive(obj, key, val) {
  // 递归调用
  observer(val)

  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key);
      return val
    },
    set(v) {
      if (v !== val) {
        console.log('set', key)
        val = v
      }
    }
  })
}

// 对象响应式: 遍历每一个key,对其进行defineReactive
function observer(obj) {
  // 判断obj是否为对象
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  // 遍历监听对象所有key进行响应式操作
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  baz: 'baz',
  bar: {
    a: 1
  }
}

observer(obj)

set(obj, 'dong', 'dong')

obj.dong