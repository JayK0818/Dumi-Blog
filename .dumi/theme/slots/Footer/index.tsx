import { Footer } from 'dumi-theme-antd-style'
import React from 'react'

const props = {
  bottom: 'Powered By dumi and dumi-theme-antd-style',
  columns: undefined
}

export default () => {
  return <Footer { ...props }/>
}