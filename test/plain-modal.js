var PlainModal =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * CSSPrefix
 * https://github.com/anseki/cssprefix
 *
 * Copyright (c) 2017 anseki
 * Licensed under the MIT license.
 */

function ucf(text) {
  return text.substr(0, 1).toUpperCase() + text.substr(1);
}

var PREFIXES = ['webkit', 'ms', 'moz', 'o'],
    NAME_PREFIXES = PREFIXES.reduce(function (prefixes, prefix) {
  prefixes.push(prefix);
  prefixes.push(ucf(prefix));
  return prefixes;
}, []),
    VALUE_PREFIXES = PREFIXES.map(function (prefix) {
  return '-' + prefix + '-';
}),


/**
 * Get sample CSSStyleDeclaration.
 * @returns {CSSStyleDeclaration}
 */
getDeclaration = function () {
  var declaration = void 0;
  return function () {
    return declaration = declaration || document.createElement('div').style;
  };
}(),


/**
 * Normalize name.
 * @param {} propName - A name that is normalized.
 * @returns {string} - A normalized name.
 */
normalizeName = function () {
  var rePrefixedName = new RegExp('^(?:' + PREFIXES.join('|') + ')(.)', 'i'),
      reUc = /[A-Z]/;
  return function (propName) {
    return (propName = (propName + '').replace(/\s/g, '').replace(/-([\da-z])/gi, function (str, p1) {
      return p1.toUpperCase();
    }) // camelCase
    // 'ms' and 'Ms' are found by rePrefixedName 'i' option
    .replace(rePrefixedName, function (str, p1) {
      return reUc.test(p1) ? p1.toLowerCase() : str;
    }) // Remove prefix
    ).toLowerCase() === 'float' ? 'cssFloat' : propName;
  }; // For old CSSOM
}(),


/**
 * Normalize value.
 * @param {} propValue - A value that is normalized.
 * @returns {string} - A normalized value.
 */
normalizeValue = function () {
  var rePrefixedValue = new RegExp('^(?:' + VALUE_PREFIXES.join('|') + ')', 'i');
  return function (propValue) {
    return (propValue + '').replace(/\s/g, '').replace(rePrefixedValue, '');
  };
}(),


/**
 * Polyfill for `CSS.supports`.
 * @param {string} propName - A name.
 * @param {string} propValue - A value.
 * @returns {boolean} - `true` if given pair is accepted.
 */
cssSupports = function () {
  // return window.CSS && window.CSS.supports || ((propName, propValue) => {
  // `CSS.supports` doesn't find prefixed property.
  return function (propName, propValue) {
    var declaration = getDeclaration();
    // In some browsers, `declaration[prop] = value` updates any property.
    propName = propName.replace(/[A-Z]/g, function (str) {
      return '-' + str.toLowerCase();
    }); // kebab-case
    declaration.setProperty(propName, propValue);
    return declaration.getPropertyValue(propName) === propValue;
  };
}(),
    propNames = {},
    propValues = {}; // Cache

// [DEBUG]
window.normalizeName = normalizeName;
window.normalizeValue = normalizeValue;
window.cssSupports = cssSupports;
// [/DEBUG]

function getName(propName) {
  propName = normalizeName(propName);
  if (propName && propNames[propName] == null) {
    window.getNameDone = 'get'; // [DEBUG/]
    var declaration = getDeclaration();

    if (declaration[propName] != null) {
      // Original
      propNames[propName] = propName;
    } else {
      // Try with prefixes
      var ucfName = ucf(propName);
      if (!NAME_PREFIXES.some(function (prefix) {
        var prefixed = prefix + ucfName;
        if (declaration[prefixed] != null) {
          propNames[propName] = prefixed;
          return true;
        }
        return false;
      })) {
        propNames[propName] = false;
      }
    }
  }
  return propNames[propName] || void 0;
}

function getValue(propName, propValue) {
  var res = void 0;

  if (!(propName = getName(propName))) {
    return res;
  } // Invalid property

  propValues[propName] = propValues[propName] || {};
  (Array.isArray(propValue) ? propValue : [propValue]).some(function (propValue) {
    propValue = normalizeValue(propValue);
    (window.getValueDone = window.getValueDone || []).push(propValue); // [DEBUG/]

    if (propValues[propName][propValue] != null) {
      // Cache
      if (propValues[propName][propValue] !== false) {
        res = propValues[propName][propValue];
        return true;
      } else {
        return false; // Continue to next value
      }
    }
    window.getValueDone.push('get'); // [DEBUG/]

    if (cssSupports(propName, propValue)) {
      // Original
      res = propValues[propName][propValue] = propValue;
      return true;
    }

    if (VALUE_PREFIXES.some(function (prefix) {
      // Try with prefixes
      var prefixed = prefix + propValue;
      if (cssSupports(propName, prefixed)) {
        res = propValues[propName][propValue] = prefixed;
        return true;
      }
      return false;
    })) {
      return true;
    }

    propValues[propName][propValue] = false;
    return false; // Continue to next value
  });

  return typeof res === 'string' ? res : void 0; // It might be empty string.
}

var CSSPrefix = {
  getName: getName,
  getValue: getValue
};

exports.default = CSSPrefix;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * mClassList
 * https://github.com/anseki/m-class-list
 *
 * Copyright (c) 2017 anseki
 * Licensed under the MIT license.
 */

function normalize(token) {
  return (token + '').trim();
} // Not `||`
function applyList(list, element) {
  element.setAttribute('class', list.join(' '));
}

function _add(list, element, tokens) {
  if (tokens.filter(function (token) {
    if (!(token = normalize(token)) || list.indexOf(token) !== -1) {
      return false;
    }
    list.push(token);
    return true;
  }).length) {
    applyList(list, element);
  }
}

function _remove(list, element, tokens) {
  if (tokens.filter(function (token) {
    var i = void 0;
    if (!(token = normalize(token)) || (i = list.indexOf(token)) === -1) {
      return false;
    }
    list.splice(i, 1);
    return true;
  }).length) {
    applyList(list, element);
  }
}

function _toggle(list, element, token, force) {
  var i = list.indexOf(token = normalize(token));
  if (i !== -1) {
    if (force) {
      return true;
    }
    list.splice(i, 1);
    applyList(list, element);
    return false;
  } else {
    if (force === false) {
      return false;
    }
    list.push(token);
    applyList(list, element);
    return true;
  }
}

function _replace(list, element, token, newToken) {
  var i = void 0;
  if (!(token = normalize(token)) || !(newToken = normalize(newToken)) || token === newToken || (i = list.indexOf(token)) === -1) {
    return;
  }
  list.splice(i, 1);
  if (list.indexOf(newToken) === -1) {
    list.push(newToken);
  }
  applyList(list, element);
}

function mClassList(element) {
  return !mClassList.ignoreNative && element.classList || function () {
    var list = (element.getAttribute('class') || '').trim().split(/\s+/).filter(function (token) {
      return !!token;
    }),
        ins = {
      length: list.length,
      item: function item(i) {
        return list[i];
      },
      contains: function contains(token) {
        return list.indexOf(normalize(token)) !== -1;
      },
      add: function add() {
        _add(list, element, Array.prototype.slice.call(arguments));
        return mClassList.methodChain ? ins : void 0;
      },
      remove: function remove() {
        _remove(list, element, Array.prototype.slice.call(arguments));
        return mClassList.methodChain ? ins : void 0;
      },
      toggle: function toggle(token, force) {
        return _toggle(list, element, token, force);
      },
      replace: function replace(token, newToken) {
        _replace(list, element, token, newToken);
        return mClassList.methodChain ? ins : void 0;
      }
    };
    return ins;
  }();
}
mClassList.methodChain = true;

exports.default = mClassList;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * AnimEvent
 * https://github.com/anseki/anim-event
 *
 * Copyright (c) 2017 anseki
 * Licensed under the MIT license.
 */

var MSPF = 1000 / 60,
    // ms/frame (FPS: 60)
KEEP_LOOP = 500,


/**
 * @typedef {Object} task
 * @property {Event} event
 * @property {function} listener
 */

/** @type {task[]} */
tasks = [];

var requestAnim = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  return setTimeout(callback, MSPF);
},
    cancelAnim = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function (requestID) {
  return clearTimeout(requestID);
},
    requestID = void 0,
    lastFrameTime = Date.now();

// [DEBUG]
var requestAnimSave = requestAnim,
    cancelAnimSave = cancelAnim;
window.AnimEventByTimer = function (byTimer) {
  if (byTimer) {
    requestAnim = function requestAnim(callback) {
      return setTimeout(callback, MSPF);
    };
    cancelAnim = function cancelAnim(requestID) {
      return clearTimeout(requestID);
    };
  } else {
    requestAnim = requestAnimSave;
    cancelAnim = cancelAnimSave;
  }
};
// [/DEBUG]

function step() {
  var called = void 0,
      next = void 0;

  if (requestID) {
    cancelAnim.call(window, requestID);
    requestID = null;
  }

  tasks.forEach(function (task) {
    if (task.event) {
      task.listener(task.event);
      task.event = null;
      called = true;
    }
  });

  if (called) {
    lastFrameTime = Date.now();
    next = true;
  } else if (Date.now() - lastFrameTime < KEEP_LOOP) {
    // Go on for a while
    next = true;
  }
  if (next) {
    requestID = requestAnim.call(window, step);
  }
}

function indexOfTasks(listener) {
  var index = -1;
  tasks.some(function (task, i) {
    if (task.listener === listener) {
      index = i;
      return true;
    }
    return false;
  });
  return index;
}

var AnimEvent = {
  /**
   * @param {function} listener - An event listener.
   * @returns {(function|null)} - A wrapped event listener.
   */
  add: function add(listener) {
    var task = void 0;
    if (indexOfTasks(listener) === -1) {
      tasks.push(task = { listener: listener });
      return function (event) {
        task.event = event;
        if (!requestID) {
          step();
        }
      };
    } else {
      return null;
    }
  },

  remove: function remove(listener) {
    var iRemove = void 0;
    if ((iRemove = indexOfTasks(listener)) > -1) {
      tasks.splice(iRemove, 1);
      if (!tasks.length && requestID) {
        cancelAnim.call(window, requestID);
        requestID = null;
      }
    }
  }
};

exports.default = AnimEvent;
module.exports = exports["default"];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * PlainModal
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://anseki.github.io/plain-modal/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2017 anseki
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// [DRAG]


var _cssprefix = __webpack_require__(0);

var _cssprefix2 = _interopRequireDefault(_cssprefix);

var _mClassList = __webpack_require__(1);

var _mClassList2 = _interopRequireDefault(_mClassList);

var _plainOverlay = __webpack_require__(4);

var _plainOverlay2 = _interopRequireDefault(_plainOverlay);

var _default = __webpack_require__(6);

var _default2 = _interopRequireDefault(_default);

var _plainDraggable = __webpack_require__(7);

