import React from 'react'

const TokenEntry = ({hasEnteredToken, tokenEditShow, toggleTokenEdit, onSubmit, onChange, value}) => {

  // const buttonText = hasEnteredToken? "Edit token" : "Enter token"

  return (
    <nav className="token-header">
      <p>
        {hasEnteredToken
          ? (<span className="has-token">You have a stored API token. You can run requests on your <b>LIVE</b> GitHub data.
               <button onClick={e => toggleTokenEdit(e)}>Edit token</button>
             </span>)
          : (<span className="no-token">Please enter an <a href="https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/">API token</a> to run requests on your GitHub data.
              <button onClick={e => toggleTokenEdit(e)}>Enter token</button>
             </span>)
        }
      </p>
    {tokenEditShow
      ? (<form onSubmit={onSubmit}>
          <input type="text" value={value} onChange={onChange}/>
          <input type="submit" value="Submit" />
          <input type="button" value="Cancel" onClick={e => toggleTokenEdit(e)} />
      </form>)
      : (null)
    }
    </nav>
  )
}

export default TokenEntry
