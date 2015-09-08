var Prototype = {
    Version: "1.7",
    Browser: (function () {
        var b = navigator.userAgent;
        var a = Object.prototype.toString.call(window.opera) == "[object Opera]";
        return {
            IE: !! window.attachEvent && !a,
            Opera: a,
            WebKit: b.indexOf("AppleWebKit/") > -1,
            Gecko: b.indexOf("Gecko") > -1 && b.indexOf("KHTML") === -1,
            MobileSafari: /Apple.*Mobile/.test(b)
        }
    })(),
    BrowserFeatures: {
        XPath: !! document.evaluate,
        SelectorsAPI: !! document.querySelector,
        ElementExtensions: (function () {
            var a = window.Element || window.HTMLElement;
            return !!(a && a.prototype)
        })(),
        SpecificElementExtensions: (function () {
            if (typeof window.HTMLDivElement !== "undefined") {
                return true
            }
            var c = document.createElement("div"),
                b = document.createElement("form"),
                a = false;
            if (c.__proto__ && (c.__proto__ !== b.__proto__)) {
                a = true
            }
            c = b = null;
            return a
        })()
    },
    ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>",
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function () {},
    K: function (a) {
        return a
    }
};
if (Prototype.Browser.MobileSafari) {
    Prototype.BrowserFeatures.SpecificElementExtensions = false
}
var Abstract = {};
var Try = {
    these: function () {
        var c;
        for (var b = 0, d = arguments.length; b < d; b++) {
            var a = arguments[b];
            try {
                c = a();
                break
            } catch (f) {}
        }
        return c
    }
};
var Class = (function () {
    var d = (function () {
        for (var e in {
            toString: 1
        }) {
            if (e === "toString") {
                return false
            }
        }
        return true
    })();

    function a() {}
    function b() {
        var h = null,
            g = $A(arguments);
        if (Object.isFunction(g[0])) {
            h = g.shift()
        }
        function e() {
            this.initialize.apply(this, arguments)
        }
        Object.extend(e, Class.Methods);
        e.superclass = h;
        e.subclasses = [];
        if (h) {
            a.prototype = h.prototype;
            e.prototype = new a;
            h.subclasses.push(e)
        }
        for (var f = 0, k = g.length; f < k; f++) {
            e.addMethods(g[f])
        }
        if (!e.prototype.initialize) {
            e.prototype.initialize = Prototype.emptyFunction
        }
        e.prototype.constructor = e;
        return e
    }
    function c(m) {
        var g = this.superclass && this.superclass.prototype,
            f = Object.keys(m);
        if (d) {
            if (m.toString != Object.prototype.toString) {
                f.push("toString")
            }
            if (m.valueOf != Object.prototype.valueOf) {
                f.push("valueOf")
            }
        }
        for (var e = 0, h = f.length; e < h; e++) {
            var l = f[e],
                k = m[l];
            if (g && Object.isFunction(k) && k.argumentNames()[0] == "$super") {
                var n = k;
                k = (function (o) {
                    return function () {
                        return g[o].apply(this, arguments)
                    }
                })(l).wrap(n);
                k.valueOf = n.valueOf.bind(n);
                k.toString = n.toString.bind(n)
            }
            this.prototype[l] = k
        }
        return this
    }
    return {
        create: b,
        Methods: {
            addMethods: c
        }
    }
})();
(function () {
    var E = Object.prototype.toString,
        D = "Null",
        q = "Undefined",
        x = "Boolean",
        f = "Number",
        u = "String",
        J = "Object",
        v = "[object Function]",
        A = "[object Boolean]",
        g = "[object Number]",
        n = "[object String]",
        h = "[object Array]",
        z = "[object Date]",
        k = window.JSON && typeof JSON.stringify === "function" && JSON.stringify(0) === "0" && typeof JSON.stringify(Prototype.K) === "undefined";

    function m(L) {
        switch (L) {
        case null:
            return D;
        case (void 0):
            return q
        }
        var K = typeof L;
        switch (K) {
        case "boolean":
            return x;
        case "number":
            return f;
        case "string":
            return u
        }
        return J
    }
    function B(K, M) {
        for (var L in M) {
            K[L] = M[L]
        }
        return K
    }
    function I(K) {
        try {
            if (c(K)) {
                return "undefined"
            }
            if (K === null) {
                return "null"
            }
            return K.inspect ? K.inspect() : String(K)
        } catch (L) {
            if (L instanceof RangeError) {
                return "..."
            }
            throw L
        }
    }
    function F(K) {
        return H("", {
            "": K
        }, [])
    }
    function H(U, Q, R) {
        var S = Q[U],
            P = typeof S;
        if (m(S) === J && typeof S.toJSON === "function") {
            S = S.toJSON(U)
        }
        var M = E.call(S);
        switch (M) {
        case g:
        case A:
        case n:
            S = S.valueOf()
        }
        switch (S) {
        case null:
            return "null";
        case true:
            return "true";
        case false:
            return "false"
        }
        P = typeof S;
        switch (P) {
        case "string":
            return S.inspect(true);
        case "number":
            return isFinite(S) ? String(S) : "null";
        case "object":
            for (var L = 0, K = R.length; L < K; L++) {
                if (R[L] === S) {
                    throw new TypeError()
                }
            }
            R.push(S);
            var O = [];
            if (M === h) {
                for (var L = 0, K = S.length; L < K; L++) {
                    var N = H(L, S, R);
                    O.push(typeof N === "undefined" ? "null" : N)
                }
                O = "[" + O.join(",") + "]"
            } else {
                var V = Object.keys(S);
                for (var L = 0, K = V.length; L < K; L++) {
                    var U = V[L],
                        N = H(U, S, R);
                    if (typeof N !== "undefined") {
                        O.push(U.inspect(true) + ":" + N)
                    }
                }
                O = "{" + O.join(",") + "}"
            }
            R.pop();
            return O
        }
    }
    function y(K) {
        return JSON.stringify(K)
    }
    function l(K) {
        return $H(K).toQueryString()
    }
    function r(K) {
        return K && K.toHTML ? K.toHTML() : String.interpret(K)
    }
    function t(K) {
        if (m(K) !== J) {
            throw new TypeError()
        }
        var L = [];
        for (var M in K) {
            if (K.hasOwnProperty(M)) {
                L.push(M)
            }
        }
        return L
    }
    function d(K) {
        var L = [];
        for (var M in K) {
            L.push(K[M])
        }
        return L
    }
    function C(K) {
        return B({}, K)
    }
    function w(K) {
        return !!(K && K.nodeType == 1)
    }
    function o(K) {
        return E.call(K) === h
    }
    var b = (typeof Array.isArray == "function") && Array.isArray([]) && !Array.isArray({});
    if (b) {
        o = Array.isArray
    }
    function e(K) {
        return K instanceof Hash
    }
    function a(K) {
        return E.call(K) === v
    }
    function p(K) {
        return E.call(K) === n
    }
    function s(K) {
        return E.call(K) === g
    }
    function G(K) {
        return E.call(K) === z
    }
    function c(K) {
        return typeof K === "undefined"
    }
    B(Object, {
        extend: B,
        inspect: I,
        toJSON: k ? y : F,
        toQueryString: l,
        toHTML: r,
        keys: Object.keys || t,
        values: d,
        clone: C,
        isElement: w,
        isArray: o,
        isHash: e,
        isFunction: a,
        isString: p,
        isNumber: s,
        isDate: G,
        isUndefined: c
    })
})();
Object.extend(Function.prototype, (function () {
    var m = Array.prototype.slice;

    function d(q, n) {
        var p = q.length,
            o = n.length;
        while (o--) {
            q[p + o] = n[o]
        }
        return q
    }
    function k(o, n) {
        o = m.call(o, 0);
        return d(o, n)
    }
    function g() {
        var n = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
        return n.length == 1 && !n[0] ? [] : n
    }
    function h(p) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) {
            return this
        }
        var n = this,
            o = m.call(arguments, 1);
        return function () {
            var q = k(o, arguments);
            return n.apply(p, q)
        }
    }
    function f(p) {
        var n = this,
            o = m.call(arguments, 1);
        return function (r) {
            var q = d([r || window.event], o);
            return n.apply(p, q)
        }
    }
    function l() {
        if (!arguments.length) {
            return this
        }
        var n = this,
            o = m.call(arguments, 0);
        return function () {
            var p = k(o, arguments);
            return n.apply(this, p)
        }
    }
    function e(p) {
        var n = this,
            o = m.call(arguments, 1);
        p = p * 1000;
        return window.setTimeout(function () {
            return n.apply(n, o)
        }, p)
    }
    function a() {
        var n = d([0.01], arguments);
        return this.delay.apply(this, n)
    }
    function c(o) {
        var n = this;
        return function () {
            var p = d([n.bind(this)], arguments);
            return o.apply(this, p)
        }
    }
    function b() {
        if (this._methodized) {
            return this._methodized
        }
        var n = this;
        return this._methodized = function () {
            var o = d([this], arguments);
            return n.apply(null, o)
        }
    }
    return {
        argumentNames: g,
        bind: h,
        bindAsEventListener: f,
        curry: l,
        delay: e,
        defer: a,
        wrap: c,
        methodize: b
    }
})());
(function (c) {
    function b() {
        return this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + "Z"
    }
    function a() {
        return this.toISOString()
    }
    if (!c.toISOString) {
        c.toISOString = b
    }
    if (!c.toJSON) {
        c.toJSON = a
    }
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function (a) {
    return String(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
    initialize: function (b, a) {
        this.callback = b;
        this.frequency = a;
        this.currentlyExecuting = false;
        this.registerCallback()
    },
    registerCallback: function () {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
    },
    execute: function () {
        this.callback(this)
    },
    stop: function () {
        if (!this.timer) {
            return
        }
        clearInterval(this.timer);
        this.timer = null
    },
    onTimerEvent: function () {
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.execute();
                this.currentlyExecuting = false
            } catch (a) {
                this.currentlyExecuting = false;
                throw a
            }
        }
    }
});
Object.extend(String, {
    interpret: function (a) {
        return a == null ? "" : String(a)
    },
    specialChar: {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\\": "\\\\"
    }
});
Object.extend(String.prototype, (function () {
    var NATIVE_JSON_PARSE_SUPPORT = window.JSON && typeof JSON.parse === "function" && JSON.parse('{"test": true}').test;

    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) {
            return replacement
        }
        var template = new Template(replacement);
        return function (match) {
            return template.evaluate(match)
        }
    }
    function gsub(pattern, replacement) {
        var result = "",
            source = this,
            match;
        replacement = prepareReplacement(replacement);
        if (Object.isString(pattern)) {
            pattern = RegExp.escape(pattern)
        }
        if (!(pattern.length || pattern.source)) {
            replacement = replacement("");
            return replacement + source.split("").join(replacement) + replacement
        }
        while (source.length > 0) {
            if (match = source.match(pattern)) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length)
            } else {
                result += source, source = ""
            }
        }
        return result
    }
    function sub(pattern, replacement, count) {
        replacement = prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1 : count;
        return this.gsub(pattern, function (match) {
            if (--count < 0) {
                return match[0]
            }
            return replacement(match)
        })
    }
    function scan(pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this)
    }
    function truncate(length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? "..." : truncation;
        return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this)
    }
    function strip() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }
    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
    }
    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
    }
    function extractScripts() {
        var matchAll = new RegExp(Prototype.ScriptFragment, "img"),
            matchOne = new RegExp(Prototype.ScriptFragment, "im");
        return (this.match(matchAll) || []).map(function (scriptTag) {
            return (scriptTag.match(matchOne) || ["", ""])[1]
        })
    }
    function evalScripts() {
        return this.extractScripts().map(function (script) {
            return eval(script)
        })
    }
    function escapeHTML() {
        return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }
    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    }
    function toQueryParams(separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) {
            return {}
        }
        return match[1].split(separator || "&").inject({}, function (hash, pair) {
            if ((pair = pair.split("="))[0]) {
                var key = decodeURIComponent(pair.shift()),
                    value = pair.length > 1 ? pair.join("=") : pair[0];
                if (value != undefined) {
                    value = decodeURIComponent(value)
                }
                if (key in hash) {
                    if (!Object.isArray(hash[key])) {
                        hash[key] = [hash[key]]
                    }
                    hash[key].push(value)
                } else {
                    hash[key] = value
                }
            }
            return hash
        })
    }
    function toArray() {
        return this.split("")
    }
    function succ() {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
    }
    function times(count) {
        return count < 1 ? "" : new Array(count + 1).join(this)
    }
    function camelize() {
        return this.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : ""
        })
    }
    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
    }
    function underscore() {
        return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
    }
    function dasherize() {
        return this.replace(/_/g, "-")
    }
    function inspect(useDoubleQuotes) {
        var escapedString = this.replace(/[\x00-\x1f\\]/g, function (character) {
            if (character in String.specialChar) {
                return String.specialChar[character]
            }
            return "\\u00" + character.charCodeAt().toPaddedString(2, 16)
        });
        if (useDoubleQuotes) {
            return '"' + escapedString.replace(/"/g, '\\"') + '"'
        }
        return "'" + escapedString.replace(/'/g, "\\'") + "'"
    }
    function unfilterJSON(filter) {
        return this.replace(filter || Prototype.JSONFilter, "$1")
    }
    function isJSON() {
        var str = this;
        if (str.blank()) {
            return false
        }
        str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@");
        str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
        str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
        return (/^[\],:{}\s]*$/).test(str)
    }
    function evalJSON(sanitize) {
        var json = this.unfilterJSON(),
            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        if (cx.test(json)) {
            json = json.replace(cx, function (a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            })
        }
        try {
            if (!sanitize || json.isJSON()) {
                return eval("(" + json + ")")
            }
        } catch (e) {}
        throw new SyntaxError("Badly formed JSON string: " + this.inspect())
    }
    function parseJSON() {
        var json = this.unfilterJSON();
        return JSON.parse(json)
    }
    function include(pattern) {
        return this.indexOf(pattern) > -1
    }
    function startsWith(pattern) {
        return this.lastIndexOf(pattern, 0) === 0
    }
    function endsWith(pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.indexOf(pattern, d) === d
    }
    function empty() {
        return this == ""
    }
    function blank() {
        return /^\s*$/.test(this)
    }
    function interpolate(object, pattern) {
        return new Template(this, pattern).evaluate(object)
    }
    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim || strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
        include: include,
        startsWith: startsWith,
        endsWith: endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    }
})());
var Template = Class.create({
    initialize: function (a, b) {
        this.template = a.toString();
        this.pattern = b || Template.Pattern
    },
    evaluate: function (a) {
        if (a && Object.isFunction(a.toTemplateReplacements)) {
            a = a.toTemplateReplacements()
        }
        return this.template.gsub(this.pattern, function (d) {
            if (a == null) {
                return (d[1] + "")
            }
            var f = d[1] || "";
            if (f == "\\") {
                return d[2]
            }
            var b = a,
                g = d[3],
                e = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            d = e.exec(g);
            if (d == null) {
                return f
            }
            while (d != null) {
                var c = d[1].startsWith("[") ? d[2].replace(/\\\\]/g, "]") : d[1];
                b = b[c];
                if (null == b || "" == d[3]) {
                    break
                }
                g = g.substring("[" == d[3] ? d[1].length : d[0].length);
                d = e.exec(g)
            }
            return f + String.interpret(b)
        })
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function () {
    function c(A, z) {
        var y = 0;
        try {
            this._each(function (C) {
                A.call(z, C, y++)
            })
        } catch (B) {
            if (B != $break) {
                throw B
            }
        }
        return this
    }
    function t(B, A, z) {
        var y = -B,
            C = [],
            D = this.toArray();
        if (B < 1) {
            return D
        }
        while ((y += B) < D.length) {
            C.push(D.slice(y, y + B))
        }
        return C.collect(A, z)
    }
    function b(A, z) {
        A = A || Prototype.K;
        var y = true;
        this.each(function (C, B) {
            y = y && !! A.call(z, C, B);
            if (!y) {
                throw $break
            }
        });
        return y
    }
    function k(A, z) {
        A = A || Prototype.K;
        var y = false;
        this.each(function (C, B) {
            if (y = !! A.call(z, C, B)) {
                throw $break
            }
        });
        return y
    }
    function l(A, z) {
        A = A || Prototype.K;
        var y = [];
        this.each(function (C, B) {
            y.push(A.call(z, C, B))
        });
        return y
    }
    function v(A, z) {
        var y;
        this.each(function (C, B) {
            if (A.call(z, C, B)) {
                y = C;
                throw $break
            }
        });
        return y
    }
    function h(A, z) {
        var y = [];
        this.each(function (C, B) {
            if (A.call(z, C, B)) {
                y.push(C)
            }
        });
        return y
    }
    function g(B, A, z) {
        A = A || Prototype.K;
        var y = [];
        if (Object.isString(B)) {
            B = new RegExp(RegExp.escape(B))
        }
        this.each(function (D, C) {
            if (B.match(D)) {
                y.push(A.call(z, D, C))
            }
        });
        return y
    }
    function a(y) {
        if (Object.isFunction(this.indexOf)) {
            if (this.indexOf(y) != -1) {
                return true
            }
        }
        var z = false;
        this.each(function (A) {
            if (A == y) {
                z = true;
                throw $break
            }
        });
        return z
    }
    function s(z, y) {
        y = Object.isUndefined(y) ? null : y;
        return this.eachSlice(z, function (A) {
            while (A.length < z) {
                A.push(y)
            }
            return A
        })
    }
    function n(y, A, z) {
        this.each(function (C, B) {
            y = A.call(z, y, C, B)
        });
        return y
    }
    function x(z) {
        var y = $A(arguments).slice(1);
        return this.map(function (A) {
            return A[z].apply(A, y)
        })
    }
    function r(A, z) {
        A = A || Prototype.K;
        var y;
        this.each(function (C, B) {
            C = A.call(z, C, B);
            if (y == null || C >= y) {
                y = C
            }
        });
        return y
    }
    function p(A, z) {
        A = A || Prototype.K;
        var y;
        this.each(function (C, B) {
            C = A.call(z, C, B);
            if (y == null || C < y) {
                y = C
            }
        });
        return y
    }
    function e(B, z) {
        B = B || Prototype.K;
        var A = [],
            y = [];
        this.each(function (D, C) {
            (B.call(z, D, C) ? A : y).push(D)
        });
        return [A, y]
    }
    function f(z) {
        var y = [];
        this.each(function (A) {
            y.push(A[z])
        });
        return y
    }
    function d(A, z) {
        var y = [];
        this.each(function (C, B) {
            if (!A.call(z, C, B)) {
                y.push(C)
            }
        });
        return y
    }
    function o(z, y) {
        return this.map(function (B, A) {
            return {
                value: B,
                criteria: z.call(y, B, A)
            }
        }).sort(function (D, C) {
            var B = D.criteria,
                A = C.criteria;
            return B < A ? -1 : B > A ? 1 : 0
        }).pluck("value")
    }
    function q() {
        return this.map()
    }
    function u() {
        var z = Prototype.K,
            y = $A(arguments);
        if (Object.isFunction(y.last())) {
            z = y.pop()
        }
        var A = [this].concat(y).map($A);
        return this.map(function (C, B) {
            return z(A.pluck(B))
        })
    }
    function m() {
        return this.toArray().length
    }
    function w() {
        return "#<Enumerable:" + this.toArray().inspect() + ">"
    }
    return {
        each: c,
        eachSlice: t,
        all: b,
        every: b,
        any: k,
        some: k,
        collect: l,
        map: l,
        detect: v,
        findAll: h,
        select: h,
        filter: h,
        grep: g,
        include: a,
        member: a,
        inGroupsOf: s,
        inject: n,
        invoke: x,
        max: r,
        min: p,
        partition: e,
        pluck: f,
        reject: d,
        sortBy: o,
        toArray: q,
        entries: q,
        zip: u,
        size: m,
        inspect: w,
        find: v
    }
})();

function $A(c) {
    if (!c) {
        return []
    }
    if ("toArray" in Object(c)) {
        return c.toArray()
    }
    var b = c.length || 0,
        a = new Array(b);
    while (b--) {
        a[b] = c[b]
    }
    return a
}
function $w(a) {
    if (!Object.isString(a)) {
        return []
    }
    a = a.strip();
    return a ? a.split(/\s+/) : []
}
Array.from = $A;
(function () {
    var t = Array.prototype,
        o = t.slice,
        q = t.forEach;

    function b(y, x) {
        for (var w = 0, z = this.length >>> 0; w < z; w++) {
            if (w in this) {
                y.call(x, this[w], w, this)
            }
        }
    }
    if (!q) {
        q = b
    }
    function n() {
        this.length = 0;
        return this
    }
    function d() {
        return this[0]
    }
    function g() {
        return this[this.length - 1]
    }
    function k() {
        return this.select(function (w) {
            return w != null
        })
    }
    function v() {
        return this.inject([], function (x, w) {
            if (Object.isArray(w)) {
                return x.concat(w.flatten())
            }
            x.push(w);
            return x
        })
    }
    function h() {
        var w = o.call(arguments, 0);
        return this.select(function (x) {
            return !w.include(x)
        })
    }
    function f(w) {
        return (w === false ? this.toArray() : this)._reverse()
    }
    function m(w) {
        return this.inject([], function (z, y, x) {
            if (0 == x || (w ? z.last() != y : !z.include(y))) {
                z.push(y)
            }
            return z
        })
    }
    function r(w) {
        return this.uniq().findAll(function (x) {
            return w.detect(function (y) {
                return x === y
            })
        })
    }
    function s() {
        return o.call(this, 0)
    }
    function l() {
        return this.length
    }
    function u() {
        return "[" + this.map(Object.inspect).join(", ") + "]"
    }
    function a(y, w) {
        w || (w = 0);
        var x = this.length;
        if (w < 0) {
            w = x + w
        }
        for (; w < x; w++) {
            if (this[w] === y) {
                return w
            }
        }
        return -1
    }
    function p(x, w) {
        w = isNaN(w) ? this.length : (w < 0 ? this.length + w : w) + 1;
        var y = this.slice(0, w).reverse().indexOf(x);
        return (y < 0) ? y : w - y - 1
    }
    function c() {
        var B = o.call(this, 0),
            z;
        for (var x = 0, y = arguments.length; x < y; x++) {
            z = arguments[x];
            if (Object.isArray(z) && !("callee" in z)) {
                for (var w = 0, A = z.length; w < A; w++) {
                    B.push(z[w])
                }
            } else {
                B.push(z)
            }
        }
        return B
    }
    Object.extend(t, Enumerable);
    if (!t._reverse) {
        t._reverse = t.reverse
    }
    Object.extend(t, {
        _each: q,
        clear: n,
        first: d,
        last: g,
        compact: k,
        flatten: v,
        without: h,
        reverse: f,
        uniq: m,
        intersect: r,
        clone: s,
        toArray: s,
        size: l,
        inspect: u
    });
    var e = (function () {
        return [].concat(arguments)[0][0] !== 1
    })(1, 2);
    if (e) {
        t.concat = c
    }
    if (!t.indexOf) {
        t.indexOf = a
    }
    if (!t.lastIndexOf) {
        t.lastIndexOf = p
    }
})();

function $H(a) {
    return new Hash(a)
}
var Hash = Class.create(Enumerable, (function () {
    function e(r) {
        this._object = Object.isHash(r) ? r.toObject() : Object.clone(r)
    }
    function f(s) {
        for (var r in this._object) {
            var t = this._object[r],
                u = [r, t];
            u.key = r;
            u.value = t;
            s(u)
        }
    }
    function l(r, s) {
        return this._object[r] = s
    }
    function c(r) {
        if (this._object[r] !== Object.prototype[r]) {
            return this._object[r]
        }
    }
    function o(r) {
        var s = this._object[r];
        delete this._object[r];
        return s
    }
    function q() {
        return Object.clone(this._object)
    }
    function p() {
        return this.pluck("key")
    }
    function n() {
        return this.pluck("value")
    }
    function g(s) {
        var r = this.detect(function (t) {
            return t.value === s
        });
        return r && r.key
    }
    function k(r) {
        return this.clone().update(r)
    }
    function d(r) {
        return new Hash(r).inject(this, function (s, t) {
            s.set(t.key, t.value);
            return s
        })
    }
    function b(r, s) {
        if (Object.isUndefined(s)) {
            return r
        }
        return r + "=" + encodeURIComponent(String.interpret(s))
    }
    function a() {
        return this.inject([], function (v, y) {
            var u = encodeURIComponent(y.key),
                s = y.value;
            if (s && typeof s == "object") {
                if (Object.isArray(s)) {
                    var x = [];
                    for (var t = 0, r = s.length, w; t < r; t++) {
                        w = s[t];
                        x.push(b(u, w))
                    }
                    return v.concat(x)
                }
            } else {
                v.push(b(u, s))
            }
            return v
        }).join("&")
    }
    function m() {
        return "#<Hash:{" + this.map(function (r) {
            return r.map(Object.inspect).join(": ")
        }).join(", ") + "}>"
    }
    function h() {
        return new Hash(this)
    }
    return {
        initialize: e,
        _each: f,
        set: l,
        get: c,
        unset: o,
        toObject: q,
        toTemplateReplacements: q,
        keys: p,
        values: n,
        index: g,
        merge: k,
        update: d,
        toQueryString: a,
        inspect: m,
        toJSON: q,
        clone: h
    }
})());
Hash.from = $H;
Object.extend(Number.prototype, (function () {
    function d() {
        return this.toPaddedString(2, 16)
    }
    function b() {
        return this + 1
    }
    function h(l, k) {
        $R(0, this, true).each(l, k);
        return this
    }
    function g(m, l) {
        var k = this.toString(l || 10);
        return "0".times(m - k.length) + k
    }
    function a() {
        return Math.abs(this)
    }
    function c() {
        return Math.round(this)
    }
    function e() {
        return Math.ceil(this)
    }
    function f() {
        return Math.floor(this)
    }
    return {
        toColorPart: d,
        succ: b,
        times: h,
        toPaddedString: g,
        abs: a,
        round: c,
        ceil: e,
        floor: f
    }
})());

function $R(c, a, b) {
    return new ObjectRange(c, a, b)
}
var ObjectRange = Class.create(Enumerable, (function () {
    function b(f, d, e) {
        this.start = f;
        this.end = d;
        this.exclusive = e
    }
    function c(d) {
        var e = this.start;
        while (this.include(e)) {
            d(e);
            e = e.succ()
        }
    }
    function a(d) {
        if (d < this.start) {
            return false
        }
        if (this.exclusive) {
            return d < this.end
        }
        return d <= this.end
    }
    return {
        initialize: b,
        _each: c,
        include: a
    }
})());
var Ajax = {
    getTransport: function () {
        return Try.these(function () {
            return new XMLHttpRequest()
        }, function () {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }) || false
    },
    activeRequestCount: 0
};
Ajax.Responders = {
    responders: [],
    _each: function (a) {
        this.responders._each(a)
    },
    register: function (a) {
        if (!this.include(a)) {
            this.responders.push(a)
        }
    },
    unregister: function (a) {
        this.responders = this.responders.without(a)
    },
    dispatch: function (d, b, c, a) {
        this.each(function (f) {
            if (Object.isFunction(f[d])) {
                try {
                    f[d].apply(f, [b, c, a])
                } catch (g) {}
            }
        })
    }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function () {
        Ajax.activeRequestCount++
    },
    onComplete: function () {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function (a) {
        this.options = {
            method: "post",
            asynchronous: true,
            contentType: "application/x-www-form-urlencoded",
            encoding: "UTF-8",
            parameters: "",
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, a || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isHash(this.options.parameters)) {
            this.options.parameters = this.options.parameters.toObject()
        }
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
    initialize: function ($super, b, a) {
        $super(a);
        this.transport = Ajax.getTransport();
        this.request(b)
    },
    request: function (b) {
        this.url = b;
        this.method = this.options.method;
        var d = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);
        if (!["get", "post"].include(this.method)) {
            d += (d ? "&" : "") + "_method=" + this.method;
            this.method = "post"
        }
        if (d && this.method === "get") {
            this.url += (this.url.include("?") ? "&" : "?") + d
        }
        this.parameters = d.toQueryParams();
        try {
            var a = new Ajax.Response(this);
            if (this.options.onCreate) {
                this.options.onCreate(a)
            }
            Ajax.Responders.dispatch("onCreate", this, a);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            if (this.options.asynchronous) {
                this.respondToReadyState.bind(this).defer(1)
            }
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = this.method == "post" ? (this.options.postBody || d) : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange()
            }
        } catch (c) {
            this.dispatchException(c)
        }
    },
    onStateChange: function () {
        var a = this.transport.readyState;
        if (a > 1 && !((a == 4) && this._complete)) {
            this.respondToReadyState(this.transport.readyState)
        }
    },
    setRequestHeaders: function () {
        var e = {
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": Prototype.Version,
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        };
        if (this.method == "post") {
            e["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : "");
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
                e.Connection = "close"
            }
        }
        if (typeof this.options.requestHeaders == "object") {
            var c = this.options.requestHeaders;
            if (Object.isFunction(c.push)) {
                for (var b = 0, d = c.length; b < d; b += 2) {
                    e[c[b]] = c[b + 1]
                }
            } else {
                $H(c).each(function (f) {
                    e[f.key] = f.value
                })
            }
        }
        for (var a in e) {
            this.transport.setRequestHeader(a, e[a])
        }
    },
    success: function () {
        var a = this.getStatus();
        return !a || (a >= 200 && a < 300) || a == 304
    },
    getStatus: function () {
        try {
            if (this.transport.status === 1223) {
                return 204
            }
            return this.transport.status || 0
        } catch (a) {
            return 0
        }
    },
    respondToReadyState: function (a) {
        var c = Ajax.Request.Events[a],
            b = new Ajax.Response(this);
        if (c == "Complete") {
            try {
                this._complete = true;
                (this.options["on" + b.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(b, b.headerJSON)
            } catch (d) {
                this.dispatchException(d)
            }
            var f = b.getHeader("Content-type");
            if (this.options.evalJS == "force" || (this.options.evalJS && this.isSameOrigin() && f && f.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
                this.evalResponse()
            }
        }
        try {
            (this.options["on" + c] || Prototype.emptyFunction)(b, b.headerJSON);
            Ajax.Responders.dispatch("on" + c, this, b, b.headerJSON)
        } catch (d) {
            this.dispatchException(d)
        }
        if (c == "Complete") {
            this.transport.onreadystatechange = Prototype.emptyFunction
        }
    },
    isSameOrigin: function () {
        var a = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !a || (a[0] == "#{protocol}//#{domain}#{port}".interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ":" + location.port : ""
        }))
    },
    getHeader: function (a) {
        try {
            return this.transport.getResponseHeader(a) || null
        } catch (b) {
            return null
        }
    },
    evalResponse: function () {
        try {
            return eval((this.transport.responseText || "").unfilterJSON())
        } catch (e) {
            this.dispatchException(e)
        }
    },
    dispatchException: function (a) {
        (this.options.onException || Prototype.emptyFunction)(this, a);
        Ajax.Responders.dispatch("onException", this, a)
    }
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
    initialize: function (c) {
        this.request = c;
        var d = this.transport = c.transport,
            a = this.readyState = d.readyState;
        if ((a > 2 && !Prototype.Browser.IE) || a == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(d.responseText);
            this.headerJSON = this._getHeaderJSON()
        }
        if (a == 4) {
            var b = d.responseXML;
            this.responseXML = Object.isUndefined(b) ? null : b;
            this.responseJSON = this._getResponseJSON()
        }
    },
    status: 0,
    statusText: "",
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function () {
        try {
            return this.transport.statusText || ""
        } catch (a) {
            return ""
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function () {
        try {
            return this.getAllResponseHeaders()
        } catch (a) {
            return null
        }
    },
    getResponseHeader: function (a) {
        return this.transport.getResponseHeader(a)
    },
    getAllResponseHeaders: function () {
        return this.transport.getAllResponseHeaders()
    },
    _getHeaderJSON: function () {
        var a = this.getHeader("X-JSON");
        if (!a) {
            return null
        }
        a = decodeURIComponent(escape(a));
        try {
            return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    },
    _getResponseJSON: function () {
        var a = this.request.options;
        if (!a.evalJSON || (a.evalJSON != "force" && !(this.getHeader("Content-type") || "").include("application/json")) || this.responseText.blank()) {
            return null
        }
        try {
            return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function ($super, a, c, b) {
        this.container = {
            success: (a.success || a),
            failure: (a.failure || (a.success ? null : a))
        };
        b = Object.clone(b);
        var d = b.onComplete;
        b.onComplete = (function (e, f) {
            this.updateContent(e.responseText);
            if (Object.isFunction(d)) {
                d(e, f)
            }
        }).bind(this);
        $super(c, b)
    },
    updateContent: function (d) {
        var c = this.container[this.success() ? "success" : "failure"],
            a = this.options;
        if (!a.evalScripts) {
            d = d.stripScripts()
        }
        if (c = $(c)) {
            if (a.insertion) {
                if (Object.isString(a.insertion)) {
                    var b = {};
                    b[a.insertion] = d;
                    c.insert(b)
                } else {
                    a.insertion(c, d)
                }
            } else {
                c.update(d)
            }
        }
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function ($super, a, c, b) {
        $super(b);
        this.onComplete = this.options.onComplete;
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        this.updater = {};
        this.container = a;
        this.url = c;
        this.start()
    },
    start: function () {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent()
    },
    stop: function () {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
    },
    updateComplete: function (a) {
        if (this.options.decay) {
            this.decay = (a.responseText == this.lastText ? this.decay * this.options.decay : 1);
            this.lastText = a.responseText
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
    },
    onTimerEvent: function () {
        this.updater = new Ajax.Updater(this.container, this.url, this.options)
    }
});

function $(b) {
    if (arguments.length > 1) {
        for (var a = 0, d = [], c = arguments.length; a < c; a++) {
            d.push($(arguments[a]))
        }
        return d
    }
    if (Object.isString(b)) {
        b = document.getElementById(b)
    }
    return Element.extend(b)
}
if (Prototype.BrowserFeatures.XPath) {
    document._getElementsByXPath = function (f, a) {
        var c = [];
        var e = document.evaluate(f, $(a) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var b = 0, d = e.snapshotLength; b < d; b++) {
            c.push(Element.extend(e.snapshotItem(b)))
        }
        return c
    }
}
if (!Node) {
    var Node = {}
}
if (!Node.ELEMENT_NODE) {
    Object.extend(Node, {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    })
}(function (c) {
    function d(f, e) {
        if (f === "select") {
            return false
        }
        if ("type" in e) {
            return false
        }
        return true
    }
    var b = (function () {
        try {
            var e = document.createElement('<input name="x">');
            return e.tagName.toLowerCase() === "input" && e.name === "x"
        } catch (f) {
            return false
        }
    })();
    var a = c.Element;
    c.Element = function (g, f) {
        f = f || {};
        g = g.toLowerCase();
        var e = Element.cache;
        if (b && f.name) {
            g = "<" + g + ' name="' + f.name + '">';
            delete f.name;
            return Element.writeAttribute(document.createElement(g), f)
        }
        if (!e[g]) {
            e[g] = Element.extend(document.createElement(g))
        }
        var h = d(g, f) ? e[g].cloneNode(false) : document.createElement(g);
        return Element.writeAttribute(h, f)
    };
    Object.extend(c.Element, a || {});
    if (a) {
        c.Element.prototype = a.prototype
    }
})(this);
Element.idCounter = 1;
Element.cache = {};
Element._purgeElement = function (b) {
    var a = b._prototypeUID;
    if (a) {
        Element.stopObserving(b);
        b._prototypeUID = void 0;
        delete Element.Storage[a]
    }
};
Element.Methods = {
    visible: function (a) {
        return $(a).style.display != "none"
    },
    toggle: function (a) {
        a = $(a);
        Element[Element.visible(a) ? "hide" : "show"](a);
        return a
    },
    hide: function (a) {
        a = $(a);
        a.style.display = "none";
        return a
    },
    show: function (a) {
        a = $(a);
        a.style.display = "";
        return a
    },
    remove: function (a) {
        a = $(a);
        a.parentNode.removeChild(a);
        return a
    },
    update: (function () {
        var d = (function () {
            var g = document.createElement("select"),
                h = true;
            g.innerHTML = '<option value="test">test</option>';
            if (g.options && g.options[0]) {
                h = g.options[0].nodeName.toUpperCase() !== "OPTION"
            }
            g = null;
            return h
        })();
        var b = (function () {
            try {
                var g = document.createElement("table");
                if (g && g.tBodies) {
                    g.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                    var k = typeof g.tBodies[0] == "undefined";
                    g = null;
                    return k
                }
            } catch (h) {
                return true
            }
        })();
        var a = (function () {
            try {
                var g = document.createElement("div");
                g.innerHTML = "<link>";
                var k = (g.childNodes.length === 0);
                g = null;
                return k
            } catch (h) {
                return true
            }
        })();
        var c = d || b || a;
        var f = (function () {
            var g = document.createElement("script"),
                k = false;
            try {
                g.appendChild(document.createTextNode(""));
                k = !g.firstChild || g.firstChild && g.firstChild.nodeType !== 3
            } catch (h) {
                k = true
            }
            g = null;
            return k
        })();

        function e(m, n) {
            m = $(m);
            var g = Element._purgeElement;
            var o = m.getElementsByTagName("*"),
                l = o.length;
            while (l--) {
                g(o[l])
            }
            if (n && n.toElement) {
                n = n.toElement()
            }
            if (Object.isElement(n)) {
                return m.update().insert(n)
            }
            n = Object.toHTML(n);
            var k = m.tagName.toUpperCase();
            if (k === "SCRIPT" && f) {
                m.text = n;
                return m
            }
            if (c) {
                if (k in Element._insertionTranslations.tags) {
                    while (m.firstChild) {
                        m.removeChild(m.firstChild)
                    }
                    Element._getContentFromAnonymousElement(k, n.stripScripts()).each(function (p) {
                        m.appendChild(p)
                    })
                } else {
                    if (a && Object.isString(n) && n.indexOf("<link") > -1) {
                        while (m.firstChild) {
                            m.removeChild(m.firstChild)
                        }
                        var h = Element._getContentFromAnonymousElement(k, n.stripScripts(), true);
                        h.each(function (p) {
                            m.appendChild(p)
                        })
                    } else {
                        m.innerHTML = n.stripScripts()
                    }
                }
            } else {
                m.innerHTML = n.stripScripts()
            }
            n.evalScripts.bind(n).defer();
            return m
        }
        return e
    })(),
    replace: function (b, c) {
        b = $(b);
        if (c && c.toElement) {
            c = c.toElement()
        } else {
            if (!Object.isElement(c)) {
                c = Object.toHTML(c);
                var a = b.ownerDocument.createRange();
                a.selectNode(b);
                c.evalScripts.bind(c).defer();
                c = a.createContextualFragment(c.stripScripts())
            }
        }
        b.parentNode.replaceChild(c, b);
        return b
    },
    insert: function (c, e) {
        c = $(c);
        if (Object.isString(e) || Object.isNumber(e) || Object.isElement(e) || (e && (e.toElement || e.toHTML))) {
            e = {
                bottom: e
            }
        }
        var d, f, b, g;
        for (var a in e) {
            d = e[a];
            a = a.toLowerCase();
            f = Element._insertionTranslations[a];
            if (d && d.toElement) {
                d = d.toElement()
            }
            if (Object.isElement(d)) {
                f(c, d);
                continue
            }
            d = Object.toHTML(d);
            b = ((a == "before" || a == "after") ? c.parentNode : c).tagName.toUpperCase();
            g = Element._getContentFromAnonymousElement(b, d.stripScripts());
            if (a == "top" || a == "after") {
                g.reverse()
            }
            g.each(f.curry(c));
            d.evalScripts.bind(d).defer()
        }
        return c
    },
    wrap: function (b, c, a) {
        b = $(b);
        if (Object.isElement(c)) {
            $(c).writeAttribute(a || {})
        } else {
            if (Object.isString(c)) {
                c = new Element(c, a)
            } else {
                c = new Element("div", c)
            }
        }
        if (b.parentNode) {
            b.parentNode.replaceChild(c, b)
        }
        c.appendChild(b);
        return c
    },
    inspect: function (b) {
        b = $(b);
        var a = "<" + b.tagName.toLowerCase();
        $H({
            id: "id",
            className: "class"
        }).each(function (f) {
            var e = f.first(),
                c = f.last(),
                d = (b[e] || "").toString();
            if (d) {
                a += " " + c + "=" + d.inspect(true)
            }
        });
        return a + ">"
    },
    recursivelyCollect: function (a, c, d) {
        a = $(a);
        d = d || -1;
        var b = [];
        while (a = a[c]) {
            if (a.nodeType == 1) {
                b.push(Element.extend(a))
            }
            if (b.length == d) {
                break
            }
        }
        return b
    },
    ancestors: function (a) {
        return Element.recursivelyCollect(a, "parentNode")
    },
    descendants: function (a) {
        return Element.select(a, "*")
    },
    firstDescendant: function (a) {
        a = $(a).firstChild;
        while (a && a.nodeType != 1) {
            a = a.nextSibling
        }
        return $(a)
    },
    immediateDescendants: function (b) {
        var a = [],
            c = $(b).firstChild;
        while (c) {
            if (c.nodeType === 1) {
                a.push(Element.extend(c))
            }
            c = c.nextSibling
        }
        return a
    },
    previousSiblings: function (a, b) {
        return Element.recursivelyCollect(a, "previousSibling")
    },
    nextSiblings: function (a) {
        return Element.recursivelyCollect(a, "nextSibling")
    },
    siblings: function (a) {
        a = $(a);
        return Element.previousSiblings(a).reverse().concat(Element.nextSiblings(a))
    },
    match: function (b, a) {
        b = $(b);
        if (Object.isString(a)) {
            return Prototype.Selector.match(b, a)
        }
        return a.match(b)
    },
    up: function (b, d, a) {
        b = $(b);
        if (arguments.length == 1) {
            return $(b.parentNode)
        }
        var c = Element.ancestors(b);
        return Object.isNumber(d) ? c[d] : Prototype.Selector.find(c, d, a)
    },
    down: function (b, c, a) {
        b = $(b);
        if (arguments.length == 1) {
            return Element.firstDescendant(b)
        }
        return Object.isNumber(c) ? Element.descendants(b)[c] : Element.select(b, c)[a || 0]
    },
    previous: function (b, c, a) {
        b = $(b);
        if (Object.isNumber(c)) {
            a = c, c = false
        }
        if (!Object.isNumber(a)) {
            a = 0
        }
        if (c) {
            return Prototype.Selector.find(b.previousSiblings(), c, a)
        } else {
            return b.recursivelyCollect("previousSibling", a + 1)[a]
        }
    },
    next: function (b, d, a) {
        b = $(b);
        if (Object.isNumber(d)) {
            a = d, d = false
        }
        if (!Object.isNumber(a)) {
            a = 0
        }
        if (d) {
            return Prototype.Selector.find(b.nextSiblings(), d, a)
        } else {
            var c = Object.isNumber(a) ? a + 1 : 1;
            return b.recursivelyCollect("nextSibling", a + 1)[a]
        }
    },
    select: function (a) {
        a = $(a);
        var b = Array.prototype.slice.call(arguments, 1).join(", ");
        return Prototype.Selector.select(b, a)
    },
    adjacent: function (a) {
        a = $(a);
        var b = Array.prototype.slice.call(arguments, 1).join(", ");
        return Prototype.Selector.select(b, a.parentNode).without(a)
    },
    identify: function (a) {
        a = $(a);
        var b = Element.readAttribute(a, "id");
        if (b) {
            return b
        }
        do {
            b = "anonymous_element_" + Element.idCounter++
        } while ($(b));
        Element.writeAttribute(a, "id", b);
        return b
    },
    readAttribute: function (c, a) {
        c = $(c);
        if (Prototype.Browser.IE) {
            var b = Element._attributeTranslations.read;
            if (b.values[a]) {
                return b.values[a](c, a)
            }
            if (b.names[a]) {
                a = b.names[a]
            }
            if (a.include(":")) {
                return (!c.attributes || !c.attributes[a]) ? null : c.attributes[a].value
            }
        }
        return c.getAttribute(a)
    },
    writeAttribute: function (e, c, f) {
        e = $(e);
        var b = {},
            d = Element._attributeTranslations.write;
        if (typeof c == "object") {
            b = c
        } else {
            b[c] = Object.isUndefined(f) ? true : f
        }
        for (var a in b) {
            c = d.names[a] || a;
            f = b[a];
            if (d.values[a]) {
                c = d.values[a](e, f)
            }
            if (f === false || f === null) {
                e.removeAttribute(c)
            } else {
                if (f === true) {
                    e.setAttribute(c, c)
                } else {
                    e.setAttribute(c, f)
                }
            }
        }
        return e
    },
    getHeight: function (a) {
        return Element.getDimensions(a).height
    },
    getWidth: function (a) {
        return Element.getDimensions(a).width
    },
    classNames: function (a) {
        return new Element.ClassNames(a)
    },
    hasClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        var c = a.className;
        return (c.length > 0 && (c == b || new RegExp("(^|\\s)" + b + "(\\s|$)").test(c)))
    },
    addClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        if (!Element.hasClassName(a, b)) {
            a.className += (a.className ? " " : "") + b
        }
        return a
    },
    removeClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        a.className = a.className.replace(new RegExp("(^|\\s+)" + b + "(\\s+|$)"), " ").strip();
        return a
    },
    toggleClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        return Element[Element.hasClassName(a, b) ? "removeClassName" : "addClassName"](a, b)
    },
    cleanWhitespace: function (b) {
        b = $(b);
        var c = b.firstChild;
        while (c) {
            var a = c.nextSibling;
            if (c.nodeType == 3 && !/\S/.test(c.nodeValue)) {
                b.removeChild(c)
            }
            c = a
        }
        return b
    },
    empty: function (a) {
        return $(a).innerHTML.blank()
    },
    descendantOf: function (b, a) {
        b = $(b), a = $(a);
        if (b.compareDocumentPosition) {
            return (b.compareDocumentPosition(a) & 8) === 8
        }
        if (a.contains) {
            return a.contains(b) && a !== b
        }
        while (b = b.parentNode) {
            if (b == a) {
                return true
            }
        }
        return false
    },
    scrollTo: function (a) {
        a = $(a);
        var b = Element.cumulativeOffset(a);
        window.scrollTo(b[0], b[1]);
        return a
    },
    getStyle: function (b, c) {
        b = $(b);
        c = c == "float" ? "cssFloat" : c.camelize();
        var d = b.style[c];
        if (!d || d == "auto") {
            var a = document.defaultView.getComputedStyle(b, null);
            d = a ? a[c] : null
        }
        if (c == "opacity") {
            return d ? parseFloat(d) : 1
        }
        return d == "auto" ? null : d
    },
    getOpacity: function (a) {
        return $(a).getStyle("opacity")
    },
    setStyle: function (b, c) {
        b = $(b);
        var e = b.style,
            a;
        if (Object.isString(c)) {
            b.style.cssText += ";" + c;
            return c.include("opacity") ? b.setOpacity(c.match(/opacity:\s*(\d?\.?\d*)/)[1]) : b
        }
        for (var d in c) {
            if (d == "opacity") {
                b.setOpacity(c[d])
            } else {
                e[(d == "float" || d == "cssFloat") ? (Object.isUndefined(e.styleFloat) ? "cssFloat" : "styleFloat") : d] = c[d]
            }
        }
        return b
    },
    setOpacity: function (a, b) {
        a = $(a);
        a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
        return a
    },
    makePositioned: function (a) {
        a = $(a);
        var b = Element.getStyle(a, "position");
        if (b == "static" || !b) {
            a._madePositioned = true;
            a.style.position = "relative";
            if (Prototype.Browser.Opera) {
                a.style.top = 0;
                a.style.left = 0
            }
        }
        return a
    },
    undoPositioned: function (a) {
        a = $(a);
        if (a._madePositioned) {
            a._madePositioned = undefined;
            a.style.position = a.style.top = a.style.left = a.style.bottom = a.style.right = ""
        }
        return a
    },
    makeClipping: function (a) {
        a = $(a);
        if (a._overflow) {
            return a
        }
        a._overflow = Element.getStyle(a, "overflow") || "auto";
        if (a._overflow !== "hidden") {
            a.style.overflow = "hidden"
        }
        return a
    },
    undoClipping: function (a) {
        a = $(a);
        if (!a._overflow) {
            return a
        }
        a.style.overflow = a._overflow == "auto" ? "" : a._overflow;
        a._overflow = null;
        return a
    },
    clonePosition: function (b, d) {
        var a = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, arguments[2] || {});
        d = $(d);
        var e = Element.viewportOffset(d),
            f = [0, 0],
            c = null;
        b = $(b);
        if (Element.getStyle(b, "position") == "absolute") {
            c = Element.getOffsetParent(b);
            f = Element.viewportOffset(c)
        }
        if (c == document.body) {
            f[0] -= document.body.offsetLeft;
            f[1] -= document.body.offsetTop
        }
        if (a.setLeft) {
            b.style.left = (e[0] - f[0] + a.offsetLeft) + "px"
        }
        if (a.setTop) {
            b.style.top = (e[1] - f[1] + a.offsetTop) + "px"
        }
        if (a.setWidth) {
            b.style.width = d.offsetWidth + "px"
        }
        if (a.setHeight) {
            b.style.height = d.offsetHeight + "px"
        }
        return b
    }
};
Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
    childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
    write: {
        names: {
            className: "class",
            htmlFor: "for"
        },
        values: {}
    }
};
if (Prototype.Browser.Opera) {
    Element.Methods.getStyle = Element.Methods.getStyle.wrap(function (d, b, c) {
        switch (c) {
        case "height":
        case "width":
            if (!Element.visible(b)) {
                return null
            }
            var e = parseInt(d(b, c), 10);
            if (e !== b["offset" + c.capitalize()]) {
                return e + "px"
            }
            var a;
            if (c === "height") {
                a = ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"]
            } else {
                a = ["border-left-width", "padding-left", "padding-right", "border-right-width"]
            }
            return a.inject(e, function (f, g) {
                var h = d(b, g);
                return h === null ? f : f - parseInt(h, 10)
            }) + "px";
        default:
            return d(b, c)
        }
    });
    Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function (c, a, b) {
        if (b === "title") {
            return a.title
        }
        return c(a, b)
    })
} else {
    if (Prototype.Browser.IE) {
        Element.Methods.getStyle = function (a, b) {
            a = $(a);
            b = (b == "float" || b == "cssFloat") ? "styleFloat" : b.camelize();
            var c = a.style[b];
            if (!c && a.currentStyle) {
                c = a.currentStyle[b]
            }
            if (b == "opacity") {
                if (c = (a.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) {
                    if (c[1]) {
                        return parseFloat(c[1]) / 100
                    }
                }
                return 1
            }
            if (c == "auto") {
                if ((b == "width" || b == "height") && (a.getStyle("display") != "none")) {
                    return a["offset" + b.capitalize()] + "px"
                }
                return null
            }
            return c
        };
        Element.Methods.setOpacity = function (b, e) {
            function f(g) {
                return g.replace(/alpha\([^\)]*\)/gi, "")
            }
            b = $(b);
            var a = b.currentStyle;
            if ((a && !a.hasLayout) || (!a && b.style.zoom == "normal")) {
                b.style.zoom = 1
            }
            var d = b.getStyle("filter"),
                c = b.style;
            if (e == 1 || e === "") {
                (d = f(d)) ? c.filter = d : c.removeAttribute("filter");
                return b
            } else {
                if (e < 0.00001) {
                    e = 0
                }
            }
            c.filter = f(d) + "alpha(opacity=" + (e * 100) + ")";
            return b
        };
        Element._attributeTranslations = (function () {
            var b = "className",
                a = "for",
                c = document.createElement("div");
            c.setAttribute(b, "x");
            if (c.className !== "x") {
                c.setAttribute("class", "x");
                if (c.className === "x") {
                    b = "class"
                }
            }
            c = null;
            c = document.createElement("label");
            c.setAttribute(a, "x");
            if (c.htmlFor !== "x") {
                c.setAttribute("htmlFor", "x");
                if (c.htmlFor === "x") {
                    a = "htmlFor"
                }
            }
            c = null;
            return {
                read: {
                    names: {
                        "class": b,
                        className: b,
                        "for": a,
                        htmlFor: a
                    },
                    values: {
                        _getAttr: function (d, e) {
                            return d.getAttribute(e)
                        },
                        _getAttr2: function (d, e) {
                            return d.getAttribute(e, 2)
                        },
                        _getAttrNode: function (d, f) {
                            var e = d.getAttributeNode(f);
                            return e ? e.value : ""
                        },
                        _getEv: (function () {
                            var d = document.createElement("div"),
                                g;
                            d.onclick = Prototype.emptyFunction;
                            var e = d.getAttribute("onclick");
                            if (String(e).indexOf("{") > -1) {
                                g = function (f, h) {
                                    h = f.getAttribute(h);
                                    if (!h) {
                                        return null
                                    }
                                    h = h.toString();
                                    h = h.split("{")[1];
                                    h = h.split("}")[0];
                                    return h.strip()
                                }
                            } else {
                                if (e === "") {
                                    g = function (f, h) {
                                        h = f.getAttribute(h);
                                        if (!h) {
                                            return null
                                        }
                                        return h.strip()
                                    }
                                }
                            }
                            d = null;
                            return g
                        })(),
                        _flag: function (d, e) {
                            return $(d).hasAttribute(e) ? e : null
                        },
                        style: function (d) {
                            return d.style.cssText.toLowerCase()
                        },
                        title: function (d) {
                            return d.title
                        }
                    }
                }
            }
        })();
        Element._attributeTranslations.write = {
            names: Object.extend({
                cellpadding: "cellPadding",
                cellspacing: "cellSpacing"
            }, Element._attributeTranslations.read.names),
            values: {
                checked: function (a, b) {
                    a.checked = !! b
                },
                style: function (a, b) {
                    a.style.cssText = b ? b : ""
                }
            }
        };
        Element._attributeTranslations.has = {};
        $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function (a) {
            Element._attributeTranslations.write.names[a.toLowerCase()] = a;
            Element._attributeTranslations.has[a.toLowerCase()] = a
        });
        (function (a) {
            Object.extend(a, {
                href: a._getAttr2,
                src: a._getAttr2,
                type: a._getAttr,
                action: a._getAttrNode,
                disabled: a._flag,
                checked: a._flag,
                readonly: a._flag,
                multiple: a._flag,
                onload: a._getEv,
                onunload: a._getEv,
                onclick: a._getEv,
                ondblclick: a._getEv,
                onmousedown: a._getEv,
                onmouseup: a._getEv,
                onmouseover: a._getEv,
                onmousemove: a._getEv,
                onmouseout: a._getEv,
                onfocus: a._getEv,
                onblur: a._getEv,
                onkeypress: a._getEv,
                onkeydown: a._getEv,
                onkeyup: a._getEv,
                onsubmit: a._getEv,
                onreset: a._getEv,
                onselect: a._getEv,
                onchange: a._getEv
            })
        })(Element._attributeTranslations.read.values);
        if (Prototype.BrowserFeatures.ElementExtensions) {
            (function () {
                function a(e) {
                    var b = e.getElementsByTagName("*"),
                        d = [];
                    for (var c = 0, f; f = b[c]; c++) {
                        if (f.tagName !== "!") {
                            d.push(f)
                        }
                    }
                    return d
                }
                Element.Methods.down = function (c, d, b) {
                    c = $(c);
                    if (arguments.length == 1) {
                        return c.firstDescendant()
                    }
                    return Object.isNumber(d) ? a(c)[d] : Element.select(c, d)[b || 0]
                }
            })()
        }
    } else {
        if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
            Element.Methods.setOpacity = function (a, b) {
                a = $(a);
                a.style.opacity = (b == 1) ? 0.999999 : (b === "") ? "" : (b < 0.00001) ? 0 : b;
                return a
            }
        } else {
            if (Prototype.Browser.WebKit) {
                Element.Methods.setOpacity = function (a, b) {
                    a = $(a);
                    a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
                    if (b == 1) {
                        if (a.tagName.toUpperCase() == "IMG" && a.width) {
                            a.width++;
                            a.width--
                        } else {
                            try {
                                var d = document.createTextNode(" ");
                                a.appendChild(d);
                                a.removeChild(d)
                            } catch (c) {}
                        }
                    }
                    return a
                }
            }
        }
    }
}
if ("outerHTML" in document.documentElement) {
    Element.Methods.replace = function (c, e) {
        c = $(c);
        if (e && e.toElement) {
            e = e.toElement()
        }
        if (Object.isElement(e)) {
            c.parentNode.replaceChild(e, c);
            return c
        }
        e = Object.toHTML(e);
        var d = c.parentNode,
            b = d.tagName.toUpperCase();
        if (Element._insertionTranslations.tags[b]) {
            var f = c.next(),
                a = Element._getContentFromAnonymousElement(b, e.stripScripts());
            d.removeChild(c);
            if (f) {
                a.each(function (g) {
                    d.insertBefore(g, f)
                })
            } else {
                a.each(function (g) {
                    d.appendChild(g)
                })
            }
        } else {
            c.outerHTML = e.stripScripts()
        }
        e.evalScripts.bind(e).defer();
        return c
    }
}
Element._returnOffset = function (b, c) {
    var a = [b, c];
    a.left = b;
    a.top = c;
    return a
};
Element._getContentFromAnonymousElement = function (e, d, f) {
    var g = new Element("div"),
        c = Element._insertionTranslations.tags[e];
    var a = false;
    if (c) {
        a = true
    } else {
        if (f) {
            a = true;
            c = ["", "", 0]
        }
    }
    if (a) {
        g.innerHTML = "&nbsp;" + c[0] + d + c[1];
        g.removeChild(g.firstChild);
        for (var b = c[2]; b--;) {
            g = g.firstChild
        }
    } else {
        g.innerHTML = d
    }
    return $A(g.childNodes)
};
Element._insertionTranslations = {
    before: function (a, b) {
        a.parentNode.insertBefore(b, a)
    },
    top: function (a, b) {
        a.insertBefore(b, a.firstChild)
    },
    bottom: function (a, b) {
        a.appendChild(b)
    },
    after: function (a, b) {
        a.parentNode.insertBefore(b, a.nextSibling)
    },
    tags: {
        TABLE: ["<table>", "</table>", 1],
        TBODY: ["<table><tbody>", "</tbody></table>", 2],
        TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
        TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
        SELECT: ["<select>", "</select>", 1]
    }
};
(function () {
    var a = Element._insertionTranslations.tags;
    Object.extend(a, {
        THEAD: a.TBODY,
        TFOOT: a.TBODY,
        TH: a.TD
    })
})();
Element.Methods.Simulated = {
    hasAttribute: function (a, c) {
        c = Element._attributeTranslations.has[c] || c;
        var b = $(a).getAttributeNode(c);
        return !!(b && b.specified)
    }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
(function (a) {
    if (!Prototype.BrowserFeatures.ElementExtensions && a.__proto__) {
        window.HTMLElement = {};
        window.HTMLElement.prototype = a.__proto__;
        Prototype.BrowserFeatures.ElementExtensions = true
    }
    a = null
})(document.createElement("div"));
Element.extend = (function () {
    function c(g) {
        if (typeof window.Element != "undefined") {
            var k = window.Element.prototype;
            if (k) {
                var m = "_" + (Math.random() + "").slice(2),
                    h = document.createElement(g);
                k[m] = "x";
                var l = (h[m] !== "x");
                delete k[m];
                h = null;
                return l
            }
        }
        return false
    }
    function b(h, g) {
        for (var l in g) {
            var k = g[l];
            if (Object.isFunction(k) && !(l in h)) {
                h[l] = k.methodize()
            }
        }
    }
    var d = c("object");
    if (Prototype.BrowserFeatures.SpecificElementExtensions) {
        if (d) {
            return function (h) {
                if (h && typeof h._extendedByPrototype == "undefined") {
                    var g = h.tagName;
                    if (g && (/^(?:object|applet|embed)$/i.test(g))) {
                        b(h, Element.Methods);
                        b(h, Element.Methods.Simulated);
                        b(h, Element.Methods.ByTag[g.toUpperCase()])
                    }
                }
                return h
            }
        }
        return Prototype.K
    }
    var a = {},
        e = Element.Methods.ByTag;
    var f = Object.extend(function (k) {
        if (!k || typeof k._extendedByPrototype != "undefined" || k.nodeType != 1 || k == window) {
            return k
        }
        var g = Object.clone(a),
            h = k.tagName.toUpperCase();
        if (e[h]) {
            Object.extend(g, e[h])
        }
        b(k, g);
        k._extendedByPrototype = Prototype.emptyFunction;
        return k
    }, {
        refresh: function () {
            if (!Prototype.BrowserFeatures.ElementExtensions) {
                Object.extend(a, Element.Methods);
                Object.extend(a, Element.Methods.Simulated)
            }
        }
    });
    f.refresh();
    return f
})();
if (document.documentElement.hasAttribute) {
    Element.hasAttribute = function (a, b) {
        return a.hasAttribute(b)
    }
} else {
    Element.hasAttribute = Element.Methods.Simulated.hasAttribute
}
Element.addMethods = function (c) {
    var k = Prototype.BrowserFeatures,
        d = Element.Methods.ByTag;
    if (!c) {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            FORM: Object.clone(Form.Methods),
            INPUT: Object.clone(Form.Element.Methods),
            SELECT: Object.clone(Form.Element.Methods),
            TEXTAREA: Object.clone(Form.Element.Methods),
            BUTTON: Object.clone(Form.Element.Methods)
        })
    }
    if (arguments.length == 2) {
        var b = c;
        c = arguments[1]
    }
    if (!b) {
        Object.extend(Element.Methods, c || {})
    } else {
        if (Object.isArray(b)) {
            b.each(g)
        } else {
            g(b)
        }
    }
    function g(m) {
        m = m.toUpperCase();
        if (!Element.Methods.ByTag[m]) {
            Element.Methods.ByTag[m] = {}
        }
        Object.extend(Element.Methods.ByTag[m], c)
    }
    function a(o, n, m) {
        m = m || false;
        for (var q in o) {
            var p = o[q];
            if (!Object.isFunction(p)) {
                continue
            }
            if (!m || !(q in n)) {
                n[q] = p.methodize()
            }
        }
    }
    function e(p) {
        var m;
        var o = {
            OPTGROUP: "OptGroup",
            TEXTAREA: "TextArea",
            P: "Paragraph",
            FIELDSET: "FieldSet",
            UL: "UList",
            OL: "OList",
            DL: "DList",
            DIR: "Directory",
            H1: "Heading",
            H2: "Heading",
            H3: "Heading",
            H4: "Heading",
            H5: "Heading",
            H6: "Heading",
            Q: "Quote",
            INS: "Mod",
            DEL: "Mod",
            A: "Anchor",
            IMG: "Image",
            CAPTION: "TableCaption",
            COL: "TableCol",
            COLGROUP: "TableCol",
            THEAD: "TableSection",
            TFOOT: "TableSection",
            TBODY: "TableSection",
            TR: "TableRow",
            TH: "TableCell",
            TD: "TableCell",
            FRAMESET: "FrameSet",
            IFRAME: "IFrame"
        };
        if (o[p]) {
            m = "HTML" + o[p] + "Element"
        }
        if (window[m]) {
            return window[m]
        }
        m = "HTML" + p + "Element";
        if (window[m]) {
            return window[m]
        }
        m = "HTML" + p.capitalize() + "Element";
        if (window[m]) {
            return window[m]
        }
        var n = document.createElement(p),
            q = n.__proto__ || n.constructor.prototype;
        n = null;
        return q
    }
    var h = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
    if (k.ElementExtensions) {
        a(Element.Methods, h);
        a(Element.Methods.Simulated, h, true)
    }
    if (k.SpecificElementExtensions) {
        for (var l in Element.Methods.ByTag) {
            var f = e(l);
            if (Object.isUndefined(f)) {
                continue
            }
            a(d[l], f.prototype)
        }
    }
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
    if (Element.extend.refresh) {
        Element.extend.refresh()
    }
    Element.cache = {}
};
document.viewport = {
    getDimensions: function () {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        }
    },
    getScrollOffsets: function () {
        return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
    }
};
(function (b) {
    var g = Prototype.Browser,
        e = document,
        c, d = {};

    function a() {
        if (g.WebKit && !e.evaluate) {
            return document
        }
        if (g.Opera && window.parseFloat(window.opera.version()) < 9.5) {
            return document.body
        }
        return document.documentElement
    }
    function f(h) {
        if (!c) {
            c = a()
        }
        d[h] = "client" + h;
        b["get" + h] = function () {
            return c[d[h]]
        };
        return b["get" + h]()
    }
    b.getWidth = f.curry("Width");
    b.getHeight = f.curry("Height")
})(document.viewport);
Element.Storage = {
    UID: 1
};
Element.addMethods({
    getStorage: function (b) {
        if (!(b = $(b))) {
            return
        }
        var a;
        if (b === window) {
            a = 0
        } else {
            if (typeof b._prototypeUID === "undefined") {
                b._prototypeUID = Element.Storage.UID++
            }
            a = b._prototypeUID
        }
        if (!Element.Storage[a]) {
            Element.Storage[a] = $H()
        }
        return Element.Storage[a]
    },
    store: function (b, a, c) {
        if (!(b = $(b))) {
            return
        }
        if (arguments.length === 2) {
            Element.getStorage(b).update(a)
        } else {
            Element.getStorage(b).set(a, c)
        }
        return b
    },
    retrieve: function (c, b, a) {
        if (!(c = $(c))) {
            return
        }
        var e = Element.getStorage(c),
            d = e.get(b);
        if (Object.isUndefined(d)) {
            e.set(b, a);
            d = a
        }
        return d
    },
    clone: function (c, a) {
        if (!(c = $(c))) {
            return
        }
        var e = c.cloneNode(a);
        e._prototypeUID = void 0;
        if (a) {
            var d = Element.select(e, "*"),
                b = d.length;
            while (b--) {
                d[b]._prototypeUID = void 0
            }
        }
        return Element.extend(e)
    },
    purge: function (c) {
        if (!(c = $(c))) {
            return
        }
        var a = Element._purgeElement;
        a(c);
        var d = c.getElementsByTagName("*"),
            b = d.length;
        while (b--) {
            a(d[b])
        }
        return null
    }
});
(function () {
    function h(x) {
        var w = x.match(/^(\d+)%?$/i);
        if (!w) {
            return null
        }
        return (Number(w[1]) / 100)
    }
    function q(H, I, x) {
        var A = null;
        if (Object.isElement(H)) {
            A = H;
            H = A.getStyle(I)
        }
        if (H === null) {
            return null
        }
        if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(H)) {
            return window.parseFloat(H)
        }
        var C = H.include("%"),
            y = (x === document.viewport);
        if (/\d/.test(H) && A && A.runtimeStyle && !(C && y)) {
            var w = A.style.left,
                G = A.runtimeStyle.left;
            A.runtimeStyle.left = A.currentStyle.left;
            A.style.left = H || 0;
            H = A.style.pixelLeft;
            A.style.left = w;
            A.runtimeStyle.left = G;
            return H
        }
        if (A && C) {
            x = x || A.parentNode;
            var z = h(H);
            var D = null;
            var B = A.getStyle("position");
            var F = I.include("left") || I.include("right") || I.include("width");
            var E = I.include("top") || I.include("bottom") || I.include("height");
            if (x === document.viewport) {
                if (F) {
                    D = document.viewport.getWidth()
                } else {
                    if (E) {
                        D = document.viewport.getHeight()
                    }
                }
            } else {
                if (F) {
                    D = $(x).measure("width")
                } else {
                    if (E) {
                        D = $(x).measure("height")
                    }
                }
            }
            return (D === null) ? 0 : D * z
        }
        return 0
    }
    function g(w) {
        if (Object.isString(w) && w.endsWith("px")) {
            return w
        }
        return w + "px"
    }
    function l(x) {
        var w = x;
        while (x && x.parentNode) {
            var y = x.getStyle("display");
            if (y === "none") {
                return false
            }
            x = $(x.parentNode)
        }
        return true
    }
    var d = Prototype.K;
    if ("currentStyle" in document.documentElement) {
        d = function (w) {
            if (!w.currentStyle.hasLayout) {
                w.style.zoom = 1
            }
            return w
        }
    }
    function f(w) {
        if (w.include("border")) {
            w = w + "-width"
        }
        return w.camelize()
    }
    Element.Layout = Class.create(Hash, {
        initialize: function ($super, x, w) {
            $super();
            this.element = $(x);
            Element.Layout.PROPERTIES.each(function (y) {
                this._set(y, null)
            }, this);
            if (w) {
                this._preComputing = true;
                this._begin();
                Element.Layout.PROPERTIES.each(this._compute, this);
                this._end();
                this._preComputing = false
            }
        },
        _set: function (x, w) {
            return Hash.prototype.set.call(this, x, w)
        },
        set: function (x, w) {
            throw "Properties of Element.Layout are read-only."
        },
        get: function ($super, x) {
            var w = $super(x);
            return w === null ? this._compute(x) : w
        },
        _begin: function () {
            if (this._prepared) {
                return
            }
            var A = this.element;
            if (l(A)) {
                this._prepared = true;
                return
            }
            var C = {
                position: A.style.position || "",
                width: A.style.width || "",
                visibility: A.style.visibility || "",
                display: A.style.display || ""
            };
            A.store("prototype_original_styles", C);
            var D = A.getStyle("position"),
                w = A.getStyle("width");
            if (w === "0px" || w === null) {
                A.style.display = "block";
                w = A.getStyle("width")
            }
            var x = (D === "fixed") ? document.viewport : A.parentNode;
            A.setStyle({
                position: "absolute",
                visibility: "hidden",
                display: "block"
            });
            var y = A.getStyle("width");
            var z;
            if (w && (y === w)) {
                z = q(A, "width", x)
            } else {
                if (D === "absolute" || D === "fixed") {
                    z = q(A, "width", x)
                } else {
                    var E = A.parentNode,
                        B = $(E).getLayout();
                    z = B.get("width") - this.get("margin-left") - this.get("border-left") - this.get("padding-left") - this.get("padding-right") - this.get("border-right") - this.get("margin-right")
                }
            }
            A.setStyle({
                width: z + "px"
            });
            this._prepared = true
        },
        _end: function () {
            var x = this.element;
            var w = x.retrieve("prototype_original_styles");
            x.store("prototype_original_styles", null);
            x.setStyle(w);
            this._prepared = false
        },
        _compute: function (x) {
            var w = Element.Layout.COMPUTATIONS;
            if (!(x in w)) {
                throw "Property not found."
            }
            return this._set(x, w[x].call(this, this.element))
        },
        toObject: function () {
            var w = $A(arguments);
            var x = (w.length === 0) ? Element.Layout.PROPERTIES : w.join(" ").split(" ");
            var y = {};
            x.each(function (z) {
                if (!Element.Layout.PROPERTIES.include(z)) {
                    return
                }
                var A = this.get(z);
                if (A != null) {
                    y[z] = A
                }
            }, this);
            return y
        },
        toHash: function () {
            var w = this.toObject.apply(this, arguments);
            return new Hash(w)
        },
        toCSS: function () {
            var w = $A(arguments);
            var y = (w.length === 0) ? Element.Layout.PROPERTIES : w.join(" ").split(" ");
            var x = {};
            y.each(function (z) {
                if (!Element.Layout.PROPERTIES.include(z)) {
                    return
                }
                if (Element.Layout.COMPOSITE_PROPERTIES.include(z)) {
                    return
                }
                var A = this.get(z);
                if (A != null) {
                    x[f(z)] = A + "px"
                }
            }, this);
            return x
        },
        inspect: function () {
            return "#<Element.Layout>"
        }
    });
    Object.extend(Element.Layout, {
        PROPERTIES: $w("height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height"),
        COMPOSITE_PROPERTIES: $w("padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height"),
        COMPUTATIONS: {
            height: function (y) {
                if (!this._preComputing) {
                    this._begin()
                }
                var w = this.get("border-box-height");
                if (w <= 0) {
                    if (!this._preComputing) {
                        this._end()
                    }
                    return 0
                }
                var z = this.get("border-top"),
                    x = this.get("border-bottom");
                var B = this.get("padding-top"),
                    A = this.get("padding-bottom");
                if (!this._preComputing) {
                    this._end()
                }
                return w - z - x - B - A
            },
            width: function (y) {
                if (!this._preComputing) {
                    this._begin()
                }
                var x = this.get("border-box-width");
                if (x <= 0) {
                    if (!this._preComputing) {
                        this._end()
                    }
                    return 0
                }
                var B = this.get("border-left"),
                    w = this.get("border-right");
                var z = this.get("padding-left"),
                    A = this.get("padding-right");
                if (!this._preComputing) {
                    this._end()
                }
                return x - B - w - z - A
            },
            "padding-box-height": function (x) {
                var w = this.get("height"),
                    z = this.get("padding-top"),
                    y = this.get("padding-bottom");
                return w + z + y
            },
            "padding-box-width": function (w) {
                var x = this.get("width"),
                    y = this.get("padding-left"),
                    z = this.get("padding-right");
                return x + y + z
            },
            "border-box-height": function (x) {
                if (!this._preComputing) {
                    this._begin()
                }
                var w = x.offsetHeight;
                if (!this._preComputing) {
                    this._end()
                }
                return w
            },
            "border-box-width": function (w) {
                if (!this._preComputing) {
                    this._begin()
                }
                var x = w.offsetWidth;
                if (!this._preComputing) {
                    this._end()
                }
                return x
            },
            "margin-box-height": function (x) {
                var w = this.get("border-box-height"),
                    y = this.get("margin-top"),
                    z = this.get("margin-bottom");
                if (w <= 0) {
                    return 0
                }
                return w + y + z
            },
            "margin-box-width": function (y) {
                var x = this.get("border-box-width"),
                    z = this.get("margin-left"),
                    w = this.get("margin-right");
                if (x <= 0) {
                    return 0
                }
                return x + z + w
            },
            top: function (w) {
                var x = w.positionedOffset();
                return x.top
            },
            bottom: function (w) {
                var z = w.positionedOffset(),
                    x = w.getOffsetParent(),
                    y = x.measure("height");
                var A = this.get("border-box-height");
                return y - A - z.top
            },
            left: function (w) {
                var x = w.positionedOffset();
                return x.left
            },
            right: function (y) {
                var A = y.positionedOffset(),
                    z = y.getOffsetParent(),
                    w = z.measure("width");
                var x = this.get("border-box-width");
                return w - x - A.left
            },
            "padding-top": function (w) {
                return q(w, "paddingTop")
            },
            "padding-bottom": function (w) {
                return q(w, "paddingBottom")
            },
            "padding-left": function (w) {
                return q(w, "paddingLeft")
            },
            "padding-right": function (w) {
                return q(w, "paddingRight")
            },
            "border-top": function (w) {
                return q(w, "borderTopWidth")
            },
            "border-bottom": function (w) {
                return q(w, "borderBottomWidth")
            },
            "border-left": function (w) {
                return q(w, "borderLeftWidth")
            },
            "border-right": function (w) {
                return q(w, "borderRightWidth")
            },
            "margin-top": function (w) {
                return q(w, "marginTop")
            },
            "margin-bottom": function (w) {
                return q(w, "marginBottom")
            },
            "margin-left": function (w) {
                return q(w, "marginLeft")
            },
            "margin-right": function (w) {
                return q(w, "marginRight")
            }
        }
    });
    if ("getBoundingClientRect" in document.documentElement) {
        Object.extend(Element.Layout.COMPUTATIONS, {
            right: function (x) {
                var y = d(x.getOffsetParent());
                var z = x.getBoundingClientRect(),
                    w = y.getBoundingClientRect();
                return (w.right - z.right).round()
            },
            bottom: function (x) {
                var y = d(x.getOffsetParent());
                var z = x.getBoundingClientRect(),
                    w = y.getBoundingClientRect();
                return (w.bottom - z.bottom).round()
            }
        })
    }
    Element.Offset = Class.create({
        initialize: function (x, w) {
            this.left = x.round();
            this.top = w.round();
            this[0] = this.left;
            this[1] = this.top
        },
        relativeTo: function (w) {
            return new Element.Offset(this.left - w.left, this.top - w.top)
        },
        inspect: function () {
            return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this)
        },
        toString: function () {
            return "[#{left}, #{top}]".interpolate(this)
        },
        toArray: function () {
            return [this.left, this.top]
        }
    });

    function t(x, w) {
        return new Element.Layout(x, w)
    }
    function b(w, x) {
        return $(w).getLayout().get(x)
    }
    function p(x) {
        x = $(x);
        var B = Element.getStyle(x, "display");
        if (B && B !== "none") {
            return {
                width: x.offsetWidth,
                height: x.offsetHeight
            }
        }
        var y = x.style;
        var w = {
            visibility: y.visibility,
            position: y.position,
            display: y.display
        };
        var A = {
            visibility: "hidden",
            display: "block"
        };
        if (w.position !== "fixed") {
            A.position = "absolute"
        }
        Element.setStyle(x, A);
        var z = {
            width: x.offsetWidth,
            height: x.offsetHeight
        };
        Element.setStyle(x, w);
        return z
    }
    function n(w) {
        w = $(w);
        if (e(w) || c(w) || o(w) || m(w)) {
            return $(document.body)
        }
        var x = (Element.getStyle(w, "display") === "inline");
        if (!x && w.offsetParent && !Prototype.Browser.IE) {
            return $(w.offsetParent)
        }
        while ((w = w.parentNode) && w !== document.body) {
            if (Element.getStyle(w, "position") !== "static") {
                return m(w) ? $(document.body) : $(w)
            }
        }
        return $(document.body)
    }
    function v(x) {
        x = $(x);
        var w = 0,
            y = 0;
        if (x.parentNode) {
            do {
                w += x.offsetTop || 0;
                y += x.offsetLeft || 0;
                x = x.offsetParent
            } while (x)
        }
        return new Element.Offset(y, w)
    }
    function r(x) {
        x = $(x);
        var y = x.getLayout();
        var w = 0,
            A = 0;
        do {
            w += x.offsetTop || 0;
            A += x.offsetLeft || 0;
            x = x.offsetParent;
            if (x) {
                if (o(x)) {
                    break
                }
                var z = Element.getStyle(x, "position");
                if (z !== "static") {
                    break
                }
            }
        } while (x);
        A -= y.get("margin-top");
        w -= y.get("margin-left");
        return new Element.Offset(A, w)
    }
    function a(x) {
        var w = 0,
            y = 0;
        do {
            w += x.scrollTop || 0;
            y += x.scrollLeft || 0;
            x = x.parentNode
        } while (x);
        return new Element.Offset(y, w)
    }
    function u(A) {
        x = $(x);
        var w = 0,
            z = 0,
            y = document.body;
        var x = A;
        do {
            w += x.offsetTop || 0;
            z += x.offsetLeft || 0;
            if (x.offsetParent == y && Element.getStyle(x, "position") == "absolute") {
                break
            }
        } while (x = x.offsetParent);
        x = A;
        do {
            if (x != y) {
                w -= x.scrollTop || 0;
                z -= x.scrollLeft || 0
            }
        } while (x = x.parentNode);
        return new Element.Offset(z, w)
    }
    function s(w) {
        w = $(w);
        if (Element.getStyle(w, "position") === "absolute") {
            return w
        }
        var A = n(w);
        var z = w.viewportOffset(),
            x = A.viewportOffset();
        var B = z.relativeTo(x);
        var y = w.getLayout();
        w.store("prototype_absolutize_original_styles", {
            left: w.getStyle("left"),
            top: w.getStyle("top"),
            width: w.getStyle("width"),
            height: w.getStyle("height")
        });
        w.setStyle({
            position: "absolute",
            top: B.top + "px",
            left: B.left + "px",
            width: y.get("width") + "px",
            height: y.get("height") + "px"
        });
        return w
    }
    function k(x) {
        x = $(x);
        if (Element.getStyle(x, "position") === "relative") {
            return x
        }
        var w = x.retrieve("prototype_absolutize_original_styles");
        if (w) {
            x.setStyle(w)
        }
        return x
    }
    if (Prototype.Browser.IE) {
        n = n.wrap(function (y, x) {
            x = $(x);
            if (e(x) || c(x) || o(x) || m(x)) {
                return $(document.body)
            }
            var w = x.getStyle("position");
            if (w !== "static") {
                return y(x)
            }
            x.setStyle({
                position: "relative"
            });
            var z = y(x);
            x.setStyle({
                position: w
            });
            return z
        });
        r = r.wrap(function (z, x) {
            x = $(x);
            if (!x.parentNode) {
                return new Element.Offset(0, 0)
            }
            var w = x.getStyle("position");
            if (w !== "static") {
                return z(x)
            }
            var y = x.getOffsetParent();
            if (y && y.getStyle("position") === "fixed") {
                d(y)
            }
            x.setStyle({
                position: "relative"
            });
            var A = z(x);
            x.setStyle({
                position: w
            });
            return A
        })
    } else {
        if (Prototype.Browser.Webkit) {
            v = function (x) {
                x = $(x);
                var w = 0,
                    y = 0;
                do {
                    w += x.offsetTop || 0;
                    y += x.offsetLeft || 0;
                    if (x.offsetParent == document.body) {
                        if (Element.getStyle(x, "position") == "absolute") {
                            break
                        }
                    }
                    x = x.offsetParent
                } while (x);
                return new Element.Offset(y, w)
            }
        }
    }
    Element.addMethods({
        getLayout: t,
        measure: b,
        getDimensions: p,
        getOffsetParent: n,
        cumulativeOffset: v,
        positionedOffset: r,
        cumulativeScrollOffset: a,
        viewportOffset: u,
        absolutize: s,
        relativize: k
    });

    function o(w) {
        return w.nodeName.toUpperCase() === "BODY"
    }
    function m(w) {
        return w.nodeName.toUpperCase() === "HTML"
    }
    function e(w) {
        return w.nodeType === Node.DOCUMENT_NODE
    }
    function c(w) {
        return w !== document.body && !Element.descendantOf(w, document.body)
    }
    if ("getBoundingClientRect" in document.documentElement) {
        Element.addMethods({
            viewportOffset: function (w) {
                w = $(w);
                if (c(w)) {
                    return new Element.Offset(0, 0)
                }
                var x = w.getBoundingClientRect(),
                    y = document.documentElement;
                return new Element.Offset(x.left - y.clientLeft, x.top - y.clientTop)
            }
        })
    }
})();
window.$$ = function () {
    var a = $A(arguments).join(", ");
    return Prototype.Selector.select(a, document)
};
Prototype.Selector = (function () {
    function a() {
        throw new Error('Method "Prototype.Selector.select" must be defined.')
    }
    function c() {
        throw new Error('Method "Prototype.Selector.match" must be defined.')
    }
    function d(m, n, h) {
        h = h || 0;
        var g = Prototype.Selector.match,
            l = m.length,
            f = 0,
            k;
        for (k = 0; k < l; k++) {
            if (g(m[k], n) && h == f++) {
                return Element.extend(m[k])
            }
        }
    }
    function e(h) {
        for (var f = 0, g = h.length; f < g; f++) {
            Element.extend(h[f])
        }
        return h
    }
    var b = Prototype.K;
    return {
        select: a,
        match: c,
        find: d,
        extendElements: (Element.extend === b) ? b : e,
        extendElement: Element.extend
    }
})();
Prototype._original_property = window.Sizzle;
/*
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */ (function () {
    var s = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        l = 0,
        d = Object.prototype.toString,
        q = false,
        k = true;
    [0, 0].sort(function () {
        k = false;
        return 0
    });
    var b = function (G, w, D, y) {
            D = D || [];
            var e = w = w || document;
            if (w.nodeType !== 1 && w.nodeType !== 9) {
                return []
            }
            if (!G || typeof G !== "string") {
                return D
            }
            var E = [],
                F, B, K, J, C, v, u = true,
                z = r(w),
                I = G;
            while ((s.exec(""), F = s.exec(I)) !== null) {
                I = F[3];
                E.push(F[1]);
                if (F[2]) {
                    v = F[3];
                    break
                }
            }
            if (E.length > 1 && m.exec(G)) {
                if (E.length === 2 && f.relative[E[0]]) {
                    B = g(E[0] + E[1], w)
                } else {
                    B = f.relative[E[0]] ? [w] : b(E.shift(), w);
                    while (E.length) {
                        G = E.shift();
                        if (f.relative[G]) {
                            G += E.shift()
                        }
                        B = g(G, B)
                    }
                }
            } else {
                if (!y && E.length > 1 && w.nodeType === 9 && !z && f.match.ID.test(E[0]) && !f.match.ID.test(E[E.length - 1])) {
                    var L = b.find(E.shift(), w, z);
                    w = L.expr ? b.filter(L.expr, L.set)[0] : L.set[0]
                }
                if (w) {
                    var L = y ? {
                        expr: E.pop(),
                        set: a(y)
                    } : b.find(E.pop(), E.length === 1 && (E[0] === "~" || E[0] === "+") && w.parentNode ? w.parentNode : w, z);
                    B = L.expr ? b.filter(L.expr, L.set) : L.set;
                    if (E.length > 0) {
                        K = a(B)
                    } else {
                        u = false
                    }
                    while (E.length) {
                        var x = E.pop(),
                            A = x;
                        if (!f.relative[x]) {
                            x = ""
                        } else {
                            A = E.pop()
                        }
                        if (A == null) {
                            A = w
                        }
                        f.relative[x](K, A, z)
                    }
                } else {
                    K = E = []
                }
            }
            if (!K) {
                K = B
            }
            if (!K) {
                throw "Syntax error, unrecognized expression: " + (x || G)
            }
            if (d.call(K) === "[object Array]") {
                if (!u) {
                    D.push.apply(D, K)
                } else {
                    if (w && w.nodeType === 1) {
                        for (var H = 0; K[H] != null; H++) {
                            if (K[H] && (K[H] === true || K[H].nodeType === 1 && h(w, K[H]))) {
                                D.push(B[H])
                            }
                        }
                    } else {
                        for (var H = 0; K[H] != null; H++) {
                            if (K[H] && K[H].nodeType === 1) {
                                D.push(B[H])
                            }
                        }
                    }
                }
            } else {
                a(K, D)
            }
            if (v) {
                b(v, e, D, y);
                b.uniqueSort(D)
            }
            return D
        };
    b.uniqueSort = function (u) {
        if (c) {
            q = k;
            u.sort(c);
            if (q) {
                for (var e = 1; e < u.length; e++) {
                    if (u[e] === u[e - 1]) {
                        u.splice(e--, 1)
                    }
                }
            }
        }
        return u
    };
    b.matches = function (e, u) {
        return b(e, null, null, u)
    };
    b.find = function (A, e, B) {
        var z, x;
        if (!A) {
            return []
        }
        for (var w = 0, v = f.order.length; w < v; w++) {
            var y = f.order[w],
                x;
            if ((x = f.leftMatch[y].exec(A))) {
                var u = x[1];
                x.splice(1, 1);
                if (u.substr(u.length - 1) !== "\\") {
                    x[1] = (x[1] || "").replace(/\\/g, "");
                    z = f.find[y](x, e, B);
                    if (z != null) {
                        A = A.replace(f.match[y], "");
                        break
                    }
                }
            }
        }
        if (!z) {
            z = e.getElementsByTagName("*")
        }
        return {
            set: z,
            expr: A
        }
    };
    b.filter = function (D, C, G, w) {
        var v = D,
            I = [],
            A = C,
            y, e, z = C && C[0] && r(C[0]);
        while (D && C.length) {
            for (var B in f.filter) {
                if ((y = f.match[B].exec(D)) != null) {
                    var u = f.filter[B],
                        H, F;
                    e = false;
                    if (A == I) {
                        I = []
                    }
                    if (f.preFilter[B]) {
                        y = f.preFilter[B](y, A, G, I, w, z);
                        if (!y) {
                            e = H = true
                        } else {
                            if (y === true) {
                                continue
                            }
                        }
                    }
                    if (y) {
                        for (var x = 0;
                        (F = A[x]) != null; x++) {
                            if (F) {
                                H = u(F, y, x, A);
                                var E = w ^ !! H;
                                if (G && H != null) {
                                    if (E) {
                                        e = true
                                    } else {
                                        A[x] = false
                                    }
                                } else {
                                    if (E) {
                                        I.push(F);
                                        e = true
                                    }
                                }
                            }
                        }
                    }
                    if (H !== undefined) {
                        if (!G) {
                            A = I
                        }
                        D = D.replace(f.match[B], "");
                        if (!e) {
                            return []
                        }
                        break
                    }
                }
            }
            if (D == v) {
                if (e == null) {
                    throw "Syntax error, unrecognized expression: " + D
                } else {
                    break
                }
            }
            v = D
        }
        return A
    };
    var f = b.selectors = {
        order: ["ID", "NAME", "TAG"],
        match: {
            ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
        },
        leftMatch: {},
        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },
        attrHandle: {
            href: function (e) {
                return e.getAttribute("href")
            }
        },
        relative: {
            "+": function (A, e, z) {
                var x = typeof e === "string",
                    B = x && !/\W/.test(e),
                    y = x && !B;
                if (B && !z) {
                    e = e.toUpperCase()
                }
                for (var w = 0, v = A.length, u; w < v; w++) {
                    if ((u = A[w])) {
                        while ((u = u.previousSibling) && u.nodeType !== 1) {}
                        A[w] = y || u && u.nodeName === e ? u || false : u === e
                    }
                }
                if (y) {
                    b.filter(e, A, true)
                }
            },
            ">": function (z, u, A) {
                var x = typeof u === "string";
                if (x && !/\W/.test(u)) {
                    u = A ? u : u.toUpperCase();
                    for (var v = 0, e = z.length; v < e; v++) {
                        var y = z[v];
                        if (y) {
                            var w = y.parentNode;
                            z[v] = w.nodeName === u ? w : false
                        }
                    }
                } else {
                    for (var v = 0, e = z.length; v < e; v++) {
                        var y = z[v];
                        if (y) {
                            z[v] = x ? y.parentNode : y.parentNode === u
                        }
                    }
                    if (x) {
                        b.filter(u, z, true)
                    }
                }
            },
            "": function (w, u, y) {
                var v = l++,
                    e = t;
                if (!/\W/.test(u)) {
                    var x = u = y ? u : u.toUpperCase();
                    e = p
                }
                e("parentNode", u, v, w, x, y)
            },
            "~": function (w, u, y) {
                var v = l++,
                    e = t;
                if (typeof u === "string" && !/\W/.test(u)) {
                    var x = u = y ? u : u.toUpperCase();
                    e = p
                }
                e("previousSibling", u, v, w, x, y)
            }
        },
        find: {
            ID: function (u, v, w) {
                if (typeof v.getElementById !== "undefined" && !w) {
                    var e = v.getElementById(u[1]);
                    return e ? [e] : []
                }
            },
            NAME: function (v, y, z) {
                if (typeof y.getElementsByName !== "undefined") {
                    var u = [],
                        x = y.getElementsByName(v[1]);
                    for (var w = 0, e = x.length; w < e; w++) {
                        if (x[w].getAttribute("name") === v[1]) {
                            u.push(x[w])
                        }
                    }
                    return u.length === 0 ? null : u
                }
            },
            TAG: function (e, u) {
                return u.getElementsByTagName(e[1])
            }
        },
        preFilter: {
            CLASS: function (w, u, v, e, z, A) {
                w = " " + w[1].replace(/\\/g, "") + " ";
                if (A) {
                    return w
                }
                for (var x = 0, y;
                (y = u[x]) != null; x++) {
                    if (y) {
                        if (z ^ (y.className && (" " + y.className + " ").indexOf(w) >= 0)) {
                            if (!v) {
                                e.push(y)
                            }
                        } else {
                            if (v) {
                                u[x] = false
                            }
                        }
                    }
                }
                return false
            },
            ID: function (e) {
                return e[1].replace(/\\/g, "")
            },
            TAG: function (u, e) {
                for (var v = 0; e[v] === false; v++) {}
                return e[v] && r(e[v]) ? u[1] : u[1].toUpperCase()
            },
            CHILD: function (e) {
                if (e[1] == "nth") {
                    var u = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(e[2] == "even" && "2n" || e[2] == "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
                    e[2] = (u[1] + (u[2] || 1)) - 0;
                    e[3] = u[3] - 0
                }
                e[0] = l++;
                return e
            },
            ATTR: function (x, u, v, e, y, z) {
                var w = x[1].replace(/\\/g, "");
                if (!z && f.attrMap[w]) {
                    x[1] = f.attrMap[w]
                }
                if (x[2] === "~=") {
                    x[4] = " " + x[4] + " "
                }
                return x
            },
            PSEUDO: function (x, u, v, e, y) {
                if (x[1] === "not") {
                    if ((s.exec(x[3]) || "").length > 1 || /^\w/.test(x[3])) {
                        x[3] = b(x[3], null, null, u)
                    } else {
                        var w = b.filter(x[3], u, v, true ^ y);
                        if (!v) {
                            e.push.apply(e, w)
                        }
                        return false
                    }
                } else {
                    if (f.match.POS.test(x[0]) || f.match.CHILD.test(x[0])) {
                        return true
                    }
                }
                return x
            },
            POS: function (e) {
                e.unshift(true);
                return e
            }
        },
        filters: {
            enabled: function (e) {
                return e.disabled === false && e.type !== "hidden"
            },
            disabled: function (e) {
                return e.disabled === true
            },
            checked: function (e) {
                return e.checked === true
            },
            selected: function (e) {
                e.parentNode.selectedIndex;
                return e.selected === true
            },
            parent: function (e) {
                return !!e.firstChild
            },
            empty: function (e) {
                return !e.firstChild
            },
            has: function (v, u, e) {
                return !!b(e[3], v).length
            },
            header: function (e) {
                return /h\d/i.test(e.nodeName)
            },
            text: function (e) {
                return "text" === e.type
            },
            radio: function (e) {
                return "radio" === e.type
            },
            checkbox: function (e) {
                return "checkbox" === e.type
            },
            file: function (e) {
                return "file" === e.type
            },
            password: function (e) {
                return "password" === e.type
            },
            submit: function (e) {
                return "submit" === e.type
            },
            image: function (e) {
                return "image" === e.type
            },
            reset: function (e) {
                return "reset" === e.type
            },
            button: function (e) {
                return "button" === e.type || e.nodeName.toUpperCase() === "BUTTON"
            },
            input: function (e) {
                return /input|select|textarea|button/i.test(e.nodeName)
            }
        },
        setFilters: {
            first: function (u, e) {
                return e === 0
            },
            last: function (v, u, e, w) {
                return u === w.length - 1
            },
            even: function (u, e) {
                return e % 2 === 0
            },
            odd: function (u, e) {
                return e % 2 === 1
            },
            lt: function (v, u, e) {
                return u < e[3] - 0
            },
            gt: function (v, u, e) {
                return u > e[3] - 0
            },
            nth: function (v, u, e) {
                return e[3] - 0 == u
            },
            eq: function (v, u, e) {
                return e[3] - 0 == u
            }
        },
        filter: {
            PSEUDO: function (z, v, w, A) {
                var u = v[1],
                    x = f.filters[u];
                if (x) {
                    return x(z, w, v, A)
                } else {
                    if (u === "contains") {
                        return (z.textContent || z.innerText || "").indexOf(v[3]) >= 0
                    } else {
                        if (u === "not") {
                            var y = v[3];
                            for (var w = 0, e = y.length; w < e; w++) {
                                if (y[w] === z) {
                                    return false
                                }
                            }
                            return true
                        }
                    }
                }
            },
            CHILD: function (e, w) {
                var z = w[1],
                    u = e;
                switch (z) {
                case "only":
                case "first":
                    while ((u = u.previousSibling)) {
                        if (u.nodeType === 1) {
                            return false
                        }
                    }
                    if (z == "first") {
                        return true
                    }
                    u = e;
                case "last":
                    while ((u = u.nextSibling)) {
                        if (u.nodeType === 1) {
                            return false
                        }
                    }
                    return true;
                case "nth":
                    var v = w[2],
                        C = w[3];
                    if (v == 1 && C == 0) {
                        return true
                    }
                    var y = w[0],
                        B = e.parentNode;
                    if (B && (B.sizcache !== y || !e.nodeIndex)) {
                        var x = 0;
                        for (u = B.firstChild; u; u = u.nextSibling) {
                            if (u.nodeType === 1) {
                                u.nodeIndex = ++x
                            }
                        }
                        B.sizcache = y
                    }
                    var A = e.nodeIndex - C;
                    if (v == 0) {
                        return A == 0
                    } else {
                        return (A % v == 0 && A / v >= 0)
                    }
                }
            },
            ID: function (u, e) {
                return u.nodeType === 1 && u.getAttribute("id") === e
            },
            TAG: function (u, e) {
                return (e === "*" && u.nodeType === 1) || u.nodeName === e
            },
            CLASS: function (u, e) {
                return (" " + (u.className || u.getAttribute("class")) + " ").indexOf(e) > -1
            },
            ATTR: function (y, w) {
                var v = w[1],
                    e = f.attrHandle[v] ? f.attrHandle[v](y) : y[v] != null ? y[v] : y.getAttribute(v),
                    z = e + "",
                    x = w[2],
                    u = w[4];
                return e == null ? x === "!=" : x === "=" ? z === u : x === "*=" ? z.indexOf(u) >= 0 : x === "~=" ? (" " + z + " ").indexOf(u) >= 0 : !u ? z && e !== false : x === "!=" ? z != u : x === "^=" ? z.indexOf(u) === 0 : x === "$=" ? z.substr(z.length - u.length) === u : x === "|=" ? z === u || z.substr(0, u.length + 1) === u + "-" : false
            },
            POS: function (x, u, v, y) {
                var e = u[2],
                    w = f.setFilters[e];
                if (w) {
                    return w(x, v, u, y)
                }
            }
        }
    };
    var m = f.match.POS;
    for (var o in f.match) {
        f.match[o] = new RegExp(f.match[o].source + /(?![^\[]*\])(?![^\(]*\))/.source);
        f.leftMatch[o] = new RegExp(/(^(?:.|\r|\n)*?)/.source + f.match[o].source)
    }
    var a = function (u, e) {
            u = Array.prototype.slice.call(u, 0);
            if (e) {
                e.push.apply(e, u);
                return e
            }
            return u
        };
    try {
        Array.prototype.slice.call(document.documentElement.childNodes, 0)
    } catch (n) {
        a = function (x, w) {
            var u = w || [];
            if (d.call(x) === "[object Array]") {
                Array.prototype.push.apply(u, x)
            } else {
                if (typeof x.length === "number") {
                    for (var v = 0, e = x.length; v < e; v++) {
                        u.push(x[v])
                    }
                } else {
                    for (var v = 0; x[v]; v++) {
                        u.push(x[v])
                    }
                }
            }
            return u
        }
    }
    var c;
    if (document.documentElement.compareDocumentPosition) {
        c = function (u, e) {
            if (!u.compareDocumentPosition || !e.compareDocumentPosition) {
                if (u == e) {
                    q = true
                }
                return 0
            }
            var v = u.compareDocumentPosition(e) & 4 ? -1 : u === e ? 0 : 1;
            if (v === 0) {
                q = true
            }
            return v
        }
    } else {
        if ("sourceIndex" in document.documentElement) {
            c = function (u, e) {
                if (!u.sourceIndex || !e.sourceIndex) {
                    if (u == e) {
                        q = true
                    }
                    return 0
                }
                var v = u.sourceIndex - e.sourceIndex;
                if (v === 0) {
                    q = true
                }
                return v
            }
        } else {
            if (document.createRange) {
                c = function (w, u) {
                    if (!w.ownerDocument || !u.ownerDocument) {
                        if (w == u) {
                            q = true
                        }
                        return 0
                    }
                    var v = w.ownerDocument.createRange(),
                        e = u.ownerDocument.createRange();
                    v.setStart(w, 0);
                    v.setEnd(w, 0);
                    e.setStart(u, 0);
                    e.setEnd(u, 0);
                    var x = v.compareBoundaryPoints(Range.START_TO_END, e);
                    if (x === 0) {
                        q = true
                    }
                    return x
                }
            }
        }
    }(function () {
        var u = document.createElement("div"),
            v = "script" + (new Date).getTime();
        u.innerHTML = "<a name='" + v + "'/>";
        var e = document.documentElement;
        e.insertBefore(u, e.firstChild);
        if ( !! document.getElementById(v)) {
            f.find.ID = function (x, y, z) {
                if (typeof y.getElementById !== "undefined" && !z) {
                    var w = y.getElementById(x[1]);
                    return w ? w.id === x[1] || typeof w.getAttributeNode !== "undefined" && w.getAttributeNode("id").nodeValue === x[1] ? [w] : undefined : []
                }
            };
            f.filter.ID = function (y, w) {
                var x = typeof y.getAttributeNode !== "undefined" && y.getAttributeNode("id");
                return y.nodeType === 1 && x && x.nodeValue === w
            }
        }
        e.removeChild(u);
        e = u = null
    })();
    (function () {
        var e = document.createElement("div");
        e.appendChild(document.createComment(""));
        if (e.getElementsByTagName("*").length > 0) {
            f.find.TAG = function (u, y) {
                var x = y.getElementsByTagName(u[1]);
                if (u[1] === "*") {
                    var w = [];
                    for (var v = 0; x[v]; v++) {
                        if (x[v].nodeType === 1) {
                            w.push(x[v])
                        }
                    }
                    x = w
                }
                return x
            }
        }
        e.innerHTML = "<a href='#'></a>";
        if (e.firstChild && typeof e.firstChild.getAttribute !== "undefined" && e.firstChild.getAttribute("href") !== "#") {
            f.attrHandle.href = function (u) {
                return u.getAttribute("href", 2)
            }
        }
        e = null
    })();
    if (document.querySelectorAll) {
        (function () {
            var e = b,
                v = document.createElement("div");
            v.innerHTML = "<p class='TEST'></p>";
            if (v.querySelectorAll && v.querySelectorAll(".TEST").length === 0) {
                return
            }
            b = function (z, y, w, x) {
                y = y || document;
                if (!x && y.nodeType === 9 && !r(y)) {
                    try {
                        return a(y.querySelectorAll(z), w)
                    } catch (A) {}
                }
                return e(z, y, w, x)
            };
            for (var u in e) {
                b[u] = e[u]
            }
            v = null
        })()
    }
    if (document.getElementsByClassName && document.documentElement.getElementsByClassName) {
        (function () {
            var e = document.createElement("div");
            e.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (e.getElementsByClassName("e").length === 0) {
                return
            }
            e.lastChild.className = "e";
            if (e.getElementsByClassName("e").length === 1) {
                return
            }
            f.order.splice(1, 0, "CLASS");
            f.find.CLASS = function (u, v, w) {
                if (typeof v.getElementsByClassName !== "undefined" && !w) {
                    return v.getElementsByClassName(u[1])
                }
            };
            e = null
        })()
    }
    function p(u, z, y, D, A, C) {
        var B = u == "previousSibling" && !C;
        for (var w = 0, v = D.length; w < v; w++) {
            var e = D[w];
            if (e) {
                if (B && e.nodeType === 1) {
                    e.sizcache = y;
                    e.sizset = w
                }
                e = e[u];
                var x = false;
                while (e) {
                    if (e.sizcache === y) {
                        x = D[e.sizset];
                        break
                    }
                    if (e.nodeType === 1 && !C) {
                        e.sizcache = y;
                        e.sizset = w
                    }
                    if (e.nodeName === z) {
                        x = e;
                        break
                    }
                    e = e[u]
                }
                D[w] = x
            }
        }
    }
    function t(u, z, y, D, A, C) {
        var B = u == "previousSibling" && !C;
        for (var w = 0, v = D.length; w < v; w++) {
            var e = D[w];
            if (e) {
                if (B && e.nodeType === 1) {
                    e.sizcache = y;
                    e.sizset = w
                }
                e = e[u];
                var x = false;
                while (e) {
                    if (e.sizcache === y) {
                        x = D[e.sizset];
                        break
                    }
                    if (e.nodeType === 1) {
                        if (!C) {
                            e.sizcache = y;
                            e.sizset = w
                        }
                        if (typeof z !== "string") {
                            if (e === z) {
                                x = true;
                                break
                            }
                        } else {
                            if (b.filter(z, [e]).length > 0) {
                                x = e;
                                break
                            }
                        }
                    }
                    e = e[u]
                }
                D[w] = x
            }
        }
    }
    var h = document.compareDocumentPosition ?
    function (u, e) {
        return u.compareDocumentPosition(e) & 16
    } : function (u, e) {
        return u !== e && (u.contains ? u.contains(e) : true)
    };
    var r = function (e) {
            return e.nodeType === 9 && e.documentElement.nodeName !== "HTML" || !! e.ownerDocument && e.ownerDocument.documentElement.nodeName !== "HTML"
        };
    var g = function (e, A) {
            var w = [],
                x = "",
                y, v = A.nodeType ? [A] : A;
            while ((y = f.match.PSEUDO.exec(e))) {
                x += y[0];
                e = e.replace(f.match.PSEUDO, "")
            }
            e = f.relative[e] ? e + "*" : e;
            for (var z = 0, u = v.length; z < u; z++) {
                b(e, v[z], w)
            }
            return b.filter(x, w)
        };
    window.Sizzle = b
})();
(function (c) {
    var d = Prototype.Selector.extendElements;

    function a(e, f) {
        return d(c(e, f || document))
    }
    function b(f, e) {
        return c.matches(e, [f]).length == 1
    }
    Prototype.Selector.engine = c;
    Prototype.Selector.select = a;
    Prototype.Selector.match = b
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
    reset: function (a) {
        a = $(a);
        a.reset();
        return a
    },
    serializeElements: function (h, d) {
        if (typeof d != "object") {
            d = {
                hash: !! d
            }
        } else {
            if (Object.isUndefined(d.hash)) {
                d.hash = true
            }
        }
        var e, g, a = false,
            f = d.submit,
            b, c;
        if (d.hash) {
            c = {};
            b = function (k, l, m) {
                if (l in k) {
                    if (!Object.isArray(k[l])) {
                        k[l] = [k[l]]
                    }
                    k[l].push(m)
                } else {
                    k[l] = m
                }
                return k
            }
        } else {
            c = "";
            b = function (k, l, m) {
                return k + (k ? "&" : "") + encodeURIComponent(l) + "=" + encodeURIComponent(m)
            }
        }
        return h.inject(c, function (k, l) {
            if (!l.disabled && l.name) {
                e = l.name;
                g = $(l).getValue();
                if (g != null && l.type != "file" && (l.type != "submit" || (!a && f !== false && (!f || e == f) && (a = true)))) {
                    k = b(k, e, g)
                }
            }
            return k
        })
    }
};
Form.Methods = {
    serialize: function (b, a) {
        return Form.serializeElements(Form.getElements(b), a)
    },
    getElements: function (e) {
        var f = $(e).getElementsByTagName("*"),
            d, a = [],
            c = Form.Element.Serializers;
        for (var b = 0; d = f[b]; b++) {
            a.push(d)
        }
        return a.inject([], function (g, h) {
            if (c[h.tagName.toLowerCase()]) {
                g.push(Element.extend(h))
            }
            return g
        })
    },
    getInputs: function (g, c, d) {
        g = $(g);
        var a = g.getElementsByTagName("input");
        if (!c && !d) {
            return $A(a).map(Element.extend)
        }
        for (var e = 0, h = [], f = a.length; e < f; e++) {
            var b = a[e];
            if ((c && b.type != c) || (d && b.name != d)) {
                continue
            }
            h.push(Element.extend(b))
        }
        return h
    },
    disable: function (a) {
        a = $(a);
        Form.getElements(a).invoke("disable");
        return a
    },
    enable: function (a) {
        a = $(a);
        Form.getElements(a).invoke("enable");
        return a
    },
    findFirstElement: function (b) {
        var c = $(b).getElements().findAll(function (d) {
            return "hidden" != d.type && !d.disabled
        });
        var a = c.findAll(function (d) {
            return d.hasAttribute("tabIndex") && d.tabIndex >= 0
        }).sortBy(function (d) {
            return d.tabIndex
        }).first();
        return a ? a : c.find(function (d) {
            return /^(?:input|select|textarea)$/i.test(d.tagName)
        })
    },
    focusFirstElement: function (b) {
        b = $(b);
        var a = b.findFirstElement();
        if (a) {
            a.activate()
        }
        return b
    },
    request: function (b, a) {
        b = $(b), a = Object.clone(a || {});
        var d = a.parameters,
            c = b.readAttribute("action") || "";
        if (c.blank()) {
            c = window.location.href
        }
        a.parameters = b.serialize(true);
        if (d) {
            if (Object.isString(d)) {
                d = d.toQueryParams()
            }
            Object.extend(a.parameters, d)
        }
        if (b.hasAttribute("method") && !a.method) {
            a.method = b.method
        }
        return new Ajax.Request(c, a)
    }
};
Form.Element = {
    focus: function (a) {
        $(a).focus();
        return a
    },
    select: function (a) {
        $(a).select();
        return a
    }
};
Form.Element.Methods = {
    serialize: function (a) {
        a = $(a);
        if (!a.disabled && a.name) {
            var b = a.getValue();
            if (b != undefined) {
                var c = {};
                c[a.name] = b;
                return Object.toQueryString(c)
            }
        }
        return ""
    },
    getValue: function (a) {
        a = $(a);
        var b = a.tagName.toLowerCase();
        return Form.Element.Serializers[b](a)
    },
    setValue: function (a, b) {
        a = $(a);
        var c = a.tagName.toLowerCase();
        Form.Element.Serializers[c](a, b);
        return a
    },
    clear: function (a) {
        $(a).value = "";
        return a
    },
    present: function (a) {
        return $(a).value != ""
    },
    activate: function (a) {
        a = $(a);
        try {
            a.focus();
            if (a.select && (a.tagName.toLowerCase() != "input" || !(/^(?:button|reset|submit)$/i.test(a.type)))) {
                a.select()
            }
        } catch (b) {}
        return a
    },
    disable: function (a) {
        a = $(a);
        a.disabled = true;
        return a
    },
    enable: function (a) {
        a = $(a);
        a.disabled = false;
        return a
    }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = (function () {
    function b(h, k) {
        switch (h.type.toLowerCase()) {
        case "checkbox":
        case "radio":
            return f(h, k);
        default:
            return e(h, k)
        }
    }
    function f(h, k) {
        if (Object.isUndefined(k)) {
            return h.checked ? h.value : null
        } else {
            h.checked = !! k
        }
    }
    function e(h, k) {
        if (Object.isUndefined(k)) {
            return h.value
        } else {
            h.value = k
        }
    }
    function a(l, o) {
        if (Object.isUndefined(o)) {
            return (l.type === "select-one" ? c : d)(l)
        }
        var k, m, p = !Object.isArray(o);
        for (var h = 0, n = l.length; h < n; h++) {
            k = l.options[h];
            m = this.optionValue(k);
            if (p) {
                if (m == o) {
                    k.selected = true;
                    return
                }
            } else {
                k.selected = o.include(m)
            }
        }
    }
    function c(k) {
        var h = k.selectedIndex;
        return h >= 0 ? g(k.options[h]) : null
    }
    function d(m) {
        var h, n = m.length;
        if (!n) {
            return null
        }
        for (var l = 0, h = []; l < n; l++) {
            var k = m.options[l];
            if (k.selected) {
                h.push(g(k))
            }
        }
        return h
    }
    function g(h) {
        return Element.hasAttribute(h, "value") ? h.value : h.text
    }
    return {
        input: b,
        inputSelector: f,
        textarea: e,
        select: a,
        selectOne: c,
        selectMany: d,
        optionValue: g,
        button: e
    }
})();
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function ($super, a, b, c) {
        $super(c, b);
        this.element = $(a);
        this.lastValue = this.getValue()
    },
    execute: function () {
        var a = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a : String(this.lastValue) != String(a)) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element)
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.serialize(this.element)
    }
});
Abstract.EventObserver = Class.create({
    initialize: function (a, b) {
        this.element = $(a);
        this.callback = b;
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == "form") {
            this.registerFormCallbacks()
        } else {
            this.registerCallback(this.element)
        }
    },
    onElementEvent: function () {
        var a = this.getValue();
        if (this.lastValue != a) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    },
    registerFormCallbacks: function () {
        Form.getElements(this.element).each(this.registerCallback, this)
    },
    registerCallback: function (a) {
        if (a.type) {
            switch (a.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                Event.observe(a, "click", this.onElementEvent.bind(this));
                break;
            default:
                Event.observe(a, "change", this.onElementEvent.bind(this));
                break
            }
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element)
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.serialize(this.element)
    }
});
(function () {
    var E = {
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ESC: 27,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_DELETE: 46,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_INSERT: 45,
        cache: {}
    };
    var f = document.documentElement;
    var F = "onmouseenter" in f && "onmouseleave" in f;
    var a = function (G) {
            return false
        };
    if (window.attachEvent) {
        if (window.addEventListener) {
            a = function (G) {
                return !(G instanceof window.Event)
            }
        } else {
            a = function (G) {
                return true
            }
        }
    }
    var t;

    function C(H, G) {
        return H.which ? (H.which === G + 1) : (H.button === G)
    }
    var q = {
        0: 1,
        1: 4,
        2: 2
    };

    function A(H, G) {
        return H.button === q[G]
    }
    function D(H, G) {
        switch (G) {
        case 0:
            return H.which == 1 && !H.metaKey;
        case 1:
            return H.which == 2 || (H.which == 1 && H.metaKey);
        case 2:
            return H.which == 3;
        default:
            return false
        }
    }
    if (window.attachEvent) {
        if (!window.addEventListener) {
            t = A
        } else {
            t = function (H, G) {
                return a(H) ? A(H, G) : C(H, G)
            }
        }
    } else {
        if (Prototype.Browser.WebKit) {
            t = D
        } else {
            t = C
        }
    }
    function x(G) {
        return t(G, 0)
    }
    function v(G) {
        return t(G, 1)
    }
    function p(G) {
        return t(G, 2)
    }
    function d(I) {
        I = E.extend(I);
        var H = I.target,
            G = I.type,
            J = I.currentTarget;
        if (J && J.tagName) {
            if (G === "load" || G === "error" || (G === "click" && J.tagName.toLowerCase() === "input" && J.type === "radio")) {
                H = J
            }
        }
        if (H.nodeType == Node.TEXT_NODE) {
            H = H.parentNode
        }
        return Element.extend(H)
    }
    function r(H, I) {
        var G = E.element(H);
        if (!I) {
            return G
        }
        while (G) {
            if (Object.isElement(G) && Prototype.Selector.match(G, I)) {
                return Element.extend(G)
            }
            G = G.parentNode
        }
    }
    function u(G) {
        return {
            x: c(G),
            y: b(G)
        }
    }
    function c(I) {
        var H = document.documentElement,
            G = document.body || {
                scrollLeft: 0
            };
        return I.pageX || (I.clientX + (H.scrollLeft || G.scrollLeft) - (H.clientLeft || 0))
    }
    function b(I) {
        var H = document.documentElement,
            G = document.body || {
                scrollTop: 0
            };
        return I.pageY || (I.clientY + (H.scrollTop || G.scrollTop) - (H.clientTop || 0))
    }
    function s(G) {
        E.extend(G);
        G.preventDefault();
        G.stopPropagation();
        G.stopped = true
    }
    E.Methods = {
        isLeftClick: x,
        isMiddleClick: v,
        isRightClick: p,
        element: d,
        findElement: r,
        pointer: u,
        pointerX: c,
        pointerY: b,
        stop: s
    };
    var z = Object.keys(E.Methods).inject({}, function (G, H) {
        G[H] = E.Methods[H].methodize();
        return G
    });
    if (window.attachEvent) {
        function k(H) {
            var G;
            switch (H.type) {
            case "mouseover":
            case "mouseenter":
                G = H.fromElement;
                break;
            case "mouseout":
            case "mouseleave":
                G = H.toElement;
                break;
            default:
                return null
            }
            return Element.extend(G)
        }
        var w = {
            stopPropagation: function () {
                this.cancelBubble = true
            },
            preventDefault: function () {
                this.returnValue = false
            },
            inspect: function () {
                return "[object Event]"
            }
        };
        E.extend = function (H, G) {
            if (!H) {
                return false
            }
            if (!a(H)) {
                return H
            }
            if (H._extendedByPrototype) {
                return H
            }
            H._extendedByPrototype = Prototype.emptyFunction;
            var I = E.pointer(H);
            Object.extend(H, {
                target: H.srcElement || G,
                relatedTarget: k(H),
                pageX: I.x,
                pageY: I.y
            });
            Object.extend(H, z);
            Object.extend(H, w);
            return H
        }
    } else {
        E.extend = Prototype.K
    }
    if (window.addEventListener) {
        E.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__;
        Object.extend(E.prototype, z)
    }
    function o(K, J, L) {
        var I = Element.retrieve(K, "prototype_event_registry");
        if (Object.isUndefined(I)) {
            e.push(K);
            I = Element.retrieve(K, "prototype_event_registry", $H())
        }
        var G = I.get(J);
        if (Object.isUndefined(G)) {
            G = [];
            I.set(J, G)
        }
        if (G.pluck("handler").include(L)) {
            return false
        }
        var H;
        if (J.include(":")) {
            H = function (M) {
                if (Object.isUndefined(M.eventName)) {
                    return false
                }
                if (M.eventName !== J) {
                    return false
                }
                E.extend(M, K);
                L.call(K, M)
            }
        } else {
            if (!F && (J === "mouseenter" || J === "mouseleave")) {
                if (J === "mouseenter" || J === "mouseleave") {
                    H = function (N) {
                        E.extend(N, K);
                        var M = N.relatedTarget;
                        while (M && M !== K) {
                            try {
                                M = M.parentNode
                            } catch (O) {
                                M = K
                            }
                        }
                        if (M === K) {
                            return
                        }
                        L.call(K, N)
                    }
                }
            } else {
                H = function (M) {
                    E.extend(M, K);
                    L.call(K, M)
                }
            }
        }
        H.handler = L;
        G.push(H);
        return H
    }
    function h() {
        for (var G = 0, H = e.length; G < H; G++) {
            E.stopObserving(e[G]);
            e[G] = null
        }
    }
    var e = [];
    if (Prototype.Browser.IE) {
        window.attachEvent("onunload", h)
    }
    if (Prototype.Browser.WebKit) {
        window.addEventListener("unload", Prototype.emptyFunction, false)
    }
    var n = Prototype.K,
        g = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        };
    if (!F) {
        n = function (G) {
            return (g[G] || G)
        }
    }
    function y(J, I, K) {
        J = $(J);
        var H = o(J, I, K);
        if (!H) {
            return J
        }
        if (I.include(":")) {
            if (J.addEventListener) {
                J.addEventListener("dataavailable", H, false)
            } else {
                J.attachEvent("ondataavailable", H);
                J.attachEvent("onlosecapture", H)
            }
        } else {
            var G = n(I);
            if (J.addEventListener) {
                J.addEventListener(G, H, false)
            } else {
                J.attachEvent("on" + G, H)
            }
        }
        return J
    }
    function m(M, J, N) {
        M = $(M);
        var I = Element.retrieve(M, "prototype_event_registry");
        if (!I) {
            return M
        }
        if (!J) {
            I.each(function (P) {
                var O = P.key;
                m(M, O)
            });
            return M
        }
        var K = I.get(J);
        if (!K) {
            return M
        }
        if (!N) {
            K.each(function (O) {
                m(M, J, O.handler)
            });
            return M
        }
        var L = K.length,
            H;
        while (L--) {
            if (K[L].handler === N) {
                H = K[L];
                break
            }
        }
        if (!H) {
            return M
        }
        if (J.include(":")) {
            if (M.removeEventListener) {
                M.removeEventListener("dataavailable", H, false)
            } else {
                M.detachEvent("ondataavailable", H);
                M.detachEvent("onlosecapture", H)
            }
        } else {
            var G = n(J);
            if (M.removeEventListener) {
                M.removeEventListener(G, H, false)
            } else {
                M.detachEvent("on" + G, H)
            }
        }
        I.set(J, K.without(H));
        return M
    }
    function B(J, I, H, G) {
        J = $(J);
        if (Object.isUndefined(G)) {
            G = true
        }
        if (J == document && document.createEvent && !J.dispatchEvent) {
            J = document.documentElement
        }
        var K;
        if (document.createEvent) {
            K = document.createEvent("HTMLEvents");
            K.initEvent("dataavailable", G, true)
        } else {
            K = document.createEventObject();
            K.eventType = G ? "ondataavailable" : "onlosecapture"
        }
        K.eventName = I;
        K.memo = H || {};
        if (document.createEvent) {
            J.dispatchEvent(K)
        } else {
            J.fireEvent(K.eventType, K)
        }
        return E.extend(K)
    }
    E.Handler = Class.create({
        initialize: function (I, H, G, J) {
            this.element = $(I);
            this.eventName = H;
            this.selector = G;
            this.callback = J;
            this.handler = this.handleEvent.bind(this)
        },
        start: function () {
            E.observe(this.element, this.eventName, this.handler);
            return this
        },
        stop: function () {
            E.stopObserving(this.element, this.eventName, this.handler);
            return this
        },
        handleEvent: function (H) {
            var G = E.findElement(H, this.selector);
            if (G) {
                this.callback.call(this.element, H, G)
            }
        }
    });

    function l(I, H, G, J) {
        I = $(I);
        if (Object.isFunction(G) && Object.isUndefined(J)) {
            J = G, G = null
        }
        return new E.Handler(I, H, G, J).start()
    }
    Object.extend(E, E.Methods);
    Object.extend(E, {
        fire: B,
        observe: y,
        stopObserving: m,
        on: l
    });
    Element.addMethods({
        fire: B,
        observe: y,
        stopObserving: m,
        on: l
    });
    Object.extend(document, {
        fire: B.methodize(),
        observe: y.methodize(),
        stopObserving: m.methodize(),
        on: l.methodize(),
        loaded: false
    });
    if (window.Event) {
        Object.extend(window.Event, E)
    } else {
        window.Event = E
    }
})();
(function () {
    var d;

    function a() {
        if (document.loaded) {
            return
        }
        if (d) {
            window.clearTimeout(d)
        }
        document.loaded = true;
        document.fire("dom:loaded")
    }
    function c() {
        if (document.readyState === "complete") {
            document.stopObserving("readystatechange", c);
            a()
        }
    }
    function b() {
        try {
            document.documentElement.doScroll("left")
        } catch (f) {
            d = b.defer();
            return
        }
        a()
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", a, false)
    } else {
        document.observe("readystatechange", c);
        if (window == top) {
            d = b.defer()
        }
    }
    Event.observe(window, "load", a)
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
    Before: function (a, b) {
        return Element.insert(a, {
            before: b
        })
    },
    Top: function (a, b) {
        return Element.insert(a, {
            top: b
        })
    },
    Bottom: function (a, b) {
        return Element.insert(a, {
            bottom: b
        })
    },
    After: function (a, b) {
        return Element.insert(a, {
            after: b
        })
    }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
    includeScrollOffsets: false,
    prepare: function () {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    },
    within: function (b, a, c) {
        if (this.includeScrollOffsets) {
            return this.withinIncludingScrolloffsets(b, a, c)
        }
        this.xcomp = a;
        this.ycomp = c;
        this.offset = Element.cumulativeOffset(b);
        return (c >= this.offset[1] && c < this.offset[1] + b.offsetHeight && a >= this.offset[0] && a < this.offset[0] + b.offsetWidth)
    },
    withinIncludingScrolloffsets: function (b, a, d) {
        var c = Element.cumulativeScrollOffset(b);
        this.xcomp = a + c[0] - this.deltaX;
        this.ycomp = d + c[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(b);
        return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + b.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + b.offsetWidth)
    },
    overlap: function (b, a) {
        if (!b) {
            return 0
        }
        if (b == "vertical") {
            return ((this.offset[1] + a.offsetHeight) - this.ycomp) / a.offsetHeight
        }
        if (b == "horizontal") {
            return ((this.offset[0] + a.offsetWidth) - this.xcomp) / a.offsetWidth
        }
    },
    cumulativeOffset: Element.Methods.cumulativeOffset,
    positionedOffset: Element.Methods.positionedOffset,
    absolutize: function (a) {
        Position.prepare();
        return Element.absolutize(a)
    },
    relativize: function (a) {
        Position.prepare();
        return Element.relativize(a)
    },
    realOffset: Element.Methods.cumulativeScrollOffset,
    offsetParent: Element.Methods.getOffsetParent,
    page: Element.Methods.viewportOffset,
    clone: function (b, c, a) {
        a = a || {};
        return Element.clonePosition(c, b, a)
    }
};
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (b) {
        function a(c) {
            return c.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + c + " ')]"
        }
        b.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
        function (c, e) {
            e = e.toString().strip();
            var d = /\s/.test(e) ? $w(e).map(a).join("") : a(e);
            return d ? document._getElementsByXPath(".//*" + d, c) : []
        } : function (e, f) {
            f = f.toString().strip();
            var g = [],
                h = (/\s/.test(f) ? $w(f) : null);
            if (!h && !f) {
                return g
            }
            var c = $(e).getElementsByTagName("*");
            f = " " + f + " ";
            for (var d = 0, l, k; l = c[d]; d++) {
                if (l.className && (k = " " + l.className + " ") && (k.include(f) || (h && h.all(function (m) {
                    return !m.toString().blank() && k.include(" " + m + " ")
                })))) {
                    g.push(Element.extend(l))
                }
            }
            return g
        };
        return function (d, c) {
            return $(c || document.body).getElementsByClassName(d)
        }
    }(Element.Methods)
}
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function (a) {
        this.element = $(a)
    },
    _each: function (a) {
        this.element.className.split(/\s+/).select(function (b) {
            return b.length > 0
        })._each(a)
    },
    set: function (a) {
        this.element.className = a
    },
    add: function (a) {
        if (this.include(a)) {
            return
        }
        this.set($A(this).concat(a).join(" "))
    },
    remove: function (a) {
        if (!this.include(a)) {
            return
        }
        this.set($A(this).without(a).join(" "))
    },
    toString: function () {
        return $A(this).join(" ")
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function () {
    window.Selector = Class.create({
        initialize: function (a) {
            this.expression = a.strip()
        },
        findElements: function (a) {
            return Prototype.Selector.select(this.expression, a)
        },
        match: function (a) {
            return Prototype.Selector.match(a, this.expression)
        },
        toString: function () {
            return this.expression
        },
        inspect: function () {
            return "#<Selector: " + this.expression + ">"
        }
    });
    Object.extend(Selector, {
        matchElements: function (f, g) {
            var a = Prototype.Selector.match,
                d = [];
            for (var c = 0, e = f.length; c < e; c++) {
                var b = f[c];
                if (a(b, g)) {
                    d.push(Element.extend(b))
                }
            }
            return d
        },
        findElement: function (f, g, b) {
            b = b || 0;
            var a = 0,
                d;
            for (var c = 0, e = f.length; c < e; c++) {
                d = f[c];
                if (Prototype.Selector.match(d, g) && b === a++) {
                    return Element.extend(d)
                }
            }
        },
        findChildElements: function (b, c) {
            var a = c.toArray().join(", ");
            return Prototype.Selector.select(a, b || document)
        }
    })
})();
String.prototype.parseColor = function () {
    var a = "#";
    if (this.slice(0, 4) == "rgb(") {
        var c = this.slice(4, this.length - 1).split(",");
        var b = 0;
        do {
            a += parseInt(c[b]).toColorPart()
        } while (++b < 3)
    } else {
        if (this.slice(0, 1) == "#") {
            if (this.length == 4) {
                for (var b = 1; b < 4; b++) {
                    a += (this.charAt(b) + this.charAt(b)).toLowerCase()
                }
            }
            if (this.length == 7) {
                a = this.toLowerCase()
            }
        }
    }
    return (a.length == 7 ? a : (arguments[0] || this))
};
Element.collectTextNodes = function (a) {
    return $A($(a).childNodes).collect(function (b) {
        return (b.nodeType == 3 ? b.nodeValue : (b.hasChildNodes() ? Element.collectTextNodes(b) : ""))
    }).flatten().join("")
};
Element.collectTextNodesIgnoreClass = function (a, b) {
    return $A($(a).childNodes).collect(function (c) {
        return (c.nodeType == 3 ? c.nodeValue : ((c.hasChildNodes() && !Element.hasClassName(c, b)) ? Element.collectTextNodesIgnoreClass(c, b) : ""))
    }).flatten().join("")
};
Element.setContentZoom = function (a, b) {
    a = $(a);
    a.setStyle({
        fontSize: (b / 100) + "em"
    });
    if (Prototype.Browser.WebKit) {
        window.scrollBy(0, 0)
    }
    return a
};
Element.getInlineOpacity = function (a) {
    return $(a).style.opacity || ""
};
Element.forceRerendering = function (a) {
    try {
        a = $(a);
        var c = document.createTextNode(" ");
        a.appendChild(c);
        a.removeChild(c)
    } catch (b) {}
};
var Effect = {
    _elementDoesNotExistError: {
        name: "ElementDoesNotExistError",
        message: "The specified DOM element does not exist, but is required for this effect to operate"
    },
    Transitions: {
        linear: Prototype.K,
        sinoidal: function (a) {
            return (-Math.cos(a * Math.PI) / 2) + 0.5
        },
        reverse: function (a) {
            return 1 - a
        },
        flicker: function (a) {
            var a = ((-Math.cos(a * Math.PI) / 4) + 0.75) + Math.random() / 4;
            return a > 1 ? 1 : a
        },
        wobble: function (a) {
            return (-Math.cos(a * Math.PI * (9 * a)) / 2) + 0.5
        },
        pulse: function (b, a) {
            return (-Math.cos((b * ((a || 5) - 0.5) * 2) * Math.PI) / 2) + 0.5
        },
        spring: function (a) {
            return 1 - (Math.cos(a * 4.5 * Math.PI) * Math.exp(-a * 6))
        },
        none: function (a) {
            return 0
        },
        full: function (a) {
            return 1
        }
    },
    DefaultOptions: {
        duration: 1,
        fps: 100,
        sync: false,
        from: 0,
        to: 1,
        delay: 0,
        queue: "parallel"
    },
    tagifyText: function (a) {
        var b = "position:relative";
        if (Prototype.Browser.IE) {
            b += ";zoom:1"
        }
        a = $(a);
        $A(a.childNodes).each(function (c) {
            if (c.nodeType == 3) {
                c.nodeValue.toArray().each(function (d) {
                    a.insertBefore(new Element("span", {
                        style: b
                    }).update(d == " " ? String.fromCharCode(160) : d), c)
                });
                Element.remove(c)
            }
        })
    },
    multiple: function (b, c) {
        var e;
        if (((typeof b == "object") || Object.isFunction(b)) && (b.length)) {
            e = b
        } else {
            e = $(b).childNodes
        }
        var a = Object.extend({
            speed: 0.1,
            delay: 0
        }, arguments[2] || {});
        var d = a.delay;
        $A(e).each(function (g, f) {
            new c(g, Object.extend(a, {
                delay: f * a.speed + d
            }))
        })
    },
    PAIRS: {
        slide: ["SlideDown", "SlideUp"],
        blind: ["BlindDown", "BlindUp"],
        appear: ["Appear", "Fade"]
    },
    toggle: function (b, c, a) {
        b = $(b);
        c = (c || "appear").toLowerCase();
        return Effect[Effect.PAIRS[c][b.visible() ? 1 : 0]](b, Object.extend({
            queue: {
                position: "end",
                scope: (b.id || "global"),
                limit: 1
            }
        }, a || {}))
    }
};
Effect.DefaultOptions.transition = Effect.Transitions.sinoidal;
Effect.ScopedQueue = Class.create(Enumerable, {
    initialize: function () {
        this.effects = [];
        this.interval = null
    },
    _each: function (a) {
        this.effects._each(a)
    },
    add: function (b) {
        var c = new Date().getTime();
        var a = Object.isString(b.options.queue) ? b.options.queue : b.options.queue.position;
        switch (a) {
        case "front":
            this.effects.findAll(function (d) {
                return d.state == "idle"
            }).each(function (d) {
                d.startOn += b.finishOn;
                d.finishOn += b.finishOn
            });
            break;
        case "with-last":
            c = this.effects.pluck("startOn").max() || c;
            break;
        case "end":
            c = this.effects.pluck("finishOn").max() || c;
            break
        }
        b.startOn += c;
        b.finishOn += c;
        if (!b.options.queue.limit || (this.effects.length < b.options.queue.limit)) {
            this.effects.push(b)
        }
        if (!this.interval) {
            this.interval = setInterval(this.loop.bind(this), 15)
        }
    },
    remove: function (a) {
        this.effects = this.effects.reject(function (b) {
            return b == a
        });
        if (this.effects.length == 0) {
            clearInterval(this.interval);
            this.interval = null
        }
    },
    loop: function () {
        var c = new Date().getTime();
        for (var b = 0, a = this.effects.length; b < a; b++) {
            this.effects[b] && this.effects[b].loop(c)
        }
    }
});
Effect.Queues = {
    instances: $H(),
    get: function (a) {
        if (!Object.isString(a)) {
            return a
        }
        return this.instances.get(a) || this.instances.set(a, new Effect.ScopedQueue())
    }
};
Effect.Queue = Effect.Queues.get("global");
Effect.Base = Class.create({
    position: null,
    start: function (a) {
        if (a && a.transition === false) {
            a.transition = Effect.Transitions.linear
        }
        this.options = Object.extend(Object.extend({}, Effect.DefaultOptions), a || {});
        this.currentFrame = 0;
        this.state = "idle";
        this.startOn = this.options.delay * 1000;
        this.finishOn = this.startOn + (this.options.duration * 1000);
        this.fromToDelta = this.options.to - this.options.from;
        this.totalTime = this.finishOn - this.startOn;
        this.totalFrames = this.options.fps * this.options.duration;
        this.render = (function () {
            function b(d, c) {
                if (d.options[c + "Internal"]) {
                    d.options[c + "Internal"](d)
                }
                if (d.options[c]) {
                    d.options[c](d)
                }
            }
            return function (c) {
                if (this.state === "idle") {
                    this.state = "running";
                    b(this, "beforeSetup");
                    if (this.setup) {
                        this.setup()
                    }
                    b(this, "afterSetup")
                }
                if (this.state === "running") {
                    c = (this.options.transition(c) * this.fromToDelta) + this.options.from;
                    this.position = c;
                    b(this, "beforeUpdate");
                    if (this.update) {
                        this.update(c)
                    }
                    b(this, "afterUpdate")
                }
            }
        })();
        this.event("beforeStart");
        if (!this.options.sync) {
            Effect.Queues.get(Object.isString(this.options.queue) ? "global" : this.options.queue.scope).add(this)
        }
    },
    loop: function (c) {
        if (c >= this.startOn) {
            if (c >= this.finishOn) {
                this.render(1);
                this.cancel();
                this.event("beforeFinish");
                if (this.finish) {
                    this.finish()
                }
                this.event("afterFinish");
                return
            }
            var b = (c - this.startOn) / this.totalTime,
                a = (b * this.totalFrames).round();
            if (a > this.currentFrame) {
                this.render(b);
                this.currentFrame = a
            }
        }
    },
    cancel: function () {
        if (!this.options.sync) {
            Effect.Queues.get(Object.isString(this.options.queue) ? "global" : this.options.queue.scope).remove(this)
        }
        this.state = "finished"
    },
    event: function (a) {
        if (this.options[a + "Internal"]) {
            this.options[a + "Internal"](this)
        }
        if (this.options[a]) {
            this.options[a](this)
        }
    },
    inspect: function () {
        var a = $H();
        for (property in this) {
            if (!Object.isFunction(this[property])) {
                a.set(property, this[property])
            }
        }
        return "#<Effect:" + a.inspect() + ",options:" + $H(this.options).inspect() + ">"
    }
});
Effect.Parallel = Class.create(Effect.Base, {
    initialize: function (a) {
        this.effects = a || [];
        this.start(arguments[1])
    },
    update: function (a) {
        this.effects.invoke("render", a)
    },
    finish: function (a) {
        this.effects.each(function (b) {
            b.render(1);
            b.cancel();
            b.event("beforeFinish");
            if (b.finish) {
                b.finish(a)
            }
            b.event("afterFinish")
        })
    }
});
Effect.Tween = Class.create(Effect.Base, {
    initialize: function (c, f, e) {
        c = Object.isString(c) ? $(c) : c;
        var b = $A(arguments),
            d = b.last(),
            a = b.length == 5 ? b[3] : null;
        this.method = Object.isFunction(d) ? d.bind(c) : Object.isFunction(c[d]) ? c[d].bind(c) : function (g) {
            c[d] = g
        };
        this.start(Object.extend({
            from: f,
            to: e
        }, a || {}))
    },
    update: function (a) {
        this.method(a)
    }
});
Effect.Event = Class.create(Effect.Base, {
    initialize: function () {
        this.start(Object.extend({
            duration: 0
        }, arguments[0] || {}))
    },
    update: Prototype.emptyFunction
});
Effect.Opacity = Class.create(Effect.Base, {
    initialize: function (b) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) {
            this.element.setStyle({
                zoom: 1
            })
        }
        var a = Object.extend({
            from: this.element.getOpacity() || 0,
            to: 1
        }, arguments[1] || {});
        this.start(a)
    },
    update: function (a) {
        this.element.setOpacity(a)
    }
});
Effect.Move = Class.create(Effect.Base, {
    initialize: function (b) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            x: 0,
            y: 0,
            mode: "relative"
        }, arguments[1] || {});
        this.start(a)
    },
    setup: function () {
        this.element.makePositioned();
        this.originalLeft = parseFloat(this.element.getStyle("left") || "0");
        this.originalTop = parseFloat(this.element.getStyle("top") || "0");
        if (this.options.mode == "absolute") {
            this.options.x = this.options.x - this.originalLeft;
            this.options.y = this.options.y - this.originalTop
        }
    },
    update: function (a) {
        this.element.setStyle({
            left: (this.options.x * a + this.originalLeft).round() + "px",
            top: (this.options.y * a + this.originalTop).round() + "px"
        })
    }
});
Effect.MoveBy = function (b, a, c) {
    return new Effect.Move(b, Object.extend({
        x: c,
        y: a
    }, arguments[3] || {}))
};
Effect.Scale = Class.create(Effect.Base, {
    initialize: function (b, c) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            scaleX: true,
            scaleY: true,
            scaleContent: true,
            scaleFromCenter: false,
            scaleMode: "box",
            scaleFrom: 100,
            scaleTo: c
        }, arguments[2] || {});
        this.start(a)
    },
    setup: function () {
        this.restoreAfterFinish = this.options.restoreAfterFinish || false;
        this.elementPositioning = this.element.getStyle("position");
        this.originalStyle = {};
        ["top", "left", "width", "height", "fontSize"].each(function (b) {
            this.originalStyle[b] = this.element.style[b]
        }.bind(this));
        this.originalTop = this.element.offsetTop;
        this.originalLeft = this.element.offsetLeft;
        var a = this.element.getStyle("font-size") || "100%";
        ["em", "px", "%", "pt"].each(function (b) {
            if (a.indexOf(b) > 0) {
                this.fontSize = parseFloat(a);
                this.fontSizeType = b
            }
        }.bind(this));
        this.factor = (this.options.scaleTo - this.options.scaleFrom) / 100;
        this.dims = null;
        if (this.options.scaleMode == "box") {
            this.dims = [this.element.offsetHeight, this.element.offsetWidth]
        }
        if (/^content/.test(this.options.scaleMode)) {
            this.dims = [this.element.scrollHeight, this.element.scrollWidth]
        }
        if (!this.dims) {
            this.dims = [this.options.scaleMode.originalHeight, this.options.scaleMode.originalWidth]
        }
    },
    update: function (a) {
        var b = (this.options.scaleFrom / 100) + (this.factor * a);
        if (this.options.scaleContent && this.fontSize) {
            this.element.setStyle({
                fontSize: this.fontSize * b + this.fontSizeType
            })
        }
        this.setDimensions(this.dims[0] * b, this.dims[1] * b)
    },
    finish: function (a) {
        if (this.restoreAfterFinish) {
            this.element.setStyle(this.originalStyle)
        }
    },
    setDimensions: function (a, e) {
        var f = {};
        if (this.options.scaleX) {
            f.width = e.round() + "px"
        }
        if (this.options.scaleY) {
            f.height = a.round() + "px"
        }
        if (this.options.scaleFromCenter) {
            var c = (a - this.dims[0]) / 2;
            var b = (e - this.dims[1]) / 2;
            if (this.elementPositioning == "absolute") {
                if (this.options.scaleY) {
                    f.top = this.originalTop - c + "px"
                }
                if (this.options.scaleX) {
                    f.left = this.originalLeft - b + "px"
                }
            } else {
                if (this.options.scaleY) {
                    f.top = -c + "px"
                }
                if (this.options.scaleX) {
                    f.left = -b + "px"
                }
            }
        }
        this.element.setStyle(f)
    }
});
Effect.Highlight = Class.create(Effect.Base, {
    initialize: function (b) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            startcolor: "#ffff99"
        }, arguments[1] || {});
        this.start(a)
    },
    setup: function () {
        if (this.element.getStyle("display") == "none") {
            this.cancel();
            return
        }
        this.oldStyle = {};
        if (!this.options.keepBackgroundImage) {
            this.oldStyle.backgroundImage = this.element.getStyle("background-image");
            this.element.setStyle({
                backgroundImage: "none"
            })
        }
        if (!this.options.endcolor) {
            this.options.endcolor = this.element.getStyle("background-color").parseColor("#ffffff")
        }
        if (!this.options.restorecolor) {
            this.options.restorecolor = this.element.getStyle("background-color")
        }
        this._base = $R(0, 2).map(function (a) {
            return parseInt(this.options.startcolor.slice(a * 2 + 1, a * 2 + 3), 16)
        }.bind(this));
        this._delta = $R(0, 2).map(function (a) {
            return parseInt(this.options.endcolor.slice(a * 2 + 1, a * 2 + 3), 16) - this._base[a]
        }.bind(this))
    },
    update: function (a) {
        this.element.setStyle({
            backgroundColor: $R(0, 2).inject("#", function (b, c, d) {
                return b + ((this._base[d] + (this._delta[d] * a)).round().toColorPart())
            }.bind(this))
        })
    },
    finish: function () {
        this.element.setStyle(Object.extend(this.oldStyle, {
            backgroundColor: this.options.restorecolor
        }))
    }
});
Effect.ScrollTo = function (c) {
    var b = arguments[1] || {},
        a = document.viewport.getScrollOffsets(),
        d = $(c).cumulativeOffset();
    if (b.offset) {
        d[1] += b.offset
    }
    return new Effect.Tween(null, a.top, d[1], b, function (e) {
        scrollTo(a.left, e.round())
    })
};
Effect.Fade = function (c) {
    c = $(c);
    var a = c.getInlineOpacity();
    var b = Object.extend({
        from: c.getOpacity() || 1,
        to: 0,
        afterFinishInternal: function (d) {
            if (d.options.to != 0) {
                return
            }
            d.element.hide().setStyle({
                opacity: a
            })
        }
    }, arguments[1] || {});
    return new Effect.Opacity(c, b)
};
Effect.Appear = function (b) {
    b = $(b);
    var a = Object.extend({
        from: (b.getStyle("display") == "none" ? 0 : b.getOpacity() || 0),
        to: 1,
        afterFinishInternal: function (c) {
            c.element.forceRerendering()
        },
        beforeSetup: function (c) {
            c.element.setOpacity(c.options.from).show()
        }
    }, arguments[1] || {});
    return new Effect.Opacity(b, a)
};
Effect.Puff = function (b) {
    b = $(b);
    var a = {
        opacity: b.getInlineOpacity(),
        position: b.getStyle("position"),
        top: b.style.top,
        left: b.style.left,
        width: b.style.width,
        height: b.style.height
    };
    return new Effect.Parallel([new Effect.Scale(b, 200, {
        sync: true,
        scaleFromCenter: true,
        scaleContent: true,
        restoreAfterFinish: true
    }), new Effect.Opacity(b, {
        sync: true,
        to: 0
    })], Object.extend({
        duration: 1,
        beforeSetupInternal: function (c) {
            Position.absolutize(c.effects[0].element)
        },
        afterFinishInternal: function (c) {
            c.effects[0].element.hide().setStyle(a)
        }
    }, arguments[1] || {}))
};
Effect.BlindUp = function (a) {
    a = $(a);
    a.makeClipping();
    return new Effect.Scale(a, 0, Object.extend({
        scaleContent: false,
        scaleX: false,
        restoreAfterFinish: true,
        afterFinishInternal: function (b) {
            b.element.hide().undoClipping()
        }
    }, arguments[1] || {}))
};
Effect.BlindDown = function (b) {
    b = $(b);
    var a = b.getDimensions();
    return new Effect.Scale(b, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: 0,
        scaleMode: {
            originalHeight: a.height,
            originalWidth: a.width
        },
        restoreAfterFinish: true,
        afterSetup: function (c) {
            c.element.makeClipping().setStyle({
                height: "0px"
            }).show()
        },
        afterFinishInternal: function (c) {
            c.element.undoClipping()
        }
    }, arguments[1] || {}))
};
Effect.SwitchOff = function (b) {
    b = $(b);
    var a = b.getInlineOpacity();
    return new Effect.Appear(b, Object.extend({
        duration: 0.4,
        from: 0,
        transition: Effect.Transitions.flicker,
        afterFinishInternal: function (c) {
            new Effect.Scale(c.element, 1, {
                duration: 0.3,
                scaleFromCenter: true,
                scaleX: false,
                scaleContent: false,
                restoreAfterFinish: true,
                beforeSetup: function (d) {
                    d.element.makePositioned().makeClipping()
                },
                afterFinishInternal: function (d) {
                    d.element.hide().undoClipping().undoPositioned().setStyle({
                        opacity: a
                    })
                }
            })
        }
    }, arguments[1] || {}))
};
Effect.DropOut = function (b) {
    b = $(b);
    var a = {
        top: b.getStyle("top"),
        left: b.getStyle("left"),
        opacity: b.getInlineOpacity()
    };
    return new Effect.Parallel([new Effect.Move(b, {
        x: 0,
        y: 100,
        sync: true
    }), new Effect.Opacity(b, {
        sync: true,
        to: 0
    })], Object.extend({
        duration: 0.5,
        beforeSetup: function (c) {
            c.effects[0].element.makePositioned()
        },
        afterFinishInternal: function (c) {
            c.effects[0].element.hide().undoPositioned().setStyle(a)
        }
    }, arguments[1] || {}))
};
Effect.Shake = function (d) {
    d = $(d);
    var b = Object.extend({
        distance: 20,
        duration: 0.5
    }, arguments[1] || {});
    var e = parseFloat(b.distance);
    var c = parseFloat(b.duration) / 10;
    var a = {
        top: d.getStyle("top"),
        left: d.getStyle("left")
    };
    return new Effect.Move(d, {
        x: e,
        y: 0,
        duration: c,
        afterFinishInternal: function (f) {
            new Effect.Move(f.element, {
                x: -e * 2,
                y: 0,
                duration: c * 2,
                afterFinishInternal: function (g) {
                    new Effect.Move(g.element, {
                        x: e * 2,
                        y: 0,
                        duration: c * 2,
                        afterFinishInternal: function (h) {
                            new Effect.Move(h.element, {
                                x: -e * 2,
                                y: 0,
                                duration: c * 2,
                                afterFinishInternal: function (k) {
                                    new Effect.Move(k.element, {
                                        x: e * 2,
                                        y: 0,
                                        duration: c * 2,
                                        afterFinishInternal: function (l) {
                                            new Effect.Move(l.element, {
                                                x: -e,
                                                y: 0,
                                                duration: c,
                                                afterFinishInternal: function (m) {
                                                    m.element.undoPositioned().setStyle(a)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
};
Effect.SlideDown = function (c) {
    c = $(c).cleanWhitespace();
    var a = c.down().getStyle("bottom");
    var b = c.getDimensions();
    return new Effect.Scale(c, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: window.opera ? 0 : 1,
        scaleMode: {
            originalHeight: b.height,
            originalWidth: b.width
        },
        restoreAfterFinish: true,
        afterSetup: function (d) {
            d.element.makePositioned();
            d.element.down().makePositioned();
            if (window.opera) {
                d.element.setStyle({
                    top: ""
                })
            }
            d.element.makeClipping().setStyle({
                height: "0px"
            }).show()
        },
        afterUpdateInternal: function (d) {
            d.element.down().setStyle({
                bottom: (d.dims[0] - d.element.clientHeight) + "px"
            })
        },
        afterFinishInternal: function (d) {
            d.element.undoClipping().undoPositioned();
            d.element.down().undoPositioned().setStyle({
                bottom: a
            })
        }
    }, arguments[1] || {}))
};
Effect.SlideUp = function (c) {
    c = $(c).cleanWhitespace();
    var a = c.down().getStyle("bottom");
    var b = c.getDimensions();
    return new Effect.Scale(c, window.opera ? 0 : 1, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleMode: "box",
        scaleFrom: 100,
        scaleMode: {
            originalHeight: b.height,
            originalWidth: b.width
        },
        restoreAfterFinish: true,
        afterSetup: function (d) {
            d.element.makePositioned();
            d.element.down().makePositioned();
            if (window.opera) {
                d.element.setStyle({
                    top: ""
                })
            }
            d.element.makeClipping().show()
        },
        afterUpdateInternal: function (d) {
            d.element.down().setStyle({
                bottom: (d.dims[0] - d.element.clientHeight) + "px"
            })
        },
        afterFinishInternal: function (d) {
            d.element.hide().undoClipping().undoPositioned();
            d.element.down().undoPositioned().setStyle({
                bottom: a
            })
        }
    }, arguments[1] || {}))
};
Effect.Squish = function (a) {
    return new Effect.Scale(a, window.opera ? 1 : 0, {
        restoreAfterFinish: true,
        beforeSetup: function (b) {
            b.element.makeClipping()
        },
        afterFinishInternal: function (b) {
            b.element.hide().undoClipping()
        }
    })
};
Effect.Grow = function (c) {
    c = $(c);
    var b = Object.extend({
        direction: "center",
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.full
    }, arguments[1] || {});
    var a = {
        top: c.style.top,
        left: c.style.left,
        height: c.style.height,
        width: c.style.width,
        opacity: c.getInlineOpacity()
    };
    var g = c.getDimensions();
    var h, f;
    var e, d;
    switch (b.direction) {
    case "top-left":
        h = f = e = d = 0;
        break;
    case "top-right":
        h = g.width;
        f = d = 0;
        e = -g.width;
        break;
    case "bottom-left":
        h = e = 0;
        f = g.height;
        d = -g.height;
        break;
    case "bottom-right":
        h = g.width;
        f = g.height;
        e = -g.width;
        d = -g.height;
        break;
    case "center":
        h = g.width / 2;
        f = g.height / 2;
        e = -g.width / 2;
        d = -g.height / 2;
        break
    }
    return new Effect.Move(c, {
        x: h,
        y: f,
        duration: 0.01,
        beforeSetup: function (k) {
            k.element.hide().makeClipping().makePositioned()
        },
        afterFinishInternal: function (k) {
            new Effect.Parallel([new Effect.Opacity(k.element, {
                sync: true,
                to: 1,
                from: 0,
                transition: b.opacityTransition
            }), new Effect.Move(k.element, {
                x: e,
                y: d,
                sync: true,
                transition: b.moveTransition
            }), new Effect.Scale(k.element, 100, {
                scaleMode: {
                    originalHeight: g.height,
                    originalWidth: g.width
                },
                sync: true,
                scaleFrom: window.opera ? 1 : 0,
                transition: b.scaleTransition,
                restoreAfterFinish: true
            })], Object.extend({
                beforeSetup: function (l) {
                    l.effects[0].element.setStyle({
                        height: "0px"
                    }).show()
                },
                afterFinishInternal: function (l) {
                    l.effects[0].element.undoClipping().undoPositioned().setStyle(a)
                }
            }, b))
        }
    })
};
Effect.Shrink = function (c) {
    c = $(c);
    var b = Object.extend({
        direction: "center",
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.none
    }, arguments[1] || {});
    var a = {
        top: c.style.top,
        left: c.style.left,
        height: c.style.height,
        width: c.style.width,
        opacity: c.getInlineOpacity()
    };
    var f = c.getDimensions();
    var e, d;
    switch (b.direction) {
    case "top-left":
        e = d = 0;
        break;
    case "top-right":
        e = f.width;
        d = 0;
        break;
    case "bottom-left":
        e = 0;
        d = f.height;
        break;
    case "bottom-right":
        e = f.width;
        d = f.height;
        break;
    case "center":
        e = f.width / 2;
        d = f.height / 2;
        break
    }
    return new Effect.Parallel([new Effect.Opacity(c, {
        sync: true,
        to: 0,
        from: 1,
        transition: b.opacityTransition
    }), new Effect.Scale(c, window.opera ? 1 : 0, {
        sync: true,
        transition: b.scaleTransition,
        restoreAfterFinish: true
    }), new Effect.Move(c, {
        x: e,
        y: d,
        sync: true,
        transition: b.moveTransition
    })], Object.extend({
        beforeStartInternal: function (g) {
            g.effects[0].element.makePositioned().makeClipping()
        },
        afterFinishInternal: function (g) {
            g.effects[0].element.hide().undoClipping().undoPositioned().setStyle(a)
        }
    }, b))
};
Effect.Pulsate = function (c) {
    c = $(c);
    var b = arguments[1] || {},
        a = c.getInlineOpacity(),
        e = b.transition || Effect.Transitions.linear,
        d = function (f) {
            return 1 - e((-Math.cos((f * (b.pulses || 5) * 2) * Math.PI) / 2) + 0.5)
        };
    return new Effect.Opacity(c, Object.extend(Object.extend({
        duration: 2,
        from: 0,
        afterFinishInternal: function (f) {
            f.element.setStyle({
                opacity: a
            })
        }
    }, b), {
        transition: d
    }))
};
Effect.Fold = function (b) {
    b = $(b);
    var a = {
        top: b.style.top,
        left: b.style.left,
        width: b.style.width,
        height: b.style.height
    };
    b.makeClipping();
    return new Effect.Scale(b, 5, Object.extend({
        scaleContent: false,
        scaleX: false,
        afterFinishInternal: function (c) {
            new Effect.Scale(b, 1, {
                scaleContent: false,
                scaleY: false,
                afterFinishInternal: function (d) {
                    d.element.hide().undoClipping().setStyle(a)
                }
            })
        }
    }, arguments[1] || {}))
};
Effect.Morph = Class.create(Effect.Base, {
    initialize: function (c) {
        this.element = $(c);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            style: {}
        }, arguments[1] || {});
        if (!Object.isString(a.style)) {
            this.style = $H(a.style)
        } else {
            if (a.style.include(":")) {
                this.style = a.style.parseStyle()
            } else {
                this.element.addClassName(a.style);
                this.style = $H(this.element.getStyles());
                this.element.removeClassName(a.style);
                var b = this.element.getStyles();
                this.style = this.style.reject(function (d) {
                    return d.value == b[d.key]
                });
                a.afterFinishInternal = function (d) {
                    d.element.addClassName(d.options.style);
                    d.transforms.each(function (e) {
                        d.element.style[e.style] = ""
                    })
                }
            }
        }
        this.start(a)
    },
    setup: function () {
        function a(b) {
            if (!b || ["rgba(0, 0, 0, 0)", "transparent"].include(b)) {
                b = "#ffffff"
            }
            b = b.parseColor();
            return $R(0, 2).map(function (c) {
                return parseInt(b.slice(c * 2 + 1, c * 2 + 3), 16)
            })
        }
        this.transforms = this.style.map(function (g) {
            var f = g[0],
                e = g[1],
                d = null;
            if (e.parseColor("#zzzzzz") != "#zzzzzz") {
                e = e.parseColor();
                d = "color"
            } else {
                if (f == "opacity") {
                    e = parseFloat(e);
                    if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) {
                        this.element.setStyle({
                            zoom: 1
                        })
                    }
                } else {
                    if (Element.CSS_LENGTH.test(e)) {
                        var c = e.match(/^([\+\-]?[0-9\.]+)(.*)$/);
                        e = parseFloat(c[1]);
                        d = (c.length == 3) ? c[2] : null
                    }
                }
            }
            var b = this.element.getStyle(f);
            return {
                style: f.camelize(),
                originalValue: d == "color" ? a(b) : parseFloat(b || 0),
                targetValue: d == "color" ? a(e) : e,
                unit: d
            }
        }.bind(this)).reject(function (b) {
            return ((b.originalValue == b.targetValue) || (b.unit != "color" && (isNaN(b.originalValue) || isNaN(b.targetValue))))
        })
    },
    update: function (a) {
        var d = {},
            b, c = this.transforms.length;
        while (c--) {
            d[(b = this.transforms[c]).style] = b.unit == "color" ? "#" + (Math.round(b.originalValue[0] + (b.targetValue[0] - b.originalValue[0]) * a)).toColorPart() + (Math.round(b.originalValue[1] + (b.targetValue[1] - b.originalValue[1]) * a)).toColorPart() + (Math.round(b.originalValue[2] + (b.targetValue[2] - b.originalValue[2]) * a)).toColorPart() : (b.originalValue + (b.targetValue - b.originalValue) * a).toFixed(3) + (b.unit === null ? "" : b.unit)
        }
        this.element.setStyle(d, true)
    }
});
Effect.Transform = Class.create({
    initialize: function (a) {
        this.tracks = [];
        this.options = arguments[1] || {};
        this.addTracks(a)
    },
    addTracks: function (a) {
        a.each(function (b) {
            b = $H(b);
            var c = b.values().first();
            this.tracks.push($H({
                ids: b.keys().first(),
                effect: Effect.Morph,
                options: {
                    style: c
                }
            }))
        }.bind(this));
        return this
    },
    play: function () {
        return new Effect.Parallel(this.tracks.map(function (a) {
            var d = a.get("ids"),
                c = a.get("effect"),
                b = a.get("options");
            var e = [$(d) || $$(d)].flatten();
            return e.map(function (f) {
                return new c(f, Object.extend({
                    sync: true
                }, b))
            })
        }).flatten(), this.options)
    }
});
Element.CSS_PROPERTIES = $w("backgroundColor backgroundPosition borderBottomColor borderBottomStyle borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderSpacing borderTopColor borderTopStyle borderTopWidth bottom clip color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop markerOffset maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex");
Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;
String.__parseStyleElement = document.createElement("div");
String.prototype.parseStyle = function () {
    var b, a = $H();
    if (Prototype.Browser.WebKit) {
        b = new Element("div", {
            style: this
        }).style
    } else {
        String.__parseStyleElement.innerHTML = '<div style="' + this + '"></div>';
        b = String.__parseStyleElement.childNodes[0].style
    }
    Element.CSS_PROPERTIES.each(function (c) {
        if (b[c]) {
            a.set(c, b[c])
        }
    });
    if (Prototype.Browser.IE && this.include("opacity")) {
        a.set("opacity", this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1])
    }
    return a
};
if (document.defaultView && document.defaultView.getComputedStyle) {
    Element.getStyles = function (b) {
        var a = document.defaultView.getComputedStyle($(b), null);
        return Element.CSS_PROPERTIES.inject({}, function (c, d) {
            c[d] = a[d];
            return c
        })
    }
} else {
    Element.getStyles = function (b) {
        b = $(b);
        var a = b.currentStyle,
            c;
        c = Element.CSS_PROPERTIES.inject({}, function (d, e) {
            d[e] = a[e];
            return d
        });
        if (!c.opacity) {
            c.opacity = b.getOpacity()
        }
        return c
    }
}
Effect.Methods = {
    morph: function (a, b) {
        a = $(a);
        new Effect.Morph(a, Object.extend({
            style: b
        }, arguments[2] || {}));
        return a
    },
    visualEffect: function (c, e, b) {
        c = $(c);
        var d = e.dasherize().camelize(),
            a = d.charAt(0).toUpperCase() + d.substring(1);
        new Effect[a](c, b);
        return c
    },
    highlight: function (b, a) {
        b = $(b);
        new Effect.Highlight(b, a);
        return b
    }
};
$w("fade appear grow shrink fold blindUp blindDown slideUp slideDown pulsate shake puff squish switchOff dropOut").each(function (a) {
    Effect.Methods[a] = function (c, b) {
        c = $(c);
        Effect[a.charAt(0).toUpperCase() + a.substring(1)](c, b);
        return c
    }
});
$w("getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles").each(function (a) {
    Effect.Methods[a] = Element[a]
});
Element.addMethods(Effect.Methods);
if (typeof Effect == "undefined") {
    throw ("controls.js requires including script.aculo.us' effects.js library")
}
var Autocompleter = {};
Autocompleter.Base = Class.create({
    baseInitialize: function (b, c, a) {
        b = $(b);
        this.element = b;
        this.update = $(c);
        this.hasFocus = false;
        this.changed = false;
        this.active = false;
        this.index = 0;
        this.entryCount = 0;
        this.oldElementValue = this.element.value;
        if (this.setOptions) {
            this.setOptions(a)
        } else {
            this.options = a || {}
        }
        this.options.paramName = this.options.paramName || this.element.name;
        this.options.tokens = this.options.tokens || [];
        this.options.frequency = this.options.frequency || 0.4;
        this.options.minChars = this.options.minChars || 1;
        this.options.onShow = this.options.onShow ||
        function (d, e) {
            if (!e.style.position || e.style.position == "absolute") {
                e.style.position = "absolute";
                Position.clone(d, e, {
                    setHeight: false,
                    offsetTop: d.offsetHeight - 1
                })
            }
            Effect.Appear(e, {
                duration: 0.15
            })
        };
        this.options.onHide = this.options.onHide ||
        function (d, e) {
            new Effect.Fade(e, {
                duration: 0.15
            })
        };
        if (typeof (this.options.tokens) == "string") {
            this.options.tokens = new Array(this.options.tokens)
        }
        if (!this.options.tokens.include("\n")) {
            this.options.tokens.push("\n")
        }
        this.observer = null;
        this.element.setAttribute("autocomplete", "off");
        Element.hide(this.update);
        Event.observe(this.element, "blur", this.onBlur.bindAsEventListener(this));
        Event.observe(this.element, "keydown", this.onKeyPress.bindAsEventListener(this))
    },
    show: function () {
        if (Element.getStyle(this.update, "display") == "none") {
            this.options.onShow(this.element, this.update)
        }
        if (!this.iefix && (Prototype.Browser.IE) && (Element.getStyle(this.update, "position") == "absolute")) {
            new Insertion.After(this.update, '<iframe id="' + this.update.id + '_iefix" style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
            this.iefix = $(this.update.id + "_iefix")
        }
        if (this.iefix) {
            setTimeout(this.fixIEOverlapping.bind(this), 50)
        }
    },
    fixIEOverlapping: function () {
        Position.clone(this.update, this.iefix, {
            setTop: (!this.update.style.height)
        });
        this.iefix.style.zIndex = 1;
        this.update.style.zIndex = 2;
        Element.show(this.iefix)
    },
    hide: function () {
        this.stopIndicator();
        if (Element.getStyle(this.update, "display") != "none") {
            this.options.onHide(this.element, this.update)
        }
        if (this.iefix) {
            Element.hide(this.iefix)
        }
    },
    startIndicator: function () {
        if (this.options.indicator) {
            Element.show(this.options.indicator)
        }
    },
    stopIndicator: function () {
        if (this.options.indicator) {
            Element.hide(this.options.indicator)
        }
    },
    onKeyPress: function (a) {
        this.onObserverEvent();
        if (this.active) {
            switch (a.keyCode) {
            case Event.KEY_TAB:
            case Event.KEY_RETURN:
                this.selectEntry();
                Event.stop(a);
            case Event.KEY_ESC:
                this.hide();
                this.active = false;
                Event.stop(a);
                return;
            case Event.KEY_LEFT:
            case Event.KEY_RIGHT:
                return;
            case Event.KEY_UP:
                this.markPrevious();
                this.render();
                Event.stop(a);
                return;
            case Event.KEY_DOWN:
                this.markNext();
                this.render();
                Event.stop(a);
                return
            }
        } else {
            if (a.keyCode == Event.KEY_TAB || a.keyCode == Event.KEY_RETURN || (Prototype.Browser.WebKit > 0 && a.keyCode == 0)) {
                return
            }
        }
        this.changed = true;
        this.hasFocus = true;
        if (this.observer) {
            clearTimeout(this.observer)
        }
        this.observer = setTimeout(this.onObserverEvent.bind(this), this.options.frequency * 1000)
    },
    activate: function () {
        this.changed = false;
        this.hasFocus = true;
        this.getUpdatedChoices()
    },
    onHover: function (b) {
        var a = Event.findElement(b, "LI");
        if (this.index != a.autocompleteIndex) {
            this.index = a.autocompleteIndex;
            this.render()
        }
        Event.stop(b)
    },
    onClick: function (b) {
        var a = Event.findElement(b, "LI");
        this.index = a.autocompleteIndex;
        this.selectEntry();
        this.hide()
    },
    onBlur: function (a) {
        setTimeout(this.hide.bind(this), 250);
        this.hasFocus = false;
        this.active = false
    },
    render: function () {
        if (this.entryCount > 0) {
            for (var a = 0; a < this.entryCount; a++) {
                this.index == a ? Element.addClassName(this.getEntry(a), "selected") : Element.removeClassName(this.getEntry(a), "selected")
            }
            if (this.hasFocus) {
                this.show();
                this.active = true
            }
        } else {
            this.active = false;
            this.hide()
        }
    },
    markPrevious: function () {
        if (this.index > 0) {
            this.index--
        } else {
            this.index = this.entryCount - 1
        }
        this.getEntry(this.index)
    },
    markNext: function () {
        if (this.index < this.entryCount - 1) {
            this.index++
        } else {
            this.index = 0
        }
        this.getEntry(this.index)
    },
    getEntry: function (a) {
        return this.update.firstChild.childNodes[a]
    },
    getCurrentEntry: function () {
        return this.getEntry(this.index)
    },
    selectEntry: function () {
        this.active = false;
        this.updateElement(this.getCurrentEntry());
        this.index = 0
    },
    updateElement: function (f) {
        if (this.options.updateElement) {
            this.options.updateElement(f);
            return
        }
        var d = "";
        if (this.options.select) {
            var a = $(f).select("." + this.options.select) || [];
            if (a.length > 0) {
                d = Element.collectTextNodes(a[0], this.options.select)
            }
        } else {
            d = Element.collectTextNodesIgnoreClass(f, "informal")
        }
        var c = this.getTokenBounds();
        if (c[0] != -1) {
            var e = this.element.value.substr(0, c[0]);
            var b = this.element.value.substr(c[0]).match(/^\s+/);
            if (b) {
                e += b[0]
            }
            this.element.value = e + d + this.element.value.substr(c[1])
        } else {
            this.element.value = d
        }
        this.oldElementValue = this.element.value;
        this.element.focus();
        if (this.options.afterUpdateElement) {
            this.options.afterUpdateElement(this.element, f)
        }
    },
    updateChoices: function (c) {
        if (!this.changed && this.hasFocus) {
            this.update.innerHTML = c;
            Element.cleanWhitespace(this.update);
            Element.cleanWhitespace(this.update.down());
            if (this.update.firstChild && this.update.down().childNodes) {
                this.entryCount = this.update.down().childNodes.length;
                for (var a = 0; a < this.entryCount; a++) {
                    var b = this.getEntry(a);
                    b.autocompleteIndex = a;
                    this.addObservers(b)
                }
                if (this.index >= this.entryCount) {
                    this.index = 0
                }
            } else {
                this.entryCount = 0
            }
            this.stopIndicator();
            if (this.entryCount == 1 && this.options.autoSelect) {
                this.selectEntry();
                this.hide()
            } else {
                this.render()
            }
        }
    },
    addObservers: function (a) {
        Event.observe(a, "mouseover", this.onHover.bindAsEventListener(this));
        Event.observe(a, "click", this.onClick.bindAsEventListener(this))
    },
    onObserverEvent: function () {
        this.changed = false;
        this.tokenBounds = null;
        if (this.getToken().length >= this.options.minChars) {
            this.getUpdatedChoices()
        } else {
            this.active = false;
            this.hide()
        }
        this.oldElementValue = this.element.value
    },
    getToken: function () {
        var a = this.getTokenBounds();
        return this.element.value.substring(a[0], a[1]).strip()
    },
    getTokenBounds: function () {
        if (null != this.tokenBounds) {
            return this.tokenBounds
        }
        var e = this.element.value;
        if (e.strip().empty()) {
            return [-1, 0]
        }
        var f = arguments.callee.getFirstDifferencePos(e, this.oldElementValue);
        var h = (f == this.oldElementValue.length ? 1 : 0);
        var d = -1,
            c = e.length;
        var g;
        for (var b = 0, a = this.options.tokens.length; b < a; ++b) {
            g = e.lastIndexOf(this.options.tokens[b], f + h - 1);
            if (g > d) {
                d = g
            }
            g = e.indexOf(this.options.tokens[b], f + h);
            if (-1 != g && g < c) {
                c = g
            }
        }
        return (this.tokenBounds = [d + 1, c])
    }
});
Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos = function (c, a) {
    var d = Math.min(c.length, a.length);
    for (var b = 0; b < d; ++b) {
        if (c[b] != a[b]) {
            return b
        }
    }
    return d
};
Ajax.Autocompleter = Class.create(Autocompleter.Base, {
    initialize: function (c, d, b, a) {
        this.baseInitialize(c, d, a);
        this.options.asynchronous = true;
        this.options.onComplete = this.onComplete.bind(this);
        this.options.defaultParams = this.options.parameters || null;
        this.url = b
    },
    getUpdatedChoices: function () {
        this.startIndicator();
        var a = encodeURIComponent(this.options.paramName) + "=" + encodeURIComponent(this.getToken());
        this.options.parameters = this.options.callback ? this.options.callback(this.element, a) : a;
        if (this.options.defaultParams) {
            this.options.parameters += "&" + this.options.defaultParams
        }
        new Ajax.Request(this.url, this.options)
    },
    onComplete: function (a) {
        this.updateChoices(a.responseText)
    }
});
Autocompleter.Local = Class.create(Autocompleter.Base, {
    initialize: function (b, d, c, a) {
        this.baseInitialize(b, d, a);
        this.options.array = c
    },
    getUpdatedChoices: function () {
        this.updateChoices(this.options.selector(this))
    },
    setOptions: function (a) {
        this.options = Object.extend({
            choices: 10,
            partialSearch: true,
            partialChars: 2,
            ignoreCase: true,
            fullSearch: false,
            selector: function (b) {
                var d = [];
                var c = [];
                var h = b.getToken();
                var g = 0;
                for (var e = 0; e < b.options.array.length && d.length < b.options.choices; e++) {
                    var f = b.options.array[e];
                    var k = b.options.ignoreCase ? f.toLowerCase().indexOf(h.toLowerCase()) : f.indexOf(h);
                    while (k != -1) {
                        if (k == 0 && f.length != h.length) {
                            d.push("<li><strong>" + f.substr(0, h.length) + "</strong>" + f.substr(h.length) + "</li>");
                            break
                        } else {
                            if (h.length >= b.options.partialChars && b.options.partialSearch && k != -1) {
                                if (b.options.fullSearch || /\s/.test(f.substr(k - 1, 1))) {
                                    c.push("<li>" + f.substr(0, k) + "<strong>" + f.substr(k, h.length) + "</strong>" + f.substr(k + h.length) + "</li>");
                                    break
                                }
                            }
                        }
                        k = b.options.ignoreCase ? f.toLowerCase().indexOf(h.toLowerCase(), k + 1) : f.indexOf(h, k + 1)
                    }
                }
                if (c.length) {
                    d = d.concat(c.slice(0, b.options.choices - d.length))
                }
                return "<ul>" + d.join("") + "</ul>"
            }
        }, a || {})
    }
});
Field.scrollFreeActivate = function (a) {
    setTimeout(function () {
        Field.activate(a)
    }, 1)
};
Ajax.InPlaceEditor = Class.create({
    initialize: function (c, b, a) {
        this.url = b;
        this.element = c = $(c);
        this.prepareOptions();
        this._controls = {};
        arguments.callee.dealWithDeprecatedOptions(a);
        Object.extend(this.options, a || {});
        if (!this.options.formId && this.element.id) {
            this.options.formId = this.element.id + "-inplaceeditor";
            if ($(this.options.formId)) {
                this.options.formId = ""
            }
        }
        if (this.options.externalControl) {
            this.options.externalControl = $(this.options.externalControl)
        }
        if (!this.options.externalControl) {
            this.options.externalControlOnly = false
        }
        this._originalBackground = this.element.getStyle("background-color") || "transparent";
        this.element.title = this.options.clickToEditText;
        this._boundCancelHandler = this.handleFormCancellation.bind(this);
        this._boundComplete = (this.options.onComplete || Prototype.emptyFunction).bind(this);
        this._boundFailureHandler = this.handleAJAXFailure.bind(this);
        this._boundSubmitHandler = this.handleFormSubmission.bind(this);
        this._boundWrapperHandler = this.wrapUp.bind(this);
        this._keyHandler = this.checkForEscapeOrReturn.bind(this);
        if (this.options.clickToEdit) {
            this.registerListeners()
        }
    },
    checkForEscapeOrReturn: function (a) {
        if (!this._editing || a.ctrlKey || a.altKey || a.shiftKey) {
            return
        }
        if (Event.KEY_ESC == a.keyCode) {
            this.handleFormCancellation(a)
        } else {
            if (Event.KEY_RETURN == a.keyCode) {
                this.handleFormSubmission(a)
            }
        }
    },
    createControl: function (g, c, b) {
        var e = this.options[g + "Control"];
        var f = this.options[g + "Text"];
        if ("button" == e) {
            var a = document.createElement("input");
            a.type = "submit";
            a.value = f;
            a.className = "editor_" + g + "_button";
            if ("cancel" == g) {
                a.onclick = this._boundCancelHandler
            }
            this._form.appendChild(a);
            this._controls[g] = a
        } else {
            if ("link" == e) {
                var d = document.createElement("a");
                d.href = "#";
                d.appendChild(document.createTextNode(f));
                d.onclick = "cancel" == g ? this._boundCancelHandler : this._boundSubmitHandler;
                d.className = "editor_" + g + "_link";
                if (b) {
                    d.className += " " + b
                }
                this._form.appendChild(d);
                this._controls[g] = d
            }
        }
    },
    createEditField: function () {
        var c = (this.options.loadTextURL ? this.options.loadingText : this.getText());
        var b;
        if (1 >= this.options.rows && !/\r|\n/.test(this.getText())) {
            b = document.createElement("input");
            b.type = "text";
            var a = this.options.size || this.options.cols || 0;
            if (0 < a) {
                b.size = a
            }
        } else {
            b = document.createElement("textarea");
            b.rows = (1 >= this.options.rows ? this.options.autoRows : this.options.rows);
            b.cols = this.options.cols || 40
        }
        b.name = this.options.paramName;
        this.initialValue = this.options.initialText || c;
        b.value = this.initialValue;
        b.className = "editor_field";
        if (this.options.submitOnBlur) {
            b.onblur = this._boundSubmitHandler
        }
        Event.observe(b, "keydown", this._keyHandler);
        this._controls.editor = b;
        if (this.options.loadTextURL) {
            this.loadExternalText()
        }
        this._form.appendChild(this._controls.editor)
    },
    createForm: function () {
        var b = this;

        function a(d, e) {
            var c = b.options["text" + d + "Controls"];
            if (!c || e === false) {
                return
            }
            b._form.appendChild(document.createTextNode(c))
        }
        this._form = $(document.createElement("form"));
        this._form.id = this.options.formId;
        this._form.addClassName(this.options.formClassName);
        this._form.onsubmit = this._boundSubmitHandler;
        this.createEditField();
        if ("textarea" == this._controls.editor.tagName.toLowerCase()) {
            this._form.appendChild(document.createElement("br"))
        }
        if (this.options.onFormCustomization) {
            this.options.onFormCustomization(this, this._form)
        }
        a("Before", this.options.okControl || this.options.cancelControl);
        this.createControl("ok", this._boundSubmitHandler);
        a("Between", this.options.okControl && this.options.cancelControl);
        this.createControl("cancel", this._boundCancelHandler, "editor_cancel");
        a("After", this.options.okControl || this.options.cancelControl)
    },
    destroy: function () {
        if (this._oldInnerHTML) {
            this.element.innerHTML = this._oldInnerHTML
        }
        this.leaveEditMode();
        this.unregisterListeners()
    },
    enterEditMode: function (a) {
        if (this._saving || this._editing) {
            return
        }
        this._editing = true;
        this.triggerCallback("onEnterEditMode");
        if (this.options.externalControl) {
            this.options.externalControl.hide()
        }
        this.element.hide();
        this.createForm();
        this.element.parentNode.insertBefore(this._form, this.element);
        if (!this.options.loadTextURL) {
            this.postProcessEditField()
        }
        if (a) {
            Event.stop(a)
        }
    },
    enterHover: function (a) {
        if (this.options.hoverClassName) {
            this.element.addClassName(this.options.hoverClassName)
        }
        if (this._saving) {
            return
        }
        this.triggerCallback("onEnterHover")
    },
    getText: function () {
        return this.element.innerHTML.unescapeHTML()
    },
    handleAJAXFailure: function (a) {
        this.triggerCallback("onFailure", a);
        if (this._oldInnerHTML) {
            this.element.innerHTML = this._oldInnerHTML;
            this._oldInnerHTML = null
        }
    },
    handleFormCancellation: function (a) {
        if (this._handling_form) {
            return
        }
        this._handling_form = true;
        this.wrapUp();
        if (a) {
            Event.stop(a)
        }
        this._handling_form = false
    },
    handleFormSubmission: function (c, g) {
        if (this._handling_form) {
            return
        }
        var d = this._form;
        var f = $F(this._controls.editor);
        if (this.options.cancelIfSame && (f === this.initialValue)) {
            this.handleFormCancellation(g);
            return
        }
        this._handling_form = true;
        this.prepareSubmission();
        var h = this.options.callback(d, f) || "";
        if (Object.isString(h)) {
            h = h.toQueryParams()
        }
        h.editorId = this.element.id;
        if (this.options.htmlResponse) {
            var b = Object.extend({
                evalScripts: true
            }, this.options.ajaxOptions);
            Object.extend(b, {
                parameters: h,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            new Ajax.Updater({
                success: this.element
            }, this.url, b)
        } else {
            var b = Object.extend({
                method: "get"
            }, this.options.ajaxOptions);
            Object.extend(b, {
                parameters: h,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            var a = this.options.ajaxClass || Ajax.Request;
            new a(this.url, b)
        }
        if (g) {
            Event.stop(g)
        }
        this._handling_form = false;
        return false
    },
    leaveEditMode: function () {
        this.element.removeClassName(this.options.savingClassName);
        this.removeForm();
        this.leaveHover();
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show();
        if (this.options.externalControl) {
            this.options.externalControl.show()
        }
        this._saving = false;
        this._editing = false;
        this._oldInnerHTML = null;
        this.triggerCallback("onLeaveEditMode")
    },
    leaveHover: function (a) {
        if (this.options.hoverClassName) {
            this.element.removeClassName(this.options.hoverClassName)
        }
        if (this._saving) {
            return
        }
        this.triggerCallback("onLeaveHover")
    },
    loadExternalText: function () {
        this._form.addClassName(this.options.loadingClassName);
        this._controls.editor.disabled = true;
        var a = Object.extend({
            method: "get"
        }, this.options.ajaxOptions);
        Object.extend(a, {
            parameters: "editorId=" + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (c) {
                this._form.removeClassName(this.options.loadingClassName);
                var b = c.responseText;
                if (this.options.stripLoadedTextTags) {
                    b = b.stripTags()
                }
                this._controls.editor.value = b;
                this._controls.editor.disabled = false;
                this.postProcessEditField()
            }.bind(this),
            onFailure: this._boundFailureHandler
        });
        new Ajax.Request(this.options.loadTextURL, a)
    },
    postProcessEditField: function () {
        var a = this.options.fieldPostCreation;
        if (a) {
            $(this._controls.editor)["focus" == a ? "focus" : "activate"]()
        }
    },
    prepareOptions: function () {
        this.options = Object.clone(Ajax.InPlaceEditor.DefaultOptions);
        Object.extend(this.options, Ajax.InPlaceEditor.DefaultCallbacks);
        [this._extraDefaultOptions].flatten().compact().each(function (a) {
            Object.extend(this.options, a)
        }.bind(this))
    },
    prepareSubmission: function () {
        this._saving = true;
        this.removeForm();
        this.leaveHover();
        this.showSaving()
    },
    registerListeners: function () {
        this._listeners = {};
        var a;
        $H(Ajax.InPlaceEditor.Listeners).each(function (b) {
            a = this[b.value].bind(this);
            this._listeners[b.key] = a;
            if (!this.options.externalControlOnly) {
                this.element.observe(b.key, a)
            }
            if (this.options.externalControl) {
                this.options.externalControl.observe(b.key, a)
            }
        }.bind(this))
    },
    removeForm: function () {
        if (!this._form) {
            return
        }
        this._form.remove();
        this._form = null;
        this._controls = {}
    },
    showSaving: function () {
        this._oldInnerHTML = this.element.innerHTML;
        this.element.innerHTML = this.options.savingText;
        this.element.addClassName(this.options.savingClassName);
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show()
    },
    triggerCallback: function (b, a) {
        if ("function" == typeof this.options[b]) {
            this.options[b](this, a)
        }
    },
    unregisterListeners: function () {
        $H(this._listeners).each(function (a) {
            if (!this.options.externalControlOnly) {
                this.element.stopObserving(a.key, a.value)
            }
            if (this.options.externalControl) {
                this.options.externalControl.stopObserving(a.key, a.value)
            }
        }.bind(this))
    },
    wrapUp: function (a) {
        this.leaveEditMode();
        this._boundComplete(a, this.element)
    }
});
Object.extend(Ajax.InPlaceEditor.prototype, {
    dispose: Ajax.InPlaceEditor.prototype.destroy
});
Ajax.InPlaceCollectionEditor = Class.create(Ajax.InPlaceEditor, {
    initialize: function ($super, c, b, a) {
        this._extraDefaultOptions = Ajax.InPlaceCollectionEditor.DefaultOptions;
        $super(c, b, a)
    },
    createEditField: function () {
        var a = document.createElement("select");
        a.name = this.options.paramName;
        a.size = 1;
        this._controls.editor = a;
        this._collection = this.options.collection || [];
        if (this.options.loadCollectionURL) {
            this.loadCollection()
        } else {
            this.checkForExternalText()
        }
        this._form.appendChild(this._controls.editor)
    },
    loadCollection: function () {
        this._form.addClassName(this.options.loadingClassName);
        this.showLoadingText(this.options.loadingCollectionText);
        var options = Object.extend({
            method: "get"
        }, this.options.ajaxOptions);
        Object.extend(options, {
            parameters: "editorId=" + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (transport) {
                var js = transport.responseText.strip();
                if (!/^\[.*\]$/.test(js)) {
                    throw ("Server returned an invalid collection representation.")
                }
                this._collection = eval(js);
                this.checkForExternalText()
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadCollectionURL, options)
    },
    showLoadingText: function (b) {
        this._controls.editor.disabled = true;
        var a = this._controls.editor.firstChild;
        if (!a) {
            a = document.createElement("option");
            a.value = "";
            this._controls.editor.appendChild(a);
            a.selected = true
        }
        a.update((b || "").stripScripts().stripTags())
    },
    checkForExternalText: function () {
        this._text = this.getText();
        if (this.options.loadTextURL) {
            this.loadExternalText()
        } else {
            this.buildOptionList()
        }
    },
    loadExternalText: function () {
        this.showLoadingText(this.options.loadingText);
        var a = Object.extend({
            method: "get"
        }, this.options.ajaxOptions);
        Object.extend(a, {
            parameters: "editorId=" + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (b) {
                this._text = b.responseText.strip();
                this.buildOptionList()
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadTextURL, a)
    },
    buildOptionList: function () {
        this._form.removeClassName(this.options.loadingClassName);
        this._collection = this._collection.map(function (d) {
            return 2 === d.length ? d : [d, d].flatten()
        });
        var b = ("value" in this.options) ? this.options.value : this._text;
        var a = this._collection.any(function (d) {
            return d[0] == b
        }.bind(this));
        this._controls.editor.update("");
        var c;
        this._collection.each(function (e, d) {
            c = document.createElement("option");
            c.value = e[0];
            c.selected = a ? e[0] == b : 0 == d;
            c.appendChild(document.createTextNode(e[1]));
            this._controls.editor.appendChild(c)
        }.bind(this));
        this._controls.editor.disabled = false;
        Field.scrollFreeActivate(this._controls.editor)
    }
});
Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions = function (a) {
    if (!a) {
        return
    }
    function b(c, d) {
        if (c in a || d === undefined) {
            return
        }
        a[c] = d
    }
    b("cancelControl", (a.cancelLink ? "link" : (a.cancelButton ? "button" : a.cancelLink == a.cancelButton == false ? false : undefined)));
    b("okControl", (a.okLink ? "link" : (a.okButton ? "button" : a.okLink == a.okButton == false ? false : undefined)));
    b("highlightColor", a.highlightcolor);
    b("highlightEndColor", a.highlightendcolor)
};
Object.extend(Ajax.InPlaceEditor, {
    DefaultOptions: {
        ajaxOptions: {},
        autoRows: 3,
        cancelControl: "link",
        cancelIfSame: false,
        cancelText: "cancel",
        clickToEdit: true,
        clickToEditText: "Click to edit",
        externalControl: null,
        externalControlOnly: false,
        fieldPostCreation: "activate",
        formClassName: "inplaceeditor-form",
        formId: null,
        highlightColor: "#ffff99",
        highlightEndColor: "#ffffff",
        hoverClassName: "",
        htmlResponse: true,
        initialText: "",
        loadingClassName: "inplaceeditor-loading",
        loadingText: "Loading...",
        okControl: "button",
        okText: "ok",
        paramName: "value",
        rows: 1,
        savingClassName: "inplaceeditor-saving",
        savingText: "Saving...",
        size: 0,
        stripLoadedTextTags: false,
        submitOnBlur: false,
        textAfterControls: "",
        textBeforeControls: "",
        textBetweenControls: ""
    },
    DefaultCallbacks: {
        callback: function (a) {
            return Form.serialize(a)
        },
        onComplete: function (b, a) {
            new Effect.Highlight(a, {
                startcolor: this.options.highlightColor,
                keepBackgroundImage: true
            })
        },
        onEnterEditMode: null,
        onEnterHover: function (a) {
            a.element.style.backgroundColor = a.options.highlightColor;
            if (a._effect) {
                a._effect.cancel()
            }
        },
        onFailure: function (b, a) {
            alert("Error communication with the server: " + b.responseText.stripTags())
        },
        onFormCustomization: null,
        onLeaveEditMode: null,
        onLeaveHover: function (a) {
            a._effect = new Effect.Highlight(a.element, {
                startcolor: a.options.highlightColor,
                endcolor: a.options.highlightEndColor,
                restorecolor: a._originalBackground,
                keepBackgroundImage: true
            })
        }
    },
    Listeners: {
        click: "enterEditMode",
        keydown: "checkForEscapeOrReturn",
        mouseover: "enterHover",
        mouseout: "leaveHover"
    }
});
Ajax.InPlaceCollectionEditor.DefaultOptions = {
    loadingCollectionText: "Loading options..."
};
Form.Element.DelayedObserver = Class.create({
    initialize: function (b, a, c) {
        this.delay = a || 0.5;
        this.element = $(b);
        this.callback = c;
        this.timer = null;
        this.lastValue = $F(this.element);
        Event.observe(this.element, "keyup", this.delayedListener.bindAsEventListener(this))
    },
    delayedListener: function (a) {
        if (this.lastValue == $F(this.element)) {
            return
        }
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(this.onTimerEvent.bind(this), this.delay * 1000);
        this.lastValue = $F(this.element)
    },
    onTimerEvent: function () {
        this.timer = null;
        this.callback(this.element, $F(this.element))
    }
});
var Builder = {
    NODEMAP: {
        AREA: "map",
        CAPTION: "table",
        COL: "table",
        COLGROUP: "table",
        LEGEND: "fieldset",
        OPTGROUP: "select",
        OPTION: "select",
        PARAM: "object",
        TBODY: "table",
        TD: "table",
        TFOOT: "table",
        TH: "table",
        THEAD: "table",
        TR: "table"
    },
    node: function (a) {
        a = a.toUpperCase();
        var g = this.NODEMAP[a] || "div";
        var b = document.createElement(g);
        try {
            b.innerHTML = "<" + a + "></" + a + ">"
        } catch (f) {}
        var d = b.firstChild || null;
        if (d && (d.tagName.toUpperCase() != a)) {
            d = d.getElementsByTagName(a)[0]
        }
        if (!d) {
            d = document.createElement(a)
        }
        if (!d) {
            return
        }
        if (arguments[1]) {
            if (this._isStringOrNumber(arguments[1]) || (arguments[1] instanceof Array) || arguments[1].tagName) {
                this._children(d, arguments[1])
            } else {
                var c = this._attributes(arguments[1]);
                if (c.length) {
                    try {
                        b.innerHTML = "<" + a + " " + c + "></" + a + ">"
                    } catch (f) {}
                    d = b.firstChild || null;
                    if (!d) {
                        d = document.createElement(a);
                        for (attr in arguments[1]) {
                            d[attr == "class" ? "className" : attr] = arguments[1][attr]
                        }
                    }
                    if (d.tagName.toUpperCase() != a) {
                        d = b.getElementsByTagName(a)[0]
                    }
                }
            }
        }
        if (arguments[2]) {
            this._children(d, arguments[2])
        }
        return $(d)
    },
    _text: function (a) {
        return document.createTextNode(a)
    },
    ATTR_MAP: {
        className: "class",
        htmlFor: "for"
    },
    _attributes: function (a) {
        var b = [];
        for (attribute in a) {
            b.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) + '="' + a[attribute].toString().escapeHTML().gsub(/"/, "&quot;") + '"')
        }
        return b.join(" ")
    },
    _children: function (b, a) {
        if (a.tagName) {
            b.appendChild(a);
            return
        }
        if (typeof a == "object") {
            a.flatten().each(function (c) {
                if (typeof c == "object") {
                    b.appendChild(c)
                } else {
                    if (Builder._isStringOrNumber(c)) {
                        b.appendChild(Builder._text(c))
                    }
                }
            })
        } else {
            if (Builder._isStringOrNumber(a)) {
                b.appendChild(Builder._text(a))
            }
        }
    },
    _isStringOrNumber: function (a) {
        return (typeof a == "string" || typeof a == "number")
    },
    build: function (b) {
        var a = this.node("div");
        $(a).update(b.strip());
        return a.down()
    },
    dump: function (b) {
        if (typeof b != "object" && typeof b != "function") {
            b = window
        }
        var a = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
        a.each(function (c) {
            b[c] = function () {
                return Builder.node.apply(Builder, [c].concat($A(arguments)))
            }
        })
    }
};
if (!Control) {
    var Control = {}
}
Control.Slider = Class.create({
    initialize: function (d, a, b) {
        var c = this;
        if (Object.isArray(d)) {
            this.handles = d.collect(function (f) {
                return $(f)
            })
        } else {
            this.handles = [$(d)]
        }
        this.track = $(a);
        this.options = b || {};
        this.axis = this.options.axis || "horizontal";
        this.increment = this.options.increment || 1;
        this.step = parseInt(this.options.step || "1");
        this.range = this.options.range || $R(0, 1);
        this.value = 0;
        this.values = this.handles.map(function () {
            return 0
        });
        this.spans = this.options.spans ? this.options.spans.map(function (e) {
            return $(e)
        }) : false;
        this.options.startSpan = $(this.options.startSpan || null);
        this.options.endSpan = $(this.options.endSpan || null);
        this.restricted = this.options.restricted || false;
        this.maximum = this.options.maximum || this.range.end;
        this.minimum = this.options.minimum || this.range.start;
        this.alignX = parseInt(this.options.alignX || "0");
        this.alignY = parseInt(this.options.alignY || "0");
        this.trackLength = this.maximumOffset() - this.minimumOffset();
        this.handleLength = this.isVertical() ? (this.handles[0].offsetHeight != 0 ? this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/, "")) : (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth : this.handles[0].style.width.replace(/px$/, ""));
        this.active = false;
        this.dragging = false;
        this.disabled = false;
        if (this.options.disabled) {
            this.setDisabled()
        }
        this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
        if (this.allowedValues) {
            this.minimum = this.allowedValues.min();
            this.maximum = this.allowedValues.max()
        }
        this.eventMouseDown = this.startDrag.bindAsEventListener(this);
        this.eventMouseUp = this.endDrag.bindAsEventListener(this);
        this.eventMouseMove = this.update.bindAsEventListener(this);
        this.handles.each(function (f, e) {
            e = c.handles.length - 1 - e;
            c.setValue(parseFloat((Object.isArray(c.options.sliderValue) ? c.options.sliderValue[e] : c.options.sliderValue) || c.range.start), e);
            f.makePositioned().observe("mousedown", c.eventMouseDown)
        });
        this.track.observe("mousedown", this.eventMouseDown);
        document.observe("mouseup", this.eventMouseUp);
        document.observe("mousemove", this.eventMouseMove);
        this.initialized = true
    },
    dispose: function () {
        var a = this;
        Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
        Event.stopObserving(document, "mouseup", this.eventMouseUp);
        Event.stopObserving(document, "mousemove", this.eventMouseMove);
        this.handles.each(function (b) {
            Event.stopObserving(b, "mousedown", a.eventMouseDown)
        })
    },
    setDisabled: function () {
        this.disabled = true
    },
    setEnabled: function () {
        this.disabled = false
    },
    getNearestValue: function (a) {
        if (this.allowedValues) {
            if (a >= this.allowedValues.max()) {
                return (this.allowedValues.max())
            }
            if (a <= this.allowedValues.min()) {
                return (this.allowedValues.min())
            }
            var c = Math.abs(this.allowedValues[0] - a);
            var b = this.allowedValues[0];
            this.allowedValues.each(function (d) {
                var e = Math.abs(d - a);
                if (e <= c) {
                    b = d;
                    c = e
                }
            });
            return b
        }
        if (a > this.range.end) {
            return this.range.end
        }
        if (a < this.range.start) {
            return this.range.start
        }
        return a
    },
    setValue: function (b, a) {
        if (!this.active) {
            this.activeHandleIdx = a || 0;
            this.activeHandle = this.handles[this.activeHandleIdx];
            this.updateStyles()
        }
        a = a || this.activeHandleIdx || 0;
        if (this.initialized && this.restricted) {
            if ((a > 0) && (b < this.values[a - 1])) {
                b = this.values[a - 1]
            }
            if ((a < (this.handles.length - 1)) && (b > this.values[a + 1])) {
                b = this.values[a + 1]
            }
        }
        b = this.getNearestValue(b);
        this.values[a] = b;
        this.value = this.values[0];
        this.handles[a].style[this.isVertical() ? "top" : "left"] = this.translateToPx(b);
        this.drawSpans();
        if (!this.dragging || !this.event) {
            this.updateFinished()
        }
    },
    setValueBy: function (b, a) {
        this.setValue(this.values[a || this.activeHandleIdx || 0] + b, a || this.activeHandleIdx || 0)
    },
    translateToPx: function (a) {
        return Math.round(((this.trackLength - this.handleLength) / (this.range.end - this.range.start)) * (a - this.range.start)) + "px"
    },
    translateToValue: function (a) {
        return ((a / (this.trackLength - this.handleLength) * (this.range.end - this.range.start)) + this.range.start)
    },
    getRange: function (b) {
        var a = this.values.sortBy(Prototype.K);
        b = b || 0;
        return $R(a[b], a[b + 1])
    },
    minimumOffset: function () {
        return (this.isVertical() ? this.alignY : this.alignX)
    },
    maximumOffset: function () {
        return (this.isVertical() ? (this.track.offsetHeight != 0 ? this.track.offsetHeight : this.track.style.height.replace(/px$/, "")) - this.alignY : (this.track.offsetWidth != 0 ? this.track.offsetWidth : this.track.style.width.replace(/px$/, "")) - this.alignX)
    },
    isVertical: function () {
        return (this.axis == "vertical")
    },
    drawSpans: function () {
        var a = this;
        if (this.spans) {
            $R(0, this.spans.length - 1).each(function (b) {
                a.setSpan(a.spans[b], a.getRange(b))
            })
        }
        if (this.options.startSpan) {
            this.setSpan(this.options.startSpan, $R(0, this.values.length > 1 ? this.getRange(0).min() : this.value))
        }
        if (this.options.endSpan) {
            this.setSpan(this.options.endSpan, $R(this.values.length > 1 ? this.getRange(this.spans.length - 1).max() : this.value, this.maximum))
        }
    },
    setSpan: function (b, a) {
        if (this.isVertical()) {
            b.style.top = this.translateToPx(a.start);
            b.style.height = this.translateToPx(a.end - a.start + this.range.start)
        } else {
            b.style.left = this.translateToPx(a.start);
            b.style.width = this.translateToPx(a.end - a.start + this.range.start)
        }
    },
    updateStyles: function () {
        this.handles.each(function (a) {
            Element.removeClassName(a, "selected")
        });
        Element.addClassName(this.activeHandle, "selected")
    },
    startDrag: function (c) {
        if (Event.isLeftClick(c)) {
            if (!this.disabled) {
                this.active = true;
                var d = Event.element(c);
                var e = [Event.pointerX(c), Event.pointerY(c)];
                var a = d;
                if (a == this.track) {
                    var b = this.track.cumulativeOffset();
                    this.event = c;
                    this.setValue(this.translateToValue((this.isVertical() ? e[1] - b[1] : e[0] - b[0]) - (this.handleLength / 2)));
                    var b = this.activeHandle.cumulativeOffset();
                    this.offsetX = (e[0] - b[0]);
                    this.offsetY = (e[1] - b[1])
                } else {
                    while ((this.handles.indexOf(d) == -1) && d.parentNode) {
                        d = d.parentNode
                    }
                    if (this.handles.indexOf(d) != -1) {
                        this.activeHandle = d;
                        this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
                        this.updateStyles();
                        var b = this.activeHandle.cumulativeOffset();
                        this.offsetX = (e[0] - b[0]);
                        this.offsetY = (e[1] - b[1])
                    }
                }
            }
            Event.stop(c)
        }
    },
    update: function (a) {
        if (this.active) {
            if (!this.dragging) {
                this.dragging = true
            }
            this.draw(a);
            if (Prototype.Browser.WebKit) {
                window.scrollBy(0, 0)
            }
            Event.stop(a)
        }
    },
    draw: function (b) {
        var c = [Event.pointerX(b), Event.pointerY(b)];
        var a = this.track.cumulativeOffset();
        c[0] -= this.offsetX + a[0];
        c[1] -= this.offsetY + a[1];
        this.event = b;
        this.setValue(this.translateToValue(this.isVertical() ? c[1] : c[0]));
        if (this.initialized && this.options.onSlide) {
            this.options.onSlide(this.values.length > 1 ? this.values : this.value, this)
        }
    },
    endDrag: function (a) {
        if (this.active && this.dragging) {
            this.finishDrag(a, true);
            Event.stop(a)
        }
        this.active = false;
        this.dragging = false
    },
    finishDrag: function (a, b) {
        this.active = false;
        this.dragging = false;
        this.updateFinished()
    },
    updateFinished: function () {
        if (this.initialized && this.options.onChange) {
            this.options.onChange(this.values.length > 1 ? this.values : this.value, this)
        }
        this.event = null
    }
});
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject = function () {
        var F = "undefined",
            t = "object",
            V = "Shockwave Flash",
            Z = "ShockwaveFlash.ShockwaveFlash",
            s = "application/x-shockwave-flash",
            U = "SWFObjectExprInst",
            z = "onreadystatechange",
            Q = window,
            l = document,
            v = navigator,
            W = false,
            X = [h],
            q = [],
            P = [],
            K = [],
            n, S, G, D, L = false,
            a = false,
            p, I, o = true,
            O = function () {
                var ad = typeof l.getElementById != F && typeof l.getElementsByTagName != F && typeof l.createElement != F,
                    ak = v.userAgent.toLowerCase(),
                    ab = v.platform.toLowerCase(),
                    ah = ab ? /win/.test(ab) : /win/.test(ak),
                    af = ab ? /mac/.test(ab) : /mac/.test(ak),
                    ai = /webkit/.test(ak) ? parseFloat(ak.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
                    aa = !+"\v1",
                    aj = [0, 0, 0],
                    ae = null;
                if (typeof v.plugins != F && typeof v.plugins[V] == t) {
                    ae = v.plugins[V].description;
                    if (ae && !(typeof v.mimeTypes != F && v.mimeTypes[s] && !v.mimeTypes[s].enabledPlugin)) {
                        W = true;
                        aa = false;
                        ae = ae.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                        aj[0] = parseInt(ae.replace(/^(.*)\..*$/, "$1"), 10);
                        aj[1] = parseInt(ae.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                        aj[2] = /[a-zA-Z]/.test(ae) ? parseInt(ae.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
                    }
                } else {
                    if (typeof Q.ActiveXObject != F) {
                        try {
                            var ag = new ActiveXObject(Z);
                            if (ag) {
                                ae = ag.GetVariable("$version");
                                if (ae) {
                                    aa = true;
                                    ae = ae.split(" ")[1].split(",");
                                    aj = [parseInt(ae[0], 10), parseInt(ae[1], 10), parseInt(ae[2], 10)]
                                }
                            }
                        } catch (ac) {}
                    }
                }
                return {
                    w3: ad,
                    pv: aj,
                    wk: ai,
                    ie: aa,
                    win: ah,
                    mac: af
                }
            }(),
            m = function () {
                if (!O.w3) {
                    return
                }
                if ((typeof l.readyState != F && l.readyState == "complete") || (typeof l.readyState == F && (l.getElementsByTagName("body")[0] || l.body))) {
                    f()
                }
                if (!L) {
                    if (typeof l.addEventListener != F) {
                        l.addEventListener("DOMContentLoaded", f, false)
                    }
                    if (O.ie && O.win) {
                        l.attachEvent(z, function () {
                            if (l.readyState == "complete") {
                                l.detachEvent(z, arguments.callee);
                                f()
                            }
                        });
                        if (Q == top) {
                            (function () {
                                if (L) {
                                    return
                                }
                                try {
                                    l.documentElement.doScroll("left")
                                } catch (aa) {
                                    setTimeout(arguments.callee, 0);
                                    return
                                }
                                f()
                            })()
                        }
                    }
                    if (O.wk) {
                        (function () {
                            if (L) {
                                return
                            }
                            if (!/loaded|complete/.test(l.readyState)) {
                                setTimeout(arguments.callee, 0);
                                return
                            }
                            f()
                        })()
                    }
                    u(f)
                }
            }();

        function f() {
            if (L) {
                return
            }
            try {
                var ac = l.getElementsByTagName("body")[0].appendChild(E("span"));
                ac.parentNode.removeChild(ac)
            } catch (ad) {
                return
            }
            L = true;
            var aa = X.length;
            for (var ab = 0; ab < aa; ab++) {
                X[ab]()
            }
        }
        function M(aa) {
            if (L) {
                aa()
            } else {
                X[X.length] = aa
            }
        }
        function u(ab) {
            if (typeof Q.addEventListener != F) {
                Q.addEventListener("load", ab, false)
            } else {
                if (typeof l.addEventListener != F) {
                    l.addEventListener("load", ab, false)
                } else {
                    if (typeof Q.attachEvent != F) {
                        k(Q, "onload", ab)
                    } else {
                        if (typeof Q.onload == "function") {
                            var aa = Q.onload;
                            Q.onload = function () {
                                aa();
                                ab()
                            }
                        } else {
                            Q.onload = ab
                        }
                    }
                }
            }
        }
        function h() {
            if (W) {
                Y()
            } else {
                J()
            }
        }
        function Y() {
            var aa = l.getElementsByTagName("body")[0];
            var ad = E(t);
            ad.setAttribute("type", s);
            var ac = aa.appendChild(ad);
            if (ac) {
                var ab = 0;
                (function () {
                    if (typeof ac.GetVariable != F) {
                        var ae = ac.GetVariable("$version");
                        if (ae) {
                            ae = ae.split(" ")[1].split(",");
                            O.pv = [parseInt(ae[0], 10), parseInt(ae[1], 10), parseInt(ae[2], 10)]
                        }
                    } else {
                        if (ab < 10) {
                            ab++;
                            setTimeout(arguments.callee, 10);
                            return
                        }
                    }
                    aa.removeChild(ad);
                    ac = null;
                    J()
                })()
            } else {
                J()
            }
        }
        function J() {
            var aj = q.length;
            if (aj > 0) {
                for (var ai = 0; ai < aj; ai++) {
                    var ab = q[ai].id;
                    var ae = q[ai].callbackFn;
                    var ad = {
                        success: false,
                        id: ab
                    };
                    if (O.pv[0] > 0) {
                        var ah = c(ab);
                        if (ah) {
                            if (H(q[ai].swfVersion) && !(O.wk && O.wk < 312)) {
                                y(ab, true);
                                if (ae) {
                                    ad.success = true;
                                    ad.ref = B(ab);
                                    ae(ad)
                                }
                            } else {
                                if (q[ai].expressInstall && C()) {
                                    var al = {};
                                    al.data = q[ai].expressInstall;
                                    al.width = ah.getAttribute("width") || "0";
                                    al.height = ah.getAttribute("height") || "0";
                                    if (ah.getAttribute("class")) {
                                        al.styleclass = ah.getAttribute("class")
                                    }
                                    if (ah.getAttribute("align")) {
                                        al.align = ah.getAttribute("align")
                                    }
                                    var ak = {};
                                    var aa = ah.getElementsByTagName("param");
                                    var af = aa.length;
                                    for (var ag = 0; ag < af; ag++) {
                                        if (aa[ag].getAttribute("name").toLowerCase() != "movie") {
                                            ak[aa[ag].getAttribute("name")] = aa[ag].getAttribute("value")
                                        }
                                    }
                                    R(al, ak, ab, ae)
                                } else {
                                    r(ah);
                                    if (ae) {
                                        ae(ad)
                                    }
                                }
                            }
                        }
                    } else {
                        y(ab, true);
                        if (ae) {
                            var ac = B(ab);
                            if (ac && typeof ac.SetVariable != F) {
                                ad.success = true;
                                ad.ref = ac
                            }
                            ae(ad)
                        }
                    }
                }
            }
        }
        function B(ad) {
            var aa = null;
            var ab = c(ad);
            if (ab && ab.nodeName == "OBJECT") {
                if (typeof ab.SetVariable != F) {
                    aa = ab
                } else {
                    var ac = ab.getElementsByTagName(t)[0];
                    if (ac) {
                        aa = ac
                    }
                }
            }
            return aa
        }
        function C() {
            return !a && H("6.0.65") && (O.win || O.mac) && !(O.wk && O.wk < 312)
        }
        function R(ad, ae, aa, ac) {
            a = true;
            G = ac || null;
            D = {
                success: false,
                id: aa
            };
            var ah = c(aa);
            if (ah) {
                if (ah.nodeName == "OBJECT") {
                    n = g(ah);
                    S = null
                } else {
                    n = ah;
                    S = aa
                }
                ad.id = U;
                if (typeof ad.width == F || (!/%$/.test(ad.width) && parseInt(ad.width, 10) < 310)) {
                    ad.width = "310"
                }
                if (typeof ad.height == F || (!/%$/.test(ad.height) && parseInt(ad.height, 10) < 137)) {
                    ad.height = "137"
                }
                l.title = l.title.slice(0, 47) + " - Flash Player Installation";
                var ag = O.ie && O.win ? "ActiveX" : "PlugIn",
                    af = "MMredirectURL=" + Q.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ag + "&MMdoctitle=" + l.title;
                if (typeof ae.flashvars != F) {
                    ae.flashvars += "&" + af
                } else {
                    ae.flashvars = af
                }
                if (O.ie && O.win && ah.readyState != 4) {
                    var ab = E("div");
                    aa += "SWFObjectNew";
                    ab.setAttribute("id", aa);
                    ah.parentNode.insertBefore(ab, ah);
                    ah.style.display = "none";
                    (function () {
                        if (ah.readyState == 4) {
                            ah.parentNode.removeChild(ah)
                        } else {
                            setTimeout(arguments.callee, 10)
                        }
                    })()
                }
                w(ad, ae, aa)
            }
        }
        function r(ab) {
            if (O.ie && O.win && ab.readyState != 4) {
                var aa = E("div");
                ab.parentNode.insertBefore(aa, ab);
                aa.parentNode.replaceChild(g(ab), aa);
                ab.style.display = "none";
                (function () {
                    if (ab.readyState == 4) {
                        ab.parentNode.removeChild(ab)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            } else {
                ab.parentNode.replaceChild(g(ab), ab)
            }
        }
        function g(af) {
            var ae = E("div");
            if (O.win && O.ie) {
                ae.innerHTML = af.innerHTML
            } else {
                var ab = af.getElementsByTagName(t)[0];
                if (ab) {
                    var ag = ab.childNodes;
                    if (ag) {
                        var aa = ag.length;
                        for (var ad = 0; ad < aa; ad++) {
                            if (!(ag[ad].nodeType == 1 && ag[ad].nodeName == "PARAM") && !(ag[ad].nodeType == 8)) {
                                ae.appendChild(ag[ad].cloneNode(true))
                            }
                        }
                    }
                }
            }
            return ae
        }
        function w(al, aj, ab) {
            var aa, ad = c(ab);
            if (O.wk && O.wk < 312) {
                return aa
            }
            if (ad) {
                if (typeof al.id == F) {
                    al.id = ab
                }
                if (O.ie && O.win) {
                    var ak = "";
                    for (var ah in al) {
                        if (al[ah] != Object.prototype[ah]) {
                            if (ah.toLowerCase() == "data") {
                                aj.movie = al[ah]
                            } else {
                                if (ah.toLowerCase() == "styleclass") {
                                    ak += ' class="' + al[ah] + '"'
                                } else {
                                    if (ah.toLowerCase() != "classid") {
                                        ak += " " + ah + '="' + al[ah] + '"'
                                    }
                                }
                            }
                        }
                    }
                    var ai = "";
                    for (var ag in aj) {
                        if (aj[ag] != Object.prototype[ag]) {
                            ai += '<param name="' + ag + '" value="' + aj[ag] + '" />'
                        }
                    }
                    ad.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ak + ">" + ai + "</object>";
                    P[P.length] = al.id;
                    aa = c(al.id)
                } else {
                    var ac = E(t);
                    ac.setAttribute("type", s);
                    for (var af in al) {
                        if (al[af] != Object.prototype[af]) {
                            if (af.toLowerCase() == "styleclass") {
                                ac.setAttribute("class", al[af])
                            } else {
                                if (af.toLowerCase() != "classid") {
                                    ac.setAttribute(af, al[af])
                                }
                            }
                        }
                    }
                    for (var ae in aj) {
                        if (aj[ae] != Object.prototype[ae] && ae.toLowerCase() != "movie") {
                            e(ac, ae, aj[ae])
                        }
                    }
                    ad.parentNode.replaceChild(ac, ad);
                    aa = ac
                }
            }
            return aa
        }
        function e(ac, aa, ab) {
            var ad = E("param");
            ad.setAttribute("name", aa);
            ad.setAttribute("value", ab);
            ac.appendChild(ad)
        }
        function A(ab) {
            var aa = c(ab);
            if (aa && aa.nodeName == "OBJECT") {
                if (O.ie && O.win) {
                    aa.style.display = "none";
                    (function () {
                        if (aa.readyState == 4) {
                            b(ab)
                        } else {
                            setTimeout(arguments.callee, 10)
                        }
                    })()
                } else {
                    aa.parentNode.removeChild(aa)
                }
            }
        }
        function b(ac) {
            var ab = c(ac);
            if (ab) {
                for (var aa in ab) {
                    if (typeof ab[aa] == "function") {
                        ab[aa] = null
                    }
                }
                ab.parentNode.removeChild(ab)
            }
        }
        function c(ac) {
            var aa = null;
            try {
                aa = l.getElementById(ac)
            } catch (ab) {}
            return aa
        }
        function E(aa) {
            return l.createElement(aa)
        }
        function k(ac, aa, ab) {
            ac.attachEvent(aa, ab);
            K[K.length] = [ac, aa, ab]
        }
        function H(ac) {
            var ab = O.pv,
                aa = ac.split(".");
            aa[0] = parseInt(aa[0], 10);
            aa[1] = parseInt(aa[1], 10) || 0;
            aa[2] = parseInt(aa[2], 10) || 0;
            return (ab[0] > aa[0] || (ab[0] == aa[0] && ab[1] > aa[1]) || (ab[0] == aa[0] && ab[1] == aa[1] && ab[2] >= aa[2])) ? true : false
        }
        function x(af, ab, ag, ae) {
            if (O.ie && O.mac) {
                return
            }
            var ad = l.getElementsByTagName("head")[0];
            if (!ad) {
                return
            }
            var aa = (ag && typeof ag == "string") ? ag : "screen";
            if (ae) {
                p = null;
                I = null
            }
            if (!p || I != aa) {
                var ac = E("style");
                ac.setAttribute("type", "text/css");
                ac.setAttribute("media", aa);
                p = ad.appendChild(ac);
                if (O.ie && O.win && typeof l.styleSheets != F && l.styleSheets.length > 0) {
                    p = l.styleSheets[l.styleSheets.length - 1]
                }
                I = aa
            }
            if (O.ie && O.win) {
                if (p && typeof p.addRule == t) {
                    p.addRule(af, ab)
                }
            } else {
                if (p && typeof l.createTextNode != F) {
                    p.appendChild(l.createTextNode(af + " {" + ab + "}"))
                }
            }
        }
        function y(ac, aa) {
            if (!o) {
                return
            }
            var ab = aa ? "visible" : "hidden";
            if (L && c(ac)) {
                c(ac).style.visibility = ab
            } else {
                x("#" + ac, "visibility:" + ab)
            }
        }
        function N(ab) {
            var ac = /[\\\"<>\.;]/;
            var aa = ac.exec(ab) != null;
            return aa && typeof encodeURIComponent != F ? encodeURIComponent(ab) : ab
        }
        var d = function () {
                if (O.ie && O.win) {
                    window.attachEvent("onunload", function () {
                        var af = K.length;
                        for (var ae = 0; ae < af; ae++) {
                            K[ae][0].detachEvent(K[ae][1], K[ae][2])
                        }
                        var ac = P.length;
                        for (var ad = 0; ad < ac; ad++) {
                            A(P[ad])
                        }
                        for (var ab in O) {
                            O[ab] = null
                        }
                        O = null;
                        for (var aa in swfobject) {
                            swfobject[aa] = null
                        }
                        swfobject = null
                    })
                }
            }();
        return {
            registerObject: function (ae, aa, ad, ac) {
                if (O.w3 && ae && aa) {
                    var ab = {};
                    ab.id = ae;
                    ab.swfVersion = aa;
                    ab.expressInstall = ad;
                    ab.callbackFn = ac;
                    q[q.length] = ab;
                    y(ae, false)
                } else {
                    if (ac) {
                        ac({
                            success: false,
                            id: ae
                        })
                    }
                }
            },
            getObjectById: function (aa) {
                if (O.w3) {
                    return B(aa)
                }
            },
            embedSWF: function (ae, ak, ah, aj, ab, ad, ac, ag, ai, af) {
                var aa = {
                    success: false,
                    id: ak
                };
                if (O.w3 && !(O.wk && O.wk < 312) && ae && ak && ah && aj && ab) {
                    y(ak, false);
                    M(function () {
                        ah += "";
                        aj += "";
                        var am = {};
                        if (ai && typeof ai === t) {
                            for (var ao in ai) {
                                am[ao] = ai[ao]
                            }
                        }
                        am.data = ae;
                        am.width = ah;
                        am.height = aj;
                        var ap = {};
                        if (ag && typeof ag === t) {
                            for (var an in ag) {
                                ap[an] = ag[an]
                            }
                        }
                        if (ac && typeof ac === t) {
                            for (var al in ac) {
                                if (typeof ap.flashvars != F) {
                                    ap.flashvars += "&" + al + "=" + ac[al]
                                } else {
                                    ap.flashvars = al + "=" + ac[al]
                                }
                            }
                        }
                        if (H(ab)) {
                            var aq = w(am, ap, ak);
                            if (am.id == ak) {
                                y(ak, true)
                            }
                            aa.success = true;
                            aa.ref = aq
                        } else {
                            if (ad && C()) {
                                am.data = ad;
                                R(am, ap, ak, af);
                                return
                            } else {
                                y(ak, true)
                            }
                        }
                        if (af) {
                            af(aa)
                        }
                    })
                } else {
                    if (af) {
                        af(aa)
                    }
                }
            },
            switchOffAutoHideShow: function () {
                o = false
            },
            ua: O,
            getFlashPlayerVersion: function () {
                return {
                    major: O.pv[0],
                    minor: O.pv[1],
                    release: O.pv[2]
                }
            },
            hasFlashPlayerVersion: H,
            createSWF: function (ac, ab, aa) {
                if (O.w3) {
                    return w(ac, ab, aa)
                } else {
                    return undefined
                }
            },
            showExpressInstall: function (ac, ad, aa, ab) {
                if (O.w3 && C()) {
                    R(ac, ad, aa, ab)
                }
            },
            removeSWF: function (aa) {
                if (O.w3) {
                    A(aa)
                }
            },
            createCSS: function (ad, ac, ab, aa) {
                if (O.w3) {
                    x(ad, ac, ab, aa)
                }
            },
            addDomLoadEvent: M,
            addLoadEvent: u,
            getQueryParamValue: function (ad) {
                var ac = l.location.search || l.location.hash;
                if (ac) {
                    if (/\?/.test(ac)) {
                        ac = ac.split("?")[1]
                    }
                    if (ad == null) {
                        return N(ac)
                    }
                    var ab = ac.split("&");
                    for (var aa = 0; aa < ab.length; aa++) {
                        if (ab[aa].substring(0, ab[aa].indexOf("=")) == ad) {
                            return N(ab[aa].substring((ab[aa].indexOf("=") + 1)))
                        }
                    }
                }
                return ""
            },
            expressInstallCallback: function () {
                if (a) {
                    var aa = c(U);
                    if (aa && n) {
                        aa.parentNode.replaceChild(n, aa);
                        if (S) {
                            y(S, true);
                            if (O.ie && O.win) {
                                n.style.display = "block"
                            }
                        }
                        if (G) {
                            G(D)
                        }
                    }
                    a = false
                }
            }
        }
    }();
var _gat = new Object({
    c: "length",
    lb: "4.3",
    m: "cookie",
    b: undefined,
    cb: function (c, b) {
        this.zb = c;
        this.Nb = b
    },
    r: "__utma=",
    W: "__utmb=",
    ma: "__utmc=",
    Ta: "__utmk=",
    na: "__utmv=",
    oa: "__utmx=",
    Sa: "GASO=",
    X: "__utmz=",
    lc: "http://www.google-analytics.com/__utm.gif",
    mc: "https://ssl.google-analytics.com/__utm.gif",
    Wa: "utmcid=",
    Ya: "utmcsr=",
    $a: "utmgclid=",
    Ua: "utmccn=",
    Xa: "utmcmd=",
    Za: "utmctr=",
    Va: "utmcct=",
    Hb: false,
    _gasoDomain: undefined,
    _gasoCPath: undefined,
    e: window,
    a: document,
    k: navigator,
    t: function (g) {
        var b = 1,
            k = 0,
            e, f;
        if (!_gat.q(g)) {
            b = 0;
            for (e = g[_gat.c] - 1; e >= 0; e--) {
                f = g.charCodeAt(e);
                b = (b << 6 & 268435455) + f + (f << 14);
                k = b & 266338304;
                b = k != 0 ? b ^ k >> 21 : b
            }
        }
        return b
    },
    C: function (p, e, q) {
        var m = _gat,
            n = "-",
            f, b, g = m.q;
        if (!g(p) && !g(e) && !g(q)) {
            f = m.w(p, e);
            if (f > -1) {
                b = p.indexOf(q, f);
                if (b < 0) {
                    b = p[m.c]
                }
                n = m.F(p, f + m.w(e, "=") + 1, b)
            }
        }
        return n
    },
    Ea: function (g) {
        var b = false,
            k = 0,
            e, f;
        if (!_gat.q(g)) {
            b = true;
            for (e = 0; e < g[_gat.c]; e++) {
                f = g.charAt(e);
                k += "." == f ? 1 : 0;
                b = b && k <= 1 && (0 == e && "-" == f || _gat.P(".0123456789", f))
            }
        }
        return b
    },
    d: function (e, b) {
        var f = encodeURIComponent;
        return f instanceof Function ? (b ? encodeURI(e) : f(e)) : escape(e)
    },
    J: function (g, b) {
        var k = decodeURIComponent,
            e;
        g = g.split("+").join(" ");
        if (k instanceof Function) {
            try {
                e = b ? decodeURI(g) : k(g)
            } catch (f) {
                e = unescape(g)
            }
        } else {
            e = unescape(g)
        }
        return e
    },
    Db: function (a) {
        return a && a.hash ? _gat.F(a.href, _gat.w(a.href, "#")) : ""
    },
    q: function (a) {
        return _gat.b == a || "-" == a || "" == a
    },
    Lb: function (a) {
        return a[_gat.c] > 0 && _gat.P(" \n\r\t", a)
    },
    P: function (c, b) {
        return _gat.w(c, b) > -1
    },
    h: function (c, b) {
        c[c[_gat.c]] = b
    },
    T: function (a) {
        return a.toLowerCase()
    },
    z: function (c, b) {
        return c.split(b)
    },
    w: function (c, b) {
        return c.indexOf(b)
    },
    F: function (e, b, f) {
        f = _gat.b == f ? e[_gat.c] : f;
        return e.substring(b, f)
    },
    uc: function () {
        var c = _gat.b,
            b = window;
        if (b && b.gaGlobal && b.gaGlobal.hid) {
            c = b.gaGlobal.hid
        } else {
            c = Math.round(Math.random() * 2147483647);
            b.gaGlobal = b.gaGlobal ? b.gaGlobal : {};
            b.gaGlobal.hid = c
        }
        return c
    },
    wa: function () {
        return Math.round(Math.random() * 2147483647)
    },
    Gc: function () {
        return (_gat.wa() ^ _gat.vc()) * 2147483647
    },
    vc: function () {
        var p = _gat.k,
            e = _gat.a,
            q = _gat.e,
            m = e[_gat.m] ? e[_gat.m] : "",
            n = q.history[_gat.c],
            f, b, g = [p.appName, p.version, p.language ? p.language : p.browserLanguage, p.platform, p.userAgent, p.javaEnabled() ? 1 : 0].join("");
        if (q.screen) {
            g += q.screen.width + "x" + q.screen.height + q.screen.colorDepth
        } else {
            if (q.java) {
                b = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
                g += b.screen.width + "x" + b.screen.height
            }
        }
        g += m;
        g += e.referrer ? e.referrer : "";
        f = g[_gat.c];
        while (n > 0) {
            g += n-- ^ f++
        }
        return _gat.t(g)
    }
});
_gat.hc = function () {
    var e = this,
        b = _gat.cb;

    function f(a, c) {
        return new b(a, c)
    }
    e.db = "utm_campaign";
    e.eb = "utm_content";
    e.fb = "utm_id";
    e.gb = "utm_medium";
    e.hb = "utm_nooverride";
    e.ib = "utm_source";
    e.jb = "utm_term";
    e.kb = "gclid";
    e.pa = 0;
    e.I = 0;
    e.wb = "15768000";
    e.Tb = "1800";
    e.ea = [];
    e.ga = [];
    e.Ic = "cse";
    e.Gb = "q";
    e.ab = "google";
    e.fa = [f(e.ab, e.Gb), f("yahoo", "p"), f("msn", "q"), f("bing", "q"), f("aol", "query"), f("aol", "encquery"), f("lycos", "query"), f("ask", "q"), f("altavista", "q"), f("netscape", "query"), f("cnn", "query"), f("looksmart", "qt"), f("about", "terms"), f("mamma", "query"), f("alltheweb", "q"), f("gigablast", "q"), f("voila", "rdata"), f("virgilio", "qs"), f("live", "q"), f("baidu", "wd"), f("alice", "qs"), f("yandex", "text"), f("najdi", "q"), f("aol", "q"), f("club-internet", "query"), f("mama", "query"), f("seznam", "q"), f("search", "q"), f("wp", "szukaj"), f("onet", "qt"), f("netsprint", "q"), f("google.interia", "q"), f("szukacz", "q"), f("yam", "k"), f("pchome", "q"), f("kvasir", "searchExpr"), f("sesam", "q"), f("ozu", "q"), f("terra", "query"), f("nostrum", "query"), f("mynet", "q"), f("ekolay", "q"), f("search.ilse", "search_for")];
    e.B = undefined;
    e.Kb = false;
    e.p = "/";
    e.ha = 100;
    e.Da = "/__utm.gif";
    e.ta = 1;
    e.ua = 1;
    e.G = "|";
    e.sa = 1;
    e.qa = 1;
    e.pb = 1;
    e.g = "auto";
    e.D = 1;
    e.Ga = 1000;
    e.Yc = 10;
    e.nc = 10;
    e.Zc = 0.2
};
_gat.Y = function (P, R) {
    var Q, M, H, L, K, y, E, O = this,
        I = _gat,
        t = I.q,
        e = I.c,
        N, b = R;
    O.a = P;

    function D(c) {
        var a = c instanceof Array ? c.join(".") : "";
        return t(a) ? "-" : a
    }
    function G(d, a) {
        var f = [],
            c;
        if (!t(d)) {
            f = I.z(d, ".");
            if (a) {
                for (c = 0; c < f[e]; c++) {
                    if (!I.Ea(f[c])) {
                        f[c] = "-"
                    }
                }
            }
        }
        return f
    }
    function F() {
        return v(63072000000)
    }
    function v(c) {
        var a = new Date,
            d = new Date(a.getTime() + c);
        return "expires=" + d.toGMTString() + "; "
    }
    function J(c, a) {
        O.a[I.m] = c + "; path=" + b.p + "; " + a + O.Cc()
    }
    function C(g, a, h) {
        var d = O.V,
            f, c;
        for (f = 0; f < d[e]; f++) {
            c = d[f][0];
            c += t(a) ? a : a + d[f][4];
            d[f][2](I.C(g, c, h))
        }
    }
    O.Jb = function () {
        return I.b == N || N == O.t()
    };
    O.Ba = function () {
        return K ? K : "-"
    };
    O.Wb = function (a) {
        K = a
    };
    O.Ma = function (a) {
        N = I.Ea(a) ? a * 1 : "-"
    };
    O.Aa = function () {
        return D(y)
    };
    O.Na = function (a) {
        y = G(a)
    };
    O.Hc = function () {
        return N ? N : "-"
    };
    O.Cc = function () {
        return t(b.g) ? "" : "domain=" + b.g + ";"
    };
    O.ya = function () {
        return D(Q)
    };
    O.Ub = function (a) {
        Q = G(a, 1)
    };
    O.K = function () {
        return D(M)
    };
    O.La = function (a) {
        M = G(a, 1)
    };
    O.za = function () {
        return D(H)
    };
    O.Vb = function (a) {
        H = G(a, 1)
    };
    O.Ca = function () {
        return D(L)
    };
    O.Xb = function (c) {
        L = G(c);
        for (var a = 0; a < L[e]; a++) {
            if (a < 4 && !I.Ea(L[a])) {
                L[a] = "-"
            }
        }
    };
    O.Dc = function () {
        return E
    };
    O.Uc = function (a) {
        E = a
    };
    O.pc = function () {
        Q = [];
        M = [];
        H = [];
        L = [];
        K = I.b;
        y = [];
        N = I.b
    };
    O.t = function () {
        var c = "",
            a;
        for (a = 0; a < O.V[e]; a++) {
            c += O.V[a][1]()
        }
        return I.t(c)
    };
    O.Ha = function (c) {
        var a = O.a[I.m],
            d = false;
        if (a) {
            C(a, c, ";");
            O.Ma(O.t());
            d = true
        }
        return d
    };
    O.Rc = function (a) {
        C(a, "", "&");
        O.Ma(I.C(a, I.Ta, "&"))
    };
    O.Wc = function () {
        var c = O.V,
            a = [],
            d;
        for (d = 0; d < c[e]; d++) {
            I.h(a, c[d][0] + c[d][1]())
        }
        I.h(a, I.Ta + O.t());
        return a.join("&")
    };
    O.bd = function (f, a) {
        var g = O.V,
            c = b.p,
            d;
        O.Ha(f);
        b.p = a;
        for (d = 0; d < g[e]; d++) {
            if (!t(g[d][1]())) {
                g[d][3]()
            }
        }
        b.p = c
    };
    O.dc = function () {
        J(I.r + O.ya(), F())
    };
    O.Pa = function () {
        J(I.W + O.K(), v(b.Tb * 1000))
    };
    O.ec = function () {
        J(I.ma + O.za(), "")
    };
    O.Ra = function () {
        J(I.X + O.Ca(), v(b.wb * 1000))
    };
    O.fc = function () {
        J(I.oa + O.Ba(), F())
    };
    O.Qa = function () {
        J(I.na + O.Aa(), F())
    };
    O.cd = function () {
        J(I.Sa + O.Dc(), "")
    };
    O.V = [
        [I.r, O.ya, O.Ub, O.dc, "."],
        [I.W, O.K, O.La, O.Pa, ""],
        [I.ma, O.za, O.Vb, O.ec, ""],
        [I.oa, O.Ba, O.Wb, O.fc, ""],
        [I.X, O.Ca, O.Xb, O.Ra, "."],
        [I.na, O.Aa, O.Na, O.Qa, "."]
    ]
};
_gat.jc = function (l) {
    var b = this,
        m = _gat,
        f = l,
        g, e = function (a) {
            var c = (new Date).getTime(),
                d;
            d = (c - a[3]) * (f.Zc / 1000);
            if (d >= 1) {
                a[2] = Math.min(Math.floor(a[2] * 1 + d), f.nc);
                a[3] = c
            }
            return a
        };
    b.O = function (o, E, a, t, k, C, y) {
        var r, v = f.D,
            d = a.location;
        if (!g) {
            g = new m.Y(a, f)
        }
        g.Ha(t);
        r = m.z(g.K(), ".");
        if (r[1] < 500 || k) {
            if (C) {
                r = e(r)
            }
            if (k || !C || r[2] >= 1) {
                if (!k && C) {
                    r[2] = r[2] * 1 - 1
                }
                r[1] = r[1] * 1 + 1;
                o = "?utmwv=" + _gat.lb + "&utmn=" + m.wa() + (m.q(d.hostname) ? "" : "&utmhn=" + m.d(d.hostname)) + (f.ha == 100 ? "" : "&utmsp=" + m.d(f.ha)) + o;
                if (0 == v || 2 == v) {
                    var h = new Image(1, 1);
                    h.src = f.Da + o;
                    var c = 2 == v ?
                    function () {} : y ||
                    function () {};
                    h.onload = c
                }
                if (1 == v || 2 == v) {
                    var D = new Image(1, 1);
                    D.src = ("https:" == d.protocol ? m.mc : m.lc) + o + "&utmac=" + E + "&utmcc=" + b.wc(a, t);
                    D.onload = y ||
                    function () {}
                }
            }
        }
        g.La(r.join("."));
        g.Pa()
    };
    b.wc = function (d, h) {
        var o = [],
            k = [m.r, m.X, m.na, m.oa],
            p, c = d[m.m],
            a;
        for (p = 0; p < k[m.c]; p++) {
            a = m.C(c, k[p] + h, ";");
            if (!m.q(a)) {
                m.h(o, k[p] + a + ";")
            }
        }
        return m.d(o.join("+"))
    }
};
_gat.i = function () {
    this.la = []
};
_gat.i.bb = function (n, e, p, g, m, f) {
    var b = this;
    b.cc = n;
    b.Oa = e;
    b.L = p;
    b.sb = g;
    b.Pb = m;
    b.Qb = f
};
_gat.i.bb.prototype.S = function () {
    var c = this,
        b = _gat.d;
    return "&" + ["utmt=item", "utmtid=" + b(c.cc), "utmipc=" + b(c.Oa), "utmipn=" + b(c.L), "utmiva=" + b(c.sb), "utmipr=" + b(c.Pb), "utmiqt=" + b(c.Qb)].join("&")
};
_gat.i.$ = function (n, r, p, m, e, g, f, t) {
    var b = this;
    b.v = n;
    b.ob = r;
    b.bc = p;
    b.ac = m;
    b.Yb = e;
    b.ub = g;
    b.$b = f;
    b.xb = t;
    b.ca = []
};
_gat.i.$.prototype.mb = function (n, r, p, m, e) {
    var g = this,
        f = g.Eb(n),
        t = g.v,
        b = _gat;
    if (b.b == f) {
        b.h(g.ca, new b.i.bb(t, n, r, p, m, e))
    } else {
        f.cc = t;
        f.Oa = n;
        f.L = r;
        f.sb = p;
        f.Pb = m;
        f.Qb = e
    }
};
_gat.i.$.prototype.Eb = function (f) {
    var b, g = this.ca,
        e;
    for (e = 0; e < g[_gat.c]; e++) {
        b = f == g[e].Oa ? g[e] : b
    }
    return b
};
_gat.i.$.prototype.S = function () {
    var c = this,
        b = _gat.d;
    return "&" + ["utmt=tran", "utmtid=" + b(c.v), "utmtst=" + b(c.ob), "utmtto=" + b(c.bc), "utmttx=" + b(c.ac), "utmtsp=" + b(c.Yb), "utmtci=" + b(c.ub), "utmtrg=" + b(c.$b), "utmtco=" + b(c.xb)].join("&")
};
_gat.i.prototype.nb = function (u, w, v, r, e, p, m, x) {
    var b = this,
        t = _gat,
        g = b.xa(u);
    if (t.b == g) {
        g = new t.i.$(u, w, v, r, e, p, m, x);
        t.h(b.la, g)
    } else {
        g.ob = w;
        g.bc = v;
        g.ac = r;
        g.Yb = e;
        g.ub = p;
        g.$b = m;
        g.xb = x
    }
    return g
};
_gat.i.prototype.xa = function (f) {
    var b, g = this.la,
        e;
    for (e = 0; e < g[_gat.c]; e++) {
        b = f == g[e].v ? g[e] : b
    }
    return b
};
_gat.gc = function (l) {
    var b = this,
        m = "-",
        f = _gat,
        g = l;
    b.Ja = screen;
    b.qb = !self.screen && self.java ? java.awt.Toolkit.getDefaultToolkit() : f.b;
    b.a = document;
    b.e = window;
    b.k = navigator;
    b.Ka = m;
    b.Sb = m;
    b.tb = m;
    b.Ob = m;
    b.Mb = 1;
    b.Bb = m;

    function e() {
        var d, t, a, k, c = "ShockwaveFlash",
            r = "$version",
            p = b.k ? b.k.plugins : f.b;
        if (p && p[f.c] > 0) {
            for (d = 0; d < p[f.c] && !a; d++) {
                t = p[d];
                if (f.P(t.name, "Shockwave Flash")) {
                    a = f.z(t.description, "Shockwave Flash ")[1]
                }
            }
        } else {
            c = c + "." + c;
            try {
                k = new ActiveXObject(c + ".7");
                a = k.GetVariable(r)
            } catch (h) {}
            if (!a) {
                try {
                    k = new ActiveXObject(c + ".6");
                    a = "WIN 6,0,21,0";
                    k.AllowScriptAccess = "always";
                    a = k.GetVariable(r)
                } catch (o) {}
            }
            if (!a) {
                try {
                    k = new ActiveXObject(c);
                    a = k.GetVariable(r)
                } catch (o) {}
            }
            if (a) {
                a = f.z(f.z(a, " ")[1], ",");
                a = a[0] + "." + a[1] + " r" + a[2]
            }
        }
        return a ? a : m
    }
    b.xc = function () {
        var a;
        if (self.screen) {
            b.Ka = b.Ja.width + "x" + b.Ja.height;
            b.Sb = b.Ja.colorDepth + "-bit"
        } else {
            if (b.qb) {
                try {
                    a = b.qb.getScreenSize();
                    b.Ka = a.width + "x" + a.height
                } catch (c) {}
            }
        }
        b.Ob = f.T(b.k && b.k.language ? b.k.language : (b.k && b.k.browserLanguage ? b.k.browserLanguage : m));
        b.Mb = b.k && b.k.javaEnabled() ? 1 : 0;
        b.Bb = g ? e() : m;
        b.tb = f.d(b.a.characterSet ? b.a.characterSet : (b.a.charset ? b.a.charset : m))
    };
    b.Xc = function () {
        return "&" + ["utmcs=" + f.d(b.tb), "utmsr=" + b.Ka, "utmsc=" + b.Sb, "utmul=" + b.Ob, "utmje=" + b.Mb, "utmfl=" + f.d(b.Bb)].join("&")
    }
};
_gat.n = function (D, H, F, v, p) {
    var u = this,
        t = _gat,
        J = t.q,
        b = t.b,
        C = t.P,
        r = t.C,
        I = t.T,
        G = t.z,
        y = t.c;
    u.a = H;
    u.f = D;
    u.Rb = F;
    u.ja = v;
    u.o = p;

    function E(a) {
        return J(a) || "0" == a || !C(a, "://")
    }
    function e(c) {
        var a = "";
        c = I(G(c, "://")[1]);
        if (C(c, "/")) {
            c = G(c, "/")[1];
            if (C(c, "?")) {
                a = G(c, "?")[0]
            }
        }
        return a
    }
    function m(c) {
        var a = "";
        a = I(G(c, "://")[1]);
        if (C(a, "/")) {
            a = G(a, "/")[0]
        }
        return a
    }
    u.Fc = function (d) {
        var c = u.Fb(),
            a = u.o;
        return new t.n.s(r(d, a.fb + "=", "&"), r(d, a.ib + "=", "&"), r(d, a.kb + "=", "&"), u.ba(d, a.db, "(not set)"), u.ba(d, a.gb, "(not set)"), u.ba(d, a.jb, c && !J(c.R) ? t.J(c.R) : b), u.ba(d, a.eb, b))
    };
    u.Ib = function (d) {
        var c = m(d),
            a = e(d);
        if (C(c, u.o.ab)) {
            d = G(d, "?").join("&");
            if (C(d, "&" + u.o.Gb + "=")) {
                if (a == u.o.Ic) {
                    return true
                }
            }
        }
        return false
    };
    u.Fb = function () {
        var h, d, c = u.Rb,
            g, f, a = u.o.fa;
        if (E(c) || u.Ib(c)) {
            return
        }
        h = m(c);
        for (g = 0; g < a[y]; g++) {
            f = a[g];
            if (C(h, I(f.zb))) {
                c = G(c, "?").join("&");
                if (C(c, "&" + f.Nb + "=")) {
                    d = G(c, "&" + f.Nb + "=")[1];
                    if (C(d, "&")) {
                        d = G(d, "&")[0]
                    }
                    return new t.n.s(b, f.zb, b, "(organic)", "organic", d, b)
                }
            }
        }
    };
    u.ba = function (g, c, a) {
        var f = r(g, c + "=", "&"),
            d = !J(f) ? t.J(f) : (!J(a) ? a : "-");
        return d
    };
    u.Nc = function (g) {
        var c = u.o.ea,
            a = false,
            f, d;
        if (g && "organic" == g.da) {
            f = I(t.J(g.R));
            for (d = 0; d < c[y]; d++) {
                a = a || I(c[d]) == f
            }
        }
        return a
    };
    u.Ec = function () {
        var d = "",
            c = "",
            a = u.Rb;
        if (E(a) || u.Ib(a)) {
            return
        }
        d = I(G(a, "://")[1]);
        if (C(d, "/")) {
            c = t.F(d, t.w(d, "/"));
            if (C(c, "?")) {
                c = G(c, "?")[0]
            }
            d = G(d, "/")[0]
        }
        if (0 == t.w(d, "www.")) {
            d = t.F(d, 4)
        }
        return new t.n.s(b, d, b, "(referral)", "referral", b, c)
    };
    u.sc = function (c) {
        var a = "";
        if (u.o.pa) {
            a = t.Db(c);
            a = "" != a ? a + "&" : a
        }
        a += c.search;
        return a
    };
    u.zc = function () {
        return new t.n.s(b, "(direct)", b, "(direct)", "(none)", b, b)
    };
    u.Oc = function (g) {
        var c = false,
            a, f, d = u.o.ga;
        if (g && "referral" == g.da) {
            a = I(t.d(g.ia));
            for (f = 0; f < d[y]; f++) {
                c = c || C(a, I(d[f]))
            }
        }
        return c
    };
    u.U = function (a) {
        return b != a && a.Fa()
    };
    u.yc = function (c, s) {
        var d = "",
            a = "-",
            g, l, h = 0,
            f, x, o = u.f;
        if (!c) {
            return ""
        }
        x = u.a[t.m] ? u.a[t.m] : "";
        d = u.sc(u.a.location);
        if (u.o.I && c.Jb()) {
            a = c.Ca();
            if (!J(a) && !C(a, ";")) {
                c.Ra();
                return ""
            }
        }
        a = r(x, t.X + o + ".", ";");
        g = u.Fc(d);
        if (u.U(g)) {
            l = r(d, u.o.hb + "=", "&");
            if ("1" == l && !J(a)) {
                return ""
            }
        }
        if (!u.U(g)) {
            g = u.Fb();
            if (!J(a) && u.Nc(g)) {
                return ""
            }
        }
        if (!u.U(g) && s) {
            g = u.Ec();
            if (!J(a) && u.Oc(g)) {
                return ""
            }
        }
        if (!u.U(g)) {
            if (J(a) && s) {
                g = u.zc()
            }
        }
        if (!u.U(g)) {
            return ""
        }
        if (!J(a)) {
            var k = G(a, "."),
                z = new t.n.s;
            z.Cb(k.slice(4).join("."));
            f = I(z.ka()) == I(g.ka());
            h = k[3] * 1
        }
        if (!f || s) {
            var w = r(x, t.r + o + ".", ";"),
                n = w.lastIndexOf("."),
                q = n > 9 ? t.F(w, n + 1) * 1 : 0;
            h++;
            q = 0 == q ? 1 : q;
            c.Xb([o, u.ja, q, h, g.ka()].join("."));
            c.Ra();
            return "&utmcn=1"
        } else {
            return "&utmcr=1"
        }
    }
};
_gat.n.s = function (p, e, q, m, n, f, b) {
    var g = this;
    g.v = p;
    g.ia = e;
    g.ra = q;
    g.L = m;
    g.da = n;
    g.R = f;
    g.vb = b
};
_gat.n.s.prototype.ka = function () {
    var l = this,
        b = _gat,
        m = [],
        f = [
            [b.Wa, l.v],
            [b.Ya, l.ia],
            [b.$a, l.ra],
            [b.Ua, l.L],
            [b.Xa, l.da],
            [b.Za, l.R],
            [b.Va, l.vb]
        ],
        g, e;
    if (l.Fa()) {
        for (g = 0; g < f[b.c]; g++) {
            if (!b.q(f[g][1])) {
                e = f[g][1].split("+").join("%20");
                e = e.split(" ").join("%20");
                b.h(m, f[g][0] + e)
            }
        }
    }
    return m.join("|")
};
_gat.n.s.prototype.Fa = function () {
    var c = this,
        b = _gat.q;
    return !(b(c.v) && b(c.ia) && b(c.ra))
};
_gat.n.s.prototype.Cb = function (f) {
    var b = this,
        g = _gat,
        e = function (a) {
            return g.J(g.C(f, a, "|"))
        };
    b.v = e(g.Wa);
    b.ia = e(g.Ya);
    b.ra = e(g.$a);
    b.L = e(g.Ua);
    b.da = e(g.Xa);
    b.R = e(g.Za);
    b.vb = e(g.Va)
};
_gat.Z = function () {
    var L = this,
        N = _gat,
        M = {},
        I = "k",
        E = "v",
        H = [I, E],
        G = "(",
        t = ")",
        y = "*",
        K = "!",
        F = "'",
        m = {};
    m[F] = "'0";
    m[t] = "'1";
    m[y] = "'2";
    m[K] = "'3";
    var e = 1;

    function J(c, f, d, a) {
        if (N.b == M[c]) {
            M[c] = {}
        }
        if (N.b == M[c][f]) {
            M[c][f] = []
        }
        M[c][f][d] = a
    }
    function b(a, d, c) {
        return N.b != M[a] && N.b != M[a][d] ? M[a][d][c] : N.b
    }
    function v(c, f) {
        if (N.b != M[c] && N.b != M[c][f]) {
            M[c][f] = N.b;
            var d = true,
                a;
            for (a = 0; a < H[N.c]; a++) {
                if (N.b != M[c][H[a]]) {
                    d = false;
                    break
                }
            }
            if (d) {
                M[c] = N.b
            }
        }
    }
    function D(c) {
        var f = "",
            d = false,
            a, g;
        for (a = 0; a < H[N.c]; a++) {
            g = c[H[a]];
            if (N.b != g) {
                if (d) {
                    f += H[a]
                }
                f += C(g);
                d = false
            } else {
                d = true
            }
        }
        return f
    }
    function C(c) {
        var f = [],
            d, a;
        for (a = 0; a < c[N.c]; a++) {
            if (N.b != c[a]) {
                d = "";
                if (a != e && N.b == c[a - 1]) {
                    d += a.toString();
                    d += K
                }
                d += r(c[a]);
                N.h(f, d)
            }
        }
        return G + f.join(y) + t
    }
    function r(c) {
        var f = "",
            d, a, g;
        for (d = 0; d < c[N.c]; d++) {
            a = c.charAt(d);
            g = m[a];
            f += N.b != g ? g : a
        }
        return f
    }
    L.Kc = function (a) {
        return N.b != M[a]
    };
    L.N = function () {
        var a = [],
            c;
        for (c in M) {
            if (N.b != M[c]) {
                N.h(a, c.toString() + D(M[c]))
            }
        }
        return a.join("")
    };
    L.Sc = function (a) {
        if (a == N.b) {
            return L.N()
        }
        var d = [a.N()],
            c;
        for (c in M) {
            if (N.b != M[c] && !a.Kc(c)) {
                N.h(d, c.toString() + D(M[c]))
            }
        }
        return d.join("")
    };
    L._setKey = function (a, d, c) {
        if (typeof c != "string") {
            return false
        }
        J(a, I, d, c);
        return true
    };
    L._setValue = function (a, d, c) {
        if (typeof c != "number" && (N.b == Number || !(c instanceof Number))) {
            return false
        }
        if (Math.round(c) != c || c == NaN || c == Infinity) {
            return false
        }
        J(a, E, d, c.toString());
        return true
    };
    L._getKey = function (a, c) {
        return b(a, I, c)
    };
    L._getValue = function (a, c) {
        return b(a, E, c)
    };
    L._clearKey = function (a) {
        v(a, I)
    };
    L._clearValue = function (a) {
        v(a, E)
    }
};
_gat.ic = function (e, b) {
    var f = this;
    f.jd = b;
    f.Pc = e;
    f._trackEvent = function (c, d, a) {
        return b._trackEvent(f.Pc, c, d, a)
    }
};
_gat.kc = function (Q) {
    var S = this,
        R = _gat,
        N = R.b,
        H = R.q,
        L = R.w,
        K = R.F,
        y = R.C,
        E = R.P,
        P = R.z,
        I = "location",
        t = R.c,
        e = N,
        O = new R.hc,
        b = false;
    S.a = document;
    S.e = window;
    S.ja = Math.round((new Date).getTime() / 1000);
    S.H = Q;
    S.yb = S.a.referrer;
    S.va = N;
    S.j = N;
    S.A = N;
    S.M = false;
    S.aa = N;
    S.rb = "";
    S.l = N;
    S.Ab = N;
    S.f = N;
    S.u = N;

    function D() {
        if ("auto" == O.g) {
            var a = S.a.domain;
            if ("www." == K(a, 0, 4)) {
                a = K(a, 4)
            }
            O.g = a
        }
        O.g = R.T(O.g)
    }
    function G() {
        var a = O.g,
            c = L(a, "www.google.") * L(a, ".google.") * L(a, "google.");
        return c || "/" != O.p || L(a, "google.org") > -1
    }
    function F(a, g, d) {
        if (H(a) || H(g) || H(d)) {
            return "-"
        }
        var f = y(a, R.r + S.f + ".", g),
            c;
        if (!H(f)) {
            c = P(f, ".");
            c[5] = c[5] ? c[5] * 1 + 1 : 1;
            c[3] = c[4];
            c[4] = d;
            f = c.join(".")
        }
        return f
    }
    function v() {
        return "file:" != S.a[I].protocol && G()
    }
    function J(a) {
        if (!a || "" == a) {
            return ""
        }
        while (R.Lb(a.charAt(0))) {
            a = K(a, 1)
        }
        while (R.Lb(a.charAt(a[t] - 1))) {
            a = K(a, 0, a[t] - 1)
        }
        return a
    }
    function C(a, d, c) {
        if (!H(a())) {
            d(R.J(a()));
            if (!E(a(), ";")) {
                c()
            }
        }
    }
    function M(a) {
        var d, c = "" != a && S.a[I].host != a;
        if (c) {
            for (d = 0; d < O.B[t]; d++) {
                c = c && L(R.T(a), R.T(O.B[d])) == -1
            }
        }
        return c
    }
    S.Bc = function () {
        if (!O.g || "" == O.g || "none" == O.g) {
            O.g = "";
            return 1
        }
        D();
        return O.pb ? R.t(O.g) : 1
    };
    S.tc = function (a, d) {
        if (H(a)) {
            a = "-"
        } else {
            d += O.p && "/" != O.p ? O.p : "";
            var c = L(a, d);
            a = c >= 0 && c <= 8 ? "0" : ("[" == a.charAt(0) && "]" == a.charAt(a[t] - 1) ? "-" : a)
        }
        return a
    };
    S.Ia = function (a) {
        var d = "",
            c = S.a;
        d += S.aa ? S.aa.Xc() : "";
        d += O.qa ? S.rb : "";
        d += O.ta && !H(c.title) ? "&utmdt=" + R.d(c.title) : "";
        d += "&utmhid=" + R.uc() + "&utmr=" + S.va + "&utmp=" + S.Tc(a);
        return d
    };
    S.Tc = function (a) {
        var c = S.a[I];
        a = N != a && "" != a ? R.d(a, true) : R.d(c.pathname + unescape(c.search), true);
        return a
    };
    S.$c = function (a) {
        if (S.Q()) {
            var c = "";
            if (S.l != N && S.l.N().length > 0) {
                c += "&utme=" + R.d(S.l.N())
            }
            c += S.Ia(a);
            e.O(c, S.H, S.a, S.f)
        }
    };
    S.qc = function () {
        var a = new R.Y(S.a, O);
        return a.Ha(S.f) ? a.Wc() : N
    };
    S._getLinkerUrl = function (a, g) {
        var d = P(a, "#"),
            f = a,
            c = S.qc();
        if (c) {
            if (g && 1 >= d[t]) {
                f += "#" + c
            } else {
                if (!g || 1 >= d[t]) {
                    if (1 >= d[t]) {
                        f += (E(a, "?") ? "&" : "?") + c
                    } else {
                        f = d[0] + (E(a, "?") ? "&" : "?") + c + "#" + d[1]
                    }
                }
            }
        }
        return f
    };
    S.Zb = function () {
        var a;
        if (S.A && S.A[t] >= 10 && !E(S.A, "=")) {
            S.u.Uc(S.A);
            S.u.cd();
            R._gasoDomain = O.g;
            R._gasoCPath = O.p;
            a = S.a.createElement("script");
            a.type = "text/javascript";
            a.id = "_gasojs";
            a.src = "https://www.google.com/analytics/reporting/overlay_js?gaso=" + S.A + "&" + R.wa();
            S.a.getElementsByTagName("head")[0].appendChild(a)
        }
    };
    S.Jc = function () {
        var k = S.a[R.m],
            f = S.ja,
            d = S.u,
            r = S.f + "",
            o = S.e,
            h = o ? o.gaGlobal : N,
            s, q = E(k, R.r + r + "."),
            m = E(k, R.W + r),
            p = E(k, R.ma + r),
            c, a = [],
            n = "",
            g = false,
            l;
        k = H(k) ? "" : k;
        if (O.I) {
            s = R.Db(S.a[I]);
            if (O.pa && !H(s)) {
                n = s + "&"
            }
            n += S.a[I].search;
            if (!H(n) && E(n, R.r)) {
                d.Rc(n);
                if (!d.Jb()) {
                    d.pc()
                }
                c = d.ya()
            }
            C(d.Ba, d.Wb, d.fc);
            C(d.Aa, d.Na, d.Qa)
        }
        if (!H(c)) {
            if (H(d.K()) || H(d.za())) {
                c = F(n, "&", f);
                S.M = true
            } else {
                a = P(d.K(), ".");
                r = a[0]
            }
        } else {
            if (q) {
                if (!m || !p) {
                    c = F(k, ";", f);
                    S.M = true
                } else {
                    c = y(k, R.r + r + ".", ";");
                    a = P(y(k, R.W + r, ";"), ".")
                }
            } else {
                c = [r, R.Gc(), f, f, f, 1].join(".");
                S.M = true;
                g = true
            }
        }
        c = P(c, ".");
        if (o && h && h.dh == r) {
            c[4] = h.sid ? h.sid : c[4];
            if (g) {
                c[3] = h.sid ? h.sid : c[4];
                if (h.vid) {
                    l = P(h.vid, ".");
                    c[1] = l[0];
                    c[2] = l[1]
                }
            }
        }
        d.Ub(c.join("."));
        a[0] = r;
        a[1] = a[1] ? a[1] : 0;
        a[2] = undefined != a[2] ? a[2] : O.Yc;
        a[3] = a[3] ? a[3] : c[4];
        d.La(a.join("."));
        d.Vb(r);
        if (!H(d.Hc())) {
            d.Ma(d.t())
        }
        d.dc();
        d.Pa();
        d.ec()
    };
    S.Lc = function () {
        e = new R.jc(O)
    };
    S._initData = function () {
        var a;
        if (!b) {
            S.Lc();
            S.f = S.Bc();
            S.u = new R.Y(S.a, O)
        }
        if (v()) {
            S.Jc()
        }
        if (!b) {
            if (v()) {
                S.va = S.tc(S.Ac(), S.a.domain);
                if (O.sa) {
                    S.aa = new R.gc(O.ua);
                    S.aa.xc()
                }
                if (O.qa) {
                    a = new R.n(S.f, S.a, S.va, S.ja, O);
                    S.rb = a.yc(S.u, S.M)
                }
            }
            S.l = new R.Z;
            S.Ab = new R.Z;
            b = true
        }
        if (!R.Hb) {
            S.Mc()
        }
    };
    S._visitCode = function () {
        S._initData();
        var a = y(S.a[R.m], R.r + S.f + ".", ";"),
            c = P(a, ".");
        return c[t] < 4 ? "" : c[1]
    };
    S._cookiePathCopy = function (a) {
        S._initData();
        if (S.u) {
            S.u.bd(S.f, a)
        }
    };
    S.Mc = function () {
        var a = S.a[I].hash,
            c;
        c = a && "" != a && 0 == L(a, "#gaso=") ? y(a, "gaso=", "&") : y(S.a[R.m], R.Sa, ";");
        if (c[t] >= 10) {
            S.A = c;
            if (S.e.addEventListener) {
                S.e.addEventListener("load", S.Zb, false)
            } else {
                S.e.attachEvent("onload", S.Zb)
            }
        }
        R.Hb = true
    };
    S.Q = function () {
        return S._visitCode() % 10000 < O.ha * 100
    };
    S.Vc = function () {
        var a, f, c = S.a.links;
        if (!O.Kb) {
            var d = S.a.domain;
            if ("www." == K(d, 0, 4)) {
                d = K(d, 4)
            }
            O.B.push("." + d)
        }
        for (a = 0; a < c[t] && (O.Ga == -1 || a < O.Ga); a++) {
            f = c[a];
            if (M(f.host)) {
                if (!f.gatcOnclick) {
                    f.gatcOnclick = f.onclick ? f.onclick : S.Qc;
                    f.onclick = function (g) {
                        var h = !this.target || this.target == "_self" || this.target == "_top" || this.target == "_parent";
                        h = h && !S.oc(g);
                        S.ad(g, this, h);
                        return h ? false : (this.gatcOnclick ? this.gatcOnclick(g) : true)
                    }
                }
            }
        }
    };
    S.Qc = function () {};
    S._trackPageview = function (a) {
        if (v()) {
            S._initData();
            if (O.B) {
                S.Vc()
            }
            S.$c(a);
            S.M = false
        }
    };
    S._trackTrans = function () {
        var a = S.f,
            g = [],
            d, f, c, h;
        S._initData();
        if (S.j && S.Q()) {
            for (d = 0; d < S.j.la[t]; d++) {
                f = S.j.la[d];
                R.h(g, f.S());
                for (c = 0; c < f.ca[t]; c++) {
                    R.h(g, f.ca[c].S())
                }
            }
            for (h = 0; h < g[t]; h++) {
                e.O(g[h], S.H, S.a, a, true)
            }
        }
    };
    S._setTrans = function () {
        var a = S.a,
            g, d, f, c, h = a.getElementById ? a.getElementById("utmtrans") : (a.utmform && a.utmform.utmtrans ? a.utmform.utmtrans : N);
        S._initData();
        if (h && h.value) {
            S.j = new R.i;
            c = P(h.value, "UTM:");
            O.G = !O.G || "" == O.G ? "|" : O.G;
            for (g = 0; g < c[t]; g++) {
                c[g] = J(c[g]);
                d = P(c[g], O.G);
                for (f = 0; f < d[t]; f++) {
                    d[f] = J(d[f])
                }
                if ("T" == d[0]) {
                    S._addTrans(d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8])
                } else {
                    if ("I" == d[0]) {
                        S._addItem(d[1], d[2], d[3], d[4], d[5], d[6])
                    }
                }
            }
        }
    };
    S._addTrans = function (a, k, d, f, c, l, h, g) {
        S.j = S.j ? S.j : new R.i;
        return S.j.nb(a, k, d, f, c, l, h, g)
    };
    S._addItem = function (a, h, d, f, c, k) {
        var g;
        S.j = S.j ? S.j : new R.i;
        g = S.j.xa(a);
        if (!g) {
            g = S._addTrans(a, "", "", "", "", "", "", "")
        }
        g.mb(h, d, f, c, k)
    };
    S._setVar = function (a) {
        if (a && "" != a && G()) {
            S._initData();
            var d = new R.Y(S.a, O),
                c = S.f;
            d.Na(c + "." + R.d(a));
            d.Qa();
            if (S.Q()) {
                e.O("&utmt=var", S.H, S.a, S.f)
            }
        }
    };
    S._link = function (a, c) {
        if (O.I && a) {
            S._initData();
            S.a[I].href = S._getLinkerUrl(a, c)
        }
    };
    S._linkByPost = function (a, c) {
        if (O.I && a && a.action) {
            S._initData();
            a.action = S._getLinkerUrl(a.action, c)
        }
    };
    S._setXKey = function (a, d, c) {
        S.l._setKey(a, d, c)
    };
    S._setXValue = function (a, d, c) {
        S.l._setValue(a, d, c)
    };
    S._getXKey = function (a, c) {
        return S.l._getKey(a, c)
    };
    S._getXValue = function (a, c) {
        return S.l.getValue(a, c)
    };
    S._clearXKey = function (a) {
        S.l._clearKey(a)
    };
    S._clearXValue = function (a) {
        S.l._clearValue(a)
    };
    S._createXObj = function () {
        S._initData();
        return new R.Z
    };
    S._sendXEvent = function (a) {
        var c = "";
        S._initData();
        if (S.Q()) {
            c += "&utmt=event&utme=" + R.d(S.l.Sc(a)) + S.Ia();
            e.O(c, S.H, S.a, S.f, false, true)
        }
    };
    S._createEventTracker = function (a) {
        S._initData();
        return new R.ic(a, S)
    };
    S._trackEvent = function (a, g, d, f) {
        var c = true,
            h = S.Ab;
        if (N != a && N != g && "" != a && "" != g) {
            h._clearKey(5);
            h._clearValue(5);
            c = h._setKey(5, 1, a) ? c : false;
            c = h._setKey(5, 2, g) ? c : false;
            c = N == d || h._setKey(5, 3, d) ? c : false;
            c = N == f || h._setValue(5, 1, f) ? c : false;
            if (c) {
                S._sendXEvent(h)
            }
        } else {
            c = false
        }
        return c
    };
    S.ad = function (a, g, d) {
        S._initData();
        if (S.Q()) {
            var f = new R.Z;
            f._setKey(6, 1, g.href);
            var c = d ?
            function () {
                S.rc(a, g)
            } : undefined;
            e.O("&utmt=event&utme=" + R.d(f.N()) + S.Ia(), S.H, S.a, S.f, false, true, c)
        }
    };
    S.rc = function (a, d) {
        if (!a) {
            a = S.e.event
        }
        var c = true;
        if (d.gatcOnclick) {
            c = d.gatcOnclick(a)
        }
        if (c || typeof c == "undefined") {
            if (!d.target || d.target == "_self") {
                S.e.location = d.href
            } else {
                if (d.target == "_top") {
                    S.e.top.document.location = d.href
                } else {
                    if (d.target == "_parent") {
                        S.e.parent.document.location = d.href
                    }
                }
            }
        }
    };
    S.oc = function (a) {
        if (!a) {
            a = S.e.event
        }
        var c = a.shiftKey || a.ctrlKey || a.altKey;
        if (!c) {
            if (a.modifiers && S.e.Event) {
                c = a.modifiers & S.e.Event.CONTROL_MASK || a.modifiers & S.e.Event.SHIFT_MASK || a.modifiers & S.e.Event.ALT_MASK
            }
        }
        return c
    };
    S._setDomainName = function (a) {
        O.g = a
    };
    S.dd = function () {
        return O.g
    };
    S._addOrganic = function (a, c) {
        R.h(O.fa, new R.cb(a, c))
    };
    S._clearOrganic = function () {
        O.fa = []
    };
    S.hd = function () {
        return O.fa
    };
    S._addIgnoredOrganic = function (a) {
        R.h(O.ea, a)
    };
    S._clearIgnoredOrganic = function () {
        O.ea = []
    };
    S.ed = function () {
        return O.ea
    };
    S._addIgnoredRef = function (a) {
        R.h(O.ga, a)
    };
    S._clearIgnoredRef = function () {
        O.ga = []
    };
    S.fd = function () {
        return O.ga
    };
    S._setAllowHash = function (a) {
        O.pb = a ? 1 : 0
    };
    S._setCampaignTrack = function (a) {
        O.qa = a ? 1 : 0
    };
    S._setClientInfo = function (a) {
        O.sa = a ? 1 : 0
    };
    S._getClientInfo = function () {
        return O.sa
    };
    S._setCookiePath = function (a) {
        O.p = a
    };
    S._setTransactionDelim = function (a) {
        O.G = a
    };
    S._setCookieTimeout = function (a) {
        O.wb = a
    };
    S._setDetectFlash = function (a) {
        O.ua = a ? 1 : 0
    };
    S._getDetectFlash = function () {
        return O.ua
    };
    S._setDetectTitle = function (a) {
        O.ta = a ? 1 : 0
    };
    S._getDetectTitle = function () {
        return O.ta
    };
    S._setLocalGifPath = function (a) {
        O.Da = a
    };
    S._getLocalGifPath = function () {
        return O.Da
    };
    S._setLocalServerMode = function () {
        O.D = 0
    };
    S._setRemoteServerMode = function () {
        O.D = 1
    };
    S._setLocalRemoteServerMode = function () {
        O.D = 2
    };
    S.gd = function () {
        return O.D
    };
    S._getServiceMode = function () {
        return O.D
    };
    S._setSampleRate = function (a) {
        O.ha = a
    };
    S._setSessionTimeout = function (a) {
        O.Tb = a
    };
    S._setAllowLinker = function (a) {
        O.I = a ? 1 : 0
    };
    S._setAllowAnchor = function (a) {
        O.pa = a ? 1 : 0
    };
    S._setCampNameKey = function (a) {
        O.db = a
    };
    S._setCampContentKey = function (a) {
        O.eb = a
    };
    S._setCampIdKey = function (a) {
        O.fb = a
    };
    S._setCampMediumKey = function (a) {
        O.gb = a
    };
    S._setCampNOKey = function (a) {
        O.hb = a
    };
    S._setCampSourceKey = function (a) {
        O.ib = a
    };
    S._setCampTermKey = function (a) {
        O.jb = a
    };
    S._setCampCIdKey = function (a) {
        O.kb = a
    };
    S._getAccount = function () {
        return S.H
    };
    S._getVersion = function () {
        return _gat.lb
    };
    S.kd = function (a) {
        O.B = [];
        if (a) {
            O.B = a
        }
    };
    S.md = function (a) {
        O.Kb = a
    };
    S.ld = function (a) {
        O.Ga = a
    };
    S._setReferrerOverride = function (a) {
        S.yb = a
    };
    S.Ac = function () {
        return S.yb
    }
};
_gat._getTracker = function (c) {
    var b = new _gat.kc(c);
    return b
};
var GA = {
    vars_to_set_later: [],
    setPendingVars: function () {
        while (GA.vars_to_set_later.length) {
            var a = GA.vars_to_set_later.pop();
            GA.pageTracker._setVar(a)
        }
    },
    setVar: function (a) {
        if (GA.pageTracker) {
            GA.pageTracker._setVar(a)
        } else {
            GA.vars_to_set_later.push(a)
        }
    }
};
var FlashDetect = new function () {
        var a = this;
        a.installed = false;
        a.raw = "";
        a.major = -1;
        a.minor = -1;
        a.revision = -1;
        a.revisionStr = "";
        var b = [{
            name: "ShockwaveFlash.ShockwaveFlash.7",
            version: function (h) {
                return d(h)
            }
        }, {
            name: "ShockwaveFlash.ShockwaveFlash.6",
            version: function (l) {
                var h = "6,0,21";
                try {
                    l.AllowScriptAccess = "always";
                    h = d(l)
                } catch (k) {}
                return h
            }
        }, {
            name: "ShockwaveFlash.ShockwaveFlash",
            version: function (h) {
                return d(h)
            }
        }];
        var d = function (l) {
                var h = -1;
                try {
                    h = l.GetVariable("$version")
                } catch (k) {}
                return h
            };
        var g = function (h) {
                var l = -1;
                try {
                    l = new ActiveXObject(h)
                } catch (k) {
                    l = {
                        activeXError: true
                    }
                }
                return l
            };
        var c = function (k) {
                var h = k.split(",");
                return {
                    raw: k,
                    major: parseInt(h[0].split(" ")[1], 10),
                    minor: parseInt(h[1], 10),
                    revision: parseInt(h[2], 10),
                    revisionStr: h[2]
                }
            };
        var f = function (m) {
                var k = m.split(/ +/);
                var l = k[2].split(/\./);
                var h = k[3];
                return {
                    raw: m,
                    major: parseInt(l[0], 10),
                    minor: parseInt(l[1], 10),
                    revisionStr: h,
                    revision: e(h)
                }
            };
        var e = function (h) {
                return parseInt(h.replace(/[a-zA-Z]/g, ""), 10) || a.revision
            };
        a.majorAtLeast = function (h) {
            return a.major >= h
        };
        a.minorAtLeast = function (h) {
            return a.minor >= h
        };
        a.revisionAtLeast = function (h) {
            return a.revision >= h
        };
        a.versionAtLeast = function (k) {
            var l = [a.major, a.minor, a.revision];
            var h = Math.min(l.length, arguments.length);
            for (i = 0; i < h; i++) {
                if (l[i] >= arguments[i]) {
                    if (i + 1 < h && l[i] == arguments[i]) {
                        continue
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            }
        };
        a.FlashDetect = function () {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var m = "application/x-shockwave-flash";
                var l = navigator.mimeTypes;
                if (l && l[m] && l[m].enabledPlugin && l[m].enabledPlugin.description) {
                    var h = l[m].enabledPlugin.description;
                    var n = f(h);
                    a.raw = n.raw;
                    a.major = n.major;
                    a.minor = n.minor;
                    a.revisionStr = n.revisionStr;
                    a.revision = n.revision;
                    a.installed = true
                }
            } else {
                if (navigator.appVersion.indexOf("Mac") == -1 && window.execScript) {
                    var h = -1;
                    for (var k = 0; k < b.length && h == -1; k++) {
                        var o = g(b[k].name);
                        if (!o.activeXError) {
                            a.installed = true;
                            h = b[k].version(o);
                            if (h != -1) {
                                var n = c(h);
                                a.raw = n.raw;
                                a.major = n.major;
                                a.minor = n.minor;
                                a.revision = n.revision;
                                a.revisionStr = n.revisionStr
                            }
                        }
                    }
                }
            }
        }()
    };
FlashDetect.JS_RELEASE = "1.0.4";
(function (c) {
    var g, f = {},
        p = {
            16: false,
            18: false,
            17: false,
            91: false
        },
        d = "all",
        a = {
            "â‡§": 16,
            shift: 16,
            "âŒ¥": 18,
            alt: 18,
            option: 18,
            "âŒƒ": 17,
            ctrl: 17,
            control: 17,
            "âŒ˜": 91,
            command: 91
        },
        q = {
            backspace: 8,
            tab: 9,
            clear: 12,
            enter: 13,
            "return": 13,
            esc: 27,
            escape: 27,
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            del: 46,
            "delete": 46,
            home: 36,
            end: 35,
            pageup: 33,
            pagedown: 34,
            ",": 188,
            ".": 190,
            "/": 191,
            "`": 192,
            "-": 189,
            "=": 187,
            ";": 186,
            "'": 222,
            "[": 219,
            "]": 221,
            "\\": 220
        };
    for (g = 1; g < 20; g++) {
        q["f" + g] = 111 + g
    }
    function n(t, s) {
        var k = t.length;
        while (k--) {
            if (t[k] === s) {
                return k
            }
        }
        return -1
    }
    function o(x) {
        var v, u, y, w, s, t, z;
        y = x.target || x.srcElement;
        u = y.tagName;
        v = x.keyCode;
        if (v == 93 || v == 224) {
            v = 91
        }
        if (v in p) {
            p[v] = true;
            for (s in a) {
                if (a[s] == v) {
                    b[s] = true
                }
            }
            return
        }
        if (u == "INPUT" || u == "SELECT" || u == "TEXTAREA") {
            if (["submit", "button"].indexOf(y.type) == -1) {
                if (v != q.escape && v != q.tab) {
                    return
                }
            }
        }
        if (!(v in f)) {
            return
        }
        for (t = 0; t < f[v].length; t++) {
            w = f[v][t];
            if (w.scope == d || w.scope == "all") {
                z = w.mods.length > 0;
                for (s in p) {
                    if ((!p[s] && n(w.mods, +s) > -1) || (p[s] && n(w.mods, +s) == -1)) {
                        z = false
                    }
                }
                if ((w.mods.length == 0 && !p[16] && !p[18] && !p[17] && !p[91]) || z) {
                    if (w.method(x, w) === false) {
                        if (x.preventDefault) {
                            x.preventDefault()
                        } else {
                            x.returnValue = false
                        }
                        if (x.stopPropagation) {
                            x.stopPropagation()
                        }
                        if (x.cancelBubble) {
                            x.cancelBubble = true
                        }
                    }
                }
            }
        }
    }
    function e(u) {
        var t = u.keyCode,
            s;
        if (t == 93 || t == 224) {
            t = 91
        }
        if (t in p) {
            p[t] = false;
            for (s in a) {
                if (a[s] == t) {
                    b[s] = false
                }
            }
        }
    }
    function r() {
        for (g in p) {
            if (p.hasOwnProperty(g)) {
                p[g] = false
            }
        }
    }
    function b(t, u, x) {
        var w, v, s, k;
        if (x === undefined) {
            x = u;
            u = "all"
        }
        t = t.replace(/\s/g, "");
        w = t.split(",");
        if ((w[w.length - 1]) == "") {
            w[w.length - 2] += ","
        }
        for (s = 0; s < w.length; s++) {
            v = [];
            t = w[s].split("+");
            if (t.length > 1) {
                v = t.slice(0, t.length - 1);
                for (k = 0; k < v.length; k++) {
                    v[k] = a[v[k]]
                }
                t = [t[t.length - 1]]
            }
            t = t[0];
            t = q[t] || t.toUpperCase().charCodeAt(0);
            if (!(t in f)) {
                f[t] = []
            }
            f[t].push({
                shortcut: w[s],
                scope: u,
                method: x,
                key: w[s],
                mods: v
            })
        }
    }
    for (g in a) {
        b[g] = false
    }
    function l(k) {
        d = k || "all"
    }
    function m() {
        return d
    }
    function h(k, s, t) {
        if (k.addEventListener) {
            k.addEventListener(s, t, false)
        } else {
            if (k.attachEvent) {
                k.attachEvent("on" + s, function () {
                    t(window.event)
                })
            }
        }
    }
    h(document, "keydown", o);
    h(document, "keyup", e);
    h(window, "focus", r);
    c.key = b;
    c.key.setScope = l;
    c.key.getScope = m;
    if (typeof module !== "undefined") {
        module.exports = key
    }
})(this);
window.Modernizr = function (aq, ap, ao) {
    function O() {
        am.input = function (e) {
            for (var d = 0, f = e.length; d < f; d++) {
                U[e[d]] = e[d] in af
            }
            return U
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), am.inputtypes = function (b) {
            for (var m = 0, l, k, g, c = b.length; m < c; m++) {
                af.setAttribute("type", k = b[m]), l = af.type !== "text", l && (af.value = ae, af.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(k) && af.style.WebkitAppearance !== ao ? (ak.appendChild(af), g = ap.defaultView, l = g.getComputedStyle && g.getComputedStyle(af, null).WebkitAppearance !== "textfield" && af.offsetHeight !== 0, ak.removeChild(af)) : /^(search|tel)$/.test(k) || (/^(url|email)$/.test(k) ? l = af.checkValidity && af.checkValidity() === !1 : /^color$/.test(k) ? (ak.appendChild(af), ak.offsetWidth, l = af.value != ae, ak.removeChild(af)) : l = af.value != ae)), W[b[m]] = !! l
            }
            return W
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }
    function S(f, e) {
        var h = f.charAt(0).toUpperCase() + f.substr(1),
            g = (f + " " + aa.join(h + " ") + h).split(" ");
        return V(g, e)
    }
    function V(e, c) {
        for (var f in e) {
            if (ag[e[f]] !== ao) {
                return c == "pfx" ? e[f] : !0
            }
        }
        return !1
    }
    function X(d, c) {
        return !!~ ("" + d).indexOf(c)
    }
    function Z(d, c) {
        return typeof d === c
    }
    function ab(d, c) {
        return I(ac.join(d + ";") + (c || ""))
    }
    function I(b) {
        ag.cssText = b
    }
    var an = "2.0.6",
        am = {},
        al = !0,
        ak = ap.documentElement,
        aj = ap.head || ap.getElementsByTagName("head")[0],
        ai = "modernizr",
        ah = ap.createElement(ai),
        ag = ah.style,
        af = ap.createElement("input"),
        ae = ":)",
        ad = Object.prototype.toString,
        ac = " -webkit- -moz- -o- -ms- -khtml- ".split(" "),
        aa = "Webkit Moz O ms Khtml".split(" "),
        Y = {},
        W = {},
        U = {},
        R = [],
        Q = function (b, q, p, o) {
            var n, m, l, g = ap.createElement("div");
            if (parseInt(p, 10)) {
                while (p--) {
                    l = ap.createElement("div"), l.id = o ? o[p] : ai + (p + 1), g.appendChild(l)
                }
            }
            n = ["&shy;", "<style>", b, "</style>"].join(""), g.id = ai, g.innerHTML += n, ak.appendChild(g), m = q(g, b), g.parentNode.removeChild(g);
            return !!m
        },
        N = function () {
            function c(h, g) {
                g = g || ap.createElement(b[h] || "div"), h = "on" + h;
                var a = h in g;
                a || (g.setAttribute || (g = ap.createElement("div")), g.setAttribute && g.removeAttribute && (g.setAttribute(h, ""), a = Z(g[h], "function"), Z(g[h], ao) || (g[h] = ao), g.removeAttribute(h))), g = null;
                return a
            }
            var b = {
                select: "input",
                change: "input",
                submit: "form",
                reset: "form",
                error: "img",
                load: "img",
                abort: "img"
            };
            return c
        }(),
        M, K = {}.hasOwnProperty,
        J;
    !Z(K, ao) && !Z(K.call, ao) ? J = function (d, c) {
        return K.call(d, c)
    } : J = function (d, c) {
        return c in d && Z(d.constructor.prototype[c], ao)
    };
    var P = function (b, h) {
            var g = b.join(""),
                e = h.length;
            Q(g, function (f, o) {
                var n = ap.styleSheets[ap.styleSheets.length - 1],
                    m = n.cssRules && n.cssRules[0] ? n.cssRules[0].cssText : n.cssText || "",
                    l = f.childNodes,
                    k = {};
                while (e--) {
                    k[l[e].id] = l[e]
                }
                am.csstransforms3d = k.csstransforms3d.offsetLeft === 9, am.generatedcontent = k.generatedcontent.offsetHeight >= 1, am.fontface = /src/i.test(m) && m.indexOf(o.split(" ")[0]) === 0
            }, e, h)
        }(['@font-face {font-family:"font";src:url("https://")}', ["@media (", ac.join("transform-3d),("), ai, ")", "{#csstransforms3d{left:9px;position:absolute}}"].join(""), ['#generatedcontent:after{content:"', ae, '";visibility:hidden}'].join("")], ["fontface", "csstransforms3d", "generatedcontent"]);
    Y.flexbox = function () {
        function l(f, e, n, m) {
            f.style.cssText = ac.join(e + ":" + n + ";") + (m || "")
        }
        function b(f, e, n, m) {
            e += ":", f.style.cssText = (e + ac.join(n + ";" + e)).slice(0, -e.length) + (m || "")
        }
        var k = ap.createElement("div"),
            h = ap.createElement("div");
        b(k, "display", "box", "width:42px;padding:0;"), l(h, "box-flex", "1", "width:10px;"), k.appendChild(h), ak.appendChild(k);
        var g = h.offsetWidth === 42;
        k.removeChild(h), ak.removeChild(k);
        return g
    }, Y.canvas = function () {
        var b = ap.createElement("canvas");
        return !!b.getContext && !! b.getContext("2d")
    }, Y.canvastext = function () {
        return !!am.canvas && !! Z(ap.createElement("canvas").getContext("2d").fillText, "function")
    }, Y.postmessage = function () {
        return !!aq.postMessage
    }, Y.websqldatabase = function () {
        var a = !! aq.openDatabase;
        return a
    }, Y.indexedDB = function () {
        for (var a = -1, d = aa.length; ++a < d;) {
            if (aq[aa[a].toLowerCase() + "IndexedDB"]) {
                return !0
            }
        }
        return !!aq.indexedDB
    }, Y.hashchange = function () {
        return N("hashchange", aq) && (ap.documentMode === ao || ap.documentMode > 7)
    }, Y.history = function () {
        return !!aq.history && !! history.pushState
    }, Y.draganddrop = function () {
        return N("dragstart") && N("drop")
    }, Y.websockets = function () {
        for (var a = -1, d = aa.length; ++a < d;) {
            if (aq[aa[a] + "WebSocket"]) {
                return !0
            }
        }
        return "WebSocket" in aq
    }, Y.rgba = function () {
        I("background-color:rgba(150,255,150,.5)");
        return X(ag.backgroundColor, "rgba")
    }, Y.hsla = function () {
        I("background-color:hsla(120,40%,100%,.5)");
        return X(ag.backgroundColor, "rgba") || X(ag.backgroundColor, "hsla")
    }, Y.multiplebgs = function () {
        I("background:url(https://),url(https://),red url(https://)");
        return /(url\s*\(.*?){3}/.test(ag.background)
    }, Y.backgroundsize = function () {
        return S("backgroundSize")
    }, Y.borderimage = function () {
        return S("borderImage")
    }, Y.borderradius = function () {
        return S("borderRadius")
    }, Y.boxshadow = function () {
        return S("boxShadow")
    }, Y.textshadow = function () {
        return ap.createElement("div").style.textShadow === ""
    }, Y.opacity = function () {
        ab("opacity:.55");
        return /^0.55$/.test(ag.opacity)
    }, Y.cssanimations = function () {
        return S("animationName")
    }, Y.csscolumns = function () {
        return S("columnCount")
    }, Y.cssgradients = function () {
        var e = "background-image:",
            d = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
            f = "linear-gradient(left top,#9f9, white);";
        I((e + ac.join(d + e) + ac.join(f + e)).slice(0, -e.length));
        return X(ag.backgroundImage, "gradient")
    }, Y.cssreflections = function () {
        return S("boxReflect")
    }, Y.csstransforms = function () {
        return !!V(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])
    }, Y.csstransforms3d = function () {
        var b = !! V(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]);
        b && "webkitPerspective" in ak.style && (b = am.csstransforms3d);
        return b
    }, Y.csstransitions = function () {
        return S("transitionProperty")
    }, Y.fontface = function () {
        return am.fontface
    }, Y.generatedcontent = function () {
        return am.generatedcontent
    }, Y.video = function () {
        var b = ap.createElement("video"),
            h = !1;
        try {
            if (h = !! b.canPlayType) {
                h = new Boolean(h), h.ogg = b.canPlayType('video/ogg; codecs="theora"');
                var g = 'video/mp4; codecs="avc1.42E01E';
                h.h264 = b.canPlayType(g + '"') || b.canPlayType(g + ', mp4a.40.2"'), h.webm = b.canPlayType('video/webm; codecs="vp8, vorbis"')
            }
        } catch (f) {}
        return h
    }, Y.audio = function () {
        var b = ap.createElement("audio"),
            f = !1;
        try {
            if (f = !! b.canPlayType) {
                f = new Boolean(f), f.ogg = b.canPlayType('audio/ogg; codecs="vorbis"'), f.mp3 = b.canPlayType("audio/mpeg;"), f.wav = b.canPlayType('audio/wav; codecs="1"'), f.m4a = b.canPlayType("audio/x-m4a;") || b.canPlayType("audio/aac;")
            }
        } catch (e) {}
        return f
    }, Y.localstorage = function () {
        try {
            return !!localStorage.getItem
        } catch (b) {
            return !1
        }
    }, Y.sessionstorage = function () {
        try {
            return !!sessionStorage.getItem
        } catch (b) {
            return !1
        }
    }, Y.webworkers = function () {
        return !!aq.Worker
    }, Y.applicationcache = function () {
        return !!aq.applicationCache
    };
    for (var L in Y) {
        J(Y, L) && (M = L.toLowerCase(), am[M] = Y[L](), R.push((am[M] ? "" : "no-") + M))
    }
    am.input || O(), I(""), ah = af = null, am._version = an, am._prefixes = ac, am._domPrefixes = aa, am.hasEvent = N, am.testProp = function (b) {
        return V([b])
    }, am.testAllProps = S, am.testStyles = Q, ak.className = ak.className.replace(/\bno-js\b/, "") + (al ? " js " + R.join(" ") : "");
    return am
}(this, this.document);
var HTML = Class.create({
    initialize: function (a) {
        if (a instanceof HTML) {
            return a
        }
        this._str_DONT_TOUCH = a
    },
    toHTML: function () {
        return this._str_DONT_TOUCH
    },
    toString: function () {
        return "[object HTML]"
    }
});
(function () {
    var b = {};
    HTML.tmpl = function a(k, h) {
        var g = !/\W/.test(k) ? b[k] = b[k] || a(document.getElementById(k).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + k.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\tattr=(.*?)%>/g, "',HTML.quoteattr($1).toHTML(),'").replace(/\thtml=(.*?)%>/g, "',HTML.escape($1).toHTML(),'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return new HTML(p.join(''));");
        return h ? g(h) : g
    };
    var f = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@. _-(),$~%#[]{}!^";
    var e = {};
    for (var c = 0; c < f.length; c++) {
        e[f[c]] = f[c]
    }
    function d(k) {
        k = "" + k;
        var g = new Array(k.length);
        for (var h = 0; h < k.length; h++) {
            g[h] = e[k[h]] || ("&#" + k.charCodeAt(h) + ";")
        }
        return new HTML(g.join(""))
    }
    HTML.escape = HTML.quoteattr = function (g) {
        return (Object.isString(g) || Object.isNumber(g)) ? d(g) : g
    }
})();
document.observe("dom:loaded", function () {
    for (var a in Prototype.Browser) {
        if (Prototype.Browser[a]) {
            $(document.body).addClassName(a.toLowerCase())
        }
    }
});
Function.prototype.defer = Function.prototype.defer.wrap(function (b) {
    var a = $A(arguments).slice(1);
    this.__tb__ = get_stack_rep();
    b.apply(this, a)
});
String.prototype.evalScripts = String.prototype.evalScripts.wrap(function (b) {
    var a = $A(arguments).slice(1);
    try {
        b.apply(this, a)
    } catch (c) {
        assert(0, c.toString())
    }
});
Function.prototype.stop_calls_at = function (a) {
    var b = this;
    return function () {
        if (a-- > 0) {
            return b.apply(this, arguments)
        }
    }
};
Function.prototype.cached = function (a) {
    var b = Math.random();
    var c = this;
    return function () {
        var d = Jcached.get(b);
        if (d !== false) {
            return d
        }
        d = c();
        Jcached.set(b, d, a);
        return d
    }
};
Function.prototype.shield = function () {
    var a = this.bind.apply(this, arguments);
    return function () {
        return a()
    }
};
Array.prototype.sort_by_key = function (a, b) {
    if (!b) {
        b = -1
    }
    return this.sort(function (c, d) {
        c = a(c);
        d = a(d);
        if (c < d) {
            return b * -1
        } else {
            if (c > d) {
                return b * 1
            } else {
                return 0
            }
        }
    })
};
Array.prototype.contains = function (a) {
    return this.indexOf(a) != -1
};
Array.prototype.remove = function (b, a) {
    a = a || b + 1;
    this.splice(b, a - b)
};
Array.prototype.removeItem = function (b) {
    var a = this.indexOf(b);
    return a >= 0 ? this.remove(a) : false
};
Array.prototype.dict_by = function (b) {
    var c = {};
    for (var d = 0, a = this.length; d < a; d += 1) {
        c[this[d][b]] = this[d]
    }
    return c
};
String.prototype.widthSplit = function (d) {
    d = d || 15;
    var a = [];
    var c = this;
    var e = 0;
    var b = c.substring(e, e + d);
    while (b !== "") {
        a.push(b);
        e += d;
        b = c.substring(e, e + d)
    }
    return a
};
Object.extend(Effect.Transitions, {
    EaseIn: function (a) {
        return Math.pow(a, 2)
    },
    EaseOut: function (a) {
        return Math.pow(a, 0.5)
    }
});
(function () {
    var a = function (g) {
            g = HTML.escape(g);
            if (Object.isArray(g)) {
                var e = [];
                for (var c = 0; c < g.length; c++) {
                    var f = HTML.escape(g[c]);
                    if (!(f instanceof HTML)) {
                        throw new Error("Element#insert and Element#update can only take arrays of HTML objects and strings.")
                    }
                    e.push(f.toHTML())
                }
                g = new HTML(e.join(""))
            }
            if (g) {
                var b = ["top", "bottom", "before", "after"];
                for (var d = 0; d < b.length; d++) {
                    var h = g[b[d]];
                    if (h) {
                        g[b[d]] = arguments.callee(h)
                    }
                }
            }
            return g
        };
    Element.addMethods({
        db_observe: function (c, b, d) {
            return c.observe(b, function (f) {
                d(f, c)
            })
        },
        smoothScrollIntoView: function (e, d) {
            d = d || {};
            var k = {
                duration: 0.3,
                offset: 0,
                padding: 0,
                transition: Effect.Transitions.EaseOut
            };
            d = Object.extend(k, d);
            var b = e.viewportOffset(e),
                c = e.getDimensions(),
                g = document.viewport.getDimensions(),
                f = d.padding || 0;
            if (b.top > f && (b.top + c.height) < (g.height - f)) {
                return
            }
            var h;
            if (b.top < f) {
                h = -1 * Math.floor(g.height / 4)
            } else {
                h = -1 * Math.floor(3 * g.height / 4)
            }
            d.offset = d.offset || h;
            new Effect.ScrollTo(e, d)
        },
        __sert: function (b, c) {
            return Element.insert(b, a(c))
        },
        __date: function (b, c) {
            return Element.update(b, a(c))
        },
        __place: function (b, c) {
            return Element.replace(b, a(c))
        }
    })
})();

function _dom_trackActiveElement(a) {
    if (a && a.target) {
        try {
            document.activeElement = a.target == document ? null : a.target
        } catch (b) {}
    }
}
function _dom_trackActiveElementLost(a) {
    try {
        document.activeElement = null
    } catch (b) {}
}
if (document.addEventListener) {
    document.addEventListener("focus", _dom_trackActiveElement, true);
    document.addEventListener("blur", _dom_trackActiveElementLost, true)
}
String.prototype.lpad = function (b, a) {
    var c = this;
    a = a || "0";
    while (c.length < b) {
        c = a + c
    }
    return c.toString()
};
String.prototype.pad_nums = function () {
    return this.replace(/(\d+)/, function (a) {
        return a.lpad(10)
    })
};
String.prototype.reverse = function () {
    var a = this.split("");
    var c = a.reverse();
    var b = c.join("");
    return b
};
String.prototype.replace_last = function (e, a) {
    var d = this.reverse();
    var c = e.reverse();
    var b = a.reverse();
    return d.replace(c, b).reverse()
};
String.prototype.create = function (a) {
    return a
};
String.prototype.count = function (a) {
    return (this.length - this.gsub(a, "").length) / a.length
};
var _EXTENSION_REGEX = /^\.[a-zA-Z0-9]$/;
String.prototype.snippet = function (g, e) {
    if (g === undefined) {
        g = 50
    }
    if (e === undefined) {
        e = 0.75
    }
    if (this.length <= g) {
        return this
    }
    var b = "";
    var a = this.lastIndexOf(".");
    if (this.length - a > 5) {
        a = -1
    }
    if (a > 0) {
        b = this.substr(a);
        if (_EXTENSION_REGEX.match(b)) {
            g = g - b.length
        } else {
            a = this.length;
            b = ""
        }
    } else {
        a = this.length;
        b = ""
    }
    g = g - this.create("...").length;
    var f = g * e;
    if (!(this instanceof Emstring)) {
        f = Math.floor(f)
    }
    var h = g - f;
    var c = a - h;
    var d = this.substr(0, f);
    var k = this.substr(c, h);
    return d + "..." + k + b
};
String.prototype.em_snippet = function (a, b) {
    return new Emstring(this).snippet(a, b).toString()
};
String.prototype.repeat = function (a) {
    return (new Array(a + 1)).join(this)
};
String.prototype.title = function () {
    return this.charAt(0).toUpperCase() + this.substr(1)
};
Effect.BlindFadeUp = function (d, c) {
    var b, a;
    b = new Effect.BlindUp(d, c);
    a = new Effect.Fade(d, c);
    this.cancel = function () {
        b.cancel();
        a.cancel()
    }
};
Effect.BlindFadeDown = function (d, c) {
    var b, a;
    b = new Effect.BlindDown(d, c);
    a = new Effect.Appear(d, c);
    this.cancel = function () {
        b.cancel();
        a.cancel()
    }
};
Effect.Flash = function (c, b, a) {
    assert(b.startcolor && b.endcolor, "Start and end colors must be specified");
    assert(b.cycles, "Fade cycles must be specified");
    a = a || 0;
    new Effect.Highlight(c, {
        duration: 1,
        startcolor: b.startcolor,
        endcolor: b.endcolor,
        restorecolor: b.endcolor,
        afterFinish: function () {
            new Effect.Highlight(c, {
                duration: 1,
                startcolor: b.endcolor,
                endcolor: b.startcolor,
                restorecolor: b.startcolor,
                afterFinish: function () {
                    if (a < b.cycles) {
                        Effect.Flash(c, b, a + 1)
                    }
                }
            })
        }
    })
};
Ajax.DBRequest = Class.create(Ajax.Request, {
    initialize: function ($super, c, b) {
        this.start_time = Util.time();
        b = b || {};
        b.method = "post";
        b.parameters = b.parameters || {};
        b.parameters.t = Constants.TOKEN;
        var e = b.cleanUp ||
        function (h) {};
        if (b.job) {
            this.job_id = Util.nonce();
            b.parameters.job_id = this.job_id;
            ProgressWatcher.watch(this)
        }
        if (!b.no_watch) {
            RequestWatcher.watch(this, !! b.job)
        }
        var d = b.onFailure;
        var g = b.onSuccess;
        var f = b.onComplete;
        b.onFailure = function (k) {
            if (Job.handled(k.request.job_id)) {
                return
            }
            if (!b.noAutonotify) {
                var l;
                if (!Constants.IS_PROD && k.status === 500 && k.getHeader("X-Debug-Url")) {
                    var h = k.getHeader("X-Debug-Url");
                    l = _("There was a problem completing this request.") + ' <a href="' + h + '">View debug</a>'
                }
                Notify.server_error(l)
            }
            e(false);
            if (d) {
                d(k)
            }
            if ([404, 502].contains(k.status)) {
                assert(false, "Ajax " + k.status + " on " + k.request.url)
            }
        };
        b.onSuccess = function (h) {
            WIT._record("AJAX", "load", h.request.url, {
                time: new Date().getTime() - h.request.start_time
            });
            if (Job.handled(h.request.job_id)) {
                return
            }
            TranslationSuggest.update_i18n_messages_from_req(h);
            if (typeof (QueryLog) !== "undefined") {
                QueryLog.update_query_log_from_req(h)
            }
            if (!h.responseText.length) {
                if (!b.job) {
                    if (!b.noAutonotify) {
                        if (!h || h.status !== 0) {
                            Notify.server_error()
                        }
                    }
                    if (d) {
                        d(h)
                    }
                }
            } else {
                if (h.responseText.indexOf("err:") === 0) {
                    if (!b.noAutonotify) {
                        Notify.server_error(h.responseText.substr(4))
                    }
                    if (d) {
                        d(h)
                    }
                } else {
                    if (g) {
                        if (h.responseText.indexOf("ok:") === 0) {
                            Notify.server_success(h.responseText.substr(3))
                        }
                        g(h)
                    }
                    if (f) {
                        f(h)
                    }
                }
            }
            e(true)
        };
        b.onException = function (k, l) {
            if (window.console) {
                throw l
            }
            var m = "Error with AJAX callback for: " + c + " :::: " + l.toString();
            var h = get_stack_rep();
            h.pop();
            global_report_exception(m, window.location.href, "", h.join("\n"))
        };
        if (b.job) {
            c += (c.indexOf("?") != -1 ? "&" : "?") + "long_running=1"
        }
        var a = $H({
            url: c
        });
        if (b.parameters) {
            a.update(b.parameters);
            a.unset("t")
        }
        b.onSuccess.__tb_ajax_info__ = b.onFailure.__tb_ajax_info__ = Object.toJSON(a);
        $super(c, b)
    }
});
Object.extend(key, {
    main_modifier: function () {
        return Util.is_mac() ? decodeURIComponent("%E2%8C%98") : "ctrl"
    }
});
document.observe("dom:loaded", function () {
    $(document.body);
    var d = $(document.documentElement);
    var c = "placeholder";

    function a(g) {
        g = $(g);
        var f = $(g.target);
        if (!Element.match(f, "input,textarea")) {
            return
        }
        var h = f.readAttribute("placeholder");
        if (h) {
            if ("focus" == g.type || "focusin" == g.type) {
                if (f.getValue() === "") {
                    f.setValue("");
                    f.removeClassName(c)
                }
            } else {
                if ("" === f.value) {
                    f.addClassName(c);
                    f.value = h
                }
            }
        }
    }
    if (d.addEventListener) {
        d.addEventListener("focus", a, true);
        d.addEventListener("blur", a, true)
    } else {
        d.on("focusin", "[placeholder]", a);
        d.on("focusout", "[placeholder]", a)
    }
    var b = Element.Methods.ByTag.INPUT.getValue.wrap(function (g, e) {
        var f = $(e).readAttribute("placeholder");
        if (f && f == e.value && $(e).hasClassName(c)) {
            return ""
        }
        return g.apply(this, $A(arguments).slice(1))
    });
    Element.addMethods("input", {
        getValue: b
    });
    Element.addMethods("textarea", {
        getValue: b
    })
});
(function () {
    Object.extend(Prototype.BrowserFeatures, {
        DB_CORS: window.XMLHttpRequest && ("withCredentials" in new XMLHttpRequest())
    })
})();
var WIT, Jcached, AMC, MCLog;
var WIT = {
    enabled: Constants.WIT_ENABLED,
    reporting: false,
    start_time: 0,
    register: function () {
        if (WIT.enabled) {
            WIT.reportInterval = setInterval(WIT.report, 10000);
            $(document.body).observe("click", WIT.click)
        }
    },
    add_group: function (b, a) {
        b = $(b);
        assert(b, "WIT.add_group missing elm");
        b.addClassName("wit_group");
        b.setAttribute("name", a)
    },
    clear_group: function (a) {
        if (a.hasClassName("wit_group")) {
            a.removeClassName("wit_group")
        }
    },
    get_group: function (b) {
        var a = b.up(".wit_group");
        if (a) {
            return a.getAttribute("name")
        }
        return "ALL"
    },
    time_elapsed: function () {
        var a = Util.time() - WIT.start_time;
        if (a < 0) {
            a = 0
        }
        return a
    },
    click: function (f) {
        if (!WIT.enabled || !f || !f.target) {
            return
        }
        var d = $(f.target);
        var c;
        if (["input", "textarea", "checkbox"].indexOf(d.tagName.toLowerCase()) > -1) {
            c = d
        }
        if (!c) {
            c = d.up("a, .wit")
        }
        if (!c || $(c).hasClassName("ignore")) {
            return
        }
        var a = c.getAttribute("name") || c.id || (c.getValue && c.getValue()) || c.innerHTML.stripTags().strip() || "unknown " + c.tagName;
        if (Constants.emessages[a]) {
            a = Constants.emessages[a]
        }
        var b = WIT.get_group(c);
        assert(b, "Group missing");
        WIT.record_action(a, "click", b, WIT.time_elapsed())
    },
    record_action: function (c, d, e, b, a) {
        a = a || {};
        a.group = e;
        a.type = d;
        a.tti = b;
        WIT.record("ACTION", c, a)
    },
    record: function (c, b, a) {
        a = a || {};
        WIT._record(c, b, window.location.pathname.split("#")[0], a)
    },
    _record: function (f, c, b, a) {
        var d = "WIT_" + f + "_" + c;
        if (!WIT.enabled || Jcached.get(d) || WIT.IGNORE_URLS[b.split(Constants.WEBSERVER).last().split(/[\?\#]/)[0]]) {
            return
        }
        assert(c, "Missing WIT label");
        assert(f, "Missing WIT event_type");
        assert(b, "Missing WIT url");
        var e = [f, c, b, a || {}];
        WIT.add_to_cookie(e);
        Jcached.set(d, 1, 5000)
    },
    add_to_cookie: function (d) {
        if (Ajax.activeRequestCount) {
            setTimeout(function () {
                WIT.add_to_cookie(d)
            }, 500);
            return
        }
        assert(WIT.enabled, "WIT Disabled.");
        var c = WIT.get_cookie_val();
        c.push(d);
        var a = Object.toJSON(c);
        var b = encodeURIComponent(a);
        Util.create_cookie("wit", b, 365);
        if (b.length > 1024) {
            WIT.report()
        }
    },
    get_cookie_val: function () {
        var c = Util.read_cookie("wit");
        var b;
        if (c) {
            try {
                b = decodeURIComponent(c).evalJSON()
            } catch (a) {
                b = []
            }
        } else {
            b = []
        }
        return b
    },
    IGNORE_URLS: {
        "/wit": true
    },
    report: function () {
        if (!WIT.enabled || WIT.reporting) {
            return
        }
        var a = Util.read_cookie("wit");
        if (a) {
            WIT.reporting = true;
            new Ajax.Request("/wit", {
                onComplete: function () {
                    WIT.reporting = false
                }
            });
            Util.create_cookie("wit", "", -1)
        }
    }
};
WIT.start_time = window.ST || new Date().getTime();
document.observe("dom:loaded", function () {
    WIT.record("LOAD", "ready", {
        time: Util.time() - WIT.start_time
    });
    WIT.register()
});
Event.observe(window, "load", function () {
    WIT.record("LOAD", "complete", {
        time: Util.time() - WIT.start_time
    })
});
Event.stop = Event.stop.wrap(function (a, b) {
    if (b) {
        if (b.type == "click") {
            WIT.click(b)
        }
        a.apply(this, $A(arguments).slice(1))
    }
});
var Jcached = {
    cache: {},
    set: function (b, d, a) {
        var e = Jcached.cache[b];
        if (!e) {
            Jcached.cache[b] = {};
            e = Jcached.cache[b]
        }
        e.value = d;
        e.expires = a ? (new Date()).getTime() + a : 0
    },
    get: function (a) {
        var b = Jcached.cache[a];
        if (!b || (b.expires && (new Date()).getTime() > b.expires)) {
            delete Jcached.cache[a];
            return false
        }
        return b.value
    }
};
var AMC = {
    log_escape: function (a) {
        $("top_notifier_container").remove();
        new Ajax.DBRequest("/log_escape", {
            parameters: {
                kept_locale: a
            }
        })
    },
    log: function (b, a) {
        assert(b, "AMCLog missing label");
        var c = {
            label: b
        };
        if (a) {
            Object.extend(c, a)
        }
        new Ajax.Request("/ajax_amc_log", {
            parameters: c
        })
    },
    help_article_play: function (a) {
        if (!AMC.help_article_play_logged) {
            AMC.help_article_play_logged = 1;
            if (Help.article_id) {
                new Ajax.Request("/ajax_amc_help_video", {
                    parameters: {
                        article_id: Help.article_id
                    }
                })
            }
        }
    }
};
var ABTest = {
    log: function (a, b) {
        assert(a, "ABTest log missing abtest name");
        assert(b, "ABTest log missing event name");
        var c = {
            abtest_name: a,
            event_name: b
        };
        new Ajax.Request("/ajax_abtest_log", {
            parameters: c
        })
    }
};
var MCLog = {
    log: function (a) {
        new Ajax.Request("/ajax_mc_log/" + a)
    }
};

function add_i18n_message(d, c, a, b) {
    Constants.messages = Constants.messages || {};
    Constants.emessages = Constants.emessages || {};
    c = c.stripTags().friendly_format();
    a = a.stripTags();
    Constants.messages[c] = d;
    Constants.emessages[c] = a;
    if (b) {
        delete Constants.messages[b];
        delete Constants.emessages[b]
    }
    if (typeof (TranslationSuggest) != "undefined") {
        TranslationSuggest.index_message(c)
    }
}
function singular_1(a) {
    return a == 1 ? 0 : 1
}
function singular_01(a) {
    return a <= 1 ? 0 : 1
}
function singular_all(a) {
    return 0
}
var PLURAL_RULES = {
    es_US: singular_1,
    de: singular_1,
    es: singular_1,
    fr: singular_01,
    ja: singular_all,
    pl: singular_1
};
Date.prototype.localize = function () {
    assert(Constants.date_format, "Date format missing.");
    return this.format(Constants.date_format)
};
Date.prototype.format = function (b) {
    assert(b, "Missing format string");
    assert(typeof (b) == "string", "Date format requires a format string");
    var c = {
        h: function (d) {
            return (d.getHours() % 12 || 12).toString()
        },
        H: function (d) {
            return (d.getHours() % 12 || 12).toString()
        },
        HH: function (d) {
            return (d.getHours() % 12 || 12).toString().lpad(2)
        },
        m: function (d) {
            return d.getMinutes().toString()
        },
        mm: function (d) {
            return d.getMinutes().toString().lpad(2)
        },
        a: function (d) {
            if (d.getHours() > 11) {
                return _("PM")
            } else {
                return _("AM")
            }
        },
        yy: function (d) {
            return d.getFullYear().toString().substring(2)
        },
        yyyy: function (d) {
            return d.getFullYear().toString()
        },
        d: function (d) {
            return d.getDate().toString()
        },
        dd: function (d) {
            return d.getDate().toString().lpad(2)
        },
        M: function (d) {
            return (d.getMonth() + 1).toString()
        },
        MM: function (d) {
            return (d.getMonth() + 1).toString().lpad(2)
        }
    };
    var a = b.replace(/([a-zA-Z]+)/g, (function (d) {
        return (c[d] && c[d](this)) || d
    }).bind(this));
    return a
};
String.prototype.format_sub = function (a) {
    return this.replace(/%(\([a-z_\-]+\))?(.\d+)?(.)/g, a.bind(this))
};
String.prototype.format = function string_format() {
    if (arguments.length === 0) {
        return this.toString()
    }
    var g;
    var f = 0;
    if (arguments.length == 1 && arguments[0] instanceof Object) {
        g = arguments[0]
    } else {
        g = $A(arguments)
    }
    function b(n, l, k, m) {
        var h;
        if (!l) {
            if (!Object.isArray(g)) {
                g = [g]
            }
            assert(f > -1, "Cannot mix named and positional indices in string formatting for string '" + this + "'.");
            assert(f < g.length, "Insufficient number of items in format for string '" + this + "', list " + Object.toJSON($A(g)) + ".");
            h = g[f];
            f++
        } else {
            l = l.slice(1, -1);
            assert(f <= 0, "Cannot mix named and positional indices in string formatting for string '" + this + "'.");
            f = -1;
            assert(l in g, "Key '" + l + "' not present during string substitution for string '" + this + "', dict " + Object.toJSON($H(g)) + ".");
            h = g[l]
        }
        assert(typeof (h) != "undefined", 'value for key "' + (l || "").toString() + '" is undefined');
        var d;
        if (m == "s") {
            d = h.toString()
        } else {
            if (m == "d") {
                d = parseInt(h, 10).toString()
            } else {
                if (m == "f") {
                    d = Number(h).toString()
                } else {
                    if (m == "%") {
                        return "%"
                    } else {
                        assert(false, "Unexpected format character '" + m + "' for string '" + this + "'.")
                    }
                }
            }
        }
        if (k) {
            k = parseInt(k.slice(1), 10);
            if (m == "f") {
                if (d.indexOf(".") == "-1") {
                    d = d + ".0"
                }
                var o = d.split(".");
                return o[0] + "." + o[1].slice(0, k)
            } else {
                return d.slice(0, k)
            }
        }
        return d
    }
    var a = this.format_sub(b);
    if (Constants.messages && this in Constants.messages) {
        f = 0;
        var e = Constants.emessages[this];
        var c = String.prototype.format_sub.call(e, b);
        add_i18n_message(e, a, c, this)
    }
    return a
};
String.prototype.friendly_format = function () {
    var a = 1;
    var b = 1;

    function c(g, e, d, f) {
        if (!e) {
            if (f == "s") {
                return "[word" + (b++) + "]"
            } else {
                return "[number" + (a++) + "]"
            }
        } else {
            return "[" + e.slice(1, -1).replace("-", "_") + "]"
        }
    }
    return this.format_sub(c)
};
String.prototype.blank_format = function () {
    function a() {
        return ""
    }
    return this.format_sub(a)
};
if (!window.LANGPACK) {
    var LANGPACK = {}
}
function _(a) {
    var b = LANGPACK[a] || a;
    add_i18n_message(a, b, a);
    return b
}
function N_(a) {
    return a
}
function ungettext(c, b, g) {
    assert(typeof (g) != "undefined", "missing number parameter for ungettext");
    var a;
    if (c in LANGPACK) {
        if (Constants.USER_LOCALE) {
            var d = LANGPACK[c];
            var f = PLURAL_RULES[Constants.USER_LOCALE](g);
            assert(f in d, "bad plural lookup");
            a = d[f]
        }
    }
    var e = g == 1 ? c : b;
    a = a || e;
    add_i18n_message(c, a, e);
    return a
}
function localized_path(d, b) {
    if (!b) {
        b = [];
        for (var a = 0; a < Constants.LOCALES.length; a++) {
            var c = Constants.LOCALES[a];
            b.push(c[0])
        }
    }
    if (b.indexOf(Constants.USER_LOCALE) != -1) {
        return d.replace(/(\.[a-zA-Z0-9]{2,4})$/, "__%s$1".format(Constants.USER_LOCALE))
    } else {
        return d
    }
}
function strip_comments(a) {
    return a.replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*?\*\//g, "")
}
function fn_body(b) {
    var a = strip_comments(b.toString());
    a = a.replace(/[\s]+/g, " ");
    if (a.startsWith("(")) {
        a = a.substr(1)
    }
    if (a.endsWith(")")) {
        a = a.substr(0, a.length - 1)
    }
    a = a.replace("function (", "function(");
    return a
}
function get_stack_rep() {
    var d = [];
    var a = {};
    var c = arguments.callee.caller;
    while (c) {
        if (c.__tb_ajax_info__) {
            d.unshift("Ajax.DBRequest: " + c.__tb_ajax_info__);
            break
        }
        if (c.__tb__) {
            d = c.__tb__.concat(d);
            break
        }
        var b = fn_body(c);
        if (b in a) {
            break
        }
        a[b] = true;
        d.unshift(b);
        c = c.caller
    }
    return d
}
var alertd = window.alert;

function assert(c, d, b) {
    if (!c) {
        d = "Assertion Error: " + d;
        if (!Constants.IS_PROD) {
            if (console && console.trace) {
                console.trace()
            }
            alert(d)
        }
        var a = get_stack_rep();
        a.pop();
        global_report_exception(d, window.location.href, "", a.join("\n"));
        throw d
    }
}
var DBObserver = {
    watch: function (a, b) {
        setInterval(function () {
            var d = $(a);
            assert(d, "Couldn't find watch element");
            var c = d.getValue().strip();
            if (c != d.last_search && !SuggestionInput.defaulted(d)) {
                d.last_search = c;
                b(c)
            }
        }, 300)
    }
};
var Email = {
    mailto: function (c, b, d, a) {
        if (!d) {
            d = "dropbox.com"
        }
        c.href = "mailto:" + b + "@" + d;
        if (a) {
            c.href += "?body=" + a
        }
        c.onMouseover = null
    }
};
var SimpleSet = Class.create({
    initialize: function (a) {
        this.length = 0;
        this.d = {};
        this.items = [];
        this.update(a)
    },
    update: function (b) {
        b = b || [];
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            this.add(d)
        }
    },
    _hash: function (b) {
        var a = typeof (b);
        assert(["string", "number"].contains(a), "expected a string or a number, got %s".format(a));
        return a + ":" + b
    },
    add: function (b) {
        var a = this._hash(b);
        if (!this.d[a]) {
            this.items.push(b);
            this.length += 1
        }
        this.d[a] = true
    },
    contains: function (b) {
        var a = this._hash(b);
        return this.d[a] || false
    },
    union: function () {
        var c = this.items;
        for (var b = 0, a = arguments.length; b < a; b += 1) {
            c = c.concat(arguments[b].items)
        }
        return new SimpleSet(c)
    },
    difference: function () {
        var a = $A(arguments);
        assert(a.length > 0, "Requires at least one SimpleSet");
        var c;
        if (a.length > 1) {
            var e = a[0];
            c = e.union.apply(e, a.slice(1))
        } else {
            c = a[0]
        }
        var f = [];
        for (var b = 0; b < this.items.length; b += 1) {
            var d = this.items[b];
            if (!c.contains(d)) {
                f.push(d)
            }
        }
        return new SimpleSet(f)
    }
});
var Emstring = Class.create({
    initialize: function (a) {
        this.s = a;
        this.info = this.widthInfo();
        this.length = a.length ? this.info[this.s.length - 1] : 0
    },
    create: function (a) {
        return new Emstring(a)
    },
    widthInfo: function () {
        var b = {};
        b[-1] = 0;
        for (var a = 0; a < this.s.length; a++) {
            b[a] = b[a - 1] + this.ems(this.s.charAt(a))
        }
        return b
    },
    findSpot: function (b) {
        if (!b) {
            return 0
        }
        var c = 0;
        var f = this.s.length;
        var a;
        while (c <= f) {
            a = Math.floor(c / 2 + f / 2);
            var d = this.info[a - 1];
            if (d > b) {
                f = a - 1
            } else {
                if (d < b) {
                    c = a + 1
                } else {
                    return a
                }
            }
        }
        if (c > a) {
            return c
        } else {
            return a
        }
    },
    ems: function (g) {
        var a = 0.65;
        var b = 1.08;
        var f = 0.58;
        var e = g.charCodeAt(0);
        var d = Emstring.CODEPOINT_TO_WIDTH[e];
        if (d) {
            return d / Math.pow(10, Emstring.ACCURACY)
        }
        if (768 <= e && e <= 879) {
            return 0
        }
        if (65377 <= e && e <= 65500) {
            return f
        }
        if ((11904 <= e && e <= 40911) || (44032 <= e && e <= 55215) || (4352 <= e && e <= 4607) || (63744 <= e && e <= 64255) || (65280 <= e && e <= 65535) || (131072 <= e && e <= 196607)) {
            return b
        }
        return a
    },
    substr: function (d, a) {
        var c = this.findSpot(d);
        if (a !== undefined) {
            var b = this.findSpot(d + a);
            return new Emstring(this.s.substr(c, b - c))
        } else {
            return new Emstring(this.s.substr(c))
        }
    },
    indexOf: function (b) {
        var a = this.s.indexOf(b);
        return a > -1 ? this.info[a - 1] : -1
    },
    lastIndexOf: function (b) {
        var a = this.s.reverse().indexOf(b.reverse());
        if (a < 0) {
            return -1
        }
        return this.info[(this.s.length - a) - b.length - 1]
    },
    toString: function () {
        return this.s
    },
    snippet: String.prototype.snippet
});
Emstring.ACCURACY = 2;
Emstring.CODEPOINT_TO_WIDTH = {
    32: 38,
    33: 25,
    34: 42,
    35: 67,
    36: 58,
    37: 92,
    38: 75,
    39: 25,
    40: 33,
    41: 33,
    42: 58,
    43: 58,
    44: 25,
    45: 33,
    46: 25,
    47: 42,
    48: 58,
    49: 58,
    50: 58,
    51: 58,
    52: 58,
    53: 58,
    54: 58,
    55: 58,
    56: 58,
    57: 58,
    58: 25,
    59: 25,
    60: 58,
    61: 58,
    62: 58,
    63: 50,
    64: 100,
    65: 67,
    66: 67,
    67: 67,
    68: 75,
    69: 58,
    70: 58,
    71: 75,
    72: 83,
    73: 33,
    74: 25,
    75: 67,
    76: 58,
    77: 100,
    78: 83,
    79: 83,
    80: 67,
    81: 83,
    82: 67,
    83: 58,
    84: 58,
    85: 75,
    86: 67,
    87: 100,
    88: 67,
    89: 58,
    90: 58,
    91: 33,
    92: 42,
    93: 33,
    94: 58,
    95: 50,
    96: 67,
    97: 58,
    98: 67,
    99: 50,
    100: 67,
    101: 58,
    102: 33,
    103: 58,
    104: 67,
    105: 25,
    106: 25,
    107: 58,
    108: 25,
    109: 100,
    110: 67,
    111: 67,
    112: 67,
    113: 67,
    114: 42,
    115: 50,
    116: 42,
    117: 67,
    118: 58,
    119: 83,
    120: 58,
    121: 58,
    122: 50,
    123: 42,
    124: 58,
    125: 42,
    126: 58,
    161: 25,
    162: 58,
    163: 58,
    164: 58,
    165: 58,
    166: 58,
    167: 58,
    168: 67,
    169: 92,
    170: 42,
    171: 50,
    172: 58,
    174: 92,
    175: 58,
    176: 50,
    177: 58,
    178: 42,
    179: 42,
    180: 67,
    181: 67,
    182: 75,
    183: 25,
    184: 25,
    185: 42,
    186: 42,
    187: 50,
    188: 83,
    189: 83,
    190: 83,
    191: 50,
    192: 67,
    193: 67,
    194: 67,
    195: 67,
    196: 67,
    197: 67,
    198: 92,
    199: 67,
    200: 58,
    201: 58,
    202: 58,
    203: 58,
    204: 33,
    205: 33,
    206: 33,
    207: 33,
    208: 75,
    209: 83,
    210: 83,
    211: 83,
    212: 83,
    213: 83,
    214: 83,
    215: 58,
    216: 83,
    217: 75,
    218: 75,
    219: 75,
    220: 75,
    221: 58,
    222: 67,
    223: 67,
    224: 58,
    225: 58,
    226: 58,
    227: 58,
    228: 58,
    229: 58,
    230: 92,
    231: 50,
    232: 58,
    233: 58,
    234: 58,
    235: 58,
    236: 25,
    237: 25,
    238: 25,
    239: 25,
    240: 67,
    241: 67,
    242: 67,
    243: 67,
    244: 67,
    245: 67,
    246: 67,
    247: 58,
    248: 67,
    249: 67,
    250: 67,
    251: 67,
    252: 67,
    253: 58,
    254: 67,
    255: 58,
    256: 75,
    257: 67,
    258: 75,
    259: 67,
    260: 75,
    261: 67,
    262: 75,
    263: 58,
    264: 75,
    265: 58,
    266: 75,
    267: 58,
    268: 75,
    269: 58,
    270: 83,
    271: 83,
    272: 83,
    273: 75,
    274: 67,
    275: 67,
    276: 67,
    277: 67,
    278: 67,
    279: 67,
    280: 67,
    281: 67,
    282: 67,
    283: 67,
    284: 83,
    285: 75,
    286: 83,
    287: 75,
    288: 83,
    289: 75,
    290: 83,
    291: 75,
    292: 83,
    293: 75,
    294: 92,
    295: 75,
    296: 33,
    297: 33,
    298: 33,
    299: 33,
    300: 33,
    301: 33,
    302: 33,
    303: 33,
    304: 33,
    305: 25,
    306: 67,
    307: 67,
    308: 42,
    309: 33,
    310: 75,
    311: 67,
    312: 67,
    313: 58,
    314: 33,
    315: 58,
    316: 33,
    317: 58,
    318: 42,
    319: 58,
    320: 50,
    321: 67,
    322: 42,
    323: 83,
    324: 75,
    325: 83,
    326: 75,
    327: 83,
    328: 75,
    329: 83,
    330: 83,
    331: 75,
    332: 92,
    333: 67,
    334: 92,
    335: 67,
    336: 92,
    337: 67,
    338: 100,
    339: 100,
    340: 75,
    341: 50,
    342: 75,
    343: 50,
    344: 75,
    345: 50,
    346: 67,
    347: 58,
    348: 67,
    349: 58,
    350: 67,
    351: 58,
    352: 67,
    353: 58,
    354: 75,
    355: 42,
    356: 75,
    357: 42,
    358: 75,
    359: 42,
    360: 83,
    361: 75,
    362: 83,
    363: 75,
    364: 83,
    365: 75,
    366: 83,
    367: 75,
    368: 83,
    369: 75,
    370: 83,
    371: 75,
    372: 100,
    373: 92,
    374: 75,
    375: 58,
    376: 75,
    377: 67,
    378: 67,
    379: 67,
    380: 67,
    381: 67,
    382: 67,
    383: 42,
    384: 75,
    385: 83,
    386: 67,
    387: 75,
    388: 75,
    389: 67,
    390: 75,
    391: 83,
    392: 58,
    393: 83,
    394: 100,
    395: 67,
    396: 75,
    397: 67,
    398: 67,
    399: 75,
    400: 58,
    401: 58,
    402: 75,
    403: 83,
    404: 75,
    405: 100,
    406: 50,
    407: 50,
    408: 75,
    409: 67,
    410: 50,
    411: 67,
    412: 117,
    413: 83,
    414: 75,
    415: 92,
    416: 92,
    417: 75,
    418: 117,
    419: 100,
    420: 75,
    421: 75,
    422: 75,
    423: 67,
    424: 58,
    425: 67,
    426: 58,
    427: 42,
    428: 75,
    429: 42,
    430: 75,
    431: 83,
    432: 75,
    433: 92,
    434: 83,
    435: 75,
    436: 75,
    437: 67,
    438: 67,
    439: 67,
    440: 67,
    441: 58,
    442: 58,
    443: 75,
    444: 75,
    445: 58,
    446: 50,
    447: 67,
    448: 33,
    449: 50,
    450: 50,
    451: 33,
    452: 142,
    453: 142,
    454: 133,
    455: 100,
    456: 92,
    457: 67,
    458: 117,
    459: 117,
    460: 100,
    461: 75,
    462: 67,
    463: 33,
    464: 33,
    465: 92,
    466: 67,
    467: 83,
    468: 75,
    469: 83,
    470: 75,
    471: 83,
    472: 75,
    473: 83,
    474: 75,
    475: 83,
    476: 75,
    477: 67,
    478: 75,
    479: 67,
    480: 75,
    481: 67,
    482: 100,
    483: 100,
    484: 92,
    485: 75,
    486: 83,
    487: 75,
    488: 75,
    489: 67,
    490: 92,
    491: 67,
    492: 92,
    493: 67,
    494: 67,
    495: 58,
    496: 33,
    497: 142,
    498: 142,
    499: 133,
    500: 83,
    501: 75,
    502: 117,
    503: 67,
    504: 83,
    505: 75,
    506: 75,
    507: 67,
    508: 100,
    509: 100,
    510: 92,
    511: 67,
    512: 75,
    513: 67,
    514: 75,
    515: 67,
    516: 67,
    517: 67,
    518: 67,
    519: 67,
    520: 33,
    521: 33,
    522: 33,
    523: 33,
    524: 92,
    525: 67,
    526: 92,
    527: 67,
    528: 75,
    529: 50,
    530: 75,
    531: 50,
    532: 83,
    533: 75,
    534: 83,
    535: 75,
    536: 67,
    537: 58,
    538: 75,
    539: 42,
    540: 58,
    541: 58,
    542: 83,
    543: 75,
    544: 83,
    545: 100,
    546: 92,
    547: 67,
    548: 67,
    549: 67,
    550: 75,
    551: 67,
    552: 67,
    553: 67,
    554: 92,
    555: 67,
    556: 92,
    557: 67,
    558: 92,
    559: 67,
    560: 92,
    561: 67,
    562: 75,
    563: 58,
    564: 67,
    565: 100,
    566: 67,
    567: 33,
    568: 100,
    569: 100,
    570: 75,
    571: 75,
    572: 58,
    573: 58,
    574: 67,
    575: 58,
    576: 58,
    577: 67,
    578: 50,
    579: 75,
    580: 75,
    581: 75,
    582: 75,
    583: 58,
    584: 58,
    585: 25,
    586: 83,
    587: 58,
    588: 75,
    589: 33,
    590: 75,
    591: 58,
    880: 67,
    881: 50,
    882: 67,
    883: 50,
    884: 33,
    885: 33,
    886: 75,
    887: 67,
    888: 108,
    889: 108,
    890: 67,
    891: 58,
    892: 58,
    893: 58,
    894: 42,
    895: 108,
    896: 108,
    897: 108,
    898: 108,
    899: 108,
    900: 67,
    901: 67,
    902: 75,
    903: 42,
    904: 83,
    905: 100,
    906: 58,
    907: 108,
    908: 100,
    909: 108,
    910: 100,
    911: 100,
    912: 42,
    913: 75,
    914: 67,
    915: 58,
    916: 83,
    917: 67,
    918: 67,
    919: 83,
    920: 92,
    921: 33,
    922: 75,
    923: 75,
    924: 100,
    925: 83,
    926: 75,
    927: 92,
    928: 83,
    929: 67,
    930: 108,
    931: 67,
    932: 75,
    933: 75,
    934: 83,
    935: 75,
    936: 83,
    937: 92,
    938: 33,
    939: 75,
    940: 83,
    941: 58,
    942: 75,
    943: 42,
    944: 67,
    945: 83,
    946: 67,
    947: 67,
    948: 67,
    949: 58,
    950: 75,
    951: 75,
    952: 67,
    953: 42,
    954: 67,
    955: 67,
    956: 75,
    957: 67,
    958: 67,
    959: 67,
    960: 92,
    961: 67,
    962: 67,
    963: 75,
    964: 67,
    965: 67,
    966: 92,
    967: 67,
    968: 92,
    969: 100,
    970: 42,
    971: 67,
    972: 67,
    973: 67,
    974: 100,
    975: 108,
    976: 58,
    977: 75,
    978: 75,
    979: 100,
    980: 75,
    981: 92,
    982: 100,
    983: 67,
    984: 92,
    985: 67,
    986: 75,
    987: 58,
    988: 58,
    989: 58,
    990: 67,
    991: 58,
    992: 75,
    993: 92,
    994: 100,
    995: 92,
    996: 75,
    997: 58,
    998: 75,
    999: 58,
    1000: 75,
    1001: 75,
    1002: 67,
    1003: 67,
    1004: 83,
    1005: 58,
    1006: 50,
    1007: 42,
    1008: 67,
    1009: 67,
    1010: 58,
    1011: 33,
    1012: 92,
    1013: 58,
    1014: 58,
    1015: 67,
    1016: 67,
    1017: 75,
    1018: 100,
    1019: 83,
    1020: 58,
    1021: 75,
    1022: 75,
    1023: 75,
    1024: 67,
    1025: 67,
    1026: 92,
    1027: 58,
    1028: 75,
    1029: 67,
    1030: 33,
    1031: 33,
    1032: 42,
    1033: 108,
    1034: 108,
    1035: 83,
    1036: 75,
    1037: 83,
    1038: 75,
    1039: 83,
    1040: 75,
    1041: 67,
    1042: 67,
    1043: 58,
    1044: 83,
    1045: 67,
    1046: 92,
    1047: 67,
    1048: 83,
    1049: 83,
    1050: 75,
    1051: 83,
    1052: 100,
    1053: 83,
    1054: 92,
    1055: 83,
    1056: 67,
    1057: 75,
    1058: 75,
    1059: 75,
    1060: 83,
    1061: 75,
    1062: 83,
    1063: 75,
    1064: 108,
    1065: 108,
    1066: 75,
    1067: 92,
    1068: 67,
    1069: 75,
    1070: 108,
    1071: 75,
    1072: 67,
    1073: 67,
    1074: 58,
    1075: 58,
    1076: 75,
    1077: 67,
    1078: 83,
    1079: 58,
    1080: 75,
    1081: 75,
    1082: 67,
    1083: 67,
    1084: 83,
    1085: 75,
    1086: 67,
    1087: 75,
    1088: 75,
    1089: 58,
    1090: 58,
    1091: 58,
    1092: 92,
    1093: 67,
    1094: 75,
    1095: 58,
    1096: 92,
    1097: 100,
    1098: 67,
    1099: 83,
    1100: 58,
    1101: 58,
    1102: 92,
    1103: 58,
    1104: 67,
    1105: 67,
    1106: 75,
    1107: 58,
    1108: 58,
    1109: 58,
    1110: 33,
    1111: 33,
    1112: 42,
    1113: 92,
    1114: 92,
    1115: 75,
    1116: 67,
    1117: 75,
    1118: 58,
    1119: 75,
    1120: 100,
    1121: 75,
    1122: 75,
    1123: 67,
    1124: 83,
    1125: 83,
    1126: 75,
    1127: 67,
    1128: 100,
    1129: 92,
    1130: 92,
    1131: 83,
    1132: 117,
    1133: 108,
    1134: 67,
    1135: 67,
    1136: 83,
    1137: 83,
    1138: 92,
    1139: 67,
    1140: 83,
    1141: 67,
    1142: 83,
    1143: 67,
    1144: 133,
    1145: 125,
    1146: 92,
    1147: 67,
    1148: 100,
    1149: 75,
    1150: 100,
    1151: 75,
    1152: 75,
    1153: 58,
    1154: 75,
    1155: 0,
    1156: 0,
    1157: 0,
    1158: 0,
    1159: 108,
    1160: 0,
    1161: 0,
    1162: 83,
    1163: 75,
    1164: 67,
    1165: 58,
    1166: 67,
    1167: 75,
    1168: 58,
    1169: 58,
    1170: 67,
    1171: 58,
    1172: 75,
    1173: 67,
    1174: 100,
    1175: 92,
    1176: 67,
    1177: 58,
    1178: 75,
    1179: 67,
    1180: 83,
    1181: 75,
    1182: 75,
    1183: 67,
    1184: 83,
    1185: 75,
    1186: 83,
    1187: 75,
    1188: 100,
    1189: 83,
    1190: 117,
    1191: 100,
    1192: 92,
    1193: 75,
    1194: 75,
    1195: 58,
    1196: 75,
    1197: 58,
    1198: 75,
    1199: 58,
    1200: 75,
    1201: 58,
    1202: 75,
    1203: 75,
    1204: 100,
    1205: 83,
    1206: 75,
    1207: 67,
    1208: 75,
    1209: 67,
    1210: 75,
    1211: 58,
    1212: 92,
    1213: 75,
    1214: 92,
    1215: 75,
    1216: 33,
    1217: 92,
    1218: 83,
    1219: 75,
    1220: 67,
    1221: 83,
    1222: 67,
    1223: 83,
    1224: 75,
    1225: 83,
    1226: 75,
    1227: 75,
    1228: 58,
    1229: 100,
    1230: 83,
    1231: 25,
    1232: 75,
    1233: 67,
    1234: 75,
    1235: 67,
    1236: 100,
    1237: 100,
    1238: 67,
    1239: 67,
    1240: 75,
    1241: 67,
    1242: 75,
    1243: 67,
    1244: 92,
    1245: 83,
    1246: 67,
    1247: 58,
    1248: 67,
    1249: 58,
    1250: 83,
    1251: 75,
    1252: 83,
    1253: 75,
    1254: 92,
    1255: 67,
    1256: 92,
    1257: 67,
    1258: 92,
    1259: 67,
    1260: 75,
    1261: 58,
    1262: 75,
    1263: 58,
    1264: 75,
    1265: 58,
    1266: 75,
    1267: 58,
    1268: 75,
    1269: 58,
    1270: 58,
    1271: 42,
    1272: 92,
    1273: 83,
    1274: 58,
    1275: 42,
    1276: 75,
    1277: 58,
    1278: 75,
    1279: 58,
    19977: 108,
    65403: 58
};
var DomUtil, Util;
DomUtil = {
    fromElm: function (a) {
        return $(a).innerHTML
    },
    updateFromElm: function (b, a) {
        b = $(b);
        a = $(a);
        b.update(DomUtil.fromElm(a));
        Util.live_joff(a, b)
    },
    fillVal: function (b, a) {
        $$("." + a).each(function (c) {
            c = $(c);
            if (c.tagName == "INPUT") {
                c.value = b;
                c.defaultValue = b
            } else {
                c.innerHTML = b
            }
        })
    }
};
Util = {
    from_json: function (a) {
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(a)
        } else {
            return a.evalJSON(true)
        }
    },
    to_json: function (a) {
        if (window.JSON && window.JSON.stringify) {
            return window.JSON.stringify(a)
        } else {
            return Object.toJSON(a)
        }
    },
    viewport_dimensions: function () {
        if (!Util._cached_viewport_dimensions) {
            Util._cached_viewport_dimensions = document.viewport.getDimensions()
        }
        if (!Util._listening_for_resize) {
            Event.observe(window, "resize", function () {
                delete Util._cached_viewport_dimensions
            });
            Util._listening_for_resize = 1
        }
        return Util._cached_viewport_dimensions
    },
    set_min_body_height_to_viewport_height: function () {
        var a = $(document.body);
        if (a) {
            a.style.minHeight = Util.viewport_dimensions().height + "px"
        }
    },
    _listen_for_scroll: function () {
        if (!Util._listening_for_scroll) {
            Event.observe(window, "scroll", function () {
                if (Util._ignore_scroll_event) {
                    Util._ignore_scroll_event = 0;
                    return
                }
                delete Util._cached_scroll_offsets
            });
            Util._listening_for_scroll = 1
        }
    },
    scroll_offsets: function () {
        Util._listen_for_scroll();
        if (!Util._cached_scroll_offsets) {
            Util._cached_scroll_offsets = document.viewport.getScrollOffsets()
        }
        return Util._cached_scroll_offsets
    },
    scroll_to: function (a, b) {
        Util._listen_for_scroll();
        Util._ignore_scroll_event = 1;
        a = Math.max(a, 0);
        b = Math.max(b, 0);
        if (b > Util.scroll_offsets().top) {
            b = Math.min(b, document.body.getHeight() - Util.viewport_dimensions().height)
        }
        Util._cached_scroll_offsets = Element._returnOffset(a, b);
        window.scrollTo(a, b)
    },
    decode_sort_key: function (b) {
        var a = function (c) {
                return (typeof (c) === "string") ? Util.decode_b64(c) : c
            };
        return b.map(a)
    },
    sort_by_rank_or_key: function (a, b) {
        if (a.sort_rank !== undefined && b.sort_rank !== undefined) {
            return a.sort_rank - b.sort_rank
        }
        assert(a.sort_key !== undefined && b.sort_key !== undefined, "expected sort keys on both elms");
        return Util._sort_by_key(a, b)
    },
    _sort_by_key: function (b, e) {
        var a = b.sort_key;
        var c = e.sort_key;
        for (var d = 0; d < a.length; d++) {
            if (c[d] === undefined) {
                return 1
            }
            if (typeof (a[d]) !== typeof (c[d])) {
                return (typeof (a[d]) === "string") ? 1 : -1
            } else {
                if (a[d] !== c[d]) {
                    return a[d] > c[d] ? 1 : -1
                }
            }
        }
        if (c.length > a.length) {
            return -1
        } else {
            return 0
        }
    },
    add_sort_arrow_mouseover: function (b, d, a, c) {
        $$(a).each(function (e) {
            if (b != e) {
                Sprite.src(e.down("img"), "downtick-spacer");
                e.removeClassName("bolded");
                e.stopObserving("mouseout");
                e.stopObserving("mouseover")
            } else {
                e.addClassName("bolded");
                if (e.hasClassName("noarrow")) {
                    return
                }
                var f = d ? "up" : "down";
                if (c) {
                    Sprite.src(e.down("img"), "sort-" + f + "tick-on")
                }
                e.observe("mouseout", function () {
                    Sprite.src(e.down("img"), "sort-" + f + "tick-off")
                });
                e.observe("mouseover", function () {
                    Sprite.src(e.down("img"), "sort-" + f + "tick-on")
                })
            }
        })
    },
    one_line_fit: function (a) {
        var c = $$(a);
        if (c.length < 2) {
            return
        }
        var b = function () {
                var k = c[0];
                var g = c[c.length - 1];
                var e = k.cumulativeOffset().top,
                    d = g.cumulativeOffset().top;
                if (e != d) {
                    var f = parseInt(k.getStyle("font-size"), 10);
                    var h = f - 1;
                    if (h < 8) {
                        return
                    }
                    c.each(function (l) {
                        l.style.fontSize = h + "px"
                    });
                    b()
                }
            };
        b()
    },
    _thumb_load_on_success: function (b) {
        var a = $(b.target);
        if (!a.src.endsWith(Sprite.SPACER)) {
            a.addClassName("thumbnail")
        }
    },
    _thumb_load_on_error: function (b) {
        var a = $(b.target);
        a.removeClassName("thumbnail");
        a.writeAttribute("src", Sprite.SPACER)
    },
    thumb_load: function (a, b) {
        a.observe("error", Util._thumb_load_on_error);
        if (a.hasAttribute("data-src")) {
            a.writeAttribute("src", a.readAttribute("data-src") + "&prep_size=" + b);
            a.removeAttribute("data-src");
            a.observe("load", Util._thumb_load_on_success)
        }
    },
    calc_thumb_prep_size: function () {
        var a = document.viewport.getDimensions();
        return Util.dimensions_to_imagesize(a.width, a.height)
    },
    dimensions_to_imagesize: function (h, f) {
        var g = [
            ["480x320", 480, 320],
            ["640x480", 640, 480],
            ["800x600", 800, 600],
            ["1024x768", 1024, 768],
            ["1280x960", 1280, 960],
            ["1600x1200", 1600, 1200],
            ["2048x1536", 2048, 1536]
        ];
        for (var d = 0; d < g.length; d += 1) {
            var b = g[d];
            var c = b[0],
                e = b[1],
                a = b[2];
            if (e > h || a > f) {
                return c
            }
        }
        return g.last()[0]
    },
    timedelta: function (b, g) {
        var d = b.getTime() - g.getTime();
        var a = 86400000,
            c = 1000;
        var f = parseInt(d / a, 10);
        d = d % a;
        var e = parseInt(d / c, 10);
        d = d % c;
        return {
            microseconds: parseInt(d, 10),
            seconds: e,
            days: f
        }
    },
    ago: function (b, c) {
        var f = new Date();
        var e = Util.timedelta(f, b);
        var a;
        if (e.days < 2) {
            var d = e.seconds + e.days * 86400;
            if (d < 60) {
                a = d;
                if (c) {
                    return ungettext("%d second", "%d seconds", a).format(a)
                } else {
                    return ungettext("%d sec", "%d secs", a).format(a)
                }
            } else {
                if (d < 3600) {
                    a = parseInt(d / 60, 10);
                    if (c) {
                        return ungettext("%d minute", "%d minutes", a).format(a)
                    } else {
                        return ungettext("%d min", "%d mins", a).format(a)
                    }
                } else {
                    a = parseInt(d / 3600, 10);
                    if (c) {
                        return ungettext("%d hour", "%d hours", a).format(a)
                    } else {
                        return ungettext("%d hr", "%d hrs", a).format(a)
                    }
                }
            }
        } else {
            var g = parseInt(e.days + Math.round(e.seconds / 86400), 10);
            if (g < 30) {
                return ungettext("%d day", "%d days", g).format(g)
            } else {
                if (g < 56) {
                    a = parseInt(g / 7, 10);
                    return ungettext("%d week", "%d weeks", a).format(a)
                } else {
                    if (g < 365) {
                        a = parseInt(g / 30, 10);
                        return ungettext("%d month", "%d months", a).format(a)
                    } else {
                        a = parseInt(g / 365, 10);
                        return ungettext("%d year", "%d years", a).format(a)
                    }
                }
            }
        }
    },
    month_name: function (b) {
        var a = [_("January"), _("February"), _("March"), _("April"), _("May"), _("June"), _("July"), _("August"), _("September"), _("October"), _("November"), _("December")];
        return a[b]
    },
    nice_list: function (b) {
        if (!b) {
            return ""
        } else {
            if (b.length == 1) {
                return b[0]
            } else {
                if (b.length == 2) {
                    return _(Constants.TWO_ITEM_LIST).format({
                        x: b[0],
                        y: b[1]
                    })
                }
            }
        }
        var c = _(Constants.THREE_ITEM_LIST).split(/%\(x\)s|%\(y\)s|%\(z\)s/);
        assert(c.length == 4, "bad item list format " + Constants.THREE_ITEM_LIST);
        var e = c[0],
            d = c[1],
            a = c[2],
            f = c[3];
        return [e, b.slice(0, -1).join(d), a, b[b.length - 1], f].join("")
    },
    center: function (b) {
        b = $(b);
        var a = (document.viewport.getWidth() - b.getWidth()) / 2;
        b.setStyle({
            left: Math.floor(a) + "px"
        })
    },
    pinTop: function (b, a) {
        b = $(b);
        if (a) {
            b.setStyle({
                top: window.pageYOffset + "px"
            })
        } else {
            new Effect.Move(b, {
                y: window.pageYOffset,
                mode: "absolute",
                duration: 0.25
            })
        }
    },
    getTickWaiter: function (c, b) {
        var a = 0;
        return function () {
            if (a == c) {
                b()
            }
            a++
        }
    },
    calcBox: function (e, b, c, a, d) {
        d.top = Math.min(e, c);
        d.left = Math.min(b, a);
        d.width = Math.abs(b - a);
        d.height = Math.abs(e - c)
    },
    initBox: function (c, b, a) {
        a.top = c;
        a.left = b;
        a.width = 0;
        a.height = 0
    },
    pointOnBox: function (c, b, a) {
        return (b >= a.top && b <= a.top + a.height && c >= a.left && c <= a.left + a.width)
    },
    cmpBox: function (c, b, a) {
        if (b < a.top || c < a.left) {
            return -1
        }
        if (b > a.top + a.height || c > a.left + a.width) {
            return 1
        }
        return 0
    },
    boxOnBox: function (c, b) {
        var e = Math.max(c.top, b.top);
        var a = Math.max(c.left, b.left);
        var d = Math.min(c.top + c.height, b.top + b.height);
        var f = Math.min(c.left + c.width, b.left + b.width);
        return (e < d && a < f)
    },
    reduceBox: function (b, c) {
        var a = {};
        a.width = b.width * c;
        a.height = b.height * c;
        a.top = b.top + (b.height - a.height) / 2;
        a.left = b.left + (b.width - a.width) / 2;
        return a
    },
    getBox: function (c) {
        c = $(c);
        var b = c.getDimensions();
        var a = c.viewportOffset();
        return {
            top: a.top,
            left: a.left,
            width: b.width,
            height: b.height
        }
    },
    ts: function () {
        var a = new Date();
        return a.getUTCFullYear().toString() + "-" + (a.getUTCMonth() + 1).toString().lpad(2) + "-" + a.getUTCDate().toString().lpad(2) + " " + a.getUTCHours().toString().lpad(2) + ":" + a.getUTCMinutes().toString().lpad(2) + ":" + a.getUTCSeconds().toString().lpad(2)
    },
    start_of_day: function (a) {
        var b = new Date();
        b.setTime(a.getTime());
        b.setHours(0);
        b.setMinutes(0);
        b.setSeconds(0);
        b.setMilliseconds(0);
        return b
    },
    to_mysql_date: function (e, a) {
        var b = e.getFullYear().toString() + "-" + (e.getMonth() + 1).toString().lpad(2) + "-" + e.getDate().toString().lpad(2);
        var c = e.getHours().toString().lpad(2) + ":" + e.getMinutes().toString().lpad(2) + ":" + e.getSeconds().toString().lpad(2) + "." + e.getMilliseconds().toString().lpad(3);
        if (!a) {
            return b
        } else {
            return b + " " + c
        }
    },
    from_mysql_date: function (b) {
        var h = b.split(" ");
        var d = h[0];
        var g = h.length > 1 ? h[1] : false;
        var f = d.split("-");
        assert(f.length == 3, "weird date format on {d}, expected yyyy-mm-dd".interpolate({
            d: d
        }));
        var c = new Date(f[0], parseInt(f[1], 10) - 1, f[2]);
        if (g) {
            var e = g.split(":");
            assert(e.length == 3, "weird time format on {t}, expected hh:mm:ss.ms".interpolate({
                t: g
            }));
            c.setHours(e[0]);
            c.setMinutes(e[1]);
            var a = e[2].split(".");
            c.setSeconds(a[0]);
            if (a.length > 1) {
                c.setMilliseconds(a[1])
            }
        }
        return c
    },
    make_table: function (h, b) {
        var d = new Element("table", b);
        var a = new Element("tbody");
        d.insert(a);
        for (var c in h) {
            if (h.hasOwnProperty(c)) {
                var e = new Element("tr");
                var g = new Element("td").insert(c);
                var f = new Element("td").insert(h[c]);
                e.insert(g);
                e.insert(f);
                a.insert(e)
            }
        }
        return d
    },
    time: function () {
        return (new Date()).getTime()
    },
    last_time: false,
    delta: function (b) {
        var a = Util.time();
        if (Util.last_time && (!b || typeof (b) != "boolean")) {
            Util.log(a - Util.last_time)
        }
        Util.last_time = a;
        if (typeof (b) == "string") {
            Util.log("^ " + b)
        }
    },
    url_hash: function () {
        var a = window.location.href;
        if (a.indexOf("#") >= 0) {
            return a.split("#").last()
        } else {
            return ""
        }
    },
    copy_to_clipboard: function (h, d, g) {
        var a = $("hold_clipboard");
        a.value = h;
        if (a.createTextRange) {
            var b = a.createTextRange();
            if (b && (typeof (BodyLoaded) == "undefined" || BodyLoaded == 1)) {
                try {
                    b.execCommand("Copy")
                } catch (f) {
                    g = g || _("Please copy the text below:");
                    d = d || _("Copy text");
                    DomUtil.fillVal(h, "text-to-copy");
                    DomUtil.fillVal(g, "copy-modal-body");
                    Modal.show(d, DomUtil.fromElm("copy-modal"), {
                        wit_group: "copy_to_clipboard"
                    });
                    $("text-to-copy").select()
                }
            }
        } else {
            if (!$("flashcb")) {
                var k = document.createElement("div");
                k.id = "flashcb";
                document.body.appendChild(k)
            }
            $("flashcb").innerHTML = "";
            var c = '<embed src="/static/swf/_clipboard.swf" FlashVars="clipboard=' + encodeURIComponent(a.value) + '" width="0" height="0" type="application/x-shockwave-flash"></embed>';
            $("flashcb").innerHTML = c
        }
    },
    report_exception: global_report_exception,
    scrollTop: function () {
        return window.scrollY || document.documentElement.scrollTop || 0
    },
    scrollLeft: function () {
        return window.scrollX || document.documentElement.scrollLeft || 0
    },
    setCursor: function (a) {
        if (!document.styleSheets[0].cssRules) {
            return
        }(document.styleSheets[0].rules || document.styleSheets[0].cssRules)[0].style.cursor = a;
        (document.styleSheets[0].rules || document.styleSheets[0].cssRules)[1].style.cursor = a
    },
    clearCursor: function () {
        if (!document.styleSheets[0].cssRules) {
            return
        }(document.styleSheets[0].rules || document.styleSheets[0].cssRules)[0].style.cursor = "auto";
        (document.styleSheets[0].rules || document.styleSheets[0].cssRules)[1].style.cursor = "pointer"
    },
    noHorizScroll: function () {
        if (!(/Mac.*(Firefox\/3|Camino)/.match(navigator.userAgent))) {
            document.body.style.overflowX = "hidden"
        }
    },
    allowHorizScroll: function () {
        document.body.style.overflowX = ""
    },
    scried: {},
    scry: function (c) {
        var a = Util.scried;
        var b = a[c];
        if (!b) {
            b = $(c);
            a[c] = b
        }
        return b
    },
    pathDepth: function (c) {
        var b = c.split("/");
        var d = 0;
        for (var a = 0; a < b.length; a++) {
            if (b[a].length) {
                d++
            }
        }
        return d
    },
    normalize: function (a) {
        if (!a) {
            return ""
        }
        if (a.charAt(0) !== "/") {
            a = "/" + a
        }
        if (a.charAt(a.length - 1) != "/") {
            return a
        }
        return a.substr(0, a.length - 1)
    },
    parentDir: function (b) {
        var a = b.split("/").slice(0, -1).compact().join("/");
        return a ? a : "/"
    },
    urlquote: function (a) {
        return a.split("/").map(encodeURIComponent).join("/")
    },
    unevent: function (f) {
        if (f.attributes) {
            f.onclick = null;
            f.onmouseover = null;
            f.onmouseout = null;
            f.onmousedown = null;
            f.onmouseup = null;
            f.onmousemove = null
        }
        var c = f.childNodes,
            e, b;
        if (c) {
            b = c.length;
            for (e = 0; e < b; e += 1) {
                Util.unevent(c[e])
            }
        }
    },
    yank: function (a) {
        Util.unevent(a);
        if (!Util.dom_trash_can) {
            Util.dom_trash_can = $("trash-can")
        }
        Util.dom_trash_can.insert(a);
        Util.dom_trash_can.update();
        a = null;
        return a
    },
    ie8: Prototype.Browser.IE && document.documentMode && true,
    ie6: window.external && typeof window.XMLHttpRequest == "undefined",
    ie: Prototype.Browser.IE,
    linux_ff3: navigator.userAgent.toLowerCase().indexOf("linux") > -1,
    log: function () {
        $("ieconsole").innerHTML += $A(arguments).join(" ") + "<br>"
    },
    childElement: function (d, c) {
        var b = Util.childElementWithIndex(d, c);
        return b[0]
    },
    childElementWithIndex: function (h, c) {
        var f = 0;
        var b = h.childNodes;
        var a, d;
        a = b.length;
        for (d = 0; d < a; ++d) {
            var g = b[d];
            if (g.nodeType == 1 && f++ == c) {
                return [g, d]
            }
        }
        return [false, false]
    },
    disableSelection: function (a) {
        a.onselectstart = function () {
            return false
        };
        a.unselectable = "on";
        a.style.MozUserSelect = "none";
        a.style.cursor = "default"
    },
    enableSelection: function (a) {
        a.onselectstart = function () {
            return true
        };
        a.unselectable = "off";
        a.style.MozUserSelect = "";
        a.style.cursor = ""
    },
    bsearch: function (a, h, f, e) {
        if (!f) {
            f = function (k, l) {
                return k - l
            }
        }
        var c = a.length;
        var d = 0;
        while (c > d) {
            var b = Math.floor(c / 2 + d / 2);
            var g = f(a[b], h);
            if (g > 0) {
                c = b
            } else {
                if (g < 0) {
                    d = b + 1
                } else {
                    return b
                }
            }
        }
        return e ? d : -1
    },
    nonce: function () {
        var c = new Date();
        var b = c.getTime().toString();
        var a = Math.floor(Math.random() * 1000000).toString().lpad(6);
        return b + a
    },
    _joff: function (c) {
        assert(c.length == 3, "incomplete jag");
        var d = $(c[0]);
        assert(d, "no element found with id " + c[0]);
        var a = c[1];
        var b = c[2];
        if (a.startsWith("on")) {
            assert(typeof (b) == "function", "Util.jag() takes a function for onClick/onMouse*/etc attributes");
            d[a] = b
        } else {
            d.setAttribute(a, b)
        }
        if (d.tagName.toLowerCase() == "a" && !d.hasAttribute("href")) {
            d.setAttribute("href", "#")
        }
    },
    live_joff: function (c, b) {
        var a = c.identify();
        if (a in Util._live_jags) {
            (function () {
                Util._live_jags[a].each(function (d) {
                    var e = $(d[0]);
                    assert(e, "jag elm %s missing".format(d[0]));
                    d[0] = b.down("#" + e.identify());
                    Util._joff(d)
                })
            }).defer()
        }
    },
    jag: function (c, a, b) {
        var d = $A(arguments);
        if (document.loaded) {
            Util._joff(d)
        } else {
            Util._jags.push(d)
        }
    },
    live_jag: function (e, c, a, b) {
        var d = $A(arguments).slice(1);
        if (e in Util._live_jags) {
            Util._live_jags[e].push(d)
        } else {
            Util._live_jags[e] = [d]
        }
    },
    _jags: [],
    _live_jags: {},
    focus: function (b) {
        b = $(b);
        try {
            b.focus()
        } catch (a) {}
    },
    focus_in_input: function () {
        return document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].indexOf(document.activeElement.tagName) != -1 && ["submit", "button"].indexOf(document.activeElement.type) == -1
    },
    sumStyles: function (b, c) {
        var a = 0;
        if (b) {
            c.each(function (d) {
                a += parseInt(b.getStyle(d), 10) || 0
            })
        }
        return a
    },
    syncHeight: function () {
        $$(".sync-height").invoke("setStyle", {
            height: "auto"
        });
        var a = $$(".sync-height").invoke("getHeight").max() - Util.sumStyles($$(".sync-height")[0], ["border-left-width", "padding-left", "padding-right", "border-right-width"]);
        $$(".sync-height").invoke("setStyle", {
            height: a > 0 ? a + "px" : "auto"
        })
    },
    formatGB: function (d, e, a) {
        var f, b;
        assert(d >= 1073741824, "must use value at least 1 GB");
        f = Math.round(d / 1073741824);
        if (e) {
            b = " "
        } else {
            b = ""
        }
        var c = a ? "GB" : "";
        return f + b + c
    },
    formatBytes: function (e, d, g, c) {
        e = parseFloat(e);
        var b = Math.abs(e);
        var h, f;
        if (b < 1024) {
            d = 0;
            g = true;
            h = e;
            f = ungettext("byte", "bytes", e)
        } else {
            if (b < 900 * 1024) {
                h = e / 1024;
                f = _("KB")
            } else {
                if (b < 900 * 1048576) {
                    h = e / 1048576;
                    f = _("MB")
                } else {
                    if (b < 900 * 1073741824 || (d === 0 && e < 1048576 * 1048576)) {
                        h = e / 1073741824;
                        f = _("GB")
                    } else {
                        h = e / (1048576 * 1048576);
                        f = _("TB")
                    }
                }
            }
        }
        h = Math.round(h * Math.pow(10, d)) / parseFloat(Math.pow(10, d));
        h = h.toFixed(d);
        var a;
        if (c && d > 0) {
            if (h != Math.floor(h)) {
                a = h
            } else {
                a = parseInt(Math.floor(h), 10)
            }
        } else {
            a = h
        }
        if (g) {
            a = a + " " + f
        }
        return a
    },
    formatTime: function (e) {
        var c = [86400, 3600, 60, 1];
        var d;
        e = isNaN(e) ? 0 : e;
        for (var b = 0; b < c.length; b += 1) {
            if (e >= c[b]) {
                d = parseInt(e / c[b], 10) || 0;
                break
            }
        }
        if (e < 1) {
            d = 0
        }
        var a;
        if (b >= 3) {
            a = ungettext("%d sec", "%d secs", d).format(d)
        } else {
            if (b == 2) {
                a = ungettext("%d min", "%d mins", d).format(d)
            } else {
                if (b == 1) {
                    a = ungettext("%d hour", "%d hours", d).format(d)
                } else {
                    if (b === 0) {
                        a = ungettext("%d day", "%d days", d).format(d)
                    } else {
                        assert(false, "Invalid time")
                    }
                }
            }
        }
        return a
    },
    removeClassNameRegex: {},
    removeClassName: function (c, a) {
        if (!c) {
            return null
        }
        var b = Util.removeClassNameRegex[a];
        if (!b) {
            Util.removeClassNameRegex[a] = b = new RegExp("(^|\\s+)" + a + "(\\s+|$)")
        }
        c.className = c.className.replace(b, " ").strip();
        return c
    },
    observe: function (b, a, c) {
        b = Element.extend(b);
        if (b.addEventListener) {
            b.addEventListener(a, c, false)
        } else {
            b.attachEvent("on" + a, c)
        }
    },
    smartLoad: function (a) {
        if (document.loaded) {
            a()
        } else {
            document.observe("dom:loaded", a)
        }
    },
    nop: function () {
        return false
    },
    niceDate: function (a) {
        a = a || new Date();
        return 1 + a.getMonth() + "-" + a.getDate() + "-" + a.getFullYear()
    },
    reverseNiceDate: function (a) {
        if (!a) {
            return false
        }
        var b = a.split("/");
        if (b.length != 3) {
            return false
        }
        return new Date(parseInt(b[2], 10), parseInt(b[0], 10) - 1, parseInt(b[1], 10))
    },
    replaceHtml: function (c, b) {
        if (Prototype.Browser.IE) {
            c.innerHTML = b;
            return c
        }
        var a = c.cloneNode(false);
        a.innerHTML = b;
        c.parentNode.replaceChild(a, c);
        return a
    },
    isNumber: function (a) {
        return !isNaN(Number(a, 10))
    },
    shorten_url: function (a, b) {
        new Ajax.DBRequest("/shorten_url", {
            parameters: {
                url: a
            },
            onSuccess: function (c) {
                b(c.responseText)
            }
        })
    },
    flash_version: function () {
        return FlashDetect.major + "." + FlashDetect.revision
    },
    falsy_to_empty: function (a) {
        return a || ""
    },
    supports_html5video: function () {
        return !!document.createElement("video").canPlayType
    },
    embed_h264_video: function (b, d, c, e, a) {
        if (FlashDetect.installed) {
            Util.embed_flash_video(b, d, c, e, a)
        } else {
            if (Util.supports_html5video()) {
                Util.embed_video(b, d, c, e, a)
            } else {
                $(d).update(_("Please enable flash to watch this video."))
            }
        }
    },
    embed_video: function (c, e, d, f, b) {
        b = b || d * 0.58;
        b = parseInt(b, 10);
        var a = new Element("video", {
            src: c,
            width: d,
            height: b,
            controls: 1
        });
        if (f) {
            a.autoplay = true
        }
        $(e).update(a)
    },
    embed_flash_video: function (a, k, b, c, l) {
        var g = new Element("div");
        var f = g.identify();
        $(k).insert(g);
        b = b || 532;
        l = l || parseInt(b * 0.58, 10);
        var e = {
            allowfullscreen: "true",
            allowScriptAccess: "always",
            wmode: "opaque",
            bgcolor: "#000000"
        };
        a = encodeURI(a);
        var d = {
            file: a,
            skin: "/static/swf/bekle.swf",
            controlbar: "over",
            autostart: c,
            type: "video"
        };
        var h = {
            name: f
        };
        swfobject.embedSWF("/static/swf/player-5.9.swf", g.identify(), b.toString(), l.toString(), "9", false, d, e, h, function (m) {
            $(document).fire("db:flash_video_loaded", {
                player: $(m.ref)
            })
        })
    },
    embed_help_video: function (e, f, k) {
        var g = function (m, l, n, a) {
                if (FlashDetect.installed) {
                    $(document).observe("db:flash_video_loaded", function (o) {
                        window.playerReady = function () {
                            o.memo.player.addModelListener("STATE", "AMC.help_article_play")
                        }
                    })
                }
                Util.embed_h264_video(e, m, l, n, a)
            };
        if (k) {
            var c = new Element("img", {
                src: k
            });
            var b = new Element("a", {
                href: "#",
                style: "position: relative; display: block;"
            });
            var d = new Element("img", {
                src: "/static/images/help_play.png"
            });
            d.addClassName("overlay_play");
            b.appendChild(c);
            b.appendChild(d);
            var h = new Element("div");
            b.observe("click", function (n) {
                h.update();
                Event.stop(n);
                Modal.show("", h, false, false, 860);
                var l = 800;
                var m = true;
                var a = 600;
                g(h, l, m, a);
                $("modal-title").hide()
            });
            $(f).update(b)
        } else {
            g(f)
        }
    },
    seconds_to_time: function (b) {
        b = parseInt(b, 10);
        var a;
        if (b > 60) {
            a = parseInt(b / 60, 10);
            b = b % 60
        } else {
            a = 0
        }
        a = a.toString().lpad(2, "0");
        b = b.toString().lpad(2, "0");
        return a + ":" + b
    },
    add_script: function (b) {
        var a = document.createElement("script");
        a.setAttribute("type", "text/javascript");
        a.setAttribute("src", b);
        document.getElementsByTagName("head")[0].appendChild(a)
    },
    supports_video: function () {
        var a = document.createElement("video");
        if (!a.canPlayType) {
            return false
        }
        return a.canPlayType("video/mp4")
    },
    create_cookie: function (c, d, e) {
        var a = "";
        if (e) {
            var b = new Date();
            b.setTime(b.getTime() + (e * 24 * 60 * 60 * 1000));
            a = "; expires=" + b.toGMTString()
        }
        document.cookie = c + "=" + d + a + "; path=/"
    },
    read_cookie: function (b) {
        var e = b + "=";
        var a = document.cookie.split(";");
        for (var d = 0; d < a.length; d++) {
            var f = a[d];
            while (f.charAt(0) == " ") {
                f = f.substring(1, f.length)
            }
            if (f.indexOf(e) === 0) {
                return f.substring(e.length, f.length)
            }
        }
        return null
    },
    delete_cookie: function (a) {
        Util.create_cookie(a, "", -1)
    },
    preloaded_images: {},
    preload_image: function (c, b) {
        if (Util.preloaded_images[c]) {
            return
        }
        var a = new Image();
        if ((typeof b != "undefined") && b) {
            Element.extend(a).observe("error", b)
        }
        a.src = c;
        Util.preloaded_images[c] = a
    },
    get_preloaded_image: function (a) {
        if (Util.preloaded_images[a]) {
            return $(Util.preloaded_images[a])
        } else {
            return new Element("img", {
                src: a
            })
        }
    },
    copy_to_clipboard_swf: function (b, c, d, f) {
        var e = {
            wmode: "transparent",
            flashVars: "copy_text=" + Util.urlquote(b) + (d ? "&callback=" + d + "()" : "")
        };
        var a = new Element("div", {
            id: "flash_copy_container"
        });
        var g = new Element("div");
        a.update(g);
        if ($(f)) {
            f = $(f)
        } else {
            f = document.body
        }
        f.appendChild(a);
        swfobject.embedSWF("/static/swf/copy_to_clipboard.swf", g.identify(), "100%", "100%", "6.0.65", false, false, e);
        a.absolutize();
        a.style.zIndex = 1;
        a.clonePosition(c, {
            offsetTop: -3,
            offsetLeft: -3,
            offsetHeight: 6,
            offsetWidth: 6
        });
        Util.freshbutton_overlay(a, c)
    },
    inner_height: function (a) {
        a = $(a);
        assert(a, "inner_height missing elm");
        return a.getHeight() - parseInt(a.getStyle("padding-top"), 10) - parseInt(a.getStyle("padding-bottom"), 10) - parseInt(a.getStyle("border-top-width"), 10) - parseInt(a.getStyle("border-bottom-width"), 10)
    },
    decode_b64: function (h) {
        if (typeof window.atob == "function") {
            return Util.utf8_decode(window.atob(h))
        }
        var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var c, b, a, n, m, l, k, o, g = 0,
            p = 0,
            e = "",
            f = [];
        if (!h) {
            return h
        }
        h += "";
        do {
            n = d.indexOf(h.charAt(g++));
            m = d.indexOf(h.charAt(g++));
            l = d.indexOf(h.charAt(g++));
            k = d.indexOf(h.charAt(g++));
            o = n << 18 | m << 12 | l << 6 | k;
            c = o >> 16 & 255;
            b = o >> 8 & 255;
            a = o & 255;
            if (l == 64) {
                f[p++] = String.fromCharCode(c)
            } else {
                if (k == 64) {
                    f[p++] = String.fromCharCode(c, b)
                } else {
                    f[p++] = String.fromCharCode(c, b, a)
                }
            }
        } while (g < h.length);
        e = f.join("");
        e = Util.utf8_decode(e);
        return e
    },
    utf8_decode: function (a) {
        var c = [],
            e = 0,
            g = 0,
            f = 0,
            d = 0,
            b = 0;
        a += "";
        while (e < a.length) {
            f = a.charCodeAt(e);
            if (f < 128) {
                c[g++] = String.fromCharCode(f);
                e++
            } else {
                if ((f > 191) && (f < 224)) {
                    d = a.charCodeAt(e + 1);
                    c[g++] = String.fromCharCode(((f & 31) << 6) | (d & 63));
                    e += 2
                } else {
                    d = a.charCodeAt(e + 1);
                    b = a.charCodeAt(e + 2);
                    c[g++] = String.fromCharCode(((f & 15) << 12) | ((d & 63) << 6) | (b & 63));
                    e += 3
                }
            }
        }
        return c.join("")
    },
    clear_selected: function () {
        if (window.getSelection) {
            var a = window.getSelection();
            if (a.removeAllRanges) {
                a.removeAllRanges()
            }
        } else {
            if (document.selection) {
                document.selection.empty()
            }
        }
    },
    list_cmp: function (a, h) {
        var g = a.length;
        var c = h.length;
        var b = Math.min(g, c);
        for (var e = 0; e < b; e++) {
            var d = a[e];
            var f = h[e];
            if (d < f) {
                return -1
            }
            if (d > f) {
                return 1
            }
        }
        return g - c
    },
    is_mac: function () {
        return navigator.appVersion.indexOf("Mac") != -1
    },
    in_scrollbar: function (a) {
        var c = 20,
            b = Util.viewport_dimensions();
        return a > b.width - c
    },
    freshbutton_overlay: function (b, a) {
        b.observe("mouseover", function () {
            a.addClassName("hovered")
        });
        b.observe("mouseout", function () {
            a.removeClassName("hovered");
            a.removeClassName("pressed")
        });
        b.observe("mousedown", function () {
            a.removeClassName("hovered");
            a.addClassName("pressed")
        });
        b.observe("mouseup", function () {
            a.removeClassName("pressed")
        })
    }
};
Util.scrollLeft = Util.scrollLeft.cached(50);
Util.scrollTop = Util.scrollTop.cached(50);
var RequestWatcher = {
    reqs: [],
    working_msg: _("Still working..."),
    TIMEOUT: 7,
    watch: function (b, c) {
        var a = RequestWatcher.reqs;
        if (!a.length) {
            RequestWatcher.int_id = setInterval(RequestWatcher.check_up, 500)
        }
        if (c) {
            b.skip_message = true
        }
        a.push([b, Util.time()])
    },
    check_up: function () {
        RequestWatcher.scan(false)
    },
    remove: function (a) {
        RequestWatcher.scan(a)
    },
    scan: function (f) {
        var b = Util.time();
        var c = RequestWatcher.reqs.length;
        var a = RequestWatcher.reqs;
        var d = [];
        for (var e = 0; e < c; e++) {
            var h = a[e][0];
            var g = a[e][1];
            var k = b - g;
            if (h.transport.readyState == 4) {
                Notify.clear_if(RequestWatcher.working_msg);
                continue
            }
            if (k > 4000 && !h.skip_message) {
                h.skip_message = true;
                Notify.server_success(RequestWatcher.working_msg)
            }
            if (k > RequestWatcher.TIMEOUT * 1000 && h.job) {
                h.transport.abort()
            }
            if (h != f) {
                d.push([h, g])
            } else {
                h.transport.abort()
            }
        }
        RequestWatcher.reqs = d;
        if (!d.length) {
            clearInterval(RequestWatcher.int_id)
        }
    }
};
var UIButton = (function () {
    var b = ".ui-button";
    var f = function (k, l) {
            l.addClassName("over")
        };
    var c = function (k, l) {
            l.removeClassName("over")
        };
    var h = function (k, l) {
            l.addClassName("down")
        };
    var d = function (k) {
            $$(b + ".down").invoke("removeClassName", "down")
        };
    var a = function (k, l) {
            l.toggleClassName("active")
        };
    var e = function (m) {
            var l = $(m.target);
            var k = b + ".active";
            var n = l.match(k) && l || l.up(k);
            $$(k).each(function (o) {
                if (n != o) {
                    o.removeClassName("active")
                }
            })
        };
    var g = function () {
            document.body.on("mouseover", b, f);
            document.body.on("mouseout", b, c);
            document.body.on("mousedown", b, h);
            document.on("mouseup", d);
            document.body.on("click", b, a);
            document.on("click", e)
        };
    return {
        init: g
    }
})();
window.alert = function (a) {
    new Ajax.Request("/tormod", {
        parameters: {
            to: a,
            rm: window.location.href,
            od: get_stack_rep().join("\n\n")
        }
    });
    alertd(a)
};
if (typeof (console) == "undefined") {
    console = {
        log: function () {},
        profile: function () {},
        profileEnd: function () {}
    }
}
function check_jslint() {
    var a = new Element("iframe", {
        src: "/jslint",
        style: "visibility:hidden;width:1px;height:1px"
    });
    document.body.appendChild(a)
}
function jslint_fail() {
    Notify.server_error("JSLint found JS issues. <a href='/jslint'>Debug</a>")
}
var IE7_OR_LESS = Util.ie && (!document.documentMode || document.documentMode < 8);
document.observe("dom:loaded", function () {
    UIButton.init();
    Util._jags.each(function (a) {
        Util._joff(a)
    });
    if (!Constants.IS_PROD && window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
        check_jslint()
    }
    Util.set_min_body_height_to_viewport_height()
});
Event.observe(window, "resize", Util.set_min_body_height_to_viewport_height);
Event.observe(window, "load", function () {
    Util.syncHeight()
});
var Trace = (function () {
    var a = [];
    return {
        log: function () {
            var b = Util.time() + ": " + $A(arguments).join(" ");
            a.push(b)
        },
        get: function () {
            return a.join("\n")
        }
    }
})();

function T() {
    Trace.log.apply(this, $A(arguments))
}
document.observe("dom:loaded", function () {
    T("dom:loaded");
    var a = function () {
            var b = $("page-content");
            if (b) {
                var c = Util.viewport_dimensions();
                if (c.width < b.getWidth()) {
                    document.body.addClassName("absolutize")
                } else {
                    document.body.removeClassName("absolutize")
                }
            }
        };
    Event.observe(window, "resize", a);
    a()
});
Event.observe(window, "load", function () {
    T("window:load")
});
var HashKeeper = {
    initiated: false,
    iframe: null,
    internal_hash: "",
    init: function () {
        if (HashKeeper.initiated) {
            return
        }
        HashKeeper.iframe = $("hashkeeper");
        try {
            var b = function () {};
            b(HashKeeper.iframe.contentWindow.document)
        } catch (a) {
            setTimeout(HashKeeper.init, 10);
            return
        }
        var c = Util.url_hash();
        HashKeeper.set_iframe_hash(c);
        HashKeeper.internal_hash = c;
        HashKeeper.initiated = true
    },
    check_hash: function () {
        if (!HashKeeper.initiated) {
            HashKeeper.init();
            return
        }
        var a = HashKeeper.get_iframe_hash();
        if ((HashKeeper.internal_hash != a) && (HashKeeper.internal_hash || a)) {
            HashKeeper.internal_hash = a;
            window.location = "#" + a;
            return
        }
        var b = Util.url_hash();
        if (HashKeeper.internal_hash != b) {
            HashKeeper.set_iframe_hash(b);
            HashKeeper.internal_hash = b
        }
    },
    get_iframe_hash: function () {
        var a = HashKeeper.iframe.contentWindow.document.body.innerText;
        return a || ""
    },
    set_iframe_hash: function (b) {
        var a = HashKeeper.iframe.contentWindow.document;
        a.open();
        a.write("<html><body>" + b + "</body></html>");
        a.close()
    }
};
var HTML5_HISTORY = Modernizr.history;
var DBHistory = (function () {
    var n = new RegExp("#|;|\\?|:|@|&|=|\\+|\\$");

    function p(q) {
        if (IE7_OR_LESS) {
            if (q.endsWith("#")) {
                return q.substr(0, q.length - 1)
            }
        }
        return q
    }
    function c() {
        var q;
        if (HTML5_HISTORY) {
            var r = window.location.pathname;
            var s = window.location.search;
            if (r.search(n) !== -1) {
                r = Util.urlquote(r)
            }
            q = r + s
        } else {
            q = window.location.href.split("#!").last();
            q = p(q)
        }
        return q
    }
    function o(s, t) {
        var q = s;
        var r = t && Object.toQueryString(t);
        if (r) {
            q += "?" + r
        }
        return q
    }
    function h(q) {
        if (typeof (q) !== "string") {
            q = c()
        }
        var s = q.split("?");
        var r = s[0];
        var t = {};
        if (q.indexOf("?") != -1) {
            t = q.toQueryParams()
        }
        return {
            url: q,
            path: r,
            qargs: t
        }
    }
    var l = {},
        b = {},
        f = c(),
        e = null;

    function k(q) {
        return "/" + q.split("/")[1]
    }
    function a() {
        var q = f;
        var s = h(q);
        var r = k(s.path);
        if (r in l) {
            l[r](s.path.substr(r.length + 1), s.qargs)
        }
    }
    function d() {
        var q = f;
        var s = h(q);
        var r = k(s.path);
        if (r in b) {
            b[r](s.path.substr(r.length + 1), s.qargs)
        }
    }
    function m(t, r) {
        var s = k(t),
            q = k(r);
        if (s != q) {
            d()
        }
    }
    function g() {
        var q = c();
        if (q != f) {
            m(f, q);
            f = q;
            a()
        }
    }
    return {
        init: function () {
            if (!e) {
                f = c();
                e = setInterval(g, 50)
            }
        },
        add_callback: function (r, q) {
            assert(typeof (r) == "string", "DBHistory prefix is not a string");
            assert(r.startsWith("/"), "DBHistory prefix must be absolute");
            assert(r.count("/") == 1, "multi-component prefixes arent supported");
            l[r] = q;
            a()
        },
        add_exit_callback: function (r, q) {
            assert(typeof (r) == "string", "DBHistory prefix is not a string");
            assert(r.startsWith("/"), "DBHistory prefix must be absolute");
            assert(r.count("/") == 1, "multi-component prefixes arent supported");
            b[r] = q
        },
        push_state: function (r, s) {
            assert(typeof (r) === "string", "DBHistory path is not a string");
            assert(r.startsWith("/"), "DBHistory path must be absolute");
            assert(r.indexOf("?") == -1, "DBHistory path contains ?");
            assert(r.indexOf("#") == -1, "DBHistory path contains #");
            assert(r.indexOf("//") == -1, "DBHistory path contains //");
            r = p(r);
            var q = o(r, s);
            if (q == f) {
                return
            }
            m(f, q);
            if (HTML5_HISTORY) {
                window.history.pushState(null, null, q)
            } else {
                window.location.href = "#!" + q
            }
            f = c();
            a()
        },
        get_url: c,
        construct_url: o,
        deconstruct_url: h,
        URL_ESCAPE_REGEX: n
    }
})();
document.observe("dom:loaded", function () {
    DBHistory.init();
    if (IE7_OR_LESS) {
        HashKeeper.hash_checker = setInterval(HashKeeper.check_hash, 100)
    }
});
var HashRouter = {
    watch_timer: null,
    callback_map: {},
    last_hash: "",
    last_prefix: "",
    init: function () {
        HashRouter.watch_timer = setInterval(HashRouter.check_hash, 300)
    },
    watch: function (a, b) {
        HashRouter.callback_map[a] = b;
        if (!HashRouter.watch_timer) {
            HashRouter.init()
        }
    },
    check_hash: function () {
        var d = Util.url_hash();
        if (HashRouter.last_hash == d) {
            return
        }
        HashRouter.last_hash = d;
        if (HashRouter.last_prefix && d === "") {
            d = HashRouter.last_prefix + ":"
        } else {
            if (!d) {
                return
            }
        }
        var a = d.split(":");
        var c = a.first();
        HashRouter.last_prefix = c;
        var b = HashRouter.callback_map[c];
        if (b) {
            b.apply(b, a.slice(1))
        }
        $(document).fire("db:hash_change", {
            hash: d
        })
    },
    set_hash: function () {
        var a = $A(arguments).map(Util.falsy_to_empty);
        var c = a.map(encodeURIComponent);
        var b = c.join(":");
        HashRouter._set_hash(b)
    },
    _set_hash: function (a) {
        if (a === "") {
            a = "/"
        }
        HashRouter.last_hash = a;
        window.location.href = "#" + a
    }
};
var Votebox = {
    page: "0",
    view: "newest",
    add_comment: function (b) {
        if (b) {
            Event.stop(b)
        }
        var a = $("comment_form");
        Forms.ajax_submit(a, false, function (c) {
            var d = $("feature-comments");
            d.innerHTML = c.responseText + d.innerHTML;
            $("comment").setValue("");
            d.scrollTo()
        }, false, b && b.target)
    },
    edit_comment: function (d, f, c) {
        Event.stop(d);
        f = $(f);
        var a = f.up().next(".feature-comment-text");
        if (a.down("textarea")) {
            return
        }
        a.old_comment = a.innerHTML;
        var b = '<p><textarea class="textarea act_as_block" id="comment_edit_#{comment_id}" rows="5" cols="4" >#{comment_content}</textarea></p><p style="text-align:right; margin-bottom:0;"><input type="button" id="comment_save_#{comment_id}" value="Save" class="button"/> <input type="button" id="comment_cancel_#{comment_id}" class="button grayed" value="Cancel"/></p>';
        b = b.interpolate({
            comment_id: c,
            comment_content: a.old_comment.strip().replace(/<br\/>|<br>/g, "\n")
        });
        a.update(b);
        $("comment_save_" + c).observe("click", function (g) {
            Votebox.save_comment(g, c)
        });
        $("comment_cancel_" + c).observe("click", function (g) {
            Votebox.cancel_comment(g, c)
        });
        ActAsBlock.register(a)
    },
    delete_comment: function (c, d, b) {
        Event.stop(c);
        d = $(d);
        var a = d.up(".feature-comment");
        new Ajax.DBRequest("/votebox/delete_comment", {
            parameters: {
                comment_id: b
            }
        });
        a.remove()
    },
    cancel_comment: function (c, b) {
        Event.stop(c);
        var a = $("comment_edit_" + b).up(".feature-comment-text");
        a.update(a.old_comment)
    },
    save_comment: function (c, b) {
        Event.stop(c);
        var a = $("comment_edit_" + b).getValue();
        new Ajax.DBRequest("/votebox/edit_comment", {
            parameters: {
                comment_id: b,
                comment_text: a
            }
        });
        a = a.escapeHTML().replace(/\n/g, "<br/>");
        $("comment_edit_" + b).up(".feature-comment-text").update(a)
    },
    submit_feature: function (b) {
        Event.stop(b);
        var a = $("add-feature-request");
        Forms.ajax_submit(a, false, function (c) {
            window.location = c.responseText
        }, false, b.target)
    },
    how_voting_works: function () {
        Modal.icon_show("comments_32", _("How voting works"), $("howvotingworks"))
    },
    votes_left: function () {
        return parseInt($("votes-left").innerHTML, 10)
    },
    vote: function (d, c) {
        if (c) {
            Event.stop(c)
        }
        d = $(d);
        var b = d.id.slice(4);
        var a = Votebox.votes_left();
        if (a <= 0) {
            Votebox.show_more_votes_modal();
            return
        }
        new Ajax.DBRequest("/votebox/vote", {
            parameters: {
                feature_id: b
            },
            onSuccess: function () {
                if (a == 1) {
                    window.location.reload()
                }
            },
            onFailure: function (e) {
                Votebox.adjust_votes_left(1);
                Votebox.adjust_votes_total(d, -1);
                Votebox.adjust_votes_bubble(d, -1)
            }
        });
        Votebox.adjust_votes_left(-1);
        Votebox.adjust_votes_total(d, 1);
        Votebox.adjust_votes_bubble(d, 1)
    },
    tab_click: function (b, c, a) {
        Event.stop(b);
        Votebox.list_set_url({
            view: a
        });
        Votebox.tab(c)
    },
    tab: function (a) {
        a = $(a);
        a.up("ul").select(".selected").invoke("removeClassName", "selected");
        a.up().addClassName("selected")
    },
    list_set_url: function (b) {
        clearTimeout(Tabs.check_interval);
        var c = b.page || Votebox.page || 0;
        var a = b.view || Votebox.view || "popular";
        if (a != Votebox.view) {
            c = "0"
        }
        var d = ["votebox", a, c].join(":");
        window.location.href = "#" + d;
        Votebox.list_hash_update(a, c)
    },
    list_hash_update: function (a, b) {
        var c = a != Votebox.view || b != Votebox.page;
        if (!c) {
            return
        }
        a = a || "popular";
        b = b || 0;
        Votebox.view = a;
        Votebox.get_features(b);
        Votebox.tab($(a + "-tab").down())
    },
    comment_set_url: function (a) {
        var b = ["votebox", a].join(":");
        window.location.href = "#" + b;
        Votebox.comment_hash_update(a)
    },
    comment_hash_update: function (a) {
        if (a != Votebox.page) {
            a = a || 0;
            Votebox.get_comments(a)
        }
    },
    adjust_votes_left: function (b) {
        var a = Votebox.votes_left();
        a += b;
        $("votes-left").update(a)
    },
    adjust_votes_total: function (d, b) {
        var a = d.previous(".votecount").down("span");
        if (Util.isNumber(a.innerHTML)) {
            var c = parseInt(a.innerHTML, 10);
            a.update(c + b)
        }
    },
    adjust_votes_bubble: function (f, d) {
        var e = f.up(".votebox");
        var b = e.down(".ebubble");
        if (b) {
            var c = b.down(".c");
            var a = parseInt(c.innerHTML, 10);
            a += d;
            if (a === 0) {
                b.remove()
            } else {
                c.update("+" + a)
            }
        } else {
            e.insert(EventBubble.make(new HTML("+1")))
        }
    },
    show_more_votes_modal: function () {
        Modal.icon_show("comments_32", _("Out of votes"), $("outofvotes"))
    },
    features_cache: {},
    features_key: function (a) {
        return Votebox.view + "_" + Votebox.category + "_" + a
    },
    get_features: function (b) {
        var a = Votebox.features_key(b);
        Votebox.page = b;
        assert(Util.isNumber(b), "Feature page is not a number: " + b);
        if (Votebox.features_cache[a]) {
            Votebox.show_features(b)
        } else {
            var c = {};
            c.page = b;
            if (Votebox.view) {
                c.view = Votebox.view
            }
            if (Votebox.category) {
                c.category = Votebox.category
            }
            Feed.showLoading(false, $("features"));
            new Ajax.DBRequest("/votebox/more_features", {
                parameters: c,
                onSuccess: function (d) {
                    Votebox.features_cache[a] = d.responseText;
                    Votebox.show_features(b)
                },
                onComplete: function () {
                    Feed.hideLoading()
                }
            })
        }
    },
    show_features: function (b) {
        var a = Votebox.features_key(b);
        $("features").update(Votebox.features_cache[a])
    },
    comments_cache: {},
    get_comments: function (a) {
        Votebox.page = a;
        assert(Util.isNumber(a), "Comment page is not a number" + a);
        if (Votebox.comments_cache[a]) {
            Votebox.show_comments(a)
        } else {
            Feed.showLoading(false, $("feature-comments"));
            new Ajax.DBRequest("/votebox/more_comments", {
                parameters: {
                    feature_id: Votebox.feature_id,
                    page: a
                },
                onSuccess: function (b) {
                    Votebox.comments_cache[a] = b.responseText;
                    Votebox.show_comments(a)
                },
                onComplete: function () {
                    Feed.hideLoading()
                }
            })
        }
    },
    show_comments: function (a) {
        $("feature-comments").update(Votebox.comments_cache[a])
    },
    search: function (a) {
        Votebox.last_search = a;
        if (SuggestionInput.defaulted($("feature-search")) || a === "") {
            if (a === "") {
                $("hideme").show();
                $("searchresults").hide();
                $("add-feature").hide()
            }
            return
        }
        new Ajax.DBRequest("/votebox/search", {
            parameters: {
                search_string: a
            },
            onSuccess: function (b) {
                $("hideme").hide();
                $("searchresults").show();
                $("searchresults").update(b.responseText);
                $("add-feature").show();
                ActAsBlock.register(false, $("add-feature"))
            }
        })
    }
};
var Team = {
    show_add_modal: function (a) {
        Sharing.reset_wizard();
        DomUtil.fillVal(_("Invite users to this team"), "invite-more-wizard-title");
        DomUtil.fillVal(_("Invite to team"), "invite-more-wizard-share-button");
        var b = _("Add team members to '%(team_name)s'").format({
            team_name: a.em_snippet(15).escapeHTML()
        });
        Modal.icon_show("folder_user_add_32", b, $("invite-more-wizard"), {
            action: Team.add_users
        });
        Team.add_auto_completer = new Autocompleter.ContactsTokenizer("invite-wizard-new-collab-input", "invite-wizard-new-whobulk", "invite-wizard-hidden-input", contacts, lcontacts, {
            tokens: [",", ";"]
        })
    },
    add_users: function (b) {
        Event.stop(b);
        var a = $("invite-more-form");
        assert(a, "Couldn't find the invite more form.");
        Forms.ajax_submit(a, "/account/team/add_users", function (c) {
            Modal.hide();
            $("team-member-info").update(c.responseText)
        }, function () {
            Forms.enable(a.down("input[type='submit']"))
        }, b.target, {
            team_id: Constants.team_id
        })
    },
    show_remove_modal: function (e, f, b, d, c, g) {
        var a = $("team-remove-disable-user-msg");
        if (g) {
            a.show()
        } else {
            a.hide()
        }
        DomUtil.fillVal(d, "remove-user-email");
        DomUtil.fillVal(f, "remove-user-team");
        var h = _("Remove user from '%(team_name)s'").format({
            team_name: f.em_snippet(17).escapeHTML()
        });
        Modal.icon_show("delete_32", h, $("remove-user-modal"), {
            user_id: b,
            disable_if_joined: c,
            button: e
        })
    },
    remove_user: function (c) {
        Event.stop(c);
        var a = Modal.vars.user_id;
        var b = Modal.vars.disable_if_joined;
        new Ajax.DBRequest("/account/team/remove_user", {
            parameters: {
                team_id: Constants.team_id,
                user_id: a,
                disable_if_joined: b
            },
            onSuccess: function (d) {
                var e = Modal.vars.button.up(".bs-row");
                if (e) {
                    e.hide()
                }
                Team.decrement_used_licenses();
                Notify.server_success(_("User removed."))
            },
            cleanUp: function () {
                Modal.hide()
            }
        })
    },
    show_reinvite_modal: function (c, d, a, b) {
        DomUtil.fillVal(b, "reinvite-user-email");
        DomUtil.fillVal(d, "reinvite-user-team");
        var e = _("Resend invite to '%(email_address)s'").format({
            email_address: b.em_snippet(18).escapeHTML()
        });
        Modal.icon_show("email_32", e, $("reinvite-user-modal"), {
            user_id: a,
            button: c
        })
    },
    reinvite_user: function (b) {
        Event.stop(b);
        var a = Modal.vars.user_id;
        new Ajax.DBRequest("/account/team/reinvite_user", {
            parameters: {
                team_id: Constants.team_id,
                user_id: a
            },
            onSuccess: function (c) {
                Notify.server_success(_("Invite sent."));
                $("team-member-info").update(c.responseText)
            },
            cleanUp: function () {
                Modal.hide()
            }
        })
    },
    show_reset_password_modal: function (c, d, a, b) {
        DomUtil.fillVal(b, "reset-password-email");
        var e = _("Reset password for '%(email_address)s'").format({
            email_address: b.em_snippet(17).escapeHTML()
        });
        Modal.icon_show("arrow_refresh_32", e, $("reset-password-modal"), {
            user_id: a,
            button: c
        })
    },
    reset_password: function (b) {
        Event.stop(b);
        var a = Modal.vars.user_id;
        new Ajax.DBRequest("/account/team/reset_password", {
            parameters: {
                team_id: Constants.team_id,
                user_id: a
            },
            onSuccess: function (c) {
                Notify.server_success(_("User's password reset."))
            },
            cleanUp: function () {
                Modal.hide()
            }
        })
    },
    show_admin_status_modal: function (c, k, m, e, l, f) {
        var a = l.strip() || e;
        var d, b, h, g;
        if (f) {
            d = _("Are you sure you want to make %(person_name)s an admin of '%(team_name)s?'").format({
                person_name: a.escapeHTML(),
                team_name: k.escapeHTML()
            });
            b = _("Make admin");
            h = _("Make admin");
            g = "alert_32"
        } else {
            d = _("Are you sure you want to remove admin privileges for %(person_name)s?").format({
                person_name: a.escapeHTML()
            });
            b = _("Remove admin status");
            h = _("Remove admin status");
            g = "alert_32"
        }
        DomUtil.fillVal(e, "admin-status-email");
        DomUtil.fillVal(d, "admin-status-action");
        DomUtil.fillVal(b, "admin-status-button-action");
        Modal.icon_show(g, h, $("admin-status-modal"), {
            user_id: m,
            button: c,
            admin_on: f
        })
    },
    set_admin_status: function (b) {
        Event.stop(b);
        var a = Modal.vars.user_id;
        new Ajax.DBRequest("/account/team/set_admin_status", {
            parameters: {
                team_id: Constants.team_id,
                user_id: a,
                on: Modal.vars.admin_on ? "yes" : "no"
            },
            onSuccess: function (c) {
                var d = Modal.vars.admin_on ? _("User's admin status granted.") : _("User's admin status removed.");
                Notify.server_success(d);
                $("team-member-info").update(c.responseText)
            },
            cleanUp: function () {
                Modal.hide()
            }
        })
    },
    show_team_message_modal: function (a) {
        DomUtil.fillVal(a, "team-message-team");
        var b = _("Send email to members of '%(team_name)s'").format({
            team_name: a.em_snippet(13).escapeHTML()
        });
        $("team-message").value = "";
        Modal.icon_show("page_white_get_32", b, $("team-message-modal"));
        Util.focus.defer("team-message")
    },
    send_team_message: function (b) {
        Event.stop(b);
        var a = $F("team-message").strip();
        if (a) {
            new Ajax.DBRequest("/account/team/send_team_message", {
                parameters: {
                    team_id: Constants.team_id,
                    message: a
                },
                onSuccess: function (c) {
                    Notify.server_success(_("Message successfully sent to team."));
                    Modal.hide()
                }
            })
        }
    },
    show_migrate_modal: function (c, d, a, b) {
        DomUtil.fillVal(b, "migrate-email");
        Modal.icon_show("alert_32", _("Migrate user to '%(team_name)s'").format({
            team_name: d.em_snippet(19).escapeHTML()
        }), $("migrate-modal"), {
            user_id: a,
            button: c
        })
    },
    start_migration: function (b) {
        Event.stop(b);
        var a = Modal.vars.user_id;
        new Ajax.DBRequest("/account/team/start_migration", {
            parameters: {
                team_id: Constants.team_id,
                user_id: a
            },
            onSuccess: function (c) {
                Notify.server_success(_("User migration initiated."));
                $("team-member-info").update(c.responseText)
            },
            cleanUp: function () {
                Modal.hide()
            }
        })
    },
    used_licenses: 0,
    total_licenses: 0,
    set_used_licenses: function (a, b) {
        Team.used_licenses = a;
        Team.total_licenses = b;
        $("team-used-licenses").update(a);
        $("team-avail-licenses").update(b - a)
    },
    decrement_used_licenses: function () {
        Team.set_used_licenses(Team.used_licenses - 1, Team.total_licenses)
    },
    show_migration_link: function (a, b) {
        $("migration-url").value = b;
        Modal.icon_show("alert_32", _("Migration link for '%(email)s'").format({
            email: a.em_snippet(18).escapeHTML()
        }), $("migrate-url-modal"));
        $("migration-url").select()
    }
};
var Sharing;
var SF_VIEWS = {
    CURRENT: "current",
    PAST: "past"
};
Sharing = {
    _tmpl: null,
    init: function (a) {
        [a.current, a.past].each(function (b) {
            b.each(function (c) {
                Sharing._decode_sort_key(c)
            })
        });
        Sharing._state = {
            sf_info: a,
            view: SF_VIEWS.CURRENT,
            cmp: Sharing._modified_cmp,
            is_ascending: false,
            inbox_count: 0
        };
        if (window.contacts === undefined || window.lcontacts === undefined) {
            Sharing.load_contacts()
        }
        Sharing.listen();
        Sharing._tmpl = HTML.tmpl("sf_list_item_tmpl");
        Sharing._render()
    },
    _decode_sort_key: function (a) {
        assert(a.encoded_sort_key && a.sort_key === undefined, "expected encoded sort keys on each elm");
        a.sort_key = Util.decode_sort_key(a.encoded_sort_key);
        delete a.encoded_sort_key
    },
    set_inbox_count: function (a) {
        assert(typeof (a) === "number" && a >= 0, "invalid inbox count");
        Sharing._state.inbox_count = a
    },
    listen: function () {
        var a = function (h, m, l) {
                var f = h.memo.target_ns_id;
                assert(f, "SF _transfer w/o target_ns_id");
                var g, k;
                for (var d = 0, c = m.length; d < c; d++) {
                    if (m[d].target_ns_id === f) {
                        g = m[d];
                        k = d;
                        break
                    }
                }
                assert(k !== undefined, "SF _transfer w/o js obj");
                m.splice(k, 1);
                $$("li.sf-folder")[k].remove();
                Sharing._empty_check();
                l.push(g);
                return g
            };
        var b = function (g, k) {
                var f = g.memo.target_ns_id;
                assert(f !== undefined, "SF _remove w/o target_ns_id");
                var h;
                for (var d = 0, c = k.length; d < c; d++) {
                    if (k[d].target_ns_id === f) {
                        h = d;
                        break
                    }
                }
                assert(h !== undefined, "SF _remove w/o js obj");
                k.splice(h, 1);
                $$("li.sf-folder")[h].remove();
                Sharing._empty_check()
            };
        document.observe(FileEvents.SF_UNSHARE, function (c) {
            b(c, Sharing._state.sf_info.current)
        });
        document.observe(FileEvents.SF_LEAVE, function (c) {
            a(c, Sharing._state.sf_info.current, Sharing._state.sf_info.past)
        });
        document.observe(FileEvents.SF_REJOIN, function (d) {
            var c = a(d, Sharing._state.sf_info.past, Sharing._state.sf_info.current);
            c.filename = d.memo.filename
        });
        document.observe(FileEvents.SF_IGNORE, function (c) {
            b(c, Sharing._state.sf_info.past)
        });
        document.observe(FileEvents.SF_NEW, function (d) {
            var c = d.memo.sf_info;
            assert(c, "SF_NEW without info");
            Sharing._state.sf_info.current.push(c);
            Sharing._render()
        });
        $("create-share").observe("click", function (c) {
            Event.stop(c);
            Sharing.start_wizard(c)
        });
        if ($("new-invites-link")) {
            $("new-invites-link").observe("click", function (c) {
                Event.stop(c);
                Sharing.show_invites(Sharing._state.inbox_count)
            })
        }
        document.on("click", ".filter-option", function (e, d) {
            e.preventDefault();
            var c = d.readAttribute("data-filter");
            var f = d.innerHTML;
            $$(".current-filter")[0].__date(f);
            Sharing._filter(c)
        });
        $("sf-list").on("click", "a.options-link", function (h, f) {
            Event.stop(h);
            var c = f.readAttribute("data-type");
            var d = f.readAttribute("data-mount");
            var g = parseInt(f.readAttribute("data-nsid"), 10);
            if (c == "normal") {
                Sharing.get_sharing_options(d)
            } else {
                if (c == "remove") {
                    Sharing.ignore(d, g)
                } else {
                    if (c == "rejoin") {
                        Sharing.rejoin(d, g)
                    }
                }
            }
        });
        $("sf-sort").on("click", "a.sort-option", function (f, d) {
            Event.stop(f);
            var g = {
                SF_BY_NAME: Sharing._name_cmp,
                SF_BY_MODIFIED: Sharing._modified_cmp
            };
            var c = g[d.readAttribute("data-sort")];
            if (Sharing._state.cmp === c) {
                Sharing._state.is_ascending = !Sharing._state.is_ascending
            } else {
                Sharing._state.cmp = c;
                Sharing._state.is_ascending = true
            }
            Util.add_sort_arrow_mouseover(d, Sharing._state.is_ascending, "#sf-sort a.sort-option", true);
            Sharing._render()
        });
        Util.add_sort_arrow_mouseover($("modified-sorter"), Sharing._state.is_ascending, "#sf-sort a.sort-option", false)
    },
    _filter: function (a) {
        if (Sharing._state.view == a) {
            return
        }
        Sharing._state.view = a;
        Sharing._render()
    },
    _render: function () {
        var c = Sharing._get_current_sf_list();
        var d = Sharing._state.view == SF_VIEWS.PAST;
        var b = function (e, g) {
                var f = Sharing._state.is_ascending ? 1 : -1;
                return f * Sharing._state.cmp(e, g)
            };
        var a = [];
        c.sort(b);
        c.each(function (e) {
            a.push(Sharing._tmpl({
                options_str: _("Options"),
                remove_str: _("Remove"),
                rejoin_str: _("Rejoin"),
                is_past: d,
                sf: e
            }))
        });
        $("sf-list").__date(a);
        Sharing._empty_check()
    },
    _empty_check: function () {
        if (Sharing._get_current_sf_list().length) {
            $("sf-view").removeClassName("empty-list")
        } else {
            $("sf-view").addClassName("empty-list")
        }
    },
    _get_current_sf_list: function () {
        var a = Sharing._state.sf_info;
        switch (Sharing._state.view) {
        case SF_VIEWS.CURRENT:
            return a.current;
        case SF_VIEWS.PAST:
            return a.past;
        default:
            assert(false, "invalid sf state")
        }
    },
    _get_empty_msg: function () {
        switch (Sharing._state.view) {
        case SF_VIEWS.CURRENT:
            return _("(You aren't sharing any folders)");
        case SF_VIEWS.PAST:
            return _("You haven't left any shared folders)");
        default:
            assert(false, "invalid sf state")
        }
    },
    _name_cmp: function (a, b) {
        return Util.sort_by_rank_or_key(a, b)
    },
    _modified_cmp: function (a, b) {
        return a.modified_ts - b.modified_ts
    },
    include_fb: false,
    use_fb_profile_pics: true,
    init_invites: function () {
        Sharing.show_invites(Sharing._state.inbox_count)
    },
    show_invites: function (a) {
        if (Constants.EMAIL_VERIFIED) {
            Modal.icon_show("email_32", _("Shared folder invitations (%d)").format(a), $("invites-container"))
        } else {
            Sharing.show_email_verification_modal()
        }
    },
    get_sharing_options: function (a) {
        a = Util.normalize(a);
        Modal.show_loading("folder_user_32", _("Loading shared folder options..."));
        new Ajax.DBRequest("/share_options" + Util.urlquote(a), {
            onSuccess: function (b) {
                Sharing.reshow = function () {
                    Sharing.show_sharing_options(b.responseText, a);
                    (function () {
                        if (Sharing.tc) {
                            Sharing.tc.toggle($("members"))
                        }
                    }).defer();
                    delete Modal.onHide
                };
                Sharing.reshow_invite_more = function () {
                    Sharing.show_sharing_options(b.responseText, a);
                    delete Modal.onHide
                };
                Sharing.show_sharing_options(b.responseText, a)
            },
            onFailure: function () {
                Modal.hide()
            }
        })
    },
    show_sharing_options: function (a, b) {
        var c = _("Shared folder options for '%(file_name)s'").format({
            file_name: FileOps.filename(b).em_snippet(13).escapeHTML()
        });
        Modal.icon_show("folder_user_32", c, a, {}, false);
        if (Constants.EMAIL_VERIFIED) {
            Sharing.sharing_options_auto_completer = new Autocompleter.ContactsTokenizer("sharing-options-new-collab-input", "sharing-options-new-whobulk", "sharing-options-hidden-input", contacts, lcontacts, {
                tokens: [",", ";"],
                include_fb: true
            })
        } else {
            $("email-verify-share-options").show();
            $("invite-more-form").hide();
            Sharing.email_verification_listen()
        }
    },
    reset_wizard: function () {
        SuggestionInput.reset("invite-wizard-new-collab-input");
        SuggestionInput.reset("custom-message-wizard");
        SuggestionInput.reset("new_folder_name");
        var a = $("invite-more-form").down("input[name='folder_name']");
        if (a) {
            a.remove()
        }
    },
    validate_folder: function (f, c, g) {
        c = $(c);
        var b = c.down("#folder_name");
        if (b) {
            if ($$("#modal-content #copy-move-treeview .highlight .s_folder_user").length) {
                return Sharing.show_invite_more_modal($F(b))
            }
        }
        var d = $(f.target);
        if (d && d.tagName != "input") {
            var a = d.up("#modal-content");
            d = a.down("input.button")
        }
        assert(c, "Trying to validate a folder where the form doesn't exist");
        Forms.ajax_submit(c, false, function () {
            if (g && typeof (g) == "function") {
                g(f, c)
            }
        }, false, d);
        return false
    },
    start_wizard: function (a) {
        if (Constants.EMAIL_VERIFIED) {
            Sharing.reset_wizard();
            if (a) {
                Event.stop(a)
            }
            Modal.icon_show("folder_user_32", _("Share a folder"), $("shared-folder-wizard"));
            $("create-new-sf").focus()
        } else {
            Sharing.show_email_verification_modal()
        }
    },
    wizard_next: function (a) {
        Event.stop(a);
        if ($("create-new-sf").checked) {
            Sharing.validate_folder(a, "validate-folder-name", Sharing.from_new_to_invitation)
        } else {
            Modal.show(new Element("span").insert(Sprite.make("folder_user_32", {}).addClassName("modal-h-img")).insert(_("Choose folder to share")), $("existing-shared-folder-wizard"));
            TreeView.move("copy-move-treeview", "share-existing-treeview", {
                onSuccess: function () {
                    $("modal").observe("db:treeview_selected", function (c) {
                        $("folder_name").setValue(c.memo.path)
                    });
                    var b = $("first-treeview-link");
                    if (!Util.ie) {
                        b.onclick()
                    }
                }
            })
        }
        $$("#modal-content .suggestion-input").each(SuggestionInput.register)
    },
    from_new_to_invitation: function (d, b) {
        var f = $F(b.down("#new_folder_name")).strip();
        assert(f, "Moving from new folder to invite modal with no path.");
        Sharing.show_invite_more_wizard(f);
        Modal.vars.action = Sharing.submit_share_new_wizard;
        Modal.vars.path = "/" + f;
        var a = $("invite-more-form");
        var c = a.down("input[name=folder_name]");
        if (!c) {
            c = new Element("input", {
                type: "hidden",
                name: "folder_name"
            });
            a.insert(c)
        }
        c.setValue(f);
        $("share-invite-button").setValue(_("Share folder"))
    },
    from_existing_to_invitation: function (f, c, d) {
        if (!d) {
            d = $F(c.down("#folder_name")).strip()
        }
        assert(d, "Moving from choose a folder to invite modal with no path.");
        Sharing.show_invite_more_wizard(FileOps.filename(d));
        Modal.vars.action = Sharing.submit_share_existing_wizard;
        Modal.vars.path = d.strip();
        var b = $("invite-more-form");
        var a = b.down("input[name=path]");
        if (!a) {
            a = new Element("input", {
                type: "hidden",
                name: "path"
            });
            b.insert(a)
        }
        a.setValue(d);
        $("share-invite-button").setValue(_("Share folder"))
    },
    show_invite_more_wizard: function (b) {
        assert(b, "Folder name required");
        DomUtil.fillVal("folder", "invite-more-wizard-share-type");
        var a = _("Share '%(folder_name)s' with others").format({
            folder_name: b.em_snippet(16).escapeHTML()
        });
        Modal.icon_show("folder_user_32", a, $("invite-more-wizard"));
        if (Sharing.invite_wizard_auto_completer) {
            Sharing.invite_wizard_auto_completer.clearTokens()
        } else {
            Sharing.invite_wizard_auto_completer = new Autocompleter.ContactsTokenizer("invite-wizard-new-collab-input", "invite-wizard-new-whobulk", "invite-wizard-hidden-input", contacts, lcontacts, {
                tokens: [",", ";"],
                include_fb: true
            })
        }
    },
    show_cli: function () {
        Referral.select_all = 0;
        Sharing.old_state = Modal.vars;
        Modal.onHide = Sharing.hide_cli;
        Referral.show_login_modal()
    },
    hide_cli: function () {
        Referral.select_no_contacts();
        Sharing.add_from_cli();
        Sharing.load_contacts();
        delete Modal.onHide;
        return false
    },
    add_from_cli: function () {
        var c = Referral.get_selected_emails();
        Sharing.show_invite_more_wizard(FileOps.filename(Sharing.old_state.path));
        Modal.vars = Sharing.old_state;
        var b = $("new-collab-input");
        SuggestionInput.do_blank("new-collab-input");
        var a = $F(b);
        if (c) {
            b.setValue(a + (a.length > 0 ? ", " : "") + c);
            b.addClassName("suggestion-input-unfaded")
        }
        delete Modal.onHide
    },
    submit_share_new_wizard: function (b) {
        var a = $("invite-more-form");
        assert(a, "Couldn't find the invite more form.");
        Forms.ajax_submit(a, "/share_ajax/new", function (c) {
            Modal.hide();
            var d = Util.from_json(c.responseText);
            Sharing._decode_sort_key(d);
            Notify.server_success(_("Created shared folder '%(folder_name)s'").format({
                folder_name: d.filename
            }));
            document.fire(FileEvents.SF_NEW, {
                sf_info: d
            })
        }, function () {
            Forms.enable(a.down("input[type='submit']"))
        }, b.target);
        return false
    },
    submit_share_existing_wizard: function (b) {
        var a = $("invite-more-form");
        assert(a, "Couldn't find the invite more form.");
        Forms.ajax_submit(a, "/share_ajax/existing?long_running", function (c) {
            Modal.hide();
            var d = Util.from_json(c.responseText);
            Sharing._decode_sort_key(d);
            Notify.server_success(_("The shared folder %(folder_name)s has been created.").format({
                folder_name: d.filename
            }));
            document.fire(FileEvents.SF_NEW, {
                sf_info: d
            })
        }, function () {
            Forms.enable(a.down("input[type='submit']"))
        }, b.target);
        return false
    },
    show_share_existing_modal: function (a) {
        if (Constants.EMAIL_VERIFIED) {
            Sharing.reset_wizard();
            Sharing.from_existing_to_invitation(false, false, a)
        } else {
            Sharing.show_email_verification_modal()
        }
    },
    show_invite_more_modal: function (a) {
        Sharing.reset_wizard();
        Sharing.get_sharing_options(a)
    },
    submit_invite_more_wizard: function (b) {
        var a = $("invite-more-form");
        assert(a.down("input[name=ns_id]"), "Submit invite more wizard is missing ns_id");
        Forms.ajax_submit(a, "/share_ajax/invite_more", function () {
            Notify.server_success(_("Invited successfully."));
            Modal.hide()
        }, function () {}, b.target);
        return false
    },
    show_email_verification_modal: function () {
        Modal.icon_show("email_32", _("Verify your email address"), $("verify-email"));
        Sharing.email_verification_listen()
    },
    reshow_email_verification_modal: function () {
        Sharing.show_email_verification_modal();
        delete Modal.onHide
    },
    email_verification_listen: function () {
        document.observe(EmailVerification.EMAIL_SENT_EVT, function () {
            $$(".email-verify-step1").invoke("hide");
            $$(".email-verify-step2").invoke("show");
            var a = _("Verification email sent to %(email)s").format({
                email: Constants.email.escapeHTML()
            });
            Notify.server_success(a)
        })
    },
    show_email_verified_modal: function () {
        Modal.icon_show("email_32", _("Your email address has been verified!"), $("email-verified"))
    },
    show_verification_email_sent_modal: function () {
        Modal.icon_show("email_32", _("Verification email sent!"), $("verification-email-sent"))
    },
    show_leave_modal: function (b, a) {
        Modal.onHide = Sharing.reshow;
        var d = _("Leave the shared folder '%(folder_name)s'").format({
            folder_name: FileOps.filename(b).em_snippet(14).escapeHTML()
        });
        Modal.icon_show("folder_user_delete_32", d, DomUtil.fromElm("leave-confirm"), {
            wit_group: "share-leave-confirm"
        });
        var c = $("leave-share-form");
        c.action = "/share_ajax/leave?long_running";
        Modal.vars.ns_id = a;
        Modal.vars.folder_path = b
    },
    submit_leave: function (f) {
        assert(Modal.vars.folder_path.length, "submit_leave: No shared folder path.");
        assert(Modal.vars.ns_id, "submit_leave: missing ns_id");
        delete Modal.onHide;
        var b = Modal.vars.folder_path;
        var d = Modal.vars.ns_id;
        var c = $("leave-share-form");
        Forms.add_vars(c, {
            ns_id: d
        });
        var a = c.down("#keep_files").checked;
        Forms.ajax_submit(c, false, function () {
            var e = _("You removed yourself from '%(msg)s'.").format({
                msg: FileOps.filename(b).snippet().escapeHTML()
            });
            Modal.hide();
            Notify.server_success(e);
            document.fire(FileEvents.SF_LEAVE, {
                target_ns_id: d,
                folder_deleted: !a
            })
        }, function () {}, f.target);
        return false
    },
    show_unshare_modal: function (b, a) {
        Modal.onHide = Sharing.reshow;
        var d = _("Unshare '%(folder_name)s'").format({
            folder_name: FileOps.filename(b).em_snippet(21).escapeHTML()
        });
        Modal.icon_show("alert_32", d, DomUtil.fromElm("unshare-confirm"), {
            wit_group: "share-unshare-confirm"
        });
        var c = $("unshare-form");
        Modal.vars.path = b;
        Modal.vars.ns_id = a;
        c.action = "/share_ajax/unshare?long_running"
    },
    submit_unshare: function (b) {
        delete Modal.onHide;
        var a = $("unshare-form");
        assert(Modal.vars.path, "submit_unshare: No shared folder path.");
        assert(Modal.vars.ns_id, "submit_unshare: missing ns_id");
        Forms.add_vars(a, {
            ns_id: Modal.vars.ns_id
        });
        Forms.ajax_submit(a, false, function () {
            Modal.hide();
            Notify.server_success(_("Unshared folder '%(folder_name)s'").format({
                folder_name: FileOps.filename(Modal.vars.path).snippet()
            }));
            document.fire(FileEvents.SF_UNSHARE, {
                target_ns_id: Modal.vars.ns_id
            })
        }, function () {}, b.target);
        return false
    },
    remove_div: function (a) {
        $(a).up(".bs-row").remove();
        return false
    },
    leave: function () {
        Modal.show(_("Leave shared folder?"), DomUtil.fromElm("leave-confirm"), {
            wit_group: "share-leave-confirm"
        })
    },
    unshare: function () {
        Modal.show(_("Unshare folder?"), DomUtil.fromElm("unshare-confirm"), {
            wit_group: "share-unshare-confirm"
        })
    },
    ignore: function (c, a) {
        assert(a, "Share ignore did not get an ns_id");
        var d = _("Permanently remove '%(folder_name)s'").format({
            folder_name: FileOps.filename(c).em_snippet(15).escapeHTML()
        });
        Modal.icon_show("folder_delete_32", d, DomUtil.fromElm("ignore-confirm"), {
            wit_group: "share-ignore-confirm"
        });
        var b = $("modal-content").down("form");
        b.action = "/share_action/ignore?longrunning";
        Forms.add_vars(b, {
            ns_id: a
        });
        Modal.vars.path = c;
        Modal.vars.ns_id = a
    },
    submit_ignore: function (b) {
        if (b) {
            Event.stop(b)
        }
        var a = $("share-ignore-form");
        assert(a, "Missing submit_ignore_form");
        Forms.ajax_submit(a, false, function (c) {
            Modal.hide();
            Notify.server_success(_("Removed shared folder successfully."));
            document.fire(FileEvents.SF_IGNORE, {
                target_ns_id: Modal.vars.ns_id
            })
        }, function () {}, b && b.target)
    },
    rejoin: function (c, a) {
        assert(a, "Rejoin didn't get an ns_id");
        var d = _("Rejoin the shared folder '%(folder_name)s'?").format({
            folder_name: FileOps.filename(c).em_snippet(13).escapeHTML()
        });
        Modal.icon_show("alert_32", d, DomUtil.fromElm("rejoin-confirm"), {
            wit_group: "share-rejoin-confirm"
        });
        var b = $("modal-content").down("form");
        b.action = "/share_action/rejoin?longrunning";
        Forms.add_vars(b, {
            ns_id: a
        });
        Modal.vars.path = c;
        Modal.vars.ns_id = a
    },
    submit_rejoin: function (b) {
        Event.stop(b);
        var a = $("rejoin-form");
        Forms.ajax_submit(a, false, function (d) {
            var c = FileOps.filename(d.responseText);
            Modal.hide();
            Notify.server_success(_("Rejoined shared folder successfully."));
            document.fire(FileEvents.SF_REJOIN, {
                target_ns_id: Modal.vars.ns_id,
                filename: c
            })
        }, false, b.target);
        return false
    },
    show_change_sf_owner_modal: function (c, d, a, b) {
        DomUtil.fillVal(c, "change_sf_owner-confirm-nickname");
        Modal.onHide = Sharing.reshow;
        var f = _("Make %(person_name)s the owner of this folder?").format({
            person_name: c.em_snippet(14).escapeHTML()
        });
        Modal.icon_show("alert_32", f, DomUtil.fromElm("change_sf_owner-confirm"), {
            wit_group: "share-change-sf-owner-confirm"
        });
        var e = $("change-sf-owner-form");
        e.action = "/share_ajax/change_sf_owner";
        Modal.vars.ns_id = a;
        Modal.vars.user_id = b
    },
    submit_change_sf_owner: function (b) {
        delete Modal.onHide;
        $("make-owner-button").disable();
        assert(Modal.vars.ns_id, "submit_change_sf_owner: missing ns_id");
        assert(Modal.vars.user_id, "submit_change_sf_owner: missing user_id");
        var a = $("change-sf-owner-form");
        Forms.add_vars(a, {
            ns_id: Modal.vars.ns_id,
            user_id: Modal.vars.user_id
        });
        Forms.ajax_submit(a, false, function () {
            var c = _("Ownership changed successfully.");
            Notify.server_success(c);
            Modal.hide()
        }, function () {}, b.target);
        return false
    },
    cancel_user: function (e, a, d, b) {
        var c = _("Are you sure you want to uninvite %(email_or_fbname)s?").format({
            email_or_fbname: e
        });
        if (confirm(c)) {
            new Ajax.DBRequest("/share_ajax/cancel_invite", {
                parameters: {
                    ns_id: a,
                    invite_id: d
                },
                onSuccess: function (f) {
                    Sharing.remove_div(b);
                    Notify.server_success(e.escapeHTML() + " has been uninvited.")
                }
            })
        }
    },
    kick_user: function (c, e, a, b, d, f) {
        Modal.onHide = Sharing.reshow;
        DomUtil.fillVal(c, "kick-confirm-nickname");
        var g = _("Kick %(person_name)s out of Folder?").format({
            person_name: c
        });
        Modal.icon_show("folder_user_delete_32", g, DomUtil.fromElm("kick-confirm"), {
            button: d,
            victim: e,
            ns_id: a,
            user_id: b,
            wit_group: "share-kick-confirm"
        })
    },
    do_kick: function (b, c, d) {
        var a = $F("keep-files-check");
        new Ajax.DBRequest("/share_ajax/kick_user", {
            parameters: {
                ns_id: b,
                user_id: c,
                keep_files: a
            },
            onSuccess: function () {
                Notify.server_success(_("User removed successfully."));
                Modal.hide()
            }
        })
    },
    reinvite_user: function (b, a) {
        new Ajax.DBRequest("/share_ajax/reinvite_user/" + PAGE_PATH, {
            parameters: {
                invite_id: a
            },
            onSuccess: function (c) {
                Notify.server_success(_("%(email_or_fbname)s was reinvited successfully").format({
                    email_or_fbname: b
                }))
            }
        });
        return false
    },
    load_contacts: function (a) {
        if (Sharing.loading_contacts) {
            return false
        }
        Sharing.loading_contacts = true;
        new Ajax.DBRequest("/get_contacts", {
            parameters: {
                include_fb: a && Constants.can_fb_invite
            },
            onSuccess: function (b) {
                var c = b.responseText.evalJSON(false);
                window.contacts = c.contacts;
                window.lcontacts = c.lcontacts;
                Sharing.loading_contacts = false;
                if (Sharing.sharing_options_auto_completer) {
                    Sharing.sharing_options_auto_completer.options.array = window.contacts;
                    Sharing.sharing_options_auto_completer.options.larray = window.lcontacts
                }
                if (Sharing.invite_wizard_auto_completer) {
                    Sharing.invite_wizard_auto_completer.options.array = window.contacts;
                    Sharing.invite_wizard_auto_completer.options.larray = window.lcontacts
                }
            }
        })
    }
};
var SharedFolderInvites = {
    pages: {},
    contents: {},
    register_all: function () {
        $$(".expand-invite").each(function (a) {
            SharedFolderInvites.register(a)
        })
    },
    register: function (a) {
        a.db_observe("click", SharedFolderInvites.expand)
    },
    expand: function (f, d, a) {
        Event.stop(f);
        d = $(d);
        if (SharedFolderInvites.animating) {
            return
        }
        var b = d.up(".invite");
        var c = [];
        SharedFolderInvites.get_sf_contents(b, a);
        if (b.hasClassName("active")) {
            c.push(SharedFolderInvites.hide(b))
        } else {
            c.push(SharedFolderInvites.show(b))
        }
        $$("div.invite.active").each(function (e) {
            if (e != b) {
                c.push(SharedFolderInvites.hide(e))
            }
        });
        SharedFolderInvites.animating = true;
        new Effect.Parallel(c, {
            duration: 0.5,
            afterFinish: function () {
                SharedFolderInvites.animating = false
            }
        })
    },
    show: function (b) {
        b.addClassName("active");
        var c = b.down(".invite-details");
        var a = b.down(".toggler");
        Sprite.replace(a, "plus", "minus");
        return new Effect.BlindDown(c, {
            sync: true,
            afterFinish: function () {
                c.style.height = "auto"
            }
        })
    },
    hide: function (b) {
        b.removeClassName("active");
        var c = b.down(".invite-details");
        var a = b.down(".toggler");
        Sprite.replace(a, "minus", "plus");
        return new Effect.BlindUp(c, {
            sync: true
        })
    },
    show_page: function (a) {
        Feed.hideLoading();
        $("invites-container").update(SharedFolderInvites.pages[a]);
        SharedFolderInvites.register_all()
    },
    get_page: function (a) {
        if (!SharedFolderInvites.pages[0] && a == 1) {
            SharedFolderInvites.pages[0] = $("invites-container").innerHTML
        }
        if (SharedFolderInvites.pages[a]) {
            SharedFolderInvites.show_page(a)
        } else {
            Feed.showLoading(false, $("invites-container"), false, true);
            new Ajax.DBRequest("/share_ajax/invitation_page?page=" + a, {
                onSuccess: function (b) {
                    SharedFolderInvites.pages[a] = b.responseText;
                    SharedFolderInvites.show_page(a)
                }
            })
        }
        return false
    },
    get_sf_contents: function (b, a) {
        if (SharedFolderInvites.contents[a]) {
            SharedFolderInvites.show_sf_contents(b, a)
        } else {
            new Ajax.DBRequest("/share_ajax/sf_contents?ns_id=" + a, {
                onSuccess: function (c) {
                    SharedFolderInvites.contents[a] = c.responseText;
                    SharedFolderInvites.show_sf_contents(b, a)
                }
            })
        }
    },
    show_sf_contents: function (b, a) {
        b.down(".folder-contents").update(SharedFolderInvites.contents[a])
    },
    mailto: function (b, a) {
        Event.stop(b);
        window.location = "mailto:" + a
    }
};
var ShareView = {
    current_view: "gallery",
    click: function (a) {
        ShareView.toggle_view(a);
        HashRouter.set_hash("view", a);
        return false
    },
    toggle_view: function (b) {
        b = b || "gallery";
        var c = $(b + "-link");
        if (!c) {
            return
        }
        $$("#toggle-view .selected").invoke("removeClassName", "selected");
        c.addClassName("selected");
        $$(".view").invoke("hide");
        var a = $(b + "-view");
        if (a) {
            a.show()
        }
        ShareView.current_view = b
    },
    show_all: function (c, b, a) {
        if (b) {
            Event.stop(b)
        }
        $(c).up().remove();
        new Effect.BlindFadeDown(a)
    }
};
var SM = {
    r: function (e, c, d, b) {
        var f = {
            tkey: e,
            action: c,
            visitor_user_id: d,
            subpath: b
        };
        var a = Object.toJSON(f);
        if (Jcached.get(a)) {
            return
        }
        Jcached.set(a, 1, 2000);
        new Ajax.Request("/ajax_sm_visit", {
            parameters: f
        })
    }
};
var TokenListView = {
    sort_by_filename: function (a) {
        return parseInt(a.down(".filename .hidden").innerHTML, 10)
    },
    sort_by_size: function (a) {
        return parseInt(a.down(".filesize .hidden").innerHTML, 10)
    },
    sort_by_modified: function (a) {
        return -1 * parseInt(a.down(".modified .hidden").innerHTML, 10)
    },
    sort: function (f) {
        Event.stop(f);
        var h = $(f.target).up("a");
        if (h.asc != -1) {
            h.asc = -1
        } else {
            h.asc = 1
        }
        var a = h.className;
        var k = {
            "sort-filename": TokenListView.sort_by_filename,
            "sort-filesize": TokenListView.sort_by_size,
            "sort-modified": TokenListView.sort_by_modified
        };
        var l = $$("#list-view .filerow");
        var g = l.sort_by_key(k[a], h.asc != 1);
        l.invoke("remove");
        var m = new Element("div");
        for (var c = 0, d = g.length; c < d; c += 1) {
            m.insert(g[c])
        }
        $("list-browser").insert(m.innerHTML);
        $$(".sort-tick").invoke("remove");
        var b = Sprite.make(h.asc === 1 ? "sort-downtick-on" : "sort-uptick-on");
        b.addClassName("sort-tick");
        h.insert(b)
    }
};
var ContactTypes = {
    EMAIL: 0,
    FB: 1,
    INVALID: 2
};
Autocompleter.Contacts = Class.create(Autocompleter.Base, {
    initialize: function (c, f, e, b, a) {
        this.baseInitialize(c, f, a);
        this.options.array = e;
        this.options.larray = b;
        this.options.frequency = 0.1;
        var d = this.options.include_fb === true;
        if (!window.contacts) {
            (function () {
                Sharing.load_contacts(d)
            }).defer()
        }
        this.options.onShow = function (g, h) {
            if (!h.style.position || h.style.position == "absolute") {
                h.style.position = "absolute";
                Position.clone(g, h, {
                    setHeight: false,
                    offsetTop: g.offsetHeight - 1
                })
            }
            Effect.Appear(h, {
                duration: 0.15
            })
        }
    },
    getToken: function () {
        var a = this.getTokenBounds();
        return this.element.value.substring(a[0], a[1])
    },
    getUpdatedChoices: function () {
        if (!this.options.array && window.contacts && window.lcontacts) {
            this.options.array = window.contacts;
            this.options.larray = window.lcontacts
        }
        this.updateChoices(this.options.selector(this))
    },
    setOptions: function (a) {
        this.options = Object.extend({
            choices: 5,
            selector: function (B) {
                var E = [];
                var d = B.getToken().toLowerCase();
                var t = B.options.array.length;
                var C = B.options.choices;
                var D = B.options.array;
                var u = B.options.larray;
                var q = [];
                if (d.indexOf(" ") == -1) {
                    q.push("\\s+")
                }
                if (d.indexOf("+") == -1) {
                    q.push("\\+")
                }
                if (d.indexOf("@") == -1) {
                    q.push("@")
                }
                if (d.indexOf(".") == -1) {
                    q.push("\\.")
                }
                if (d.indexOf("&lt;") == -1) {
                    q.push("&lt;")
                }
                var g = RegExp("(" + q.join("|") + ")");
                for (var m = 0; m < t && E.length < C; m++) {
                    var A = D[m];
                    var h = u[m];
                    var F = -1;
                    var n = [];
                    var s = [];
                    var k = "";
                    switch (A.type) {
                    case ContactTypes.EMAIL:
                        n.push(A.name, A.email);
                        s.push(h.name, h.email);
                        k = "/static/images/icons/mail28.png";
                        break;
                    case ContactTypes.FB:
                        n.push(A.name);
                        s.push(h.name);
                        if (Sharing.use_fb_profile_pics) {
                            k = "https://graph.facebook.com/" + h.fb_id + "/picture"
                        } else {
                            k = "/static/images/icons/fb24.png"
                        }
                        break;
                    default:
                        assert(false, "should never get here due to type: " + A.type + ", " + A.name + ", " + A.email + ", " + A)
                    }
                    for (var y = 0; y < s.length; y++) {
                        var r = q.length ? s[y].split(g) : [s[y]];
                        var z = 0;
                        var x = r.length;
                        for (var o = 0; o < x; o++) {
                            if (!r[o]) {
                                continue
                            }
                            if (r[o].indexOf(d) === 0) {
                                F = z;
                                break
                            }
                            z += r[o].length
                        }
                        if (F != -1) {
                            n[y] = n[y].substr(0, F) + "<strong>" + n[y].substr(F, d.length) + "</strong>" + n[y].substr(F + d.length);
                            break
                        }
                    }
                    if (A.type == ContactTypes.FB) {
                        n.push(_("Invite via Facebook"))
                    }
                    if (F != -1) {
                        var b = "<image src='" + k + "' width='28px' height='28px'/>";
                        var v = "<div class='autocomplete-line'>" + n[0] + "</div>";
                        var w = "<div class='autocomplete-line autocomplete-secondary'>" + n[1] + "</div>";
                        var f = "<div class='autocomplete-left'>" + b + "</div>";
                        var e = "<div>" + v + w + "</div>";
                        E.push("<li value='" + m + "'>" + f + e + "</li>")
                    }
                }
                return "<ul>" + E.join("") + "</ul>"
            }
        }, a || {})
    },
    selectEntry: function () {
        var c = this.getCurrentEntry();
        var b = this.options.array[c.value];
        if (b.type == ContactTypes.FB) {
            c.innerHTML = b.name
        } else {
            c.innerHTML = b.email
        }
        var a = this.options.tokens.length > 1 ? this.options.tokens[0] + " " : "";
        c.innerHTML += a;
        this.active = false;
        this.updateElement(c);
        $(this.element).fire("db:autocompleted")
    }
});
var Token = Class.create({
    initialize: function (c, b, d, a) {
        this.element = $(c);
        this.token_manager = d;
        this.hidden_input = b;
        this.element.token = this;
        this.selected = false;
        this.is_valid = a;
        Event.observe($("tokenized_autocompleter_container"), "click", this.onclick.bindAsEventListener(this))
    },
    select: function () {
        this.token_manager.token = this;
        this.hidden_input.element.activate();
        this.selected = true;
        this.element.addClassName("token_selected")
    },
    deselect: function () {
        if (this.token_manager.token == this) {
            this.token_manager.token = null
        }
        this.selected = false;
        this.element.removeClassName("token_selected")
    },
    onclick: function (a) {
        if (a && a.preventDefault) {
            a.preventDefault()
        }
        if (this.detect(a) && !this.selected) {
            this.select()
        } else {
            this.deselect()
        }
    },
    remove: function (a) {
        this.token_manager.remove(this)
    },
    detect: function (d) {
        var c = d.target ? d.target : d.srcElement;
        var a = c.token;
        var b = c;
        while (a === undefined && b.parentNode) {
            b = b.parentNode;
            a = b.token
        }
        return a !== undefined && a.element == this.element
    }
});
var TokenManager = Class.create({
    initialize: function (b, a) {
        this.shift_boundary_right_func = b;
        this.shift_boundary_left_func = a;
        this.tokens = [];
        this.token = null
    },
    add: function (a) {
        this.tokens.push(a)
    },
    remove: function (b) {
        if (b === undefined) {
            b = this.token
        }
        if (b) {
            var a = this.tokens.indexOf(b);
            this.tokens.splice(a, 1);
            b.element.remove();
            if (this.token == b && a < this.tokens.length) {
                this.tokens[a].select()
            } else {
                this.token = null;
                this.shift_boundary_right_func()
            }
        }
    },
    removeAll: function () {
        for (var a = 0; a < this.tokens.length; a++) {
            this.tokens[a].element.remove()
        }
        this.tokens.clear()
    },
    shift_left: function () {
        var a;
        if (this.token === null) {
            a = this.tokens.length
        } else {
            a = this.tokens.indexOf(this.token)
        }
        if (a > 0) {
            if (this.token) {
                this.token.deselect()
            }
            this.tokens[a - 1].select()
        } else {
            if (this.shift_boundary_left_func !== undefined) {
                this.shift_boundary_left_func()
            }
        }
    },
    shift_right: function () {
        var a = this.tokens.indexOf(this.token);
        if (this.token) {
            this.token.deselect()
        }
        if (a + 1 < this.tokens.length) {
            this.tokens[a + 1].select()
        } else {
            if (this.shift_boundary_right_func !== undefined) {
                this.shift_boundary_right_func()
            }
        }
    }
});
var HiddenInput = Class.create({
    initialize: function (a, c, b) {
        this.element = $(a);
        this.auto_complete_element = c;
        this.token_manager = b;
        Event.observe(this.element, "keydown", this.onKeyPress.bindAsEventListener(this))
    },
    onKeyPress: function (a) {
        switch (a.keyCode) {
        case Event.KEY_LEFT:
            a.preventDefault();
            this.token_manager.shift_left();
            break;
        case Event.KEY_TAB:
            a.preventDefault();
            this.token_manager.shift_right();
            break;
        case Event.KEY_RIGHT:
            a.preventDefault();
            this.token_manager.shift_right();
            break;
        case Event.KEY_BACKSPACE:
        case Event.KEY_DELETE:
            this.token_manager.remove();
            break
        }
        return false
    }
});
var validate_email = function (a) {
        var b = new RegExp("^['&A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", "i");
        return b.test(a)
    };
var addContactToList = function (l, g, h, k, c, m, n) {
        k.value = "";
        var f = "";
        switch (h) {
        case ContactTypes.FB:
            f = "fb_ids";
            break;
        case ContactTypes.EMAIL:
            f = "emails";
            break;
        case ContactTypes.INVALID:
            f = "invalids";
            break;
        default:
            assert(false, "should never get here due to type: " + h)
        }
        var a;
        if (n) {
            a = " token-valid"
        } else {
            a = " token-error"
        }
        var o = Builder.node("span", {
            "class": "x" + a,
            onmouseout: "this.className='x" + a + "'",
            onmouseover: "this.className='x_hover" + a + "'",
            onclick: "this.parentNode.parentNode.parentNode.parentNode.parentNode.token.remove(event); return false;"
        }, " ");
        var d = Builder.node("input", {
            type: "hidden",
            name: f,
            value: g
        });
        var b = Builder.node("a", {
            "class": "token" + a,
            href: "#",
            tabindex: "-1"
        }, Builder.node("span", Builder.node("span", Builder.node("span", Builder.node("span", {}, [d, l, o])))));
        $(b).down(4).next().innerHTML = "&nbsp;";
        var e = new Token(b, c, m, n);
        m.add(e);
        $("autocomplete_display").insert({
            before: b
        })
    };
var kc = {
    curr: "",
    w: function () {
        document.observe("keydown", function (a) {
            kc.curr += BrowseKeys.getKey(a);
            if (kc.curr.endsWith("3838404037393739666513")) {
                new Effect.Appear("magic")
            }
        })
    }
};
Autocompleter.ContactsTokenizer = Class.create(Autocompleter.Contacts, {
    initialize: function ($super, d, f, c, e, b, a) {
        $super(d, f, e, b, a);
        this.token_manager = new TokenManager(this.generate_shift_boundary_right_func());
        this.hidden_input = new HiddenInput(c, this.element, this.token_manager);
        if (!this.element.hacks) {
            this.element.should_use_borderless_hack = Prototype.Browser.WebKit;
            this.element.should_use_shadow_hack = Prototype.Browser.IE || Prototype.Browser.Opera;
            this.element.hacks = true
        }
        if (this.element.should_use_borderless_hack || this.element.should_use_shadow_hack) {
            $(this.element.parentNode).addClassName("tokenizer_input_borderless")
        }
        this.options.onShow = function (g, h) {
            Position.clone(g.parentNode.parentNode, h, {
                setHeight: false,
                offsetTop: g.parentNode.parentNode.offsetHeight - 1
            });
            h.show()
        };
        this.options.onHide = function (g, h) {
            h.hide()
        };
        Event.observe(this.element.up("form").down("#share-invite-button"), "mousedown", this.beforeSubmit.bindAsEventListener(this));
        Event.observe(this.element, "focus", this.onFocus.bindAsEventListener(this));
        this.dynamically_resize_input();
        this.set_default_text()
    },
    onBlur: function ($super, a) {
        this.set_default_text();
        $super(a)
    },
    onFocus: function (a) {
        this.clear_default_text()
    },
    beforeSubmit: function (a) {
        if (!this.default_text) {
            this.tokenize_emails_input(true)
        }
    },
    clearTokens: function (a) {
        this.token_manager.removeAll();
        this.dynamically_resize_input();
        this.set_default_text()
    },
    set_default_text: function () {
        if (this.element.value === "" && this.token_manager.tokens.length === 0) {
            this.element.value = _("Enter names or email addresses");
            this.element.style.color = "#999";
            this.default_text = true
        }
    },
    clear_default_text: function () {
        if (this.default_text) {
            this.element.value = "";
            this.element.style.color = "#444";
            this.default_text = false
        }
    },
    clean_email_addr: function (e, b) {
        var d = ["<", ">"];
        for (var a = 0; a < e.length; a++) {
            b = b.sub(e[a], "")
        }
        for (var c = 0; c < d.length; c++) {
            b = b.sub(d[c], "")
        }
        return b.strip()
    },
    get_regexp_from_delimiters: function (c) {
        var b = "";
        for (var a = 0; a < c.length; a++) {
            b += c[a] + "|"
        }
        return new RegExp("[" + b + "\\r\\n|\\r|\\n|\\t]+")
    },
    tokenize_emails_input: function (f, h) {
        var l = this.options.tokens;
        var m = this.get_regexp_from_delimiters(l);
        var o = this.element.value.split(m);
        var q = "";
        if (!f) {
            var g = o[o.length - 1];
            q = this.clean_email_addr(l, g);
            o = o.slice(0, o.length - 1);
            if (g[g.length - 1] == " ") {
                if (validate_email(q)) {
                    o.push(q);
                    q = ""
                }
            }
        }
        var e = [];
        for (var p = 0; p < o.length; p++) {
            e.push.apply(e, o[p].split(" "))
        }
        o = e;
        var c = false;
        if (o.length > 0) {
            for (var d = 0; d < o.length; d++) {
                var k = this.clean_email_addr(l, o[d]);
                if (k) {
                    var b;
                    var n;
                    if (validate_email(k)) {
                        n = true;
                        b = ContactTypes.EMAIL;
                        c = true
                    } else {
                        if (h) {
                            continue
                        }
                        n = false;
                        b = ContactTypes.INVALID
                    }
                    this.set_input_size(1);
                    addContactToList(k, k, b, this.element, this.hidden_input, this.token_manager, n)
                }
            }
            this.element.value = q
        }
        var a = this.element.up("form");
        if (c) {
            Forms.clear_errors(a)
        }
        this.dynamically_resize_input()
    },
    generate_shift_boundary_right_func: function () {
        var b = this.element;
        var a = function () {
                b.focus()
            };
        return a
    },
    set_input_size: function (a) {
        a = a || 20;
        this.element.setStyle({
            width: a + "px"
        })
    },
    dynamically_resize_input: function () {
        var g = $(this.element.parentNode.parentNode);
        var k = parseInt(g.getStyle("width"), 10) - 15;
        var e = this.token_manager.tokens;
        var a = 0;
        for (var d = 0; d < e.length; d++) {
            var b = parseInt(e[d].element.getStyle("width"), 10) + parseInt(e[d].element.getStyle("margin-right"), 10);
            var f = a + b;
            if (f > k) {
                a = b
            } else {
                if (b > k) {
                    a = 0
                } else {
                    a = f
                }
            }
        }
        var c = k - a;
        var h = this.element.value.length * 7;
        if (h > c) {
            c = k
        }
        this.set_input_size(c)
    },
    onKeyPress: function (a) {
        this.dynamically_resize_input();
        if (this.active) {
            switch (a.keyCode) {
            case 44:
            case 188:
            case 59:
            case 186:
                this.reset_observer();
                return;
            case Event.KEY_TAB:
            case Event.KEY_RETURN:
                this.selectEntry();
                this.hide();
                this.active = false;
                Event.stop(a);
                return;
            case Event.KEY_ESC:
                this.hide();
                this.active = false;
                Event.stop(a);
                return;
            case Event.KEY_LEFT:
            case Event.KEY_RIGHT:
                return;
            case Event.KEY_UP:
                this.markPrevious();
                this.render();
                Event.stop(a);
                return;
            case Event.KEY_DOWN:
                this.markNext();
                this.render();
                Event.stop(a);
                return
            }
        } else {
            this.tokenize_emails_input(false);
            if (a.keyCode === Event.KEY_TAB || a.keyCode === Event.KEY_RETURN) {
                if (this.element.value && a.preventDefault) {
                    a.preventDefault()
                }
                this.tokenize_emails_input(true);
                return
            } else {
                if (this.element.value === "") {
                    if (a.keyCode == Event.KEY_LEFT || a.keyCode == Event.KEY_BACKSPACE) {
                        this.token_manager.shift_left()
                    }
                } else {
                    if (a.keyCode == Event.KEY_LEFT || a.keyCode == Event.KEY_RIGHT || a.keyCode == Event.KEY_UP || a.keyCode == Event.KEY_DOWN) {
                        return
                    }
                }
            }
        }
        this.update_typeahead();
        this.reset_observer()
    },
    update_typeahead: function () {
        this.changed = true;
        this.hasFocus = true
    },
    reset_observer: function () {
        if (this.observer) {
            clearTimeout(this.observer)
        }
        this.observer = setTimeout(this.onObserverEvent.bind(this), this.options.frequency * 1000)
    },
    onObserverEvent: function ($super) {
        if (this.active) {
            var a;
            var c;
            var d = this.element.value;
            for (var b = 0; b < this.options.tokens.length; b++) {
                a = this.options.tokens[b];
                c = d.indexOf(a);
                if (c != -1) {
                    this.element.value = d.substr(0, c);
                    this.selectEntry();
                    this.hide();
                    this.active = false;
                    this.element.value = d.substr(c + 1);
                    break
                }
            }
            this.update_typeahead()
        }
        this.tokenize_emails_input(false);
        $super()
    },
    selectEntry: function () {
        var c = this.getCurrentEntry();
        var b = this.options.array[c.value];
        var a;
        if (b.type == ContactTypes.FB) {
            a = b.fb_id
        } else {
            a = b.email
        }
        this.set_input_size(1);
        addContactToList(b.name.strip() || a, a, b.type, this.element, this.hidden_input, this.token_manager, true);
        Forms.clear_errors(this.element.up("form"));
        this.dynamically_resize_input();
        this.index = 0;
        this.element.focus()
    }
});
var Crocodoc = (function () {
    var b = 1;
    var c = function (f) {
            setTimeout(function () {
                Crocodoc.load(f)
            }, b * 1000)
        };
    var d = function () {
            $("crocodoc_loading").hide();
            $("crocodoc_error").show()
        };
    var e = function (f) {
            var g = new Element("iframe", {
                src: f
            });
            g.addClassName("crocodoc_iframe");
            $("crocodoc_viewer").update(g)
        };
    var a = function (f) {
            new Ajax.Request("/sm/doc/" + f, {
                onSuccess: function (g) {
                    var h = g.responseText;
                    if (h == "error") {
                        d()
                    } else {
                        if (h == "retry") {
                            c(f)
                        } else {
                            e(h)
                        }
                    }
                }
            })
        };
    return {
        load: function (f) {
            a(f)
        }
    }
})();
var SharingModel;
var Links = {
    _tmpl: null,
    init: function (a) {
        a.each(function (b) {
            assert(b.encoded_sort_key && b.sort_key === undefined, "expected encoded sort key on each elm");
            b.sort_key = Util.decode_sort_key(b.encoded_sort_key);
            delete b.encoded_sort_key
        });
        Links._state = {
            links: a,
            cmp: Links._created_cmp,
            is_ascending: false
        };
        Links.listen();
        Links._tmpl = HTML.tmpl("links_list_item_tmpl");
        Links._render()
    },
    listen: function () {
        $("links-view").on("click", "a.remove-link", function (d, b) {
            Event.stop(d);
            var a = b.readAttribute("data-filename");
            var c = b.readAttribute("data-tkey");
            SharingModel.confirm_remove(a, c)
        });
        document.observe(FileEvents.LINKS_REMOVE, function (f) {
            var d = f.memo.token;
            var a = Links._state.links;
            assert(d, "LINKS_REMOVE without token");
            var g;
            for (var c = 0, b = a.length; c < b; c++) {
                if (a[c].tkey === d) {
                    g = c
                }
            }
            assert(g !== undefined, "LINK_REMOVE w/o DOM elm");
            a.splice(g, 1);
            $$("li.link")[g].remove();
            Links._empty_check()
        });
        $("links-sort").on("click", "a.sort-option", function (c, b) {
            Event.stop(c);
            var d = {
                LINKS_BY_NAME: Links._name_cmp,
                LINKS_BY_CREATED: Links._created_cmp
            };
            var a = d[b.readAttribute("data-sort")];
            if (Links._state.cmp === a) {
                Links._state.is_ascending = !Links._state.is_ascending
            } else {
                Links._state.cmp = a;
                Links._state.is_ascending = true
            }
            Util.add_sort_arrow_mouseover(b, Links._state.is_ascending, "#links-sort a.sort-option", true);
            Links._render()
        });
        Util.add_sort_arrow_mouseover($("created-sorter"), Links._state.is_ascending, "#links-sort a.sort-option", false)
    },
    _render: function () {
        var a = Util.calc_thumb_prep_size();
        var d = function (e, g) {
                var f = Links._state.is_ascending ? 1 : -1;
                return f * Links._state.cmp(e, g)
            };
        var c = [];
        var b = Links._state.links;
        b.sort(d);
        b.each(function (e) {
            c.push(Links._tmpl({
                link: e,
                remove_str: _("Remove")
            }))
        });
        $("links-list").__date(c);
        $$("#links-list img").each(function (e) {
            Util.thumb_load(e, a)
        });
        Links._empty_check()
    },
    _empty_check: function () {
        if (Links._state.links.length) {
            $("links-view").removeClassName("empty-list")
        } else {
            $("links-view").addClassName("empty-list")
        }
    },
    _name_cmp: Util.sort_by_rank_or_key,
    _created_cmp: function (a, b) {
        return a.created_ts - b.created_ts
    }
};
SharingModel = {
    confirm_remove: function (a, b) {
        assert(b, "confirm_remove missing tkey");
        assert(a, "confirm_remove missing name");
        var c = _("Remove link to '%(folder_name)s'").format({
            folder_name: a.escapeHTML().snippet(34)
        });
        Modal.icon_show("alert_32", c, $("disable-token-modal"), {
            token: b,
            name: a
        })
    },
    do_remove: function (a) {
        new Ajax.DBRequest("/sm/disable/" + a.token, {
            onSuccess: function () {
                Modal.hide();
                Notify.server_success(_("Removed link for '%(filename)s'").format({
                    filename: a.name
                }));
                document.fire(FileEvents.LINKS_REMOVE, {
                    token: a.token
                })
            },
            onComplete: function () {
                Forms.remove_loading()
            }
        });
        Forms.add_loading($("modal-content").down("input"))
    },
    get_token: function (a, b) {
        new Ajax.DBRequest("/sm/get" + Util.normalize(a), {
            onSuccess: function (d) {
                var c = d.responseText.evalJSON(true);
                if (b) {
                    b(c)
                }
            }
        })
    },
    update_access_options: function (c, b) {
        if (b) {
            Event.stop(b)
        }
        var a = $(c).up("form");
        Forms.ajax_submit(a, false, function () {
            $$("#modal-content .error-message").invoke("remove");
            Notify.server_success(_("Updated successfully."))
        }, false, $(c))
    },
    show_post_options: function (a) {
        var d = _("Share '%(filename)s'").format({
            filename: a.name.escapeHTML()
        });
        var c = _("Check out this link I made with Dropbox") + " " + a.link;
        var b = "";
        Twitter.start_flow(d, c, a.link, a.name, b)
    },
    show_password_field: function () {
        var a = $("change-token-password-link");
        if (a) {
            a.remove()
        }
        $("require_password").setValue("");
        $("password").show();
        $("password").setValue("")
    },
    get_transcode_status: function (a, b) {
        new Ajax.Request("/get_transcode_status/" + a, {
            onSuccess: function (c) {
                if (c.responseText == "reload" || c.responseText == "error") {
                    window.location.reload()
                } else {
                    $(b).update(c.responseText);
                    setTimeout(function () {
                        SharingModel.get_transcode_status(a, b)
                    }, 2000)
                }
            }
        })
    },
    enqueue_transcode: function (a, b, c) {
        new Ajax.Request("/enqueue_transcode/" + a + b, {
            onSuccess: function (d) {
                return SharingModel.get_transcode_status(d.responseText, c)
            }
        })
    },
    start_twitter_flow: function (h, g, f, e) {
        var d = $("twitter-checkbox") && $F("twitter-checkbox");
        var a = $F("facebook-checkbox");
        if (d) {
            h = h.substr(0, 140)
        }
        if (a) {
            FacebookOAuth.msg = h;
            FacebookOAuth.name = f;
            FacebookOAuth.link = g
        }
        var c = function () {
                var k = function () {
                        AMC.log("shmodel_share", {
                            type: "facebook",
                            action: "post"
                        });
                        FacebookOAuth.post(h, g, f, e)
                    };
                FacebookOAuth.onLoginSuccessCallback = k;
                if (FacebookOAuth.has_authed || !Constants.uid) {
                    k()
                } else {
                    AMC.log("shmodel_share", {
                        type: "facebook",
                        action: "start_auth"
                    });
                    if (FacebookOAuth.deferred) {
                        FacebookOAuth.show_auth(k)
                    } else {
                        FacebookOAuth.do_auth()
                    }
                }
            };
        var b = function (l) {
                var k = function () {
                        AMC.log("shmodel_share", {
                            type: "twitter",
                            action: "post"
                        });
                        Twitter.custom_post(h, l)
                    };
                Twitter.onLoginSuccessCallback = k;
                if (Twitter.has_authed || !Constants.uid) {
                    k()
                } else {
                    AMC.log("shmodel_share", {
                        type: "twitter",
                        action: "start_auth"
                    });
                    Twitter.do_auth()
                }
            };
        if (d && a) {
            b(c);
            FacebookOAuth.custom_show_complete = function () {
                FacebookOAuth.get_progress_container().update(DomUtil.fromElm("sharing-posted-both"))
            }
        } else {
            if (d) {
                b()
            } else {
                if (a) {
                    c()
                }
            }
        }
    },
    copy_to_dropbox: function (a, d, b) {
        assert(a, "c2d name missing");
        assert(d, "c2d tkey missing");
        Modal.icon_show("dropbox_32", _("Add '%(filename)s' to my Dropbox").format({
            filename: a.snippet(30).escapeHTML()
        }), $("c2d-modal"));
        $("c2d-modal").select("form").each(function (e) {
            Forms.add_vars(e, {
                tkey: d,
                subpath: b
            })
        });
        var c = $("fname");
        if (c) {
            c.focus()
        }
    },
    c2d_submit: function (b, a) {
        assert(a.select("input[name=tkey]"), "Trying to submit a form that doesn't have a tkey");
        Forms.ajax_submit(a, false, function (c) {
            window.location.href = c.responseText
        }, false, $(a).down("input[type=submit]"))
    }
};
var Modal, Sprite;
var Bubble = {
    make: function (q, B, u, o) {
        B = B || "left";
        if (["left", "right"].contains(B)) {
            u = u || "middle";
            assert(["top", "middle", "bottom"].contains(u), "expected tail position ['top', 'middle', 'bottom'], got %s".format(u))
        } else {
            if (["bottom"].contains(B)) {
                u = u || "center";
                assert(["left", "center", "right"].contains(u), "expected tail position ['left', 'center', 'right'], got %s".format(u))
            } else {
                assert(false, "unexpected tail positon, got %s".format(u))
            }
        }
        var s = new Element("table");
        s.addClassName("bubble");
        if (o) {
            s.style.width = o + "px"
        }
        var a = new Element("tbody");
        var A = new Element("tr");
        var k = new Element("td");
        k.addClassName("tl");
        var m = new Element("td");
        m.addClassName("t");
        var e = new Element("td");
        e.addClassName("tr");
        A.insert(k);
        A.insert(m);
        A.insert(e);
        a.insert(A);
        var y = new Element("tr");
        var p = new Element("td");
        p.addClassName("l");
        if (B == "left") {
            var g = new Element("img", {
                src: "/static/images/bubble_arrow.png"
            });
            g.addClassName("arrow");
            p.insert(g);
            p.vAlign = u
        }
        var v = new Element("td");
        v.addClassName("c");
        v.update(q);
        var n = new Element("td");
        n.addClassName("r");
        if (B == "right") {
            var h = new Element("img", {
                src: "/static/images/bubble_arrow_right.png"
            });
            h.addClassName("rarrow");
            n.insert(h);
            n.vAlign = u
        }
        y.insert(p);
        y.insert(v);
        y.insert(n);
        a.insert(y);
        var w = new Element("tr");
        var d = new Element("td");
        d.addClassName("bl");
        var x = new Element("td");
        x.addClassName("b");
        if (B == "bottom") {
            var f = new Element("img", {
                src: "/static/images/bubble_arrow_bottom.png"
            });
            f.addClassName("barrow");
            x.insert(f);
            x.style.textAlign = u
        }
        var z = new Element("td");
        z.addClassName("br");
        w.insert(d);
        w.insert(x);
        w.insert(z);
        a.insert(w);
        s.insert(a);
        return s
    }
};
var ActAsBlock = {
    elm_list: ["margin-left", "margin-right", "padding-left", "padding-right", "border-left-width", "border-right-width"],
    parent_list: ["padding-left", "padding-right", "border-left-width", "border-right-width"],
    register: function (c, d) {
        d = d || document.body;
        var b = $(d).getElementsByClassName("act_as_block");
        for (var a = 0; a < b.length; a = a + 1) {
            ActAsBlock.resize(b[a])
        }
    },
    resize: function (e) {
        e = $(e);
        var c = e.up();
        var a = Util.sumStyles(e, ActAsBlock.elm_list);
        var d = Util.sumStyles(c, ActAsBlock.parent_list);
        e.style.width = "1px";
        var b = (c.getWidth() - a - d);
        if (b > 0) {
            e.style.width = b + "px"
        }
    }
};
Event.observe(window, "load", ActAsBlock.register);
Modal = {
    KEY_SCOPE: "modal",
    width: 640,
    vertical_offset: 150,
    show: function (n, h, k, o, c, l) {
        $$("#modal-content .error-message, #modal-content .error-removable").invoke("hide");
        c = c || Modal.width;
        if (FileQueue.uploading && !l) {
            alertd(_("You can't do this while uploading."));
            return false
        }
        assert(h, "Missing modal content!");
        var d = Modal.vars._prev_scope;
        Modal.vars = k || {};
        Modal.vars._prev_scope = d;
        $("modal").setStyle({
            width: c + "px",
            margin: "0 0 0 " + Math.floor(-c / 2).toString() + "px"
        });
        $("modal-title").update(n);
        if (!l) {
            if (FileQueue.num_files()) {
                Upload.reset()
            }
            var a = Util.childElement($("modal-content"), 0);
            if (a && a != h) {
                $("grave-yard").insert(a)
            }
            var b = new Element("div");
            b.update(h);
            var g = Modal.vars.wit_group;
            if (!g) {
                var f = b.down();
                g = f && f.id
            }
            if (g) {
                WIT.add_group(b, g)
            }
            $("modal-content").insert(b);
            if (h.show) {
                h.show()
            }
            Element.show("modal")
        }
        Modal.fix_position();
        $("modal-overlay").setOpacity(0.6);
        $("modal-overlay").show();
        $("modal-behind").setStyle({
            width: (c + 20) + "px",
            margin: "0 0 0 " + Math.floor(-c / 2 - 10).toString() + "px"
        });
        $("modal-behind").setOpacity(0.2);
        $("modal-behind").show();
        if (o) {
            $("modal-content").select("#" + o.id).first().focus()
        } else {
            if (!Util.ie) {
                var m = $("modal").down("input[type=button]") || $("modal").down("input[type=submit]");
                if (m) {
                    m.focus()
                }
            }
        }
        if (!Modal.track_id) {
            Modal.track_resizes()
        }
        $("modal-title").show();
        ActAsBlock.register(false, "modal");
        document.observe("keydown", Modal.keydown);
        $("modal-content").style.height = "auto";
        if (key.getScope() !== Modal.KEY_SCOPE) {
            Modal.vars._prev_scope = key.getScope()
        }
        key.setScope(Modal.KEY_SCOPE);
        var e = n.innerText || n.textContent || n;
        T("Modal.show:", e);
        return false
    },
    fix_position: function (d) {
        var a = (document.viewport.getScrollOffsets().top + Modal.vertical_offset);
        var b = parseInt($("modal").getStyle("height"), 10);
        var c = $("flash-upload-container") && $("flash-upload-container").descendantOf("modal");
        if (!c && b + Modal.vertical_offset < document.viewport.getHeight()) {
            $("modal").setStyle({
                position: "fixed",
                top: Modal.vertical_offset + "px"
            });
            $("modal-behind").setStyle({
                position: "fixed",
                height: (b + 20) + "px",
                top: (Modal.vertical_offset - 10) + "px"
            })
        } else {
            $("modal").setStyle({
                position: "absolute",
                top: a + "px"
            });
            $("modal-behind").setStyle({
                position: "absolute",
                height: (b + 20) + "px",
                top: (a - 10) + "px"
            })
        }
    },
    keydown: function (b) {
        var a = BrowseKeys.getKey(b);
        if (a == 27 || (a == 8 && !Util.focus_in_input())) {
            b.preventDefault();
            Modal.hide()
        }
        if (Util.focus_in_input()) {
            return
        }
    },
    icon_show: function (e, h, f, g, a, d, c) {
        var b = new Element("div");
        b.insert(Sprite.make(e, {
            "class": "modal-h-img"
        }));
        b.insert(h);
        return Modal.show(b, f, g, a, d, c)
    },
    show_loading: function (a, c) {
        var b = "<p style='margin: 3em 0; text-align: center;'><img src='/static/images/icons/ajax-loading-small.gif' alt=''/></p>";
        Modal.icon_show(a, c, b)
    },
    shown: function () {
        return $("modal").visible()
    },
    hide: function (c, b) {
        if (c) {
            Event.stop(c)
        }
        if (Modal.onHide) {
            var a = Modal.onHide();
            if (!a) {
                return
            }
        }
        Modal.onHide = null;
        Element.hide("modal-behind");
        Element.hide("modal-overlay");
        if (!b && !FileQueue.num_files()) {
            Element.hide("modal")
        } else {
            $("modal").style.marginLeft = "-10000000px";
            if (FileQueue.uploading) {
                InlineUploadStatus.show()
            }
        }
        if (Modal.track_id) {
            clearInterval(Modal.track_id);
            Modal.track_id = false
        }
        document.stopObserving("keydown", Modal.keydown);
        if (document.activeElement) {
            $(document.activeElement).blur()
        }
        key.setScope(Modal.vars._prev_scope);
        T("Modal.hide")
    },
    track_resizes: function () {
        Modal.track_id = setInterval(Modal.on_resize, 150)
    },
    on_resize: function () {
        var a = $("modal").getHeight();
        if (Modal.old_height != a || $("modal-behind").getHeight() < a) {
            Modal.old_height = a;
            Modal.fix_position()
        }
    },
    vars: {}
};
var Tabs = {
    init: function () {
        var h = $A(document.getElementsByClassName("tab")).concat($A(document.getElementsByClassName("subtab")));
        for (var e = 0; e < h.length; e++) {
            var b = h[e].down("a");
            var d = b.href.split("/");
            if (h[e].hasClassName("subtab")) {
                b.href = "#" + d[d.length - 1]
            }
            if (Util.ie6 || Prototype.Browser.Opera) {
                var f = b.getWidth() - parseInt(b.getStyle("padding-left"), 10) * 2;
                f = (f + 2 + (f % 2));
                b.style.width = f + "px"
            }
            var c = Sprite.make("rounded_tl", {
                "class": "rounded_tl"
            });
            var g = Sprite.make("rounded_tr", {
                "class": "rounded_tr"
            });
            b.appendChild(c);
            b.appendChild(g)
        }
        e = 20;
        $$(".events_bubble").each(function (k) {
            var a = (-1 * k.getWidth() / 2) + "px";
            k.style.marginLeft = a;
            k.style.marginRight = a;
            k.style.right = "6px";
            k.parentNode.style.zIndex = e--
        });
        clearInterval(Tabs.check_interval);
        Tabs.check_interval = setInterval(function () {
            Tabs.check_url("")
        }, 300)
    },
    check_url: function (b) {
        var a = Util.url_hash();
        if (!a || Tabs.last_shown == a) {
            return
        }
        Tabs.last_shown = a;
        if (Util.url_hash()) {
            Tabs.showTab(Util.url_hash() + "-tab", Util.url_hash())
        } else {
            Tabs.showTab(b + "-tab", b)
        }
    },
    showTab: function (h, e) {
        h = $(h);
        if (h) {
            h.fire("db:tabshown")
        }
        var f = document.getElementsByClassName("subtab");
        var d;
        for (d = 0; d < f.length; d++) {
            f[d].removeClassName("selected")
        }
        var b = document.getElementsByClassName("content-tab");
        for (d = 0; d < b.length; d++) {
            b[d].hide()
        }
        var g = $(e + "-tab") || $$(".subtab").first();
        var c = $(e + "-content") || $$(".content-tab").first();
        if (g) {
            g.addClassName("selected")
        }
        if (c) {
            c.show();
            Util.syncHeight();
            var a = c.select("input[type=text]", "textarea");
            if (a) {
                Util.focus(a[0])
            }
        }
        return false
    }
};
var TreeView = {
    disable_shares: false,
    tv: {},
    loaded: false,
    set_params: function (a) {
        TreeView.ajax_params = a
    },
    init: function (c, a, d) {
        d = d || "treeview";
        TreeView.tv[d] = {};
        var b = TreeView.tv[d];
        b.autohide = a === null ? true : a;
        b.handler = c;
        b.viewdiv = $(d);
        b.hidefunc = TreeView.hide.bindAsEventListener(this)
    },
    schedule_reset: function () {
        TreeView.loaded = false
    },
    reset: function (a) {
        new Ajax.DBRequest("/ajax_subtreeview", {
            parameters: TreeView.ajax_params,
            onSuccess: function (c) {
                for (var b in TreeView.tv) {
                    if (TreeView.tv.hasOwnProperty(b)) {
                        TreeView.tv[b].viewdiv.down(".treeview-folders").update(c.responseText);
                        if (a && a.onSuccess) {
                            a.onSuccess(c)
                        }
                    }
                }
            }
        })
    },
    toggle: function (c, b) {
        Event.stop(c);
        var a = TreeView.tv[b || "treeview"];
        if (a.shown) {
            a.shown = false;
            TreeView.hide(c, b)
        } else {
            a.shown = true;
            TreeView.show(c.target, b)
        }
        return false
    },
    hide: function (c, b) {
        var a = TreeView.tv[b || "treeview"];
        if (!c || !$(c.target).descendantOf(a.viewdiv)) {
            a.viewdiv.hide();
            Event.stopObserving(window, "click", a.hidefunc);
            a.shown = false
        }
    },
    show: function (c, b) {
        var a = TreeView.tv[b || "treeview"];
        c = $(c);
        c.blur();
        var d = c.cumulativeOffset();
        a.viewdiv.setStyle({
            top: (d.top + c.getHeight()) + "px",
            left: (d.left - 4) + "px"
        });
        a.viewdiv.show();
        Event.observe(window, "click", a.hidefunc)
    },
    toggleNode: function (b) {
        b = $(b);
        var a = b.down("img");
        if (a.className.match("bullet_plus")) {
            Sprite.replace(a, "bullet_plus", "bullet_minus")
        } else {
            Sprite.replace(a, "bullet_minus", "bullet_plus")
        }
        b.up().next("div").toggle();
        b.blur();
        return false
    },
    toggleNodeAjax: function (c, a) {
        if (c.fetched_children) {
            return TreeView.toggleNode(c)
        }
        c = $(c);
        var b = c.down("img");
        var d = Sprite._get(b);
        b.src = "/static/images/icons/ajax-loading-small.gif";
        new Ajax.DBRequest("/ajax_subtreeview" + a, {
            parameters: TreeView.ajax_params,
            onSuccess: function (e) {
                var f = new Element("div", {
                    style: "display: none;"
                }).update(e.responseText);
                c.up().insert({
                    after: f
                });
                c.fetched_children = true;
                Sprite._set(b, d);
                return TreeView.toggleNode(c)
            },
            cleanUp: function (e) {
                if (/loading/.match(b.src)) {
                    Sprite._set(b, d)
                }
            }
        });
        return false
    },
    handle: function (c, b) {
        var d = $H(TreeView.tv).keys();
        var a = $(b).ancestors().find(function (e) {
            return d.include(e.id)
        });
        if (!a) {
            return
        }
        a = TreeView.tv[a.id];
        $("modal").fire("db:treeview_selected", {
            path: c
        });
        if (a.handler) {
            a.handler(c, b)
        }
        if (a.autohide) {
            TreeView.hide(a.id)
        }
    },
    move: function (c, d, b) {
        var a = $(c);
        if (!TreeView.loaded) {
            TreeView.reset({
                onSuccess: function () {
                    TreeView.loaded = 1;
                    TreeView.move(c, d, b)
                }
            })
        } else {
            if (b && b.onSuccess) {
                b.onSuccess()
            }
        }
        assert(a, "Couldn't find tree_id");
        assert($(d), "Couldn't find location_id");
        $(d).appendChild(a);
        a.show()
    },
    disable_shared: function (f) {
        var a = $(f);
        if (a.share_disabled) {
            return
        }
        a.share_disabled = true;
        var d = a.select(".s_folder_user");
        var b = d.length;
        for (var c = 0; c < b; c++) {
            var g = d[c];
            Sprite.replace(g, "folder_user", "folder_user_gray");
            var e = g.up();
            e._onclick = e.onclick;
            e.onclick = Util.nop
        }
    },
    enable_shared: function (f) {
        var a = $(f);
        if (!a.share_disabled) {
            return
        }
        a.share_disabled = false;
        var d = a.select(".s_folder_user_gray");
        var b = d.length;
        for (var c = 0; c < b; c++) {
            var g = d[c];
            Sprite.replace(g, "folder_user_gray", "folder_user");
            var e = g.up();
            e.onclick = e._onclick
        }
    }
};
Sprite = {
    SPACER: "/static/images/icons/icon_spacer.gif",
    src: function (b, a) {
        b = $(b);
        Sprite.clear(b);
        b.addClassName("s_" + a)
    },
    current: function (b) {
        var a = $(b).classNames().findAll(function (c) {
            return !c.indexOf("s_")
        });
        return a.length ? a[a.length - 1].substr(2) : ""
    },
    replace: function (c, b, a) {
        c.removeClassName("s_" + b);
        c.addClassName("s_" + a)
    },
    toggle: function (c, b, a) {
        c = $(c);
        if (c.hasClassName("s_" + b)) {
            c.removeClassName("s_" + b);
            c.addClassName("s_" + a)
        } else {
            if (c.hasClassName("s_" + a)) {
                c.removeClassName("s_" + a);
                c.addClassName("s_" + b)
            }
        }
    },
    blue: function (a) {
        assert(false, "Tried to blue " + a);
        return a + "_blue"
    },
    clear: function (a) {
        a = $(a);
        a.className = a.classNames().reject(function (b) {
            return !b.indexOf("s_")
        }).join(" ")
    },
    make: function (c, a) {
        assert(!c.endsWith("_blue"), "Tried to make invalid sprite " + c);
        a = a || {};
        a.src = a.src || Sprite.SPACER;
        var d = "sprite s_" + c + " " + (a["class"] || "");
        var b = new Element("img", a);
        b.addClassName(d);
        return b
    },
    html: function (b, a) {
        var d = Sprite.make(b, a);
        var c = new Element("div");
        c.update(d);
        return new HTML(c.innerHTML)
    },
    _get: function (a) {
        return a.className
    },
    _set: function (b, a) {
        b.className = a;
        b.src = Sprite.SPACER
    }
};
var Dropdown = {
    init: function () {
        $$("#tabs-container > ul > li").each(function (a) {
            a.observe("mouseenter", Dropdown.over);
            a.observe("mouseleave", Dropdown.out)
        })
    },
    over: function (a) {
        clearTimeout(Dropdown.timeout);
        $$("#tabs-container > ul > li.hover").invoke("removeClassName", "hover");
        var b = $(a.target);
        if (!b.match("#tabs-container > ul > li")) {
            b = b.up("#tabs-container > ul > li")
        }
        b.addClassName("hover")
    },
    out: function (a) {
        var b = $(a.target);
        if (!b.match("#tabs-container > ul > li")) {
            b = b.up("#tabs-container > ul > li")
        }
        Dropdown.timeout = setTimeout(function () {
            b.removeClassName("hover")
        }, 300)
    }
};
var HotButton = {
    make: function (b) {
        var a = new Element("a");
        a.addClassName("hotbutton");
        a.addClassName("bigger");
        a.addClassName("rounded");
        var d = new Element("span");
        d.addClassName("hotbutton-content");
        d.update(b);
        a.update(d);
        var c = new Element("span");
        c.addClassName("shadow");
        return HotButton.register(a)
    },
    register: function (a) {
        var b = a.select(".hotbutton-icon").pop();
        if (b) {
            a._icon = b;
            a._sprite = Sprite.current(b)
        }
        a.observe("mouseenter", function () {
            HotButton.mouseenter(a)
        });
        a.observe("mouseleave", function () {
            HotButton.mouseleave(a)
        });
        a.observe("mousedown", function (c) {
            HotButton.mousedown(c, a)
        });
        a.observe("mouseup", function () {
            HotButton.mouseup(a)
        });
        Util.disableSelection(a);
        return a
    },
    mouseenter: function (a) {
        a.addClassName("hover");
        a.style.zIndex = 1
    },
    mouseleave: function (a) {
        a.removeClassName("hover");
        a.removeClassName("down");
        a.style.zIndex = 0;
        if (a._icon) {
            Sprite.src(a._icon, a._sprite)
        }
    },
    mousedown: function (b, a) {
        a.addClassName("down");
        Event.stop(b)
    },
    mouseup: function (a) {
        a.removeClassName("down");
        if (a._icon) {
            Sprite.src(a._icon, a._sprite)
        }
    }
};
var LiveSearch = {
    search: function (f, e, c, a, b) {
        f = f.strip();
        if (f.length < 3) {
            $(e).update("");
            if (a.onEmpty) {
                a.onEmpty(f)
            }
        } else {
            var d = {
                search_string: f,
                "short": b ? 1 : ""
            };
            new Ajax.Request(c, {
                parameters: d,
                method: "get",
                onSuccess: function (g) {
                    var h = g.responseText.strip();
                    if (!h) {
                        if (a.onEmpty) {
                            a.onEmpty(f)
                        }
                        return
                    }
                    $(e).update(g.responseText);
                    LiveSearch.highlight(e, f);
                    if (a.onComplete) {
                        a.onComplete(f)
                    }
                }
            })
        }
    },
    highlight: function (c, b) {
        var a = b.split(" ");
        a.each(function (e) {
            if (e.length < 4) {
                return
            }
            var d = new RegExp(RegExp.escape(e), "i");
            c = $(c);
            $$(".livesearch_result_a").each(function (f) {
                f.innerHTML = f.innerHTML.gsub(d, function (g) {
                    return "<span class='highlight'>" + g[0] + "</span>"
                })
            });
            $$(".livesearch_result_p").each(function (f) {
                f.innerHTML = f.innerHTML.stripTags().gsub(d, function (g) {
                    return "<span class='highlight'>" + g[0] + "</span>"
                })
            })
        })
    },
    MAX_RESULTS: 10
};
var DBDropdown = Class.create({
    initialize: function (b, d, k) {
        this.options = k || {};
        this.container = $(b);
        assert(this.container, "Couldn't find element for DBDropdown " + b);
        this.container.style.position = "relative";
        assert(d && d.length, "Missing options_list: " + d);
        this.display_options = [];
        this.display_value = {};
        for (var c = 0; c < d.length; c += 1) {
            var h;
            if (d[c].length > 2) {
                h = [d[c][1], d[c][2]]
            } else {
                h = [d[c][1]]
            }
            this.display_options.push(h);
            this.display_value[d[c][1]] = d[c][0]
        }
        var a = "";
        if (this.options.icon || this.options.prefix) {
            a += "<span class='prefix'>";
            if (this.options.icon) {
                a += Sprite.html(this.options.icon, {
                    className: "icon_no_hover"
                }).toHTML()
            }
            if (this.options.prefix) {
                a += this.options.prefix
            }
            a += "</span>"
        }
        var e;
        if (this.options.initial_value) {
            e = this.options.initial_value
        } else {
            e = this.display_options[0][0]
        }
        a += "<span class='dbdropdown-selected'>" + e + "</span>";
        var f = k.arrow || "big-dropdown";
        a += Sprite.html(f).toHTML();
        this.hotbutton = HotButton.make(a);
        this.hotbutton.addClassName("dbdropdown");
        this.hotbutton.name = $(b).identify();
        this.container.update(this.hotbutton);
        if (this.options.style) {
            for (var g in this.options.style) {
                if (this.options.style.hasOwnProperty(g)) {
                    this.hotbutton.style[g] = this.options.style[g]
                }
            }
        }
        this.observe()
    },
    observe: function () {
        this.hotbutton.observe("mouseup", (function (a) {
            this.mouseup(a)
        }).bind(this));
        $(document.body).observe("mouseup", (function (a) {
            if (!$(a.target).match(".dbdropdown, .dbdropdown *")) {
                this.hide_list()
            }
        }).bind(this))
    },
    mouseup: function (a) {
        if (this.showing) {
            this.hide_list()
        } else {
            this.show_list()
        }
        a.preventDefault()
    },
    show_list: function () {
        var b = this;
        var a = new Element("ul");
        Util.disableSelection(a);
        a.addClassName("dbdropdown-list");
        this.display_options.each(function (e) {
            var d = new Element("li");
            d.addClassName("wit");
            d.name = e;
            d.update(e);
            d.observe("click", function (f) {
                f.preventDefault()
            });
            d.observe("mouseup", function (f) {
                f.preventDefault();
                b.select(e);
                b.hide_list()
            });
            d.observe("mouseenter", function () {
                this.addClassName("over")
            });
            d.observe("mouseleave", function () {
                this.removeClassName("over")
            });
            a.appendChild(d)
        });
        this.container.appendChild(a);
        a.clonePosition(this.hotbutton, {
            setTop: false,
            setHeight: false
        });
        a.style.width = parseInt(a.style.width, 10) - 2 + "px";
        var c = this.container.getHeight() - (Prototype.Browser.IE ? 2 : 0) + "px";
        if (this.options.show_above) {
            a.style.bottom = c
        } else {
            a.style.top = c
        }
        this.showing = true
    },
    hide_list: function () {
        var a = this.container.down(".dbdropdown-list");
        if (a) {
            a.remove()
        }
        this.showing = false
    },
    select: function (a) {
        var b = this.display_value[a];
        assert(b, "Value is missing...");
        var c = this.container.down(".dbdropdown-selected");
        assert(c, "select missing contentelm");
        c.update(a);
        if (this.options.on_change) {
            this.options.on_change(b)
        }
    }
});
var StarRating = Class.create({
    initialize: function (b, a) {
        this.container = $(b);
        this.value = a || 1;
        this.stars = this.generate_stars();
        this.input = new Element("input", {
            name: "rating",
            type: "hidden"
        });
        this.input.setValue(this.value);
        assert(this.container, "StarRating missing container");
        this.render()
    },
    generate_stars: function () {
        var c = this.value;
        var a = [];
        for (var b = 0; b < 5; b += 1) {
            a.push(this.generate_star(b + 1, b < c))
        }
        return a
    },
    generate_star: function (d, c) {
        var a = c ? "star_blue_on_big" : "star_blue_off_big";
        a = Sprite.make(a);
        var b = this;
        a.observe("click", function (f) {
            b.click(f, d)
        });
        a.observe("mouseover", function (f) {
            b.set_stars(d)
        });
        return a
    },
    click: function (a, b) {
        assert(b, "star click is missing value");
        if (a) {
            Event.stop(a)
        }
        this.set_val(b)
    },
    render: function () {
        var a = new Element("a", {
            href: "#"
        });
        var c = this;
        a.observe("mouseleave", function () {
            c.set_stars(c.value)
        });
        a.observe("click", Event.stop);
        a.addClassName("ratingstars");
        for (var b = 0; b < this.stars.length; b += 1) {
            a.appendChild(this.stars[b])
        }
        a.appendChild(this.input);
        this.container.update(a)
    },
    get_val: function () {
        return this.value
    },
    set_stars: function (c) {
        assert(c > 0, "Star value was < 1");
        assert(c <= 5, "Star value was > 5");
        for (var a = 0; a < 5; a += 1) {
            var b = this.stars[a];
            if (a < c) {
                Sprite.replace(b, "star_blue_off_big", "star_blue_on_big")
            } else {
                Sprite.replace(b, "star_blue_on_big", "star_blue_off_big")
            }
        }
    },
    set_val: function (a) {
        this.set_stars(a);
        this.value = a;
        this.input.setValue(a)
    }
});
var LocaleSelector = {
    init: function () {
        var a = $("locale-menu");
        if (!a) {
            return
        }
        a.on("click", "a.locale-option", function (d, c) {
            d.preventDefault();
            var b = c.readAttribute("data-locale");
            LocaleSelector.set_locale(b)
        })
    },
    set_locale: function (a) {
        if (a === Constants.USER_LOCALE) {
            return
        }
        var b = new Element("form", {
            action: "https://" + Constants.WEBSERVER + "/set_locale",
            method: "post"
        });
        Forms.add_vars(b, {
            locale: a,
            locale_cont: window.location.href
        });
        document.body.appendChild(b);
        b.submit()
    }
};
var ModalLocaleSelector = {
    init: function () {
        document.on("click", ".modal-locale-link", ModalLocaleSelector.show_modal);
        document.on("click", "#modal-locale-selector a", ModalLocaleSelector.set_locale)
    },
    show_modal: function (b, a) {
        b.preventDefault();
        Modal.icon_show("globe32", _("Choose a language"), $("modal-locale-selector"), null, null, 320)
    },
    set_locale: function (c, b) {
        c.preventDefault();
        Modal.hide();
        var a = b.readAttribute("data-locale");
        LocaleSelector.set_locale(a)
    }
};
var Notify = {
    init: function () {
        var a = $("notify-xclose");
        if (!a) {
            return
        }
        a.observe("click", function (b) {
            Event.stop(b);
            $("notify").hide()
        })
    },
    server_error: function (c, b, a) {
        return Notify._show_div(c, b, a, false, _("There was a problem completing this request."))
    },
    server_success: function (c, b, a) {
        return Notify._show_div(c, b, a, true, _("Your request completed successfully."))
    },
    _show_div: function (g, f, e, a, d, b) {
        Notify.clear_all();
        g = g || d;
        f = f || 10;
        var c = $("notify");
        if (a) {
            c.removeClassName("server-error");
            c.addClassName("server-success")
        } else {
            c.removeClassName("server-success");
            c.addClassName("server-error")
        }
        c.down("#notify-msg").update(g);
        new Effect.Appear(c, {
            duration: 0.5,
            from: 0,
            to: 1
        });
        Notify.last_msg = g;
        Notify.last_fade = new Effect.Fade(c, {
            duration: 1,
            from: 1,
            to: 0,
            delay: f
        });
        Notify.cancel_on_reload = e
    },
    clear_all: function () {
        if (Notify.last_fade) {
            Notify.last_fade.cancel()
        }
        $("notify").hide();
        var a = Effect.Queues.get("notify");
        a.effects = [];
        clearInterval(a.interval);
        a.interval = null
    },
    clear_if: function (a) {
        if (Notify.last_msg == a) {
            Notify.clear_all()
        }
    }
};
document.observe("dom:loaded", Notify.init);
var LoginDropdown = {
    init: function () {
        var a = $("login-hover-link");
        if (!a) {
            return
        }
        LoginDropdown.login_link = a;
        LoginDropdown.register()
    },
    register: function (a) {
        LoginDropdown.login_link.observe("click", LoginDropdown.click);
        LoginDropdown.login_link.observe("mouseenter", LoginDropdown.over);
        LoginDropdown.login_link.observe("mouseleave", LoginDropdown.out);
        LoginDropdown.login_link.observe("focus", LoginDropdown.click);
        $("login_email_elm").observe("focus", LoginDropdown.click);
        $(document.body).observe("click", LoginDropdown.unclick)
    },
    over: function (a) {
        LoginDropdown.hover()
    },
    out: function (a) {
        LoginDropdown.unhover()
    },
    click: function (a) {
        Event.stop(a);
        LoginDropdown.hover();
        LoginDropdown.down = true;
        LoginDropdown.login_link.up().addClassName("down");
        $("login_email_elm").focus()
    },
    unclick: function (b) {
        var a = $(b.target);
        if (a.match("#top-login-wrapper, #top-login-wrapper *")) {
            return
        }
        LoginDropdown.down = false;
        LoginDropdown.unhover();
        LoginDropdown.login_link.up().removeClassName("down")
    },
    hover: function () {
        if (LoginDropdown.is_hover || LoginDropdown.down) {
            return
        }
        LoginDropdown.is_hover = true;
        var a = $("login-hover-dropdown-icon");
        Sprite.replace(a, "big-dropdown-gray", "big-dropdown")
    },
    unhover: function () {
        if (!LoginDropdown.is_hover || LoginDropdown.down) {
            return
        }
        LoginDropdown.is_hover = false;
        var a = $("login-hover-dropdown-icon");
        Sprite.replace(a, "big-dropdown", "big-dropdown-gray")
    }
};
var TranslationSuggest = {
    record_msg_touch: function (c) {
        var b = $("translation-msg-id");
        assert(b, "Missing translation msg_id field");
        assert(c, "Missing translation display");
        var a = Constants.messages[c];
        if (a) {
            b.value = a
        }
        TranslationSuggest.finish_wizard(c, Constants.emessages[c] || "")
    },
    _autocomplete_highlight: function (a) {
        a = new SimpleSet(a);
        return function (b) {
            if (a.contains(b)) {
                return "<strong>" + b + "</strong>"
            } else {
                return b
            }
        }
    },
    autocompleter: Class.create(Autocompleter.Local, {
        onClick: function ($super, b) {
            var a = Event.findElement(b, "LI");
            if (a && a.className.indexOf("not-found") < 0) {
                return $super(b)
            }
        },
        onHover: function ($super, b) {
            var a = Event.findElement(b, "LI");
            if (a && a.className.indexOf("not-found") < 0) {
                return $super(b)
            }
        },
        onBlur: function ($super, a, b) {
            if (b) {
                $super(a)
            }
        },
        close: function () {
            this.onBlur(null, true);
            return true
        },
        selectEntry: function ($super) {
            var a = this.index;
            $super();
            TranslationSuggest.record_msg_touch(TranslationSuggest.msg_display[a])
        }
    }),
    attach_autocomplete: function () {
        var a = new TranslationSuggest.autocompleter("bad-i18n-text", "bad-i18n-text-complete", false, {
            frequency: 0.15,
            selector: function (r) {
                var t = [];
                var b = [];
                var d = r.getToken();
                var e = $H(Constants.messages).keys();
                var l = e.length;
                var o = 10;
                var f = true;
                var h = 3;
                var p = true;
                var c = {};
                TranslationSuggest.msg_display = [];
                var k = [];
                var q;
                for (var n = 0; n < l && t.length < o; n++) {
                    q = e[n];
                    var u = q.toLowerCase().indexOf(d.toLowerCase());
                    if (u != -1) {
                        c[q] = true
                    }
                    while (u != -1) {
                        if (u === 0 && q.length != d.length) {
                            t.push("<li><div><strong>" + q.substr(0, d.length) + "</strong>" + q.substr(d.length) + "</div></li>");
                            TranslationSuggest.msg_display.push(q);
                            break
                        } else {
                            if (d.length >= h && f && u != -1) {
                                if (p || /\s/.test(q.substr(u - 1, 1))) {
                                    b.push("<li><div>" + q.substr(0, u) + "<strong>" + q.substr(u, d.length) + "</strong>" + q.substr(u + d.length) + "</div></li>");
                                    k.push(q);
                                    break
                                }
                            }
                        }
                        u = q.toLowerCase().indexOf(d.toLowerCase(), u + 1)
                    }
                }
                if (b.length) {
                    t = t.concat(b.slice(0, r.options.choices - t.length));
                    TranslationSuggest.msg_display = TranslationSuggest.msg_display.concat(k.slice(0, r.options.choices - t.length))
                }
                if (t.length < o) {
                    var s = {};
                    var g = $A(d.split(/\s/));
                    g.each(function (v) {
                        var w = TranslationSuggest.word_index[v];
                        if ((v.length >= h || g.length > 2) && w) {
                            $A(w).each(function (x) {
                                s[x] = (s[x] || 0) + 1
                            })
                        }
                    });
                    s = $A($H(s));
                    s.sort(function (v, w) {
                        return w[1] - v[1]
                    });
                    for (var m = 0; m < Math.min(s.length, o - t.length); m++) {
                        q = s[m][0];
                        if (!c[q]) {
                            t.push("<li><div>" + q.replace(/[^\s]+/g, TranslationSuggest._autocomplete_highlight(g)) + "</div></li>");
                            TranslationSuggest.msg_display.push(q)
                        }
                    }
                }
                if (t.length) {
                    t[t.length - 1] = t[t.length - 1].replace("<div>", '<div style="border: none">')
                }
                t = t.join("");
                if (!t.length) {
                    return '<ul style="border: 1px solid #bbb"><li class="not-found" style="background:#f5f5f5"><div style="text-align:left;border: none">%s</div></li></ul>'.format(_("That text was not found on this page."))
                }
                return ("<ul>" + t + "</ul>")
            }
        });
        TranslationSuggest.ac = a
    },
    submit_suggest: function (b) {
        var a = $("translation-suggest-form");
        assert(a, "Missing translation suggest form");
        Forms.ajax_submit(a, false, function () {
            Notify.server_success(_("Thanks for suggesting an alternate translation!"));
            Modal.hide()
        }, false, $("translation-back-button"))
    },
    start_wizard: function (b) {
        Event.stop(b);
        var a = $("translation-suggest-form");
        TranslationSuggest.reset_form();
        a.down("input[name=locale]").setValue(Constants.USER_LOCALE);
        a.down("input[name=locale_url]").setValue(window.location.href);
        Modal.icon_show("alert_32", '%s <span class="step-number">%s</span>'.format(_("Report a translation problem"), _("&ndash; Step 1 of 2")), $("translate-div"), {}, $("bad-i18n-text"));
        Modal.onHide = TranslationSuggest.ac.close.bind(TranslationSuggest.ac)
    },
    show_select_error: function (a) {
        Event.stop(a);
        $("bad-i18n-text-error").show()
    },
    finish_wizard: function (b, a) {
        var c = $("translation-suggest-form");
        assert(c, "Missing translation suggest form");
        $("modal-title").down("span").update(_("&ndash; Step 2 of 2"));
        c.down("#part-one").hide();
        c.down("#translation-msg-display").innerHTML = b.stripTags().escapeHTML();
        c.down("#translation-orig-msg-display").innerHTML = a.stripTags().escapeHTML();
        c.down("#part-two").show();
        c.down("#part-two textarea").focus();
        ActAsBlock.register(false, c)
    },
    reset_form: function () {
        var b = $("translation-suggest-form");
        var a = $("translation-msg-id");
        assert(b, "Missing translation suggest form");
        assert(a, "Missing translation msg_id field");
        b.select("textarea").each(Form.Element.clear);
        b.down("#part-one").show();
        b.down("#part-two").hide()
    },
    word_index: {},
    index_message: function (c) {
        var b = c.blank_format().split(/\s/);
        for (var a = 0; a < b.length; a++) {
            var d = b[a];
            if (!(d in TranslationSuggest.word_index)) {
                TranslationSuggest.word_index[d] = []
            }
            TranslationSuggest.word_index[d].push(c)
        }
    },
    index_all: function () {
        for (var a in Constants.messages) {
            if (Constants.messages.hasOwnProperty(a)) {
                TranslationSuggest.index_message(a)
            }
        }
    },
    update_i18n_messages: function (e) {
        for (var b in e) {
            if (e.hasOwnProperty(b)) {
                var d = e[b];
                if (d.s && d.s.length) {
                    for (var c = 0, a = d.s.length; c < a; c++) {
                        add_i18n_message(b, d.s[c], d.e[c])
                    }
                } else {
                    add_i18n_message(b, d.t, b)
                }
            }
        }
    },
    update_i18n_messages_from_req: function (e) {
        var g = "<!--msg:";
        var b = "-->";
        if (e.responseText.indexOf(g) === 0) {
            var h = e.responseText.indexOf(":", g.length);
            assert(h != -1, "malformed i18n message header");
            var d = e.responseText.substr(g.length, h - g.length);
            var c = Number(d);
            assert(!isNaN(c), "invalid json length " + d);
            var a = e.responseText.substr(h + 1, c);
            e.responseText = e.responseText.substr(h + 1 + c + b.length);
            var f = a.evalJSON();
            TranslationSuggest.update_i18n_messages(f)
        }
    }
};
var DBCheckbox = {
    register_all: function () {
        var b = $$(".checkbox");
        for (var a = 0; a < b.length; a += 1) {
            DBCheckbox.register(b[a])
        }
    },
    register_browse: function () {
        var c = Browse.files;
        for (var b = 0, a = c.length; b < a; b += 1) {
            c[b].checkbox.selected = false
        }
    },
    register: function (a) {
        a.addClassName("s_checkbox sprite");
        a.selected = false;
        return a
    },
    toggle: function (a) {
        if (a.selected) {
            DBCheckbox.deselect(a)
        } else {
            DBCheckbox.select(a)
        }
    },
    select: function (a) {
        Sprite.replace(a, "checkbox", "checkbox_checked");
        a.selected = true
    },
    deselect: function (a) {
        Sprite.replace(a, "checkbox_checked", "checkbox");
        a.selected = false
    }
};
document.observe("dom:loaded", DBCheckbox.register_all);
var LeftNavBox = {
    close: function (c) {
        var b = $(c).up().up("div");
        var e = 1;
        var a;
        a = new Effect.BlindUp(b, {
            duration: e
        });
        return false
    }
};
var Tooltip = {
    attach: function (g, c, a, b) {
        g = $(g);
        a = a ? $(a) : null;
        b = b || {};
        var f = Bubble.make(c, g.tail_position, b.tail_position, b.width);
        f.setStyle({
            display: "none",
            position: "absolute"
        });
        $("floaters").insert(f);
        if (g.match("#modal-content *")) {
            f.style.zIndex = "13001"
        } else {
            f.style.zIndex = ""
        }
        if (g.tail_position == "right") {
            var e = Util.ie ? 32 : 12;
            f.style.marginLeft = -(f.getWidth() + g.getWidth() + e) + "px"
        }
        g.tooltip = f;
        g.out_target = a ? true : false;
        g.observe("mouseout", Tooltip.mouseout("target", g));
        g.observe("mouseover", Tooltip.mouseover("target", g));
        g.out_trigger = a ? false : true;
        if (a) {
            a.observe("mouseout", Tooltip.mouseout("trigger", g));
            a.observe("mouseover", Tooltip.mouseover("trigger", g))
        }
        g.out_tooltip = true;
        f.observe("mouseout", Tooltip.mouseout("tooltip", g));
        f.observe("mouseover", Tooltip.mouseover("tooltip", g))
    },
    update: function (b, a) {
        if (b.tooltip) {
            $(b.tooltip).update(a)
        }
    },
    mouseover: function (a, b) {
        return function () {
            b["out_" + a] = false
        }
    },
    mouseout: function (a, b) {
        return function () {
            b["out_" + a] = true;
            Tooltip.hide_if_out.defer(b)
        }
    },
    show_by: function (b) {
        var c = $(b.tooltip);
        c.show();
        var a = Math.floor(c.getHeight() / 2);
        c.clonePosition(b, {
            setWidth: false,
            setHeight: false,
            offsetTop: Math.floor(b.getHeight() / 2) - a,
            offsetLeft: b.getWidth() + 1
        })
    },
    hide_if_out: function (a) {
        if (!a.out_target || !a.out_trigger || !a.out_tooltip) {
            return
        }
        var b = $(a.tooltip);
        b.hide()
    },
    show: function (e, d, b, a, c) {
        a = a || "left";
        e = $(e);
        if (!e.tail_position) {
            e.tail_position = a
        }
        b = b ? $(b) : null;
        if (!e.tooltip) {
            Tooltip.attach(e, d, b, c)
        }
        Tooltip.show_by(e)
    }
};
var TabList = Class.create({
    initialize: function (a, b, c) {
        this.lists = a;
        this.initialize_lists(a);
        if (b) {
            this.tabs = b;
            this.tab_map = c;
            this.initialize_tabs()
        }
    },
    initialize_lists: function () {
        var e = this;
        var d = function () {
                return function (h, g) {
                    e.list_click(e, h, g)
                }
            };
        for (var b = 0; b < this.lists.length; b += 1) {
            var c = $(this.lists[b]).select("a");
            for (var a = 0; a < c.length; a += 1) {
                var f = c[a];
                f.db_observe("click", d())
            }
        }
    },
    initialize_tabs: function () {
        var b = this;
        var c = function (e) {
                return function (g, f) {
                    b.tab_click(b, g, f, e)
                }
            };
        for (var a = 0; a < this.tabs.length; a += 1) {
            var d = $(this.tabs[a]);
            if (!d) {
                continue
            }
            d.db_observe("click", c(a))
        }
    },
    list_click: function (c, b, d) {
        for (var a = 0; a < c.lists.length; a += 1) {
            $(c.lists[a]).select("a").invoke("removeClassName", "selected")
        }
        d.addClassName("selected")
    },
    tab_click: function (e, d, f, a) {
        for (var c = 0; c < e.tabs.length; c += 1) {
            $(e.tabs[c]).removeClassName("selected")
        }
        f.addClassName("selected");
        for (var b = 0; b < e.lists.length; b += 1) {
            $(e.lists[b]).hide()
        }
        $(e.tab_map[a]).show()
    }
});
var Pager = Class.create({
    initialize: function (b, c, d, a) {
        assert(c, "Pager item_class is missing");
        this.options = a || {};
        this.item_selector = c;
        this.name = b;
        this.container = $$(this.item_selector).first() && $$(this.item_selector).first().up(d);
        HashRouter.watch(b, this.show_page.bind(this))
    },
    current_page: 1,
    prev: function () {
        assert(this.current_page > 1, "Pager current page is 0");
        this.show_page(this.current_page - 1)
    },
    next: function () {
        this.show_page(this.current_page + 1)
    },
    show_page: function (d) {
        var b = true;
        if (!d || !Util.isNumber(d)) {
            d = 1;
            b = false
        }
        d = parseInt(d, 10);
        this.current_page = d;
        $$(this.item_selector).each(Element.hide);
        var c = $$(this.item_selector + d);
        if (this.options.on_page_change) {
            this.options.on_page_change(d)
        }
        c.each(Element.show);
        if (d <= 1) {
            $(this.name + "-prev").hide()
        } else {
            $(this.name + "-prev").show()
        }
        if ($$(this.item_selector + (d + 1)).length) {
            $(this.name + "-next").show()
        } else {
            $(this.name + "-next").hide()
        }
        $(this.name + "-page-num").update(d);
        if (b) {
            HashRouter.set_hash(this.name, d)
        }
        if (this.container) {
            var e = parseInt(this.container.style.minHeight, 10) || 0;
            var a = Util.inner_height(this.container);
            if (e < a) {
                this.container.style.minHeight = a + "px"
            }
        }
    }
});
var BrowseStyleRows = {
    register_all: function () {
        $$(".bs-row").each(BrowseStyleRows.register);
        Event.observe(document, "click", BrowseStyleRows.kill_current)
    },
    register: function (a) {
        a = $(a);
        a.db_observe("mouseover", BrowseStyleRows.mouseover);
        a.db_observe("mouseout", BrowseStyleRows.mouseout);
        a.db_observe("click", BrowseStyleRows.click)
    },
    mouseover: function (b, a) {
        a.addClassName("hover")
    },
    mouseout: function (b, a) {
        a.removeClassName("hover")
    },
    click: function (d, b) {
        if (d.target.tagName == "A") {
            return
        }
        Event.stop(d);
        BrowseStyleRows.kill_current(false);
        var c = $(d.target);
        if (!c.match(".bs-actions-list *")) {
            b.addClassName("selected")
        }
        var a = c.hasClassName("bs-row") ? c : c.up(".bs-row");
        if (Util.ie6) {
            a.down(".bs-actions-list").style.position = "absolute"
        }
        a.style.zIndex = 9
    },
    kill_current: function (a) {
        $$(".bs-row.selected").each(function (b) {
            b.removeClassName("selected");
            b.style.zIndex = ""
        })
    }
};
var SickInput = {
    init: function () {
        $$(".sick-input").each(function (a) {
            SickInput._create(a)
        })
    },
    _create: function (d) {
        var c = d.identify();
        var a = d.down("input");
        a.observe("focus", function () {
            d.addClassName("focused")
        });
        a.observe("blur", function () {
            d.removeClassName("focused")
        });
        var b = function () {
                if (d.hasClassName("populated") && a.getValue() === "") {
                    d.removeClassName("populated")
                } else {
                    if (!d.hasClassName("populated") && a.getValue() !== "") {
                        d.addClassName("populated")
                    }
                }
                if (c in SickInput._handler_map) {
                    SickInput._handler_map[c]()
                }
            };
        setInterval(b, 100);
        $$(".error-bubble").each(function (e) {
            if (e.down("span")) {
                e.show()
            }
        })
    },
    _handler_map: {},
    add_interval_handler: function (b, a) {
        var c = b.identify();
        SickInput._handler_map[c] = a
    }
};
document.observe("dom:loaded", SickInput.init);
var FreshbuttonIEHaxxx = {
    submits: [],
    init: function () {
        if (IE7_OR_LESS) {
            FreshbuttonIEHaxxx.submits = $$("input[type=submit]");
            document.on("focusin", "form", FreshbuttonIEHaxxx.wtvr)
        }
    },
    wtvr: function (b, a) {
        a.select("input[type=submit]").each(function (c) {
            var d = FreshbuttonIEHaxxx.submits.indexOf(c);
            if (d !== -1) {
                var e = new Element("input", {
                    type: "submit",
                    "class": "hidden-ie-submit"
                });
                c.__sert({
                    before: e
                });
                FreshbuttonIEHaxxx.submits.splice(d, 1)
            }
        })
    }
};
document.observe("dom:loaded", FreshbuttonIEHaxxx.init);
var SuggestionInput = {
    register: function (b) {
        b = $(b);
        var a = b.up("form");
        if (SuggestionInput.defaulted(b) || b.getValue() === "") {
            b.setValue(b.title)
        } else {
            b.addClassName("suggestion-input-unfaded")
        }
        b.observe("blur", SuggestionInput.blur);
        b.observe("focus", SuggestionInput.focus);
        b.observe("db:value_change", SuggestionInput.focus);
        if (a) {
            if (!b.id) {
                b.id = "r_elm_id_" + Math.random().toString()
            }
            a.observe("submit", SuggestionInput.blank(b.id))
        }
    },
    register_all: function () {
        $$(".suggestion-input").each(SuggestionInput.register)
    },
    blank: function (a) {
        return function () {
            var b = $(a);
            if (!b) {
                return
            }
            if (SuggestionInput.defaulted(b)) {
                b.setValue("")
            }
        }
    },
    defaulted: function (a) {
        a = $(a);
        return a.getValue() === a.title
    },
    do_blank: function (a) {
        SuggestionInput.blank(a)()
    },
    clear: function (a) {
        var b = {
            target: a
        };
        SuggestionInput.focus(b)
    },
    focus: function (a) {
        var b = $(a.target);
        if (!b) {
            return
        }
        if (SuggestionInput.defaulted(b)) {
            b.addClassName("suggestion-input-unfaded");
            b.setValue("")
        }
    },
    blur_elm: function (a) {
        if (a.getValue() === "") {
            a.removeClassName("suggestion-input-unfaded");
            a.setValue(a.title)
        }
        a.blur()
    },
    blur: function (a) {
        var b = $(a.target);
        if (!b) {
            return
        }
        SuggestionInput.blur_elm(b)
    },
    reset: function (b) {
        var a = $(b);
        if (!a) {
            return
        }
        a.removeClassName("suggestion-input-unfaded");
        a.setValue(a.title);
        a.defaulted = true;
        a.blur()
    },
    setValue: function (a, b) {
        var c = $(a);
        if (!c) {
            return
        }
        c.addClassName("suggestion-input-unfaded");
        c.setValue(b);
        c.defaulted = false
    }
};
document.observe("dom:loaded", SuggestionInput.register_all);
var ULSelectMenu = (function () {
    var d = function (n) {
            n.removeClassName("shown")
        };
    var m = function (n) {
            n.toggleClassName("shown")
        };
    var g = function () {
            this.removeClassName("hover")
        };
    var e = function () {
            this.addClassName("hover")
        };
    var a = function (o, n) {
            n.each(function (p) {
                o.insert(p)
            })
        };
    var k = function (p, n, o) {
            a(p, o);
            if (p.firstChild != n) {
                p.insert({
                    top: n
                })
            }
        };
    var f = function (n, o) {
            n.down(".selected").removeClassName("selected");
            o.addClassName("selected")
        };
    var c = function (n, o) {
            n.select("li").each(function (p) {
                if (p.getAttribute("data-value") == o) {
                    f(n, p)
                }
            })
        };
    var l = function (n, p, o) {
            return function (q) {
                if (!n.hasClassName("selected")) {
                    f(p, n);
                    p.fire("db:change", n.getAttribute("data-value"));
                    d(p)
                } else {
                    k(p, n, o);
                    m(p)
                }
            }
        };
    var h = function (p) {
            var n = p.select("li");
            assert(n.length, "Empty list of options " + p.identify());
            var o;
            if (n.length == 1) {
                p.addClassName("one")
            } else {
                n.each(function (t) {
                    var s = t.getAttribute("data-value");
                    assert(s, t.identify() + " missing data value");
                    t.observe("click", l(t, p, n));
                    t.observe("mouseenter", e);
                    t.observe("mouseleave", g);
                    if (t.hasClassName("selected")) {
                        o = t
                    }
                });
                $(document.body).observe("click", function (s) {
                    if ($(s.target).up(".ul_select_menu")) {
                        return
                    }
                    d(p)
                })
            }
            if (!o) {
                o = n[0]
            }
            o.addClassName("selected");
            var r = new Element("span");
            var q = o.getDimensions();
            r.style.width = q.width + "px";
            r.style.height = q.height + "px";
            r.setStyle({
                width: q.width + "px",
                height: q.height + "px",
                position: "relative",
                display: "inline-block"
            });
            p.wrap(r)
        };
    var b = function () {
            $$(".ul_select_menu").each(function (n) {
                h(n)
            })
        };
    document.observe("dom:loaded", b);
    return {
        init: function (n) {
            h(n)
        },
        set_selected_by_value: c
    }
})();
var JumpWatcher = {
    inverval: null,
    last_hash: null,
    last_page_offset: 0,
    check: function () {
        if (window.location.href.endsWith("#") && window.pageYOffset === 0 && JumpWatcher.last_page_offset !== 0) {
            JumpWatcher.report()
        } else {
            JumpWatcher.last_page_offset = window.pageYOffset;
            JumpWatcher.last_hash = Util.url_hash()
        }
    },
    report: function () {
        clearInterval(JumpWatcher.interval);
        assert(0.1 + 0.2 === 0.3, "Hash jump detected, last hash = " + JumpWatcher.last_hash)
    }
};
var ToggleButton = {
    init: function () {
        $$(".toggle-button").each(ToggleButton.register)
    },
    register: function (a) {
        a.observe("click", ToggleButton.click)
    },
    on: function (a) {
        a.removeClassName("off")
    },
    off: function (a) {
        a.addClassName("off")
    }
};
var TitleBubble = (function () {
    var b = function (k, m) {
            var o = m.getAttribute("title");
            if (o && o.length && o != "undefined") {
                m.setAttribute("data-title", o);
                m.removeAttribute("title")
            }
            var t = new Element("div", {
                "class": "title_bubble_container force-no-break",
                style: "z-index: 1001"
            });
            if (m.hasClassName("white")) {
                t.addClassName("white")
            }
            t.update(m.getAttribute("data-title"));
            var l = new Element("div", {
                "class": "tail"
            });
            t.appendChild(l);
            document.body.appendChild(t);
            var p = document.viewport.getDimensions();
            var q = p.width;
            p = t.getDimensions();
            var d = p.width,
                r = p.height;
            var f = m.viewportOffset();
            var n = m.getWidth() / 2 - t.getWidth() / 2;
            var g, s = 0;
            if (f.left + n + d > q) {
                g = q - f.left - d;
                s = n - g
            } else {
                g = n
            }
            var h, c = 6;
            if (f.top < r) {
                t.addClassName("below");
                h = m.getHeight() + c
            } else {
                h = (-1 * t.getHeight()) - c
            }
            t.clonePosition(m, {
                setWidth: false,
                setHeight: false,
                offsetTop: h,
                offsetLeft: g
            });
            l.style.marginLeft = s - 4 + "px"
        };
    var a = function (c) {
            $$(".title_bubble_container").each(Element.remove)
        };
    return {
        init: function () {
            $(document.body).on("mouseover", ".title_bubble", b);
            $(document.body).on("mouseout", ".title_bubble", a)
        },
        hide_all: function () {
            a()
        }
    }
})();
Event.observe(window, "scroll", function () {
    TitleBubble.hide_all()
});
Event.observe(document, "dom:loaded", function () {
    TranslationSuggest.index_all()
});
document.observe("dom:loaded", function () {
    JumpWatcher.interval = setInterval(JumpWatcher.check, 500);
    LocaleSelector.init();
    ModalLocaleSelector.init();
    LoginDropdown.init();
    TitleBubble.init();
    Tabs.init()
});
var Upload, FileQueue, UploadFile, BulkUpload, InlineUploadStatus, CrossDomainUploader;
Upload = {
    QUEUE_EVT: "db:upload:queue",
    QUEUE_ERROR_EVT: "db:upload:queue_error",
    UPDATE_EVT: "db:upload:update",
    COMPLETE_EVT: "db:upload:complete",
    ERROR_EVT: "db:upload:error",
    CANCEL_EVT: "db:upload:cancel",
    SWFU: false,
    current_dest: null,
    init: function (c, d) {
        var a = {};
        a[Constants.tcn] = Upload.touch;
        var b = Upload.initSWFU(a);
        if (!d) {
            Event.observe(window, "load", b)
        } else {
            b()
        }
        Upload.current_dest = c;
        $$(".swfupload").each(function (e) {
            if (e.observe) {
                Util.freshbutton_overlay(e, $("choose-button"));
                Util.freshbutton_overlay(e, $("add-button"))
            }
        });
        Upload.operaHack();
        FileQueue.clear()
    },
    init_basic: function () {
        Util.freshbutton_overlay($("file-box"), $("basic-choose-button"));
        $("basic-choose-button").observe("mousemove", function (c) {
            var b = $("modal").cumulativeOffset();
            var d = c.clientY - b.top - 3;
            var a = c.clientX - b.left - $("file-box").getWidth() + 3;
            $("file-box").setStyle({
                top: d + "px",
                left: a + "px"
            })
        });
        $("file-box").observe("change", function () {
            Modal.hide = function () {};
            $("modal-x").hide();
            $("basic-upload-desc").hide();
            $("basic-upload-buttons").hide();
            $("file-box").hide();
            var a = $("file-box").getValue().split("\\").pop();
            var c = Sprite.make(FileOps.filename_to_icon(a));
            $("basic-upload-status").down(".icon").__date(c);
            var b = _("Uploading %(filename)s").format({
                filename: a.em_snippet(25)
            });
            $("basic-upload-status").down(".file-desc").__date(b);
            $("basic-upload-status").show();
            $("basic-uploading-message").show();
            $("basic-upload-form").submit()
        })
    },
    initSWFU: function (a) {
        return function () {
            var b = new SWFUpload({
                upload_url: (Constants.IS_PROD ? "https://" : "http://") + Constants.BLOCK_CLUSTER + "/upload",
                file_post_name: "file",
                file_size_limit: "307200",
                file_types: "*",
                file_types_description: _("All files"),
                file_upload_limit: "0",
                button_placeholder_id: "flash-upload-button-placeholder",
                button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                button_width: 1000,
                button_height: 1000,
                button_cursor: SWFUpload.CURSOR.HAND,
                swfupload_loaded_handler: Upload.flashLoaded,
                file_queued_handler: Upload.fileQueued,
                file_queue_error_handler: Upload.fileQueueError,
                upload_progress_handler: Upload.uploadProgress,
                upload_error_handler: Upload.uploadError,
                upload_success_handler: Upload.uploadSuccess,
                upload_complete_handler: Upload.uploadComplete,
                flash_url: "/static/swf/swfupload.swf",
                custom_settings: {
                    progress_target: "fsUploadProgress",
                    upload_successful: false
                },
                post_params: a,
                debug: Constants.upload_debug || false
            });
            Upload.SWFU = b
        }
    },
    reset: function () {
        if (FileQueue.uploading && FileQueue.current_file) {
            if (CrossDomainUploader.is_cross_domain(FileQueue.current_file)) {
                CrossDomainUploader.current_req.transport.abort()
            } else {
                Upload.SWFU.cancelUpload()
            }
        }
        var a = $$(".swfupload").first();
        if (a && a.remove) {
            a.remove()
        }
        delete Upload.SWFU;
        FileQueue.clear();
        InlineUploadStatus.hide()
    },
    show_upload: function () {
        $("upload-desc").hide();
        $("upload-files-list").show();
        $("upload-start-buttons").hide();
        $("upload-running-buttons").show();
        $("hide-button").show();
        $("done-button").hide();
        $("flash-upload-container").clonePosition($("add-button"));
        $$(".swfupload").first().width = $("add-button").getWidth();
        $$(".swfupload").first().height = $("add-button").getHeight();
        if (!$("modal-overlay").visible()) {
            InlineUploadStatus.show()
        }
    },
    updatePostParams: function (c) {
        var a = Upload.SWFU.getSetting("post_params");
        for (var b in c) {
            if (c.hasOwnProperty(b)) {
                a[b] = c[b]
            }
        }
        Upload.SWFU.setPostParams(a)
    },
    fileQueueError: function (d, a, c) {
        switch (a) {
        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
            var b = _('The upload limit online is 300MB. You can upload larger files with the <a id="install_link">Dropbox desktop application</a>.');
            b = b.replace('id="install_link"', 'href="/install" target="_blank"');
            document.fire(Upload.QUEUE_ERROR_EVT, {
                file: d,
                message: _("File too large"),
                tooltip_text: b
            });
            break;
        case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            document.fire(Upload.QUEUE_ERROR_EVT, {
                file: d,
                message: _("Empty file"),
                tooltip_text: _("You can't upload an empty file.")
            });
            break;
        case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
            document.fire(Upload.QUEUE_ERROR_EVT, {
                file: d,
                message: _("Invalid file type"),
                tooltip_text: _("This file does not have an allowed file type.")
            });
            break;
        default:
            document.fire(Upload.QUEUE_ERROR_EVT, {
                file: d
            });
            this.debug("Error code: " + a + ", file name: " + d.name + ", file size: " + d.size + ", message: " + c);
            break
        }
        Upload.show_upload()
    },
    fileQueued: function (a) {
        document.fire(Upload.QUEUE_EVT, {
            file: a
        });
        Upload.show_upload()
    },
    uploadNext: function () {
        if (CrossDomainUploader.is_cross_domain(FileQueue.next())) {
            CrossDomainUploader.upload_next()
        } else {
            Upload.updatePostParams({
                dest: FileQueue.next_dest(),
                t: Constants.TOKEN
            });
            Upload.SWFU.startUpload()
        }
        FileQueue.last_update_time = 0;
        FileQueue.last_update_size = 0
    },
    pause: function () {
        Upload.SWFU.stopUpload()
    },
    uploadProgress: function (c, b, a) {
        if (!FileQueue.cancelled_files[c.id]) {
            document.fire(Upload.UPDATE_EVT, {
                file: c,
                percent_complete: b / a
            })
        }
    },
    uploadSuccess: function (b, a) {
        if (a.strip() === "") {
            document.fire(Upload.ERROR_EVT, {
                file: b
            })
        } else {
            if (a == "quota") {
                document.fire(Upload.ERROR_EVT, {
                    file: b,
                    message: _("Quota exceeded"),
                    tooltip_text: _("Your upload failed because you are over quota.")
                })
            } else {
                if (a == "folder_exists") {
                    document.fire(Upload.ERROR_EVT, {
                        file: b,
                        message: _("Invalid file name"),
                        tooltip_text: _("You can't upload a file with the same name as a folder in this folder.")
                    })
                } else {
                    document.fire(Upload.UPDATE_EVT, {
                        file: b,
                        percent_complete: 1
                    })
                }
            }
        }
    },
    uploadComplete: function (a) {
        if (!FileQueue.cancelled_files[a.id] && !FileQueue.errored_files[a.id]) {
            document.fire(Upload.COMPLETE_EVT, {
                file: a
            })
        }
    },
    uploadError: function (e, b, d) {
        var c = e;
        if (parseInt(b, 10) != -280) {
            var a = FlashDetect.major + "." + FlashDetect.revision;
            Util.report_exception("Uploader error: " + b + " " + d + " " + Object.toJSON(e) + " FLASH VERSION: " + a, window.location.href)
        }
        switch (b) {
        case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
            this.debug("Error code: No backend file, file name: " + c.name + ", message: " + d);
            break;
        case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
            this.debug("Error code: upload limit exceeded, file name: " + c.name + ", file size: " + c.size + ", message: " + d);
            break;
        case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
            this.debug("Error code: HTTP error, file name: " + c.name + ", message: " + d);
            break;
        case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
            this.debug("Error code: upload failed, file name: " + c.name + ", file size: " + c.size + ", message: " + d);
            break;
        case SWFUpload.UPLOAD_ERROR.IO_ERROR:
            this.debug("Error code: IO error, file name: " + c.name + ", message: " + d);
            break;
        case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
            this.debug("Error code: security error, file name: " + c.name + ", message: " + d);
            break;
        case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
            this.debug("Error code: upload cancelled, file name: " + c.name + ", message: " + d);
            break;
        case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
            this.debug("Error code: upload stopped, file name: " + c.name + ", message: " + d);
            break;
        default:
            this.debug("Error code: " + b + ", file name: " + c.name + ", file size: " + c.size + ", message: " + d);
            break
        }
        if (FileQueue.files[e.id]) {
            document.fire(Upload.ERROR_EVT, {
                file: e,
                error_code: b
            })
        }
    },
    grabURL: function () {
        var a = $F("file-box");
        if (/(^http|^https|^ftp):\/\//.match(a)) {
            $("url").value = a
        }
        return true
    },
    set_dest: function (b) {
        Upload.current_dest = b;
        var a = b.split("/");
        var d = a[a.length - 1];
        if (!d.length) {
            d = _("Dropbox");
            b = "/"
        }
        DomUtil.fillVal(b, "dest-folder");
        var c = $("basic-uploader-url");
        if (c) {
            c.href = c.href.replace(/(\/upload)(.*)(\?basic=1)/, function (h, g, k, e) {
                return g + Util.urlquote(b) + e
            })
        }
    },
    treeview_handler: function (b, a) {
        Upload.set_dest(b);
        FileQueue.clear()
    },
    new_folder: function () {
        TreeView.hide();
        Modal.show(_("Create new folder..."), DomUtil.fromElm("create-folder"), {
            action: Upload.do_new_folder,
            wit_group: "new-folder-confirm"
        });
        if (!Util.ie) {
            $("first-treeview-link").onclick()
        }
    },
    do_new_folder: function () {
        if (!Modal.vars.selected_path) {
            Notify.server_error(_("Please select a parent folder."));
            return
        }
        var b = $F("entered-name");
        var a = Modal.vars.selected_path;
        new Ajax.DBRequest("/cmd/new" + Util.urlquote(a) + "?to_path=" + Util.urlquote(b), {
            onSuccess: function (c) {
                Upload.treeview_handler(Util.normalize(a) + "/" + b);
                TreeView.schedule_reset()
            },
            cleanUp: function () {}
        })
    },
    flashLoaded: function () {
        if ($("modal").visible()) {
            Upload.flash_loaded = true;
            $("upload-loading").hide();
            $("choose-button").show();
            $("flash-upload-container").clonePosition($("choose-button"));
            $$(".swfupload").first().width = $("choose-button").getWidth();
            $$(".swfupload").first().height = $("choose-button").getHeight()
        }
    },
    checkForFallback: function () {
        if (!Upload.flash_loaded) {
            location.replace("/upload?basic=1")
        } else {
            clearInterval(Upload.opera_tid)
        }
    },
    operaHack: function () {
        if (Prototype.Browser.Opera) {
            Upload.opera_tid = setInterval(function () {
                $("opera-dummy-div").toggle()
            }, 200)
        }
    }
};
FileQueue = {
    files: {},
    file_ids: [],
    uploading: false,
    num_left: 0,
    queue_size: 0,
    completed_size: 0,
    completed_files: {},
    errors: 0,
    errored_files: {},
    cancels: 0,
    cancelled_files: {},
    all_cancelled: false,
    last_update_time: 0,
    last_update_size: 0,
    average_bps: 0,
    formatted_time: null,
    init: function () {
        FileQueue._listen()
    },
    _listen: function () {
        document.observe(Upload.QUEUE_EVT, FileQueue._file_queued);
        document.observe(Upload.QUEUE_ERROR_EVT, FileQueue._file_queue_errored);
        document.observe(Upload.UPDATE_EVT, FileQueue._file_updated);
        document.observe(Upload.COMPLETE_EVT, FileQueue._file_completed);
        document.observe(Upload.ERROR_EVT, FileQueue._file_errored);
        document.observe(Upload.CANCEL_EVT, FileQueue._file_cancelled)
    },
    _file_queued: function (b) {
        var a = b.memo.file;
        FileQueue.queue_size += a.size;
        FileQueue.files[a.id] = a;
        FileQueue.file_ids.push(a.id);
        FileQueue.num_left++;
        if (!FileQueue.uploading) {
            FileQueue._start_uploading()
        }
        T("File queued:", a.name)
    },
    _file_queue_errored: function (a) {
        FileQueue._file_queued(a);
        setTimeout(function () {
            FileQueue._file_errored(a)
        }, 250)
    },
    _file_updated: function (l) {
        var c = l.memo.file;
        var g = l.memo.percent_complete;
        var h = g * c.size;
        var m = FileQueue.completed_size + h;
        var b = new Date().getTime();
        if (FileQueue.last_update_time) {
            var f = (b - FileQueue.last_update_time) / 1000;
            var a = h - FileQueue.last_update_size;
            var d = a / f;
            FileQueue.average_bps = ((m - a) * FileQueue.average_bps + a * d) / m;
            var k = (FileQueue.queue_size - m) / FileQueue.average_bps;
            FileQueue.formatted_time = Util.formatTime(k + FileQueue.num_left)
        }
        FileQueue.current_file = c;
        FileQueue.last_update_time = new Date().getTime();
        FileQueue.last_update_size = h;
        FileQueue.totalPercentage = m / FileQueue.queue_size
    },
    _file_completed: function (b) {
        var a = b.memo.file;
        FileQueue.num_left = Math.max(0, FileQueue.num_left - 1);
        FileQueue.completed_files[a.id] = true;
        FileQueue.completed_size += a.size;
        FileQueue.totalPercentage = FileQueue.completed_size / FileQueue.queue_size;
        T("File completed:", a.name);
        FileQueue._check_if_finished(a)
    },
    _file_errored: function (b) {
        var a = b.memo.file;
        FileQueue.errors = FileQueue.errors + 1;
        FileQueue.errored_files[a.id] = true;
        FileQueue.num_left = Math.max(0, FileQueue.num_left - 1);
        FileQueue.queue_size -= a.size;
        FileQueue.totalPercentage = FileQueue.completed_size / FileQueue.queue_size;
        BulkUpload.update_errors();
        InlineUploadStatus.update_errors();
        T("File errored:", a.name);
        FileQueue._check_if_finished(a)
    },
    _file_cancelled: function (b) {
        var a = b.memo.file;
        delete FileQueue.files[a.id];
        FileQueue.file_ids.splice(FileQueue.file_ids.indexOf(a.id), 1);
        FileQueue.cancels = FileQueue.cancels + 1;
        FileQueue.cancelled_files[a.id] = true;
        FileQueue.num_left = Math.max(0, FileQueue.num_left - 1);
        FileQueue.queue_size -= a.size;
        FileQueue.totalPercentage = FileQueue.completed_size / FileQueue.queue_size;
        if (CrossDomainUploader.is_cross_domain(a)) {
            if (FileQueue.current_file === a) {
                CrossDomainUploader.current_req.transport.abort()
            }
        } else {
            Upload.SWFU.cancelUpload(a.id)
        }
        T("File cancelled:", a.name);
        FileQueue._check_if_finished(a)
    },
    _start_uploading: function () {
        Upload.uploadNext();
        FileQueue.uploading = true;
        FileQueue.all_cancelled = false;
        window.onbeforeunload = function a() {
            return _("Leaving this page will cancel your uploads.")
        }
    },
    _check_if_finished: function (a) {
        if (FileQueue.empty()) {
            if (FileQueue.uploading) {
                FileQueue._finished_uploading()
            }
        } else {
            if (!FileQueue.all_cancelled && FileQueue.current_file && a.id === FileQueue.current_file.id) {
                Upload.uploadNext()
            }
        }
    },
    _finished_uploading: function () {
        FileQueue.uploading = false;
        if (!FileQueue.num_files()) {
            BulkUpload.cancelled()
        } else {
            if (FileQueue.errors) {
                BulkUpload.errored();
                InlineUploadStatus.errored()
            } else {
                BulkUpload.completed();
                InlineUploadStatus.completed()
            }
        }
        var a = InlineUploadStatus.upload_box && InlineUploadStatus.upload_box.visible();
        Browse.select_fq_paths = [];
        if (Browse.inside_dir) {
            var b = Browse.containing_fq_path();
            for (var c in FileQueue.completed_files) {
                Browse.select_fq_paths.push(b + "/" + FileQueue.files[c].name)
            }
        }
        Browse.force_reload();
        if (a) {
            InlineUploadStatus.show()
        }
        Modal.onHide = null;
        window.onbeforeunload = null
    },
    empty: function () {
        return !FileQueue.num_left
    },
    num_files: function () {
        return FileQueue.file_ids.length
    },
    next: function () {
        if (FileQueue.num_left === 0) {
            return undefined
        } else {
            var a = FileQueue.num_files() - FileQueue.num_left;
            return FileQueue.files[FileQueue.file_ids[a]]
        }
    },
    next_dest: function () {
        var a = FileQueue.next();
        var b = a && a.id;
        return (b && $(b)) ? $(b).readAttribute("data-dest") : Upload.current_dest
    },
    clear: function (a) {
        FileQueue.files = {};
        FileQueue.file_ids = [];
        FileQueue.queue_size = 0;
        FileQueue.cancels = 0;
        FileQueue.cancelled_files = {};
        FileQueue.all_cancelled = false;
        FileQueue.errors = 0;
        FileQueue.errored_files = {};
        FileQueue.num_left = 0;
        FileQueue.completed_size = 0;
        FileQueue.completed_files = {};
        FileQueue.last_update_time = 0;
        FileQueue.last_update_size = 0;
        FileQueue.average_bps = 0;
        FileQueue.formatted_time = null;
        FileQueue.uploading = false;
        window.onbeforeunload = null;
        Modal.onHide = null
    }
};
UploadFile = {
    FILENAME_SNIPPET_LENGTH: 15,
    DEST_SNIPPET_LENGTH: 13,
    _tmpl: null,
    init: function () {
        UploadFile._tmpl = HTML.tmpl("upload_list_item_tmpl");
        UploadFile._listen()
    },
    _listen: function () {
        document.observe(Upload.QUEUE_EVT, UploadFile._file_queued);
        document.observe(Upload.QUEUE_ERROR_EVT, UploadFile._file_queue_errored);
        document.observe(Upload.UPDATE_EVT, UploadFile._file_updated);
        document.observe(Upload.COMPLETE_EVT, UploadFile._file_completed);
        document.observe(Upload.ERROR_EVT, UploadFile._file_errored);
        document.observe(Upload.CANCEL_EVT, UploadFile._file_cancelled)
    },
    _file_queued: function (f) {
        var c = f.memo.file;
        var h = UploadFile._tmpl({
            file: c,
            icon: FileOps.filename_to_icon(c.name),
            filename_snippet: c.name.em_snippet(UploadFile.FILENAME_SNIPPET_LENGTH),
            size: Util.formatBytes(c.size, 2, true),
            dest: Upload.current_dest,
            dest_snippet: ("Dropbox" + Upload.current_dest).em_snippet(UploadFile.DEST_SNIPPET_LENGTH, 0)
        });
        $("upload-files-list").__sert(h);
        var g = $(c.id);
        var b = FileQueue.num_files() + FileQueue.cancels;
        var a = $("upload-files-list");
        if (b <= 6 || IE7_OR_LESS) {
            a.style.height = "";
            a.style.overflowY = "visible"
        } else {
            a.style.height = (g.getHeight() * 6.5) + "px";
            a.style.overflowY = "scroll";
            a.scrollTop = a.scrollHeight
        }
        if (b === 1) {
            g.setStyle({
                "border-top": "none"
            })
        }
        g.down(".dest").observe("click", function () {
            Browse.reload_fqpath(g.readAttribute("data-dest"), true);
            Modal.hide()
        });
        var d = g.down(".status-col").down("a.small-x-button");
        d.stopObserving("click");
        d.observe("click", function (k) {
            document.fire(Upload.CANCEL_EVT, {
                file: c
            })
        });
        g.down(".upload-progress-bar").setStyle({
            width: "0"
        })
    },
    _file_queue_errored: function (a) {
        UploadFile._file_queued(a);
        UploadFile._file_errored(a)
    },
    _file_updated: function (f) {
        var c = f.memo.file;
        var g = $(c.id);
        if (FileQueue.num_files() + FileQueue.cancels === 1) {
            if (FileQueue.formatted_time) {
                var a = _("%(time_left)s left").format({
                    time_left: FileQueue.formatted_time
                });
                g.down(".time-col").__date(a)
            }
        } else {
            g.down(".time-col").__date()
        }
        var b = parseInt(100 * f.memo.percent_complete, 10) + "%";
        if (b == "100%") {
            g.down(".time-col").__date();
            g.down(".status-col").__date(new Element("img", {
                src: "/static/images/icons/ajax-loading-small.gif"
            }))
        } else {
            var d = g.down(".status-col").down("a.small-x-button");
            if (d) {
                d.stopObserving("click");
                d.observe("click", function (h) {
                    document.fire(Upload.CANCEL_EVT, {
                        file: c
                    })
                })
            }
        }
        g.down(".upload-progress-bar").setStyle({
            width: b
        })
    },
    _file_completed: function (b) {
        var a = b.memo.file;
        var c = $(a.id);
        c.addClassName("complete");
        c.down(".time-col").__date();
        c.down(".status-col").__date(Sprite.make("synced"));
        c.down(".upload-progress-bar").setStyle({
            width: "100%"
        })
    },
    _file_errored: function (f) {
        var c = f.memo.file;
        var g = $(c.id);
        g.addClassName("error");
        g.down(".dest-col").hide();
        g.down(".time-col").__date();
        g.down(".status-col").__date(Sprite.make("nosync"));
        g.down(".upload-progress-bar").setStyle({
            width: "100%"
        });
        var b = f.memo.message || _("Flash error");
        var a;
        if (f.memo.tooltip_text) {
            a = f.memo.tooltip_text
        } else {
            if (parseFloat(Util.flash_version(), 10) < 10.32) {
                a = _('Upload failed.  Please try upgrading to the latest version of <a id="adobe_link">Adobe Flash</a> and try again.');
                a = a.replace('id="adobe_link"', 'href="http://get.adobe.com/flashplayer/" target="_blank"')
            } else {
                a = _('Sorry, it looks like the advanced uploader is incompatible with your system. Please use the <a id="basic_link">basic uploader</a> to upload via the website');
                a = a.replace('id="basic_link"', 'onclick="FileOps.show_basic_upload(Browse.containing_fq_path()); return false;"')
            }
        }
        g.down(".error-msg").__date(b);
        var d = g.down(".error-details");
        d.observe("mouseover", function () {
            Tooltip.show(d, a)
        });
        g.down(".error-col").show()
    },
    _file_cancelled: function (b) {
        var a = b.memo.file;
        var c = $(a.id);
        c.addClassName("cancelled");
        c.down(".dest-col").__date(_("Canceled"));
        c.down(".time-col").__date();
        c.down(".status-col").__date(Sprite.make("cancelsync"));
        c.down(".upload-progress-bar").setStyle({
            width: "100%"
        })
    }
};
BulkUpload = {
    init: function () {
        BulkUpload._listen()
    },
    _listen: function () {
        document.observe(Upload.QUEUE_EVT, BulkUpload._file_queued);
        document.observe(Upload.UPDATE_EVT, BulkUpload._file_updated)
    },
    _file_queued: function (c) {
        var a = $("bulk-upload-status");
        a.removeClassName("error");
        a.removeClassName("complete");
        a.removeClassName("cancelled");
        var b = new Element("a", {
            "class": "small-x-button"
        });
        b.observe("click", function () {
            FileQueue.all_cancelled = true;
            var e = FileQueue.file_ids.slice(0);
            var f;
            for (var d = 0; d < e.length; d++) {
                f = e[d];
                if (!FileQueue.completed_files[f] && !FileQueue.errored_files[f]) {
                    document.fire(Upload.CANCEL_EVT, {
                        file: FileQueue.files[e[d]]
                    })
                }
            }
        });
        a.down(".status").__date(b)
    },
    _file_updated: function (g) {
        var c = FileQueue.num_files();
        if (c + FileQueue.cancels > 1) {
            var f = $("bulk-upload-status");
            var d = ungettext("%d file", "%d files", c).format(c);
            f.down(".num-files").__date(d);
            var b = _("- %(size)s").format({
                size: Util.formatBytes(FileQueue.queue_size, 2, true)
            });
            f.down(".size").__date(b);
            if (FileQueue.formatted_time) {
                var a = _("%(time_left)s left").format({
                    time_left: FileQueue.formatted_time
                });
                f.down(".time-left").__date(a)
            }
            f.down(".upload-progress-bar").style.width = (100 * FileQueue.totalPercentage || 0).toFixed(2) + "%";
            f.show();
            $("flash-upload-container").clonePosition($("add-button"));
            $$(".swfupload").first().width = $("add-button").getWidth();
            $$(".swfupload").first().height = $("add-button").getHeight()
        }
    },
    update_errors: function () {
        var a = ungettext("- %d error", "- %d errors", FileQueue.errors).format(FileQueue.errors);
        $("bulk-upload-status").down(".num-errors").__date(a)
    },
    completed: function () {
        $("hide-button").hide();
        $("done-button").show();
        var b = FileQueue.num_files();
        if (b + FileQueue.cancels > 1) {
            var d = $("bulk-upload-status");
            d.addClassName("complete");
            var c = ungettext("Uploaded %d file", "Uploaded %d files", b).format(b);
            d.down(".num-files").__date(c);
            var a = _("- %(size)s").format({
                size: Util.formatBytes(FileQueue.completed_size, 2, true)
            });
            d.down(".size").__date(a);
            d.down(".num-errors").__date();
            d.down(".time-left").__date();
            d.down(".status").__date(Sprite.make("synced"));
            d.down(".upload-progress-bar").style.width = "100%"
        }
    },
    errored: function () {
        $("hide-button").hide();
        $("done-button").show();
        var b = FileQueue.num_files();
        if (b + FileQueue.cancels > 1) {
            var d = $("bulk-upload-status");
            d.addClassName("error");
            var c = ungettext("Uploaded %(num_completed)d of %(num_files)d file", "Uploaded %(num_completed)d of %(num_files)d files", b).format({
                num_completed: b - FileQueue.errors,
                num_files: b
            });
            d.down(".num-files").__date(c);
            var a = _("- %(size)s").format({
                size: Util.formatBytes(FileQueue.completed_size, 2, true)
            });
            d.down(".size").__date(a);
            var e = ungettext("- %d error", "- %d errors", FileQueue.errors).format(FileQueue.errors);
            d.down(".num-errors").__date(e);
            d.down(".time-left").__date();
            d.down(".status").__date(Sprite.make("nosync"));
            d.down(".upload-progress-bar").style.width = "100%"
        }
    },
    cancelled: function () {
        $("hide-button").hide();
        $("done-button").show();
        var a = FileQueue.num_files();
        if (a + FileQueue.cancels > 1) {
            var b = $("bulk-upload-status");
            b.addClassName("cancelled");
            b.down(".num-files").__date(_("All uploads canceled"));
            b.down(".size").__date();
            b.down(".num-errors").__date();
            b.down(".time-left").__date();
            b.down(".status").__date(Sprite.make("cancelsync"));
            b.down(".upload-progress-bar").style.width = "100%"
        }
    }
};
InlineUploadStatus = {
    FILENAME_SNIPPET_LENGTH: 30,
    upload_box: false,
    init: function () {
        InlineUploadStatus._listen()
    },
    _listen: function () {
        document.observe(Upload.QUEUE_EVT, InlineUploadStatus._file_queued);
        document.observe(Upload.UPDATE_EVT, InlineUploadStatus._file_updated)
    },
    _file_queued: function (c) {
        var b = $("inline-upload-status");
        b.removeClassName("error");
        b.removeClassName("complete");
        b.down(".icon").__date(Sprite.make("syncing"));
        b.down(".file-desc").__date(_("Starting upload..."));
        b.down(".num-errors").__date();
        var a = ungettext("%d file", "%d files", FileQueue.num_left).format(FileQueue.num_left);
        b.down(".view-details").__date(a);
        b.down(".status").__date();
        b.down(".inline-upload-progress").style.width = "0%"
    },
    _file_updated: function (h) {
        var d = h.memo.file;
        if ($$("#right-content #inline-upload-status").length === 0) {
            InlineUploadStatus._build()
        }
        var c = $("inline-upload-status");
        c.down(".icon").__date(Sprite.make("syncing"));
        var f = _("Uploading %(filename)s").format({
            filename: d.name.em_snippet(InlineUploadStatus.FILENAME_SNIPPET_LENGTH)
        });
        c.down(".file-desc").__date(f);
        if (FileQueue.num_left > 1) {
            var b = ungettext("%d file left", "%d files left", FileQueue.num_left - 1).format(FileQueue.num_left - 1);
            c.down(".view-details").__date(b)
        } else {
            c.down(".view-details").__date(_("View details"))
        }
        if (FileQueue.formatted_time) {
            var a = _("%(time_left)s left").format({
                time_left: FileQueue.formatted_time
            });
            c.down(".status").__date(a)
        }
        var g = (parseInt(100 * FileQueue.totalPercentage, 10) || 0) + "%";
        c.down(".inline-upload-progress").style.width = g
    },
    update_errors: function () {
        var a = ungettext("- %d error", "- %d errors", FileQueue.errors).format(FileQueue.errors);
        $("inline-upload-status").down(".num-errors").__date(a)
    },
    add_x_button: function () {
        var a = new Element("a", {
            "class": "small-x-button"
        });
        a.observe("click", function () {
            InlineUploadStatus.hide();
            Upload.reset()
        });
        $("inline-upload-status").down(".status").__date(a)
    },
    completed: function () {
        var a = $("inline-upload-status");
        a.addClassName("complete");
        a.removeClassName("error");
        a.down(".icon").__date(Sprite.make("synced"));
        var b;
        if (FileQueue.num_files() > 1) {
            b = _("Uploaded %(num_files)d files").format({
                num_files: FileQueue.num_files()
            })
        } else {
            b = _("Uploaded %(filename)s").format({
                filename: FileQueue.current_file.name.em_snippet(InlineUploadStatus.FILENAME_SNIPPET_LENGTH)
            })
        }
        a.down(".file-desc").__date(b);
        a.down(".num-errors").__date();
        a.down(".view-details").__date(_("View details"));
        InlineUploadStatus.add_x_button();
        a.down(".inline-upload-progress").style.width = "100%"
    },
    errored: function () {
        var a = $("inline-upload-status");
        a.addClassName("error");
        a.removeClassName("complete");
        a.down(".icon").__date(Sprite.make("nosync"));
        var b = FileQueue.num_files();
        var c;
        if (b > 1) {
            c = _("Uploaded %(num_completed)d of %(num_files)d files").format({
                num_completed: b - FileQueue.errors,
                num_files: b
            });
            a.down(".file-desc").__date(c);
            var d = ungettext("- %d error", "- %d errors", FileQueue.errors).format(FileQueue.errors);
            a.down(".num-errors").__date(d)
        } else {
            c = _("Unable to upload %(filename)s").format({
                filename: FileQueue.current_file.name.em_snippet(InlineUploadStatus.FILENAME_SNIPPET_LENGTH)
            });
            a.down(".file-desc").__date(c);
            a.down(".num-errors").__date()
        }
        a.down(".view-details").__date(_("View details"));
        InlineUploadStatus.add_x_button();
        a.down(".inline-upload-progress").style.width = "100%"
    },
    show: function (a) {
        if (!InlineUploadStatus.upload_box) {
            InlineUploadStatus._build(a)
        }
        InlineUploadStatus.upload_box.show()
    },
    _build: function () {
        if (!InlineUploadStatus.upload_box) {
            InlineUploadStatus.upload_box = $("inline-upload-status")
        }
        $("browse").insert({
            top: InlineUploadStatus.upload_box
        })
    },
    hide: function () {
        if (InlineUploadStatus.upload_box) {
            InlineUploadStatus.upload_box.hide()
        }
    }
};
CrossDomainUploader = {
    CROSS_DOMAIN_PREFIX: "cross-domain-",
    file_counter: 0,
    current_req: null,
    supported: function () {
        return !Prototype.Browser.IE && Prototype.BrowserFeatures.DB_CORS
    },
    enabled: function () {
        var b = ["file-preview-modal", "modal-overlay"];
        for (var a = 0; a < b.length; a++) {
            if ($(b[a]).visible()) {
                return false
            }
        }
        return Constants.ADMIN && Browse.inside_dir
    },
    is_cross_domain: function (a) {
        return a.id.indexOf(CrossDomainUploader.CROSS_DOMAIN_PREFIX) !== -1
    },
    upload: function (a, d) {
        Upload.current_dest = a;
        FileOps.show_upload();
        Modal.hide(null, true);
        for (var c = 0; c < d.length; c++) {
            var b = d[c];
            b.id = CrossDomainUploader.CROSS_DOMAIN_PREFIX + CrossDomainUploader.file_counter;
            CrossDomainUploader.file_counter++;
            document.fire(Upload.QUEUE_EVT, {
                file: b
            })
        }
        Upload.show_upload()
    },
    upload_next: function () {
        var b = FileQueue.next();
        var a = "//" + Constants.BLOCK_CLUSTER + "/upload_cross_domain?dest=" + encodeURIComponent(FileQueue.next_dest()) + "&t=" + encodeURIComponent(Constants.TOKEN);
        FileQueue.current_file = b;
        CrossDomainUploader.current_req = new Ajax.DBRequest(a, {
            method: "POST",
            contentType: b.type || "application/octet-stream",
            evalJS: false,
            evalJSON: false,
            requestHeaders: {
                "If-Modified-Since": "Mon, 26 Jul 1997 05:00:00 GMT",
                "Cache-Control": "no-cache",
                "X-File-Name": b.name || b.fileName,
                "X-File-Size": b.size || b.fileSize,
                "X-File-Type": b.type
            },
            postBody: b,
            onCreate: CrossDomainUploader._onCreate.bind(null, b),
            onSuccess: CrossDomainUploader._onSuccess.bind(null, b),
            onFailure: CrossDomainUploader._onFailure.bind(null, b)
        })
    },
    _onCreate: function (a, c) {
        var b = c.request.transport;
        b.upload.addEventListener("progress", function (d) {
            if (!FileQueue.cancelled_files[a.id]) {
                document.fire(Upload.UPDATE_EVT, {
                    file: a,
                    percent_complete: d.loaded / d.total
                })
            }
        }, false);
        b.send = b.send.wrap(function (e, d) {
            this.withCredentials = "true";
            e(d)
        })
    },
    _onSuccess: function (a, b) {
        document.fire(Upload.COMPLETE_EVT, {
            file: a
        })
    },
    _onFailure: function (a, b) {
        if (!FileQueue.cancelled_files[a.id]) {
            if (a.size) {
                document.fire(Upload.ERROR_EVT, {
                    file: a,
                    message: _("Upload error"),
                    tooltip_text: _("Please try again. If this continues to fail, your browser might not support drag and drop uploads.")
                })
            } else {
                document.fire(Upload.ERROR_EVT, {
                    file: a,
                    message: _("Invalid type"),
                    tooltip_text: _("You can't upload folders or files of this type.")
                })
            }
        }
    }
};
var Hosts = {
    edit: function (d) {
        var c = $("host" + d);
        if (c.editing) {
            return false
        }
        c.editing = true;
        var b = c.innerHTML.unescapeHTML();
        c.previous = b;
        c.innerHTML = "<input type='text' class='skinny-input' size='20' maxlength='256' style=\"word-wrap: break-word;\" value=\"" + b.escapeHTML().gsub('"', "&quot;") + "\">&nbsp;<input type='button' onclick='Hosts.doneEditing(\"" + d + "\");' class='button' value='" + _("Save") + "'>&nbsp;<input type='button' onclick='Hosts.cancelEditing(\"" + d + "\");' class='button grayed' value='" + _("Cancel") + "'>";
        var a = c.down("input");
        Event.observe(a, "keydown", Hosts.checkKey(d));
        a.select();
        return false
    },
    doneEditing: function (c) {
        var b = $("host" + c);
        var a = b.down("input").value;
        new Ajax.DBRequest("/computer_edit?host_id=" + c + "&name=" + Util.urlquote(a), {
            onSuccess: function (d) {
                Hosts.unedit(b, d.responseText)
            }
        })
    },
    cancelEditing: function (b) {
        var a = $("host" + b);
        Hosts.unedit(a, a.previous)
    },
    unedit: function (b, a) {
        b.editing = false;
        b.innerHTML = a.escapeHTML()
    },
    unlink: function (c, b, a) {
        DomUtil.fillVal(b.escapeHTML(), "unlink-confirm-name");
        Modal.icon_show("alert_32", _("Unlink computer?"), DomUtil.fromElm("unlink-confirm"), {
            host_id: c,
            plat: a,
            wit_group: "unlink-confirm"
        })
    },
    doUnlink: function (b, a) {
        new Ajax.DBRequest("/computer_edit?host_id=" + b + "&unlink=yessir", {
            onSuccess: function (c) {
                Hosts.killRow(b);
                Hosts.dec_count(a)
            }
        })
    },
    dec_count: function (a) {
        var c = $(a + "-count");
        if (!c) {
            return
        }
        var d = c.innerHTML.split(" ");
        var b = parseInt(d.shift(), 10);
        var e = d.join(" ");
        if (!b) {
            return
        }
        b--;
        if (b == 1 && e.charAt(e.length - 1) == "s") {
            e = e.substr(0, e.length - 1)
        } else {
            if (b != 1 && e.charAt(e.length - 1) != "s") {
                e = e + "s"
            }
        }
        c.innerHTML = b.toString() + " " + e
    },
    killRow: function (d) {
        var a = $("host" + d).up("table");
        $("host" + d).up("tr").remove();
        if (Hosts.rowCount() === 0) {
            var b = new Element("tr");
            var c = new Element("td", {
                colspan: 4
            });
            c.innerHTML = "<center>" + _("You no longer have any hosts linked.") + "</center>";
            a.insert(b);
            b.insert(c)
        }
    },
    rowCount: function () {
        return $$(".host-row").length
    },
    checkKey: function (a) {
        return function (b) {
            b = b || window.event;
            if (b.keyCode == Event.KEY_RETURN) {
                Hosts.doneEditing(a)
            }
            if (b.keyCode == Event.KEY_ESC) {
                Hosts.cancelEditing(a)
            }
        }
    }
};
var Upgrade = {
    card_toggle: function (a) {
        return function (c) {
            var b = $(c);
            if (c == a || !a) {
                b.removeClassName("cc-icon-off")
            } else {
                b.addClassName("cc-icon-off")
            }
        }
    },
    highlightCardtype: function () {
        var e = $("ccn");
        if (Upgrade.last_val == e.value) {
            return
        }
        Upgrade.last_val = e.value;
        var b = e.value;
        var d = b.substr(0, 2);
        var c = $A(["visa", "mastercard", "amex"]);
        var a = null;
        if (b.charAt(0) == "4") {
            a = "visa"
        } else {
            if (d == "34" || d == "37") {
                a = "amex"
            } else {
                if (parseInt(d, 10) >= 51 && parseInt(d, 10) <= 55) {
                    a = "mastercard"
                }
            }
        }
        c.each(Upgrade.card_toggle(a))
    },
    runCardHighlighter: function () {
        setInterval(Upgrade.highlightCardtype, 200)
    },
    highlightPlan: function () {
        var b = $A(["fifty-plan", "100-plan", "250-plan", "free-plan"]);
        var a = b.map(Util.scry).find(function (c) {
            if (c) {
                return c.checked
            }
        });
        if (Upgrade.last_checked == a) {
            return
        }
        if (Upgrade.last_checked) {
            $(Upgrade.last_checked.id + "-div").removeClassName("payment-option-selected")
        }
        if (a) {
            $(a.id + "-div").addClassName("payment-option-selected")
        }
        Upgrade.last_checked = a
    },
    enableNext: function () {
        var a = $("next-button");
        a.enable();
        a.removeClassName("disabled-button")
    },
    disableNext: function () {
        var a = $("next-button");
        a.disable();
        a.addClassName("disabled-button")
    },
    runPlanHighlighter: function () {
        setInterval(Upgrade.highlightPlan, 100)
    },
    showPlanInfo: function (b) {
        var a = {
            "50-plan": _("It's 50 GB"),
            "100-plan": _("It's 100 GB"),
            "250-plan": _("It's 250 GB"),
            "free-plan": _("It's free")
        };
        $("plan-specific").update(a[b.id])
    }
};
var Home = {
    hide_promo: function (a) {
        new Ajax.DBRequest(a);
        $$(".bromo").invoke("hide")
    },
    showScreencast: function (f, h, b) {
        var e = "/static/images/cc_endframe.jpg";
        var g = 360 / 640;
        if (Constants.USER_LOCALE == "en") {
            e = "/static/images/cc_endframe_en.jpg";
            g = 353 / 640
        }
        b = b || 532;
        var k = g * b;
        k = parseInt(k, 10);
        var d = {
            allowfullscreen: "true",
            wmode: "transparent"
        };
        var c = {
            file: localized_path("http://scast.s3.amazonaws.com/cc/dropbox_intro.mp4", ["es", "fr", "de", "ja"]),
            skin: "/static/swf/bekle.swf",
            controlbar: "over",
            image: e
        };
        if (h) {
            c.autostart = "true"
        }
        var a = new Element("div", {
            id: "commoncraft-embed",
            style: "display: inline-block; border:1px solid #adcfea;background:#fff;"
        });
        $(f).update(a);
        swfobject.embedSWF("/static/swf/player-5.9.swf", "commoncraft-embed", b.toString(), k.toString(), "9", false, c, d);
        MCLog.log("commoncraft_views")
    },
    hide: function (b, a) {
        $(b).up("div").hide();
        new Ajax.DBRequest("/hide/" + a)
    }
};
var LoginAndRegister = {
    init: function () {
        LoginAndRegister._one_submit_at_a_time();
        $("login-link").observe("click", function () {
            $("login-and-register-container").removeClassName("show-register")
        });
        $("register-link").observe("click", function () {
            $("login-and-register-container").addClassName("show-register")
        })
    },
    invite_init: function (b, a) {
        LoginAndRegister._one_submit_at_a_time();
        if (!a) {
            $("invite-register-page").on("click", ".switch-form-link", function () {
                $("invite-register-page").toggleClassName("show-login-form")
            })
        }
    },
    _one_submit_at_a_time: function () {
        $$(".one-submit-at-a-time").each(function (a) {
            a.observe("click", function (b) {
                Forms.disable(a)
            })
        })
    }
};
var Install = {
    pingForLinkedHost: function (a) {
        new Ajax.Request("/host_linked", {
            method: "get",
            onSuccess: function () {
                location.href = "/share" + a
            },
            onFailure: function () {
                setTimeout(Install.pingForLinkedHost.curry(a), 3000)
            }
        })
    }
};
var Eggs = {
    init: function () {
        key("ctrl+l+u", Eggs.lehigh)
    },
    lehigh: function () {
        if ($("lehigh")) {
            new Effect.Appear("lehigh")
        }
    }
};
Eggs.init();
var Downloading = {
    registerAll: function () {
        if (Prototype.Browser.IE) {
            $$(".downloading-link").each(Downloading.register)
        }
    },
    register: function (a) {
        a = $(a);
        a.observe("click", Downloading.clicked)
    },
    clicked: function (b) {
        Event.stop(b);
        var c = $(b.target);
        if (c.nodeName === "SPAN") {
            c = c.up("a")
        }
        var a = c.href.split("?").last();
        window.location = "/download?" + a;
        setTimeout(function () {
            window.location = "/downloading?" + a
        }, 4000)
    }
};
document.observe("dom:loaded", Downloading.registerAll);
var Help = {
    toggle_more_help: false,
    search_complete: function (b) {
        $("hide_on_search").hide();
        if (Help.toggle_more_help) {
            $("morehelp").show()
        }
        var a = _("Search results for '%(search_query)s'").format({
            search_query: b.escapeHTML()
        });
        $("search-results-title").update(a);
        $("search-results-container").show()
    },
    search_empty: function () {
        if (Help.toggle_more_help) {
            $("morehelp").hide()
        }
        $("hide_on_search").show();
        $("search-results-container").hide()
    },
    show_os: function (b, c, a) {
        c = $(c);
        $$(".os-filter").invoke("removeClassName", "selected");
        c.addClassName("selected");
        $$(".help-os-section").invoke("hide");
        $$(".help-os-" + a).invoke("show");
        Event.stop(b)
    },
    vote: function (a, b) {
        new Ajax.DBRequest("/help/" + a + "/vote/" + b);
        new Effect.Fade("help-vote-cont");
        Notify.server_success(_("Thanks for your feedback!"))
    }
};
var AccountExtras = {
    prices: {},
    prices_value: {},
    watch_id: 0,
    watch: function () {
        if (!AccountExtras.watch_id) {
            AccountExtras.watch_id = setInterval(AccountExtras.update_prices, 200)
        }
    },
    show_detail: function (a, d, b) {
        var c = _("What is %(feature_name)s?").format({
            feature_name: a
        });
        Modal.icon_show("alert_32", c, $(d + "-modal"), {}, false);
        return false
    },
    register_price: function (e, a, d, c, b) {
        AccountExtras.prices[e] = [a, d];
        AccountExtras.prices_value[e] = [c, b]
    },
    update_prices: function () {
        var f = $("yearly").checked;
        var d = f ? 1 : 0;
        var a = f ? _("year") : _("month");
        var b = 0;
        for (var e in AccountExtras.prices) {
            if (AccountExtras.prices.hasOwnProperty(e)) {
                $(e + "-price").update(AccountExtras.prices[e][d]);
                $(e + "-priceperiod").update(a)
            }
            if (AccountExtras.prices_value.hasOwnProperty(e)) {
                if ($(e).checked) {
                    var c = AccountExtras.prices_value[e][d];
                    b += parseFloat(c)
                }
            }
        }
        $(document).fire("widget:update_price", {
            price: b,
            period: a
        })
    }
};
var DowngradeReasons = {
    reasons: {},
    addReason: function (a, b) {
        DowngradeReasons.reasons[a] = b
    },
    change: function (d, b) {
        d = parseInt(d, 10);
        var a = $(b);
        assert(a, "Couldn't find container for DowngradeReason");
        if (DowngradeReasons.reasons[d]) {
            a.show();
            var c = Sprite.make("information", {});
            c.addClassName("text-img");
            a.update(c);
            a.insert(DowngradeReasons.reasons[d])
        } else {
            a.hide()
        }
    }
};
var Restore = {
    next: function (a, d) {
        d = $(d);
        var b = $$("ul.selected")[0];
        var c = b.next("ul");
        c.addClassName("selected");
        b.removeClassName("selected");
        if (c.next("ul")) {
            Restore.show_next_link()
        } else {
            Restore.hide_next_link()
        }
        Restore.show_prev_link();
        Restore.inc_page(1)
    },
    prev: function (a, d) {
        d = $(d);
        var b = $$("ul.selected")[0];
        var c = b.previous("ul");
        c.addClassName("selected");
        b.removeClassName("selected");
        if (c.previous("ul")) {
            Restore.show_prev_link()
        } else {
            Restore.hide_prev_link()
        }
        Restore.show_next_link();
        Restore.inc_page(-1)
    },
    inc_page: function (c) {
        var b = parseInt($("page-num").innerHTML, 10);
        var a = b + c;
        $("page-num").update(a)
    },
    hide_next_link: function () {
        $("next-page").update()
    },
    show_next_link: function () {
        var b = new Element("a", {
            href: "#",
            onclick: "Restore.next(event, this); return false;"
        });
        b.update(_("Next") + " &raquo;");
        $("next-page").update(b)
    },
    show_prev_link: function () {
        var b = new Element("a", {
            href: "#",
            onclick: "Restore.prev(event, this); return false;"
        });
        b.update("&laquo; " + _("Prev"));
        $("prev-page").update(b)
    },
    hide_prev_link: function () {
        $("prev-page").update()
    }
};
var TabController = Class.create({
    initialize: function (c, b) {
        var a = $(c);
        assert(a, c + " is missing.");
        this.container = a;
        this.options = {
            killEvent: true
        };
        Object.extend(this.options, b);
        this.listen()
    },
    listen: function () {
        var a = this;
        this.container.select("a").each(function (b) {
            assert(b.id && b.id.length > 0, "Element is missing an id");
            b.observe("click", (function (c) {
                this.click(c, b)
            }).bindAsEventListener(a))
        })
    },
    click: function (a, b) {
        if (this.options.killEvent) {
            Event.stop(a)
        }
        this.toggle(b)
    },
    toggle: function (b) {
        var c = this.container.down("a.selected");
        if (c) {
            var f = $(c.id + "-content");
            if (f) {
                f.hide()
            }
        }
        this.container.select(".selected").invoke("removeClassName", "selected");
        var a = false;
        if (!b) {
            b = this.container.down("a");
            a = true
        }
        b.addClassName("selected");
        var e = $(b.id + "-content");
        if (e) {
            e.show()
        }
        if (this.options.onTabChange) {
            this.options.onTabChange(b, c)
        }
        if (this.options.url_prefix) {
            var d = this.options.url_prefix;
            if (!a) {
                d += "/" + b.id
            }
            DBHistory.push_state(d)
        }
    }
});
var Student = {
    show_domain_modal: function () {
        $("request_email").value = $F("student_email");
        $("request_desc").value = "";
        Modal.icon_show("page_white_edit_32", _("Add your school"), $("domain-request-modal"))
    }
};
var EmailVerification = {
    EMAIL_SENT_EVT: "db:verification_email_sent",
    send_email: function () {
        new Ajax.DBRequest("/sendverifyemail", {
            onSuccess: function () {
                $(document.body).fire(EmailVerification.EMAIL_SENT_EVT)
            }
        })
    },
    setup: function () {
        document.observe("dom:loaded", function () {
            $("send-email-link").observe("click", function (a) {
                a.preventDefault();
                EmailVerification.send_email()
            });
            $(document.body).observe(EmailVerification.EMAIL_SENT_EVT, function () {
                $("pre-resend").hide();
                $("post-resend").show();
                $("pre-resend-header").hide();
                $("post-resend-header").show()
            })
        })
    }
};
var EmailChange = {
    show_change_email_modal: function () {
        Modal.icon_show("email_add_32", _("Change email address"), $("change-email"), {}, false, 450)
    },
    submit_email_change: function (b) {
        var a = $("change-email-form");
        Forms.ajax_submit(a, false, function () {
            if (window.location.pathname.indexOf("/account") === 0) {
                window.location.reload()
            } else {
                window.location.href = "/home?send_verification_email=1"
            }
        }, false, $(b.target))
    }
};
var Bromo = {
    init: function () {
        Event.observe(window, "resize", Bromo.check_sizing);
        Event.observe(window, "load", Bromo.check_sizing)
    },
    check_sizing: function () {
        var e = $$(".bromo");
        if (!e.length) {
            return
        }
        var f = e[0];
        var a = 20;
        var d = $("page-sidebar");
        var c = d.cumulativeOffset().top + d.getLayout().get("height");
        f.show();
        var b = f.cumulativeOffset().top;
        if (c + a > b) {
            f.hide()
        }
    }
};

function DBPhoto(a) {
    a.preloaded = {};
    a.preload = function (b) {
        if (a.preloaded[b]) {
            return
        }
        b = b || "l";
        assert(b in a, "Photo doesn't have attr " + b);
        Util.preload_image(a[b]);
        a.preloaded[b] = true
    };
    a.load_thumb = function (b) {
        b.src = a.thumbnail
    };
    return a
}
var DBGallery = {
    size: "large",
    index: 0,
    playing: false,
    preloaded: false,
    thumb_width: 64,
    thumb_margin: 4,
    low_opacity: 0.6,
    photos: [],
    set_url_hash: true,
    container_id: "db_gallery_master_container",
    add_photos: function (a) {
        a.each(function (b) {
            DBGallery.photos.push(DBPhoto(b))
        })
    },
    set_hash: function () {
        if (DBGallery.set_url_hash) {
            HashRouter.set_hash.apply(this, $A(arguments))
        }
    },
    observe: function () {
        Event.observe(document.onresize ? document : window, "resize", DBGallery.resize);
        Event.observe(document.body, "mousewheel", DBGallery.wheel);
        Event.observe(document.body, "DOMMouseScroll", DBGallery.wheel);
        document.observe("keydown", DBGallery.key)
    },
    unobserve: function () {
        Event.stopObserving(document.onresize ? document : window, "resize", DBGallery.resize);
        Event.stopObserving(document.body, "mousewheel", DBGallery.wheel);
        Event.stopObserving(document.body, "DOMMouseScroll", DBGallery.wheel);
        document.stopObserving("keydown", DBGallery.key)
    },
    resize: function () {
        var a = $("gallery_main_cont"),
            d = document.viewport.getDimensions();
        a.style.height = d.height - 99 + "px";
        var c = $("gallery_main_photo");
        var b = d.height - 99 - 10;
        c.style.maxHeight = Math.max(b, 300) + "px";
        c.style.maxWidth = Math.max(d.width, 400) + "px"
    },
    key: function (b) {
        var a = BrowseKeys.getKey(b);
        switch (a) {
        case 27:
            DBGallery.hide();
            break;
        case 32:
            DBGallery.playpause();
            break;
        case 37:
            DBGallery.prev();
            break;
        case 39:
            DBGallery.next();
            break;
        case 75:
            DBGallery.prev();
            break;
        case 74:
            DBGallery.next();
            break
        }
    },
    wheel: function (a) {
        if (DBGallery.block_wheel) {
            return
        }
        DBGallery.block_wheel = 1;
        setTimeout(function () {
            DBGallery.block_wheel = 0
        }, 80);
        var b = 0;
        if (a.wheelDelta) {
            b = a.wheelDelta
        } else {
            if (a.detail) {
                b = -a.detail
            }
        }
        if (b > 0) {
            DBGallery.prev()
        } else {
            DBGallery.next()
        }
    },
    playpause: function () {
        if (DBGallery.playing) {
            DBGallery.pause()
        } else {
            DBGallery.play()
        }
    },
    play: function () {
        DBGallery.playing = true;
        DBGallery.interval = setInterval(function () {
            DBGallery.next(true)
        }, 5000);
        $("gallery_slideshow").__date(Sprite.html("white_pause")).__sert(_("Pause slideshow"))
    },
    pause: function () {
        DBGallery.playing = false;
        clearInterval(DBGallery.interval);
        $("gallery_slideshow").__date(Sprite.html("white_play")).__sert(_("Play slideshow"))
    },
    next: function (a) {
        var b = DBGallery.index + 1;
        if (b == DBGallery.photos.length) {
            return
        } else {
            DBGallery.select_photo(b, a)
        }
    },
    prev: function () {
        if (DBGallery.playing) {
            DBGallery.pause()
        }
        var a = DBGallery.index - 1;
        if (a == -1) {
            return
        } else {
            DBGallery.select_photo(a)
        }
    },
    select_photo: function (h, l) {
        h = parseInt(h, 10);
        if (!Util.isNumber(h)) {
            return
        }
        DBGallery.set_hash("gallery", "" + h);
        if (!l && DBGallery.playing) {
            DBGallery.pause()
        }
        DBGallery.index = h;
        if (!DBGallery.visible) {
            DBGallery.show(h)
        }
        var c = $$("#gallery_thumbs_container img.selected");
        if (c.length) {
            var b = c[0];
            b.setOpacity(DBGallery.low_opacity);
            b.removeClassName("selected")
        }
        var f = $$("#gallery_thumbs_container img")[h];
        assert(f, "Couldn't find img at index");
        f.setOpacity(1);
        f.addClassName("selected");
        DBGallery.render_mainphoto(h);
        DBGallery.resize();
        var a = $("gallery_thumbs_container");
        var g = -1 * h * (DBGallery.thumb_width + DBGallery.thumb_margin) - 39;
        if (DBGallery.slide_in) {
            DBGallery.slide_in.cancel()
        }
        if (Math.abs(g - parseInt(a.getStyle("margin-left"), 10)) > 1200) {
            a.style.marginLeft = g + "px"
        } else {
            DBGallery.slide_in = new Effect.Tween(a, parseInt(a.getStyle("margin-left"), 10), g, {
                duration: 0.3
            }, function (n) {
                a.style.marginLeft = n + "px"
            })
        }
        var k = a.select("img");
        assert(k.length == DBGallery.photos.length, "thumbslength != photoslength");
        var m = Math.ceil(document.viewport.getDimensions().width / DBGallery.thumb_width);
        m += m % 2;
        for (var d = Math.max(0, h - m / 2); d < Math.min(DBGallery.photos.length, h + m / 2); d += 1) {
            DBGallery.photos[d].load_thumb(k[d])
        }
        for (var e = h; e < h + 10; e += 1) {
            if (e == DBGallery.photos.length) {
                break
            }
            DBGallery.photos[e].preload(DBGallery.size)
        }
    },
    update_container_top: function (a) {
        a = a || $(DBGallery.container_id);
        if (a) {
            a.style.top = document.viewport.getScrollOffsets()[1] + "px"
        }
    },
    show: function (b) {
        assert(!DBGallery.visible, "Tried to show a gallery when it was already up");
        if (document.viewport.getDimensions().height > 768) {
            DBGallery.size = "extralarge"
        } else {
            DBGallery.size = "large"
        }
        DBGallery.visible = true;
        b = b || DBGallery.index;
        assert(DBGallery.photos.length, "No photos in the photo gallery");
        var a = new Element("div", {
            id: DBGallery.container_id
        });
        DBGallery.update_container_top(a);
        DBGallery.update_top_interval = setInterval(function () {
            DBGallery.update_container_top()
        }, 200);
        document.body.appendChild(a);
        DBGallery.observe();
        DBGallery.render_backdrop(a);
        DBGallery.render_filmstrip(a);
        DBGallery.render_submenu(a);
        DBGallery.render_bottom_menu(b, a)
    },
    hide: function (a) {
        if (a) {
            Event.stop(a)
        }
        assert(DBGallery.visible, "Tried to hide a gallery when it was already hidden");
        DBGallery.visible = false;
        DBGallery.pause();
        DBGallery.unobserve();
        DBGallery.hide_backdrop();
        DBGallery.hide_filmstrip();
        DBGallery.hide_bottom_menu();
        DBGallery.hide_mainphoto();
        $(DBGallery.container_id).remove();
        DBGallery.set_hash();
        clearInterval(DBGallery.update_top_interval)
    },
    render_backdrop: function (a) {
        var c = "body";
        if (Prototype.Browser.IE) {
            c = "html, body"
        }
        $$(c).invoke("addClassName", "full_no_overflow");
        var b = new Element("div", {
            id: "gallery_backdrop"
        });
        b.setOpacity(0.8);
        a.insert(b)
    },
    hide_backdrop: function () {
        $$(".full_no_overflow").invoke("removeClassName", "full_no_overflow");
        $("gallery_backdrop").remove()
    },
    render_filmstrip: function (a) {
        var d = new Element("div", {
            id: "gallery_filmstrip"
        });
        var g = document.createDocumentFragment();
        g.appendChild(d);
        var h = new Element("div", {
            id: "gallery_filmstrip_backdrop"
        });
        h.setOpacity(0.5);
        g.appendChild(h);
        var b = new Element("div", {
            id: "gallery_thumbs_container"
        });
        var e = 0;
        DBGallery.photos.each(function (m) {
            var l = new Element("img", {
                title: m.filename,
                src: "/static/images/icons/icon_spacer.gif"
            });
            l.setOpacity(DBGallery.low_opacity);
            l.observe("mouseover", function (n) {
                new Effect.Opacity(l, {
                    to: 1,
                    duration: 0.1
                })
            });
            l.observe("mouseout", function (n) {
                if (!l.hasClassName("selected")) {
                    new Effect.Opacity(l, {
                        to: DBGallery.low_opacity,
                        duration: 0.1
                    })
                }
            });
            l.observe("click", (function (n) {
                return function () {
                    DBGallery.select_photo(n)
                }
            })(e));
            b.appendChild(l);
            e += 1
        });
        var c = new Element("div", {
            id: "gallery_selected_frame"
        });
        var f = new Element("a", {
            id: "gallery_close",
            href: "#",
            style: "top: 120px; right: 10px;"
        });
        var k = new Element("img", {
            src: "/static/images/photos_x.png"
        });
        f.insert(k);
        f.observe("click", DBGallery.hide);
        g.appendChild(f);
        g.appendChild(c);
        g.appendChild(b);
        a.appendChild(g)
    },
    render_submenu: function (a) {
        var d = new Element("div", {
            id: "gallery_sub_menu"
        });
        var e = new Element("div", {
            id: "gallery_index_text"
        });
        var c = new Element("div", {
            id: "gallery_filename_text"
        });
        var b = new Element("a", {
            id: "gallery_slideshow"
        });
        b.observe("click", DBGallery.playpause);
        d.insert(b);
        d.insert(e);
        d.insert(c);
        a.appendChild(d);
        DBGallery.pause()
    },
    render_bottom_menu: function (d, b) {
        var c = new Element("div", {
            id: "gallery_bottom_menu"
        });
        var a = new Element("a", {
            id: "gallery_full_size"
        });
        a.__date(Sprite.html("arrow_out_black")).__sert(_("Full size"));
        var e = new Element("a", {
            id: "gallery_save"
        });
        e.__date(Sprite.html("picture_save")).__sert(_("Save"));
        c.insert(a);
        c.insert(e);
        b.appendChild(c)
    },
    update_bottom_menu: function (b) {
        var a = DBGallery.photos[b];
        $("gallery_full_size").href = a.original;
        $("gallery_save").href = a.original + "?dl_name=" + Util.urlquote(a.filename)
    },
    hide_bottom_menu: function () {
        $("gallery_bottom_menu").remove()
    },
    hide_filmstrip: function () {
        $("gallery_filmstrip").remove();
        $("gallery_filmstrip_backdrop").remove();
        $("gallery_thumbs_container").remove();
        $("gallery_selected_frame").remove();
        $("gallery_close").remove();
        $("gallery_sub_menu").remove()
    },
    render_mainphoto: function (f, b) {
        b = b || $(DBGallery.container_id);
        var e = DBGallery.photos[f];
        var c = Util.get_preloaded_image(e[DBGallery.size]);
        c.id = "gallery_main_photo";
        c.title = e.filename;
        c.stopObserving("click");
        c.observe("click", function (l) {
            Event.stop(l);
            if (e.video_url) {
                DBGallery.pause();
                $("gallery_main_photo_td").update("");
                var k = DBGallery.size == "extralarge" ? 1024 : 640;
                Util.embed_flash_video(e.video_url, "gallery_main_photo_td", k, 1)
            } else {
                DBGallery.next()
            }
        });
        if (!$("gallery_main_cont")) {
            var a = new Element("table", {
                id: "gallery_main_cont"
            });
            a.observe("click", DBGallery.hide);
            var d = new Element("tbody");
            a.insert(d);
            var g = new Element("tr");
            d.insert(g);
            var h = new Element("td");
            h.id = "gallery_main_photo_td";
            g.insert(h);
            h.insert(c);
            b.appendChild(a)
        } else {
            $("gallery_main_cont").down("td").update(c)
        }
        DBGallery.update_sub_menu(f);
        DBGallery.update_bottom_menu(f)
    },
    update_sub_menu: function (a) {
        $("gallery_index_text").update(a + 1 + " of " + DBGallery.photos.length);
        $("gallery_filename_text").update(DBGallery.photos[a].filename.escapeHTML())
    },
    hide_mainphoto: function () {
        $("gallery_main_cont").remove()
    }
};
var Sort, FileSearch, ContextMenu, BrowseKeys, BrowseURL, BrowseFile, BrowseActions, BrowseActionsBasic, BrowseActionsContext, BrowseSelection, Browse, BrowseClipboard, BrowseJump, BrowseDrag, BrowseScroll, FlexColumn, GlobalActions, GlobalActionsBasic, GlobalActionsContext;
var EXTENSION_TO_CATEGORY = {};
var _CATEGORIES = {
    IMAGE: "ai bmp cr2 eps gif ico jpeg jpg nef png psd tif tiff",
    VIDEO: "avi dv flv m4v mkv mov mp4 mpg mts vob wmv",
    AUDIO: "aif flac m4a m4p mp3 ogg wav wma",
    DOCUMENT: "cdr csv doc docx fla indd keynote numbers otf pages pdf ppt pptx ps rtf swf txt wpd xls xlsx",
    COMPRESSED_FILE: "7z bz2 gz gzip rar tar zip",
    CODE: "ccp cs css cxx h html java js php py rb vs xml",
    DISK_IMAGE: "dmg iso",
    EXECUTABLE: "exe",
    SHORTCUT: "lnk",
    LINK: "url webloc",
    FONT: "ttf"
};
var CATEGORY_TO_TRANSLATION = {
    FILE: _("file"),
    FOLDER: _("folder"),
    SHARED_FOLDER: _("shared folder"),
    PUBLIC_FOLDER: _("folder"),
    PHOTOS_FOLDER: _("folder"),
    IMAGE: _("image"),
    VIDEO: _("video"),
    AUDIO: _("audio"),
    DOCUMENT: _("document"),
    COMPRESSED_FILE: _("archive"),
    CODE: _("code"),
    DISK_IMAGE: _("disk image"),
    EXECUTABLE: _("executable"),
    SHORTCUT: _("shortcut"),
    LINK: _("link"),
    FONT: _("font"),
    SANDBOX: _("app folder")
};
var CATEGORY_TO_DELETED_TRANSLATION = {
    FILE: _("deleted file"),
    FOLDER: _("deleted folder"),
    SHARED_FOLDER: _("deleted shared folder"),
    PUBLIC_FOLDER: _("deleted folder"),
    PHOTOS_FOLDER: _("deleted folder"),
    IMAGE: _("deleted image"),
    VIDEO: _("deleted video"),
    AUDIO: _("deleted audio"),
    DOCUMENT: _("deleted document"),
    COMPRESSED_FILE: _("deleted archive"),
    CODE: _("deleted code"),
    DISK_IMAGE: _("deleted disk image"),
    EXECUTABLE: _("deleted executable"),
    SHORTCUT: _("deleted shortcut"),
    LINK: _("deleted link"),
    FONT: _("deleted font"),
    SANDBOX: _("deleted app folder")
};
for (var category in _CATEGORIES) {
    if (_CATEGORIES.hasOwnProperty(category)) {
        var extension_list = _CATEGORIES[category].split(" ");
        for (var i = 0, j = extension_list.length; i < j; i++) {
            EXTENSION_TO_CATEGORY[extension_list[i]] = category
        }
    }
}
var BrowseUtil = {
    make_folder_browsefile: function (a) {
        assert(a.is_dir, "make_folder_browsefile expects directory props");
        a.ago = "";
        a.ts = 0;
        return new BrowseFile(a)
    },
    make_file_browsefile: function (a) {
        assert(!a.is_dir, "make_folder_browsefile expects non-directory props");
        a.target_ns = false;
        return new BrowseFile(a)
    },
    unpack_file_info: function (a) {
        return {
            is_dir: a[0],
            type: a[1],
            ns_id: a[2],
            ns_path: a[3],
            fq_path: a[4],
            target_ns: a[5],
            icon: a[6],
            thumbnail_url_tmpl: a[7],
            href: a[8],
            bytes: a[9],
            size: a[10],
            ts: a[11],
            ago: a[12],
            hash: a[13],
            tkey: a[14],
            sort_rank: a[15],
            sort_key: Util.decode_sort_key(a[16]),
            sjid: a[17],
            last_modified_fname: a[18],
            preview_type: a[19]
        }
    },
    filepreview_from_selected: function (d) {
        if (!d) {
            var c = BrowseSelection.get_selected_files();
            d = c && c.first()
        }
        var a = BrowseUtil.browsefile_to_filepreview(Browse.files);
        if (a.length) {
            var e = 0;
            if (d) {
                for (var b = 0; b < a.length; b += 1) {
                    if (a[b].filename == d.filename) {
                        e = b
                    }
                }
            }
            FilePreviewModal.init(a, {
                start_index: e,
                include_delete: true,
                keep_url: false
            })
        }
    },
    browsefile_to_filepreview: function (b) {
        var a = [];
        b.each(function (c) {
            if (c.bytes < 0 || c.dir) {
                return
            }
            if (c.preview_type == "photo" && c.thumbnail_url_tmpl) {
                a.push(new PhotoPreview(c.filename, c.fq_path, c.thumbnail_url_tmpl, c.href + "&dl=1", c.href))
            } else {
                if (c.preview_type == "video" && c.thumbnail_url_tmpl && !Constants.DISABLE_VIDEOS_IN_LIGHTBOX) {
                    a.push(new VideoPreview(c.filename, c.fq_path, c.thumbnail_url_tmpl, c.video_transcode_url(), c.href + "&dl=1"))
                }
            }
        });
        return a
    },
    profile_files: function (a) {
        var d = {
            files: 0,
            folders: 0,
            shared_folders: 0,
            deleted: 0,
            public_folder: 0,
            photos_folder: 0,
            rejoinables: 0,
            sandboxes: 0,
            target_namespaces: 0
        };
        for (var c = 0; c < a.length; c += 1) {
            var b = a[c];
            if (b.dir) {
                d.folders += 1
            } else {
                d.files += 1
            }
            if (b.is_sandbox()) {
                d.sandboxes += 1
            }
            if (b.is_share()) {
                d.shared_folders += 1
            }
            if (b.bytes == -1) {
                d.deleted += 1
            }
            if (b.fq_path == "/Public") {
                d.public_folder = 1
            } else {
                if (b.fq_path == "/Photos") {
                    d.photos_folder = 1
                }
            }
            if (b.target_ns) {
                d.target_namespaces += 1
            }
        }
        return d
    },
    profile_summary: function (b) {
        var c = ungettext("%d file", "%d files", b.files).format(b.files);
        var a = ungettext("%d folder", "%d folders", b.folders).format(b.folders);
        if (b.files && b.folders) {
            return _("%(x_files)s and %(y_folders)s").format({
                x_files: c,
                y_folders: a
            })
        } else {
            if (b.files) {
                return c
            } else {
                if (b.folders) {
                    return a
                } else {
                    return ""
                }
            }
        }
    },
    BROWSE_MODE: "browse",
    SEARCH_MODE: "search",
    SPECIAL_MODES: ["search"],
    set_browse_mode: function () {
        BrowseUtil.SPECIAL_MODES.each(function (a) {
            $("browse").removeClassName(a);
            $("browse-root-actions").removeClassName(a);
            $("browse-sort").removeClassName(a)
        });
        $("browse-sort").removeClassName("cathywu");
        $("browse-root-actions").removeClassName("cathywu")
    },
    set_special_mode: function (a) {
        assert(BrowseUtil.SPECIAL_MODES.indexOf(a) != -1);
        if ($("browse").hasClassName(a)) {
            assert($("browse-root-actions").hasClassName(a));
            assert($("browse-sort").hasClassName(a));
            return
        }
        BrowseUtil.SPECIAL_MODES.each(function (b) {
            if (b != a) {
                $("browse").removeClassName(b);
                $("browse-root-actions").removeClassName(b);
                $("browse-sort").removeClassName(b)
            }
        });
        $("browse").addClassName(a);
        $("browse-root-actions").addClassName(a);
        $("browse-sort").addClassName(a);
        if (a === BrowseUtil.SEARCH_MODE) {
            $("browse-sort").addClassName("cathywu");
            $("browse-root-actions").addClassName("cathywu")
        }
    },
    get_mode: function () {
        var a = BrowseUtil.BROWSE_MODE;
        BrowseUtil.SPECIAL_MODES.each(function (b) {
            if ($("browse").hasClassName(b)) {
                a = b
            }
        });
        return a
    },
    load_visible_thumbs: function () {
        var f, e, c;
        var b = BrowseUtil.get_files_in_view();
        var g = b[1] - b[0];
        var h, a;
        h = [Math.max(b[0] - g, 0), b[0]];
        a = [Math.min(b[1], Browse.files.length), Math.min(b[1] + g, Browse.files.length)];
        var d = Util.calc_thumb_prep_size();
        [b, a, h].each(function (k) {
            for (f = k[0], e = k[1]; f < e; f++) {
                c = Browse.files[f].get_div().down("img");
                Util.thumb_load(c, d)
            }
        })
    },
    get_files_in_view: function () {
        var b, a;
        var f = document.viewport.getHeight();
        var e = document.viewport.getScrollOffsets().top;
        var c = BrowseUtil._get_top_file_y_offset();
        var d = BrowseUtil._get_elm_height();
        if (!c || !d) {
            return [0, Browse.files.length]
        }
        b = Math.floor((e - c) / d);
        b = Math.max(b, 0);
        a = b + Math.ceil(f / d);
        a = Math.min(a, Browse.files.length);
        return [b, a]
    },
    _get_top_file_y_offset: function () {
        if (Browse.files.length === 0) {
            return null
        }
        return Browse.files[0].get_div().cumulativeOffset().top
    },
    _get_elm_height: function () {
        if (Browse.files.length < 3) {
            return null
        }
        var a = Browse.files[1].get_div();
        return a.getLayout().get("margin-box-height")
    }
};
Sort = function () {
    var d = function (k) {
            var h = k ? 1 : -1;
            return function (l, m) {
                return h * Util.sort_by_rank_or_key(l, m)
            }
        };
    var f = function (k) {
            var h = k ? 1 : -1;
            return function (l, m) {
                if (l.bytes > m.bytes) {
                    return h
                } else {
                    if (l.bytes < m.bytes) {
                        return -h
                    } else {
                        return h * Sort.FILES_BY_NAME(l, m)
                    }
                }
            }
        };
    var g = function (k) {
            var h = k ? 1 : -1;
            return function (l, m) {
                return h * (l.fq_path.toLowerCase() > m.fq_path.toLowerCase() ? 1 : -1)
            }
        };
    var a = function (k) {
            var h = k ? 1 : -1;
            return function (m, n) {
                var l = m.ts == n.ts ? 0 : (m.ts > n.ts ? 1 : -1);
                return h * l
            }
        };
    var c = function (h) {
            return function (m) {
                var l = h(m);
                var k = d(true);
                return function (n, o) {
                    if (n.dir ^ o.dir) {
                        return (n.dir ? 1 : 0) - (o.dir ? 1 : 0)
                    } else {
                        return l(n, o) || k(n, o)
                    }
                }
            }
        };
    var e = function (h) {
            return function (m) {
                if (!Sort.FOLDERS_FIRST) {
                    return h(m)
                }
                var l = h(m);
                var k = m ? 1 : -1;
                return function (n, o) {
                    if (n.dir ^ o.dir) {
                        return k * ((n.dir ? 0 : 1) - (o.dir ? 0 : 1))
                    } else {
                        return l(n, o)
                    }
                }
            }
        };
    var b = function (h) {
            return function (m) {
                var l = Sort.FILES_BY_NAME(m);
                var k = m ? 1 : -1;
                return function (o, p) {
                    if (o.is_deleted ^ p.is_deleted) {
                        return (o.is_deleted ? 1 : 0) - (p.is_deleted ? 1 : 0)
                    }
                    var n;
                    if (h) {
                        if (o.get_category() !== p.get_category()) {
                            n = o.get_category() < p.get_category() ? -1 : 1
                        } else {
                            if (o.get_extension() !== p.get_extension()) {
                                n = o.get_extension() < p.get_extension() ? -1 : 1
                            }
                        }
                    } else {
                        if (o.get_extension() !== p.get_extension()) {
                            n = o.get_extension() < p.get_extension() ? -1 : 1
                        } else {
                            if (o.get_category() !== p.get_category()) {
                                n = o.get_category() < p.get_category() ? -1 : 1
                            }
                        }
                    }
                    return (k * n) || l(o, p)
                }
            }
        };
    return {
        FILES_BY_NAME: e(d),
        FILES_BY_SIZE: c(f),
        FILES_BY_LOCATION: c(g),
        FILES_BY_KIND: c(b(true)),
        FILES_BY_EXTENSION: c(b(false)),
        FILES_BY_MODIFIED: c(a),
        FOLDERS_FIRST: !Util.is_mac()
    }
}();
FlexColumn = (function () {
    var h = [
        ["FILES_BY_KIND", Sort.FILES_BY_KIND, _("Kind"), true],
        ["FILES_BY_EXTENSION", Sort.FILES_BY_EXTENSION, _("Extension"), true],
        ["FILES_BY_SIZE", Sort.FILES_BY_SIZE, _("Size"), false]
    ];
    var e = {},
        a = {},
        d = [],
        g = [];
    for (var c = 0; c < h.length; c += 1) {
        var f = h[c];
        var b = f[0];
        d.push(f[1]);
        e[b] = f[2];
        a[b] = f[3];
        g.push(b)
    }
    return {
        SORT_FUNCTIONS: d,
        DISPLAY: e,
        IS_ASC: a,
        LABELS: g
    }
})();
FileSearch = {
    MAX_RESULTS: 100,
    SHORT_PREFIX_LEN: 2,
    SHORT_PREFIX_DELAY_TIME: 250,
    _cache: {},
    _cache_ts: {},
    CACHE_TIME: 60000,
    last_state: false,
    last_ns_id: null,
    last_ns_path: null,
    init: function () {
        var b = $("browse-search");
        var a = $("browse-search-input");
        SickInput.add_interval_handler(b, FileSearch.search_with_delay);
        $("advanced-search-box").observe("submit", function (c) {
            FileSearch.search();
            Event.stop(c)
        });
        $("exit-search-xclose").observe("click", FileSearch.exit_search);
        key("/", Browse.KEY_SCOPE, function () {
            if (BrowseJump.is_active()) {
                return
            }
            if (!b.hasClassName("focused")) {
                a.focus();
                return false
            }
        });
        key("escape", Browse.KEY_SCOPE, function () {
            if (Browse.in_search_mode()) {
                FileSearch.exit_search();
                return false
            }
            if (a.getValue().strip() === "") {
                a.blur();
                return false
            }
        });
        key("tab", Browse.KEY_SCOPE, function (c) {
            if (document.activeElement == a) {
                c.preventDefault();
                a.blur();
                if (Browse.files.length) {
                    BrowseSelection.set_selected_files(Browse.files[0])
                } else {
                    if (Browse.in_search_mode()) {
                        FileSearch.toggle_advanced()
                    }
                }
                return false
            }
        });
        document.body.on("click", "#advanced-search-link, #advanced-search-exit, #advanced-search-cancel", FileSearch.toggle_advanced);
        document.observe(FileEvents.RENAME, FileSearch.clear_cache);
        [FileEvents.DELETE, FileEvents.COPY, FileEvents.MOVE, FileEvents.PURGE, FileEvents.RESTORE, FileEvents.UPLOAD, FileEvents.SF_NEW, FileEvents.SF_LEAVE, FileEvents.SF_UNSHARE, FileEvents.SF_REJOIN, FileEvents.SF_IGNORE, FileEvents.LINKS_REMOVE].each(function (c) {
            document.observe(c, function (d) {
                if (!Browse.inside_dir) {
                    FileSearch.force_reload()
                }
            })
        })
    },
    get_state: function () {
        var a = {
            is_advanced: !$("browse-search").visible()
        };
        if (a.is_advanced) {
            ["all_terms", "any_terms", "excluded_terms", "exact"].each(function (c) {
                var b = $(c).getValue();
                if (b) {
                    a[c] = b
                }
            });
            a.include_files = $("include_files").checked;
            a.include_folders = $("include_folders").checked;
            a.include_deleted = $("include_deleted").checked
        } else {
            a.query_unnormalized = FileSearch.get_basic_query();
            a.query = a.query_unnormalized.toLowerCase().strip().split(/ +/).join(" ")
        }
        return a
    },
    set_state: function (a) {
        if (a.is_advanced) {
            ["all_terms", "any_terms", "excluded_terms", "exact"].each(function (b) {
                if (a[b]) {
                    $(b).setValue(a[b])
                }
            });
            $("include_files").checked = a.include_files;
            $("include_folders").checked = a.include_folders;
            $("include_deleted").checked = a.include_deleted;
            FileSearch.show_advanced();
            FileSearch.search()
        } else {
            FileSearch.set_basic_query(a.query_unnormalized);
            FileSearch.show_basic();
            FileSearch.search()
        }
    },
    state_changed: function () {
        var b = FileSearch.get_state();
        var a = FileSearch.last_state;
        if (a === false) {
            return !!b.query
        }
        return (b.is_advanced != a.is_advanced) || (b.query != a.query)
    },
    get_basic_query: function () {
        var a = $("browse-search-input");
        return a.getValue()
    },
    set_basic_query: function (a) {
        if (a === FileSearch.get_basic_query()) {
            return
        }
        $("browse-search-input").setValue(a);
        $("browse-search").show();
        $("advanced-search-link").__date(_("Advanced search"))
    },
    set_title: function () {
        var a = FileSearch.get_state();
        var b = _("Search - Dropbox");
        if (a.query) {
            b = a.query + " - " + b
        }
        document.title = b
    },
    _pending_search_q: "",
    search_with_delay: function () {
        var b = FileSearch.get_state();
        if (b.is_advanced) {
            return
        }
        var a = b.query;
        if (a.length === 0) {
            if (Browse.in_search_mode()) {
                FileSearch.search()
            }
            return
        }
        if (a.length <= FileSearch.SHORT_PREFIX_LEN) {
            if (a !== FileSearch._pending_search_q) {
                FileSearch._pending_search_q = a;
                clearTimeout(FileSearch._pending_search_timer);
                FileSearch._pending_search_timer = setTimeout(FileSearch.search, FileSearch.SHORT_PREFIX_DELAY_TIME)
            }
        } else {
            FileSearch._pending_search_q = "";
            if (FileSearch.state_changed()) {
                FileSearch.search()
            }
        }
    },
    search: function () {
        var a = FileSearch.get_state();
        var b = "" === FileSearch.get_basic_query();
        if (!a.is_advanced && b) {
            if (Browse.in_search_mode()) {
                FileSearch._clear_on_reload = false;
                FileSearch.exit_search()
            }
            return
        }
        FileSearch.last_state = a;
        FileSearch._clear_on_reload = true;
        if (!Browse.in_search_mode()) {
            BrowseSelection.deselect_all();
            Browse.clear();
            BrowseUtil.set_special_mode("search")
        }
        if (Browse.inside_dir) {
            FileSearch.last_ns_id = Browse.containing_ns_id();
            FileSearch.last_ns_path = Browse.containing_ns_path();
            DBHistory.push_state("/search")
        }
        FileSearch._prune_cache();
        FileSearch.set_title();
        if (a.is_advanced) {
            FileSearch.ask_server_advanced()
        } else {
            if (a.query in FileSearch._cache) {
                FileSearch.update_results()
            } else {
                if (!FileSearch.attempt_cache_filter()) {
                    FileSearch.ask_server()
                }
            }
        }
        T("search")
    },
    _prune_cache: function () {
        var a = new Date();
        var b = [];
        Object.keys(FileSearch._cache_ts).each(function (c) {
            if (a - FileSearch._cache_ts[c] > FileSearch.CACHE_TIME) {
                b.push(c)
            }
        });
        b.each(function (c) {
            delete FileSearch._cache[c];
            delete FileSearch._cache_ts[c]
        })
    },
    show_empty: function () {
        $("search-empty").show();
        $(document.documentElement).removeClassName("earthrise")
    },
    hide_empty: function () {
        $("search-empty").hide();
        $(document.documentElement).addClassName("earthrise")
    },
    exit_search: function () {
        $$("#advanced-search-box .sick-input input").each(function (b) {
            b.setValue("");
            b.blur()
        });
        $("advanced-search-box").hide();
        $("browse").removeClassName("pending-search");
        FileSearch.hide_empty();
        var a = $("browse-search");
        a.show();
        Browse.reload(FileSearch.last_ns_id, Util.urlquote(FileSearch.last_ns_path), true)
    },
    clear_cache: function () {
        FileSearch._cache = {};
        FileSearch._cache_ts = {}
    },
    force_reload: function () {
        FileSearch.clear_cache();
        FileSearch.search()
    },
    ask_server: function () {
        var a = FileSearch.get_state();
        assert(!a.is_advanced, "expected to be in basic search mode");
        $("web-search-results").__date(_("Searching..."));
        $("browse").addClassName("pending-search");
        new Ajax.DBRequest("/ajax_search", {
            no_watch: true,
            evalJSON: false,
            parameters: {
                query: a.query
            },
            onSuccess: function (b) {
                if (!Browse.in_search_mode()) {
                    return
                }
                var c = Util.from_json(b.responseText);
                FileSearch._cache[a.query] = c;
                FileSearch._cache_ts[a.query] = new Date();
                if (!FileSearch.last_state.is_advanced && (FileSearch.last_state.query == a.query)) {
                    FileSearch.update_results()
                }
            },
            cleanUp: function () {
                $("browse").removeClassName("pending-search")
            }
        })
    },
    ask_server_advanced: function () {
        var a = FileSearch.get_state();
        assert(a.is_advanced, "expected to be in advanced search mode");
        assert(!a.query, "expected advanced search params only");
        delete a.is_advanced;
        $("web-search-results").__date(_("Searching..."));
        $("browse").addClassName("pending-search");
        new Ajax.DBRequest("/ajax_advanced_search", {
            no_watch: true,
            evalJSON: false,
            parameters: a,
            onSuccess: function (b) {
                if (!Browse.in_search_mode()) {
                    return
                }
                FileSearch.advanced_results = Util.from_json(b.responseText);
                FileSearch.update_results()
            },
            cleanUp: function (b) {
                $("browse").removeClassName("pending-search")
            }
        })
    },
    attempt_cache_filter: function () {
        var e = FileSearch.get_state().query;
        var d;
        var f = FileSearch._query_to_regex(e);
        var b = function (g) {
                return f.match(FileOps.filename(g[3]).toLowerCase())
            };
        for (var c = e.length - 1; c > 0; c--) {
            d = e.substr(0, c).strip();
            if (d in FileSearch._cache) {
                if (FileSearch._cache[d].file_info.length < FileSearch.MAX_RESULTS) {
                    var a = Object.clone(FileSearch._cache[d]);
                    a.file_info = a.file_info.findAll(b);
                    FileSearch.update_results(a);
                    return true
                } else {
                    return false
                }
            }
        }
        return false
    },
    _query_to_regex: function (a) {
        return new RegExp(RegExp.escape(a).split(/ +/).join(".*"))
    },
    update_results: function (b) {
        Browse.reset_state();
        Browse.reset_sort();
        var c = FileSearch.get_state();
        if (!b && c.is_advanced) {
            b = FileSearch.advanced_results
        }
        if (!b) {
            assert(FileSearch.last_state && !FileSearch.last_state.is_advanced, "the only way to get to advanced is through basic -- expected last_state to exist and not be advanced!");
            assert(FileSearch.last_state.query in FileSearch._cache, "update() called w/o a cache entry: q=" + FileSearch.last_state.query);
            b = FileSearch._cache[FileSearch.last_state.query]
        }
        Browse.update(b);
        var a = b.file_info.length;
        var e;
        if (a === 0) {
            e = _("No results")
        } else {
            e = ungettext("Search - %s result", "Search - %s results", b.file_info.length).format(a + (a >= FileSearch.MAX_RESULTS ? "+" : ""))
        }
        var d = c.is_advanced ? _("Basic search") : _("Advanced search");
        $("web-search-results").__date(e);
        $("advanced-search-link").__date(d);
        (Browse.files.length ? FileSearch.hide_empty : FileSearch.show_empty)()
    },
    show_advanced: function () {
        $("browse").addClassName("advanced-search");
        $("browse-search").hide();
        $("advanced-search-link").__date(_("Basic search"));
        $("advanced-search-box").show();
        $("all_terms").focus()
    },
    show_basic: function (a) {
        $("browse").removeClassName("advanced-search");
        $("advanced-search-box").hide();
        $("advanced-search-link").__date(_("Advanced search"));
        $("browse-search").show();
        if (!a) {
            $("browse-search-input").focus()
        }
    },
    toggle_advanced: function () {
        var b = $("advanced-search-link");
        b.toggleClassName("selected");
        if (b.hasClassName("selected")) {
            $("all_terms").setValue(FileSearch.get_basic_query());
            FileSearch.show_advanced()
        } else {
            var a = $("all_terms").getValue();
            if (a) {
                FileSearch.set_basic_query(a);
                FileSearch.show_basic()
            } else {
                FileSearch.exit_search()
            }
        }
    },
    history_change_handler: function () {
        if (!FileSearch.last_state) {
            BrowseURL.set_path_url(Constants.root_ns, "");
            return
        }
        if (FileSearch.state_changed()) {
            FileSearch.set_state(FileSearch.last_state)
        }
        key.setScope(Browse.KEY_SCOPE);
        if (BrowseSelection.get_selected_files().length) {
            var a = BrowseSelection.get_selected_files()[0].get_div();
            Browse.scrollToWithPadding(a, a.getHeight() * 2)
        }
    },
    clear_searchbox: function () {
        $("browse-search-input").setValue("")
    },
    warmup: function () {
        if (!FileSearch.warm) {
            new Ajax.DBRequest("/search/warmup");
            FileSearch.warm = true
        }
    }
};
BrowseKeys = {
    _handlers: {},
    init: function () {},
    init_advanced: function () {
        for (var a in BrowseKeys.advanced_dict) {
            var b = BrowseKeys.advanced_dict[a];
            key(b.key, Browse.KEY_SCOPE, b.onPress)
        }
        BrowseKeys.customize_chart();
        if (Util.is_mac() && Prototype.Browser.Gecko) {
            document.observe("keypress", function (c) {
                if (c.charCode === 63 && !Util.focus_in_input()) {
                    BrowseKeys.advanced_dict.help.onPress()
                }
            })
        }
    },
    getKey: function (a) {
        return a.keyCode || a.which || a.charCode
    },
    advanced_dict: {
        rename: {
            title: _("Rename selected files"),
            key: "f2",
            onPress: function (b, c) {
                var a = BrowseSelection.get_selected_files();
                if (0 < a.length) {
                    a.first().edit()
                }
            }
        },
        "delete": {
            title: _("Delete selected files"),
            key: "delete, command+backspace, backspace",
            onPress: function (d, f) {
                d.preventDefault();
                var c = BrowseSelection.get_selected_files();
                if (1 == c.length) {
                    var a = c.first();
                    if (a.is_deleted) {
                        FileOps.show_purge(a.fq_path, a.dir)
                    } else {
                        FileOps.show_delete(a.fq_path, a.dir)
                    }
                } else {
                    if (1 < c.length) {
                        var b = BrowseUtil.profile_files(c);
                        if (b.deleted === c.length) {
                            FileOps.show_bulk_purge(c)
                        } else {
                            if (b.deleted === 0) {
                                FileOps.show_bulk_delete(c)
                            }
                        }
                    }
                }
            }
        },
        help: {
            title: _("Show/hide keyboard shorcuts"),
            key: "shift+/, " + key.main_modifier() + "+/",
            onPress: function () {
                BrowseKeys.toggle_chart()
            }
        },
        close_help: {
            title: _("Hide keyboard shorcuts"),
            key: "escape",
            onPress: function () {
                BrowseKeys.hide_chart()
            }
        },
        up_dir: {
            title: _("Up a folder"),
            key: "left",
            onPress: function () {
                Browse.keyboard_nav = true;
                if (!Browse.reloading) {
                    if (Browse.inside_dir) {
                        var b, a;
                        if (!Browse.containing_ns_path() && Browse.containing_ns_id() != Constants.root_ns) {
                            b = Constants.root_ns;
                            a = Util.normalize(Util.parentDir(Browse.containing_fq_path()))
                        } else {
                            b = Browse.containing_ns_id();
                            a = Util.normalize(Util.parentDir(Browse.containing_ns_path()))
                        }
                        if (Browse.containing_ns_path() != a || Browse.containing_ns_id() != b) {
                            Browse.select_fq_paths = [Browse.containing_fq_path()];
                            BrowseURL.set_path_url(b, a)
                        } else {
                            BrowseSelection.flicker_selected()
                        }
                    } else {
                        BrowseSelection.flicker_selected()
                    }
                }
            }
        },
        open_file: {
            title: _("Open highlighted file"),
            key: "enter",
            onPress: function () {
                var b = BrowseSelection.get_selected_files();
                if (1 == b.length) {
                    var a = b[0];
                    if (a.dir) {
                        if (Browse.keyboard_nav) {
                            Browse.select_index = 0
                        }
                        Browse.open_folder(a)
                    } else {
                        if (a.preview_type) {
                            BrowseUtil.filepreview_from_selected(a)
                        } else {
                            window.open(a.href, "_blank")
                        }
                    }
                }
                return false
            }
        },
        open_dir: {
            title: _("Open highlighted folder"),
            key: "right",
            onPress: function () {
                Browse.keyboard_nav = true;
                var b = BrowseSelection.get_selected_files();
                if (1 == b.length) {
                    var a = b[0];
                    if (a.dir) {
                        Browse.select_index = 0;
                        Browse.open_folder(a)
                    } else {
                        BrowseSelection.flicker_selected()
                    }
                }
                return false
            }
        }
    },
    customize_chart: function () {
        var c = Util.is_mac() ? ".key-windows" : ".key-macos";
        var b = 0;
        var a;
        while (true) {
            a = $("keys-chart").down(c, b++);
            if (!a) {
                break
            }
            a.hide()
        }
    },
    toggle_chart: function () {
        if ($("keys-chart").style.display == "none") {
            BrowseKeys.show_chart()
        } else {
            BrowseKeys.hide_chart()
        }
    },
    show_chart: function () {
        var a = $("keys-chart");
        a.style.position = "fixed";
        var b = $("browse-sort");
        if (b.getStyle("display") === "none") {
            b = $("browse-root-actions")
        }
        a.clonePosition(b, {
            setHeight: false
        });
        a.style.top = b.cumulativeOffset()[1] + b.getHeight() + "px";
        a.setOpacity(0.85);
        a.show()
    },
    hide_chart: function () {
        $("keys-chart").hide()
    }
};
BrowseURL = {
    _DEFAULTS: {
        d: false
    },
    get_path: function () {
        var a = DBHistory.deconstruct_url().path;
        return a
    },
    _get_helper: function (a) {
        var b = DBHistory.deconstruct_url().qargs;
        if (a in b) {
            return b[a]
        }
        assert(a in this._DEFAULTS, "bad query param in BrowseURL");
        return this._DEFAULTS[a]
    },
    get_del: function () {
        return this._get_helper("d")
    },
    ns_to_fq_path: function (a, c) {
        if (a != Constants.root_ns && !(a in Browse.ns_id_to_mount_point)) {
            a = Constants.root_ns
        }
        if (a == Constants.root_ns) {
            return c
        } else {
            var b = Browse.ns_id_to_mount_point[a];
            return b + c
        }
    },
    _make_url: function (a, f, e) {
        if (!a) {
            a = Constants.root_ns
        } else {
            assert(typeof (a) === "number", "expected ns_id as a number")
        }
        assert(typeof (f) === "string", "expected explicit ns_path string");
        e = e || {};
        var d = BrowseURL.ns_to_fq_path(a, f);
        var c = "/home" + Util.urlquote(d);
        var b = DBHistory.deconstruct_url().qargs;
        var g;
        for (g in e) {
            if (e.hasOwnProperty(g)) {
                if (g in this._DEFAULTS && e[g] != this._DEFAULTS[g]) {
                    b[g] = e[g]
                }
            }
        }
        for (g in b) {
            if (b.hasOwnProperty(g)) {
                if (!(g in this._DEFAULTS)) {
                    delete b[g]
                }
            }
        }
        return DBHistory.construct_url(c, b)
    },
    set_path_url: function (a, f, d) {
        if (!a) {
            a = Constants.root_ns
        } else {
            var c = parseInt(a, 10);
            if (!isNaN(c)) {
                a = c
            } else {
                a = Constants.root_ns
            }
        }
        f = Util.normalize(f);
        var b;
        if (d === undefined) {
            b = BrowseURL._make_url(a, f)
        } else {
            b = BrowseURL._make_url(a, f, {
                d: d ? 1 : 0
            })
        }
        var e = DBHistory.deconstruct_url(b);
        DBHistory.push_state(e.path, e.qargs)
    },
    set_del_url: function (a) {
        var b = DBHistory.deconstruct_url();
        var c = b.path;
        var d = b.qargs;
        if (a) {
            d.d = 1
        } else {
            delete d.d
        }
        DBHistory.push_state(c, d)
    },
    _first_load: true,
    _last_path: null,
    _last_qargs: null,
    history_change_handler: function (f, h) {
        key.setScope(Browse.KEY_SCOPE);
        f = Util.normalize(f);
        var a = h.ns;
        var e = BrowseURL._last_path;
        var c = BrowseURL._last_qargs && BrowseURL._last_qargs.ns;
        var b = false;
        if (!BrowseURL._first_load) {
            b = !Browse.inside_dir || f != e || a != c
        }
        var d = false;
        if ((h.d == "1") != Browse.deleted_shown) {
            d = 1;
            Browse.deleted_shown = h.d == "1" ? 1 : 0
        }
        if (BrowseURL._first_load || b || d) {
            Browse.reload(a, f, true)
        }
        FileSearch.show_basic(true);
        BrowseURL._first_load = false;
        BrowseURL._last_path = f;
        BrowseURL._last_qargs = h;
        if (BrowseSelection.get_selected_files().length) {
            var g = BrowseSelection.get_selected_files()[0].get_div();
            if (g) {
                Browse.scrollToWithPadding(g, g.getHeight() * 2)
            }
        }
    },
    parse_b2_hash: function (e) {
        var c = e.split(":");
        if (c.length !== 4) {
            return false
        }
        var d = c[0],
            b = c[2] == "1",
            a = c[3];
        var f = !a || Util.isNumber(a);
        if (!f) {
            return false
        }
        a = parseInt(a, 10) || Constants.root_ns;
        return {
            ns_id: a,
            ns_path: d,
            deleted: b
        }
    }
};
var FileTypes = {
    FILE: 1,
    FOLDER: 2,
    PACKAGE: 3,
    SHARED_FOLDER: 4,
    SANDBOX: 5
};
var BROWSE_SNIPPET_LEN = 25;
var SEARCH_SNIPPET_LEN = 20;
var LAST_MODIFIED_FNAME_SNIPPET = 5;
BrowseFile = Class.create({
    initialize: function (b) {
        var c = Browse.inside_dir ? BROWSE_SNIPPET_LEN : SEARCH_SNIPPET_LEN;
        var a = FileOps.filename(b.fq_path);
        this.icon = b.icon;
        this.filename = a;
        this.caption = a.em_snippet(c);
        this.ns_id = b.ns_id;
        this.ns_path = b.ns_path;
        this.fq_path = b.fq_path;
        this.hash = b.hash;
        this.href = b.href;
        this.size = b.size != "None" ? b.size : "";
        this.bytes = b.bytes;
        this.is_deleted = this.bytes == -1;
        this.ago = b.ago;
        this.ts = b.ts;
        this.selected = false;
        this.dir = b.is_dir ? 1 : 0;
        this.tkey = b.tkey;
        this.target_ns = b.target_ns;
        this.sort_rank = b.sort_rank || 0;
        this.sort_key = b.sort_key || [""];
        this.sjid = b.sjid;
        this.thumbnail_url_tmpl = b.thumbnail_url_tmpl;
        this.thumbnail = b.thumbnail_url_tmpl ? b.thumbnail_url_tmpl + "?size=32bf" : null;
        this.type = b.type;
        this.preview_type = b.preview_type;
        if (b.last_modified_fname) {
            this.last_modified_fname = b.last_modified_fname.em_snippet(LAST_MODIFIED_FNAME_SNIPPET)
        }
        Browse.add_file(this);
        BrowseFile._file_index[this.to_key()] = this
    },
    is_share: function () {
        return this.type == FileTypes.SHARED_FOLDER
    },
    is_sandbox: function () {
        return this.type == FileTypes.SANDBOX
    },
    actions: function () {
        if (this._actions) {
            return this._actions
        }
        return null
    },
    video_transcode_url: function () {
        assert(this.fq_path, "video_transcode_url: expected a non-root fq_path");
        return "https://" + Constants.LIVE_TRANSCODE_SERVER + "/transcode_video/w/" + this.hash + Util.urlquote(this.fq_path)
    },
    get_div: function () {
        return $("f_" + this.to_key())
    },
    rename: function (e, d, h, a, b) {
        var c = Browse.inside_dir ? BROWSE_SNIPPET_LEN : SEARCH_SNIPPET_LEN;
        var g = this.fq_path;
        this.filename = FileOps.filename(e);
        this.caption = this.filename.em_snippet(c);
        this.fq_path = e;
        this.ns_path = d;
        this.hash = h;
        this.sort_key = a;
        this.sort_rank = undefined;
        this.last_modified_fname = null;
        if (!this.dir) {
            var f = this.href.split("/");
            f[f.length - 1] = Util.urlquote(this.filename) + "?w=" + h;
            this.href = f.join("/");
            this.icon = b
        } else {
            this.href = "/home" + Util.urlquote(e)
        }
        Browse.update_file_pos(this);
        document.fire(FileEvents.RENAME, {
            old_fq_path: g,
            file: this
        })
    },
    edit: function () {
        this.editing = true;
        Browse.selectable();
        var b = function (d) {
                var h = d.responseText.evalJSON(true);
                var g = h.fq_path;
                var c = h.hash;
                var k = Util.decode_sort_key(h.sort_key.evalJSON());
                var f = h.icon;
                var e = h.ns_path;
                this.rename(g, e, c, k, f);
                BrowseSelection.set_selected_files([this]);
                this.get_div().smoothScrollIntoView();
                BrowseUtil.load_visible_thumbs()
            };
        var a = new Ajax.InPlaceEditor(this.get_div().down(".filename a"), "/cmd/rename" + Util.urlquote(this.fq_path) + "?long_running", {
            htmlResponse: false,
            okControl: false,
            cancelControl: false,
            highlightColor: "transparent",
            highlightEndColor: "transparent",
            clickToEditText: "",
            cols: 25,
            ajaxClass: Ajax.DBRequest,
            submitOnBlur: true,
            initialText: this.filename,
            cancelIfSame: true,
            clickToEdit: false,
            onComplete: function () {
                this.editing = false
            }.bind(this),
            onFailure: function () {},
            savingText: _("Saving..."),
            ajaxOptions: {
                method: "POST",
                onSuccess: b.bind(this),
                onUninitialized: Browse.unselectable
            },
            callback: function (c, d) {
                return {
                    to_path: d || "",
                    folder: this.dir ? "yes" : ""
                }
            }.bind(this)
        });
        a.enterEditMode()
    },
    to_key: function () {
        return this.ns_id + "_" + this.sjid
    },
    get_category: function () {
        var b;
        if (this.dir) {
            if (Browse.inside_dir && Browse.containing_fq_path() === "") {
                if (this.filename.toLowerCase() === "public") {
                    b = "PUBLIC_FOLDER"
                }
                if (this.filename.toLowerCase() === "photos") {
                    b = "PHOTOS_FOLDER"
                }
            }
            if (!b) {
                if (this.type == FileTypes.FOLDER) {
                    b = "FOLDER"
                } else {
                    if (this.type == FileTypes.PACKAGE) {
                        b = "FOLDER"
                    } else {
                        if (this.type == FileTypes.SHARED_FOLDER) {
                            b = "SHARED_FOLDER"
                        } else {
                            if (this.type == FileTypes.SANDBOX) {
                                b = "SANDBOX"
                            } else {
                                if (this.target_ns) {
                                    b = "SHARED_FOLDER"
                                } else {
                                    b = "FOLDER"
                                }
                            }
                        }
                    }
                }
            }
        } else {
            b = EXTENSION_TO_CATEGORY[this.get_extension()] || "FILE"
        }
        var a;
        if (this.is_deleted) {
            a = CATEGORY_TO_DELETED_TRANSLATION[b];
            assert(a, "CATEGORY MISSING FOR " + b);
            return a
        } else {
            a = CATEGORY_TO_TRANSLATION[b];
            assert(a, "CATEGORY MISSING FOR " + b);
            return a
        }
    },
    get_extension: function () {
        if (this.dir || this.filename.indexOf(".") === -1) {
            return null
        }
        return FileOps.file_extension(this.filename).toLowerCase()
    },
    get_kind_snippet: function () {
        var a = this.get_category();
        var b = this.get_extension();
        if (b) {
            return "%s (%s)".format(a, b)
        } else {
            return a
        }
    }
});
BrowseFile._file_index = {};
BrowseFile.from_elem = function (b) {
    if (!b) {
        return
    }
    var a = b.readAttribute("data-identity");
    if (!a) {
        return BrowseFile.from_elem(b.up("[data-identity]"))
    }
    return BrowseFile.from_key(a)
};
BrowseFile.from_key = function (a) {
    return BrowseFile._file_index[a]
};
BrowseActions = Class.create({
    initialize: function (a) {
        this._set_files(a)
    },
    get_actions: function () {
        var a = this.get_files();
        if (a.length < 2) {
            return this._get_actions_single(a.first())
        } else {
            return this._get_actions_multi(a)
        }
    },
    get_icon: function (a) {
        return BrowseActions.option_dict[a].icon
    },
    get_text: function (b) {
        var c = BrowseActions.option_dict[b];
        var a = "function" == typeof (c.text) ? c.text.call(this) : c.text;
        return a
    },
    get_href: function (a) {
        var b = BrowseActions.option_dict[a];
        return b.href ? b.href.call(this) : ""
    },
    get_files: function () {
        return this._files
    },
    _set_files: function (a) {
        this._files = $A(a)
    },
    _get_actions_single: function (e) {
        var f = [];
        if (!e) {
            return []
        }
        var g = e.fq_path.toLowerCase().startsWith("/public/"),
            c = e.fq_path.toLowerCase().startsWith("/photos/"),
            h = e.fq_path.toLowerCase() == "/public",
            d = e.fq_path.toLowerCase() == "/photos",
            b = e.target_ns,
            a = e.ns_id != Constants.root_ns,
            k = e.type == FileTypes.SHARED_FOLDER,
            m = e.type == FileTypes.SANDBOX,
            l = e.type == FileTypes.PACKAGE;
        if (e.is_deleted) {
            f = f.concat(["restore", "purge"]);
            if (!e.dir) {
                f.push("revisions")
            }
        } else {
            if (e.dir) {
                if (m) {
                    f.push("app_info")
                } else {
                    if (k) {
                        f.push("sharing_options")
                    } else {
                        if (!a && !b && !g && !h && !d) {
                            f.push("share")
                        }
                    }
                }
                if (Constants.can_shmodel) {
                    f.push("token_share")
                }
                if (c || d) {
                    f.push("photos")
                }
                f.push("download");
                if (!h && !d) {
                    f = f.concat(["delete", "rename", "move"]);
                    if (!l && !b) {
                        f.push("copy")
                    }
                }
            } else {
                if (Constants.can_shmodel) {
                    f.push("token_share")
                }
                if (g) {
                    f.push("copy_url")
                }
                f.push("download");
                f = f.concat(["delete", "rename", "move", "copy", "revisions"])
            }
        }
        return f
    },
    _get_actions_multi: function (c) {
        var a = ["download", "delete", "move", "copy", "restore", "purge"];
        var b = BrowseUtil.profile_files(c);
        if (b.deleted > 0 || b.public_folder > 0 || b.photos_folder > 0) {
            a.removeItem("move");
            a.removeItem("copy");
            a.removeItem("delete")
        }
        if (b.shared_folders > 0) {
            a.removeItem("copy")
        }
        if (b.deleted > 0) {
            a.removeItem("delete");
            a.removeItem("download")
        }
        if (!Browse.inside_dir) {
            a.removeItem("download")
        }
        if (b.deleted != c.length) {
            if (b.rejoinables != c.length) {
                a.removeItem("restore")
            }
            a.removeItem("purge")
        }
        return a
    }
});
Object.extend(BrowseActions, {
    option_dict: {
        new_folder: {
            icon: "folder_add",
            text: _("New folder"),
            click_handler: function (a) {
                Browse.new_folder()
            }
        },
        global_restore: {
            icon: "restore",
            text: function () {
                assert(Browse.inside_deleted_dir, "Global restore from not a deleted dir");
                if (Browse.inside_deleted_shared_folder) {
                    return _("Rejoin shared folder")
                } else {
                    if (Browse.inside_deleted_sandbox) {
                        return _("Restore app folder")
                    } else {
                        return _("Restore folder")
                    }
                }
            },
            click_handler: function () {
                var a = Browse.containing_fq_path();
                if (Browse.inside_deleted_sandbox) {
                    assert(Browse.old_path_to_ns_id[a], "Deleted sandbox missing nsid");
                    Apps.restore_sandbox(a, Browse.old_path_to_ns_id[a])
                } else {
                    if (Browse.inside_deleted_shared_folder) {
                        assert(Browse.old_path_to_ns_id[a], "Deleted shared folder missing nsid");
                        Sharing.rejoin(a, Browse.old_path_to_ns_id[a])
                    } else {
                        window.location.href = "/restore" + Util.urlquote(a) + "?prev=" + encodeURIComponent(location.href)
                    }
                }
            }
        },
        restore: {
            icon: "restore",
            text: function () {
                var b = this.get_files();
                var a = BrowseUtil.profile_files(b);
                if (a.shared_folders == b.length) {
                    return ungettext("Rejoin shared folder", "Rejoin shared folders", b.length)
                } else {
                    return _("Restore")
                }
            },
            click_handler: function () {
                var c = this.get_files();
                if (c.length === 0) {
                    return
                } else {
                    if (c.length == 1) {
                        var b = c.first();
                        if (!b.is_deleted) {
                            return
                        }
                        var d = b.fq_path;
                        var a = d.toLowerCase();
                        if (b.type == FileTypes.SANDBOX) {
                            assert(Browse.old_path_to_ns_id[a], "Restore missing ns");
                            Apps.restore_sandbox(d, Browse.old_path_to_ns_id[a])
                        } else {
                            if (b.type == FileTypes.SHARED_FOLDER) {
                                assert(Browse.old_path_to_ns_id[a], "Rejoin missing ns");
                                Sharing.rejoin(d, Browse.old_path_to_ns_id[a])
                            } else {
                                if (b.dir) {
                                    window.location = "/restore" + Util.urlquote(b.fq_path) + "?prev=" + encodeURIComponent(location.href)
                                } else {
                                    FileOps.show_undelete(b)
                                }
                            }
                        }
                    } else {
                        return FileOps.show_bulk_restore(c)
                    }
                }
            }
        },
        global_share: {
            icon: "rainbow_16",
            text: function () {
                if (Browse.inside_shared_folder) {
                    return _("Shared folder options")
                } else {
                    if (Browse.containing_fq_path() === "") {
                        return _("Share a folder")
                    } else {
                        return _("Share this folder")
                    }
                }
            },
            click_handler: function (a) {
                if (Browse.containing_fq_path() === "") {
                    Sharing.start_wizard(a)
                } else {
                    if (Browse.inside_shared_folder) {
                        Sharing.get_sharing_options(Browse.containing_mount_point())
                    } else {
                        Sharing.show_share_existing_modal(Browse.containing_fq_path())
                    }
                }
            }
        },
        sharing_options: {
            icon: "rainbow_16",
            text: _("Shared folder options"),
            click_handler: function (a) {
                Sharing.get_sharing_options(this.get_files().first().fq_path)
            }
        },
        view_token: {
            icon: "link",
            text: _("Get link"),
            click_handler: function () {
                var b = this.get_files().first(),
                    a = "/s/" + b.tkey;
                if (!b.dir) {
                    a += "/" + Util.urlquote(FileOps.filename(b.fq_path))
                }
                window.location.href = a
            }
        },
        remove_share: {
            icon: "link_delete",
            text: _("Disable link"),
            click_handler: function () {
                var a = this.get_files().first();
                SharingModel.confirm_remove(FileOps.filename(a.fq_path), a.tkey)
            }
        },
        share_new: {
            icon: "rainbow_16",
            text: _("Share a folder"),
            click_handler: function (a) {
                Sharing.start_wizard(a)
            }
        },
        share: {
            icon: "rainbow_16",
            text: _("Invite to folder"),
            click_handler: function (a) {
                Sharing.show_share_existing_modal(this.get_files().first().fq_path)
            }
        },
        share_invite_more: {
            icon: "group",
            text: _("Invite more people"),
            click_handler: function (a) {
                Sharing.show_invite_more_modal(this.get_files().first().fq_path)
            }
        },
        share_leave: {
            icon: "folder_user_delete",
            text: _("Leave shared folder"),
            click_handler: function (a) {
                PAGE_PATH = this.fq_path;
                Sharing.show_leave_modal(this.get_files().first().fq_path)
            }
        },
        share_unshare: {
            icon: "link_break",
            text: _("Unshare this folder"),
            click_handler: function (a) {
                PAGE_PATH = this.get_files().first().fq_path;
                Sharing.show_unshare_modal(PAGE_PATH)
            }
        },
        revisions: {
            icon: "previousversions",
            click_handler: function () {
                window.location.href = "/revisions" + Util.urlquote(this.get_files().first().fq_path)
            },
            text: _("Previous versions")
        },
        token_share: {
            icon: "link_16",
            text: _("Get link"),
            click_handler: function (a) {
                assert(this.get_files().first().fq_path, "token_share: expected non-root fq_path");
                Forms.postRequest("/sm/create" + Util.urlquote(this.get_files().first().fq_path), {}, {
                    target: "_blank"
                })
            }
        },
        global_token_share: {
            icon: "link_16",
            text: _("Get link"),
            click_handler: function (a) {
                Forms.postRequest("/sm/create" + Util.urlquote(Browse.containing_fq_path()), {}, {
                    target: "_blank"
                })
            }
        },
        copy_url: {
            icon: "world_link",
            text: _("Copy public link"),
            click_handler: function (a) {
                AMC.log("site_action", {
                    action: "publink_create",
                    webserver: Constants.WEBSERVER
                });
                BrowseActions.showCopyPublicUrlModal("http://" + Constants.PUBSERVER + "/u/" + Constants.uid + Util.urlquote(this.get_files().first().fq_path.substring(7)))
            }
        },
        download: {
            icon: "download",
            text: function () {
                return _("Download")
            },
            click_handler: function () {
                var c = this.get_files();
                AMC.log("file_action", {
                    action: "download",
                    num_files: c.length,
                    webserver: Constants.WEBSERVER
                });
                if (c.length == 1 && !c[0].dir) {
                    var b = c.first();
                    var a = Constants.protocol + "://" + Constants.block + "/get" + Util.urlquote(b.fq_path) + "?w=" + b.hash + "&dl=1";
                    window.location = a
                } else {
                    FileOps.do_bulk_download(c)
                }
            }
        },
        view: {
            href: function () {
                var a = this.get_files().first();
                return Constants.protocol + "://" + Constants.block + "/get" + Util.urlquote(a.fq_path) + a.hash
            },
            icon: "page_white_magnify",
            text: _("View file")
        },
        photos: {
            icon: "pictures",
            text: _("Gallery"),
            click_handler: function () {
                window.location.href = "/photos" + Util.urlquote(this.get_files().first().fq_path.substring(7))
            }
        },
        global_photos: {
            icon: "pictures",
            text: _("Gallery"),
            click_handler: function () {
                window.location.href = "/photos" + Util.urlquote(Browse.containing_fq_path().substring(7))
            }
        },
        a_photo: {
            href: function () {
                return "/photoshow" + Util.urlquote(this.get_files().first().fq_path.substring(7))
            },
            icon: "pictures",
            text: _("Gallery view")
        },
        ignore: {
            click_handler: function () {
                Sharing.ignore(this.get_files().first().fq_path)
            },
            icon: "folder_user_delete",
            text: _("Permanently remove")
        },
        show_del: {
            click_handler: function (a) {
                Browse.toggle_deleted()
            },
            icon: "show-deleted",
            text: _("Show deleted files")
        },
        hide_del: {
            click_handler: function (a) {
                Browse.toggle_deleted()
            },
            icon: "hide-deleted",
            text: _("Hide deleted files")
        },
        copy: {
            icon: "copy",
            text: function () {
                return _("Copy")
            },
            click_handler: function (c) {
                var b = this.get_files();
                if (1 == b.length) {
                    var a = b.first();
                    FileOps.show_copy(a.fq_path, a.dir)
                } else {
                    if (1 < b.length) {
                        FileOps.show_copy_bulk(b)
                    }
                }
            }
        },
        move: {
            icon: "move_16",
            text: function () {
                return _("Move")
            },
            click_handler: function (c) {
                var b = this.get_files();
                if (1 == b.length) {
                    var a = b.first();
                    FileOps.show_move(a.fq_path, a.dir)
                } else {
                    if (1 < b.length) {
                        FileOps.show_move_bulk(b)
                    }
                }
            }
        },
        rename: {
            icon: "rename",
            text: _("Rename"),
            click_handler: function () {
                this.get_files().first().edit()
            }
        },
        "delete": {
            icon: "delete_16",
            text: function () {
                return _("Delete")
            },
            click_handler: function (c) {
                var b = this.get_files();
                if (b.length > 1) {
                    FileOps.show_bulk_delete(b)
                } else {
                    if (b.length == 1) {
                        var a = b.first();
                        FileOps.show_delete(a.fq_path, a.dir)
                    }
                }
            }
        },
        global_purge: {
            icon: "permdelete",
            text: _("Permanently delete folder"),
            click_handler: function () {
                FileOps.show_purge(Browse.containing_fq_path(), true)
            }
        },
        purge: {
            icon: "permdelete",
            text: _("Permanently delete"),
            click_handler: function (c) {
                var b = this.get_files();
                if (1 == b.length) {
                    var a = b.first();
                    FileOps.show_purge(a.fq_path, a.dir)
                } else {
                    FileOps.show_bulk_purge(b)
                }
            }
        },
        upload: {
            icon: "upload_16",
            text: _("Upload"),
            click_handler: function (a) {
                FileOps.show_upload()
            }
        },
        app_info: {
            icon: "application_double",
            text: _("Application info"),
            click_handler: function (a) {
                window.location.href = "/account/applications"
            }
        },
        more_actions: {
            icon: "big-dropdown",
            text: function () {
                return _("More")
            },
            click_handler: Prototype.emptyFunction
        },
        preview_folder: {
            icon: "magnifier2",
            text: function () {
                return _("Preview folder")
            },
            click_handler: function () {
                BrowseUtil.filepreview_from_selected(this)
            }
        },
        more_global_actions: {
            icon: "arrow_down_grey_small",
            text: _("More actions"),
            click_handler: function () {
                GlobalActionsBasic.show_secondary();
                document.body.observe("click", GlobalActionsBasic.hide_secondary)
            }
        }
    },
    showMore: function () {
        BrowseActions.kill_dropdowns();
        var d = $("show-more-dropdown");
        if (d) {
            Util.yank(d)
        }
        var a = new Element("ul", {
            id: "show-more-dropdown"
        });
        a.addClassName("dropdown dropdown-lite");
        $("browse-files").__sert(a);
        var b = $$("#browse-root-actions li").last();
        a.clonePosition(b, {
            setWidth: false
        });
        a.style.height = "auto";
        a.style.top = parseInt(a.style.top, 10) + 1 + b.getHeight() + "px";
        var c = parseInt(a.style.left, 10) - (parseInt(a.getWidth(), 10) - b.getWidth()) + 1 + "px";
        a.style.left = c
    },
    clear: function (b) {
        var a = $("more-file-actions");
        if (a) {
            a.__date()
        }
    },
    kill_dropdowns: function () {
        var a = $("dropdown");
        if (a) {
            a.hide()
        }
    },
    dropdown: function (d, g, l) {
        var f = d.div;
        if (l) {
            Event.stop(l)
        }
        if (!f || !d.selected) {
            return
        }
        var p = d.actions();
        if (!p.length) {
            return
        }
        var o = $("dropdown");
        if (o) {
            Event.stopObserving(document, "click", o.listener);
            o = Util.yank(o);
            if (Browse.more_link) {
                Event.stopObserving(Browse.more_link, "click", Browse.more_link_action);
                Browse.more_link = null;
                Browse.more_link_action = null
            }
        }
        f = $(f);
        var a = new Element("div", {
            id: "dropdown"
        });
        var c = new Element("ul", {
            "class": "dropdown dropdown-lite note"
        });
        a.__sert(c);
        c.listener = function (r) {
            var s = $(r.target);
            if (s.descendantOf(d.div)) {
                return
            }
            Event.stopObserving(document, "click", c.listener);
            if (Browse.more_link) {
                Event.stopObserving(Browse.more_link, "click", Browse.more_link_action);
                Browse.more_link = null;
                Browse.more_link_action = null
            }
            if (r.target.parentNode.tagName != "A" && r.target.tagName != "A" || (r.target.href && r.target.href.length <= 2)) {
                Event.stop(r)
            }
            var q = $("dropdown");
            if (q) {
                q = Util.yank(q)
            }
        };
        Event.observe(document, "click", c.listener);
        $(f.offsetParent).__sert(a);
        var n = f.positionedOffset();
        var h = f.getDimensions();
        var m = a.getDimensions();
        var b = a.down().getDimensions();
        a.style.left = (n.left - b.width + h.width) + "px";
        a.style.top = (n.top + h.height - 1) + "px";
        if (!Util.ie) {
            var k = a.cumulativeOffset().top - Util.scrollTop();
            if (m.height + k > (window.innerHeight || document.documentElement.clientHeight)) {
                setTimeout(function () {
                    a.scrollIntoView(false);
                    a = null
                }, 100)
            }
        }
        window.focus();
        return false
    },
    hide_dropdown: function () {
        var a = $("dropdown");
        if (a) {
            a.remove()
        }
    },
    showCopyPublicUrlModal: function (a) {
        Modal.icon_show("alert_32", _("Copy public link"), DomUtil.fromElm("copy-public-url"), {
            wit_group: "copy_public_link"
        });
        BrowseActions.addCopyUrlFlash(a);
        var b = $("modal-content").down("#public_url");
        assert(b, "Text element not found for copy pulic link");
        b.setValue(a);
        b.select()
    },
    clipboard_copy_done: function () {
        $("copy_success").__date(Sprite.make("tick", {
            style: "vertical-align:middle;"
        }));
        $("copy_success").__sert(" " + _("Copied!"))
    },
    getIcon: function (a) {
        return BrowseActions.option_dict[a].icon
    },
    shortenPublicLink: function () {
        Util.shorten_url($F("public_url"), BrowseActions.updatePublicLink);
        var a = new Element("img", {
            id: "publink_loading",
            src: "/static/images/icons/ajax-loading-small.gif",
            className: "right"
        });
        $("modal-content").down("a").__date(a)
    },
    updatePublicLink: function (a) {
        $("public_url").setValue(a);
        $("public_url").select();
        $("publink_loading").remove();
        BrowseActions.addCopyUrlFlash(a)
    },
    addCopyUrlFlash: function (a, c, b) {
        c = c || "real_copy";
        b = b || "copy_button";
        var d = {
            wmode: "transparent",
            flashVars: "copy_text=" + Util.urlquote(a) + "&callback=BrowseActions.clipboard_copy_done()"
        };
        swfobject.embedSWF("/static/swf/copy_to_clipboard.swf", "copy_button", "100%", "100%", "6.0.65", false, false, d);
        b = $(b);
        b.absolutize();
        b.clonePosition($(c), {
            offsetTop: -3,
            offsetLeft: -3,
            offsetHeight: 6,
            offsetWidth: 6
        });
        Util.freshbutton_overlay(b, $(c))
    }
});
BrowseActionsContext = Class.create(BrowseActions, {
    initialize: function ($super, a) {
        $super(a);
        this._listen()
    },
    _listen: function () {
        $("context-menu-container").stopObserving("click");
        $("context-menu-container").stopObserving("contextmenu");
        $("context-menu-container").on("click", ".action button", this._click.bind(this));
        $("context-menu-container").on("contextmenu", ".action button", this._click.bind(this))
    },
    _click: function (d, b) {
        var c = b.readAttribute("data-value");
        var a = BrowseActions.option_dict[c];
        d.stop();
        ContextMenu.hide();
        a.click_handler.call(this)
    }
});
BrowseActionsBasic = Class.create(BrowseActions, {
    initialize: function ($super) {
        var a = BrowseSelection.get_selected_files();
        $super(a);
        this._render();
        this._listen()
    },
    _listen: function () {
        this.bound_update = this._update.bind(this);
        this.bound_disable = this._disable.bind(this);
        this.bound_enable = this._enable.bind(this);
        this.bound_click = this._click.bind(this);
        document.observe(BrowseSelection.UPDATED_EVT, this.bound_update);
        document.observe(ContextMenu.SHOW_EVT, this.bound_disable);
        document.observe(ContextMenu.HIDE_EVT, this.bound_enable);
        var a = $("browse-root-actions");
        a.stopObserving("click");
        a.on("click", ".action button", this.bound_click)
    },
    unlisten: function () {
        document.stopObserving(BrowseSelection.UPDATED_EVT, this.bound_update);
        document.stopObserving(ContextMenu.SHOW_EVT, this.bound_disable);
        document.stopObserving(ContextMenu.HIDE_EVT, this.bound_enable);
        $("browse-root-actions").stopObserving("click", this.bound_click)
    },
    _update: function () {
        this._set_files(BrowseSelection.get_selected_files());
        this._render()
    },
    _disable: function () {
        $("browse-root-actions").stopObserving("click");
        if ($("browse-root-actions").down(".secondary")) {
            $("browse-root-actions").down(".secondary").addClassName("disabled")
        }
        $$("#browse-root-actions .action *").invoke("setStyle", {
            cursor: "default"
        })
    },
    _enable: function () {
        $("browse-root-actions").stopObserving("click");
        $("browse-root-actions").on("click", ".action button", this._click.bind(this));
        if ($("browse-root-actions").down(".secondary")) {
            $("browse-root-actions").down(".secondary").removeClassName("disabled")
        }
        $$("#browse-root-actions .action *").invoke("setStyle", {
            cursor: "pointer"
        })
    },
    _render: function () {
        var c = this.get_files();
        var f = this.get_actions();
        var s = 14;
        var o = "",
            d = "";
        if (1 == c.length) {
            o = c[0].filename.em_snippet(s);
            if (!c[0].dir && c[0].bytes >= 0) {
                d = c[0].size
            }
        } else {
            if (1 < c.length) {
                var a = BrowseUtil.profile_files(c);
                var q = [];
                if (a.files) {
                    q.push(ungettext("%d file", "%d files", a.files).format(a.files))
                }
                if (a.folders) {
                    q.push(ungettext("%d folder", "%d folders", a.folders).format(a.folders))
                }
                o = Util.nice_list(q)
            }
        }
        var t = $("browse-root-actions");
        var r = t.getLayout().get("width"),
            e = t.getStyle("font-size");
        assert(e.endsWith("px"), "Invalid font size " + e);
        e = parseInt(e, 10);
        var h = new Emstring(o).length * e,
            k = new Emstring(d).length * e;
        r -= h + k;
        var n = [],
            g = [];
        r -= 10;
        for (var p = 0; p < f.length; p += 1) {
            var b = new Emstring(this.get_text(f[p])).length * e,
                u = b + 16 + 8 + 10 + 9;
            if (r > u) {
                n.push(f[p])
            } else {
                if (g.length === 0) {
                    var l = n.pop();
                    g.push(l)
                }
                g.push(f[p])
            }
            r -= u
        }
        var m = HTML.tmpl("actions_bar_tmpl", {
            context: this,
            description: o,
            filesize: d,
            has_actions: !! f.length,
            standard_actions: n,
            secondary_actions: g
        });
        $("browse-root-actions").__date(m)
    },
    _click: function (d, b) {
        var c = b.readAttribute("data-value");
        assert(c);
        var a = BrowseActions.option_dict[c];
        assert(a, "Action info is missing for " + c);
        d.preventDefault();
        a.click_handler.call(this)
    }
});
Object.extend(BrowseActionsBasic, {
    STANDARD_ACTIONS: ["share", "sharing_options", "app_info", "token_share", "copy_url", "photos", "download", "delete", "rename", "restore", "purge"]
});
GlobalActions = Class.create(BrowseActions, {
    initialize: function ($super) {
        $super()
    },
    get_actions: function () {
        if (!Browse.inside_dir) {
            return []
        }
        var a = [];
        if (!Browse.inside_deleted_dir) {
            a = a.concat(["upload", "new_folder"]);
            if (!Browse.inside_sandbox) {
                a.push("global_share")
            }
            if (Browse.containing_fq_path() && Constants.can_shmodel) {
                a.push("global_token_share")
            }
            if (Browse.containing_fq_path().toLowerCase().startsWith("/photos")) {
                a.push("global_photos")
            }
            a.push(Browse.deleted_shown ? "hide_del" : "show_del")
        } else {
            a = a.concat(["global_restore"])
        }
        return a
    }
});
GlobalActionsBasic = Class.create(GlobalActions, {
    initialize: function ($super) {
        $super();
        this._listen();
        this._render()
    },
    _listen: function () {
        $("global-actions").stopObserving("click");
        $("global-actions").on("click", "a", this._click.bind(this));
        document.observe(ContextMenu.SHOW_EVT, this._disable.bind(this));
        document.observe(ContextMenu.HIDE_EVT, this._enable.bind(this))
    },
    _render: function () {
        var d = this.get_actions();
        var a = d.intersect(GlobalActionsBasic.STANDARD_ACTIONS),
            c = d.without.apply(d, GlobalActionsBasic.STANDARD_ACTIONS);
        if (c.length == 1) {
            a = d;
            c = []
        }
        if (c.length) {
            a.push("more_global_actions")
        }
        var b = HTML.tmpl("global_actions_tmpl", {
            context: this,
            standard_actions: a,
            secondary_actions: c
        });
        $("global-actions").__date(b)
    },
    _disable: function () {
        $("global-actions").stopObserving("click");
        $$("#global-actions .action a").invoke("removeClassName", "title_bubble");
        $$("#global-actions .action a").invoke("addClassName", "disabled")
    },
    _enable: function () {
        $("global-actions").stopObserving("click");
        $("global-actions").on("click", "a", this._click.bind(this));
        $$("#global-actions .action a").invoke("removeClassName", "disabled");
        $$("#global-actions .action a").invoke("addClassName", "title_bubble")
    },
    _click: function (d, b) {
        var c = b.readAttribute("data-value");
        assert(c);
        var a = BrowseActions.option_dict[c];
        assert(a, "Action info is missing for " + c);
        d.stop();
        GlobalActionsBasic.hide_secondary();
        BrowseSelection.deselect_all();
        a.click_handler.call(this)
    }
});
Object.extend(GlobalActionsBasic, {
    STANDARD_ACTIONS: ["upload", "new_folder", "global_share", "global_token_share", "global_restore", "global_purge"],
    show_secondary: function () {
        var b = $("secondary-actions"),
            a = $("more_global_actions_button");
        b.show();
        a.addClassName("down")
    },
    hide_secondary: function () {
        var b = $("secondary-actions");
        if (!b) {
            return
        }
        var a = $("more_global_actions_button");
        b.hide();
        a.removeClassName("down")
    }
});
GlobalActionsContext = Class.create(GlobalActions, {
    initialize: function ($super, a) {
        $super(a);
        this._listen()
    },
    _listen: function () {
        $("context-menu-container").stopObserving("click");
        $("context-menu-container").stopObserving("contextmenu");
        $("context-menu-container").on("click", ".action button", this._click.bind(this));
        $("context-menu-container").on("contextmenu", ".action button", this._click.bind(this))
    },
    _click: function (d, b) {
        var c = b.readAttribute("data-value");
        var a = BrowseActions.option_dict[c];
        d.stop();
        BrowseSelection.deselect_all();
        ContextMenu.hide();
        a.click_handler.call(this)
    }
});
BrowseClipboard = function () {
    var k = 0,
        f = 1,
        e = [],
        c;
    var n = function () {
            if (Util.focus_in_input()) {
                return
            }
            var r = BrowseSelection.get_selected_files();
            if (r && r.length) {
                for (var p = 0; p < r.length; p += 1) {
                    var s = r[p];
                    if (s.bytes < 0) {
                        Notify.server_error(_("Deleted files cannot be added to the clipboard"));
                        return false
                    } else {
                        if (s.target_ns) {
                            Notify.server_error(_("'%(filename)s' cannot be added to the clipboard").format({
                                filename: s.filename.escapeHTML()
                            }));
                            return false
                        }
                    }
                }
                e = r;
                var q = r.length;
                var t = ungettext("Added %d item to clipboard", "Added %d items to clipboard", q).format(q);
                Notify.server_success(t);
                return true
            }
        };
    var m = function () {
            if (n()) {
                c = k;
                return false
            }
        };
    var o = function () {
            if (n()) {
                c = f;
                return false
            }
        };
    var h = function (q) {
            assert(typeof (q) !== "undefined", "BrowseClipboard _paste got an undefined path");
            if (e.length) {
                Browse.select_fq_paths = [];
                for (var p = 0; p < e.length; p++) {
                    Browse.select_fq_paths.push(q + "/" + e[p].filename)
                }
                var r = c == k ? FileOps.do_bulk_copy : FileOps.do_bulk_move;
                r(e, q);
                return true
            }
        };
    var d = function (p) {
            if (Util.focus_in_input() || Browse.in_search_mode() || Browse.inside_deleted_dir) {
                return
            }
            var q = h(Browse.containing_fq_path());
            if (q) {
                return false
            }
        };
    var g = function () {
            e = []
        };
    var a = function (u) {
            var s = u.memo.files;
            for (var q = 0; q < s.length; q += 1) {
                var p = s[q];
                for (var r = 0; r < e.length; r += 1) {
                    var t = e[r];
                    if (t.fq_path == p.fq_path || t.fq_path.startsWith(p.fq_path + "/")) {
                        g();
                        return
                    }
                }
            }
        };
    var b = function (p) {
            assert(p.memo.files === undefined && p.memo.file !== undefined);
            p.memo.files = [p.memo.file];
            a(p)
        };
    var l = function () {
            document.observe(FileEvents.RENAME, b);
            [FileEvents.DELETE, FileEvents.MOVE].each(function (q) {
                document.observe(q, a)
            });
            var p = key.main_modifier();
            key(p + "+c", Browse.KEY_SCOPE, m);
            key(p + "+x", Browse.KEY_SCOPE, o);
            key(p + "+v", Browse.KEY_SCOPE, d)
        };
    return {
        init: function () {
            l()
        }
    }
}();
BrowseSelection = function () {
    var f = [];
    var v = null;
    var c = null;
    var x = null;
    var d = [];
    var z = function () {
            $$("#browse-files li.browse-file.file-select").invoke("removeClassName", "file-select");
            BrowseSelection.get_selected_files().invoke("get_div").findAll(function (B) {
                return B
            }).invoke("addClassName", "file-select")
        };
    var n = function () {
            if (x) {
                return
            }
            $$("#browse-files li.browse-file[draggable]").invoke("writeAttribute", "draggable", false);
            BrowseSelection.get_selected_files().filter(function (B) {
                return !B.editing
            }).invoke("get_div").findAll(function (B) {
                return B
            }).invoke("writeAttribute", "draggable", "true")
        };
    var q = function (B) {
            B.apply(null, $A(arguments).slice(1));
            document.fire(BrowseSelection.UPDATED_EVT)
        };
    var u = function (D, C) {
            var B = f.length;
            f = D instanceof BrowseFile ? [D] : $A(D);
            if (f.length != B) {
                T("Selected", f.length, "files")
            }
            var E = C || f.last();
            assert(!E || E instanceof BrowseFile, "Invalid anchor type" + E);
            v = E
        };
    u = u.wrap(q);
    var w = function (C, B) {
            if (C) {
                f.push(C)
            }
            v = B || C
        };
    w = w.wrap(q);
    var h = function (B) {
            var C = f.indexOf(B);
            if (-1 == C) {
                return
            }
            f.splice(C, 1)
        };
    h = h.wrap(q);
    var o = function () {
            f = []
        };
    o = o.wrap(q);
    var s = function (B) {
            d = B;
            $$("#browse-files li.browse-file.context-select").invoke("removeClassName", "context-select");
            B.invoke("get_div").findAll(function (C) {
                return C
            }).invoke("addClassName", "context-select")
        };
    var a = function (J) {
            var K = $(J.target);
            var O = K.match("li.browse-file") ? K : K.up("li.browse-file");
            var H = K.match("a") ? K : K.up("a");
            var E = BrowseFile.from_elem(O);
            if (J.isRightClick() || !O || H) {
                return
            }
            Browse.keyboard_nav = false;
            if (d.length) {
                return
            }
            var D = Util.is_mac();
            if ((D && J.metaKey) || (!D && J.ctrlKey)) {
                if (-1 == f.indexOf(E)) {
                    w(E)
                } else {
                    h(E)
                }
            } else {
                if (J.shiftKey) {
                    var F = Browse.files.indexOf(v);
                    var C = Browse.files.indexOf(E);
                    var M = Browse.files.indexOf(f.last());
                    var I = f.slice(0);
                    var N, G;
                    N = M < F ? -1 : 1;
                    for (G = F; G != M;) {
                        G += N;
                        var L = I.indexOf(Browse.files[G]);
                        if (-1 != L) {
                            I.splice(L, 1)
                        }
                    }
                    N = C < F ? -1 : 1;
                    for (G = F; G != C;) {
                        G += N;
                        var B = I.indexOf(Browse.files[G]);
                        if (-1 != B) {
                            I.splice(B, 1)
                        }
                        I.push(Browse.files[G])
                    }
                    u(I, v)
                } else {
                    u(E)
                }
            }
        };
    var b = function (I) {
            if (I.isRightClick() || d.length || Util.in_scrollbar(I.pointerX())) {
                return
            }
            var H = $(I.target);
            if (Element.match(H, "object")) {
                H = H.parentNode
            }
            var G = ["browse-box", "context-menu-container", "modal", "modal-overlay"];
            var F = false;
            for (var E = 0; E < G.length; E++) {
                if (H.descendantOf(G[E]) || H.match("#" + G[E])) {
                    F = true
                }
            }
            if (!F) {
                u();
                return
            }
            var C = H.match("li.browse-file") ? H : H.up("li.browse-file");
            var D = BrowseFile.from_elem(C);
            var B = H.match("[draggable]") || H.up("[draggable]");
            if (D && !B) {
                c = v;
                if (!I.shiftKey) {
                    if (D) {
                        c = D
                    } else {
                        if (H.match("#browse-files")) {
                            c = Browse.files.last()
                        }
                    }
                }
                x = [];
                if (I.metaKey || I.ctrlKey) {
                    x = BrowseSelection.get_selected_files()
                }
            }
        };
    var e = function (E) {
            var D = $(E.target);
            var B = D.match("li.browse-file") ? D : D.up("li.browse-file");
            var C = BrowseFile.from_elem(B);
            if (C) {
                return a(E)
            }
        };
    var m = function (G) {
            $("browse-files").addClassName("mouse-active");
            if (!BrowseSelection.is_selecting()) {
                return
            }
            Browse.keyboard_nav = false;
            var F = Browse.files.indexOf(c);
            var H = Browse.files.indexOf(BrowseFile.from_elem(G.target));
            assert(F < Browse.files.length && F >= 0, "anchor_index:" + F + " " + c);
            assert(H < Browse.files.length && H >= 0, "target_index:" + H);
            var C = Browse.files.slice(Math.min(F, H), Math.max(F, H) + 1);
            var E = x.slice(0);
            for (var D = 0; D < C.length; D++) {
                var B = E.indexOf(C[D]);
                if (-1 == B) {
                    E.push(C[D])
                } else {
                    E.splice(B, 1)
                }
            }
            u(E)
        };
    var l = function (B) {
            c = null;
            x = null
        };
    var k = function (D) {
            Browse.keyboard_nav = true;
            if (D) {
                Event.extend(D).preventDefault()
            }
            $("browse-files").removeClassName("mouse-active");
            var C;
            if (f.length) {
                if (f.last() == Browse.files.first()) {
                    C = Browse.files.first()
                } else {
                    var B = Browse.files.indexOf(f.last()) - 1;
                    C = Browse.files[B]
                }
            } else {
                C = Browse.files.last()
            }
            u(C);
            if (C) {
                Browse.scrollTo(C.get_div())
            }
        };
    var r = function (D) {
            Browse.keyboard_nav = true;
            if (D) {
                Event.extend(D).preventDefault()
            }
            $("browse-files").removeClassName("mouse-active");
            var C;
            if (f.length) {
                if (f.last() == Browse.files.last()) {
                    C = Browse.files.last()
                } else {
                    var B = Browse.files.indexOf(f.last()) + 1;
                    C = Browse.files[B]
                }
            } else {
                C = Browse.files.first()
            }
            u(C);
            if (C) {
                Browse.scrollTo(C.get_div())
            }
        };
    var y = function (G) {
            Browse.keyboard_nav = true;
            if (G) {
                Event.extend(G).preventDefault()
            }
            $("browse-files").removeClassName("mouse-active");
            if (f.length > 0) {
                var D = Browse.files.indexOf(f.last());
                var C = Browse.files.indexOf(v);
                if (v == f.last() || C > D) {
                    for (var F = D - 1; F >= 0; F--) {
                        var E = Browse.files[F];
                        var B = f.indexOf(E);
                        w(E, v);
                        if (B != -1) {
                            f.splice(B, 1)
                        } else {
                            Browse.scrollTo(E.get_div());
                            break
                        }
                    }
                } else {
                    h(f.last());
                    Browse.scrollTo(f.last().get_div())
                }
            } else {
                k()
            }
        };
    var A = function (G) {
            Browse.keyboard_nav = true;
            if (G) {
                Event.extend(G).preventDefault()
            }
            $("browse-files").removeClassName("mouse-active");
            if (f.length > 0) {
                var D = Browse.files.indexOf(f.last());
                var C = Browse.files.indexOf(v);
                if (v == f.last() || C < D) {
                    for (var F = D + 1; F < Browse.files.length; F++) {
                        var E = Browse.files[F];
                        var B = f.indexOf(E);
                        w(E, v);
                        if (B != -1) {
                            f.splice(B, 1)
                        } else {
                            Browse.scrollTo(E.get_div());
                            break
                        }
                    }
                } else {
                    h(f.last());
                    Browse.scrollTo(f.last().get_div())
                }
            } else {
                r()
            }
        };
    var g = function () {
            u(Browse.files);
            return false
        };
    var t = function (B) {
            u(Browse.find_file(B.memo))
        };
    var p = function () {
            $$(".file-select").invoke("removeClassName", "file-select");
            setTimeout(z, 100)
        };
    return {
        UPDATED_EVT: "db:select:updated",
        init: function () {
            document.observe("click", e);
            document.observe("mousedown", b);
            document.observe("mouseup", l);
            document.observe("dragend", l);
            document.observe("mouseup", n);
            $("browse-files").on("mouseover", "li.browse-file", m);
            document.observe(BrowseSelection.UPDATED_EVT, z);
            document.observe(BrowseSelection.UPDATED_EVT, n);
            document.observe(Browse.RENDER_EVT, z);
            document.observe(Browse.UPDATE_EVT, u.bind(null, null, null));
            document.observe(FilePreviewModal.EXIT_SELECT_EVT, t);
            var B = key.main_modifier();
            key("up", Browse.KEY_SCOPE, k);
            key("down", Browse.KEY_SCOPE, r);
            key(B + "+a", Browse.KEY_SCOPE, g);
            key("escape", Browse.KEY_SCOPE, u.bind(null, null, null));
            key("shift+up", Browse.KEY_SCOPE, y);
            key("shift+down", Browse.KEY_SCOPE, A)
        },
        set_selected_files: function (B) {
            u(B)
        },
        get_selected_files: function () {
            return f.slice(0)
        },
        is_selected: function (B) {
            return -1 != f.indexOf(B)
        },
        is_selecting: function () {
            return !!c
        },
        deselect_all: o,
        set_context_selected: function (B) {
            s(B)
        },
        flicker_selected: p
    }
}();
var ContextMenu = {
    KEY_SCOPE: "context",
    SHOW_EVT: "db:contextmenu:show",
    HIDE_EVT: "db:contextmenu:hide",
    listen: function () {
        document.observe("click", ContextMenu.hide_on_click)
    },
    unlisten: function () {
        document.stopObserving("click", ContextMenu.hide_on_click)
    },
    hide_on_click: function (a) {
        if (!a.isRightClick()) {
            ContextMenu.hide()
        }
    },
    show_for_file: function (c, b) {
        Browse.keyboard_nav = false;
        ContextMenu.hide();
        var d = BrowseFile.from_elem(b);
        var a;
        if (BrowseSelection.is_selected(d)) {
            a = BrowseSelection.get_selected_files()
        } else {
            a = [d]
        }
        BrowseSelection.set_context_selected(a);
        ContextMenu._show(c, new BrowseActionsContext(a))
    },
    show_global: function (a) {
        ContextMenu.hide();
        ContextMenu._show(a, new GlobalActionsContext())
    },
    _show: function (g, c) {
        var n = g && g.target && (g.target.tagName == "INPUT" && g.target.type == "text" || g.target.tagName == "TEXTAREA");
        if (g && g.shiftKey || n) {
            return
        } else {
            Event.stop(g)
        }
        var d = ["main-nav", "page-footer", "account-header", "browse-global-actions-bar", "modal", "modal-overlay", "file-preview-modal"];
        var h = $(g.target);
        for (var f = 0; f < d.length; f++) {
            if (h.descendantOf(d[f]) || h.match("#" + d[f])) {
                return
            }
        }
        if (h.match("#context-menu")) {
            return
        }
        if (ContextMenu._context_menu_tmpl === undefined) {
            ContextMenu._context_menu_tmpl = HTML.tmpl("context_menu_tmpl")
        }
        var m = Event.pointer(g);
        if (!c.get_actions().length) {
            return
        }
        $("context-menu-container").__date(ContextMenu._context_menu_tmpl({
            context: c,
            actions: c.get_actions()
        }));
        var a = document.viewport.getDimensions();
        var l = document.viewport.getScrollOffsets();
        var b = parseInt($("context-menu").getStyle("width"), 10);
        var o = parseInt($("context-menu").getStyle("height"), 10);
        var k = 15;
        if (m.x + b > a.width + l.left - k) {
            $("context-menu").setStyle({
                left: (m.x - l.left - b) + "px"
            })
        } else {
            $("context-menu").setStyle({
                left: (m.x - l.left) + "px"
            })
        }
        if (m.y + o > a.height + l.top - k) {
            $("context-menu").setStyle({
                top: (a.height - o - k) + "px"
            })
        } else {
            $("context-menu").setStyle({
                top: (m.y - l.top) + "px"
            })
        }
        $("context-menu-container").show();
        ContextMenu.listen();
        key.setScope(ContextMenu.KEY_SCOPE);
        document.fire(ContextMenu.SHOW_EVT)
    },
    hide: function () {
        if (!$("context-menu-container").empty()) {
            ContextMenu.unlisten();
            BrowseSelection.set_context_selected([]);
            $("context-menu-container").__date();
            key.setScope(Browse.KEY_SCOPE);
            document.fire(ContextMenu.HIDE_EVT)
        }
    }
};
Browse = {
    KEY_SCOPE: "browse",
    RENDER_EVT: "db:browse:render",
    UPDATE_EVT: "db:browse:update",
    SCROLL_DURATION: 0.5,
    msg: false,
    files: [],
    details: true,
    reloading: false,
    creating_folder: false,
    first_load: true,
    last_sort: [Sort.FILES_BY_NAME, true],
    highlight_index: -1,
    folder_loading_notification: null,
    keyboard_nav: false,
    init: function () {
        Browse.unselectable();
        Browse.listen()
    },
    setup: function (c) {
        Browse.ns_id_to_mount_point = c.ns_id_to_mount_point;
        Browse.old_path_to_ns_id = c.old_path_to_ns_id;
        Browse.compiled_tmpl = HTML.tmpl("list_item_tmpl");
        Browse.render_timeout = null;
        Browse.inside_dir = c.inside_dir;
        Browse.inside_deleted_dir = c.inside_deleted_dir;
        Browse.inside_shared_folder = c.inside_shared_folder;
        Browse.inside_sandbox = c.inside_sandbox;
        Browse.inside_deleted_sandbox = c.inside_deleted_sandbox;
        Browse.inside_deleted_shared_folder = c.inside_deleted_shared_folder;
        var e = "inside_deleted_dir";
        if (Browse.inside_deleted_dir) {
            $("browse").addClassName(e)
        } else {
            $("browse").removeClassName(e)
        }
        Browse.block_hash = c.block_hash;
        Browse.block_hash_param = c.block_hash_param;
        if (Browse.inside_dir) {
            $("advanced-search-box").hide();
            $("advanced-search-link").removeClassName("selected");
            Browse._containing_ns_id = c.containing_ns_id;
            Browse._containing_ns_path = c.containing_ns_path;
            Browse._containing_fq_path = c.containing_fq_path;
            Browse._containing_mount_point = c.containing_mount_point;
            BrowseURL.set_path_url(Browse._containing_ns_id, Browse._containing_ns_path);
            Browse.breadcrumb();
            if (Browse.browse_actions_basic) {
                Browse.browse_actions_basic.unlisten();
                delete Browse.browse_actions_basic
            }
            Browse.browse_actions_basic = new BrowseActionsBasic();
            new GlobalActionsBasic();
            if (!c.file_info) {
                Browse.show_message(_('<h3>This folder is empty</h3> Add files using the <a href="/install">desktop application</a> or the upload button above.'))
            }
        }
        var b;
        var d;
        var a = c.file_info.length;
        for (b = 0; b < a; b++) {
            d = BrowseUtil.unpack_file_info(c.file_info[b]);
            if (d.is_dir) {
                BrowseUtil.make_folder_browsefile(d)
            } else {
                BrowseUtil.make_file_browsefile(d)
            }
        }
        BrowseJump.update()
    },
    _get_helper: function (a) {
        assert(Browse.inside_dir, "accessed " + a + ", but not inside a directory");
        return Browse[a]
    },
    containing_ns_id: function () {
        return Browse._get_helper("_containing_ns_id")
    },
    containing_ns_path: function () {
        return Browse._get_helper("_containing_ns_path")
    },
    containing_fq_path: function () {
        return Browse._get_helper("_containing_fq_path")
    },
    containing_mount_point: function () {
        return Browse._get_helper("_containing_mount_point")
    },
    listen: function () {
        $("browse-files").on("click", "li.browse-file", Browse.click);
        $("browse-files").on("dblclick", "li.browse-file", Browse.dblclick);
        $("browse-files").on("contextmenu", "li.browse-file", ContextMenu.show_for_file);
        Browse.enable_sorting();
        Util.add_sort_arrow_mouseover($("name-sorter"), true, "#browse-sort a.sortable-column-header", false);
        Event.observe(window, "scroll", Browse.window_scroll);
        Event.observe(window, "resize", Browse.updateOffset);
        document.body.on("click", "a.crumb", Browse.crumb_click);
        $("browse-files").on("click", "a.parent-dir", Browse.parent_click);
        document.observe("contextmenu", ContextMenu.show_global);
        document.observe(BrowseSelection.UPDATED_EVT, Browse.selection_handler);
        document.observe(FileEvents.COPY, function (a) {
            if (Browse.inside_dir) {
                if (a.memo.to_fq_path === Browse.containing_fq_path()) {
                    Browse.force_reload()
                }
            }
        });
        [FileEvents.MOVE, FileEvents.RESTORE, FileEvents.UPLOAD, FileEvents.SF_NEW, FileEvents.SF_REJOIN, FileEvents.SF_IGNORE, FileEvents.LINKS_REMOVE].each(function (a) {
            document.observe(a, function (b) {
                if (Browse.inside_dir) {
                    Browse.force_reload()
                }
            })
        });
        [FileEvents.SF_LEAVE, FileEvents.SF_UNSHARE].each(function (a) {
            document.observe(a, function (b) {
                if (Browse.inside_dir) {
                    if (b.memo.target_ns_id === Browse.containing_ns_id()) {
                        if (b.memo.folder_deleted) {
                            Browse.reload_fqpath("")
                        } else {
                            Browse.reload_fqpath(Browse.containing_fq_path())
                        }
                    } else {
                        Browse.force_reload()
                    }
                }
            })
        });
        [FileEvents.DELETE, FileEvents.PURGE].each(function (a) {
            document.observe(a, function (f) {
                if (Browse.inside_dir) {
                    if (a === FileEvents.PURGE || (a === FileEvents.DELETE && !BrowseURL.get_del())) {
                        var d;
                        for (var c = Browse.files.length - 1; c >= 0; c--) {
                            if (f.memo.files.indexOf(Browse.files[c]) === -1) {
                                d = Browse.files[c]
                            } else {
                                break
                            }
                        }
                        BrowseSelection.deselect_all();
                        for (c = 0; c < f.memo.files.length; c += 1) {
                            var b = f.memo.files[c];
                            b.get_div().remove();
                            Browse.files.removeItem(b)
                        }
                        if (Browse.files.length) {
                            if (Browse.keyboard_nav) {
                                if (d) {
                                    BrowseSelection.set_selected_files(d)
                                } else {
                                    BrowseSelection.set_selected_files(Browse.files.last())
                                }
                            }
                        } else {
                            Browse.show_empty()
                        }
                    } else {
                        if (Browse.keyboard_nav) {
                            Browse.select_fq_paths = [Browse.containing_fq_path() + "/" + f.memo.files.last().filename]
                        }
                        Browse.force_reload()
                    }
                }
            })
        });
        document.observe(ContextMenu.SHOW_EVT, Browse.disable_sorting);
        document.observe(ContextMenu.HIDE_EVT, Browse.enable_sorting)
    },
    disable_sorting: function () {
        $("browse-sort").stopObserving("click");
        $$("#browse-sort *").invoke("setStyle", {
            cursor: "default"
        })
    },
    enable_sorting: function () {
        $("browse-sort").stopObserving("click");
        $("browse-sort").on("click", "#browse-sort a.sortable-column-header", Browse.sort_handler);
        $$("#browse-sort *").invoke("setStyle", {
            cursor: "pointer"
        })
    },
    click: function (b, c) {
        var a = $(b.target);
        if (a.match("a.filename-link") || a.match("img.icon")) {
            Browse._click(b, c)
        }
    },
    dblclick: function (a, b) {
        if ($(a.target).match("a")) {
            return
        }
        Browse._click(a, b)
    },
    _click: function (b, c) {
        Browse.keyboard_nav = false;
        var a = BrowseFile.from_elem(c);
        if (a.editing) {
            return
        } else {
            if (a.dir) {
                if ((b.which == 2) || (Util.is_mac() && b.metaKey)) {
                    Browse.open_folder_in_new_window(a)
                } else {
                    Browse.open_folder(a)
                }
                b.preventDefault()
            } else {
                if (a.bytes > 0 && a.preview_type && !b.metaKey && !((a.preview_type == "video") && Constants.DISABLE_VIDEOS_IN_LIGHTBOX)) {
                    b.preventDefault();
                    BrowseUtil.filepreview_from_selected(a)
                } else {
                    b.preventDefault();
                    window.open(a.href, "_blank")
                }
            }
        }
    },
    crumb_click: function (d, a) {
        Browse.keyboard_nav = false;
        d.preventDefault();
        var c = a.readAttribute("data-fq_path");
        var b = Browse.details_from_fq_path(c);
        BrowseURL.set_path_url(b.ns_id, b.ns_path)
    },
    parent_click: function (d, c) {
        Browse.keyboard_nav = false;
        d.preventDefault();
        var b = c.readAttribute("data-parent_ns_path");
        var a = parseInt(c.readAttribute("data-parent_ns_id"), 10);
        BrowseURL.set_path_url(a, b)
    },
    selection_handler: function () {
        if (BrowseSelection.get_selected_files().length) {
            $("browse-box").addClassName("selected")
        } else {
            $("browse-box").removeClassName("selected")
        }
    },
    POST_SCROLL_WAIT: 100,
    _last_scroll_timeout: null,
    window_scroll: function (a) {
        clearTimeout(Browse._last_scroll_timeout);
        Browse._last_scroll_timeout = setTimeout(BrowseUtil.load_visible_thumbs, Browse.POST_SCROLL_WAIT)
    },
    updateOffset: function () {
        if (!Browse.div_parent) {
            return
        }
        Browse._cumulativeOffset = Browse.div_parent.cumulativeOffset();
        Browse.viewportOffset()
    },
    reset_sort: function () {
        Browse.last_sort = [Sort.FILES_BY_NAME, true];
        var a = "#browse-sort a.sortable-column-header";
        var b = $$(a)[0];
        Util.add_sort_arrow_mouseover(b, true, a, false);
        $("kind-sorter-label").__date(FlexColumn.DISPLAY.FILES_BY_KIND);
        Sprite.src(b.down("img"), "sort-uptick-off")
    },
    sort_handler: function (h, b) {
        b = $(b);
        b.blur();
        var g = b.readAttribute("data-sort");
        var f;
        if (Browse.last_sort[0] == Sort[g]) {
            f = b.readAttribute("data-ascending") == "false"
        } else {
            f = true
        }
        if (FlexColumn.LABELS.indexOf(g) !== -1) {
            var k = FlexColumn.SORT_FUNCTIONS.indexOf(Browse.last_sort[0]) != -1;
            if (k) {
                var a = (FlexColumn.LABELS.indexOf(g) + 1) % FlexColumn.LABELS.length;
                g = FlexColumn.LABELS[a];
                var d = FlexColumn.DISPLAY[g];
                $("kind-sorter-label").__date(d)
            }
            b.writeAttribute("data-sort", g);
            f = FlexColumn.IS_ASC[g]
        } else {
            b.writeAttribute("data-ascending", f ? "true" : "false")
        }
        Util.add_sort_arrow_mouseover(b, f, "#browse-sort a.sortable-column-header", true);
        var c = Sort[g];
        Browse.sort(c, f);
        if (h) {
            h.stop()
        }
    },
    toggle_deleted: function (a) {
        var b = BrowseURL.get_del() != 1;
        BrowseURL.set_del_url(b)
    },
    new_folder: function () {
        if (Browse.reloading || Browse.creating_folder) {
            return
        }
        Browse.hide_empty();
        Browse.selectable();
        var d = _("New folder");
        var b = [];
        for (var f = 0; f < Browse.files.length; f++) {
            if (Browse.files[f].dir && Browse.files[f].filename.indexOf(d) !== -1) {
                b.push(Browse.files[f].filename)
            }
        }
        var c = 1;
        var o = d;
        while (true) {
            if (b.indexOf(o) === -1) {
                break
            }
            o = d + " (" + c + ")";
            c++
        }
        var m = HTML.tmpl("new_folder_tmpl", {
            name: o
        });
        var h = -1;
        if (Browse.files.length) {
            var l = document.viewport.getScrollOffsets();
            if (l.top > 0) {
                var n = Browse.files[0].get_div().getLayout().get("margin-box-height");
                h = Math.floor(l.top / n)
            }
        }
        if (h > 0) {
            Browse.files[h].get_div().__sert({
                after: m
            })
        } else {
            $("browse-files").__sert({
                top: m
            })
        }
        var a = $$("#browse-files .browse-new-folder .name").first();
        assert(a !== "undefined");
        var p = Browse.containing_fq_path();
        var k = function (s) {
                var t = s.responseText.evalJSON(true);
                var r = FileOps.filename(t.fq_path);
                var q = _("Created folder '%(folder_name)s'").format({
                    folder_name: r.snippet().escapeHTML()
                });
                Notify.server_success(q);
                Browse.select_fq_paths = [t.fq_path];
                Browse.force_reload()
            };
        var e = function (r) {
                var q = $$("#browse-files li.browse-new-folder").first();
                if (q) {
                    q.remove()
                }
                Browse.creating_folder = false
            };
        var g = new Ajax.InPlaceEditor(a, "/cmd/new" + Util.urlquote(p) + "?long_running", {
            htmlResponse: false,
            okControl: false,
            cancelControl: false,
            highlightColor: "transparent",
            highlightEndColor: "transparent",
            clickToEditText: "",
            cols: 25,
            ajaxClass: Ajax.DBRequest,
            submitOnBlur: true,
            onFailure: function () {},
            onComplete: e.bind(this),
            savingText: _("Creating folder..."),
            onLeaveEditMode: Browse.unselectable,
            ajaxOptions: {
                method: "POST",
                onSuccess: k.bind(this)
            },
            callback: function (q, r) {
                Browse.creating_folder = true;
                return {
                    to_path: r || "",
                    folder: "yes"
                }
            }
        });
        g.enterEditMode()
    },
    open_folder: function (b) {
        assert(b.dir, "Only open directories, not files");
        if (!(BrowseSelection.get_selected_files().length === 1 && BrowseSelection.get_selected_files().indexOf(b) === 0)) {
            BrowseSelection.deselect_all();
            b.get_div().addClassName("file-select")
        }
        clearTimeout(Browse.folder_loading_notification);
        Browse.folder_loading_notification = setTimeout(function () {
            Notify.server_success(_("Loading %(filename)s...").format({
                filename: b.filename.em_snippet(50).escapeHTML()
            }), 60, true)
        }, 1000);
        var a, c;
        if (b.target_ns) {
            a = b.target_ns;
            c = ""
        } else {
            a = b.ns_id;
            c = b.ns_path
        }
        if (b.is_deleted) {
            BrowseURL.set_path_url(a, c, true)
        } else {
            BrowseURL.set_path_url(a, c)
        }
    },
    open_folder_in_new_window: function (a) {
        window.open(BrowseURL._make_url(a.ns_id, a.ns_path), "_blank")
    },
    emptyCheck: function () {
        if (!Browse.files.length) {
            Browse.show_message(_("Folder contains deleted files."))
        }
    },
    show_message: function (c) {
        if (typeof (c) != typeof ("string")) {
            var a = $("browse-files").down(".browse-message");
            if (a) {
                a.show()
            }
            return
        }
        Browse.msg = c;
        var b = new Element("div", {
            "class": "browse-message"
        }).__date(c);
        $("browse-files").__sert(b)
    },
    hide_message: function () {
        $$(".browse-message").invoke("hide")
    },
    sort: function (a, d, c) {
        if (!c && a == Browse.last_sort[0] && d == Browse.last_sort[1]) {
            return
        }
        Browse.last_sort = [a, d];
        var b = a(d);
        Browse.files.sort(b);
        Browse.smartfill();
        BrowseUtil.load_visible_thumbs()
    },
    resort: function (d) {
        var a = Browse.last_sort;
        var b = a[0];
        var c = a[1];
        Browse.sort(b, c, true)
    },
    in_search_mode: function () {
        return $("browse").hasClassName("search")
    },
    flex_column: function () {
        return $("kind-sorter").readAttribute("data-sort")
    },
    sorting_by_modified: function () {
        return Browse.last_sort[0] === Sort.FILES_BY_MODIFIED
    },
    smartfill: function () {
        var a = $("browse-files");
        a.__date();
        var c = [];
        for (var b = 0; b < Browse.files.length; b++) {
            c.push(Browse.compiled_tmpl({
                file: Browse.files[b],
                in_search_mode: Browse.in_search_mode(),
                flex_column: Browse.flex_column()
            }))
        }
        a.__date(c);
        document.fire(Browse.RENDER_EVT)
    },
    add_file: function (a) {
        Browse.files.push(a);
        if (a.bytes < 0) {
            Browse.deleted_shown = true
        }
    },
    get_file_pos: function (a) {
        var b = Browse.files.indexOf(a);
        assert(b !== -1, "file not present in Browse.files");
        assert(a.to_key() in BrowseFile._file_index, "file not present in BrowseFile._file_index");
        return b
    },
    remove_file: function (a) {
        assert(!Browse.deleted_shown, "doesn't use remove_file when showing deleted files.");
        var b = Browse.get_file_pos(a);
        Browse.files.splice(b, 1);
        delete BrowseFile._file_index[a.to_key()];
        a.get_div().remove()
    },
    update_file_pos: function (f) {
        var h = Browse.files.indexOf(f);
        if (h != -1) {
            Browse.files.splice(h, 1)
        }
        var c = Browse.last_sort[0];
        var g = Browse.last_sort[1];
        var e = Util.bsearch(Browse.files, f, c(g), true);
        Browse.files.splice(e, 0, f);
        var d = f.get_div();
        var a = $(d.parentNode);
        d.remove();
        var b = Browse.compiled_tmpl({
            file: f,
            in_search_mode: Browse.in_search_mode(),
            flex_column: Browse.flex_column()
        });
        var k = a.childElements();
        if (e < k.length) {
            a.childElements()[e].__sert({
                before: b
            })
        } else {
            a.__sert(b)
        }
    },
    find_file: function (a) {
        return Browse.files.find(function (b) {
            return b.fq_path == a
        })
    },
    reset_state: function () {
        Browse.msg = false;
        Browse.dragging = false;
        Browse.files = [];
        Browse.selected_files = [];
        Browse.checked_files = [];
        Browse.lact_checked = null;
        Browse.sel_clones = [];
        Browse.sel_clone_origin = null;
        Browse.selection = [];
        Browse.file_div_cache = null;
        Browse.has_parent_link = false;
        Browse.parent_link = null;
        BrowseFile._file_index = {};
        BrowseActions.kill_dropdowns();
        BrowseDrag._body_dragend()
    },
    clear: function () {
        $("browse-files").__date();
        Browse.hide_empty()
    },
    show_empty: function () {
        $("browse-empty").show();
        $(document.documentElement).removeClassName("earthrise")
    },
    hide_empty: function () {
        $("browse-empty").hide();
        $(document.documentElement).addClassName("earthrise")
    },
    update: function (a) {
        $("browse-box").show();
        $("browse-files").__date();
        if (typeof (a) === "string") {
            Browse.setup(Util.from_json(a))
        } else {
            Browse.setup(a)
        }
        Browse.resort();
        document.fire(Browse.UPDATE_EVT)
    },
    reload_fqpath: function (b, a) {
        return Browse.reload(null, Util.urlquote(b), a)
    },
    force_reload: function () {
        return Browse.reload(Browse.containing_ns_id(), Util.urlquote(Browse.containing_ns_path()), true)
    },
    set_title: function () {
        var a = Browse.containing_fq_path(),
            b;
        if (a) {
            b = FileOps.filename(a) + " - Dropbox";
            document.title = b
        } else {
            document.title = _("Home") + " - Dropbox"
        }
    },
    reload: function (a, e, d) {
        assert(e.search(DBHistory.URL_ESCAPE_REGEX) === -1, "Browse.reload ns_path contains an invalid character: # ; ? : @ & = + $ (ns_path = " + e + ")");
        a = a || Constants.root_ns;
        e = Util.normalize(e);
        if (BrowseUtil.get_mode() != BrowseUtil.BROWSE_MODE) {
            Browse.clear();
            BrowseUtil.set_browse_mode()
        }
        if (FileSearch._clear_on_reload) {
            FileSearch.clear_searchbox()
        }
        if (!FileQueue.uploading) {
            InlineUploadStatus.hide()
        }
        if (Browse.reloading) {
            return
        }
        if (Browse.inside_dir && e == Browse.containing_ns_path() && a == Browse.containing_ns_id() && !d) {
            return
        }
        var c = Browse.first_load ? Constants.referrer : "";
        var b = Browse.deleted_shown ? "?show_deleted=yes" : "";
        var f = {
            ns_id: a,
            referrer: c
        };
        f = Object.extend(f, Browse.extra_reload_args);
        T("Browse.reload:", e);
        Browse.reloading = true;
        new Ajax.DBRequest("/browse" + e + b, {
            parameters: f,
            onSuccess: function (m) {
                Browse.reset_state();
                Browse.update(m.responseText);
                (Browse.files.length ? Browse.hide_empty : Browse.show_empty)();
                clearTimeout(Browse.folder_loading_notification);
                if (Notify.cancel_on_reload) {
                    Notify.clear_all();
                    Notify.cancel_on_reload = false
                }
                if (Browse.select_fq_paths || Browse.select_index > -1) {
                    var l = [];
                    if (Browse.select_fq_paths) {
                        var k;
                        for (var h = 0; h < Browse.select_fq_paths.length; h++) {
                            k = Browse.find_file(Browse.select_fq_paths[h]);
                            if (k) {
                                l.push(k)
                            }
                        }
                    }
                    if (!l.length && Browse.select_index > -1) {
                        var g = Browse.files[Browse.select_index];
                        if (g) {
                            l.push(g)
                        }
                    }
                    if (l.length) {
                        BrowseSelection.set_selected_files(l);
                        Browse.scrollTo(l.first().get_div())
                    }
                    Browse.select_fq_paths = false;
                    Browse.select_index = -1
                } else {
                    window.scrollTo(0, 0)
                }
                Browse.set_title()
            },
            onFailure: function () {
                if (Browse.first_load) {
                    Browse.reload.defer(Constants.root_ns, "")
                }
            },
            cleanUp: function () {
                Browse.first_load = false;
                Browse.reloading = false
            },
            no_feed_reload: true,
            evalJSON: false
        });
        return true
    },
    unload: function () {
        Browse.reset_state();
        var a = $("dropdown");
        if (a) {
            a = Util.yank(a)
        }
    },
    can_get_details_from_fq_path: function (c) {
        var b = Browse.containing_fq_path();
        var a = Browse.containing_mount_point();
        return (a && c.startsWith(a)) || b.startsWith(c)
    },
    details_from_fq_path: function (d) {
        assert(Browse.can_get_details_from_fq_path(d));
        var b = Browse.containing_mount_point();
        var a, c, e;
        if (b && d.startsWith(b)) {
            a = Browse.containing_ns_id();
            c = d.slice(b.length);
            e = FileOps.filename(d)
        } else {
            a = Constants.root_ns;
            c = d;
            e = FileOps.filename(d)
        }
        return {
            ns_id: a,
            ns_path: c,
            fq_path: d,
            folder_name: e || "Dropbox",
            url: "/home" + d,
            icon: d.length ? "folder_32" : "dropbox_32"
        }
    },
    _make_breadcrumbs_data: function () {
        var e = Browse.containing_fq_path();
        var d = [],
            a = e.split("/");
        for (var b = 0; b < a.length; b++) {
            var c = Util.normalize(a.slice(0, b + 1).join("/"));
            d.push(Browse.details_from_fq_path(c))
        }
        return d
    },
    _MAX_BREADCRUMB_WIDTH: 17,
    _CONNECT_WIDTH: 1.64,
    breadcrumb: function () {
        var b = Browse._make_breadcrumbs_data();
        var c = b.collect(function (l) {
            return new Emstring(l.fq_path ? l.folder_name : "").length
        });
        var f = 0,
            d = 0;
        for (var e = b.length - 1; e >= 0; e--) {
            f += c[e];
            if (f > Browse._MAX_BREADCRUMB_WIDTH) {
                break
            }
            d += 1;
            f += Browse._CONNECT_WIDTH
        }
        var k = b.slice(0, b.length - Math.max(1, d));
        b = b.slice(k.length, b.length);
        if (!k.length && b.length > 1) {
            b.shift()
        }
        var g = b.pop();
        var h = HTML.tmpl("breadcrumb_tmpl", {
            breadcrumbs: b,
            dropdown: k,
            containing_fq_path: Browse.containing_fq_path()
        });
        var a = g.folder_name.em_snippet(Browse._MAX_BREADCRUMB_WIDTH);
        $("browse-location").__date(h);
        $("browse-location").__sert(a);
        if (k.length > 1) {
            Browse._render_breadcrumbs_dropdown(k)
        }
    },
    _render_breadcrumbs_dropdown: function (e) {
        var a = $("breadcrumbs-box");
        e.reverse();
        var c = HTML.tmpl("breadcrumb_li_tmpl", {
            breadcrumbs: e
        });
        $("browse-location").__sert(c);
        var b = $("breadcrumb-dropdown");
        var d = function (f) {
                f.stopPropagation();
                b.show();
                b.clonePosition(a, {
                    setWidth: 0,
                    setHeight: 0,
                    offsetTop: a.getHeight(),
                    offsetLeft: parseInt(a.getStyle("padding-left"), 10)
                })
            };
        a.observe("click", d);
        a.observe("dragover", d);
        document.observe("click", function () {
            a.removeClassName("down");
            b.hide()
        })
    },
    viewportOffset: function () {
        if (!Browse.files.length) {
            return
        }
        if (!Browse.div_parent) {
            var c = Browse.files[0].get_div().offsetParent;
            if (!c) {
                return
            }
            Browse._viewportOffset = {};
            Browse.div_parent = $(c);
            Browse._cumulativeOffset = Browse.div_parent.cumulativeOffset()
        }
        var a = Util.scrollLeft(Browse.div_parent);
        var b = Util.scrollTop(Browse.div_parent);
        if (!Browse.scrollTop || !Browse.scrollLeft || Browse.scrollTop != b || Browse.scrollLeft != a) {
            Browse._viewportOffset.top = Browse._cumulativeOffset.top - b;
            Browse._viewportOffset.left = Browse._cumulativeOffset.left - a;
            Browse.scrollLeft = a;
            Browse.scrollTop = b
        }
        return Browse._viewportOffset
    },
    selectable: function () {
        Util.enableSelection($("browse-files"))
    },
    unselectable: function () {
        Util.disableSelection($("browse-files"))
    },
    global_checkbox: function () {
        return Util.childElement(document.getElementById("select-all-sorter"), 0)
    },
    _header_offset: (function () {
        var a = $("browse-header");
        return a.getHeight() + a.cumulativeOffset().top
    }).cached(1000),
    scrollTo: function (a) {
        Browse.scrollToWithPadding(a, 3)
    },
    scrollToWithPadding: function (d, f) {
        if (!d) {
            return
        }
        var e = Util.viewport_dimensions(),
            a = Util.scroll_offsets(),
            g = d.cumulativeOffset().top - a.top,
            c = d.getHeight(),
            b = Browse._header_offset();
        if (g < b) {
            Util.scroll_to(0, a.top + g - b - f)
        } else {
            if (g + c > e.height) {
                Util.scroll_to(0, a.top + g + c - e.height + f)
            }
        }
        if ($("modal-overlay").visible() && $("modal").getStyle("position") === "absolute") {
            Modal.fix_position()
        }
    }
};
BrowseJump = {
    _active: "",
    _listening: false,
    _RESET_WAIT: 1000,
    _RESET_TIMER_ID: null,
    _CODEPOINTS: null,
    _BLACKLIST: ["/", "\\", ":", "?", "*", "<", ">", "|"].map(function (a) {
        return a.charCodeAt(0)
    }),
    update: function () {
        if (!BrowseJump._listening) {
            BrowseJump.listen();
            BrowseJump._listening = true
        }
        var d = [];
        for (var c = 0, a = Browse.files.length; c < a; c++) {
            var b = Browse.files[c];
            var e = BrowseJump.to_codepoint_list(b.filename);
            d.push([e, b])
        }
        d.sort(function (g, f) {
            return BrowseJump.cmp_codepoints(g[0], f[0])
        });
        BrowseJump._CODEPOINTS = d
    },
    reset: function () {
        BrowseJump._active = ""
    },
    is_active: function () {
        return BrowseJump._active
    },
    jump: function (a) {
        BrowseSelection.set_selected_files([a]);
        Browse.scrollTo(a.get_div())
    },
    listen: function () {
        document.observe("keypress", function (b) {
            if (Util.focus_in_input() || b.metaKey || b.altKey || b.altGraphKey || b.ctrlKey) {
                return
            }
            var a = b.charCode || b.keyCode;
            if (a < 32) {
                return
            }
            if (a >= 33 && a <= 40) {
                return
            }
            if (a === 32) {
                if (BrowseJump._active) {
                    b.preventDefault()
                } else {
                    return
                }
            }
            if (BrowseJump._BLACKLIST.indexOf(a) !== -1) {
                return
            }
            clearTimeout(BrowseJump._RESET_TIMER_ID);
            BrowseJump._active += String.fromCharCode(a).toLowerCase();
            BrowseJump.jump(BrowseJump.nearest_file(BrowseJump._active));
            BrowseJump._RESET_TIMER_ID = setTimeout(BrowseJump.reset, BrowseJump._RESET_WAIT)
        });
        [FileEvents.DELETE, FileEvents.COPY, FileEvents.MOVE, FileEvents.RENAME, FileEvents.PURGE, FileEvents.RESTORE, FileEvents.UPLOAD, FileEvents.SF_NEW, FileEvents.SF_LEAVE, FileEvents.SF_UNSHARE, FileEvents.SF_REJOIN, FileEvents.SF_IGNORE, FileEvents.LINKS_REMOVE].each(function (a) {
            document.observe(a, function (b) {
                BrowseJump.update()
            })
        })
    },
    nearest_file: function (d) {
        var e = BrowseJump.to_codepoint_list(d);
        var c = BrowseJump._CODEPOINTS;
        for (var b = 0, a = c.length; b < a; b++) {
            if (BrowseJump.cmp_codepoints(e, c[b][0]) < 1) {
                return c[b][1]
            }
        }
        return c[c.length - 1][1]
    },
    cmp_codepoints: function (c, b) {
        assert(c.length > 0 && b.length > 0, "bad input to cmp_codepoints");
        for (var a = 0; a < c.length; a++) {
            if (b[a] === undefined) {
                return 1
            }
            if (c[a] !== b[a]) {
                return c[a] < b[a] ? -1 : 1
            }
        }
        if (b.length > c.length) {
            return -1
        }
        return 0
    },
    to_codepoint_list: function (b) {
        b = b.toLowerCase();
        var a = [];
        for (var d = 0, c = b.length; d < c; d++) {
            a.push(b.charCodeAt(d))
        }
        return a
    }
};
BrowseDrag = {
    _BODY_DRAG_CLASS: "external_drag",
    _STATUS_CLASS: "dragging",
    _STATUS_OFFSET: 10,
    _SELECTION_CONST: "SELECTION",
    _current_item_key: null,
    _drag_from_window: false,
    _external_drop_indicators: false,
    init: function () {
        if (!Modernizr.draganddrop) {
            return
        }
        BrowseDrag.listen()
    },
    listen: function () {
        document.observe(Browse.UPDATE_EVT, BrowseDrag._update_body_data);
        document.body.on("dragleave", "[dropzone]", BrowseDrag._dropzone_dragleave);
        document.body.on("dragend", BrowseDrag._body_dragend);
        document.body.on("dragover", "[dropzone]", BrowseDrag._dropzone_dragover);
        if (Prototype.Browser.IE) {
            document.body.on("dragenter", "[dropzone]", BrowseDrag._dropzone_dragover);
            document.body.on("mousedown", BrowseDrag._ie_start_drags);
            document.body.on("mouseover", "a.filename-link", BrowseDrag._ie_mouseover)
        }
        document.body.observe("dragover", BrowseDrag._body_dragover);
        document.body.observe("dragleave", BrowseDrag._body_dragleave);
        document.body.observe("dragstart", BrowseDrag._body_dragstart);
        document.body.observe("mousemove", BrowseDrag._body_mousemove);
        document.body.on("dragstart", "li.browse-file", BrowseDrag._file_dragstart);
        document.observe(BrowseSelection.UPDATED_EVT, BrowseDrag._build_selected_drag_icon);
        document.body.on("mousedown", "li.browse-file", BrowseDrag._build_file_drag_icon);
        document.body.on("drop", "[dropzone]", BrowseDrag._drop)
    },
    _file_mousemove: function (b) {
        if (!window.event || window.event.button != 1) {
            return
        }
        var a = b.findElement("[draggable]");
        if (a && a != document && a.dragDrop) {
            a.dragDrop();
            BrowseDrag._ie_end_drags()
        }
    },
    _ie_start_drags: function (a, b) {
        if (b.tagName != "OBJECT" && $(b).match("[draggable]")) {
            $("browse-files").observe("mousemove", BrowseDrag._file_mousemove)
        }
    },
    _ie_end_drags: function () {
        $("browse-files").stopObserving("mousemove", BrowseDrag._file_mousemove)
    },
    _update_body_data: function () {
        $(document.documentElement).writeAttribute("dropzone", Browse.inside_dir ? "copy move" : false);
        $(document.documentElement).writeAttribute("data-fq_path", Browse.inside_dir ? Browse.containing_fq_path() : false)
    },
    _body_dragover: function (b) {
        var a = BrowseDrag._get_event_browse_files();
        if (a.length) {
            BrowseDrag._update_status_position(b, a)
        } else {
            if (!BrowseDrag._drag_from_window && b.dataTransfer && b.dataTransfer.types && b.dataTransfer.types.contains("Files") && CrossDomainUploader.supported() && CrossDomainUploader.enabled()) {
                BrowseDrag._add_external_drop_indicators()
            }
        }
    },
    _body_dragleave: function (c) {
        var a = c.x || c.clientX;
        var d = c.y || c.clientY;
        var b = Util.viewport_dimensions();
        if (a <= 0 || a >= b.width || d <= 0 || d >= b.height) {
            BrowseDrag._clear_hover_state();
            BrowseDrag._remove_external_drop_indicators()
        }
    },
    _body_dragstart: function (a) {
        BrowseDrag._drag_from_window = true
    },
    _body_dragend: function (b, a) {
        BrowseDrag._clear_hover_state();
        if ($("breadcrumb-dropdown")) {
            $("breadcrumbs-box").removeClassName("down");
            $("breadcrumb-dropdown").hide()
        }
        BrowseDrag._clear_event_browse_files();
        $(document.body).removeClassName(BrowseDrag._STATUS_CLASS);
        BrowseDrag._remove_drop_indicators();
        BrowseDrag._remove_external_drop_indicators();
        BrowseScroll.end();
        BrowseDrag._drag_from_window = false
    },
    _body_mousemove: function (a) {
        BrowseDrag._clear_hover_state();
        BrowseDrag._remove_external_drop_indicators()
    },
    _ie_mouseover: function (b, a) {
        a.focus()
    },
    _dropzone_dragover: function (f, a) {
        var c = BrowseDrag._get_event_browse_files();
        var d = BrowseDrag._target_fq_path(a);
        if (-1 != c.pluck("fq_path").indexOf(d)) {
            return
        }
        if (!BrowseDrag._can_drop(f, a)) {
            a.addClassName("drag_nodrop");
            return
        }
        if (Util.is_mac()) {
            f.dataTransfer.dropEffect = "copyMove"
        } else {
            f.dataTransfer.dropEffect = "move"
        }
        f.preventDefault();
        var b = $$(".dragover");
        b.removeItem(a);
        b.invoke("removeClassName", "dragover");
        a.addClassName("dragover")
    },
    _dropzone_dragleave: function (b, a) {
        BrowseDrag._clear_hover_state(a)
    },
    _file_dragstart: function (h, m) {
        Util.clear_selected();
        if (BrowseSelection.is_selecting()) {
            return h.preventDefault()
        }
        h.dataTransfer.effectAllowed = "copyMove";
        h.dataTransfer.setData("Text", "Dropbox");
        var g = BrowseFile.from_elem(m);
        BrowseDrag._set_event_browse_files(g);
        var c = BrowseDrag._get_event_browse_files();
        if (Constants.ADMIN && !g.dir) {
            var d = g.href;
            var f = (g.caption || _("file")).replace(/:/g, "-");
            var l = "application/octet-stream";
            try {
                h.dataTransfer.setData("DownloadURL", [l, f, d].join(":"))
            } catch (k) {}
        }
        var o = new Element("img", {
            src: "/static/images/icons/icon_spacer.gif",
            width: 1,
            height: 1
        });
        var n = true;
        try {
            h.dataTransfer.setDragImage(o, 150, 150)
        } catch (b) {
            n = Util.ie8
        }
        $(document.body).addClassName(BrowseDrag._STATUS_CLASS);
        BrowseDrag._add_drop_indicators(h);
        BrowseScroll.start();
        if (n) {
            BrowseDrag._update_status_position(h, c);
            var a = $("drag-status");
            a.removeClassName("rotatein").removeClassName("fadein").removeClassName("selection");
            if (c.length > 1) {
                a.addClassName("rotatein")
            }
            if (BrowseDrag._is_dragging_selection()) {
                a.addClassName("selection")
            }
            a.addClassName("fadein")
        }
    },
    _add_drop_indicators: function (a) {
        $$('[dropzone="copy move"]').each(function (b) {
            if (BrowseDrag._can_drop(a, b)) {
                b.addClassName("can_drop")
            }
        })
    },
    _remove_drop_indicators: function () {
        $$(".can_drop").invoke("removeClassName", "can_drop")
    },
    _add_external_drop_indicators: function () {
        $(document.body).addClassName("external-dragdrop");
        $("page-header").addClassName("external-dragdrop");
        $("browse-header").addClassName("external-dragdrop");
        if (!BrowseDrag._external_drop_indicators) {
            Notify.server_success(_("Drop your file(s) to upload."), 60)
        }
        BrowseDrag._external_drop_indicators = true
    },
    _remove_external_drop_indicators: function () {
        if (BrowseDrag._external_drop_indicators) {
            $(document.body).removeClassName("external-dragdrop");
            $("page-header").removeClassName("external-dragdrop");
            $("browse-header").removeClassName("external-dragdrop");
            Notify.clear_all();
            BrowseDrag._external_drop_indicators = false
        }
    },
    _build_selected_drag_icon: function () {
        var e = BrowseSelection.get_selected_files();
        var b = new Element("div", {
            id: "drag-selection-status"
        });
        for (var d = 0; d < e.length && d < 4; d += 1) {
            var c = e[d];
            var a = c.get_div().down(".icon");
            var f = a.cloneNode(false);
            Element.addClassName(f, "icon icon" + d);
            b.__sert(f)
        }
        var g = new Element("span", {
            className: "badge"
        }).__date(e.length);
        b.appendChild(g);
        $("drag-selection-status").replace(b)
    },
    _build_file_drag_icon: function (f, a) {
        var b = BrowseFile.from_elem(a);
        var c = b.get_div().down(".icon").cloneNode(false);
        Element.addClassName(c, "icon icon0");
        var d = new Element("span", {
            className: "badge"
        }).__date("1");
        var g = new Element("div", {
            id: "drag-file-status"
        });
        g.__date(c).__sert(d);
        $("drag-file-status").replace(g)
    },
    _drop: function (h, d) {
        h.preventDefault();
        var c = BrowseDrag._get_event_browse_files();
        var b = h.dataTransfer.files;
        var f;
        var g = BrowseFile.from_elem(d);
        var a = d.readAttribute("data-fq_path");
        if (g) {
            f = g.fq_path
        } else {
            if (a || "" === a) {
                f = a
            }
        }
        if (Constants.ADMIN && b && b.length) {
            if (!CrossDomainUploader.supported()) {
                Notify.server_error(_("Drag and drop not supported. Please try the simple uploader."))
            } else {
                if (!CrossDomainUploader.enabled()) {
                    Notify.server_error(_("You can't drag and drop upload right now."))
                } else {
                    CrossDomainUploader.upload(f, b)
                }
            }
        } else {
            if (c.length) {
                if ((h.dataTransfer.dropEffect == "copy") || (h.dataTransfer.effectAllowed == "copy")) {
                    FileOps.show_dragdrop_confirm(c, f, false)
                } else {
                    if (!Browse.inside_dir || Browse.containing_fq_path() != f) {
                        FileOps.show_dragdrop_confirm(c, f, true)
                    }
                }
            }
        }
        BrowseDrag._clear_hover_state();
        BrowseDrag._remove_drop_indicators();
        BrowseDrag._remove_external_drop_indicators()
    },
    _set_event_browse_files: function (a) {
        var b = BrowseSelection.is_selected(a);
        BrowseDrag._current_item_key = b ? BrowseDrag._SELECTION_CONST : a.to_key()
    },
    _clear_event_browse_files: function () {
        BrowseDrag._current_item_key = null
    },
    _get_event_browse_files: function () {
        try {
            var c = BrowseDrag._current_item_key;
            if (BrowseDrag._is_dragging_selection()) {
                return BrowseSelection.get_selected_files()
            } else {
                if (c) {
                    var b = BrowseFile.from_key(c);
                    return b ? [b] : []
                }
            }
        } catch (a) {
            console.log(a)
        }
        return []
    },
    _is_dragging_selection: function () {
        return BrowseDrag._current_item_key && BrowseDrag._current_item_key == BrowseDrag._SELECTION_CONST
    },
    _can_drop: function (d, b) {
        var a = BrowseDrag._target_fq_path(b);
        var c = BrowseDrag._get_event_browse_files();
        if (c.length) {
            return !FileOps.bulk_move_error(c, a)
        } else {
            if (-1 != $A(d.dataTransfer.types).indexOf("Files")) {
                return Prototype.BrowserFeatures.DB_CORS
            } else {
                return false
            }
        }
    },
    _target_fq_path: function (a) {
        var b = BrowseFile.from_elem(a);
        return b ? b.fq_path : a.readAttribute("data-fq_path")
    },
    _clear_hover_state: function (d) {
        var b = $$("#browse .dragover");
        for (var c = 0, a = b.length; c < a; c += 1) {
            var e = b[c];
            if (e != d) {
                e.removeClassName("dragover")
            }
        }
        $$("#browse .drag_nodrop").invoke("removeClassName", "drag_nodrop")
    },
    _update_status_position: function (b, a) {
        b = Event.extend(b);
        Util.scry("drag-status").setStyle({
            left: (b.pointerX() - Util.scroll_offsets().left + BrowseDrag._STATUS_OFFSET) + "px",
            top: (b.pointerY() - Util.scroll_offsets().top + BrowseDrag._STATUS_OFFSET) + "px"
        })
    }
};
BrowseScroll = (function () {
    var c, g, a = 40,
        d = 50;
    var b = function (m) {
            var l = $(m.target);
            if (l.descendantOf("browse-location") || l.match("#browse-location")) {
                g = undefined
            } else {
                var k = m.pointerY();
                g = k - Util.scroll_offsets().top
            }
        };
    var f = function () {
            d = $("browse-header").getHeight();
            document.observe("mousemove", b);
            document.observe("dragover", b)
        };
    var e = function () {
            document.stopObserving("mousemove", b);
            document.stopObserving("dragover", b)
        };
    var h = function () {
            var k;
            if (g < d) {
                k = -1 * a
            } else {
                if (g > Util.viewport_dimensions().height - d) {
                    k = a
                }
            }
            if (k) {
                Util.scroll_to(Util.scroll_offsets().left, Util.scroll_offsets().top + k)
            }
        };
    return {
        start: function () {
            f();
            c = setInterval(h, 100)
        },
        end: function () {
            e();
            clearInterval(c)
        }
    }
})();
var FileEvents = {
    DELETE: "db:bulk_delete",
    COPY: "db:bulk_copy",
    MOVE: "db:bulk_move",
    RENAME: "db:bulk_rename",
    PURGE: "db:bulk_purge",
    RESTORE: "db:bulk_restore",
    UPLOAD: "db:upload",
    SF_NEW: "db:sf_new",
    SF_LEAVE: "db:sf_leave",
    SF_UNSHARE: "db:sf_unshare",
    SF_REJOIN: "db:sf_rejoin",
    SF_IGNORE: "db:sf_ignore",
    LINKS_REMOVE: "db:link_remove"
};
var NOTIFICATION_SNIPPET_LEN = 40;
var FileOps = {
    folder_to_icon: function (c, a, b) {
        c = Util.normalize(c).toLowerCase();
        if (b) {
            return "folder_star"
        } else {
            if (a) {
                return "folder_user"
            } else {
                if (c == "/photos") {
                    return "folder_photos"
                } else {
                    if (c == "/public") {
                        return "folder_public"
                    } else {
                        return "folder"
                    }
                }
            }
        }
    },
    filename_to_icon: function (a) {
        var c = FileOps.file_extension(a).toLowerCase();
        var b = {
            exe: "page_white_gear",
            dll: "page_white_gear",
            xls: "page_white_excel",
            xlsx: "page_white_excel",
            ods: "page_white_tux",
            c: "page_white_c",
            h: "page_white_c",
            php: "page_white_php",
            mp3: "page_white_sound",
            wav: "page_white_sound",
            m4a: "page_white_sound",
            wma: "page_white_sound",
            aiff: "page_white_sound",
            au: "page_white_sound",
            ogg: "page_white_sound",
            doc: "page_white_word",
            docx: "page_white_word",
            odt: "page_white_tux",
            ppt: "page_white_powerpoint",
            pptx: "page_white_powerpoint",
            odp: "page_white_tux",
            txt: "page_white_text",
            rtf: "page_white_text",
            sln: "page_white_visualstudio",
            vcproj: "page_white_visualstudio",
            html: "page_white_code",
            htm: "page_white_code",
            psd: "page_white_paint",
            pdf: "page_white_acrobat",
            fla: "page_white_actionscript",
            swf: "page_white_flash",
            gif: "page_white_picture",
            png: "page_white_picture",
            jpg: "page_white_picture",
            jpeg: "page_white_picture",
            tiff: "page_white_picture",
            tif: "page_white_picture",
            bmp: "page_white_picture",
            odg: "page_white_picture",
            py: "page_white_code",
            gz: "page_white_compressed",
            tar: "page_white_compressed",
            rar: "page_white_compressed",
            zip: "page_white_compressed",
            iso: "page_white_dvd",
            css: "page_white_code",
            xml: "page_white_code",
            tgz: "page_white_compressed",
            bz2: "page_white_compressed",
            rb: "page_white_ruby",
            cpp: "page_white_cplusplus",
            java: "page_white_cup",
            cs: "page_white_csharp",
            ai: "page_white_vector"
        };
        return b[c] || "page_white"
    },
    show_confirm_restore_entire: function (b, a, c) {
        assert(a, "Missing csid");
        assert(b, "Missing when");
        assert(c !== undefined, "Missing fq_path");
        DomUtil.fillVal(b, "restore-entire-when");
        Modal.icon_show("alert_32", _("Rewind Dropbox"), DomUtil.fromElm("restore-entire"), {
            when: b,
            cs_id: a,
            fq_path: c,
            action: FileOps.do_rewind
        })
    },
    do_rewind: function () {
        var a = Modal.vars.cs_id;
        assert(a);
        var b = Modal.vars.fq_path;
        assert(b !== undefined);
        new Ajax.DBRequest("/cmd/rewind", {
            parameters: {
                cs_id: a,
                path: b
            },
            onComplete: function () {
                window.location.reload()
            }
        })
    },
    file_extension: function (a) {
        return a.split(".").last()
    },
    filename: function (b) {
        b = Util.normalize(b);
        b = b.split("/");
        var a = b.pop();
        if (a === "") {
            return _("Dropbox")
        }
        return a
    },
    dir_handler: function (d, c) {
        if (typeof (c) == "string") {
            c = $(c)
        }
        var b = $$(".treeview .highlight")[0];
        if (b) {
            b.removeClassName("highlight")
        }
        var a = c.up("div");
        a.addClassName("highlight");
        Modal.selected_div = a;
        if (Modal.shown()) {
            c.blur()
        }
        document.fire("db:dir_click", {
            path: d
        });
        Modal.vars.selected_path = d
    },
    show_folder_pick: function (h, f, e, g, a) {
        DomUtil.fillVal(FileOps.filename(f).escapeHTML(), "folder-pick-file");
        TreeView.move("copy-move-treeview", "folder-pick-treeview");
        TreeView.enable_shared("copy-move-treeview");
        var c = a ? "page_white_go_32" : "page_white_copy_32";
        var b = a ? _("Move") : _("Copy");
        DomUtil.fillVal(b, "folder-pick-action-text");
        Modal.icon_show(c, h, $("folder-pick"), {
            fq_path: f,
            action: e,
            folder: g
        });
        var d = $("first-treeview-link");
        d.onclick()
    },
    show_bulk_folder_pick: function (h, e, a, f) {
        var d = BrowseUtil.profile_files(a);
        var k = BrowseUtil.profile_summary(d);
        DomUtil.fillVal(k, "bulk-folder-pick-file");
        TreeView.move("copy-move-treeview", "bulk-folder-pick-treeview");
        TreeView.enable_shared("copy-move-treeview");
        var g = e == "move" ? "page_white_go_32" : "page_white_copy_32";
        var b = e == "move" ? _("Move") : _("Copy");
        DomUtil.fillVal(b, "bulk-folder-pick-action-text");
        Modal.icon_show(g, h, $("bulk-folder-pick"), {
            files: a,
            action: f
        });
        var c = $("first-treeview-link");
        c.onclick()
    },
    show_copy: function (a, b) {
        var c = b ? _("Copy folder to...") : _("Copy file to...");
        FileOps.show_folder_pick(c, a, FileOps.do_copy, b, false)
    },
    show_dragdrop_confirm: function (a, l, b) {
        var h = FileOps.filename(l) || "Dropbox";
        var k, d, c, g, e;
        if (b) {
            k = ungettext("Move %(item_count)s item", "Move %(item_count)s items", a.length).format({
                item_count: a.length
            });
            c = "Move";
            d = ungettext("Are you sure you want to move %(item_count)s item to '%(destination)s'?", "Are you sure you want to move %(item_count)s items to '%(destination)s'?", a.length).format({
                item_count: a.length,
                destination: h
            });
            g = "page_white_go_32";
            e = FileOps.do_bulk_move
        } else {
            k = ungettext("Copy %(item_count)s item", "Copy %(item_count)s items", a.length).format({
                item_count: a.length
            });
            c = "Copy";
            d = ungettext("Are you sure you want to copy %(item_count)s item to %(destination)s?", "Are you sure you want to copy %(item_count)s items to %(destination)s?", a.length).format({
                item_count: a.length,
                destination: h
            });
            g = "page_white_copy_32";
            e = FileOps.do_bulk_copy
        }
        DomUtil.fillVal(c, "dragdrop-folder-pick-action-text");
        Modal.icon_show(g, k, $("dragdrop-confirm-modal"), {
            files: a,
            to: l,
            action: e
        });
        $("dropdown-confirm-text").__date(d)
    },
    show_copy_bulk: function (a) {
        var b = ungettext("Copy %(item_count)s item to...", "Copy %(item_count)s items to...", a.length).format({
            item_count: a.length
        });
        FileOps.show_bulk_folder_pick(b, "copy", a, FileOps.do_bulk_copy)
    },
    show_move_bulk: function (a) {
        var b = ungettext("Move %(item_count)s item to...", "Move %(item_count)s items to...", a.length).format({
            item_count: a.length
        });
        FileOps.show_bulk_folder_pick(b, "move", a, FileOps.do_bulk_move)
    },
    show_move: function (a, b) {
        var c = b ? _("Move folder to...") : _("Move file to...");
        FileOps.show_folder_pick(c, a, FileOps.do_move, b, true)
    },
    show_delete: function (a, b) {
        DomUtil.fillVal("'" + FileOps.filename(a).escapeHTML() + "'", "delete-filename");
        var c = b ? _("Delete folder?") : _("Delete file?");
        Modal.icon_show("delete_32", c, DomUtil.fromElm("delete-file"), {
            fq_path: a,
            action: FileOps.do_delete,
            folder: b,
            wit_group: "delete-confirm"
        })
    },
    show_bulk_delete: function (b) {
        var c = ungettext("%(item_count)s item", "%(item_count)s items", b.length).format({
            item_count: b.length
        });
        DomUtil.fillVal(c, "delete-filename");
        var a = ungettext("Delete %(item_count)s item?", "Delete %(item_count)s items?", b.length).format({
            item_count: b.length
        });
        Modal.icon_show("delete_32", a, DomUtil.fromElm("delete-file"), {
            files: b,
            action: FileOps.do_bulk_delete,
            wit_group: "delete-bulk-confirm"
        })
    },
    show_purge: function (a, b) {
        DomUtil.fillVal("'" + FileOps.filename(a).escapeHTML() + "'", "purge-filename");
        var c = b ? _("Permanently delete folder?") : _("Permanently delete file?");
        Modal.icon_show("alert_32", c, DomUtil.fromElm("purge-file"), {
            fq_path: a,
            action: FileOps.do_purge,
            folder: b,
            wit_group: "purge-file-confirm"
        })
    },
    show_bulk_purge: function (b) {
        var c = ungettext("%(item_count)s item", "%(item_count)s items", b.length).format({
            item_count: b.length
        });
        DomUtil.fillVal(c, "purge-filename");
        var a = ungettext("Permanently delete %d item?", "Permanently delete %d items?", b.length).format(b.length);
        Modal.icon_show("alert_32", a, DomUtil.fromElm("purge-file"), {
            files: b,
            action: FileOps.do_bulk_purge,
            wit_group: "purge-bulk-confirm"
        })
    },
    show_bulk_restore: function (b) {
        var c = ungettext("%(item_count)s item", "%(item_count)s items", b.length).format({
            item_count: b.length
        });
        DomUtil.fillVal(c, "restore-filename");
        var a = ungettext("Restore %d item...", "Restore %d items...", b.length).format(b.length);
        Modal.icon_show("alert_32", a, DomUtil.fromElm("restore-file"), {
            files: b,
            action: FileOps.do_bulk_restore,
            wit_group: "restore-bulk-confirm"
        })
    },
    show_new_folder: function (a) {
        Modal.show(_("Create folder"), DomUtil.fromElm("new-folder"), {
            fq_path: a,
            action: FileOps.do_new_folder,
            wit_group: "show-new-folder"
        })
    },
    show_upload: function (a, b) {
        a = a || Browse.containing_fq_path();
        if (!FlashDetect.versionAtLeast(9)) {
            FileOps.show_basic_upload(a);
            $("enhanced-upload-toggle").hide();
            return
        }
        var d = FileOps.filename(a);
        DomUtil.fillVal("'" + d.escapeHTML() + "'", "upload-foldername");
        var c = _("Upload to '%(folder_name)s'").format({
            folder_name: d.em_snippet(20).escapeHTML()
        });
        Modal.icon_show("upload_32", c, DomUtil.fromElm("advanced-upload-modal"), {
            fq_path: a,
            action: FileOps.do_upload,
            wit_group: "advanced-uploader"
        }, false, false, FileQueue.num_files() && !b);
        if (!FileQueue.num_files() || b) {
            Upload.init(Util.normalize(a), true)
        } else {
            Upload.set_dest(Util.normalize(a))
        }
        InlineUploadStatus.hide()
    },
    show_basic_upload: function (a) {
        var c = FileOps.filename(a);
        DomUtil.fillVal("'" + c.escapeHTML() + "'", "basic-upload-foldername");
        var b = _("Upload to '%(folder_name)s'").format({
            folder_name: c.em_snippet(20).escapeHTML()
        });
        Modal.icon_show("upload_32", b, $("basic-upload-modal"), {}, false);
        Upload.set_dest(Util.normalize(a));
        Upload.init_basic()
    },
    show_undelete: function (a) {
        DomUtil.fillVal(a.filename.escapeHTML(), "undelete-filename");
        var b = Sprite.make(a.icon, {});
        b.addClassName("link-img");
        b.style.backgroundColor = "transparent";
        var c = "/revisions" + Util.urlquote(a.fq_path) + "?undelete=1";
        $$(".undelete-icon").invoke("update", b);
        $$(".undelete-other-versions")[0].href = c;
        $$(".undelete-link")[0].href = c;
        $("undelete-form").action = "/revisions" + Util.urlquote(a.fq_path);
        var d = _("Restore file?");
        Modal.icon_show("alert_32", d, $("undelete-modal"), {
            file: a
        })
    },
    do_undelete: function (f) {
        var c = Modal.vars.file;
        var d = $("undelete-form");
        var a = _("Restored '%(file_name)s'").format({
            file_name: c.filename
        });
        var b = _("Error, unable to restore '%(file_name)s'").format({
            file_name: c.filename
        });
        Forms.ajax_submit(d, false, function () {
            Modal.hide();
            Notify.server_success(a);
            document.fire(FileEvents.RESTORE, {
                files: [c]
            })
        }, function () {
            Notify.server_error(b)
        }, f.target);
        return false
    },
    do_copy: function (c, b) {
        c = c || Modal.vars.fq_path;
        b = b || Modal.vars.selected_path;
        var a = Browse.find_file(c);
        assert(a, "Trying to copy a file we couldn't find.");
        FileOps.do_bulk_copy([a], b)
    },
    do_bulk_copy: function (d, a) {
        d = d || Modal.vars.files;
        assert(d.length > 0, "Tried to copy 0 files");
        if (typeof (a) === "undefined") {
            if (typeof (Modal.vars.selected_path) === "undefined") {
                Notify.server_error(_("You need to select a destination for the file."));
                return
            } else {
                a = Modal.vars.selected_path
            }
        }
        a = Util.normalize(a);
        for (var b = 0; b < d.length; b += 1) {
            if (d[b].dir) {
                if ((a + "/").indexOf(d[b].fq_path + "/") === 0) {
                    Notify.server_error(_("You cannot copy a folder into itself."));
                    return
                }
            }
        }
        var c = d.pluck("fq_path");
        new Ajax.DBRequest("/cmd/copy", {
            parameters: {
                files: c,
                to_path: a
            },
            job: true,
            progress_text: _("Copying..."),
            onSuccess: function (g) {
                var f = c.length;
                var e = FileOps.filename(a).em_snippet(NOTIFICATION_SNIPPET_LEN).escapeHTML();
                var h = ungettext("Copied %(count)d item to '%(location)s'", "Copied %(count)d items to '%(location)s'", f);
                h = h.format({
                    count: f,
                    location: e
                });
                Notify.server_success(h);
                TreeView.schedule_reset();
                document.fire(FileEvents.COPY, {
                    files: d,
                    to_fq_path: a
                })
            }
        })
    },
    bulk_move_error: function (a, k) {
        var l = Browse.find_file(k);
        var e = BrowseUtil.profile_files(a);
        var c, g, h;
        if (l) {
            g = l.dir;
            c = l.fq_path;
            h = l.target_ns || l.ns_id
        } else {
            if (Browse.inside_dir && Browse.can_get_details_from_fq_path(k)) {
                var d = Browse.details_from_fq_path(k);
                g = true;
                c = d.fq_path;
                h = d.ns_id
            } else {
                g = true;
                c = k;
                h = undefined
            }
        }
        var m = a.pluck("fq_path").collect(Util.normalize);
        if (-1 != m.indexOf(Util.normalize(c))) {
            return _("You cannot copy a folder into itself.")
        }
        var f = function b(n) {
                var o = Util.parentDir(n.fq_path);
                return o == c
            };
        if (a.all(f)) {
            return ungettext("That file already exists in that folder.", "Those files already exist in that folder.", a.length)
        }
        if (!g) {
            return _("You cannot put files inside one another.")
        }
        if (e.target_namespaces > 0 && h && h != Constants.root_ns) {
            if (e.sandboxes > 0) {
                return _("You're not allowed to put an application folder inside a special folder.")
            } else {
                if (e.shared_folders > 0) {
                    return _("You're not allowed to put a shared folder inside a special folder.")
                } else {
                    return _("You're not allowed to nest special folders.")
                }
            }
        }
        if (c == "/Public" && e.target_namespaces > 0) {
            return _("You're not allowed to move shared folders to your Public folder.")
        }
        if (e.public_folder > 0) {
            return _("You're not allowed to move your Public folder.")
        }
        if (e.photos_folder > 0) {
            return _("You're not allowed to move your Photos folder.")
        }
        if (e.deleted > 0) {
            return _("Moving deleted folders or files is not allowed.")
        }
    },
    do_move: function (c, b) {
        c = c || Modal.vars.fq_path;
        b = b || Modal.vars.selected_path;
        var a = Browse.find_file(c);
        assert(a, "Trying to move a file we couldn't find.");
        FileOps.do_bulk_move([a], b)
    },
    do_bulk_move: function (f, h) {
        f = f || Modal.vars.files;
        if (!f) {
            return
        }
        assert(f.length > 0, "Tried to move 0 files");
        var b = h || Modal.vars.selected_path || "";
        b = Util.normalize(b);
        var c = FileOps.bulk_move_error(f, b);
        if (c) {
            Notify.server_error(c);
            return
        }
        var g = false;
        for (var d = 0; d < f.length; d++) {
            var a = h + "/" + f[d].filename;
            if (a != f[d].fq_path) {
                g = true;
                break
            }
        }
        if (!g) {
            return
        }
        var e = f.pluck("fq_path");
        new Ajax.DBRequest("/cmd/move", {
            parameters: {
                files: e,
                to_path: b
            },
            job: true,
            progress_text: _("Moving..."),
            onSuccess: function (m) {
                var l = e.length;
                var k = FileOps.filename(b).em_snippet(NOTIFICATION_SNIPPET_LEN).escapeHTML();
                var n = ungettext("Moved %(count)d item to '%(location)s'", "Moved %(count)d items to '%(location)s'", l);
                n = n.format({
                    count: l,
                    location: k
                });
                Notify.server_success(n);
                TreeView.schedule_reset();
                document.fire(FileEvents.MOVE, {
                    files: f,
                    to_fq_path: b
                })
            },
            onFailure: function (k) {
                Notify.server_error(_("Error, please try again"))
            }
        })
    },
    do_bulk_delete: function (b) {
        b = b || Modal.vars.files;
        assert(b.length > 0, "Tried to delete 0 files");
        var a = b.collect(function (c) {
            return c.fq_path
        });
        new Ajax.DBRequest("/cmd/delete", {
            parameters: {
                files: a
            },
            job: true,
            progress_text: _("Deleting..."),
            onSuccess: function (c) {
                var d = ungettext("Deleted %d item", "Deleted %d items", a.length).format(a.length);
                Notify.server_success(d);
                TreeView.schedule_reset();
                document.fire(FileEvents.DELETE, {
                    files: b
                })
            }
        })
    },
    do_delete: function (b) {
        var a = Browse.find_file(b || Modal.vars.fq_path);
        assert(a, "Trying to delete a file we couldn't find.");
        FileOps.do_bulk_delete([a])
    },
    do_nonbrowse_delete: function (a) {
        new Ajax.DBRequest("/cmd/delete", {
            parameters: {
                files: [a]
            },
            onSuccess: function (b) {
                Notify.server_success(_("Deleted 1 item"));
                document.fire(FileEvents.DELETE, {
                    fq_paths: [a]
                })
            }
        })
    },
    do_purge: function () {
        var a = Browse.find_file(Modal.vars.fq_path);
        assert(a, "Trying to purge a file we couldn't find.");
        FileOps.do_bulk_purge([a])
    },
    do_bulk_purge: function (b) {
        b = b || Modal.vars.files;
        assert(b.length > 0, "Tried to purge 0 files");
        var a = b.collect(function (d) {
            return d.fq_path
        });
        var c = ungettext("Permanently deleted %d item", "Permanently deleted %d items", a.length).format(a.length);
        new Ajax.DBRequest("/cmd/purge", {
            parameters: {
                files: a
            },
            job: true,
            progress_text: _("Deleting..."),
            onSuccess: function (d) {
                Notify.server_success(c);
                TreeView.schedule_reset();
                document.fire(FileEvents.PURGE, {
                    files: b
                })
            }
        })
    },
    do_bulk_restore: function (b) {
        b = b || Modal.vars.files;
        assert(b.length > 0, "Tried to restore 0 files");
        var a = b.collect(function (d) {
            return d.fq_path
        });
        var c = ungettext("Restored %d item", "Restored %d items", a.length).format(a.length);
        new Ajax.DBRequest("/cmd/restore", {
            parameters: {
                files: a
            },
            job: true,
            progress_text: _("Restoring..."),
            onSuccess: function (d) {
                Notify.server_success(c);
                TreeView.schedule_reset();
                document.fire(FileEvents.RESTORE, {
                    files: b
                })
            }
        })
    },
    do_upload: function () {
        $("dest-folder").value = Modal.vars.fq_path;
        $("upload-form").submit();
        frames["upload-frame"].onload = function (a) {
            var b = a.target.documentElement.textContent;
            if (b == "winner!") {
                Notify.server_success(_("Uploaded file successfully"));
                document.fire(FileEvents.UPLOAD, {
                    to_fq_path: Modal.vars.fq_path
                })
            } else {
                Notify.server_error(_("Upload error, please try again"))
            }
        }
    },
    do_bulk_download: function (b) {
        var c = new Element("form", {
            action: "https://" + Constants.BLOCK_CLUSTER + "/zip_batch",
            method: "post"
        });
        for (var a = 0; a < b.length; a += 1) {
            Forms.add_vars(c, {
                files: b[a].fq_path
            })
        }
        Forms.add_vars(c, {
            parent_path: Browse.block_hash_param || "/",
            w: Browse.block_hash
        });
        $(document.body).insert(c);
        c.submit()
    }
};
var ProgressBar = {
    MAGIC: 42,
    make: function (a, b, c) {
        b = b || 300;
        var f = b.toString() + "px";
        c = typeof (c) != "undefined" ? c : "0%";
        var k = new Element("div", {
            "class": "outer-progress-bar",
            style: "width: " + f
        });
        var l = new Element("div", {
            "class": "inner-progress-bar",
            id: "pb_" + a,
            style: "width: " + f
        });
        var g = new Element("div", {
            "class": "under-pb progress-bar",
            style: "width: " + f
        });
        var e = new Element("div", {
            style: "display: none",
            "class": "over-pb progress-bar",
            id: "pb_" + a + "_over"
        });
        var d = new Element("div", {
            "class": "pb-percentage",
            id: "pb_" + a + "_upct",
            style: "width: " + f
        });
        d.update(c);
        var h = new Element("div", {
            "class": "pb-percentage",
            id: "pb_" + a + "_opct",
            style: "width: " + f
        });
        h.update(c);
        g.insert(d);
        e.insert(h);
        l.insert(g);
        l.insert(e);
        k.insert(l);
        e.progress_width = b;
        return k
    },
    reset: function (a) {
        ProgressBar.set(a, 0)
    },
    set: function (e, a, d) {
        a = Math.min(a, 1);
        d = typeof (d) != "undefined" && d !== false ? d : Math.floor(a * 100).toString() + "%";
        var c = $("pb_" + e + "_over");
        if (!c) {
            return
        }
        var b = c.progress_width * a;
        c.show();
        c.makeClipping().setStyle({
            width: b.toString() + "px",
            backgroundColor: "#348DD3"
        });
        $("pb_" + e + "_upct").innerHTML = d;
        $("pb_" + e + "_opct").innerHTML = d
    },
    get_frac: function (b) {
        var a = $("pb_" + b + "_over");
        return parseInt(a.style.width, 10) / a.progress_width
    },
    errorState: function (d, a) {
        a = a || "Error";
        var c = $("pb_" + d + "_over");
        if (!c) {
            return
        }
        var b = c.progress_width;
        c.show();
        c.makeClipping().setStyle({
            width: b.toString() + "px",
            backgroundColor: "#d23a3a"
        });
        $("pb_" + d + "_upct").innerHTML = a;
        $("pb_" + d + "_opct").innerHTML = a
    }
};
var ModalProgress = {
    show: function (c, a) {
        if (!c) {
            return
        }
        a = $(a || "browse-box");
        var b = $("modal-progress-overlay");
        b.clonePosition(a);
        if (!b.getWidth()) {
            return
        }
        $("modal-progress-text").update(c);
        $("modal-progress-bar").setOpacity(1);
        $("modal-progress-bar").update(ProgressBar.make("modal-progress", 150, ""));
        Effect.Appear(b, {
            to: 0.7,
            duration: 0.25
        });
        Effect.Appear("modal-progress-content", {
            duration: 0.25
        })
    },
    update: function (a) {
        if (a.indexOf("/") > 0) {
            var b = a.split("/");
            a = Number(b[0]) / Number(b[1])
        }
        if (a) {
            ProgressBar.set("modal-progress", a, "")
        }
    },
    hide: function () {
        Effect.Fade("modal-progress-overlay", {
            duration: 0.25
        });
        Effect.Fade("modal-progress-content", {
            duration: 0.25
        })
    }
};
var Job = {
    complete: {},
    handled: function (a) {
        if (!a) {
            return false
        }
        var b = !! Job.complete[a];
        Job.complete[a] = true;
        return b
    },
    peek: function (a) {
        if (!a) {
            return false
        }
        return !!Job.complete[a]
    }
};
var ProgressWatcher = {
    job_info: {},
    INIT_POLL_INT: 1000,
    FAILS_MEAN_FAIL: 3,
    MODAL_WAIT_MS: 1000,
    watch: function (a) {
        ProgressWatcher.job_info[a.job_id] = {};
        var b = ProgressWatcher.job_info[a.job_id];
        b.req = a;
        b.poll_int = ProgressWatcher.INIT_POLL_INT;
        b.poll_count = 0;
        b.int_id = setInterval(ProgressWatcher.update_for(a.job_id), b.poll_int);
        b.failures = 0;
        b.start_time = Util.time()
    },
    update_for: function (a) {
        return function () {
            return ProgressWatcher.update(a)
        }
    },
    backoff: function (b) {
        var a = ProgressWatcher.job_info[b];
        clearInterval(a.int_id);
        a.poll_int = Math.min(Math.floor(a.poll_int * 1.5), 30000);
        a.int_id = setInterval(ProgressWatcher.update_for(b), a.poll_int)
    },
    update: function (c) {
        var b = ProgressWatcher.job_info[c];
        if (Job.peek(c)) {
            return ProgressWatcher.done(c)
        }
        b.poll_count++;
        if (b.poll_count % 10 === 0) {
            ProgressWatcher.backoff(c)
        }
        if (!b.modaled && Util.time() - b.start_time > ProgressWatcher.MODAL_WAIT_MS) {
            var a = b.req.options;
            ModalProgress.show(a.progress_text, a.cover_this);
            a.onProgress = ModalProgress.update;
            b.modaled = true
        }
        new Ajax.Request("/job_status/" + c, {
            method: "post",
            t: Constants.TOKEN,
            onSuccess: function (f) {
                var k = ProgressWatcher.job_info[c];
                var d = f.responseText;
                if (d.indexOf("err") === 0) {
                    ProgressWatcher.done(c);
                    ModalProgress.hide();
                    if (k.req.options.onFailure && !Job.handled(c)) {
                        k.req.options.onFailure(f)
                    }
                    return
                }
                if (d.indexOf("done") === 0) {
                    k.req.options.job = false;
                    if (!Job.handled(c)) {
                        new Ajax.Request("/job_results/" + c, {
                            onSuccess: function (e) {
                                if (Job.handled(c)) {
                                    return
                                }
                                Notify.clear_if(RequestWatcher.working_msg);
                                if (k.req.options.onSuccess) {
                                    k.req.options.onSuccess(e)
                                }
                            },
                            onFailure: function (e) {
                                if (Job.handled(c)) {
                                    return
                                }
                                Notify.clear_if(RequestWatcher.working_msg);
                                if (k.req.options.onFailure) {
                                    k.req.options.onFailure(e)
                                }
                            }
                        })
                    }
                    var h = d.split("/");
                    d = h[1] + "/" + h[1];
                    ProgressWatcher.done(c);
                    ModalProgress.hide()
                } else {
                    try {
                        if (k.req.options.onProgress) {
                            k.req.options.onProgress(f.responseText)
                        }
                    } catch (g) {}
                }
            },
            onFailure: function (d) {
                var e = ProgressWatcher.job_info[c];
                e.failures++;
                if (e.failures >= ProgressWatcher.FAILS_MEAN_FAIL) {
                    if (e.req.options.onFailure) {
                        e.req.options.onFailure(d, true)
                    }
                    RequestWatcher.remove(e.req);
                    ProgressWatcher.done(c);
                    ModalProgress.hide()
                }
            }
        })
    },
    done: function (b) {
        var a = ProgressWatcher.job_info[b];
        clearInterval(a.int_id);
        delete ProgressWatcher.job_info[b];
        ModalProgress.hide()
    }
};
var Forms = {
    submitOnlyOnce: function () {
        var a = Forms.submitted !== true;
        Forms.submitted = true;
        return a
    },
    disable: function (a) {
        if (a) {
            setTimeout(function () {
                a.disabled = true
            }, 0)
        }
    },
    enable: function (a) {
        if (a) {
            setTimeout(function () {
                a.disabled = false
            }, 0)
        }
    },
    clearInput: function (b, a) {
        b = $(b);
        if (b.value == a) {
            b.value = "";
            b.style.color = "#444444"
        }
    },
    add_vars: function (b, c) {
        b = $(b);
        for (var a in c) {
            if (c.hasOwnProperty(a)) {
                var d = new Element("input", {
                    type: "hidden",
                    name: a
                });
                d.setValue(c[a]);
                d.addClassName("added-vars");
                b.insert(d)
            }
        }
    },
    clear_added_vars: function (a) {
        $$(".added-vars").each(Element.remove)
    },
    mirror: function (c, b) {
        c = $(c);
        b = $(b);

        function a(e, d) {
            d.setValue($F(e));
            d.fire("db:value_change")
        }
        if (c && b) {
            c.observe("keyup", function () {
                a(c, b)
            });
            c.observe("db:autocompleted", function () {
                a(c, b)
            });
            b.observe("keyup", function () {
                a(b, c)
            });
            b.observe("db:autocompleted", function () {
                a(b, c)
            })
        }
    },
    collect_form_vars: function (d) {
        d = d || $(document.body);
        var c = d.select("input").concat(d.select("textarea")).concat(d.select("select"));
        var a = {};
        for (var b = 0; b < c.length; b++) {
            var f = c[b];
            if (f.name && f.name != "t") {
                var e = f.getValue();
                if (e) {
                    if (typeof (e) != "string") {
                        e = e.join(",")
                    }
                    if (a[f.name] !== undefined) {
                        if (typeof (a[f.name]) == "string") {
                            a[f.name] = [a[f.name], e]
                        } else {
                            a[f.name].push(e)
                        }
                    } else {
                        a[f.name] = e
                    }
                }
            }
        }
        return a
    },
    add_loading: function (b) {
        if (b) {
            b = $(b);
            var a = new Element("img", {
                src: "/static/images/icons/ajax-loading-small.gif"
            });
            a.addClassName("text-img ajax_submit_loading");
            b.insert({
                before: a
            })
        }
    },
    remove_loading: function (a) {
        $$(".ajax_submit_loading").each(function (b) {
            Util.yank(b)
        })
    },
    ajax_submit: function (d, b, g, e, c, a) {
        if (d.ajax_submitted) {
            return false
        }
        d.ajax_submitted = true;
        d.select(".suggestion-input").each(function (h) {
            SuggestionInput.blank(h.identify())()
        });
        if (c) {
            Forms.add_loading(c)
        }
        var f = Forms.collect_form_vars(d);
        if (a) {
            f = $H(f).update(a).toObject()
        }
        new Ajax.DBRequest(b || d.action, {
            noAutonotify: true,
            parameters: f,
            evalJSON: false,
            onSuccess: function (h) {
                if (g && typeof (g) == "function") {
                    g(h)
                }
            },
            onFailure: function (l) {
                if (l) {
                    if (l.responseText.indexOf("err:") === 0) {
                        var h = l.responseText.substr(4);
                        if (h.indexOf("{") === 0) {
                            var k = h.evalJSON(true);
                            Forms.fill_errors(d, k)
                        } else {
                            Notify.server_error(h)
                        }
                    } else {
                        Notify.server_error()
                    }
                    if (e && typeof (e) == "function") {
                        e(l)
                    }
                }
            },
            onComplete: function (h) {
                d.ajax_submitted = false;
                Forms.remove_loading()
            }
        });
        return false
    },
    clear_errors: function (a) {
        a = a || $(document.body);
        a.select(".error-removable").invoke("remove")
    },
    fill_errors: function (d, c) {
        c = c || {};
        d = d || $(document.body);
        Forms.clear_errors(d);
        for (var e in c) {
            if (c.hasOwnProperty(e)) {
                var f = d.down("[data-error-field-name='" + e + "']") || d.down("[name='" + e + "']");
                if (f) {
                    var b = new Element("br", {
                        "class": "error-removable"
                    });
                    var a = new Element("span", {
                        "class": "error-message error-removable"
                    });
                    a.update(c[e]);
                    f.insert({
                        before: a
                    });
                    f.insert({
                        before: b
                    })
                }
            }
        }
    },
    value: function (c) {
        var b = $$('input[name="' + c + '"]');
        var e = null;
        var a = b.length;
        for (var d = 0; d < a; d++) {
            e = $(b[d]).getValue() || e
        }
        return e
    },
    postRequest: function (c, d, a) {
        assert(c !== undefined, "postRequest missing action");
        d = d || {};
        a = a || {};
        d.t = Constants.TOKEN;
        var b = new Element("form", {
            action: c,
            method: "POST"
        });
        if (a.target) {
            b.target = a.target
        }
        document.body.appendChild(b);
        Forms.add_vars(b, d);
        b.submit()
    }
};
var Referral, Invitations, ReferralRegisterAB, Account;
Referral = {
    select_all: 1,
    show_login_modal: function (a) {
        Modal.show(_("Invite contacts from your email address book"), $("cli-login"), a || {})
    },
    get_selected_emails: function () {
        var a = [];
        $$("#contact-list input").each(function (b) {
            if (b.checked) {
                a.push(b.value)
            }
        });
        return a.join(", ")
    },
    send_invites: function (a) {
        var b = Referral.get_selected_emails();
        Invitations.do_send(b, false, a, true);
        Modal.hide()
    },
    show_contact_info_modal: function () {
        Modal.show(_("Invite contacts from your email account"), DomUtil.fromElm("contact-info-modal"), {
            action: Referral.fetch_contacts,
            wit_group: "contact_importer_login"
        });
        $("email-prefix").focus();
        return false
    },
    show_error: function (a) {
        Referral.hide_captcha();
        $("contact-info-error").update(a);
        $("contact-info-error").show()
    },
    error_messages: [N_("Bad user name or password"), N_("Bad user name"), N_("Bad password"), N_("Captcha challenge was raised"), N_("Captcha challenge raised"), N_("Captcha challenge was issued. Please login through Yahoo mail manually."), N_("AOL requires you to answer some security questions"), N_("Email address has not been verified"), N_("Account closed by system operator"), N_("Account deleted"), N_("Account disabled"), N_("Service disabled"), N_("Authorization required"), N_("Unknown gmail error"), N_("Gmail terms not agreed"), N_("Google contacts service unavailable. Try again later.")],
    show_captcha: function (a) {
        Referral.hide_captcha();
        a = a.evalJSON(true);
        $("captcha-row").hide();
        $("contact-info-captcha-image").src = a.image.replace("http://", "https://");
        $("contact-info-captcha-image").hide();
        Element.observe("contact-info-captcha-image", "load", function () {
            $("contact-info-captcha-image").show()
        });
        $("contact-info-captcha-id").value = a.id;
        $("contact-info-captcha-answer").value = "";
        $("captcha-row").show();
        $("captcha-answer-row").show();
        $("contact-info-error").update(_("Captcha required"));
        $("contact-info-error").show()
    },
    hide_captcha: function () {
        $("contact-info-captcha-id").value = "";
        $("contact-info-captcha-answer").value = "";
        $("captcha-row").hide();
        $("captcha-answer-row").hide()
    },
    parse_contacts: function (a) {
        a = a.substr(9);
        return a
    },
    fetch_contacts: function (b) {
        Event.stop(b);
        var d = $F("username");
        var c = "";
        if (d.indexOf("@") > 0) {
            var a = d.split("@");
            d = a.first();
            c = a.last()
        }
        Referral.fetch_and_show_contacts(b, d, c, $F("email-password"), $F("contact-info-captcha-id"), $F("contact-info-captcha-answer"))
    },
    fetch_and_show_contacts: function (f, c, h, b, a, d) {
        if (f) {
            Event.stop(f)
        }
        $("contact-info-error").hide();
        Referral.show_loading_modal(h.split(".")[0]);
        c = h !== "" ? c + "@" + h : c;
        var g = {
            email: c,
            password: b,
            select_all: Referral.select_all ? 1 : 0
        };
        if (a && d) {
            Object.extend(g, {
                captcha_id: a,
                captcha_answer: d
            })
        }
        new Ajax.DBRequest("/import_contacts", {
            noAutonotify: true,
            parameters: g,
            onSuccess: function (e) {
                contacts = Referral.parse_contacts(e.responseText);
                Referral.show_select_contacts(contacts)
            },
            onFailure: function (k) {
                if (k.responseText.indexOf("err:") === 0) {
                    var e = k.responseText.substr(4);
                    if (e.indexOf("captcha:") !== 0) {
                        if (Referral.hide_on_error) {
                            Modal.hide()
                        } else {
                            Referral.show_login_modal()
                        }
                        Referral.show_error(_(e))
                    } else {
                        if (Referral.hide_on_error) {
                            Modal.hide()
                        } else {
                            Referral.show_login_modal()
                        }
                        Referral.show_captcha(e.substr(8))
                    }
                } else {
                    Referral.show_error(_("Unexpected server error."));
                    if (Referral.hide_on_error) {
                        Modal.hide()
                    } else {
                        Referral.show_login_modal()
                    }
                }
            },
            cleanUp: function () {
                $("modal-title").show()
            }
        })
    },
    show_loading_modal: function (a) {
        var b = ["gmail", "yahoo", "aol", "hotmail", "live", "msn"];
        if (b.indexOf(a) > -1) {
            $("email-provider-img").src = "/static/images/referrals_" + a + ".png";
            $("email-provider-img").show()
        } else {
            $("email-provider-img").hide()
        }
        Modal.show("Loading contacts", $("loading-contacts-modal"), {}, "");
        $("modal-title").hide()
    },
    show_select_contacts: function (g) {
        if (g.length) {
            $("contact-list").innerHTML = g;
            SuggestionInput.reset("contact-filter");
            var h = $$("#contact-list img").length;
            if (h === 0) {
                $("dropbox-users-text").style.visibility = "hidden"
            }
            var e = $$(".contact-row").length;
            var a = ungettext("Good news! We've found %d contact. Select the contact if you'd like to invite them.", "Good news! We've found %d contacts. Select the contacts you'd like to invite.", e).format(e);
            $("contact-import-msg").update(a);
            Referral.contact_container = document.getElementById("contact-list");
            Referral.contact_rows = Referral.contact_container.childNodes;
            for (var b = 0; b < Referral.contact_rows.length; b += 1) {
                var k = Referral.contact_rows[b];
                k.search_text = k.childNodes[1].firstChild.innerHTML + k.childNodes[2].firstChild.innerHTML;
                var c = $(k.firstChild.firstChild);
                c.observe("click", Referral.checkbox_clicked)
            }
            Referral.fresh = true;
            Referral.update_invite_count()
        }
        var f = !g.length ? "no-contacts-modal" : "select-contacts-modal";
        var d = !g.length ? _("Oops! No contacts here.") : _("Choose contacts");
        Modal.icon_show("email_32", d, $(f), {
            action: Referral.action
        }, null);
        Referral.filter_observer = new Form.Element.Observer("contact-filter", 0.5, function (l, m) {
            if (!SuggestionInput.defaulted(l)) {
                Referral.filter(m)
            }
        })
    },
    checkbox_clicked: function (a) {
        Referral.fresh = false;
        Referral.update_invite_count()
    },
    update_invite_count: function (b) {
        if (!b && Referral.contact_rows) {
            b = 0;
            for (var a = 0; a < Referral.contact_rows.length; a += 1) {
                if (Referral.contact_rows[a].firstChild.firstChild.checked) {
                    b += 1
                }
            }
        }
        var c = ungettext("Invite %d friend", "Invite %d friends", b).format(b);
        $("select-contacts-modal").down("input[type=button]").setValue(c)
    },
    select_all_contacts: function () {
        $$(".contact-check input").each(function (a) {
            a.checked = true
        });
        Referral.update_invite_count();
        return false
    },
    select_no_contacts: function () {
        $$(".contact-check input").each(function (a) {
            a.checked = false
        });
        Referral.update_invite_count(0);
        return false
    },
    insert_contacts: function () {
        var b = [];
        $$(".contact-check").each(function (c) {
            if (c.checked) {
                b.push(c.value)
            }
        });
        if (b.length) {
            SuggestionInput.clear("invite-recip");
            var a = $F("invite-recip");
            if (a) {
                a += ", "
            }
            $("invite-recip").setValue(a + b.join(", "))
        }
        Modal.hide()
    },
    filter: function (f) {
        if (f === Referral.last_search || (Referral.last_search === undefined && f === "")) {
            return
        }
        if (Referral.fresh) {
            Referral.fresh = false;
            Referral.select_no_contacts()
        }
        Referral.last_search = f;
        var a = 0;
        var e = new RegExp(RegExp.escape(f.strip()).split(/[;,\s]+/).join(".*"), "i");
        Referral.contact_container.style.display = "none";
        var b = Referral.contact_rows.length;
        while (b--) {
            var d = Referral.contact_rows[b];
            var c = d.style;
            if (e.test(d.search_text)) {
                if (a % 2 === 0) {
                    c.background = "#ffffff"
                } else {
                    c.background = "#f4faff"
                }
                c.display = "";
                a += 1
            } else {
                c.display = "none"
            }
        }
        Referral.update_invite_count();
        Referral.contact_container.style.display = ""
    },
    do_submit: function (a) {
        assert(Referral.action && typeof (Referral.action) == "function", "Finished with contact list importer but have no callback");
        Referral.action(a)
    },
    do_cancel: function () {
        assert(Referral.cancel_action && typeof (Referral.cancel_action) == "function", "Finished with contact list importer but have no cancel callback");
        Referral.cancel_action()
    },
    hide_warning: function (c, a) {
        var b = function () {
                Referral.hide(c, a)
            };
        Modal.icon_show("alert_32", _("Remove referral?"), $("referral_warning"), {
            action: b
        })
    },
    hide: function (b, a) {
        b = $(b);
        assert(b, "Referral elm doesn't exist");
        assert(Util.isNumber(a), "Referral id is not a number");
        Modal.hide();
        new Ajax.DBRequest("/account/hide_referral", {
            parameters: {
                referral_id: a
            },
            onSuccess: function (c) {
                var d = b.up("tr");
                new Effect.Fade(d)
            }
        })
    },
    status_tooltip: function (d, a, c) {
        var b = a <= 4 ? a.toString() : "invalid";
        Tooltip.show(d, $("referral_" + b).innerHTML.format({
            "email-address": c
        }))
    },
    get_invite_status: function () {
        var a = $("referral_email");
        if (!a || SuggestionInput.defaulted(a) || !a.value.strip()) {
            return
        }
        $("invite_status_result").update();
        Forms.add_loading("status-button");
        new Ajax.DBRequest("/referral_status", {
            parameters: {
                email: a.value
            },
            onSuccess: function (b) {
                a.blur();
                SuggestionInput.reset("referral_email");
                a.focus();
                $("invite_status_result").update(b.responseText)
            },
            cleanUp: function () {
                Forms.remove_loading()
            }
        })
    }
};
Invitations = {
    submit: function (a) {
        a = a || window.event;
        if (a.keyCode == Event.KEY_RETURN) {
            Invitations.send()
        }
    },
    send: function (b, a) {
        var c = $("invite-recip");
        Invitations.do_send($F(c), c, b, a)
    },
    do_send: function (c, e, b, a) {
        var f = c.strip().split(/[;,\s]+/).length;
        if (!f || c === "") {
            Notify.server_error(_("Please enter an e-mail address."));
            return
        }
        if (c != $("invite-recip").title) {
            var d = {
                emails: c,
                referral_src: b
            };
            if (Referral.source) {
                d.source = Referral.source
            }
            new Ajax.DBRequest("/send_invite", {
                parameters: d,
                onSuccess: function (g) {
                    if (Invitations.custom_on_success) {
                        Invitations.custom_on_success(g.responseText, a)
                    } else {
                        Notify.server_success(g.responseText.substr(5))
                    }
                    if (Referral.on_success) {
                        Referral.on_success(g.responseText)
                    }
                    if (e) {
                        e.setValue("")
                    }
                },
                onFailure: function (g) {
                    if (g.responseText.startsWith("err:")) {
                        Notify.server_error(g.responseText.substr(4))
                    } else {
                        Notify.server_error()
                    }
                },
                noAutonotify: true
            })
        } else {
            Notify.server_error(_("Please enter an email address."))
        }
        return false
    },
    addCustomMessage: function (b) {
        Event.stop(b);
        var c = b.target.tagName == "A" ? $(b.target) : $(b.target).up("a");
        c.addHTML = c.innerHTML;
        c.update(Sprite.make("email_delete", {
            "class": "link-img"
        }));
        c.appendChild(document.createTextNode(_("Remove custom message")));
        c.stopObserving("click");
        c.observe("click", Invitations.hideCustomMessage);
        var a = new Element("textarea", {
            title: _("Enter a custom message here"),
            name: "custom_message",
            "class": "custom-message suggestion-input act_as_block textinput",
            rows: 3,
            cols: 25,
            style: "margin-top: 0.75em;"
        });
        a.setValue(Invitations.custom_message || a.title);
        SuggestionInput.register(a);
        c.up().previous("div").insert({
            bottom: a
        });
        SuggestionInput.register(a);
        ActAsBlock.resize(a);
        return false
    },
    hideCustomMessage: function (b) {
        Event.stop(b);
        var c = b.target.tagName == "A" ? $(b.target) : $(b.target).up("a");
        c.stopObserving("click");
        c.observe("click", Invitations.addCustomMessage);
        c.update(c.addHTML);
        var a = c.up().up().select(".custom-message")[0];
        Invitations.custom_message = $F(a);
        a.parentNode.removeChild(a);
        return false
    }
};
ReferralRegisterAB = {
    log: function (a) {
        new Ajax.Request("/referral_register_log", {
            method: "GET",
            parameters: {
                event: a
            }
        })
    }
};
Account = {
    referralPages: {},
    referralCurrentPage: -1,
    referralTabClick: function () {
        if (Account.referralCurrentPage != -1) {
            return
        }
        Account.getReferralsPage(0)
    },
    getReferralsPage: function (a) {
        Account.referralCurrentPage = a;
        if (Account.referralPages[a]) {
            Account.showReferrals(a)
        } else {
            Feed.showLoading(false, $("referrals-container"));
            new Ajax.DBRequest("/account/referralspage/" + (a).toString(), {
                onSuccess: function (b) {
                    Account.referralPages[a] = b.responseText;
                    Account.showReferrals(a)
                }
            })
        }
        return false
    },
    showReferrals: function (a) {
        Feed.hideLoading();
        $("referrals-container").update(Account.referralPages[a])
    }
};
var EventBubble = {
    make: function (b) {
        var a = '<table class="ebubble"><tr><td class="tl"></td><td class="t"></td><td class="tr"></td></tr><tr><td class="l"></td><td class="c">#{content}</td><td class="r"></td></tr><tr><td class="bl"></td><td class="b"><img src="/static/images/events_bubble_tail.gif" alt="" class="events_bubble_tail"/></td><td class="br"></td></tr></table>';
        return a.interpolate({
            content: HTML.escape(b).toHTML()
        })
    }
};
var Feed = {
    firstTime: true,
    feedPages: {},
    page_num: 0,
    ns_id: false,
    update_pages: function (a) {
        (a && Feed.page_num ? Element.show : Element.hide)("newolddivider");
        (a ? Element.show : Element.hide)("older-events");
        (Feed.page_num ? Element.show : Element.hide)("newer-events")
    },
    older: function () {
        Feed.set_url({
            page_num: (parseInt(Feed.page_num, 10) || 0) + 1
        })
    },
    newer: function () {
        if (!Feed.page_num) {
            return
        }
        Feed.set_url({
            page_num: parseInt(Feed.page_num, 10) - 1
        })
    },
    showLoading: function (h, a, g, f) {
        g = true;
        var e = $("feed-loading");
        a = $(a);
        if (!e) {
            e = new Element("div", {
                id: "feed-loading"
            });
            var c = new HTML('<table style="height: 100%; width: 100%; background:#fff;"><tr><td valign="top"><div id="feed-loading-text" style="padding-top: 16px;text-align:center;"></div></td></tr></table>');
            e.__date(c);
            document.body.appendChild(e)
        }
        e.clonePosition(a);
        if (e.getWidth() === 0) {
            return
        }
        if (Util.ie) {
            e.style.left = a.getBoundingClientRect().left + "px"
        }
        e.setOpacity(0.9);
        var b = $("feed-loading-text");
        if (h) {
            b.__date()
        } else {
            var d = new Element("img", {
                src: "/static/images/icons/ajax-loading.gif",
                style: "vertical-align: bottom;"
            });
            b.__date(d);
            if (!g) {
                b.__sert(_("Loading..."))
            }
        }
        $("feed-loading").show();
        if (f) {
            e.style.zIndex = "1001"
        }
    },
    hideLoading: function () {
        $("feed-loading").hide()
    },
    changeNamespace: function (a, b) {
        Feed.ns_id = a;
        Feed.getPage(0)
    },
    changeDate: function (a, b) {
        Feed.date = a;
        Feed.nice_date = Util.niceDate(a);
        if (!b) {
            Feed.getPage(0)
        }
    },
    getPage: function (a) {
        a = a || 0;
        Feed.page_num = parseInt(a, 10);
        if (Feed.feedPages[Feed.get_key(a)]) {
            Feed.show(a)
        } else {
            Feed.showLoading(false, $("events-content"));
            var b = Feed.ns_id !== false ? "&ns_id=" + Feed.ns_id.toString() : "&is_home=yes";
            new Ajax.DBRequest("/next_events?cur_page=" + (a).toString() + b, {
                parameters: {
                    date: Feed.nice_date ? Feed.nice_date : ""
                },
                onSuccess: function (c) {
                    Feed.feedPages[Feed.get_key(a)] = new HTML(c.responseText);
                    Feed.show(a)
                }
            })
        }
        return false
    },
    show: function (a) {
        Feed.hideLoading();
        $("events-content").__date(Feed.feedPages[Feed.get_key(a)]);
        var b = $("add-comment-button");
        if (b) {
            HotButton.register(b)
        }
    },
    tabClick: function (a) {
        var b = $("event-table");
        if (!b) {
            Feed.getPage(0);
            Feed.clearNewEvents()
        }
    },
    clearNewEvents: function (a) {
        $$(".events_bubble").invoke("hide")
    },
    url_check: function (b, c, a) {
        c = c || 0;
        b = b || false;
        var d = (Feed.ns_id != b || (Feed.page_num != c) || (Feed.nice_date != a));
        Feed.ns_id = b || Feed.ns_id;
        Feed.page_num = parseInt(typeof (c) !== "undefined" ? c : Feed.page_num, 10);
        if (a) {
            Feed.changeDate(new Date(a.gsub("-", "/")), true)
        }
        if (d) {
            ULSelectMenu.set_selected_by_value($("namespace-list"), Feed.ns_id);
            if (a) {
                EventDatePicker.change_date(Feed.date)
            }
            Feed.getPage(Feed.page_num)
        }
    },
    set_url: function (c) {
        var a = c.ns_id !== undefined ? c.ns_id : Feed.ns_id;
        var d = c.page_num !== undefined ? c.page_num : Feed.page_num;
        var b = c.date !== undefined ? c.date : Feed.nice_date;
        var e = {
            ns: a,
            n: d,
            d: b
        };
        DBHistory.push_state("/events", e)
    },
    get_key: function (a) {
        return Feed.ns_id + "_" + Feed.date + "_" + a + "_" + Feed.nice_date
    },
    show_rss_modal: function () {
        var a = Feed.ns_id || Constants.root_ns,
            b = Feed.rss_url;
        Modal.icon_show("feed_32", _("Subscribe to this RSS feed"), $("rss-modal"));
        $("rss_url").setValue(b);
        BrowseActions.addCopyUrlFlash(b);
        $("copy_success").__date();
        $("reset-rss-link").writeAttribute("href", "/reset_rss/" + a);
        $("rss_url").select()
    }
};
var Timezone = {
    check_timezone: function () {
        if (!Constants.uid) {
            return
        }
        var a = Timezone.get_current_timezone();
        if (Constants.auto_timezone_offset === undefined || Constants.auto_timezone_offset != a) {
            Timezone.update(a)
        }
    },
    get_current_timezone: function () {
        var c = new Date();
        c.setSeconds(0);
        c.setMilliseconds(0);
        var b = c.toGMTString();
        var d = new Date(b.substring(0, b.lastIndexOf(" ") - 1));
        var a = (c - d) / (1000 * 60 * 60);
        return a
    },
    update: function (a) {
        assert(typeof (a) == "number", "Timezone offset was not a number: " + a);
        new Ajax.DBRequest("/set_timezone", {
            parameters: {
                offset: a
            },
            noAutonotify: true
        })
    },
    on_change: function () {
        var a = [];
        var b = [$("timezone_area"), $("timezone_location"), $("timezone_city")];
        b.each(function (c) {
            if (c) {
                a.push($F(c))
            }
        });
        Timezone.update_form(a)
    },
    update_form: function (l) {
        l = l || ["America"];
        assert(Timezone.tree, "Timezone tree missing...");
        $("tz").update();
        var a = ["timezone_area", "timezone_location", "timezone_city"];
        var e = Timezone.tree;
        var c = Math.max(l.length + 1, 2);
        for (var g = 0; g < c; g += 1) {
            var d = l[g];
            var n = Object.keys(e);
            if (!n.length) {
                break
            }
            var m = new Element("select", {
                id: a[g],
                name: a[g]
            });
            m.observe("change", Timezone.on_change);
            for (var f = 0, k = n.length; f < k; f += 1) {
                var b = n[f];
                var h = new Element("option");
                h.value = b;
                h.update(b);
                if (b == d) {
                    h.selected = true
                }
                m.appendChild(h)
            }
            $("tz").appendChild(m);
            e = e[d]
        }
        Util.syncHeight()
    },
    auto: function () {
        var a = $F("timezone_auto");
        if (a) {
            $("tz").update()
        } else {
            Timezone.update_form()
        }
    },
    build_tree: function (b) {
        var a = {};
        b.each(function (e) {
            var c = e.split("/");
            var d = a;
            c.each(function (f) {
                if (!d[f]) {
                    d[f] = {}
                }
                d = d[f]
            })
        });
        Timezone.tree = a
    }
};
document.observe("dom:loaded", Timezone.check_timezone);
var DBCalendar = Class.create({
    initialize: function (b, a) {
        this.options = a || {};
        this.container = $(b);
        assert(this.container, "Couldn't find the element");
        this.today = new Date();
        if (this.options.disable_future) {
            this.options.last_day = Util.start_of_day(this.options.last_day || this.today)
        }
        if (this.options.disable_past) {
            this.options.first_day = Util.start_of_day(this.options.first_day || this.today)
        }
        this.view_date = Util.start_of_day(this.options.selected_date || this.today);
        this.selected_date = Util.start_of_day(this.options.selected_date || this.today);
        this.render()
    },
    _change_month: function (b, a) {
        Event.stop(b);
        this.view_date.setMonth(a);
        this.render()
    },
    _change_day: function (b, a) {
        Event.stop(b);
        this.container.select(".selected").invoke("removeClassName", "selected");
        $(b.target).addClassName("selected");
        this.selected_date.setMonth(this.view_date.getMonth());
        this.selected_date.setYear(this.view_date.getFullYear());
        this.selected_date.setDate(a);
        if (this.options.onDateChange) {
            this.options.onDateChange(this.selected_date)
        }
    },
    is_valid_date: function (d, f, e, c, a) {
        c = c || 1970;
        a = a || (new Date()).getFullYear() + 1;
        f += 1;
        if (e < c) {
            return false
        }
        if (e > a) {
            return false
        }
        if (f < 1 || f > 12) {
            return false
        }
        if (d <= 0) {
            return false
        }
        if (f == 2) {
            var b = ((e % 4) === 0) && (((e % 100) !== 0) || ((e % 400) === 0));
            return b ? d <= 29 : d <= 28
        } else {
            if (f == 4 || f == 6 || f == 9 || f == 11) {
                return d <= 30
            } else {
                return d <= 31
            }
        }
    },
    change_date: function (a, d, b) {
        if (!this.is_valid_date(a, d, b)) {
            return
        }
        var c = b != this.view_date.getFullYear() || d != this.view_date.getMonth();
        this.selected_date.setDate(a);
        this.selected_date.setMonth(d);
        this.selected_date.setFullYear(b);
        if (c) {
            this.view_date.setMonth(d);
            this.view_date.setFullYear(b);
            this.render()
        } else {
            this.container.select(".selected").invoke("removeClassName", "selected");
            $$("a#day" + a + "-" + d)[0].addClassName("selected")
        }
        if (this.options.onDateChange) {
            this.options.onDateChange(this.selected_date)
        }
    },
    render: function () {
        var e = this.render_days();
        this._next_month = (function (f) {
            this._change_month(f, this.view_date.getMonth() + 1)
        }).bind(this);
        this._prev_month = (function (f) {
            this._change_month(f, this.view_date.getMonth() - 1)
        }).bind(this);
        var b = new Element("a");
        b.addClassName("changemonth next");
        b.update(Sprite.make("arrowright", {}));
        Event.observe(b, "click", this._next_month);
        var c = new Element("a");
        c.addClassName("changemonth prev");
        c.update(Sprite.make("arrowleft", {}));
        Event.observe(c, "click", this._prev_month);
        var d = new Element("div");
        d.addClassName("calendar clearfix");
        var a = new Element("h5");
        a.update(_("%(month)s %(year)s").format({
            month: Util.month_name(this.view_date.getMonth()),
            year: this.view_date.getFullYear()
        }));
        d.insert(b);
        d.insert(c);
        d.insert(a);
        d.insert(e);
        this.container.update(d)
    },
    render_days: function () {
        var f = new Date(this.view_date.getFullYear(), this.view_date.getMonth(), 1);
        var e = f.getDay();
        var g = new Element("div");
        g.addClassName("days");
        for (var a = e; a > 0; a -= 1) {
            var d = new Date(f.getFullYear(), f.getMonth(), f.getDate());
            d.setDate(d.getDate() - a);
            g.insert(this.render_day(d, true))
        }
        var c = new Date(this.view_date.getFullYear(), this.view_date.getMonth(), 1);
        while (c.getMonth() == this.view_date.getMonth()) {
            g.insert(this.render_day(c));
            c = new Date(this.view_date.getFullYear(), this.view_date.getMonth(), c.getDate() + 1)
        }
        var b = new Date(this.view_date.getFullYear(), this.view_date.getMonth() + 1, 0);
        while (b.getDay() != 6) {
            b = new Date(b.getFullYear(), b.getMonth(), b.getDate() + 1);
            g.insert(this.render_day(b, true))
        }
        return g
    },
    render_day: function (c, d) {
        if (this.options.last_day) {
            d = d || c > this.options.last_day
        }
        if (this.options.first_day) {
            d = d || c < this.options.first_day
        }
        var b;
        if (d) {
            b = new Element("span")
        } else {
            b = new Element("a")
        }
        b.update(c.getDate());
        b.addClassName("date");
        b.writeAttribute("id", "day" + c.getDate() + "-" + c.getMonth());
        if (this.selected_date.getDate() == c.getDate() && this.selected_date.getMonth() == c.getMonth() && this.selected_date.getFullYear() == c.getFullYear()) {
            b.addClassName("selected")
        }
        if (d) {
            b.addClassName("inactive")
        } else {
            this._handler = (function (f) {
                var a = f.target.identify().substr(3).split("-");
                this.change_date(a[0], this.view_date.getMonth(), this.view_date.getFullYear())
            }).bind(this);
            Event.observe(b, "click", this._handler)
        }
        return b
    }
});
var EventDatePicker = {
    show_calendar: function (a) {
        if (EventDatePicker.shown) {
            return
        }
        Event.extend(a).preventDefault();
        if (!EventDatePicker.calendar) {
            var b = new Element("div", {
                id: "cal_container"
            });
            b.observe("click", function (d) {
                d.preventDefault()
            });
            $(document.body).insert(b);
            EventDatePicker.calendar = new DBCalendar("cal_container", {
                onDateChange: function (e) {
                    EventDatePicker.change_date(e, 0)
                },
                disable_future: true,
                first_day: EventDatePicker.first_event
            });
            b.absolutize();
            var c = $("cal_date");
            b.clonePosition(c, {
                setWidth: false,
                setHeight: false,
                offsetTop: c.getHeight(),
                offsetLeft: c.getWidth() - b.down().getWidth()
            })
        }
        $("cal_container").show();
        $(document.body).observe("click", EventDatePicker.hide_calendar);
        EventDatePicker.shown = true
    },
    hide_calendar: function (a) {
        if ($(a.target).up("#cal_date")) {
            return
        }
        Event.stop(a);
        $("cal_container").hide();
        $(document.body).stopObserving("click", EventDatePicker.hide_calendar);
        EventDatePicker.shown = false
    },
    change_date: function (a, b) {
        if (b !== undefined) {
            Feed.page_num = 0
        }
        var c = $("cur_date_text");
        c.update(a.localize());
        Feed.set_url({
            date: Util.niceDate(a)
        })
    }
};
var TextInputDatePicker = Class.create({
    initialize: function (d, c) {
        this.options = {
            include_seconds: true,
            choose_eod: false
        };
        Object.extend(this.options, c || {});
        this.input = $(d);
        assert(this.input, "Couldn't find the element " + d.toString());
        var b = new Date();
        var a = this.input.value ? Util.from_mysql_date(this.input.value) : false;
        var e = new Date(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
        this.cal_icon = Sprite.make("calendar_view_month", {
            align: "absmiddle"
        });
        this.cal_container = new Element("div", {
            id: "cal_container_" + d,
            style: "display: none; position: absolute; z-index: 1"
        });
        this.calendar = new DBCalendar(this.cal_container, {
            onDateChange: this.onDateChange.bind(this),
            last_day: e,
            selected_date: a
        });
        this.input.insert({
            after: this.cal_icon
        });
        this.cal_icon.observe("click", this.toggle_cal.bindAsEventListener(this));
        this.cal_container.clonePosition(this.input, {
            setWidth: false,
            setHeight: false,
            offsetTop: this.input.getHeight()
        });
        this.cal_icon.insert({
            after: this.cal_container
        })
    },
    toggle_cal: function (a) {
        if (a) {
            Event.stop(a)
        }
        this.cal_container.toggle()
    },
    hide_cal: function (a) {
        if (a) {
            Event.stop(a)
        }
        this.cal_container.hide()
    },
    onDateChange: function (a) {
        if (this.options.choose_eod) {
            a.setTime(Util.start_of_day(a).getTime() + 86399999)
        }
        this.input.value = Util.to_mysql_date(a, true);
        this.hide_cal()
    }
});
var Apps = {
    confirm_disable: function (d, c, b) {
        var e = b ? _("Are you sure you want to disable '%(app-name)s'?") : _("Are you sure you want to delete '%(app-name)s'?");
        DomUtil.fillVal(e.format({
            "app-name": d.escapeHTML()
        }), "app-disable-text");
        Modal.icon_show("application_delete_32", b ? _("Confirm disable") : _("Confirm delete"), $("app-disable-modal"));
        var a = "/developers/disable_app/" + c;
        $("app-disable-modal").down("form").action = a;
        $("disable-app-button").setValue(b ? _("Disable") : _("Delete"))
    },
    enable_app: function (b) {
        var a = "/developers/enable_app/" + b;
        window.location.href = a
    },
    show_app_limit_reached: function () {
        Modal.icon_show("application_add_32", _("Developer app limit reached"), $("app-limit-modal"))
    },
    show_create: function () {
        Modal.icon_show("application_add_32", _("Create a new app"), $("create-app"), {});
        ActAsBlock.register(false, $("modal-content"))
    },
    do_create: function (b) {
        if (b) {
            Event.stop(b)
        }
        var a = $("create-app-form");
        assert(a, "Missing form for Apps.do_create");
        Forms.ajax_submit(a, false, function (c) {
            if (c && c.responseText && c.responseText != "ok") {
                window.location.href = c.responseText
            } else {
                window.location.reload()
            }
        }, false, b && b.target)
    },
    do_edit: function (b) {
        if (b) {
            Event.stop(b)
        }
        var a = $("update-app-form");
        assert(a, "Missing form for Apps.do_edit");
        Forms.ajax_submit(a, false, function () {
            window.location.reload()
        }, false, b && b.target)
    },
    show_about: function (g, f, d, a, c, b) {
        if (g) {
            Event.stop(g)
        }
        DomUtil.fillVal(f.escapeHTML(), "app-name");
        DomUtil.fillVal(d.escapeHTML(), "app-description");
        Modal.show(f, $("about-app"), {
            "force-icon": c
        });
        $("application-link").href = b
    },
    show_uninstall: function (f, d, c, a, b) {
        if (f) {
            Event.stop(f)
        }
        Modal.vars = {
            token_id: c,
            delete_row_type: "inst-app",
            action: "uninstall_app"
        };
        var g = "delete-" + a + "-app-confirm";
        if (b) {
            DomUtil.fillVal(b.escapeHTML(), "app_folder")
        } else {
            if (a == "sandbox") {
                return Apps.do_action()
            }
        }
        DomUtil.fillVal(d.escapeHTML(), "app_name");
        Modal.icon_show("application_delete_32", _("Remove %(app_name)s?").format({
            app_name: d.em_snippet(22).escapeHTML()
        }), $(g), Modal.vars);
        return null
    },
    do_uninstall: function () {
        new Ajax.DBRequest("/api/uninstall_app", {
            parameters: {
                id: Modal.vars.token_id,
                keep_sandbox_files: $F("keep_sandbox_files")
            },
            onSuccess: function (a) {
                Notify.server_success(a.responseText);
                $("inst-app-" + Modal.vars.token_id.toString() + "-row").hide()
            }
        });
        Modal.hide()
    },
    do_action: function () {
        new Ajax.DBRequest("/api/" + Modal.vars.action, {
            parameters: {
                id: Modal.vars.token_id
            },
            onSuccess: function (a) {
                Notify.server_success(a.responseText);
                if (Modal.vars.delete_row_type) {
                    $(Modal.vars.delete_row_type + "-" + Modal.vars.token_id.toString() + "-row").hide()
                } else {
                    window.location.reload()
                }
            }
        })
    },
    enable_users_in_dev: function (a) {
        Modal.icon_show("teams", _("Enable additional users"), $("confirm-users-in-dev-modal"), {
            enable: function () {
                new Ajax.DBRequest("/developers/enable_users_in_dev/" + a, {
                    onSuccess: function (b) {
                        $("enable-users-in-dev").remove();
                        $("none-linked").show();
                        Modal.hide()
                    }
                })
            }
        });
        return false
    },
    remove_user: function (c, b, a) {
        new Ajax.DBRequest("/developers/remove_user/" + c + "/" + b, {
            onSuccess: function (e) {
                var d = $(a).up("table");
                $(a).up("tr").remove();
                if (d.down("tr").id == "none-linked") {
                    $("none-linked").show();
                    $("apply-for-more").hide()
                }
            }
        });
        return false
    },
    show_add_key_confirm: function (c, b, a) {
        if (c) {
            Event.stop(c)
        }
        DomUtil.fillVal(b.escapeHTML(), "app-name");
        Modal.show(_("Confirm key creation"), $("add-key-confirm"), {
            app_id: a
        });
        return 0
    },
    do_add_key: function (a) {
        new Ajax.DBRequest("/api/create_app_token", {
            parameters: {
                id: Modal.vars.app_id
            },
            onSuccess: function (b) {
                Notify.server_success(_("Key created successfully."));
                var d = "<tr id=\"token-#{id}-row\"><td>#{key}</td><td>#{secret}</td><td><a href=\"#\" onclick=\"Apps.show_del_key_confirm(event, '#{key}', '#{secret}', '#{id}');\">" + Sprite.html("x") + "</a></td></tr>";
                var c = b.responseText.evalJSON(true);
                c.id = Number(c.id);
                c.key = c.key.replace("'", "");
                c.secret = c.secret.replace("'", "");
                d = d.interpolate(c);
                $("api-key-last-row").insert({
                    before: d
                })
            }
        })
    },
    show_del_key_confirm: function (d, b, a, c) {
        if (d) {
            Event.stop(d)
        }
        DomUtil.fillVal(b.escapeHTML(), "token-key");
        DomUtil.fillVal(a.escapeHTML(), "token-secret");
        Modal.show(_("Confirm key removal"), $("del-key-confirm"), {
            token_id: c
        });
        return 0
    },
    do_del_key: function (a) {
        new Ajax.DBRequest("/api/delete_app_token", {
            parameters: {
                id: Modal.vars.token_id
            },
            onSuccess: function (c) {
                Notify.server_success(_("Key removed successfully."));
                var b = c.responseText.evalJSON(true);
                $("token-" + b.id + "-row").hide()
            }
        })
    },
    restore_sandbox: function (b, a) {
        var d = $("restore-sandbox");
        Modal.icon_show("folder_app_32", _("Restore app folder '%(filename)s'").format({
            filename: FileOps.filename(b).em_snippet(17).escapeHTML()
        }), d);
        var c = $("restore-sandbox-form");
        Forms.add_vars(c, {
            ns_id: a
        })
    },
    submit_restore_sandbox: function (b) {
        Event.stop(b);
        var a = $("restore-sandbox-form");
        Forms.ajax_submit(a, false, function (c) {
            Modal.hide();
            Notify.server_success(_("Restored app folder"));
            if (c.responseText.length) {
                Browse.reload_fqpath(c.responseText)
            } else {
                Browse.reload("", "", true)
            }
        }, false, b.target);
        return false
    },
    developer_support: function () {
        var a = $("dev-support-modal");
        Modal.icon_show("alert_32", _("Dropbox developer support"), a)
    },
    submit_developer_support: function (b) {
        var a = $("dev-support-form");
        assert(a, "Form is missing in submit_developer_support");
        Forms.ajax_submit(a, false, function () {
            Modal.hide();
            Notify.server_success(_("Thanks for your ticket.  We'll get back to you soon."))
        }, false, b && b.target)
    },
    submit_app_info: function (c, a) {
        try {
            var b = $("update-app-form");
            Forms.ajax_submit(b, "/developers/app_info/%s".format(a), function (d) {
                b.submit()
            }, false, c && c.target)
        } finally {
            return false
        }
    },
    delete_screenshot: function (a, b, c) {
        new Ajax.DBRequest("/developers/delete_screenshot/%s".format(b), {
            parameters: {
                screenshot_id: c
            },
            onSuccess: function (d) {
                Effect.Fade(a)
            }
        })
    },
    add_screenshot_form: function () {
        var a = new Element("input", {
            type: "file",
            name: "screenshots"
        });
        $("screenshots-container").appendChild(a)
    },
    show_need_users_modal: function (a) {
        Event.stop(a);
        Modal.icon_show("alert_32", _("Please test this app"), $("app-need-users-modal"));
        return false
    }
};
var AppDirectory = {
    click: function (a) {
        a = Object.toQueryString(a);
        AppDirectory.get_page(a);
        HashRouter._set_hash(a)
    },
    get_page: function (a) {
        Feed.showLoading(true, "list-content");
        new Ajax.Request("/apps/list?" + a, {
            onSuccess: function (b) {
                $("list-content").update(b.responseText)
            },
            onComplete: function () {
                Feed.hideLoading()
            }
        })
    },
    hash_change: function (b) {
        var a = b.memo.hash;
        AppDirectory.get_page(a)
    },
    platform_change: function () {
        var b = Object.clone(AppDirectory.filter_state);
        var a = [];
        $$(".platform input").each(function (c) {
            if (c.checked) {
                a.push(c.value)
            }
        });
        b.page = 0;
        b.platform = a.join(",");
        AppDirectory.click(b)
    },
    set_order: function (a) {
        var b = Object.clone(AppDirectory.filter_state);
        b.order_by = a;
        b.page = 0;
        AppDirectory.click(b)
    },
    set_page: function (a) {
        var b = Object.clone(AppDirectory.filter_state);
        b.page = a;
        AppDirectory.click(b)
    }
};
var AppReview = {
    page: 0,
    get_page: function (a, b) {
        Feed.showLoading(true, $("reviews").down("div"));
        new Ajax.Request("/apps/reviews", {
            parameters: {
                page: b,
                app_id: a
            },
            onSuccess: function (c) {
                AppReview.update(c.responseText);
                AppReview.page = parseInt(b, 10);
                HashRouter.set_hash("review", a, b.toString());
                $("reviews").scrollTo()
            },
            onComplete: function () {
                Feed.hideLoading()
            }
        })
    },
    update: function (a) {
        $("reviews").update(a)
    },
    check_hash: function (a, b) {
        b = b || 0;
        b = parseInt(b, 10);
        if (b != AppReview.page) {
            AppReview.get_page(a, b)
        }
    },
    add_review: function (c, a) {
        Event.stop(c);
        var b = $("app-review-form");
        Forms.ajax_submit(b, false, function (d) {
            AppReview.get_page(a, 0);
            b.down("textarea").setValue("")
        }, false, c.target)
    }
};
var Twitter = {
    get_progress_container: function () {
        assert(Twitter.progress_container, "Twitter is missing progress_container");
        var a = $(Twitter.progress_container);
        assert(a, "Missing progress_container elm");
        return a
    },
    follow_dropbox: function (a) {
        if (a.showWorking) {
            a.showWorking()
        }
        var b = function () {
                if (a.onFailure) {
                    a.onFailure()
                } else {
                    window.location.reload()
                }
            };
        new Ajax.DBRequest("/twitter/follow_us", {
            onSuccess: function (c) {
                if (!c.responseText.startsWith("ok")) {
                    b()
                } else {
                    if (a.onSuccess) {
                        a.onSuccess()
                    }
                }
            },
            onFailure: function () {
                b()
            }
        })
    },
    do_auth: function (a) {
        window.open("/twitter/request_token", "twitter_auth", "width=800,height=400");
        if (a) {
            Twitter.onLoginSuccessCallback = a
        }
    },
    start_flow: function (g, f, e, d, c) {
        var b = $("post-options");
        assert(b, "Missing content for twitter flow");
        Modal.icon_show("alert_32", g, b);
        if (!$F("post-message")) {
            $("post-message").setValue(f)
        }
        var a = $("share-this-message");
        assert(a, "Missing button");
        a.stopObserving("click");
        a.observe("click", function (h) {
            if (h) {
                Event.stop(h)
            }
            SharingModel.start_twitter_flow($F("post-message"), e, d, c)
        });
        if (!Twitter.chars_left_interval) {
            Twitter.chars_left_interval = setInterval(Twitter.update_chars_left, 250)
        }
    },
    update_chars_left: function () {
        var d = $("twitter-chars-left");
        var c = $("twitter-checkbox") && $F("twitter-checkbox");
        var a = $("facebook-checkbox") && $F("facebook-checkbox");
        if (c) {
            d.style.visibility = "";
            var e = 140 - $F("post-message").strip().length;
            if (e < 0) {
                d.addClassName("error-message")
            } else {
                d.removeClassName("error-message")
            }
            d.update(e)
        } else {
            d.style.visibility = "hidden"
        }
        var b = $("share-this-message");
        if (!a && !c) {
            b.removeClassName("freshbutton-blue");
            b.addClassName("freshbutton");
            b.disabled = 1
        } else {
            b.removeClassName("freshbutton");
            b.addClassName("freshbutton-blue");
            b.disabled = 0
        }
    },
    show_login: function (a) {
        if (a) {
            Twitter.onLoginSuccessCallback = a
        }
        DomUtil.updateFromElm(Twitter.get_progress_container(), "inline-twitter-auth")
    },
    show_posting: function () {
        Modal.hide();
        Twitter.get_progress_container().update(DomUtil.fromElm("sharing-progress"))
    },
    show_complete: function (b) {
        var a = Twitter.get_progress_container();
        Twitter.show_complete_into(b, a)
    },
    show_complete_into: function (g, a) {
        a.update(DomUtil.fromElm("sharing-posted"));
        var d = "twitter";
        var f = _("View tweet");
        var b;
        if (g.startsWith("ok")) {
            b = "http://www.twitter.com/"
        } else {
            b = g
        }
        var e = a.down("#view-post");
        e.href = b;
        e.update(f);
        var c = Sprite.make(d);
        e.insert({
            top: c
        })
    },
    post: function (c, e, b) {
        assert(c, "Twitter message is empty");
        var d = {
            message: c,
            from_referrals: Twitter.from_referrals,
            from_free: Twitter.from_free
        };
        new Ajax.DBRequest("/twitter_post", {
            parameters: d,
            onSuccess: function (f) {
                if (f.responseText == "login") {
                    Twitter.onLoginSuccessCallback = function () {
                        Twitter.post(c)
                    };
                    var g = Twitter.custom_show_auth || Twitter.show_login;
                    g()
                } else {
                    Modal.hide();
                    var h = Twitter.onPostSuccessCallback || Twitter.show_complete;
                    h(f.responseText)
                }
            }
        });
        var a = Twitter.custom_show_posting || Twitter.show_posting;
        a()
    },
    custom_post: function (a, b) {
        if (b) {
            Twitter.onPostSuccessCallback = b
        }
        if (!a) {
            return
        }
        assert(a, "Twitter message doesn't exist");
        if (!Constants.uid) {
            window.open("http://www.twitter.com/home?status=" + encodeURI(a))
        } else {
            Twitter.post(a)
        }
    }
};
var FacebookOAuth = {
    get_progress_container: function () {
        assert(FacebookOAuth.progress_container, "Facebook is missing progress_container");
        var a = $(FacebookOAuth.progress_container);
        assert(a, "Missing progress_container elm");
        return a
    },
    do_auth: function (a) {
        window.open("/fb/access_token", "fb_auth", "width=600,height=450");
        if (a) {
            FacebookOAuth.onLoginSuccessCallback = a
        }
    },
    show_posting: function () {
        Modal.hide();
        FacebookOAuth.get_progress_container().update(DomUtil.fromElm("sharing-progress"))
    },
    show_auth: function (a) {
        if (a) {
            FacebookOAuth.onLoginSuccessCallback = a
        }
        DomUtil.updateFromElm(FacebookOAuth.get_progress_container(), "inline-facebook-auth")
    },
    show_complete: function () {
        var a = FacebookOAuth.get_progress_container();
        a.update(DomUtil.fromElm("sharing-posted"));
        var d = "facebook";
        var f = "View Post";
        var b = "http://www.facebook.com/profile.php?v=wall";
        var e = a.down("#view-post");
        e.href = b;
        e.update(f);
        var c = Sprite.make(d);
        e.insert({
            top: c
        })
    },
    post: function (e, d, c, b, f) {
        if (!Constants.uid) {
            window.open("http://www.facebook.com/sharer.php?u=" + encodeURI(d) + "&t=" + encodeURI(c));
            return
        }
        var a = FacebookOAuth.custom_show_posting || FacebookOAuth.show_posting;
        a();
        new Ajax.DBRequest("/fb/post", {
            parameters: {
                message: e,
                link: d,
                link_name: c,
                description: b,
                from_referrals: FacebookOAuth.from_referrals,
                from_free: FacebookOAuth.from_free,
                picture: f ? f : ""
            },
            onSuccess: function (g) {
                if (g.responseText.startsWith("ok")) {
                    var k = FacebookOAuth.custom_show_complete || FacebookOAuth.show_complete;
                    k()
                } else {
                    var h = FacebookOAuth.custom_show_auth || FacebookOAuth.show_auth;
                    h();
                    FacebookOAuth.onLoginSuccessCallback = function () {
                        FacebookOAuth.post(e, d, c, b)
                    }
                }
            }
        })
    }
};
var MP3Player = {
    state: false,
    file: false,
    volume_percent: 100,
    meta: {},
    on_ready: false,
    init: function (b) {
        var e = {
            type: "sound",
            id: "mp3embed"
        };
        if (b) {
            e.file = encodeURI(b)
        }
        var d = {
            allowScriptAccess: "always"
        };
        var a = {
            name: "mp3embed"
        };
        var f = new Element("div", {
            id: "mp3embed"
        });
        var c = document.body;
        if (Prototype.Browser.Gecko) {
            c = document.documentElement
        }
        c.appendChild(f);
        swfobject.embedSWF("/static/swf/player-5.2.1065-ID3.swf", "mp3embed", "1", "1", "9", false, e, d, a, function (g) {
            MP3Player.player = $(g.ref);
            MP3Player.file = b
        })
    },
    load: function (a) {
        if (MP3Player.file == a) {
            return
        }
        if (MP3Player.player) {
            a = decodeURIComponent(a);
            MP3Player.player.sendEvent("load", [{
                file: a,
                type: "sound"
            }]);
            MP3Player.meta = {};
            MP3Player.play()
        } else {
            MP3Player.init(a)
        }
        MP3Player.file = a
    },
    volume: function (a) {
        MP3Player.volume_percent = a;
        if (MP3Player.player) {
            MP3Player.player.sendEvent("volume", a.toString())
        }
    },
    seek: function (a) {
        MP3Player.player.sendEvent("seek", a.toString())
    },
    play: function () {
        if (MP3Player.state === false || MP3Player.state == "idle" || MP3Player.state == "completed" || MP3Player.state == "paused") {
            MP3Player.player.sendEvent("play")
        }
    },
    pause: function () {
        if (MP3Player.state == "playing" || MP3Player.state == "buffering" || MP3Player.state == "completed") {
            MP3Player.player.sendEvent("play")
        }
    },
    stop: function () {
        MP3Player.player.sendEvent("stop");
        delete MP3Player.file
    },
    get_state: function () {
        return MP3Player.state
    },
    volume_change: function (a) {
        $(document.body).fire("mp3:volume", a)
    },
    load_change: function (a) {
        $(document.body).fire("mp3:load", a);
        if (a.percentage == 100) {
            $(document.body).fire("mp3:load_complete", a)
        }
    },
    time_change: function (a) {
        MP3Player.duration = a.duration;
        $(document.body).fire("mp3:time", a)
    },
    state_change: function (a) {
        MP3Player.state = a.newstate.toLowerCase();
        $(document.body).fire("mp3:" + MP3Player.state)
    },
    meta_change: function (a) {
        if (a.type == "id3") {
            $(document.body).fire("mp3:id3", a);
            MP3Player.meta = a
        }
    },
    observe: function (a, b) {
        a = a.toLowerCase();
        $(document.body).observe("mp3:" + a, b)
    },
    stopObserving: function (a) {
        a = a.toLowerCase();
        $(document.body).stopObserving("mp3:" + a)
    }
};

function playerReady(a) {
    if (a.id != "mp3embed") {
        return
    }
    MP3Player.player.addControllerListener("PLAY", "MP3Player.played");
    MP3Player.player.addControllerListener("STOP", "MP3Player.stopped");
    MP3Player.player.addControllerListener("VOLUME", "MP3Player.volume_change");
    MP3Player.player.addModelListener("STATE", "MP3Player.state_change");
    MP3Player.player.addModelListener("TIME", "MP3Player.time_change");
    MP3Player.player.addModelListener("BUFFER", "MP3Player.load_change");
    MP3Player.player.addModelListener("META", "MP3Player.meta_change");
    MP3Player.player.sendEvent("volume", MP3Player.volume_percent.toString());
    MP3Player.play();
    if (MP3Player.on_ready) {
        MP3Player.on_ready()
    }
}
var MP3Controller = {
    current: false,
    playlist: [],
    click: function (c, a) {
        MP3Controller.playlist = [];
        var b = $(c.target).up("a.play");
        if (b != MP3Controller.current) {
            MP3Controller.play(b, a)
        } else {
            MP3Controller.stop(b)
        }
    },
    play_all: function () {
        var a = [];
        $$(".download-song").each(function (b) {
            a.push(b.href)
        });
        a.reverse();
        MP3Controller.play_playlist(a)
    },
    play_playlist: function (a) {
        var c;
        var b = a.pop();
        MP3Controller.playlist = a;
        $$(".download-song").each(function (d) {
            if (d.href == b) {
                c = d
            }
        });
        if (!c) {
            return
        }
        MP3Controller.play(c.up().down("a.play"), b, true)
    },
    play: function (b, a, c) {
        MP3Player.load(a);
        MP3Player.observe("COMPLETED", MP3Controller.complete);
        MP3Player.observe("PAUSED", MP3Controller.stop);
        if (MP3Controller.current) {
            MP3Controller.show_play(MP3Controller.current)
        }
        MP3Controller.current = b;
        MP3Controller.show_pause(MP3Controller.current)
    },
    stop: function (a) {
        MP3Player.stop();
        MP3Controller.show_play(MP3Controller.current);
        delete MP3Controller.current
    },
    complete: function () {
        MP3Controller.stop();
        if (MP3Controller.playlist.length) {
            setTimeout(function () {
                MP3Controller.play_playlist(MP3Controller.playlist)
            }, 500)
        }
    },
    show_play: function (a) {
        a.down("img").src = "/static/images/play.gif"
    },
    show_pause: function (a) {
        a.down("img").src = "/static/images/stop.gif"
    }
};
var MP3Advanced = {
    song_length: 0,
    play: function (a) {
        if (a == MP3Advanced.url) {
            if (MP3Player.state == "playing") {
                MP3Player.pause()
            } else {
                if (MP3Player.state == "paused" || MP3Player.state == "idle" || MP3Player.state == "completed") {
                    MP3Player.play()
                }
            }
        } else {
            MP3Advanced.url = a;
            MP3Player.load(a);
            MP3Player.observe("time", MP3Advanced.onProgress);
            MP3Player.observe("load", MP3Advanced.onLoadProgress);
            MP3Player.observe("playing", MP3Advanced.onPlay);
            MP3Player.observe("completed", MP3Player.stop);
            MP3Player.observe("idle", MP3Advanced.onStop);
            MP3Player.observe("paused", MP3Advanced.onStop);
            MP3Player.observe("volume", MP3Advanced.onVolume);
            MP3Advanced.song_length = 0;
            MP3Advanced.register_volume()
        }
    },
    register_volume: function () {
        var a = $("volume");
        a.observe("mouseover", function () {
            $("volume-hover").show();
            if (!MP3Advanced.slider) {
                var b = $("volume-slider");
                MP3Advanced.slider = new Control.Slider(b.down(".handle"), b, {
                    range: $R(0, 100),
                    sliderValue: 1,
                    axis: "vertical",
                    onSlide: function (c) {
                        MP3Advanced.setVolume(100 - c)
                    },
                    onChange: function (c) {
                        MP3Advanced.setVolume(100 - c)
                    }
                })
            }
        });
        a.observe("mouseout", function () {
            $("volume-hover").hide()
        })
    },
    onProgress: function (b) {
        var c = b.memo;
        MP3Advanced.song_length = c.duration;
        var a = c.position,
            e = c.duration;
        var d = 100 * a / e;
        if (isNaN(d)) {
            return
        }
        $("progress").style.width = d + "%"
    },
    onLoadProgress: function (a) {
        var b = a.memo;
        var c = b.percentage;
        if (isNaN(c)) {
            return
        }
        $("loaded").style.width = c + "%"
    },
    onPlay: function () {
        $("play").update(new Element("img", {
            src: "/static/images/mp3pause.png"
        }))
    },
    onStop: function () {
        $("play").update(new Element("img", {
            src: "/static/images/mp3play.png"
        }))
    },
    seek: function (c) {
        if (!MP3Player.state) {
            return
        }
        var b = $("progress-cont").viewportOffset()[0];
        var f = c.clientX - b;
        var a = $("progress-cont").getWidth();
        var d = MP3Advanced.song_length * f / a - 1;
        MP3Player.seek(d)
    },
    setVolume: function (a) {
        MP3Player.volume(a)
    },
    onVolume: function (a) {}
};
var MP3Playlist = {
    options: {},
    play: function (a) {
        if (a) {
            Event.stop(a)
        }
        if (!MP3Player.state || MP3Player.state == "idle" || MP3Player.state == "completed") {
            MP3Playlist.load($$("#playlist .song")[0].href)
        } else {
            MP3Advanced.play(MP3Advanced.url)
        }
    },
    load: function (a) {
        MP3Playlist.clear_playing(MP3Advanced.url);
        MP3Player.observe("completed", MP3Playlist.next);
        MP3Player.observe("id3", MP3Playlist.id3);
        MP3Player.observe("load_complete", MP3Playlist.load_complete);
        MP3Advanced.play(a);
        MP3Playlist.show_playing(a)
    },
    get_song_elm: function (a) {
        var b;
        $$(".song").each(function (c) {
            if (c.href == a) {
                b = c
            }
        });
        return b
    },
    next: function () {
        var b = MP3Playlist.get_song_elm(MP3Advanced.url);
        var a = b.up("tr").next("tr");
        if (!a) {
            MP3Playlist.clear_playing(MP3Advanced.url);
            return
        }
        var c = a.down(".song");
        setTimeout(function () {
            MP3Playlist.load(c.href)
        }, 1000)
    },
    load_complete: function () {
        if (MP3Player.meta) {
            MP3Playlist.id3({
                memo: MP3Player.meta
            })
        }
    },
    show_playing: function (a) {
        var b = MP3Playlist.get_song_elm(a);
        if (!b) {
            return
        }
        var c = b.up("tr");
        var d = c.down("td");
        d.update(Sprite.make("play", {}));
        c.addClassName("selected");
        if (MP3Playlist.options && MP3Playlist.options.on_song_change) {
            MP3Playlist.options.on_song_change(c)
        }
    },
    id3: function (a) {
        var b = a.memo;
        var c = MP3Playlist.get_song_elm(MP3Advanced.url);
        if (b.artist && b.name && MP3Advanced.song_length && !c.hasClassName("has_id3")) {
            var d = b.name;
            c.down(".song-name").update(d.escapeHTML());
            c.up("tr").down(".song-artist").update(b.artist.escapeHTML());
            c.up("tr").down(".right-column").update(Util.seconds_to_time(MP3Advanced.song_length));
            c.addClassName("has_id3");
            MP3Playlist.report_id3(b)
        }
    },
    report_id3: function (b) {
        var a = MP3Advanced.url;
        var c = MP3Advanced.song_length;
        if (!c || c <= 0) {
            return
        }
        var d = {
            album: b.album,
            artist: b.artist,
            duration: c,
            name: b.name,
            track: b.track,
            year: b.year
        };
        var e = a.split("/").slice(4).join("/");
        new Ajax.Request("/add_id3/" + e, {
            parameters: d
        })
    },
    clear_playing: function (a) {
        if (!a) {
            return
        }
        var b = MP3Playlist.get_song_elm(a);
        if (!b) {
            return
        }
        var c = b.up("tr");
        var d = c.down("td");
        c.removeClassName("selected");
        d.update()
    }
};
var FilePreviewModal;
var FilePreview = Class.create({
    initialize: function (a, d, c, b) {
        this.fq_path = d;
        this.filename = a;
        this.thumbnail_url_tmpl = c;
        this.dl_url = b
    },
    preload: function () {},
    render: function () {},
    activate: function () {},
    image_size: function () {
        var a = document.viewport.getDimensions();
        return Util.dimensions_to_imagesize(a.width, a.height)
    },
    actions: function () {
        return []
    },
    global_actions: function (c) {
        var b = this.actions();
        var d = new Element("a", {
            href: this.dl_url,
            "class": "title_bubble white",
            title: _("Download")
        });
        d.__date(Sprite.make("download_arrow_white"));
        var e = new Element("a", {
            href: "#",
            id: "lightbox_delete_link",
            "class": "title_bubble white",
            title: _("Delete")
        }).__date(Sprite.make("white-trash"));
        e.observe("click", function (g) {
            g.preventDefault();
            FilePreviewModal.toggle_delete()
        });
        if (Constants.can_shmodel) {
            var f = new Element("a", {
                href: "#",
                id: "lightbox_shmodel_link",
                title: _("Get link to photo"),
                "class": "title_bubble white"
            });
            f.__date(Sprite.make("link_white"));
            var a = (function (g) {
                g.preventDefault();
                Forms.postRequest("/sm/create" + Util.urlquote(this.fq_path), {}, {
                    target: "_blank"
                })
            }).bind(this);
            f.observe("click", a);
            b = b.concat([f, d])
        } else {
            b = b.concat([d])
        }
        if (c.include_delete) {
            b.push(e)
        }
        return b
    }
});
var PhotoPreview = Class.create(FilePreview, {
    initialize: function ($super, a, e, c, b, d) {
        $super(a, e, c, b);
        this.original_url = d;
        this.fail_image_src = "/static/images/preview_fail.png"
    },
    show_fail: function (b) {
        var a = new Element("div").__sert(_("Unable to preview this item."));
        b.__sert(a)
    },
    fallback: function (b) {
        var a = $(b.target);
        a.writeAttribute({
            src: this.fail_image_src,
            width: 128,
            height: 128
        });
        var c = a.up("div.content-item");
        if (c) {
            this.show_fail(c)
        }
    },
    preload: function () {
        var b = this.thumbnail_url_tmpl + "?size=" + this.image_size();
        Util.preload_image(b, this.fallback.bind(this));
        var a = $(Util.preloaded_images[b]);
        a.writeAttribute("class", "thumbnail");
        return a
    },
    render: function () {
        var b = this.preload();
        var d = new Element("div").__sert(b);
        var c = b.getAttribute("src").length;
        var a = b.getAttribute("src").substring(c - this.fail_image_src.length, c);
        if (a == this.fail_image_src) {
            this.show_fail(d)
        }
        return d
    },
    actions: function (b) {
        var a = new Element("a", {
            href: this.original_url,
            "class": "title_bubble white",
            title: _("View original"),
            target: "_blank"
        });
        a.__date(Sprite.make("fullscreen"));
        return [a]
    },
    advance_on_click: true
});
var fp_vid_player = null;
var fp_vid_player_loading = null;
var fp_vid_player_error = null;
var fp_vid_thumbnail_hidden = null;
var FlashDetect;

function render_video_error(b, d) {
    b.down("div.video-player").remove();
    var a = new Element("img", {
        src: "/static/images/preview_fail.png",
        "class": "video-preview-fail"
    });
    var c = new Element("div", {
        "class": "video-preview-fail"
    });
    if (d == "no_flash") {
        c.__sert(_("Please enable Flash to preview this video."))
    } else {
        c.__sert(_("Unable to preview this item."))
    }
    if (!fp_vid_thumbnail_hidden) {
        a.hide();
        c.hide()
    }
    b.__sert(a);
    b.__sert(c)
}
function player_error_handler(b) {
    fp_vid_player_error = true;
    var a = fp_vid_player.up("div.content-item");
    if (a) {
        fp_vid_player = null;
        render_video_error(a, b.message)
    }
}
function playerReady(a) {
    fp_vid_player_loading = null;
    fp_vid_player = document.getElementById(a.id);
    fp_vid_player.addModelListener("error", "player_error_handler");
    fp_vid_player.sendEvent("play", "true");
    fp_vid_player.sendEvent("play", "false")
}
var VideoPreview = Class.create(FilePreview, {
    initialize: function ($super, a, e, d, b, c) {
        $super(a, e, d, c);
        this.preview_url = b;
        this.thumbnail_div = null
    },
    preload: function () {
        if (this.preloaded) {
            return
        }
        var b = this.thumbnail_url_tmpl + "?size=" + this.image_size();
        var f = function (g) {
                $(g.target).writeAttribute("src", Sprite.SPACER)
            };
        Util.preload_image(b, f);
        var a = $(Util.preloaded_images[b]);
        a.writeAttribute("class", "thumbnail");
        var c = new Element("img");
        c.writeAttribute("src", "/static/images/playbutton2.png");
        c.setStyle({
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-58px",
            marginLeft: "-58px"
        });
        var e = new Element("img", {
            "class": "video-player-loading"
        });
        e.writeAttribute("src", "/static/images/bigspinner.gif");
        e.setStyle({
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-16px",
            marginLeft: "-16px",
            display: "none"
        });
        var d = new Element("div", {
            "class": "video_thumbnail"
        });
        d.__sert(c);
        d.__sert(e);
        d.__sert(a);
        this.thumbnail_div = d;
        this.preloaded = true
    },
    render: function () {
        this.preload();
        fp_vid_player_loading = true;
        fp_vid_player_error = null;
        fp_vid_thumbnail_hidden = false;
        this.rendered_div = null;
        var a = new Element("div", {
            "class": "video-player"
        });
        var c = this.image_size().split("x")[0] * 0.8;
        var b = false;
        if (FlashDetect.installed) {
            Util.embed_flash_video.defer(this.preview_url, a, c, 0)
        } else {
            b = true
        }
        a.setStyle({
            position: "absolute",
            left: "-5000px"
        });
        var d = new Element("div");
        d.__sert(this.thumbnail_div);
        d.__sert(a);
        this.rendered_div = d;
        if (b) {
            fp_vid_player_loading = false;
            fp_vid_player_error = true;
            render_video_error(d, "no_flash")
        }
        return d
    },
    play_video: function () {
        if (fp_vid_player_loading || !this.rendered_div) {
            if (this.rendered_div) {
                this.thumbnail_div.down("img.video-player-loading").show()
            }
            setTimeout(this.play_video.bind(this), 100)
        } else {
            if (!fp_vid_thumbnail_hidden) {
                this.thumbnail_div.remove();
                fp_vid_thumbnail_hidden = true;
                if (fp_vid_player_error) {
                    this.rendered_div.down("img.video-preview-fail").show();
                    this.rendered_div.down("div.video-preview-fail").show()
                } else {
                    this.rendered_div.down("div.video-player").setStyle({
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: -fp_vid_player.getHeight() / 2 + "px",
                        marginLeft: -fp_vid_player.getWidth() / 2 + "px"
                    });
                    fp_vid_player.sendEvent("play", "true")
                }
            }
        }
    },
    show_or_play_pause: function () {
        if (fp_vid_thumbnail_hidden) {
            if (fp_vid_player) {
                fp_vid_player.sendEvent("play")
            }
        } else {
            this.play_video()
        }
    },
    activate: function () {
        this.show_or_play_pause()
    }
});
FilePreviewModal = (function () {
    var B = [],
        I = 0,
        D = false,
        a, s = "lightbox",
        w = false,
        z, d;
    var G = function () {
            return Browse.files.length
        };
    var r = function (J) {
            return J.complete !== false
        };
    var F = function () {
            if ($$("#file-preview-modal .loading-image").length) {
                return
            }
            var J = new Element("img", {
                "class": "loading-image",
                src: "/static/images/icons/ajax-loader-black.gif"
            });
            $$("#file-preview-modal .preview-content").first().__sert(J)
        };
    var c = function () {
            $$("#file-preview-modal .loading-image").invoke("remove")
        };
    var p = function () {
            var O = $$("#file-preview-modal .content-item").first().down("img.thumbnail");
            if (!O || !r(O)) {
                return
            }
            var J = $$("#file-preview-modal .preview").first().getDimensions();
            var N;
            if (!O.naturalHeight) {
                N = O.getDimensions();
                O.naturalHeight = N.height;
                O.naturalWidth = N.width
            } else {
                N = {
                    width: O.naturalWidth,
                    height: O.naturalHeight
                }
            }
            var L = N.width / J.width,
                K = N.height / J.height;
            var M = Math.max(L, K);
            O.style.visibility = "";
            if (M < 1) {
                O.style.width = "";
                O.style.height = ""
            } else {
                O.style.width = Math.floor(N.width / M) + "px";
                O.style.height = Math.floor(N.height / M) + "px"
            }
        };
    var g, k;
    var A = function () {
            var K = 0,
                L = 1.5;
            var J = $("file-preview-modal");
            var M = J.down(".menu");
            var N = J.down(".header");
            g = new Effect.Parallel([new Effect.Opacity(M, {
                sync: true,
                to: K
            }), new Effect.Opacity(N, {
                sync: true,
                to: K
            })], {
                duration: L
            })
        };
    var n = function () {
            if (k) {
                clearTimeout(k)
            }
            if (g) {
                g.cancel()
            }
            var J = $("file-preview-modal");
            J.down(".header").setOpacity(1);
            J.down(".menu").setOpacity(1)
        };
    var f = function (K) {
            n();
            var J = K && $(K.target).descendantOf("file-preview-menu");
            if (!w && !J) {
                k = setTimeout(A, 3112)
            }
        };
    var E = function (K) {
            var J = B.length;
            return (J + (I + K) % J) % J
        };
    var H = function (J) {
            B[J].preload()
        };
    var b = function () {
            var J = [1, -1, 2, -2, 3, -3, 4, -4];
            for (var K = 0; K < J.length; K += 1) {
                H(E(J[K]))
            }
        };
    var v = function () {
            TitleBubble.hide_all();
            $$("#file-preview-modal .delete-file-prompt").first().show();
            $("lightbox-delete-photo").focus();
            n();
            w = true
        };
    var y = function () {
            if (w) {
                $$("#file-preview-modal .delete-file-prompt").first().hide();
                f();
                w = false;
                document.activeElement.blur()
            }
        };
    var q = function () {
            (w ? y : v)()
        };
    var x = function () {
            fp_vid_player = null;
            assert(I < B.length, "Invalid index" + I);
            var L = B[I];
            var O = L.render();
            O.addClassName("content-item");
            var K = $("file-preview-modal");
            var N = K.down(".preview-content");
            N.__date(O);
            K.down(".current_index").__date(I + 1);
            K.down(".total").__date(z.num_previews || B.length);
            K.down(".filename").__date(L.filename.snippet(40));
            K.down(".filename").writeAttribute("title", L.filename);
            var M = L.global_actions(z);
            var J = document.createDocumentFragment();
            M.each(function (P) {
                J.appendChild(P)
            });
            K.down(".actions").__date();
            K.down(".actions").appendChild(J);
            b();
            O = O.down("img.thumbnail");
            if (!r(O)) {
                O.hide();
                F();
                O.observe("load", function () {
                    c();
                    O.style.visibility = "hidden";
                    O.show();
                    p()
                })
            } else {
                O.show();
                p()
            }
            document.fire(FilePreviewModal.PHOTO_CHANGE_EVT, L)
        };
    var m = function (J) {
            if (J) {
                J.stop()
            }
            I = E(1);
            if (I === 0) {
                f()
            }
            x()
        };
    var h = function (J) {
            if (J) {
                J.stop()
            }
            I = E(-1);
            x()
        };
    var l = function (J) {
            if (J) {
                J.stop()
            }
            if (w) {
                y()
            } else {
                if (B[I].advance_on_click) {
                    m()
                } else {
                    B[I].activate()
                }
            }
        };
    var e = function (N) {
            var K = B.dict_by("fq_path");
            var O;
            if (N.memo.files) {
                O = N.memo.files.collect(function (P) {
                    return P.fq_path
                })
            } else {
                O = N.memo.fq_paths
            }
            for (var L = 0, J = O.length; L < J; L += 1) {
                var M = O[L];
                if (K[M]) {
                    B.removeItem(K[M])
                }
            }
            if (z.num_previews) {
                z.num_previews--
            }
            if (!z.num_previews && !B.length) {
                d()
            } else {
                h()
            }
        };
    var u = function () {
            Event.stopObserving(document, "mousemove", f);
            Event.stopObserving(document, "click", f);
            document.stopObserving(FileEvents.DELETE, e);
            clearInterval(a)
        };
    d = function (K) {
        if (K) {
            K.preventDefault()
        }
        assert(FilePreviewModal.shown, "Trying to rehide file preview modal");
        var J = $("file-preview-modal");
        J.hide();
        if (fp_vid_player && fp_vid_player.sendEvent) {
            fp_vid_player.sendEvent("stop")
        }
        J.down(".preview-content").__date();
        document.body.removeClassName("full_no_overflow");
        u();
        FilePreviewModal.shown = 0
    };
    var t = "db:filepreview:exitselect";
    var o = function (J) {
            if (z.keep_url) {
                d()
            } else {
                window.history.go(-1)
            }
            Event.extend(J).stop();
            document.fire(t, B[I].fq_path)
        };
    var C = function () {
            if (!D) {
                var J = $("file-preview-modal");
                J.on("click", ".next", m);
                J.on("click", ".prev", h);
                J.on("click", ".close", o);
                J.on("click", ".preview-container", l);
                key("esc", s, function (K) {
                    (w ? y : o)(K)
                });
                key("left, k", s, function (K) {
                    h()
                });
                key("right, j", s, function (K) {
                    m();
                    return false
                });
                key("up, down", s, function (K) {
                    return false
                });
                key("space", s, function (K) {
                    l(K);
                    return false
                });
                if (z.include_delete) {
                    key("delete, command+backspace, backspace", s, function (K) {
                        Event.extend(K).preventDefault();
                        FilePreviewModal.toggle_delete()
                    })
                }
                $("lightbox-delete-photo").observe("click", function (L) {
                    var K = B[I];
                    if (G()) {
                        FileOps.do_delete(K.fq_path)
                    } else {
                        FileOps.do_nonbrowse_delete(K.fq_path)
                    }
                });
                $("lightbox-delete-cancel").observe("click", function () {
                    y()
                });
                DBHistory.add_exit_callback("/lightbox", function () {
                    d()
                });
                Util.disableSelection(J.down(".preview-container"));
                Util.disableSelection(J.down(".header"));
                document.observe(FilePreviewModal.PHOTO_CHANGE_EVT, y);
                D = true
            }
            Event.observe(document, "mousemove", f);
            Event.observe(document, "click", f);
            document.observe(FileEvents.DELETE, e);
            key.setScope(s);
            a = setInterval(p, 500)
        };
    return {
        init: function (J, L) {
            z = {
                include_delete: L.include_delete || false,
                keep_url: L.keep_url || false,
                num_previews: L.num_previews || null
            };
            if (FilePreviewModal.shown) {
                return
            }
            assert(J && J.length, "FilePreviewModal requires file preview objects");
            B = J;
            C();
            I = L.start_index || 0;
            assert(!FilePreviewModal.shown, "Trying to reshow file preview modal");
            $("file-preview-modal").show();
            $(document.body).addClassName("full_no_overflow");
            x();
            FilePreviewModal.shown = 1;
            if (!z.keep_url) {
                var K = DBHistory.deconstruct_url(DBHistory.get_url());
                DBHistory.push_state("/lightbox" + K.path, K.qargs)
            }
            f()
        },
        toggle_delete: q,
        PHOTO_CHANGE_EVT: "db:lightbox:photo_change",
        EXIT_SELECT_EVT: t
    }
})();
var Tour = (function () {
    var c = 6,
        d = 0;
    var a = function (s) {
            $$(".page-end").each(Element.remove);
            var v = s,
                t = c - s - 1,
                q = document.createDocumentFragment();
            for (var r = 0; r < v; r += 1) {
                var u = new Element("img", {
                    src: "/static/images/page-left.png",
                    "class": "page-end-left page-end"
                });
                u.style.left = (28 - r * 5) + "px";
                u.style.zIndex = c - r;
                q.appendChild(u)
            }
            for (var p = 0; p < t; p += 1) {
                var o = new Element("img", {
                    src: "/static/images/page-right.png",
                    "class": "page-end-right page-end"
                });
                o.style.right = (31 - p * 5) + "px";
                o.style.zIndex = c - p;
                q.appendChild(o)
            }
            $("book").appendChild(q)
        };
    var b = function (o) {
            (o > 0 ? Element.show : Element.hide)("tour-page-back");
            (o + 1 < c ? Element.show : Element.hide)("tour-page-forward")
        };
    var e = function (o) {
            $$(".pages").invoke("hide");
            $("page-" + o).show()
        };
    var f = function (o) {
            b(o);
            a(o);
            e(o);
            d = o
        };
    var h = function (p) {
            Event.extend(p).preventDefault();
            var o = d - 1;
            if (o < 0) {
                return
            }
            f(o);
            DBHistory.push_state("/tour/" + o)
        };
    var k = function (p) {
            Event.extend(p).preventDefault();
            var o = d + 1;
            if (o >= c) {
                return
            }
            f(o);
            DBHistory.push_state("/tour/" + o)
        };
    var n = function (p, q) {
            p.preventDefault();
            var o = parseInt(q.href.split("/").last(), 10);
            f(o);
            DBHistory.push_state("/tour/" + o)
        };
    var m = function () {
            $("tour-page-back").observe("click", h);
            $("tour-page-forward").observe("click", k);
            key("right", k);
            key("left", h);
            $("toc").on("click", "a", n)
        };
    var g = function (p, q) {
            var o = parseInt(p, 10) || 0;
            f(o)
        };
    var l = function () {
            $$(".page-right img").each(function (o) {
                Util.preload_image(o.src)
            })
        };
    return {
        setup: function () {
            document.observe("dom:loaded", function () {
                DBHistory.add_callback("/tour", g);
                m();
                l()
            })
        }
    }
})();
Event.observe(window, "load", function () {
    var b = $("footer");
    if (b) {
        var a = b.getStyle("display") == "none" || b.getWidth() < 900;
        if (!a) {
            assert(false, "HTML Broken on " + window.location.pathname)
        }
    }
});
window.LoadedJsSuccessfully = true;
var CameraUploads = {
    SIZE_Q: "?size=cu_150",
    SCROLL_OFFSET: 1000,
    LIGHTBOX_OFFSET: 30,
    LOADING_SPINNER: new HTML('<div id="cu-loading"><img src="/static/images/icons/ajax-loading-small.gif" /></div>'),
    _photos: [],
    _preview_objs: [],
    _num_total: 0,
    _selected_index: -1,
    _cursor: null,
    _prev_date: null,
    _getting_more: false,
    _flow: false,
    init: function (e, b, c, d, a) {
        CameraUploads._flow = a;
        if (a) {
            CameraUploads.SIZE_Q = "?size=l"
        }
        CameraUploads._photos = e;
        CameraUploads._num_total = b;
        CameraUploads._listen();
        if (c) {
            CameraUploads._cursor = d
        } else {
            CameraUploads._cursor = null;
            Event.stopObserving(window, "scroll")
        }
        CameraUploads._render(e)
    },
    _listen: function () {
        document.body.on("click", ".cu-thumb", CameraUploads._preview);
        document.observe(FilePreviewModal.PHOTO_CHANGE_EVT, CameraUploads._lightbox_event);
        document.observe(FilePreviewModal.EXIT_SELECT_EVT, CameraUploads._lightbox_exit);
        document.observe(FileEvents.DELETE, CameraUploads._delete);
        Event.observe(window, "scroll", CameraUploads._window_scroll);
        DBHistory.add_callback("/cu", CameraUploads._history_change_handler)
    },
    _render: function (e) {
        var b = [];
        var d;
        var c;
        if (CameraUploads._prev_date) {
            d = CameraUploads._prev_date
        } else {
            d = new Date(e[0].time_taken);
            b.push(CameraUploads._generate_month_header(d))
        }
        e.each(function (f) {
            c = new Date(f.time_taken);
            if (c.getMonth() !== d.getMonth() || c.getFullYear() !== d.getFullYear()) {
                b.push(CameraUploads._generate_month_header(c))
            }
            b.push(new HTML('<img src="' + Sprite.SPACER + '" data-src="' + f.thumbnail_url + CameraUploads.SIZE_Q + '" class="cu-thumb" />'));
            CameraUploads._preview_objs.push(CameraUploads._get_preview_obj(f));
            d = c
        });
        CameraUploads._prev_date = d;
        if (CameraUploads._cursor) {
            b.push(CameraUploads.LOADING_SPINNER)
        }
        $("photos-list").__sert(b);
        var a = Util.calc_thumb_prep_size();
        $$(".cu-thumb").each(function (f) {
            Util.thumb_load(f, a)
        });
        if (CameraUploads._flow) {
            $$(".cu-thumb").each(function (f) {
                f.setStyle({
                    width: "auto"
                })
            })
        }
    },
    _preview: function (a) {
        FilePreviewModal.init(CameraUploads._preview_objs, {
            start_index: $$(".cu-thumb").indexOf(a.target),
            include_delete: true,
            num_previews: CameraUploads._num_total
        })
    },
    _window_scroll: function () {
        var b = document.viewport.getScrollOffsets().top;
        var a = document.viewport.getHeight();
        var c = document.body.getHeight();
        if (b + a + CameraUploads.SCROLL_OFFSET >= c) {
            CameraUploads._get_more()
        }
    },
    _lightbox_event: function (a) {
        CameraUploads._selected_index = CameraUploads._preview_objs.indexOf(a.memo);
        if (CameraUploads._cursor && CameraUploads._selected_index > CameraUploads._preview_objs.length - CameraUploads.LIGHTBOX_OFFSET) {
            CameraUploads._get_more()
        }
    },
    _lightbox_exit: function (a) {
        key.setScope("all")
    },
    _history_change_handler: function () {
        if (CameraUploads._selected_index > -1) {
            CameraUploads._scroll_to_thumb(CameraUploads._selected_index)
        }
    },
    _delete: function (c) {
        assert(c.memo.fq_paths.length === 1, "Should only be possible to delete 1 photo at a time from camera uploads tab");
        var b = c.memo.fq_paths[0];
        for (var a = 0; a < CameraUploads._photos.length; a++) {
            if (CameraUploads._photos[a].path === b) {
                CameraUploads._photos.splice(a, 1);
                $$(".cu-thumb")[a].remove();
                break
            }
        }
    },
    _get_more: function () {
        if (CameraUploads._getting_more) {
            return
        }
        CameraUploads._getting_more = true;
        new Ajax.DBRequest("/more_cu", {
            parameters: {
                cursor: CameraUploads._cursor
            },
            onSuccess: function (a) {
                if ($("cu-loading")) {
                    $("cu-loading").remove()
                }
                var b = Util.from_json(a.responseText);
                CameraUploads._photos = CameraUploads._photos.concat(b.photos);
                if (b.more) {
                    CameraUploads._cursor = b.cursor
                } else {
                    CameraUploads._cursor = null;
                    Event.stopObserving(window, "scroll")
                }
                CameraUploads._render(b.photos);
                CameraUploads._getting_more = false
            }
        })
    },
    _get_preview_obj: function (a) {
        if (a.preview_type == "photo" && a.thumbnail_url) {
            return new PhotoPreview(a.filename, a.path, a.thumbnail_url, a.href + "&dl=1", a.href)
        } else {
            if (a.preview_type == "video" && a.thumbnail_url && !Constants.DISABLE_VIDEOS_IN_LIGHTBOX) {
                return new VideoPreview(a.filename, a.path, a.thumbnail_url, "https://" + Constants.LIVE_TRANSCODE_SERVER + "/transcode_video/w/" + a.block_hash + Util.urlquote(a.path), a.href + "&dl=1")
            }
        }
        return null
    },
    _generate_month_header: function (a) {
        return new HTML('<h1 class="cu-month-header">' + _("%(month)s %(year)s").format({
            month: Util.month_name(a.getMonth()),
            year: a.getFullYear()
        }) + "</h1>")
    },
    _scroll_to_thumb: function (b) {
        var a = $$(".cu-thumb")[b];
        var f = a.cumulativeOffset().top;
        var e = a.getHeight();
        var d = document.viewport.getScrollOffsets().top;
        var c = document.viewport.getHeight();
        if (f < d || f + e > d + c) {
            Util.scroll_to(0, f - c / 2)
        }
    },
    reflow: function () {
        var h = 800;
        var e = 10;
        var b = 150;
        var d = $$(".cu-thumb");
        var k = [];
        var c = 0;
        var l;
        for (var g = 0; g < d.length; g++) {
            l = d[g];
            if (c + l.width + e > h) {
                if (c - h < l.width / 2) {
                    k.push(l);
                    c += l.width + e;
                    var a = b * (h - e * k.length) / (c - e * k.length) - 1;
                    for (var f = 0; f < k.length; f++) {
                        k[f].setStyle({
                            height: a + "px"
                        })
                    }
                    k = [];
                    c = 0
                } else {
                    CameraUploads._adjust_row_height(k, c);
                    k = [l];
                    c = l.width + e
                }
            } else {
                k.push(l);
                c += l.width + e
            }
        }
    }
};
