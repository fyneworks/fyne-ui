// https://gist.github.com/mmurph211/4271685
//
////////////////////////////////////
//
// Internet Explorer localStorage polyfill
// MIT-style license. Copyright 2012 Matt V. Murphy
//
////////////////////////////////////
(function(window, document) {
	"use strict";
	var userData, attr, attributes;
	
	if (!window.localStorage && (userData = window.document.body) && userData.addBehavior) {
		if (userData.addBehavior("#default#userdata")) {
			userData.load((attr = "localStorage"));
			attributes = userData.XMLDocument.documentElement.attributes;
			
			window.localStorage = {
				"length" : attributes.length, 
				"key" : function(idx) { return (idx >= this.length) ? null : attributes[idx].name; }, 
				"getItem" : function(key) { return userData.getAttribute(key); }, 
				"setItem" : function(key, value) {
					userData.setAttribute(key, value);
					userData.save(attr);
					this.length += ((userData.getAttribute(key) === null) ? 1 : 0);
				}, 
				"removeItem" : function(key) {
					if (userData.getAttribute(key) !== null) {
						userData.removeAttribute(key);
						userData.save(attr);
						this.length = Math.max(0, this.length - 1);
					}
				}, 
				"clear" : function() {
					while (this.length) { userData.removeAttribute(attributes[--this.length].name); }
					userData.save(attr);
				}
			};
		}
	}
})(this, this.document);