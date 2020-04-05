import React from 'react'
import ParamInput from './ParamInput'

const Markdown = require('react-remarkable')

const arrayRegex = /.*?\[\]/

const ParamsTable = ({
  method,
  paramsArray,
  enteredBodyParams,
  onChange,
  onClearBody,
  isBodyComplete
}) => {
  return (
    <div>
      {isBodyComplete
        ? <h2 className='body-complete'>Enter {method === 'GET' ? 'query string' : 'request body'} parameters</h2>
        : <h2 className='body-not-complete'>Enter {method === 'GET' ? 'query string' : 'request body'} parameters</h2>
      }
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Default</th>
            <th>Description</th>
            <th>Enter:</th>
          </tr>
        </thead>
        <tbody>
          {paramsArray.map((p, i) =>
            <tr key={i}>
              <td><code>{p['name']}</code></td>
              <td><code>{arrayRegex.test(p['type']) ? 'array of ' + p['type'].match(arrayRegex)[0].replace(/\[\]/, 's') : p['type']}</code></td>
              {p['required'] ? <td><code>{p['required'].toString()}</code></td> : <td><code>N/A</code></td> }
              {p['default'] ? <td><code>{p['default'].toString()}</code></td> : <td><code>N/A</code></td> }
              <td><Markdown source={p['description']} /></td>
              <ParamInput
                name={p['name']}
                value={enteredBodyParams[p['name']] || ''}
                onChange={onChange}
              />
            </tr>
          )}
        </tbody>
      </table>
      <div className='clear-div'>
        <input type='button' value='Clear' onClick={e => onClearBody(e)} />
        {isBodyComplete
          ? <span><em>Complete!</em></span>
          : null
        }
      </div>
    </div>
  )
}
export default ParamsTable
