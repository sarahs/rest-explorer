export default function generatePath(enteredPathParams, apiBase, inputElement, SubmittedQueryStringParams, path) {
    let mypath = []
    if (Object.keys(enteredPathParams).length !== 0) {
      mypath.push(apiBase)
      const allTags = inputElement.current.getElementsByTagName("*")
      const inputTags = inputElement.current.getElementsByTagName("INPUT")
      const lastInputIndex = inputTags.length - 1
      const lastInput = inputTags.item(lastInputIndex)
      for (let item of allTags) {
        item.nodeName === "INPUT"
          ? mypath.push(item.value + (item !== lastInput ? "/" : ""))
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
