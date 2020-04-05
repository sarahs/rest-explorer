import React from 'react'

const Markdown = require('react-remarkable')

const EndpointInfo = ({ description }) => (
  <div className='description'>
    <h2>Description</h2>
    <div><Markdown source={description} /></div>
  </div>
)

export default EndpointInfo
