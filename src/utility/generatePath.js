export default function generatePath(enteredPathParams, apiBase, inputElement, SubmittedQueryStringParams, path) {
    let mypath = []
    if (Object.keys(enteredPathParams).length !== 0) {
      mypath.push(apiBase)
      const inputTags = inputElement.current.getElementsByTagName("*")
      const lastItemIndex = inputTags.length - 1
      const lastItem = inputTags.item(lastItemIndex)
      for (let item of inputTags) {
        item.nodeName === "INPUT"
          ? mypath.push(item.value + (item !== lastItem ? "/" : ""))
          : item.nodeName !== "DIV"
            ? Array.from(item.childNodes).map(x => x.nodeName === "INPUT" ? "" : mypath.push(x.data))
            : mypath.push("")
      }
      return mypath.join("") + SubmittedQueryStringParams
    }
    else {
      return apiBase + path + SubmittedQueryStringParams
    }
  }