var _plainDraggable2 = _interopRequireDefault(_plainDraggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// [/DRAG]
_mClassList2.default.ignoreNative = true;

var APP_ID = 'plainmodal',
    STYLE_ELEMENT_ID = APP_ID + '-style',
    STYLE_CLASS = APP_ID,
    STYLE_CLASS_CONTENT = APP_ID + '-content',
    STYLE_CLASS_OVERLAY = APP_ID + '-overlay',
    STYLE_CLASS_OVERLAY_HIDE = STYLE_CLASS_OVERLAY + '-hide',
    STYLE_CLASS_OVERLAY_FORCE = STYLE_CLASS_OVERLAY + '-force',
    STATE_CLOSED = 0,
    STATE_OPENING = 1,
    STATE_OPENED = 2,
    STATE_CLOSING = 3,
    STATE_INACTIVATING = 4,
    STATE_INACTIVATED = 5,
    STATE_ACTIVATING = 6,
    CLOSE_BUTTON = 'plainmodal-close',
    DURATION = 200,
    // COPY from PlainOverlay

IS_TRIDENT = !!document.uniqueID,
    IS_EDGE = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style && !window.navigator.msPointerEnabled,
    IS_WEBKIT = !window.chrome && 'WebkitAppearance' in document.documentElement.style,
    // [DEBUG/]
IS_BLINK = !!(window.chrome && window.chrome.webstore),
    // [DEBUG/]
IS_GECKO = 'MozAppearance' in document.documentElement.style,
    // [DEBUG/]

isObject = function () {
  var toString = {}.toString,
      fnToString = {}.hasOwnProperty.toString,
      objFnString = fnToString.call(Object);
  return function (obj) {
    var proto = void 0,
        constr = void 0;
    return obj && toString.call(obj) === '[object Object]' && (!(proto = Object.getPrototypeOf(obj)) || (constr = proto.hasOwnProperty('constructor') && proto.constructor) && typeof constr === 'function' && fnToString.call(constr) === objFnString);
  };
}(),
    isFinite = Number.isFinite || function (value) {
  return typeof value === 'number' && window.isFinite(value);
},


/**
 * An object that has properties of instance.
 * @typedef {Object} props
 * @property {Element} elmContent - Content element.
 * @property {Element} elmOverlay - Overlay element. (Not PlainOverlay)
 * @property {Element} elmCloseButton - Element as closeButton.
 * @property {PlainOverlay} plainOverlay - PlainOverlay instance.
 * @property {PlainDraggable} plainDraggable - PlainDraggable instance.
 * @property {number} state - Current state.
 * @property {Object} options - Options.
 * @property {props} parentProps - props that is effected with current props.
 */

/** @type {Object.<_id: number, props>} */
insProps = {},


/**
 * A `props` list, it have a `state` other than `STATE_CLOSED`.
 * A `props` is pushed to the end of this array, `insShown[insShown.length - 1]` can be active.
 * @type {Array.<props>}
 */
insShown = [];

var insId = 0,
    insOpenCloseEffect = void 0; // A `props` that is running the "open/close" effect now.

// [DEBUG]
window.insProps = insProps;
window.IS_TRIDENT = IS_TRIDENT;
window.IS_EDGE = IS_EDGE;
window.IS_WEBKIT = IS_WEBKIT;
window.IS_BLINK = IS_BLINK;
window.IS_GECKO = IS_GECKO;
// [/DEBUG]

// [DEBUG]
var traceLog = [];
var STATE_TEXT = {};
STATE_TEXT[STATE_CLOSED] = 'STATE_CLOSED';
STATE_TEXT[STATE_OPENING] = 'STATE_OPENING';
STATE_TEXT[STATE_OPENED] = 'STATE_OPENED';
STATE_TEXT[STATE_CLOSING] = 'STATE_CLOSING';
STATE_TEXT[STATE_INACTIVATING] = 'STATE_INACTIVATING';
STATE_TEXT[STATE_INACTIVATED] = 'STATE_INACTIVATED';
STATE_TEXT[STATE_ACTIVATING] = 'STATE_ACTIVATING';
// [/DEBUG]

function forceReflow(target) {
  // Trident and Blink bug (reflow like `offsetWidth` can't update)
  setTimeout(function () {
    var parentNode = target.parentNode,
        next = target.nextSibling;
    // It has to be removed first for Blink.
    parentNode.insertBefore(parentNode.removeChild(target), next);
  }, 0);
}

/**
 * @param {Element} element - A target element.
 * @returns {boolean} `true` if connected element.
 */
function isElement(element) {
  return !!(element && element.nodeType === Node.ELEMENT_NODE &&
  // element instanceof HTMLElement &&
  typeof element.getBoundingClientRect === 'function' && !(element.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED));
}

function finishOpening(props) {
  traceLog.push('<finishOpening>', '_id:' + props._id, 'state:' + STATE_TEXT[props.state]); // [DEBUG/]
  insOpenCloseEffect = null;
  props.state = STATE_OPENED;
  if (props.parentProps) {
    // [DEBUG]
    traceLog.push('parentProps._id:' + props.parentProps._id, 'parentProps.state:' + STATE_TEXT[props.parentProps.state]);
    // [/DEBUG]
    props.parentProps.state = STATE_INACTIVATED;
  }
  if (props.options.onOpen) {
    props.options.onOpen.call(props.ins);
  }
  traceLog.push('_id:' + props._id, 'state:' + STATE_TEXT[props.state], '</finishOpening>'); // [DEBUG/]
}

function finishClosing(props) {
  traceLog.push('<finishClosing>', '_id:' + props._id, 'state:' + STATE_TEXT[props.state]); // [DEBUG/]
  if (insShown[insShown.length - 1] !== props) {
    throw new Error('`insShown` is broken.');
  } // [DEBUG/]
  insShown.pop();
  insOpenCloseEffect = null;
  props.state = STATE_CLOSED;
  if (props.parentProps) {
    // [DEBUG]
    traceLog.push('parentProps._id:' + props.parentProps._id, 'parentProps.state:' + STATE_TEXT[props.parentProps.state]);
    // [/DEBUG]
    props.parentProps.state = STATE_OPENED;
    props.parentProps = null;
  }
  if (props.options.onClose) {
    props.options.onClose.call(props.ins);
  }
  traceLog.push('_id:' + props._id, 'state:' + STATE_TEXT[props.state], '</finishClosing>'); // [DEBUG/]
}

/**
 * Process after preparing data and adjusting style.
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function execOpening(props, force) {
  traceLog.push('<execOpening>', '_id:' + props._id, 'state:' + STATE_TEXT[props.state]); // [DEBUG/]
  traceLog.push('force:' + !!force); // [DEBUG/]
  if (props.parentProps) {
    // inactivate parentProps
    // [DEBUG]
    traceLog.push('parentProps._id:' + props.parentProps._id, 'parentProps.state:' + STATE_TEXT[props.parentProps.state]);
    // [/DEBUG]
    /*
      Cases:
        - STATE_OPENED or STATE_ACTIVATING, regardless of force
        - STATE_INACTIVATING and force
    */
    var parentProps = props.parentProps,
        elmOverlay = parentProps.elmOverlay;
    if (parentProps.state === STATE_OPENED) {
      elmOverlay.style[_cssprefix2.default.getName('transitionDuration')] = props.options.duration === DURATION ? '' : props.options.duration + 'ms';
    }
    (0, _mClassList2.default)(elmOverlay).add(STYLE_CLASS_OVERLAY_HIDE).toggle(STYLE_CLASS_OVERLAY_FORCE, !!force);
    // same condition as props
    if (!force) {
      parentProps.state = STATE_INACTIVATING;
    }
  }

  // When `force`, `props.state` is updated immediately in
  //    plainOverlay.onShow -> finishOpening -> STATE_OPENED
  if (!force) {
    props.state = STATE_OPENING;
  }
  props.plainOverlay.show(force);
  traceLog.push('_id:' + props._id, 'state:' + STATE_TEXT[props.state], '</execOpening>'); // [DEBUG/]
}

/**
 * Process after preparing data and adjusting style.
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @param {boolean} [sync] - `force` with sync-mode. (Skip restoring active element)
 * @returns {void}
 */
function execClosing(props, force, sync) {
  traceLog.push('<execClosing>', '_id:' + props._id, 'state:' + STATE_TEXT[props.state]); // [DEBUG/]
  traceLog.push('force:' + !!force, 'sync:' + !!sync); // [DEBUG/]
  if (props.parentProps) {
    // activate parentProps
    // [DEBUG]
    traceLog.push('parentProps._id:' + props.parentProps._id, 'parentProps.state:' + STATE_TEXT[props.parentProps.state]);
    // [/DEBUG]
    /*
      Cases:
        - STATE_INACTIVATED or STATE_INACTIVATING, regardless of `force`
        - STATE_ACTIVATING and `force`
    */
    var parentProps = props.parentProps,
        elmOverlay = parentProps.elmOverlay;
    if (parentProps.state === STATE_INACTIVATED) {
      elmOverlay.style[_cssprefix2.default.getName('transitionDuration')] = props.options.duration === DURATION ? '' : props.options.duration + 'ms';
    }
    (0, _mClassList2.default)(elmOverlay).remove(STYLE_CLASS_OVERLAY_HIDE).toggle(STYLE_CLASS_OVERLAY_FORCE, !!force);
    // same condition as props
    parentProps.state = STATE_ACTIVATING;
  }

  // Even when `force`, `props.state` is updated with "async" (if !sync),
  // something might run before `props.state` is updated in
  //    (setTimeout ->) plainOverlay.onHide -> finishClosing -> STATE_CLOSED
  props.state = STATE_CLOSING;
  props.plainOverlay.hide(force, sync);
  traceLog.push('_id:' + props._id, 'state:' + STATE_TEXT[props.state], '</execClosing>'); // [DEBUG/]
}

/**
 * Finish the "open/close" effect immediately with sync-mode.
 * @param {props} props - `props` of instance.
 * @returns {void}
 */
function fixOpenClose(props) {
  traceLog.push('<fixOpenClose>', '_id:' + props._id, 'state:' + STATE_TEXT[props.state]); // [DEBUG/]
  if (props.state === STATE_OPENING) {
    execOpening(props, true);
  } else if (props.state === STATE_CLOSING) {
    execClosing(props, true, true);
  }
  traceLog.push('_id:' + props._id, 'state:' + STATE_TEXT[props.state], '</fixOpenClose>'); // [DEBUG/]
}

/**
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function _open(props, force) {
  traceLog.push('<open>', '_id:' + props._id, 'state:' + STATE_TEXT[props.state]); // [DEBUG/]
  if (props.state !== STATE_CLOSED && props.state !== STATE_CLOSING && props.state !== STATE_OPENING || props.state === STATE_OPENING && !force || props.state !== STATE_OPENING && props.options.onBeforeOpen && props.options.onBeforeOpen.call(props.ins) === false) {
    traceLog.push('cancel', '</open>'); // [DEBUG/]
    return;
  }
  /*
    Cases:
      - STATE_CLOSED or STATE_CLOSING, regardless of `force`
      - STATE_OPENING and `force`
  */

  if (props.state === STATE_CLOSED) {
    traceLog.push('insOpenCloseEffect:' + (insOpenCloseEffect ? insOpenCloseEffect._id : 'NONE')); // [DEBUG/]
    if (insOpenCloseEffect) {
      fixOpenClose(insOpenCloseEffect);
    }
    insOpenCloseEffect = props;

    if (insShown.length) {
      if (insShown.indexOf(props) !== -1) {
        throw new Error('`insShown` is broken.');
      } // [DEBUG/]
      props.parentProps = insShown[insShown.length - 1];
      traceLog.push('parentProps:' + props.parentProps._id); // [DEBUG/]
    }
    insShown.push(props);

    (0, _mClassList2.default)(props.elmOverlay).add(STYLE_CLASS_OVERLAY_FORCE).remove(STYLE_CLASS_OVERLAY_HIDE);
  }

  execOpening(props, force);
  traceLog.push('_id:' + props._id, 'state:' + STATE_TEXT[props.state], '</open>'); // [DEBUG/]
}

/**
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function _close(props, force) {
  traceLog.push('<close>', '_id:' + props._id, 'state:' + STATE_TEXT[props.state]); // [DEBUG/]
  if (props.state === STATE_CLOSED || props.state === STATE_CLOSING && !force || props.state !== STATE_CLOSING && props.options.onBeforeClose && props.options.onBeforeClose.call(props.ins) === false) {
    traceLog.push('cancel', '</close>'); // [DEBUG/]
    return;
  }
  /*
    Cases:
      - Other than STATE_CLOSED and STATE_CLOSING, regardless of `force`
      - STATE_CLOSING and `force`
  */

  traceLog.push('insOpenCloseEffect:' + (insOpenCloseEffect ? insOpenCloseEffect._id : 'NONE')); // [DEBUG/]
  if (insOpenCloseEffect && insOpenCloseEffect !== props) {
    fixOpenClose(insOpenCloseEffect);
    insOpenCloseEffect = null;
  }
  /*
    Cases:
      - STATE_OPENED, STATE_OPENING or STATE_INACTIVATED, regardless of `force`
      - STATE_CLOSING and `force`
  */
  if (props.state === STATE_INACTIVATED) {
    // -> STATE_OPENED
    // [DEBUG]
    var i = insShown.indexOf(props);
    if (i === -1 || i === insShown.length - 1) {
      throw new Error('`insShown` is broken.');
    }
    // [/DEBUG]
    var topProps = void 0;
    while ((topProps = insShown[insShown.length - 1]) !== props) {
      if (topProps.state !== STATE_OPENED) {
        throw new Error('`insShown` is broken.');
      } // [DEBUG/]
      // [DEBUG]
      traceLog.push('topProps._id:' + topProps._id, 'topProps.state:' + STATE_TEXT[topProps.state]);
      // [/DEBUG]
      execClosing(topProps, true, true);
    }
  }
  /*
    Cases:
      - STATE_OPENED or STATE_OPENING, regardless of `force`
      - STATE_CLOSING and `force`
  */

  if (props.state === STATE_OPENED) {
    if (insOpenCloseEffect) {
      throw new Error('`insOpenCloseEffect` is broken.');
    } // [DEBUG/]
    insOpenCloseEffect = props;
  }

  execClosing(props, force);
  traceLog.push('_id:' + props._id, 'state:' + STATE_TEXT[props.state], '</close>'); // [DEBUG/]
}

/**
 * @param {props} props - `props` of instance.
 * @param {Object} newOptions - New options.
 * @returns {void}
 */
function _setOptions(props, newOptions) {
  var options = props.options,
      plainOverlay = props.plainOverlay;

  // closeButton
  if (typeof newOptions.closeButton === 'string' || isElement(newOptions.closeButton) || newOptions.closeButton === false) {
    options.closeButton = newOptions.closeButton; // Update always even if the value was denied.
    if (newOptions.closeButton !== false) {
      var elmCloseButton = typeof newOptions.closeButton === 'string' ? props.elmContent.querySelector(newOptions.closeButton) : newOptions.closeButton;
      if (elmCloseButton && elmCloseButton !== props.elmCloseButton) {
        // Replace
        if (props.elmCloseButton) {
          props.elmCloseButton.removeEventListener('click', props.handleClose, false);
        }
        props.elmCloseButton = elmCloseButton;
        props.elmCloseButton.addEventListener('click', props.handleClose, false);
      }
    } else if (props.elmCloseButton) {
      // Remove
      props.elmCloseButton.removeEventListener('click', props.handleClose, false);
      props.elmCloseButton = void 0;
    }
  }

  // duration
  // Check by PlainOverlay
  plainOverlay.duration = newOptions.duration;
  options.duration = plainOverlay.duration;

  // overlayBlur
  // Check by PlainOverlay
  plainOverlay.blur = newOptions.overlayBlur;
  options.overlayBlur = plainOverlay.blur;

  // [DRAG]
  // dragHandle
  // Check by PlainDraggable
  if (newOptions.dragHandle) {
    if (!props.plainDraggable) {
      props.plainDraggable = new _plainDraggable2.default(props.elmContent);
    }
    var plainDraggable = props.plainDraggable;
    plainDraggable.handle = newOptions.dragHandle;
    if (plainDraggable.handle === newOptions.dragHandle) {
      // It was accepted.
      plainDraggable.disabled = false;
      options.dragHandle = newOptions.dragHandle;
    } else {
      // Updating `handle` failed, i.e. it was not accepted.
      newOptions.dragHandle = null;
    }
  }
  if (!newOptions.dragHandle) {
    if (props.plainDraggable) {
      props.plainDraggable.disabled = true;
    }
    options.dragHandle = void 0;
  }
  // [/DRAG]

  // Event listeners
  ['onOpen', 'onClose', 'onBeforeOpen', 'onBeforeClose'].forEach(function (option) {
    if (typeof newOptions[option] === 'function') {
      options[option] = newOptions[option];
    } else if (newOptions.hasOwnProperty(option) && newOptions[option] == null) {
      options[option] = void 0;
    }
  });
}

