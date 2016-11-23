# Wait a minute, what is this black magic?

`navigation-timing-analytics` is a small script, that will try to take Navigation Timing API metrics (and maybe a little bit of URL and user agent) right after page load and send them to your InfluxDB. It will laverege Beacon API if possible to have little or no influence on page loading experience, but it'll work in safari too!

**WTF does "right after the page load" mean**

More or less the same as 
```js
window.addEventListener('load', funciton(){ 
    setTimeout(stuff);
})
```

**My https page does not appear in InfluxDB metric :(**

Bear in mind that if your page sits on `https`, then your InfluxDB api needs to be using `https` as well. Otherwise browser will block the request as unsafe. 

# Usage

## Via script load

```html
<script src="navigation-timing-analytics.min.js" type="text/javascript"></script>
<script>
    timingAnalytics('https://your-influx.com', 'influx_db','influx_username', 'influx_password', 'metrics');
</script>
```


## Via browserify

```js
var timingAnalytics = require('navigation-timing-analytics');
timingAnalytics('https://your-influx.com', 'influx_db','influx_username', 'influx_password', 'metrics');
```

## And that is it! 
Each call to the `timingAnalytics` will place a set of metrics from Navigation Timing API
In your InfluxDB you'll find now metrics for your page:

```
> select * from my_ultra_page
```

```json
{
    "results": [
        {
            "series": [
                {
                    "name": "my_ultra_page",
                    "columns": [
                        "time",
                        "connectEnd",
                        "connectStart",
                        "domComplete",
                        "domContentLoadedEventEnd",
                        "domContentLoadedEventStart",
                        "domInteractive",
                        "domLoading",
                        "domainLookupEnd",
                        "domainLookupStart",
                        "fetchStart",
                        "loadEventEnd",
                        "loadEventStart",
                        "navigationStart",
                        "requestStart",
                        "responseEnd",
                        "responseStart",
                        "url",
                        "userAgent"
                    ],
                    "values": [
                        [
                            1479916571000000000,
                            1.479916571458e+12,
                            1.479916571458e+12,
                            1.479916571537e+12,
                            1.479916571536e+12,
                            1.479916571536e+12,
                            1.479916571536e+12,
                            1.479916571481e+12,
                            1.479916571458e+12,
                            1.479916571458e+12,
                            1.479916571458e+12,
                            1.479916571537e+12,
                            1.479916571537e+12,
                            1.479916571458e+12,
                            1.479916571466e+12,
                            1.479916571474e+12,
                            1.479916571472e+12,
                            "http://myultrapage.com",
                            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36"
                        ]
                    ]
                }
            ]
        }
    ]
}
```

Give it a try with some simple queries:

```sql
 select responseEnd - navigationStart as "Net'working", domInteractive - domLoading as "DOM parsing", domContentLoadedEventStart - domInteractive as "Parser blocking <script>", domContentLoadedEventEnd - domContentLoadedEventStart as "ready/DOMContentLoaded event js", loadEventStart - domInteractive as "Images and other assets loading",loadEventEnd - loadEventStart as "Load event js", loadEventEnd - navigationStart as "Total time" from my_ultra_page
```

# Want to contribute?

This lib is fairly basic and written with one simple task in mind. If you'd like to see more features feel free to propose changes.

Fork, commit, create PR - it's as simple as that!
