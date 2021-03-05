## Requirement

- Node v14

## Usage

`$ npm start`

## Description

NginxのLog形式をJavascriptのObjectに分解する

(IPは例としてダミーでlocalhostにしてあります)

### From

```
127.0.0.1 - - [02/Feb/2021:06:38:18 +0900] "GET / HTTP/1.1" 200 514 "-" "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/98 Safari/537.4 (StatusCake)" "https" 0.009 0.008
```

### To
```js
{
  ip: '127.0.0.1',
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

### Stats

```
{
  total: 70418,
  ua: [
    { name: 'Chrome', count: 69532, percentage: 98.7 },
    ...
  os: [
    { name: 'Mac OS', count: 41503, percentage: 58.9 },
    ...
  ],
  ip: [
    { name: '172.xx.xx.xxx', count: 35636, percentage: 50.6 },
    ...
  ]
}
```