var PlainModal = function () {
  /**
   * Create a `PlainModal` instance.
   * @param {Element} content - An element that is shown as the content of the modal window.
   * @param {Object} [options] - Options.
   */
  function PlainModal(content, options) {
    _classCallCheck(this, PlainModal);

    var props = {
      ins: this,
      options: { // Initial options (not default)
        closeButton: false,
        duration: DURATION,
        overlayBlur: false
      },
      state: STATE_CLOSED
    };

    Object.defineProperty(this, '_id', { value: ++insId });
    props._id = this._id;
    insProps[this._id] = props;

    if (!content.nodeType || content.nodeType !== Node.ELEMENT_NODE || content.ownerDocument.defaultView !== window) {
      throw new Error('This `content` is not accepted.');
    }
    props.elmContent = content;
    if (!options) {
      options = {};
    } else if (!isObject(options)) {
      throw new Error('Invalid options.');
    }

    // Setup window
    if (!document.getElementById(STYLE_ELEMENT_ID)) {
      var head = document.getElementsByTagName('head')[0] || document.documentElement,
          sheet = head.insertBefore(document.createElement('style'), head.firstChild);
      sheet.type = 'text/css';
      sheet.id = STYLE_ELEMENT_ID;
      sheet.textContent = _default2.default;
      if (IS_TRIDENT || IS_EDGE) {
        forceReflow(sheet);
      } // Trident bug
    }

    (0, _mClassList2.default)(content).add(STYLE_CLASS_CONTENT);
    // Overlay
    props.plainOverlay = new _plainOverlay2.default({
      face: content,
      onShow: function onShow() {
        finishOpening(props);
      },
      onHide: function onHide() {
        finishClosing(props);
      }
    });
    var elmPlainOverlayBody = content.parentElement; // elmOverlayBody of PlainOverlay
    (0, _mClassList2.default)(elmPlainOverlayBody.parentElement).add(STYLE_CLASS); // elmOverlay of PlainOverlay

    // elmOverlay (own overlay)
    (props.elmOverlay = elmPlainOverlayBody.appendChild(document.createElement('div'))).className = STYLE_CLASS_OVERLAY;

    // Prepare removable event listeners for each instance.
    props.handleClose = function () {
      _close(props);
    };

    // Default options
    if (options.closeButton == null) {
      options.closeButton = CLOSE_BUTTON;
    }

    _setOptions(props, options);
  }

  /**
   * @param {Object} options - New options.
   * @returns {PlainModal} Current instance itself.
   */


  _createClass(PlainModal, [{
    key: 'setOptions',
    value: function setOptions(options) {
      if (isObject(options)) {
        _setOptions(insProps[this._id], options);
      }
      return this;
    }

    /**
     * Open the modal window.
     * @param {Object} [options] - New options.
     * @returns {PlainModal} Current instance itself.
     */

  }, {
    key: 'open',
    value: function open(options) {
      this.setOptions(options);
      _open(insProps[this._id]);
      return this;
    }

    /**
     * Close the modal window.
     * @param {boolean} [force] - Close it immediately without effect.
     * @returns {PlainModal} Current instance itself.
     */

  }, {
    key: 'close',
    value: function close(force) {
      _close(insProps[this._id], force);
      return this;
    }
  }, {
    key: 'state',
    get: function get() {
      return insProps[this._id].state;
    }
  }], [{
    key: 'STATE_CLOSED',
    get: function get() {
      return STATE_CLOSED;
    }
  }, {
    key: 'STATE_OPENING',
    get: function get() {
      return STATE_OPENING;
    }
  }, {
    key: 'STATE_OPENED',
    get: function get() {
      return STATE_OPENED;
    }
  }, {
    key: 'STATE_CLOSING',
    get: function get() {
      return STATE_CLOSING;
    }
  }, {
    key: 'STATE_INACTIVATING',
    get: function get() {
      return STATE_INACTIVATING;
    }
  }, {
    key: 'STATE_INACTIVATED',
    get: function get() {
      return STATE_INACTIVATED;
    }
  }, {
    key: 'STATE_ACTIVATING',
    get: function get() {
      return STATE_ACTIVATING;
    }
  }]);

  return PlainModal;
}();

/* [DRAG/]
PlainModal.limit = true;
[DRAG/] */

// [DEBUG]


PlainModal.traceLog = traceLog;
PlainModal.STATE_TEXT = STATE_TEXT;
// [/DEBUG]

exports.default = PlainModal;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * PlainOverlay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://anseki.github.io/plain-overlay/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2017 anseki
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _cssprefix = __webpack_require__(0);

var _cssprefix2 = _interopRequireDefault(_cssprefix);

var _animEvent = __webpack_require__(2);

var _animEvent2 = _interopRequireDefault(_animEvent);

var _mClassList = __webpack_require__(1);

var _mClassList2 = _interopRequireDefault(_mClassList);

var _default = __webpack_require__(5);

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_mClassList2.default.ignoreNative = true;

var APP_ID = 'plainoverlay',
    STYLE_ELEMENT_ID = APP_ID + '-style',
    STYLE_CLASS = APP_ID,
    STYLE_CLASS_DOC = APP_ID + '-doc',
    STYLE_CLASS_SHOW = APP_ID + '-show',
    STYLE_CLASS_HIDE = APP_ID + '-hide',
    STYLE_CLASS_FORCE = APP_ID + '-force',
    STYLE_CLASS_BODY = APP_ID + '-body',
    FACE_DEFS_ELEMENT_ID = APP_ID + '-builtin-face-defs',
    STATE_HIDDEN = 0,
    STATE_SHOWING = 1,
    STATE_SHOWN = 2,
    STATE_HIDING = 3,

// DURATION = 2500, // COPY: default.scss
DURATION = 200,
    // COPY: default.scss
TOLERANCE = 0.5,
    IS_TRIDENT = !!document.uniqueID,
    IS_EDGE = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style && !window.navigator.msPointerEnabled,
    IS_WEBKIT = !window.chrome && 'WebkitAppearance' in document.documentElement.style,
    // [DEBUG/]
IS_BLINK = !!(window.chrome && window.chrome.webstore),
    // [DEBUG/]
IS_GECKO = 'MozAppearance' in document.documentElement.style,
    // [DEBUG/]

isObject = function () {
  var toString = {}.toString,
      fnToString = {}.hasOwnProperty.toString,
      objFnString = fnToString.call(Object);
  return function (obj) {
    var proto = void 0,
        constr = void 0;
    return obj && toString.call(obj) === '[object Object]' && (!(proto = Object.getPrototypeOf(obj)) || (constr = proto.hasOwnProperty('constructor') && proto.constructor) && typeof constr === 'function' && fnToString.call(constr) === objFnString);
  };
}(),
    isFinite = Number.isFinite || function (value) {
  return typeof value === 'number' && window.isFinite(value);
},


/**
 * An object that has properties of instance.
 * @typedef {Object} props
 * @property {Element} elmTarget - Target element.
 * @property {Element} elmTargetBody - Target body element.
 * @property {Element} elmOverlay - Overlay element.
 * @property {Element} elmOverlayBody - Overlay body element.
 * @property {boolean} isDoc - `true` if target is document.
 * @property {Window} window - Window that conatins target element.
 * @property {HTMLDocument} document - Document that conatins target element.
 * @property {number} state - Current state.
 * @property {Object} options - Options.
 */

/** @type {Object.<_id: number, props>} */
insProps = {};

var insId = 0;

// [DEBUG]
window.insProps = insProps;
window.IS_TRIDENT = IS_TRIDENT;
window.IS_EDGE = IS_EDGE;
window.IS_WEBKIT = IS_WEBKIT;
window.IS_BLINK = IS_BLINK;
window.IS_GECKO = IS_GECKO;
// [/DEBUG]

function forceReflow(target) {
  // Trident and Blink bug (reflow like `offsetWidth` can't update)
  setTimeout(function () {
    var parent = target.parentNode,
        next = target.nextSibling;
    // It has to be removed first for Blink.
    parent.insertBefore(parent.removeChild(target), next);
  }, 0);
}
window.forceReflow = forceReflow; // [DEBUG/]

/**
 * Set style properties while saving current properties.
 * @param {Element} element - Target element.
 * @param {Object} styleProps - New style properties.
 * @param {(Object|null)} savedStyleProps - Current style properties holder.
 * @param {Array} [propNames] - Names of target properties.
 * @returns {Element} Target element itself.
 */
function setStyle(element, styleProps, savedStyleProps, propNames) {
  var style = element.style;
  (propNames || Object.keys(styleProps)).forEach(function (prop) {
    if (styleProps[prop] != null) {
      if (savedStyleProps && savedStyleProps[prop] == null) {
        savedStyleProps[prop] = style[prop];
      }
      style[prop] = styleProps[prop];
      styleProps[prop] = null;
    }
  });
  return element;
}

/**
 * Restore saved style properties.
 * @param {Element} element - Target element.
 * @param {Object} savedStyleProps - Saved style properties.
 * @param {Array} [propNames] - Names of properties that is restored.
 * @returns {Element} Target element itself.
 */
function restoreStyle(element, savedStyleProps, propNames) {
  return setStyle(element, savedStyleProps, null, propNames);
}

/**
 * An object that simulates `DOMRect` to indicate a bounding-box.
 * @typedef {Object} BBox
 * @property {(number|null)} left - document coordinate
 * @property {(number|null)} top - document coordinate
 * @property {(number|null)} right - document coordinate
 * @property {(number|null)} bottom - document coordinate
 * @property {(number|null)} width
 * @property {(number|null)} height
 */

/**
 * Get an element's bounding-box that contains coordinates relative to the element's document or window.
 * @param {Element} element - Target element.
 * @param {Window} [window] - Whether it's relative to the element's window, or document.
 * @returns {(BBox|null)} A bounding-box or null when failed.
 */
