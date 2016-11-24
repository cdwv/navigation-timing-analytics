/**
 * Created by riven on 23.11.2016.
 */
"use strict";

(function() {
    var root = this;
    var previousTimingAnalytics = root.timingAnalytics;

    var timingAnalytics = function(influxDbEndpoint, influxDb, influxUsername, influxPassword, influxMetricsName) {
        var track = function() {
            setTimeout(function() {
                if(!performance.timing)
                    return;

                if(!influxMetricsName)
                    influxMetricsName = window.location.hostname.replace(/\./g, '_');

                var keys = [
                    'navigationStart',
                    'fetchStart',
                    'domainLookupStart',
                    'domainLookupEnd',
                    'connectStart',
                    'connectEnd',
                    'requestStart',
                    'responseStart',
                    'responseEnd',
                    'domLoading',
                    'domInteractive',
                    'domContentLoadedEventStart',
                    'domContentLoadedEventEnd',
                    'domComplete',
                    'loadEventStart',
                    'loadEventEnd'
                ];
                var data = [
                    'userAgent="' + navigator.userAgent.replace('"', '') + '"',
                    'url="' + location.href.replace('"', '') + '"'
                ];
                for (var i = 0; i < keys.length; i++) {
                    data.push(keys[i] + '=' + performance.timing[keys[i]]);
                }
                var influxBody = influxMetricsName + " " + data.join(',');
                var influxUrl = influxDbEndpoint.replace(/\/$/)
                    + "/write?db="
                    + encodeURIComponent(influxDb)
                    + "&precision=s&u="
                    + encodeURIComponent(influxUsername)
                    + "&p="
                    + encodeURIComponent(influxPassword);

                if (!(navigator.sendBeacon && navigator.sendBeacon(influxUrl, influxBody))) {
                    var XMLReq = ('XMLHttpRequest' in window) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    XMLReq.open("POST", influxUrl, true);
                    XMLReq.setRequestHeader('Accept', '*/*');
                    XMLReq.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
                    XMLReq.responseType = 'text/plain';
                    XMLReq.send(influxBody);
                }
            });
        };

        if (document.readyState === 'complete')
            track();
        else
            window.addEventListener('load', track, false);
    };

    timingAnalytics.noConflict = function() {
        root.timingAnalytics = previousTimingAnalytics;
        return timingAnalytics
    };

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = timingAnalytics
        }
        exports.timingAnalytics = timingAnalytics
    }
    else {
        root.timingAnalytics = timingAnalytics
    }
}).call(this);