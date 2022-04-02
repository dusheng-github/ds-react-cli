import dynamicImportIndex from './dynamicImport'
const IndexController = [
  {
    action: 'home',
    name: '首页',
    ensure: (cb) => dynamicImportIndex().then(module => cb(module.default))
  },
]

export default IndexController