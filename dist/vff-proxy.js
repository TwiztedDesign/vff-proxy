/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BYPASS_PREFIX = '__bypass__',
    PARENT_ID = '__parent_id__',
    PARENT_KEY = '__parent_key__',
    PROXY_ID = '__proxy__',
    IS_PROXY = '__isProxy__',
    SELF = '__self__';

var isInternalProperty = function isInternalProperty(prop) {
    return prop.startsWith('__') && prop.endsWith('__') && prop !== '__proxy__';
};
var cleanInternal = function cleanInternal(object) {
    Object.keys(object).forEach(function (key) {
        if (isInternalProperty(key)) {
            delete object[key];
        }if (_typeof(object[key]) === 'object') {
            cleanInternal(object[key]);
        }
    });
};
var noBypass = function noBypass(key) {
    return typeof key === 'string' ? key.replace(BYPASS_PREFIX, '') : '';
};

var VFFProxy = function () {
    function VFFProxy(data, traps) {
        _classCallCheck(this, VFFProxy);

        this._proxies = {};

        this._parents = new WeakMap();
        this._parentIDs = {};

        traps = traps || {};
        this._proxy = new Proxy(this._copy(data), this._traps(traps));

        var self = this;

        return new Proxy(this, {
            get: function get(target, prop) {

                if (prop in target) {
                    return target[prop];
                }
                var key = (0, _helpers.findKey)(self._proxy, noBypass(prop));
                prop = key || prop;
                return self._proxy[prop];
            },
            set: function set(target, prop, value) {
                if (prop in target) {
                    throw new Error("Override Error: " + prop + " is an internal vff property and can't be overridden");
                    // return target[prop] = value;
                } else {
                    target._proxy[prop] = value;
                }
                return true;
            }
        });
    }
    /************************* PUBLIC *****************************/


    _createClass(VFFProxy, [{
        key: 'findKey',
        value: function findKey(key) {
            return (0, _helpers.findKey)(this._proxy, key);
        }
    }, {
        key: 'update',
        value: function update(data) {
            var toUpdate = this._copy(data, BYPASS_PREFIX);
            (0, _helpers.deepExtend)(this._proxy, toUpdate);
        }
    }, {
        key: 'equals',
        value: function equals(data) {
            return (0, _helpers.deepCompare)(this._proxy, data);
        }

        /************************* PRIVATE *****************************/

    }, {
        key: '_copy',
        value: function _copy(o, prefix) {
            prefix = prefix || '';
            var output = void 0,
                v = void 0,
                key = void 0;
            output = Array.isArray(o) ? [] : {};
            for (key in o) {
                v = o[key];
                if (Array.isArray(output)) {
                    output[key] = (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === "object" ? this._copy(v, prefix) : v;
                } else {
                    output[prefix + key] = (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === "object" ? this._copy(v, prefix) : v;
                }
            }
            return output;
        }
    }, {
        key: '_set',
        value: function _set(target, key, value) {
            target[BYPASS_PREFIX + key] = value;
        }
    }, {
        key: '_getPath',
        value: function _getPath(obj, key) {
            var path = key ? [key] : [];
            var tmp = obj;
            while (tmp[PARENT_ID]) {
                path.unshift(tmp[PARENT_KEY]);
                tmp = this._parentIDs[tmp[PARENT_ID]];
            }
            return path;
        }
    }, {
        key: '_traps',
        value: function _traps(trapFuncs) {
            var self = this;

            var traps = {
                set: function set(target, key, value) {
                    var bypass = key.startsWith(BYPASS_PREFIX);
                    // if (bypass && !target[IS_PROXY]) {
                    if (bypass) {
                        key = key.substr(BYPASS_PREFIX.length);
                    }
                    target[key] = value;
                    // if (!bypass && !target[IS_PROXY] && typeof value !== 'object') {
                    if (!bypass) {
                        if (trapFuncs.set) {
                            //set with parent object, path array, value
                            var path = self._getPath(target, key);
                            // cleanInternal(target);
                            trapFuncs.set(target, path, value);
                        }
                    }
                    return true;
                },
                get: function get(target, key) {
                    if (key === IS_PROXY) {
                        return true;
                    }
                    if (key === SELF) {
                        cleanInternal(target);
                        return target;
                    }
                    if (key.startsWith && key.startsWith(BYPASS_PREFIX)) {
                        key = key.substr(BYPASS_PREFIX.length);
                    }

                    // if (typeof target[key] === 'object' && target[key] !== null && !target[key][IS_PROXY] && !isInternalProperty(key)) {
                    if (_typeof(target[key]) === 'object' && target[key] !== null && !isInternalProperty(key)) {
                        if (target[key][PROXY_ID]) {
                            return self._proxies[target[key][PROXY_ID]];
                        } else {
                            var proxy = new Proxy(target[key], traps);

                            var parentID = void 0;
                            if (!self._parents.has(target)) {
                                parentID = (0, _helpers.uuid)();
                                self._parents.set(target, parentID);
                                self._parentIDs[parentID] = target;
                            }
                            parentID = parentID || self._parents.get(target);

                            self._set(proxy, PARENT_KEY, key);
                            self._set(proxy, PARENT_ID, parentID);
                            var proxyID = (0, _helpers.uuid)();
                            self._proxies[proxyID] = proxy;
                            target[key][PROXY_ID] = proxyID;
                            return proxy;
                        }
                    } else {
                        return target[key];
                    }
                }
            };
            return traps;
        }
    }]);

    return VFFProxy;
}();

exports.default = VFFProxy;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function findKey(data, keyToFind) {
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase() === keyToFind.toLowerCase()) {
            return keys[i];
        }
    }
}
function trim(str, charList) {
    if (charList === undefined) {
        charList = "\\s";
    }
    return str.replace(new RegExp("^[" + charList + "]+"), "").replace(new RegExp("[" + charList + "]+$"), "");
}

