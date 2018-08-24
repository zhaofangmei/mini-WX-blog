推荐网址：

腾讯云快速开发（nodejs前后端）：https://developers.weixin.qq.com/miniprogram/dev/qcloud/qcloud.html#%E5%AF%BC%E5%85%A5-nodejs-demo-%E5%92%8C%E9%85%8D%E7%BD%AE

参考项目地址（nodejs前后端）：https://github.com/CavinCao/ghost-wechat-blog

1、整体页面框架搭建：首页、发表、我的

 

2、授权登录

　　https://developers.weixin.qq.com/miniprogram/dev/api/open.html

　　this.setData：内置函数，可以设置data数据，可通过逻辑层改变数据

　　wx.redirectTo：关闭当前页面，调到应用内的页面

　　wx.switchTab：跳转tabBar页面，关闭其他非tabBar页面

 

3、post建表

 

（1）登录腾讯云，进入腾讯云开发环境管理页面，进入数据库





（2）进入数据库建表



 

 4、博客发表功能开发

wx.request(OBJECT)：发起网络请求

Wafer 服务端 SDK - Node.js： wafer-node-sdk

nodejs开发环境本地调试：

（1）先将server代码上传



（2）“启动单步调试”，设置断点，即可本地调试nodejs服务端

 

 

 

5、首页博客展示

微信小程序分页效果实现：

https://blog.csdn.net/yuyuking/article/details/78796406

https://www.cnblogs.com/xuzhengzong/p/6943627.html

 

 

6、博客详情查看、编辑、删除功能

 

7、博客评论功能

 

8、博客转载

 

9、我的页面功能完善

 

问题记录：

（1）2018-08-23  ： emoji错误：ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: Incorrect string value:
