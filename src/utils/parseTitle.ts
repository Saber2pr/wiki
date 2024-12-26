function addSpaceBeforeUpperCaseWords(str) {
  // 将第一个字母大写，后面的字母小写
  let result = str.replace(/([a-z])([A-Z])/g, '$1 $2') // 在大写字母前加空格
  result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase() // 第一个字母大写，其他字母小写
  return result
}

export const parseTitle = title => {
  if (/^[a-zA-Z]+$/.test(title)) {
    try {
      return addSpaceBeforeUpperCaseWords(title)
    } catch (error) {
      return title
    }
  }
  return title
}
