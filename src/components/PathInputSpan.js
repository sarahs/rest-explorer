import React from 'react'
import AutosizeInput from 'react-input-autosize'

const PathInputSpan = ({name, enteredPathParams, i, onChange}) => (
  <AutosizeInput
    type="text"
    name={name}
    value={enteredPathParams[name] || name}
    key={i}
    onChange={e => onChange(e)}
  />
)

export default PathInputSpan