function getBBox(element, window) {
  var rect = element.getBoundingClientRect(),
      bBox = { left: rect.left, top: rect.top,
    right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
  if (window) {
    bBox.left += window.pageXOffset;
    bBox.right += window.pageXOffset;
    bBox.top += window.pageYOffset;
    bBox.bottom += window.pageYOffset;
  }
  return bBox;
}
window.getBBox = getBBox; // [DEBUG/]

function scrollLeft(element, isDoc, window, value) {
  if (isDoc) {
    var target = window;
    if (value != null) {
      target.scrollTo(value, target.pageYOffset);
    }
    return target.pageXOffset;
  } else {
    var _target = element;
    if (value != null) {
      _target.scrollLeft = value;
    }
    return _target.scrollLeft;
  }
}
window.scrollLeft = scrollLeft; // [DEBUG/]

function scrollTop(element, isDoc, window, value) {
  if (isDoc) {
    var target = window;
    if (value != null) {
      target.scrollTo(target.pageXOffset, value);
    }
    return target.pageYOffset;
  } else {
    var _target2 = element;
    if (value != null) {
      _target2.scrollTop = value;
    }
    return _target2.scrollTop;
  }
}
window.scrollTop = scrollTop; // [DEBUG/]

function resizeTarget(props, width, height) {
  var elmTargetBody = props.elmTargetBody;

  var rect = elmTargetBody.getBoundingClientRect();
  if (Math.abs(rect.width - width) < TOLERANCE && Math.abs(rect.height - height) < TOLERANCE) {
    return;
  }

  var targetBodyCmpStyle = props.window.getComputedStyle(elmTargetBody, ''),
      boxSizing = targetBodyCmpStyle.boxSizing,
      includeProps = boxSizing === 'border-box' ? [] : boxSizing === 'padding-box' ? ['border'] : ['border', 'padding'],
      // content-box

  PROP_NAMES = {
    border: {
      width: ['borderLeftWidth', 'borderRightWidth'],
      height: ['borderTopWidth', 'borderBottomWidth']
    },
    padding: {
      width: ['paddingLeft', 'paddingRight'],
      height: ['paddingTop', 'paddingBottom']
    }
  },
      values = ['width', 'height'].reduce(function (values, dir) {
    includeProps.forEach(function (part) {
      PROP_NAMES[part][dir].forEach(function (propName) {
        values[dir] -= parseFloat(targetBodyCmpStyle[propName]);
      });
    });
    return values;
  }, { width: width, height: height });

  // Since the `width` and `height` might change each other, fix both.
  setStyle(elmTargetBody, {
    // The value might be negative number when size is too small.
    width: values.width > 0 ? values.width + 'px' : 0,
    height: values.height > 0 ? values.height + 'px' : 0
  }, props.savedStyleTargetBody);

  // In some browsers, getComputedStyle might return computed values that is not px instead of used values.
  var fixStyle = {};
  rect = elmTargetBody.getBoundingClientRect();
  if (Math.abs(rect.width - width) >= TOLERANCE) {
    // [DEBUG]
    console.warn('[resizeTarget] Incorrect width: ' + rect.width + (' (expected: ' + width + ' passed: ' + values.width + ')'));
    // [/DEBUG]
    fixStyle.width = values.width - (rect.width - width) + 'px';
  }
  if (rect.height !== height) {
    // [DEBUG]
    console.warn('[resizeTarget] Incorrect height: ' + rect.height + (' (expected: ' + height + ' passed: ' + values.height + ')'));
    // [/DEBUG]
    fixStyle.height = values.height - (rect.height - height) + 'px';
  }
  setStyle(elmTargetBody, fixStyle, props.savedStyleTargetBody);
}
window.resizeTarget = resizeTarget; // [DEBUG/]

// Trident and Edge bug, width and height are interchanged.
function getDocClientWH(props) {
  var elmTarget = props.elmTarget,
      width = elmTarget.clientWidth,
      height = elmTarget.clientHeight;
  if (IS_TRIDENT || IS_EDGE) {
    var targetBodyCmpStyle = props.window.getComputedStyle(props.elmTargetBody, ''),
        wMode = targetBodyCmpStyle.writingMode || targetBodyCmpStyle['writing-mode'],
        // Trident bug
    direction = targetBodyCmpStyle.direction;
    return wMode === 'tb-rl' || wMode === 'bt-rl' || wMode === 'tb-lr' || wMode === 'bt-lr' || IS_EDGE && (direction === 'ltr' && (wMode === 'vertical-rl' || wMode === 'vertical-lr') || direction === 'rtl' && (wMode === 'vertical-rl' || wMode === 'vertical-lr')) ? { width: height, height: width } : // interchange
    { width: width, height: height };
  } else {
    return { width: width, height: height };
  }
}
window.getDocClientWH = getDocClientWH; // [DEBUG/]

function restoreScroll(props, element) {

  function scrollElement(element, isDoc, left, top) {
    try {
      scrollLeft(element, isDoc, props.window, left);
      scrollTop(element, isDoc, props.window, top);
    } catch (error) {/* Something might have been changed, and that can be ignored. */}
  }

  console.log('restoreScroll START'); // [DEBUG/]
  if (element) {
    return props.savedElementsScroll.some(function (elementScroll) {
      if (elementScroll.element === element) {
        scrollElement(elementScroll.element, elementScroll.isDoc, elementScroll.left, elementScroll.top);
        return true;
      }
      return false;
    }) ? (console.log('restoreScroll DONE'), true) : ( // [DEBUG/]
    console.log('restoreScroll Not in target'), false) // [DEBUG/]
    ;
  } else {
    props.savedElementsScroll.forEach(function (elementScroll) {
      scrollElement(elementScroll.element, elementScroll.isDoc, elementScroll.left, elementScroll.top);
    });
    console.log('restoreScroll DONE (All savedElementsScroll)'); // [DEBUG/]
    return true;
  }
}

function restoreAccKeys(props) {
  props.savedElementsAccKeys.forEach(function (elementAccKeys) {
    try {
      if (elementAccKeys.tabIndex === false) {
        elementAccKeys.element.removeAttribute('tabindex');
      } else if (elementAccKeys.tabIndex != null) {
        elementAccKeys.element.tabIndex = elementAccKeys.tabIndex;
      }
    } catch (error) {/* Something might have been changed, and that can be ignored. */}

    try {
      if (elementAccKeys.accessKey) {
        elementAccKeys.element.accessKey = elementAccKeys.accessKey;
      }
    } catch (error) {/* Something might have been changed, and that can be ignored. */}
  });
}
window.restoreAccKeys = restoreAccKeys; // [DEBUG/]

function avoidFocus(props, element) {
  console.log('avoidFocus START'); // [DEBUG/]
  if (props.isDoc && element !== element.ownerDocument.body && !(props.elmOverlay.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_CONTAINED_BY) || !props.isDoc && (element === props.elmTargetBody || props.elmTargetBody.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
    if (element.blur) {
      // Trident and Edge don't support SVG#blur
      element.blur();
    } else {
      element.ownerDocument.body.focus();
    }
    console.log('avoidFocus DONE'); // [DEBUG/]
    return true;
  }
  console.log('avoidFocus Not in target'); // [DEBUG/]
  return false;
}

// Selection.containsNode polyfill for Trident
function selContainsNode(selection, node, partialContainment) {
  var nodeRange = node.ownerDocument.createRange(),
      iLen = selection.rangeCount;
  nodeRange.selectNodeContents(node);
  for (var i = 0; i < iLen; i++) {
    var selRange = selection.getRangeAt(i);
    // Edge bug (Issue #7321753); getRangeAt returns empty (collapsed) range
    // NOTE: It can not recover when the selection has multiple ranges.
    if (!selRange.toString().length && selection.toString().length && iLen === 1) {
      console.log('Edge bug (Issue #7321753)'); // [DEBUG/]
      selRange.setStart(selection.anchorNode, selection.anchorOffset);
      selRange.setEnd(selection.focusNode, selection.focusOffset);
      // Edge doesn't throw when end is upper than start.
      if (selRange.toString() !== selection.toString()) {
        selRange.setStart(selection.focusNode, selection.focusOffset);
        selRange.setEnd(selection.anchorNode, selection.anchorOffset);
        if (selRange.toString() !== selection.toString()) {
          throw new Error('Edge bug (Issue #7321753); Couldn\'t recover');
        }
      }
    }
    if (partialContainment ? selRange.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0 && selRange.compareBoundaryPoints(Range.END_TO_START, nodeRange) <= 0 : selRange.compareBoundaryPoints(Range.START_TO_START, nodeRange) < 0 && selRange.compareBoundaryPoints(Range.END_TO_END, nodeRange) > 0) {
      return true;
    }
  }
  return false;
}
window.selContainsNode = selContainsNode; // [DEBUG/]

/**
 * Indicates whether the selection is part of the node or not.
 * @param {Node} node - Target node.
 * @param {Selection} selection - The parsed selection.
 * @returns {boolean} `true` if all ranges of `selection` are part of `node`.
 */
function nodeContainsSel(node, selection) {
  var nodeRange = node.ownerDocument.createRange(),
      iLen = selection.rangeCount;
  nodeRange.selectNode(node);
  for (var i = 0; i < iLen; i++) {
    var selRange = selection.getRangeAt(i);
    if (selRange.compareBoundaryPoints(Range.START_TO_START, nodeRange) < 0 || selRange.compareBoundaryPoints(Range.END_TO_END, nodeRange) > 0) {
      return false;
    }
  }
  return true;
}
window.nodeContainsSel = nodeContainsSel; // [DEBUG/]

function avoidSelect(props) {
  console.log('avoidSelect START'); // [DEBUG/]
  var selection = ('getSelection' in window ? props.window : props.document).getSelection();
  if (selection.rangeCount && (props.isDoc ? !nodeContainsSel(props.elmOverlayBody, selection) : selection.containsNode ? selection.containsNode(props.elmTargetBody, true) : selContainsNode(selection, props.elmTargetBody, true))) {
    selection.removeAllRanges();
    props.document.body.focus();
    // Trident bug? It seems that `focus()` makes selection again.
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
    }
    console.log('avoidSelect DONE'); // [DEBUG/]
    return true;
  }
  console.log('avoidSelect NO selection'); // [DEBUG/]
  return false;
}

function barLeft(wMode, direction) {
  var svgSpec = wMode === 'rl-tb' || wMode === 'tb-rl' || wMode === 'bt-rl' || wMode === 'rl-bt';
  return IS_TRIDENT && svgSpec || IS_EDGE && (svgSpec || direction === 'rtl' && (wMode === 'horizontal-tb' || wMode === 'vertical-rl') || direction === 'ltr' && wMode === 'vertical-rl');
}
window.barLeft = barLeft; // [DEBUG/]

function barTop(wMode, direction) {
  var svgSpec = wMode === 'bt-rl' || wMode === 'bt-lr' || wMode === 'lr-bt' || wMode === 'rl-bt';
  return IS_TRIDENT && svgSpec || IS_EDGE && (svgSpec || direction === 'rtl' && (wMode === 'vertical-lr' || wMode === 'vertical-rl'));
}
window.barTop = barTop; // [DEBUG/]

function disableDocBars(props) {
  var elmTarget = props.elmTarget,
      elmTargetBody = props.elmTargetBody,
      targetBodyRect = elmTargetBody.getBoundingClientRect();

  // Get size of each scrollbar.
  var clientWH = getDocClientWH(props),
      barV = -clientWH.width,
      barH = -clientWH.height; // elmTarget.clientWidth/clientHeight
  setStyle(elmTarget, { overflow: 'hidden' }, props.savedStyleTarget);
  clientWH = getDocClientWH(props);
  barV += clientWH.width;
  barH += clientWH.height;

  if (barV || barH) {
    var targetBodyCmpStyle = props.window.getComputedStyle(elmTargetBody, '');
    var propV = void 0,
        propH = void 0;
    // There is no way to get absolute position of document.
    // We need distance between the document and its window, or a method like `element.screenX`
    // that gets absolute position of an element.
    // For the moment, Trident and Edge make a scrollbar at the left/top side when RTL document
    // or CJK vertical document is rendered.
    if (IS_TRIDENT || IS_EDGE) {
      var wMode = targetBodyCmpStyle.writingMode || targetBodyCmpStyle['writing-mode'],
          // Trident bug
      direction = targetBodyCmpStyle.direction;
      if (barV) {
        propV = barLeft(wMode, direction) ? 'marginLeft' : 'marginRight';
      }
      if (barH) {
        propH = barTop(wMode, direction) ? 'marginTop' : 'marginBottom';
      }
    } else {
      if (barV) {
        propV = 'marginRight';
      }
      if (barH) {
        propH = 'marginBottom';
      }
    }

    var addStyle = {};
    if (barV) {
      addStyle[propV] = parseFloat(targetBodyCmpStyle[propV]) + barV + 'px';
    }
    if (barH) {
      addStyle[propH] = parseFloat(targetBodyCmpStyle[propH]) + barH + 'px';
    }
    setStyle(elmTargetBody, addStyle, props.savedStyleTargetBody);
    resizeTarget(props, targetBodyRect.width, targetBodyRect.height);

    // `overflow: 'hidden'` might change scroll.
    restoreScroll(props, elmTarget);
    return true;
  } else {
    restoreStyle(elmTarget, props.savedStyleTarget, ['overflow']);
    return false;
  }
}
window.disableDocBars = disableDocBars; // [DEBUG/]

function _position(props, targetBodyBBox) {
  var elmTargetBody = props.elmTargetBody,
      targetBodyCmpStyle = props.window.getComputedStyle(elmTargetBody, ''),
      elmOverlay = props.elmOverlay,
      overlayCmpStyle = props.window.getComputedStyle(elmOverlay, ''),
      overlayBBox = getBBox(elmOverlay, props.window),
      borders = ['Top', 'Right', 'Bottom', 'Left'].reduce(function (borders, prop) {
    borders[prop.toLowerCase()] = parseFloat(targetBodyCmpStyle['border' + prop + 'Width']);
    return borders;
  }, {}),


  // Get distance between document and origin of `elmOverlay`.
  offset = { left: overlayBBox.left - parseFloat(overlayCmpStyle.left),
    top: overlayBBox.top - parseFloat(overlayCmpStyle.top) },
      style = {
    left: targetBodyBBox.left - offset.left + borders.left + 'px',
    top: targetBodyBBox.top - offset.top + borders.top + 'px',
    width: targetBodyBBox.width - borders.left - borders.right + 'px',
    height: targetBodyBBox.height - borders.top - borders.bottom + 'px'
  },
      reValue = /^([\d\.]+)(px|%)$/;

  // border-radius
  [{ prop: 'TopLeft', hBorder: 'left', vBorder: 'top' }, { prop: 'TopRight', hBorder: 'right', vBorder: 'top' }, { prop: 'BottomRight', hBorder: 'right', vBorder: 'bottom' }, { prop: 'BottomLeft', hBorder: 'left', vBorder: 'bottom' }].forEach(function (corner) {
    var prop = _cssprefix2.default.getName('border' + corner.prop + 'Radius'),
        values = targetBodyCmpStyle[prop].split(' ');
    var h = values[0],
        v = values[1] || values[0],
        matches = reValue.exec(h);
    h = !matches ? 0 : matches[2] === 'px' ? +matches[1] : matches[1] * targetBodyBBox.width / 100;
    matches = reValue.exec(v);
    v = !matches ? 0 : matches[2] === 'px' ? +matches[1] : matches[1] * targetBodyBBox.height / 100;

    h -= borders[corner.hBorder];
    v -= borders[corner.vBorder];
    if (h > 0 && v > 0) {
      style[prop] = h + 'px ' + v + 'px';
    }
  });

  setStyle(elmOverlay, style);
  props.targetBodyBBox = targetBodyBBox;
}
window.position = _position; // [DEBUG/]

function getTargetElements(props) {
  var elmTargetBody = props.elmTargetBody,
      elmOverlay = props.elmOverlay,
      targetElements = [props.elmTarget];
  if (props.isDoc) {
    targetElements.push(elmTargetBody);
    Array.prototype.slice.call(elmTargetBody.childNodes).forEach(function (childNode) {
      if (childNode.nodeType === Node.ELEMENT_NODE && childNode !== elmOverlay && !(0, _mClassList2.default)(childNode).contains(STYLE_CLASS) && childNode.id !== FACE_DEFS_ELEMENT_ID) {
        targetElements.push(childNode);
        Array.prototype.push.apply(targetElements, childNode.querySelectorAll('*'));
      }
    });
  } else {
    Array.prototype.push.apply(targetElements, elmTargetBody.querySelectorAll('*'));
  }
  return targetElements;
}

function finishShowing(props) {
  // blur
  props.filterElements = null;
  if (props.options.blur !== false) {
    var propName = _cssprefix2.default.getName('filter'),
        propValue = _cssprefix2.default.getValue('filter', 'blur(' + props.options.blur + 'px)');
    if (propValue) {
      // undefined if no propName
      // Array of {element: element, savedStyle: {}}
      var filterElements = props.isDoc ? Array.prototype.slice.call(props.elmTargetBody.childNodes).filter(function (childNode) {
        return childNode.nodeType === Node.ELEMENT_NODE && childNode !== props.elmOverlay && !(0, _mClassList2.default)(childNode).contains(STYLE_CLASS) && childNode.id !== FACE_DEFS_ELEMENT_ID;
      }).map(function (element) {
        return { element: element, savedStyle: {} };
      }) : [{ element: props.elmTargetBody, savedStyle: {} }];

      filterElements.forEach(function (filterElement) {
        var style = {}; // new object for each element.
        style[propName] = propValue;
        setStyle(filterElement.element, style, filterElement.savedStyle);
      });
      props.filterElements = filterElements;
    }
  }

  props.state = STATE_SHOWN;
  if (props.options.onShow) {
    props.options.onShow.call(props.ins);
  }
}

function finishHiding(props, sync) {
  (0, _mClassList2.default)(props.elmOverlay).add(STYLE_CLASS_HIDE);

  restoreStyle(props.elmTarget, props.savedStyleTarget);
  restoreStyle(props.elmTargetBody, props.savedStyleTargetBody);
  props.savedStyleTarget = {};
  props.savedStyleTargetBody = {};

  restoreAccKeys(props);
  props.savedElementsAccKeys = null;

  // props.state must be STATE_HIDDEN for below
  props.state = STATE_HIDDEN;

  if (!sync && props.isDoc && props.activeElement) {
    props.activeElement.focus();
  }
  props.activeElement = null;

  // Since `focus()` might scroll, do this after `focus()` and reflow.
  function restoreAndFinish() {
    restoreScroll(props);
    props.savedElementsScroll = null;

    if (props.options.onHide) {
      props.options.onHide.call(props.ins);
    }
  }

  if (sync) {
    restoreAndFinish();
  } else {
    setTimeout(restoreAndFinish, 0);
  }
}

/**
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function _show(props, force) {

  function getScroll(elements, fromDoc) {

    function elementCanScroll(element, isDoc) {
      var cmpStyle = props.window.getComputedStyle(element, ''),
          tagName = element.nodeName.toLowerCase();
      return cmpStyle.overflow === 'scroll' || cmpStyle.overflow === 'auto' || cmpStyle.overflowX === 'scroll' || cmpStyle.overflowX === 'auto' || cmpStyle.overflowY === 'scroll' || cmpStyle.overflowY === 'auto' ||
      // document with `visible` might make scrollbars.
      isDoc && (cmpStyle.overflow === 'visible' || cmpStyle.overflowX === 'visible' || cmpStyle.overflowY === 'visible') ||
      // `overflow` of these differs depending on browser.
      !isDoc && (tagName === 'textarea' || tagName === 'select');
    }

    var elementsScroll = [];
    elements.forEach(function (element, i) {
      var isDoc = fromDoc && i === 0;
      if (elementCanScroll(element, isDoc)) {
        elementsScroll.push({
          element: element,
          isDoc: isDoc,
          left: scrollLeft(element, isDoc, props.window),
          top: scrollTop(element, isDoc, props.window)
        });
      }
    });
    return elementsScroll;
  }

  function disableAccKeys(elements, fromDoc) {
    var savedElementsAccKeys = [];
    elements.forEach(function (element, i) {
      if (fromDoc && i === 0) {
        return;
      }

      var elementAccKeys = {},
          tabIndex = element.tabIndex;
      // In Trident and Edge, `tabIndex` of all elements are `0` or something even if the element is not focusable.
      if (tabIndex !== -1) {
        elementAccKeys.element = element;
        elementAccKeys.tabIndex = element.hasAttribute('tabindex') ? tabIndex : false;
        element.tabIndex = -1;
      }

      var accessKey = element.accessKey;
      if (accessKey) {
        elementAccKeys.element = element;
        elementAccKeys.accessKey = accessKey;
        element.accessKey = '';
      }

      if (elementAccKeys.element) {
        savedElementsAccKeys.push(elementAccKeys);
      }
    });
    return savedElementsAccKeys;
  }

  if (props.state === STATE_SHOWN || props.state === STATE_SHOWING && !force || props.state !== STATE_SHOWING && props.options.onBeforeShow && props.options.onBeforeShow.call(props.ins) === false) {
    return;
  }

  var elmOverlay = props.elmOverlay,
      elmOverlayClassList = (0, _mClassList2.default)(elmOverlay);
  if (props.state === STATE_HIDDEN) {
    var targetElements = getTargetElements(props);
    window.targetElements = targetElements; // [DEBUG/]

    elmOverlayClassList.remove(STYLE_CLASS_HIDE); // Before `getBoundingClientRect` (`position`).
    if (!props.isDoc) {
      var elmTargetBody = props.elmTargetBody;
      if (props.window.getComputedStyle(elmTargetBody, '').display === 'inline') {
        setStyle(elmTargetBody, { display: 'inline-block' }, props.savedStyleTargetBody);
      }
      _position(props, getBBox(elmTargetBody, props.window));
    }

    props.savedElementsScroll = getScroll(targetElements, props.isDoc);
    props.disabledDocBars = false;
    // savedElementsScroll is empty when document is disconnected.
    if (props.isDoc && props.savedElementsScroll.length && props.savedElementsScroll[0].isDoc) {
      props.disabledDocBars = disableDocBars(props);
    }
    props.savedElementsAccKeys = disableAccKeys(targetElements, props.isDoc);
    props.activeElement = props.document.activeElement;
    if (props.activeElement) {
      avoidFocus(props, props.activeElement);
    }
    avoidSelect(props);
    elmOverlay.offsetWidth; /* force reflow */ // eslint-disable-line no-unused-expressions

    if (props.options.onPosition) {
      props.options.onPosition.call(props.ins);
    }
  }

  elmOverlayClassList.add(STYLE_CLASS_SHOW).toggle(STYLE_CLASS_FORCE, !!force);
  if (force) {
    finishShowing(props);
  } else {
    props.state = STATE_SHOWING;
  }
}

