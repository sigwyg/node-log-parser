import { getLogJson } from './parse'
import { getStats } from './stat'

getLogJson('access.log').then(data => {
  const stats = getStats(data)
  console.log(stats)
})
