import React from 'react'

class CurlResults extends React.Component {
  render () {
    const {
      hasEnteredToken,
      categoriesListSel,
      includeHeaders,
      method,
      SubmittedPath,
      SubmittedBodyParams,
      copyRef,
      copySuccess,
      copyType,
      onCopy,
      endpointName
    } = this.props

    const methodLine = method && '  -X "' + method + '"\n'

    return (
      <div className='generated-curl'>
        <div className='generated-curl-header'>
          {endpointName
            ? <h2>API Endpoint: {endpointName}</h2>
            : ''
          }
          <span className='copy-span'>
            <button onClick={e => onCopy(e, 'results')}>Copy</button>
            {copyType === 'results' ? copySuccess : null}
          </span>
        </div>
        {hasEnteredToken
          ? categoriesListSel
            ? (<pre ref={copyRef}>curl{includeHeaders ? ' -i' : null}{'\n'}
              {'  '}-H "Authorization: token STORED_API_TOKEN"{'\n'}
              {methodLine}
              {'  '}"{SubmittedPath}"
              {SubmittedBodyParams
                ? "\n  -d '" + SubmittedBodyParams + "'"
                : null
              }
            </pre>)
            : <pre>Start by choosing a category below.</pre>
          : <pre>You need to enter an API token!</pre>
        }
      </div>
    )
  }
}

export default CurlResults
