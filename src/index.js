/* eslint-disable */
import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import IndexHome from './pages/IndexHome'
import UserInfo from './pages/userController/userInfo'

const rootElement = document.getElementById('app')
if (module.hot) {
  module.hot.accept()
}
render(
  <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element={<IndexHome />} />
        <Route path="/user" element={<UserInfo />} />

      </Routes>
    </div>
  </BrowserRouter>,
  rootElement
)