/**
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function _hide(props, force, sync) {
  if (props.state === STATE_HIDDEN || props.state === STATE_HIDING && !force || props.state !== STATE_HIDING && props.options.onBeforeHide && props.options.onBeforeHide.call(props.ins) === false) {
    return;
  }

  // blur
  if (props.filterElements) {
    props.filterElements.forEach(function (filterElement) {
      restoreStyle(filterElement.element, filterElement.savedStyle);
    });
    props.filterElements = null;
  }

  (0, _mClassList2.default)(props.elmOverlay).remove(STYLE_CLASS_SHOW).toggle(STYLE_CLASS_FORCE, !!force);
  if (force) {
    finishHiding(props, sync);
  } else {
    props.state = STATE_HIDING;
  }
}

/**
 * @param {props} props - `props` of instance.
 * @param {Object} newOptions - New options.
 * @returns {void}
 */
function _setOptions(props, newOptions) {
  var options = props.options;

  // face
  if (newOptions.hasOwnProperty('face') && (newOptions.face == null ? void 0 : newOptions.face) !== options.face) {
    var elmOverlayBody = props.elmOverlayBody;
    // Clear
    while (elmOverlayBody.firstChild) {
      elmOverlayBody.removeChild(elmOverlayBody.firstChild);
    }
    if (newOptions.face === false) {
      // No face
      options.face = false;
    } else if (newOptions.face && newOptions.face.nodeType === Node.ELEMENT_NODE) {
      // Specific face
      options.face = newOptions.face;
      elmOverlayBody.appendChild(newOptions.face);
    } else if (newOptions.face == null) {
      // Builtin face
      options.face = void 0;
    }
  }

  // duration
  if (isFinite(newOptions.duration) && newOptions.duration !== options.duration) {
    options.duration = newOptions.duration;
    props.elmOverlay.style[_cssprefix2.default.getName('transitionDuration')] = newOptions.duration === DURATION ? '' : newOptions.duration + 'ms';
  }

  // blur
  if (isFinite(newOptions.blur) || newOptions.blur === false) {
    options.blur = newOptions.blur;
  }

  // style
  if (isObject(newOptions.style)) {
    setStyle(props.elmOverlay, newOptions.style);
  }

  // Event listeners
  ['onShow', 'onHide', 'onBeforeShow', 'onBeforeHide', 'onPosition'].forEach(function (option) {
    if (typeof newOptions[option] === 'function') {
      options[option] = newOptions[option];
    } else if (newOptions.hasOwnProperty(option) && newOptions[option] == null) {
      options[option] = void 0;
    }
  });
}

function scroll(props, target, dirLeft, value) {
  var isDoc = void 0,
      curValue = void 0;

  if (target) {
    var targetElements = getTargetElements(props);
    if (targetElements.indexOf(target) === -1) {
      return curValue;
    } // return undefined
    isDoc = target.nodeName.toLowerCase() === 'html';
  } else {
    target = props.elmTarget;
    isDoc = props.isDoc;
  }

  var elementScroll = value != null && props.savedElementsScroll && (props.savedElementsScroll.find ? props.savedElementsScroll.find(function (elementScroll) {
    return elementScroll.element === target;
  }) : function (elementsScroll) {
    var found = void 0;
    elementsScroll.some(function (elementScroll) {
      if (elementScroll.element === target) {
        found = elementScroll;
        return true;
      }
      return false;
    });
    return found;
  }(props.savedElementsScroll));

  curValue = (dirLeft ? scrollLeft : scrollTop)(target, isDoc, props.window, value);
  if (elementScroll) {
    elementScroll[dirLeft ? 'left' : 'top'] = curValue;
  }
  return curValue;
}

