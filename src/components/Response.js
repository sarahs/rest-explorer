import React from 'react'

class Response extends React.Component {
  render () {
    const {
      responseOrError,
      includeStatus,
      includeHeaders,
      copySuccess,
      copyType,
      onCopy
    } = this.props

    return (
      <div className='response'>
        {includeStatus
          ? (<div className='status'>
            <div className='status-buttons'>
              <p>Status:</p>
              <span className='copy-span'><button onClick={e => onCopy(e, 'status')}>Copy</button>{copyType === 'status' ? copySuccess : null}</span>
            </div>
            <pre>{responseOrError.status + ' ' + responseOrError.statusText}</pre>
          </div>)
          : null
        }
        {includeHeaders
          ? (<div className='headers'>
            <div className='headers-buttons'>
              <p>Headers:</p>
              <span className='copy-span'><button onClick={e => onCopy(e, 'headers')}>Copy</button>{copyType === 'headers' ? copySuccess : null}</span>
            </div>
            <pre>{JSON.stringify(responseOrError.headers, null, 2)}</pre>
          </div>)
          : null
        }
        <div className='data'>
          <div className='data-buttons'>
            <p>Response:</p>
            <span className='copy-span'><button onClick={e => onCopy(e, 'data')}>Copy</button>{copyType === 'data' ? copySuccess : null}</span>
          </div>
          <pre>{JSON.stringify(responseOrError.data, null, 2)}</pre>
        </div>
      </div>
    )
  }
}

export default Response
