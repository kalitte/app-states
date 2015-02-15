!function(){function t(t){this.name=t,this.internalCache={}}function e(e){var n=i[e];return n||(i[e]=n=new t(e)),n}t.prototype.get=function(t){return this.internalCache[t]},t.prototype.set=function(t,e){if(this.get(t))throw Error("Already have an id :"+t);this.internalCache[t]=e},t.prototype.del=function(t){if(!this.get(t))throw Error("Cannot delete a non-existing id :"+t);delete this.internalCache[t]},t.prototype.items=function(){return this.internalCache},t.prototype.itemsArray=function(){var t=[];for(var e in this.internalCache)t.push(this.internalCache[e]);return t};var i={},n=Object.create(HTMLElement.prototype);n.getCache=function(t){return e.call(this,t)},document.registerElement("view-registry",{prototype:n})}(),function(){function t(t,e){e.parentNode.insertBefore(t,e.nextSibling)}function e(t,e){e.parentNode.insertBefore(t,e)}function i(t,e){this.id=t,this.comment=e}i.prototype.place=function(e){t(e,this.comment),this.content=e},i.prototype.remove=function(){var t=this.content.templateInstance,e=t.firstNode;if(e)if(t.firstNode==t.lastNode)this.comment.parentNode.removeChild(e);else{for(;e&&e!=t.lastNode;){var i=e;e=e.nextSibling,this.comment.parentNode.removeChild(i)}this.comment.parentNode.removeChild(t.lastNode)}delete this.content};!function(){var t=window.MutationObserver||window.WebKitMutationObserver,e=window.addEventListener;return function(i,n){if(t){var a=new t(function(t){(t[0].addedNodes.length||t[0].removedNodes.length)&&n()});a.observe(i,{childList:!0,subtree:!0})}else e&&(i.addEventListener("DOMNodeInserted",n,!1),i.addEventListener("DOMNodeRemoved",n,!1))}}();Polymer("place-holder",{created:function(){if(!this.hasAttribute("id"))throw Error("place-holder should vahe a unique id");if(this.cache=document.createElement("view-registry").getCache("place-holder:id"),"comment"==this.getAttribute("renderAs")){var t=document.createComment("place-holder:"+this.id),n=new i(this.id,t);t.holder=n,this.cache.set("#"+this.id,n),e(t,this),this.parentNode.removeChild(this)}else this.cache.set("#"+this.id,this)},attached:function(){},detached:function(){"comment"!=this.getAttribute("renderAs")&&this.cache.del("#"+this.id)},place:function(e){t(e,this),this.content=e,console.log("Holder content placed: "+this.id)},remove:function(){var t=this.content.templateInstance,e=t.firstNode;if(e)if(t.firstNode==t.lastNode)this.parentNode.removeChild(e);else{for(;e&&e!=t.lastNode;){var i=e;e=e.nextSibling,this.parentNode.removeChild(i)}this.parentNode.removeChild(t.lastNode)}delete this.content}})}(),function(){Polymer("state-view",{getHolder:function(){var t=this.holderCache.get(this.target);if(!t)throw Error("state-view: Cannot locate target:"+this.target);return t},attached:function(){this.holderCache=document.createElement("view-registry").getCache("place-holder:id"),this.cache=document.createElement("view-registry").getCache("state-view:target");var t=this.cache.get(this.target);t?t.push(this):this.cache.set(this.target,[this])},detached:function(){delete this.instance;var t=this.cache.get(this.target);t&&t.length&&t.indexOf(this)>=0&&t.splice(t.indexOf(this),1)},changeModel:function(t){var e=this.instance.templateInstance.model;for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])},clearContent:function(){if(this.instance){var t=this.getHolder();t.remove(),delete this.instance}},makeSyntax:function(t){var e=Object.create(Polymer.api.declaration.events),i=t;e.findController=function(){return i};var n=new PolymerExpressions,a=n.prepareBinding;return n.prepareBinding=function(t,i,r){return e.prepareEventBinding(t,i,r)||a.call(n,t,i,r)},n},loadInto:function(t,e){if(this.bindModel){var i=Object.create(e);e=AppStates.util.createStateModel(i,null,this.bindModel,this.bindAs,this.bindModelAs)}var n=this.cache.get(this.target);n.forEach(function(t){this!=t&&t.instance&&t.target!=this.virtualHolder&&t.clearContent()}.bind(this)),t.content&&t.remove();var a=this.createInstance(e,this.makeSyntax());this.instance=a,t.place(a)},loadContent:function(t){if(this.instance)throw Error("Virtual view already loaded. Clear first.");var e=this.getHolder();this.loadInto(e,t)}})}(),function(){function t(){}function e(t,e,i){var n=[];return e.forEach(function(e){t.forEach(function(t){t.forEach(function(t){t.parentNode===e&&n.push(i?i(t):t)})})}),n}function i(t,e){e=e||[];var i=function(t){for(var e=t.nextElementSibling;e;)"APP-STATE"==e.tagName&&e.loaded&&e.unLoad(),e=e.nextElementSibling;for(var i=t.previousElementSibling;i;)"APP-STATE"==i.tagName&&i.loaded&&i.unLoad(),i=i.previousElementSibling},n=t.parentNode;for(e.splice(0,0,t);n&&"APP-STATE"===n.tagName;)e.splice(0,0,n),i(n),n=n.parentNode;i(t);var a=t.querySelectorAll("app-state");[].map.call(a,function(t){t&&"APP-STATE"==t.tagName&&t.loaded&&t.unLoad()})}function n(t,i,n){var a=function(t){t.loaded=!0,t.initializeModel(),console.log("State "+(t.id||t.header||"anonymous")+" loaded using model"),console.log(t.model)},r=[],o=function(t,e,i){for(var n=e.map(function(t){return t.target}),o=i.map(function(t){return t.target}),s=t.loaded,d=0;d<n.length;d++){var h=e[d];o.indexOf(n[d])<0&&(s?("undefined"!=typeof t.forceReload&&(t.unLoad(),a(t)),h.instance?r.indexOf(t)<0&&(t.ensureUrlParams(),r.push(t)):h.loadContent(t.model)):(a(t),s=!0,h.loadContent(t.model)))}s||a(t)};n=n||[];for(var s=0;s<t.length;s++){var d=t[s],h=e(i,[d]),l=e(i,t.slice(s+1));o.call(this,d,h,l)}}Polymer("app-state",{get parentState(){for(var t=this.parentNode;t;){if("APP-STATE"==t.tagName)return t;t=t.parentNode}},initializeModel:function(){if(this.modelInitialized)throw Error("Model seems already initialized for state "+this.id);for(var e,i=this.manager.parseUrl(),n=window.AppStates.util.routeArguments(this.url,i.path,i.search,this.regex,"auto"===this.manager.typecast),a=this.parentNode;!e&&a&&"APP-STATE"==a.tagName;)e=a.model,a=a.parentNode;var r=e?Object.create(e):Object.create(t.prototype),o={};if(this.bindUrlParams||""===this.bindUrlParams){var s=""===this.bindUrlParams?"urlParams":this.bindUrlParams;o[s]=n}else for(a=this.parentNode;a&&"APP-STATE"==a.tagName;){if(a.bindUrlParams||""===a.bindUrlParams){var d=""===a.bindUrlParams?"urlParams":a.bindUrlParams,h=a.model[d],l=h?h:Object.create();for(var c in n)"undefined"==typeof l[c]&&(l[c]=n[c]);break}a=a.parentNode}if(this.bindState||""===this.bindState){var u=""===this.bindState?"state":this.bindState;o[u]=this}else for(a=this.parentNode;a&&"APP-STATE"==a.tagName;){if(a.bindState||""===a.bindState){var f=""===a.bindState?"state":a.bindState;o[f]=this;break}a=a.parentNode}this.model=AppStates.util.createStateModel(r,o,this.bindModel,this.bindAs,this.bindModelAs),this.modelInitialized=!0},ensureUrlParams:function(){for(var t,e=this.manager.parseUrl(),i=window.AppStates.util.routeArguments(this.url,e.path,e.search,this.regex,"auto"===this.manager.typecast),n=this;n&&"APP-STATE"==n.tagName;){if(n.bindUrlParams||""===n.bindUrlParams){var a=""===n.bindUrlParams?"urlParams":n.bindUrlParams;t=n.model[a];break}n=n.parentNode}if(t){for(var r in i)t[r]=i[r];for(var o in t)"undefined"==typeof i[o]&&delete t[o]}},killModel:function(){for(var t in this.model)this.model.hasOwnProperty(t)&&(this.model[t]=void 0,delete this.model[t]);delete this.modelInitialized,delete this.model},getModel:function(){return this.model},getStateManager:function(){for(var t=this.parentNode;t;){if("APP-STATE-MANAGER"==t.tagName)return t;t=t.parentNode}},created:function(){this.stateViewCache=document.createElement("view-registry").getCache("state-view:target")},ready:function(){if(this.hasAttribute("childStates")){var t=this.getAttribute("childStates");if("undefined"!=typeof t){var e=document.createElement(t),i=window.AppStates.util.directChildren(e.shadowRoot,"app-state");i.forEach(function(t){this.appendChild(t)}.bind(this))}}},attached:function(){this.manager=this.getStateManager(),this.manager||(this.manager=document.querySelector("body /deep/ app-state-manager"))},load:function(){if(this.hasAttribute("redirect"))return this.manager.go(this.getAttribute("redirect"),{replace:!0}),void 0;var t=[];i(this,t),n.call(this,t,this.stateViewCache.itemsArray())},buildUrl:function(t){return window.AppStates.util.buildUrl(this.url,t,this.manager.mode)},unLoad:function(){for(var t=this,i=this.children[0];i;)"APP-STATE"==i.tagName&&i.loaded&&i.unLoad(),i=i.nextElementSibling;{var n=this.stateViewCache.itemsArray();e(n,[t],function(t){return t.clearContent(),t})}delete t.loaded,t.killModel(),console.log("State unloaded: "+(t.id||t.header||"anonymous"))}})}(),function(){function t(e,i){var n=e.url;"undefined"==typeof n&&(e.url=e.urlPostfix?e.parentState.url+e.urlPostfix+"/":i,n=i);for(var a=e.children[0];a;)"APP-STATE"==a.tagName&&t(a,n+a.id+"/"),a=a.nextElementSibling}var e="ActiveXObject"in window,i={};Polymer("app-state-manager",{matchState:function(t){"string"==typeof t&&(t=window.AppStates.util.parseUrl(t,this.mode));for(var e,i=this.querySelectorAll("app-state"),n=0;n<i.length;n++){var a=i[n];if(window.AppStates.util.testRoute(a.url,t.path,this.trailingSlash,a.regex)){e=a;break}}var r={match:e};return window.AppStates.util.fireEvent("state-match",r,this),r.match},getStateById:function(t){return this.querySelector("#"+t)},gotoState:function(t){if("string"==typeof t){var e=this.getStateById(t);if(!e)throw Error("unable to locate state:"+t);t=e}var i={from:this.currentState,to:t};if(window.AppStates.util.fireEvent("state-changing",i,this)){t.load(),this.oldState=this.currentState,this.currentState=t;var n={oldState:this.oldState,currentState:t};window.AppStates.util.fireEvent("state-changed",n,this),window.AppStates.util.fireEvent("app-state-changed",n,document)}},go:function(t,e){"pushstate"!==this.mode&&(t="#"+t),e&&e.replace===!0?window.history.replaceState(null,null,t):window.history.pushState(null,null,t);try{var i=new PopStateEvent("popstate",{bubbles:!1,cancelable:!1,state:{}});"dispatchEvent_"in window?window.dispatchEvent_(i):window.dispatchEvent(i)}catch(n){var a=document.createEvent("CustomEvent");a.initCustomEvent("popstate",!1,!1,{state:{}}),window.dispatchEvent(a)}},parseUrl:function(t,e){return t=t||window.location.href,e=e||this.mode,window.AppStates.util.parseUrl(t,e)},created:function(){window.AppStates.manager=this},urlChangeHandler:function(){var t=this.parseUrl();if(t.hash!==i.hash&&t.path===i.path&&t.search===i.search&&t.isHashPath===i.isHashPath)return this.scrollToHash(t.hash),void 0;var e=this.matchState(t);if(e&&"undefined"!=typeof e.forceReload);else if(i.isHashPath===t.isHashPath&&i.hash===t.hash&&i.path===t.path&&i.search===t.search)return;i=t;var n={url:t};if(window.AppStates.util.fireEvent("url-change",n,this)){var a=this.matchState(t);a&&this.gotoState(a)}},scrollToHash:function(t){t&&setTimeout(function(){var e=document.querySelector("html /deep/ "+t)||document.querySelector('html /deep/ [name="'+t.substring(1)+'"]');e&&e.scrollIntoView&&e.scrollIntoView(!0)},0)},init:function(){this.isInited||(this.isInited=!0,this.mode=this.mode||"auto",this.trailingSlash=this.trailingSlash||"strict",this.typecast=this.typecast||"auto",window.addEventListener("popstate",this.urlChangeHandler.bind(this),!1),e&&window.addEventListener("hashchange",this.router.urlChangeHandler.bind(this),!1),this.urlChangeHandler(),window.AppStates.util.fireEvent("states-inited",{},this))},domReady:function(){"manual"!==this.getAttribute("init")&&this.init()},ready:function(){var e=this.root=this.querySelector("app-state:first-child");e&&t.call(this,e,"/")},detached:function(){window.removeEventListener("popstate",this.stateChangeHandler,!1),e&&window.removeEventListener("hashchange",this.stateChangeHandler,!1)}})}();