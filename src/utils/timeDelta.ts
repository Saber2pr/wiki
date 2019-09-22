export const timeDelta = (time1: string, time2: string) => {
  const Time1 = new Date(time1).getTime()
  const Time2 = new Date(time2).getTime()

  const seconds = (Time1 - Time2) / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30
  const years = months / 12

  if (years >= 1) return `${Math.round(years)} 年前.`
  if (months >= 1) return `${Math.round(months)} 月前.`
  if (days >= 1) return `${Math.round(days)} 天前.`
  if (hours >= 1) return `${Math.round(hours)} 小时前.`
  if (minutes >= 1) return `${Math.round(minutes)} 分钟前.`
  if (seconds >= 1) return `${Math.round(minutes)} 秒前.`
}

export const timeDeltaFromNow = (time: string) =>
  timeDelta(new Date().toUTCString(), time)
