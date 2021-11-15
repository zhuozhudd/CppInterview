let plugins = [
  '-lunr',
  '-sharing',
  '-search',
  '-favicon',
  '-code',
  'expandable-chapters',
  'intopic-toc',
  'back-to-top-button',
  'search-pro',
  'splitter',
  'pageview-count'
];
if (process.env.NODE_ENV == 'dev') plugins.push('livereload');

module.exports = {
  title: 'CppInterview',
  author: 'songzhuozhu',
  lang: 'zh-cn',
  description: '秋招总结',
  plugins,
  pluginsConfig: {
    code: {
      copyButtons: true,
    },
    "intopic-toc": {
      "selector": ".markdown-section h1, .markdown-section h2, .markdown-section h3, .markdown-section h4, .markdown-section h5, .markdown-section h6",
      "mode": "nested",
      "maxDepth": 2,
      "isCollapsed": false,
      "isScrollspyActive": true,
      "visible": true,
      "label": {
        "de": "In diesem Artikel",
        "en": "In this article"
      },
    },
  },
  variables: {
    themeLou: {
      // 顶部导航栏配置
      nav: [
        {
          target: '_blank', // 跳转方式: 打开新页面
          url: 'https://github.com/zhuozhudd', // 跳转页面
          name: 'Github', // 导航名称
        },

      ],
      // 底部打赏配置
      // footer: {
      //   donate: {
      //     button: '赞赏', // 打赏按钮
      //     avatar:
      //       'http://xkapp-uat.oss-cn-hangzhou.aliyuncs.com/2e7a3f70-80ab-4b50-93ec-a04dfeef949b/avatar-100.png', // 头像地址
      //     nickname: '作者', // 显示打赏昵称
      //     message: '随意打赏，但不要超过一顿早餐钱 💕', // 打赏消息文本
      //     text: '『 赠人玫瑰 🌹 手有余香 』',
      //     wxpay:
      //       'http://xkapp-uat.oss-cn-hangzhou.aliyuncs.com/2e7a3f70-80ab-4b50-93ec-a04dfeef949b/wxpay-any-200.png', // 微信收款码
      //     alipay:
      //       'http://xkapp-uat.oss-cn-hangzhou.aliyuncs.com/2e7a3f70-80ab-4b50-93ec-a04dfeef949b/alipay-any-200.png', // 是否显示版权
      //   },
      //   copyright: true, // 显示版权
      // },
    },
  },
};
