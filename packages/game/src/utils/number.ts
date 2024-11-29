import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export const timeFromNow = (timestamp: number): string => {
  return dayjs(timestamp).fromNow()
}

export const numberWithCommas = (num: number): string => {
  return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
