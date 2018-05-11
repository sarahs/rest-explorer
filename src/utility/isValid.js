export default function isValid(paramsArray, enteredParams) {
  const allowedCharsRegex = new RegExp('[^a-zA-Z0-9._-]{1,}')
  let invalidCharsEntered = []
  Object.values(enteredParams).map(p =>
    allowedCharsRegex.test(p) && invalidCharsEntered.push(p.match(allowedCharsRegex)[0])
  )
  if (Object.keys(enteredParams).length) {
    const isValid = Object.values(enteredParams).map(p => allowedCharsRegex.test(p) === false).includes(false) === false
    return [isValid, invalidCharsEntered]
  }
  else {
    return [true, invalidCharsEntered]
  }
}
