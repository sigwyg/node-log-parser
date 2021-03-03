/**
 * parse log
 *
 */
import * as fs from 'fs'
import * as readline from 'readline'

/**
 *
 * ログファイルを受け取って、分類済みの配列を返す
 *
 * @param {string} file path
 * @return {Array<Object>} array of log-split object
 */
export async function getLogJson(filePath: string) {
  // 指定バイトずつ読み込む
  const stream = fs.createReadStream(filePath, {encoding: 'utf8' })
  const readLine = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  }) || []

  // 1行ずつ処理する
  let data = []
  for await (const line of readLine) {
    const splitData = detectLog(line)
    data.push(splitData)
  }
  return data
}

/**
 * 正規表現でログをオブジェクトに分解する
 *
 * @param {string} log by line
 * @return {object} split log to object
 *
 * 172.31.10.124 - - [02/Feb/2021:20:06:01 +0900] "GET /api/users HTTP/1.1" 200 6027 "https://manage.gaiheki.support/orders?page=1" "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36" "https" 3.212 3.212
 * $remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"
 */
function detectLog(line:string) {
  const regex = /^((?:\d{1,3}\.){3}\d{1,3}) - (.+) \[(.+)\] "([^\"]+)" (\d+) (\d+) "([^\"]+)" "([^\"]+)"/;
  const [ src, ip, user, time, request, status, size, referer, ua ] = line.match(regex) || []
  const [ org, date, hms ] = time.match(/^(\d+\/[a-zA-Z]+\/\d+):(\d{1,2}:\d{1,2}:\d{1,2})/) || []

  return {
    ip, user, request, status, size, referer, ua,
    date: date,
    time: hms
  }
}
