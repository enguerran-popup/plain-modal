/*
  DON'T MANUALLY EDIT THIS FILE; run `npm run dev-limit` instead.
*/

/*
 * PlainModal
 * https://anseki.github.io/plain-modal/
 *
 * Copyright (c) 2017 anseki
 * Licensed under the MIT license.
 */

import CSSPrefix from 'cssprefix';
import mClassList from 'm-class-list';
import PlainOverlay from 'plain-overlay';
import CSS_TEXT from './default.scss';
mClassList.ignoreNative = true;

const
  APP_ID = 'plainmodal',
  STYLE_ELEMENT_ID = `${APP_ID}-style`,
  STYLE_CLASS = APP_ID,
  STYLE_CLASS_CONTENT = `${APP_ID}-content`,
  STYLE_CLASS_OVERLAY = `${APP_ID}-overlay`,
  STYLE_CLASS_OVERLAY_HIDE = `${STYLE_CLASS_OVERLAY}-hide`,
  STYLE_CLASS_OVERLAY_FORCE = `${STYLE_CLASS_OVERLAY}-force`,

  STATE_CLOSED = 0, STATE_OPENING = 1, STATE_OPENED = 2, STATE_CLOSING = 3,
  STATE_INACTIVATING = 4, STATE_INACTIVATED = 5, STATE_ACTIVATING = 6,
  CLOSE_BUTTON = 'plainmodal-close',
  DURATION = 200, // COPY from PlainOverlay

  IS_TRIDENT = !!document.uniqueID,
  IS_EDGE = '-ms-scroll-limit' in document.documentElement.style &&
    '-ms-ime-align' in document.documentElement.style && !window.navigator.msPointerEnabled,
  IS_WEBKIT = !window.chrome && 'WebkitAppearance' in document.documentElement.style, // [DEBUG/]
  IS_BLINK = !!(window.chrome && window.chrome.webstore), // [DEBUG/]
  IS_GECKO = 'MozAppearance' in document.documentElement.style, // [DEBUG/]

  isObject = (() => {
    const toString = {}.toString, fnToString = {}.hasOwnProperty.toString,
      objFnString = fnToString.call(Object);
    return obj => {
      let proto, constr;
      return obj && toString.call(obj) === '[object Object]' &&
        (!(proto = Object.getPrototypeOf(obj)) ||
          (constr = proto.hasOwnProperty('constructor') && proto.constructor) &&
          typeof constr === 'function' && fnToString.call(constr) === objFnString);
    };
  })(),
  isFinite = Number.isFinite || (value => typeof value === 'number' && window.isFinite(value)),

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

let insId = 0,
  insOpenCloseEffect; // A `props` that is running the "open/close" effect now.

// [DEBUG]
window.insProps = insProps;
window.IS_TRIDENT = IS_TRIDENT;
window.IS_EDGE = IS_EDGE;
window.IS_WEBKIT = IS_WEBKIT;
window.IS_BLINK = IS_BLINK;
window.IS_GECKO = IS_GECKO;
// [/DEBUG]

// [DEBUG]
const traceLog = [];
const STATE_TEXT = {};
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
  setTimeout(() => {
    const parentNode = target.parentNode, next = target.nextSibling;
    // It has to be removed first for Blink.
    parentNode.insertBefore(parentNode.removeChild(target), next);
  }, 0);
}

/**
 * @param {Element} element - A target element.
 * @returns {boolean} `true` if connected element.
 */
function isElement(element) {
  return !!(element &&
    element.nodeType === Node.ELEMENT_NODE &&
    // element instanceof HTMLElement &&
    typeof element.getBoundingClientRect === 'function' &&
    !(element.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED));
}

function finishOpening(props) {
  traceLog.push('<finishOpening>', `_id:${props._id}`, `state:${STATE_TEXT[props.state]}`); // [DEBUG/]
  insOpenCloseEffect = null;
  props.state = STATE_OPENED;
  if (props.parentProps) {
    // [DEBUG]
    traceLog.push(`parentProps._id:${props.parentProps._id}`,
      `parentProps.state:${STATE_TEXT[props.parentProps.state]}`);
    // [/DEBUG]
    props.parentProps.state = STATE_INACTIVATED;
  }
  if (props.options.onOpen) { props.options.onOpen.call(props.ins); }
  traceLog.push(`_id:${props._id}`, `state:${STATE_TEXT[props.state]}`, '</finishOpening>'); // [DEBUG/]
}

