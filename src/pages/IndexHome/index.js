import React, { Fragment, useState } from 'react'
import './index.less'

export default class IndexHome extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {
      obj: { a: { b: { c: 1 } } },
    }
  }

  handleClick = () => {
    const { obj } = this.state
    obj.a.b.c = 2
    this.setState({ obj })
  }

  render() {
    const { obj } = this.state
    return <div>111</div>
  }
}
