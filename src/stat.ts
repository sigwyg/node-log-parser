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
interface logData {
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


export function getStats(data: Array<logData>) {
  for(const log of data) {
    console.log(log.ua)
  }
}
