import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

const Picker = ({
  name,
  value,
  onChange,
  options,
  docslink
}) => {
  const selectOptions = options.map(function (i) {
    let selectObj = {}
    selectObj['value'] = i
    selectObj['label'] = i.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    return selectObj
  })

  return (
    <div>
      <h2>Choose {name === 'categoriesListSel' ? 'a REST category' : 'an endpoint'}</h2>
      <Select
        name={name}
        value={value}
        onChange={selectedOption => onChange(selectedOption, name)}
        options={selectOptions}
      />
      {docslink
        ? <div className='docslink'><a href={docslink}>(docs)</a></div>
        : null
      }
    </div>
  )
}

export default Picker
