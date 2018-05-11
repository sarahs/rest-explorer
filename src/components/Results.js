import React from 'react'

class Results extends React.Component {
  render() {
    const {
      hasEnteredToken,
      categoriesListSel,
      method,
      SubmittedPath,
      SubmittedBodyParams,
      copyRef,
      copySuccess,
      onCopy,
      endpointName
    } = this.props

    const methodLine = method && "  -X \"" + method + "\"\n"

    return (
      <div className="generated-curl">
        <div className="generated-curl-header">
          {endpointName
            ? <h2>Generated cURL: {endpointName}</h2>
            : <h2>Generated cURL</h2>
          }
          <span className="copy-span"><button onClick={e => onCopy(e)}>Copy</button>{copySuccess}</span>
        </div>
        {hasEnteredToken
          ? categoriesListSel
            ? (<pre ref={copyRef}>curl{"\n"}
                {"  "}-H "Authorization: bearer STORED_API_TOKEN"{"\n"}
                {methodLine}
                {"  "}"{SubmittedPath}"
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

export default Results
