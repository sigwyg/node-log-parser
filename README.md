## Requirement

- Node v14

## Usage

`$ node parse.js {filePath}`

## Description

NginxのLog形式をJavascriptのObjectに分解する

### From

```
xxx.xx.xx.xxx - - [02/Feb/2021:06:38:18 +0900] "GET / HTTP/1.1" 200 514 "-" "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/98 Safari/537.4 (StatusCake)" "https" 0.009 0.008
```

### To
```js
{
  ip: '172.31.10.124',
  user: '-',
  request: 'GET / HTTP/1.1',
  status: '200',
  size: '514',
  referer: '-',
  ua: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/98 Safari/537.4 (StatusCake)',
  date: '02/Feb/2021',
  time: '03:49:58'
}
```
