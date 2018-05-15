export default function generatePath(enteredPathParams, apiBase, inputElement, SubmittedQueryStringParams, path) {
    let mypath = []
    if (Object.keys(enteredPathParams).length !== 0) {
      mypath.push(apiBase)
      const allTags = inputElement.current.getElementsByTagName("*")
      const secondToLastItemIndex = allTags.length - 2
      const secondToLastItem = allTags.item(secondToLastItemIndex)
      for (let item of allTags) {
        item.nodeName === "INPUT"
          ? mypath.push(item.value + (item.value !== secondToLastItem.value ? "/" : ""))
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
