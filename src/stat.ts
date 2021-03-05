/**
 * JSONを受け取って集計する
 *
 * 以下のようなArray<Object>を受け取る
 * [
 *   {
 *     ip: '172.31.10.124',
 *     user: '-',
 *     request: 'GET / HTTP/1.1',
 *     status: '200',
 *     size: '514',
 *     referer: '-',
 *     ua: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/98 Safari/537.4 (StatusCake)',
 *     date: '02/Feb/2021',
 *     time: '05:32:28'
 *   },
 *   ...
 * ]
 *
 */
import { UAParser } from 'ua-parser-js';

interface LogData {
  ip: string;
  user: string;
  request: string;
  status: string;
  size: string;
  referer: string;
  ua: string;
  date: string;
  time: string;
}

// TODO: Stats*を整理する
interface Stats {
  [property: string]: StatsValue
}
interface StatsValue {
  [property: string]: number
}
interface StatsList {
  total: number
  ua: Array<StatsObject>
  os: Array<StatsObject>
  ip: Array<StatsObject>
}
interface StatsObject {
  name: string
  count: number
  percentage: number
}

export function getStats(data: Array<LogData>) {
  const count:Stats = {
    ua: {},
    os: {},
    ip: {},
  }

  // count
  for(const log of data) {
    const uaGroup = detectUA(log.ua)
    count.ua[uaGroup.ua] = ( count.ua[uaGroup.ua] || 0 ) +1
    count.os[uaGroup.os] = ( count.os[uaGroup.os] || 0 ) +1
    count.ip[log.ip] = ( count.ip[log.ip] || 0 ) +1
  }

  // sort
  const sortedList = {
    total: data.length,
    ua: sortObj(count.ua),
    os: sortObj(count.os),
    ip: sortObj(count.ip)
  }

  // addPercentage
  const total = sortedList.total
  const statsList: StatsList = {
    total: total,
    ua: addPercentage(total, sortedList.ua),
    os: addPercentage(total, sortedList.os),
    ip: addPercentage(total, sortedList.ip),
  }
  return statsList
}

/**
 * カウント済みの要素に百分率を付与する
 *
 * @param {Object} { Chrome: 69532 }
 * @return {Object} { name: ..., count: ..., percentage: ... }
 */
function addPercentage(total: number, list: Array<StatsValue> ): Array<StatsObject> {
  return list.map((obj, idx) => {
    const key =  Object.keys(obj)[0]
    const val = Object.values(obj)[0]
    return {
      name: key,
      count: val,
      percentage: Math.round((val / total) * 1000) / 10 // 98.5
    }
  })
}

/**
 * valueでソート済みの配列を返す
 *
 * @param {Object} UAと合計数
 * @return {Array} UAと合計数
 */
function sortObj(obj:StatsValue){
  return Object.entries(obj)
  .sort(([,a], [,b]) => b - a )
  .map(([key, value]) => ({ [key]: value }))
}

/**
 * UAからブラウザ判別
 *
 * @param {string} ua user-agent
 * @return {object} {ua: 'hoge', os: 'fuga'}
 * @required https://github.com/faisalman/ua-parser-js
 */
function detectUA(ua: string) {
  const uaParser = new UAParser(ua)
  const uaGroup = uaParser.getBrowser().name || ua
  const os = uaParser.getOS().name || ua

  return {
    ua: uaGroup,
    os: os
  }
}
