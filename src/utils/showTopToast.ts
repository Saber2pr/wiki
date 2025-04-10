export interface ShowTopToastOps {
  text: string
  duration?: number
  once?: boolean
  onceOffset?: number
}

export const showTopToast = ({
  text,
  duration = 5000,
  once,
  onceOffset = 1000 * 60 * 60,
}: ShowTopToastOps) => {
  const toastNode = document.getElementById('top-toast')
  if (!toastNode) return

  let showMap = {}
  try {
    const top_toast_map = localStorage.getItem('top_toast_map')
    showMap = top_toast_map ? JSON.parse(top_toast_map) : {}
  } catch (error) {}

  if (once && showMap[text]) {
    if (Date.now() - showMap[text] < onceOffset) return
  }

  toastNode.style.opacity = '1'
  toastNode.innerHTML = text
  if (once) {
    showMap[text] = Date.now()
  }

  // 1秒后让提示消失
  setTimeout(() => {
    toastNode.style.opacity = '0'
    toastNode.innerHTML = ''
  }, duration)

  localStorage.setItem('top_toast_map', JSON.stringify(showMap))
}
