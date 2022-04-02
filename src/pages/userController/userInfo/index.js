import React, { useState } from 'react'
import { post, get } from 'utils'
import { Table, Tag, Space } from 'antd'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>
          Invite
          {' '}
          {record.name}
        </a>
        <a>Delete</a>
      </Space>
    ),
  },
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

export default function UserInfo() {
  const [count, setCount] = useState(0)
  const clickFunc = () => {
    console.log(1244)
    setCount(count + 1)
    post('/user/query').then(res => {
      console.log(res, '返回数据')
    })
  }
  return (
    <div>
      <input />
      <button type="button" onClick={clickFunc}>点击+1</button>
      <span>{count}</span>
      <div>
        我是用户信息页面^_^
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}