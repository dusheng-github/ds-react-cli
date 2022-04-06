import dynamicImportoutUseInfo from './userInfo/dynamicImport'

const UserController = [
  {
    action: 'useInfo',
    name: '用户信息',
    ensure: (cb) => dynamicImportoutUseInfo().then((module) => cb(module.default)),
  },
]

export default UserController
