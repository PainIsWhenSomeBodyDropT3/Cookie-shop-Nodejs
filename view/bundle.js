(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":4}],3:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":10,"../core/createError":11,"./../core/settle":15,"./../helpers/buildURL":19,"./../helpers/cookies":21,"./../helpers/isURLSameOrigin":24,"./../helpers/parseHeaders":26,"./../utils":28}],4:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":5,"./cancel/CancelToken":6,"./cancel/isCancel":7,"./core/Axios":8,"./core/mergeConfig":14,"./defaults":17,"./helpers/bind":18,"./helpers/isAxiosError":23,"./helpers/spread":27,"./utils":28}],5:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],6:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":5}],7:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],8:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":19,"./../utils":28,"./InterceptorManager":9,"./dispatchRequest":12,"./mergeConfig":14}],9:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":28}],10:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":20,"../helpers/isAbsoluteURL":22}],11:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":13}],12:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":7,"../defaults":17,"./../utils":28,"./transformData":16}],13:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],14:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":28}],15:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":11}],16:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":28}],17:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":3,"./adapters/xhr":3,"./helpers/normalizeHeaderName":25,"./utils":28,"_process":1}],18:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],19:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":28}],20:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],21:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":28}],22:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],23:[function(require,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],24:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":28}],25:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":28}],26:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":28}],27:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],28:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":18}],29:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],30:[function(require,module,exports){
const logout = require('../views/toolbar/logout_button')
const login = require('../views/toolbar/sing_in_up')
const clear = require('../views/toolbar/clear_selection')
const {collection_multiview} = require('../views/collection_multiview/collection_multiview')
const {right_sidebar, sign_in_up_multiview} = require('../views/right_sidebar/right_sidebar')
const {collection_multiview_data, item_user_offers, item_offers, offers} = require('../views/collection_multiview/data')
const {users_in_table} = require('../views/collection_multiview/admin_data')
const {left_sidebar_data} = require('../views/left_sidebar/data')
const {toolbar_create_collection} = require('../views/toolbar/create_collection')
const {create_collection_popup} = require('../views/popup/create_collection')
const {update_delete_collection_popup} = require('../views/popup/update_delete_collection')
const userApi = require('../apis/user')
const itemApi = require('../apis/item')
const {socket} = require('../ws/ws')

