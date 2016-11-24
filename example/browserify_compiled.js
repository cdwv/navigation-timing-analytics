(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by riven on 23.11.2016.
 */

var timingAnalytics = require('../navigation-timing-analytics');

timingAnalytics('https://your-influx.com', 'influx_db','influx_username', 'influx_password', 'metrics');


},{"../navigation-timing-analytics":2}],2:[function(require,module,exports){
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
},{}]},{},[1])