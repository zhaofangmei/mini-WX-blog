// pages/components/mytree/mytree.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    treeData: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    }

  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    //console.log(this.data.treeData)
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    replyTo: function(e) {
      let item = e.target.dataset.item
      console.log('child...', item)
      this.triggerEvent('replyToEvent', { data: item}) //myevent自定义名称事件，父组件中使用
    },
    replyToEvent: function (e) {
      let item = e.detail.data
      console.log('parent00...', item)
      this.triggerEvent('replyToEvent', { data: item })

    },

  }
})
