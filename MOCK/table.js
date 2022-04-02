import Mock from 'mockjs'
// 用户表
Mock.mock('mock/Personnel/staffEntry', {
  code: 0,
  msg: '成功',
  data: {
    'list|100':
      [{
        time: '@datetime', // 随机生成日期时间
        phone: /1[1-9]{10}/,
        'gender|1': [
          '男',
          '女',
        ],
        org: '@title',
        department: '@title',
        post: '@title',
        progress: '@title',
        name: '@cname', // 随机生成中文名字
      }]
  }
})

// 权限表
Mock.mock('mock/Basic/Org/permission', {
  errno: 0,
  data:
      {
        mtime: '@datetime', // 随机生成日期时间
        'score|1-800': 800, // 随机生成1-800的数字
        'rank|1-100': 100, // 随机生成1-100的数字
        'stars|1-5': 5, // 随机生成1-5的数字
        nickname: '@cname', // 随机生成中文名字
      }
})