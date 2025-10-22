import { i18n } from '../i18n'

export const timeDelta = (time1: string | number, time2: string | number) => {
  const seconds = (Number(time1) - Number(time2)) / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30
  const years = months / 12

  if (years >= 1) return `${Math.round(years)} ${i18n.format('yearAgo')}`
  if (months >= 1) return `${Math.round(months)} ${i18n.format('monthsAgo')}`
  if (days >= 1) return `${Math.round(days)} ${i18n.format('daysAgo')}`
  if (hours >= 1) return `${Math.round(hours)} ${i18n.format('hoursAgo')}`
  if (minutes >= 1) return `${Math.round(minutes)} ${i18n.format('minutesAgo')}`
  if (seconds >= 1) return `${Math.round(minutes)} ${i18n.format('secondsAgo')}`
}

export const timeDeltaFromNow = (time: string | number) =>
  timeDelta(Date.now(), Number(time))
