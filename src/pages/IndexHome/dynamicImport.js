import asyncComponent from 'utils/asyncComponent'

const dynamicImportIndex = () => import('./index')

export default dynamicImportIndex

export const AsyncBlog = asyncComponent(dynamicImportIndex)
