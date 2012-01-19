/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.3.1
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2010-01-23
 * @link    http://jscolor.com
 */

var jscolor = {
	dir : "images/jscolor/",
	bindClass : "color",
	binding : true,
	preloading : true,
	install : function () {
		jscolor.addEvent(window, "load", jscolor.init)
	},
	init : function () {
		if (jscolor.binding) {
			jscolor.bind()
		}
		if (jscolor.preloading) {
			jscolor.preload()
		}
	},
	getDir : function () {
		if (!jscolor.dir) {
			var a = jscolor.detectDir();
			jscolor.dir = a !== false ? a : "jscolor/"
		}
		return jscolor.dir
	},
	detectDir : function () {
		var a = location.href;
		var b = document.getElementsByTagName("base");
		for (var c = 0; c < b.length; c += 1) {
			if (b[c].href) {
				a = b[c].href
			}
		}
		var b = document.getElementsByTagName("script");
		for (var c = 0; c < b.length; c += 1) {
			if (b[c].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(b[c].src)) {
				var d = new jscolor.URI(b[c].src);
				var e = d.toAbsolute(a);
				e.path = e.path.replace(/[^\/]+$/, "");
				e.query = null;
				e.fragment = null;
				return e.toString()
			}
		}
		return false
	},
	bind : function () {
		var matchClass = new RegExp("(^|\\s)(" + jscolor.bindClass + ")\\s*(\\{[^}]*\\})?", "i");
		var e = document.getElementsByTagName("input");
		for (var i = 0; i < e.length; i += 1) {
			var m;
			if (!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
				var prop = {};
				if (m[3]) {
					try {
						eval("prop=" + m[3])
					} catch (eInvalidProp) {}
					
				}
				e[i].color = new jscolor.color(e[i], prop)
			}
		}
	},
	preload : function () {
		for (var a in jscolor.imgRequire) {
			if (jscolor.imgRequire.hasOwnProperty(a)) {
				jscolor.loadImage(a)
			}
		}
	},
	images : {
		pad : [181, 101],
		sld : [16, 101],
		cross : [15, 15],
		arrow : [7, 11]
	},
	imgRequire : {},
	imgLoaded : {},
	requireImage : function (a) {
		jscolor.imgRequire[a] = true
	},
	loadImage : function (a) {
		if (!jscolor.imgLoaded[a]) {
			jscolor.imgLoaded[a] = new Image;
			jscolor.imgLoaded[a].src = jscolor.getDir() + a
		}
	},
	fetchElement : function (a) {
		return typeof a === "string" ? document.getElementById(a) : a
	},
	addEvent : function (a, b, c) {
		if (a.addEventListener) {
			a.addEventListener(b, c, false)
		} else if (a.attachEvent) {
			a.attachEvent("on" + b, c)
		}
	},
	fireEvent : function (a, b) {
		if (!a) {
			return
		}
		if (document.createEventObject) {
			var c = document.createEventObject();
			a.fireEvent("on" + b, c)
		} else if (document.createEvent) {
			var c = document.createEvent("HTMLEvents");
			c.initEvent(b, true, true);
			a.dispatchEvent(c)
		} else if (a["on" + b]) {
			a["on" + b]()
		}
	},
	getElementPos : function (a) {
		var b = a,
		c = a;
		var d = 20,
		e = 20;
		if (b.offsetParent) {
			do {
				d += b.offsetLeft;
				e += b.offsetTop
			} while (b = b.offsetParent)
		}
		while ((c = c.parentNode) && c.nodeName.toUpperCase() !== "BODY") {
			d -= c.scrollLeft;
			e -= c.scrollTop
		}
		return [d, e]
	},
	getElementSize : function (a) {
		return [a.offsetWidth, a.offsetHeight]
	},
	getMousePos : function (a) {
		var b = [];
		if (!a) {
			a = window.event
		}
		if (a.type === "touchmove" || a.type === "touchstart" || a.type === "touchend") {
			if (a.touches.length) {
				return [a.touches[0].pageX, a.touches[0].pageY]
			}
		} else {
			if (typeof a.pageX === "number") {
				return [a.pageX, a.pageY]
			} else {
				if (typeof a.clientX === "number") {
					return [a.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, a.clientY + document.body.scrollTop + document.documentElement.scrollTop]
				}
			}
		}
	},
	getViewPos : function () {
		if (typeof window.pageYOffset === "number") {
			return [window.pageXOffset, window.pageYOffset]
		} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			return [document.body.scrollLeft, document.body.scrollTop]
		} else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			return [document.documentElement.scrollLeft, document.documentElement.scrollTop]
		} else {
			return [0, 0]
		}
	},
	getViewSize : function () {
		if (typeof window.innerWidth === "number") {
			return [window.innerWidth, window.innerHeight]
		} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			return [document.body.clientWidth, document.body.clientHeight]
		} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			return [document.documentElement.clientWidth, document.documentElement.clientHeight]
		} else {
			return [0, 0]
		}
	},
	URI : function (a) {
		function b(a) {
			var b = "";
			while (a) {
				if (a.substr(0, 3) === "../" || a.substr(0, 2) === "./") {
					a = a.replace(/^\.+/, "").substr(1)
				} else if (a.substr(0, 3) === "/./" || a === "/.") {
					a = "/" + a.substr(3)
				} else if (a.substr(0, 4) === "/../" || a === "/..") {
					a = "/" + a.substr(4);
					b = b.replace(/\/?[^\/]*$/, "")
				} else if (a === "." || a === "..") {
					a = ""
				} else {
					var c = a.match(/^\/?[^\/]*/)[0];
					a = a.substr(c.length);
					b = b + c
				}
			}
			return b
		}
		this.scheme = null;
		this.authority = null;
		this.path = "";
		this.query = null;
		this.fragment = null;
		this.parse = function (a) {
			var b = a.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
			this.scheme = b[3] ? b[2] : null;
			this.authority = b[5] ? b[6] : null;
			this.path = b[7];
			this.query = b[9] ? b[10] : null;
			this.fragment = b[12] ? b[13] : null;
			return this
		};
		this.toString = function () {
			var a = "";
			if (this.scheme !== null) {
				a = a + this.scheme + ":"
			}
			if (this.authority !== null) {
				a = a + "//" + this.authority
			}
			if (this.path !== null) {
				a = a + this.path
			}
			if (this.query !== null) {
				a = a + "?" + this.query
			}
			if (this.fragment !== null) {
				a = a + "#" + this.fragment
			}
			return a
		};
		this.toAbsolute = function (a) {
			var a = new jscolor.URI(a);
			var c = this;
			var d = new jscolor.URI;
			if (a.scheme === null) {
				return false
			}
			if (c.scheme !== null && c.scheme.toLowerCase() === a.scheme.toLowerCase()) {
				c.scheme = null
			}
			if (c.scheme !== null) {
				d.scheme = c.scheme;
				d.authority = c.authority;
				d.path = b(c.path);
				d.query = c.query
			} else {
				if (c.authority !== null) {
					d.authority = c.authority;
					d.path = b(c.path);
					d.query = c.query
				} else {
					if (c.path === "") {
						d.path = a.path;
						if (c.query !== null) {
							d.query = c.query
						} else {
							d.query = a.query
						}
					} else {
						if (c.path.substr(0, 1) === "/") {
							d.path = b(c.path)
						} else {
							if (a.authority !== null && a.path === "") {
								d.path = "/" + c.path
							} else {
								d.path = a.path.replace(/[^\/]+$/, "") + c.path
							}
							d.path = b(d.path)
						}
						d.query = c.query
					}
					d.authority = a.authority
				}
				d.scheme = a.scheme
			}
			d.fragment = c.fragment;
			return d
		};
		if (a) {
			this.parse(a)
		}
	},
	color : function (a, b) {
		function n(a) {
			var b = jscolor.getMousePos(a);
			var c = b[1] - v[1];
			switch (p) {
			case 0:
				o.fromHSV(null, null, 1 - c / (jscolor.images.sld[1] - 1), z);
				break;
			case 1:
				o.fromHSV(null, 1 - c / (jscolor.images.sld[1] - 1), null, z);
				break
			}
		}
		function m(a) {
			var b = jscolor.getMousePos(a);
			var c = b[0] - v[0];
			var d = b[1] - v[1];
			switch (p) {
			case 0:
				o.fromHSV(c * (6 / (jscolor.images.pad[0] - 1)), 1 - d / (jscolor.images.pad[1] - 1), null, A);
				break;
			case 1:
				o.fromHSV(c * (6 / (jscolor.images.pad[0] - 1)), null, 1 - d / (jscolor.images.pad[1] - 1), A);
				break
			}
		}
		function l() {
			if (r !== a) {
				o.importColor()
			}
		}
		function k() {
			if (r === a) {
				o.importColor()
			}
			if (o.pickerOnfocus) {
				o.hidePicker()
			}
		}
		function j() {
			return jscolor.picker && jscolor.picker.owner === o
		}
		function i() {
			switch (p) {
			case 0:
				var a = 2;
				break;
			case 1:
				var a = 1;
				break
			}
			var b = Math.round((1 - o.hsv[a]) * (jscolor.images.sld[1] - 1));
			jscolor.picker.sldM.style.backgroundPosition = "11px " + (o.pickerFace + o.pickerInset + b - Math.floor(jscolor.images.arrow[1] / 2)) + "px"
		}
		function h() {
			switch (p) {
			case 0:
				var a = 1;
				break;
			case 1:
				var a = 2;
				break
			}
			var b = Math.round(o.hsv[0] / 6 * (jscolor.images.pad[0] - 1));
			var c = Math.round((1 - o.hsv[a]) * (jscolor.images.pad[1] - 1));
			jscolor.picker.padM.style.backgroundPosition = o.pickerFace + o.pickerInset + b - Math.floor(jscolor.images.cross[0] / 2) + "px " + (o.pickerFace + o.pickerInset + c - Math.floor(jscolor.images.cross[1] / 2)) + "px";
			var d = jscolor.picker.sld.childNodes;
			switch (p) {
			case 0:
				var f = e(o.hsv[0], o.hsv[1], 1);
				for (var g = 0; g < d.length; g += 1) {
					d[g].style.backgroundColor = "rgb(" + f[0] * (1 - g / d.length) * 100 + "%," + f[1] * (1 - g / d.length) * 100 + "%," + f[2] * (1 - g / d.length) * 100 + "%)"
				}
				break;
			case 1:
				var f,
				h,
				i = [o.hsv[2], 0, 0];
				var g = Math.floor(o.hsv[0]);
				var j = g % 2 ? o.hsv[0] - g : 1 - (o.hsv[0] - g);
				switch (g) {
				case 6:
				case 0:
					f = [0, 1, 2];
					break;
				case 1:
					f = [1, 0, 2];
					break;
				case 2:
					f = [2, 0, 1];
					break;
				case 3:
					f = [2, 1, 0];
					break;
				case 4:
					f = [1, 2, 0];
					break;
				case 5:
					f = [0, 2, 1];
					break
				}
				for (var g = 0; g < d.length; g += 1) {
					h = 1 - 1 / (d.length - 1) * g;
					i[1] = i[0] * (1 - h * j);
					i[2] = i[0] * (1 - h);
					d[g].style.backgroundColor = "rgb(" + i[f[0]] * 100 + "%," + i[f[1]] * 100 + "%," + i[f[2]] * 100 + "%)"
				}
				break
			}
		}
		function g(b, c) {
			if (!jscolor.picker) {
				jscolor.picker = {
					box : document.createElement("div"),
					boxB : document.createElement("div"),
					pad : document.createElement("div"),
					padB : document.createElement("div"),
					padM : document.createElement("div"),
					sld : document.createElement("div"),
					sldB : document.createElement("div"),
					sldM : document.createElement("div")
				};
				for (var d = 0, e = 4; d < jscolor.images.sld[1]; d += e) {
					var f = document.createElement("div");
					f.style.height = e + "px";
					f.style.fontSize = "1px";
					f.style.lineHeight = "0";
					jscolor.picker.sld.appendChild(f)
				}
				jscolor.picker.sldB.appendChild(jscolor.picker.sld);
				jscolor.picker.box.appendChild(jscolor.picker.sldB);
				jscolor.picker.box.appendChild(jscolor.picker.sldM);
				jscolor.picker.padB.appendChild(jscolor.picker.pad);
				jscolor.picker.box.appendChild(jscolor.picker.padB);
				jscolor.picker.box.appendChild(jscolor.picker.padM);
				jscolor.picker.boxB.appendChild(jscolor.picker.box);
				$(jscolor.picker.box).parent().append('<div id="color-picker-close">CLOSE</div>')
			}
			var g = jscolor.picker;
			v = [b + o.pickerBorder + o.pickerFace + o.pickerInset, c + o.pickerBorder + o.pickerFace + o.pickerInset];
			w = [null, c + o.pickerBorder + o.pickerFace + o.pickerInset];
			g.box.onmouseup = g.box.onmouseout = function () {
				a.focus()
			};
			g.box.onmousedown = function () {
				q = true
			};
			g.box.onmousemove = function (a) {
				t && m(a);
				u && n(a)
			};
			g.padM.onmouseup = g.padM.onmouseout = function () {
				if (t) {
					t = false;
					jscolor.fireEvent(r, "change")
				}
			};
			g.padM.onmousedown = function (a) {
				t = true;
				m(a)
			};
			g.sldM.onmouseup = g.sldM.onmouseout = function () {
				if (u) {
					u = false;
					jscolor.fireEvent(r, "change")
				}
			};
			g.sldM.onmousedown = function (a) {
				u = true;
				n(a)
			};
			if (jQuery.browser.mobile) {
				g.box.ontouchend = function (b) {
					b.preventDefault();
					a.focus()
				};
				g.box.ontouchstart = function (a) {
					a.preventDefault();
					q = true
				};
				g.box.ontouchmove = function (a) {
					a.preventDefault();
					t && m(a);
					u && n(a)
				};
				g.padM.ontouchend = function (a) {
					a.preventDefault();
					if (t) {
						t = false;
						jscolor.fireEvent(r, "change")
					}
				};
				g.padM.ontouchstart = function (a) {
					a.preventDefault();
					t = true;
					m(a)
				};
				g.sldM.ontouchend = function (a) {
					a.preventDefault();
					if (u) {
						u = false;
						jscolor.fireEvent(r, "change")
					}
				};
				g.sldM.ontouchstart = function (a) {
					a.preventDefault();
					u = true;
					n(a)
				}
			}
			g.box.style.width = 4 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[0] + 2 * jscolor.images.arrow[0] + jscolor.images.sld[0] + "px";
			g.box.style.height = 2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[1] + "px";
			g.boxB.style.position = "absolute";
			g.boxB.style.clear = "both";
			g.boxB.style.left = b + "px";
			g.boxB.style.top = c + "px";
			g.boxB.style.zIndex = o.pickerZIndex;
			g.boxB.style.border = o.pickerBorder + "px solid";
			g.boxB.style.borderColor = o.pickerBorderColor;
			g.boxB.style.background = o.pickerFaceColor;
			g.pad.style.width = jscolor.images.pad[0] + "px";
			g.pad.style.height = jscolor.images.pad[1] + "px";
			g.padB.style.position = "absolute";
			g.padB.style.left = o.pickerFace + "px";
			g.padB.style.top = o.pickerFace + "px";
			g.padB.style.border = o.pickerInset + "px solid";
			g.padB.style.borderColor = o.pickerInsetColor;
			g.padM.style.position = "absolute";
			g.padM.style.left = "0";
			g.padM.style.top = "0";
			g.padM.style.width = o.pickerFace + 2 * o.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + "px";
			g.padM.style.height = g.box.style.height;
			g.padM.style.cursor = "crosshair";
			g.sld.style.overflow = "hidden";
			g.sld.style.width = jscolor.images.sld[0] + "px";
			g.sld.style.height = jscolor.images.sld[1] + "px";
			g.sldB.style.position = "absolute";
			g.sldB.style.right = o.pickerFace + "px";
			g.sldB.style.top = o.pickerFace + "px";
			g.sldB.style.border = o.pickerInset + "px solid";
			g.sldB.style.borderColor = o.pickerInsetColor;
			g.sldM.style.position = "absolute";
			g.sldM.style.right = "0";
			g.sldM.style.top = "0";
			g.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + o.pickerFace + 2 * o.pickerInset + "px";
			g.sldM.style.height = g.box.style.height;
			try {
				g.sldM.style.cursor = "pointer"
			} catch (j) {
				g.sldM.style.cursor = "hand"
			}
			switch (p) {
			case 0:
				var k = "hs.png";
				break;
			case 1:
				var k = "hv.png";
				break
			}
			g.padM.style.background = "url('" + BASEURL + jscolor.getDir() + "cross.png') no-repeat";
			g.sldM.style.background = "url('" + BASEURL + jscolor.getDir() + "arrow.png') no-repeat";
			g.pad.style.background = "url('" + BASEURL + jscolor.getDir() + k + "') 0 0 no-repeat";
			h();
			i();
			jscolor.picker.owner = o;
			document.getElementsByTagName("body")[0].appendChild(g.boxB);
			$(g.boxB).attr({
				id : "js-color-picker"
			});
			$("#color-picker-close").click(function () {
				o.hidePicker()
			});
			if (jQuery.browser.mobile) {
				$("#color-picker-close").bind("touchstart", function () {
					o.hidePicker()
				})
			}
		}
		function f() {
			delete jscolor.picker.owner;
			document.getElementsByTagName("body")[0].removeChild(jscolor.picker.boxB)
		}
		function e(a, b, c) {
			if (a === null) {
				return [c, c, c]
			}
			var d = Math.floor(a);
			var e = d % 2 ? a - d : 1 - (a - d);
			var f = c * (1 - b);
			var g = c * (1 - b * e);
			switch (d) {
			case 6:
			case 0:
				return [c, g, f];
			case 1:
				return [g, c, f];
			case 2:
				return [f, c, g];
			case 3:
				return [f, g, c];
			case 4:
				return [g, f, c];
			case 5:
				return [c, f, g]
			}
		}
		function d(a, b, c) {
			var d = Math.min(Math.min(a, b), c);
			var e = Math.max(Math.max(a, b), c);
			var f = e - d;
			if (f === 0) {
				return [null, 0, e]
			}
			var g = a === d ? 3 + (c - b) / f : b === d ? 5 + (a - c) / f : 1 + (b - a) / f;
			return [g === 6 ? 0 : g, f / e, e]
		}
		this.required = true;
		this.adjust = true;
		this.hash = false;
		this.caps = true;
		this.valueElement = a;
		this.styleElement = a;
		this.hsv = [0, 0, 1];
		this.rgb = [1, 1, 1];
		this.pickerOnfocus = true;
		this.pickerMode = "HSV";
		this.pickerPosition = "left";
		this.pickerFace = 7;
		this.pickerFaceColor = "#fff";
		this.pickerBorder = 0;
		this.pickerBorderColor = "#fff";
		this.pickerInset = 0;
		this.pickerInsetColor = "#fff";
		this.pickerZIndex = 1e4;
		this.emptyValue = true;
		this.VALUE_UPDATED = new signals.Signal;
		for (var c in b) {
			if (b.hasOwnProperty(c)) {
				this[c] = b[c]
			}
		}
		this.hidePicker = function () {
			if (j()) {
				f()
			}
		};
		this.showPicker = function () {
			if (!j()) {
				var b = jscolor.getElementPos(a);
				var c = jscolor.getElementSize(a);
				var d = jscolor.getViewPos();
				var e = jscolor.getViewSize();
				var f = [2 * this.pickerBorder + 4 * this.pickerInset + 2 * this.pickerFace + jscolor.images.pad[0] + 2 * jscolor.images.arrow[0] + jscolor.images.sld[0], 2 * this.pickerBorder + 2 * this.pickerInset + 2 * this.pickerFace + jscolor.images.pad[1]];
				var h,
				i,
				k;
				switch (this.pickerPosition.toLowerCase()) {
				case "left":
					h = 1;
					i = 0;
					k = -1;
					break;
				case "right":
					h = 1;
					i = 0;
					k = 1;
					break;
				case "top":
					h = 0;
					i = 1;
					k = -1;
					break;
				default:
					h = 0;
					i = 1;
					k = 1;
					break
				}
				var l = (c[i] + f[i]) / 2;
				var m = [-d[h] + b[h] + f[h] > e[h] ? -d[h] + b[h] + c[h] / 2 > e[h] / 2 && b[h] + c[h] - f[h] >= 0 ? b[h] + c[h] - f[h] : b[h] : b[h], -d[i] + b[i] + c[i] + f[i] - l + l * k > e[i] ? -d[i] + b[i] + c[i] / 2 > e[i] / 2 && b[i] + c[i] - l - l * k >= 0 ? b[i] + c[i] - l - l * k : b[i] + c[i] - l + l * k : b[i] + c[i] - l + l * k >= 0 ? b[i] + c[i] - l + l * k : b[i] + c[i] - l - l * k];
				g(m[h], m[i])
			}
		};
		this.importColor = function () {
			if (!r) {
				this.exportColor()
			} else {
				if (!this.adjust) {
					if (!this.fromString(r.value, x)) {
						s.style.backgroundColor = s.jscStyle.backgroundColor;
						s.style.color = s.jscStyle.color;
						this.exportColor(x | y)
					}
				} else if (!this.required && /^\s*$/.test(r.value)) {
					r.value = "";
					s.style.backgroundColor = s.jscStyle.backgroundColor;
					s.style.color = s.jscStyle.color;
					this.exportColor(x | y)
				} else if (this.fromString(r.value)) {}
				else {
					this.exportColor()
				}
			}
		};
		this.exportColor = function (a) {
			if (!(a & x) && r) {
				var b = this.toString();
				if (this.caps) {
					b = b.toUpperCase()
				}
				if (this.hash) {
					b = "#" + b
				}
				if (!this.emptyValue) {
					r.value = b
				} else {
					r.value = ""
				}
				this.VALUE_UPDATED.dispatch(b)
			}
			if (!(a & y) && s) {
				s.style.backgroundColor = "#" + this.toString();
				s.style.color = .213 * this.rgb[0] + .715 * this.rgb[1] + .072 * this.rgb[2] < .5 ? "#FFF" : "#000"
			}
			if (!(a & z) && j()) {
				h()
			}
			if (!(a & A) && j()) {
				i()
			}
		};
		this.fromHSV = function (a, b, c, d) {
			a < 0 && (a = 0) || a > 6 && (a = 6);
			b < 0 && (b = 0) || b > 1 && (b = 1);
			c < 0 && (c = 0) || c > 1 && (c = 1);
			this.rgb = e(a === null ? this.hsv[0] : this.hsv[0] = a, b === null ? this.hsv[1] : this.hsv[1] = b, c === null ? this.hsv[2] : this.hsv[2] = c);
			this.exportColor(d)
		};
		this.fromRGB = function (a, b, c, e) {
			a < 0 && (a = 0) || a > 1 && (a = 1);
			b < 0 && (b = 0) || b > 1 && (b = 1);
			c < 0 && (c = 0) || c > 1 && (c = 1);
			var f = d(a === null ? this.rgb[0] : this.rgb[0] = a, b === null ? this.rgb[1] : this.rgb[1] = b, c === null ? this.rgb[2] : this.rgb[2] = c);
			if (f[0] !== null) {
				this.hsv[0] = f[0]
			}
			if (f[2] !== 0) {
				this.hsv[1] = f[1]
			}
			this.hsv[2] = f[2];
			this.exportColor(e)
		};
		this.fromString = function (a, b) {
			var c = a.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if (!c) {
				return false
			} else {
				if (c[1].length === 6) {
					this.fromRGB(parseInt(c[1].substr(0, 2), 16) / 255, parseInt(c[1].substr(2, 2), 16) / 255, parseInt(c[1].substr(4, 2), 16) / 255, b)
				} else {
					this.fromRGB(parseInt(c[1].charAt(0) + c[1].charAt(0), 16) / 255, parseInt(c[1].charAt(1) + c[1].charAt(1), 16) / 255, parseInt(c[1].charAt(2) + c[1].charAt(2), 16) / 255, b)
				}
				return true
			}
		};
		this.toString = function () {
			return (256 | Math.round(255 * this.rgb[0])).toString(16).substr(1) + (256 | Math.round(255 * this.rgb[1])).toString(16).substr(1) + (256 | Math.round(255 * this.rgb[2])).toString(16).substr(1)
		};
		var o = this;
		var p = this.pickerMode.toLowerCase() === "hvs" ? 1 : 0;
		var q = false;
		var r = jscolor.fetchElement(this.valueElement),
		s = jscolor.fetchElement(this.styleElement);
		var t = false,
		u = false;
		var v,
		w;
		var x = 1 << 0,
		y = 1 << 1,
		z = 1 << 2,
		A = 1 << 3;
		jscolor.addEvent(a, "click", function () {
			if (o.pickerOnfocus) {
				o.showPicker()
			}
		});
		jscolor.addEvent(a, "blur", function () {
			if (!q) {
				window.setTimeout(function () {
					q || k();
					q = false
				}, 0)
			} else {
				q = false
			}
		});
		if (r) {
			var B = function () {
				o.fromString(r.value, x)
			};
			jscolor.addEvent(r, "keyup", B);
			jscolor.addEvent(r, "input", B);
			jscolor.addEvent(r, "blur", l);
			r.setAttribute("autocomplete", "off")
		}
		if (s) {
			s.jscStyle = {
				backgroundColor : s.style.backgroundColor,
				color : s.style.color
			}
		}
		switch (p) {
		case 0:
			jscolor.requireImage("hs.png");
			break;
		case 1:
			jscolor.requireImage("hv.png");
			break
		}
		jscolor.requireImage("cross.gif");
		jscolor.requireImage("arrow.gif");
		this.importColor()
	}
};
jscolor.install()
