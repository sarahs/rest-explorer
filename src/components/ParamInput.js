import React from 'react'

const ParamInput = ({onChange, name, value}) => (<td>
  <input
    type="text"
    name={name}
    value={value}
    onChange={e => onChange(e)}
  />
</td>)

export default ParamInput