var PlainOverlay = function () {
  /**
   * Create a `PlainOverlay` instance.
   * @param {Element} [target] - Target element.
   * @param {Object} [options] - Options.
   */
  function PlainOverlay(target, options) {
    _classCallCheck(this, PlainOverlay);

    /**
     * @param {Object} [target] - Element or something that is checked.
     * @returns {(Element|null)} Valid element or null.
     */
    function getTarget(target) {
      var validElement = void 0;
      if (!target) {
        validElement = document.documentElement; // documentElement of current document
      } else if (target.nodeType) {
        if (target.nodeType === Node.DOCUMENT_NODE) {
          validElement = target.documentElement; // documentElement of target document
        } else if (target.nodeType === Node.ELEMENT_NODE) {
          var nodeName = target.nodeName.toLowerCase();
          validElement = nodeName === 'body' ? target.ownerDocument.documentElement : // documentElement of target body
          nodeName === 'iframe' || nodeName === 'frame' ? target.contentDocument.documentElement : // documentElement of target frame
          target;
        }
        if (!validElement) {
          throw new Error('This element is not accepted.');
        }
      } else if (target === target.window) {
        validElement = target.document.documentElement; // documentElement of target window
      }
      return validElement;
    }

    var props = {
      ins: this,
      options: { // Initial options (not default)
        face: false, // Initial state.
        duration: DURATION, // Initial state.
        blur: false // Initial state.
      },
      state: STATE_HIDDEN,
      savedStyleTarget: {},
      savedStyleTargetBody: {}
    };

    Object.defineProperty(this, '_id', { value: ++insId });
    props._id = this._id;
    insProps[this._id] = props;

    if (arguments.length === 1) {
      if (!(props.elmTarget = getTarget(target))) {
        if (!isObject(target)) {
          throw new Error('Invalid argument.');
        }
        props.elmTarget = document.documentElement; // documentElement of current document
        options = target;
      }
    } else if (!(props.elmTarget = getTarget(target))) {
      throw new Error('This target is not accepted.');
    }
    if (!options) {
      options = {};
    } else if (!isObject(options)) {
      throw new Error('Invalid options.');
    }

    props.isDoc = props.elmTarget.nodeName.toLowerCase() === 'html';
    var elmDocument = props.document = props.elmTarget.ownerDocument;
    props.window = elmDocument.defaultView;
    var elmTargetBody = props.elmTargetBody = props.isDoc ? elmDocument.body : props.elmTarget;

    // Setup window
    if (!elmDocument.getElementById(STYLE_ELEMENT_ID)) {
      var head = elmDocument.getElementsByTagName('head')[0] || elmDocument.documentElement,
          sheet = head.insertBefore(elmDocument.createElement('style'), head.firstChild);
      sheet.type = 'text/css';
      sheet.id = STYLE_ELEMENT_ID;
      sheet.textContent = _default2.default;
      if (IS_TRIDENT || IS_EDGE) {
        forceReflow(sheet);
      } // Trident bug
    }

    // elmOverlay
    var elmOverlay = props.elmOverlay = elmDocument.createElement('div'),
        elmOverlayClassList = (0, _mClassList2.default)(elmOverlay);
    elmOverlayClassList.add(STYLE_CLASS, STYLE_CLASS_HIDE);
    if (props.isDoc) {
      elmOverlayClassList.add(STYLE_CLASS_DOC);
    }

    (function (listener) {
      ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'otransitionend'].forEach(function (type) {
        elmOverlay.addEventListener(type, listener, true);
      });
    })(function (event) {
      if (event.target === elmOverlay && event.propertyName === 'opacity') {
        if (props.state === STATE_SHOWING) {
          finishShowing(props);
        } else if (props.state === STATE_HIDING) {
          finishHiding(props);
        }
      }
    });

    (props.isDoc ? props.window : elmTargetBody).addEventListener('scroll', function (event) {
      var target = event.target;
      if (props.state !== STATE_HIDDEN && restoreScroll(props, props.isDoc && (target === props.window || target === props.document || target === props.elmTargetBody) ? props.elmTarget : target)) {
        console.log('avoidScroll'); // [DEBUG/]
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    elmTargetBody.addEventListener('focus', function (event) {
      if (props.state !== STATE_HIDDEN && avoidFocus(props, event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    (function (listener) {
      // simulation "text-select" event
      ['keyup', 'mouseup'].forEach(function (type) {
        // To listen to keydown in the target and keyup in outside, it is window, not `elmTargetBody`.
        props.window.addEventListener(type, listener, true);
      });
    })(function (event) {
      if (props.state !== STATE_HIDDEN && avoidSelect(props)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });

    // Gecko bug, multiple calling (parallel) by `requestAnimationFrame`.
    props.resizing = false;
    props.window.addEventListener('resize', _animEvent2.default.add(function () {
      if (props.resizing) {
        console.log('`resize` event listener is already running.'); // [DEBUG/]
        return;
      }
      props.resizing = true;
      if (props.state !== STATE_HIDDEN) {
        if (props.isDoc) {
          if (props.savedElementsScroll.length && props.savedElementsScroll[0].isDoc) {
            if (props.disabledDocBars) {
              // Restore DocBars
              console.log('Restore DocBars'); // [DEBUG/]
              restoreStyle(props.elmTarget, props.savedStyleTarget, ['overflow']);
              restoreStyle(elmTargetBody, props.savedStyleTargetBody, ['marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'width', 'height']);
            }
            console.log('disableDocBars'); // [DEBUG/]
            props.disabledDocBars = disableDocBars(props);
          }
        } else {
          var bBox = getBBox(elmTargetBody, props.window),
              lastBBox = props.targetBodyBBox;
          if (bBox.left !== lastBBox.left || bBox.top !== lastBBox.top || bBox.width !== lastBBox.width || bBox.height !== lastBBox.height) {
            console.log('Update position'); // [DEBUG/]
            _position(props, bBox);
          }
        }
        if (props.options.onPosition) {
          props.options.onPosition.call(props.ins);
        }
      }
      props.resizing = false;
    }), true);

    // Avoid scroll on touch device
    elmOverlay.addEventListener('touchmove', function (event) {
      if (props.state !== STATE_HIDDEN) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    // elmOverlayBody
    (props.elmOverlayBody = elmOverlay.appendChild(elmDocument.createElement('div'))).className = STYLE_CLASS_BODY;

    elmDocument.body.appendChild(elmOverlay);

    // Default options
    if (!options.hasOwnProperty('face')) {
      options.face = null;
    }

    _setOptions(props, options);
  }

  /**
   * @param {Object} options - New options.
   * @returns {PlainOverlay} Current instance itself.
   */


  _createClass(PlainOverlay, [{
    key: 'setOptions',
    value: function setOptions(options) {
      if (isObject(options)) {
        _setOptions(insProps[this._id], options);
      }
      return this;
    }

    /**
     * Show the overlay.
     * @param {boolean} [force] - Show it immediately without effect.
     * @param {Object} [options] - New options.
     * @returns {PlainOverlay} Current instance itself.
     */

  }, {
    key: 'show',
    value: function show(force, options) {
      if (arguments.length < 2 && typeof force !== 'boolean') {
        options = force;
        force = false;
      }

      this.setOptions(options);
      _show(insProps[this._id], force);
      return this;
    }

    /**
     * Hide the overlay.
     * @param {boolean} [force] - Hide it immediately without effect.
     * @returns {PlainOverlay} Current instance itself.
     */

  }, {
    key: 'hide',
    value: function hide(force, sync) {
      _hide(insProps[this._id], force, sync);
      return this;
    }
  }, {
    key: 'scrollLeft',
    value: function scrollLeft(value, target) {
      return scroll(insProps[this._id], target, true, value);
    }
  }, {
    key: 'scrollTop',
    value: function scrollTop(value, target) {
      return scroll(insProps[this._id], target, false, value);
    }
  }, {
    key: 'position',
    value: function position() {
      var props = insProps[this._id];
      if (props.state !== STATE_HIDDEN) {
        if (!props.isDoc) {
          _position(props, getBBox(props.elmTargetBody, props.window));
        }
        if (props.options.onPosition) {
          props.options.onPosition.call(props.ins);
        }
      }
      return this;
    }
  }, {
    key: 'state',
    get: function get() {
      return insProps[this._id].state;
    }
  }, {
    key: 'style',
    get: function get() {
      return insProps[this._id].elmOverlay.style;
    }
  }, {
    key: 'face',
    get: function get() {
      return insProps[this._id].options.face;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { face: value });
    }
  }, {
    key: 'duration',
    get: function get() {
      return insProps[this._id].options.duration;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { duration: value });
    }
  }, {
    key: 'blur',
    get: function get() {
      return insProps[this._id].options.blur;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { blur: value });
    }
  }, {
    key: 'onShow',
    get: function get() {
      return insProps[this._id].options.onShow;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onShow: value });
    }
  }, {
    key: 'onHide',
    get: function get() {
      return insProps[this._id].options.onHide;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onHide: value });
    }
  }, {
    key: 'onBeforeShow',
    get: function get() {
      return insProps[this._id].options.onBeforeShow;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onBeforeShow: value });
    }
  }, {
    key: 'onBeforeHide',
    get: function get() {
      return insProps[this._id].options.onBeforeHide;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onBeforeHide: value });
    }
  }, {
    key: 'onPosition',
    get: function get() {
      return insProps[this._id].options.onPosition;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onPosition: value });
    }
  }], [{
    key: 'show',
    value: function show(target, options) {
      return new PlainOverlay(target, options).show();
    }
  }, {
    key: 'STATE_HIDDEN',
    get: function get() {
      return STATE_HIDDEN;
    }
  }, {
    key: 'STATE_SHOWING',
    get: function get() {
      return STATE_SHOWING;
    }
  }, {
    key: 'STATE_SHOWN',
    get: function get() {
      return STATE_SHOWN;
    }
  }, {
    key: 'STATE_HIDING',
    get: function get() {
      return STATE_HIDING;
    }
  }]);

  return PlainOverlay;
}();

PlainOverlay.limit = true;

exports.default = PlainOverlay;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = ".plainoverlay{-webkit-tap-highlight-color:transparent;transform:translateZ(0);box-shadow:0 0 1px transparent}.plainoverlay{position:absolute;left:0;top:0;overflow:hidden;background-color:rgba(136,136,136,0.6);cursor:wait;z-index:9000;-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;transition-property:opacity;-webkit-transition-duration:200ms;-moz-transition-duration:200ms;-o-transition-duration:200ms;transition-duration:200ms;-webkit-transition-timing-function:linear;-moz-transition-timing-function:linear;-o-transition-timing-function:linear;transition-timing-function:linear;opacity:0}.plainoverlay.plainoverlay-show{opacity:1}.plainoverlay.plainoverlay-force{-webkit-transition-property:none;-moz-transition-property:none;-o-transition-property:none;transition-property:none}.plainoverlay.plainoverlay-hide{display:none}.plainoverlay.plainoverlay-doc{position:fixed;left:-200px;top:-200px;overflow:visible;padding:200px;width:100vw;height:100vh}.plainoverlay-body{width:100%;height:100%;display:-webkit-flex;display:flex;-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center}.plainoverlay.plainoverlay-doc .plainoverlay-body{width:100vw;height:100vh}";

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = ".plainmodal .plainmodal-overlay{-webkit-tap-highlight-color:transparent;transform:translateZ(0);box-shadow:0 0 1px transparent}.plainmodal.plainoverlay{background-color:transparent;cursor:auto}.plainmodal .plainmodal-content{z-index:9000}.plainmodal .plainmodal-overlay{width:100%;height:100%;position:absolute;left:0;top:0;background-color:rgba(136,136,136,0.6);-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;transition-property:opacity;-webkit-transition-duration:200ms;-moz-transition-duration:200ms;-o-transition-duration:200ms;transition-duration:200ms;-webkit-transition-timing-function:linear;-moz-transition-timing-function:linear;-o-transition-timing-function:linear;transition-timing-function:linear;opacity:1}.plainmodal .plainmodal-overlay.plainmodal-overlay-hide{opacity:0}.plainmodal .plainmodal-overlay.plainmodal-overlay-force{-webkit-transition-property:none;-moz-transition-property:none;-o-transition-property:none;transition-property:none}";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                               * PlainDraggable
                                                                                                                                                                                                                                                                               * https://anseki.github.io/plain-draggable/
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Copyright (c) 2017 anseki
                                                                                                                                                                                                                                                                               * Licensed under the MIT license.
                                                                                                                                                                                                                                                                               */

var _cssprefix = __webpack_require__(0);

var _cssprefix2 = _interopRequireDefault(_cssprefix);

var _animEvent = __webpack_require__(2);

var _animEvent2 = _interopRequireDefault(_animEvent);

var _mClassList = __webpack_require__(1);

