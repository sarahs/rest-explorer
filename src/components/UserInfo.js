import React from 'react'
import userIcon from '../assets/user_icon.png'

const UserInfo = ({hasEnteredToken, toggleUserInfo, userInfoShow, userName, rateLimit, rateLimitRemaining}) => {

  return (
    <div className="user-div">
      {userInfoShow
        ? (<div>
             <p>Authenticated user: <span>{userName}</span></p>
             <p>Current rate limit: <span>{rateLimitRemaining} out of {rateLimit}</span></p>
           </div>)
        : (null)
      }
      {hasEnteredToken
        ? (<button
            className="hover-button"
            onClick={e => toggleUserInfo(e)}
           >
             {!userInfoShow
               ? <span className="tooltiptext">Show user information</span>
               : null
             }
             <img alt="" src={userIcon} />
           </button>)
        : (null)
      }
    </div>
  )
}

export default UserInfo