function finishClosing(props) {
  traceLog.push('<finishClosing>', `_id:${props._id}`, `state:${STATE_TEXT[props.state]}`); // [DEBUG/]
  if (insShown[insShown.length - 1] !== props) { throw new Error('`insShown` is broken.'); } // [DEBUG/]
  insShown.pop();
  insOpenCloseEffect = null;
  props.state = STATE_CLOSED;
  if (props.parentProps) {
    // [DEBUG]
    traceLog.push(`parentProps._id:${props.parentProps._id}`,
      `parentProps.state:${STATE_TEXT[props.parentProps.state]}`);
    // [/DEBUG]
    props.parentProps.state = STATE_OPENED;
    props.parentProps = null;
  }
  if (props.options.onClose) { props.options.onClose.call(props.ins); }
  traceLog.push(`_id:${props._id}`, `state:${STATE_TEXT[props.state]}`, '</finishClosing>'); // [DEBUG/]
}

/**
 * Process after preparing data and adjusting style.
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function execOpening(props, force) {
  traceLog.push('<execOpening>', `_id:${props._id}`, `state:${STATE_TEXT[props.state]}`); // [DEBUG/]
  traceLog.push(`force:${!!force}`); // [DEBUG/]
  if (props.parentProps) { // inactivate parentProps
    // [DEBUG]
    traceLog.push(`parentProps._id:${props.parentProps._id}`,
      `parentProps.state:${STATE_TEXT[props.parentProps.state]}`);
    // [/DEBUG]
    /*
      Cases:
        - STATE_OPENED or STATE_ACTIVATING, regardless of force
        - STATE_INACTIVATING and force
    */
    const parentProps = props.parentProps, elmOverlay = parentProps.elmOverlay;
    if (parentProps.state === STATE_OPENED) {
      elmOverlay.style[CSSPrefix.getName('transitionDuration')] =
        props.options.duration === DURATION ? '' : `${props.options.duration}ms`;
    }
    mClassList(elmOverlay).add(STYLE_CLASS_OVERLAY_HIDE).toggle(STYLE_CLASS_OVERLAY_FORCE, !!force);
    // same condition as props
    if (!force) { parentProps.state = STATE_INACTIVATING; }
  }

  // When `force`, `props.state` is updated immediately in
  //    plainOverlay.onShow -> finishOpening -> STATE_OPENED
  if (!force) { props.state = STATE_OPENING; }
  props.plainOverlay.show(force);
  traceLog.push(`_id:${props._id}`, `state:${STATE_TEXT[props.state]}`, '</execOpening>'); // [DEBUG/]
}

/**
 * Process after preparing data and adjusting style.
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @param {boolean} [sync] - `force` with sync-mode. (Skip restoring active element)
 * @returns {void}
 */
function execClosing(props, force, sync) {
  traceLog.push('<execClosing>', `_id:${props._id}`, `state:${STATE_TEXT[props.state]}`); // [DEBUG/]
  traceLog.push(`force:${!!force}`, `sync:${!!sync}`); // [DEBUG/]
  if (props.parentProps) { // activate parentProps
    // [DEBUG]
    traceLog.push(`parentProps._id:${props.parentProps._id}`,
      `parentProps.state:${STATE_TEXT[props.parentProps.state]}`);
    // [/DEBUG]
    /*
      Cases:
        - STATE_INACTIVATED or STATE_INACTIVATING, regardless of `force`
        - STATE_ACTIVATING and `force`
    */
    const parentProps = props.parentProps, elmOverlay = parentProps.elmOverlay;
    if (parentProps.state === STATE_INACTIVATED) {
      elmOverlay.style[CSSPrefix.getName('transitionDuration')] =
        props.options.duration === DURATION ? '' : `${props.options.duration}ms`;
    }
    mClassList(elmOverlay).remove(STYLE_CLASS_OVERLAY_HIDE).toggle(STYLE_CLASS_OVERLAY_FORCE, !!force);
    // same condition as props
    parentProps.state = STATE_ACTIVATING;
  }

  // Even when `force`, `props.state` is updated with "async" (if !sync),
  // something might run before `props.state` is updated in
  //    (setTimeout ->) plainOverlay.onHide -> finishClosing -> STATE_CLOSED
  props.state = STATE_CLOSING;
  props.plainOverlay.hide(force, sync);
  traceLog.push(`_id:${props._id}`, `state:${STATE_TEXT[props.state]}`, '</execClosing>'); // [DEBUG/]
}

/**
 * Finish the "open/close" effect immediately with sync-mode.
 * @param {props} props - `props` of instance.
 * @returns {void}
 */
