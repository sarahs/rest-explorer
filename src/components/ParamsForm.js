import React from 'react'
import ParamsTable from './ParamsTable'
import PathInput from './PathInput'

const ParamsForm = ({
  pathParamsArray,
  pathArray,
  apiBase,
  enteredPathParams,
  onPathChange,
  inputRef,
  method,
  bodyParamsArray,
  enteredBodyParams,
  onBodyChange,
  onClearPath,
  onClearBody,
  isPathComplete,
  isBodyComplete
}) => {
  return (
    <div>
      {pathParamsArray.length > 0 ? (
        <div className='pathinput'>
          {isPathComplete
            ? <h2 className='path-complete'>Enter path parameters</h2>
            : <h2 className='path-not-complete'>Enter path parameters</h2>
          }
          <pre>
            <PathInput
              pathArray={pathArray}
              apiBase={apiBase}
              enteredPathParams={enteredPathParams}
              onChange={onPathChange}
              inputRef={inputRef}
            />
          </pre>
          <div className='clear-div'>
            <input type='button' value='Clear' onClick={e => onClearPath(e)} />
            {isPathComplete
              ? <span><em>Complete!</em></span>
              : null
            }
          </div>
        </div>
      ) : (null)}
      {bodyParamsArray.length > 0 ? (
        <ParamsTable
          method={method}
          paramsArray={bodyParamsArray}
          enteredBodyParams={enteredBodyParams}
          onChange={onBodyChange}
          onClearBody={onClearBody}
          isBodyComplete={isBodyComplete}
        />
      ) : (null)}
    </div>
  )
}

export default ParamsForm
