!function(){"use strict";var e=[,function(e,t,n){function o(e){var t="";t="presents"===e?"Prezence":t,t="schedulePage"===e?"Kalendář":t,t="news"===e?"Novinky":t,t="students.list"===e?"Studenti":t,t="students.comment"===e?"Zpráva pro studenta":t,t="students.send_mail"===e?"Zpráva pro skupinu":t,t="groupsPage"===e?"Skupinová účast":t,t="bind.materials"===e?"Učební pomůcky":t,t="bind.teach_materials_teach"===e?"Moje materiály":t,t="traffic"===e?"Potenciální ztráty":t,t="homeWork"===e?"Domácí úkoly":t,t="classWork"===e?"Práce v hodině":t,t="exams"===e?"Moje zkoušky":t,t="report"===e?"Reporty":t,t="tasks"===e?"Úkoly":t,t="content_author"===e?"Přidat obsah":t;var n=document.querySelector("title");n.innerText=t?t+" — LogBook":"LogBook"}n.r(t),n.d(t,{createPageTitle:function(){return o}})},function(e,t,n){function o(e,t){var n=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0,screenX:e,screenY:t});document.elementFromPoint(e,t).dispatchEvent(n)}function r(e){e.pageX<=48&&(e.preventDefault(),o(e.clientX,e.clientY),setTimeout((function(){o(e.clientX,e.clientY)}),250))}function a(){try{document.querySelector(".open-menu-block").title="Levé tlačítko: Otevřít menu — Pravé tlačítko: Otevřít položku menu"}catch(e){}}n.r(t),n.d(t,{onContextMenu:function(){return r},addInfoForMenu:function(){return a}})},function(e,t,n){function o(e){var t=e.innerText,n=t.replace(/\s/g,"").split("."),o=n[0],r=n[1],a=n[2];1===o.length&&(o="0"+o),1===r.length&&(r="0"+r);var c=a+"-"+r+"-"+o,u=Date.parse(c);return isNaN(u)?t:u}function r(e){var t=+new Date,n=Math.floor((t-e)/1e3),o=n/31536e3;return"number"!=typeof o?e:o>1?o>2?"před "+Math.floor(o)+" lety":"před rokem":(o=n/2592e3)>1?o>2?"před "+Math.floor(o)+" měsíci":"před měsícem":(o=n/86400)>1?o>2?"před "+Math.floor(o)+" dny":"včera":(o=n/3600)>1||(o=n/60)>1?"dnes":"nyní"}function a(e){try{return new Date(e).toLocaleDateString("cs-CZ",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}catch(t){return e}}function c(){setTimeout((function(){console.time("replaceDates");for(var e=document.querySelectorAll('[ng-if="stud.last_date_vizit != null"] span'),t=0;t<e.length;t++)try{var n=e[t],c=o(n);n.innerText=r(c),n.title=a(c)}catch(e){}console.timeEnd("replaceDates")}),1e3)}n.r(t),n.d(t,{replaceDates:function(){return c}})},function(e,t,n){function o(){setTimeout((function(){try{console.time("replaceStrings"),function(){for(var e,t,n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);n.nextNode();)e=(t=n.currentNode).nodeValue,t.nodeValue=e.replace("№","č. ")}(),console.timeEnd("replaceStrings")}catch(e){}}),6e3)}n.r(t),n.d(t,{replaceStrings:function(){return o}})}],t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={exports:{}};return e[o](a,a.exports,n),a.exports}n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};!function(){n.r(o);var e=n(1),t=n(2),r=n(3),a=n(4);document.documentElement.setAttribute("lang","cs-CZ"),document.body.addEventListener("contextmenu",t.onContextMenu),function(){try{angular.element(document).scope().dateFormat="d. M. yyyy",angular.element(document).scope().dateFormatShort="d. M.",angular.element(document).scope().$on("$stateChangeSuccess",(function(n,o,c,u,i){console.warn("hlavní",n,o,c,u,i),(0,t.addInfoForMenu)(),(0,e.createPageTitle)(o.name),(0,r.replaceDates)(),(0,a.replaceStrings)()})),angular.element(document).scope().$broadcast("dataFetchComplete",(function(){alert("dataFetchComplete")}))}catch(e){}}()}()}();