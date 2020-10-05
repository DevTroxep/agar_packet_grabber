// ==UserScript==
// @name         DatToolz: the anonymous world.
// @namespace    The new awesome packet grabber for agar.io clones!
// @version      1.0.1
// @description  DatToolz has created by DarkMaker !
// @author       DarkMaker
// @match        *.gota.io/web/*
// @match        *.cellcraft.io/*
// @match        *.dual-agar.me/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

window.PackList = [];

const API = {

    checkIt: function(uint) {
        let consLogger = true; /* Console flood of packets */
        let autoParse  = true;
        let blackList  = [
            "16"
        ];

        if (autoParse === true) {
            this.parseIt(uint, (parsed) => {
                var timer = new Date;
                if(blackList.indexOf(uint.split(" ")[0]) !== -1) {
                } else {
                  if(consLogger === true) {
                     console.log(`[${timer.getHours()}:${timer.getMinutes()}:${timer.getSeconds()}] Parsed a new packet: ${parsed} `);
                  }
                  PackList.push("" + parsed + " ");
                }
            });
        } else {
            if(blackList.indexOf(uint.split(" ")[0]) !== -1) {
            } else {
               if(consLogger === true) {
                  console.log(`[${timer.getHours()}:${timer.getMinutes()}:${timer.getSeconds()}] NOT parsed packet: ${uint} `);
               }
               PackList.push("" + uint + " ");
            }
        }

    },
    parseIt: function(DefUI, callback) {
        let DefRes = "";
        let DefParsed = DefUI.split(" ");
        if (DefParsed.length === 1) {
            callback("[" + DefUI + "]");
        } else {
            for (var i = 0; i < DefParsed.length; i++) {
                if (i === 0) {
                    DefRes += '[' + DefParsed[i] + ', ';
                } else {
                    if (i <= DefParsed.length - 2) {
                        DefRes += DefParsed[i] + ', ';
                    } else if (i === DefParsed.length - 1) {
                        DefRes += DefParsed[i] + ']';
                    }
                }
            }
            callback(DefRes);
        }
    }




};

(function() {
    window.__WebSocket = window.WebSocket;
    window.fakeWebSocket = function() {
        return {
            readyState: 0
        };
    };
    window._WebSocket = window.WebSocket = function(ip) {
        return new window.fakeWebSocket(ip);
    };
    window.addEventListener("load", function() {
        if (!window.OldSocket)
            OldSocket = window.__WebSocket;
        window._WebSocket = window.WebSocket = window.fakeWebSocket = function(ip) {
            var ws = new OldSocket(ip);
            ws.binaryType = "arraybuffer";
            var fakeWS = {};
            for (var i in ws)
                fakeWS[i] = ws[i];
            fakeWS.send = function() {
                var msg = new DataView(arguments[0]);
                var f = "";

                for(var i = 0; i < msg.byteLength; i++) {
                    var ui = msg.getUint8(i);
                    if(i === msg.byteLength - 1) {
                       f += ui;
                    } else if(i <= msg.byteLength - 2) {
                       f += ui + " ";
                    }
                }

                API.checkIt(f);

                return ws.send.apply(ws, arguments);
            };
            ws.onmessage = function() {
                var msg = new DataView(arguments[0].data);
                if(fakeWS.onmessage) {
                   fakeWS.onmessage.apply(ws, arguments);
                }
            };
            ws.onopen = function() {
                fakeWS.readyState = 1;
                fakeWS.onopen.apply(ws, arguments);
            };
            return fakeWS;
        };
    });
    document.addEventListener("keydown", function(k) {
      var key = String.fromCharCode(k.keyCode).toUpperCase();
      switch (key) {
          case "R":
              var timer = new Date;
              let packResult = "";

              for(var i = 0; i < PackList.length; i++) {
                  packResult += PackList[i];
              }

              console.log('[i] Getting results..');
              prompt(`Packet's results:`, `[${timer.getHours()}:${timer.getMinutes()}:${timer.getSeconds()}] ${location.origin} -> ${packResult}`);
              break;
      }
    });
})();
