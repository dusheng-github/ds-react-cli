import asyncComponent from 'utils/asyncComponent'

const dynamicImportuserInfo = () => import('./index')

export default dynamicImportuserInfo

export const AsyncUserInfo = asyncComponent(dynamicImportuserInfo)
