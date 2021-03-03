import { getLogJson } from './parse'
import { getStats } from './stat'

getLogJson('access.log').then(data => {
  getStats(data)
})
