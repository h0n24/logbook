!function(){"use strict";var e=[,function(e,t,n){function o(e){let t="";t="presents"===e?"Prezence":t,t="schedulePage"===e?"Kalendář":t,t="news"===e?"Novinky":t,t="students.list"===e?"Studenti":t,t="students.comment"===e?"Zpráva pro studenta":t,t="students.send_mail"===e?"Zpráva pro skupinu":t,t="groupsPage"===e?"Skupinová účast":t,t="bind.materials"===e?"Učební pomůcky":t,t="bind.teach_materials_teach"===e?"Moje materiály":t,t="traffic"===e?"Potenciální ztráty":t,t="homeWork"===e?"Domácí úkoly":t,t="classWork"===e?"Práce v hodině":t,t="exams"===e?"Moje zkoušky":t,t="report"===e?"Reporty":t,t="tasks"===e?"Úkoly":t,t="content_author"===e?"Přidat obsah":t;const n=document.querySelector("title");n.innerText=t?t+" — LogBook":"LogBook"}n.r(t),n.d(t,{createPageTitle:function(){return o}})},function(e,t,n){function o(e,t){const n=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0,screenX:e,screenY:t});document.elementFromPoint(e,t).dispatchEvent(n)}function r(e){e.pageX<=48&&(e.preventDefault(),o(e.clientX,e.clientY),setTimeout((()=>{o(e.clientX,e.clientY)}),250))}function c(){try{document.querySelector(".open-menu-block").title="Levé tlačítko: Otevřít menu — Pravé tlačítko: Otevřít položku menu"}catch(e){}}n.r(t),n.d(t,{onContextMenu:function(){return r},addInfoForMenu:function(){return c}})},function(e,t,n){function o(e){const t=e.innerText,n=t.replace(/\s/g,"");let[o,r,c]=n.split(".");1===o.length&&(o="0"+o),1===r.length&&(r="0"+r);const a=`${c}-${r}-${o}`,u=Date.parse(a);return isNaN(u)?t:u}function r(e){const t=+new Date,n=Math.floor((t-e)/1e3);let o=n/31536e3;return"number"!=typeof o?e:o>1?o>2?"před "+Math.floor(o)+" lety":"před rokem":(o=n/2592e3,o>1?o>2?"před "+Math.floor(o)+" měsíci":"před měsícem":(o=n/86400,o>1?o>2?"před "+Math.floor(o)+" dny":"včera":(o=n/3600,o>1?"dnes":(o=n/60,o>1?"dnes":"nyní"))))}function c(e){const t={weekday:"long",year:"numeric",month:"long",day:"numeric"};try{return new Date(e).toLocaleDateString("cs-CZ",t)}catch(t){return e}}function a(){setTimeout((()=>{console.time("replaceDates");const e=document.querySelectorAll('[ng-if="stud.last_date_vizit != null"] span, .presents_stud td.mystat');for(let t=0;t<e.length;t++)try{const n=e[t],a=o(n);n.innerText=r(a),n.title=c(a)}catch(e){}console.timeEnd("replaceDates")}),5e3)}n.r(t),n.d(t,{replaceDates:function(){return a}})},function(e,t,n){function o(){setTimeout((()=>{try{console.time("replaceStrings"),function(){let e,t,n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);for(;n.nextNode();)t=n.currentNode,e=t.nodeValue,t.nodeValue=e.replace("№","č. ")}(),console.timeEnd("replaceStrings")}catch(e){}}),6e3)}n.r(t),n.d(t,{replaceStrings:function(){return o}})},function(e,t,n){function o(e,t){return new Promise((function(n,o){var r=(new Date).getTime(),c=function(){var e=(new Date).getTime()-r;e*=t||1,e=Math.round(e),n(e)};(function(e){return new Promise((function(t,n){var o=new Image;o.onload=function(){t(o)},o.onerror=function(){n(e)},o.src=e+"?random-no-cache="+Math.floor(65536*(1+Math.random())).toString(16)}))})(e).then(c).catch(c),setTimeout((function(){o(Error("Timeout"))}),5e3)}))}function r(){const e=document.body,t=document.createElement("div");t.id="pulse",t.title="Zkouším navázat spojení...",e.appendChild(t),setInterval((function(){o("https://logbook.itstep.org/",.4).then((function(e){const t=document.getElementById("pulse");t&&(t.classList.remove("disconnected"),t.classList.add("connected"),t.title=`Spojení se serverem v pořádku (${String(e)} ms)`)})).catch((function(e){console.error("Could not ping remote URL",e);const t=document.getElementById("pulse");t&&(t.classList.remove("connected"),t.classList.add("disconnected"),t.title="Server není dostupný. Je VPN zapnutá?")}))}),5e3)}n.r(t),n.d(t,{checkPing:function(){return r}})}],t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var c=t[o]={exports:{}};return e[o](c,c.exports,n),c.exports}n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};!function(){n.r(o);var e=n(1),t=n(2),r=n(3),c=n(4),a=n(5);document.documentElement.setAttribute("lang","cs-CZ"),console.log("test"),(0,a.checkPing)(),document.body.addEventListener("contextmenu",t.onContextMenu),function(){try{angular.element(document).scope().dateFormat="d. M. yyyy",angular.element(document).scope().dateFormatShort="d. M.",angular.element(document).scope().$on("$stateChangeSuccess",(function(n,o,a,u,i){console.log("hlavní",n,o,a,u,i),(0,t.addInfoForMenu)(),(0,e.createPageTitle)(o.name),(0,r.replaceDates)(),(0,c.replaceStrings)()})),angular.element(document).scope().$broadcast("dataFetchComplete",(function(){alert("dataFetchComplete")}))}catch(e){}}()}()}();