function fixOpenClose(props) {
  traceLog.push('<fixOpenClose>', `_id:${props._id}`, `state:${STATE_TEXT[props.state]}`); // [DEBUG/]
  if (props.state === STATE_OPENING) {
    execOpening(props, true);
  } else if (props.state === STATE_CLOSING) {
    execClosing(props, true, true);
  }
  traceLog.push(`_id:${props._id}`, `state:${STATE_TEXT[props.state]}`, '</fixOpenClose>'); // [DEBUG/]
}

/**
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function open(props, force) {
  traceLog.push('<open>', `_id:${props._id}`, `state:${STATE_TEXT[props.state]}`); // [DEBUG/]
  if (props.state !== STATE_CLOSED &&
        props.state !== STATE_CLOSING && props.state !== STATE_OPENING ||
      props.state === STATE_OPENING && !force ||
      props.state !== STATE_OPENING &&
        props.options.onBeforeOpen && props.options.onBeforeOpen.call(props.ins) === false) {
    traceLog.push('cancel', '</open>'); // [DEBUG/]
    return;
  }
  /*
    Cases:
      - STATE_CLOSED or STATE_CLOSING, regardless of `force`
      - STATE_OPENING and `force`
  */

  if (props.state === STATE_CLOSED) {
    traceLog.push(`insOpenCloseEffect:${insOpenCloseEffect ? insOpenCloseEffect._id : 'NONE'}`); // [DEBUG/]
    if (insOpenCloseEffect) { fixOpenClose(insOpenCloseEffect); }
    insOpenCloseEffect = props;

    if (insShown.length) {
      if (insShown.indexOf(props) !== -1) { throw new Error('`insShown` is broken.'); } // [DEBUG/]
      props.parentProps = insShown[insShown.length - 1];
      traceLog.push(`parentProps:${props.parentProps._id}`); // [DEBUG/]
    }
    insShown.push(props);

    mClassList(props.elmOverlay).add(STYLE_CLASS_OVERLAY_FORCE).remove(STYLE_CLASS_OVERLAY_HIDE);
  }

  execOpening(props, force);
  traceLog.push(`_id:${props._id}`, `state:${STATE_TEXT[props.state]}`, '</open>'); // [DEBUG/]
}

/**
 * @param {props} props - `props` of instance.
 * @param {boolean} [force] - Skip effect.
 * @returns {void}
 */
