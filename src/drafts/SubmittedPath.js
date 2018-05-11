import React from 'react'
import SubmittedQueryStringParams from './SubmittedQueryStringParams'

const SubmittedPath = ({path, apiBase, inputElement}) => {
  let mypath = []
  if (inputElement.current) {
    mypath.push(apiBase)
    const inputTags = inputElement.current.getElementsByTagName("*")
    const lastItemIndex = inputTags.length - 1
    const lastItem = inputTags.item(lastItemIndex)
    for (let item of inputTags) {
      item.nodeName === "INPUT"
        ? mypath.push(item.value + (item !== lastItem ? "/" : ""))
        : Array.from(item.childNodes).map(x => x.nodeName === "INPUT" ? "" : mypath.push(x.data))
    }
    return mypath.join("") + <SubmittedQueryStringParams/>
  }
  else {
    return apiBase + path + <SubmittedQueryStringParams/>
  }
}

export default SubmittedPath
