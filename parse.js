/**
 * parse log
 *
 * 172.31.19.100 - - [02/Feb/2021:20:56:12 +0900] "GET /api/orders/tera HTTP/1.1" 404 145 "-" "Chatwork LinkPreview v1" "https" 0.009 0.004
 */
import program from 'commander'
import fs from 'fs'
import readline from 'readline'

// 1. import file
// 2. show first and last date
// 3. count log
// 4. show IP
// 5. show UA
// 6. show request
// 7. show file path
// 8. show status

program.parse(process.argv)
const filePath = program.args[0] || 'access.log'
const logs = await importFile(filePath)

/**
 * {
 *   ip: '172.31.10.124',
 *   user: '-',
 *   request: 'GET / HTTP/1.1',
 *   status: '200',
 *   size: '514',
 *   referer: '-',
 *   ua: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/98 Safari/537.4 (StatusCake)',
 *   date: '02/Feb/2021',
 *   time: '03:49:58'
 * }
 */
console.log(logs.length)

let count = {
  Date: {},
  IP: {},
  UA: {},
  //Request: {},
}
for (const log of logs) {
  count.Date[`${log.date}`] = (count.Date[`${log.date}`] || 0) + 1
  count.IP[`${log.ip}`] = (count.IP[`${log.ip}`] || 0) + 1
  count.UA[`${log.ua}`] = (count.UA[`${log.ua}`] || 0) + 1
  //count.Request[`${log.request}`] = (count.Request[`${log.request}`] || 0) + 1
}
let ua = []
for (const [key, value] of Object.entries(count.UA)) {
  ua.push({[key]: value})
}
ua.sort((a,b) => {
  if(Object.values(a)[0] > Object.values(b)[0]) return -1
  return 1
})
console.log("UserAgent: ", ua)
console.log("Date: ", count.Date)
console.log("IP: ", count.IP)

/**
 * import file
 *
 * @param {string} file path
 */
async function importFile(path) {
  // 指定バイトずつ読み込む
  const stream = fs.createReadStream(path, {encoding: 'utf8' })
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  })

  // 1行ずつ処理する
  let data = []
  for await (const line of rl) {
    const splitData = detectLog(line)
    data.push(splitData)
  }

  return data
}

/**
 * detect log
 * @param {string} log by line
 * @return {object} split log to object
 *
 * 172.31.10.124 - - [02/Feb/2021:20:06:01 +0900] "GET /api/users HTTP/1.1" 200 6027 "https://manage.gaiheki.support/orders?page=1" "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36" "https" 3.212 3.212
 * $remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"
 */
function detectLog(line) {
  const regex = /^((?:\d{1,3}\.){3}\d{1,3}) - (.+) \[(.+)\] "([^\"]+)" (\d+) (\d+) "([^\"]+)" "([^\"]+)"/;
  const [ src, ip, user, time, request, status, size, referer, ua ] = line.match(regex);
  const [ org, date, hms ] = time.match(/^(\d+\/[a-zA-Z]+\/\d+):(\d{1,2}:\d{1,2}:\d{1,2})/)

  return {
    ip, user, request, status, size, referer, ua,
    date: date,
    time: hms
  }
}