function close(props, force) {
  traceLog.push('<close>', `_id:${props._id}`, `state:${STATE_TEXT[props.state]}`); // [DEBUG/]
  if (props.state === STATE_CLOSED ||
      props.state === STATE_CLOSING && !force ||
      props.state !== STATE_CLOSING &&
        props.options.onBeforeClose && props.options.onBeforeClose.call(props.ins) === false) {
    traceLog.push('cancel', '</close>'); // [DEBUG/]
    return;
  }
  /*
    Cases:
      - Other than STATE_CLOSED and STATE_CLOSING, regardless of `force`
      - STATE_CLOSING and `force`
  */

  traceLog.push(`insOpenCloseEffect:${insOpenCloseEffect ? insOpenCloseEffect._id : 'NONE'}`); // [DEBUG/]
  if (insOpenCloseEffect && insOpenCloseEffect !== props) {
    fixOpenClose(insOpenCloseEffect);
    insOpenCloseEffect = null;
  }
  /*
    Cases:
      - STATE_OPENED, STATE_OPENING or STATE_INACTIVATED, regardless of `force`
      - STATE_CLOSING and `force`
  */
  if (props.state === STATE_INACTIVATED) { // -> STATE_OPENED
    // [DEBUG]
    const i = insShown.indexOf(props);
    if (i === -1 || i === insShown.length - 1) { throw new Error('`insShown` is broken.'); }
    // [/DEBUG]
    let topProps;
    while ((topProps = insShown[insShown.length - 1]) !== props) {
      if (topProps.state !== STATE_OPENED) { throw new Error('`insShown` is broken.'); } // [DEBUG/]
      // [DEBUG]
      traceLog.push(`topProps._id:${topProps._id}`,
        `topProps.state:${STATE_TEXT[topProps.state]}`);
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
    if (insOpenCloseEffect) { throw new Error('`insOpenCloseEffect` is broken.'); } // [DEBUG/]
    insOpenCloseEffect = props;
  }

  execClosing(props, force);
  traceLog.push(`_id:${props._id}`, `state:${STATE_TEXT[props.state]}`, '</close>'); // [DEBUG/]
}

/**
 * @param {props} props - `props` of instance.
 * @param {Object} newOptions - New options.
 * @returns {void}
 */
function setOptions(props, newOptions) {
  const options = props.options, plainOverlay = props.plainOverlay;

  // closeButton
  if (typeof newOptions.closeButton === 'string' ||
      isElement(newOptions.closeButton) || newOptions.closeButton === false) {
    options.closeButton = newOptions.closeButton; // Update always even if the value was denied.
    if (newOptions.closeButton !== false) {
      const elmCloseButton = typeof newOptions.closeButton === 'string' ?
        props.elmContent.querySelector(newOptions.closeButton) : newOptions.closeButton;
      if (elmCloseButton && elmCloseButton !== props.elmCloseButton) { // Replace
        if (props.elmCloseButton) {
          props.elmCloseButton.removeEventListener('click', props.handleClose, false);
        }
        props.elmCloseButton = elmCloseButton;
        props.elmCloseButton.addEventListener('click', props.handleClose, false);
      }
    } else if (props.elmCloseButton) { // Remove
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


  // Event listeners
  ['onOpen', 'onClose', 'onBeforeOpen', 'onBeforeClose'].forEach(option => {
    if (typeof newOptions[option] === 'function') {
      options[option] = newOptions[option];
    } else if (newOptions.hasOwnProperty(option) && newOptions[option] == null) {
      options[option] = void 0;
    }
  });
}

class PlainModal {
  /**
   * Create a `PlainModal` instance.
   * @param {Element} content - An element that is shown as the content of the modal window.
   * @param {Object} [options] - Options.
   */
  constructor(content, options) {
    const props = {
      ins: this,
      options: { // Initial options (not default)
        closeButton: false,
        duration: DURATION,
        overlayBlur: false
      },
      state: STATE_CLOSED
    };

    Object.defineProperty(this, '_id', {value: ++insId});
    props._id = this._id;
    insProps[this._id] = props;

    if (!content.nodeType || content.nodeType !== Node.ELEMENT_NODE ||
        content.ownerDocument.defaultView !== window) {
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
      const head = document.getElementsByTagName('head')[0] || document.documentElement,
        sheet = head.insertBefore(document.createElement('style'), head.firstChild);
      sheet.type = 'text/css';
      sheet.id = STYLE_ELEMENT_ID;
      sheet.textContent = CSS_TEXT;
      if (IS_TRIDENT || IS_EDGE) { forceReflow(sheet); } // Trident bug
    }

    mClassList(content).add(STYLE_CLASS_CONTENT);
    // Overlay
    props.plainOverlay = new PlainOverlay({
      face: content,
      onShow: function() { finishOpening(props); },
      onHide: function() { finishClosing(props); }
    });
    const elmPlainOverlayBody = content.parentElement; // elmOverlayBody of PlainOverlay
    mClassList(elmPlainOverlayBody.parentElement).add(STYLE_CLASS); // elmOverlay of PlainOverlay

    // elmOverlay (own overlay)
    (props.elmOverlay = elmPlainOverlayBody.appendChild(document.createElement('div')))
      .className = STYLE_CLASS_OVERLAY;

    // Prepare removable event listeners for each instance.
    props.handleClose = () => { close(props); };

    // Default options
    if (options.closeButton == null) { options.closeButton = CLOSE_BUTTON; }

    setOptions(props, options);
  }

  /**
   * @param {Object} options - New options.
   * @returns {PlainModal} Current instance itself.
   */
  setOptions(options) {
    if (isObject(options)) {
      setOptions(insProps[this._id], options);
    }
    return this;
  }

  /**
   * Open the modal window.
   * @param {Object} [options] - New options.
   * @returns {PlainModal} Current instance itself.
   */
  open(options) {
    this.setOptions(options);
    open(insProps[this._id]);
    return this;
  }

  /**
   * Close the modal window.
   * @param {boolean} [force] - Close it immediately without effect.
   * @returns {PlainModal} Current instance itself.
   */
  close(force) {
    close(insProps[this._id], force);
    return this;
  }

  get state() {
    return insProps[this._id].state;
  }



  static get STATE_CLOSED() { return STATE_CLOSED; }
  static get STATE_OPENING() { return STATE_OPENING; }
  static get STATE_OPENED() { return STATE_OPENED; }
  static get STATE_CLOSING() { return STATE_CLOSING; }
  static get STATE_INACTIVATING() { return STATE_INACTIVATING; }
  static get STATE_INACTIVATED() { return STATE_INACTIVATED; }
  static get STATE_ACTIVATING() { return STATE_ACTIVATING; }
}

PlainModal.limit = true;

// [DEBUG]
PlainModal.traceLog = traceLog;
PlainModal.STATE_TEXT = STATE_TEXT;
// [/DEBUG]

export default PlainModal;