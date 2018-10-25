推荐网址：

腾讯云快速开发（nodejs前后端）：https://developers.weixin.qq.com/miniprogram/dev/qcloud/qcloud.html#%E5%AF%BC%E5%85%A5-nodejs-demo-%E5%92%8C%E9%85%8D%E7%BD%AE

参考项目地址（nodejs前后端）：https://github.com/CavinCao/ghost-wechat-blog

SQL Query Builder for JS：https://knexjs.org/#Builder-increment

偶项目地址：https://github.com/zhaofangmei/mini-WX-blog

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



（2）“启动单步调试”，设置断点，即可本地调试nodejs服务端 （腾讯云的“启动单步调试”选项存在安全问题已经下线了 10.11）

 

 

 

5、首页博客展示

微信小程序分页效果实现：

https://blog.csdn.net/yuyuking/article/details/78796406

https://www.cnblogs.com/xuzhengzong/p/6943627.html

 

 

6、博客详情查看、编辑、删除功能

（1）

modal：类似于javascript中的confirm弹框 ：https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxshowmodalobject

首页进入详情页，鉴权操作；鉴权要是在home的判断会出现两次跳转进入详情页，鉴权操作应该在详情页的onload事件判断



 

 （2）openid

7、博客评论功能

（1）用户评论成功，重新加载页面　　
　　//判断是否有打开过页面
　　if (getCurrentPages().length != 0) {
　　　　//刷新当前页面的数据
　　　　getCurrentPages()[getCurrentPages().length - 1].onLoad()
　　}
（2）盖楼式评论---数据库设计
　　这个真的是难倒我这个不精水的前端了，之前没接触过。感谢万能的网友，网上有好多意见
　　　　1、拆分两个表：评论表和回复表（https://blog.csdn.net/ztchun/article/details/71106117）；
　　　　2、单个评论表加上评论id：parentid作为标识。（https://blog.csdn.net/u014702653/article/details/54709553）
　　其实最好的做法是分表分库，可以节省重复查询，提高效率。
　　个人采用了单表设计，加了parentid作为标识。一次性查出该博客的所有评论，再对数据进行筛选（递归）
　　针对页面树形图展示，使用自定义组件，可以参考
　　　　https://www.jianshu.com/p/dabca0161993?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
　　　　https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html
　　　　　
·（3）回复应该有一个评论/回复的消息推送（后续吧）
8、博客转载（分享事件）

 

9、我的页面功能完善

 

问题记录：

（1）2018-08-23  ： emoji错误：ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: Incorrect string value:

（2）2018-10-24：Maximum call stack size exceeded（栈溢出，使用递归，无限循环下去了）https://blog.csdn.net/u014291497/article/details/52124410
