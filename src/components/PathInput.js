import React from 'react'
import PathInputSpan from './PathInputSpan'
import PathConstantSpan from './PathConstantSpan'

const PathInput = ({ pathArray, apiBase, enteredPathParams, onChange, inputRef }) => (
  <code ref={inputRef}>
    {apiBase}
    {pathArray.map((seg, i, arr) =>
      seg.match(/^:/)
        ? arr.length - 1 === i
          ? (<PathInputSpan
            name={seg}
            key={i}
            enteredPathParams={enteredPathParams}
            onChange={onChange}
          />)
          : (<React.Fragment key={i}>
            <PathInputSpan
              name={seg}
              key={i}
              enteredPathParams={enteredPathParams}
              onChange={onChange}
            />
            /
          </React.Fragment>)
        : arr.length - 1 === i
          ? (<PathConstantSpan
            name={seg}
            key={i}
          />)
          : (<PathConstantSpan
            name={seg + '/'}
            key={i}
          />)
    )
    }
  </code>
)

export default PathInput