var _mClassList2 = _interopRequireDefault(_mClassList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_mClassList2.default.ignoreNative = true;

var ZINDEX = 9000,
    IS_WEBKIT = !window.chrome && 'WebkitAppearance' in document.documentElement.style,
    isObject = function () {
  var toString = {}.toString,
      fnToString = {}.hasOwnProperty.toString,
      objFnString = fnToString.call(Object);
  return function (obj) {
    var proto = void 0,
        constr = void 0;
    return obj && toString.call(obj) === '[object Object]' && (!(proto = Object.getPrototypeOf(obj)) || (constr = proto.hasOwnProperty('constructor') && proto.constructor) && typeof constr === 'function' && fnToString.call(constr) === objFnString);
  };
}(),
    isFinite = Number.isFinite || function (value) {
  return typeof value === 'number' && window.isFinite(value);
},


/** @type {Object.<_id: number, props>} */
insProps = {};

var insId = 0,
    activeItem = void 0,
    hasMoved = void 0,
    pointerOffset = void 0,
    body = void 0,

// CSS property/value
cssValueDraggableCursor = void 0,
    cssValueDraggingCursor = void 0,
    cssOrgValueBodyCursor = void 0,
    cssPropTransform = void 0,
    cssPropUserSelect = void 0,
    cssOrgValueBodyUserSelect = void 0,

// Try to set `cursor` property.
cssWantedValueDraggableCursor = IS_WEBKIT ? ['all-scroll', 'move'] : ['grab', 'all-scroll', 'move'],
    cssWantedValueDraggingCursor = IS_WEBKIT ? 'move' : ['grabbing', 'move'],

// class
draggableClass = 'plain-draggable',
    draggingClass = 'plain-draggable-dragging',
    movingClass = 'plain-draggable-moving';

// [DEBUG]
window.insProps = insProps;
window.IS_WEBKIT = IS_WEBKIT;
// [/DEBUG]

function copyTree(obj) {
  return !obj ? obj : isObject(obj) ? Object.keys(obj).reduce(function (copyObj, key) {
    copyObj[key] = copyTree(obj[key]);
    return copyObj;
  }, {}) : Array.isArray(obj) ? obj.map(copyTree) : obj;
}

function hasChanged(a, b) {
  var typeA = void 0,
      keysA = void 0;
  return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== (typeof b === 'undefined' ? 'undefined' : _typeof(b)) || (typeA = isObject(a) ? 'obj' : Array.isArray(a) ? 'array' : '') !== (isObject(b) ? 'obj' : Array.isArray(b) ? 'array' : '') || (typeA === 'obj' ? hasChanged(keysA = Object.keys(a).sort(), Object.keys(b).sort()) || keysA.some(function (prop) {
    return hasChanged(a[prop], b[prop]);
  }) : typeA === 'array' ? a.length !== b.length || a.some(function (aVal, i) {
    return hasChanged(aVal, b[i]);
  }) : a !== b);
}

/**
 * @param {Element} element - A target element.
 * @returns {boolean} - `true` if connected element.
 */
function isElement(element) {
  return !!(element && element.nodeType === Node.ELEMENT_NODE &&
  // element instanceof HTMLElement &&
  typeof element.getBoundingClientRect === 'function' && !(element.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED));
}
window.isElement = isElement; // [DEBUG/]

/**
 * An object that simulates `DOMRect` to indicate a bounding-box.
 * @typedef {Object} BBox
 * @property {(number|null)} left - document coordinate
 * @property {(number|null)} top - document coordinate
 * @property {(number|null)} right - document coordinate
 * @property {(number|null)} bottom - document coordinate
 * @property {(number|null)} x - Substitutes for left
 * @property {(number|null)} y - Substitutes for top
 * @property {(number|null)} width
 * @property {(number|null)} height
 */

/**
 * @param {Object} bBox - A target object.
 * @returns {(BBox|null)} - A normalized `BBox`, or null if `bBox` is invalid.
 */
function validBBox(bBox) {
  if (!isObject(bBox)) {
    return null;
  }
  var value = void 0;
  if (isFinite(value = bBox.left) || isFinite(value = bBox.x)) {
    bBox.left = bBox.x = value;
  } else {
    return null;
  }
  if (isFinite(value = bBox.top) || isFinite(value = bBox.y)) {
    bBox.top = bBox.y = value;
  } else {
    return null;
  }

  if (isFinite(bBox.width) && bBox.width >= 0) {
    bBox.right = bBox.left + bBox.width;
  } else if (isFinite(bBox.right) && bBox.right >= bBox.left) {
    bBox.width = bBox.right - bBox.left;
  } else {
    return null;
  }
  if (isFinite(bBox.height) && bBox.height >= 0) {
    bBox.bottom = bBox.top + bBox.height;
  } else if (isFinite(bBox.bottom) && bBox.bottom >= bBox.top) {
    bBox.height = bBox.bottom - bBox.top;
  } else {
    return null;
  }
  return bBox;
}
window.validBBox = validBBox; // [DEBUG/]

/**
 * A value that is Pixels or Ratio
 * @typedef {{value: number, isRatio: boolean}} PPValue
 */

function validPPValue(value) {

  // Get PPValue from string (all `/s` were already removed)
  function string2PPValue(inString) {
    var matches = /^(.+?)(\%)?$/.exec(inString);
    var value = void 0,
        isRatio = void 0;
    return matches && isFinite(value = parseFloat(matches[1])) ? { value: (isRatio = !!(matches[2] && value)) ? value / 100 : value, isRatio: isRatio } : null; // 0% -> 0
  }

  return isFinite(value) ? { value: value, isRatio: false } : typeof value === 'string' ? string2PPValue(value.replace(/\s/g, '')) : null;
}
window.validPPValue = validPPValue; // [DEBUG/]

function ppValue2OptionValue(ppValue) {
  return ppValue.isRatio ? ppValue.value * 100 + '%' : ppValue.value;
}
window.ppValue2OptionValue = ppValue2OptionValue; // [DEBUG/]

function resolvePPValue(ppValue, baseOrigin, baseSize) {
  return typeof ppValue === 'number' ? ppValue : baseOrigin + ppValue.value * (ppValue.isRatio ? baseSize : 1);
}

/**
 * An object that simulates BBox but properties are PPValue.
 * @typedef {Object} PPBBox
 */

/**
 * @param {Object} bBox - A target object.
 * @returns {(PPBBox|null)} - A normalized `PPBBox`, or null if `bBox` is invalid.
 */
function validPPBBox(bBox) {
  if (!isObject(bBox)) {
    return null;
  }
  var ppValue = void 0;
  if ((ppValue = validPPValue(bBox.left)) || (ppValue = validPPValue(bBox.x))) {
    bBox.left = bBox.x = ppValue;
  } else {
    return null;
  }
  if ((ppValue = validPPValue(bBox.top)) || (ppValue = validPPValue(bBox.y))) {
    bBox.top = bBox.y = ppValue;
  } else {
    return null;
  }

  if ((ppValue = validPPValue(bBox.width)) && ppValue.value >= 0) {
    bBox.width = ppValue;
    delete bBox.right;
  } else if (ppValue = validPPValue(bBox.right)) {
    bBox.right = ppValue;
    delete bBox.width;
  } else {
    return null;
  }
  if ((ppValue = validPPValue(bBox.height)) && ppValue.value >= 0) {
    bBox.height = ppValue;
    delete bBox.bottom;
  } else if (ppValue = validPPValue(bBox.bottom)) {
    bBox.bottom = ppValue;
    delete bBox.height;
  } else {
    return null;
  }
  return bBox;
}
window.validPPBBox = validPPBBox; // [DEBUG/]

function ppBBox2OptionObject(ppBBox) {
  return Object.keys(ppBBox).reduce(function (obj, prop) {
    obj[prop] = ppValue2OptionValue(ppBBox[prop]);
    return obj;
  }, {});
}
window.ppBBox2OptionObject = ppBBox2OptionObject; // [DEBUG/]

// PPBBox -> BBox
function resolvePPBBox(ppBBox, baseBBox) {
  var prop2Axis = { left: 'x', right: 'x', x: 'x', width: 'x',
    top: 'y', bottom: 'y', y: 'y', height: 'y' },
      baseOriginXY = { x: baseBBox.left, y: baseBBox.top },
      baseSizeXY = { x: baseBBox.width, y: baseBBox.height };
  return validBBox(Object.keys(ppBBox).reduce(function (bBox, prop) {
    bBox[prop] = resolvePPValue(ppBBox[prop], prop === 'width' || prop === 'height' ? 0 : baseOriginXY[prop2Axis[prop]], baseSizeXY[prop2Axis[prop]]);
    return bBox;
  }, {}));
}
window.resolvePPBBox = resolvePPBBox; // [DEBUG/]

/**
 * @param {Element} element - A target element.
 * @param {?boolean} getPaddingBox - Get padding-box instead of border-box as bounding-box.
 * @returns {BBox} - A bounding-box of `element`.
 */
function getBBox(element, getPaddingBox) {
  var rect = element.getBoundingClientRect(),
      bBox = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  bBox.left += window.pageXOffset;
  bBox.top += window.pageYOffset;
  if (getPaddingBox) {
    var style = window.getComputedStyle(element, ''),
        borderTop = parseFloat(style.borderTopWidth) || 0,
        borderRight = parseFloat(style.borderRightWidth) || 0,
        borderBottom = parseFloat(style.borderBottomWidth) || 0,
        borderLeft = parseFloat(style.borderLeftWidth) || 0;
    bBox.left += borderLeft;
    bBox.top += borderTop;
    bBox.width -= borderLeft + borderRight;
    bBox.height -= borderTop + borderBottom;
  }
  return validBBox(bBox);
}
window.getBBox = getBBox; // [DEBUG/]

/**
 * Optimize an element for animation.
 * @param {Element} element - A target element.
 * @param {?boolean} gpuTrigger - Initialize for SVGElement if `true`.
 * @returns {Element} - A target element.
 */
function initAnim(element, gpuTrigger) {
  var style = element.style;
  style.webkitTapHighlightColor = 'transparent';
  style[_cssprefix2.default.getName('boxShadow')] = '0 0 1px transparent';
  if (gpuTrigger && cssPropTransform) {
    style[cssPropTransform] = 'translateZ(0)';
  }
  return element;
}

function setDraggableCursor(element, orgCursor) {
  if (cssValueDraggableCursor == null) {
    if (cssWantedValueDraggableCursor !== false) {
      cssValueDraggableCursor = _cssprefix2.default.getValue('cursor', cssWantedValueDraggableCursor);
    }
    // The wanted value was denied, or changing is not wanted.
    if (cssValueDraggableCursor == null) {
      cssValueDraggableCursor = false;
    }
  }
  // Update it to change a state even if cssValueDraggableCursor is false.
  element.style.cursor = cssValueDraggableCursor === false ? orgCursor : cssValueDraggableCursor;
}

function setDraggingCursor(element) {
  if (cssValueDraggingCursor == null) {
    if (cssWantedValueDraggingCursor !== false) {
      cssValueDraggingCursor = _cssprefix2.default.getValue('cursor', cssWantedValueDraggingCursor);
    }
    // The wanted value was denied, or changing is not wanted.
    if (cssValueDraggingCursor == null) {
      cssValueDraggingCursor = false;
    }
  }
  if (cssValueDraggingCursor !== false) {
    element.style.cursor = cssValueDraggingCursor;
  }
}

/**
 * Move by `translate`.
 * @param {props} props - `props` of instance.
 * @param {{left: number, top: number}} position - New position.
 * @returns {boolean} - `true` if it was moved.
 */
function moveTranslate(props, position) {
  var elementBBox = props.elementBBox;
  if (position.left !== elementBBox.left || position.top !== elementBBox.top) {
    var offset = props.htmlOffset;
    props.elementStyle[cssPropTransform] = 'translate(' + (position.left + offset.left) + 'px, ' + (position.top + offset.top) + 'px)';
    return true;
  }
  return false;
}

/**
 * Set `props.element` position.
 * @param {props} props - `props` of instance.
 * @param {{left: number, top: number}} position - New position.
 * @param {function} [cbCheck] - Callback that is called with valid position, cancel moving if it returns `false`.
 * @returns {boolean} - `true` if it was moved.
 */
function move(props, position, cbCheck) {
  var elementBBox = props.elementBBox;

  function fix() {
    if (props.minLeft >= props.maxLeft) {
      // Disabled
      position.left = elementBBox.left;
    } else if (position.left < props.minLeft) {
      position.left = props.minLeft;
    } else if (position.left > props.maxLeft) {
      position.left = props.maxLeft;
    }
    if (props.minTop >= props.maxTop) {
      // Disabled
      position.top = elementBBox.top;
    } else if (position.top < props.minTop) {
      position.top = props.minTop;
    } else if (position.top > props.maxTop) {
      position.top = props.maxTop;
    }
  }

  fix();
  if (cbCheck) {
    if (cbCheck(position) === false) {
      return false;
    }
    fix(); // Again
  }

  var moved = props.moveElm(props, position);
  if (moved) {
    // Update elementBBox
    props.elementBBox = validBBox({ left: position.left, top: position.top,
      width: elementBBox.width, height: elementBBox.height });
  }
  return moved;
}

/**
 * Initialize HTMLElement for `translate`, and get `offset` that is used by `moveTranslate`.
 * @param {props} props - `props` of instance.
 * @returns {void}
 */
function initTranslate(props) {
  var element = props.element,
      elementStyle = props.elementStyle,
      curPosition = getBBox(element),
      // Get BBox before change style.
  RESTORE_PROPS = ['display', 'marginTop', 'marginBottom', 'width', 'height'];
  RESTORE_PROPS.unshift(cssPropTransform);

  if (!props.orgStyle) {
    props.orgStyle = RESTORE_PROPS.reduce(function (orgStyle, prop) {
      orgStyle[prop] = elementStyle[prop] || '';
      return orgStyle;
    }, {});
    props.lastStyle = {};
  } else {
    RESTORE_PROPS.forEach(function (prop) {
      // Skip this if it seems user changed it. (it can't check perfectly.)
      if (props.lastStyle[prop] == null || elementStyle[prop] === props.lastStyle[prop]) {
        elementStyle[prop] = props.orgStyle[prop];
      }
    });
  }

  var orgSize = getBBox(element),
      cmpStyle = window.getComputedStyle(element, '');
  // https://www.w3.org/TR/css-transforms-1/#transformable-element
  if (cmpStyle.display === 'inline') {
    elementStyle.display = 'inline-block';
    ['Top', 'Bottom'].forEach(function (dirProp) {
      var padding = parseFloat(cmpStyle['padding' + dirProp]);
      // paddingTop/Bottom make padding but don't make space -> negative margin in inline-block
      // marginTop/Bottom don't work in inline element -> `0` in inline-block
      elementStyle['margin' + dirProp] = padding ? '-' + padding + 'px' : '0';
    });
  }
  elementStyle[cssPropTransform] = 'translate(0, 0)';
  // Get document offset.
  var newBBox = getBBox(element);
  var offset = props.htmlOffset = { left: newBBox.left ? -newBBox.left : 0, top: newBBox.top ? -newBBox.top : 0 }; // avoid `-0`

  // Restore position
  elementStyle[cssPropTransform] = 'translate(' + (curPosition.left + offset.left) + 'px, ' + (curPosition.top + offset.top) + 'px)';
  // Restore size
  ['width', 'height'].forEach(function (prop) {
    if (newBBox[prop] !== orgSize[prop]) {
      // Ignore `box-sizing`
      elementStyle[prop] = orgSize[prop] + 'px';
      newBBox = getBBox(element);
      if (newBBox[prop] !== orgSize[prop]) {
        // Retry
        elementStyle[prop] = orgSize[prop] - (newBBox[prop] - orgSize[prop]) + 'px';
      }
    }
    props.lastStyle[prop] = elementStyle[prop];
  });
}

/**
 * Set `elementBBox`, `containmentBBox`, `min/max``Left/Top` and `snapTargets`.
 * @param {props} props - `props` of instance.
 * @returns {void}
 */
function initBBox(props) {
  props.initElm(props);

  var docBBox = getBBox(document.documentElement),
      elementBBox = props.elementBBox = getBBox(props.element),
      containmentBBox = props.containmentBBox = props.containmentIsBBox ? resolvePPBBox(props.options.containment, docBBox) || docBBox : getBBox(props.options.containment, true);
  props.minLeft = containmentBBox.left;
  props.maxLeft = containmentBBox.right - elementBBox.width;
  props.minTop = containmentBBox.top;
  props.maxTop = containmentBBox.bottom - elementBBox.height;
  // Adjust position
  move(props, { left: elementBBox.left, top: elementBBox.top });

  window.initBBoxDone = true; // [DEBUG/]
}

function dragEnd(props) {
  setDraggableCursor(props.options.handle, props.orgCursor);
  body.style.cursor = cssOrgValueBodyCursor;

  if (props.options.zIndex !== false) {
    props.elementStyle.zIndex = props.orgZIndex;
  }
  if (cssPropUserSelect) {
    body.style[cssPropUserSelect] = cssOrgValueBodyUserSelect;
  }
  var classList = (0, _mClassList2.default)(props.element);
  if (movingClass) {
    classList.remove(movingClass);
  }
  if (draggingClass) {
    classList.remove(draggingClass);
  }

  activeItem = null;
  if (props.onDragEnd) {
    props.onDragEnd();
  }
}

function mousedown(props, event) {
  if (props.disabled) {
    return;
  }
  if (activeItem) {
    dragEnd(activeItem);
  } // activeItem is normally null by `mouseup`.

  setDraggingCursor(props.options.handle);
  body.style.cursor = cssValueDraggingCursor || // If it is `false` or `''`
  window.getComputedStyle(props.options.handle, '').cursor;

  if (props.options.zIndex !== false) {
    props.elementStyle.zIndex = props.options.zIndex;
  }
  if (cssPropUserSelect) {
    body.style[cssPropUserSelect] = 'none';
  }
  if (draggingClass) {
    (0, _mClassList2.default)(props.element).add(draggingClass);
  }

  activeItem = props;
  hasMoved = false;
  pointerOffset = { left: props.elementBBox.left - event.pageX, top: props.elementBBox.top - event.pageY };
}

/**
 * @param {props} props - `props` of instance.
 * @param {Object} newOptions - New options.
 * @returns {void}
 */
function _setOptions(props, newOptions) {
  var options = props.options;
  var needsInitBBox = void 0;

  // containment
  if (newOptions.containment) {
    var bBox = void 0;
    if (isElement(newOptions.containment)) {
      // Specific element
      if (newOptions.containment !== options.containment) {
        // Restore
        props.scrollElements.forEach(function (element) {
          element.removeEventListener('scroll', props.handleScroll, false);
        });
        props.scrollElements = [];
        window.removeEventListener('scroll', props.handleScroll, false);
        // Parse tree
        var element = newOptions.containment,
            fixedElement = void 0;
        while (element && element !== body) {
          if (element.nodeType === Node.ELEMENT_NODE) {
            var cmpStyle = window.getComputedStyle(element, '');
            // Scrollable element
            if (!(element instanceof SVGElement) && (cmpStyle.overflow !== 'visible' || cmpStyle.overflowX !== 'visible' || cmpStyle.overflowY !== 'visible' // `hidden` also is scrollable.
            )) {
              element.addEventListener('scroll', props.handleScroll, false);
              props.scrollElements.push(element);
            }
            // Element that is re-positioned (document based) when window scrolled.
            if (cmpStyle.position === 'fixed') {
              fixedElement = true;
            }
          }
          element = element.parentNode;
        }
        if (fixedElement) {
          window.addEventListener('scroll', props.handleScroll, false);
        }

        options.containment = newOptions.containment;
        props.containmentIsBBox = false;
        needsInitBBox = true;
      }
    } else if ((bBox = validPPBBox(copyTree(newOptions.containment))) && // bBox
    hasChanged(bBox, options.containment)) {
      options.containment = bBox;
      props.containmentIsBBox = true;
      needsInitBBox = true;
    }
  }

  if (needsInitBBox) {
    initBBox(props);
  }

  // Gecko, Trident pick drag-event of some elements such as img, a, etc.
  function dragstart(event) {
    event.preventDefault();
  }

  // handle
  if (isElement(newOptions.handle) && newOptions.handle !== options.handle) {
    if (options.handle) {
      // Restore
      options.handle.style.cursor = props.orgCursor;
      if (cssPropUserSelect) {
        options.handle.style[cssPropUserSelect] = props.orgUserSelect;
      }
      options.handle.removeEventListener('dragstart', dragstart, false);
      options.handle.removeEventListener('mousedown', props.handleMousedown, false);
    }
    var handle = options.handle = newOptions.handle;
    props.orgCursor = handle.style.cursor;
    setDraggableCursor(handle, props.orgCursor);
    if (cssPropUserSelect) {
      props.orgUserSelect = handle.style[cssPropUserSelect];
      handle.style[cssPropUserSelect] = 'none';
    }
    handle.addEventListener('dragstart', dragstart, false);
    handle.addEventListener('mousedown', props.handleMousedown, false);
  }

  // zIndex
  if (isFinite(newOptions.zIndex) || newOptions.zIndex === false) {
    options.zIndex = newOptions.zIndex;
    if (props === activeItem) {
      props.elementStyle.zIndex = options.zIndex === false ? props.orgZIndex : options.zIndex;
    }
  }

  // left/top
  var position = { left: props.elementBBox.left, top: props.elementBBox.top };
  var needsMove = void 0;
  if (isFinite(newOptions.left) && newOptions.left !== position.left) {
    position.left = newOptions.left;
    needsMove = true;
  }
  if (isFinite(newOptions.top) && newOptions.top !== position.top) {
    position.top = newOptions.top;
    needsMove = true;
  }
  if (needsMove) {
    move(props, position);
  }

  // Event listeners
  ['onDrag', 'onMove', 'onMoveStart', 'onDragEnd'].forEach(function (option) {
    if (typeof newOptions[option] === 'function') {
      options[option] = newOptions[option];
      props[option] = options[option].bind(props.ins);
    } else if (newOptions.hasOwnProperty(option) && newOptions[option] == null) {
      options[option] = props[option] = void 0;
    }
  });
}

var PlainDraggable = function () {
  /**
   * Create a `PlainDraggable` instance.
   * @param {Element} element - Target element.
   * @param {Object} [options] - Options.
   */
  function PlainDraggable(element, options) {
    _classCallCheck(this, PlainDraggable);

    var props = {
      ins: this,
      options: { // Initial options (not default)
        zIndex: ZINDEX // Initial state.
      },
      disabled: false
    };

    Object.defineProperty(this, '_id', { value: ++insId });
    props._id = this._id;
    insProps[this._id] = props;
    props.initArguments = Array.prototype.slice.call(arguments); // [DEBUG/]

    if (!isElement(element) || element === body) {
      throw new Error('This element is not accepted.');
    }
    if (!options) {
      options = {};
    } else if (!isObject(options)) {
      throw new Error('Invalid options.');
    }

    var gpuTrigger = true;
    var cssPropWillChange = _cssprefix2.default.getName('willChange');
    if (cssPropWillChange) {
      gpuTrigger = false;
    }

    if (!options.leftTop && cssPropTransform) {
      // translate
      if (cssPropWillChange) {
        element.style[cssPropWillChange] = 'transform';
      }
      props.initElm = initTranslate;
      props.moveElm = moveTranslate;
    } else {
      // left and top
      throw new Error('`transform` is not supported.');
    }

    props.element = initAnim(element, gpuTrigger);
    props.elementStyle = element.style;
    props.orgZIndex = props.elementStyle.zIndex;
    if (draggableClass) {
      (0, _mClassList2.default)(element).add(draggableClass);
    }
    // Prepare removable event listeners for each instance.
    props.handleMousedown = function (event) {
      mousedown(props, event);
    };
    props.handleScroll = _animEvent2.default.add(function () {
      initBBox(props);
    });
    props.scrollElements = [];

    // Default options
    if (!options.containment) {
      var parent = void 0;
      options.containment = (parent = element.parentNode) && isElement(parent) ? parent : body;
    }
    if (!options.handle) {
      options.handle = element;
    }

    _setOptions(props, options);
  }

  /**
   * @param {Object} options - New options.
   * @returns {PlainDraggable} - Current instance itself.
   */


  _createClass(PlainDraggable, [{
    key: 'setOptions',
    value: function setOptions(options) {
      if (isObject(options)) {
        _setOptions(insProps[this._id], options);
      }
      return this;
    }
  }, {
    key: 'position',
    value: function position() {
      initBBox(insProps[this._id]);
      return this;
    }
  }, {
    key: 'disabled',
    get: function get() {
      return insProps[this._id].disabled;
    },
    set: function set(value) {
      var props = insProps[this._id];
      if ((value = !!value) !== props.disabled) {
        props.disabled = value;
        if (props.disabled) {
          if (props === activeItem) {
            dragEnd(props);
          }
          props.options.handle.style.cursor = props.orgCursor;
          if (cssPropUserSelect) {
            props.options.handle.style[cssPropUserSelect] = props.orgUserSelect;
          }
          if (draggableClass) {
            (0, _mClassList2.default)(props.element).remove(draggableClass);
          }
        } else {
          setDraggableCursor(props.options.handle, props.orgCursor);
          if (cssPropUserSelect) {
            props.options.handle.style[cssPropUserSelect] = 'none';
          }
          if (draggableClass) {
            (0, _mClassList2.default)(props.element).add(draggableClass);
          }
        }
      }
    }
  }, {
    key: 'element',
    get: function get() {
      return insProps[this._id].element;
    }
  }, {
    key: 'rect',
    get: function get() {
      return copyTree(insProps[this._id].elementBBox);
    }
  }, {
    key: 'left',
    get: function get() {
      return insProps[this._id].elementBBox.left;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { left: value });
    }
  }, {
    key: 'top',
    get: function get() {
      return insProps[this._id].elementBBox.top;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { top: value });
    }
  }, {
    key: 'containment',
    get: function get() {
      var props = insProps[this._id];
      return props.containmentIsBBox ? ppBBox2OptionObject(props.options.containment) : props.options.containment;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { containment: value });
    }
  }, {
    key: 'handle',
    get: function get() {
      return insProps[this._id].options.handle;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { handle: value });
    }
  }, {
    key: 'zIndex',
    get: function get() {
      return insProps[this._id].options.zIndex;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { zIndex: value });
    }
  }, {
    key: 'onDrag',
    get: function get() {
      return insProps[this._id].options.onDrag;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onDrag: value });
    }
  }, {
    key: 'onMove',
    get: function get() {
      return insProps[this._id].options.onMove;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onMove: value });
    }
  }, {
    key: 'onMoveStart',
    get: function get() {
      return insProps[this._id].options.onMoveStart;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onMoveStart: value });
    }
  }, {
    key: 'onDragEnd',
    get: function get() {
      return insProps[this._id].options.onDragEnd;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], { onDragEnd: value });
    }
  }], [{
    key: 'draggableCursor',
    get: function get() {
      return cssWantedValueDraggableCursor;
    },
    set: function set(value) {
      if (cssWantedValueDraggableCursor !== value) {
        cssWantedValueDraggableCursor = value;
        cssValueDraggableCursor = null; // Reset
        Object.keys(insProps).forEach(function (id) {
          var props = insProps[id];
          if (props.disabled || props === activeItem && cssValueDraggingCursor !== false) {
            return;
          }
          setDraggableCursor(props.options.handle, props.orgCursor);
          if (props === activeItem) {
            // Since cssValueDraggingCursor is `false`, copy cursor again.
            body.style.cursor = cssOrgValueBodyCursor;
            body.style.cursor = window.getComputedStyle(props.options.handle, '').cursor;
          }
        });
      }
    }
  }, {
    key: 'draggingCursor',
    get: function get() {
      return cssWantedValueDraggingCursor;
    },
    set: function set(value) {
      if (cssWantedValueDraggingCursor !== value) {
        cssWantedValueDraggingCursor = value;
        cssValueDraggingCursor = null; // Reset
        if (activeItem) {
          setDraggingCursor(activeItem.options.handle);
          if (cssValueDraggingCursor === false) {
            setDraggableCursor(activeItem.options.handle, activeItem.orgCursor); // draggableCursor
            body.style.cursor = cssOrgValueBodyCursor;
          }
          body.style.cursor = cssValueDraggingCursor || // If it is `false` or `''`
          window.getComputedStyle(activeItem.options.handle, '').cursor;
        }
      }
    }
  }, {
    key: 'draggableClass',
    get: function get() {
      return draggableClass;
    },
    set: function set(value) {
      value = value ? value + '' : void 0;
      if (value !== draggableClass) {
        Object.keys(insProps).forEach(function (id) {
          var props = insProps[id];
          if (!props.disabled) {
            var classList = (0, _mClassList2.default)(props.element);
            if (draggableClass) {
              classList.remove(draggableClass);
            }
            if (value) {
              classList.add(value);
            }
          }
        });
        draggableClass = value;
      }
    }
  }, {
    key: 'draggingClass',
    get: function get() {
      return draggingClass;
    },
    set: function set(value) {
      value = value ? value + '' : void 0;
      if (value !== draggingClass) {
        if (activeItem) {
          var classList = (0, _mClassList2.default)(activeItem.element);
          if (draggingClass) {
            classList.remove(draggingClass);
          }
          if (value) {
            classList.add(value);
          }
        }
        draggingClass = value;
      }
    }
  }, {
    key: 'movingClass',
    get: function get() {
      return movingClass;
    },
    set: function set(value) {
      value = value ? value + '' : void 0;
      if (value !== movingClass) {
        if (activeItem && hasMoved) {
          var classList = (0, _mClassList2.default)(activeItem.element);
          if (movingClass) {
            classList.remove(movingClass);
          }
          if (value) {
            classList.add(value);
          }
        }
        movingClass = value;
      }
    }
  }]);

  return PlainDraggable;
}();

