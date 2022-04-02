import React, { useState } from 'react'
import { post, get } from 'utils'
export default function UserLogin() {
  const [count, setCount] = useState(0)
  const clickFunc = () => {
    setCount(count + 1000)
    post('/user/query').then(res => {
      console.log(res, '返回数据')
    })
    clickFunc()
  }
  return (
    <div>
      <button type="button" onClick={clickFunc}>点击+1000</button>
      <div>
        我是用户登录页面^_^
        {count}
      </div>
    </div>
  )
}