function updateLeftSideUserBar() {
    let newData = []

    newData.push(
        {
            id: "home", icon: "mdi mdi-home", value: "Home", data: [
                {
                    id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                        {id: 'book', icon: 'mdi mdi-book', value: 'Book'},
                        {id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                        {id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                        {id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other'}
                    ]
                },
                {
                    id: 'items', icon: 'mdi mdi-sitemap', value: 'Items'
                }
            ]
        },
        {
            id: "user", icon: 'mdi mdi-account', value: 'User', data: [
                {
                    id: 'user_collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                        {id: 'user_book', icon: 'mdi mdi-book', value: 'Book'},
                        {id: 'user_drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                        {id: 'user_game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                        {id: 'user_other', icon: 'mdi mdi-skull-crossbones', value: 'Other'},
                    ]
                },
                {id: 'user_items', icon: 'mdi mdi-sitemap', value: 'Items'},
            ]
        })
    $$('cols').removeView('left_sidebar')
    $$('cols').addView({
        view: "sidebar",
        id: 'left_sidebar',
        scroll: 'y',
        //type: "customIcons",
        multipleOpen: true,
        data: newData,
        on: {
            onAfterSelect: function (id) {
                $$('collection_multiview').setValue(id);
            }
        },
        ready: function () {
            var firstItem = this.getFirstId();
            this.select(firstItem);
        }
    }, 0)
}
function updateLeftSideAdminBar() {
    let newData = []

    newData.push(
        {
            id: "home", icon: "mdi mdi-home", value: "Home", data: [
                {
                    id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                        {id: 'book', icon: 'mdi mdi-book', value: 'Book'},
                        {id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                        {id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                        {id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other'}
                    ]
                },
                {
                    id: 'items', icon: 'mdi mdi-sitemap', value: 'Items'
                }
            ]
        },
        {
            id: "users", icon: 'mdi mdi-account', value: 'Users'
        })
    $$('cols').removeView('left_sidebar')
    $$('cols').addView({
        view: "sidebar",
        id: 'left_sidebar',
        scroll: 'y',
        //type: "customIcons",
        multipleOpen: true,
        data: newData,
        on: {
            onAfterSelect: function (id) {
                $$('collection_multiview').setValue(id);
            }
        },
        ready: function () {
            var firstItem = this.getFirstId();
            this.select(firstItem);
        }
    }, 0)
}

function rollbackLeftSideBar() {
    let newData = [];
    newData.push({
        id: "home", icon: "mdi mdi-home", value: "Home", data: [
            {
                id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                    {id: 'book', icon: 'mdi mdi-book', value: 'Book'},
                    {id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink'},
                    {id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game'},
                    {id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other'}
                ]
            },
            {
                id: 'items', icon: 'mdi mdi-sitemap', value: 'Items'
            }
        ]

    })
    $$('cols').removeView('left_sidebar')
    $$('cols').addView({
        view: "sidebar",
        id: 'left_sidebar',
        scroll: 'y',
        //type: "customIcons",
        multipleOpen: true,
        data: newData,
        on: {
            onAfterSelect: function (id) {
                $$('collection_multiview').setValue(id);
            }
        },
        ready: function () {
            var firstItem = this.getFirstId();
            this.select(firstItem);
        }
    }, 0)
}


function disableRightSidebar() {
    $$('cols').removeView('right_sidebar');
    $$('cols').removeView('sign_in_up_multiview');
    //  $$('left_sidebar').toggle();
    if (!$$('collection_multiview')) {
        $$('cols').addView(collection_multiview, 1);
    }
}

function commentSetup() {
    /*(
        async () => {
            let res = await userApi.getByToken(localStorage.getItem('jwt'))
            if(res.status!==403) {
                let user = await res.json()
                console.log(user)
                $$("item_comment").setCurrentUser(user['Id']);
            }
        }
    )()*/

}

function removeItem(obj) {
    let removeObj = {
        id: obj.itemId
    };
    (
        async () => {
            await itemApi.remove(removeObj)
            obj.action = ''
            let message ={
                action:'delete_item',
                item:obj
            }
            socket.send(JSON.stringify(message))
        }
    )()
}

function genUserItems() {
    $$('cols').removeView('collection_multiview')
    let data = []
    data.push({id: 'book', rows: [offers('Books', 'books', '/collection/BOOK', false)]},
        {id: 'drink', rows: [offers('Drink', 'drinks', '/collection/DRINK', false)]},
        {id: 'game', rows: [offers('Games', 'games', '/collection/GAME', false)]},
        {id: 'other', rows: [offers('Others', 'others', '/collection/OTHER', false)]},
        {id: 'items', rows: item_offers},

        {id: 'user_book', rows: [offers('Books', 'user_books', '/user/collection/BOOK', false)]},
        {id: 'user_drink', rows: [offers('Drinks', 'user_drinks', '/user/collection/DRINK', false)]},
        {id: 'user_game', rows: [offers('Games', 'user_games', '/user/collection/GAME', false)]},
        {id: 'user_other', rows: [offers('Others', 'user_others', '/user/collection/OTHER', false)]},
        {id: 'user_items', rows: item_user_offers})
    $$('cols').addView({
        view: 'multiview',
        id: 'collection_multiview',
        animate: false,
        cells: data
    }, 1)
    $$('my_board').attachEvent("onBeforeEditorAction",
        function (action, editor, obj) {
            console.log(action)
            obj['action'] = action
            if (action === "save" && editor.getForm().validate()) {
                return true;
            } else if (action === "remove") {
                $$("my_board").remove(obj.id)
                $$("my_board").refresh()
                removeItem(obj)
                let message ={
                    action:'remove_item',
                    item:obj
                }
                socket.send(JSON.stringify(message))
                editor.hide()
            }
            return false;

        });
    $$("my_board").attachEvent("onListBeforeDrag", function(context,ev,list){
        return false
    });
    $$("users_board").attachEvent("onListBeforeDrag", function(context,ev,list){
        return false
    });

}
function genAdminItems(){
    $$('cols').removeView('collection_multiview')
    let data = []
    data.push({id: 'book', rows: [offers('Books', 'books', '/collection/BOOK', false)]},
        {id: 'drink', rows: [offers('Drink', 'drinks', '/collection/DRINK', false)]},
        {id: 'game', rows: [offers('Games', 'games', '/collection/GAME', false)]},
        {id: 'other', rows: [offers('Others', 'others', '/collection/OTHER', false)]},
        {id: 'items', rows: item_offers},

        {id: 'users', rows: users_in_table})
    $$('cols').addView({
        view: 'multiview',
        id: 'collection_multiview',
        animate: false,
        cells: data
    }, 1)

}

function delAdminItems() {
    $$('collection_multiview').removeView('users')
}
function delUserItems() {
    $$('collection_multiview').removeView('user_items')
}

exports.afterUserLogin = function () {
    $$('main_toolbar').removeView('toolbar_sing_in_up');
    $$('main_toolbar').removeView('toolbar_clear_selection');
    $$('main_toolbar').addView(toolbar_create_collection, -1)
    $$('main_toolbar').addView(clear.clear_selection, -1)
    $$('main_toolbar').addView(logout.logout, -1);
    disableRightSidebar();
    updateLeftSideUserBar();
    commentSetup()
    genUserItems()
}
exports.afterAdminLogin = function (){
    $$('main_toolbar').removeView('toolbar_sing_in_up');
    $$('main_toolbar').removeView('toolbar_clear_selection');
    $$('main_toolbar').addView(clear.clear_selection, -1)
    $$('main_toolbar').addView(logout.logout, -1);
    disableRightSidebar();
    updateLeftSideAdminBar();
    genAdminItems()
}

exports.afterAdminLogout = function (){
    $$('main_toolbar').removeView('logout_button');
    $$('main_toolbar').addView(login.sign_in_up, -1);
    localStorage.removeItem('jwt')
    rollbackLeftSideBar();
    $$('collection_multiview').setValue('book')
    delAdminItems()
}

exports.afterUserLogout = function () {
    $$('main_toolbar').removeView('logout_button');
    $$('main_toolbar').addView(login.sign_in_up, -1);
    localStorage.removeItem('jwt')
    rollbackLeftSideBar();
    $$('main_toolbar').removeView('toolbar_create_collection')
    $$('collection_multiview').setValue('book')
    $$('collection_multiview').removeView('user_items')
    delUserItems()
    create_collection_popup.hide();
    update_delete_collection_popup('').hide()

}
exports.enableRightSidebar = function () {
    //  $$('left_sidebar').toggle();
    $$('cols').addView(right_sidebar, -1)
    $$('cols').addView(sign_in_up_multiview, 1)
    $$('cols').removeView('collection_multiview')
}



exports.disableRightSidebar = disableRightSidebar
},{"../apis/item":33,"../apis/user":35,"../views/collection_multiview/admin_data":37,"../views/collection_multiview/collection_multiview":38,"../views/collection_multiview/data":39,"../views/left_sidebar/data":40,"../views/popup/create_collection":42,"../views/popup/update_delete_collection":43,"../views/right_sidebar/right_sidebar":45,"../views/toolbar/clear_selection":48,"../views/toolbar/create_collection":49,"../views/toolbar/logout_button":51,"../views/toolbar/sing_in_up":53,"../ws/ws":55}],31:[function(require,module,exports){
const fetch = require('node-fetch');
exports.isExist = async function isExist(data) {
    return await fetch('/collection/isExist', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.create = async function create(data) {
    return await fetch('/collection/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.update = async function update(data) {
    return await fetch('/collection/update', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.destroy = async function destroy(data) {
    return await fetch('/collection/destroy', {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
},{"node-fetch":29}],32:[function(require,module,exports){
exports.get = async function get(data) {
    return await fetch('/collectionType/'+data, {
        method: 'GET',
        headers:
            {
                'Content-Type': 'application/json'
            }
    })
}
},{}],33:[function(require,module,exports){
const fetch = require('node-fetch');
exports.create = async function create(data) {
    return await fetch('/item/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.update = async function update(data) {
    return await fetch('/item/update', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
exports.remove = async function remove(data) {
    return await fetch('/item/remove', {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
    })
}
},{"node-fetch":29}],34:[function(require,module,exports){
const fetch = require('node-fetch');
exports.create = async function create(data) {
    return await fetch('/itemTag/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}
},{"node-fetch":29}],35:[function(require,module,exports){
const fetch = require('node-fetch');
exports.isUserRegistered = async function isUserRegistered(data) {
    return await fetch('/user/isRegister', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}
exports.registerUser = async function registerUser(data) {
    return await fetch('/user/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}

exports.loginUser = async function loginUser(data) {
    return await fetch('/user/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
}

exports.getByToken = async function getByToken(data) {
    return await fetch('/user/getByToken', {
        method: 'POST',
        headers:
            {'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + data}
    })
}
},{"node-fetch":29}],36:[function(require,module,exports){
/*//const webix = require('./webix.trial.complete/webix/codebase/webix.js')
const kanban=require('./webix.trial.complete/kanban/codebase/kanban.js')*/
const {socket} = require('./ws/ws')
const {main_toolbar} = require('./views/toolbar/toolbar')
const {left_sidebar} = require('./views/left_sidebar/left_sidebar')
const {collection_multiview} = require('./views/collection_multiview/collection_multiview')
const action = require('./actions/actions')
const userApi = require('./apis/user')
const itemApi = require('./apis/item')
const itemTag = require('./apis/itemTag')

async function saveTag(item_id, tags) {
    for (let i = 0; i < tags.length; i++) {
        await itemTag.create({ItemId: item_id, TagId: tags[i]})
    }
}

function saveItem(obj, img_path) {
    let item = {
        Status: obj.status,
        Description: obj.text,
        PathToImg: img_path,
        CollectionId: obj.user_collection_list,
    };
    (
        async () => {
            if (obj['itemId']) {
                console.log('update')
                let userResult = await userApi.getByToken(localStorage.getItem('jwt'))
                if(userResult.status!==403){
                    let user = await userResult.json()
                    let owner = obj.user_id
                    obj.user_id=user.Id
                    await itemApi.update(obj)
                    obj.user_id=owner



                }

            } else {
                let result = await itemApi.create(item)
                if (result.status !== 500) {
                    let item = await result.json();
                    obj['itemId'] = item.Id
                    await saveTag(item.Id, obj.tags)
                }
                let message ={
                    action:'create_item',
                    item:obj
                }
                socket.send(JSON.stringify(message))
            }
            console.log(obj)
            obj.action = ''
        }
    )()
}


webix.type(webix.ui.tree,
    {
        baseType: "sideBar", // inherit everything else from sidebar type
        name: "customIcons",
        icon: function (obj, common) { // custom rendering pattern for icons
            if (obj.icon) {
                return `<span class='webix_icon webix_sidebar_icon ${obj.icon} '></span>`;
            }
            return "";
        }
    });

webix.type(webix.ui.kanbanlist,
    {
        name: "my_cards",
        icons: [
            {
                id: "comments",
                icon: "webix_kanban_icon kbi-comment",
                show: function (t, e) {
                    return !!e.config.comments
                },
                template: function (t) {
                    return t.comments && t.comments.length || ""
                }
            },
            /*{
                id: "my_editor_icon",
                icon: "webix_kanban_icon kbi-pencil",
                show: function (t, e) {
                    return e.config.editor
                }
            },*/
            {
               id:'my_likes', view: 'button', type: 'icon', icon: "mdi mdi-thumb-up",
                template: function (obj) {
                    if (!obj.likes) {
                        obj['likes'] = 0
                    }
                    return obj.likes
                },
                click: function (itemId) {
                    let data
                    var item = $$('my_board').getItem(itemId);
                    let result = webix.ajax().sync().headers({
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                    }).post('/like/isExist', {itemId: item.itemId})

                    if (result.status === 404) {
                        let result = webix.ajax().sync().headers({
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                        }).post('/like/create', {itemId: item.itemId})
                        data = result.responseText


                    }

                    if (result.status === 200) {
                        let result = webix.ajax().sync().headers({
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                        }).del('/like/delete', {itemId: item.itemId})
                        data = result.responseText


                    }

                    item = $$('my_board').getItem(itemId);
                    item.likes = data
                    $$('my_board').updateItem(itemId, item);
                }

            }
        ],
        templateAvatar: function (t, e, i) {
            var n = i._users, a = t.user_id && n.exists(t.user_id) ? n.getItem(t.user_id) : {};
            return a.image ? "<img class='webix_kanban_avatar' src='" + a.image + "' title='" + (a.value || "") + "'>" : "<span class='webix_icon webix_kanban_icon kbi-account' title='" + (a.value || "") + "'></span>"
        },
        templateBody: function (obj) {

            let {img_path} = require('./views/collection_multiview/data')
            console.log(img_path)
            img_path = img_path ? img_path : 'v1614426855/uncknown_awk8cb.jpg'
            obj['PathToImg'] = img_path
            if (obj['image'] && obj['PathToImg'] === 'v1614426855/uncknown_awk8cb.jpg') {
                img_path = obj['image']
            }
            console.log(obj)
            let html = ''
            html += `<div class='content'>`
            html += "<img class='image' width='80%' src='https://res.cloudinary.com/ivanverigo2000/image/upload/" + img_path + "'/>"
            html += `<div class="module">`
            html += "<p>" + obj.text + "</p>"
            html += ` </div>`
            html += `  </div>`
            if (obj.action !== 'click') {
                saveItem(obj, img_path)
            }


            return html;
        }
    },
);
webix.type(webix.ui.kanbanlist,
    {
        name: "users_cards",
        icons: [
            {
                id: "comments",
                icon: "webix_kanban_icon kbi-comment",
                show: function (t, e) {
                    return !!e.config.comments
                },
                template: function (t) {
                    return t.comments && t.comments.length || ""
                }
            },
            {
                id: 'likes', view: 'button', type: 'icon', icon: "mdi mdi-thumb-up",
                template: function (obj) {
                    if (!obj.likes) {
                        obj['likes'] = 0
                    }
                    return obj.likes
                },
                click: function (itemId) {
                    let data
                    var item = $$('users_board').getItem(itemId);
                    let result = webix.ajax().sync().headers({
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                    }).post('/like/isExist', {itemId: item.itemId})
                    if (result.status !== 403) {

                        if (result.status === 404) {
                            let result = webix.ajax().sync().headers({
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                            }).post('/like/create', {itemId: item.itemId})

                            if (result.status !== 403) {
                                data = result.responseText
                                item = $$('users_board').getItem(itemId);
                                item.likes = data
                                $$('users_board').updateItem(itemId, item);

                            }
                        }

                        if (result.status === 200) {
                            let result = webix.ajax().sync().headers({
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                            }).del('/like/delete', {itemId: item.itemId})

                            if (result.status !== 403) {
                                data = result.responseText
                                item = $$('users_board').getItem(itemId);
                                item.likes = data
                                $$('users_board').updateItem(itemId, item);

                            }
                        }

                    }
                }

            },

        ],
        templateAvatar: function (t, e, i) {
            var n = i._users, a = t.user_id && n.exists(t.user_id) ? n.getItem(t.user_id) : {};
            return a.image ? "<img class='webix_kanban_avatar' src='" + a.image + "' title='" + (a.value || "") + "'>" : "<span class='webix_icon webix_kanban_icon kbi-account' title='" + (a.value || "") + "'></span>"
        },
        templateBody: function (obj) {

            let {img_path} = require('./views/collection_multiview/data')
            console.log(img_path)
            img_path = img_path ? img_path : 'v1614426855/uncknown_awk8cb.jpg'
            obj['PathToImg'] = img_path
            if (obj['image'] && obj['PathToImg'] === 'v1614426855/uncknown_awk8cb.jpg') {
                img_path = obj['image']
            }
            console.log(obj)
            let html = ''
            html += `<div class='content'>`
            html += "<img class='image' width='80%' src='https://res.cloudinary.com/ivanverigo2000/image/upload/" + img_path + "'/>"
            html += `<div class="module">`
            html += "<p>" + obj.text + "</p>"
            html += ` </div>`
            html += `  </div>`
            if (obj.action !== 'click') {
                saveItem(obj, img_path)
            }


            return html;
        }
    }
)


webix.ready(function () {
    if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();

    //  console.log($$('combo_user_id'))
    webix.ui({
        rows: [
            main_toolbar,
            {
                id: 'cols',
                cols: [
                    left_sidebar,
                    collection_multiview
                ]
            }
        ]
    });


    if (localStorage.getItem('jwt') !== null) {
        (
            async () => {
                let ADMIN = 1;
                let REGISTERED = 2;
                let result = await userApi.getByToken(localStorage.getItem('jwt'))
                if (result.status !== 403) {
                    let user = await result.json();
                    if (user.UserRoleId === ADMIN) {
                        action.afterAdminLogin();
                    }
                    if (user.UserRoleId === REGISTERED) {
                        action.afterUserLogin();
                    }
                }else{
                    localStorage.removeItem('jwt')
                }
            }
        )()
    }else{
        action.afterUserLogout();
    }


})

},{"./actions/actions":30,"./apis/item":33,"./apis/itemTag":34,"./apis/user":35,"./views/collection_multiview/collection_multiview":38,"./views/collection_multiview/data":39,"./views/left_sidebar/left_sidebar":41,"./views/toolbar/toolbar":54,"./ws/ws":55}],37:[function(require,module,exports){
const {socket} = require('../../ws/ws')
var users_in_table = [
    {
        cols: [
            {
                view: 'button', label: 'Delete', type: 'iconButton', icon: 'trash',
                click: function () {
                    var sel = $$('admin_datatable').getSelectedId();
                    if (sel) {
                        let result = webix.ajax().sync().headers({
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                        }).del('/user/admin/' + sel.id);
                        console.log(result)
                        if (result.status === 200) {
                            $$('admin_datatable').remove(sel.row)
                            let message = {
                                action: 'delete_user',
                                userId: sel.id
                            }
                            socket.send(JSON.stringify(message))
                        }

                    } else return false
                }
            }
        ]
    },
    {
        view: "datatable",
        id: "admin_datatable",

        url: function () {
            $$('admin_datatable').load(function () {
                let result = webix.ajax().headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                }).get('/user/admin/all');
                if (result.status !== 404) {
                    console.log('result')
                    result.then(r => {
                        console.log(r)
                    })

                    console.log('result end')
                    return result;
                } else return ''
            });

        },
        resizeColumn: true,
        columns: [
            {id: 'id', header: [{text: '<span class="mdi mdi-filter"></span>'}], width: 50, sort: 'int'},
            {id: 'login', header: [{text: 'Login'}, {content: 'textFilter'}], width: 200},
            {
                id: 'collections', header: [{text: 'Collection count'}], width: 200, sort: 'int',
                template: function (obj) {
                    return obj['collections'];
                }
            },
            {
                id: 'items', header: [{text: 'Collection items count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['items'];
                }
            },
            {
                id: 'tags', header: [{text: 'Used tags count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['tags'];
                }
            },
            {
                id: 'comments', header: [{text: 'Item comments count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['comments'];
                }
            },
            {
                id: 'likes', header: [{text: 'Item likes count'}], width: 150, sort: 'int',
                template: function (obj) {
                    return obj['likes'];
                }
            },
            {header: [{text: 'Actions'}], template: ' {common.trashIcon}', fillspace: true}
        ],
        scroll: false,
        type: {
            trashIcon: '<span class="mdi mdi-delete"></span>',
            editIcon: '<span class="webix_kanban_icon kbi-pencil"></span>'
        },
        pager: 'pager',
        select: true,
        editable: true,
        //borderless:true,
        //yCount:13
        //autoConfig: true
    },
    {
        view: 'pager',
        id: 'pager',
        size: 13,
        group: 10,
        template: `{common.first()} {common.prev()} {common.pages()}
            {common.next()} {common.last()}`
    }
]

exports.users_in_table = users_in_table

},{"../../ws/ws":55}],38:[function(require,module,exports){
const {collection_multiview_data} = require('./data')

var collection_multiview = {
    view: 'multiview',
    id: 'collection_multiview',
    animate: false,
    cells: collection_multiview_data
}

exports.collection_multiview=collection_multiview
},{"./data":39}],39:[function(require,module,exports){
//let webix = require('../../webix.trial.complete/webix/codebase/webix.js')
let {update_delete_collection_popup} = require('../popup/update_delete_collection')
let user_api = require('../../apis/user')
const axios = require('axios')
var img_path;

function collectionData(header, id, data, isCollapsed) {
    return {
        header: header,
        collapsed: isCollapsed,
        body: {
            rows: [
                {
                    view: 'dataview',
                    id: id,
                    select: true,
                    url: function () {
                        $$(id).load(function () {
                            let result = webix.ajax().headers({
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt') // any custom headers can be defined in such a way
                            }).get(data);
                            if (result.status !== 404) {
                                return result;
                            } else return ''
                        });

                    },
                    css: 'collection_box',
                    item: {
                        height: 340,
                        width: 400
                    },
                    on: {
                        onItemDblClick: function (id, e, node) {
                            {
                                (
                                    async () => {
                                        let response = await user_api.getByToken(localStorage.getItem('jwt'))
                                        if (response.status !== 403) {
                                            let item = this.getItem(id)
                                            update_delete_collection_popup(item).show()
                                        }
                                    }
                                )()
                            }
                        }
                    },
                    template:
                        `<div class='content'>

<img src="https://res.cloudinary.com/ivanverigo2000/image/upload/#PathToImg#" height="80%" width="100%" alt="No img"/>
<h1>#Name#</h1>
<div class="module">
  <p>#Description#</p>
</div>
</div>
`
                }
            ]
        }
    };
}


var offers = (header, id, data, isCollapsed) => {
    return {
        view: 'accordion',
        type: 'space',
        rows: [
            collectionData(header, id, data, isCollapsed)
        ]
    };
}



var item_user_offers = [
    {
        view: "button",
        css: "webix_primary",
        label: "Add new card",
        click: () => {
            $$("my_board").showEditor();
        }
    },
    {
        view: "scrollview",
        scroll: "x",
        id: 'scrollview',
        body:
            {
                view: "kanban",
                id: 'my_board',

                cols: [
                    {
                        header: "Book",
                        body: {view: "kanbanlist", status: "books", type: "my_cards"}
                    },
                    {
                        header: "Drink",
                        body: {view: "kanbanlist", status: "drinks", type: "my_cards"}
                    },
                    {
                        header: "Game",
                        body: {view: "kanbanlist", status: "games", type: "my_cards"}
                    },
                    {
                        header: "Other",
                        body: {view: "kanbanlist", status: "others", type: "my_cards"}
                    }
                ],
                editor: {
                    id: 'my_editor',
                    elements: [
                        {
                            view: "textarea",
                            name: "text",
                            height: 90,
                            label: "Description",
                            required: true,
                        },
                        {
                            view: "multicombo",
                            name: "tags",
                            label: "Tags",
                            options: '/tag/'
                        },
                        {
                            cols: [
                                {
                                    name: "user_id",
                                    id: 'combo_user_id',
                                    view: "combo",
                                    options: '/user/' + localStorage.getItem('jwt'),
                                    label: "Assign to",
                                    required: true,
                                },
                                {
                                    view: "richselect",
                                    id: 'collection_type_list',
                                    name: "$list",
                                    label: "Collection type",
                                    required: true,
                                    options: [
                                        {id: '0', value: "books"},
                                        {id: '1', value: "drinks"},
                                        {id: '2', value: "games"},
                                        {id: '3', value: "others"}
                                    ],
                                    on: {
                                        async onChange(current, prev) {
                                            $$('my_editor').disable();
                                            if ($$('user_collection_list')) {
                                                this.getParentView().removeView('user_collection_list');
                                            }
                                            this.getParentView().addView(
                                                {
                                                    view: "richselect",
                                                    id: "user_collection_list",
                                                    name: "user_collection_list",
                                                    label: "Collection",
                                                    labelPosition: "top",
                                                    required: true,
                                                    options: '/collection/' + $$('collection_type_list').getText() + '/' + localStorage.getItem('jwt')
                                                })
                                            $$('my_editor').enable();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            view: "uploader",
                            value: "Upload or drop file here",
                            id: 'item_loader',
                            name: "files",
                            link: "item_list",
                            upload: "/upload",
                            multiple: false,
                            accept: "image/png, image/jpg, image/jpeg",
                            on: {
                                async onBeforeFileAdd(file) {

                                    let cloudnary_url = 'https://api.cloudinary.com/v1_1/ivanverigo2000/upload'
                                    let cloudnary_upload_preset = 'aohz2pju'
                                    const selectedFile = file.file;

                                    var form_data = new FormData();
                                    form_data.append('file', selectedFile);
                                    form_data.append('upload_preset', cloudnary_upload_preset);

                                    axios({
                                        url: cloudnary_url,
                                        method: 'POST',
                                        header: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        data: form_data
                                    }).then(function (res) {
                                        let data1 = res.data.secure_url.split('/')[6];
                                        let data2 = res.data.secure_url.split('/')[7];
                                        let slash = '/';
                                        img_path = data1 + slash + data2;
                                        exports.img_path=img_path
                                        img_path=''
                                        alert('load done')
                                    })
                                }
                            }
                        },
                        {
                            view: "list",
                            id: "item_list",
                            type: "uploader",
                            autoheight: true,
                            borderless: true
                        },
                    ],
                    rules: {
                        text: webix.rules.isNotEmpty,
                        user_id: webix.rules.isNotEmpty,
                        user_collection_list: webix.rules.isNotEmpty,
                        $list: webix.rules.isNotEmpty,
                    }
                },
                url: function (){
                    $$('my_board').load(function () {
                        let result = webix.ajax().get('/item/all/'+localStorage.getItem('jwt'));
                        if (result.status !== 404) {
                            result.then(r=>{
                                console.log(r)
                            })
                            return result;
                        } else return ''
                    });
                },
                users: '/user/fullImgPath/' + localStorage.getItem('jwt'),
                tags: '/tag/',
                comments: {id: 'item_comment', activeUser: -1},
            }
    }
];
var item_offers = [
    {
        view: "scrollview",
        scroll: "x",
        id: 'users_scrollview',
        body:
            {
                view: "kanban",
                id: 'users_board',
                cols: [
                    {
                        header: "Book",
                        body: {view: "kanbanlist", status: "books", type: "users_cards"}
                    },
                    {
                        header: "Drink",
                        body: {view: "kanbanlist", status: "drinks", type: "users_cards"}
                    },
                    {
                        header: "Game",
                        body: {view: "kanbanlist", status: "games", type: "users_cards"}
                    },
                    {
                        header: "Other",
                        body: {view: "kanbanlist", status: "others", type: "users_cards"}
                    }
                ],
                url: function (){
                    $$('users_board').load(function () {
                        let result = webix.ajax().get('/item/allForUsers');
                        if (result.status !== 404) {
                            result.then(r=>{
                                console.log(r)
                            })
                            return result;
                        } else return ''
                    });
                },
                users: '/user/all',
                tags: '/tag/',
                comments: {id: 'item_comment', activeUser: -1},
            }
    }
];
var collection_multiview_data = [
    {id: 'book', rows: [offers('Books', 'books', '/collection/BOOK', false)]},
    {id: 'drink', rows: [offers('Drink', 'drinks', '/collection/DRINK', false)]},
    {id: 'game', rows: [offers('Games', 'games', '/collection/GAME', false)]},
    {id: 'other', rows: [offers('Others', 'others', '/collection/OTHER', false)]},
    {id: 'items', rows: item_offers},

    {id: 'user_book', rows: [offers('Books', 'user_books', '/user/collection/BOOK', false)]},
    {id: 'user_drink', rows: [offers('Drinks', 'user_drinks', '/user/collection/DRINK', false)]},
    {id: 'user_game', rows: [offers('Games', 'user_games', '/user/collection/GAME', false)]},
    {id: 'user_other', rows: [offers('Others', 'user_others', '/user/collection/OTHER', false)]},
    {id: 'user_items', rows: item_user_offers},
];


exports.collection_multiview_data = collection_multiview_data
exports.item_user_offers = item_user_offers
exports.item_offers = item_offers
exports.offers = offers



},{"../../apis/user":35,"../popup/update_delete_collection":43,"axios":2}],40:[function(require,module,exports){
var left_sidebar_data = [
    {
        id: "home", icon: "mdi mdi-home", value: "Home", data: [
            {
                id: 'collections', icon: 'mdi mdi-rhombus-split', value: 'Collections', data: [
                    { id: 'book', icon: 'mdi mdi-book', value: 'Book' },
                    { id: 'drink', icon: 'mdi mdi-bottle-wine', value: 'Drink' },
                    { id: 'game', icon: 'mdi mdi-controller-classic', value: 'Game' },
                    { id: 'other', icon: 'mdi mdi-skull-crossbones', value: 'Other' }
                ]
            },
            {
                id: 'items', icon: 'mdi mdi-sitemap', value: 'Items'
            }
        ]

    }
];
exports.left_sidebar_data=left_sidebar_data
},{}],41:[function(require,module,exports){
const {left_sidebar_data} = require('./data')
const {collection_multiview} = require('../collection_multiview/collection_multiview')

var left_sidebar = {
    view: "sidebar",
    id: 'left_sidebar',
    scroll:'y',
    //type: "customIcons",
    multipleOpen: true,
    data: left_sidebar_data,
      on: {
          onAfterSelect: function (id) {
              if ($$('collection_multiview')) {
                  $$('collection_multiview').setValue(id);
            } else {
                  $$('cols').removeView('right_sidebar');
                  $$('cols').removeView('sign_in_up_multiview');
                  $$('cols').addView(collection_multiview, 1);
                  $$('collection_multiview').setValue(id);
              }
          }
      },
      ready: function () {
          var firstItem = this.getFirstId();
          this.select(firstItem);
      }
}
exports.left_sidebar=left_sidebar
},{"../collection_multiview/collection_multiview":38,"./data":40}],42:[function(require,module,exports){
const axios = require('axios')
//const webix = require('../../webix.trial.complete/webix/codebase/webix.js')
const collection_api = require('../../apis/collection')
const user_api = require('../../apis/user')
const collectionType_api = require('../../apis/collectionType')
const {socket} = require('../../ws/ws')
var img_path;

const create_collection_popup = webix.ui({
    view: "popup",
    id: "create_collection_popup",
    body:
        {
            view: "form",
            id: 'create_collection_form',
            scroll: 'y',
            minHeight: 450,
            // height: 500,
            // css:'form',

            elements: [
                {
                    view: "text", id: 'collection_name', label: "Name", name: 'collection_name', labelWidth: 100, required: true
                },

                {
                    view: "textarea", id: 'collection_desc', label: "Description", name: 'collection_desc', labelWidth: 100, required: true
                },
                {
                    view: "select", id: 'collection_type', label: "Type", value: 'BOOK', options: [
                        { value: "BOOK" },
                        { value: "DRINK" },
                        { value: "GAME" },
                        { value: "OTHER" }
                    ]
                },
                { template: "Fields", type: "section" },

                {
                    view: "uploader",
                    value: "Upload or drop file here",
                    id: 'collection_loader',
                    name: "files",
                    link: "collection_list",
                    upload: "/upload",
                    multiple: false,
                    accept: "image/png, image/jpg, image/jpeg",
                    on: {
                        async onBeforeFileAdd(file) {

                            let cloudnary_url = 'https://api.cloudinary.com/v1_1/ivanverigo2000/upload'
                            let cloudnary_upload_preset = 'aohz2pju'
                            const selectedFile = file.file;

                            var form_data = new FormData();
                            form_data.append('file', selectedFile);
                            form_data.append('upload_preset', cloudnary_upload_preset);

                            axios({
                                url: cloudnary_url,
                                method: 'POST',
                                header: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                data: form_data
                            }).then(function (res) {
                                let data1 = res.data.secure_url.split('/')[6];
                                let data2 = res.data.secure_url.split('/')[7];
                                let slash = '/';
                                img_path = data1 + slash + data2;
                                console.log(img_path)
                            })
                        }
                    }
                },
                {
                    view: "list",
                    id: "collection_list",
                    type: "uploader",
                    autoheight: true,
                    borderless: true
                },
                {
                    view: 'button', type: 'button', value: 'Create', css: "webix_primary",
                    click: async function () {
                        if (this.getParentView().validate()) {
                            let collection_name = $$('collection_name').getValue();
                            let res = await collection_api.isExist({ name: collection_name });
                            console.log(res)
                            if (res.status===404) {
                                let collection_desc = $$('collection_desc').getValue();
                                let collection_type = $$('collection_type').getValue();

                                let image = img_path ? img_path : 'v1614426855/uncknown_awk8cb.jpg';

                                let user = await user_api.getByToken(localStorage.getItem('jwt'));
                                if(user.status!==403) {
                                    let json_user = await user.json();
                                    let user_id = json_user['Id'];
                                    let collection_type_resp =await collectionType_api.get(collection_type)
                                    let collection_type_json = await collection_type_resp.json();


                                    let collection = {
                                        Name: collection_name,
                                        Description: collection_desc,
                                        PathToImg: image,
                                        UserId: user_id,
                                        CollectionTypeId:collection_type_json['Id']
                                    }
                                    console.log(collection);
                                    let response = await collection_api.create(collection);
                                    if(response!==500){
                                        let collection = await response.json();
                                        let message ={
                                            action:'create_collection',
                                            collection:collection
                                        }
                                        socket.send(JSON.stringify(message))
                                    }

                                    $$('create_collection_popup').hide()
                                }
                            } else {
                                $$('collection_error').setValue('This collection name already in use');
                            }
                        }
                    }
                },
                {
                    view: 'label', id: 'collection_error', label: '', align: 'center', css: "login_error_label"
                }
            ],
            rules: {
                'collection_name': function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                },
                'collection_desc': function (value) {

                    if (value) {
                        return true;
                    }
                    return false;
                }
            }
        },

    modal: false,
    resize: true
});
exports.create_collection_popup=create_collection_popup
},{"../../apis/collection":31,"../../apis/collectionType":32,"../../apis/user":35,"../../ws/ws":55,"axios":2}],43:[function(require,module,exports){
const axios = require('axios')
//const webix = require('../../webix.trial.complete/webix/codebase/webix.js')
const collection_api = require('../../apis/collection')
const user_api = require('../../apis/user')
const collectionType_api = require('../../apis/collectionType')
const {socket} = require('../../ws/ws')
let UPDATE_COLLECTION = 'update_collection'
let DELETE_COLLECTION = 'delete_collection'
var img_path;

function updateDelete(item) {
    img_path = item.PathToImg
    return webix.ui({
        view: "popup",
        id: "update_delete_collection_popup",
        body:
            {
                view: "form",
                id: 'update_delete_collection_form',
                scroll: 'y',
                minHeight: 450,
                // height: 500,
                // css:'form',

                elements: [
                    {
                        view: "text",
                        id: 'change_collection_name',
                        label: "Name",
                        name: 'change_collection_name',
                        value: item.Name,
                        labelWidth: 100,
                        required: true
                    },
                    {
                        view: "textarea",
                        id: 'change_collection_desc',
                        label: "Description",
                        name: 'change_collection_desc',
                        value: item.Description,
                        labelWidth: 100,
                        required: true
                    },

                    {template: "Fields", type: "section"},
                    {
                        view: "uploader",
                        value: "Upload or drop file here",
                        id: 'change_collection_loader',
                        name: "files",
                        link: "change_collection_list",
                        upload: "/upload",
                        multiple: false,
                        accept: "image/png, image/jpg, image/jpeg",
                        on: {
                            async onBeforeFileAdd(file) {

                                let cloudnary_url = 'https://api.cloudinary.com/v1_1/ivanverigo2000/upload'
                                let cloudnary_upload_preset = 'aohz2pju'
                                const selectedFile = file.file;

                                var form_data = new FormData();
                                form_data.append('file', selectedFile);
                                form_data.append('upload_preset', cloudnary_upload_preset);

                                axios({
                                    url: cloudnary_url,
                                    method: 'POST',
                                    header: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    data: form_data
                                }).then(function (res) {
                                    let data1 = res.data.secure_url.split('/')[6];
                                    let data2 = res.data.secure_url.split('/')[7];
                                    let slash = '/';
                                    img_path = data1 + slash + data2;
                                })
                            }
                        }
                    },
                    {
                        view: "list",
                        id: "change_collection_list",
                        type: "uploader",
                        autoheight: true,
                        borderless: true
                    },

                    {
                        view: 'button', type: 'button', value: 'Update', css: "webix_primary",
                        click: async function () {
                            if (this.getParentView().validate()) {
                                let collection_name = $$('change_collection_name').getValue();
                                let res = await collection_api.isExist({name: collection_name});
                                if (res.status === 404) {
                                    let collection_desc = $$('change_collection_desc').getValue();

                                    let user = await user_api.getByToken(localStorage.getItem('jwt'));
                                    if (user.status !== 403) {
                                        let json_user = await user.json();
                                        let user_id = json_user['Id'];

                                        let collection = {
                                            Id: item.Id,
                                            Name: collection_name,
                                            Description: collection_desc,
                                            PathToImg: img_path,
                                            UserId: user_id,
                                        }
                                        if (item.UserId === collection.UserId) {
                                            let response = await collection_api.update(collection);
                                            if (response !== 500) {
                                                let collection = await response.json();
                                                let message = {
                                                    action: UPDATE_COLLECTION,
                                                    collection: collection
                                                }
                                                socket.send(JSON.stringify(message))
                                            }
                                            $$('update_delete_collection_popup').hide()
                                        } else {
                                            $$('collection_error').setValue('You are not owner of this collection');
                                        }
                                    }
                                } else {
                                    $$('collection_error').setValue('This collection name already in use');
                                }
                            }
                        }
                    },
                    {
                        view: 'button', type: 'button', value: 'Delete', css: "webix_danger",
                        click: async function () {
                            let user = await user_api.getByToken(localStorage.getItem('jwt'));
                            if (user.status !== 403) {
                                let json_user = await user.json();
                                let user_id = json_user['Id'];
                                if (item.UserId === user_id) {
                                    let response = await collection_api.destroy({Id: item.Id})
                                    if (response.status === 200) {
                                        let message = {
                                            action: DELETE_COLLECTION,
                                            collection: item
                                        }
                                        $$('my_board').refresh()
                                        socket.send(JSON.stringify(message))
                                    }
                                    $$('update_delete_collection_popup').hide()
                                }else {
                                    $$('collection_error').setValue('You are not owner of this collection');
                                }

                            }
                        }
                    },
                    {
                        view: 'label', id: 'collection_error', label: '', align: 'center', css: "login_error_label"
                    }
                ],
                rules: {
                    'change_collection_name': function (value) {
                        if (value) {
                            return true;
                        }
                        return false;
                    },
                    'change_collection_desc': function (value) {

                        if (value) {
                            return true;
                        }
                        return false;
                    }
                }
            },

        modal: false,
        resize: true
    });
}

exports.update_delete_collection_popup = updateDelete
},{"../../apis/collection":31,"../../apis/collectionType":32,"../../apis/user":35,"../../ws/ws":55,"axios":2}],44:[function(require,module,exports){
var {sign_in_form} = require('./sign_in_form')
var {sign_up_form} = require('./sign_up_form')
var right_sidebar_data = [
    { id: 'sing_in', icon: 'mdi mdi-login', value: 'Sign In' },
    { id: 'sing_up', icon: 'mdi mdi-draw', value: 'Sign Up' }
];




var sing_in_up_multiview_data = [
    { id: 'sing_in', rows: [sign_in_form] },
    { id: 'sing_up', rows: [sign_up_form] },
];



exports.right_sidebar_data=right_sidebar_data
exports.sing_in_up_multiview_data=sing_in_up_multiview_data
},{"./sign_in_form":46,"./sign_up_form":47}],45:[function(require,module,exports){
const {right_sidebar_data , sing_in_up_multiview_data} = require('./data')
var right_sidebar = {
    view: "sidebar",
    id: 'right_sidebar',
    type: "customIcons",
    position: "right",
    data: right_sidebar_data,
    on: {
        onAfterSelect: function (id) {
            if ($$('sign_in_up_multiview')) {
                $$('sign_in_up_multiview').setValue(id);
            } else {
                $$('cols').removeView('collection_multiview');
                $$('cols').addView(sign_in_up_multiview, 1);
                $$('sign_in_up_multiview').setValue(id);
            }
        }
    }
}

var sign_in_up_multiview = {
    view: 'multiview',
    id: 'sign_in_up_multiview',
    animate: false,
    cells: sing_in_up_multiview_data
}
exports.right_sidebar=right_sidebar
exports.sign_in_up_multiview=sign_in_up_multiview
},{"./data":44}],46:[function(require,module,exports){
const api = require('../../apis/user')
const action = require('../../actions/actions')
var sign_in_form = ({
    view: "form",
    //  height: 500,
    scroll: 'y',
    elements: [
        {
            view: "text", id: 'user_login', name: 'login', label: "Login", required: true
            , invalidMessage: "Incorrect login type"
        },
        {
            view: "text", id: 'user_password', name: 'password', type: "password", label: "Password", required: true
            , invalidMessage: "Incorrect password type"
        },
        {
            view: "button", value: "Login", css: "webix_primary",
            click:  function () {
                if (this.getParentView().validate()) {
                    $$('log_error').setValue('');
                    let login = $$('user_login').getValue();
                    let password = $$('user_password').getValue();
                    (
                        async ()=> {
                            let user = {login: login, password: password};
                            let jwt = await api.loginUser(user);
                            if (jwt.status === 200) {
                                let jwtData = await jwt.json();
                                console.log('set token')
                                location.reload()
                                localStorage.setItem('jwt', jwtData)
                                action.afterUserLogin()
                            } else {
                                $$('log_error').setValue('Incorrect login or password');
                            }
                        }
                )()
                }

            }
        },
        {
            view: 'label', id: 'log_error', label: '', align: 'center', css: "login_error_label"
        }
    ],
    rules: {
        'login': function (value) {
            if (value) {
                return value.match('^([a-zA-Z0-9а-яА-Я]+){4,}$')
            }
            return false
        },
        'password': function (value) {
            if (value) {
                return value.match('^([a-zA-Z0-9а-яА-Я]+){4,}$')
            }
            return false
        },
    }
});
exports.sign_in_form=sign_in_form
},{"../../actions/actions":30,"../../apis/user":35}],47:[function(require,module,exports){
const api = require('../../apis/user')
const axios = require('axios')
var img_path;
var sign_up_form = ({
    view: "form",
    // height: 500,
    // css:'form',
    scroll: 'y',
    elements: [
        {
            view: "text", id: 'register_login', label: "Login", name: 'login', labelWidth: 150, required: true
            , invalidMessage: "Incorrect login type"
        },
        {
            view: "text", id: 'register_password', type: "Password", name: 'password', label: "Password", labelWidth: 150, required: true
            , invalidMessage: "Incorrect password type"
        },
        {
            view: "text", id: 'register_confirm_password', type: "Password", name: 'confirm_password', label: "Confirm password", labelWidth: 150, required: true
            , invalidMessage: "Passwords don't match"
        },
        {
            view: "uploader",
            value: "Upload or drop file here",
            id: 'loader',
            name: "files",
            link: "my_list",
            upload: "/upload",
            multiple: false,
            accept: "image/png, image/jpg, image/jpeg",
            on: {
                async onBeforeFileAdd(file) {

                    let cloudnary_url = 'https://api.cloudinary.com/v1_1/ivanverigo2000/upload'
                    let cloudnary_upload_preset = 'aohz2pju'
                    const selectedFile = file.file;

                    var form_data = new FormData();
                    form_data.append('file', selectedFile);
                    form_data.append('upload_preset', cloudnary_upload_preset);

                    axios({
                        url: cloudnary_url,
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: form_data
                    }).then(function (res) {
                        let data1 = res.data.secure_url.split('/')[6];
                        let data2 = res.data.secure_url.split('/')[7];
                        let slash = '/';
                        img_path = data1 + slash + data2;
                    })
                }
            }
        },
        {
            view: "list",
            id: "my_list",
            type: "uploader",
            autoheight: true,
            borderless: true
        },
        {
            view: "button", value: "Register", css: "webix_primary",
            click: async function () {
                $$('reg_error').setValue('');
                if (this.getParentView().validate()) {
                    let login = $$('register_login').getValue();
                    let password = $$('register_password').getValue();
                    if (!img_path) {
                        img_path = 'v1614426855/uncknown_awk8cb.jpg'
                    }
                    let user = { login: login, password: password, pathToImg: img_path };
                    let user_login = { login: login }
                    let is_registered_json = await api.isUserRegistered(user_login);
                    if (is_registered_json.status!==200) {
                        $$('reg_error').setValue('This user has already exist');
                    } else {
                        console.log(user)
                        await api.registerUser(user);
                        $$('sign_in_up_multiview').setValue('sing_in')
                    }
                }

            }
        },
        {
            view: 'label', id: 'reg_error', label: '', align: 'center', css: "registration_error_label"
        }

    ],
    rules: {
        'login': function (value) {
            if (value) {
                return value.match('^([a-zA-Z0-9а-яА-Я]+){4,}$')
            }
            return false
        },
        'password': function (value) {
            if (value) {
                return value.match('^([a-zA-Z0-9а-яА-Я]+){4,}$')
            }
            return false
        },
        'confirm_password': function (value) {
            return value === $$('register_password').getValue()
        }
    },
});
exports.sign_up_form=sign_up_form;
},{"../../apis/user":35,"axios":2}],48:[function(require,module,exports){
const USERS= 'user_'
const clear_selection = {
    view: 'button',
    id: 'toolbar_clear_selection',
    type: 'icon',
    icon: 'mdi mdi-autorenew',
    width: 40,
    align: 'left',
    click: function () {
       /* $$('books').unselectAll();
        $$('drinks').unselectAll();
        $$('games').unselectAll();
        $$('others').unselectAll();

        $$(USERS+'books').unselectAll();
        $$(USERS+'drinks').unselectAll();
        $$(USERS+'games').unselectAll();
        $$(USERS+'others').unselectAll();*/

       location.reload()
    }
}
exports.clear_selection=clear_selection
},{}],49:[function(require,module,exports){
const {create_collection_popup} = require('../popup/create_collection')
const toolbar_create_collection = {
    view: 'button',
    id: 'toolbar_create_collection',
    label: 'Create',
    type: 'icon',
    icon: 'mdi mdi-mdi mdi-rhombus-split',
    width: 100,
   // align: 'right',
    click: function () {
        create_collection_popup.show();
    }
}
exports.toolbar_create_collection=toolbar_create_collection
},{"../popup/create_collection":42}],50:[function(require,module,exports){
var label =  {
    view: 'label',
    label: 'Collection management'
}
exports.label = label
},{}],51:[function(require,module,exports){
const action = require('../../actions/actions')
const logout={
    id:'logout_button',
    view:'button',
    type: 'icon',
    icon: 'mdi mdi-account-arrow-right',
    width: 40,
   // label: 'Logout',
    align: 'left',
    click: function () {
        action.afterUserLogout()
    }
}
exports.logout=logout;
},{"../../actions/actions":30}],52:[function(require,module,exports){
var toolbar_menu={
    id: 'toolbar_menu',
    view: 'button',
    type: 'icon',
    icon: 'mdi mdi-menu',
    width: 50,
    align: 'left',
    click: function () {
        $$('left_sidebar').toggle();
    }
}
exports.toolbar_menu=toolbar_menu
},{}],53:[function(require,module,exports){
const action = require('../../actions/actions')

var sign_in_up = {
    view: 'button',
    id: 'toolbar_sing_in_up',
    type: 'icon',
    icon: 'mdi mdi-account-arrow-left',
    align: 'left',
    width: 40,
    click: function () {
        if ($$('right_sidebar')) {
            action.disableRightSidebar()
        } else {
            action.enableRightSidebar()
        }
    }
}
exports.sign_in_up=sign_in_up
},{"../../actions/actions":30}],54:[function(require,module,exports){
const {label} = require('./label')
const {toolbar_menu} = require('./menu')
const {sign_in_up} = require('./sing_in_up')
const {clear_selection} = require('./clear_selection')

var main_toolbar = {
    id: 'main_toolbar',
    view: 'toolbar',
    elements: [
        toolbar_menu,
        label,
        clear_selection,
        sign_in_up
    ]
}
exports.main_toolbar = main_toolbar

},{"./clear_selection":48,"./label":50,"./menu":52,"./sing_in_up":53}],55:[function(require,module,exports){
let user_api = require('../apis/user')
let socket = new WebSocket('ws://localhost:5000/broadcast');


let CREATE_COLLECTION = 'create_collection'
let UPDATE_COLLECTION = 'update_collection'
let DELETE_COLLECTION = 'delete_collection'
let USER_COLLECTION = 'user_'

let CREATE_ITEM = 'create_item'
let DELETE_ITEM = 'delete_item'

let DELETE_USER = 'delete_user'

let collection_map = new Map()
collection_map.set(1, "books");
collection_map.set(2, "drinks");
collection_map.set(3, "games");
collection_map.set(4, "others");


socket.onmessage = (msg) => {
    msg = JSON.parse(msg.data)
    let collection = msg.collection ? msg.collection : '';
    let item = msg.item ? msg.item : ''
    let userId = msg.userId ? msg.userId : -1
    switch (msg.action) {
        case CREATE_COLLECTION: {
            $$(collection_map.get(collection.CollectionTypeId)).add(collection, 0);
            (
                async () => {
                    let user_response = await user_api.getByToken(localStorage.getItem('jwt'))
                    if (user_response.status !== 403) {
                        let user = await user_response.json();
                        if (user.Id === collection.UserId) {
                            $$(USER_COLLECTION + collection_map.get(collection.CollectionTypeId)).add(collection, 0);
                        }
                    }
                }
            )()
            break
        }
        case UPDATE_COLLECTION: {

            let data = $$(USER_COLLECTION + collection_map.get(collection.CollectionTypeId))
            let elements = data.serialize();

            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.updateItem(data.getIdByIndex(i), collection);
                }
            }

            data = $$(collection_map.get(collection.CollectionTypeId))
            elements = data.serialize();
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.updateItem(data.getIdByIndex(i), collection);
                }
            }
            break
        }
        case DELETE_COLLECTION: {

            let data = $$(USER_COLLECTION + collection_map.get(collection.CollectionTypeId))
            let elements = data.serialize();

            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.remove(data.getIdByIndex(i));
                }
            }

            data = $$(collection_map.get(collection.CollectionTypeId))
            elements = data.serialize();
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Id === collection.Id) {
                    data.remove(data.getIdByIndex(i));
                }
            }
            break
        }
        case CREATE_ITEM : {
            console.log('CREATE_ITEM')
            $$('users_board').add(item, $$('my_board').getIndexById(item.id));
            break
        }
        case DELETE_ITEM : {
            console.log('DELETE_ITEM')
            $$('users_board').remove(item.itemId);
            $$('users_board').refresh()
            break
        }
        case DELETE_USER : {
            (
                async () => {

                    let result = await user_api.getByToken(localStorage.getItem('jwt'))
                    if (result.status === 403) {

                        alert('Welcome to the ban buddy')
                        location.reload()
                    }
                }
            )()
        }
    }
}

socket.onerror = (e) => {
    console.log('error ' + e.message)
}
socket.onclose = (msg) => {
    console.log('close ' + msg.code)
}

exports.socket = socket
},{"../apis/user":35}]},{},[36]);