document.addEventListener('mousemove', _animEvent2.default.add(function (event) {
  if (activeItem && move(activeItem, {
    left: event.pageX + pointerOffset.left,
    top: event.pageY + pointerOffset.top
  }, activeItem.onDrag)) {

    if (!hasMoved) {
      hasMoved = true;
      if (movingClass) {
        (0, _mClassList2.default)(activeItem.element).add(movingClass);
      }
      if (activeItem.onMoveStart) {
        activeItem.onMoveStart();
      }
    }
    if (activeItem.onMove) {
      activeItem.onMove();
    }
  }
}), false);

document.addEventListener('mouseup', function () {
  // It might occur outside body.
  if (activeItem) {
    dragEnd(activeItem);
  }
}, false);

{
  var initDoc = function initDoc() {
    cssPropTransform = _cssprefix2.default.getName('transform');
    cssOrgValueBodyCursor = body.style.cursor;
    if (cssPropUserSelect = _cssprefix2.default.getName('userSelect')) {
      cssOrgValueBodyUserSelect = body.style[cssPropUserSelect];
    }

    // Gecko bug, multiple calling (parallel) by `requestAnimationFrame`.
    window.addEventListener('resize', _animEvent2.default.add(function () {
      if (resizing) {
        console.log('`resize` event listener is already running.'); // [DEBUG/]
        return;
      }
      resizing = true;
      Object.keys(insProps).forEach(function (id) {
        if (insProps[id].initElm) {
          // Easy checking for instance without errors.
          initBBox(insProps[id]);
        }
        // eslint-disable-next-line brace-style
        else {
            console.log('instance may have an error:');console.log(insProps[id]);
          } // [DEBUG/]
      });
      resizing = false;
    }), true);
  };

  var resizing = false;


  if (body = document.body) {
    initDoc();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      body = document.body;
      initDoc();
    }, false);
  }
}

PlainDraggable.limit = true;

exports.default = PlainDraggable;
module.exports = exports['default'];

/***/ })
/******/ ]);
//# sourceMappingURL=plain-modal.js.map