function getByPath(obj, path) {
    path = path ? trim(path, '.').split('.') : [""];

    var result = obj;
    for (var i = 0; i < path.length; i++) {
        result = result[path[i]];
        if (result === undefined) {
            return result;
        }
    }

    return result;
}
function setByPath(obj, path, value) {
    if (arguments.length !== 3) {
        throw new Error('Missing Arguments!');
    }
    path = path ? trim(path, '.').split('.') : [""];
    var result = obj;
    for (var i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
            result[path[i]] = value;
        } else {
            if (result[path[i]] !== undefined) {
                result = result[path[i]];
            } else {
                return;
            }
        }
    }
}

function camelize(str) {
    return str.replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
    }).replace(/\s/g, '').replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
    });
    // return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    //     return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    // }).replace(/\s+/g, '');
}
function decamelize(str) {
    return str.replace(/([A-Z])/g, ' $1').trim();
}

function uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function mobilecheck() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|Tablet|iPad|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; // eslint-disable-line no-useless-escape
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
function controllerCheck() {
    try {
        return window.frameElement.ownerDocument.defaultView.frameElement.hasAttribute('controller');
    } catch (err) {
        return false;
    }
}

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) a[key] = b[key];
    }return a;
}

function deepExtend(destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor && source[property].constructor === Object) {
            destination[property] = destination[property] && destination[property].constructor && destination[property].constructor === Object ? destination[property] : {};
            deepExtend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
}

function modeCheck() {
    //"controller_preview" "controller_program" "editor" "player_external" "player_internal"
    var mode = 'normal';

    try {
        var frame = window.frameElement.ownerDocument.defaultView.frameElement;
        mode = frame.getAttribute('vff-mode') || mode;
    } catch (err) {
        // not in iframe
    }
    return mode;
}
function docRef(anchor) {
    return 'https://www.videoflow.io/documentation/api/vff?id=' + anchor;
}

//compares only properties from lhs and ignores properties that start with _
function deepCompare() {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if (typeof x === 'function' && typeof y === 'function' || x instanceof Date && y instanceof Date || x instanceof RegExp && y instanceof RegExp || x instanceof String && y instanceof String || x instanceof Number && y instanceof Number) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        // for (p in y) {
        //     if(!p.startsWith('_')){
        //         if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        //             return false;
        //         }
        //         else if (typeof y[p] !== typeof x[p]) {
        //             return false;
        //         }
        //     }
        //
        // }

        for (p in x) {
            if (!p.startsWith('_')) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                } else if (_typeof(y[p]) !== _typeof(x[p])) {
                    return false;
                }

                switch (_typeof(x[p])) {
                    case 'object':
                    case 'function':

                        leftChain.push(x);
                        rightChain.push(y);

                        if (!compare2Objects(x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true;
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}

function noop() {}

module.exports = {
    findKey: findKey,
    trim: trim,
    getByPath: getByPath,
    setByPath: setByPath,
    camelize: camelize,
    decamelize: decamelize,
    uuid: uuid,
    extend: extend,
    deepExtend: deepExtend,
    deepCompare: deepCompare,
    isMobile: mobilecheck(),
    isController: controllerCheck(),
    mode: modeCheck(),
    docRef: docRef,
    noop: noop
};

/***/ })
/******/ ]);
//# sourceMappingURL=vff-proxy.js.map