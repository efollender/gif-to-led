/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Lets require/import the HTTP module
	// var http = require('http');

	// var SlackAlert = require('./src/js/SlackAlert');
	//   var alert = new SlackAlert(2);
	//   alert.start();

	// var AudioParser = require('./src/js/audioParser');

	// var parser = new AudioParser();

	// parser.init('./src/audio/boss.mp3');

	// var SpotifyViewer = require('./src/js/spotifyData.js');

	// var Spotify = new SpotifyViewer;

	// Spotify.init();

	'use strict';

	var MPR121 = __webpack_require__(1);

	var touchsensor = new MPR121(0x5A, 1);

	if (touchsensor.begin()) {
	    // message how to quit
	    console.log('Press Ctrl-C to quit.');

	    // Interval for reading the sonsor
	    setInterval(function () {
	        // get touch values
	        var t = touchsensor.touched();

	        // prepare some result array
	        var ret = [];

	        // loop through pins
	        for (var i = 0; i < 12; i++) {
	            // push status into array
	            ret.push(touchsensor.is_touched(i));
	        }

	        console.log(ret);
	    }, 100);
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * MPR121 
	 * 
	 * Access the MPR121 chipset via node-i2c
	 * 
	 * --------------------------------------------------------------------------------------------------------------------
	 * 
	 * @author Amely Kling <mail@dwi.sk>
	 *
	 */

	/* Node Inclues
	 * ==================================================================================================================== */

	var i2c = __webpack_require__(2);
	var util = __webpack_require__(63);
	var EventEmitter = __webpack_require__(19).EventEmitter;


	/* Constants
	 * ==================================================================================================================== */

	// Register addresses.
	var MPR121_I2CADDR_DEFAULT = 0x5A;
	var MPR121_TOUCHSTATUS_L   = 0x00;
	var MPR121_TOUCHSTATUS_H   = 0x01;
	var MPR121_FILTDATA_0L     = 0x04;
	var MPR121_FILTDATA_0H     = 0x05;
	var MPR121_BASELINE_0      = 0x1E;
	var MPR121_MHDR            = 0x2B;
	var MPR121_NHDR            = 0x2C;
	var MPR121_NCLR            = 0x2D;
	var MPR121_FDLR            = 0x2E;
	var MPR121_MHDF            = 0x2F;
	var MPR121_NHDF            = 0x30;
	var MPR121_NCLF            = 0x31;
	var MPR121_FDLF            = 0x32;
	var MPR121_NHDT            = 0x33;
	var MPR121_NCLT            = 0x34;
	var MPR121_FDLT            = 0x35;
	var MPR121_TOUCHTH_0       = 0x41;
	var MPR121_RELEASETH_0     = 0x42;
	var MPR121_DEBOUNCE        = 0x5B;
	var MPR121_CONFIG1         = 0x5C;
	var MPR121_CONFIG2         = 0x5D;
	var MPR121_CHARGECURR_0    = 0x5F;
	var MPR121_CHARGETIME_1    = 0x6C;
	var MPR121_ECR             = 0x5E;
	var MPR121_AUTOCONFIG0     = 0x7B;
	var MPR121_AUTOCONFIG1     = 0x7C;
	var MPR121_UPLIMIT         = 0x7D;
	var MPR121_LOWLIMIT        = 0x7E;
	var MPR121_TARGETLIMIT     = 0x7F;
	var MPR121_GPIODIR         = 0x76;
	var MPR121_GPIOEN          = 0x77;
	var MPR121_GPIOSET         = 0x78;
	var MPR121_GPIOCLR         = 0x79;
	var MPR121_GPIOTOGGLE      = 0x7A;
	var MPR121_SOFTRESET       = 0x80;


	/* Class Constructor
	 * ==================================================================================================================== */


	function MPR121(address, bus_number) {
		EventEmitter.call(this);

		this.address = address;
		if (bus_number != undefined) {
			this.bus_number = bus_number;
		} else {
			this.bus_number = 1;
		}
	}

	// MPR121 inherits EventEmitter
	util.inherits(MPR121, EventEmitter);

	// module export
	module.exports = MPR121;


	/* Variables
	 * ==================================================================================================================== */

	MPR121.prototype._device;
	MPR121.prototype.address;
	MPR121.prototype.bus_number = "1";


	/* Methods
	 * ==================================================================================================================== */

	var _device;

	/* 
	 * Initialize communication with the MPR121. 
	 *
	 * Can specify a custom I2C address for the device using the address 
	 * parameter (defaults to 0x5A). Optional i2c parameter allows specifying a 
	 * custom I2C bus source (defaults to platform's I2C bus).
	 * 
	 * Returns True if communication with the MPR121 was established, otherwise
	 * returns False.
	 */

	MPR121.prototype.begin = function(address) {

		// get adress
		if (address == undefined) {
			address = this.adress;
		}
		if (address == undefined) {
			address = MPR121_I2CADDR_DEFAULT;
		}

		// get i2c device string
		var i2cdevice =  '/dev/i2c-'+this.bus_number;

		// get device
		this._device = new i2c(address,{device: i2cdevice});

		return this.reset();
	}


	/*
	 * get config value
	 */

	MPR121.prototype.config = function() {
		return this._read8Bits(MPR121_CONFIG2);
	}


	/*
	 * reset sensor
	 */

	MPR121.prototype.reset = function(touch, release){
		// Soft reset of device.
		this._write8Bits(MPR121_SOFTRESET, 0x63);

		// Set electrode configuration to default values.
		this._write8Bits(MPR121_ECR, 0x00);

		//# Check CDT, SFI, ESI configuration is at default values.
		var c = this._read8Bits(MPR121_CONFIG2);
		if (c != 0x24) {
			console.log("MPR121 Error - device not found. Check address, bus and wiring. ("+c+" != 36)")
			return false;
		} 

		// Set threshold for touch and release to default values.
		this.set_thresholds(12, 6);
		// Configure baseline filtering control registers.
		this._write8Bits(MPR121_MHDR, 0x01);
		this._write8Bits(MPR121_NHDR, 0x01);
		this._write8Bits(MPR121_NCLR, 0x0E);
		this._write8Bits(MPR121_FDLR, 0x00);
		this._write8Bits(MPR121_MHDF, 0x01);
		this._write8Bits(MPR121_NHDF, 0x05);
		this._write8Bits(MPR121_NCLF, 0x01);
		this._write8Bits(MPR121_FDLF, 0x00);
		this._write8Bits(MPR121_NHDT, 0x00);
		this._write8Bits(MPR121_NCLT, 0x00);
		this._write8Bits(MPR121_FDLT, 0x00);	
		// Set other configuration registers.
		this._write8Bits(MPR121_DEBOUNCE, 0);
		this._write8Bits(MPR121_CONFIG1, 0x10); // default, 16uA charge current
		this._write8Bits(MPR121_CONFIG2, 0x20); // 0.5uS encoding, 1ms period
		// Enable all electrodes.
		this._write8Bits(MPR121_ECR, 0x8F); // start with first 5 bits of baseline tracking
		// All done, everything succeeded!

		return true;
	}

	/* 
	 * Set the touch and release threshold for all inputs to the provided
	 * values.  Both touch and release should be a value between 0 to 255
	 * (inclusive).
	 */

	 MPR121.prototype.set_thresholds = function(touch, release) {
		if (touch < 0 || touch > 255) return false;
		if (release < 0 || release > 255) return false;

		for (var i = 0; i <= 12; i++) {
			this._write8Bits(MPR121_TOUCHTH_0 + 2 * i, touch);
			this._write8Bits(MPR121_RELEASETH_0 + 2 * i, release);
		}
	}


	/* 
	 * Return filtered data register value for the provided pin (0-11).
	 * Useful for debugging.
	 */

	 MPR121.prototype.filtered_data = function(pin) {
		if (pin < 0 || pin >= 12) { return false; }
		return this._read16Bits(MPR121_FILTDATA_0L + pin*2);
	}


	/* 
	 * Return baseline data register value for the provided pin (0-11).
	 * Useful for debugging.
	 */

	 MPR121.prototype.baseline_data = function(pin) {
		if (pin < 0 || pin >= 12) { return false; }
		var bl = this._read8Bits(MPR121_BASELINE_0 + pin);
		return bl << 2;
	}


	/* 
	 * Return touch state of all pins as a 12-bit value where each bit 
	 * represents a pin, with a value of 1 being touched and 0 not being touched.
	 */ 

	 MPR121.prototype.touched = function() {
		var t = this._read16Bits(MPR121_TOUCHSTATUS_L);
		return t & 0x0FFF;
	}


	/*
	 * Return True if the specified pin is being touched, otherwise returns
	 * False.
	 */

	 MPR121.prototype.is_touched = function(pin) {
		if (pin < 0 || pin >= 12) { return false; }
		var t = this.touched();
		return (t & (1 << pin)) > 0;
	}

	/* 
	 * Several I2C Helpers
	 */

	MPR121.prototype._read8Bits = function(reg, callback) {
		if (callback == undefined) { callback = function() {}; };
		var ret = this._device.readBytes(reg, 1, function(err, data) { callback(err, data[0]) });
		return ret.readUInt8(0);
	};

	MPR121.prototype._read16Bits = function(reg, callback) {
		if (callback == undefined) { callback = function() {}; };
		var ret = this._device.readBytes(reg, 2, callback);
		return ret.readUInt16LE(0);
	};

	MPR121.prototype._write8Bits = function(reg, value, callback) {
		if (callback == undefined) { callback = function() {}; };
		this._device.writeBytes(reg, [value & 0xFF], callback);
	};



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	__webpack_require__(62);
	var i2c = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/i2c\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	module.exports = i2c;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {// Generated by CoffeeScript 1.9.1
	(function() {
	  var Lexer, SourceMap, base, compile, ext, formatSourcePosition, fs, getSourceMap, helpers, i, len, lexer, parser, path, ref, sourceMaps, vm, withPrettyErrors,
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  vm = __webpack_require__(5);

	  path = __webpack_require__(7);

	  Lexer = __webpack_require__(8).Lexer;

	  parser = __webpack_require__(11).parser;

	  helpers = __webpack_require__(10);

	  SourceMap = __webpack_require__(13);

	  exports.VERSION = '1.9.1';

	  exports.FILE_EXTENSIONS = ['.coffee', '.litcoffee', '.coffee.md'];

	  exports.helpers = helpers;

	  withPrettyErrors = function(fn) {
	    return function(code, options) {
	      var err;
	      if (options == null) {
	        options = {};
	      }
	      try {
	        return fn.call(this, code, options);
	      } catch (_error) {
	        err = _error;
	        throw helpers.updateSyntaxError(err, code, options.filename);
	      }
	    };
	  };

	  exports.compile = compile = withPrettyErrors(function(code, options) {
	    var answer, currentColumn, currentLine, extend, fragment, fragments, header, i, js, len, map, merge, newLines, token, tokens;
	    merge = helpers.merge, extend = helpers.extend;
	    options = extend({}, options);
	    if (options.sourceMap) {
	      map = new SourceMap;
	    }
	    tokens = lexer.tokenize(code, options);
	    options.referencedVars = (function() {
	      var i, len, results;
	      results = [];
	      for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        if (token.variable) {
	          results.push(token[1]);
	        }
	      }
	      return results;
	    })();
	    fragments = parser.parse(tokens).compileToFragments(options);
	    currentLine = 0;
	    if (options.header) {
	      currentLine += 1;
	    }
	    if (options.shiftLine) {
	      currentLine += 1;
	    }
	    currentColumn = 0;
	    js = "";
	    for (i = 0, len = fragments.length; i < len; i++) {
	      fragment = fragments[i];
	      if (options.sourceMap) {
	        if (fragment.locationData) {
	          map.add([fragment.locationData.first_line, fragment.locationData.first_column], [currentLine, currentColumn], {
	            noReplace: true
	          });
	        }
	        newLines = helpers.count(fragment.code, "\n");
	        currentLine += newLines;
	        if (newLines) {
	          currentColumn = fragment.code.length - (fragment.code.lastIndexOf("\n") + 1);
	        } else {
	          currentColumn += fragment.code.length;
	        }
	      }
	      js += fragment.code;
	    }
	    if (options.header) {
	      header = "Generated by CoffeeScript " + this.VERSION;
	      js = "// " + header + "\n" + js;
	    }
	    if (options.sourceMap) {
	      answer = {
	        js: js
	      };
	      answer.sourceMap = map;
	      answer.v3SourceMap = map.generate(options, code);
	      return answer;
	    } else {
	      return js;
	    }
	  });

	  exports.tokens = withPrettyErrors(function(code, options) {
	    return lexer.tokenize(code, options);
	  });

	  exports.nodes = withPrettyErrors(function(source, options) {
	    if (typeof source === 'string') {
	      return parser.parse(lexer.tokenize(source, options));
	    } else {
	      return parser.parse(source);
	    }
	  });

	  exports.run = function(code, options) {
	    var answer, dir, mainModule, ref;
	    if (options == null) {
	      options = {};
	    }
	    mainModule = __webpack_require__.c[0];
	    mainModule.filename = process.argv[1] = options.filename ? fs.realpathSync(options.filename) : '.';
	    mainModule.moduleCache && (mainModule.moduleCache = {});
	    dir = options.filename ? path.dirname(fs.realpathSync(options.filename)) : fs.realpathSync('.');
	    mainModule.paths = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))._nodeModulePaths(dir);
	    if (!helpers.isCoffee(mainModule.filename) || (void 0)) {
	      answer = compile(code, options);
	      code = (ref = answer.js) != null ? ref : answer;
	    }
	    return mainModule._compile(code, mainModule.filename);
	  };

	  exports["eval"] = function(code, options) {
	    var Module, _module, _require, createContext, i, isContext, js, k, len, o, r, ref, ref1, ref2, ref3, sandbox, v;
	    if (options == null) {
	      options = {};
	    }
	    if (!(code = code.trim())) {
	      return;
	    }
	    createContext = (ref = vm.Script.createContext) != null ? ref : vm.createContext;
	    isContext = (ref1 = vm.isContext) != null ? ref1 : function(ctx) {
	      return options.sandbox instanceof createContext().constructor;
	    };
	    if (createContext) {
	      if (options.sandbox != null) {
	        if (isContext(options.sandbox)) {
	          sandbox = options.sandbox;
	        } else {
	          sandbox = createContext();
	          ref2 = options.sandbox;
	          for (k in ref2) {
	            if (!hasProp.call(ref2, k)) continue;
	            v = ref2[k];
	            sandbox[k] = v;
	          }
	        }
	        sandbox.global = sandbox.root = sandbox.GLOBAL = sandbox;
	      } else {
	        sandbox = global;
	      }
	      sandbox.__filename = options.filename || 'eval';
	      sandbox.__dirname = path.dirname(sandbox.__filename);
	      if (!(sandbox !== global || sandbox.module || sandbox.require)) {
	        Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	        sandbox.module = _module = new Module(options.modulename || 'eval');
	        sandbox.require = _require = function(path) {
	          return Module._load(path, _module, true);
	        };
	        _module.filename = sandbox.__filename;
	        ref3 = Object.getOwnPropertyNames(__webpack_require__(14));
	        for (i = 0, len = ref3.length; i < len; i++) {
	          r = ref3[i];
	          if (r !== 'paths') {
	            _require[r] = __webpack_require__(14)[r];
	          }
	        }
	        _require.paths = _module.paths = Module._nodeModulePaths(process.cwd());
	        _require.resolve = function(request) {
	          return Module._resolveFilename(request, _module);
	        };
	      }
	    }
	    o = {};
	    for (k in options) {
	      if (!hasProp.call(options, k)) continue;
	      v = options[k];
	      o[k] = v;
	    }
	    o.bare = true;
	    js = compile(code, o);
	    if (sandbox === global) {
	      return vm.runInThisContext(js);
	    } else {
	      return vm.runInContext(js, sandbox);
	    }
	  };

	  exports.register = function() {
	    return __webpack_require__(60);
	  };

	  if ((void 0)) {
	    ref = this.FILE_EXTENSIONS;
	    for (i = 0, len = ref.length; i < len; i++) {
	      ext = ref[i];
	      if ((base = (void 0))[ext] == null) {
	        base[ext] = function() {
	          throw new Error("Use CoffeeScript.register() or require the coffee-script/register module to require " + ext + " files.");
	        };
	      }
	    }
	  }

	  exports._compileFile = function(filename, sourceMap) {
	    var answer, err, raw, stripped;
	    if (sourceMap == null) {
	      sourceMap = false;
	    }
	    raw = fs.readFileSync(filename, 'utf8');
	    stripped = raw.charCodeAt(0) === 0xFEFF ? raw.substring(1) : raw;
	    try {
	      answer = compile(stripped, {
	        filename: filename,
	        sourceMap: sourceMap,
	        literate: helpers.isLiterate(filename)
	      });
	    } catch (_error) {
	      err = _error;
	      throw helpers.updateSyntaxError(err, stripped, filename);
	    }
	    return answer;
	  };

	  lexer = new Lexer;

	  parser.lexer = {
	    lex: function() {
	      var tag, token;
	      token = parser.tokens[this.pos++];
	      if (token) {
	        tag = token[0], this.yytext = token[1], this.yylloc = token[2];
	        parser.errorToken = token.origin || token;
	        this.yylineno = this.yylloc.first_line;
	      } else {
	        tag = '';
	      }
	      return tag;
	    },
	    setInput: function(tokens) {
	      parser.tokens = tokens;
	      return this.pos = 0;
	    },
	    upcomingInput: function() {
	      return "";
	    }
	  };

	  parser.yy = __webpack_require__(27);

	  parser.yy.parseError = function(message, arg) {
	    var errorLoc, errorTag, errorText, errorToken, token, tokens;
	    token = arg.token;
	    errorToken = parser.errorToken, tokens = parser.tokens;
	    errorTag = errorToken[0], errorText = errorToken[1], errorLoc = errorToken[2];
	    errorText = (function() {
	      switch (false) {
	        case errorToken !== tokens[tokens.length - 1]:
	          return 'end of input';
	        case errorTag !== 'INDENT' && errorTag !== 'OUTDENT':
	          return 'indentation';
	        case errorTag !== 'IDENTIFIER' && errorTag !== 'NUMBER' && errorTag !== 'STRING' && errorTag !== 'STRING_START' && errorTag !== 'REGEX' && errorTag !== 'REGEX_START':
	          return errorTag.replace(/_START$/, '').toLowerCase();
	        default:
	          return helpers.nameWhitespaceCharacter(errorText);
	      }
	    })();
	    return helpers.throwSyntaxError("unexpected " + errorText, errorLoc);
	  };

	  formatSourcePosition = function(frame, getSourceMapping) {
	    var as, column, fileLocation, fileName, functionName, isConstructor, isMethodCall, line, methodName, source, tp, typeName;
	    fileName = void 0;
	    fileLocation = '';
	    if (frame.isNative()) {
	      fileLocation = "native";
	    } else {
	      if (frame.isEval()) {
	        fileName = frame.getScriptNameOrSourceURL();
	        if (!fileName) {
	          fileLocation = (frame.getEvalOrigin()) + ", ";
	        }
	      } else {
	        fileName = frame.getFileName();
	      }
	      fileName || (fileName = "<anonymous>");
	      line = frame.getLineNumber();
	      column = frame.getColumnNumber();
	      source = getSourceMapping(fileName, line, column);
	      fileLocation = source ? fileName + ":" + source[0] + ":" + source[1] : fileName + ":" + line + ":" + column;
	    }
	    functionName = frame.getFunctionName();
	    isConstructor = frame.isConstructor();
	    isMethodCall = !(frame.isToplevel() || isConstructor);
	    if (isMethodCall) {
	      methodName = frame.getMethodName();
	      typeName = frame.getTypeName();
	      if (functionName) {
	        tp = as = '';
	        if (typeName && functionName.indexOf(typeName)) {
	          tp = typeName + ".";
	        }
	        if (methodName && functionName.indexOf("." + methodName) !== functionName.length - methodName.length - 1) {
	          as = " [as " + methodName + "]";
	        }
	        return "" + tp + functionName + as + " (" + fileLocation + ")";
	      } else {
	        return typeName + "." + (methodName || '<anonymous>') + " (" + fileLocation + ")";
	      }
	    } else if (isConstructor) {
	      return "new " + (functionName || '<anonymous>') + " (" + fileLocation + ")";
	    } else if (functionName) {
	      return functionName + " (" + fileLocation + ")";
	    } else {
	      return fileLocation;
	    }
	  };

	  sourceMaps = {};

	  getSourceMap = function(filename) {
	    var answer, ref1;
	    if (sourceMaps[filename]) {
	      return sourceMaps[filename];
	    }
	    if (ref1 = path != null ? path.extname(filename) : void 0, indexOf.call(exports.FILE_EXTENSIONS, ref1) < 0) {
	      return;
	    }
	    answer = exports._compileFile(filename, true);
	    return sourceMaps[filename] = answer.sourceMap;
	  };

	  Error.prepareStackTrace = function(err, stack) {
	    var frame, frames, getSourceMapping;
	    getSourceMapping = function(filename, line, column) {
	      var answer, sourceMap;
	      sourceMap = getSourceMap(filename);
	      if (sourceMap) {
	        answer = sourceMap.sourceLocation([line - 1, column - 1]);
	      }
	      if (answer) {
	        return [answer[0] + 1, answer[1] + 1];
	      } else {
	        return null;
	      }
	    };
	    frames = (function() {
	      var j, len1, results;
	      results = [];
	      for (j = 0, len1 = stack.length; j < len1; j++) {
	        frame = stack[j];
	        if (frame.getFunction() === exports.run) {
	          break;
	        }
	        results.push("  at " + (formatSourcePosition(frame, getSourceMapping)));
	      }
	      return results;
	    })();
	    return (err.toString()) + "\n" + (frames.join('\n')) + "\n";
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
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
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(6);

	var Object_keys = function (obj) {
	    if (Object.keys) return Object.keys(obj)
	    else {
	        var res = [];
	        for (var key in obj) res.push(key)
	        return res;
	    }
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	var defineProp = (function() {
	    try {
	        Object.defineProperty({}, '_', {});
	        return function(obj, name, value) {
	            Object.defineProperty(obj, name, {
	                writable: true,
	                enumerable: false,
	                configurable: true,
	                value: value
	            })
	        };
	    } catch(e) {
	        return function(obj, name, value) {
	            obj[name] = value;
	        };
	    }
	}());

	var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
	'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
	'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
	'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
	'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

	function Context() {}
	Context.prototype = {};

	var Script = exports.Script = function NodeScript (code) {
	    if (!(this instanceof Script)) return new Script(code);
	    this.code = code;
	};

	Script.prototype.runInContext = function (context) {
	    if (!(context instanceof Context)) {
	        throw new TypeError("needs a 'context' argument.");
	    }
	    
	    var iframe = document.createElement('iframe');
	    if (!iframe.style) iframe.style = {};
	    iframe.style.display = 'none';
	    
	    document.body.appendChild(iframe);
	    
	    var win = iframe.contentWindow;
	    var wEval = win.eval, wExecScript = win.execScript;

	    if (!wEval && wExecScript) {
	        // win.eval() magically appears when this is called in IE:
	        wExecScript.call(win, 'null');
	        wEval = win.eval;
	    }
	    
	    forEach(Object_keys(context), function (key) {
	        win[key] = context[key];
	    });
	    forEach(globals, function (key) {
	        if (context[key]) {
	            win[key] = context[key];
	        }
	    });
	    
	    var winKeys = Object_keys(win);

	    var res = wEval.call(win, this.code);
	    
	    forEach(Object_keys(win), function (key) {
	        // Avoid copying circular objects like `top` and `window` by only
	        // updating existing context properties or new properties in the `win`
	        // that was only introduced after the eval.
	        if (key in context || indexOf(winKeys, key) === -1) {
	            context[key] = win[key];
	        }
	    });

	    forEach(globals, function (key) {
	        if (!(key in context)) {
	            defineProp(context, key, win[key]);
	        }
	    });
	    
	    document.body.removeChild(iframe);
	    
	    return res;
	};

	Script.prototype.runInThisContext = function () {
	    return eval(this.code); // maybe...
	};

	Script.prototype.runInNewContext = function (context) {
	    var ctx = Script.createContext(context);
	    var res = this.runInContext(ctx);

	    forEach(Object_keys(ctx), function (key) {
	        context[key] = ctx[key];
	    });

	    return res;
	};

	forEach(Object_keys(Script.prototype), function (name) {
	    exports[name] = Script[name] = function (code) {
	        var s = Script(code);
	        return s[name].apply(s, [].slice.call(arguments, 1));
	    };
	});

	exports.createScript = function (code) {
	    return exports.Script(code);
	};

	exports.createContext = Script.createContext = function (context) {
	    var copy = new Context();
	    if(typeof context === 'object') {
	        forEach(Object_keys(context), function (key) {
	            copy[key] = context[key];
	        });
	    }
	    return copy;
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var BOM, BOOL, CALLABLE, CODE, COFFEE_ALIASES, COFFEE_ALIAS_MAP, COFFEE_KEYWORDS, COMMENT, COMPARE, COMPOUND_ASSIGN, HERECOMMENT_ILLEGAL, HEREDOC_DOUBLE, HEREDOC_INDENT, HEREDOC_SINGLE, HEREGEX, HEREGEX_OMIT, IDENTIFIER, INDENTABLE_CLOSERS, INDEXABLE, INVALID_ESCAPE, INVERSES, JSTOKEN, JS_FORBIDDEN, JS_KEYWORDS, LEADING_BLANK_LINE, LINE_BREAK, LINE_CONTINUER, LOGIC, Lexer, MATH, MULTI_DENT, NOT_REGEX, NUMBER, OPERATOR, POSSIBLY_DIVISION, REGEX, REGEX_FLAGS, REGEX_ILLEGAL, RELATION, RESERVED, Rewriter, SHIFT, SIMPLE_STRING_OMIT, STRICT_PROSCRIBED, STRING_DOUBLE, STRING_OMIT, STRING_SINGLE, STRING_START, TRAILING_BLANK_LINE, TRAILING_SPACES, UNARY, UNARY_MATH, VALID_FLAGS, WHITESPACE, compact, count, invertLiterate, key, locationDataToString, ref, ref1, repeat, starts, throwSyntaxError,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  ref = __webpack_require__(9), Rewriter = ref.Rewriter, INVERSES = ref.INVERSES;

	  ref1 = __webpack_require__(10), count = ref1.count, starts = ref1.starts, compact = ref1.compact, repeat = ref1.repeat, invertLiterate = ref1.invertLiterate, locationDataToString = ref1.locationDataToString, throwSyntaxError = ref1.throwSyntaxError;

	  exports.Lexer = Lexer = (function() {
	    function Lexer() {}

	    Lexer.prototype.tokenize = function(code, opts) {
	      var consumed, end, i, ref2;
	      if (opts == null) {
	        opts = {};
	      }
	      this.literate = opts.literate;
	      this.indent = 0;
	      this.baseIndent = 0;
	      this.indebt = 0;
	      this.outdebt = 0;
	      this.indents = [];
	      this.ends = [];
	      this.tokens = [];
	      this.chunkLine = opts.line || 0;
	      this.chunkColumn = opts.column || 0;
	      code = this.clean(code);
	      i = 0;
	      while (this.chunk = code.slice(i)) {
	        consumed = this.identifierToken() || this.commentToken() || this.whitespaceToken() || this.lineToken() || this.stringToken() || this.numberToken() || this.regexToken() || this.jsToken() || this.literalToken();
	        ref2 = this.getLineAndColumnFromChunk(consumed), this.chunkLine = ref2[0], this.chunkColumn = ref2[1];
	        i += consumed;
	        if (opts.untilBalanced && this.ends.length === 0) {
	          return {
	            tokens: this.tokens,
	            index: i
	          };
	        }
	      }
	      this.closeIndentation();
	      if (end = this.ends.pop()) {
	        this.error("missing " + end.tag, end.origin[2]);
	      }
	      if (opts.rewrite === false) {
	        return this.tokens;
	      }
	      return (new Rewriter).rewrite(this.tokens);
	    };

	    Lexer.prototype.clean = function(code) {
	      if (code.charCodeAt(0) === BOM) {
	        code = code.slice(1);
	      }
	      code = code.replace(/\r/g, '').replace(TRAILING_SPACES, '');
	      if (WHITESPACE.test(code)) {
	        code = "\n" + code;
	        this.chunkLine--;
	      }
	      if (this.literate) {
	        code = invertLiterate(code);
	      }
	      return code;
	    };

	    Lexer.prototype.identifierToken = function() {
	      var colon, colonOffset, forcedIdentifier, id, idLength, input, match, poppedToken, prev, ref2, ref3, ref4, ref5, tag, tagToken;
	      if (!(match = IDENTIFIER.exec(this.chunk))) {
	        return 0;
	      }
	      input = match[0], id = match[1], colon = match[2];
	      idLength = id.length;
	      poppedToken = void 0;
	      if (id === 'own' && this.tag() === 'FOR') {
	        this.token('OWN', id);
	        return id.length;
	      }
	      if (id === 'from' && this.tag() === 'YIELD') {
	        this.token('FROM', id);
	        return id.length;
	      }
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      forcedIdentifier = colon || (prev != null) && (((ref3 = prev[0]) === '.' || ref3 === '?.' || ref3 === '::' || ref3 === '?::') || !prev.spaced && prev[0] === '@');
	      tag = 'IDENTIFIER';
	      if (!forcedIdentifier && (indexOf.call(JS_KEYWORDS, id) >= 0 || indexOf.call(COFFEE_KEYWORDS, id) >= 0)) {
	        tag = id.toUpperCase();
	        if (tag === 'WHEN' && (ref4 = this.tag(), indexOf.call(LINE_BREAK, ref4) >= 0)) {
	          tag = 'LEADING_WHEN';
	        } else if (tag === 'FOR') {
	          this.seenFor = true;
	        } else if (tag === 'UNLESS') {
	          tag = 'IF';
	        } else if (indexOf.call(UNARY, tag) >= 0) {
	          tag = 'UNARY';
	        } else if (indexOf.call(RELATION, tag) >= 0) {
	          if (tag !== 'INSTANCEOF' && this.seenFor) {
	            tag = 'FOR' + tag;
	            this.seenFor = false;
	          } else {
	            tag = 'RELATION';
	            if (this.value() === '!') {
	              poppedToken = this.tokens.pop();
	              id = '!' + id;
	            }
	          }
	        }
	      }
	      if (indexOf.call(JS_FORBIDDEN, id) >= 0) {
	        if (forcedIdentifier) {
	          tag = 'IDENTIFIER';
	          id = new String(id);
	          id.reserved = true;
	        } else if (indexOf.call(RESERVED, id) >= 0) {
	          this.error("reserved word '" + id + "'", {
	            length: id.length
	          });
	        }
	      }
	      if (!forcedIdentifier) {
	        if (indexOf.call(COFFEE_ALIASES, id) >= 0) {
	          id = COFFEE_ALIAS_MAP[id];
	        }
	        tag = (function() {
	          switch (id) {
	            case '!':
	              return 'UNARY';
	            case '==':
	            case '!=':
	              return 'COMPARE';
	            case '&&':
	            case '||':
	              return 'LOGIC';
	            case 'true':
	            case 'false':
	              return 'BOOL';
	            case 'break':
	            case 'continue':
	              return 'STATEMENT';
	            default:
	              return tag;
	          }
	        })();
	      }
	      tagToken = this.token(tag, id, 0, idLength);
	      tagToken.variable = !forcedIdentifier;
	      if (poppedToken) {
	        ref5 = [poppedToken[2].first_line, poppedToken[2].first_column], tagToken[2].first_line = ref5[0], tagToken[2].first_column = ref5[1];
	      }
	      if (colon) {
	        colonOffset = input.lastIndexOf(':');
	        this.token(':', ':', colonOffset, colon.length);
	      }
	      return input.length;
	    };

	    Lexer.prototype.numberToken = function() {
	      var binaryLiteral, lexedLength, match, number, octalLiteral;
	      if (!(match = NUMBER.exec(this.chunk))) {
	        return 0;
	      }
	      number = match[0];
	      lexedLength = number.length;
	      if (/^0[BOX]/.test(number)) {
	        this.error("radix prefix in '" + number + "' must be lowercase", {
	          offset: 1
	        });
	      } else if (/E/.test(number) && !/^0x/.test(number)) {
	        this.error("exponential notation in '" + number + "' must be indicated with a lowercase 'e'", {
	          offset: number.indexOf('E')
	        });
	      } else if (/^0\d*[89]/.test(number)) {
	        this.error("decimal literal '" + number + "' must not be prefixed with '0'", {
	          length: lexedLength
	        });
	      } else if (/^0\d+/.test(number)) {
	        this.error("octal literal '" + number + "' must be prefixed with '0o'", {
	          length: lexedLength
	        });
	      }
	      if (octalLiteral = /^0o([0-7]+)/.exec(number)) {
	        number = '0x' + parseInt(octalLiteral[1], 8).toString(16);
	      }
	      if (binaryLiteral = /^0b([01]+)/.exec(number)) {
	        number = '0x' + parseInt(binaryLiteral[1], 2).toString(16);
	      }
	      this.token('NUMBER', number, 0, lexedLength);
	      return lexedLength;
	    };

	    Lexer.prototype.stringToken = function() {
	      var $, attempt, delimiter, doc, end, heredoc, i, indent, indentRegex, match, quote, ref2, ref3, regex, token, tokens;
	      quote = (STRING_START.exec(this.chunk) || [])[0];
	      if (!quote) {
	        return 0;
	      }
	      regex = (function() {
	        switch (quote) {
	          case "'":
	            return STRING_SINGLE;
	          case '"':
	            return STRING_DOUBLE;
	          case "'''":
	            return HEREDOC_SINGLE;
	          case '"""':
	            return HEREDOC_DOUBLE;
	        }
	      })();
	      heredoc = quote.length === 3;
	      ref2 = this.matchWithInterpolations(regex, quote), tokens = ref2.tokens, end = ref2.index;
	      $ = tokens.length - 1;
	      delimiter = quote[0];
	      if (heredoc) {
	        indent = null;
	        doc = ((function() {
	          var j, len, results;
	          results = [];
	          for (i = j = 0, len = tokens.length; j < len; i = ++j) {
	            token = tokens[i];
	            if (token[0] === 'NEOSTRING') {
	              results.push(token[1]);
	            }
	          }
	          return results;
	        })()).join('#{}');
	        while (match = HEREDOC_INDENT.exec(doc)) {
	          attempt = match[1];
	          if (indent === null || (0 < (ref3 = attempt.length) && ref3 < indent.length)) {
	            indent = attempt;
	          }
	        }
	        if (indent) {
	          indentRegex = RegExp("^" + indent, "gm");
	        }
	        this.mergeInterpolationTokens(tokens, {
	          delimiter: delimiter
	        }, (function(_this) {
	          return function(value, i) {
	            value = _this.formatString(value);
	            if (i === 0) {
	              value = value.replace(LEADING_BLANK_LINE, '');
	            }
	            if (i === $) {
	              value = value.replace(TRAILING_BLANK_LINE, '');
	            }
	            if (indentRegex) {
	              value = value.replace(indentRegex, '');
	            }
	            return value;
	          };
	        })(this));
	      } else {
	        this.mergeInterpolationTokens(tokens, {
	          delimiter: delimiter
	        }, (function(_this) {
	          return function(value, i) {
	            value = _this.formatString(value);
	            value = value.replace(SIMPLE_STRING_OMIT, function(match, offset) {
	              if ((i === 0 && offset === 0) || (i === $ && offset + match.length === value.length)) {
	                return '';
	              } else {
	                return ' ';
	              }
	            });
	            return value;
	          };
	        })(this));
	      }
	      return end;
	    };

	    Lexer.prototype.commentToken = function() {
	      var comment, here, match;
	      if (!(match = this.chunk.match(COMMENT))) {
	        return 0;
	      }
	      comment = match[0], here = match[1];
	      if (here) {
	        if (match = HERECOMMENT_ILLEGAL.exec(comment)) {
	          this.error("block comments cannot contain " + match[0], {
	            offset: match.index,
	            length: match[0].length
	          });
	        }
	        if (here.indexOf('\n') >= 0) {
	          here = here.replace(RegExp("\\n" + (repeat(' ', this.indent)), "g"), '\n');
	        }
	        this.token('HERECOMMENT', here, 0, comment.length);
	      }
	      return comment.length;
	    };

	    Lexer.prototype.jsToken = function() {
	      var match, script;
	      if (!(this.chunk.charAt(0) === '`' && (match = JSTOKEN.exec(this.chunk)))) {
	        return 0;
	      }
	      this.token('JS', (script = match[0]).slice(1, -1), 0, script.length);
	      return script.length;
	    };

	    Lexer.prototype.regexToken = function() {
	      var body, closed, end, flags, index, match, origin, prev, ref2, ref3, ref4, regex, tokens;
	      switch (false) {
	        case !(match = REGEX_ILLEGAL.exec(this.chunk)):
	          this.error("regular expressions cannot begin with " + match[2], {
	            offset: match.index + match[1].length
	          });
	          break;
	        case !(match = this.matchWithInterpolations(HEREGEX, '///')):
	          tokens = match.tokens, index = match.index;
	          break;
	        case !(match = REGEX.exec(this.chunk)):
	          regex = match[0], body = match[1], closed = match[2];
	          this.validateEscapes(body, {
	            isRegex: true,
	            offsetInChunk: 1
	          });
	          index = regex.length;
	          ref2 = this.tokens, prev = ref2[ref2.length - 1];
	          if (prev) {
	            if (prev.spaced && (ref3 = prev[0], indexOf.call(CALLABLE, ref3) >= 0)) {
	              if (!closed || POSSIBLY_DIVISION.test(regex)) {
	                return 0;
	              }
	            } else if (ref4 = prev[0], indexOf.call(NOT_REGEX, ref4) >= 0) {
	              return 0;
	            }
	          }
	          if (!closed) {
	            this.error('missing / (unclosed regex)');
	          }
	          break;
	        default:
	          return 0;
	      }
	      flags = REGEX_FLAGS.exec(this.chunk.slice(index))[0];
	      end = index + flags.length;
	      origin = this.makeToken('REGEX', null, 0, end);
	      switch (false) {
	        case !!VALID_FLAGS.test(flags):
	          this.error("invalid regular expression flags " + flags, {
	            offset: index,
	            length: flags.length
	          });
	          break;
	        case !(regex || tokens.length === 1):
	          if (body == null) {
	            body = this.formatHeregex(tokens[0][1]);
	          }
	          this.token('REGEX', "" + (this.makeDelimitedLiteral(body, {
	            delimiter: '/'
	          })) + flags, 0, end, origin);
	          break;
	        default:
	          this.token('REGEX_START', '(', 0, 0, origin);
	          this.token('IDENTIFIER', 'RegExp', 0, 0);
	          this.token('CALL_START', '(', 0, 0);
	          this.mergeInterpolationTokens(tokens, {
	            delimiter: '"',
	            double: true
	          }, this.formatHeregex);
	          if (flags) {
	            this.token(',', ',', index, 0);
	            this.token('STRING', '"' + flags + '"', index, flags.length);
	          }
	          this.token(')', ')', end, 0);
	          this.token('REGEX_END', ')', end, 0);
	      }
	      return end;
	    };

	    Lexer.prototype.lineToken = function() {
	      var diff, indent, match, noNewlines, size;
	      if (!(match = MULTI_DENT.exec(this.chunk))) {
	        return 0;
	      }
	      indent = match[0];
	      this.seenFor = false;
	      size = indent.length - 1 - indent.lastIndexOf('\n');
	      noNewlines = this.unfinished();
	      if (size - this.indebt === this.indent) {
	        if (noNewlines) {
	          this.suppressNewlines();
	        } else {
	          this.newlineToken(0);
	        }
	        return indent.length;
	      }
	      if (size > this.indent) {
	        if (noNewlines) {
	          this.indebt = size - this.indent;
	          this.suppressNewlines();
	          return indent.length;
	        }
	        if (!this.tokens.length) {
	          this.baseIndent = this.indent = size;
	          return indent.length;
	        }
	        diff = size - this.indent + this.outdebt;
	        this.token('INDENT', diff, indent.length - size, size);
	        this.indents.push(diff);
	        this.ends.push({
	          tag: 'OUTDENT'
	        });
	        this.outdebt = this.indebt = 0;
	        this.indent = size;
	      } else if (size < this.baseIndent) {
	        this.error('missing indentation', {
	          offset: indent.length
	        });
	      } else {
	        this.indebt = 0;
	        this.outdentToken(this.indent - size, noNewlines, indent.length);
	      }
	      return indent.length;
	    };

	    Lexer.prototype.outdentToken = function(moveOut, noNewlines, outdentLength) {
	      var decreasedIndent, dent, lastIndent, ref2;
	      decreasedIndent = this.indent - moveOut;
	      while (moveOut > 0) {
	        lastIndent = this.indents[this.indents.length - 1];
	        if (!lastIndent) {
	          moveOut = 0;
	        } else if (lastIndent === this.outdebt) {
	          moveOut -= this.outdebt;
	          this.outdebt = 0;
	        } else if (lastIndent < this.outdebt) {
	          this.outdebt -= lastIndent;
	          moveOut -= lastIndent;
	        } else {
	          dent = this.indents.pop() + this.outdebt;
	          if (outdentLength && (ref2 = this.chunk[outdentLength], indexOf.call(INDENTABLE_CLOSERS, ref2) >= 0)) {
	            decreasedIndent -= dent - moveOut;
	            moveOut = dent;
	          }
	          this.outdebt = 0;
	          this.pair('OUTDENT');
	          this.token('OUTDENT', moveOut, 0, outdentLength);
	          moveOut -= dent;
	        }
	      }
	      if (dent) {
	        this.outdebt -= moveOut;
	      }
	      while (this.value() === ';') {
	        this.tokens.pop();
	      }
	      if (!(this.tag() === 'TERMINATOR' || noNewlines)) {
	        this.token('TERMINATOR', '\n', outdentLength, 0);
	      }
	      this.indent = decreasedIndent;
	      return this;
	    };

	    Lexer.prototype.whitespaceToken = function() {
	      var match, nline, prev, ref2;
	      if (!((match = WHITESPACE.exec(this.chunk)) || (nline = this.chunk.charAt(0) === '\n'))) {
	        return 0;
	      }
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      if (prev) {
	        prev[match ? 'spaced' : 'newLine'] = true;
	      }
	      if (match) {
	        return match[0].length;
	      } else {
	        return 0;
	      }
	    };

	    Lexer.prototype.newlineToken = function(offset) {
	      while (this.value() === ';') {
	        this.tokens.pop();
	      }
	      if (this.tag() !== 'TERMINATOR') {
	        this.token('TERMINATOR', '\n', offset, 0);
	      }
	      return this;
	    };

	    Lexer.prototype.suppressNewlines = function() {
	      if (this.value() === '\\') {
	        this.tokens.pop();
	      }
	      return this;
	    };

	    Lexer.prototype.literalToken = function() {
	      var match, prev, ref2, ref3, ref4, ref5, ref6, tag, token, value;
	      if (match = OPERATOR.exec(this.chunk)) {
	        value = match[0];
	        if (CODE.test(value)) {
	          this.tagParameters();
	        }
	      } else {
	        value = this.chunk.charAt(0);
	      }
	      tag = value;
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      if (value === '=' && prev) {
	        if (!prev[1].reserved && (ref3 = prev[1], indexOf.call(JS_FORBIDDEN, ref3) >= 0)) {
	          this.error("reserved word '" + prev[1] + "' can't be assigned", prev[2]);
	        }
	        if ((ref4 = prev[1]) === '||' || ref4 === '&&') {
	          prev[0] = 'COMPOUND_ASSIGN';
	          prev[1] += '=';
	          return value.length;
	        }
	      }
	      if (value === ';') {
	        this.seenFor = false;
	        tag = 'TERMINATOR';
	      } else if (indexOf.call(MATH, value) >= 0) {
	        tag = 'MATH';
	      } else if (indexOf.call(COMPARE, value) >= 0) {
	        tag = 'COMPARE';
	      } else if (indexOf.call(COMPOUND_ASSIGN, value) >= 0) {
	        tag = 'COMPOUND_ASSIGN';
	      } else if (indexOf.call(UNARY, value) >= 0) {
	        tag = 'UNARY';
	      } else if (indexOf.call(UNARY_MATH, value) >= 0) {
	        tag = 'UNARY_MATH';
	      } else if (indexOf.call(SHIFT, value) >= 0) {
	        tag = 'SHIFT';
	      } else if (indexOf.call(LOGIC, value) >= 0 || value === '?' && (prev != null ? prev.spaced : void 0)) {
	        tag = 'LOGIC';
	      } else if (prev && !prev.spaced) {
	        if (value === '(' && (ref5 = prev[0], indexOf.call(CALLABLE, ref5) >= 0)) {
	          if (prev[0] === '?') {
	            prev[0] = 'FUNC_EXIST';
	          }
	          tag = 'CALL_START';
	        } else if (value === '[' && (ref6 = prev[0], indexOf.call(INDEXABLE, ref6) >= 0)) {
	          tag = 'INDEX_START';
	          switch (prev[0]) {
	            case '?':
	              prev[0] = 'INDEX_SOAK';
	          }
	        }
	      }
	      token = this.makeToken(tag, value);
	      switch (value) {
	        case '(':
	        case '{':
	        case '[':
	          this.ends.push({
	            tag: INVERSES[value],
	            origin: token
	          });
	          break;
	        case ')':
	        case '}':
	        case ']':
	          this.pair(value);
	      }
	      this.tokens.push(token);
	      return value.length;
	    };

	    Lexer.prototype.tagParameters = function() {
	      var i, stack, tok, tokens;
	      if (this.tag() !== ')') {
	        return this;
	      }
	      stack = [];
	      tokens = this.tokens;
	      i = tokens.length;
	      tokens[--i][0] = 'PARAM_END';
	      while (tok = tokens[--i]) {
	        switch (tok[0]) {
	          case ')':
	            stack.push(tok);
	            break;
	          case '(':
	          case 'CALL_START':
	            if (stack.length) {
	              stack.pop();
	            } else if (tok[0] === '(') {
	              tok[0] = 'PARAM_START';
	              return this;
	            } else {
	              return this;
	            }
	        }
	      }
	      return this;
	    };

	    Lexer.prototype.closeIndentation = function() {
	      return this.outdentToken(this.indent);
	    };

	    Lexer.prototype.matchWithInterpolations = function(regex, delimiter) {
	      var close, column, firstToken, index, lastToken, line, nested, offsetInChunk, open, ref2, ref3, ref4, str, strPart, tokens;
	      tokens = [];
	      offsetInChunk = delimiter.length;
	      if (this.chunk.slice(0, offsetInChunk) !== delimiter) {
	        return null;
	      }
	      str = this.chunk.slice(offsetInChunk);
	      while (true) {
	        strPart = regex.exec(str)[0];
	        this.validateEscapes(strPart, {
	          isRegex: delimiter.charAt(0) === '/',
	          offsetInChunk: offsetInChunk
	        });
	        tokens.push(this.makeToken('NEOSTRING', strPart, offsetInChunk));
	        str = str.slice(strPart.length);
	        offsetInChunk += strPart.length;
	        if (str.slice(0, 2) !== '#{') {
	          break;
	        }
	        ref2 = this.getLineAndColumnFromChunk(offsetInChunk + 1), line = ref2[0], column = ref2[1];
	        ref3 = new Lexer().tokenize(str.slice(1), {
	          line: line,
	          column: column,
	          untilBalanced: true
	        }), nested = ref3.tokens, index = ref3.index;
	        index += 1;
	        open = nested[0], close = nested[nested.length - 1];
	        open[0] = open[1] = '(';
	        close[0] = close[1] = ')';
	        close.origin = ['', 'end of interpolation', close[2]];
	        if (((ref4 = nested[1]) != null ? ref4[0] : void 0) === 'TERMINATOR') {
	          nested.splice(1, 1);
	        }
	        tokens.push(['TOKENS', nested]);
	        str = str.slice(index);
	        offsetInChunk += index;
	      }
	      if (str.slice(0, delimiter.length) !== delimiter) {
	        this.error("missing " + delimiter, {
	          length: delimiter.length
	        });
	      }
	      firstToken = tokens[0], lastToken = tokens[tokens.length - 1];
	      firstToken[2].first_column -= delimiter.length;
	      lastToken[2].last_column += delimiter.length;
	      if (lastToken[1].length === 0) {
	        lastToken[2].last_column -= 1;
	      }
	      return {
	        tokens: tokens,
	        index: offsetInChunk + delimiter.length
	      };
	    };

	    Lexer.prototype.mergeInterpolationTokens = function(tokens, options, fn) {
	      var converted, firstEmptyStringIndex, firstIndex, i, j, lastToken, len, locationToken, lparen, plusToken, ref2, rparen, tag, token, tokensToPush, value;
	      if (tokens.length > 1) {
	        lparen = this.token('STRING_START', '(', 0, 0);
	      }
	      firstIndex = this.tokens.length;
	      for (i = j = 0, len = tokens.length; j < len; i = ++j) {
	        token = tokens[i];
	        tag = token[0], value = token[1];
	        switch (tag) {
	          case 'TOKENS':
	            if (value.length === 2) {
	              continue;
	            }
	            locationToken = value[0];
	            tokensToPush = value;
	            break;
	          case 'NEOSTRING':
	            converted = fn(token[1], i);
	            if (converted.length === 0) {
	              if (i === 0) {
	                firstEmptyStringIndex = this.tokens.length;
	              } else {
	                continue;
	              }
	            }
	            if (i === 2 && (firstEmptyStringIndex != null)) {
	              this.tokens.splice(firstEmptyStringIndex, 2);
	            }
	            token[0] = 'STRING';
	            token[1] = this.makeDelimitedLiteral(converted, options);
	            locationToken = token;
	            tokensToPush = [token];
	        }
	        if (this.tokens.length > firstIndex) {
	          plusToken = this.token('+', '+');
	          plusToken[2] = {
	            first_line: locationToken[2].first_line,
	            first_column: locationToken[2].first_column,
	            last_line: locationToken[2].first_line,
	            last_column: locationToken[2].first_column
	          };
	        }
	        (ref2 = this.tokens).push.apply(ref2, tokensToPush);
	      }
	      if (lparen) {
	        lastToken = tokens[tokens.length - 1];
	        lparen.origin = [
	          'STRING', null, {
	            first_line: lparen[2].first_line,
	            first_column: lparen[2].first_column,
	            last_line: lastToken[2].last_line,
	            last_column: lastToken[2].last_column
	          }
	        ];
	        rparen = this.token('STRING_END', ')');
	        return rparen[2] = {
	          first_line: lastToken[2].last_line,
	          first_column: lastToken[2].last_column,
	          last_line: lastToken[2].last_line,
	          last_column: lastToken[2].last_column
	        };
	      }
	    };

	    Lexer.prototype.pair = function(tag) {
	      var lastIndent, prev, ref2, ref3, wanted;
	      ref2 = this.ends, prev = ref2[ref2.length - 1];
	      if (tag !== (wanted = prev != null ? prev.tag : void 0)) {
	        if ('OUTDENT' !== wanted) {
	          this.error("unmatched " + tag);
	        }
	        ref3 = this.indents, lastIndent = ref3[ref3.length - 1];
	        this.outdentToken(lastIndent, true);
	        return this.pair(tag);
	      }
	      return this.ends.pop();
	    };

	    Lexer.prototype.getLineAndColumnFromChunk = function(offset) {
	      var column, lastLine, lineCount, ref2, string;
	      if (offset === 0) {
	        return [this.chunkLine, this.chunkColumn];
	      }
	      if (offset >= this.chunk.length) {
	        string = this.chunk;
	      } else {
	        string = this.chunk.slice(0, +(offset - 1) + 1 || 9e9);
	      }
	      lineCount = count(string, '\n');
	      column = this.chunkColumn;
	      if (lineCount > 0) {
	        ref2 = string.split('\n'), lastLine = ref2[ref2.length - 1];
	        column = lastLine.length;
	      } else {
	        column += string.length;
	      }
	      return [this.chunkLine + lineCount, column];
	    };

	    Lexer.prototype.makeToken = function(tag, value, offsetInChunk, length) {
	      var lastCharacter, locationData, ref2, ref3, token;
	      if (offsetInChunk == null) {
	        offsetInChunk = 0;
	      }
	      if (length == null) {
	        length = value.length;
	      }
	      locationData = {};
	      ref2 = this.getLineAndColumnFromChunk(offsetInChunk), locationData.first_line = ref2[0], locationData.first_column = ref2[1];
	      lastCharacter = Math.max(0, length - 1);
	      ref3 = this.getLineAndColumnFromChunk(offsetInChunk + lastCharacter), locationData.last_line = ref3[0], locationData.last_column = ref3[1];
	      token = [tag, value, locationData];
	      return token;
	    };

	    Lexer.prototype.token = function(tag, value, offsetInChunk, length, origin) {
	      var token;
	      token = this.makeToken(tag, value, offsetInChunk, length);
	      if (origin) {
	        token.origin = origin;
	      }
	      this.tokens.push(token);
	      return token;
	    };

	    Lexer.prototype.tag = function() {
	      var ref2, token;
	      ref2 = this.tokens, token = ref2[ref2.length - 1];
	      return token != null ? token[0] : void 0;
	    };

	    Lexer.prototype.value = function() {
	      var ref2, token;
	      ref2 = this.tokens, token = ref2[ref2.length - 1];
	      return token != null ? token[1] : void 0;
	    };

	    Lexer.prototype.unfinished = function() {
	      var ref2;
	      return LINE_CONTINUER.test(this.chunk) || ((ref2 = this.tag()) === '\\' || ref2 === '.' || ref2 === '?.' || ref2 === '?::' || ref2 === 'UNARY' || ref2 === 'MATH' || ref2 === 'UNARY_MATH' || ref2 === '+' || ref2 === '-' || ref2 === 'YIELD' || ref2 === '**' || ref2 === 'SHIFT' || ref2 === 'RELATION' || ref2 === 'COMPARE' || ref2 === 'LOGIC' || ref2 === 'THROW' || ref2 === 'EXTENDS');
	    };

	    Lexer.prototype.formatString = function(str) {
	      return str.replace(STRING_OMIT, '$1');
	    };

	    Lexer.prototype.formatHeregex = function(str) {
	      return str.replace(HEREGEX_OMIT, '$1$2');
	    };

	    Lexer.prototype.validateEscapes = function(str, options) {
	      var before, hex, invalidEscape, match, message, octal, ref2, unicode;
	      if (options == null) {
	        options = {};
	      }
	      match = INVALID_ESCAPE.exec(str);
	      if (!match) {
	        return;
	      }
	      match[0], before = match[1], octal = match[2], hex = match[3], unicode = match[4];
	      if (options.isRegex && octal && octal.charAt(0) !== '0') {
	        return;
	      }
	      message = octal ? "octal escape sequences are not allowed" : "invalid escape sequence";
	      invalidEscape = "\\" + (octal || hex || unicode);
	      return this.error(message + " " + invalidEscape, {
	        offset: ((ref2 = options.offsetInChunk) != null ? ref2 : 0) + match.index + before.length,
	        length: invalidEscape.length
	      });
	    };

	    Lexer.prototype.makeDelimitedLiteral = function(body, options) {
	      var regex;
	      if (options == null) {
	        options = {};
	      }
	      if (body === '' && options.delimiter === '/') {
	        body = '(?:)';
	      }
	      regex = RegExp("(\\\\\\\\)|(\\\\0(?=[1-7]))|\\\\?(" + options.delimiter + ")|\\\\?(?:(\\n)|(\\r)|(\\u2028)|(\\u2029))|(\\\\.)", "g");
	      body = body.replace(regex, function(match, backslash, nul, delimiter, lf, cr, ls, ps, other) {
	        switch (false) {
	          case !backslash:
	            if (options.double) {
	              return backslash + backslash;
	            } else {
	              return backslash;
	            }
	          case !nul:
	            return '\\x00';
	          case !delimiter:
	            return "\\" + delimiter;
	          case !lf:
	            return '\\n';
	          case !cr:
	            return '\\r';
	          case !ls:
	            return '\\u2028';
	          case !ps:
	            return '\\u2029';
	          case !other:
	            if (options.double) {
	              return "\\" + other;
	            } else {
	              return other;
	            }
	        }
	      });
	      return "" + options.delimiter + body + options.delimiter;
	    };

	    Lexer.prototype.error = function(message, options) {
	      var first_column, first_line, location, ref2, ref3, ref4;
	      if (options == null) {
	        options = {};
	      }
	      location = 'first_line' in options ? options : ((ref3 = this.getLineAndColumnFromChunk((ref2 = options.offset) != null ? ref2 : 0), first_line = ref3[0], first_column = ref3[1], ref3), {
	        first_line: first_line,
	        first_column: first_column,
	        last_column: first_column + ((ref4 = options.length) != null ? ref4 : 1) - 1
	      });
	      return throwSyntaxError(message, location);
	    };

	    return Lexer;

	  })();

	  JS_KEYWORDS = ['true', 'false', 'null', 'this', 'new', 'delete', 'typeof', 'in', 'instanceof', 'return', 'throw', 'break', 'continue', 'debugger', 'yield', 'if', 'else', 'switch', 'for', 'while', 'do', 'try', 'catch', 'finally', 'class', 'extends', 'super'];

	  COFFEE_KEYWORDS = ['undefined', 'then', 'unless', 'until', 'loop', 'of', 'by', 'when'];

	  COFFEE_ALIAS_MAP = {
	    and: '&&',
	    or: '||',
	    is: '==',
	    isnt: '!=',
	    not: '!',
	    yes: 'true',
	    no: 'false',
	    on: 'true',
	    off: 'false'
	  };

	  COFFEE_ALIASES = (function() {
	    var results;
	    results = [];
	    for (key in COFFEE_ALIAS_MAP) {
	      results.push(key);
	    }
	    return results;
	  })();

	  COFFEE_KEYWORDS = COFFEE_KEYWORDS.concat(COFFEE_ALIASES);

	  RESERVED = ['case', 'default', 'function', 'var', 'void', 'with', 'const', 'let', 'enum', 'export', 'import', 'native', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'static'];

	  STRICT_PROSCRIBED = ['arguments', 'eval', 'yield*'];

	  JS_FORBIDDEN = JS_KEYWORDS.concat(RESERVED).concat(STRICT_PROSCRIBED);

	  exports.RESERVED = RESERVED.concat(JS_KEYWORDS).concat(COFFEE_KEYWORDS).concat(STRICT_PROSCRIBED);

	  exports.STRICT_PROSCRIBED = STRICT_PROSCRIBED;

	  BOM = 65279;

	  IDENTIFIER = /^(?!\d)((?:(?!\s)[$\w\x7f-\uffff])+)([^\n\S]*:(?!:))?/;

	  NUMBER = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i;

	  OPERATOR = /^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*\/%])\2=?|\?(\.|::)|\.{2,3})/;

	  WHITESPACE = /^[^\n\S]+/;

	  COMMENT = /^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:\s*#(?!##[^#]).*)+/;

	  CODE = /^[-=]>/;

	  MULTI_DENT = /^(?:\n[^\n\S]*)+/;

	  JSTOKEN = /^`[^\\`]*(?:\\.[^\\`]*)*`/;

	  STRING_START = /^(?:'''|"""|'|")/;

	  STRING_SINGLE = /^(?:[^\\']|\\[\s\S])*/;

	  STRING_DOUBLE = /^(?:[^\\"#]|\\[\s\S]|\#(?!\{))*/;

	  HEREDOC_SINGLE = /^(?:[^\\']|\\[\s\S]|'(?!''))*/;

	  HEREDOC_DOUBLE = /^(?:[^\\"#]|\\[\s\S]|"(?!"")|\#(?!\{))*/;

	  STRING_OMIT = /((?:\\\\)+)|\\[^\S\n]*\n\s*/g;

	  SIMPLE_STRING_OMIT = /\s*\n\s*/g;

	  HEREDOC_INDENT = /\n+([^\n\S]*)(?=\S)/g;

	  REGEX = /^\/(?!\/)((?:[^[\/\n\\]|\\[^\n]|\[(?:\\[^\n]|[^\]\n\\])*])*)(\/)?/;

	  REGEX_FLAGS = /^\w*/;

	  VALID_FLAGS = /^(?!.*(.).*\1)[imgy]*$/;

	  HEREGEX = /^(?:[^\\\/#]|\\[\s\S]|\/(?!\/\/)|\#(?!\{))*/;

	  HEREGEX_OMIT = /((?:\\\\)+)|\\(\s)|\s+(?:#.*)?/g;

	  REGEX_ILLEGAL = /^(\/|\/{3}\s*)(\*)/;

	  POSSIBLY_DIVISION = /^\/=?\s/;

	  HERECOMMENT_ILLEGAL = /\*\//;

	  LINE_CONTINUER = /^\s*(?:,|\??\.(?![.\d])|::)/;

	  INVALID_ESCAPE = /((?:^|[^\\])(?:\\\\)*)\\(?:(0[0-7]|[1-7])|(x(?![\da-fA-F]{2}).{0,2})|(u(?![\da-fA-F]{4}).{0,4}))/;

	  LEADING_BLANK_LINE = /^[^\n\S]*\n/;

	  TRAILING_BLANK_LINE = /\n[^\n\S]*$/;

	  TRAILING_SPACES = /\s+$/;

	  COMPOUND_ASSIGN = ['-=', '+=', '/=', '*=', '%=', '||=', '&&=', '?=', '<<=', '>>=', '>>>=', '&=', '^=', '|=', '**=', '//=', '%%='];

	  UNARY = ['NEW', 'TYPEOF', 'DELETE', 'DO'];

	  UNARY_MATH = ['!', '~'];

	  LOGIC = ['&&', '||', '&', '|', '^'];

	  SHIFT = ['<<', '>>', '>>>'];

	  COMPARE = ['==', '!=', '<', '>', '<=', '>='];

	  MATH = ['*', '/', '%', '//', '%%'];

	  RELATION = ['IN', 'OF', 'INSTANCEOF'];

	  BOOL = ['TRUE', 'FALSE'];

	  CALLABLE = ['IDENTIFIER', ')', ']', '?', '@', 'THIS', 'SUPER'];

	  INDEXABLE = CALLABLE.concat(['NUMBER', 'STRING', 'STRING_END', 'REGEX', 'REGEX_END', 'BOOL', 'NULL', 'UNDEFINED', '}', '::']);

	  NOT_REGEX = INDEXABLE.concat(['++', '--']);

	  LINE_BREAK = ['INDENT', 'OUTDENT', 'TERMINATOR'];

	  INDENTABLE_CLOSERS = [')', '}', ']'];

	}).call(this);


/***/ },
/* 9 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var BALANCED_PAIRS, CALL_CLOSERS, EXPRESSION_CLOSE, EXPRESSION_END, EXPRESSION_START, IMPLICIT_CALL, IMPLICIT_END, IMPLICIT_FUNC, IMPLICIT_UNSPACED_CALL, INVERSES, LINEBREAKS, SINGLE_CLOSERS, SINGLE_LINERS, generate, k, left, len, ref, rite,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    slice = [].slice;

	  generate = function(tag, value, origin) {
	    var tok;
	    tok = [tag, value];
	    tok.generated = true;
	    if (origin) {
	      tok.origin = origin;
	    }
	    return tok;
	  };

	  exports.Rewriter = (function() {
	    function Rewriter() {}

	    Rewriter.prototype.rewrite = function(tokens1) {
	      this.tokens = tokens1;
	      this.removeLeadingNewlines();
	      this.closeOpenCalls();
	      this.closeOpenIndexes();
	      this.normalizeLines();
	      this.tagPostfixConditionals();
	      this.addImplicitBracesAndParens();
	      this.addLocationDataToGeneratedTokens();
	      return this.tokens;
	    };

	    Rewriter.prototype.scanTokens = function(block) {
	      var i, token, tokens;
	      tokens = this.tokens;
	      i = 0;
	      while (token = tokens[i]) {
	        i += block.call(this, token, i, tokens);
	      }
	      return true;
	    };

	    Rewriter.prototype.detectEnd = function(i, condition, action) {
	      var levels, ref, ref1, token, tokens;
	      tokens = this.tokens;
	      levels = 0;
	      while (token = tokens[i]) {
	        if (levels === 0 && condition.call(this, token, i)) {
	          return action.call(this, token, i);
	        }
	        if (!token || levels < 0) {
	          return action.call(this, token, i - 1);
	        }
	        if (ref = token[0], indexOf.call(EXPRESSION_START, ref) >= 0) {
	          levels += 1;
	        } else if (ref1 = token[0], indexOf.call(EXPRESSION_END, ref1) >= 0) {
	          levels -= 1;
	        }
	        i += 1;
	      }
	      return i - 1;
	    };

	    Rewriter.prototype.removeLeadingNewlines = function() {
	      var i, k, len, ref, tag;
	      ref = this.tokens;
	      for (i = k = 0, len = ref.length; k < len; i = ++k) {
	        tag = ref[i][0];
	        if (tag !== 'TERMINATOR') {
	          break;
	        }
	      }
	      if (i) {
	        return this.tokens.splice(0, i);
	      }
	    };

	    Rewriter.prototype.closeOpenCalls = function() {
	      var action, condition;
	      condition = function(token, i) {
	        var ref;
	        return ((ref = token[0]) === ')' || ref === 'CALL_END') || token[0] === 'OUTDENT' && this.tag(i - 1) === ')';
	      };
	      action = function(token, i) {
	        return this.tokens[token[0] === 'OUTDENT' ? i - 1 : i][0] = 'CALL_END';
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] === 'CALL_START') {
	          this.detectEnd(i + 1, condition, action);
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.closeOpenIndexes = function() {
	      var action, condition;
	      condition = function(token, i) {
	        var ref;
	        return (ref = token[0]) === ']' || ref === 'INDEX_END';
	      };
	      action = function(token, i) {
	        return token[0] = 'INDEX_END';
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] === 'INDEX_START') {
	          this.detectEnd(i + 1, condition, action);
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.indexOfTag = function() {
	      var fuzz, i, j, k, pattern, ref, ref1;
	      i = arguments[0], pattern = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	      fuzz = 0;
	      for (j = k = 0, ref = pattern.length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
	        while (this.tag(i + j + fuzz) === 'HERECOMMENT') {
	          fuzz += 2;
	        }
	        if (pattern[j] == null) {
	          continue;
	        }
	        if (typeof pattern[j] === 'string') {
	          pattern[j] = [pattern[j]];
	        }
	        if (ref1 = this.tag(i + j + fuzz), indexOf.call(pattern[j], ref1) < 0) {
	          return -1;
	        }
	      }
	      return i + j + fuzz - 1;
	    };

	    Rewriter.prototype.looksObjectish = function(j) {
	      var end, index;
	      if (this.indexOfTag(j, '@', null, ':') > -1 || this.indexOfTag(j, null, ':') > -1) {
	        return true;
	      }
	      index = this.indexOfTag(j, EXPRESSION_START);
	      if (index > -1) {
	        end = null;
	        this.detectEnd(index + 1, (function(token) {
	          var ref;
	          return ref = token[0], indexOf.call(EXPRESSION_END, ref) >= 0;
	        }), (function(token, i) {
	          return end = i;
	        }));
	        if (this.tag(end + 1) === ':') {
	          return true;
	        }
	      }
	      return false;
	    };

	    Rewriter.prototype.findTagsBackwards = function(i, tags) {
	      var backStack, ref, ref1, ref2, ref3, ref4, ref5;
	      backStack = [];
	      while (i >= 0 && (backStack.length || (ref2 = this.tag(i), indexOf.call(tags, ref2) < 0) && ((ref3 = this.tag(i), indexOf.call(EXPRESSION_START, ref3) < 0) || this.tokens[i].generated) && (ref4 = this.tag(i), indexOf.call(LINEBREAKS, ref4) < 0))) {
	        if (ref = this.tag(i), indexOf.call(EXPRESSION_END, ref) >= 0) {
	          backStack.push(this.tag(i));
	        }
	        if ((ref1 = this.tag(i), indexOf.call(EXPRESSION_START, ref1) >= 0) && backStack.length) {
	          backStack.pop();
	        }
	        i -= 1;
	      }
	      return ref5 = this.tag(i), indexOf.call(tags, ref5) >= 0;
	    };

	    Rewriter.prototype.addImplicitBracesAndParens = function() {
	      var stack, start;
	      stack = [];
	      start = null;
	      return this.scanTokens(function(token, i, tokens) {
	        var endImplicitCall, endImplicitObject, forward, inImplicit, inImplicitCall, inImplicitControl, inImplicitObject, newLine, nextTag, offset, prevTag, prevToken, ref, ref1, ref2, ref3, ref4, ref5, s, sameLine, stackIdx, stackTag, stackTop, startIdx, startImplicitCall, startImplicitObject, startsLine, tag;
	        tag = token[0];
	        prevTag = (prevToken = i > 0 ? tokens[i - 1] : [])[0];
	        nextTag = (i < tokens.length - 1 ? tokens[i + 1] : [])[0];
	        stackTop = function() {
	          return stack[stack.length - 1];
	        };
	        startIdx = i;
	        forward = function(n) {
	          return i - startIdx + n;
	        };
	        inImplicit = function() {
	          var ref, ref1;
	          return (ref = stackTop()) != null ? (ref1 = ref[2]) != null ? ref1.ours : void 0 : void 0;
	        };
	        inImplicitCall = function() {
	          var ref;
	          return inImplicit() && ((ref = stackTop()) != null ? ref[0] : void 0) === '(';
	        };
	        inImplicitObject = function() {
	          var ref;
	          return inImplicit() && ((ref = stackTop()) != null ? ref[0] : void 0) === '{';
	        };
	        inImplicitControl = function() {
	          var ref;
	          return inImplicit && ((ref = stackTop()) != null ? ref[0] : void 0) === 'CONTROL';
	        };
	        startImplicitCall = function(j) {
	          var idx;
	          idx = j != null ? j : i;
	          stack.push([
	            '(', idx, {
	              ours: true
	            }
	          ]);
	          tokens.splice(idx, 0, generate('CALL_START', '('));
	          if (j == null) {
	            return i += 1;
	          }
	        };
	        endImplicitCall = function() {
	          stack.pop();
	          tokens.splice(i, 0, generate('CALL_END', ')', ['', 'end of input', token[2]]));
	          return i += 1;
	        };
	        startImplicitObject = function(j, startsLine) {
	          var idx, val;
	          if (startsLine == null) {
	            startsLine = true;
	          }
	          idx = j != null ? j : i;
	          stack.push([
	            '{', idx, {
	              sameLine: true,
	              startsLine: startsLine,
	              ours: true
	            }
	          ]);
	          val = new String('{');
	          val.generated = true;
	          tokens.splice(idx, 0, generate('{', val, token));
	          if (j == null) {
	            return i += 1;
	          }
	        };
	        endImplicitObject = function(j) {
	          j = j != null ? j : i;
	          stack.pop();
	          tokens.splice(j, 0, generate('}', '}', token));
	          return i += 1;
	        };
	        if (inImplicitCall() && (tag === 'IF' || tag === 'TRY' || tag === 'FINALLY' || tag === 'CATCH' || tag === 'CLASS' || tag === 'SWITCH')) {
	          stack.push([
	            'CONTROL', i, {
	              ours: true
	            }
	          ]);
	          return forward(1);
	        }
	        if (tag === 'INDENT' && inImplicit()) {
	          if (prevTag !== '=>' && prevTag !== '->' && prevTag !== '[' && prevTag !== '(' && prevTag !== ',' && prevTag !== '{' && prevTag !== 'TRY' && prevTag !== 'ELSE' && prevTag !== '=') {
	            while (inImplicitCall()) {
	              endImplicitCall();
	            }
	          }
	          if (inImplicitControl()) {
	            stack.pop();
	          }
	          stack.push([tag, i]);
	          return forward(1);
	        }
	        if (indexOf.call(EXPRESSION_START, tag) >= 0) {
	          stack.push([tag, i]);
	          return forward(1);
	        }
	        if (indexOf.call(EXPRESSION_END, tag) >= 0) {
	          while (inImplicit()) {
	            if (inImplicitCall()) {
	              endImplicitCall();
	            } else if (inImplicitObject()) {
	              endImplicitObject();
	            } else {
	              stack.pop();
	            }
	          }
	          start = stack.pop();
	        }
	        if ((indexOf.call(IMPLICIT_FUNC, tag) >= 0 && token.spaced || tag === '?' && i > 0 && !tokens[i - 1].spaced) && (indexOf.call(IMPLICIT_CALL, nextTag) >= 0 || indexOf.call(IMPLICIT_UNSPACED_CALL, nextTag) >= 0 && !((ref = tokens[i + 1]) != null ? ref.spaced : void 0) && !((ref1 = tokens[i + 1]) != null ? ref1.newLine : void 0))) {
	          if (tag === '?') {
	            tag = token[0] = 'FUNC_EXIST';
	          }
	          startImplicitCall(i + 1);
	          return forward(2);
	        }
	        if (indexOf.call(IMPLICIT_FUNC, tag) >= 0 && this.indexOfTag(i + 1, 'INDENT', null, ':') > -1 && !this.findTagsBackwards(i, ['CLASS', 'EXTENDS', 'IF', 'CATCH', 'SWITCH', 'LEADING_WHEN', 'FOR', 'WHILE', 'UNTIL'])) {
	          startImplicitCall(i + 1);
	          stack.push(['INDENT', i + 2]);
	          return forward(3);
	        }
	        if (tag === ':') {
	          s = (function() {
	            var ref2;
	            switch (false) {
	              case ref2 = this.tag(i - 1), indexOf.call(EXPRESSION_END, ref2) < 0:
	                return start[1];
	              case this.tag(i - 2) !== '@':
	                return i - 2;
	              default:
	                return i - 1;
	            }
	          }).call(this);
	          while (this.tag(s - 2) === 'HERECOMMENT') {
	            s -= 2;
	          }
	          this.insideForDeclaration = nextTag === 'FOR';
	          startsLine = s === 0 || (ref2 = this.tag(s - 1), indexOf.call(LINEBREAKS, ref2) >= 0) || tokens[s - 1].newLine;
	          if (stackTop()) {
	            ref3 = stackTop(), stackTag = ref3[0], stackIdx = ref3[1];
	            if ((stackTag === '{' || stackTag === 'INDENT' && this.tag(stackIdx - 1) === '{') && (startsLine || this.tag(s - 1) === ',' || this.tag(s - 1) === '{')) {
	              return forward(1);
	            }
	          }
	          startImplicitObject(s, !!startsLine);
	          return forward(2);
	        }
	        if (inImplicitObject() && indexOf.call(LINEBREAKS, tag) >= 0) {
	          stackTop()[2].sameLine = false;
	        }
	        newLine = prevTag === 'OUTDENT' || prevToken.newLine;
	        if (indexOf.call(IMPLICIT_END, tag) >= 0 || indexOf.call(CALL_CLOSERS, tag) >= 0 && newLine) {
	          while (inImplicit()) {
	            ref4 = stackTop(), stackTag = ref4[0], stackIdx = ref4[1], (ref5 = ref4[2], sameLine = ref5.sameLine, startsLine = ref5.startsLine);
	            if (inImplicitCall() && prevTag !== ',') {
	              endImplicitCall();
	            } else if (inImplicitObject() && !this.insideForDeclaration && sameLine && tag !== 'TERMINATOR' && prevTag !== ':') {
	              endImplicitObject();
	            } else if (inImplicitObject() && tag === 'TERMINATOR' && prevTag !== ',' && !(startsLine && this.looksObjectish(i + 1))) {
	              if (nextTag === 'HERECOMMENT') {
	                return forward(1);
	              }
	              endImplicitObject();
	            } else {
	              break;
	            }
	          }
	        }
	        if (tag === ',' && !this.looksObjectish(i + 1) && inImplicitObject() && !this.insideForDeclaration && (nextTag !== 'TERMINATOR' || !this.looksObjectish(i + 2))) {
	          offset = nextTag === 'OUTDENT' ? 1 : 0;
	          while (inImplicitObject()) {
	            endImplicitObject(i + offset);
	          }
	        }
	        return forward(1);
	      });
	    };

	    Rewriter.prototype.addLocationDataToGeneratedTokens = function() {
	      return this.scanTokens(function(token, i, tokens) {
	        var column, line, nextLocation, prevLocation, ref, ref1;
	        if (token[2]) {
	          return 1;
	        }
	        if (!(token.generated || token.explicit)) {
	          return 1;
	        }
	        if (token[0] === '{' && (nextLocation = (ref = tokens[i + 1]) != null ? ref[2] : void 0)) {
	          line = nextLocation.first_line, column = nextLocation.first_column;
	        } else if (prevLocation = (ref1 = tokens[i - 1]) != null ? ref1[2] : void 0) {
	          line = prevLocation.last_line, column = prevLocation.last_column;
	        } else {
	          line = column = 0;
	        }
	        token[2] = {
	          first_line: line,
	          first_column: column,
	          last_line: line,
	          last_column: column
	        };
	        return 1;
	      });
	    };

	    Rewriter.prototype.normalizeLines = function() {
	      var action, condition, indent, outdent, starter;
	      starter = indent = outdent = null;
	      condition = function(token, i) {
	        var ref, ref1, ref2, ref3;
	        return token[1] !== ';' && (ref = token[0], indexOf.call(SINGLE_CLOSERS, ref) >= 0) && !(token[0] === 'TERMINATOR' && (ref1 = this.tag(i + 1), indexOf.call(EXPRESSION_CLOSE, ref1) >= 0)) && !(token[0] === 'ELSE' && starter !== 'THEN') && !(((ref2 = token[0]) === 'CATCH' || ref2 === 'FINALLY') && (starter === '->' || starter === '=>')) || (ref3 = token[0], indexOf.call(CALL_CLOSERS, ref3) >= 0) && this.tokens[i - 1].newLine;
	      };
	      action = function(token, i) {
	        return this.tokens.splice((this.tag(i - 1) === ',' ? i - 1 : i), 0, outdent);
	      };
	      return this.scanTokens(function(token, i, tokens) {
	        var j, k, ref, ref1, ref2, tag;
	        tag = token[0];
	        if (tag === 'TERMINATOR') {
	          if (this.tag(i + 1) === 'ELSE' && this.tag(i - 1) !== 'OUTDENT') {
	            tokens.splice.apply(tokens, [i, 1].concat(slice.call(this.indentation())));
	            return 1;
	          }
	          if (ref = this.tag(i + 1), indexOf.call(EXPRESSION_CLOSE, ref) >= 0) {
	            tokens.splice(i, 1);
	            return 0;
	          }
	        }
	        if (tag === 'CATCH') {
	          for (j = k = 1; k <= 2; j = ++k) {
	            if (!((ref1 = this.tag(i + j)) === 'OUTDENT' || ref1 === 'TERMINATOR' || ref1 === 'FINALLY')) {
	              continue;
	            }
	            tokens.splice.apply(tokens, [i + j, 0].concat(slice.call(this.indentation())));
	            return 2 + j;
	          }
	        }
	        if (indexOf.call(SINGLE_LINERS, tag) >= 0 && this.tag(i + 1) !== 'INDENT' && !(tag === 'ELSE' && this.tag(i + 1) === 'IF')) {
	          starter = tag;
	          ref2 = this.indentation(tokens[i]), indent = ref2[0], outdent = ref2[1];
	          if (starter === 'THEN') {
	            indent.fromThen = true;
	          }
	          tokens.splice(i + 1, 0, indent);
	          this.detectEnd(i + 2, condition, action);
	          if (tag === 'THEN') {
	            tokens.splice(i, 1);
	          }
	          return 1;
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.tagPostfixConditionals = function() {
	      var action, condition, original;
	      original = null;
	      condition = function(token, i) {
	        var prevTag, tag;
	        tag = token[0];
	        prevTag = this.tokens[i - 1][0];
	        return tag === 'TERMINATOR' || (tag === 'INDENT' && indexOf.call(SINGLE_LINERS, prevTag) < 0);
	      };
	      action = function(token, i) {
	        if (token[0] !== 'INDENT' || (token.generated && !token.fromThen)) {
	          return original[0] = 'POST_' + original[0];
	        }
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] !== 'IF') {
	          return 1;
	        }
	        original = token;
	        this.detectEnd(i + 1, condition, action);
	        return 1;
	      });
	    };

	    Rewriter.prototype.indentation = function(origin) {
	      var indent, outdent;
	      indent = ['INDENT', 2];
	      outdent = ['OUTDENT', 2];
	      if (origin) {
	        indent.generated = outdent.generated = true;
	        indent.origin = outdent.origin = origin;
	      } else {
	        indent.explicit = outdent.explicit = true;
	      }
	      return [indent, outdent];
	    };

	    Rewriter.prototype.generate = generate;

	    Rewriter.prototype.tag = function(i) {
	      var ref;
	      return (ref = this.tokens[i]) != null ? ref[0] : void 0;
	    };

	    return Rewriter;

	  })();

	  BALANCED_PAIRS = [['(', ')'], ['[', ']'], ['{', '}'], ['INDENT', 'OUTDENT'], ['CALL_START', 'CALL_END'], ['PARAM_START', 'PARAM_END'], ['INDEX_START', 'INDEX_END'], ['STRING_START', 'STRING_END'], ['REGEX_START', 'REGEX_END']];

	  exports.INVERSES = INVERSES = {};

	  EXPRESSION_START = [];

	  EXPRESSION_END = [];

	  for (k = 0, len = BALANCED_PAIRS.length; k < len; k++) {
	    ref = BALANCED_PAIRS[k], left = ref[0], rite = ref[1];
	    EXPRESSION_START.push(INVERSES[rite] = left);
	    EXPRESSION_END.push(INVERSES[left] = rite);
	  }

	  EXPRESSION_CLOSE = ['CATCH', 'THEN', 'ELSE', 'FINALLY'].concat(EXPRESSION_END);

	  IMPLICIT_FUNC = ['IDENTIFIER', 'SUPER', ')', 'CALL_END', ']', 'INDEX_END', '@', 'THIS'];

	  IMPLICIT_CALL = ['IDENTIFIER', 'NUMBER', 'STRING', 'STRING_START', 'JS', 'REGEX', 'REGEX_START', 'NEW', 'PARAM_START', 'CLASS', 'IF', 'TRY', 'SWITCH', 'THIS', 'BOOL', 'NULL', 'UNDEFINED', 'UNARY', 'YIELD', 'UNARY_MATH', 'SUPER', 'THROW', '@', '->', '=>', '[', '(', '{', '--', '++'];

	  IMPLICIT_UNSPACED_CALL = ['+', '-'];

	  IMPLICIT_END = ['POST_IF', 'FOR', 'WHILE', 'UNTIL', 'WHEN', 'BY', 'LOOP', 'TERMINATOR'];

	  SINGLE_LINERS = ['ELSE', '->', '=>', 'TRY', 'FINALLY', 'THEN'];

	  SINGLE_CLOSERS = ['TERMINATOR', 'CATCH', 'FINALLY', 'ELSE', 'OUTDENT', 'LEADING_WHEN'];

	  LINEBREAKS = ['TERMINATOR', 'INDENT', 'OUTDENT'];

	  CALL_CLOSERS = ['.', '?.', '::', '?::'];

	}).call(this);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.9.1
	(function() {
	  var buildLocationData, extend, flatten, ref, repeat, syntaxErrorToString;

	  exports.starts = function(string, literal, start) {
	    return literal === string.substr(start, literal.length);
	  };

	  exports.ends = function(string, literal, back) {
	    var len;
	    len = literal.length;
	    return literal === string.substr(string.length - len - (back || 0), len);
	  };

	  exports.repeat = repeat = function(str, n) {
	    var res;
	    res = '';
	    while (n > 0) {
	      if (n & 1) {
	        res += str;
	      }
	      n >>>= 1;
	      str += str;
	    }
	    return res;
	  };

	  exports.compact = function(array) {
	    var i, item, len1, results;
	    results = [];
	    for (i = 0, len1 = array.length; i < len1; i++) {
	      item = array[i];
	      if (item) {
	        results.push(item);
	      }
	    }
	    return results;
	  };

	  exports.count = function(string, substr) {
	    var num, pos;
	    num = pos = 0;
	    if (!substr.length) {
	      return 1 / 0;
	    }
	    while (pos = 1 + string.indexOf(substr, pos)) {
	      num++;
	    }
	    return num;
	  };

	  exports.merge = function(options, overrides) {
	    return extend(extend({}, options), overrides);
	  };

	  extend = exports.extend = function(object, properties) {
	    var key, val;
	    for (key in properties) {
	      val = properties[key];
	      object[key] = val;
	    }
	    return object;
	  };

	  exports.flatten = flatten = function(array) {
	    var element, flattened, i, len1;
	    flattened = [];
	    for (i = 0, len1 = array.length; i < len1; i++) {
	      element = array[i];
	      if (element instanceof Array) {
	        flattened = flattened.concat(flatten(element));
	      } else {
	        flattened.push(element);
	      }
	    }
	    return flattened;
	  };

	  exports.del = function(obj, key) {
	    var val;
	    val = obj[key];
	    delete obj[key];
	    return val;
	  };

	  exports.some = (ref = Array.prototype.some) != null ? ref : function(fn) {
	    var e, i, len1;
	    for (i = 0, len1 = this.length; i < len1; i++) {
	      e = this[i];
	      if (fn(e)) {
	        return true;
	      }
	    }
	    return false;
	  };

	  exports.invertLiterate = function(code) {
	    var line, lines, maybe_code;
	    maybe_code = true;
	    lines = (function() {
	      var i, len1, ref1, results;
	      ref1 = code.split('\n');
	      results = [];
	      for (i = 0, len1 = ref1.length; i < len1; i++) {
	        line = ref1[i];
	        if (maybe_code && /^([ ]{4}|[ ]{0,3}\t)/.test(line)) {
	          results.push(line);
	        } else if (maybe_code = /^\s*$/.test(line)) {
	          results.push(line);
	        } else {
	          results.push('# ' + line);
	        }
	      }
	      return results;
	    })();
	    return lines.join('\n');
	  };

	  buildLocationData = function(first, last) {
	    if (!last) {
	      return first;
	    } else {
	      return {
	        first_line: first.first_line,
	        first_column: first.first_column,
	        last_line: last.last_line,
	        last_column: last.last_column
	      };
	    }
	  };

	  exports.addLocationDataFn = function(first, last) {
	    return function(obj) {
	      if (((typeof obj) === 'object') && (!!obj['updateLocationDataIfMissing'])) {
	        obj.updateLocationDataIfMissing(buildLocationData(first, last));
	      }
	      return obj;
	    };
	  };

	  exports.locationDataToString = function(obj) {
	    var locationData;
	    if (("2" in obj) && ("first_line" in obj[2])) {
	      locationData = obj[2];
	    } else if ("first_line" in obj) {
	      locationData = obj;
	    }
	    if (locationData) {
	      return ((locationData.first_line + 1) + ":" + (locationData.first_column + 1) + "-") + ((locationData.last_line + 1) + ":" + (locationData.last_column + 1));
	    } else {
	      return "No location data";
	    }
	  };

	  exports.baseFileName = function(file, stripExt, useWinPathSep) {
	    var parts, pathSep;
	    if (stripExt == null) {
	      stripExt = false;
	    }
	    if (useWinPathSep == null) {
	      useWinPathSep = false;
	    }
	    pathSep = useWinPathSep ? /\\|\// : /\//;
	    parts = file.split(pathSep);
	    file = parts[parts.length - 1];
	    if (!(stripExt && file.indexOf('.') >= 0)) {
	      return file;
	    }
	    parts = file.split('.');
	    parts.pop();
	    if (parts[parts.length - 1] === 'coffee' && parts.length > 1) {
	      parts.pop();
	    }
	    return parts.join('.');
	  };

	  exports.isCoffee = function(file) {
	    return /\.((lit)?coffee|coffee\.md)$/.test(file);
	  };

	  exports.isLiterate = function(file) {
	    return /\.(litcoffee|coffee\.md)$/.test(file);
	  };

	  exports.throwSyntaxError = function(message, location) {
	    var error;
	    error = new SyntaxError(message);
	    error.location = location;
	    error.toString = syntaxErrorToString;
	    error.stack = error.toString();
	    throw error;
	  };

	  exports.updateSyntaxError = function(error, code, filename) {
	    if (error.toString === syntaxErrorToString) {
	      error.code || (error.code = code);
	      error.filename || (error.filename = filename);
	      error.stack = error.toString();
	    }
	    return error;
	  };

	  syntaxErrorToString = function() {
	    var codeLine, colorize, colorsEnabled, end, filename, first_column, first_line, last_column, last_line, marker, ref1, ref2, start;
	    if (!(this.code && this.location)) {
	      return Error.prototype.toString.call(this);
	    }
	    ref1 = this.location, first_line = ref1.first_line, first_column = ref1.first_column, last_line = ref1.last_line, last_column = ref1.last_column;
	    if (last_line == null) {
	      last_line = first_line;
	    }
	    if (last_column == null) {
	      last_column = first_column;
	    }
	    filename = this.filename || '[stdin]';
	    codeLine = this.code.split('\n')[first_line];
	    start = first_column;
	    end = first_line === last_line ? last_column + 1 : codeLine.length;
	    marker = codeLine.slice(0, start).replace(/[^\s]/g, ' ') + repeat('^', end - start);
	    if (typeof process !== "undefined" && process !== null) {
	      colorsEnabled = process.stdout.isTTY && !process.env.NODE_DISABLE_COLORS;
	    }
	    if ((ref2 = this.colorful) != null ? ref2 : colorsEnabled) {
	      colorize = function(str) {
	        return "\x1B[1;31m" + str + "\x1B[0m";
	      };
	      codeLine = codeLine.slice(0, start) + colorize(codeLine.slice(start, end)) + codeLine.slice(end);
	      marker = colorize(marker);
	    }
	    return filename + ":" + (first_line + 1) + ":" + (first_column + 1) + ": error: " + this.message + "\n" + codeLine + "\n" + marker;
	  };

	  exports.nameWhitespaceCharacter = function(string) {
	    switch (string) {
	      case ' ':
	        return 'space';
	      case '\n':
	        return 'newline';
	      case '\r':
	        return 'carriage return';
	      case '\t':
	        return 'tab';
	      default:
	        return string;
	    }
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.15 */
	/*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var parser = (function(){
	var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,20],$V1=[1,75],$V2=[1,71],$V3=[1,76],$V4=[1,77],$V5=[1,73],$V6=[1,74],$V7=[1,50],$V8=[1,52],$V9=[1,53],$Va=[1,54],$Vb=[1,55],$Vc=[1,45],$Vd=[1,46],$Ve=[1,27],$Vf=[1,60],$Vg=[1,61],$Vh=[1,70],$Vi=[1,43],$Vj=[1,26],$Vk=[1,58],$Vl=[1,59],$Vm=[1,57],$Vn=[1,38],$Vo=[1,44],$Vp=[1,56],$Vq=[1,65],$Vr=[1,66],$Vs=[1,67],$Vt=[1,68],$Vu=[1,42],$Vv=[1,64],$Vw=[1,29],$Vx=[1,30],$Vy=[1,31],$Vz=[1,32],$VA=[1,33],$VB=[1,34],$VC=[1,35],$VD=[1,78],$VE=[1,6,26,34,108],$VF=[1,88],$VG=[1,81],$VH=[1,80],$VI=[1,79],$VJ=[1,82],$VK=[1,83],$VL=[1,84],$VM=[1,85],$VN=[1,86],$VO=[1,87],$VP=[1,91],$VQ=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],$VR=[1,97],$VS=[1,98],$VT=[1,99],$VU=[1,100],$VV=[1,102],$VW=[1,103],$VX=[1,96],$VY=[2,112],$VZ=[1,6,25,26,34,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],$V_=[2,79],$V$=[1,108],$V01=[2,58],$V11=[1,112],$V21=[1,117],$V31=[1,118],$V41=[1,120],$V51=[1,6,25,26,34,46,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],$V61=[2,76],$V71=[1,6,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],$V81=[1,155],$V91=[1,157],$Va1=[1,152],$Vb1=[1,6,25,26,34,46,55,60,63,72,73,74,75,77,79,80,84,86,90,91,92,97,99,108,110,111,112,116,117,132,135,136,139,140,141,142,143,144,145,146,147,148],$Vc1=[2,95],$Vd1=[1,6,25,26,34,49,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],$Ve1=[1,6,25,26,34,46,49,55,60,63,72,73,74,75,77,79,80,84,86,90,91,92,97,99,108,110,111,112,116,117,123,124,132,135,136,139,140,141,142,143,144,145,146,147,148],$Vf1=[1,206],$Vg1=[1,205],$Vh1=[1,6,25,26,34,38,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],$Vi1=[2,56],$Vj1=[1,216],$Vk1=[6,25,26,55,60],$Vl1=[6,25,26,46,55,60,63],$Vm1=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,142,144,145,146,147],$Vn1=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132],$Vo1=[72,73,74,75,77,80,90,91],$Vp1=[1,235],$Vq1=[2,133],$Vr1=[1,6,25,26,34,46,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,123,124,132,135,136,141,142,143,144,145,146,147],$Vs1=[1,244],$Vt1=[6,25,26,60,92,97],$Vu1=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,117,132],$Vv1=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,111,117,132],$Vw1=[123,124],$Vx1=[60,123,124],$Vy1=[1,255],$Vz1=[6,25,26,60,84],$VA1=[6,25,26,49,60,84],$VB1=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,144,145,146,147],$VC1=[11,28,30,32,33,36,37,40,41,42,43,44,51,52,53,57,58,79,82,85,89,94,95,96,102,106,107,110,112,114,116,125,131,133,134,135,136,137,139,140],$VD1=[2,122],$VE1=[6,25,26],$VF1=[2,57],$VG1=[1,268],$VH1=[1,269],$VI1=[1,6,25,26,34,55,60,63,79,84,92,97,99,104,105,108,110,111,112,116,117,127,129,132,135,136,141,142,143,144,145,146,147],$VJ1=[26,127,129],$VK1=[1,6,26,34,55,60,63,79,84,92,97,99,108,111,117,132],$VL1=[2,71],$VM1=[1,291],$VN1=[1,292],$VO1=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,127,132,135,136,141,142,143,144,145,146,147],$VP1=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,112,116,117,132],$VQ1=[1,303],$VR1=[1,304],$VS1=[6,25,26,60],$VT1=[1,6,25,26,34,55,60,63,79,84,92,97,99,104,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],$VU1=[25,60];
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"Root":3,"Body":4,"Line":5,"TERMINATOR":6,"Expression":7,"Statement":8,"Return":9,"Comment":10,"STATEMENT":11,"Value":12,"Invocation":13,"Code":14,"Operation":15,"Assign":16,"If":17,"Try":18,"While":19,"For":20,"Switch":21,"Class":22,"Throw":23,"Block":24,"INDENT":25,"OUTDENT":26,"Identifier":27,"IDENTIFIER":28,"AlphaNumeric":29,"NUMBER":30,"String":31,"STRING":32,"STRING_START":33,"STRING_END":34,"Regex":35,"REGEX":36,"REGEX_START":37,"REGEX_END":38,"Literal":39,"JS":40,"DEBUGGER":41,"UNDEFINED":42,"NULL":43,"BOOL":44,"Assignable":45,"=":46,"AssignObj":47,"ObjAssignable":48,":":49,"ThisProperty":50,"RETURN":51,"HERECOMMENT":52,"PARAM_START":53,"ParamList":54,"PARAM_END":55,"FuncGlyph":56,"->":57,"=>":58,"OptComma":59,",":60,"Param":61,"ParamVar":62,"...":63,"Array":64,"Object":65,"Splat":66,"SimpleAssignable":67,"Accessor":68,"Parenthetical":69,"Range":70,"This":71,".":72,"?.":73,"::":74,"?::":75,"Index":76,"INDEX_START":77,"IndexValue":78,"INDEX_END":79,"INDEX_SOAK":80,"Slice":81,"{":82,"AssignList":83,"}":84,"CLASS":85,"EXTENDS":86,"OptFuncExist":87,"Arguments":88,"SUPER":89,"FUNC_EXIST":90,"CALL_START":91,"CALL_END":92,"ArgList":93,"THIS":94,"@":95,"[":96,"]":97,"RangeDots":98,"..":99,"Arg":100,"SimpleArgs":101,"TRY":102,"Catch":103,"FINALLY":104,"CATCH":105,"THROW":106,"(":107,")":108,"WhileSource":109,"WHILE":110,"WHEN":111,"UNTIL":112,"Loop":113,"LOOP":114,"ForBody":115,"FOR":116,"BY":117,"ForStart":118,"ForSource":119,"ForVariables":120,"OWN":121,"ForValue":122,"FORIN":123,"FOROF":124,"SWITCH":125,"Whens":126,"ELSE":127,"When":128,"LEADING_WHEN":129,"IfBlock":130,"IF":131,"POST_IF":132,"UNARY":133,"UNARY_MATH":134,"-":135,"+":136,"YIELD":137,"FROM":138,"--":139,"++":140,"?":141,"MATH":142,"**":143,"SHIFT":144,"COMPARE":145,"LOGIC":146,"RELATION":147,"COMPOUND_ASSIGN":148,"$accept":0,"$end":1},
	terminals_: {2:"error",6:"TERMINATOR",11:"STATEMENT",25:"INDENT",26:"OUTDENT",28:"IDENTIFIER",30:"NUMBER",32:"STRING",33:"STRING_START",34:"STRING_END",36:"REGEX",37:"REGEX_START",38:"REGEX_END",40:"JS",41:"DEBUGGER",42:"UNDEFINED",43:"NULL",44:"BOOL",46:"=",49:":",51:"RETURN",52:"HERECOMMENT",53:"PARAM_START",55:"PARAM_END",57:"->",58:"=>",60:",",63:"...",72:".",73:"?.",74:"::",75:"?::",77:"INDEX_START",79:"INDEX_END",80:"INDEX_SOAK",82:"{",84:"}",85:"CLASS",86:"EXTENDS",89:"SUPER",90:"FUNC_EXIST",91:"CALL_START",92:"CALL_END",94:"THIS",95:"@",96:"[",97:"]",99:"..",102:"TRY",104:"FINALLY",105:"CATCH",106:"THROW",107:"(",108:")",110:"WHILE",111:"WHEN",112:"UNTIL",114:"LOOP",116:"FOR",117:"BY",121:"OWN",123:"FORIN",124:"FOROF",125:"SWITCH",127:"ELSE",129:"LEADING_WHEN",131:"IF",132:"POST_IF",133:"UNARY",134:"UNARY_MATH",135:"-",136:"+",137:"YIELD",138:"FROM",139:"--",140:"++",141:"?",142:"MATH",143:"**",144:"SHIFT",145:"COMPARE",146:"LOGIC",147:"RELATION",148:"COMPOUND_ASSIGN"},
	productions_: [0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[8,1],[8,1],[8,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[24,2],[24,3],[27,1],[29,1],[29,1],[31,1],[31,3],[35,1],[35,3],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[16,3],[16,4],[16,5],[47,1],[47,3],[47,5],[47,1],[48,1],[48,1],[48,1],[9,2],[9,1],[10,1],[14,5],[14,2],[56,1],[56,1],[59,0],[59,1],[54,0],[54,1],[54,3],[54,4],[54,6],[61,1],[61,2],[61,3],[61,1],[62,1],[62,1],[62,1],[62,1],[66,2],[67,1],[67,2],[67,2],[67,1],[45,1],[45,1],[45,1],[12,1],[12,1],[12,1],[12,1],[12,1],[68,2],[68,2],[68,2],[68,2],[68,1],[68,1],[76,3],[76,2],[78,1],[78,1],[65,4],[83,0],[83,1],[83,3],[83,4],[83,6],[22,1],[22,2],[22,3],[22,4],[22,2],[22,3],[22,4],[22,5],[13,3],[13,3],[13,1],[13,2],[87,0],[87,1],[88,2],[88,4],[71,1],[71,1],[50,2],[64,2],[64,4],[98,1],[98,1],[70,5],[81,3],[81,2],[81,2],[81,1],[93,1],[93,3],[93,4],[93,4],[93,6],[100,1],[100,1],[100,1],[101,1],[101,3],[18,2],[18,3],[18,4],[18,5],[103,3],[103,3],[103,2],[23,2],[69,3],[69,5],[109,2],[109,4],[109,2],[109,4],[19,2],[19,2],[19,2],[19,1],[113,2],[113,2],[20,2],[20,2],[20,2],[115,2],[115,4],[115,2],[118,2],[118,3],[122,1],[122,1],[122,1],[122,1],[120,1],[120,3],[119,2],[119,2],[119,4],[119,4],[119,4],[119,6],[119,6],[21,5],[21,7],[21,4],[21,6],[126,1],[126,2],[128,3],[128,4],[130,3],[130,5],[17,1],[17,3],[17,3],[17,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,5],[15,4],[15,3]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */

	var $0 = $$.length - 1;
	switch (yystate) {
	case 1:
	return this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Block);
	break;
	case 2:
	return this.$ = $$[$0];
	break;
	case 3:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(yy.Block.wrap([$$[$0]]));
	break;
	case 4:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].push($$[$0]));
	break;
	case 5:
	this.$ = $$[$0-1];
	break;
	case 6: case 7: case 8: case 9: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 27: case 32: case 34: case 45: case 46: case 47: case 48: case 56: case 57: case 67: case 68: case 69: case 70: case 75: case 76: case 79: case 83: case 89: case 133: case 134: case 136: case 166: case 167: case 183: case 189:
	this.$ = $$[$0];
	break;
	case 10: case 25: case 26: case 28: case 30: case 33: case 35:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Literal($$[$0]));
	break;
	case 23:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Block);
	break;
	case 24: case 31: case 90:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-1]);
	break;
	case 29: case 146:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Parens($$[$0-1]));
	break;
	case 36:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Undefined);
	break;
	case 37:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Null);
	break;
	case 38:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Bool($$[$0]));
	break;
	case 39:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign($$[$0-2], $$[$0]));
	break;
	case 40:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Assign($$[$0-3], $$[$0]));
	break;
	case 41:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign($$[$0-4], $$[$0-1]));
	break;
	case 42: case 72: case 77: case 78: case 80: case 81: case 82: case 168: case 169:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Value($$[$0]));
	break;
	case 43:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])), $$[$0], 'object'));
	break;
	case 44:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-4])(new yy.Value($$[$0-4])), $$[$0-1], 'object'));
	break;
	case 49:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Return($$[$0]));
	break;
	case 50:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Return);
	break;
	case 51:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Comment($$[$0]));
	break;
	case 52:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Code($$[$0-3], $$[$0], $$[$0-1]));
	break;
	case 53:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Code([], $$[$0], $$[$0-1]));
	break;
	case 54:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('func');
	break;
	case 55:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('boundfunc');
	break;
	case 58: case 95:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])([]);
	break;
	case 59: case 96: case 128: case 170:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])([$$[$0]]);
	break;
	case 60: case 97: case 129:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].concat($$[$0]));
	break;
	case 61: case 98: case 130:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])($$[$0-3].concat($$[$0]));
	break;
	case 62: case 99: case 132:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])($$[$0-5].concat($$[$0-2]));
	break;
	case 63:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Param($$[$0]));
	break;
	case 64:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Param($$[$0-1], null, true));
	break;
	case 65:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Param($$[$0-2], $$[$0]));
	break;
	case 66: case 135:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Expansion);
	break;
	case 71:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Splat($$[$0-1]));
	break;
	case 73:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].add($$[$0]));
	break;
	case 74:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Value($$[$0-1], [].concat($$[$0])));
	break;
	case 84:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Access($$[$0]));
	break;
	case 85:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Access($$[$0], 'soak'));
	break;
	case 86:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Access(new yy.Literal('prototype'))), yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))]);
	break;
	case 87:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Access(new yy.Literal('prototype'), 'soak')), yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))]);
	break;
	case 88:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Access(new yy.Literal('prototype')));
	break;
	case 91:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(yy.extend($$[$0], {
	          soak: true
	        }));
	break;
	case 92:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Index($$[$0]));
	break;
	case 93:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Slice($$[$0]));
	break;
	case 94:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Obj($$[$0-2], $$[$0-3].generated));
	break;
	case 100:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Class);
	break;
	case 101:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Class(null, null, $$[$0]));
	break;
	case 102:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Class(null, $$[$0]));
	break;
	case 103:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Class(null, $$[$0-1], $$[$0]));
	break;
	case 104:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Class($$[$0]));
	break;
	case 105:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Class($$[$0-1], null, $$[$0]));
	break;
	case 106:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Class($$[$0-2], $$[$0]));
	break;
	case 107:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Class($$[$0-3], $$[$0-1], $$[$0]));
	break;
	case 108: case 109:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Call($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 110:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Call('super', [new yy.Splat(new yy.Literal('arguments'))]));
	break;
	case 111:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Call('super', $$[$0]));
	break;
	case 112:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(false);
	break;
	case 113:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(true);
	break;
	case 114:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([]);
	break;
	case 115: case 131:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])($$[$0-2]);
	break;
	case 116: case 117:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Value(new yy.Literal('this')));
	break;
	case 118:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Value(yy.addLocationDataFn(_$[$0-1])(new yy.Literal('this')), [yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))], 'this'));
	break;
	case 119:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Arr([]));
	break;
	case 120:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Arr($$[$0-2]));
	break;
	case 121:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('inclusive');
	break;
	case 122:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('exclusive');
	break;
	case 123:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Range($$[$0-3], $$[$0-1], $$[$0-2]));
	break;
	case 124:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Range($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 125:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Range($$[$0-1], null, $$[$0]));
	break;
	case 126:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Range(null, $$[$0], $$[$0-1]));
	break;
	case 127:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Range(null, null, $$[$0]));
	break;
	case 137:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([].concat($$[$0-2], $$[$0]));
	break;
	case 138:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Try($$[$0]));
	break;
	case 139:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Try($$[$0-1], $$[$0][0], $$[$0][1]));
	break;
	case 140:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Try($$[$0-2], null, null, $$[$0]));
	break;
	case 141:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Try($$[$0-3], $$[$0-2][0], $$[$0-2][1], $$[$0]));
	break;
	case 142:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([$$[$0-1], $$[$0]]);
	break;
	case 143:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Value($$[$0-1])), $$[$0]]);
	break;
	case 144:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([null, $$[$0]]);
	break;
	case 145:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Throw($$[$0]));
	break;
	case 147:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Parens($$[$0-2]));
	break;
	case 148:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While($$[$0]));
	break;
	case 149:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.While($$[$0-2], {
	          guard: $$[$0]
	        }));
	break;
	case 150:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While($$[$0], {
	          invert: true
	        }));
	break;
	case 151:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.While($$[$0-2], {
	          invert: true,
	          guard: $$[$0]
	        }));
	break;
	case 152:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].addBody($$[$0]));
	break;
	case 153: case 154:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0].addBody(yy.addLocationDataFn(_$[$0-1])(yy.Block.wrap([$$[$0-1]]))));
	break;
	case 155:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])($$[$0]);
	break;
	case 156:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While(yy.addLocationDataFn(_$[$0-1])(new yy.Literal('true'))).addBody($$[$0]));
	break;
	case 157:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While(yy.addLocationDataFn(_$[$0-1])(new yy.Literal('true'))).addBody(yy.addLocationDataFn(_$[$0])(yy.Block.wrap([$$[$0]]))));
	break;
	case 158: case 159:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.For($$[$0-1], $$[$0]));
	break;
	case 160:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.For($$[$0], $$[$0-1]));
	break;
	case 161:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: yy.addLocationDataFn(_$[$0])(new yy.Value($$[$0]))
	        });
	break;
	case 162:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])),
	          step: $$[$0]
	        });
	break;
	case 163:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])((function () {
	        $$[$0].own = $$[$0-1].own;
	        $$[$0].name = $$[$0-1][0];
	        $$[$0].index = $$[$0-1][1];
	        return $$[$0];
	      }()));
	break;
	case 164:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0]);
	break;
	case 165:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])((function () {
	        $$[$0].own = true;
	        return $$[$0];
	      }()));
	break;
	case 171:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([$$[$0-2], $$[$0]]);
	break;
	case 172:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: $$[$0]
	        });
	break;
	case 173:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: $$[$0],
	          object: true
	        });
	break;
	case 174:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          guard: $$[$0]
	        });
	break;
	case 175:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          guard: $$[$0],
	          object: true
	        });
	break;
	case 176:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          step: $$[$0]
	        });
	break;
	case 177:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])({
	          source: $$[$0-4],
	          guard: $$[$0-2],
	          step: $$[$0]
	        });
	break;
	case 178:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])({
	          source: $$[$0-4],
	          step: $$[$0-2],
	          guard: $$[$0]
	        });
	break;
	case 179:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Switch($$[$0-3], $$[$0-1]));
	break;
	case 180:
	this.$ = yy.addLocationDataFn(_$[$0-6], _$[$0])(new yy.Switch($$[$0-5], $$[$0-3], $$[$0-1]));
	break;
	case 181:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Switch(null, $$[$0-1]));
	break;
	case 182:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])(new yy.Switch(null, $$[$0-3], $$[$0-1]));
	break;
	case 184:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].concat($$[$0]));
	break;
	case 185:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([[$$[$0-1], $$[$0]]]);
	break;
	case 186:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])([[$$[$0-2], $$[$0-1]]]);
	break;
	case 187:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0-1], $$[$0], {
	          type: $$[$0-2]
	        }));
	break;
	case 188:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])($$[$0-4].addElse(yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0-1], $$[$0], {
	          type: $$[$0-2]
	        }))));
	break;
	case 190:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].addElse($$[$0]));
	break;
	case 191: case 192:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0], yy.addLocationDataFn(_$[$0-2])(yy.Block.wrap([$$[$0-2]])), {
	          type: $$[$0-1],
	          statement: true
	        }));
	break;
	case 193: case 194: case 197: case 198:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op($$[$0-1], $$[$0]));
	break;
	case 195:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('-', $$[$0]));
	break;
	case 196:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('+', $$[$0]));
	break;
	case 199:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op($$[$0-2].concat($$[$0-1]), $$[$0]));
	break;
	case 200:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('--', $$[$0]));
	break;
	case 201:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('++', $$[$0]));
	break;
	case 202:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('--', $$[$0-1], null, true));
	break;
	case 203:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('++', $$[$0-1], null, true));
	break;
	case 204:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Existence($$[$0-1]));
	break;
	case 205:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op('+', $$[$0-2], $$[$0]));
	break;
	case 206:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op('-', $$[$0-2], $$[$0]));
	break;
	case 207: case 208: case 209: case 210: case 211:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op($$[$0-1], $$[$0-2], $$[$0]));
	break;
	case 212:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])((function () {
	        if ($$[$0-1].charAt(0) === '!') {
	          return new yy.Op($$[$0-1].slice(1), $$[$0-2], $$[$0]).invert();
	        } else {
	          return new yy.Op($$[$0-1], $$[$0-2], $$[$0]);
	        }
	      }()));
	break;
	case 213:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 214:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign($$[$0-4], $$[$0-1], $$[$0-3]));
	break;
	case 215:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Assign($$[$0-3], $$[$0], $$[$0-2]));
	break;
	case 216:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Extends($$[$0-2], $$[$0]));
	break;
	}
	},
	table: [{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{1:[3]},{1:[2,2],6:$VD},o($VE,[2,3]),o($VE,[2,6],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VE,[2,7],{118:69,109:92,115:93,110:$Vq,112:$Vr,116:$Vt,132:$VP}),o($VQ,[2,11],{87:94,68:95,76:101,72:$VR,73:$VS,74:$VT,75:$VU,77:$VV,80:$VW,90:$VX,91:$VY}),o($VQ,[2,12],{76:101,87:104,68:105,72:$VR,73:$VS,74:$VT,75:$VU,77:$VV,80:$VW,90:$VX,91:$VY}),o($VQ,[2,13]),o($VQ,[2,14]),o($VQ,[2,15]),o($VQ,[2,16]),o($VQ,[2,17]),o($VQ,[2,18]),o($VQ,[2,19]),o($VQ,[2,20]),o($VQ,[2,21]),o($VQ,[2,22]),o($VQ,[2,8]),o($VQ,[2,9]),o($VQ,[2,10]),o($VZ,$V_,{46:[1,106]}),o($VZ,[2,80]),o($VZ,[2,81]),o($VZ,[2,82]),o($VZ,[2,83]),o([1,6,25,26,34,38,55,60,63,72,73,74,75,77,79,80,84,90,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],[2,110],{88:107,91:$V$}),o([6,25,55,60],$V01,{54:109,61:110,62:111,27:113,50:114,64:115,65:116,28:$V1,63:$V11,82:$Vh,95:$V21,96:$V31}),{24:119,25:$V41},{7:121,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:123,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:124,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:125,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:127,8:126,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,138:[1,128],139:$VB,140:$VC},{12:130,13:131,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:132,50:63,64:47,65:48,67:129,69:23,70:24,71:25,82:$Vh,89:$Vj,94:$Vk,95:$Vl,96:$Vm,107:$Vp},{12:130,13:131,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:132,50:63,64:47,65:48,67:133,69:23,70:24,71:25,82:$Vh,89:$Vj,94:$Vk,95:$Vl,96:$Vm,107:$Vp},o($V51,$V61,{86:[1,137],139:[1,134],140:[1,135],148:[1,136]}),o($VQ,[2,189],{127:[1,138]}),{24:139,25:$V41},{24:140,25:$V41},o($VQ,[2,155]),{24:141,25:$V41},{7:142,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,143],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($V71,[2,100],{39:22,69:23,70:24,71:25,64:47,65:48,29:49,35:51,27:62,50:63,31:72,12:130,13:131,45:132,24:144,67:146,25:$V41,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,82:$Vh,86:[1,145],89:$Vj,94:$Vk,95:$Vl,96:$Vm,107:$Vp}),{7:147,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,141,142,143,144,145,146,147],[2,50],{12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,69:23,70:24,71:25,56:28,67:36,130:37,109:39,113:40,115:41,64:47,65:48,29:49,35:51,27:62,50:63,118:69,31:72,8:122,7:148,11:$V0,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,51:$Vc,52:$Vd,53:$Ve,57:$Vf,58:$Vg,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,114:$Vs,125:$Vu,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC}),o($VQ,[2,51]),o($V51,[2,77]),o($V51,[2,78]),o($VZ,[2,32]),o($VZ,[2,33]),o($VZ,[2,34]),o($VZ,[2,35]),o($VZ,[2,36]),o($VZ,[2,37]),o($VZ,[2,38]),{4:149,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,150],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:151,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,63:$V91,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,93:153,94:$Vk,95:$Vl,96:$Vm,97:$Va1,100:154,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VZ,[2,116]),o($VZ,[2,117],{27:158,28:$V1}),{25:[2,54]},{25:[2,55]},o($Vb1,[2,72]),o($Vb1,[2,75]),{7:159,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:160,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:161,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:163,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:162,25:$V41,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{27:168,28:$V1,50:169,64:170,65:171,70:164,82:$Vh,95:$V21,96:$Vm,120:165,121:[1,166],122:167},{119:172,123:[1,173],124:[1,174]},o([6,25,60,84],$Vc1,{31:72,83:175,47:176,48:177,10:178,27:179,29:180,50:181,28:$V1,30:$V2,32:$V3,33:$V4,52:$Vd,95:$V21}),o($Vd1,[2,26]),o($Vd1,[2,27]),o($VZ,[2,30]),{12:130,13:182,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:132,50:63,64:47,65:48,67:183,69:23,70:24,71:25,82:$Vh,89:$Vj,94:$Vk,95:$Vl,96:$Vm,107:$Vp},o($Ve1,[2,25]),o($Vd1,[2,28]),{4:184,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VE,[2,5],{7:4,8:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,69:23,70:24,71:25,56:28,67:36,130:37,109:39,113:40,115:41,64:47,65:48,29:49,35:51,27:62,50:63,118:69,31:72,5:185,11:$V0,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,51:$Vc,52:$Vd,53:$Ve,57:$Vf,58:$Vg,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,110:$Vq,112:$Vr,114:$Vs,116:$Vt,125:$Vu,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC}),o($VQ,[2,204]),{7:186,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:187,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:188,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:189,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:190,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:191,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:192,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:193,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:194,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VQ,[2,154]),o($VQ,[2,159]),{7:195,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VQ,[2,153]),o($VQ,[2,158]),{88:196,91:$V$},o($Vb1,[2,73]),{91:[2,113]},{27:197,28:$V1},{27:198,28:$V1},o($Vb1,[2,88],{27:199,28:$V1}),{27:200,28:$V1},o($Vb1,[2,89]),{7:202,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,63:$Vf1,64:47,65:48,67:36,69:23,70:24,71:25,78:201,81:203,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,98:204,99:$Vg1,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{76:207,77:$VV,80:$VW},{88:208,91:$V$},o($Vb1,[2,74]),{6:[1,210],7:209,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,211],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($Vh1,[2,111]),{7:214,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,63:$V91,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,92:[1,212],93:213,94:$Vk,95:$Vl,96:$Vm,100:154,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o([6,25],$Vi1,{59:217,55:[1,215],60:$Vj1}),o($Vk1,[2,59]),o($Vk1,[2,63],{46:[1,219],63:[1,218]}),o($Vk1,[2,66]),o($Vl1,[2,67]),o($Vl1,[2,68]),o($Vl1,[2,69]),o($Vl1,[2,70]),{27:158,28:$V1},{7:214,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,63:$V91,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,93:153,94:$Vk,95:$Vl,96:$Vm,97:$Va1,100:154,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VQ,[2,53]),{4:221,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[1,220],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,142,143,144,145,146,147],[2,193],{118:69,109:89,115:90,141:$VI}),{109:92,110:$Vq,112:$Vr,115:93,116:$Vt,118:69,132:$VP},o($Vm1,[2,194],{118:69,109:89,115:90,141:$VI,143:$VK}),o($Vm1,[2,195],{118:69,109:89,115:90,141:$VI,143:$VK}),o($Vm1,[2,196],{118:69,109:89,115:90,141:$VI,143:$VK}),o($VQ,[2,197],{118:69,109:92,115:93}),o($Vn1,[2,198],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{7:222,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VQ,[2,200],{72:$V61,73:$V61,74:$V61,75:$V61,77:$V61,80:$V61,90:$V61,91:$V61}),{68:95,72:$VR,73:$VS,74:$VT,75:$VU,76:101,77:$VV,80:$VW,87:94,90:$VX,91:$VY},{68:105,72:$VR,73:$VS,74:$VT,75:$VU,76:101,77:$VV,80:$VW,87:104,90:$VX,91:$VY},o($Vo1,$V_),o($VQ,[2,201],{72:$V61,73:$V61,74:$V61,75:$V61,77:$V61,80:$V61,90:$V61,91:$V61}),o($VQ,[2,202]),o($VQ,[2,203]),{6:[1,225],7:223,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,224],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:226,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{24:227,25:$V41,131:[1,228]},o($VQ,[2,138],{103:229,104:[1,230],105:[1,231]}),o($VQ,[2,152]),o($VQ,[2,160]),{25:[1,232],109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},{126:233,128:234,129:$Vp1},o($VQ,[2,101]),{7:236,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($V71,[2,104],{24:237,25:$V41,72:$V61,73:$V61,74:$V61,75:$V61,77:$V61,80:$V61,90:$V61,91:$V61,86:[1,238]}),o($Vn1,[2,145],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vn1,[2,49],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{6:$VD,108:[1,239]},{4:240,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o([6,25,60,97],$Vq1,{118:69,109:89,115:90,98:241,63:[1,242],99:$Vg1,110:$Vq,112:$Vr,116:$Vt,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vr1,[2,119]),o([6,25,97],$Vi1,{59:243,60:$Vs1}),o($Vt1,[2,128]),{7:214,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,63:$V91,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,93:245,94:$Vk,95:$Vl,96:$Vm,100:154,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($Vt1,[2,134]),o($Vt1,[2,135]),o($Ve1,[2,118]),{24:246,25:$V41,109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},o($Vu1,[2,148],{118:69,109:89,115:90,110:$Vq,111:[1,247],112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vu1,[2,150],{118:69,109:89,115:90,110:$Vq,111:[1,248],112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VQ,[2,156]),o($Vv1,[2,157],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,132,135,136,141,142,143,144,145,146,147],[2,161],{117:[1,249]}),o($Vw1,[2,164]),{27:168,28:$V1,50:169,64:170,65:171,82:$Vh,95:$V21,96:$V31,120:250,122:167},o($Vw1,[2,170],{60:[1,251]}),o($Vx1,[2,166]),o($Vx1,[2,167]),o($Vx1,[2,168]),o($Vx1,[2,169]),o($VQ,[2,163]),{7:252,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:253,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o([6,25,84],$Vi1,{59:254,60:$Vy1}),o($Vz1,[2,96]),o($Vz1,[2,42],{49:[1,256]}),o($Vz1,[2,45]),o($VA1,[2,46]),o($VA1,[2,47]),o($VA1,[2,48]),{38:[1,257],68:105,72:$VR,73:$VS,74:$VT,75:$VU,76:101,77:$VV,80:$VW,87:104,90:$VX,91:$VY},o($Vo1,$V61),{6:$VD,34:[1,258]},o($VE,[2,4]),o($VB1,[2,205],{118:69,109:89,115:90,141:$VI,142:$VJ,143:$VK}),o($VB1,[2,206],{118:69,109:89,115:90,141:$VI,142:$VJ,143:$VK}),o($Vm1,[2,207],{118:69,109:89,115:90,141:$VI,143:$VK}),o($Vm1,[2,208],{118:69,109:89,115:90,141:$VI,143:$VK}),o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,144,145,146,147],[2,209],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK}),o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,145,146],[2,210],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,147:$VO}),o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,146],[2,211],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,147:$VO}),o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,145,146,147],[2,212],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL}),o($Vv1,[2,192],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vv1,[2,191],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vh1,[2,108]),o($Vb1,[2,84]),o($Vb1,[2,85]),o($Vb1,[2,86]),o($Vb1,[2,87]),{79:[1,259]},{63:$Vf1,79:[2,92],98:260,99:$Vg1,109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},{79:[2,93]},{7:261,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,79:[2,127],82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VC1,[2,121]),o($VC1,$VD1),o($Vb1,[2,91]),o($Vh1,[2,109]),o($Vn1,[2,39],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{7:262,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:263,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($Vh1,[2,114]),o([6,25,92],$Vi1,{59:264,60:$Vs1}),o($Vt1,$Vq1,{118:69,109:89,115:90,63:[1,265],110:$Vq,112:$Vr,116:$Vt,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{56:266,57:$Vf,58:$Vg},o($VE1,$VF1,{62:111,27:113,50:114,64:115,65:116,61:267,28:$V1,63:$V11,82:$Vh,95:$V21,96:$V31}),{6:$VG1,25:$VH1},o($Vk1,[2,64]),{7:270,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VI1,[2,23]),{6:$VD,26:[1,271]},o($Vn1,[2,199],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vn1,[2,213],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{7:272,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:273,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($Vn1,[2,216],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VQ,[2,190]),{7:274,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VQ,[2,139],{104:[1,275]}),{24:276,25:$V41},{24:279,25:$V41,27:277,28:$V1,65:278,82:$Vh},{126:280,128:234,129:$Vp1},{26:[1,281],127:[1,282],128:283,129:$Vp1},o($VJ1,[2,183]),{7:285,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,101:284,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VK1,[2,102],{118:69,109:89,115:90,24:286,25:$V41,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VQ,[2,105]),{7:287,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VZ,[2,146]),{6:$VD,26:[1,288]},{7:289,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o([11,28,30,32,33,36,37,40,41,42,43,44,51,52,53,57,58,82,85,89,94,95,96,102,106,107,110,112,114,116,125,131,133,134,135,136,137,139,140],$VD1,{6:$VL1,25:$VL1,60:$VL1,97:$VL1}),{6:$VM1,25:$VN1,97:[1,290]},o([6,25,26,92,97],$VF1,{12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,69:23,70:24,71:25,56:28,67:36,130:37,109:39,113:40,115:41,64:47,65:48,29:49,35:51,27:62,50:63,118:69,31:72,8:122,66:156,7:214,100:293,11:$V0,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,51:$Vc,52:$Vd,53:$Ve,57:$Vf,58:$Vg,63:$V91,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,110:$Vq,112:$Vr,114:$Vs,116:$Vt,125:$Vu,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC}),o($VE1,$Vi1,{59:294,60:$Vs1}),o($VO1,[2,187]),{7:295,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:296,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:297,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($Vw1,[2,165]),{27:168,28:$V1,50:169,64:170,65:171,82:$Vh,95:$V21,96:$V31,122:298},o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,112,116,132],[2,172],{118:69,109:89,115:90,111:[1,299],117:[1,300],135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VP1,[2,173],{118:69,109:89,115:90,111:[1,301],135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{6:$VQ1,25:$VR1,84:[1,302]},o([6,25,26,84],$VF1,{31:72,48:177,10:178,27:179,29:180,50:181,47:305,28:$V1,30:$V2,32:$V3,33:$V4,52:$Vd,95:$V21}),{7:306,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,307],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VZ,[2,31]),o($Vd1,[2,29]),o($Vb1,[2,90]),{7:308,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,79:[2,125],82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{79:[2,126],109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},o($Vn1,[2,40],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{26:[1,309],109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},{6:$VM1,25:$VN1,92:[1,310]},o($Vt1,$VL1),{24:311,25:$V41},o($Vk1,[2,60]),{27:113,28:$V1,50:114,61:312,62:111,63:$V11,64:115,65:116,82:$Vh,95:$V21,96:$V31},o($VS1,$V01,{61:110,62:111,27:113,50:114,64:115,65:116,54:313,28:$V1,63:$V11,82:$Vh,95:$V21,96:$V31}),o($Vk1,[2,65],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VI1,[2,24]),{26:[1,314],109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},o($Vn1,[2,215],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{24:315,25:$V41,109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},{24:316,25:$V41},o($VQ,[2,140]),{24:317,25:$V41},{24:318,25:$V41},o($VT1,[2,144]),{26:[1,319],127:[1,320],128:283,129:$Vp1},o($VQ,[2,181]),{24:321,25:$V41},o($VJ1,[2,184]),{24:322,25:$V41,60:[1,323]},o($VU1,[2,136],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VQ,[2,103]),o($VK1,[2,106],{118:69,109:89,115:90,24:324,25:$V41,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{108:[1,325]},{97:[1,326],109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},o($Vr1,[2,120]),{7:214,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,63:$V91,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,100:327,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:214,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,63:$V91,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,93:328,94:$Vk,95:$Vl,96:$Vm,100:154,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($Vt1,[2,129]),{6:$VM1,25:$VN1,26:[1,329]},o($Vv1,[2,149],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vv1,[2,151],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vv1,[2,162],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vw1,[2,171]),{7:330,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:331,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:332,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($Vr1,[2,94]),{10:178,27:179,28:$V1,29:180,30:$V2,31:72,32:$V3,33:$V4,47:333,48:177,50:181,52:$Vd,95:$V21},o($VS1,$Vc1,{31:72,47:176,48:177,10:178,27:179,29:180,50:181,83:334,28:$V1,30:$V2,32:$V3,33:$V4,52:$Vd,95:$V21}),o($Vz1,[2,97]),o($Vz1,[2,43],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{7:335,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{79:[2,124],109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},o($VQ,[2,41]),o($Vh1,[2,115]),o($VQ,[2,52]),o($Vk1,[2,61]),o($VE1,$Vi1,{59:336,60:$Vj1}),o($VQ,[2,214]),o($VO1,[2,188]),o($VQ,[2,141]),o($VT1,[2,142]),o($VT1,[2,143]),o($VQ,[2,179]),{24:337,25:$V41},{26:[1,338]},o($VJ1,[2,185],{6:[1,339]}),{7:340,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},o($VQ,[2,107]),o($VZ,[2,147]),o($VZ,[2,123]),o($Vt1,[2,130]),o($VE1,$Vi1,{59:341,60:$Vs1}),o($Vt1,[2,131]),o([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,132],[2,174],{118:69,109:89,115:90,117:[1,342],135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($VP1,[2,176],{118:69,109:89,115:90,111:[1,343],135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vn1,[2,175],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vz1,[2,98]),o($VE1,$Vi1,{59:344,60:$Vy1}),{26:[1,345],109:89,110:$Vq,112:$Vr,115:90,116:$Vt,118:69,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO},{6:$VG1,25:$VH1,26:[1,346]},{26:[1,347]},o($VQ,[2,182]),o($VJ1,[2,186]),o($VU1,[2,137],{118:69,109:89,115:90,110:$Vq,112:$Vr,116:$Vt,132:$VF,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),{6:$VM1,25:$VN1,26:[1,348]},{7:349,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{7:350,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,50:63,51:$Vc,52:$Vd,53:$Ve,56:28,57:$Vf,58:$Vg,64:47,65:48,67:36,69:23,70:24,71:25,82:$Vh,85:$Vi,89:$Vj,94:$Vk,95:$Vl,96:$Vm,102:$Vn,106:$Vo,107:$Vp,109:39,110:$Vq,112:$Vr,113:40,114:$Vs,115:41,116:$Vt,118:69,125:$Vu,130:37,131:$Vv,133:$Vw,134:$Vx,135:$Vy,136:$Vz,137:$VA,139:$VB,140:$VC},{6:$VQ1,25:$VR1,26:[1,351]},o($Vz1,[2,44]),o($Vk1,[2,62]),o($VQ,[2,180]),o($Vt1,[2,132]),o($Vn1,[2,177],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vn1,[2,178],{118:69,109:89,115:90,135:$VG,136:$VH,141:$VI,142:$VJ,143:$VK,144:$VL,145:$VM,146:$VN,147:$VO}),o($Vz1,[2,99])],
	defaultActions: {60:[2,54],61:[2,55],96:[2,113],203:[2,93]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    var lexer = Object.create(this.lexer);
	    var sharedState = { yy: {} };
	    for (var k in this.yy) {
	        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	            sharedState.yy[k] = this.yy[k];
	        }
	    }
	    lexer.setInput(input, sharedState.yy);
	    sharedState.yy.lexer = lexer;
	    sharedState.yy.parser = this;
	    if (typeof lexer.yylloc == 'undefined') {
	        lexer.yylloc = {};
	    }
	    var yyloc = lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = lexer.options && lexer.options.ranges;
	    if (typeof sharedState.yy.parseError === 'function') {
	        this.parseError = sharedState.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    _token_stack:
	        function lex() {
	            var token;
	            token = lexer.lex() || EOF;
	            if (typeof token !== 'number') {
	                token = self.symbols_[token] || token;
	            }
	            return token;
	        }
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(lexer.yytext);
	            lstack.push(lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = lexer.yyleng;
	                yytext = lexer.yytext;
	                yylineno = lexer.yylineno;
	                yyloc = lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                sharedState.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};

	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();


	if (true) {
	exports.parser = parser;
	exports.Parser = parser.Parser;
	exports.parse = function () { return parser.parse.apply(parser, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(7).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(12)(module)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var LineMap, SourceMap;

	  LineMap = (function() {
	    function LineMap(line1) {
	      this.line = line1;
	      this.columns = [];
	    }

	    LineMap.prototype.add = function(column, arg, options) {
	      var sourceColumn, sourceLine;
	      sourceLine = arg[0], sourceColumn = arg[1];
	      if (options == null) {
	        options = {};
	      }
	      if (this.columns[column] && options.noReplace) {
	        return;
	      }
	      return this.columns[column] = {
	        line: this.line,
	        column: column,
	        sourceLine: sourceLine,
	        sourceColumn: sourceColumn
	      };
	    };

	    LineMap.prototype.sourceLocation = function(column) {
	      var mapping;
	      while (!((mapping = this.columns[column]) || (column <= 0))) {
	        column--;
	      }
	      return mapping && [mapping.sourceLine, mapping.sourceColumn];
	    };

	    return LineMap;

	  })();

	  SourceMap = (function() {
	    var BASE64_CHARS, VLQ_CONTINUATION_BIT, VLQ_SHIFT, VLQ_VALUE_MASK;

	    function SourceMap() {
	      this.lines = [];
	    }

	    SourceMap.prototype.add = function(sourceLocation, generatedLocation, options) {
	      var base, column, line, lineMap;
	      if (options == null) {
	        options = {};
	      }
	      line = generatedLocation[0], column = generatedLocation[1];
	      lineMap = ((base = this.lines)[line] || (base[line] = new LineMap(line)));
	      return lineMap.add(column, sourceLocation, options);
	    };

	    SourceMap.prototype.sourceLocation = function(arg) {
	      var column, line, lineMap;
	      line = arg[0], column = arg[1];
	      while (!((lineMap = this.lines[line]) || (line <= 0))) {
	        line--;
	      }
	      return lineMap && lineMap.sourceLocation(column);
	    };

	    SourceMap.prototype.generate = function(options, code) {
	      var buffer, i, j, lastColumn, lastSourceColumn, lastSourceLine, len, len1, lineMap, lineNumber, mapping, needComma, ref, ref1, v3, writingline;
	      if (options == null) {
	        options = {};
	      }
	      if (code == null) {
	        code = null;
	      }
	      writingline = 0;
	      lastColumn = 0;
	      lastSourceLine = 0;
	      lastSourceColumn = 0;
	      needComma = false;
	      buffer = "";
	      ref = this.lines;
	      for (lineNumber = i = 0, len = ref.length; i < len; lineNumber = ++i) {
	        lineMap = ref[lineNumber];
	        if (lineMap) {
	          ref1 = lineMap.columns;
	          for (j = 0, len1 = ref1.length; j < len1; j++) {
	            mapping = ref1[j];
	            if (!(mapping)) {
	              continue;
	            }
	            while (writingline < mapping.line) {
	              lastColumn = 0;
	              needComma = false;
	              buffer += ";";
	              writingline++;
	            }
	            if (needComma) {
	              buffer += ",";
	              needComma = false;
	            }
	            buffer += this.encodeVlq(mapping.column - lastColumn);
	            lastColumn = mapping.column;
	            buffer += this.encodeVlq(0);
	            buffer += this.encodeVlq(mapping.sourceLine - lastSourceLine);
	            lastSourceLine = mapping.sourceLine;
	            buffer += this.encodeVlq(mapping.sourceColumn - lastSourceColumn);
	            lastSourceColumn = mapping.sourceColumn;
	            needComma = true;
	          }
	        }
	      }
	      v3 = {
	        version: 3,
	        file: options.generatedFile || '',
	        sourceRoot: options.sourceRoot || '',
	        sources: options.sourceFiles || [''],
	        names: [],
	        mappings: buffer
	      };
	      if (options.inline) {
	        v3.sourcesContent = [code];
	      }
	      return JSON.stringify(v3, null, 2);
	    };

	    VLQ_SHIFT = 5;

	    VLQ_CONTINUATION_BIT = 1 << VLQ_SHIFT;

	    VLQ_VALUE_MASK = VLQ_CONTINUATION_BIT - 1;

	    SourceMap.prototype.encodeVlq = function(value) {
	      var answer, nextChunk, signBit, valueToEncode;
	      answer = '';
	      signBit = value < 0 ? 1 : 0;
	      valueToEncode = (Math.abs(value) << 1) + signBit;
	      while (valueToEncode || !answer) {
	        nextChunk = valueToEncode & VLQ_VALUE_MASK;
	        valueToEncode = valueToEncode >> VLQ_SHIFT;
	        if (valueToEncode) {
	          nextChunk |= VLQ_CONTINUATION_BIT;
	        }
	        answer += this.encodeBase64(nextChunk);
	      }
	      return answer;
	    };

	    BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	    SourceMap.prototype.encodeBase64 = function(value) {
	      return BASE64_CHARS[value] || (function() {
	        throw new Error("Cannot Base64 encode value: " + value);
	      })();
	    };

	    return SourceMap;

	  })();

	  module.exports = SourceMap;

	}).call(this);


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./browser": 15,
		"./browser.js": 15,
		"./cake": 16,
		"./cake.js": 16,
		"./coffee-script": 3,
		"./coffee-script.js": 3,
		"./command": 18,
		"./command.js": 18,
		"./grammar": 29,
		"./grammar.js": 29,
		"./helpers": 10,
		"./helpers.js": 10,
		"./index": 59,
		"./index.js": 59,
		"./lexer": 8,
		"./lexer.js": 8,
		"./nodes": 27,
		"./nodes.js": 27,
		"./optparse": 17,
		"./optparse.js": 17,
		"./parser": 11,
		"./parser.js": 11,
		"./register": 60,
		"./register.js": 60,
		"./repl": 20,
		"./repl.js": 20,
		"./rewriter": 9,
		"./rewriter.js": 9,
		"./scope": 28,
		"./scope.js": 28,
		"./sourcemap": 13,
		"./sourcemap.js": 13
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 14;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var CoffeeScript, compile, runScripts,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  CoffeeScript = __webpack_require__(3);

	  CoffeeScript.require = __webpack_require__(14);

	  compile = CoffeeScript.compile;

	  CoffeeScript["eval"] = function(code, options) {
	    if (options == null) {
	      options = {};
	    }
	    if (options.bare == null) {
	      options.bare = true;
	    }
	    return eval(compile(code, options));
	  };

	  CoffeeScript.run = function(code, options) {
	    if (options == null) {
	      options = {};
	    }
	    options.bare = true;
	    options.shiftLine = true;
	    return Function(compile(code, options))();
	  };

	  if (typeof window === "undefined" || window === null) {
	    return;
	  }

	  if ((typeof btoa !== "undefined" && btoa !== null) && (typeof JSON !== "undefined" && JSON !== null) && (typeof unescape !== "undefined" && unescape !== null) && (typeof encodeURIComponent !== "undefined" && encodeURIComponent !== null)) {
	    compile = function(code, options) {
	      var js, ref, v3SourceMap;
	      if (options == null) {
	        options = {};
	      }
	      options.sourceMap = true;
	      options.inline = true;
	      ref = CoffeeScript.compile(code, options), js = ref.js, v3SourceMap = ref.v3SourceMap;
	      return js + "\n//# sourceMappingURL=data:application/json;base64," + (btoa(unescape(encodeURIComponent(v3SourceMap)))) + "\n//# sourceURL=coffeescript";
	    };
	  }

	  CoffeeScript.load = function(url, callback, options, hold) {
	    var xhr;
	    if (options == null) {
	      options = {};
	    }
	    if (hold == null) {
	      hold = false;
	    }
	    options.sourceFiles = [url];
	    xhr = window.ActiveXObject ? new window.ActiveXObject('Microsoft.XMLHTTP') : new window.XMLHttpRequest();
	    xhr.open('GET', url, true);
	    if ('overrideMimeType' in xhr) {
	      xhr.overrideMimeType('text/plain');
	    }
	    xhr.onreadystatechange = function() {
	      var param, ref;
	      if (xhr.readyState === 4) {
	        if ((ref = xhr.status) === 0 || ref === 200) {
	          param = [xhr.responseText, options];
	          if (!hold) {
	            CoffeeScript.run.apply(CoffeeScript, param);
	          }
	        } else {
	          throw new Error("Could not load " + url);
	        }
	        if (callback) {
	          return callback(param);
	        }
	      }
	    };
	    return xhr.send(null);
	  };

	  runScripts = function() {
	    var coffees, coffeetypes, execute, fn, i, index, j, len, s, script, scripts;
	    scripts = window.document.getElementsByTagName('script');
	    coffeetypes = ['text/coffeescript', 'text/literate-coffeescript'];
	    coffees = (function() {
	      var j, len, ref, results;
	      results = [];
	      for (j = 0, len = scripts.length; j < len; j++) {
	        s = scripts[j];
	        if (ref = s.type, indexOf.call(coffeetypes, ref) >= 0) {
	          results.push(s);
	        }
	      }
	      return results;
	    })();
	    index = 0;
	    execute = function() {
	      var param;
	      param = coffees[index];
	      if (param instanceof Array) {
	        CoffeeScript.run.apply(CoffeeScript, param);
	        index++;
	        return execute();
	      }
	    };
	    fn = function(script, i) {
	      var options;
	      options = {
	        literate: script.type === coffeetypes[1]
	      };
	      if (script.src) {
	        return CoffeeScript.load(script.src, function(param) {
	          coffees[i] = param;
	          return execute();
	        }, options, true);
	      } else {
	        options.sourceFiles = ['embedded'];
	        return coffees[i] = [script.innerHTML, options];
	      }
	    };
	    for (i = j = 0, len = coffees.length; j < len; i = ++j) {
	      script = coffees[i];
	      fn(script, i);
	    }
	    return execute();
	  };

	  if (window.addEventListener) {
	    window.addEventListener('DOMContentLoaded', runScripts, false);
	  } else {
	    window.attachEvent('onload', runScripts);
	  }

	}).call(this);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Generated by CoffeeScript 1.9.1
	(function() {
	  var CoffeeScript, cakefileDirectory, fatalError, fs, helpers, missingTask, oparse, options, optparse, path, printTasks, switches, tasks;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(7);

	  helpers = __webpack_require__(10);

	  optparse = __webpack_require__(17);

	  CoffeeScript = __webpack_require__(3);

	  CoffeeScript.register();

	  tasks = {};

	  options = {};

	  switches = [];

	  oparse = null;

	  helpers.extend(global, {
	    task: function(name, description, action) {
	      var ref;
	      if (!action) {
	        ref = [description, action], action = ref[0], description = ref[1];
	      }
	      return tasks[name] = {
	        name: name,
	        description: description,
	        action: action
	      };
	    },
	    option: function(letter, flag, description) {
	      return switches.push([letter, flag, description]);
	    },
	    invoke: function(name) {
	      if (!tasks[name]) {
	        missingTask(name);
	      }
	      return tasks[name].action(options);
	    }
	  });

	  exports.run = function() {
	    var arg, args, e, i, len, ref, results;
	    global.__originalDirname = fs.realpathSync('.');
	    process.chdir(cakefileDirectory(__originalDirname));
	    args = process.argv.slice(2);
	    CoffeeScript.run(fs.readFileSync('Cakefile').toString(), {
	      filename: 'Cakefile'
	    });
	    oparse = new optparse.OptionParser(switches);
	    if (!args.length) {
	      return printTasks();
	    }
	    try {
	      options = oparse.parse(args);
	    } catch (_error) {
	      e = _error;
	      return fatalError("" + e);
	    }
	    ref = options["arguments"];
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      arg = ref[i];
	      results.push(invoke(arg));
	    }
	    return results;
	  };

	  printTasks = function() {
	    var cakefilePath, desc, name, relative, spaces, task;
	    relative = path.relative || path.resolve;
	    cakefilePath = path.join(relative(__originalDirname, process.cwd()), 'Cakefile');
	    console.log(cakefilePath + " defines the following tasks:\n");
	    for (name in tasks) {
	      task = tasks[name];
	      spaces = 20 - name.length;
	      spaces = spaces > 0 ? Array(spaces + 1).join(' ') : '';
	      desc = task.description ? "# " + task.description : '';
	      console.log("cake " + name + spaces + " " + desc);
	    }
	    if (switches.length) {
	      return console.log(oparse.help());
	    }
	  };

	  fatalError = function(message) {
	    console.error(message + '\n');
	    console.log('To see a list of all tasks/options, run "cake"');
	    return process.exit(1);
	  };

	  missingTask = function(task) {
	    return fatalError("No such task: " + task);
	  };

	  cakefileDirectory = function(dir) {
	    var parent;
	    if (fs.existsSync(path.join(dir, 'Cakefile'))) {
	      return dir;
	    }
	    parent = path.normalize(path.join(dir, '..'));
	    if (parent !== dir) {
	      return cakefileDirectory(parent);
	    }
	    throw new Error("Cakefile not found in " + (process.cwd()));
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var LONG_FLAG, MULTI_FLAG, OPTIONAL, OptionParser, SHORT_FLAG, buildRule, buildRules, normalizeArguments, repeat;

	  repeat = __webpack_require__(10).repeat;

	  exports.OptionParser = OptionParser = (function() {
	    function OptionParser(rules, banner) {
	      this.banner = banner;
	      this.rules = buildRules(rules);
	    }

	    OptionParser.prototype.parse = function(args) {
	      var arg, i, isOption, j, k, len, len1, matchedRule, options, originalArgs, pos, ref, rule, seenNonOptionArg, skippingArgument, value;
	      options = {
	        "arguments": []
	      };
	      skippingArgument = false;
	      originalArgs = args;
	      args = normalizeArguments(args);
	      for (i = j = 0, len = args.length; j < len; i = ++j) {
	        arg = args[i];
	        if (skippingArgument) {
	          skippingArgument = false;
	          continue;
	        }
	        if (arg === '--') {
	          pos = originalArgs.indexOf('--');
	          options["arguments"] = options["arguments"].concat(originalArgs.slice(pos + 1));
	          break;
	        }
	        isOption = !!(arg.match(LONG_FLAG) || arg.match(SHORT_FLAG));
	        seenNonOptionArg = options["arguments"].length > 0;
	        if (!seenNonOptionArg) {
	          matchedRule = false;
	          ref = this.rules;
	          for (k = 0, len1 = ref.length; k < len1; k++) {
	            rule = ref[k];
	            if (rule.shortFlag === arg || rule.longFlag === arg) {
	              value = true;
	              if (rule.hasArgument) {
	                skippingArgument = true;
	                value = args[i + 1];
	              }
	              options[rule.name] = rule.isList ? (options[rule.name] || []).concat(value) : value;
	              matchedRule = true;
	              break;
	            }
	          }
	          if (isOption && !matchedRule) {
	            throw new Error("unrecognized option: " + arg);
	          }
	        }
	        if (seenNonOptionArg || !isOption) {
	          options["arguments"].push(arg);
	        }
	      }
	      return options;
	    };

	    OptionParser.prototype.help = function() {
	      var j, len, letPart, lines, ref, rule, spaces;
	      lines = [];
	      if (this.banner) {
	        lines.unshift(this.banner + "\n");
	      }
	      ref = this.rules;
	      for (j = 0, len = ref.length; j < len; j++) {
	        rule = ref[j];
	        spaces = 15 - rule.longFlag.length;
	        spaces = spaces > 0 ? repeat(' ', spaces) : '';
	        letPart = rule.shortFlag ? rule.shortFlag + ', ' : '    ';
	        lines.push('  ' + letPart + rule.longFlag + spaces + rule.description);
	      }
	      return "\n" + (lines.join('\n')) + "\n";
	    };

	    return OptionParser;

	  })();

	  LONG_FLAG = /^(--\w[\w\-]*)/;

	  SHORT_FLAG = /^(-\w)$/;

	  MULTI_FLAG = /^-(\w{2,})/;

	  OPTIONAL = /\[(\w+(\*?))\]/;

	  buildRules = function(rules) {
	    var j, len, results, tuple;
	    results = [];
	    for (j = 0, len = rules.length; j < len; j++) {
	      tuple = rules[j];
	      if (tuple.length < 3) {
	        tuple.unshift(null);
	      }
	      results.push(buildRule.apply(null, tuple));
	    }
	    return results;
	  };

	  buildRule = function(shortFlag, longFlag, description, options) {
	    var match;
	    if (options == null) {
	      options = {};
	    }
	    match = longFlag.match(OPTIONAL);
	    longFlag = longFlag.match(LONG_FLAG)[1];
	    return {
	      name: longFlag.substr(2),
	      shortFlag: shortFlag,
	      longFlag: longFlag,
	      description: description,
	      hasArgument: !!(match && match[1]),
	      isList: !!(match && match[2])
	    };
	  };

	  normalizeArguments = function(args) {
	    var arg, j, k, l, len, len1, match, ref, result;
	    args = args.slice(0);
	    result = [];
	    for (j = 0, len = args.length; j < len; j++) {
	      arg = args[j];
	      if (match = arg.match(MULTI_FLAG)) {
	        ref = match[1].split('');
	        for (k = 0, len1 = ref.length; k < len1; k++) {
	          l = ref[k];
	          result.push('-' + l);
	        }
	      } else {
	        result.push(arg);
	      }
	    }
	    return result;
	  };

	}).call(this);


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.9.1
	(function() {
	  var BANNER, CoffeeScript, EventEmitter, SWITCHES, compileJoin, compileOptions, compilePath, compileScript, compileStdio, exec, findDirectoryIndex, forkNode, fs, helpers, hidden, joinTimeout, jsToSources, mkdirp, notSources, optionParser, optparse, opts, outputPath, parseOptions, path, printLine, printTokens, printWarn, ref, removeSource, removeSourceDir, silentUnlink, sourceCode, sources, spawn, timeLog, usage, useWinPathSep, version, wait, watch, watchDir, watchedDirs, writeJs,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(7);

	  helpers = __webpack_require__(10);

	  optparse = __webpack_require__(17);

	  CoffeeScript = __webpack_require__(3);

	  ref = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), spawn = ref.spawn, exec = ref.exec;

	  EventEmitter = __webpack_require__(19).EventEmitter;

	  useWinPathSep = path.sep === '\\';

	  helpers.extend(CoffeeScript, new EventEmitter);

	  printLine = function(line) {
	    return process.stdout.write(line + '\n');
	  };

	  printWarn = function(line) {
	    return process.stderr.write(line + '\n');
	  };

	  hidden = function(file) {
	    return /^\.|~$/.test(file);
	  };

	  BANNER = 'Usage: coffee [options] path/to/script.coffee -- [args]\n\nIf called without options, `coffee` will run your script.';

	  SWITCHES = [['-b', '--bare', 'compile without a top-level function wrapper'], ['-c', '--compile', 'compile to JavaScript and save as .js files'], ['-e', '--eval', 'pass a string from the command line as input'], ['-h', '--help', 'display this help message'], ['-i', '--interactive', 'run an interactive CoffeeScript REPL'], ['-j', '--join [FILE]', 'concatenate the source CoffeeScript before compiling'], ['-m', '--map', 'generate source map and save as .js.map files'], ['-n', '--nodes', 'print out the parse tree that the parser produces'], ['--nodejs [ARGS]', 'pass options directly to the "node" binary'], ['--no-header', 'suppress the "Generated by" header'], ['-o', '--output [DIR]', 'set the output directory for compiled JavaScript'], ['-p', '--print', 'print out the compiled JavaScript'], ['-s', '--stdio', 'listen for and compile scripts over stdio'], ['-l', '--literate', 'treat stdio as literate style coffee-script'], ['-t', '--tokens', 'print out the tokens that the lexer/rewriter produce'], ['-v', '--version', 'display the version number'], ['-w', '--watch', 'watch scripts for changes and rerun commands']];

	  opts = {};

	  sources = [];

	  sourceCode = [];

	  notSources = {};

	  watchedDirs = {};

	  optionParser = null;

	  jsToSources = {};

	  exports.run = function() {
	    var i, len, literals, ref1, replCliOpts, results, source;
	    parseOptions();
	    replCliOpts = {
	      useGlobal: true
	    };
	    if (opts.nodejs) {
	      return forkNode();
	    }
	    if (opts.help) {
	      return usage();
	    }
	    if (opts.version) {
	      return version();
	    }
	    if (opts.interactive) {
	      return __webpack_require__(20).start(replCliOpts);
	    }
	    if (opts.stdio) {
	      return compileStdio();
	    }
	    if (opts["eval"]) {
	      return compileScript(null, opts["arguments"][0]);
	    }
	    if (!opts["arguments"].length) {
	      return __webpack_require__(20).start(replCliOpts);
	    }
	    literals = opts.run ? opts["arguments"].splice(1) : [];
	    process.argv = process.argv.slice(0, 2).concat(literals);
	    process.argv[0] = 'coffee';
	    if (opts.output) {
	      opts.output = path.resolve(opts.output);
	    }
	    if (opts.join) {
	      opts.join = path.resolve(opts.join);
	      console.error('\nThe --join option is deprecated and will be removed in a future version.\n\nIf for some reason it\'s necessary to share local variables between files,\nreplace...\n\n    $ coffee --compile --join bundle.js -- a.coffee b.coffee c.coffee\n\nwith...\n\n    $ cat a.coffee b.coffee c.coffee | coffee --compile --stdio > bundle.js\n');
	    }
	    ref1 = opts["arguments"];
	    results = [];
	    for (i = 0, len = ref1.length; i < len; i++) {
	      source = ref1[i];
	      source = path.resolve(source);
	      results.push(compilePath(source, true, source));
	    }
	    return results;
	  };

	  compilePath = function(source, topLevel, base) {
	    var code, err, file, files, i, len, results, stats;
	    if (indexOf.call(sources, source) >= 0 || watchedDirs[source] || !topLevel && (notSources[source] || hidden(source))) {
	      return;
	    }
	    try {
	      stats = fs.statSync(source);
	    } catch (_error) {
	      err = _error;
	      if (err.code === 'ENOENT') {
	        console.error("File not found: " + source);
	        process.exit(1);
	      }
	      throw err;
	    }
	    if (stats.isDirectory()) {
	      if (path.basename(source) === 'node_modules') {
	        notSources[source] = true;
	        return;
	      }
	      if (opts.run) {
	        compilePath(findDirectoryIndex(source), topLevel, base);
	        return;
	      }
	      if (opts.watch) {
	        watchDir(source, base);
	      }
	      try {
	        files = fs.readdirSync(source);
	      } catch (_error) {
	        err = _error;
	        if (err.code === 'ENOENT') {
	          return;
	        } else {
	          throw err;
	        }
	      }
	      results = [];
	      for (i = 0, len = files.length; i < len; i++) {
	        file = files[i];
	        results.push(compilePath(path.join(source, file), false, base));
	      }
	      return results;
	    } else if (topLevel || helpers.isCoffee(source)) {
	      sources.push(source);
	      sourceCode.push(null);
	      delete notSources[source];
	      if (opts.watch) {
	        watch(source, base);
	      }
	      try {
	        code = fs.readFileSync(source);
	      } catch (_error) {
	        err = _error;
	        if (err.code === 'ENOENT') {
	          return;
	        } else {
	          throw err;
	        }
	      }
	      return compileScript(source, code.toString(), base);
	    } else {
	      return notSources[source] = true;
	    }
	  };

	  findDirectoryIndex = function(source) {
	    var err, ext, i, index, len, ref1;
	    ref1 = CoffeeScript.FILE_EXTENSIONS;
	    for (i = 0, len = ref1.length; i < len; i++) {
	      ext = ref1[i];
	      index = path.join(source, "index" + ext);
	      try {
	        if ((fs.statSync(index)).isFile()) {
	          return index;
	        }
	      } catch (_error) {
	        err = _error;
	        if (err.code !== 'ENOENT') {
	          throw err;
	        }
	      }
	    }
	    console.error("Missing index.coffee or index.litcoffee in " + source);
	    return process.exit(1);
	  };

	  compileScript = function(file, input, base) {
	    var compiled, err, message, o, options, t, task;
	    if (base == null) {
	      base = null;
	    }
	    o = opts;
	    options = compileOptions(file, base);
	    try {
	      t = task = {
	        file: file,
	        input: input,
	        options: options
	      };
	      CoffeeScript.emit('compile', task);
	      if (o.tokens) {
	        return printTokens(CoffeeScript.tokens(t.input, t.options));
	      } else if (o.nodes) {
	        return printLine(CoffeeScript.nodes(t.input, t.options).toString().trim());
	      } else if (o.run) {
	        CoffeeScript.register();
	        return CoffeeScript.run(t.input, t.options);
	      } else if (o.join && t.file !== o.join) {
	        if (helpers.isLiterate(file)) {
	          t.input = helpers.invertLiterate(t.input);
	        }
	        sourceCode[sources.indexOf(t.file)] = t.input;
	        return compileJoin();
	      } else {
	        compiled = CoffeeScript.compile(t.input, t.options);
	        t.output = compiled;
	        if (o.map) {
	          t.output = compiled.js;
	          t.sourceMap = compiled.v3SourceMap;
	        }
	        CoffeeScript.emit('success', task);
	        if (o.print) {
	          return printLine(t.output.trim());
	        } else if (o.compile || o.map) {
	          return writeJs(base, t.file, t.output, options.jsPath, t.sourceMap);
	        }
	      }
	    } catch (_error) {
	      err = _error;
	      CoffeeScript.emit('failure', err, task);
	      if (CoffeeScript.listeners('failure').length) {
	        return;
	      }
	      message = err.stack || ("" + err);
	      if (o.watch) {
	        return printLine(message + '\x07');
	      } else {
	        printWarn(message);
	        return process.exit(1);
	      }
	    }
	  };

	  compileStdio = function() {
	    var code, stdin;
	    code = '';
	    stdin = process.openStdin();
	    stdin.on('data', function(buffer) {
	      if (buffer) {
	        return code += buffer.toString();
	      }
	    });
	    return stdin.on('end', function() {
	      return compileScript(null, code);
	    });
	  };

	  joinTimeout = null;

	  compileJoin = function() {
	    if (!opts.join) {
	      return;
	    }
	    if (!sourceCode.some(function(code) {
	      return code === null;
	    })) {
	      clearTimeout(joinTimeout);
	      return joinTimeout = wait(100, function() {
	        return compileScript(opts.join, sourceCode.join('\n'), opts.join);
	      });
	    }
	  };

	  watch = function(source, base) {
	    var compile, compileTimeout, err, prevStats, rewatch, startWatcher, watchErr, watcher;
	    watcher = null;
	    prevStats = null;
	    compileTimeout = null;
	    watchErr = function(err) {
	      if (err.code !== 'ENOENT') {
	        throw err;
	      }
	      if (indexOf.call(sources, source) < 0) {
	        return;
	      }
	      try {
	        rewatch();
	        return compile();
	      } catch (_error) {
	        removeSource(source, base);
	        return compileJoin();
	      }
	    };
	    compile = function() {
	      clearTimeout(compileTimeout);
	      return compileTimeout = wait(25, function() {
	        return fs.stat(source, function(err, stats) {
	          if (err) {
	            return watchErr(err);
	          }
	          if (prevStats && stats.size === prevStats.size && stats.mtime.getTime() === prevStats.mtime.getTime()) {
	            return rewatch();
	          }
	          prevStats = stats;
	          return fs.readFile(source, function(err, code) {
	            if (err) {
	              return watchErr(err);
	            }
	            compileScript(source, code.toString(), base);
	            return rewatch();
	          });
	        });
	      });
	    };
	    startWatcher = function() {
	      return watcher = fs.watch(source).on('change', compile).on('error', function(err) {
	        if (err.code !== 'EPERM') {
	          throw err;
	        }
	        return removeSource(source, base);
	      });
	    };
	    rewatch = function() {
	      if (watcher != null) {
	        watcher.close();
	      }
	      return startWatcher();
	    };
	    try {
	      return startWatcher();
	    } catch (_error) {
	      err = _error;
	      return watchErr(err);
	    }
	  };

	  watchDir = function(source, base) {
	    var err, readdirTimeout, startWatcher, stopWatcher, watcher;
	    watcher = null;
	    readdirTimeout = null;
	    startWatcher = function() {
	      return watcher = fs.watch(source).on('error', function(err) {
	        if (err.code !== 'EPERM') {
	          throw err;
	        }
	        return stopWatcher();
	      }).on('change', function() {
	        clearTimeout(readdirTimeout);
	        return readdirTimeout = wait(25, function() {
	          var err, file, files, i, len, results;
	          try {
	            files = fs.readdirSync(source);
	          } catch (_error) {
	            err = _error;
	            if (err.code !== 'ENOENT') {
	              throw err;
	            }
	            return stopWatcher();
	          }
	          results = [];
	          for (i = 0, len = files.length; i < len; i++) {
	            file = files[i];
	            results.push(compilePath(path.join(source, file), false, base));
	          }
	          return results;
	        });
	      });
	    };
	    stopWatcher = function() {
	      watcher.close();
	      return removeSourceDir(source, base);
	    };
	    watchedDirs[source] = true;
	    try {
	      return startWatcher();
	    } catch (_error) {
	      err = _error;
	      if (err.code !== 'ENOENT') {
	        throw err;
	      }
	    }
	  };

	  removeSourceDir = function(source, base) {
	    var file, i, len, sourcesChanged;
	    delete watchedDirs[source];
	    sourcesChanged = false;
	    for (i = 0, len = sources.length; i < len; i++) {
	      file = sources[i];
	      if (!(source === path.dirname(file))) {
	        continue;
	      }
	      removeSource(file, base);
	      sourcesChanged = true;
	    }
	    if (sourcesChanged) {
	      return compileJoin();
	    }
	  };

	  removeSource = function(source, base) {
	    var index;
	    index = sources.indexOf(source);
	    sources.splice(index, 1);
	    sourceCode.splice(index, 1);
	    if (!opts.join) {
	      silentUnlink(outputPath(source, base));
	      silentUnlink(outputPath(source, base, '.js.map'));
	      return timeLog("removed " + source);
	    }
	  };

	  silentUnlink = function(path) {
	    var err, ref1;
	    try {
	      return fs.unlinkSync(path);
	    } catch (_error) {
	      err = _error;
	      if ((ref1 = err.code) !== 'ENOENT' && ref1 !== 'EPERM') {
	        throw err;
	      }
	    }
	  };

	  outputPath = function(source, base, extension) {
	    var basename, dir, srcDir;
	    if (extension == null) {
	      extension = ".js";
	    }
	    basename = helpers.baseFileName(source, true, useWinPathSep);
	    srcDir = path.dirname(source);
	    if (!opts.output) {
	      dir = srcDir;
	    } else if (source === base) {
	      dir = opts.output;
	    } else {
	      dir = path.join(opts.output, path.relative(base, srcDir));
	    }
	    return path.join(dir, basename + extension);
	  };

	  mkdirp = function(dir, fn) {
	    var mkdirs, mode;
	    mode = 0x1ff & ~process.umask();
	    return (mkdirs = function(p, fn) {
	      return fs.exists(p, function(exists) {
	        if (exists) {
	          return fn();
	        } else {
	          return mkdirs(path.dirname(p), function() {
	            return fs.mkdir(p, mode, function(err) {
	              if (err) {
	                return fn(err);
	              }
	              return fn();
	            });
	          });
	        }
	      });
	    })(dir, fn);
	  };

	  writeJs = function(base, sourcePath, js, jsPath, generatedSourceMap) {
	    var compile, jsDir, sourceMapPath;
	    if (generatedSourceMap == null) {
	      generatedSourceMap = null;
	    }
	    sourceMapPath = outputPath(sourcePath, base, ".js.map");
	    jsDir = path.dirname(jsPath);
	    if (jsPath in jsToSources) {
	      printLine("Error: The two following source files have the same output file:");
	      printLine("    " + jsToSources[jsPath]);
	      printLine("    " + sourcePath);
	      process.exit(1);
	    }
	    jsToSources[jsPath] = sourcePath;
	    compile = function() {
	      if (opts.compile) {
	        if (js.length <= 0) {
	          js = ' ';
	        }
	        if (generatedSourceMap) {
	          js = js + "\n//# sourceMappingURL=" + (helpers.baseFileName(sourceMapPath, false, useWinPathSep)) + "\n";
	        }
	        fs.writeFile(jsPath, js, function(err) {
	          if (err) {
	            printLine(err.message);
	            return process.exit(1);
	          } else if (opts.compile && opts.watch) {
	            return timeLog("compiled " + sourcePath);
	          }
	        });
	      }
	      if (generatedSourceMap) {
	        return fs.writeFile(sourceMapPath, generatedSourceMap, function(err) {
	          if (err) {
	            printLine("Could not write source map: " + err.message);
	            return process.exit(1);
	          }
	        });
	      }
	    };
	    return fs.exists(jsDir, function(itExists) {
	      if (itExists) {
	        return compile();
	      } else {
	        return mkdirp(jsDir, compile);
	      }
	    });
	  };

	  wait = function(milliseconds, func) {
	    return setTimeout(func, milliseconds);
	  };

	  timeLog = function(message) {
	    return console.log(((new Date).toLocaleTimeString()) + " - " + message);
	  };

	  printTokens = function(tokens) {
	    var strings, tag, token, value;
	    strings = (function() {
	      var i, len, results;
	      results = [];
	      for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        tag = token[0];
	        value = token[1].toString().replace(/\n/, '\\n');
	        results.push("[" + tag + " " + value + "]");
	      }
	      return results;
	    })();
	    return printLine(strings.join(' '));
	  };

	  parseOptions = function() {
	    var o;
	    optionParser = new optparse.OptionParser(SWITCHES, BANNER);
	    o = opts = optionParser.parse(process.argv.slice(2));
	    o.compile || (o.compile = !!o.output);
	    o.run = !(o.compile || o.print || o.map);
	    return o.print = !!(o.print || (o["eval"] || o.stdio && o.compile));
	  };

	  compileOptions = function(filename, base) {
	    var answer, cwd, jsDir, jsPath;
	    answer = {
	      filename: filename,
	      literate: opts.literate || helpers.isLiterate(filename),
	      bare: opts.bare,
	      header: opts.compile && !opts['no-header'],
	      sourceMap: opts.map
	    };
	    if (filename) {
	      if (base) {
	        cwd = process.cwd();
	        jsPath = outputPath(filename, base);
	        jsDir = path.dirname(jsPath);
	        answer = helpers.merge(answer, {
	          jsPath: jsPath,
	          sourceRoot: path.relative(jsDir, cwd),
	          sourceFiles: [path.relative(cwd, filename)],
	          generatedFile: helpers.baseFileName(jsPath, false, useWinPathSep)
	        });
	      } else {
	        answer = helpers.merge(answer, {
	          sourceRoot: "",
	          sourceFiles: [helpers.baseFileName(filename, false, useWinPathSep)],
	          generatedFile: helpers.baseFileName(filename, true, useWinPathSep) + ".js"
	        });
	      }
	    }
	    return answer;
	  };

	  forkNode = function() {
	    var args, nodeArgs, p;
	    nodeArgs = opts.nodejs.split(/\s+/);
	    args = process.argv.slice(1);
	    args.splice(args.indexOf('--nodejs'), 2);
	    p = spawn(process.execPath, nodeArgs.concat(args), {
	      cwd: process.cwd(),
	      env: process.env,
	      customFds: [0, 1, 2]
	    });
	    return p.on('exit', function(code) {
	      return process.exit(code);
	    });
	  };

	  usage = function() {
	    return printLine((new optparse.OptionParser(SWITCHES, BANNER)).help());
	  };

	  version = function() {
	    return printLine("CoffeeScript version " + CoffeeScript.VERSION);
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 19 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global, Buffer) {// Generated by CoffeeScript 1.9.1
	(function() {
	  var CoffeeScript, addHistory, addMultilineHandler, fs, getCommandId, merge, nodeREPL, path, ref, replDefaults, updateSyntaxError, vm;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(7);

	  vm = __webpack_require__(5);

	  nodeREPL = __webpack_require__(25);

	  CoffeeScript = __webpack_require__(3);

	  ref = __webpack_require__(10), merge = ref.merge, updateSyntaxError = ref.updateSyntaxError;

	  replDefaults = {
	    prompt: 'coffee> ',
	    historyFile: process.env.HOME ? path.join(process.env.HOME, '.coffee_history') : void 0,
	    historyMaxInputSize: 10240,
	    "eval": function(input, context, filename, cb) {
	      var Assign, Block, Literal, Value, ast, err, js, ref1, referencedVars, result, token, tokens;
	      input = input.replace(/\uFF00/g, '\n');
	      input = input.replace(/^\(([\s\S]*)\n\)$/m, '$1');
	      ref1 = __webpack_require__(27), Block = ref1.Block, Assign = ref1.Assign, Value = ref1.Value, Literal = ref1.Literal;
	      try {
	        tokens = CoffeeScript.tokens(input);
	        referencedVars = (function() {
	          var i, len, results;
	          results = [];
	          for (i = 0, len = tokens.length; i < len; i++) {
	            token = tokens[i];
	            if (token.variable) {
	              results.push(token[1]);
	            }
	          }
	          return results;
	        })();
	        ast = CoffeeScript.nodes(tokens);
	        ast = new Block([new Assign(new Value(new Literal('_')), ast, '=')]);
	        js = ast.compile({
	          bare: true,
	          locals: Object.keys(context),
	          referencedVars: referencedVars
	        });
	        result = context === global ? vm.runInThisContext(js, filename) : vm.runInContext(js, context, filename);
	        return cb(null, result);
	      } catch (_error) {
	        err = _error;
	        updateSyntaxError(err, input);
	        return cb(err);
	      }
	    }
	  };

	  addMultilineHandler = function(repl) {
	    var inputStream, multiline, nodeLineListener, origPrompt, outputStream, ref1, rli;
	    rli = repl.rli, inputStream = repl.inputStream, outputStream = repl.outputStream;
	    origPrompt = (ref1 = repl._prompt) != null ? ref1 : repl.prompt;
	    multiline = {
	      enabled: false,
	      initialPrompt: origPrompt.replace(/^[^> ]*/, function(x) {
	        return x.replace(/./g, '-');
	      }),
	      prompt: origPrompt.replace(/^[^> ]*>?/, function(x) {
	        return x.replace(/./g, '.');
	      }),
	      buffer: ''
	    };
	    nodeLineListener = rli.listeners('line')[0];
	    rli.removeListener('line', nodeLineListener);
	    rli.on('line', function(cmd) {
	      if (multiline.enabled) {
	        multiline.buffer += cmd + "\n";
	        rli.setPrompt(multiline.prompt);
	        rli.prompt(true);
	      } else {
	        rli.setPrompt(origPrompt);
	        nodeLineListener(cmd);
	      }
	    });
	    return inputStream.on('keypress', function(char, key) {
	      if (!(key && key.ctrl && !key.meta && !key.shift && key.name === 'v')) {
	        return;
	      }
	      if (multiline.enabled) {
	        if (!multiline.buffer.match(/\n/)) {
	          multiline.enabled = !multiline.enabled;
	          rli.setPrompt(origPrompt);
	          rli.prompt(true);
	          return;
	        }
	        if ((rli.line != null) && !rli.line.match(/^\s*$/)) {
	          return;
	        }
	        multiline.enabled = !multiline.enabled;
	        rli.line = '';
	        rli.cursor = 0;
	        rli.output.cursorTo(0);
	        rli.output.clearLine(1);
	        multiline.buffer = multiline.buffer.replace(/\n/g, '\uFF00');
	        rli.emit('line', multiline.buffer);
	        multiline.buffer = '';
	      } else {
	        multiline.enabled = !multiline.enabled;
	        rli.setPrompt(multiline.initialPrompt);
	        rli.prompt(true);
	      }
	    });
	  };

	  addHistory = function(repl, filename, maxSize) {
	    var buffer, fd, lastLine, readFd, size, stat;
	    lastLine = null;
	    try {
	      stat = fs.statSync(filename);
	      size = Math.min(maxSize, stat.size);
	      readFd = fs.openSync(filename, 'r');
	      buffer = new Buffer(size);
	      fs.readSync(readFd, buffer, 0, size, stat.size - size);
	      repl.rli.history = buffer.toString().split('\n').reverse();
	      if (stat.size > maxSize) {
	        repl.rli.history.pop();
	      }
	      if (repl.rli.history[0] === '') {
	        repl.rli.history.shift();
	      }
	      repl.rli.historyIndex = -1;
	      lastLine = repl.rli.history[0];
	    } catch (_error) {}
	    fd = fs.openSync(filename, 'a');
	    repl.rli.addListener('line', function(code) {
	      if (code && code.length && code !== '.history' && lastLine !== code) {
	        fs.write(fd, code + "\n");
	        return lastLine = code;
	      }
	    });
	    repl.rli.on('exit', function() {
	      return fs.close(fd);
	    });
	    return repl.commands[getCommandId(repl, 'history')] = {
	      help: 'Show command history',
	      action: function() {
	        repl.outputStream.write((repl.rli.history.slice(0).reverse().join('\n')) + "\n");
	        return repl.displayPrompt();
	      }
	    };
	  };

	  getCommandId = function(repl, commandName) {
	    var commandsHaveLeadingDot;
	    commandsHaveLeadingDot = repl.commands['.help'] != null;
	    if (commandsHaveLeadingDot) {
	      return "." + commandName;
	    } else {
	      return commandName;
	    }
	  };

	  module.exports = {
	    start: function(opts) {
	      var build, major, minor, ref1, repl;
	      if (opts == null) {
	        opts = {};
	      }
	      ref1 = process.versions.node.split('.').map(function(n) {
	        return parseInt(n);
	      }), major = ref1[0], minor = ref1[1], build = ref1[2];
	      if (major === 0 && minor < 8) {
	        console.warn("Node 0.8.0+ required for CoffeeScript REPL");
	        process.exit(1);
	      }
	      CoffeeScript.register();
	      process.argv = ['coffee'].concat(process.argv.slice(2));
	      opts = merge(replDefaults, opts);
	      repl = nodeREPL.start(opts);
	      repl.on('exit', function() {
	        return repl.outputStream.write('\n');
	      });
	      addMultilineHandler(repl);
	      if (opts.historyFile) {
	        addHistory(repl, opts.historyFile, opts.historyMaxInputSize);
	      }
	      repl.commands[getCommandId(repl, 'load')].help = 'Load code from a file into this REPL session';
	      return repl;
	    }
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), (function() { return this; }()), __webpack_require__(21).Buffer))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var base64 = __webpack_require__(22)
	var ieee754 = __webpack_require__(23)
	var isArray = __webpack_require__(24)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Note:
	 *
	 * - Implementation must support adding new properties to `Uint8Array` instances.
	 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
	 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *    incorrect length in some situations.
	 *
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
	 * get the Object implementation, which is slower but will work correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  function Foo () {}
	  try {
	    var buf = new ArrayBuffer(0)
	    var arr = new Uint8Array(buf)
	    arr.foo = function () { return 42 }
	    arr.constructor = Foo
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Foo && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  this.length = 0
	  this.parent = undefined

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && object.buffer instanceof ArrayBuffer) {
	    return fromTypedArray(that, object)
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  } else if (list.length === 1) {
	    return list[0]
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` will be removed in Node 0.13+
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` will be removed in Node 0.13+
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  var res = ''
	  var tmp = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    if (buf[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
	      tmp = ''
	    } else {
	      tmp += '%' + buf[i].toString(16)
	    }
	  }

	  return res + decodeUtf8Char(tmp)
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start

	  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated, will be removed in node 0.13+
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	  var i = 0

	  for (; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (leadSurrogate) {
	        // 2 leads in a row
	        if (codePoint < 0xDC00) {
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          leadSurrogate = codePoint
	          continue
	        } else {
	          // valid surrogate pair
	          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
	          leadSurrogate = null
	        }
	      } else {
	        // no lead yet

	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else {
	          // valid lead
	          leadSurrogate = codePoint
	          continue
	        }
	      }
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	      leadSurrogate = null
	    }

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x200000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function decodeUtf8Char (str) {
	  try {
	    return decodeURIComponent(str)
	  } catch (err) {
	    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}(false ? (this.base64js = {}) : exports))


/***/ },
/* 23 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(26);


/***/ },
/* 26 */
/***/ function(module, exports) {

	/*!
	 * Template - simple template engine
	 *
	 * Copyright(c) 2011 Firejune <to@firejune.com>
	 * MIT Licensed
	 */


	/**
	 * Repl method.
	 */

	String.prototype.repl = function(dic, parentKey) {

	  var src = this;
	  for (var key in dic) {
	    var _key = (parentKey ? parentKey + '.' : '') + key;
	    if (typeof dic[key] == 'object') src = src.repl(dic[key], _key);
	    else src = src.replace(new RegExp('{' + _key + '}', 'g'), dic[key]);
	  }

	  return src;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var Access, Arr, Assign, Base, Block, Call, Class, Code, CodeFragment, Comment, Existence, Expansion, Extends, For, HEXNUM, IDENTIFIER, IS_REGEX, IS_STRING, If, In, Index, LEVEL_ACCESS, LEVEL_COND, LEVEL_LIST, LEVEL_OP, LEVEL_PAREN, LEVEL_TOP, Literal, NEGATE, NO, NUMBER, Obj, Op, Param, Parens, RESERVED, Range, Return, SIMPLENUM, STRICT_PROSCRIBED, Scope, Slice, Splat, Switch, TAB, THIS, Throw, Try, UTILITIES, Value, While, YES, addLocationDataFn, compact, del, ends, extend, flatten, fragmentsToText, isComplexOrAssignable, isLiteralArguments, isLiteralThis, locationDataToString, merge, multident, parseNum, ref1, ref2, some, starts, throwSyntaxError, unfoldSoak, utility,
	    extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    slice = [].slice;

	  Error.stackTraceLimit = Infinity;

	  Scope = __webpack_require__(28).Scope;

	  ref1 = __webpack_require__(8), RESERVED = ref1.RESERVED, STRICT_PROSCRIBED = ref1.STRICT_PROSCRIBED;

	  ref2 = __webpack_require__(10), compact = ref2.compact, flatten = ref2.flatten, extend = ref2.extend, merge = ref2.merge, del = ref2.del, starts = ref2.starts, ends = ref2.ends, some = ref2.some, addLocationDataFn = ref2.addLocationDataFn, locationDataToString = ref2.locationDataToString, throwSyntaxError = ref2.throwSyntaxError;

	  exports.extend = extend;

	  exports.addLocationDataFn = addLocationDataFn;

	  YES = function() {
	    return true;
	  };

	  NO = function() {
	    return false;
	  };

	  THIS = function() {
	    return this;
	  };

	  NEGATE = function() {
	    this.negated = !this.negated;
	    return this;
	  };

	  exports.CodeFragment = CodeFragment = (function() {
	    function CodeFragment(parent, code) {
	      var ref3;
	      this.code = "" + code;
	      this.locationData = parent != null ? parent.locationData : void 0;
	      this.type = (parent != null ? (ref3 = parent.constructor) != null ? ref3.name : void 0 : void 0) || 'unknown';
	    }

	    CodeFragment.prototype.toString = function() {
	      return "" + this.code + (this.locationData ? ": " + locationDataToString(this.locationData) : '');
	    };

	    return CodeFragment;

	  })();

	  fragmentsToText = function(fragments) {
	    var fragment;
	    return ((function() {
	      var j, len1, results;
	      results = [];
	      for (j = 0, len1 = fragments.length; j < len1; j++) {
	        fragment = fragments[j];
	        results.push(fragment.code);
	      }
	      return results;
	    })()).join('');
	  };

	  exports.Base = Base = (function() {
	    function Base() {}

	    Base.prototype.compile = function(o, lvl) {
	      return fragmentsToText(this.compileToFragments(o, lvl));
	    };

	    Base.prototype.compileToFragments = function(o, lvl) {
	      var node;
	      o = extend({}, o);
	      if (lvl) {
	        o.level = lvl;
	      }
	      node = this.unfoldSoak(o) || this;
	      node.tab = o.indent;
	      if (o.level === LEVEL_TOP || !node.isStatement(o)) {
	        return node.compileNode(o);
	      } else {
	        return node.compileClosure(o);
	      }
	    };

	    Base.prototype.compileClosure = function(o) {
	      var args, argumentsNode, func, jumpNode, meth, parts;
	      if (jumpNode = this.jumps()) {
	        jumpNode.error('cannot use a pure statement in an expression');
	      }
	      o.sharedScope = true;
	      func = new Code([], Block.wrap([this]));
	      args = [];
	      if ((argumentsNode = this.contains(isLiteralArguments)) || this.contains(isLiteralThis)) {
	        args = [new Literal('this')];
	        if (argumentsNode) {
	          meth = 'apply';
	          args.push(new Literal('arguments'));
	        } else {
	          meth = 'call';
	        }
	        func = new Value(func, [new Access(new Literal(meth))]);
	      }
	      parts = (new Call(func, args)).compileNode(o);
	      if (func.isGenerator) {
	        parts.unshift(this.makeCode("(yield* "));
	        parts.push(this.makeCode(")"));
	      }
	      return parts;
	    };

	    Base.prototype.cache = function(o, level, isComplex) {
	      var complex, ref, sub;
	      complex = isComplex != null ? isComplex(this) : this.isComplex();
	      if (complex) {
	        ref = new Literal(o.scope.freeVariable('ref'));
	        sub = new Assign(ref, this);
	        if (level) {
	          return [sub.compileToFragments(o, level), [this.makeCode(ref.value)]];
	        } else {
	          return [sub, ref];
	        }
	      } else {
	        ref = level ? this.compileToFragments(o, level) : this;
	        return [ref, ref];
	      }
	    };

	    Base.prototype.cacheToCodeFragments = function(cacheValues) {
	      return [fragmentsToText(cacheValues[0]), fragmentsToText(cacheValues[1])];
	    };

	    Base.prototype.makeReturn = function(res) {
	      var me;
	      me = this.unwrapAll();
	      if (res) {
	        return new Call(new Literal(res + ".push"), [me]);
	      } else {
	        return new Return(me);
	      }
	    };

	    Base.prototype.contains = function(pred) {
	      var node;
	      node = void 0;
	      this.traverseChildren(false, function(n) {
	        if (pred(n)) {
	          node = n;
	          return false;
	        }
	      });
	      return node;
	    };

	    Base.prototype.lastNonComment = function(list) {
	      var i;
	      i = list.length;
	      while (i--) {
	        if (!(list[i] instanceof Comment)) {
	          return list[i];
	        }
	      }
	      return null;
	    };

	    Base.prototype.toString = function(idt, name) {
	      var tree;
	      if (idt == null) {
	        idt = '';
	      }
	      if (name == null) {
	        name = this.constructor.name;
	      }
	      tree = '\n' + idt + name;
	      if (this.soak) {
	        tree += '?';
	      }
	      this.eachChild(function(node) {
	        return tree += node.toString(idt + TAB);
	      });
	      return tree;
	    };

	    Base.prototype.eachChild = function(func) {
	      var attr, child, j, k, len1, len2, ref3, ref4;
	      if (!this.children) {
	        return this;
	      }
	      ref3 = this.children;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        attr = ref3[j];
	        if (this[attr]) {
	          ref4 = flatten([this[attr]]);
	          for (k = 0, len2 = ref4.length; k < len2; k++) {
	            child = ref4[k];
	            if (func(child) === false) {
	              return this;
	            }
	          }
	        }
	      }
	      return this;
	    };

	    Base.prototype.traverseChildren = function(crossScope, func) {
	      return this.eachChild(function(child) {
	        var recur;
	        recur = func(child);
	        if (recur !== false) {
	          return child.traverseChildren(crossScope, func);
	        }
	      });
	    };

	    Base.prototype.invert = function() {
	      return new Op('!', this);
	    };

	    Base.prototype.unwrapAll = function() {
	      var node;
	      node = this;
	      while (node !== (node = node.unwrap())) {
	        continue;
	      }
	      return node;
	    };

	    Base.prototype.children = [];

	    Base.prototype.isStatement = NO;

	    Base.prototype.jumps = NO;

	    Base.prototype.isComplex = YES;

	    Base.prototype.isChainable = NO;

	    Base.prototype.isAssignable = NO;

	    Base.prototype.unwrap = THIS;

	    Base.prototype.unfoldSoak = NO;

	    Base.prototype.assigns = NO;

	    Base.prototype.updateLocationDataIfMissing = function(locationData) {
	      if (this.locationData) {
	        return this;
	      }
	      this.locationData = locationData;
	      return this.eachChild(function(child) {
	        return child.updateLocationDataIfMissing(locationData);
	      });
	    };

	    Base.prototype.error = function(message) {
	      return throwSyntaxError(message, this.locationData);
	    };

	    Base.prototype.makeCode = function(code) {
	      return new CodeFragment(this, code);
	    };

	    Base.prototype.wrapInBraces = function(fragments) {
	      return [].concat(this.makeCode('('), fragments, this.makeCode(')'));
	    };

	    Base.prototype.joinFragmentArrays = function(fragmentsList, joinStr) {
	      var answer, fragments, i, j, len1;
	      answer = [];
	      for (i = j = 0, len1 = fragmentsList.length; j < len1; i = ++j) {
	        fragments = fragmentsList[i];
	        if (i) {
	          answer.push(this.makeCode(joinStr));
	        }
	        answer = answer.concat(fragments);
	      }
	      return answer;
	    };

	    return Base;

	  })();

	  exports.Block = Block = (function(superClass1) {
	    extend1(Block, superClass1);

	    function Block(nodes) {
	      this.expressions = compact(flatten(nodes || []));
	    }

	    Block.prototype.children = ['expressions'];

	    Block.prototype.push = function(node) {
	      this.expressions.push(node);
	      return this;
	    };

	    Block.prototype.pop = function() {
	      return this.expressions.pop();
	    };

	    Block.prototype.unshift = function(node) {
	      this.expressions.unshift(node);
	      return this;
	    };

	    Block.prototype.unwrap = function() {
	      if (this.expressions.length === 1) {
	        return this.expressions[0];
	      } else {
	        return this;
	      }
	    };

	    Block.prototype.isEmpty = function() {
	      return !this.expressions.length;
	    };

	    Block.prototype.isStatement = function(o) {
	      var exp, j, len1, ref3;
	      ref3 = this.expressions;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        exp = ref3[j];
	        if (exp.isStatement(o)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    Block.prototype.jumps = function(o) {
	      var exp, j, jumpNode, len1, ref3;
	      ref3 = this.expressions;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        exp = ref3[j];
	        if (jumpNode = exp.jumps(o)) {
	          return jumpNode;
	        }
	      }
	    };

	    Block.prototype.makeReturn = function(res) {
	      var expr, len;
	      len = this.expressions.length;
	      while (len--) {
	        expr = this.expressions[len];
	        if (!(expr instanceof Comment)) {
	          this.expressions[len] = expr.makeReturn(res);
	          if (expr instanceof Return && !expr.expression) {
	            this.expressions.splice(len, 1);
	          }
	          break;
	        }
	      }
	      return this;
	    };

	    Block.prototype.compileToFragments = function(o, level) {
	      if (o == null) {
	        o = {};
	      }
	      if (o.scope) {
	        return Block.__super__.compileToFragments.call(this, o, level);
	      } else {
	        return this.compileRoot(o);
	      }
	    };

	    Block.prototype.compileNode = function(o) {
	      var answer, compiledNodes, fragments, index, j, len1, node, ref3, top;
	      this.tab = o.indent;
	      top = o.level === LEVEL_TOP;
	      compiledNodes = [];
	      ref3 = this.expressions;
	      for (index = j = 0, len1 = ref3.length; j < len1; index = ++j) {
	        node = ref3[index];
	        node = node.unwrapAll();
	        node = node.unfoldSoak(o) || node;
	        if (node instanceof Block) {
	          compiledNodes.push(node.compileNode(o));
	        } else if (top) {
	          node.front = true;
	          fragments = node.compileToFragments(o);
	          if (!node.isStatement(o)) {
	            fragments.unshift(this.makeCode("" + this.tab));
	            fragments.push(this.makeCode(";"));
	          }
	          compiledNodes.push(fragments);
	        } else {
	          compiledNodes.push(node.compileToFragments(o, LEVEL_LIST));
	        }
	      }
	      if (top) {
	        if (this.spaced) {
	          return [].concat(this.joinFragmentArrays(compiledNodes, '\n\n'), this.makeCode("\n"));
	        } else {
	          return this.joinFragmentArrays(compiledNodes, '\n');
	        }
	      }
	      if (compiledNodes.length) {
	        answer = this.joinFragmentArrays(compiledNodes, ', ');
	      } else {
	        answer = [this.makeCode("void 0")];
	      }
	      if (compiledNodes.length > 1 && o.level >= LEVEL_LIST) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Block.prototype.compileRoot = function(o) {
	      var exp, fragments, i, j, len1, name, prelude, preludeExps, ref3, ref4, rest;
	      o.indent = o.bare ? '' : TAB;
	      o.level = LEVEL_TOP;
	      this.spaced = true;
	      o.scope = new Scope(null, this, null, (ref3 = o.referencedVars) != null ? ref3 : []);
	      ref4 = o.locals || [];
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        name = ref4[j];
	        o.scope.parameter(name);
	      }
	      prelude = [];
	      if (!o.bare) {
	        preludeExps = (function() {
	          var k, len2, ref5, results;
	          ref5 = this.expressions;
	          results = [];
	          for (i = k = 0, len2 = ref5.length; k < len2; i = ++k) {
	            exp = ref5[i];
	            if (!(exp.unwrap() instanceof Comment)) {
	              break;
	            }
	            results.push(exp);
	          }
	          return results;
	        }).call(this);
	        rest = this.expressions.slice(preludeExps.length);
	        this.expressions = preludeExps;
	        if (preludeExps.length) {
	          prelude = this.compileNode(merge(o, {
	            indent: ''
	          }));
	          prelude.push(this.makeCode("\n"));
	        }
	        this.expressions = rest;
	      }
	      fragments = this.compileWithDeclarations(o);
	      if (o.bare) {
	        return fragments;
	      }
	      return [].concat(prelude, this.makeCode("(function() {\n"), fragments, this.makeCode("\n}).call(this);\n"));
	    };

	    Block.prototype.compileWithDeclarations = function(o) {
	      var assigns, declars, exp, fragments, i, j, len1, post, ref3, ref4, ref5, rest, scope, spaced;
	      fragments = [];
	      post = [];
	      ref3 = this.expressions;
	      for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	        exp = ref3[i];
	        exp = exp.unwrap();
	        if (!(exp instanceof Comment || exp instanceof Literal)) {
	          break;
	        }
	      }
	      o = merge(o, {
	        level: LEVEL_TOP
	      });
	      if (i) {
	        rest = this.expressions.splice(i, 9e9);
	        ref4 = [this.spaced, false], spaced = ref4[0], this.spaced = ref4[1];
	        ref5 = [this.compileNode(o), spaced], fragments = ref5[0], this.spaced = ref5[1];
	        this.expressions = rest;
	      }
	      post = this.compileNode(o);
	      scope = o.scope;
	      if (scope.expressions === this) {
	        declars = o.scope.hasDeclarations();
	        assigns = scope.hasAssignments;
	        if (declars || assigns) {
	          if (i) {
	            fragments.push(this.makeCode('\n'));
	          }
	          fragments.push(this.makeCode(this.tab + "var "));
	          if (declars) {
	            fragments.push(this.makeCode(scope.declaredVariables().join(', ')));
	          }
	          if (assigns) {
	            if (declars) {
	              fragments.push(this.makeCode(",\n" + (this.tab + TAB)));
	            }
	            fragments.push(this.makeCode(scope.assignedVariables().join(",\n" + (this.tab + TAB))));
	          }
	          fragments.push(this.makeCode(";\n" + (this.spaced ? '\n' : '')));
	        } else if (fragments.length && post.length) {
	          fragments.push(this.makeCode("\n"));
	        }
	      }
	      return fragments.concat(post);
	    };

	    Block.wrap = function(nodes) {
	      if (nodes.length === 1 && nodes[0] instanceof Block) {
	        return nodes[0];
	      }
	      return new Block(nodes);
	    };

	    return Block;

	  })(Base);

	  exports.Literal = Literal = (function(superClass1) {
	    extend1(Literal, superClass1);

	    function Literal(value1) {
	      this.value = value1;
	    }

	    Literal.prototype.makeReturn = function() {
	      if (this.isStatement()) {
	        return this;
	      } else {
	        return Literal.__super__.makeReturn.apply(this, arguments);
	      }
	    };

	    Literal.prototype.isAssignable = function() {
	      return IDENTIFIER.test(this.value);
	    };

	    Literal.prototype.isStatement = function() {
	      var ref3;
	      return (ref3 = this.value) === 'break' || ref3 === 'continue' || ref3 === 'debugger';
	    };

	    Literal.prototype.isComplex = NO;

	    Literal.prototype.assigns = function(name) {
	      return name === this.value;
	    };

	    Literal.prototype.jumps = function(o) {
	      if (this.value === 'break' && !((o != null ? o.loop : void 0) || (o != null ? o.block : void 0))) {
	        return this;
	      }
	      if (this.value === 'continue' && !(o != null ? o.loop : void 0)) {
	        return this;
	      }
	    };

	    Literal.prototype.compileNode = function(o) {
	      var answer, code, ref3;
	      code = this.value === 'this' ? ((ref3 = o.scope.method) != null ? ref3.bound : void 0) ? o.scope.method.context : this.value : this.value.reserved ? "\"" + this.value + "\"" : this.value;
	      answer = this.isStatement() ? "" + this.tab + code + ";" : code;
	      return [this.makeCode(answer)];
	    };

	    Literal.prototype.toString = function() {
	      return ' "' + this.value + '"';
	    };

	    return Literal;

	  })(Base);

	  exports.Undefined = (function(superClass1) {
	    extend1(Undefined, superClass1);

	    function Undefined() {
	      return Undefined.__super__.constructor.apply(this, arguments);
	    }

	    Undefined.prototype.isAssignable = NO;

	    Undefined.prototype.isComplex = NO;

	    Undefined.prototype.compileNode = function(o) {
	      return [this.makeCode(o.level >= LEVEL_ACCESS ? '(void 0)' : 'void 0')];
	    };

	    return Undefined;

	  })(Base);

	  exports.Null = (function(superClass1) {
	    extend1(Null, superClass1);

	    function Null() {
	      return Null.__super__.constructor.apply(this, arguments);
	    }

	    Null.prototype.isAssignable = NO;

	    Null.prototype.isComplex = NO;

	    Null.prototype.compileNode = function() {
	      return [this.makeCode("null")];
	    };

	    return Null;

	  })(Base);

	  exports.Bool = (function(superClass1) {
	    extend1(Bool, superClass1);

	    Bool.prototype.isAssignable = NO;

	    Bool.prototype.isComplex = NO;

	    Bool.prototype.compileNode = function() {
	      return [this.makeCode(this.val)];
	    };

	    function Bool(val1) {
	      this.val = val1;
	    }

	    return Bool;

	  })(Base);

	  exports.Return = Return = (function(superClass1) {
	    extend1(Return, superClass1);

	    function Return(expression) {
	      this.expression = expression;
	    }

	    Return.prototype.children = ['expression'];

	    Return.prototype.isStatement = YES;

	    Return.prototype.makeReturn = THIS;

	    Return.prototype.jumps = THIS;

	    Return.prototype.compileToFragments = function(o, level) {
	      var expr, ref3;
	      expr = (ref3 = this.expression) != null ? ref3.makeReturn() : void 0;
	      if (expr && !(expr instanceof Return)) {
	        return expr.compileToFragments(o, level);
	      } else {
	        return Return.__super__.compileToFragments.call(this, o, level);
	      }
	    };

	    Return.prototype.compileNode = function(o) {
	      var answer, exprIsYieldReturn, ref3;
	      answer = [];
	      exprIsYieldReturn = (ref3 = this.expression) != null ? typeof ref3.isYieldReturn === "function" ? ref3.isYieldReturn() : void 0 : void 0;
	      if (!exprIsYieldReturn) {
	        answer.push(this.makeCode(this.tab + ("return" + (this.expression ? " " : ""))));
	      }
	      if (this.expression) {
	        answer = answer.concat(this.expression.compileToFragments(o, LEVEL_PAREN));
	      }
	      if (!exprIsYieldReturn) {
	        answer.push(this.makeCode(";"));
	      }
	      return answer;
	    };

	    return Return;

	  })(Base);

	  exports.Value = Value = (function(superClass1) {
	    extend1(Value, superClass1);

	    function Value(base, props, tag) {
	      if (!props && base instanceof Value) {
	        return base;
	      }
	      this.base = base;
	      this.properties = props || [];
	      if (tag) {
	        this[tag] = true;
	      }
	      return this;
	    }

	    Value.prototype.children = ['base', 'properties'];

	    Value.prototype.add = function(props) {
	      this.properties = this.properties.concat(props);
	      return this;
	    };

	    Value.prototype.hasProperties = function() {
	      return !!this.properties.length;
	    };

	    Value.prototype.bareLiteral = function(type) {
	      return !this.properties.length && this.base instanceof type;
	    };

	    Value.prototype.isArray = function() {
	      return this.bareLiteral(Arr);
	    };

	    Value.prototype.isRange = function() {
	      return this.bareLiteral(Range);
	    };

	    Value.prototype.isComplex = function() {
	      return this.hasProperties() || this.base.isComplex();
	    };

	    Value.prototype.isAssignable = function() {
	      return this.hasProperties() || this.base.isAssignable();
	    };

	    Value.prototype.isSimpleNumber = function() {
	      return this.bareLiteral(Literal) && SIMPLENUM.test(this.base.value);
	    };

	    Value.prototype.isString = function() {
	      return this.bareLiteral(Literal) && IS_STRING.test(this.base.value);
	    };

	    Value.prototype.isRegex = function() {
	      return this.bareLiteral(Literal) && IS_REGEX.test(this.base.value);
	    };

	    Value.prototype.isAtomic = function() {
	      var j, len1, node, ref3;
	      ref3 = this.properties.concat(this.base);
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        node = ref3[j];
	        if (node.soak || node instanceof Call) {
	          return false;
	        }
	      }
	      return true;
	    };

	    Value.prototype.isNotCallable = function() {
	      return this.isSimpleNumber() || this.isString() || this.isRegex() || this.isArray() || this.isRange() || this.isSplice() || this.isObject();
	    };

	    Value.prototype.isStatement = function(o) {
	      return !this.properties.length && this.base.isStatement(o);
	    };

	    Value.prototype.assigns = function(name) {
	      return !this.properties.length && this.base.assigns(name);
	    };

	    Value.prototype.jumps = function(o) {
	      return !this.properties.length && this.base.jumps(o);
	    };

	    Value.prototype.isObject = function(onlyGenerated) {
	      if (this.properties.length) {
	        return false;
	      }
	      return (this.base instanceof Obj) && (!onlyGenerated || this.base.generated);
	    };

	    Value.prototype.isSplice = function() {
	      var lastProp, ref3;
	      ref3 = this.properties, lastProp = ref3[ref3.length - 1];
	      return lastProp instanceof Slice;
	    };

	    Value.prototype.looksStatic = function(className) {
	      var ref3;
	      return this.base.value === className && this.properties.length === 1 && ((ref3 = this.properties[0].name) != null ? ref3.value : void 0) !== 'prototype';
	    };

	    Value.prototype.unwrap = function() {
	      if (this.properties.length) {
	        return this;
	      } else {
	        return this.base;
	      }
	    };

	    Value.prototype.cacheReference = function(o) {
	      var base, bref, name, nref, ref3;
	      ref3 = this.properties, name = ref3[ref3.length - 1];
	      if (this.properties.length < 2 && !this.base.isComplex() && !(name != null ? name.isComplex() : void 0)) {
	        return [this, this];
	      }
	      base = new Value(this.base, this.properties.slice(0, -1));
	      if (base.isComplex()) {
	        bref = new Literal(o.scope.freeVariable('base'));
	        base = new Value(new Parens(new Assign(bref, base)));
	      }
	      if (!name) {
	        return [base, bref];
	      }
	      if (name.isComplex()) {
	        nref = new Literal(o.scope.freeVariable('name'));
	        name = new Index(new Assign(nref, name.index));
	        nref = new Index(nref);
	      }
	      return [base.add(name), new Value(bref || base.base, [nref || name])];
	    };

	    Value.prototype.compileNode = function(o) {
	      var fragments, j, len1, prop, props;
	      this.base.front = this.front;
	      props = this.properties;
	      fragments = this.base.compileToFragments(o, (props.length ? LEVEL_ACCESS : null));
	      if ((this.base instanceof Parens || props.length) && SIMPLENUM.test(fragmentsToText(fragments))) {
	        fragments.push(this.makeCode('.'));
	      }
	      for (j = 0, len1 = props.length; j < len1; j++) {
	        prop = props[j];
	        fragments.push.apply(fragments, prop.compileToFragments(o));
	      }
	      return fragments;
	    };

	    Value.prototype.unfoldSoak = function(o) {
	      return this.unfoldedSoak != null ? this.unfoldedSoak : this.unfoldedSoak = (function(_this) {
	        return function() {
	          var fst, i, ifn, j, len1, prop, ref, ref3, ref4, snd;
	          if (ifn = _this.base.unfoldSoak(o)) {
	            (ref3 = ifn.body.properties).push.apply(ref3, _this.properties);
	            return ifn;
	          }
	          ref4 = _this.properties;
	          for (i = j = 0, len1 = ref4.length; j < len1; i = ++j) {
	            prop = ref4[i];
	            if (!prop.soak) {
	              continue;
	            }
	            prop.soak = false;
	            fst = new Value(_this.base, _this.properties.slice(0, i));
	            snd = new Value(_this.base, _this.properties.slice(i));
	            if (fst.isComplex()) {
	              ref = new Literal(o.scope.freeVariable('ref'));
	              fst = new Parens(new Assign(ref, fst));
	              snd.base = ref;
	            }
	            return new If(new Existence(fst), snd, {
	              soak: true
	            });
	          }
	          return false;
	        };
	      })(this)();
	    };

	    return Value;

	  })(Base);

	  exports.Comment = Comment = (function(superClass1) {
	    extend1(Comment, superClass1);

	    function Comment(comment1) {
	      this.comment = comment1;
	    }

	    Comment.prototype.isStatement = YES;

	    Comment.prototype.makeReturn = THIS;

	    Comment.prototype.compileNode = function(o, level) {
	      var code, comment;
	      comment = this.comment.replace(/^(\s*)# /gm, "$1 * ");
	      code = "/*" + (multident(comment, this.tab)) + (indexOf.call(comment, '\n') >= 0 ? "\n" + this.tab : '') + " */";
	      if ((level || o.level) === LEVEL_TOP) {
	        code = o.indent + code;
	      }
	      return [this.makeCode("\n"), this.makeCode(code)];
	    };

	    return Comment;

	  })(Base);

	  exports.Call = Call = (function(superClass1) {
	    extend1(Call, superClass1);

	    function Call(variable, args1, soak) {
	      this.args = args1 != null ? args1 : [];
	      this.soak = soak;
	      this.isNew = false;
	      this.isSuper = variable === 'super';
	      this.variable = this.isSuper ? null : variable;
	      if (variable instanceof Value && variable.isNotCallable()) {
	        variable.error("literal is not a function");
	      }
	    }

	    Call.prototype.children = ['variable', 'args'];

	    Call.prototype.newInstance = function() {
	      var base, ref3;
	      base = ((ref3 = this.variable) != null ? ref3.base : void 0) || this.variable;
	      if (base instanceof Call && !base.isNew) {
	        base.newInstance();
	      } else {
	        this.isNew = true;
	      }
	      return this;
	    };

	    Call.prototype.superReference = function(o) {
	      var accesses, base, bref, klass, method, name, nref, variable;
	      method = o.scope.namedMethod();
	      if (method != null ? method.klass : void 0) {
	        klass = method.klass, name = method.name, variable = method.variable;
	        if (klass.isComplex()) {
	          bref = new Literal(o.scope.parent.freeVariable('base'));
	          base = new Value(new Parens(new Assign(bref, klass)));
	          variable.base = base;
	          variable.properties.splice(0, klass.properties.length);
	        }
	        if (name.isComplex() || (name instanceof Index && name.index.isAssignable())) {
	          nref = new Literal(o.scope.parent.freeVariable('name'));
	          name = new Index(new Assign(nref, name.index));
	          variable.properties.pop();
	          variable.properties.push(name);
	        }
	        accesses = [new Access(new Literal('__super__'))];
	        if (method["static"]) {
	          accesses.push(new Access(new Literal('constructor')));
	        }
	        accesses.push(nref != null ? new Index(nref) : name);
	        return (new Value(bref != null ? bref : klass, accesses)).compile(o);
	      } else if (method != null ? method.ctor : void 0) {
	        return method.name + ".__super__.constructor";
	      } else {
	        return this.error('cannot call super outside of an instance method.');
	      }
	    };

	    Call.prototype.superThis = function(o) {
	      var method;
	      method = o.scope.method;
	      return (method && !method.klass && method.context) || "this";
	    };

	    Call.prototype.unfoldSoak = function(o) {
	      var call, ifn, j, left, len1, list, ref3, ref4, rite;
	      if (this.soak) {
	        if (this.variable) {
	          if (ifn = unfoldSoak(o, this, 'variable')) {
	            return ifn;
	          }
	          ref3 = new Value(this.variable).cacheReference(o), left = ref3[0], rite = ref3[1];
	        } else {
	          left = new Literal(this.superReference(o));
	          rite = new Value(left);
	        }
	        rite = new Call(rite, this.args);
	        rite.isNew = this.isNew;
	        left = new Literal("typeof " + (left.compile(o)) + " === \"function\"");
	        return new If(left, new Value(rite), {
	          soak: true
	        });
	      }
	      call = this;
	      list = [];
	      while (true) {
	        if (call.variable instanceof Call) {
	          list.push(call);
	          call = call.variable;
	          continue;
	        }
	        if (!(call.variable instanceof Value)) {
	          break;
	        }
	        list.push(call);
	        if (!((call = call.variable.base) instanceof Call)) {
	          break;
	        }
	      }
	      ref4 = list.reverse();
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        call = ref4[j];
	        if (ifn) {
	          if (call.variable instanceof Call) {
	            call.variable = ifn;
	          } else {
	            call.variable.base = ifn;
	          }
	        }
	        ifn = unfoldSoak(o, call, 'variable');
	      }
	      return ifn;
	    };

	    Call.prototype.compileNode = function(o) {
	      var arg, argIndex, compiledArgs, compiledArray, fragments, j, len1, preface, ref3, ref4;
	      if ((ref3 = this.variable) != null) {
	        ref3.front = this.front;
	      }
	      compiledArray = Splat.compileSplattedArray(o, this.args, true);
	      if (compiledArray.length) {
	        return this.compileSplat(o, compiledArray);
	      }
	      compiledArgs = [];
	      ref4 = this.args;
	      for (argIndex = j = 0, len1 = ref4.length; j < len1; argIndex = ++j) {
	        arg = ref4[argIndex];
	        if (argIndex) {
	          compiledArgs.push(this.makeCode(", "));
	        }
	        compiledArgs.push.apply(compiledArgs, arg.compileToFragments(o, LEVEL_LIST));
	      }
	      fragments = [];
	      if (this.isSuper) {
	        preface = this.superReference(o) + (".call(" + (this.superThis(o)));
	        if (compiledArgs.length) {
	          preface += ", ";
	        }
	        fragments.push(this.makeCode(preface));
	      } else {
	        if (this.isNew) {
	          fragments.push(this.makeCode('new '));
	        }
	        fragments.push.apply(fragments, this.variable.compileToFragments(o, LEVEL_ACCESS));
	        fragments.push(this.makeCode("("));
	      }
	      fragments.push.apply(fragments, compiledArgs);
	      fragments.push(this.makeCode(")"));
	      return fragments;
	    };

	    Call.prototype.compileSplat = function(o, splatArgs) {
	      var answer, base, fun, idt, name, ref;
	      if (this.isSuper) {
	        return [].concat(this.makeCode((this.superReference(o)) + ".apply(" + (this.superThis(o)) + ", "), splatArgs, this.makeCode(")"));
	      }
	      if (this.isNew) {
	        idt = this.tab + TAB;
	        return [].concat(this.makeCode("(function(func, args, ctor) {\n" + idt + "ctor.prototype = func.prototype;\n" + idt + "var child = new ctor, result = func.apply(child, args);\n" + idt + "return Object(result) === result ? result : child;\n" + this.tab + "})("), this.variable.compileToFragments(o, LEVEL_LIST), this.makeCode(", "), splatArgs, this.makeCode(", function(){})"));
	      }
	      answer = [];
	      base = new Value(this.variable);
	      if ((name = base.properties.pop()) && base.isComplex()) {
	        ref = o.scope.freeVariable('ref');
	        answer = answer.concat(this.makeCode("(" + ref + " = "), base.compileToFragments(o, LEVEL_LIST), this.makeCode(")"), name.compileToFragments(o));
	      } else {
	        fun = base.compileToFragments(o, LEVEL_ACCESS);
	        if (SIMPLENUM.test(fragmentsToText(fun))) {
	          fun = this.wrapInBraces(fun);
	        }
	        if (name) {
	          ref = fragmentsToText(fun);
	          fun.push.apply(fun, name.compileToFragments(o));
	        } else {
	          ref = 'null';
	        }
	        answer = answer.concat(fun);
	      }
	      return answer = answer.concat(this.makeCode(".apply(" + ref + ", "), splatArgs, this.makeCode(")"));
	    };

	    return Call;

	  })(Base);

	  exports.Extends = Extends = (function(superClass1) {
	    extend1(Extends, superClass1);

	    function Extends(child1, parent1) {
	      this.child = child1;
	      this.parent = parent1;
	    }

	    Extends.prototype.children = ['child', 'parent'];

	    Extends.prototype.compileToFragments = function(o) {
	      return new Call(new Value(new Literal(utility('extend', o))), [this.child, this.parent]).compileToFragments(o);
	    };

	    return Extends;

	  })(Base);

	  exports.Access = Access = (function(superClass1) {
	    extend1(Access, superClass1);

	    function Access(name1, tag) {
	      this.name = name1;
	      this.name.asKey = true;
	      this.soak = tag === 'soak';
	    }

	    Access.prototype.children = ['name'];

	    Access.prototype.compileToFragments = function(o) {
	      var name;
	      name = this.name.compileToFragments(o);
	      if (IDENTIFIER.test(fragmentsToText(name))) {
	        name.unshift(this.makeCode("."));
	      } else {
	        name.unshift(this.makeCode("["));
	        name.push(this.makeCode("]"));
	      }
	      return name;
	    };

	    Access.prototype.isComplex = NO;

	    return Access;

	  })(Base);

	  exports.Index = Index = (function(superClass1) {
	    extend1(Index, superClass1);

	    function Index(index1) {
	      this.index = index1;
	    }

	    Index.prototype.children = ['index'];

	    Index.prototype.compileToFragments = function(o) {
	      return [].concat(this.makeCode("["), this.index.compileToFragments(o, LEVEL_PAREN), this.makeCode("]"));
	    };

	    Index.prototype.isComplex = function() {
	      return this.index.isComplex();
	    };

	    return Index;

	  })(Base);

	  exports.Range = Range = (function(superClass1) {
	    extend1(Range, superClass1);

	    Range.prototype.children = ['from', 'to'];

	    function Range(from1, to1, tag) {
	      this.from = from1;
	      this.to = to1;
	      this.exclusive = tag === 'exclusive';
	      this.equals = this.exclusive ? '' : '=';
	    }

	    Range.prototype.compileVariables = function(o) {
	      var isComplex, ref3, ref4, ref5, ref6, step;
	      o = merge(o, {
	        top: true
	      });
	      isComplex = del(o, 'isComplex');
	      ref3 = this.cacheToCodeFragments(this.from.cache(o, LEVEL_LIST, isComplex)), this.fromC = ref3[0], this.fromVar = ref3[1];
	      ref4 = this.cacheToCodeFragments(this.to.cache(o, LEVEL_LIST, isComplex)), this.toC = ref4[0], this.toVar = ref4[1];
	      if (step = del(o, 'step')) {
	        ref5 = this.cacheToCodeFragments(step.cache(o, LEVEL_LIST, isComplex)), this.step = ref5[0], this.stepVar = ref5[1];
	      }
	      ref6 = [this.fromVar.match(NUMBER), this.toVar.match(NUMBER)], this.fromNum = ref6[0], this.toNum = ref6[1];
	      if (this.stepVar) {
	        return this.stepNum = this.stepVar.match(NUMBER);
	      }
	    };

	    Range.prototype.compileNode = function(o) {
	      var cond, condPart, from, gt, idx, idxName, known, lt, namedIndex, ref3, ref4, stepPart, to, varPart;
	      if (!this.fromVar) {
	        this.compileVariables(o);
	      }
	      if (!o.index) {
	        return this.compileArray(o);
	      }
	      known = this.fromNum && this.toNum;
	      idx = del(o, 'index');
	      idxName = del(o, 'name');
	      namedIndex = idxName && idxName !== idx;
	      varPart = idx + " = " + this.fromC;
	      if (this.toC !== this.toVar) {
	        varPart += ", " + this.toC;
	      }
	      if (this.step !== this.stepVar) {
	        varPart += ", " + this.step;
	      }
	      ref3 = [idx + " <" + this.equals, idx + " >" + this.equals], lt = ref3[0], gt = ref3[1];
	      condPart = this.stepNum ? parseNum(this.stepNum[0]) > 0 ? lt + " " + this.toVar : gt + " " + this.toVar : known ? ((ref4 = [parseNum(this.fromNum[0]), parseNum(this.toNum[0])], from = ref4[0], to = ref4[1], ref4), from <= to ? lt + " " + to : gt + " " + to) : (cond = this.stepVar ? this.stepVar + " > 0" : this.fromVar + " <= " + this.toVar, cond + " ? " + lt + " " + this.toVar + " : " + gt + " " + this.toVar);
	      stepPart = this.stepVar ? idx + " += " + this.stepVar : known ? namedIndex ? from <= to ? "++" + idx : "--" + idx : from <= to ? idx + "++" : idx + "--" : namedIndex ? cond + " ? ++" + idx + " : --" + idx : cond + " ? " + idx + "++ : " + idx + "--";
	      if (namedIndex) {
	        varPart = idxName + " = " + varPart;
	      }
	      if (namedIndex) {
	        stepPart = idxName + " = " + stepPart;
	      }
	      return [this.makeCode(varPart + "; " + condPart + "; " + stepPart)];
	    };

	    Range.prototype.compileArray = function(o) {
	      var args, body, cond, hasArgs, i, idt, j, post, pre, range, ref3, ref4, result, results, vars;
	      if (this.fromNum && this.toNum && Math.abs(this.fromNum - this.toNum) <= 20) {
	        range = (function() {
	          results = [];
	          for (var j = ref3 = +this.fromNum, ref4 = +this.toNum; ref3 <= ref4 ? j <= ref4 : j >= ref4; ref3 <= ref4 ? j++ : j--){ results.push(j); }
	          return results;
	        }).apply(this);
	        if (this.exclusive) {
	          range.pop();
	        }
	        return [this.makeCode("[" + (range.join(', ')) + "]")];
	      }
	      idt = this.tab + TAB;
	      i = o.scope.freeVariable('i', {
	        single: true
	      });
	      result = o.scope.freeVariable('results');
	      pre = "\n" + idt + result + " = [];";
	      if (this.fromNum && this.toNum) {
	        o.index = i;
	        body = fragmentsToText(this.compileNode(o));
	      } else {
	        vars = (i + " = " + this.fromC) + (this.toC !== this.toVar ? ", " + this.toC : '');
	        cond = this.fromVar + " <= " + this.toVar;
	        body = "var " + vars + "; " + cond + " ? " + i + " <" + this.equals + " " + this.toVar + " : " + i + " >" + this.equals + " " + this.toVar + "; " + cond + " ? " + i + "++ : " + i + "--";
	      }
	      post = "{ " + result + ".push(" + i + "); }\n" + idt + "return " + result + ";\n" + o.indent;
	      hasArgs = function(node) {
	        return node != null ? node.contains(isLiteralArguments) : void 0;
	      };
	      if (hasArgs(this.from) || hasArgs(this.to)) {
	        args = ', arguments';
	      }
	      return [this.makeCode("(function() {" + pre + "\n" + idt + "for (" + body + ")" + post + "}).apply(this" + (args != null ? args : '') + ")")];
	    };

	    return Range;

	  })(Base);

	  exports.Slice = Slice = (function(superClass1) {
	    extend1(Slice, superClass1);

	    Slice.prototype.children = ['range'];

	    function Slice(range1) {
	      this.range = range1;
	      Slice.__super__.constructor.call(this);
	    }

	    Slice.prototype.compileNode = function(o) {
	      var compiled, compiledText, from, fromCompiled, ref3, to, toStr;
	      ref3 = this.range, to = ref3.to, from = ref3.from;
	      fromCompiled = from && from.compileToFragments(o, LEVEL_PAREN) || [this.makeCode('0')];
	      if (to) {
	        compiled = to.compileToFragments(o, LEVEL_PAREN);
	        compiledText = fragmentsToText(compiled);
	        if (!(!this.range.exclusive && +compiledText === -1)) {
	          toStr = ', ' + (this.range.exclusive ? compiledText : SIMPLENUM.test(compiledText) ? "" + (+compiledText + 1) : (compiled = to.compileToFragments(o, LEVEL_ACCESS), "+" + (fragmentsToText(compiled)) + " + 1 || 9e9"));
	        }
	      }
	      return [this.makeCode(".slice(" + (fragmentsToText(fromCompiled)) + (toStr || '') + ")")];
	    };

	    return Slice;

	  })(Base);

	  exports.Obj = Obj = (function(superClass1) {
	    extend1(Obj, superClass1);

	    function Obj(props, generated) {
	      this.generated = generated != null ? generated : false;
	      this.objects = this.properties = props || [];
	    }

	    Obj.prototype.children = ['properties'];

	    Obj.prototype.compileNode = function(o) {
	      var answer, dynamicIndex, hasDynamic, i, idt, indent, j, join, k, key, l, lastNoncom, len1, len2, len3, node, oref, prop, props, ref3, value;
	      props = this.properties;
	      if (this.generated) {
	        for (j = 0, len1 = props.length; j < len1; j++) {
	          node = props[j];
	          if (node instanceof Value) {
	            node.error('cannot have an implicit value in an implicit object');
	          }
	        }
	      }
	      for (dynamicIndex = k = 0, len2 = props.length; k < len2; dynamicIndex = ++k) {
	        prop = props[dynamicIndex];
	        if ((prop.variable || prop).base instanceof Parens) {
	          break;
	        }
	      }
	      hasDynamic = dynamicIndex < props.length;
	      idt = o.indent += TAB;
	      lastNoncom = this.lastNonComment(this.properties);
	      answer = [];
	      if (hasDynamic) {
	        oref = o.scope.freeVariable('obj');
	        answer.push(this.makeCode("(\n" + idt + oref + " = "));
	      }
	      answer.push(this.makeCode("{" + (props.length === 0 || dynamicIndex === 0 ? '}' : '\n')));
	      for (i = l = 0, len3 = props.length; l < len3; i = ++l) {
	        prop = props[i];
	        if (i === dynamicIndex) {
	          if (i !== 0) {
	            answer.push(this.makeCode("\n" + idt + "}"));
	          }
	          answer.push(this.makeCode(',\n'));
	        }
	        join = i === props.length - 1 || i === dynamicIndex - 1 ? '' : prop === lastNoncom || prop instanceof Comment ? '\n' : ',\n';
	        indent = prop instanceof Comment ? '' : idt;
	        if (hasDynamic && i < dynamicIndex) {
	          indent += TAB;
	        }
	        if (prop instanceof Assign && prop.variable instanceof Value && prop.variable.hasProperties()) {
	          prop.variable.error('Invalid object key');
	        }
	        if (prop instanceof Value && prop["this"]) {
	          prop = new Assign(prop.properties[0].name, prop, 'object');
	        }
	        if (!(prop instanceof Comment)) {
	          if (i < dynamicIndex) {
	            if (!(prop instanceof Assign)) {
	              prop = new Assign(prop, prop, 'object');
	            }
	            (prop.variable.base || prop.variable).asKey = true;
	          } else {
	            if (prop instanceof Assign) {
	              key = prop.variable;
	              value = prop.value;
	            } else {
	              ref3 = prop.base.cache(o), key = ref3[0], value = ref3[1];
	            }
	            prop = new Assign(new Value(new Literal(oref), [new Access(key)]), value);
	          }
	        }
	        if (indent) {
	          answer.push(this.makeCode(indent));
	        }
	        answer.push.apply(answer, prop.compileToFragments(o, LEVEL_TOP));
	        if (join) {
	          answer.push(this.makeCode(join));
	        }
	      }
	      if (hasDynamic) {
	        answer.push(this.makeCode(",\n" + idt + oref + "\n" + this.tab + ")"));
	      } else {
	        if (props.length !== 0) {
	          answer.push(this.makeCode("\n" + this.tab + "}"));
	        }
	      }
	      if (this.front && !hasDynamic) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Obj.prototype.assigns = function(name) {
	      var j, len1, prop, ref3;
	      ref3 = this.properties;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        prop = ref3[j];
	        if (prop.assigns(name)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    return Obj;

	  })(Base);

	  exports.Arr = Arr = (function(superClass1) {
	    extend1(Arr, superClass1);

	    function Arr(objs) {
	      this.objects = objs || [];
	    }

	    Arr.prototype.children = ['objects'];

	    Arr.prototype.compileNode = function(o) {
	      var answer, compiledObjs, fragments, index, j, len1, obj;
	      if (!this.objects.length) {
	        return [this.makeCode('[]')];
	      }
	      o.indent += TAB;
	      answer = Splat.compileSplattedArray(o, this.objects);
	      if (answer.length) {
	        return answer;
	      }
	      answer = [];
	      compiledObjs = (function() {
	        var j, len1, ref3, results;
	        ref3 = this.objects;
	        results = [];
	        for (j = 0, len1 = ref3.length; j < len1; j++) {
	          obj = ref3[j];
	          results.push(obj.compileToFragments(o, LEVEL_LIST));
	        }
	        return results;
	      }).call(this);
	      for (index = j = 0, len1 = compiledObjs.length; j < len1; index = ++j) {
	        fragments = compiledObjs[index];
	        if (index) {
	          answer.push(this.makeCode(", "));
	        }
	        answer.push.apply(answer, fragments);
	      }
	      if (fragmentsToText(answer).indexOf('\n') >= 0) {
	        answer.unshift(this.makeCode("[\n" + o.indent));
	        answer.push(this.makeCode("\n" + this.tab + "]"));
	      } else {
	        answer.unshift(this.makeCode("["));
	        answer.push(this.makeCode("]"));
	      }
	      return answer;
	    };

	    Arr.prototype.assigns = function(name) {
	      var j, len1, obj, ref3;
	      ref3 = this.objects;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        obj = ref3[j];
	        if (obj.assigns(name)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    return Arr;

	  })(Base);

	  exports.Class = Class = (function(superClass1) {
	    extend1(Class, superClass1);

	    function Class(variable1, parent1, body1) {
	      this.variable = variable1;
	      this.parent = parent1;
	      this.body = body1 != null ? body1 : new Block;
	      this.boundFuncs = [];
	      this.body.classBody = true;
	    }

	    Class.prototype.children = ['variable', 'parent', 'body'];

	    Class.prototype.determineName = function() {
	      var decl, ref3, tail;
	      if (!this.variable) {
	        return null;
	      }
	      ref3 = this.variable.properties, tail = ref3[ref3.length - 1];
	      decl = tail ? tail instanceof Access && tail.name.value : this.variable.base.value;
	      if (indexOf.call(STRICT_PROSCRIBED, decl) >= 0) {
	        this.variable.error("class variable name may not be " + decl);
	      }
	      return decl && (decl = IDENTIFIER.test(decl) && decl);
	    };

	    Class.prototype.setContext = function(name) {
	      return this.body.traverseChildren(false, function(node) {
	        if (node.classBody) {
	          return false;
	        }
	        if (node instanceof Literal && node.value === 'this') {
	          return node.value = name;
	        } else if (node instanceof Code) {
	          if (node.bound) {
	            return node.context = name;
	          }
	        }
	      });
	    };

	    Class.prototype.addBoundFunctions = function(o) {
	      var bvar, j, len1, lhs, ref3;
	      ref3 = this.boundFuncs;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        bvar = ref3[j];
	        lhs = (new Value(new Literal("this"), [new Access(bvar)])).compile(o);
	        this.ctor.body.unshift(new Literal(lhs + " = " + (utility('bind', o)) + "(" + lhs + ", this)"));
	      }
	    };

	    Class.prototype.addProperties = function(node, name, o) {
	      var acc, assign, base, exprs, func, props;
	      props = node.base.properties.slice(0);
	      exprs = (function() {
	        var results;
	        results = [];
	        while (assign = props.shift()) {
	          if (assign instanceof Assign) {
	            base = assign.variable.base;
	            delete assign.context;
	            func = assign.value;
	            if (base.value === 'constructor') {
	              if (this.ctor) {
	                assign.error('cannot define more than one constructor in a class');
	              }
	              if (func.bound) {
	                assign.error('cannot define a constructor as a bound function');
	              }
	              if (func instanceof Code) {
	                assign = this.ctor = func;
	              } else {
	                this.externalCtor = o.classScope.freeVariable('class');
	                assign = new Assign(new Literal(this.externalCtor), func);
	              }
	            } else {
	              if (assign.variable["this"]) {
	                func["static"] = true;
	              } else {
	                acc = base.isComplex() ? new Index(base) : new Access(base);
	                assign.variable = new Value(new Literal(name), [new Access(new Literal('prototype')), acc]);
	                if (func instanceof Code && func.bound) {
	                  this.boundFuncs.push(base);
	                  func.bound = false;
	                }
	              }
	            }
	          }
	          results.push(assign);
	        }
	        return results;
	      }).call(this);
	      return compact(exprs);
	    };

	    Class.prototype.walkBody = function(name, o) {
	      return this.traverseChildren(false, (function(_this) {
	        return function(child) {
	          var cont, exps, i, j, len1, node, ref3;
	          cont = true;
	          if (child instanceof Class) {
	            return false;
	          }
	          if (child instanceof Block) {
	            ref3 = exps = child.expressions;
	            for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	              node = ref3[i];
	              if (node instanceof Assign && node.variable.looksStatic(name)) {
	                node.value["static"] = true;
	              } else if (node instanceof Value && node.isObject(true)) {
	                cont = false;
	                exps[i] = _this.addProperties(node, name, o);
	              }
	            }
	            child.expressions = exps = flatten(exps);
	          }
	          return cont && !(child instanceof Class);
	        };
	      })(this));
	    };

	    Class.prototype.hoistDirectivePrologue = function() {
	      var expressions, index, node;
	      index = 0;
	      expressions = this.body.expressions;
	      while ((node = expressions[index]) && node instanceof Comment || node instanceof Value && node.isString()) {
	        ++index;
	      }
	      return this.directives = expressions.splice(0, index);
	    };

	    Class.prototype.ensureConstructor = function(name) {
	      if (!this.ctor) {
	        this.ctor = new Code;
	        if (this.externalCtor) {
	          this.ctor.body.push(new Literal(this.externalCtor + ".apply(this, arguments)"));
	        } else if (this.parent) {
	          this.ctor.body.push(new Literal(name + ".__super__.constructor.apply(this, arguments)"));
	        }
	        this.ctor.body.makeReturn();
	        this.body.expressions.unshift(this.ctor);
	      }
	      this.ctor.ctor = this.ctor.name = name;
	      this.ctor.klass = null;
	      return this.ctor.noReturn = true;
	    };

	    Class.prototype.compileNode = function(o) {
	      var args, argumentsNode, func, jumpNode, klass, lname, name, ref3, superClass;
	      if (jumpNode = this.body.jumps()) {
	        jumpNode.error('Class bodies cannot contain pure statements');
	      }
	      if (argumentsNode = this.body.contains(isLiteralArguments)) {
	        argumentsNode.error("Class bodies shouldn't reference arguments");
	      }
	      name = this.determineName() || '_Class';
	      if (name.reserved) {
	        name = "_" + name;
	      }
	      lname = new Literal(name);
	      func = new Code([], Block.wrap([this.body]));
	      args = [];
	      o.classScope = func.makeScope(o.scope);
	      this.hoistDirectivePrologue();
	      this.setContext(name);
	      this.walkBody(name, o);
	      this.ensureConstructor(name);
	      this.addBoundFunctions(o);
	      this.body.spaced = true;
	      this.body.expressions.push(lname);
	      if (this.parent) {
	        superClass = new Literal(o.classScope.freeVariable('superClass', {
	          reserve: false
	        }));
	        this.body.expressions.unshift(new Extends(lname, superClass));
	        func.params.push(new Param(superClass));
	        args.push(this.parent);
	      }
	      (ref3 = this.body.expressions).unshift.apply(ref3, this.directives);
	      klass = new Parens(new Call(func, args));
	      if (this.variable) {
	        klass = new Assign(this.variable, klass);
	      }
	      return klass.compileToFragments(o);
	    };

	    return Class;

	  })(Base);

	  exports.Assign = Assign = (function(superClass1) {
	    extend1(Assign, superClass1);

	    function Assign(variable1, value1, context, options) {
	      var forbidden, name, ref3;
	      this.variable = variable1;
	      this.value = value1;
	      this.context = context;
	      this.param = options && options.param;
	      this.subpattern = options && options.subpattern;
	      forbidden = (ref3 = (name = this.variable.unwrapAll().value), indexOf.call(STRICT_PROSCRIBED, ref3) >= 0);
	      if (forbidden && this.context !== 'object') {
	        this.variable.error("variable name may not be \"" + name + "\"");
	      }
	    }

	    Assign.prototype.children = ['variable', 'value'];

	    Assign.prototype.isStatement = function(o) {
	      return (o != null ? o.level : void 0) === LEVEL_TOP && (this.context != null) && indexOf.call(this.context, "?") >= 0;
	    };

	    Assign.prototype.assigns = function(name) {
	      return this[this.context === 'object' ? 'value' : 'variable'].assigns(name);
	    };

	    Assign.prototype.unfoldSoak = function(o) {
	      return unfoldSoak(o, this, 'variable');
	    };

	    Assign.prototype.compileNode = function(o) {
	      var answer, compiledName, isValue, j, name, properties, prototype, ref3, ref4, ref5, ref6, ref7, val, varBase;
	      if (isValue = this.variable instanceof Value) {
	        if (this.variable.isArray() || this.variable.isObject()) {
	          return this.compilePatternMatch(o);
	        }
	        if (this.variable.isSplice()) {
	          return this.compileSplice(o);
	        }
	        if ((ref3 = this.context) === '||=' || ref3 === '&&=' || ref3 === '?=') {
	          return this.compileConditional(o);
	        }
	        if ((ref4 = this.context) === '**=' || ref4 === '//=' || ref4 === '%%=') {
	          return this.compileSpecialMath(o);
	        }
	      }
	      if (this.value instanceof Code) {
	        if (this.value["static"]) {
	          this.value.klass = this.variable.base;
	          this.value.name = this.variable.properties[0];
	          this.value.variable = this.variable;
	        } else if (((ref5 = this.variable.properties) != null ? ref5.length : void 0) >= 2) {
	          ref6 = this.variable.properties, properties = 3 <= ref6.length ? slice.call(ref6, 0, j = ref6.length - 2) : (j = 0, []), prototype = ref6[j++], name = ref6[j++];
	          if (((ref7 = prototype.name) != null ? ref7.value : void 0) === 'prototype') {
	            this.value.klass = new Value(this.variable.base, properties);
	            this.value.name = name;
	            this.value.variable = this.variable;
	          }
	        }
	      }
	      if (!this.context) {
	        varBase = this.variable.unwrapAll();
	        if (!varBase.isAssignable()) {
	          this.variable.error("\"" + (this.variable.compile(o)) + "\" cannot be assigned");
	        }
	        if (!(typeof varBase.hasProperties === "function" ? varBase.hasProperties() : void 0)) {
	          if (this.param) {
	            o.scope.add(varBase.value, 'var');
	          } else {
	            o.scope.find(varBase.value);
	          }
	        }
	      }
	      val = this.value.compileToFragments(o, LEVEL_LIST);
	      compiledName = this.variable.compileToFragments(o, LEVEL_LIST);
	      if (this.context === 'object') {
	        return compiledName.concat(this.makeCode(": "), val);
	      }
	      answer = compiledName.concat(this.makeCode(" " + (this.context || '=') + " "), val);
	      if (o.level <= LEVEL_LIST) {
	        return answer;
	      } else {
	        return this.wrapInBraces(answer);
	      }
	    };

	    Assign.prototype.compilePatternMatch = function(o) {
	      var acc, assigns, code, expandedIdx, fragments, i, idx, isObject, ivar, j, len1, name, obj, objects, olen, ref, ref3, ref4, ref5, ref6, ref7, ref8, rest, top, val, value, vvar, vvarText;
	      top = o.level === LEVEL_TOP;
	      value = this.value;
	      objects = this.variable.base.objects;
	      if (!(olen = objects.length)) {
	        code = value.compileToFragments(o);
	        if (o.level >= LEVEL_OP) {
	          return this.wrapInBraces(code);
	        } else {
	          return code;
	        }
	      }
	      isObject = this.variable.isObject();
	      if (top && olen === 1 && !((obj = objects[0]) instanceof Splat)) {
	        if (obj instanceof Assign) {
	          ref3 = obj, (ref4 = ref3.variable, idx = ref4.base), obj = ref3.value;
	        } else {
	          idx = isObject ? obj["this"] ? obj.properties[0].name : obj : new Literal(0);
	        }
	        acc = IDENTIFIER.test(idx.unwrap().value || 0);
	        value = new Value(value);
	        value.properties.push(new (acc ? Access : Index)(idx));
	        if (ref5 = obj.unwrap().value, indexOf.call(RESERVED, ref5) >= 0) {
	          obj.error("assignment to a reserved word: " + (obj.compile(o)));
	        }
	        return new Assign(obj, value, null, {
	          param: this.param
	        }).compileToFragments(o, LEVEL_TOP);
	      }
	      vvar = value.compileToFragments(o, LEVEL_LIST);
	      vvarText = fragmentsToText(vvar);
	      assigns = [];
	      expandedIdx = false;
	      if (!IDENTIFIER.test(vvarText) || this.variable.assigns(vvarText)) {
	        assigns.push([this.makeCode((ref = o.scope.freeVariable('ref')) + " = ")].concat(slice.call(vvar)));
	        vvar = [this.makeCode(ref)];
	        vvarText = ref;
	      }
	      for (i = j = 0, len1 = objects.length; j < len1; i = ++j) {
	        obj = objects[i];
	        idx = i;
	        if (isObject) {
	          if (obj instanceof Assign) {
	            ref6 = obj, (ref7 = ref6.variable, idx = ref7.base), obj = ref6.value;
	          } else {
	            if (obj.base instanceof Parens) {
	              ref8 = new Value(obj.unwrapAll()).cacheReference(o), obj = ref8[0], idx = ref8[1];
	            } else {
	              idx = obj["this"] ? obj.properties[0].name : obj;
	            }
	          }
	        }
	        if (!expandedIdx && obj instanceof Splat) {
	          name = obj.name.unwrap().value;
	          obj = obj.unwrap();
	          val = olen + " <= " + vvarText + ".length ? " + (utility('slice', o)) + ".call(" + vvarText + ", " + i;
	          if (rest = olen - i - 1) {
	            ivar = o.scope.freeVariable('i', {
	              single: true
	            });
	            val += ", " + ivar + " = " + vvarText + ".length - " + rest + ") : (" + ivar + " = " + i + ", [])";
	          } else {
	            val += ") : []";
	          }
	          val = new Literal(val);
	          expandedIdx = ivar + "++";
	        } else if (!expandedIdx && obj instanceof Expansion) {
	          if (rest = olen - i - 1) {
	            if (rest === 1) {
	              expandedIdx = vvarText + ".length - 1";
	            } else {
	              ivar = o.scope.freeVariable('i', {
	                single: true
	              });
	              val = new Literal(ivar + " = " + vvarText + ".length - " + rest);
	              expandedIdx = ivar + "++";
	              assigns.push(val.compileToFragments(o, LEVEL_LIST));
	            }
	          }
	          continue;
	        } else {
	          name = obj.unwrap().value;
	          if (obj instanceof Splat || obj instanceof Expansion) {
	            obj.error("multiple splats/expansions are disallowed in an assignment");
	          }
	          if (typeof idx === 'number') {
	            idx = new Literal(expandedIdx || idx);
	            acc = false;
	          } else {
	            acc = isObject && IDENTIFIER.test(idx.unwrap().value || 0);
	          }
	          val = new Value(new Literal(vvarText), [new (acc ? Access : Index)(idx)]);
	        }
	        if ((name != null) && indexOf.call(RESERVED, name) >= 0) {
	          obj.error("assignment to a reserved word: " + (obj.compile(o)));
	        }
	        assigns.push(new Assign(obj, val, null, {
	          param: this.param,
	          subpattern: true
	        }).compileToFragments(o, LEVEL_LIST));
	      }
	      if (!(top || this.subpattern)) {
	        assigns.push(vvar);
	      }
	      fragments = this.joinFragmentArrays(assigns, ', ');
	      if (o.level < LEVEL_LIST) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    Assign.prototype.compileConditional = function(o) {
	      var fragments, left, ref3, right;
	      ref3 = this.variable.cacheReference(o), left = ref3[0], right = ref3[1];
	      if (!left.properties.length && left.base instanceof Literal && left.base.value !== "this" && !o.scope.check(left.base.value)) {
	        this.variable.error("the variable \"" + left.base.value + "\" can't be assigned with " + this.context + " because it has not been declared before");
	      }
	      if (indexOf.call(this.context, "?") >= 0) {
	        o.isExistentialEquals = true;
	        return new If(new Existence(left), right, {
	          type: 'if'
	        }).addElse(new Assign(right, this.value, '=')).compileToFragments(o);
	      } else {
	        fragments = new Op(this.context.slice(0, -1), left, new Assign(right, this.value, '=')).compileToFragments(o);
	        if (o.level <= LEVEL_LIST) {
	          return fragments;
	        } else {
	          return this.wrapInBraces(fragments);
	        }
	      }
	    };

	    Assign.prototype.compileSpecialMath = function(o) {
	      var left, ref3, right;
	      ref3 = this.variable.cacheReference(o), left = ref3[0], right = ref3[1];
	      return new Assign(left, new Op(this.context.slice(0, -1), right, this.value)).compileToFragments(o);
	    };

	    Assign.prototype.compileSplice = function(o) {
	      var answer, exclusive, from, fromDecl, fromRef, name, ref3, ref4, ref5, to, valDef, valRef;
	      ref3 = this.variable.properties.pop().range, from = ref3.from, to = ref3.to, exclusive = ref3.exclusive;
	      name = this.variable.compile(o);
	      if (from) {
	        ref4 = this.cacheToCodeFragments(from.cache(o, LEVEL_OP)), fromDecl = ref4[0], fromRef = ref4[1];
	      } else {
	        fromDecl = fromRef = '0';
	      }
	      if (to) {
	        if (from instanceof Value && from.isSimpleNumber() && to instanceof Value && to.isSimpleNumber()) {
	          to = to.compile(o) - fromRef;
	          if (!exclusive) {
	            to += 1;
	          }
	        } else {
	          to = to.compile(o, LEVEL_ACCESS) + ' - ' + fromRef;
	          if (!exclusive) {
	            to += ' + 1';
	          }
	        }
	      } else {
	        to = "9e9";
	      }
	      ref5 = this.value.cache(o, LEVEL_LIST), valDef = ref5[0], valRef = ref5[1];
	      answer = [].concat(this.makeCode("[].splice.apply(" + name + ", [" + fromDecl + ", " + to + "].concat("), valDef, this.makeCode(")), "), valRef);
	      if (o.level > LEVEL_TOP) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    return Assign;

	  })(Base);

	  exports.Code = Code = (function(superClass1) {
	    extend1(Code, superClass1);

	    function Code(params, body, tag) {
	      this.params = params || [];
	      this.body = body || new Block;
	      this.bound = tag === 'boundfunc';
	      this.isGenerator = !!this.body.contains(function(node) {
	        var ref3;
	        return node instanceof Op && ((ref3 = node.operator) === 'yield' || ref3 === 'yield*');
	      });
	    }

	    Code.prototype.children = ['params', 'body'];

	    Code.prototype.isStatement = function() {
	      return !!this.ctor;
	    };

	    Code.prototype.jumps = NO;

	    Code.prototype.makeScope = function(parentScope) {
	      return new Scope(parentScope, this.body, this);
	    };

	    Code.prototype.compileNode = function(o) {
	      var answer, boundfunc, code, exprs, i, j, k, l, len1, len2, len3, len4, len5, len6, lit, m, p, param, params, q, r, ref, ref3, ref4, ref5, ref6, ref7, ref8, splats, uniqs, val, wasEmpty, wrapper;
	      if (this.bound && ((ref3 = o.scope.method) != null ? ref3.bound : void 0)) {
	        this.context = o.scope.method.context;
	      }
	      if (this.bound && !this.context) {
	        this.context = '_this';
	        wrapper = new Code([new Param(new Literal(this.context))], new Block([this]));
	        boundfunc = new Call(wrapper, [new Literal('this')]);
	        boundfunc.updateLocationDataIfMissing(this.locationData);
	        return boundfunc.compileNode(o);
	      }
	      o.scope = del(o, 'classScope') || this.makeScope(o.scope);
	      o.scope.shared = del(o, 'sharedScope');
	      o.indent += TAB;
	      delete o.bare;
	      delete o.isExistentialEquals;
	      params = [];
	      exprs = [];
	      ref4 = this.params;
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        param = ref4[j];
	        if (!(param instanceof Expansion)) {
	          o.scope.parameter(param.asReference(o));
	        }
	      }
	      ref5 = this.params;
	      for (k = 0, len2 = ref5.length; k < len2; k++) {
	        param = ref5[k];
	        if (!(param.splat || param instanceof Expansion)) {
	          continue;
	        }
	        ref6 = this.params;
	        for (l = 0, len3 = ref6.length; l < len3; l++) {
	          p = ref6[l];
	          if (!(p instanceof Expansion) && p.name.value) {
	            o.scope.add(p.name.value, 'var', true);
	          }
	        }
	        splats = new Assign(new Value(new Arr((function() {
	          var len4, m, ref7, results;
	          ref7 = this.params;
	          results = [];
	          for (m = 0, len4 = ref7.length; m < len4; m++) {
	            p = ref7[m];
	            results.push(p.asReference(o));
	          }
	          return results;
	        }).call(this))), new Value(new Literal('arguments')));
	        break;
	      }
	      ref7 = this.params;
	      for (m = 0, len4 = ref7.length; m < len4; m++) {
	        param = ref7[m];
	        if (param.isComplex()) {
	          val = ref = param.asReference(o);
	          if (param.value) {
	            val = new Op('?', ref, param.value);
	          }
	          exprs.push(new Assign(new Value(param.name), val, '=', {
	            param: true
	          }));
	        } else {
	          ref = param;
	          if (param.value) {
	            lit = new Literal(ref.name.value + ' == null');
	            val = new Assign(new Value(param.name), param.value, '=');
	            exprs.push(new If(lit, val));
	          }
	        }
	        if (!splats) {
	          params.push(ref);
	        }
	      }
	      wasEmpty = this.body.isEmpty();
	      if (splats) {
	        exprs.unshift(splats);
	      }
	      if (exprs.length) {
	        (ref8 = this.body.expressions).unshift.apply(ref8, exprs);
	      }
	      for (i = q = 0, len5 = params.length; q < len5; i = ++q) {
	        p = params[i];
	        params[i] = p.compileToFragments(o);
	        o.scope.parameter(fragmentsToText(params[i]));
	      }
	      uniqs = [];
	      this.eachParamName(function(name, node) {
	        if (indexOf.call(uniqs, name) >= 0) {
	          node.error("multiple parameters named " + name);
	        }
	        return uniqs.push(name);
	      });
	      if (!(wasEmpty || this.noReturn)) {
	        this.body.makeReturn();
	      }
	      code = 'function';
	      if (this.isGenerator) {
	        code += '*';
	      }
	      if (this.ctor) {
	        code += ' ' + this.name;
	      }
	      code += '(';
	      answer = [this.makeCode(code)];
	      for (i = r = 0, len6 = params.length; r < len6; i = ++r) {
	        p = params[i];
	        if (i) {
	          answer.push(this.makeCode(", "));
	        }
	        answer.push.apply(answer, p);
	      }
	      answer.push(this.makeCode(') {'));
	      if (!this.body.isEmpty()) {
	        answer = answer.concat(this.makeCode("\n"), this.body.compileWithDeclarations(o), this.makeCode("\n" + this.tab));
	      }
	      answer.push(this.makeCode('}'));
	      if (this.ctor) {
	        return [this.makeCode(this.tab)].concat(slice.call(answer));
	      }
	      if (this.front || (o.level >= LEVEL_ACCESS)) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Code.prototype.eachParamName = function(iterator) {
	      var j, len1, param, ref3, results;
	      ref3 = this.params;
	      results = [];
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        param = ref3[j];
	        results.push(param.eachName(iterator));
	      }
	      return results;
	    };

	    Code.prototype.traverseChildren = function(crossScope, func) {
	      if (crossScope) {
	        return Code.__super__.traverseChildren.call(this, crossScope, func);
	      }
	    };

	    return Code;

	  })(Base);

	  exports.Param = Param = (function(superClass1) {
	    extend1(Param, superClass1);

	    function Param(name1, value1, splat) {
	      var name, ref3;
	      this.name = name1;
	      this.value = value1;
	      this.splat = splat;
	      if (ref3 = (name = this.name.unwrapAll().value), indexOf.call(STRICT_PROSCRIBED, ref3) >= 0) {
	        this.name.error("parameter name \"" + name + "\" is not allowed");
	      }
	    }

	    Param.prototype.children = ['name', 'value'];

	    Param.prototype.compileToFragments = function(o) {
	      return this.name.compileToFragments(o, LEVEL_LIST);
	    };

	    Param.prototype.asReference = function(o) {
	      var name, node;
	      if (this.reference) {
	        return this.reference;
	      }
	      node = this.name;
	      if (node["this"]) {
	        name = node.properties[0].name.value;
	        if (name.reserved) {
	          name = "_" + name;
	        }
	        node = new Literal(o.scope.freeVariable(name));
	      } else if (node.isComplex()) {
	        node = new Literal(o.scope.freeVariable('arg'));
	      }
	      node = new Value(node);
	      if (this.splat) {
	        node = new Splat(node);
	      }
	      node.updateLocationDataIfMissing(this.locationData);
	      return this.reference = node;
	    };

	    Param.prototype.isComplex = function() {
	      return this.name.isComplex();
	    };

	    Param.prototype.eachName = function(iterator, name) {
	      var atParam, j, len1, node, obj, ref3;
	      if (name == null) {
	        name = this.name;
	      }
	      atParam = function(obj) {
	        return iterator("@" + obj.properties[0].name.value, obj);
	      };
	      if (name instanceof Literal) {
	        return iterator(name.value, name);
	      }
	      if (name instanceof Value) {
	        return atParam(name);
	      }
	      ref3 = name.objects;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        obj = ref3[j];
	        if (obj instanceof Assign) {
	          this.eachName(iterator, obj.value.unwrap());
	        } else if (obj instanceof Splat) {
	          node = obj.name.unwrap();
	          iterator(node.value, node);
	        } else if (obj instanceof Value) {
	          if (obj.isArray() || obj.isObject()) {
	            this.eachName(iterator, obj.base);
	          } else if (obj["this"]) {
	            atParam(obj);
	          } else {
	            iterator(obj.base.value, obj.base);
	          }
	        } else if (!(obj instanceof Expansion)) {
	          obj.error("illegal parameter " + (obj.compile()));
	        }
	      }
	    };

	    return Param;

	  })(Base);

	  exports.Splat = Splat = (function(superClass1) {
	    extend1(Splat, superClass1);

	    Splat.prototype.children = ['name'];

	    Splat.prototype.isAssignable = YES;

	    function Splat(name) {
	      this.name = name.compile ? name : new Literal(name);
	    }

	    Splat.prototype.assigns = function(name) {
	      return this.name.assigns(name);
	    };

	    Splat.prototype.compileToFragments = function(o) {
	      return this.name.compileToFragments(o);
	    };

	    Splat.prototype.unwrap = function() {
	      return this.name;
	    };

	    Splat.compileSplattedArray = function(o, list, apply) {
	      var args, base, compiledNode, concatPart, fragments, i, index, j, last, len1, node;
	      index = -1;
	      while ((node = list[++index]) && !(node instanceof Splat)) {
	        continue;
	      }
	      if (index >= list.length) {
	        return [];
	      }
	      if (list.length === 1) {
	        node = list[0];
	        fragments = node.compileToFragments(o, LEVEL_LIST);
	        if (apply) {
	          return fragments;
	        }
	        return [].concat(node.makeCode((utility('slice', o)) + ".call("), fragments, node.makeCode(")"));
	      }
	      args = list.slice(index);
	      for (i = j = 0, len1 = args.length; j < len1; i = ++j) {
	        node = args[i];
	        compiledNode = node.compileToFragments(o, LEVEL_LIST);
	        args[i] = node instanceof Splat ? [].concat(node.makeCode((utility('slice', o)) + ".call("), compiledNode, node.makeCode(")")) : [].concat(node.makeCode("["), compiledNode, node.makeCode("]"));
	      }
	      if (index === 0) {
	        node = list[0];
	        concatPart = node.joinFragmentArrays(args.slice(1), ', ');
	        return args[0].concat(node.makeCode(".concat("), concatPart, node.makeCode(")"));
	      }
	      base = (function() {
	        var k, len2, ref3, results;
	        ref3 = list.slice(0, index);
	        results = [];
	        for (k = 0, len2 = ref3.length; k < len2; k++) {
	          node = ref3[k];
	          results.push(node.compileToFragments(o, LEVEL_LIST));
	        }
	        return results;
	      })();
	      base = list[0].joinFragmentArrays(base, ', ');
	      concatPart = list[index].joinFragmentArrays(args, ', ');
	      last = list[list.length - 1];
	      return [].concat(list[0].makeCode("["), base, list[index].makeCode("].concat("), concatPart, last.makeCode(")"));
	    };

	    return Splat;

	  })(Base);

	  exports.Expansion = Expansion = (function(superClass1) {
	    extend1(Expansion, superClass1);

	    function Expansion() {
	      return Expansion.__super__.constructor.apply(this, arguments);
	    }

	    Expansion.prototype.isComplex = NO;

	    Expansion.prototype.compileNode = function(o) {
	      return this.error('Expansion must be used inside a destructuring assignment or parameter list');
	    };

	    Expansion.prototype.asReference = function(o) {
	      return this;
	    };

	    Expansion.prototype.eachName = function(iterator) {};

	    return Expansion;

	  })(Base);

	  exports.While = While = (function(superClass1) {
	    extend1(While, superClass1);

	    function While(condition, options) {
	      this.condition = (options != null ? options.invert : void 0) ? condition.invert() : condition;
	      this.guard = options != null ? options.guard : void 0;
	    }

	    While.prototype.children = ['condition', 'guard', 'body'];

	    While.prototype.isStatement = YES;

	    While.prototype.makeReturn = function(res) {
	      if (res) {
	        return While.__super__.makeReturn.apply(this, arguments);
	      } else {
	        this.returns = !this.jumps({
	          loop: true
	        });
	        return this;
	      }
	    };

	    While.prototype.addBody = function(body1) {
	      this.body = body1;
	      return this;
	    };

	    While.prototype.jumps = function() {
	      var expressions, j, jumpNode, len1, node;
	      expressions = this.body.expressions;
	      if (!expressions.length) {
	        return false;
	      }
	      for (j = 0, len1 = expressions.length; j < len1; j++) {
	        node = expressions[j];
	        if (jumpNode = node.jumps({
	          loop: true
	        })) {
	          return jumpNode;
	        }
	      }
	      return false;
	    };

	    While.prototype.compileNode = function(o) {
	      var answer, body, rvar, set;
	      o.indent += TAB;
	      set = '';
	      body = this.body;
	      if (body.isEmpty()) {
	        body = this.makeCode('');
	      } else {
	        if (this.returns) {
	          body.makeReturn(rvar = o.scope.freeVariable('results'));
	          set = "" + this.tab + rvar + " = [];\n";
	        }
	        if (this.guard) {
	          if (body.expressions.length > 1) {
	            body.expressions.unshift(new If((new Parens(this.guard)).invert(), new Literal("continue")));
	          } else {
	            if (this.guard) {
	              body = Block.wrap([new If(this.guard, body)]);
	            }
	          }
	        }
	        body = [].concat(this.makeCode("\n"), body.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab));
	      }
	      answer = [].concat(this.makeCode(set + this.tab + "while ("), this.condition.compileToFragments(o, LEVEL_PAREN), this.makeCode(") {"), body, this.makeCode("}"));
	      if (this.returns) {
	        answer.push(this.makeCode("\n" + this.tab + "return " + rvar + ";"));
	      }
	      return answer;
	    };

	    return While;

	  })(Base);

	  exports.Op = Op = (function(superClass1) {
	    var CONVERSIONS, INVERSIONS;

	    extend1(Op, superClass1);

	    function Op(op, first, second, flip) {
	      if (op === 'in') {
	        return new In(first, second);
	      }
	      if (op === 'do') {
	        return this.generateDo(first);
	      }
	      if (op === 'new') {
	        if (first instanceof Call && !first["do"] && !first.isNew) {
	          return first.newInstance();
	        }
	        if (first instanceof Code && first.bound || first["do"]) {
	          first = new Parens(first);
	        }
	      }
	      this.operator = CONVERSIONS[op] || op;
	      this.first = first;
	      this.second = second;
	      this.flip = !!flip;
	      return this;
	    }

	    CONVERSIONS = {
	      '==': '===',
	      '!=': '!==',
	      'of': 'in',
	      'yieldfrom': 'yield*'
	    };

	    INVERSIONS = {
	      '!==': '===',
	      '===': '!=='
	    };

	    Op.prototype.children = ['first', 'second'];

	    Op.prototype.isSimpleNumber = NO;

	    Op.prototype.isYield = function() {
	      var ref3;
	      return (ref3 = this.operator) === 'yield' || ref3 === 'yield*';
	    };

	    Op.prototype.isYieldReturn = function() {
	      return this.isYield() && this.first instanceof Return;
	    };

	    Op.prototype.isUnary = function() {
	      return !this.second;
	    };

	    Op.prototype.isComplex = function() {
	      var ref3;
	      return !(this.isUnary() && ((ref3 = this.operator) === '+' || ref3 === '-') && this.first instanceof Value && this.first.isSimpleNumber());
	    };

	    Op.prototype.isChainable = function() {
	      var ref3;
	      return (ref3 = this.operator) === '<' || ref3 === '>' || ref3 === '>=' || ref3 === '<=' || ref3 === '===' || ref3 === '!==';
	    };

	    Op.prototype.invert = function() {
	      var allInvertable, curr, fst, op, ref3;
	      if (this.isChainable() && this.first.isChainable()) {
	        allInvertable = true;
	        curr = this;
	        while (curr && curr.operator) {
	          allInvertable && (allInvertable = curr.operator in INVERSIONS);
	          curr = curr.first;
	        }
	        if (!allInvertable) {
	          return new Parens(this).invert();
	        }
	        curr = this;
	        while (curr && curr.operator) {
	          curr.invert = !curr.invert;
	          curr.operator = INVERSIONS[curr.operator];
	          curr = curr.first;
	        }
	        return this;
	      } else if (op = INVERSIONS[this.operator]) {
	        this.operator = op;
	        if (this.first.unwrap() instanceof Op) {
	          this.first.invert();
	        }
	        return this;
	      } else if (this.second) {
	        return new Parens(this).invert();
	      } else if (this.operator === '!' && (fst = this.first.unwrap()) instanceof Op && ((ref3 = fst.operator) === '!' || ref3 === 'in' || ref3 === 'instanceof')) {
	        return fst;
	      } else {
	        return new Op('!', this);
	      }
	    };

	    Op.prototype.unfoldSoak = function(o) {
	      var ref3;
	      return ((ref3 = this.operator) === '++' || ref3 === '--' || ref3 === 'delete') && unfoldSoak(o, this, 'first');
	    };

	    Op.prototype.generateDo = function(exp) {
	      var call, func, j, len1, param, passedParams, ref, ref3;
	      passedParams = [];
	      func = exp instanceof Assign && (ref = exp.value.unwrap()) instanceof Code ? ref : exp;
	      ref3 = func.params || [];
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        param = ref3[j];
	        if (param.value) {
	          passedParams.push(param.value);
	          delete param.value;
	        } else {
	          passedParams.push(param);
	        }
	      }
	      call = new Call(exp, passedParams);
	      call["do"] = true;
	      return call;
	    };

	    Op.prototype.compileNode = function(o) {
	      var answer, isChain, lhs, ref3, ref4, rhs;
	      isChain = this.isChainable() && this.first.isChainable();
	      if (!isChain) {
	        this.first.front = this.front;
	      }
	      if (this.operator === 'delete' && o.scope.check(this.first.unwrapAll().value)) {
	        this.error('delete operand may not be argument or var');
	      }
	      if (((ref3 = this.operator) === '--' || ref3 === '++') && (ref4 = this.first.unwrapAll().value, indexOf.call(STRICT_PROSCRIBED, ref4) >= 0)) {
	        this.error("cannot increment/decrement \"" + (this.first.unwrapAll().value) + "\"");
	      }
	      if (this.isYield()) {
	        return this.compileYield(o);
	      }
	      if (this.isUnary()) {
	        return this.compileUnary(o);
	      }
	      if (isChain) {
	        return this.compileChain(o);
	      }
	      switch (this.operator) {
	        case '?':
	          return this.compileExistence(o);
	        case '**':
	          return this.compilePower(o);
	        case '//':
	          return this.compileFloorDivision(o);
	        case '%%':
	          return this.compileModulo(o);
	        default:
	          lhs = this.first.compileToFragments(o, LEVEL_OP);
	          rhs = this.second.compileToFragments(o, LEVEL_OP);
	          answer = [].concat(lhs, this.makeCode(" " + this.operator + " "), rhs);
	          if (o.level <= LEVEL_OP) {
	            return answer;
	          } else {
	            return this.wrapInBraces(answer);
	          }
	      }
	    };

	    Op.prototype.compileChain = function(o) {
	      var fragments, fst, ref3, shared;
	      ref3 = this.first.second.cache(o), this.first.second = ref3[0], shared = ref3[1];
	      fst = this.first.compileToFragments(o, LEVEL_OP);
	      fragments = fst.concat(this.makeCode(" " + (this.invert ? '&&' : '||') + " "), shared.compileToFragments(o), this.makeCode(" " + this.operator + " "), this.second.compileToFragments(o, LEVEL_OP));
	      return this.wrapInBraces(fragments);
	    };

	    Op.prototype.compileExistence = function(o) {
	      var fst, ref;
	      if (this.first.isComplex()) {
	        ref = new Literal(o.scope.freeVariable('ref'));
	        fst = new Parens(new Assign(ref, this.first));
	      } else {
	        fst = this.first;
	        ref = fst;
	      }
	      return new If(new Existence(fst), ref, {
	        type: 'if'
	      }).addElse(this.second).compileToFragments(o);
	    };

	    Op.prototype.compileUnary = function(o) {
	      var op, parts, plusMinus;
	      parts = [];
	      op = this.operator;
	      parts.push([this.makeCode(op)]);
	      if (op === '!' && this.first instanceof Existence) {
	        this.first.negated = !this.first.negated;
	        return this.first.compileToFragments(o);
	      }
	      if (o.level >= LEVEL_ACCESS) {
	        return (new Parens(this)).compileToFragments(o);
	      }
	      plusMinus = op === '+' || op === '-';
	      if ((op === 'new' || op === 'typeof' || op === 'delete') || plusMinus && this.first instanceof Op && this.first.operator === op) {
	        parts.push([this.makeCode(' ')]);
	      }
	      if ((plusMinus && this.first instanceof Op) || (op === 'new' && this.first.isStatement(o))) {
	        this.first = new Parens(this.first);
	      }
	      parts.push(this.first.compileToFragments(o, LEVEL_OP));
	      if (this.flip) {
	        parts.reverse();
	      }
	      return this.joinFragmentArrays(parts, '');
	    };

	    Op.prototype.compileYield = function(o) {
	      var op, parts;
	      parts = [];
	      op = this.operator;
	      if (o.scope.parent == null) {
	        this.error('yield statements must occur within a function generator.');
	      }
	      if (indexOf.call(Object.keys(this.first), 'expression') >= 0 && !(this.first instanceof Throw)) {
	        if (this.isYieldReturn()) {
	          parts.push(this.first.compileToFragments(o, LEVEL_TOP));
	        } else if (this.first.expression != null) {
	          parts.push(this.first.expression.compileToFragments(o, LEVEL_OP));
	        }
	      } else {
	        parts.push([this.makeCode("(" + op + " ")]);
	        parts.push(this.first.compileToFragments(o, LEVEL_OP));
	        parts.push([this.makeCode(")")]);
	      }
	      return this.joinFragmentArrays(parts, '');
	    };

	    Op.prototype.compilePower = function(o) {
	      var pow;
	      pow = new Value(new Literal('Math'), [new Access(new Literal('pow'))]);
	      return new Call(pow, [this.first, this.second]).compileToFragments(o);
	    };

	    Op.prototype.compileFloorDivision = function(o) {
	      var div, floor;
	      floor = new Value(new Literal('Math'), [new Access(new Literal('floor'))]);
	      div = new Op('/', this.first, this.second);
	      return new Call(floor, [div]).compileToFragments(o);
	    };

	    Op.prototype.compileModulo = function(o) {
	      var mod;
	      mod = new Value(new Literal(utility('modulo', o)));
	      return new Call(mod, [this.first, this.second]).compileToFragments(o);
	    };

	    Op.prototype.toString = function(idt) {
	      return Op.__super__.toString.call(this, idt, this.constructor.name + ' ' + this.operator);
	    };

	    return Op;

	  })(Base);

	  exports.In = In = (function(superClass1) {
	    extend1(In, superClass1);

	    function In(object, array) {
	      this.object = object;
	      this.array = array;
	    }

	    In.prototype.children = ['object', 'array'];

	    In.prototype.invert = NEGATE;

	    In.prototype.compileNode = function(o) {
	      var hasSplat, j, len1, obj, ref3;
	      if (this.array instanceof Value && this.array.isArray() && this.array.base.objects.length) {
	        ref3 = this.array.base.objects;
	        for (j = 0, len1 = ref3.length; j < len1; j++) {
	          obj = ref3[j];
	          if (!(obj instanceof Splat)) {
	            continue;
	          }
	          hasSplat = true;
	          break;
	        }
	        if (!hasSplat) {
	          return this.compileOrTest(o);
	        }
	      }
	      return this.compileLoopTest(o);
	    };

	    In.prototype.compileOrTest = function(o) {
	      var cmp, cnj, i, item, j, len1, ref, ref3, ref4, ref5, sub, tests;
	      ref3 = this.object.cache(o, LEVEL_OP), sub = ref3[0], ref = ref3[1];
	      ref4 = this.negated ? [' !== ', ' && '] : [' === ', ' || '], cmp = ref4[0], cnj = ref4[1];
	      tests = [];
	      ref5 = this.array.base.objects;
	      for (i = j = 0, len1 = ref5.length; j < len1; i = ++j) {
	        item = ref5[i];
	        if (i) {
	          tests.push(this.makeCode(cnj));
	        }
	        tests = tests.concat((i ? ref : sub), this.makeCode(cmp), item.compileToFragments(o, LEVEL_ACCESS));
	      }
	      if (o.level < LEVEL_OP) {
	        return tests;
	      } else {
	        return this.wrapInBraces(tests);
	      }
	    };

	    In.prototype.compileLoopTest = function(o) {
	      var fragments, ref, ref3, sub;
	      ref3 = this.object.cache(o, LEVEL_LIST), sub = ref3[0], ref = ref3[1];
	      fragments = [].concat(this.makeCode(utility('indexOf', o) + ".call("), this.array.compileToFragments(o, LEVEL_LIST), this.makeCode(", "), ref, this.makeCode(") " + (this.negated ? '< 0' : '>= 0')));
	      if (fragmentsToText(sub) === fragmentsToText(ref)) {
	        return fragments;
	      }
	      fragments = sub.concat(this.makeCode(', '), fragments);
	      if (o.level < LEVEL_LIST) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    In.prototype.toString = function(idt) {
	      return In.__super__.toString.call(this, idt, this.constructor.name + (this.negated ? '!' : ''));
	    };

	    return In;

	  })(Base);

	  exports.Try = Try = (function(superClass1) {
	    extend1(Try, superClass1);

	    function Try(attempt, errorVariable, recovery, ensure) {
	      this.attempt = attempt;
	      this.errorVariable = errorVariable;
	      this.recovery = recovery;
	      this.ensure = ensure;
	    }

	    Try.prototype.children = ['attempt', 'recovery', 'ensure'];

	    Try.prototype.isStatement = YES;

	    Try.prototype.jumps = function(o) {
	      var ref3;
	      return this.attempt.jumps(o) || ((ref3 = this.recovery) != null ? ref3.jumps(o) : void 0);
	    };

	    Try.prototype.makeReturn = function(res) {
	      if (this.attempt) {
	        this.attempt = this.attempt.makeReturn(res);
	      }
	      if (this.recovery) {
	        this.recovery = this.recovery.makeReturn(res);
	      }
	      return this;
	    };

	    Try.prototype.compileNode = function(o) {
	      var catchPart, ensurePart, placeholder, tryPart;
	      o.indent += TAB;
	      tryPart = this.attempt.compileToFragments(o, LEVEL_TOP);
	      catchPart = this.recovery ? (placeholder = new Literal('_error'), this.errorVariable ? this.recovery.unshift(new Assign(this.errorVariable, placeholder)) : void 0, [].concat(this.makeCode(" catch ("), placeholder.compileToFragments(o), this.makeCode(") {\n"), this.recovery.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab + "}"))) : !(this.ensure || this.recovery) ? [this.makeCode(' catch (_error) {}')] : [];
	      ensurePart = this.ensure ? [].concat(this.makeCode(" finally {\n"), this.ensure.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab + "}")) : [];
	      return [].concat(this.makeCode(this.tab + "try {\n"), tryPart, this.makeCode("\n" + this.tab + "}"), catchPart, ensurePart);
	    };

	    return Try;

	  })(Base);

	  exports.Throw = Throw = (function(superClass1) {
	    extend1(Throw, superClass1);

	    function Throw(expression) {
	      this.expression = expression;
	    }

	    Throw.prototype.children = ['expression'];

	    Throw.prototype.isStatement = YES;

	    Throw.prototype.jumps = NO;

	    Throw.prototype.makeReturn = THIS;

	    Throw.prototype.compileNode = function(o) {
	      return [].concat(this.makeCode(this.tab + "throw "), this.expression.compileToFragments(o), this.makeCode(";"));
	    };

	    return Throw;

	  })(Base);

	  exports.Existence = Existence = (function(superClass1) {
	    extend1(Existence, superClass1);

	    function Existence(expression) {
	      this.expression = expression;
	    }

	    Existence.prototype.children = ['expression'];

	    Existence.prototype.invert = NEGATE;

	    Existence.prototype.compileNode = function(o) {
	      var cmp, cnj, code, ref3;
	      this.expression.front = this.front;
	      code = this.expression.compile(o, LEVEL_OP);
	      if (IDENTIFIER.test(code) && !o.scope.check(code)) {
	        ref3 = this.negated ? ['===', '||'] : ['!==', '&&'], cmp = ref3[0], cnj = ref3[1];
	        code = "typeof " + code + " " + cmp + " \"undefined\" " + cnj + " " + code + " " + cmp + " null";
	      } else {
	        code = code + " " + (this.negated ? '==' : '!=') + " null";
	      }
	      return [this.makeCode(o.level <= LEVEL_COND ? code : "(" + code + ")")];
	    };

	    return Existence;

	  })(Base);

	  exports.Parens = Parens = (function(superClass1) {
	    extend1(Parens, superClass1);

	    function Parens(body1) {
	      this.body = body1;
	    }

	    Parens.prototype.children = ['body'];

	    Parens.prototype.unwrap = function() {
	      return this.body;
	    };

	    Parens.prototype.isComplex = function() {
	      return this.body.isComplex();
	    };

	    Parens.prototype.compileNode = function(o) {
	      var bare, expr, fragments;
	      expr = this.body.unwrap();
	      if (expr instanceof Value && expr.isAtomic()) {
	        expr.front = this.front;
	        return expr.compileToFragments(o);
	      }
	      fragments = expr.compileToFragments(o, LEVEL_PAREN);
	      bare = o.level < LEVEL_OP && (expr instanceof Op || expr instanceof Call || (expr instanceof For && expr.returns));
	      if (bare) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    return Parens;

	  })(Base);

	  exports.For = For = (function(superClass1) {
	    extend1(For, superClass1);

	    function For(body, source) {
	      var ref3;
	      this.source = source.source, this.guard = source.guard, this.step = source.step, this.name = source.name, this.index = source.index;
	      this.body = Block.wrap([body]);
	      this.own = !!source.own;
	      this.object = !!source.object;
	      if (this.object) {
	        ref3 = [this.index, this.name], this.name = ref3[0], this.index = ref3[1];
	      }
	      if (this.index instanceof Value) {
	        this.index.error('index cannot be a pattern matching expression');
	      }
	      this.range = this.source instanceof Value && this.source.base instanceof Range && !this.source.properties.length;
	      this.pattern = this.name instanceof Value;
	      if (this.range && this.index) {
	        this.index.error('indexes do not apply to range loops');
	      }
	      if (this.range && this.pattern) {
	        this.name.error('cannot pattern match over range loops');
	      }
	      if (this.own && !this.object) {
	        this.name.error('cannot use own with for-in');
	      }
	      this.returns = false;
	    }

	    For.prototype.children = ['body', 'source', 'guard', 'step'];

	    For.prototype.compileNode = function(o) {
	      var body, bodyFragments, compare, compareDown, declare, declareDown, defPart, defPartFragments, down, forPartFragments, guardPart, idt1, increment, index, ivar, kvar, kvarAssign, last, lvar, name, namePart, ref, ref3, ref4, resultPart, returnResult, rvar, scope, source, step, stepNum, stepVar, svar, varPart;
	      body = Block.wrap([this.body]);
	      ref3 = body.expressions, last = ref3[ref3.length - 1];
	      if ((last != null ? last.jumps() : void 0) instanceof Return) {
	        this.returns = false;
	      }
	      source = this.range ? this.source.base : this.source;
	      scope = o.scope;
	      if (!this.pattern) {
	        name = this.name && (this.name.compile(o, LEVEL_LIST));
	      }
	      index = this.index && (this.index.compile(o, LEVEL_LIST));
	      if (name && !this.pattern) {
	        scope.find(name);
	      }
	      if (index) {
	        scope.find(index);
	      }
	      if (this.returns) {
	        rvar = scope.freeVariable('results');
	      }
	      ivar = (this.object && index) || scope.freeVariable('i', {
	        single: true
	      });
	      kvar = (this.range && name) || index || ivar;
	      kvarAssign = kvar !== ivar ? kvar + " = " : "";
	      if (this.step && !this.range) {
	        ref4 = this.cacheToCodeFragments(this.step.cache(o, LEVEL_LIST, isComplexOrAssignable)), step = ref4[0], stepVar = ref4[1];
	        stepNum = stepVar.match(NUMBER);
	      }
	      if (this.pattern) {
	        name = ivar;
	      }
	      varPart = '';
	      guardPart = '';
	      defPart = '';
	      idt1 = this.tab + TAB;
	      if (this.range) {
	        forPartFragments = source.compileToFragments(merge(o, {
	          index: ivar,
	          name: name,
	          step: this.step,
	          isComplex: isComplexOrAssignable
	        }));
	      } else {
	        svar = this.source.compile(o, LEVEL_LIST);
	        if ((name || this.own) && !IDENTIFIER.test(svar)) {
	          defPart += "" + this.tab + (ref = scope.freeVariable('ref')) + " = " + svar + ";\n";
	          svar = ref;
	        }
	        if (name && !this.pattern) {
	          namePart = name + " = " + svar + "[" + kvar + "]";
	        }
	        if (!this.object) {
	          if (step !== stepVar) {
	            defPart += "" + this.tab + step + ";\n";
	          }
	          if (!(this.step && stepNum && (down = parseNum(stepNum[0]) < 0))) {
	            lvar = scope.freeVariable('len');
	          }
	          declare = "" + kvarAssign + ivar + " = 0, " + lvar + " = " + svar + ".length";
	          declareDown = "" + kvarAssign + ivar + " = " + svar + ".length - 1";
	          compare = ivar + " < " + lvar;
	          compareDown = ivar + " >= 0";
	          if (this.step) {
	            if (stepNum) {
	              if (down) {
	                compare = compareDown;
	                declare = declareDown;
	              }
	            } else {
	              compare = stepVar + " > 0 ? " + compare + " : " + compareDown;
	              declare = "(" + stepVar + " > 0 ? (" + declare + ") : " + declareDown + ")";
	            }
	            increment = ivar + " += " + stepVar;
	          } else {
	            increment = "" + (kvar !== ivar ? "++" + ivar : ivar + "++");
	          }
	          forPartFragments = [this.makeCode(declare + "; " + compare + "; " + kvarAssign + increment)];
	        }
	      }
	      if (this.returns) {
	        resultPart = "" + this.tab + rvar + " = [];\n";
	        returnResult = "\n" + this.tab + "return " + rvar + ";";
	        body.makeReturn(rvar);
	      }
	      if (this.guard) {
	        if (body.expressions.length > 1) {
	          body.expressions.unshift(new If((new Parens(this.guard)).invert(), new Literal("continue")));
	        } else {
	          if (this.guard) {
	            body = Block.wrap([new If(this.guard, body)]);
	          }
	        }
	      }
	      if (this.pattern) {
	        body.expressions.unshift(new Assign(this.name, new Literal(svar + "[" + kvar + "]")));
	      }
	      defPartFragments = [].concat(this.makeCode(defPart), this.pluckDirectCall(o, body));
	      if (namePart) {
	        varPart = "\n" + idt1 + namePart + ";";
	      }
	      if (this.object) {
	        forPartFragments = [this.makeCode(kvar + " in " + svar)];
	        if (this.own) {
	          guardPart = "\n" + idt1 + "if (!" + (utility('hasProp', o)) + ".call(" + svar + ", " + kvar + ")) continue;";
	        }
	      }
	      bodyFragments = body.compileToFragments(merge(o, {
	        indent: idt1
	      }), LEVEL_TOP);
	      if (bodyFragments && (bodyFragments.length > 0)) {
	        bodyFragments = [].concat(this.makeCode("\n"), bodyFragments, this.makeCode("\n"));
	      }
	      return [].concat(defPartFragments, this.makeCode("" + (resultPart || '') + this.tab + "for ("), forPartFragments, this.makeCode(") {" + guardPart + varPart), bodyFragments, this.makeCode(this.tab + "}" + (returnResult || '')));
	    };

	    For.prototype.pluckDirectCall = function(o, body) {
	      var base, defs, expr, fn, idx, j, len1, ref, ref3, ref4, ref5, ref6, ref7, ref8, ref9, val;
	      defs = [];
	      ref3 = body.expressions;
	      for (idx = j = 0, len1 = ref3.length; j < len1; idx = ++j) {
	        expr = ref3[idx];
	        expr = expr.unwrapAll();
	        if (!(expr instanceof Call)) {
	          continue;
	        }
	        val = (ref4 = expr.variable) != null ? ref4.unwrapAll() : void 0;
	        if (!((val instanceof Code) || (val instanceof Value && ((ref5 = val.base) != null ? ref5.unwrapAll() : void 0) instanceof Code && val.properties.length === 1 && ((ref6 = (ref7 = val.properties[0].name) != null ? ref7.value : void 0) === 'call' || ref6 === 'apply')))) {
	          continue;
	        }
	        fn = ((ref8 = val.base) != null ? ref8.unwrapAll() : void 0) || val;
	        ref = new Literal(o.scope.freeVariable('fn'));
	        base = new Value(ref);
	        if (val.base) {
	          ref9 = [base, val], val.base = ref9[0], base = ref9[1];
	        }
	        body.expressions[idx] = new Call(base, expr.args);
	        defs = defs.concat(this.makeCode(this.tab), new Assign(ref, fn).compileToFragments(o, LEVEL_TOP), this.makeCode(';\n'));
	      }
	      return defs;
	    };

	    return For;

	  })(While);

	  exports.Switch = Switch = (function(superClass1) {
	    extend1(Switch, superClass1);

	    function Switch(subject, cases, otherwise) {
	      this.subject = subject;
	      this.cases = cases;
	      this.otherwise = otherwise;
	    }

	    Switch.prototype.children = ['subject', 'cases', 'otherwise'];

	    Switch.prototype.isStatement = YES;

	    Switch.prototype.jumps = function(o) {
	      var block, conds, j, jumpNode, len1, ref3, ref4, ref5;
	      if (o == null) {
	        o = {
	          block: true
	        };
	      }
	      ref3 = this.cases;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        ref4 = ref3[j], conds = ref4[0], block = ref4[1];
	        if (jumpNode = block.jumps(o)) {
	          return jumpNode;
	        }
	      }
	      return (ref5 = this.otherwise) != null ? ref5.jumps(o) : void 0;
	    };

	    Switch.prototype.makeReturn = function(res) {
	      var j, len1, pair, ref3, ref4;
	      ref3 = this.cases;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        pair = ref3[j];
	        pair[1].makeReturn(res);
	      }
	      if (res) {
	        this.otherwise || (this.otherwise = new Block([new Literal('void 0')]));
	      }
	      if ((ref4 = this.otherwise) != null) {
	        ref4.makeReturn(res);
	      }
	      return this;
	    };

	    Switch.prototype.compileNode = function(o) {
	      var block, body, cond, conditions, expr, fragments, i, idt1, idt2, j, k, len1, len2, ref3, ref4, ref5;
	      idt1 = o.indent + TAB;
	      idt2 = o.indent = idt1 + TAB;
	      fragments = [].concat(this.makeCode(this.tab + "switch ("), (this.subject ? this.subject.compileToFragments(o, LEVEL_PAREN) : this.makeCode("false")), this.makeCode(") {\n"));
	      ref3 = this.cases;
	      for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	        ref4 = ref3[i], conditions = ref4[0], block = ref4[1];
	        ref5 = flatten([conditions]);
	        for (k = 0, len2 = ref5.length; k < len2; k++) {
	          cond = ref5[k];
	          if (!this.subject) {
	            cond = cond.invert();
	          }
	          fragments = fragments.concat(this.makeCode(idt1 + "case "), cond.compileToFragments(o, LEVEL_PAREN), this.makeCode(":\n"));
	        }
	        if ((body = block.compileToFragments(o, LEVEL_TOP)).length > 0) {
	          fragments = fragments.concat(body, this.makeCode('\n'));
	        }
	        if (i === this.cases.length - 1 && !this.otherwise) {
	          break;
	        }
	        expr = this.lastNonComment(block.expressions);
	        if (expr instanceof Return || (expr instanceof Literal && expr.jumps() && expr.value !== 'debugger')) {
	          continue;
	        }
	        fragments.push(cond.makeCode(idt2 + 'break;\n'));
	      }
	      if (this.otherwise && this.otherwise.expressions.length) {
	        fragments.push.apply(fragments, [this.makeCode(idt1 + "default:\n")].concat(slice.call(this.otherwise.compileToFragments(o, LEVEL_TOP)), [this.makeCode("\n")]));
	      }
	      fragments.push(this.makeCode(this.tab + '}'));
	      return fragments;
	    };

	    return Switch;

	  })(Base);

	  exports.If = If = (function(superClass1) {
	    extend1(If, superClass1);

	    function If(condition, body1, options) {
	      this.body = body1;
	      if (options == null) {
	        options = {};
	      }
	      this.condition = options.type === 'unless' ? condition.invert() : condition;
	      this.elseBody = null;
	      this.isChain = false;
	      this.soak = options.soak;
	    }

	    If.prototype.children = ['condition', 'body', 'elseBody'];

	    If.prototype.bodyNode = function() {
	      var ref3;
	      return (ref3 = this.body) != null ? ref3.unwrap() : void 0;
	    };

	    If.prototype.elseBodyNode = function() {
	      var ref3;
	      return (ref3 = this.elseBody) != null ? ref3.unwrap() : void 0;
	    };

	    If.prototype.addElse = function(elseBody) {
	      if (this.isChain) {
	        this.elseBodyNode().addElse(elseBody);
	      } else {
	        this.isChain = elseBody instanceof If;
	        this.elseBody = this.ensureBlock(elseBody);
	        this.elseBody.updateLocationDataIfMissing(elseBody.locationData);
	      }
	      return this;
	    };

	    If.prototype.isStatement = function(o) {
	      var ref3;
	      return (o != null ? o.level : void 0) === LEVEL_TOP || this.bodyNode().isStatement(o) || ((ref3 = this.elseBodyNode()) != null ? ref3.isStatement(o) : void 0);
	    };

	    If.prototype.jumps = function(o) {
	      var ref3;
	      return this.body.jumps(o) || ((ref3 = this.elseBody) != null ? ref3.jumps(o) : void 0);
	    };

	    If.prototype.compileNode = function(o) {
	      if (this.isStatement(o)) {
	        return this.compileStatement(o);
	      } else {
	        return this.compileExpression(o);
	      }
	    };

	    If.prototype.makeReturn = function(res) {
	      if (res) {
	        this.elseBody || (this.elseBody = new Block([new Literal('void 0')]));
	      }
	      this.body && (this.body = new Block([this.body.makeReturn(res)]));
	      this.elseBody && (this.elseBody = new Block([this.elseBody.makeReturn(res)]));
	      return this;
	    };

	    If.prototype.ensureBlock = function(node) {
	      if (node instanceof Block) {
	        return node;
	      } else {
	        return new Block([node]);
	      }
	    };

	    If.prototype.compileStatement = function(o) {
	      var answer, body, child, cond, exeq, ifPart, indent;
	      child = del(o, 'chainChild');
	      exeq = del(o, 'isExistentialEquals');
	      if (exeq) {
	        return new If(this.condition.invert(), this.elseBodyNode(), {
	          type: 'if'
	        }).compileToFragments(o);
	      }
	      indent = o.indent + TAB;
	      cond = this.condition.compileToFragments(o, LEVEL_PAREN);
	      body = this.ensureBlock(this.body).compileToFragments(merge(o, {
	        indent: indent
	      }));
	      ifPart = [].concat(this.makeCode("if ("), cond, this.makeCode(") {\n"), body, this.makeCode("\n" + this.tab + "}"));
	      if (!child) {
	        ifPart.unshift(this.makeCode(this.tab));
	      }
	      if (!this.elseBody) {
	        return ifPart;
	      }
	      answer = ifPart.concat(this.makeCode(' else '));
	      if (this.isChain) {
	        o.chainChild = true;
	        answer = answer.concat(this.elseBody.unwrap().compileToFragments(o, LEVEL_TOP));
	      } else {
	        answer = answer.concat(this.makeCode("{\n"), this.elseBody.compileToFragments(merge(o, {
	          indent: indent
	        }), LEVEL_TOP), this.makeCode("\n" + this.tab + "}"));
	      }
	      return answer;
	    };

	    If.prototype.compileExpression = function(o) {
	      var alt, body, cond, fragments;
	      cond = this.condition.compileToFragments(o, LEVEL_COND);
	      body = this.bodyNode().compileToFragments(o, LEVEL_LIST);
	      alt = this.elseBodyNode() ? this.elseBodyNode().compileToFragments(o, LEVEL_LIST) : [this.makeCode('void 0')];
	      fragments = cond.concat(this.makeCode(" ? "), body, this.makeCode(" : "), alt);
	      if (o.level >= LEVEL_COND) {
	        return this.wrapInBraces(fragments);
	      } else {
	        return fragments;
	      }
	    };

	    If.prototype.unfoldSoak = function() {
	      return this.soak && this;
	    };

	    return If;

	  })(Base);

	  UTILITIES = {
	    extend: function(o) {
	      return "function(child, parent) { for (var key in parent) { if (" + (utility('hasProp', o)) + ".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }";
	    },
	    bind: function() {
	      return 'function(fn, me){ return function(){ return fn.apply(me, arguments); }; }';
	    },
	    indexOf: function() {
	      return "[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }";
	    },
	    modulo: function() {
	      return "function(a, b) { return (+a % (b = +b) + b) % b; }";
	    },
	    hasProp: function() {
	      return '{}.hasOwnProperty';
	    },
	    slice: function() {
	      return '[].slice';
	    }
	  };

	  LEVEL_TOP = 1;

	  LEVEL_PAREN = 2;

	  LEVEL_LIST = 3;

	  LEVEL_COND = 4;

	  LEVEL_OP = 5;

	  LEVEL_ACCESS = 6;

	  TAB = '  ';

	  IDENTIFIER = /^(?!\d)[$\w\x7f-\uffff]+$/;

	  SIMPLENUM = /^[+-]?\d+$/;

	  HEXNUM = /^[+-]?0x[\da-f]+/i;

	  NUMBER = /^[+-]?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)$/i;

	  IS_STRING = /^['"]/;

	  IS_REGEX = /^\//;

	  utility = function(name, o) {
	    var ref, root;
	    root = o.scope.root;
	    if (name in root.utilities) {
	      return root.utilities[name];
	    } else {
	      ref = root.freeVariable(name);
	      root.assign(ref, UTILITIES[name](o));
	      return root.utilities[name] = ref;
	    }
	  };

	  multident = function(code, tab) {
	    code = code.replace(/\n/g, '$&' + tab);
	    return code.replace(/\s+$/, '');
	  };

	  parseNum = function(x) {
	    if (x == null) {
	      return 0;
	    } else if (x.match(HEXNUM)) {
	      return parseInt(x, 16);
	    } else {
	      return parseFloat(x);
	    }
	  };

	  isLiteralArguments = function(node) {
	    return node instanceof Literal && node.value === 'arguments' && !node.asKey;
	  };

	  isLiteralThis = function(node) {
	    return (node instanceof Literal && node.value === 'this' && !node.asKey) || (node instanceof Code && node.bound) || (node instanceof Call && node.isSuper);
	  };

	  isComplexOrAssignable = function(node) {
	    return node.isComplex() || (typeof node.isAssignable === "function" ? node.isAssignable() : void 0);
	  };

	  unfoldSoak = function(o, parent, name) {
	    var ifn;
	    if (!(ifn = parent[name].unfoldSoak(o))) {
	      return;
	    }
	    parent[name] = ifn.body;
	    ifn.body = new Value(parent);
	    return ifn;
	  };

	}).call(this);


/***/ },
/* 28 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var Scope,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  exports.Scope = Scope = (function() {
	    function Scope(parent, expressions, method, referencedVars) {
	      var ref, ref1;
	      this.parent = parent;
	      this.expressions = expressions;
	      this.method = method;
	      this.referencedVars = referencedVars;
	      this.variables = [
	        {
	          name: 'arguments',
	          type: 'arguments'
	        }
	      ];
	      this.positions = {};
	      if (!this.parent) {
	        this.utilities = {};
	      }
	      this.root = (ref = (ref1 = this.parent) != null ? ref1.root : void 0) != null ? ref : this;
	    }

	    Scope.prototype.add = function(name, type, immediate) {
	      if (this.shared && !immediate) {
	        return this.parent.add(name, type, immediate);
	      }
	      if (Object.prototype.hasOwnProperty.call(this.positions, name)) {
	        return this.variables[this.positions[name]].type = type;
	      } else {
	        return this.positions[name] = this.variables.push({
	          name: name,
	          type: type
	        }) - 1;
	      }
	    };

	    Scope.prototype.namedMethod = function() {
	      var ref;
	      if (((ref = this.method) != null ? ref.name : void 0) || !this.parent) {
	        return this.method;
	      }
	      return this.parent.namedMethod();
	    };

	    Scope.prototype.find = function(name) {
	      if (this.check(name)) {
	        return true;
	      }
	      this.add(name, 'var');
	      return false;
	    };

	    Scope.prototype.parameter = function(name) {
	      if (this.shared && this.parent.check(name, true)) {
	        return;
	      }
	      return this.add(name, 'param');
	    };

	    Scope.prototype.check = function(name) {
	      var ref;
	      return !!(this.type(name) || ((ref = this.parent) != null ? ref.check(name) : void 0));
	    };

	    Scope.prototype.temporary = function(name, index, single) {
	      if (single == null) {
	        single = false;
	      }
	      if (single) {
	        return (index + parseInt(name, 36)).toString(36).replace(/\d/g, 'a');
	      } else {
	        return name + (index || '');
	      }
	    };

	    Scope.prototype.type = function(name) {
	      var i, len, ref, v;
	      ref = this.variables;
	      for (i = 0, len = ref.length; i < len; i++) {
	        v = ref[i];
	        if (v.name === name) {
	          return v.type;
	        }
	      }
	      return null;
	    };

	    Scope.prototype.freeVariable = function(name, options) {
	      var index, ref, temp;
	      if (options == null) {
	        options = {};
	      }
	      index = 0;
	      while (true) {
	        temp = this.temporary(name, index, options.single);
	        if (!(this.check(temp) || indexOf.call(this.root.referencedVars, temp) >= 0)) {
	          break;
	        }
	        index++;
	      }
	      if ((ref = options.reserve) != null ? ref : true) {
	        this.add(temp, 'var', true);
	      }
	      return temp;
	    };

	    Scope.prototype.assign = function(name, value) {
	      this.add(name, {
	        value: value,
	        assigned: true
	      }, true);
	      return this.hasAssignments = true;
	    };

	    Scope.prototype.hasDeclarations = function() {
	      return !!this.declaredVariables().length;
	    };

	    Scope.prototype.declaredVariables = function() {
	      var v;
	      return ((function() {
	        var i, len, ref, results;
	        ref = this.variables;
	        results = [];
	        for (i = 0, len = ref.length; i < len; i++) {
	          v = ref[i];
	          if (v.type === 'var') {
	            results.push(v.name);
	          }
	        }
	        return results;
	      }).call(this)).sort();
	    };

	    Scope.prototype.assignedVariables = function() {
	      var i, len, ref, results, v;
	      ref = this.variables;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        v = ref[i];
	        if (v.type.assigned) {
	          results.push(v.name + " = " + v.type.value);
	        }
	      }
	      return results;
	    };

	    return Scope;

	  })();

	}).call(this);


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var Parser, alt, alternatives, grammar, name, o, operators, token, tokens, unwrap;

	  Parser = __webpack_require__(30).Parser;

	  unwrap = /^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/;

	  o = function(patternString, action, options) {
	    var addLocationDataFn, match, patternCount;
	    patternString = patternString.replace(/\s{2,}/g, ' ');
	    patternCount = patternString.split(' ').length;
	    if (!action) {
	      return [patternString, '$$ = $1;', options];
	    }
	    action = (match = unwrap.exec(action)) ? match[1] : "(" + action + "())";
	    action = action.replace(/\bnew /g, '$&yy.');
	    action = action.replace(/\b(?:Block\.wrap|extend)\b/g, 'yy.$&');
	    addLocationDataFn = function(first, last) {
	      if (!last) {
	        return "yy.addLocationDataFn(@" + first + ")";
	      } else {
	        return "yy.addLocationDataFn(@" + first + ", @" + last + ")";
	      }
	    };
	    action = action.replace(/LOC\(([0-9]*)\)/g, addLocationDataFn('$1'));
	    action = action.replace(/LOC\(([0-9]*),\s*([0-9]*)\)/g, addLocationDataFn('$1', '$2'));
	    return [patternString, "$$ = " + (addLocationDataFn(1, patternCount)) + "(" + action + ");", options];
	  };

	  grammar = {
	    Root: [
	      o('', function() {
	        return new Block;
	      }), o('Body')
	    ],
	    Body: [
	      o('Line', function() {
	        return Block.wrap([$1]);
	      }), o('Body TERMINATOR Line', function() {
	        return $1.push($3);
	      }), o('Body TERMINATOR')
	    ],
	    Line: [o('Expression'), o('Statement')],
	    Statement: [
	      o('Return'), o('Comment'), o('STATEMENT', function() {
	        return new Literal($1);
	      })
	    ],
	    Expression: [o('Value'), o('Invocation'), o('Code'), o('Operation'), o('Assign'), o('If'), o('Try'), o('While'), o('For'), o('Switch'), o('Class'), o('Throw')],
	    Block: [
	      o('INDENT OUTDENT', function() {
	        return new Block;
	      }), o('INDENT Body OUTDENT', function() {
	        return $2;
	      })
	    ],
	    Identifier: [
	      o('IDENTIFIER', function() {
	        return new Literal($1);
	      })
	    ],
	    AlphaNumeric: [
	      o('NUMBER', function() {
	        return new Literal($1);
	      }), o('String')
	    ],
	    String: [
	      o('STRING', function() {
	        return new Literal($1);
	      }), o('STRING_START Body STRING_END', function() {
	        return new Parens($2);
	      })
	    ],
	    Regex: [
	      o('REGEX', function() {
	        return new Literal($1);
	      }), o('REGEX_START Invocation REGEX_END', function() {
	        return $2;
	      })
	    ],
	    Literal: [
	      o('AlphaNumeric'), o('JS', function() {
	        return new Literal($1);
	      }), o('Regex'), o('DEBUGGER', function() {
	        return new Literal($1);
	      }), o('UNDEFINED', function() {
	        return new Undefined;
	      }), o('NULL', function() {
	        return new Null;
	      }), o('BOOL', function() {
	        return new Bool($1);
	      })
	    ],
	    Assign: [
	      o('Assignable = Expression', function() {
	        return new Assign($1, $3);
	      }), o('Assignable = TERMINATOR Expression', function() {
	        return new Assign($1, $4);
	      }), o('Assignable = INDENT Expression OUTDENT', function() {
	        return new Assign($1, $4);
	      })
	    ],
	    AssignObj: [
	      o('ObjAssignable', function() {
	        return new Value($1);
	      }), o('ObjAssignable : Expression', function() {
	        return new Assign(LOC(1)(new Value($1)), $3, 'object');
	      }), o('ObjAssignable : INDENT Expression OUTDENT', function() {
	        return new Assign(LOC(1)(new Value($1)), $4, 'object');
	      }), o('Comment')
	    ],
	    ObjAssignable: [o('Identifier'), o('AlphaNumeric'), o('ThisProperty')],
	    Return: [
	      o('RETURN Expression', function() {
	        return new Return($2);
	      }), o('RETURN', function() {
	        return new Return;
	      })
	    ],
	    Comment: [
	      o('HERECOMMENT', function() {
	        return new Comment($1);
	      })
	    ],
	    Code: [
	      o('PARAM_START ParamList PARAM_END FuncGlyph Block', function() {
	        return new Code($2, $5, $4);
	      }), o('FuncGlyph Block', function() {
	        return new Code([], $2, $1);
	      })
	    ],
	    FuncGlyph: [
	      o('->', function() {
	        return 'func';
	      }), o('=>', function() {
	        return 'boundfunc';
	      })
	    ],
	    OptComma: [o(''), o(',')],
	    ParamList: [
	      o('', function() {
	        return [];
	      }), o('Param', function() {
	        return [$1];
	      }), o('ParamList , Param', function() {
	        return $1.concat($3);
	      }), o('ParamList OptComma TERMINATOR Param', function() {
	        return $1.concat($4);
	      }), o('ParamList OptComma INDENT ParamList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Param: [
	      o('ParamVar', function() {
	        return new Param($1);
	      }), o('ParamVar ...', function() {
	        return new Param($1, null, true);
	      }), o('ParamVar = Expression', function() {
	        return new Param($1, $3);
	      }), o('...', function() {
	        return new Expansion;
	      })
	    ],
	    ParamVar: [o('Identifier'), o('ThisProperty'), o('Array'), o('Object')],
	    Splat: [
	      o('Expression ...', function() {
	        return new Splat($1);
	      })
	    ],
	    SimpleAssignable: [
	      o('Identifier', function() {
	        return new Value($1);
	      }), o('Value Accessor', function() {
	        return $1.add($2);
	      }), o('Invocation Accessor', function() {
	        return new Value($1, [].concat($2));
	      }), o('ThisProperty')
	    ],
	    Assignable: [
	      o('SimpleAssignable'), o('Array', function() {
	        return new Value($1);
	      }), o('Object', function() {
	        return new Value($1);
	      })
	    ],
	    Value: [
	      o('Assignable'), o('Literal', function() {
	        return new Value($1);
	      }), o('Parenthetical', function() {
	        return new Value($1);
	      }), o('Range', function() {
	        return new Value($1);
	      }), o('This')
	    ],
	    Accessor: [
	      o('.  Identifier', function() {
	        return new Access($2);
	      }), o('?. Identifier', function() {
	        return new Access($2, 'soak');
	      }), o(':: Identifier', function() {
	        return [LOC(1)(new Access(new Literal('prototype'))), LOC(2)(new Access($2))];
	      }), o('?:: Identifier', function() {
	        return [LOC(1)(new Access(new Literal('prototype'), 'soak')), LOC(2)(new Access($2))];
	      }), o('::', function() {
	        return new Access(new Literal('prototype'));
	      }), o('Index')
	    ],
	    Index: [
	      o('INDEX_START IndexValue INDEX_END', function() {
	        return $2;
	      }), o('INDEX_SOAK  Index', function() {
	        return extend($2, {
	          soak: true
	        });
	      })
	    ],
	    IndexValue: [
	      o('Expression', function() {
	        return new Index($1);
	      }), o('Slice', function() {
	        return new Slice($1);
	      })
	    ],
	    Object: [
	      o('{ AssignList OptComma }', function() {
	        return new Obj($2, $1.generated);
	      })
	    ],
	    AssignList: [
	      o('', function() {
	        return [];
	      }), o('AssignObj', function() {
	        return [$1];
	      }), o('AssignList , AssignObj', function() {
	        return $1.concat($3);
	      }), o('AssignList OptComma TERMINATOR AssignObj', function() {
	        return $1.concat($4);
	      }), o('AssignList OptComma INDENT AssignList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Class: [
	      o('CLASS', function() {
	        return new Class;
	      }), o('CLASS Block', function() {
	        return new Class(null, null, $2);
	      }), o('CLASS EXTENDS Expression', function() {
	        return new Class(null, $3);
	      }), o('CLASS EXTENDS Expression Block', function() {
	        return new Class(null, $3, $4);
	      }), o('CLASS SimpleAssignable', function() {
	        return new Class($2);
	      }), o('CLASS SimpleAssignable Block', function() {
	        return new Class($2, null, $3);
	      }), o('CLASS SimpleAssignable EXTENDS Expression', function() {
	        return new Class($2, $4);
	      }), o('CLASS SimpleAssignable EXTENDS Expression Block', function() {
	        return new Class($2, $4, $5);
	      })
	    ],
	    Invocation: [
	      o('Value OptFuncExist Arguments', function() {
	        return new Call($1, $3, $2);
	      }), o('Invocation OptFuncExist Arguments', function() {
	        return new Call($1, $3, $2);
	      }), o('SUPER', function() {
	        return new Call('super', [new Splat(new Literal('arguments'))]);
	      }), o('SUPER Arguments', function() {
	        return new Call('super', $2);
	      })
	    ],
	    OptFuncExist: [
	      o('', function() {
	        return false;
	      }), o('FUNC_EXIST', function() {
	        return true;
	      })
	    ],
	    Arguments: [
	      o('CALL_START CALL_END', function() {
	        return [];
	      }), o('CALL_START ArgList OptComma CALL_END', function() {
	        return $2;
	      })
	    ],
	    This: [
	      o('THIS', function() {
	        return new Value(new Literal('this'));
	      }), o('@', function() {
	        return new Value(new Literal('this'));
	      })
	    ],
	    ThisProperty: [
	      o('@ Identifier', function() {
	        return new Value(LOC(1)(new Literal('this')), [LOC(2)(new Access($2))], 'this');
	      })
	    ],
	    Array: [
	      o('[ ]', function() {
	        return new Arr([]);
	      }), o('[ ArgList OptComma ]', function() {
	        return new Arr($2);
	      })
	    ],
	    RangeDots: [
	      o('..', function() {
	        return 'inclusive';
	      }), o('...', function() {
	        return 'exclusive';
	      })
	    ],
	    Range: [
	      o('[ Expression RangeDots Expression ]', function() {
	        return new Range($2, $4, $3);
	      })
	    ],
	    Slice: [
	      o('Expression RangeDots Expression', function() {
	        return new Range($1, $3, $2);
	      }), o('Expression RangeDots', function() {
	        return new Range($1, null, $2);
	      }), o('RangeDots Expression', function() {
	        return new Range(null, $2, $1);
	      }), o('RangeDots', function() {
	        return new Range(null, null, $1);
	      })
	    ],
	    ArgList: [
	      o('Arg', function() {
	        return [$1];
	      }), o('ArgList , Arg', function() {
	        return $1.concat($3);
	      }), o('ArgList OptComma TERMINATOR Arg', function() {
	        return $1.concat($4);
	      }), o('INDENT ArgList OptComma OUTDENT', function() {
	        return $2;
	      }), o('ArgList OptComma INDENT ArgList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Arg: [
	      o('Expression'), o('Splat'), o('...', function() {
	        return new Expansion;
	      })
	    ],
	    SimpleArgs: [
	      o('Expression'), o('SimpleArgs , Expression', function() {
	        return [].concat($1, $3);
	      })
	    ],
	    Try: [
	      o('TRY Block', function() {
	        return new Try($2);
	      }), o('TRY Block Catch', function() {
	        return new Try($2, $3[0], $3[1]);
	      }), o('TRY Block FINALLY Block', function() {
	        return new Try($2, null, null, $4);
	      }), o('TRY Block Catch FINALLY Block', function() {
	        return new Try($2, $3[0], $3[1], $5);
	      })
	    ],
	    Catch: [
	      o('CATCH Identifier Block', function() {
	        return [$2, $3];
	      }), o('CATCH Object Block', function() {
	        return [LOC(2)(new Value($2)), $3];
	      }), o('CATCH Block', function() {
	        return [null, $2];
	      })
	    ],
	    Throw: [
	      o('THROW Expression', function() {
	        return new Throw($2);
	      })
	    ],
	    Parenthetical: [
	      o('( Body )', function() {
	        return new Parens($2);
	      }), o('( INDENT Body OUTDENT )', function() {
	        return new Parens($3);
	      })
	    ],
	    WhileSource: [
	      o('WHILE Expression', function() {
	        return new While($2);
	      }), o('WHILE Expression WHEN Expression', function() {
	        return new While($2, {
	          guard: $4
	        });
	      }), o('UNTIL Expression', function() {
	        return new While($2, {
	          invert: true
	        });
	      }), o('UNTIL Expression WHEN Expression', function() {
	        return new While($2, {
	          invert: true,
	          guard: $4
	        });
	      })
	    ],
	    While: [
	      o('WhileSource Block', function() {
	        return $1.addBody($2);
	      }), o('Statement  WhileSource', function() {
	        return $2.addBody(LOC(1)(Block.wrap([$1])));
	      }), o('Expression WhileSource', function() {
	        return $2.addBody(LOC(1)(Block.wrap([$1])));
	      }), o('Loop', function() {
	        return $1;
	      })
	    ],
	    Loop: [
	      o('LOOP Block', function() {
	        return new While(LOC(1)(new Literal('true'))).addBody($2);
	      }), o('LOOP Expression', function() {
	        return new While(LOC(1)(new Literal('true'))).addBody(LOC(2)(Block.wrap([$2])));
	      })
	    ],
	    For: [
	      o('Statement  ForBody', function() {
	        return new For($1, $2);
	      }), o('Expression ForBody', function() {
	        return new For($1, $2);
	      }), o('ForBody    Block', function() {
	        return new For($2, $1);
	      })
	    ],
	    ForBody: [
	      o('FOR Range', function() {
	        return {
	          source: LOC(2)(new Value($2))
	        };
	      }), o('FOR Range BY Expression', function() {
	        return {
	          source: LOC(2)(new Value($2)),
	          step: $4
	        };
	      }), o('ForStart ForSource', function() {
	        $2.own = $1.own;
	        $2.name = $1[0];
	        $2.index = $1[1];
	        return $2;
	      })
	    ],
	    ForStart: [
	      o('FOR ForVariables', function() {
	        return $2;
	      }), o('FOR OWN ForVariables', function() {
	        $3.own = true;
	        return $3;
	      })
	    ],
	    ForValue: [
	      o('Identifier'), o('ThisProperty'), o('Array', function() {
	        return new Value($1);
	      }), o('Object', function() {
	        return new Value($1);
	      })
	    ],
	    ForVariables: [
	      o('ForValue', function() {
	        return [$1];
	      }), o('ForValue , ForValue', function() {
	        return [$1, $3];
	      })
	    ],
	    ForSource: [
	      o('FORIN Expression', function() {
	        return {
	          source: $2
	        };
	      }), o('FOROF Expression', function() {
	        return {
	          source: $2,
	          object: true
	        };
	      }), o('FORIN Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          guard: $4
	        };
	      }), o('FOROF Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          guard: $4,
	          object: true
	        };
	      }), o('FORIN Expression BY Expression', function() {
	        return {
	          source: $2,
	          step: $4
	        };
	      }), o('FORIN Expression WHEN Expression BY Expression', function() {
	        return {
	          source: $2,
	          guard: $4,
	          step: $6
	        };
	      }), o('FORIN Expression BY Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          step: $4,
	          guard: $6
	        };
	      })
	    ],
	    Switch: [
	      o('SWITCH Expression INDENT Whens OUTDENT', function() {
	        return new Switch($2, $4);
	      }), o('SWITCH Expression INDENT Whens ELSE Block OUTDENT', function() {
	        return new Switch($2, $4, $6);
	      }), o('SWITCH INDENT Whens OUTDENT', function() {
	        return new Switch(null, $3);
	      }), o('SWITCH INDENT Whens ELSE Block OUTDENT', function() {
	        return new Switch(null, $3, $5);
	      })
	    ],
	    Whens: [
	      o('When'), o('Whens When', function() {
	        return $1.concat($2);
	      })
	    ],
	    When: [
	      o('LEADING_WHEN SimpleArgs Block', function() {
	        return [[$2, $3]];
	      }), o('LEADING_WHEN SimpleArgs Block TERMINATOR', function() {
	        return [[$2, $3]];
	      })
	    ],
	    IfBlock: [
	      o('IF Expression Block', function() {
	        return new If($2, $3, {
	          type: $1
	        });
	      }), o('IfBlock ELSE IF Expression Block', function() {
	        return $1.addElse(LOC(3, 5)(new If($4, $5, {
	          type: $3
	        })));
	      })
	    ],
	    If: [
	      o('IfBlock'), o('IfBlock ELSE Block', function() {
	        return $1.addElse($3);
	      }), o('Statement  POST_IF Expression', function() {
	        return new If($3, LOC(1)(Block.wrap([$1])), {
	          type: $2,
	          statement: true
	        });
	      }), o('Expression POST_IF Expression', function() {
	        return new If($3, LOC(1)(Block.wrap([$1])), {
	          type: $2,
	          statement: true
	        });
	      })
	    ],
	    Operation: [
	      o('UNARY Expression', function() {
	        return new Op($1, $2);
	      }), o('UNARY_MATH Expression', function() {
	        return new Op($1, $2);
	      }), o('-     Expression', (function() {
	        return new Op('-', $2);
	      }), {
	        prec: 'UNARY_MATH'
	      }), o('+     Expression', (function() {
	        return new Op('+', $2);
	      }), {
	        prec: 'UNARY_MATH'
	      }), o('YIELD Statement', function() {
	        return new Op($1, $2);
	      }), o('YIELD Expression', function() {
	        return new Op($1, $2);
	      }), o('YIELD FROM Expression', function() {
	        return new Op($1.concat($2), $3);
	      }), o('-- SimpleAssignable', function() {
	        return new Op('--', $2);
	      }), o('++ SimpleAssignable', function() {
	        return new Op('++', $2);
	      }), o('SimpleAssignable --', function() {
	        return new Op('--', $1, null, true);
	      }), o('SimpleAssignable ++', function() {
	        return new Op('++', $1, null, true);
	      }), o('Expression ?', function() {
	        return new Existence($1);
	      }), o('Expression +  Expression', function() {
	        return new Op('+', $1, $3);
	      }), o('Expression -  Expression', function() {
	        return new Op('-', $1, $3);
	      }), o('Expression MATH     Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression **       Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression SHIFT    Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression COMPARE  Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression LOGIC    Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression RELATION Expression', function() {
	        if ($2.charAt(0) === '!') {
	          return new Op($2.slice(1), $1, $3).invert();
	        } else {
	          return new Op($2, $1, $3);
	        }
	      }), o('SimpleAssignable COMPOUND_ASSIGN Expression', function() {
	        return new Assign($1, $3, $2);
	      }), o('SimpleAssignable COMPOUND_ASSIGN INDENT Expression OUTDENT', function() {
	        return new Assign($1, $4, $2);
	      }), o('SimpleAssignable COMPOUND_ASSIGN TERMINATOR Expression', function() {
	        return new Assign($1, $4, $2);
	      }), o('SimpleAssignable EXTENDS Expression', function() {
	        return new Extends($1, $3);
	      })
	    ]
	  };

	  operators = [['left', '.', '?.', '::', '?::'], ['left', 'CALL_START', 'CALL_END'], ['nonassoc', '++', '--'], ['left', '?'], ['right', 'UNARY'], ['right', '**'], ['right', 'UNARY_MATH'], ['left', 'MATH'], ['left', '+', '-'], ['left', 'SHIFT'], ['left', 'RELATION'], ['left', 'COMPARE'], ['left', 'LOGIC'], ['nonassoc', 'INDENT', 'OUTDENT'], ['right', 'YIELD'], ['right', '=', ':', 'COMPOUND_ASSIGN', 'RETURN', 'THROW', 'EXTENDS'], ['right', 'FORIN', 'FOROF', 'BY', 'WHEN'], ['right', 'IF', 'ELSE', 'FOR', 'WHILE', 'UNTIL', 'LOOP', 'SUPER', 'CLASS'], ['left', 'POST_IF']];

	  tokens = [];

	  for (name in grammar) {
	    alternatives = grammar[name];
	    grammar[name] = (function() {
	      var i, j, len, len1, ref, results;
	      results = [];
	      for (i = 0, len = alternatives.length; i < len; i++) {
	        alt = alternatives[i];
	        ref = alt[0].split(' ');
	        for (j = 0, len1 = ref.length; j < len1; j++) {
	          token = ref[j];
	          if (!grammar[token]) {
	            tokens.push(token);
	          }
	        }
	        if (name === 'Root') {
	          alt[1] = "return " + alt[1];
	        }
	        results.push(alt);
	      }
	      return results;
	    })();
	  }

	  exports.parser = new Parser({
	    tokens: tokens.join(' '),
	    bnf: grammar,
	    operators: operators.reverse(),
	    startSymbol: 'Root'
	  });

	}).call(this);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Jison, an LR(0), SLR(1), LARL(1), LR(1) Parser Generator
	// Zachary Carter <zach@carter.name>
	// MIT X Licensed

	var typal      = __webpack_require__(32).typal;
	var Set        = __webpack_require__(33).Set;
	var Lexer      = __webpack_require__(34);
	var ebnfParser = __webpack_require__(37);
	var JSONSelect = __webpack_require__(41);
	var esprima    = __webpack_require__(31);
	var escodegen  = __webpack_require__(42);


	var version = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../package.json\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).version;

	var Jison = exports.Jison = exports;
	Jison.version = version;

	// detect print
	if (typeof console !== 'undefined' && console.log) {
	    Jison.print = console.log;
	} else if (typeof puts !== 'undefined') {
	    Jison.print = function print () { puts([].join.call(arguments, ' ')); };
	} else if (typeof print !== 'undefined') {
	    Jison.print = print;
	} else {
	    Jison.print = function print () {};
	}

	Jison.Parser = (function () {

	// iterator utility
	function each (obj, func) {
	    if (obj.forEach) {
	        obj.forEach(func);
	    } else {
	        var p;
	        for (p in obj) {
	            if (obj.hasOwnProperty(p)) {
	                func.call(obj, obj[p], p, obj);
	            }
	        }
	    }
	}

	var Nonterminal = typal.construct({
	    constructor: function Nonterminal (symbol) {
	        this.symbol = symbol;
	        this.productions = new Set();
	        this.first = [];
	        this.follows = [];
	        this.nullable = false;
	    },
	    toString: function Nonterminal_toString () {
	        var str = this.symbol+"\n";
	        str += (this.nullable ? 'nullable' : 'not nullable');
	        str += "\nFirsts: "+this.first.join(', ');
	        str += "\nFollows: "+this.first.join(', ');
	        str += "\nProductions:\n  "+this.productions.join('\n  ');

	        return str;
	    }
	});

	var Production = typal.construct({
	    constructor: function Production (symbol, handle, id) {
	        this.symbol = symbol;
	        this.handle = handle;
	        this.nullable = false;
	        this.id = id;
	        this.first = [];
	        this.precedence = 0;
	    },
	    toString: function Production_toString () {
	        return this.symbol+" -> "+this.handle.join(' ');
	    }
	});

	var generator = typal.beget();

	generator.constructor = function Jison_Generator (grammar, opt) {
	    if (typeof grammar === 'string') {
	        grammar = ebnfParser.parse(grammar);
	    }

	    var options = typal.mix.call({}, grammar.options, opt);
	    this.terms = {};
	    this.operators = {};
	    this.productions = [];
	    this.conflicts = 0;
	    this.resolutions = [];
	    this.options = options;
	    this.parseParams = grammar.parseParams;
	    this.yy = {}; // accessed as yy free variable in the parser/lexer actions

	    // source included in semantic action execution scope
	    if (grammar.actionInclude) {
	        if (typeof grammar.actionInclude === 'function') {
	            grammar.actionInclude = String(grammar.actionInclude).replace(/^\s*function \(\) \{/, '').replace(/\}\s*$/, '');
	        }
	        this.actionInclude = grammar.actionInclude;
	    }
	    this.moduleInclude = grammar.moduleInclude || '';

	    this.DEBUG = options.debug || false;
	    if (this.DEBUG) this.mix(generatorDebug); // mixin debug methods

	    this.processGrammar(grammar);

	    if (grammar.lex) {
	        this.lexer = new Lexer(grammar.lex, null, this.terminals_);
	    }
	};

	generator.processGrammar = function processGrammarDef (grammar) {
	    var bnf = grammar.bnf,
	        tokens = grammar.tokens,
	        nonterminals = this.nonterminals = {},
	        productions = this.productions,
	        self = this;

	    if (!grammar.bnf && grammar.ebnf) {
	        bnf = grammar.bnf = ebnfParser.transform(grammar.ebnf);
	    }

	    if (tokens) {
	        if (typeof tokens === 'string') {
	            tokens = tokens.trim().split(' ');
	        } else {
	            tokens = tokens.slice(0);
	        }
	    }

	    var symbols = this.symbols = [];

	    // calculate precedence of operators
	    var operators = this.operators = processOperators(grammar.operators);

	    // build productions from cfg
	    this.buildProductions(bnf, productions, nonterminals, symbols, operators);

	    if (tokens && this.terminals.length !== tokens.length) {
	        self.trace("Warning: declared tokens differ from tokens found in rules.");
	        self.trace(this.terminals);
	        self.trace(tokens);
	    }

	    // augment the grammar
	    this.augmentGrammar(grammar);
	};

	generator.augmentGrammar = function augmentGrammar (grammar) {
	    if (this.productions.length === 0) {
	        throw new Error("Grammar error: must have at least one rule.");
	    }
	    // use specified start symbol, or default to first user defined production
	    this.startSymbol = grammar.start || grammar.startSymbol || this.productions[0].symbol;
	    if (!this.nonterminals[this.startSymbol]) {
	        throw new Error("Grammar error: startSymbol must be a non-terminal found in your grammar.");
	    }
	    this.EOF = "$end";

	    // augment the grammar
	    var acceptProduction = new Production('$accept', [this.startSymbol, '$end'], 0);
	    this.productions.unshift(acceptProduction);

	    // prepend parser tokens
	    this.symbols.unshift("$accept",this.EOF);
	    this.symbols_.$accept = 0;
	    this.symbols_[this.EOF] = 1;
	    this.terminals.unshift(this.EOF);

	    this.nonterminals.$accept = new Nonterminal("$accept");
	    this.nonterminals.$accept.productions.push(acceptProduction);

	    // add follow $ to start symbol
	    this.nonterminals[this.startSymbol].follows.push(this.EOF);
	};

	// set precedence and associativity of operators
	function processOperators (ops) {
	    if (!ops) return {};
	    var operators = {};
	    for (var i=0,k,prec;prec=ops[i]; i++) {
	        for (k=1;k < prec.length;k++) {
	            operators[prec[k]] = {precedence: i+1, assoc: prec[0]};
	        }
	    }
	    return operators;
	}


	generator.buildProductions = function buildProductions(bnf, productions, nonterminals, symbols, operators) {
	    var actions = [
	      '/* this == yyval */',
	      this.actionInclude || '',
	      'var $0 = $$.length - 1;',
	      'switch (yystate) {'
	    ];
	    var actionGroups = {};
	    var prods, symbol;
	    var productions_ = [0];
	    var symbolId = 1;
	    var symbols_ = {};

	    var her = false; // has error recovery

	    function addSymbol (s) {
	        if (s && !symbols_[s]) {
	            symbols_[s] = ++symbolId;
	            symbols.push(s);
	        }
	    }

	    // add error symbol; will be third symbol, or "2" ($accept, $end, error)
	    addSymbol("error");

	    for (symbol in bnf) {
	        if (!bnf.hasOwnProperty(symbol)) continue;

	        addSymbol(symbol);
	        nonterminals[symbol] = new Nonterminal(symbol);

	        if (typeof bnf[symbol] === 'string') {
	            prods = bnf[symbol].split(/\s*\|\s*/g);
	        } else {
	            prods = bnf[symbol].slice(0);
	        }

	        prods.forEach(buildProduction);
	    }
	    for (var action in actionGroups)
	      actions.push(actionGroups[action].join(' '), action, 'break;');

	    var sym, terms = [], terms_ = {};
	    each(symbols_, function (id, sym) {
	        if (!nonterminals[sym]) {
	            terms.push(sym);
	            terms_[id] = sym;
	        }
	    });

	    this.hasErrorRecovery = her;

	    this.terminals = terms;
	    this.terminals_ = terms_;
	    this.symbols_ = symbols_;

	    this.productions_ = productions_;
	    actions.push('}');

	    actions = actions.join("\n")
	                .replace(/YYABORT/g, 'return false')
	                .replace(/YYACCEPT/g, 'return true');

	    var parameters = "yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */";
	    if (this.parseParams) parameters += ', ' + this.parseParams.join(', ');

	    this.performAction = "function anonymous(" + parameters + ") {\n" + actions + "\n}";

	    function buildProduction (handle) {
	        var r, rhs, i;
	        if (handle.constructor === Array) {
	            rhs = (typeof handle[0] === 'string') ?
	                      handle[0].trim().split(' ') :
	                      handle[0].slice(0);

	            for (i=0; i<rhs.length; i++) {
	                if (rhs[i] === 'error') her = true;
	                if (!symbols_[rhs[i]]) {
	                    addSymbol(rhs[i]);
	                }
	            }

	            if (typeof handle[1] === 'string' || handle.length == 3) {
	                // semantic action specified
	                var label = 'case ' + (productions.length+1) + ':', action = handle[1];

	                // replace named semantic values ($nonterminal)
	                if (action.match(/[$@][a-zA-Z][a-zA-Z0-9_]*/)) {
	                    var count = {},
	                        names = {};
	                    for (i=0;i<rhs.length;i++) {
	                        // check for aliased names, e.g., id[alias]
	                        var rhs_i = rhs[i].match(/\[[a-zA-Z][a-zA-Z0-9_-]*\]/);
	                        if (rhs_i) {
	                            rhs_i = rhs_i[0].substr(1, rhs_i[0].length-2);
	                            rhs[i] = rhs[i].substr(0, rhs[i].indexOf('['));
	                        } else {
	                            rhs_i = rhs[i];
	                        }

	                        if (names[rhs_i]) {
	                            names[rhs_i + (++count[rhs_i])] = i+1;
	                        } else {
	                            names[rhs_i] = i+1;
	                            names[rhs_i + "1"] = i+1;
	                            count[rhs_i] = 1;
	                        }
	                    }
	                    action = action.replace(/\$([a-zA-Z][a-zA-Z0-9_]*)/g, function (str, pl) {
	                            return names[pl] ? '$'+names[pl] : str;
	                        }).replace(/@([a-zA-Z][a-zA-Z0-9_]*)/g, function (str, pl) {
	                            return names[pl] ? '@'+names[pl] : str;
	                        });
	                }
	                action = action
	                    // replace references to $$ with this.$, and @$ with this._$
	                    .replace(/([^'"])\$\$|^\$\$/g, '$1this.$').replace(/@[0$]/g, "this._$")

	                    // replace semantic value references ($n) with stack value (stack[n])
	                    .replace(/\$(-?\d+)/g, function (_, n) {
	                        return "$$[$0" + (parseInt(n, 10) - rhs.length || '') + "]";
	                    })
	                    // same as above for location references (@n)
	                    .replace(/@(-?\d+)/g, function (_, n) {
	                        return "_$[$0" + (n - rhs.length || '') + "]";
	                    });
	                if (action in actionGroups) actionGroups[action].push(label);
	                else actionGroups[action] = [label];

	                // done with aliases; strip them.
	                rhs = rhs.map(function(e,i) { return e.replace(/\[[a-zA-Z_][a-zA-Z0-9_-]*\]/g, '') });
	                r = new Production(symbol, rhs, productions.length+1);
	                // precedence specified also
	                if (handle[2] && operators[handle[2].prec]) {
	                    r.precedence = operators[handle[2].prec].precedence;
	                }
	            } else {
	                // no action -> don't care about aliases; strip them.
	                rhs = rhs.map(function(e,i) { return e.replace(/\[[a-zA-Z_][a-zA-Z0-9_-]*\]/g, '') });
	                // only precedence specified
	                r = new Production(symbol, rhs, productions.length+1);
	                if (operators[handle[1].prec]) {
	                    r.precedence = operators[handle[1].prec].precedence;
	                }
	            }
	        } else {
	            // no action -> don't care about aliases; strip them.
	            handle = handle.replace(/\[[a-zA-Z_][a-zA-Z0-9_-]*\]/g, '');
	            rhs = handle.trim().split(' ');
	            for (i=0; i<rhs.length; i++) {
	                if (rhs[i] === 'error') her = true;
	                if (!symbols_[rhs[i]]) {
	                    addSymbol(rhs[i]);
	                }
	            }
	            r = new Production(symbol, rhs, productions.length+1);
	        }
	        if (r.precedence === 0) {
	            // set precedence
	            for (i=r.handle.length-1; i>=0; i--) {
	                if (!(r.handle[i] in nonterminals) && r.handle[i] in operators) {
	                    r.precedence = operators[r.handle[i]].precedence;
	                }
	            }
	        }

	        productions.push(r);
	        productions_.push([symbols_[r.symbol], r.handle[0] === '' ? 0 : r.handle.length]);
	        nonterminals[symbol].productions.push(r);
	    }
	};



	generator.createParser = function createParser () {
	    throw new Error('Calling abstract method.');
	};

	// noop. implemented in debug mixin
	generator.trace = function trace () { };

	generator.warn = function warn () {
	    var args = Array.prototype.slice.call(arguments,0);
	    Jison.print.call(null,args.join(""));
	};

	generator.error = function error (msg) {
	    throw new Error(msg);
	};

	// Generator debug mixin

	var generatorDebug = {
	    trace: function trace () {
	        Jison.print.apply(null, arguments);
	    },
	    beforeprocessGrammar: function () {
	        this.trace("Processing grammar.");
	    },
	    afteraugmentGrammar: function () {
	        var trace = this.trace;
	        each(this.symbols, function (sym, i) {
	            trace(sym+"("+i+")");
	        });
	    }
	};



	/*
	 * Mixin for common behaviors of lookahead parsers
	 * */
	var lookaheadMixin = {};

	lookaheadMixin.computeLookaheads = function computeLookaheads () {
	    if (this.DEBUG) this.mix(lookaheadDebug); // mixin debug methods

	    this.computeLookaheads = function () {};
	    this.nullableSets();
	    this.firstSets();
	    this.followSets();
	};

	// calculate follow sets typald on first and nullable
	lookaheadMixin.followSets = function followSets () {
	    var productions = this.productions,
	        nonterminals = this.nonterminals,
	        self = this,
	        cont = true;

	    // loop until no further changes have been made
	    while(cont) {
	        cont = false;

	        productions.forEach(function Follow_prod_forEach (production, k) {
	            //self.trace(production.symbol,nonterminals[production.symbol].follows);
	            // q is used in Simple LALR algorithm determine follows in context
	            var q;
	            var ctx = !!self.go_;

	            var set = [],oldcount;
	            for (var i=0,t;t=production.handle[i];++i) {
	                if (!nonterminals[t]) continue;

	                // for Simple LALR algorithm, self.go_ checks if
	                if (ctx)
	                    q = self.go_(production.symbol, production.handle.slice(0, i));
	                var bool = !ctx || q === parseInt(self.nterms_[t], 10);

	                if (i === production.handle.length+1 && bool) {
	                    set = nonterminals[production.symbol].follows;
	                } else {
	                    var part = production.handle.slice(i+1);

	                    set = self.first(part);
	                    if (self.nullable(part) && bool) {
	                        set.push.apply(set, nonterminals[production.symbol].follows);
	                    }
	                }
	                oldcount = nonterminals[t].follows.length;
	                Set.union(nonterminals[t].follows, set);
	                if (oldcount !== nonterminals[t].follows.length) {
	                    cont = true;
	                }
	            }
	        });
	    }
	};

	// return the FIRST set of a symbol or series of symbols
	lookaheadMixin.first = function first (symbol) {
	    // epsilon
	    if (symbol === '') {
	        return [];
	    // RHS
	    } else if (symbol instanceof Array) {
	        var firsts = [];
	        for (var i=0,t;t=symbol[i];++i) {
	            if (!this.nonterminals[t]) {
	                if (firsts.indexOf(t) === -1)
	                    firsts.push(t);
	            } else {
	                Set.union(firsts, this.nonterminals[t].first);
	            }
	            if (!this.nullable(t))
	                break;
	        }
	        return firsts;
	    // terminal
	    } else if (!this.nonterminals[symbol]) {
	        return [symbol];
	    // nonterminal
	    } else {
	        return this.nonterminals[symbol].first;
	    }
	};

	// fixed-point calculation of FIRST sets
	lookaheadMixin.firstSets = function firstSets () {
	    var productions = this.productions,
	        nonterminals = this.nonterminals,
	        self = this,
	        cont = true,
	        symbol,firsts;

	    // loop until no further changes have been made
	    while(cont) {
	        cont = false;

	        productions.forEach(function FirstSets_forEach (production, k) {
	            var firsts = self.first(production.handle);
	            if (firsts.length !== production.first.length) {
	                production.first = firsts;
	                cont=true;
	            }
	        });

	        for (symbol in nonterminals) {
	            firsts = [];
	            nonterminals[symbol].productions.forEach(function (production) {
	                Set.union(firsts, production.first);
	            });
	            if (firsts.length !== nonterminals[symbol].first.length) {
	                nonterminals[symbol].first = firsts;
	                cont=true;
	            }
	        }
	    }
	};

	// fixed-point calculation of NULLABLE
	lookaheadMixin.nullableSets = function nullableSets () {
	    var firsts = this.firsts = {},
	        nonterminals = this.nonterminals,
	        self = this,
	        cont = true;

	    // loop until no further changes have been made
	    while(cont) {
	        cont = false;

	        // check if each production is nullable
	        this.productions.forEach(function (production, k) {
	            if (!production.nullable) {
	                for (var i=0,n=0,t;t=production.handle[i];++i) {
	                    if (self.nullable(t)) n++;
	                }
	                if (n===i) { // production is nullable if all tokens are nullable
	                    production.nullable = cont = true;
	                }
	            }
	        });

	        //check if each symbol is nullable
	        for (var symbol in nonterminals) {
	            if (!this.nullable(symbol)) {
	                for (var i=0,production;production=nonterminals[symbol].productions.item(i);i++) {
	                    if (production.nullable)
	                        nonterminals[symbol].nullable = cont = true;
	                }
	            }
	        }
	    }
	};

	// check if a token or series of tokens is nullable
	lookaheadMixin.nullable = function nullable (symbol) {
	    // epsilon
	    if (symbol === '') {
	        return true;
	    // RHS
	    } else if (symbol instanceof Array) {
	        for (var i=0,t;t=symbol[i];++i) {
	            if (!this.nullable(t))
	                return false;
	        }
	        return true;
	    // terminal
	    } else if (!this.nonterminals[symbol]) {
	        return false;
	    // nonterminal
	    } else {
	        return this.nonterminals[symbol].nullable;
	    }
	};


	// lookahead debug mixin
	var lookaheadDebug = {
	    beforenullableSets: function () {
	        this.trace("Computing Nullable sets.");
	    },
	    beforefirstSets: function () {
	        this.trace("Computing First sets.");
	    },
	    beforefollowSets: function () {
	        this.trace("Computing Follow sets.");
	    },
	    afterfollowSets: function () {
	        var trace = this.trace;
	        each(this.nonterminals, function (nt, t) {
	            trace(nt, '\n');
	        });
	    }
	};

	/*
	 * Mixin for common LR parser behavior
	 * */
	var lrGeneratorMixin = {};

	lrGeneratorMixin.buildTable = function buildTable () {
	    if (this.DEBUG) this.mix(lrGeneratorDebug); // mixin debug methods

	    this.states = this.canonicalCollection();
	    this.table = this.parseTable(this.states);
	    this.defaultActions = findDefaults(this.table);
	};

	lrGeneratorMixin.Item = typal.construct({
	    constructor: function Item(production, dot, f, predecessor) {
	        this.production = production;
	        this.dotPosition = dot || 0;
	        this.follows = f || [];
	        this.predecessor = predecessor;
	        this.id = parseInt(production.id+'a'+this.dotPosition, 36);
	        this.markedSymbol = this.production.handle[this.dotPosition];
	    },
	    remainingHandle: function () {
	        return this.production.handle.slice(this.dotPosition+1);
	    },
	    eq: function (e) {
	        return e.id === this.id;
	    },
	    handleToString: function () {
	        var handle = this.production.handle.slice(0);
	        handle[this.dotPosition] = '.'+(handle[this.dotPosition]||'');
	        return handle.join(' ');
	    },
	    toString: function () {
	        var temp = this.production.handle.slice(0);
	        temp[this.dotPosition] = '.'+(temp[this.dotPosition]||'');
	        return this.production.symbol+" -> "+temp.join(' ') +
	            (this.follows.length === 0 ? "" : " #lookaheads= "+this.follows.join(' '));
	    }
	});

	lrGeneratorMixin.ItemSet = Set.prototype.construct({
	    afterconstructor: function () {
	        this.reductions = [];
	        this.goes = {};
	        this.edges = {};
	        this.shifts = false;
	        this.inadequate = false;
	        this.hash_ = {};
	        for (var i=this._items.length-1;i >=0;i--) {
	            this.hash_[this._items[i].id] = true; //i;
	        }
	    },
	    concat: function concat (set) {
	        var a = set._items || set;
	        for (var i=a.length-1;i >=0;i--) {
	            this.hash_[a[i].id] = true; //i;
	        }
	        this._items.push.apply(this._items, a);
	        return this;
	    },
	    push: function (item) {
	        this.hash_[item.id] = true;
	        return this._items.push(item);
	    },
	    contains: function (item) {
	        return this.hash_[item.id];
	    },
	    valueOf: function toValue () {
	        var v = this._items.map(function (a) {return a.id;}).sort().join('|');
	        this.valueOf = function toValue_inner() {return v;};
	        return v;
	    }
	});

	lrGeneratorMixin.closureOperation = function closureOperation (itemSet /*, closureSet*/) {
	    var closureSet = new this.ItemSet();
	    var self = this;

	    var set = itemSet,
	        itemQueue, syms = {};

	    do {
	    itemQueue = new Set();
	    closureSet.concat(set);
	    set.forEach(function CO_set_forEach (item) {
	        var symbol = item.markedSymbol;

	        // if token is a non-terminal, recursively add closures
	        if (symbol && self.nonterminals[symbol]) {
	            if(!syms[symbol]) {
	                self.nonterminals[symbol].productions.forEach(function CO_nt_forEach (production) {
	                    var newItem = new self.Item(production, 0);
	                    if(!closureSet.contains(newItem))
	                        itemQueue.push(newItem);
	                });
	                syms[symbol] = true;
	            }
	        } else if (!symbol) {
	            // reduction
	            closureSet.reductions.push(item);
	            closureSet.inadequate = closureSet.reductions.length > 1 || closureSet.shifts;
	        } else {
	            // shift
	            closureSet.shifts = true;
	            closureSet.inadequate = closureSet.reductions.length > 0;
	        }
	    });

	    set = itemQueue;

	    } while (!itemQueue.isEmpty());

	    return closureSet;
	};

	lrGeneratorMixin.gotoOperation = function gotoOperation (itemSet, symbol) {
	    var gotoSet = new this.ItemSet(),
	        self = this;

	    itemSet.forEach(function goto_forEach(item, n) {
	        if (item.markedSymbol === symbol) {
	            gotoSet.push(new self.Item(item.production, item.dotPosition+1, item.follows, n));
	        }
	    });

	    return gotoSet.isEmpty() ? gotoSet : this.closureOperation(gotoSet);
	};

	/* Create unique set of item sets
	 * */
	lrGeneratorMixin.canonicalCollection = function canonicalCollection () {
	    var item1 = new this.Item(this.productions[0], 0, [this.EOF]);
	    var firstState = this.closureOperation(new this.ItemSet(item1)),
	        states = new Set(firstState),
	        marked = 0,
	        self = this,
	        itemSet;

	    states.has = {};
	    states.has[firstState] = 0;

	    while (marked !== states.size()) {
	        itemSet = states.item(marked); marked++;
	        itemSet.forEach(function CC_itemSet_forEach (item) {
	            if (item.markedSymbol && item.markedSymbol !== self.EOF)
	                self.canonicalCollectionInsert(item.markedSymbol, itemSet, states, marked-1);
	        });
	    }

	    return states;
	};

	// Pushes a unique state into the que. Some parsing algorithms may perform additional operations
	lrGeneratorMixin.canonicalCollectionInsert = function canonicalCollectionInsert (symbol, itemSet, states, stateNum) {
	    var g = this.gotoOperation(itemSet, symbol);
	    if (!g.predecessors)
	        g.predecessors = {};
	    // add g to que if not empty or duplicate
	    if (!g.isEmpty()) {
	        var gv = g.valueOf(),
	            i = states.has[gv];
	        if (i === -1 || typeof i === 'undefined') {
	            states.has[gv] = states.size();
	            itemSet.edges[symbol] = states.size(); // store goto transition for table
	            states.push(g);
	            g.predecessors[symbol] = [stateNum];
	        } else {
	            itemSet.edges[symbol] = i; // store goto transition for table
	            states.item(i).predecessors[symbol].push(stateNum);
	        }
	    }
	};

	var NONASSOC = 0;
	lrGeneratorMixin.parseTable = function parseTable (itemSets) {
	    var states = [],
	        nonterminals = this.nonterminals,
	        operators = this.operators,
	        conflictedStates = {}, // array of [state, token] tuples
	        self = this,
	        s = 1, // shift
	        r = 2, // reduce
	        a = 3; // accept

	    // for each item set
	    itemSets.forEach(function (itemSet, k) {
	        var state = states[k] = {};
	        var action, stackSymbol;

	        // set shift and goto actions
	        for (stackSymbol in itemSet.edges) {
	            itemSet.forEach(function (item, j) {
	                // find shift and goto actions
	                if (item.markedSymbol == stackSymbol) {
	                    var gotoState = itemSet.edges[stackSymbol];
	                    if (nonterminals[stackSymbol]) {
	                        // store state to go to after a reduce
	                        //self.trace(k, stackSymbol, 'g'+gotoState);
	                        state[self.symbols_[stackSymbol]] = gotoState;
	                    } else {
	                        //self.trace(k, stackSymbol, 's'+gotoState);
	                        state[self.symbols_[stackSymbol]] = [s,gotoState];
	                    }
	                }
	            });
	        }

	        // set accept action
	        itemSet.forEach(function (item, j) {
	            if (item.markedSymbol == self.EOF) {
	                // accept
	                state[self.symbols_[self.EOF]] = [a];
	                //self.trace(k, self.EOF, state[self.EOF]);
	            }
	        });

	        var allterms = self.lookAheads ? false : self.terminals;

	        // set reductions and resolve potential conflicts
	        itemSet.reductions.forEach(function (item, j) {
	            // if parser uses lookahead, only enumerate those terminals
	            var terminals = allterms || self.lookAheads(itemSet, item);

	            terminals.forEach(function (stackSymbol) {
	                action = state[self.symbols_[stackSymbol]];
	                var op = operators[stackSymbol];

	                // Reading a terminal and current position is at the end of a production, try to reduce
	                if (action || action && action.length) {
	                    var sol = resolveConflict(item.production, op, [r,item.production.id], action[0] instanceof Array ? action[0] : action);
	                    self.resolutions.push([k,stackSymbol,sol]);
	                    if (sol.bydefault) {
	                        self.conflicts++;
	                        if (!self.DEBUG) {
	                            self.warn('Conflict in grammar: multiple actions possible when lookahead token is ',stackSymbol,' in state ',k, "\n- ", printAction(sol.r, self), "\n- ", printAction(sol.s, self));
	                            conflictedStates[k] = true;
	                        }
	                        if (self.options.noDefaultResolve) {
	                            if (!(action[0] instanceof Array))
	                                action = [action];
	                            action.push(sol.r);
	                        }
	                    } else {
	                        action = sol.action;
	                    }
	                } else {
	                    action = [r,item.production.id];
	                }
	                if (action && action.length) {
	                    state[self.symbols_[stackSymbol]] = action;
	                } else if (action === NONASSOC) {
	                    state[self.symbols_[stackSymbol]] = undefined;
	                }
	            });
	        });

	    });

	    if (!self.DEBUG && self.conflicts > 0) {
	        self.warn("\nStates with conflicts:");
	        each(conflictedStates, function (val, state) {
	            self.warn('State '+state);
	            self.warn('  ',itemSets.item(state).join("\n  "));
	        });
	    }

	    return states;
	};

	// find states with only one action, a reduction
	function findDefaults (states) {
	    var defaults = {};
	    states.forEach(function (state, k) {
	        var i = 0;
	        for (var act in state) {
	             if ({}.hasOwnProperty.call(state, act)) i++;
	        }

	        if (i === 1 && state[act][0] === 2) {
	            // only one action in state and it's a reduction
	            defaults[k] = state[act];
	        }
	    });

	    return defaults;
	}

	// resolves shift-reduce and reduce-reduce conflicts
	function resolveConflict (production, op, reduce, shift) {
	    var sln = {production: production, operator: op, r: reduce, s: shift},
	        s = 1, // shift
	        r = 2, // reduce
	        a = 3; // accept

	    if (shift[0] === r) {
	        sln.msg = "Resolve R/R conflict (use first production declared in grammar.)";
	        sln.action = shift[1] < reduce[1] ? shift : reduce;
	        if (shift[1] !== reduce[1]) sln.bydefault = true;
	        return sln;
	    }

	    if (production.precedence === 0 || !op) {
	        sln.msg = "Resolve S/R conflict (shift by default.)";
	        sln.bydefault = true;
	        sln.action = shift;
	    } else if (production.precedence < op.precedence ) {
	        sln.msg = "Resolve S/R conflict (shift for higher precedent operator.)";
	        sln.action = shift;
	    } else if (production.precedence === op.precedence) {
	        if (op.assoc === "right" ) {
	            sln.msg = "Resolve S/R conflict (shift for right associative operator.)";
	            sln.action = shift;
	        } else if (op.assoc === "left" ) {
	            sln.msg = "Resolve S/R conflict (reduce for left associative operator.)";
	            sln.action = reduce;
	        } else if (op.assoc === "nonassoc" ) {
	            sln.msg = "Resolve S/R conflict (no action for non-associative operator.)";
	            sln.action = NONASSOC;
	        }
	    } else {
	        sln.msg = "Resolve conflict (reduce for higher precedent production.)";
	        sln.action = reduce;
	    }

	    return sln;
	}

	lrGeneratorMixin.generate = function parser_generate (opt) {
	    opt = typal.mix.call({}, this.options, opt);
	    var code = "";

	    // check for illegal identifier
	    if (!opt.moduleName || !opt.moduleName.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/)) {
	        opt.moduleName = "parser";
	    }
	    switch (opt.moduleType) {
	        case "js":
	            code = this.generateModule(opt);
	            break;
	        case "amd":
	            code = this.generateAMDModule(opt);
	            break;
	        default:
	            code = this.generateCommonJSModule(opt);
	            break;
	    }

	    return code;
	};

	lrGeneratorMixin.generateAMDModule = function generateAMDModule(opt){
	    opt = typal.mix.call({}, this.options, opt);
	    var module = this.generateModule_();
	    var out = '\n\ndefine(function(require){\n'
	        + module.commonCode
	        + '\nvar parser = '+ module.moduleCode
	        + "\n"+this.moduleInclude
	        + (this.lexer && this.lexer.generateModule ?
	          '\n' + this.lexer.generateModule() +
	          '\nparser.lexer = lexer;' : '')
	        + '\nreturn parser;'
	        + '\n});'
	    return out;
	};

	lrGeneratorMixin.generateCommonJSModule = function generateCommonJSModule (opt) {
	    opt = typal.mix.call({}, this.options, opt);
	    var moduleName = opt.moduleName || "parser";
	    var out = this.generateModule(opt)
	        + "\n\n\nif (typeof require !== 'undefined' && typeof exports !== 'undefined') {"
	        + "\nexports.parser = "+moduleName+";"
	        + "\nexports.Parser = "+moduleName+".Parser;"
	        + "\nexports.parse = function () { return "+moduleName+".parse.apply("+moduleName+", arguments); };"
	        + "\nexports.main = "+ String(opt.moduleMain || commonjsMain) + ";"
	        + "\nif (typeof module !== 'undefined' && require.main === module) {\n"
	        + "  exports.main(process.argv.slice(1));\n}"
	        + "\n}";

	    return out;
	};

	lrGeneratorMixin.generateModule = function generateModule (opt) {
	    opt = typal.mix.call({}, this.options, opt);
	    var moduleName = opt.moduleName || "parser";
	    var out = "/* parser generated by jison " + version + " */\n"
	        + "/*\n"
	        + "  Returns a Parser object of the following structure:\n"
	        + "\n"
	        + "  Parser: {\n"
	        + "    yy: {}\n"
	        + "  }\n"
	        + "\n"
	        + "  Parser.prototype: {\n"
	        + "    yy: {},\n"
	        + "    trace: function(),\n"
	        + "    symbols_: {associative list: name ==> number},\n"
	        + "    terminals_: {associative list: number ==> name},\n"
	        + "    productions_: [...],\n"
	        + "    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),\n"
	        + "    table: [...],\n"
	        + "    defaultActions: {...},\n"
	        + "    parseError: function(str, hash),\n"
	        + "    parse: function(input),\n"
	        + "\n"
	        + "    lexer: {\n"
	        + "        EOF: 1,\n"
	        + "        parseError: function(str, hash),\n"
	        + "        setInput: function(input),\n"
	        + "        input: function(),\n"
	        + "        unput: function(str),\n"
	        + "        more: function(),\n"
	        + "        less: function(n),\n"
	        + "        pastInput: function(),\n"
	        + "        upcomingInput: function(),\n"
	        + "        showPosition: function(),\n"
	        + "        test_match: function(regex_match_array, rule_index),\n"
	        + "        next: function(),\n"
	        + "        lex: function(),\n"
	        + "        begin: function(condition),\n"
	        + "        popState: function(),\n"
	        + "        _currentRules: function(),\n"
	        + "        topState: function(),\n"
	        + "        pushState: function(condition),\n"
	        + "\n"
	        + "        options: {\n"
	        + "            ranges: boolean           (optional: true ==> token location info will include a .range[] member)\n"
	        + "            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)\n"
	        + "            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)\n"
	        + "        },\n"
	        + "\n"
	        + "        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),\n"
	        + "        rules: [...],\n"
	        + "        conditions: {associative list: name ==> set},\n"
	        + "    }\n"
	        + "  }\n"
	        + "\n"
	        + "\n"
	        + "  token location info (@$, _$, etc.): {\n"
	        + "    first_line: n,\n"
	        + "    last_line: n,\n"
	        + "    first_column: n,\n"
	        + "    last_column: n,\n"
	        + "    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)\n"
	        + "  }\n"
	        + "\n"
	        + "\n"
	        + "  the parseError function receives a 'hash' object with these members for lexer and parser errors: {\n"
	        + "    text:        (matched text)\n"
	        + "    token:       (the produced terminal token, if any)\n"
	        + "    line:        (yylineno)\n"
	        + "  }\n"
	        + "  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {\n"
	        + "    loc:         (yylloc)\n"
	        + "    expected:    (string describing the set of expected tokens)\n"
	        + "    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)\n"
	        + "  }\n"
	        + "*/\n";
	    out += (moduleName.match(/\./) ? moduleName : "var "+moduleName) +
	            " = " + this.generateModuleExpr();

	    return out;
	};


	lrGeneratorMixin.generateModuleExpr = function generateModuleExpr () {
	    var out = '';
	    var module = this.generateModule_();

	    out += "(function(){\n";
	    out += module.commonCode;
	    out += "\nvar parser = "+module.moduleCode;
	    out += "\n"+this.moduleInclude;
	    if (this.lexer && this.lexer.generateModule) {
	        out += this.lexer.generateModule();
	        out += "\nparser.lexer = lexer;";
	    }
	    out += "\nfunction Parser () {\n  this.yy = {};\n}\n"
	        + "Parser.prototype = parser;"
	        + "parser.Parser = Parser;"
	        + "\nreturn new Parser;\n})();";

	    return out;
	};

	function addTokenStack (fn) {
	    var parseFn = fn;
	    try {
	        var ast = esprima.parse(parseFn);
	        var stackAst = esprima.parse(String(tokenStackLex)).body[0];
	        stackAst.id.name = 'lex';

	        var labeled = JSONSelect.match(':has(:root > .label > .name:val("_token_stack"))', ast);

	        labeled[0].body = stackAst;

	        return escodegen.generate(ast).replace(/_token_stack:\s?/,"").replace(/\\\\n/g,"\\n");
	    } catch (e) {
	        return parseFn;
	    }
	}

	// lex function that supports token stacks
	function tokenStackLex() {
	    var token;
	    token = tstack.pop() || lexer.lex() || EOF;
	    // if token isn't its numeric value, convert
	    if (typeof token !== 'number') {
	        if (token instanceof Array) {
	            tstack = token;
	            token = tstack.pop();
	        }
	        token = self.symbols_[token] || token;
	    }
	    return token;
	}

	// returns parse function without error recovery code
	function removeErrorRecovery (fn) {
	    var parseFn = fn;
	    try {
	        var ast = esprima.parse(parseFn);

	        var labeled = JSONSelect.match(':has(:root > .label > .name:val("_handle_error"))', ast);
	        var reduced_code = labeled[0].body.consequent.body[3].consequent.body;
	        reduced_code[0] = labeled[0].body.consequent.body[1];     // remove the line: error_rule_depth = locateNearestErrorRecoveryRule(state);
	        reduced_code[4].expression.arguments[1].properties.pop(); // remove the line: 'recoverable: error_rule_depth !== false'
	        labeled[0].body.consequent.body = reduced_code;

	        return escodegen.generate(ast).replace(/_handle_error:\s?/,"").replace(/\\\\n/g,"\\n");
	    } catch (e) {
	        return parseFn;
	    }
	}

	// Generates the code of the parser module, which consists of two parts:
	// - module.commonCode: initialization code that should be placed before the module
	// - module.moduleCode: code that creates the module object
	lrGeneratorMixin.generateModule_ = function generateModule_ () {
	    var parseFn = String(parser.parse);
	    if (!this.hasErrorRecovery) {
	      parseFn = removeErrorRecovery(parseFn);
	    }

	    if (this.options['token-stack']) {
	      parseFn = addTokenStack(parseFn);
	    }

	    // Generate code with fresh variable names
	    nextVariableId = 0;
	    var tableCode = this.generateTableCode(this.table);

	    // Generate the initialization code
	    var commonCode = tableCode.commonCode;

	    // Generate the module creation code
	    var moduleCode = "{";
	    moduleCode += [
	        "trace: " + String(this.trace || parser.trace),
	        "yy: {}",
	        "symbols_: " + JSON.stringify(this.symbols_),
	        "terminals_: " + JSON.stringify(this.terminals_).replace(/"([0-9]+)":/g,"$1:"),
	        "productions_: " + JSON.stringify(this.productions_),
	        "performAction: " + String(this.performAction),
	        "table: " + tableCode.moduleCode,
	        "defaultActions: " + JSON.stringify(this.defaultActions).replace(/"([0-9]+)":/g,"$1:"),
	        "parseError: " + String(this.parseError || (this.hasErrorRecovery ? traceParseError : parser.parseError)),
	        "parse: " + parseFn
	        ].join(",\n");
	    moduleCode += "};";

	    return { commonCode: commonCode, moduleCode: moduleCode }
	};

	// Generate code that represents the specified parser table
	lrGeneratorMixin.generateTableCode = function (table) {
	    var moduleCode = JSON.stringify(table);
	    var variables = [createObjectCode];

	    // Don't surround numerical property name numbers in quotes
	    moduleCode = moduleCode.replace(/"([0-9]+)"(?=:)/g, "$1");

	    // Replace objects with several identical values by function calls
	    // e.g., { 1: [6, 7]; 3: [6, 7], 4: [6, 7], 5: 8 } = o([1, 3, 4], [6, 7], { 5: 8 })
	    moduleCode = moduleCode.replace(/\{\d+:[^\}]+,\d+:[^\}]+\}/g, function (object) {
	        // Find the value that occurs with the highest number of keys
	        var value, frequentValue, key, keys = {}, keyCount, maxKeyCount = 0,
	            keyValue, keyValues = [], keyValueMatcher = /(\d+):([^:]+)(?=,\d+:|\})/g;

	        while ((keyValue = keyValueMatcher.exec(object))) {
	            // For each value, store the keys where that value occurs
	            key = keyValue[1];
	            value = keyValue[2];
	            keyCount = 1;

	            if (!(value in keys)) {
	                keys[value] = [key];
	            } else {
	                keyCount = keys[value].push(key);
	            }
	            // Remember this value if it is the most frequent one
	            if (keyCount > maxKeyCount) {
	                maxKeyCount = keyCount;
	                frequentValue = value;
	            }
	        }
	        // Construct the object with a function call if the most frequent value occurs multiple times
	        if (maxKeyCount > 1) {
	            // Collect all non-frequent values into a remainder object
	            for (value in keys) {
	                if (value !== frequentValue) {
	                    for (k = keys[value], i = 0, l = k.length; i < l; i++) {
	                        keyValues.push(k[i] + ':' + value);
	                    }
	                }
	            }
	            keyValues = keyValues.length ? ',{' + keyValues.join(',') + '}' : '';
	            // Create the function call `o(keys, value, remainder)`
	            object = 'o([' + keys[frequentValue].join(',') + '],' + frequentValue + keyValues + ')';
	        }
	        return object;
	    });

	    // Count occurrences of number lists
	    var lis;
	    var lists = {};
	    var listMatcher = /\[[0-9,]+\]/g;

	    while (list = listMatcher.exec(moduleCode)) {
	        lists[list] = (lists[list] || 0) + 1;
	    }

	    // Replace frequently occurring number lists with variables
	    moduleCode = moduleCode.replace(listMatcher, function (list) {
	        var listId = lists[list];
	        // If listId is a number, it represents the list's occurrence frequency
	        if (typeof listId === 'number') {
	            // If the list does not occur frequently, represent it by the list
	            if (listId === 1) {
	                lists[list] = listId = list;
	            // If the list occurs frequently, represent it by a newly assigned variable
	            } else {
	                lists[list] = listId = createVariable();
	                variables.push(listId + '=' + list);
	            }
	        }
	        return listId;
	    });

	    // Return the variable initialization code and the table code
	    return {
	        commonCode: 'var ' + variables.join(',') + ';',
	        moduleCode: moduleCode
	    };
	};
	// Function that extends an object with the given value for all given keys
	// e.g., o([1, 3, 4], [6, 7], { x: 1, y: 2 }) = { 1: [6, 7]; 3: [6, 7], 4: [6, 7], x: 1, y: 2 }
	var createObjectCode = 'o=function(k,v,o,l){' +
	    'for(o=o||{},l=k.length;l--;o[k[l]]=v);' +
	    'return o}';

	// Creates a variable with a unique name
	function createVariable() {
	    var id = nextVariableId++;
	    var name = '$V';

	    do {
	        name += variableTokens[id % variableTokensLength];
	        id = ~~(id / variableTokensLength);
	    } while (id !== 0);

	    return name;
	}

	var nextVariableId = 0;
	var variableTokens = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
	var variableTokensLength = variableTokens.length;

	// default main method for generated commonjs modules
	function commonjsMain (args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(7).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	}

	// debug mixin for LR parser generators

	function printAction (a, gen) {
	    var s = a[0] == 1 ? 'shift token (then go to state '+a[1]+')' :
	        a[0] == 2 ? 'reduce by rule: '+gen.productions[a[1]] :
	                    'accept' ;

	    return s;
	}

	var lrGeneratorDebug = {
	    beforeparseTable: function () {
	        this.trace("Building parse table.");
	    },
	    afterparseTable: function () {
	        var self = this;
	        if (this.conflicts > 0) {
	            this.resolutions.forEach(function (r, i) {
	                if (r[2].bydefault) {
	                    self.warn('Conflict at state: ',r[0], ', token: ',r[1], "\n  ", printAction(r[2].r, self), "\n  ", printAction(r[2].s, self));
	                }
	            });
	            this.trace("\n"+this.conflicts+" Conflict(s) found in grammar.");
	        }
	        this.trace("Done.");
	    },
	    aftercanonicalCollection: function (states) {
	        var trace = this.trace;
	        trace("\nItem sets\n------");

	        states.forEach(function (state, i) {
	            trace("\nitem set",i,"\n"+state.join("\n"), '\ntransitions -> ', JSON.stringify(state.edges));
	        });
	    }
	};

	var parser = typal.beget();

	lrGeneratorMixin.createParser = function createParser () {

	    var p = eval(this.generateModuleExpr());

	    // for debugging
	    p.productions = this.productions;

	    var self = this;
	    function bind(method) {
	        return function() {
	            self.lexer = p.lexer;
	            return self[method].apply(self, arguments);
	        };
	    }

	    // backwards compatability
	    p.generate = bind('generate');
	    p.generateAMDModule = bind('generateAMDModule');
	    p.generateModule = bind('generateModule');
	    p.generateCommonJSModule = bind('generateCommonJSModule');

	    return p;
	};

	parser.trace = generator.trace;
	parser.warn = generator.warn;
	parser.error = generator.error;

	function traceParseError (err, hash) {
	    this.trace(err);
	}

	function parseError (str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	}

	parser.parseError = lrGeneratorMixin.parseError = parseError;

	parser.parse = function parse (input) {
	    var self = this,
	        stack = [0],
	        tstack = [], // token stack
	        vstack = [null], // semantic value stack
	        lstack = [], // location stack
	        table = this.table,
	        yytext = '',
	        yylineno = 0,
	        yyleng = 0,
	        recovering = 0,
	        TERROR = 2,
	        EOF = 1;

	    var args = lstack.slice.call(arguments, 1);

	    //this.reductionCount = this.shiftCount = 0;

	    var lexer = Object.create(this.lexer);
	    var sharedState = { yy: {} };
	    // copy state
	    for (var k in this.yy) {
	      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	        sharedState.yy[k] = this.yy[k];
	      }
	    }

	    lexer.setInput(input, sharedState.yy);
	    sharedState.yy.lexer = lexer;
	    sharedState.yy.parser = this;
	    if (typeof lexer.yylloc == 'undefined') {
	        lexer.yylloc = {};
	    }
	    var yyloc = lexer.yylloc;
	    lstack.push(yyloc);

	    var ranges = lexer.options && lexer.options.ranges;

	    if (typeof sharedState.yy.parseError === 'function') {
	        this.parseError = sharedState.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }

	    function popStack (n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }

	_token_stack:
	    function lex() {
	        var token;
	        token = lexer.lex() || EOF;
	        // if token isn't its numeric value, convert
	        if (typeof token !== 'number') {
	            token = self.symbols_[token] || token;
	        }
	        return token;
	    }

	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        // retreive state number from top of stack
	        state = stack[stack.length - 1];

	        // use default actions if available
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            // read action for current state and first input
	            action = table[state] && table[state][symbol];
	        }

	_handle_error:
	        // handle parse error
	        if (typeof action === 'undefined' || !action.length || !action[0]) {
	            var error_rule_depth;
	            var errStr = '';

	            // Return the rule stack depth where the nearest error rule can be found.
	            // Return FALSE when no error recovery rule was found.
	            function locateNearestErrorRecoveryRule(state) {
	                var stack_probe = stack.length - 1;
	                var depth = 0;

	                // try to recover from error
	                for(;;) {
	                    // check for error recovery rule in this state
	                    if ((TERROR.toString()) in table[state]) {
	                        return depth;
	                    }
	                    if (state === 0 || stack_probe < 2) {
	                        return false; // No suitable error recovery rule available.
	                    }
	                    stack_probe -= 2; // popStack(1): [symbol, action]
	                    state = stack[stack_probe];
	                    ++depth;
	                }
	            }

	            if (!recovering) {
	                // first see if there's any chance at hitting an error recovery rule:
	                error_rule_depth = locateNearestErrorRecoveryRule(state);

	                // Report error
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push("'"+this.terminals_[p]+"'");
	                    }
	                }
	                if (lexer.showPosition) {
	                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
	                } else {
	                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
	                                  (symbol == EOF ? "end of input" :
	                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
	                }
	                this.parseError(errStr, {
	                    text: lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected,
	                    recoverable: (error_rule_depth !== false)
	                });
	            } else if (preErrorSymbol !== EOF) {
	                error_rule_depth = locateNearestErrorRecoveryRule(state);
	            }

	            // just recovered from another error
	            if (recovering == 3) {
	                if (symbol === EOF || preErrorSymbol === EOF) {
	                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
	                }

	                // discard current lookahead and grab another
	                yyleng = lexer.yyleng;
	                yytext = lexer.yytext;
	                yylineno = lexer.yylineno;
	                yyloc = lexer.yylloc;
	                symbol = lex();
	            }

	            // try to recover from error
	            if (error_rule_depth === false) {
	                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
	            }
	            popStack(error_rule_depth);

	            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
	            symbol = TERROR;         // insert generic error symbol as new lookahead
	            state = stack[stack.length-1];
	            action = table[state] && table[state][TERROR];
	            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
	        }

	        // this shouldn't happen, unless resolve defaults are off
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
	        }

	        switch (action[0]) {
	            case 1: // shift
	                //this.shiftCount++;

	                stack.push(symbol);
	                vstack.push(lexer.yytext);
	                lstack.push(lexer.yylloc);
	                stack.push(action[1]); // push state
	                symbol = null;
	                if (!preErrorSymbol) { // normal execution/no error
	                    yyleng = lexer.yyleng;
	                    yytext = lexer.yytext;
	                    yylineno = lexer.yylineno;
	                    yyloc = lexer.yylloc;
	                    if (recovering > 0) {
	                        recovering--;
	                    }
	                } else {
	                    // error just occurred, resume old lookahead f/ before error
	                    symbol = preErrorSymbol;
	                    preErrorSymbol = null;
	                }
	                break;

	            case 2:
	                // reduce
	                //this.reductionCount++;

	                len = this.productions_[action[1]][1];

	                // perform semantic action
	                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
	                // default location, uses first token for firsts, last for lasts
	                yyval._$ = {
	                    first_line: lstack[lstack.length-(len||1)].first_line,
	                    last_line: lstack[lstack.length-1].last_line,
	                    first_column: lstack[lstack.length-(len||1)].first_column,
	                    last_column: lstack[lstack.length-1].last_column
	                };
	                if (ranges) {
	                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
	                }
	                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

	                if (typeof r !== 'undefined') {
	                    return r;
	                }

	                // pop off stack
	                if (len) {
	                    stack = stack.slice(0,-1*len*2);
	                    vstack = vstack.slice(0, -1*len);
	                    lstack = lstack.slice(0, -1*len);
	                }

	                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
	                vstack.push(yyval.$);
	                lstack.push(yyval._$);
	                // goto new state = table[STATE][NONTERMINAL]
	                newState = table[stack[stack.length-2]][stack[stack.length-1]];
	                stack.push(newState);
	                break;

	            case 3:
	                // accept
	                return true;
	        }

	    }

	    return true;
	};

	parser.init = function parser_init (dict) {
	    this.table = dict.table;
	    this.defaultActions = dict.defaultActions;
	    this.performAction = dict.performAction;
	    this.productions_ = dict.productions_;
	    this.symbols_ = dict.symbols_;
	    this.terminals_ = dict.terminals_;
	};

	/*
	 * LR(0) Parser
	 * */

	var lr0 = generator.beget(lookaheadMixin, lrGeneratorMixin, {
	    type: "LR(0)",
	    afterconstructor: function lr0_afterconstructor () {
	        this.buildTable();
	    }
	});

	var LR0Generator = exports.LR0Generator = lr0.construct();

	/*
	 * Simple LALR(1)
	 * */

	var lalr = generator.beget(lookaheadMixin, lrGeneratorMixin, {
	    type: "LALR(1)",

	    afterconstructor: function (grammar, options) {
	        if (this.DEBUG) this.mix(lrGeneratorDebug, lalrGeneratorDebug); // mixin debug methods

	        options = options || {};
	        this.states = this.canonicalCollection();
	        this.terms_ = {};

	        var newg = this.newg = typal.beget(lookaheadMixin,{
	            oldg: this,
	            trace: this.trace,
	            nterms_: {},
	            DEBUG: false,
	            go_: function (r, B) {
	                r = r.split(":")[0]; // grab state #
	                B = B.map(function (b) { return b.slice(b.indexOf(":")+1); });
	                return this.oldg.go(r, B);
	            }
	        });
	        newg.nonterminals = {};
	        newg.productions = [];

	        this.inadequateStates = [];

	        // if true, only lookaheads in inadequate states are computed (faster, larger table)
	        // if false, lookaheads for all reductions will be computed (slower, smaller table)
	        this.onDemandLookahead = options.onDemandLookahead || false;

	        this.buildNewGrammar();
	        newg.computeLookaheads();
	        this.unionLookaheads();

	        this.table = this.parseTable(this.states);
	        this.defaultActions = findDefaults(this.table);
	    },

	    lookAheads: function LALR_lookaheads (state, item) {
	        return (!!this.onDemandLookahead && !state.inadequate) ? this.terminals : item.follows;
	    },
	    go: function LALR_go (p, w) {
	        var q = parseInt(p, 10);
	        for (var i=0;i<w.length;i++) {
	            q = this.states.item(q).edges[w[i]] || q;
	        }
	        return q;
	    },
	    goPath: function LALR_goPath (p, w) {
	        var q = parseInt(p, 10),t,
	            path = [];
	        for (var i=0;i<w.length;i++) {
	            t = w[i] ? q+":"+w[i] : '';
	            if (t) this.newg.nterms_[t] = q;
	            path.push(t);
	            q = this.states.item(q).edges[w[i]] || q;
	            this.terms_[t] = w[i];
	        }
	        return {path: path, endState: q};
	    },
	    // every disjoint reduction of a nonterminal becomes a produciton in G'
	    buildNewGrammar: function LALR_buildNewGrammar () {
	        var self = this,
	            newg = this.newg;

	        this.states.forEach(function (state, i) {
	            state.forEach(function (item) {
	                if (item.dotPosition === 0) {
	                    // new symbols are a combination of state and transition symbol
	                    var symbol = i+":"+item.production.symbol;
	                    self.terms_[symbol] = item.production.symbol;
	                    newg.nterms_[symbol] = i;
	                    if (!newg.nonterminals[symbol])
	                        newg.nonterminals[symbol] = new Nonterminal(symbol);
	                    var pathInfo = self.goPath(i, item.production.handle);
	                    var p = new Production(symbol, pathInfo.path, newg.productions.length);
	                    newg.productions.push(p);
	                    newg.nonterminals[symbol].productions.push(p);

	                    // store the transition that get's 'backed up to' after reduction on path
	                    var handle = item.production.handle.join(' ');
	                    var goes = self.states.item(pathInfo.endState).goes;
	                    if (!goes[handle])
	                        goes[handle] = [];
	                    goes[handle].push(symbol);

	                    //self.trace('new production:',p);
	                }
	            });
	            if (state.inadequate)
	                self.inadequateStates.push(i);
	        });
	    },
	    unionLookaheads: function LALR_unionLookaheads () {
	        var self = this,
	            newg = this.newg,
	            states = !!this.onDemandLookahead ? this.inadequateStates : this.states;

	        states.forEach(function union_states_forEach (i) {
	            var state = typeof i === 'number' ? self.states.item(i) : i,
	                follows = [];
	            if (state.reductions.length)
	            state.reductions.forEach(function union_reduction_forEach (item) {
	                var follows = {};
	                for (var k=0;k<item.follows.length;k++) {
	                    follows[item.follows[k]] = true;
	                }
	                state.goes[item.production.handle.join(' ')].forEach(function reduction_goes_forEach (symbol) {
	                    newg.nonterminals[symbol].follows.forEach(function goes_follows_forEach (symbol) {
	                        var terminal = self.terms_[symbol];
	                        if (!follows[terminal]) {
	                            follows[terminal]=true;
	                            item.follows.push(terminal);
	                        }
	                    });
	                });
	                //self.trace('unioned item', item);
	            });
	        });
	    }
	});

	var LALRGenerator = exports.LALRGenerator = lalr.construct();

	// LALR generator debug mixin

	var lalrGeneratorDebug = {
	    trace: function trace () {
	        Jison.print.apply(null, arguments);
	    },
	    beforebuildNewGrammar: function () {
	        this.trace(this.states.size()+" states.");
	        this.trace("Building lookahead grammar.");
	    },
	    beforeunionLookaheads: function () {
	        this.trace("Computing lookaheads.");
	    }
	};

	/*
	 * Lookahead parser definitions
	 *
	 * Define base type
	 * */
	var lrLookaheadGenerator = generator.beget(lookaheadMixin, lrGeneratorMixin, {
	    afterconstructor: function lr_aftercontructor () {
	        this.computeLookaheads();
	        this.buildTable();
	    }
	});

	/*
	 * SLR Parser
	 * */
	var SLRGenerator = exports.SLRGenerator = lrLookaheadGenerator.construct({
	    type: "SLR(1)",

	    lookAheads: function SLR_lookAhead (state, item) {
	        return this.nonterminals[item.production.symbol].follows;
	    }
	});


	/*
	 * LR(1) Parser
	 * */
	var lr1 = lrLookaheadGenerator.beget({
	    type: "Canonical LR(1)",

	    lookAheads: function LR_lookAheads (state, item) {
	        return item.follows;
	    },
	    Item: lrGeneratorMixin.Item.prototype.construct({
	        afterconstructor: function () {
	            this.id = this.production.id+'a'+this.dotPosition+'a'+this.follows.sort().join(',');
	        },
	        eq: function (e) {
	            return e.id === this.id;
	        }
	    }),

	    closureOperation: function LR_ClosureOperation (itemSet /*, closureSet*/) {
	        var closureSet = new this.ItemSet();
	        var self = this;

	        var set = itemSet,
	            itemQueue, syms = {};

	        do {
	        itemQueue = new Set();
	        closureSet.concat(set);
	        set.forEach(function (item) {
	            var symbol = item.markedSymbol;
	            var b, r;

	            // if token is a nonterminal, recursively add closures
	            if (symbol && self.nonterminals[symbol]) {
	                r = item.remainingHandle();
	                b = self.first(item.remainingHandle());
	                if (b.length === 0 || item.production.nullable || self.nullable(r)) {
	                    b = b.concat(item.follows);
	                }
	                self.nonterminals[symbol].productions.forEach(function (production) {
	                    var newItem = new self.Item(production, 0, b);
	                    if(!closureSet.contains(newItem) && !itemQueue.contains(newItem)) {
	                        itemQueue.push(newItem);
	                    }
	                });
	            } else if (!symbol) {
	                // reduction
	                closureSet.reductions.push(item);
	            }
	        });

	        set = itemQueue;
	        } while (!itemQueue.isEmpty());

	        return closureSet;
	    }
	});

	var LR1Generator = exports.LR1Generator = lr1.construct();

	/*
	 * LL Parser
	 * */
	var ll = generator.beget(lookaheadMixin, {
	    type: "LL(1)",

	    afterconstructor: function ll_aftercontructor () {
	        this.computeLookaheads();
	        this.table = this.parseTable(this.productions);
	    },
	    parseTable: function llParseTable (productions) {
	        var table = {},
	            self = this;
	        productions.forEach(function (production, i) {
	            var row = table[production.symbol] || {};
	            var tokens = production.first;
	            if (self.nullable(production.handle)) {
	                Set.union(tokens, self.nonterminals[production.symbol].follows);
	            }
	            tokens.forEach(function (token) {
	                if (row[token]) {
	                    row[token].push(i);
	                    self.conflicts++;
	                } else {
	                    row[token] = [i];
	                }
	            });
	            table[production.symbol] = row;
	        });

	        return table;
	    }
	});

	var LLGenerator = exports.LLGenerator = ll.construct();

	Jison.Generator = function Jison_Generator (g, options) {
	    var opt = typal.mix.call({}, g.options, options);
	    switch (opt.type) {
	        case 'lr0':
	            return new LR0Generator(g, opt);
	        case 'slr':
	            return new SLRGenerator(g, opt);
	        case 'lr':
	            return new LR1Generator(g, opt);
	        case 'll':
	            return new LLGenerator(g, opt);
	        default:
	            return new LALRGenerator(g, opt);
	    }
	};

	return function Parser (g, options) {
	        var gen = Jison.Generator(g, options);
	        return gen.createParser();
	    };

	})();


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
	  Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
	  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	/*jslint bitwise:true plusplus:true */
	/*global esprima:true, define:true, exports:true, window: true,
	createLocationMarker: true,
	throwError: true, generateStatement: true, peek: true,
	parseAssignmentExpression: true, parseBlock: true, parseExpression: true,
	parseFunctionDeclaration: true, parseFunctionExpression: true,
	parseFunctionSourceElements: true, parseVariableIdentifier: true,
	parseLeftHandSideExpression: true,
	parseUnaryExpression: true,
	parseStatement: true, parseSourceElement: true */

	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // Rhino, and plain browser loading.
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.esprima = {}));
	    }
	}(this, function (exports) {
	    'use strict';

	    var Token,
	        TokenName,
	        FnExprTokens,
	        Syntax,
	        PropertyKind,
	        Messages,
	        Regex,
	        SyntaxTreeDelegate,
	        source,
	        strict,
	        index,
	        lineNumber,
	        lineStart,
	        length,
	        delegate,
	        lookahead,
	        state,
	        extra;

	    Token = {
	        BooleanLiteral: 1,
	        EOF: 2,
	        Identifier: 3,
	        Keyword: 4,
	        NullLiteral: 5,
	        NumericLiteral: 6,
	        Punctuator: 7,
	        StringLiteral: 8,
	        RegularExpression: 9
	    };

	    TokenName = {};
	    TokenName[Token.BooleanLiteral] = 'Boolean';
	    TokenName[Token.EOF] = '<end>';
	    TokenName[Token.Identifier] = 'Identifier';
	    TokenName[Token.Keyword] = 'Keyword';
	    TokenName[Token.NullLiteral] = 'Null';
	    TokenName[Token.NumericLiteral] = 'Numeric';
	    TokenName[Token.Punctuator] = 'Punctuator';
	    TokenName[Token.StringLiteral] = 'String';
	    TokenName[Token.RegularExpression] = 'RegularExpression';

	    // A function following one of those tokens is an expression.
	    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	                    'return', 'case', 'delete', 'throw', 'void',
	                    // assignment operators
	                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
	                    '&=', '|=', '^=', ',',
	                    // binary/unary operators
	                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	                    '<=', '<', '>', '!=', '!=='];

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement'
	    };

	    PropertyKind = {
	        Data: 1,
	        Get: 2,
	        Set: 4
	    };

	    // Error messages should be identical to V8.
	    Messages = {
	        UnexpectedToken:  'Unexpected token %0',
	        UnexpectedNumber:  'Unexpected number',
	        UnexpectedString:  'Unexpected string',
	        UnexpectedIdentifier:  'Unexpected identifier',
	        UnexpectedReserved:  'Unexpected reserved word',
	        UnexpectedEOS:  'Unexpected end of input',
	        NewlineAfterThrow:  'Illegal newline after throw',
	        InvalidRegExp: 'Invalid regular expression',
	        UnterminatedRegExp:  'Invalid regular expression: missing /',
	        InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
	        InvalidLHSInForIn:  'Invalid left-hand side in for-in',
	        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	        NoCatchOrFinally:  'Missing catch or finally after try',
	        UnknownLabel: 'Undefined label \'%0\'',
	        Redeclaration: '%0 \'%1\' has already been declared',
	        IllegalContinue: 'Illegal continue statement',
	        IllegalBreak: 'Illegal break statement',
	        IllegalReturn: 'Illegal return statement',
	        StrictModeWith:  'Strict mode code may not include a with statement',
	        StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
	        StrictVarName:  'Variable name may not be eval or arguments in strict mode',
	        StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
	        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	        StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
	        StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
	        StrictDelete:  'Delete of an unqualified identifier in strict mode.',
	        StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
	        AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
	        AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
	        StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
	        StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictReservedWord:  'Use of future reserved word in strict mode'
	    };

	    // See also tools/generate-unicode-regex.py.
	    Regex = {
	        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
	        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
	    };

	    // Ensure the condition is true, otherwise throw an error.
	    // This is only to have a better contract semantic, i.e. another safety net
	    // to catch a logic error. The condition shall be fulfilled in normal case.
	    // Do NOT use this to enforce a certain condition on any user input.

	    function assert(condition, message) {
	        if (!condition) {
	            throw new Error('ASSERT: ' + message);
	        }
	    }

	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }

	    function isHexDigit(ch) {
	        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
	    }

	    function isOctalDigit(ch) {
	        return '01234567'.indexOf(ch) >= 0;
	    }


	    // 7.2 White Space

	    function isWhiteSpace(ch) {
	        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
	            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
	    }

	    // 7.3 Line Terminators

	    function isLineTerminator(ch) {
	        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
	    }

	    // 7.6 Identifier Names and Identifiers

	    function isIdentifierStart(ch) {
	        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
	            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
	            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
	            (ch === 0x5C) ||                      // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	    }

	    function isIdentifierPart(ch) {
	        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
	            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
	            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
	            (ch >= 0x30 && ch <= 0x39) ||         // 0..9
	            (ch === 0x5C) ||                      // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	    }

	    // 7.6.1.2 Future Reserved Words

	    function isFutureReservedWord(id) {
	        switch (id) {
	        case 'class':
	        case 'enum':
	        case 'export':
	        case 'extends':
	        case 'import':
	        case 'super':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isStrictModeReservedWord(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'yield':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    // 7.6.1.1 Keywords

	    function isKeyword(id) {
	        if (strict && isStrictModeReservedWord(id)) {
	            return true;
	        }

	        // 'const' is specialized as Keyword in V8.
	        // 'yield' and 'let' are for compatiblity with SpiderMonkey and ES.next.
	        // Some others are from future reserved words.

	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') ||
	                (id === 'try') || (id === 'let');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }

	    // 7.4 Comments

	    function addComment(type, value, start, end, loc) {
	        var comment, attacher;

	        assert(typeof start === 'number', 'Comment must have valid position');

	        // Because the way the actual token is scanned, often the comments
	        // (if any) are skipped twice during the lexical analysis.
	        // Thus, we need to skip adding a comment if the comment array already
	        // handled it.
	        if (state.lastCommentStart >= start) {
	            return;
	        }
	        state.lastCommentStart = start;

	        comment = {
	            type: type,
	            value: value
	        };
	        if (extra.range) {
	            comment.range = [start, end];
	        }
	        if (extra.loc) {
	            comment.loc = loc;
	        }
	        extra.comments.push(comment);

	        if (extra.attachComment) {
	            attacher = {
	                comment: comment,
	                leading: null,
	                trailing: null,
	                range: [start, end]
	            };
	            extra.pendingComments.push(attacher);
	        }
	    }

	    function skipSingleLineComment(offset) {
	        var start, loc, ch, comment;

	        start = index - offset;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart - offset
	            }
	        };

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            ++index;
	            if (isLineTerminator(ch)) {
	                if (extra.comments) {
	                    comment = source.slice(start + offset, index - 1);
	                    loc.end = {
	                        line: lineNumber,
	                        column: index - lineStart - 1
	                    };
	                    addComment('Line', comment, start, index - 1, loc);
	                }
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                return;
	            }
	        }

	        if (extra.comments) {
	            comment = source.slice(start + offset, index);
	            loc.end = {
	                line: lineNumber,
	                column: index - lineStart
	            };
	            addComment('Line', comment, start, index, loc);
	        }
	    }

	    function skipMultiLineComment() {
	        var start, loc, ch, comment;

	        if (extra.comments) {
	            start = index - 2;
	            loc = {
	                start: {
	                    line: lineNumber,
	                    column: index - lineStart - 2
	                }
	            };
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (isLineTerminator(ch)) {
	                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
	                    ++index;
	                }
	                ++lineNumber;
	                ++index;
	                lineStart = index;
	                if (index >= length) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            } else if (ch === 0x2A) {
	                // Block comment ends with '*/'.
	                if (source.charCodeAt(index + 1) === 0x2F) {
	                    ++index;
	                    ++index;
	                    if (extra.comments) {
	                        comment = source.slice(start + 2, index - 2);
	                        loc.end = {
	                            line: lineNumber,
	                            column: index - lineStart
	                        };
	                        addComment('Block', comment, start, index, loc);
	                    }
	                    return;
	                }
	                ++index;
	            } else {
	                ++index;
	            }
	        }

	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }

	    function skipComment() {
	        var ch, start;

	        start = (index === 0);
	        while (index < length) {
	            ch = source.charCodeAt(index);

	            if (isWhiteSpace(ch)) {
	                ++index;
	            } else if (isLineTerminator(ch)) {
	                ++index;
	                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                start = true;
	            } else if (ch === 0x2F) { // U+002F is '/'
	                ch = source.charCodeAt(index + 1);
	                if (ch === 0x2F) {
	                    ++index;
	                    ++index;
	                    skipSingleLineComment(2);
	                    start = true;
	                } else if (ch === 0x2A) {  // U+002A is '*'
	                    ++index;
	                    ++index;
	                    skipMultiLineComment();
	                } else {
	                    break;
	                }
	            } else if (start && ch === 0x2D) { // U+002D is '-'
	                // U+003E is '>'
	                if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
	                    // '-->' is a single-line comment
	                    index += 3;
	                    skipSingleLineComment(3);
	                } else {
	                    break;
	                }
	            } else if (ch === 0x3C) { // U+003C is '<'
	                if (source.slice(index + 1, index + 4) === '!--') {
	                    ++index; // `<`
	                    ++index; // `!`
	                    ++index; // `-`
	                    ++index; // `-`
	                    skipSingleLineComment(4);
	                } else {
	                    break;
	                }
	            } else {
	                break;
	            }
	        }
	    }

	    function scanHexEscape(prefix) {
	        var i, len, ch, code = 0;

	        len = (prefix === 'u') ? 4 : 2;
	        for (i = 0; i < len; ++i) {
	            if (index < length && isHexDigit(source[index])) {
	                ch = source[index++];
	                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	            } else {
	                return '';
	            }
	        }
	        return String.fromCharCode(code);
	    }

	    function getEscapedIdentifier() {
	        var ch, id;

	        ch = source.charCodeAt(index++);
	        id = String.fromCharCode(ch);

	        // '\u' (U+005C, U+0075) denotes an escaped character.
	        if (ch === 0x5C) {
	            if (source.charCodeAt(index) !== 0x75) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            ++index;
	            ch = scanHexEscape('u');
	            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            id = ch;
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isIdentifierPart(ch)) {
	                break;
	            }
	            ++index;
	            id += String.fromCharCode(ch);

	            // '\u' (U+005C, U+0075) denotes an escaped character.
	            if (ch === 0x5C) {
	                id = id.substr(0, id.length - 1);
	                if (source.charCodeAt(index) !== 0x75) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                ++index;
	                ch = scanHexEscape('u');
	                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                id += ch;
	            }
	        }

	        return id;
	    }

	    function getIdentifier() {
	        var start, ch;

	        start = index++;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (ch === 0x5C) {
	                // Blackslash (U+005C) marks Unicode escape sequence.
	                index = start;
	                return getEscapedIdentifier();
	            }
	            if (isIdentifierPart(ch)) {
	                ++index;
	            } else {
	                break;
	            }
	        }

	        return source.slice(start, index);
	    }

	    function scanIdentifier() {
	        var start, id, type;

	        start = index;

	        // Backslash (U+005C) starts an escaped character.
	        id = (source.charCodeAt(index) === 0x5C) ? getEscapedIdentifier() : getIdentifier();

	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = Token.Identifier;
	        } else if (isKeyword(id)) {
	            type = Token.Keyword;
	        } else if (id === 'null') {
	            type = Token.NullLiteral;
	        } else if (id === 'true' || id === 'false') {
	            type = Token.BooleanLiteral;
	        } else {
	            type = Token.Identifier;
	        }

	        return {
	            type: type,
	            value: id,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }


	    // 7.7 Punctuators

	    function scanPunctuator() {
	        var start = index,
	            code = source.charCodeAt(index),
	            code2,
	            ch1 = source[index],
	            ch2,
	            ch3,
	            ch4;

	        switch (code) {

	        // Check for most common single-character punctuators.
	        case 0x2E:  // . dot
	        case 0x28:  // ( open bracket
	        case 0x29:  // ) close bracket
	        case 0x3B:  // ; semicolon
	        case 0x2C:  // , comma
	        case 0x7B:  // { open curly brace
	        case 0x7D:  // } close curly brace
	        case 0x5B:  // [
	        case 0x5D:  // ]
	        case 0x3A:  // :
	        case 0x3F:  // ?
	        case 0x7E:  // ~
	            ++index;
	            if (extra.tokenize) {
	                if (code === 0x28) {
	                    extra.openParenToken = extra.tokens.length;
	                } else if (code === 0x7B) {
	                    extra.openCurlyToken = extra.tokens.length;
	                }
	            }
	            return {
	                type: Token.Punctuator,
	                value: String.fromCharCode(code),
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };

	        default:
	            code2 = source.charCodeAt(index + 1);

	            // '=' (U+003D) marks an assignment or comparison operator.
	            if (code2 === 0x3D) {
	                switch (code) {
	                case 0x25:  // %
	                case 0x26:  // &
	                case 0x2A:  // *:
	                case 0x2B:  // +
	                case 0x2D:  // -
	                case 0x2F:  // /
	                case 0x3C:  // <
	                case 0x3E:  // >
	                case 0x5E:  // ^
	                case 0x7C:  // |
	                    index += 2;
	                    return {
	                        type: Token.Punctuator,
	                        value: String.fromCharCode(code) + String.fromCharCode(code2),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };

	                case 0x21: // !
	                case 0x3D: // =
	                    index += 2;

	                    // !== and ===
	                    if (source.charCodeAt(index) === 0x3D) {
	                        ++index;
	                    }
	                    return {
	                        type: Token.Punctuator,
	                        value: source.slice(start, index),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };
	                default:
	                    break;
	                }
	            }
	            break;
	        }

	        // Peek more characters.

	        ch2 = source[index + 1];
	        ch3 = source[index + 2];
	        ch4 = source[index + 3];

	        // 4-character punctuator: >>>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
	            if (ch4 === '=') {
	                index += 4;
	                return {
	                    type: Token.Punctuator,
	                    value: '>>>=',
	                    lineNumber: lineNumber,
	                    lineStart: lineStart,
	                    range: [start, index]
	                };
	            }
	        }

	        // 3-character punctuators: === !== >>> <<= >>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>>',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '<' && ch2 === '<' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '<<=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '>' && ch2 === '>' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        // Other 2-character punctuators: ++ -- << >> && ||

	        if (ch1 === ch2 && ('+-<>&|'.indexOf(ch1) >= 0)) {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: ch1 + ch2,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }

	    // 7.8.3 Numeric Literals

	    function scanHexLiteral(start) {
	        var number = '';

	        while (index < length) {
	            if (!isHexDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt('0x' + number, 16),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanOctalLiteral(start) {
	        var number = '0' + source[index++];
	        while (index < length) {
	            if (!isOctalDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 8),
	            octal: true,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanNumericLiteral() {
	        var number, start, ch;

	        ch = source[index];
	        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
	            'Numeric literal must start with a decimal digit or a decimal point');

	        start = index;
	        number = '';
	        if (ch !== '.') {
	            number = source[index++];
	            ch = source[index];

	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            if (number === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++index;
	                    return scanHexLiteral(start);
	                }
	                if (isOctalDigit(ch)) {
	                    return scanOctalLiteral(start);
	                }

	                // decimal number starts with '0' such as '09' is illegal.
	                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            }

	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === '.') {
	            number += source[index++];
	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === 'e' || ch === 'E') {
	            number += source[index++];

	            ch = source[index];
	            if (ch === '+' || ch === '-') {
	                number += source[index++];
	            }
	            if (isDecimalDigit(source.charCodeAt(index))) {
	                while (isDecimalDigit(source.charCodeAt(index))) {
	                    number += source[index++];
	                }
	            } else {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseFloat(number),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    // 7.8.4 String Literals

	    function scanStringLiteral() {
	        var str = '', quote, start, ch, code, unescaped, restore, octal = false;

	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');

	        start = index;
	        ++index;

	        while (index < length) {
	            ch = source[index++];

	            if (ch === quote) {
	                quote = '';
	                break;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'n':
	                        str += '\n';
	                        break;
	                    case 'r':
	                        str += '\r';
	                        break;
	                    case 't':
	                        str += '\t';
	                        break;
	                    case 'u':
	                    case 'x':
	                        restore = index;
	                        unescaped = scanHexEscape(ch);
	                        if (unescaped) {
	                            str += unescaped;
	                        } else {
	                            index = restore;
	                            str += ch;
	                        }
	                        break;
	                    case 'b':
	                        str += '\b';
	                        break;
	                    case 'f':
	                        str += '\f';
	                        break;
	                    case 'v':
	                        str += '\x0B';
	                        break;

	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);

	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }

	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);

	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            str += String.fromCharCode(code);
	                        } else {
	                            str += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch ===  '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            } else {
	                str += ch;
	            }
	        }

	        if (quote !== '') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.StringLiteral,
	            value: str,
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanRegExp() {
	        var str, ch, start, pattern, flags, value, classMarker = false, restore, terminated = false;

	        lookahead = null;
	        skipComment();

	        start = index;
	        ch = source[index];
	        assert(ch === '/', 'Regular expression literal must start with a slash');
	        str = source[index++];

	        while (index < length) {
	            ch = source[index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = source[index++];
	                // ECMA-262 7.8.5
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnterminatedRegExp);
	                }
	                str += ch;
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnterminatedRegExp);
	            } else if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            } else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                } else if (ch === '[') {
	                    classMarker = true;
	                }
	            }
	        }

	        if (!terminated) {
	            throwError({}, Messages.UnterminatedRegExp);
	        }

	        // Exclude leading and trailing slash.
	        pattern = str.substr(1, str.length - 2);

	        flags = '';
	        while (index < length) {
	            ch = source[index];
	            if (!isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }

	            ++index;
	            if (ch === '\\' && index < length) {
	                ch = source[index];
	                if (ch === 'u') {
	                    ++index;
	                    restore = index;
	                    ch = scanHexEscape('u');
	                    if (ch) {
	                        flags += ch;
	                        for (str += '\\u'; restore < index; ++restore) {
	                            str += source[restore];
	                        }
	                    } else {
	                        index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                } else {
	                    str += '\\';
	                }
	            } else {
	                flags += ch;
	                str += ch;
	            }
	        }

	        try {
	            value = new RegExp(pattern, flags);
	        } catch (e) {
	            throwError({}, Messages.InvalidRegExp);
	        }



	        if (extra.tokenize) {
	            return {
	                type: Token.RegularExpression,
	                value: value,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }
	        return {
	            literal: str,
	            value: value,
	            range: [start, index]
	        };
	    }

	    function collectRegex() {
	        var pos, loc, regex, token;

	        skipComment();

	        pos = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        regex = scanRegExp();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (!extra.tokenize) {
	            // Pop the previous token, which is likely '/' or '/='
	            if (extra.tokens.length > 0) {
	                token = extra.tokens[extra.tokens.length - 1];
	                if (token.range[0] === pos && token.type === 'Punctuator') {
	                    if (token.value === '/' || token.value === '/=') {
	                        extra.tokens.pop();
	                    }
	                }
	            }

	            extra.tokens.push({
	                type: 'RegularExpression',
	                value: regex.literal,
	                range: [pos, index],
	                loc: loc
	            });
	        }

	        return regex;
	    }

	    function isIdentifierName(token) {
	        return token.type === Token.Identifier ||
	            token.type === Token.Keyword ||
	            token.type === Token.BooleanLiteral ||
	            token.type === Token.NullLiteral;
	    }

	    function advanceSlash() {
	        var prevToken,
	            checkToken;
	        // Using the following algorithm:
	        // https://github.com/mozilla/sweet.js/wiki/design
	        prevToken = extra.tokens[extra.tokens.length - 1];
	        if (!prevToken) {
	            // Nothing before that: it cannot be a division.
	            return collectRegex();
	        }
	        if (prevToken.type === 'Punctuator') {
	            if (prevToken.value === ']') {
	                return scanPunctuator();
	            }
	            if (prevToken.value === ')') {
	                checkToken = extra.tokens[extra.openParenToken - 1];
	                if (checkToken &&
	                        checkToken.type === 'Keyword' &&
	                        (checkToken.value === 'if' ||
	                         checkToken.value === 'while' ||
	                         checkToken.value === 'for' ||
	                         checkToken.value === 'with')) {
	                    return collectRegex();
	                }
	                return scanPunctuator();
	            }
	            if (prevToken.value === '}') {
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                if (extra.tokens[extra.openCurlyToken - 3] &&
	                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
	                    // Anonymous function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 4];
	                    if (!checkToken) {
	                        return scanPunctuator();
	                    }
	                } else if (extra.tokens[extra.openCurlyToken - 4] &&
	                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
	                    // Named function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 5];
	                    if (!checkToken) {
	                        return collectRegex();
	                    }
	                } else {
	                    return scanPunctuator();
	                }
	                // checkToken determines whether the function is
	                // a declaration or an expression.
	                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
	                    // It is an expression.
	                    return scanPunctuator();
	                }
	                // It is a declaration.
	                return collectRegex();
	            }
	            return collectRegex();
	        }
	        if (prevToken.type === 'Keyword') {
	            return collectRegex();
	        }
	        return scanPunctuator();
	    }

	    function advance() {
	        var ch;

	        skipComment();

	        if (index >= length) {
	            return {
	                type: Token.EOF,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [index, index]
	            };
	        }

	        ch = source.charCodeAt(index);

	        // Very common: ( and ) and ;
	        if (ch === 0x28 || ch === 0x29 || ch === 0x3A) {
	            return scanPunctuator();
	        }

	        // String literal starts with single quote (U+0027) or double quote (U+0022).
	        if (ch === 0x27 || ch === 0x22) {
	            return scanStringLiteral();
	        }

	        if (isIdentifierStart(ch)) {
	            return scanIdentifier();
	        }

	        // Dot (.) U+002E can also start a floating-point number, hence the need
	        // to check the next character.
	        if (ch === 0x2E) {
	            if (isDecimalDigit(source.charCodeAt(index + 1))) {
	                return scanNumericLiteral();
	            }
	            return scanPunctuator();
	        }

	        if (isDecimalDigit(ch)) {
	            return scanNumericLiteral();
	        }

	        // Slash (/) U+002F can also start a regex.
	        if (extra.tokenize && ch === 0x2F) {
	            return advanceSlash();
	        }

	        return scanPunctuator();
	    }

	    function collectToken() {
	        var start, loc, token, range, value;

	        skipComment();
	        start = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        token = advance();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (token.type !== Token.EOF) {
	            range = [token.range[0], token.range[1]];
	            value = source.slice(token.range[0], token.range[1]);
	            extra.tokens.push({
	                type: TokenName[token.type],
	                value: value,
	                range: range,
	                loc: loc
	            });
	        }

	        return token;
	    }

	    function lex() {
	        var token;

	        token = lookahead;
	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();

	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        return token;
	    }

	    function peek() {
	        var pos, line, start;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;
	    }

	    SyntaxTreeDelegate = {

	        name: 'SyntaxTree',

	        markStart: function () {
	            skipComment();
	            if (extra.loc) {
	                state.markerStack.push(index - lineStart);
	                state.markerStack.push(lineNumber);
	            }
	            if (extra.range) {
	                state.markerStack.push(index);
	            }
	        },

	        processComment: function (node) {
	            var i, attacher, pos, len, candidate;

	            if (typeof node.type === 'undefined' || node.type === Syntax.Program) {
	                return;
	            }

	            // Check for possible additional trailing comments.
	            peek();

	            for (i = 0; i < extra.pendingComments.length; ++i) {
	                attacher = extra.pendingComments[i];
	                if (node.range[0] >= attacher.comment.range[1]) {
	                    candidate = attacher.leading;
	                    if (candidate) {
	                        pos = candidate.range[0];
	                        len = candidate.range[1] - pos;
	                        if (node.range[0] <= pos && (node.range[1] - node.range[0] >= len)) {
	                            attacher.leading = node;
	                        }
	                    } else {
	                        attacher.leading = node;
	                    }
	                }
	                if (node.range[1] <= attacher.comment.range[0]) {
	                    candidate = attacher.trailing;
	                    if (candidate) {
	                        pos = candidate.range[0];
	                        len = candidate.range[1] - pos;
	                        if (node.range[0] <= pos && (node.range[1] - node.range[0] >= len)) {
	                            attacher.trailing = node;
	                        }
	                    } else {
	                        attacher.trailing = node;
	                    }
	                }
	            }
	        },

	        markEnd: function (node) {
	            if (extra.range) {
	                node.range = [state.markerStack.pop(), index];
	            }
	            if (extra.loc) {
	                node.loc = {
	                    start: {
	                        line: state.markerStack.pop(),
	                        column: state.markerStack.pop()
	                    },
	                    end: {
	                        line: lineNumber,
	                        column: index - lineStart
	                    }
	                };
	                this.postProcess(node);
	            }
	            if (extra.attachComment) {
	                this.processComment(node);
	            }
	            return node;
	        },

	        markEndIf: function (node) {
	            if (node.range || node.loc) {
	                if (extra.loc) {
	                    state.markerStack.pop();
	                    state.markerStack.pop();
	                }
	                if (extra.range) {
	                    state.markerStack.pop();
	                }
	            } else {
	                this.markEnd(node);
	            }
	            return node;
	        },

	        postProcess: function (node) {
	            if (extra.source) {
	                node.loc.source = extra.source;
	            }
	            return node;
	        },

	        createArrayExpression: function (elements) {
	            return {
	                type: Syntax.ArrayExpression,
	                elements: elements
	            };
	        },

	        createAssignmentExpression: function (operator, left, right) {
	            return {
	                type: Syntax.AssignmentExpression,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBinaryExpression: function (operator, left, right) {
	            var type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression :
	                        Syntax.BinaryExpression;
	            return {
	                type: type,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBlockStatement: function (body) {
	            return {
	                type: Syntax.BlockStatement,
	                body: body
	            };
	        },

	        createBreakStatement: function (label) {
	            return {
	                type: Syntax.BreakStatement,
	                label: label
	            };
	        },

	        createCallExpression: function (callee, args) {
	            return {
	                type: Syntax.CallExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createCatchClause: function (param, body) {
	            return {
	                type: Syntax.CatchClause,
	                param: param,
	                body: body
	            };
	        },

	        createConditionalExpression: function (test, consequent, alternate) {
	            return {
	                type: Syntax.ConditionalExpression,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createContinueStatement: function (label) {
	            return {
	                type: Syntax.ContinueStatement,
	                label: label
	            };
	        },

	        createDebuggerStatement: function () {
	            return {
	                type: Syntax.DebuggerStatement
	            };
	        },

	        createDoWhileStatement: function (body, test) {
	            return {
	                type: Syntax.DoWhileStatement,
	                body: body,
	                test: test
	            };
	        },

	        createEmptyStatement: function () {
	            return {
	                type: Syntax.EmptyStatement
	            };
	        },

	        createExpressionStatement: function (expression) {
	            return {
	                type: Syntax.ExpressionStatement,
	                expression: expression
	            };
	        },

	        createForStatement: function (init, test, update, body) {
	            return {
	                type: Syntax.ForStatement,
	                init: init,
	                test: test,
	                update: update,
	                body: body
	            };
	        },

	        createForInStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForInStatement,
	                left: left,
	                right: right,
	                body: body,
	                each: false
	            };
	        },

	        createFunctionDeclaration: function (id, params, defaults, body) {
	            return {
	                type: Syntax.FunctionDeclaration,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: null,
	                generator: false,
	                expression: false
	            };
	        },

	        createFunctionExpression: function (id, params, defaults, body) {
	            return {
	                type: Syntax.FunctionExpression,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: null,
	                generator: false,
	                expression: false
	            };
	        },

	        createIdentifier: function (name) {
	            return {
	                type: Syntax.Identifier,
	                name: name
	            };
	        },

	        createIfStatement: function (test, consequent, alternate) {
	            return {
	                type: Syntax.IfStatement,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createLabeledStatement: function (label, body) {
	            return {
	                type: Syntax.LabeledStatement,
	                label: label,
	                body: body
	            };
	        },

	        createLiteral: function (token) {
	            return {
	                type: Syntax.Literal,
	                value: token.value,
	                raw: source.slice(token.range[0], token.range[1])
	            };
	        },

	        createMemberExpression: function (accessor, object, property) {
	            return {
	                type: Syntax.MemberExpression,
	                computed: accessor === '[',
	                object: object,
	                property: property
	            };
	        },

	        createNewExpression: function (callee, args) {
	            return {
	                type: Syntax.NewExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createObjectExpression: function (properties) {
	            return {
	                type: Syntax.ObjectExpression,
	                properties: properties
	            };
	        },

	        createPostfixExpression: function (operator, argument) {
	            return {
	                type: Syntax.UpdateExpression,
	                operator: operator,
	                argument: argument,
	                prefix: false
	            };
	        },

	        createProgram: function (body) {
	            return {
	                type: Syntax.Program,
	                body: body
	            };
	        },

	        createProperty: function (kind, key, value) {
	            return {
	                type: Syntax.Property,
	                key: key,
	                value: value,
	                kind: kind
	            };
	        },

	        createReturnStatement: function (argument) {
	            return {
	                type: Syntax.ReturnStatement,
	                argument: argument
	            };
	        },

	        createSequenceExpression: function (expressions) {
	            return {
	                type: Syntax.SequenceExpression,
	                expressions: expressions
	            };
	        },

	        createSwitchCase: function (test, consequent) {
	            return {
	                type: Syntax.SwitchCase,
	                test: test,
	                consequent: consequent
	            };
	        },

	        createSwitchStatement: function (discriminant, cases) {
	            return {
	                type: Syntax.SwitchStatement,
	                discriminant: discriminant,
	                cases: cases
	            };
	        },

	        createThisExpression: function () {
	            return {
	                type: Syntax.ThisExpression
	            };
	        },

	        createThrowStatement: function (argument) {
	            return {
	                type: Syntax.ThrowStatement,
	                argument: argument
	            };
	        },

	        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
	            return {
	                type: Syntax.TryStatement,
	                block: block,
	                guardedHandlers: guardedHandlers,
	                handlers: handlers,
	                finalizer: finalizer
	            };
	        },

	        createUnaryExpression: function (operator, argument) {
	            if (operator === '++' || operator === '--') {
	                return {
	                    type: Syntax.UpdateExpression,
	                    operator: operator,
	                    argument: argument,
	                    prefix: true
	                };
	            }
	            return {
	                type: Syntax.UnaryExpression,
	                operator: operator,
	                argument: argument,
	                prefix: true
	            };
	        },

	        createVariableDeclaration: function (declarations, kind) {
	            return {
	                type: Syntax.VariableDeclaration,
	                declarations: declarations,
	                kind: kind
	            };
	        },

	        createVariableDeclarator: function (id, init) {
	            return {
	                type: Syntax.VariableDeclarator,
	                id: id,
	                init: init
	            };
	        },

	        createWhileStatement: function (test, body) {
	            return {
	                type: Syntax.WhileStatement,
	                test: test,
	                body: body
	            };
	        },

	        createWithStatement: function (object, body) {
	            return {
	                type: Syntax.WithStatement,
	                object: object,
	                body: body
	            };
	        }
	    };

	    // Return true if there is a line terminator before the next token.

	    function peekLineTerminator() {
	        var pos, line, start, found;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        skipComment();
	        found = lineNumber !== line;
	        index = pos;
	        lineNumber = line;
	        lineStart = start;

	        return found;
	    }

	    // Throw an exception

	    function throwError(token, messageFormat) {
	        var error,
	            args = Array.prototype.slice.call(arguments, 2),
	            msg = messageFormat.replace(
	                /%(\d)/g,
	                function (whole, index) {
	                    assert(index < args.length, 'Message reference must be in range');
	                    return args[index];
	                }
	            );

	        if (typeof token.lineNumber === 'number') {
	            error = new Error('Line ' + token.lineNumber + ': ' + msg);
	            error.index = token.range[0];
	            error.lineNumber = token.lineNumber;
	            error.column = token.range[0] - lineStart + 1;
	        } else {
	            error = new Error('Line ' + lineNumber + ': ' + msg);
	            error.index = index;
	            error.lineNumber = lineNumber;
	            error.column = index - lineStart + 1;
	        }

	        error.description = msg;
	        throw error;
	    }

	    function throwErrorTolerant() {
	        try {
	            throwError.apply(null, arguments);
	        } catch (e) {
	            if (extra.errors) {
	                extra.errors.push(e);
	            } else {
	                throw e;
	            }
	        }
	    }


	    // Throw an exception because of the token.

	    function throwUnexpected(token) {
	        if (token.type === Token.EOF) {
	            throwError(token, Messages.UnexpectedEOS);
	        }

	        if (token.type === Token.NumericLiteral) {
	            throwError(token, Messages.UnexpectedNumber);
	        }

	        if (token.type === Token.StringLiteral) {
	            throwError(token, Messages.UnexpectedString);
	        }

	        if (token.type === Token.Identifier) {
	            throwError(token, Messages.UnexpectedIdentifier);
	        }

	        if (token.type === Token.Keyword) {
	            if (isFutureReservedWord(token.value)) {
	                throwError(token, Messages.UnexpectedReserved);
	            } else if (strict && isStrictModeReservedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictReservedWord);
	                return;
	            }
	            throwError(token, Messages.UnexpectedToken, token.value);
	        }

	        // BooleanLiteral, NullLiteral, or Punctuator.
	        throwError(token, Messages.UnexpectedToken, token.value);
	    }

	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.

	    function expect(value) {
	        var token = lex();
	        if (token.type !== Token.Punctuator || token.value !== value) {
	            throwUnexpected(token);
	        }
	    }

	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.

	    function expectKeyword(keyword) {
	        var token = lex();
	        if (token.type !== Token.Keyword || token.value !== keyword) {
	            throwUnexpected(token);
	        }
	    }

	    // Return true if the next token matches the specified punctuator.

	    function match(value) {
	        return lookahead.type === Token.Punctuator && lookahead.value === value;
	    }

	    // Return true if the next token matches the specified keyword

	    function matchKeyword(keyword) {
	        return lookahead.type === Token.Keyword && lookahead.value === keyword;
	    }

	    // Return true if the next token is an assignment operator

	    function matchAssign() {
	        var op;

	        if (lookahead.type !== Token.Punctuator) {
	            return false;
	        }
	        op = lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    }

	    function consumeSemicolon() {
	        var line;

	        // Catch the very common case first: immediately a semicolon (U+003B).
	        if (source.charCodeAt(index) === 0x3B) {
	            lex();
	            return;
	        }

	        line = lineNumber;
	        skipComment();
	        if (lineNumber !== line) {
	            return;
	        }

	        if (match(';')) {
	            lex();
	            return;
	        }

	        if (lookahead.type !== Token.EOF && !match('}')) {
	            throwUnexpected(lookahead);
	        }
	    }

	    // Return true if provided expression is LeftHandSideExpression

	    function isLeftHandSide(expr) {
	        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
	    }

	    // 11.1.4 Array Initialiser

	    function parseArrayInitialiser() {
	        var elements = [];

	        expect('[');

	        while (!match(']')) {
	            if (match(',')) {
	                lex();
	                elements.push(null);
	            } else {
	                elements.push(parseAssignmentExpression());

	                if (!match(']')) {
	                    expect(',');
	                }
	            }
	        }

	        expect(']');

	        return delegate.createArrayExpression(elements);
	    }

	    // 11.1.5 Object Initialiser

	    function parsePropertyFunction(param, first) {
	        var previousStrict, body;

	        previousStrict = strict;
	        delegate.markStart();
	        body = parseFunctionSourceElements();
	        if (first && strict && isRestrictedWord(param[0].name)) {
	            throwErrorTolerant(first, Messages.StrictParamName);
	        }
	        strict = previousStrict;
	        return delegate.markEnd(delegate.createFunctionExpression(null, param, [], body));
	    }

	    function parseObjectPropertyKey() {
	        var token;

	        delegate.markStart();
	        token = lex();

	        // Note: This function is called only from parseObjectProperty(), where
	        // EOF and Punctuator tokens are already filtered out.

	        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
	            if (strict && token.octal) {
	                throwErrorTolerant(token, Messages.StrictOctalLiteral);
	            }
	            return delegate.markEnd(delegate.createLiteral(token));
	        }

	        return delegate.markEnd(delegate.createIdentifier(token.value));
	    }

	    function parseObjectProperty() {
	        var token, key, id, value, param;

	        token = lookahead;
	        delegate.markStart();

	        if (token.type === Token.Identifier) {

	            id = parseObjectPropertyKey();

	            // Property Assignment: Getter and Setter.

	            if (token.value === 'get' && !match(':')) {
	                key = parseObjectPropertyKey();
	                expect('(');
	                expect(')');
	                value = parsePropertyFunction([]);
	                return delegate.markEnd(delegate.createProperty('get', key, value));
	            }
	            if (token.value === 'set' && !match(':')) {
	                key = parseObjectPropertyKey();
	                expect('(');
	                token = lookahead;
	                if (token.type !== Token.Identifier) {
	                    expect(')');
	                    throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
	                    value = parsePropertyFunction([]);
	                } else {
	                    param = [ parseVariableIdentifier() ];
	                    expect(')');
	                    value = parsePropertyFunction(param, token);
	                }
	                return delegate.markEnd(delegate.createProperty('set', key, value));
	            }
	            expect(':');
	            value = parseAssignmentExpression();
	            return delegate.markEnd(delegate.createProperty('init', id, value));
	        }
	        if (token.type === Token.EOF || token.type === Token.Punctuator) {
	            throwUnexpected(token);
	        } else {
	            key = parseObjectPropertyKey();
	            expect(':');
	            value = parseAssignmentExpression();
	            return delegate.markEnd(delegate.createProperty('init', key, value));
	        }
	    }

	    function parseObjectInitialiser() {
	        var properties = [], property, name, key, kind, map = {}, toString = String;

	        expect('{');

	        while (!match('}')) {
	            property = parseObjectProperty();

	            if (property.key.type === Syntax.Identifier) {
	                name = property.key.name;
	            } else {
	                name = toString(property.key.value);
	            }
	            kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;

	            key = '$' + name;
	            if (Object.prototype.hasOwnProperty.call(map, key)) {
	                if (map[key] === PropertyKind.Data) {
	                    if (strict && kind === PropertyKind.Data) {
	                        throwErrorTolerant({}, Messages.StrictDuplicateProperty);
	                    } else if (kind !== PropertyKind.Data) {
	                        throwErrorTolerant({}, Messages.AccessorDataProperty);
	                    }
	                } else {
	                    if (kind === PropertyKind.Data) {
	                        throwErrorTolerant({}, Messages.AccessorDataProperty);
	                    } else if (map[key] & kind) {
	                        throwErrorTolerant({}, Messages.AccessorGetSet);
	                    }
	                }
	                map[key] |= kind;
	            } else {
	                map[key] = kind;
	            }

	            properties.push(property);

	            if (!match('}')) {
	                expect(',');
	            }
	        }

	        expect('}');

	        return delegate.createObjectExpression(properties);
	    }

	    // 11.1.6 The Grouping Operator

	    function parseGroupExpression() {
	        var expr;

	        expect('(');

	        expr = parseExpression();

	        expect(')');

	        return expr;
	    }


	    // 11.1 Primary Expressions

	    function parsePrimaryExpression() {
	        var type, token, expr;

	        if (match('(')) {
	            return parseGroupExpression();
	        }

	        type = lookahead.type;
	        delegate.markStart();

	        if (type === Token.Identifier) {
	            expr =  delegate.createIdentifier(lex().value);
	        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
	            if (strict && lookahead.octal) {
	                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	            }
	            expr = delegate.createLiteral(lex());
	        } else if (type === Token.Keyword) {
	            if (matchKeyword('this')) {
	                lex();
	                expr = delegate.createThisExpression();
	            } else if (matchKeyword('function')) {
	                expr = parseFunctionExpression();
	            }
	        } else if (type === Token.BooleanLiteral) {
	            token = lex();
	            token.value = (token.value === 'true');
	            expr = delegate.createLiteral(token);
	        } else if (type === Token.NullLiteral) {
	            token = lex();
	            token.value = null;
	            expr = delegate.createLiteral(token);
	        } else if (match('[')) {
	            expr = parseArrayInitialiser();
	        } else if (match('{')) {
	            expr = parseObjectInitialiser();
	        } else if (match('/') || match('/=')) {
	            if (typeof extra.tokens !== 'undefined') {
	                expr = delegate.createLiteral(collectRegex());
	            } else {
	                expr = delegate.createLiteral(scanRegExp());
	            }
	            peek();
	        }

	        if (expr) {
	            return delegate.markEnd(expr);
	        }

	        throwUnexpected(lex());
	    }

	    // 11.2 Left-Hand-Side Expressions

	    function parseArguments() {
	        var args = [];

	        expect('(');

	        if (!match(')')) {
	            while (index < length) {
	                args.push(parseAssignmentExpression());
	                if (match(')')) {
	                    break;
	                }
	                expect(',');
	            }
	        }

	        expect(')');

	        return args;
	    }

	    function parseNonComputedProperty() {
	        var token;

	        delegate.markStart();
	        token = lex();

	        if (!isIdentifierName(token)) {
	            throwUnexpected(token);
	        }

	        return delegate.markEnd(delegate.createIdentifier(token.value));
	    }

	    function parseNonComputedMember() {
	        expect('.');

	        return parseNonComputedProperty();
	    }

	    function parseComputedMember() {
	        var expr;

	        expect('[');

	        expr = parseExpression();

	        expect(']');

	        return expr;
	    }

	    function parseNewExpression() {
	        var callee, args;

	        delegate.markStart();
	        expectKeyword('new');
	        callee = parseLeftHandSideExpression();
	        args = match('(') ? parseArguments() : [];

	        return delegate.markEnd(delegate.createNewExpression(callee, args));
	    }

	    function parseLeftHandSideExpressionAllowCall() {
	        var marker, previousAllowIn, expr, args, property;

	        marker = createLocationMarker();

	        previousAllowIn = state.allowIn;
	        state.allowIn = true;
	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
	        state.allowIn = previousAllowIn;

	        while (match('.') || match('[') || match('(')) {
	            if (match('(')) {
	                args = parseArguments();
	                expr = delegate.createCallExpression(expr, args);
	            } else if (match('[')) {
	                property = parseComputedMember();
	                expr = delegate.createMemberExpression('[', expr, property);
	            } else {
	                property = parseNonComputedMember();
	                expr = delegate.createMemberExpression('.', expr, property);
	            }
	            if (marker) {
	                marker.apply(expr);
	            }
	        }

	        return expr;
	    }

	    function parseLeftHandSideExpression() {
	        var marker, previousAllowIn, expr, property;

	        marker = createLocationMarker();

	        previousAllowIn = state.allowIn;
	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
	        state.allowIn = previousAllowIn;

	        while (match('.') || match('[')) {
	            if (match('[')) {
	                property = parseComputedMember();
	                expr = delegate.createMemberExpression('[', expr, property);
	            } else {
	                property = parseNonComputedMember();
	                expr = delegate.createMemberExpression('.', expr, property);
	            }
	            if (marker) {
	                marker.apply(expr);
	            }
	        }

	        return expr;
	    }

	    // 11.3 Postfix Expressions

	    function parsePostfixExpression() {
	        var expr, token;

	        delegate.markStart();
	        expr = parseLeftHandSideExpressionAllowCall();

	        if (lookahead.type === Token.Punctuator) {
	            if ((match('++') || match('--')) && !peekLineTerminator()) {
	                // 11.3.1, 11.3.2
	                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                    throwErrorTolerant({}, Messages.StrictLHSPostfix);
	                }

	                if (!isLeftHandSide(expr)) {
	                    throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
	                }

	                token = lex();
	                expr = delegate.createPostfixExpression(token.value, expr);
	            }
	        }

	        return delegate.markEndIf(expr);
	    }

	    // 11.4 Unary Operators

	    function parseUnaryExpression() {
	        var token, expr;

	        delegate.markStart();

	        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
	            expr = parsePostfixExpression();
	        } else if (match('++') || match('--')) {
	            token = lex();
	            expr = parseUnaryExpression();
	            // 11.4.4, 11.4.5
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPrefix);
	            }

	            if (!isLeftHandSide(expr)) {
	                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
	            }

	            expr = delegate.createUnaryExpression(token.value, expr);
	        } else if (match('+') || match('-') || match('~') || match('!')) {
	            token = lex();
	            expr = parseUnaryExpression();
	            expr = delegate.createUnaryExpression(token.value, expr);
	        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
	            token = lex();
	            expr = parseUnaryExpression();
	            expr = delegate.createUnaryExpression(token.value, expr);
	            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
	                throwErrorTolerant({}, Messages.StrictDelete);
	            }
	        } else {
	            expr = parsePostfixExpression();
	        }

	        return delegate.markEndIf(expr);
	    }

	    function binaryPrecedence(token, allowIn) {
	        var prec = 0;

	        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
	            return 0;
	        }

	        switch (token.value) {
	        case '||':
	            prec = 1;
	            break;

	        case '&&':
	            prec = 2;
	            break;

	        case '|':
	            prec = 3;
	            break;

	        case '^':
	            prec = 4;
	            break;

	        case '&':
	            prec = 5;
	            break;

	        case '==':
	        case '!=':
	        case '===':
	        case '!==':
	            prec = 6;
	            break;

	        case '<':
	        case '>':
	        case '<=':
	        case '>=':
	        case 'instanceof':
	            prec = 7;
	            break;

	        case 'in':
	            prec = allowIn ? 7 : 0;
	            break;

	        case '<<':
	        case '>>':
	        case '>>>':
	            prec = 8;
	            break;

	        case '+':
	        case '-':
	            prec = 9;
	            break;

	        case '*':
	        case '/':
	        case '%':
	            prec = 11;
	            break;

	        default:
	            break;
	        }

	        return prec;
	    }

	    // 11.5 Multiplicative Operators
	    // 11.6 Additive Operators
	    // 11.7 Bitwise Shift Operators
	    // 11.8 Relational Operators
	    // 11.9 Equality Operators
	    // 11.10 Binary Bitwise Operators
	    // 11.11 Binary Logical Operators

	    function parseBinaryExpression() {
	        var marker, markers, expr, token, prec, stack, right, operator, left, i;

	        marker = createLocationMarker();
	        left = parseUnaryExpression();

	        token = lookahead;
	        prec = binaryPrecedence(token, state.allowIn);
	        if (prec === 0) {
	            return left;
	        }
	        token.prec = prec;
	        lex();

	        markers = [marker, createLocationMarker()];
	        right = parseUnaryExpression();

	        stack = [left, token, right];

	        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {

	            // Reduce: make a binary expression from the three topmost entries.
	            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
	                right = stack.pop();
	                operator = stack.pop().value;
	                left = stack.pop();
	                expr = delegate.createBinaryExpression(operator, left, right);
	                markers.pop();
	                marker = markers.pop();
	                if (marker) {
	                    marker.apply(expr);
	                }
	                stack.push(expr);
	                markers.push(marker);
	            }

	            // Shift.
	            token = lex();
	            token.prec = prec;
	            stack.push(token);
	            markers.push(createLocationMarker());
	            expr = parseUnaryExpression();
	            stack.push(expr);
	        }

	        // Final reduce to clean-up the stack.
	        i = stack.length - 1;
	        expr = stack[i];
	        markers.pop();
	        while (i > 1) {
	            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
	            i -= 2;
	            marker = markers.pop();
	            if (marker) {
	                marker.apply(expr);
	            }
	        }

	        return expr;
	    }


	    // 11.12 Conditional Operator

	    function parseConditionalExpression() {
	        var expr, previousAllowIn, consequent, alternate;

	        delegate.markStart();
	        expr = parseBinaryExpression();

	        if (match('?')) {
	            lex();
	            previousAllowIn = state.allowIn;
	            state.allowIn = true;
	            consequent = parseAssignmentExpression();
	            state.allowIn = previousAllowIn;
	            expect(':');
	            alternate = parseAssignmentExpression();

	            expr = delegate.markEnd(delegate.createConditionalExpression(expr, consequent, alternate));
	        } else {
	            delegate.markEnd({});
	        }

	        return expr;
	    }

	    // 11.13 Assignment Operators

	    function parseAssignmentExpression() {
	        var token, left, right, node;

	        token = lookahead;
	        delegate.markStart();
	        node = left = parseConditionalExpression();

	        if (matchAssign()) {
	            // LeftHandSideExpression
	            if (!isLeftHandSide(left)) {
	                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
	            }

	            // 11.13.1
	            if (strict && left.type === Syntax.Identifier && isRestrictedWord(left.name)) {
	                throwErrorTolerant(token, Messages.StrictLHSAssignment);
	            }

	            token = lex();
	            right = parseAssignmentExpression();
	            node = delegate.createAssignmentExpression(token.value, left, right);
	        }

	        return delegate.markEndIf(node);
	    }

	    // 11.14 Comma Operator

	    function parseExpression() {
	        var expr;

	        delegate.markStart();
	        expr = parseAssignmentExpression();

	        if (match(',')) {
	            expr = delegate.createSequenceExpression([ expr ]);

	            while (index < length) {
	                if (!match(',')) {
	                    break;
	                }
	                lex();
	                expr.expressions.push(parseAssignmentExpression());
	            }
	        }

	        return delegate.markEndIf(expr);
	    }

	    // 12.1 Block

	    function parseStatementList() {
	        var list = [],
	            statement;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            statement = parseSourceElement();
	            if (typeof statement === 'undefined') {
	                break;
	            }
	            list.push(statement);
	        }

	        return list;
	    }

	    function parseBlock() {
	        var block;

	        delegate.markStart();
	        expect('{');

	        block = parseStatementList();

	        expect('}');

	        return delegate.markEnd(delegate.createBlockStatement(block));
	    }

	    // 12.2 Variable Statement

	    function parseVariableIdentifier() {
	        var token;

	        delegate.markStart();
	        token = lex();

	        if (token.type !== Token.Identifier) {
	            throwUnexpected(token);
	        }

	        return delegate.markEnd(delegate.createIdentifier(token.value));
	    }

	    function parseVariableDeclaration(kind) {
	        var init = null, id;

	        delegate.markStart();
	        id = parseVariableIdentifier();

	        // 12.2.1
	        if (strict && isRestrictedWord(id.name)) {
	            throwErrorTolerant({}, Messages.StrictVarName);
	        }

	        if (kind === 'const') {
	            expect('=');
	            init = parseAssignmentExpression();
	        } else if (match('=')) {
	            lex();
	            init = parseAssignmentExpression();
	        }

	        return delegate.markEnd(delegate.createVariableDeclarator(id, init));
	    }

	    function parseVariableDeclarationList(kind) {
	        var list = [];

	        do {
	            list.push(parseVariableDeclaration(kind));
	            if (!match(',')) {
	                break;
	            }
	            lex();
	        } while (index < length);

	        return list;
	    }

	    function parseVariableStatement() {
	        var declarations;

	        expectKeyword('var');

	        declarations = parseVariableDeclarationList();

	        consumeSemicolon();

	        return delegate.createVariableDeclaration(declarations, 'var');
	    }

	    // kind may be `const` or `let`
	    // Both are experimental and not in the specification yet.
	    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
	    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
	    function parseConstLetDeclaration(kind) {
	        var declarations;

	        delegate.markStart();

	        expectKeyword(kind);

	        declarations = parseVariableDeclarationList(kind);

	        consumeSemicolon();

	        return delegate.markEnd(delegate.createVariableDeclaration(declarations, kind));
	    }

	    // 12.3 Empty Statement

	    function parseEmptyStatement() {
	        expect(';');
	        return delegate.createEmptyStatement();
	    }

	    // 12.4 Expression Statement

	    function parseExpressionStatement() {
	        var expr = parseExpression();
	        consumeSemicolon();
	        return delegate.createExpressionStatement(expr);
	    }

	    // 12.5 If statement

	    function parseIfStatement() {
	        var test, consequent, alternate;

	        expectKeyword('if');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        consequent = parseStatement();

	        if (matchKeyword('else')) {
	            lex();
	            alternate = parseStatement();
	        } else {
	            alternate = null;
	        }

	        return delegate.createIfStatement(test, consequent, alternate);
	    }

	    // 12.6 Iteration Statements

	    function parseDoWhileStatement() {
	        var body, test, oldInIteration;

	        expectKeyword('do');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        if (match(';')) {
	            lex();
	        }

	        return delegate.createDoWhileStatement(body, test);
	    }

	    function parseWhileStatement() {
	        var test, body, oldInIteration;

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        return delegate.createWhileStatement(test, body);
	    }

	    function parseForVariableDeclaration() {
	        var token, declarations;

	        delegate.markStart();
	        token = lex();
	        declarations = parseVariableDeclarationList();

	        return delegate.markEnd(delegate.createVariableDeclaration(declarations, token.value));
	    }

	    function parseForStatement() {
	        var init, test, update, left, right, body, oldInIteration;

	        init = test = update = null;

	        expectKeyword('for');

	        expect('(');

	        if (match(';')) {
	            lex();
	        } else {
	            if (matchKeyword('var') || matchKeyword('let')) {
	                state.allowIn = false;
	                init = parseForVariableDeclaration();
	                state.allowIn = true;

	                if (init.declarations.length === 1 && matchKeyword('in')) {
	                    lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                }
	            } else {
	                state.allowIn = false;
	                init = parseExpression();
	                state.allowIn = true;

	                if (matchKeyword('in')) {
	                    // LeftHandSideExpression
	                    if (!isLeftHandSide(init)) {
	                        throwErrorTolerant({}, Messages.InvalidLHSInForIn);
	                    }

	                    lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                }
	            }

	            if (typeof left === 'undefined') {
	                expect(';');
	            }
	        }

	        if (typeof left === 'undefined') {

	            if (!match(';')) {
	                test = parseExpression();
	            }
	            expect(';');

	            if (!match(')')) {
	                update = parseExpression();
	            }
	        }

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        return (typeof left === 'undefined') ?
	                delegate.createForStatement(init, test, update, body) :
	                delegate.createForInStatement(left, right, body);
	    }

	    // 12.7 The continue statement

	    function parseContinueStatement() {
	        var label = null, key;

	        expectKeyword('continue');

	        // Optimize the most common form: 'continue;'.
	        if (source.charCodeAt(index) === 0x3B) {
	            lex();

	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return delegate.createContinueStatement(null);
	        }

	        if (peekLineTerminator()) {
	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return delegate.createContinueStatement(null);
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !state.inIteration) {
	            throwError({}, Messages.IllegalContinue);
	        }

	        return delegate.createContinueStatement(label);
	    }

	    // 12.8 The break statement

	    function parseBreakStatement() {
	        var label = null, key;

	        expectKeyword('break');

	        // Catch the very common case first: immediately a semicolon (U+003B).
	        if (source.charCodeAt(index) === 0x3B) {
	            lex();

	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return delegate.createBreakStatement(null);
	        }

	        if (peekLineTerminator()) {
	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return delegate.createBreakStatement(null);
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !(state.inIteration || state.inSwitch)) {
	            throwError({}, Messages.IllegalBreak);
	        }

	        return delegate.createBreakStatement(label);
	    }

	    // 12.9 The return statement

	    function parseReturnStatement() {
	        var argument = null;

	        expectKeyword('return');

	        if (!state.inFunctionBody) {
	            throwErrorTolerant({}, Messages.IllegalReturn);
	        }

	        // 'return' followed by a space and an identifier is very common.
	        if (source.charCodeAt(index) === 0x20) {
	            if (isIdentifierStart(source.charCodeAt(index + 1))) {
	                argument = parseExpression();
	                consumeSemicolon();
	                return delegate.createReturnStatement(argument);
	            }
	        }

	        if (peekLineTerminator()) {
	            return delegate.createReturnStatement(null);
	        }

	        if (!match(';')) {
	            if (!match('}') && lookahead.type !== Token.EOF) {
	                argument = parseExpression();
	            }
	        }

	        consumeSemicolon();

	        return delegate.createReturnStatement(argument);
	    }

	    // 12.10 The with statement

	    function parseWithStatement() {
	        var object, body;

	        if (strict) {
	            throwErrorTolerant({}, Messages.StrictModeWith);
	        }

	        expectKeyword('with');

	        expect('(');

	        object = parseExpression();

	        expect(')');

	        body = parseStatement();

	        return delegate.createWithStatement(object, body);
	    }

	    // 12.10 The swith statement

	    function parseSwitchCase() {
	        var test,
	            consequent = [],
	            statement;

	        delegate.markStart();
	        if (matchKeyword('default')) {
	            lex();
	            test = null;
	        } else {
	            expectKeyword('case');
	            test = parseExpression();
	        }
	        expect(':');

	        while (index < length) {
	            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
	                break;
	            }
	            statement = parseStatement();
	            consequent.push(statement);
	        }

	        return delegate.markEnd(delegate.createSwitchCase(test, consequent));
	    }

	    function parseSwitchStatement() {
	        var discriminant, cases, clause, oldInSwitch, defaultFound;

	        expectKeyword('switch');

	        expect('(');

	        discriminant = parseExpression();

	        expect(')');

	        expect('{');

	        cases = [];

	        if (match('}')) {
	            lex();
	            return delegate.createSwitchStatement(discriminant, cases);
	        }

	        oldInSwitch = state.inSwitch;
	        state.inSwitch = true;
	        defaultFound = false;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            clause = parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    throwError({}, Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }

	        state.inSwitch = oldInSwitch;

	        expect('}');

	        return delegate.createSwitchStatement(discriminant, cases);
	    }

	    // 12.13 The throw statement

	    function parseThrowStatement() {
	        var argument;

	        expectKeyword('throw');

	        if (peekLineTerminator()) {
	            throwError({}, Messages.NewlineAfterThrow);
	        }

	        argument = parseExpression();

	        consumeSemicolon();

	        return delegate.createThrowStatement(argument);
	    }

	    // 12.14 The try statement

	    function parseCatchClause() {
	        var param, body;

	        delegate.markStart();
	        expectKeyword('catch');

	        expect('(');
	        if (match(')')) {
	            throwUnexpected(lookahead);
	        }

	        param = parseVariableIdentifier();
	        // 12.14.1
	        if (strict && isRestrictedWord(param.name)) {
	            throwErrorTolerant({}, Messages.StrictCatchVariable);
	        }

	        expect(')');
	        body = parseBlock();
	        return delegate.markEnd(delegate.createCatchClause(param, body));
	    }

	    function parseTryStatement() {
	        var block, handlers = [], finalizer = null;

	        expectKeyword('try');

	        block = parseBlock();

	        if (matchKeyword('catch')) {
	            handlers.push(parseCatchClause());
	        }

	        if (matchKeyword('finally')) {
	            lex();
	            finalizer = parseBlock();
	        }

	        if (handlers.length === 0 && !finalizer) {
	            throwError({}, Messages.NoCatchOrFinally);
	        }

	        return delegate.createTryStatement(block, [], handlers, finalizer);
	    }

	    // 12.15 The debugger statement

	    function parseDebuggerStatement() {
	        expectKeyword('debugger');

	        consumeSemicolon();

	        return delegate.createDebuggerStatement();
	    }

	    // 12 Statements

	    function parseStatement() {
	        var type = lookahead.type,
	            expr,
	            labeledBody,
	            key;

	        if (type === Token.EOF) {
	            throwUnexpected(lookahead);
	        }

	        delegate.markStart();

	        if (type === Token.Punctuator) {
	            switch (lookahead.value) {
	            case ';':
	                return delegate.markEnd(parseEmptyStatement());
	            case '{':
	                return delegate.markEnd(parseBlock());
	            case '(':
	                return delegate.markEnd(parseExpressionStatement());
	            default:
	                break;
	            }
	        }

	        if (type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'break':
	                return delegate.markEnd(parseBreakStatement());
	            case 'continue':
	                return delegate.markEnd(parseContinueStatement());
	            case 'debugger':
	                return delegate.markEnd(parseDebuggerStatement());
	            case 'do':
	                return delegate.markEnd(parseDoWhileStatement());
	            case 'for':
	                return delegate.markEnd(parseForStatement());
	            case 'function':
	                return delegate.markEnd(parseFunctionDeclaration());
	            case 'if':
	                return delegate.markEnd(parseIfStatement());
	            case 'return':
	                return delegate.markEnd(parseReturnStatement());
	            case 'switch':
	                return delegate.markEnd(parseSwitchStatement());
	            case 'throw':
	                return delegate.markEnd(parseThrowStatement());
	            case 'try':
	                return delegate.markEnd(parseTryStatement());
	            case 'var':
	                return delegate.markEnd(parseVariableStatement());
	            case 'while':
	                return delegate.markEnd(parseWhileStatement());
	            case 'with':
	                return delegate.markEnd(parseWithStatement());
	            default:
	                break;
	            }
	        }

	        expr = parseExpression();

	        // 12.12 Labelled Statements
	        if ((expr.type === Syntax.Identifier) && match(':')) {
	            lex();

	            key = '$' + expr.name;
	            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.Redeclaration, 'Label', expr.name);
	            }

	            state.labelSet[key] = true;
	            labeledBody = parseStatement();
	            delete state.labelSet[key];
	            return delegate.markEnd(delegate.createLabeledStatement(expr, labeledBody));
	        }

	        consumeSemicolon();

	        return delegate.markEnd(delegate.createExpressionStatement(expr));
	    }

	    // 13 Function Definition

	    function parseFunctionSourceElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted,
	            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody;

	        delegate.markStart();
	        expect('{');

	        while (index < length) {
	            if (lookahead.type !== Token.StringLiteral) {
	                break;
	            }
	            token = lookahead;

	            sourceElement = parseSourceElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        oldLabelSet = state.labelSet;
	        oldInIteration = state.inIteration;
	        oldInSwitch = state.inSwitch;
	        oldInFunctionBody = state.inFunctionBody;

	        state.labelSet = {};
	        state.inIteration = false;
	        state.inSwitch = false;
	        state.inFunctionBody = true;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }

	        expect('}');

	        state.labelSet = oldLabelSet;
	        state.inIteration = oldInIteration;
	        state.inSwitch = oldInSwitch;
	        state.inFunctionBody = oldInFunctionBody;

	        return delegate.markEnd(delegate.createBlockStatement(sourceElements));
	    }

	    function parseParams(firstRestricted) {
	        var param, params = [], token, stricted, paramSet, key, message;
	        expect('(');

	        if (!match(')')) {
	            paramSet = {};
	            while (index < length) {
	                token = lookahead;
	                param = parseVariableIdentifier();
	                key = '$' + token.value;
	                if (strict) {
	                    if (isRestrictedWord(token.value)) {
	                        stricted = token;
	                        message = Messages.StrictParamName;
	                    }
	                    if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
	                        stricted = token;
	                        message = Messages.StrictParamDupe;
	                    }
	                } else if (!firstRestricted) {
	                    if (isRestrictedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictParamName;
	                    } else if (isStrictModeReservedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictReservedWord;
	                    } else if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
	                        firstRestricted = token;
	                        message = Messages.StrictParamDupe;
	                    }
	                }
	                params.push(param);
	                paramSet[key] = true;
	                if (match(')')) {
	                    break;
	                }
	                expect(',');
	            }
	        }

	        expect(')');

	        return {
	            params: params,
	            stricted: stricted,
	            firstRestricted: firstRestricted,
	            message: message
	        };
	    }

	    function parseFunctionDeclaration() {
	        var id, params = [], body, token, stricted, tmp, firstRestricted, message, previousStrict;

	        delegate.markStart();

	        expectKeyword('function');
	        token = lookahead;
	        id = parseVariableIdentifier();
	        if (strict) {
	            if (isRestrictedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictFunctionName);
	            }
	        } else {
	            if (isRestrictedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictFunctionName;
	            } else if (isStrictModeReservedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictReservedWord;
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        params = tmp.params;
	        stricted = tmp.stricted;
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        body = parseFunctionSourceElements();
	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && stricted) {
	            throwErrorTolerant(stricted, message);
	        }
	        strict = previousStrict;

	        return delegate.markEnd(delegate.createFunctionDeclaration(id, params, [], body));
	    }

	    function parseFunctionExpression() {
	        var token, id = null, stricted, firstRestricted, message, tmp, params = [], body, previousStrict;

	        delegate.markStart();
	        expectKeyword('function');

	        if (!match('(')) {
	            token = lookahead;
	            id = parseVariableIdentifier();
	            if (strict) {
	                if (isRestrictedWord(token.value)) {
	                    throwErrorTolerant(token, Messages.StrictFunctionName);
	                }
	            } else {
	                if (isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictFunctionName;
	                } else if (isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictReservedWord;
	                }
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        params = tmp.params;
	        stricted = tmp.stricted;
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        body = parseFunctionSourceElements();
	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && stricted) {
	            throwErrorTolerant(stricted, message);
	        }
	        strict = previousStrict;

	        return delegate.markEnd(delegate.createFunctionExpression(id, params, [], body));
	    }

	    // 14 Program

	    function parseSourceElement() {
	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'const':
	            case 'let':
	                return parseConstLetDeclaration(lookahead.value);
	            case 'function':
	                return parseFunctionDeclaration();
	            default:
	                return parseStatement();
	            }
	        }

	        if (lookahead.type !== Token.EOF) {
	            return parseStatement();
	        }
	    }

	    function parseSourceElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted;

	        while (index < length) {
	            token = lookahead;
	            if (token.type !== Token.StringLiteral) {
	                break;
	            }

	            sourceElement = parseSourceElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        while (index < length) {
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }
	        return sourceElements;
	    }

	    function parseProgram() {
	        var body;

	        delegate.markStart();
	        strict = false;
	        peek();
	        body = parseSourceElements();
	        return delegate.markEnd(delegate.createProgram(body));
	    }

	    function attachComments() {
	        var i, attacher, comment, leading, trailing;

	        for (i = 0; i < extra.pendingComments.length; ++i) {
	            attacher = extra.pendingComments[i];
	            comment = attacher.comment;
	            leading = attacher.leading;
	            if (leading) {
	                if (typeof leading.leadingComments === 'undefined') {
	                    leading.leadingComments = [];
	                }
	                leading.leadingComments.push(attacher.comment);
	            }
	            trailing = attacher.trailing;
	            if (trailing) {
	                if (typeof trailing.trailingComments === 'undefined') {
	                    trailing.trailingComments = [];
	                }
	                trailing.trailingComments.push(attacher.comment);
	            }
	        }
	        extra.pendingComments = [];
	    }

	    function filterTokenLocation() {
	        var i, entry, token, tokens = [];

	        for (i = 0; i < extra.tokens.length; ++i) {
	            entry = extra.tokens[i];
	            token = {
	                type: entry.type,
	                value: entry.value
	            };
	            if (extra.range) {
	                token.range = entry.range;
	            }
	            if (extra.loc) {
	                token.loc = entry.loc;
	            }
	            tokens.push(token);
	        }

	        extra.tokens = tokens;
	    }

	    function LocationMarker() {
	        this.startIndex = index;
	        this.startLine = lineNumber;
	        this.startColumn = index - lineStart;
	    }

	    LocationMarker.prototype = {
	        constructor: LocationMarker,

	        apply: function (node) {
	            if (extra.range) {
	                node.range = [this.startIndex, index];
	            }
	            if (extra.loc) {
	                node.loc = {
	                    start: {
	                        line: this.startLine,
	                        column: this.startColumn
	                    },
	                    end: {
	                        line: lineNumber,
	                        column: index - lineStart
	                    }
	                };
	                node = delegate.postProcess(node);
	            }
	            if (extra.attachComment) {
	                delegate.processComment(node);
	            }
	        }
	    };

	    function createLocationMarker() {
	        if (!extra.loc && !extra.range) {
	            return null;
	        }

	        skipComment();

	        return new LocationMarker();
	    }

	    function tokenize(code, options) {
	        var toString,
	            token,
	            tokens;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowIn: true,
	            labelSet: {},
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1
	        };

	        extra = {};

	        // Options matching.
	        options = options || {};

	        // Of course we collect tokens here.
	        options.tokens = true;
	        extra.tokens = [];
	        extra.tokenize = true;
	        // The following two fields are necessary to compute the Regex tokens.
	        extra.openParenToken = -1;
	        extra.openCurlyToken = -1;

	        extra.range = (typeof options.range === 'boolean') && options.range;
	        extra.loc = (typeof options.loc === 'boolean') && options.loc;

	        if (typeof options.comment === 'boolean' && options.comment) {
	            extra.comments = [];
	        }
	        if (typeof options.tolerant === 'boolean' && options.tolerant) {
	            extra.errors = [];
	        }

	        if (length > 0) {
	            if (typeof source[0] === 'undefined') {
	                // Try first to convert to a string. This is good as fast path
	                // for old IE which understands string indexing for string
	                // literals only and not for string object.
	                if (code instanceof String) {
	                    source = code.valueOf();
	                }
	            }
	        }

	        try {
	            peek();
	            if (lookahead.type === Token.EOF) {
	                return extra.tokens;
	            }

	            token = lex();
	            while (lookahead.type !== Token.EOF) {
	                try {
	                    token = lex();
	                } catch (lexError) {
	                    token = lookahead;
	                    if (extra.errors) {
	                        extra.errors.push(lexError);
	                        // We have to break on the first error
	                        // to avoid infinite loops.
	                        break;
	                    } else {
	                        throw lexError;
	                    }
	                }
	            }

	            filterTokenLocation();
	            tokens = extra.tokens;
	            if (typeof extra.comments !== 'undefined') {
	                tokens.comments = extra.comments;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                tokens.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            extra = {};
	        }
	        return tokens;
	    }

	    function parse(code, options) {
	        var program, toString;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowIn: true,
	            labelSet: {},
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1,
	            markerStack: []
	        };

	        extra = {};
	        if (typeof options !== 'undefined') {
	            extra.range = (typeof options.range === 'boolean') && options.range;
	            extra.loc = (typeof options.loc === 'boolean') && options.loc;
	            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

	            if (extra.loc && options.source !== null && options.source !== undefined) {
	                extra.source = toString(options.source);
	            }

	            if (typeof options.tokens === 'boolean' && options.tokens) {
	                extra.tokens = [];
	            }
	            if (typeof options.comment === 'boolean' && options.comment) {
	                extra.comments = [];
	            }
	            if (typeof options.tolerant === 'boolean' && options.tolerant) {
	                extra.errors = [];
	            }
	            if (extra.attachComment) {
	                extra.range = true;
	                extra.pendingComments = [];
	                extra.comments = [];
	            }
	        }

	        if (length > 0) {
	            if (typeof source[0] === 'undefined') {
	                // Try first to convert to a string. This is good as fast path
	                // for old IE which understands string indexing for string
	                // literals only and not for string object.
	                if (code instanceof String) {
	                    source = code.valueOf();
	                }
	            }
	        }

	        try {
	            program = parseProgram();
	            if (typeof extra.comments !== 'undefined') {
	                program.comments = extra.comments;
	            }
	            if (typeof extra.tokens !== 'undefined') {
	                filterTokenLocation();
	                program.tokens = extra.tokens;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                program.errors = extra.errors;
	            }
	            if (extra.attachComment) {
	                attachComments();
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            extra = {};
	        }

	        return program;
	    }

	    // Sync with *.json manifests.
	    exports.version = '1.1.1';

	    exports.tokenize = tokenize;

	    exports.parse = parse;

	    // Deep copy.
	    exports.Syntax = (function () {
	        var name, types = {};

	        if (typeof Object.create === 'function') {
	            types = Object.create(null);
	        }

	        for (name in Syntax) {
	            if (Syntax.hasOwnProperty(name)) {
	                types[name] = Syntax[name];
	            }
	        }

	        if (typeof Object.freeze === 'function') {
	            Object.freeze(types);
	        }

	        return types;
	    }());

	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Introduces a typal object to make classical/prototypal patterns easier
	 * Plus some AOP sugar
	 *
	 * By Zachary Carter <zach@carter.name>
	 * MIT Licensed
	 * */

	var typal = (function () {

	var create = Object.create || function (o) { function F(){} F.prototype = o; return new F(); };
	var position = /^(before|after)/;

	// basic method layering
	// always returns original method's return value
	function layerMethod(k, fun) {
	    var pos = k.match(position)[0],
	        key = k.replace(position, ''),
	        prop = this[key];

	    if (pos === 'after') {
	        this[key] = function () {
	            var ret = prop.apply(this, arguments);
	            var args = [].slice.call(arguments);
	            args.splice(0, 0, ret);
	            fun.apply(this, args);
	            return ret;
	        };
	    } else if (pos === 'before') {
	        this[key] = function () {
	            fun.apply(this, arguments);
	            var ret = prop.apply(this, arguments);
	            return ret;
	        };
	    }
	}

	// mixes each argument's own properties into calling object,
	// overwriting them or layering them. i.e. an object method 'meth' is
	// layered by mixin methods 'beforemeth' or 'aftermeth'
	function typal_mix() {
	    var self = this;
	    for(var i=0,o,k; i<arguments.length; i++) {
	        o=arguments[i];
	        if (!o) continue;
	        if (Object.prototype.hasOwnProperty.call(o,'constructor'))
	            this.constructor = o.constructor;
	        if (Object.prototype.hasOwnProperty.call(o,'toString'))
	            this.toString = o.toString;
	        for(k in o) {
	            if (Object.prototype.hasOwnProperty.call(o, k)) {
	                if(k.match(position) && typeof this[k.replace(position, '')] === 'function')
	                    layerMethod.call(this, k, o[k]);
	                else
	                    this[k] = o[k];
	            }
	        }
	    }
	    return this;
	}

	return {
	    // extend object with own typalperties of each argument
	    mix: typal_mix,

	    // sugar for object begetting and mixing
	    // - Object.create(typal).mix(etc, etc);
	    // + typal.beget(etc, etc);
	    beget: function typal_beget() {
	        return arguments.length ? typal_mix.apply(create(this), arguments) : create(this);
	    },

	    // Creates a new Class function based on an object with a constructor method
	    construct: function typal_construct() {
	        var o = typal_mix.apply(create(this), arguments);
	        var constructor = o.constructor;
	        var Klass = o.constructor = function () { return constructor.apply(this, arguments); };
	        Klass.prototype = o;
	        Klass.mix = typal_mix; // allow for easy singleton property extension
	        return Klass;
	    },

	    // no op
	    constructor: function typal_constructor() { return this; }
	};

	})();

	if (true)
	    exports.typal = typal;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// Set class to wrap arrays

	var typal = __webpack_require__(32).typal;

	var setMixin = {
	    constructor: function Set_constructor (set, raw) {
	        this._items = [];
	        if (set && set.constructor === Array)
	            this._items = raw ? set: set.slice(0);
	        else if(arguments.length)
	            this._items = [].slice.call(arguments,0);
	    },
	    concat: function concat (setB) {
	        this._items.push.apply(this._items, setB._items || setB); 
	        return this;
	    },
	    eq: function eq (set) {
	        return this._items.length === set._items.length && this.subset(set); 
	    },
	    indexOf: function indexOf (item) {
	        if(item && item.eq) {
	            for(var k=0; k<this._items.length;k++)
	                if(item.eq(this._items[k]))
	                    return k;
	            return -1;
	        }
	        return this._items.indexOf(item);
	    },
	    union: function union (set) {
	        return (new Set(this._items)).concat(this.complement(set));
	    },
	    intersection: function intersection (set) {
	    return this.filter(function (elm) {
	            return set.contains(elm);
	        });
	    },
	    complement: function complement (set) {
	        var that = this;
	        return set.filter(function sub_complement (elm) {
	            return !that.contains(elm);
	        });
	    },
	    subset: function subset (set) {
	        var cont = true;
	        for (var i=0; i<this._items.length && cont;i++) {
	            cont = cont && set.contains(this._items[i]);
	        }
	        return cont;
	    },
	    superset: function superset (set) {
	        return set.subset(this);
	    },
	    joinSet: function joinSet (set) {
	        return this.concat(this.complement(set));
	    },
	    contains: function contains (item) { return this.indexOf(item) !== -1; },
	    item: function item (v, val) { return this._items[v]; },
	    i: function i (v, val) { return this._items[v]; },
	    first: function first () { return this._items[0]; },
	    last: function last () { return this._items[this._items.length-1]; },
	    size: function size () { return this._items.length; },
	    isEmpty: function isEmpty () { return this._items.length === 0; },
	    copy: function copy () { return new Set(this._items); },
	    toString: function toString () { return this._items.toString(); }
	};

	"push shift unshift forEach some every join sort".split(' ').forEach(function (e,i) {
	    setMixin[e] = function () { return Array.prototype[e].apply(this._items, arguments); };
	    setMixin[e].name = e;
	});
	"filter slice map".split(' ').forEach(function (e,i) {
	    setMixin[e] = function () { return new Set(Array.prototype[e].apply(this._items, arguments), true); };
	    setMixin[e].name = e;
	});

	var Set = typal.construct(setMixin).mix({
	    union: function (a, b) {
	        var ar = {};
	        for (var k=a.length-1;k >=0;--k) {
	            ar[a[k]] = true;
	        }
	        for (var i=b.length-1;i >= 0;--i) {
	            if (!ar[b[i]]) {
	                a.push(b[i]);
	            }
	        }
	        return a;
	    }
	});

	if (true)
	    exports.Set = Set;



/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// Basic Lexer implemented using JavaScript regular expressions
	// MIT Licensed

	"use strict";

	var lexParser = __webpack_require__(35);
	var version = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./package.json\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).version;

	// expand macros and convert matchers to RegExp's
	function prepareRules(rules, macros, actions, tokens, startConditions, caseless) {
	    var m,i,k,action,conditions,
	        newRules = [];

	    if (macros) {
	        macros = prepareMacros(macros);
	    }

	    function tokenNumberReplacement (str, token) {
	        return "return " + (tokens[token] || "'" + token + "'");
	    }

	    actions.push('switch($avoiding_name_collisions) {');

	    for (i=0;i < rules.length; i++) {
	        if (Object.prototype.toString.apply(rules[i][0]) !== '[object Array]') {
	            // implicit add to all inclusive start conditions
	            for (k in startConditions) {
	                if (startConditions[k].inclusive) {
	                    startConditions[k].rules.push(i);
	                }
	            }
	        } else if (rules[i][0][0] === '*') {
	            // Add to ALL start conditions
	            for (k in startConditions) {
	                startConditions[k].rules.push(i);
	            }
	            rules[i].shift();
	        } else {
	            // Add to explicit start conditions
	            conditions = rules[i].shift();
	            for (k=0;k<conditions.length;k++) {
	                startConditions[conditions[k]].rules.push(i);
	            }
	        }

	        m = rules[i][0];
	        if (typeof m === 'string') {
	            for (k in macros) {
	                if (macros.hasOwnProperty(k)) {
	                    m = m.split("{" + k + "}").join('(' + macros[k] + ')');
	                }
	            }
	            m = new RegExp("^(?:" + m + ")", caseless ? 'i':'');
	        }
	        newRules.push(m);
	        if (typeof rules[i][1] === 'function') {
	            rules[i][1] = String(rules[i][1]).replace(/^\s*function \(\)\s?\{/, '').replace(/\}\s*$/, '');
	        }
	        action = rules[i][1];
	        if (tokens && action.match(/return '[^']+'/)) {
	            action = action.replace(/return '([^']+)'/g, tokenNumberReplacement);
	        }
	        actions.push('case ' + i + ':' + action + '\nbreak;');
	    }
	    actions.push("}");

	    return newRules;
	}

	// expand macros within macros
	function prepareMacros (macros) {
	    var cont = true,
	        m,i,k,mnew;
	    while (cont) {
	        cont = false;
	        for (i in macros) if (macros.hasOwnProperty(i)) {
	            m = macros[i];
	            for (k in macros) if (macros.hasOwnProperty(k) && i !== k) {
	                mnew = m.split("{" + k + "}").join('(' + macros[k] + ')');
	                if (mnew !== m) {
	                    cont = true;
	                    macros[i] = mnew;
	                }
	            }
	        }
	    }
	    return macros;
	}

	function prepareStartConditions (conditions) {
	    var sc,
	        hash = {};
	    for (sc in conditions) if (conditions.hasOwnProperty(sc)) {
	        hash[sc] = {rules:[],inclusive:!!!conditions[sc]};
	    }
	    return hash;
	}

	function buildActions (dict, tokens) {
	    var actions = [dict.actionInclude || '', "var YYSTATE=YY_START;"];
	    var tok;
	    var toks = {};

	    for (tok in tokens) {
	        toks[tokens[tok]] = tok;
	    }

	    if (dict.options && dict.options.flex) {
	        dict.rules.push([".", "console.log(yytext);"]);
	    }

	    this.rules = prepareRules(dict.rules, dict.macros, actions, tokens && toks, this.conditions, this.options["case-insensitive"]);
	    var fun = actions.join("\n");
	    "yytext yyleng yylineno yylloc".split(' ').forEach(function (yy) {
	        fun = fun.replace(new RegExp("\\b(" + yy + ")\\b", "g"), "yy_.$1");
	    });

	    return "function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {" + fun + "\n}";
	}

	function RegExpLexer (dict, input, tokens) {
	    var opts = processGrammar(dict, tokens);
	    var source = generateModuleBody(opts);
	    var lexer = eval(source);

	    lexer.yy = {};
	    if (input) {
	        lexer.setInput(input);
	    }

	    lexer.generate = function () { return generateFromOpts(opts); };
	    lexer.generateModule = function () { return generateModule(opts); };
	    lexer.generateCommonJSModule = function () { return generateCommonJSModule(opts); };
	    lexer.generateAMDModule = function () { return generateAMDModule(opts); };

	    return lexer;
	}

	RegExpLexer.prototype = {
	    EOF: 1,
	    parseError: function parseError(str, hash) {
	        if (this.yy.parser) {
	            this.yy.parser.parseError(str, hash);
	        } else {
	            throw new Error(str);
	        }
	    },

	    // resets the lexer, sets new input
	    setInput: function (input, yy) {
	        this.yy = yy || this.yy || {};
	        this._input = input;
	        this._more = this._backtrack = this.done = false;
	        this.yylineno = this.yyleng = 0;
	        this.yytext = this.matched = this.match = '';
	        this.conditionStack = ['INITIAL'];
	        this.yylloc = {
	            first_line: 1,
	            first_column: 0,
	            last_line: 1,
	            last_column: 0
	        };
	        if (this.options.ranges) {
	            this.yylloc.range = [0,0];
	        }
	        this.offset = 0;
	        return this;
	    },

	    // consumes and returns one char from the input
	    input: function () {
	        var ch = this._input[0];
	        this.yytext += ch;
	        this.yyleng++;
	        this.offset++;
	        this.match += ch;
	        this.matched += ch;
	        var lines = ch.match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno++;
	            this.yylloc.last_line++;
	        } else {
	            this.yylloc.last_column++;
	        }
	        if (this.options.ranges) {
	            this.yylloc.range[1]++;
	        }

	        this._input = this._input.slice(1);
	        return ch;
	    },

	    // unshifts one char (or a string) into the input
	    unput: function (ch) {
	        var len = ch.length;
	        var lines = ch.split(/(?:\r\n?|\n)/g);

	        this._input = ch + this._input;
	        this.yytext = this.yytext.substr(0, this.yytext.length - len);
	        //this.yyleng -= len;
	        this.offset -= len;
	        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	        this.match = this.match.substr(0, this.match.length - 1);
	        this.matched = this.matched.substr(0, this.matched.length - 1);

	        if (lines.length - 1) {
	            this.yylineno -= lines.length - 1;
	        }
	        var r = this.yylloc.range;

	        this.yylloc = {
	            first_line: this.yylloc.first_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.first_column,
	            last_column: lines ?
	                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
	                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
	              this.yylloc.first_column - len
	        };

	        if (this.options.ranges) {
	            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	        }
	        this.yyleng = this.yytext.length;
	        return this;
	    },

	    // When called from action, caches matched text and appends it on next action
	    more: function () {
	        this._more = true;
	        return this;
	    },

	    // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	    reject: function () {
	        if (this.options.backtrack_lexer) {
	            this._backtrack = true;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });

	        }
	        return this;
	    },

	    // retain first n characters of the match
	    less: function (n) {
	        this.unput(this.match.slice(n));
	    },

	    // displays already matched input, i.e. for error messages
	    pastInput: function () {
	        var past = this.matched.substr(0, this.matched.length - this.match.length);
	        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
	    },

	    // displays upcoming input, i.e. for error messages
	    upcomingInput: function () {
	        var next = this.match;
	        if (next.length < 20) {
	            next += this._input.substr(0, 20-next.length);
	        }
	        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	    },

	    // displays the character position where the lexing error occurred, i.e. for error messages
	    showPosition: function () {
	        var pre = this.pastInput();
	        var c = new Array(pre.length + 1).join("-");
	        return pre + this.upcomingInput() + "\n" + c + "^";
	    },

	    // test the lexed token: return FALSE when not a match, otherwise return token
	    test_match: function(match, indexed_rule) {
	        var token,
	            lines,
	            backup;

	        if (this.options.backtrack_lexer) {
	            // save context
	            backup = {
	                yylineno: this.yylineno,
	                yylloc: {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.last_line,
	                    first_column: this.yylloc.first_column,
	                    last_column: this.yylloc.last_column
	                },
	                yytext: this.yytext,
	                match: this.match,
	                matches: this.matches,
	                matched: this.matched,
	                yyleng: this.yyleng,
	                offset: this.offset,
	                _more: this._more,
	                _input: this._input,
	                yy: this.yy,
	                conditionStack: this.conditionStack.slice(0),
	                done: this.done
	            };
	            if (this.options.ranges) {
	                backup.yylloc.range = this.yylloc.range.slice(0);
	            }
	        }

	        lines = match[0].match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno += lines.length;
	        }
	        this.yylloc = {
	            first_line: this.yylloc.last_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.last_column,
	            last_column: lines ?
	                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
	                         this.yylloc.last_column + match[0].length
	        };
	        this.yytext += match[0];
	        this.match += match[0];
	        this.matches = match;
	        this.yyleng = this.yytext.length;
	        if (this.options.ranges) {
	            this.yylloc.range = [this.offset, this.offset += this.yyleng];
	        }
	        this._more = false;
	        this._backtrack = false;
	        this._input = this._input.slice(match[0].length);
	        this.matched += match[0];
	        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	        if (this.done && this._input) {
	            this.done = false;
	        }
	        if (token) {
	            return token;
	        } else if (this._backtrack) {
	            // recover context
	            for (var k in backup) {
	                this[k] = backup[k];
	            }
	            return false; // rule action called reject() implying the next rule should be tested instead.
	        }
	        return false;
	    },

	    // return next match in input
	    next: function () {
	        if (this.done) {
	            return this.EOF;
	        }
	        if (!this._input) {
	            this.done = true;
	        }

	        var token,
	            match,
	            tempMatch,
	            index;
	        if (!this._more) {
	            this.yytext = '';
	            this.match = '';
	        }
	        var rules = this._currentRules();
	        for (var i = 0; i < rules.length; i++) {
	            tempMatch = this._input.match(this.rules[rules[i]]);
	            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                match = tempMatch;
	                index = i;
	                if (this.options.backtrack_lexer) {
	                    token = this.test_match(tempMatch, rules[i]);
	                    if (token !== false) {
	                        return token;
	                    } else if (this._backtrack) {
	                        match = false;
	                        continue; // rule action called reject() implying a rule MISmatch.
	                    } else {
	                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                        return false;
	                    }
	                } else if (!this.options.flex) {
	                    break;
	                }
	            }
	        }
	        if (match) {
	            token = this.test_match(match, rules[index]);
	            if (token !== false) {
	                return token;
	            }
	            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	            return false;
	        }
	        if (this._input === "") {
	            return this.EOF;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	        }
	    },

	    // return next match that has a token
	    lex: function lex () {
	        var r = this.next();
	        if (r) {
	            return r;
	        } else {
	            return this.lex();
	        }
	    },

	    // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	    begin: function begin (condition) {
	        this.conditionStack.push(condition);
	    },

	    // pop the previously active lexer condition state off the condition stack
	    popState: function popState () {
	        var n = this.conditionStack.length - 1;
	        if (n > 0) {
	            return this.conditionStack.pop();
	        } else {
	            return this.conditionStack[0];
	        }
	    },

	    // produce the lexer rule set which is active for the currently active lexer condition state
	    _currentRules: function _currentRules () {
	        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	        } else {
	            return this.conditions["INITIAL"].rules;
	        }
	    },

	    // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	    topState: function topState (n) {
	        n = this.conditionStack.length - 1 - Math.abs(n || 0);
	        if (n >= 0) {
	            return this.conditionStack[n];
	        } else {
	            return "INITIAL";
	        }
	    },

	    // alias for begin(condition)
	    pushState: function pushState (condition) {
	        this.begin(condition);
	    },

	    // return the number of states pushed
	    stateStackSize: function stateStackSize() {
	        return this.conditionStack.length;
	    }
	};


	// generate lexer source from a grammar
	function generate (dict, tokens) {
	    var opt = processGrammar(dict, tokens);

	    return generateFromOpts(opt);
	}

	// process the grammar and build final data structures and functions
	function processGrammar(dict, tokens) {
	    var opts = {};
	    if (typeof dict === 'string') {
	        dict = lexParser.parse(dict);
	    }
	    dict = dict || {};

	    opts.options = dict.options || {};
	    opts.moduleType = opts.options.moduleType;
	    opts.moduleName = opts.options.moduleName;

	    opts.conditions = prepareStartConditions(dict.startConditions);
	    opts.conditions.INITIAL = {rules:[],inclusive:true};

	    opts.performAction = buildActions.call(opts, dict, tokens);
	    opts.conditionStack = ['INITIAL'];

	    opts.moduleInclude = (dict.moduleInclude || '').trim();
	    return opts;
	}

	// Assemble the final source from the processed grammar
	function generateFromOpts (opt) {
	    var code = "";

	    if (opt.moduleType === 'commonjs') {
	        code = generateCommonJSModule(opt);
	    } else if (opt.moduleType === 'amd') {
	        code = generateAMDModule(opt);
	    } else {
	        code = generateModule(opt);
	    }

	    return code;
	}

	function generateModuleBody (opt) {
	    var functionDescriptions = {
	        setInput: "resets the lexer, sets new input",
	        input: "consumes and returns one char from the input",
	        unput: "unshifts one char (or a string) into the input",
	        more: "When called from action, caches matched text and appends it on next action",
	        reject: "When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.",
	        less: "retain first n characters of the match",
	        pastInput: "displays already matched input, i.e. for error messages",
	        upcomingInput: "displays upcoming input, i.e. for error messages",
	        showPosition: "displays the character position where the lexing error occurred, i.e. for error messages",
	        test_match: "test the lexed token: return FALSE when not a match, otherwise return token",
	        next: "return next match in input",
	        lex: "return next match that has a token",
	        begin: "activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)",
	        popState: "pop the previously active lexer condition state off the condition stack",
	        _currentRules: "produce the lexer rule set which is active for the currently active lexer condition state",
	        topState: "return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available",
	        pushState: "alias for begin(condition)",
	        stateStackSize: "return the number of states currently on the stack"
	    };
	    var out = "({\n";
	    var p = [];
	    var descr;
	    for (var k in RegExpLexer.prototype) {
	        if (RegExpLexer.prototype.hasOwnProperty(k) && k.indexOf("generate") === -1) {
	            // copy the function description as a comment before the implementation; supports multi-line descriptions
	            descr = "\n";
	            if (functionDescriptions[k]) {
	                descr += "// " + functionDescriptions[k].replace(/\n/g, "\n\/\/ ") + "\n";
	            }
	            p.push(descr + k + ":" + (RegExpLexer.prototype[k].toString() || '""'));
	        }
	    }
	    out += p.join(",\n");

	    if (opt.options) {
	        out += ",\noptions: " + JSON.stringify(opt.options);
	    }

	    out += ",\nperformAction: " + String(opt.performAction);
	    out += ",\nrules: [" + opt.rules + "]";
	    out += ",\nconditions: " + JSON.stringify(opt.conditions);
	    out += "\n})";

	    return out;
	}

	function generateModule(opt) {
	    opt = opt || {};

	    var out = "/* generated by jison-lex " + version + " */";
	    var moduleName = opt.moduleName || "lexer";

	    out += "\nvar " + moduleName + " = (function(){\nvar lexer = "
	          + generateModuleBody(opt);

	    if (opt.moduleInclude) {
	        out += ";\n" + opt.moduleInclude;
	    }

	    out += ";\nreturn lexer;\n})();";

	    return out;
	}

	function generateAMDModule(opt) {
	    var out = "/* generated by jison-lex " + version + " */";

	    out += "define([], function(){\nvar lexer = "
	          + generateModuleBody(opt);

	    if (opt.moduleInclude) {
	        out += ";\n" + opt.moduleInclude;
	    }

	    out += ";\nreturn lexer;"
	         + "\n});";

	    return out;
	}

	function generateCommonJSModule(opt) {
	    opt = opt || {};

	    var out = "";
	    var moduleName = opt.moduleName || "lexer";

	    out += generateModule(opt);
	    out += "\nexports.lexer = " + moduleName;
	    out += ";\nexports.lex = function () { return " + moduleName + ".lex.apply(lexer, arguments); };";
	    return out;
	}

	RegExpLexer.generate = generate;

	module.exports = RegExpLexer;



/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.6 */
	/*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var lex = (function(){
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"lex":3,"definitions":4,"%%":5,"rules":6,"epilogue":7,"EOF":8,"CODE":9,"definition":10,"ACTION":11,"NAME":12,"regex":13,"START_INC":14,"names_inclusive":15,"START_EXC":16,"names_exclusive":17,"START_COND":18,"rule":19,"start_conditions":20,"action":21,"{":22,"action_body":23,"}":24,"action_comments_body":25,"ACTION_BODY":26,"<":27,"name_list":28,">":29,"*":30,",":31,"regex_list":32,"|":33,"regex_concat":34,"regex_base":35,"(":36,")":37,"SPECIAL_GROUP":38,"+":39,"?":40,"/":41,"/!":42,"name_expansion":43,"range_regex":44,"any_group_regex":45,".":46,"^":47,"$":48,"string":49,"escape_char":50,"NAME_BRACE":51,"ANY_GROUP_REGEX":52,"ESCAPE_CHAR":53,"RANGE_REGEX":54,"STRING_LIT":55,"CHARACTER_LIT":56,"$accept":0,"$end":1},
	terminals_: {2:"error",5:"%%",8:"EOF",9:"CODE",11:"ACTION",12:"NAME",14:"START_INC",16:"START_EXC",18:"START_COND",22:"{",24:"}",26:"ACTION_BODY",27:"<",29:">",30:"*",31:",",33:"|",36:"(",37:")",38:"SPECIAL_GROUP",39:"+",40:"?",41:"/",42:"/!",46:".",47:"^",48:"$",51:"NAME_BRACE",52:"ANY_GROUP_REGEX",53:"ESCAPE_CHAR",54:"RANGE_REGEX",55:"STRING_LIT",56:"CHARACTER_LIT"},
	productions_: [0,[3,4],[7,1],[7,2],[7,3],[4,2],[4,2],[4,0],[10,2],[10,2],[10,2],[15,1],[15,2],[17,1],[17,2],[6,2],[6,1],[19,3],[21,3],[21,1],[23,0],[23,1],[23,5],[23,4],[25,1],[25,2],[20,3],[20,3],[20,0],[28,1],[28,3],[13,1],[32,3],[32,2],[32,1],[32,0],[34,2],[34,1],[35,3],[35,3],[35,2],[35,2],[35,2],[35,2],[35,2],[35,1],[35,2],[35,1],[35,1],[35,1],[35,1],[35,1],[35,1],[43,1],[45,1],[50,1],[44,1],[49,1],[49,1]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */

	var $0 = $$.length - 1;
	switch (yystate) {
	case 1: 
	          this.$ = { rules: $$[$0-1] };
	          if ($$[$0-3][0]) this.$.macros = $$[$0-3][0];
	          if ($$[$0-3][1]) this.$.startConditions = $$[$0-3][1];
	          if ($$[$0]) this.$.moduleInclude = $$[$0];
	          if (yy.options) this.$.options = yy.options;
	          if (yy.actionInclude) this.$.actionInclude = yy.actionInclude;
	          delete yy.options;
	          delete yy.actionInclude;
	          return this.$; 
	        
	break;
	case 2: this.$ = null; 
	break;
	case 3: this.$ = null; 
	break;
	case 4: this.$ = $$[$0-1]; 
	break;
	case 5:
	          this.$ = $$[$0];
	          if ('length' in $$[$0-1]) {
	            this.$[0] = this.$[0] || {};
	            this.$[0][$$[$0-1][0]] = $$[$0-1][1];
	          } else {
	            this.$[1] = this.$[1] || {};
	            for (var name in $$[$0-1]) {
	              this.$[1][name] = $$[$0-1][name];
	            }
	          }
	        
	break;
	case 6: yy.actionInclude += $$[$0-1]; this.$ = $$[$0]; 
	break;
	case 7: yy.actionInclude = ''; this.$ = [null,null]; 
	break;
	case 8: this.$ = [$$[$0-1], $$[$0]]; 
	break;
	case 9: this.$ = $$[$0]; 
	break;
	case 10: this.$ = $$[$0]; 
	break;
	case 11: this.$ = {}; this.$[$$[$0]] = 0; 
	break;
	case 12: this.$ = $$[$0-1]; this.$[$$[$0]] = 0; 
	break;
	case 13: this.$ = {}; this.$[$$[$0]] = 1; 
	break;
	case 14: this.$ = $$[$0-1]; this.$[$$[$0]] = 1; 
	break;
	case 15: this.$ = $$[$0-1]; this.$.push($$[$0]); 
	break;
	case 16: this.$ = [$$[$0]]; 
	break;
	case 17: this.$ = $$[$0-2] ? [$$[$0-2], $$[$0-1], $$[$0]] : [$$[$0-1],$$[$0]]; 
	break;
	case 18:this.$ = $$[$0-1];
	break;
	case 19:this.$ = $$[$0];
	break;
	case 20:this.$ = '';
	break;
	case 21:this.$ = $$[$0];
	break;
	case 22:this.$ = $$[$0-4]+$$[$0-3]+$$[$0-2]+$$[$0-1]+$$[$0];
	break;
	case 23:this.$ = $$[$0-3] + $$[$0-2] + $$[$0-1] + $$[$0];
	break;
	case 24: this.$ = yytext; 
	break;
	case 25: this.$ = $$[$0-1]+$$[$0]; 
	break;
	case 26: this.$ = $$[$0-1]; 
	break;
	case 27: this.$ = ['*']; 
	break;
	case 29: this.$ = [$$[$0]]; 
	break;
	case 30: this.$ = $$[$0-2]; this.$.push($$[$0]); 
	break;
	case 31:
	          this.$ = $$[$0];
	          if (!(yy.options && yy.options.flex) && this.$.match(/[\w\d]$/) && !this.$.match(/\\(r|f|n|t|v|s|b|c[A-Z]|x[0-9A-F]{2}|u[a-fA-F0-9]{4}|[0-7]{1,3})$/)) {
	              this.$ += "\\b";
	          }
	        
	break;
	case 32: this.$ = $$[$0-2] + '|' + $$[$0]; 
	break;
	case 33: this.$ = $$[$0-1] + '|'; 
	break;
	case 35: this.$ = '' 
	break;
	case 36: this.$ = $$[$0-1] + $$[$0]; 
	break;
	case 38: this.$ = '(' + $$[$0-1] + ')'; 
	break;
	case 39: this.$ = $$[$0-2] + $$[$0-1] + ')'; 
	break;
	case 40: this.$ = $$[$0-1] + '+'; 
	break;
	case 41: this.$ = $$[$0-1] + '*'; 
	break;
	case 42: this.$ = $$[$0-1] + '?'; 
	break;
	case 43: this.$ = '(?=' + $$[$0] + ')'; 
	break;
	case 44: this.$ = '(?!' + $$[$0] + ')'; 
	break;
	case 46: this.$ = $$[$0-1] + $$[$0]; 
	break;
	case 48: this.$ = '.'; 
	break;
	case 49: this.$ = '^'; 
	break;
	case 50: this.$ = '$'; 
	break;
	case 54: this.$ = yytext; 
	break;
	case 55: this.$ = yytext; 
	break;
	case 56: this.$ = yytext; 
	break;
	case 57: this.$ = prepareString(yytext.substr(1, yytext.length - 2)); 
	break;
	}
	},
	table: [{3:1,4:2,5:[2,7],10:3,11:[1,4],12:[1,5],14:[1,6],16:[1,7]},{1:[3]},{5:[1,8]},{4:9,5:[2,7],10:3,11:[1,4],12:[1,5],14:[1,6],16:[1,7]},{4:10,5:[2,7],10:3,11:[1,4],12:[1,5],14:[1,6],16:[1,7]},{5:[2,35],11:[2,35],12:[2,35],13:11,14:[2,35],16:[2,35],32:12,33:[2,35],34:13,35:14,36:[1,15],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{15:31,18:[1,32]},{17:33,18:[1,34]},{6:35,11:[2,28],19:36,20:37,22:[2,28],27:[1,38],33:[2,28],36:[2,28],38:[2,28],41:[2,28],42:[2,28],46:[2,28],47:[2,28],48:[2,28],51:[2,28],52:[2,28],53:[2,28],55:[2,28],56:[2,28]},{5:[2,5]},{5:[2,6]},{5:[2,8],11:[2,8],12:[2,8],14:[2,8],16:[2,8]},{5:[2,31],11:[2,31],12:[2,31],14:[2,31],16:[2,31],22:[2,31],33:[1,39]},{5:[2,34],11:[2,34],12:[2,34],14:[2,34],16:[2,34],22:[2,34],33:[2,34],35:40,36:[1,15],37:[2,34],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{5:[2,37],11:[2,37],12:[2,37],14:[2,37],16:[2,37],22:[2,37],30:[1,42],33:[2,37],36:[2,37],37:[2,37],38:[2,37],39:[1,41],40:[1,43],41:[2,37],42:[2,37],44:44,46:[2,37],47:[2,37],48:[2,37],51:[2,37],52:[2,37],53:[2,37],54:[1,45],55:[2,37],56:[2,37]},{32:46,33:[2,35],34:13,35:14,36:[1,15],37:[2,35],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{32:47,33:[2,35],34:13,35:14,36:[1,15],37:[2,35],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{35:48,36:[1,15],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{35:49,36:[1,15],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{5:[2,45],11:[2,45],12:[2,45],14:[2,45],16:[2,45],22:[2,45],30:[2,45],33:[2,45],36:[2,45],37:[2,45],38:[2,45],39:[2,45],40:[2,45],41:[2,45],42:[2,45],46:[2,45],47:[2,45],48:[2,45],51:[2,45],52:[2,45],53:[2,45],54:[2,45],55:[2,45],56:[2,45]},{5:[2,47],11:[2,47],12:[2,47],14:[2,47],16:[2,47],22:[2,47],30:[2,47],33:[2,47],36:[2,47],37:[2,47],38:[2,47],39:[2,47],40:[2,47],41:[2,47],42:[2,47],46:[2,47],47:[2,47],48:[2,47],51:[2,47],52:[2,47],53:[2,47],54:[2,47],55:[2,47],56:[2,47]},{5:[2,48],11:[2,48],12:[2,48],14:[2,48],16:[2,48],22:[2,48],30:[2,48],33:[2,48],36:[2,48],37:[2,48],38:[2,48],39:[2,48],40:[2,48],41:[2,48],42:[2,48],46:[2,48],47:[2,48],48:[2,48],51:[2,48],52:[2,48],53:[2,48],54:[2,48],55:[2,48],56:[2,48]},{5:[2,49],11:[2,49],12:[2,49],14:[2,49],16:[2,49],22:[2,49],30:[2,49],33:[2,49],36:[2,49],37:[2,49],38:[2,49],39:[2,49],40:[2,49],41:[2,49],42:[2,49],46:[2,49],47:[2,49],48:[2,49],51:[2,49],52:[2,49],53:[2,49],54:[2,49],55:[2,49],56:[2,49]},{5:[2,50],11:[2,50],12:[2,50],14:[2,50],16:[2,50],22:[2,50],30:[2,50],33:[2,50],36:[2,50],37:[2,50],38:[2,50],39:[2,50],40:[2,50],41:[2,50],42:[2,50],46:[2,50],47:[2,50],48:[2,50],51:[2,50],52:[2,50],53:[2,50],54:[2,50],55:[2,50],56:[2,50]},{5:[2,51],11:[2,51],12:[2,51],14:[2,51],16:[2,51],22:[2,51],30:[2,51],33:[2,51],36:[2,51],37:[2,51],38:[2,51],39:[2,51],40:[2,51],41:[2,51],42:[2,51],46:[2,51],47:[2,51],48:[2,51],51:[2,51],52:[2,51],53:[2,51],54:[2,51],55:[2,51],56:[2,51]},{5:[2,52],11:[2,52],12:[2,52],14:[2,52],16:[2,52],22:[2,52],30:[2,52],33:[2,52],36:[2,52],37:[2,52],38:[2,52],39:[2,52],40:[2,52],41:[2,52],42:[2,52],46:[2,52],47:[2,52],48:[2,52],51:[2,52],52:[2,52],53:[2,52],54:[2,52],55:[2,52],56:[2,52]},{5:[2,53],11:[2,53],12:[2,53],14:[2,53],16:[2,53],22:[2,53],30:[2,53],33:[2,53],36:[2,53],37:[2,53],38:[2,53],39:[2,53],40:[2,53],41:[2,53],42:[2,53],46:[2,53],47:[2,53],48:[2,53],51:[2,53],52:[2,53],53:[2,53],54:[2,53],55:[2,53],56:[2,53]},{5:[2,54],11:[2,54],12:[2,54],14:[2,54],16:[2,54],22:[2,54],30:[2,54],33:[2,54],36:[2,54],37:[2,54],38:[2,54],39:[2,54],40:[2,54],41:[2,54],42:[2,54],46:[2,54],47:[2,54],48:[2,54],51:[2,54],52:[2,54],53:[2,54],54:[2,54],55:[2,54],56:[2,54]},{5:[2,57],11:[2,57],12:[2,57],14:[2,57],16:[2,57],22:[2,57],30:[2,57],33:[2,57],36:[2,57],37:[2,57],38:[2,57],39:[2,57],40:[2,57],41:[2,57],42:[2,57],46:[2,57],47:[2,57],48:[2,57],51:[2,57],52:[2,57],53:[2,57],54:[2,57],55:[2,57],56:[2,57]},{5:[2,58],11:[2,58],12:[2,58],14:[2,58],16:[2,58],22:[2,58],30:[2,58],33:[2,58],36:[2,58],37:[2,58],38:[2,58],39:[2,58],40:[2,58],41:[2,58],42:[2,58],46:[2,58],47:[2,58],48:[2,58],51:[2,58],52:[2,58],53:[2,58],54:[2,58],55:[2,58],56:[2,58]},{5:[2,55],11:[2,55],12:[2,55],14:[2,55],16:[2,55],22:[2,55],30:[2,55],33:[2,55],36:[2,55],37:[2,55],38:[2,55],39:[2,55],40:[2,55],41:[2,55],42:[2,55],46:[2,55],47:[2,55],48:[2,55],51:[2,55],52:[2,55],53:[2,55],54:[2,55],55:[2,55],56:[2,55]},{5:[2,9],11:[2,9],12:[2,9],14:[2,9],16:[2,9],18:[1,50]},{5:[2,11],11:[2,11],12:[2,11],14:[2,11],16:[2,11],18:[2,11]},{5:[2,10],11:[2,10],12:[2,10],14:[2,10],16:[2,10],18:[1,51]},{5:[2,13],11:[2,13],12:[2,13],14:[2,13],16:[2,13],18:[2,13]},{5:[1,55],7:52,8:[1,54],11:[2,28],19:53,20:37,22:[2,28],27:[1,38],33:[2,28],36:[2,28],38:[2,28],41:[2,28],42:[2,28],46:[2,28],47:[2,28],48:[2,28],51:[2,28],52:[2,28],53:[2,28],55:[2,28],56:[2,28]},{5:[2,16],8:[2,16],11:[2,16],22:[2,16],27:[2,16],33:[2,16],36:[2,16],38:[2,16],41:[2,16],42:[2,16],46:[2,16],47:[2,16],48:[2,16],51:[2,16],52:[2,16],53:[2,16],55:[2,16],56:[2,16]},{11:[2,35],13:56,22:[2,35],32:12,33:[2,35],34:13,35:14,36:[1,15],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{12:[1,59],28:57,30:[1,58]},{5:[2,33],11:[2,33],12:[2,33],14:[2,33],16:[2,33],22:[2,33],33:[2,33],34:60,35:14,36:[1,15],37:[2,33],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{5:[2,36],11:[2,36],12:[2,36],14:[2,36],16:[2,36],22:[2,36],30:[1,42],33:[2,36],36:[2,36],37:[2,36],38:[2,36],39:[1,41],40:[1,43],41:[2,36],42:[2,36],44:44,46:[2,36],47:[2,36],48:[2,36],51:[2,36],52:[2,36],53:[2,36],54:[1,45],55:[2,36],56:[2,36]},{5:[2,40],11:[2,40],12:[2,40],14:[2,40],16:[2,40],22:[2,40],30:[2,40],33:[2,40],36:[2,40],37:[2,40],38:[2,40],39:[2,40],40:[2,40],41:[2,40],42:[2,40],46:[2,40],47:[2,40],48:[2,40],51:[2,40],52:[2,40],53:[2,40],54:[2,40],55:[2,40],56:[2,40]},{5:[2,41],11:[2,41],12:[2,41],14:[2,41],16:[2,41],22:[2,41],30:[2,41],33:[2,41],36:[2,41],37:[2,41],38:[2,41],39:[2,41],40:[2,41],41:[2,41],42:[2,41],46:[2,41],47:[2,41],48:[2,41],51:[2,41],52:[2,41],53:[2,41],54:[2,41],55:[2,41],56:[2,41]},{5:[2,42],11:[2,42],12:[2,42],14:[2,42],16:[2,42],22:[2,42],30:[2,42],33:[2,42],36:[2,42],37:[2,42],38:[2,42],39:[2,42],40:[2,42],41:[2,42],42:[2,42],46:[2,42],47:[2,42],48:[2,42],51:[2,42],52:[2,42],53:[2,42],54:[2,42],55:[2,42],56:[2,42]},{5:[2,46],11:[2,46],12:[2,46],14:[2,46],16:[2,46],22:[2,46],30:[2,46],33:[2,46],36:[2,46],37:[2,46],38:[2,46],39:[2,46],40:[2,46],41:[2,46],42:[2,46],46:[2,46],47:[2,46],48:[2,46],51:[2,46],52:[2,46],53:[2,46],54:[2,46],55:[2,46],56:[2,46]},{5:[2,56],11:[2,56],12:[2,56],14:[2,56],16:[2,56],22:[2,56],30:[2,56],33:[2,56],36:[2,56],37:[2,56],38:[2,56],39:[2,56],40:[2,56],41:[2,56],42:[2,56],46:[2,56],47:[2,56],48:[2,56],51:[2,56],52:[2,56],53:[2,56],54:[2,56],55:[2,56],56:[2,56]},{33:[1,39],37:[1,61]},{33:[1,39],37:[1,62]},{5:[2,43],11:[2,43],12:[2,43],14:[2,43],16:[2,43],22:[2,43],30:[1,42],33:[2,43],36:[2,43],37:[2,43],38:[2,43],39:[1,41],40:[1,43],41:[2,43],42:[2,43],44:44,46:[2,43],47:[2,43],48:[2,43],51:[2,43],52:[2,43],53:[2,43],54:[1,45],55:[2,43],56:[2,43]},{5:[2,44],11:[2,44],12:[2,44],14:[2,44],16:[2,44],22:[2,44],30:[1,42],33:[2,44],36:[2,44],37:[2,44],38:[2,44],39:[1,41],40:[1,43],41:[2,44],42:[2,44],44:44,46:[2,44],47:[2,44],48:[2,44],51:[2,44],52:[2,44],53:[2,44],54:[1,45],55:[2,44],56:[2,44]},{5:[2,12],11:[2,12],12:[2,12],14:[2,12],16:[2,12],18:[2,12]},{5:[2,14],11:[2,14],12:[2,14],14:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{5:[2,15],8:[2,15],11:[2,15],22:[2,15],27:[2,15],33:[2,15],36:[2,15],38:[2,15],41:[2,15],42:[2,15],46:[2,15],47:[2,15],48:[2,15],51:[2,15],52:[2,15],53:[2,15],55:[2,15],56:[2,15]},{1:[2,2]},{8:[1,63],9:[1,64]},{11:[1,67],21:65,22:[1,66]},{29:[1,68],31:[1,69]},{29:[1,70]},{29:[2,29],31:[2,29]},{5:[2,32],11:[2,32],12:[2,32],14:[2,32],16:[2,32],22:[2,32],33:[2,32],35:40,36:[1,15],37:[2,32],38:[1,16],41:[1,17],42:[1,18],43:19,45:20,46:[1,21],47:[1,22],48:[1,23],49:24,50:25,51:[1,26],52:[1,27],53:[1,30],55:[1,28],56:[1,29]},{5:[2,38],11:[2,38],12:[2,38],14:[2,38],16:[2,38],22:[2,38],30:[2,38],33:[2,38],36:[2,38],37:[2,38],38:[2,38],39:[2,38],40:[2,38],41:[2,38],42:[2,38],46:[2,38],47:[2,38],48:[2,38],51:[2,38],52:[2,38],53:[2,38],54:[2,38],55:[2,38],56:[2,38]},{5:[2,39],11:[2,39],12:[2,39],14:[2,39],16:[2,39],22:[2,39],30:[2,39],33:[2,39],36:[2,39],37:[2,39],38:[2,39],39:[2,39],40:[2,39],41:[2,39],42:[2,39],46:[2,39],47:[2,39],48:[2,39],51:[2,39],52:[2,39],53:[2,39],54:[2,39],55:[2,39],56:[2,39]},{1:[2,3]},{8:[1,71]},{5:[2,17],8:[2,17],11:[2,17],22:[2,17],27:[2,17],33:[2,17],36:[2,17],38:[2,17],41:[2,17],42:[2,17],46:[2,17],47:[2,17],48:[2,17],51:[2,17],52:[2,17],53:[2,17],55:[2,17],56:[2,17]},{22:[2,20],23:72,24:[2,20],25:73,26:[1,74]},{5:[2,19],8:[2,19],11:[2,19],22:[2,19],27:[2,19],33:[2,19],36:[2,19],38:[2,19],41:[2,19],42:[2,19],46:[2,19],47:[2,19],48:[2,19],51:[2,19],52:[2,19],53:[2,19],55:[2,19],56:[2,19]},{11:[2,26],22:[2,26],33:[2,26],36:[2,26],38:[2,26],41:[2,26],42:[2,26],46:[2,26],47:[2,26],48:[2,26],51:[2,26],52:[2,26],53:[2,26],55:[2,26],56:[2,26]},{12:[1,75]},{11:[2,27],22:[2,27],33:[2,27],36:[2,27],38:[2,27],41:[2,27],42:[2,27],46:[2,27],47:[2,27],48:[2,27],51:[2,27],52:[2,27],53:[2,27],55:[2,27],56:[2,27]},{1:[2,4]},{22:[1,77],24:[1,76]},{22:[2,21],24:[2,21],26:[1,78]},{22:[2,24],24:[2,24],26:[2,24]},{29:[2,30],31:[2,30]},{5:[2,18],8:[2,18],11:[2,18],22:[2,18],27:[2,18],33:[2,18],36:[2,18],38:[2,18],41:[2,18],42:[2,18],46:[2,18],47:[2,18],48:[2,18],51:[2,18],52:[2,18],53:[2,18],55:[2,18],56:[2,18]},{22:[2,20],23:79,24:[2,20],25:73,26:[1,74]},{22:[2,25],24:[2,25],26:[2,25]},{22:[1,77],24:[1,80]},{22:[2,23],24:[2,23],25:81,26:[1,74]},{22:[2,22],24:[2,22],26:[1,78]}],
	defaultActions: {9:[2,5],10:[2,6],52:[2,1],54:[2,2],63:[2,3],71:[2,4]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    this.lexer.setInput(input);
	    this.lexer.yy = this.yy;
	    this.yy.lexer = this.lexer;
	    this.yy.parser = this;
	    if (typeof this.lexer.yylloc == 'undefined') {
	        this.lexer.yylloc = {};
	    }
	    var yyloc = this.lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = this.lexer.options && this.lexer.options.ranges;
	    if (typeof this.yy.parseError === 'function') {
	        this.parseError = this.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    function lex() {
	        var token;
	        token = self.lexer.lex() || EOF;
	        if (typeof token !== 'number') {
	            token = self.symbols_[token] || token;
	        }
	        return token;
	    }
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (this.lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: this.lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: this.lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(this.lexer.yytext);
	            lstack.push(this.lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = this.lexer.yyleng;
	                yytext = this.lexer.yytext;
	                yylineno = this.lexer.yylineno;
	                yyloc = this.lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};


	function encodeRE (s) {
	    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1').replace(/\\\\u([a-fA-F0-9]{4})/g,'\\u$1');
	}

	function prepareString (s) {
	    // unescape slashes
	    s = s.replace(/\\\\/g, "\\");
	    s = encodeRE(s);
	    return s;
	};

	/* generated by jison-lex 0.2.1 */
	var lexer = (function(){
	var lexer = {

	EOF:1,

	parseError:function parseError(str, hash) {
	        if (this.yy.parser) {
	            this.yy.parser.parseError(str, hash);
	        } else {
	            throw new Error(str);
	        }
	    },

	// resets the lexer, sets new input
	setInput:function (input) {
	        this._input = input;
	        this._more = this._backtrack = this.done = false;
	        this.yylineno = this.yyleng = 0;
	        this.yytext = this.matched = this.match = '';
	        this.conditionStack = ['INITIAL'];
	        this.yylloc = {
	            first_line: 1,
	            first_column: 0,
	            last_line: 1,
	            last_column: 0
	        };
	        if (this.options.ranges) {
	            this.yylloc.range = [0,0];
	        }
	        this.offset = 0;
	        return this;
	    },

	// consumes and returns one char from the input
	input:function () {
	        var ch = this._input[0];
	        this.yytext += ch;
	        this.yyleng++;
	        this.offset++;
	        this.match += ch;
	        this.matched += ch;
	        var lines = ch.match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno++;
	            this.yylloc.last_line++;
	        } else {
	            this.yylloc.last_column++;
	        }
	        if (this.options.ranges) {
	            this.yylloc.range[1]++;
	        }

	        this._input = this._input.slice(1);
	        return ch;
	    },

	// unshifts one char (or a string) into the input
	unput:function (ch) {
	        var len = ch.length;
	        var lines = ch.split(/(?:\r\n?|\n)/g);

	        this._input = ch + this._input;
	        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
	        //this.yyleng -= len;
	        this.offset -= len;
	        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	        this.match = this.match.substr(0, this.match.length - 1);
	        this.matched = this.matched.substr(0, this.matched.length - 1);

	        if (lines.length - 1) {
	            this.yylineno -= lines.length - 1;
	        }
	        var r = this.yylloc.range;

	        this.yylloc = {
	            first_line: this.yylloc.first_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.first_column,
	            last_column: lines ?
	                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
	                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
	              this.yylloc.first_column - len
	        };

	        if (this.options.ranges) {
	            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	        }
	        this.yyleng = this.yytext.length;
	        return this;
	    },

	// When called from action, caches matched text and appends it on next action
	more:function () {
	        this._more = true;
	        return this;
	    },

	// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	reject:function () {
	        if (this.options.backtrack_lexer) {
	            this._backtrack = true;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });

	        }
	        return this;
	    },

	// retain first n characters of the match
	less:function (n) {
	        this.unput(this.match.slice(n));
	    },

	// displays already matched input, i.e. for error messages
	pastInput:function () {
	        var past = this.matched.substr(0, this.matched.length - this.match.length);
	        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
	    },

	// displays upcoming input, i.e. for error messages
	upcomingInput:function () {
	        var next = this.match;
	        if (next.length < 20) {
	            next += this._input.substr(0, 20-next.length);
	        }
	        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	    },

	// displays the character position where the lexing error occurred, i.e. for error messages
	showPosition:function () {
	        var pre = this.pastInput();
	        var c = new Array(pre.length + 1).join("-");
	        return pre + this.upcomingInput() + "\n" + c + "^";
	    },

	// test the lexed token: return FALSE when not a match, otherwise return token
	test_match:function (match, indexed_rule) {
	        var token,
	            lines,
	            backup;

	        if (this.options.backtrack_lexer) {
	            // save context
	            backup = {
	                yylineno: this.yylineno,
	                yylloc: {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.last_line,
	                    first_column: this.yylloc.first_column,
	                    last_column: this.yylloc.last_column
	                },
	                yytext: this.yytext,
	                match: this.match,
	                matches: this.matches,
	                matched: this.matched,
	                yyleng: this.yyleng,
	                offset: this.offset,
	                _more: this._more,
	                _input: this._input,
	                yy: this.yy,
	                conditionStack: this.conditionStack.slice(0),
	                done: this.done
	            };
	            if (this.options.ranges) {
	                backup.yylloc.range = this.yylloc.range.slice(0);
	            }
	        }

	        lines = match[0].match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno += lines.length;
	        }
	        this.yylloc = {
	            first_line: this.yylloc.last_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.last_column,
	            last_column: lines ?
	                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
	                         this.yylloc.last_column + match[0].length
	        };
	        this.yytext += match[0];
	        this.match += match[0];
	        this.matches = match;
	        this.yyleng = this.yytext.length;
	        if (this.options.ranges) {
	            this.yylloc.range = [this.offset, this.offset += this.yyleng];
	        }
	        this._more = false;
	        this._backtrack = false;
	        this._input = this._input.slice(match[0].length);
	        this.matched += match[0];
	        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	        if (this.done && this._input) {
	            this.done = false;
	        }
	        if (token) {
	            return token;
	        } else if (this._backtrack) {
	            // recover context
	            for (var k in backup) {
	                this[k] = backup[k];
	            }
	            return false; // rule action called reject() implying the next rule should be tested instead.
	        }
	        return false;
	    },

	// return next match in input
	next:function () {
	        if (this.done) {
	            return this.EOF;
	        }
	        if (!this._input) {
	            this.done = true;
	        }

	        var token,
	            match,
	            tempMatch,
	            index;
	        if (!this._more) {
	            this.yytext = '';
	            this.match = '';
	        }
	        var rules = this._currentRules();
	        for (var i = 0; i < rules.length; i++) {
	            tempMatch = this._input.match(this.rules[rules[i]]);
	            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                match = tempMatch;
	                index = i;
	                if (this.options.backtrack_lexer) {
	                    token = this.test_match(tempMatch, rules[i]);
	                    if (token !== false) {
	                        return token;
	                    } else if (this._backtrack) {
	                        match = false;
	                        continue; // rule action called reject() implying a rule MISmatch.
	                    } else {
	                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                        return false;
	                    }
	                } else if (!this.options.flex) {
	                    break;
	                }
	            }
	        }
	        if (match) {
	            token = this.test_match(match, rules[index]);
	            if (token !== false) {
	                return token;
	            }
	            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	            return false;
	        }
	        if (this._input === "") {
	            return this.EOF;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	        }
	    },

	// return next match that has a token
	lex:function lex() {
	        var r = this.next();
	        if (r) {
	            return r;
	        } else {
	            return this.lex();
	        }
	    },

	// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	begin:function begin(condition) {
	        this.conditionStack.push(condition);
	    },

	// pop the previously active lexer condition state off the condition stack
	popState:function popState() {
	        var n = this.conditionStack.length - 1;
	        if (n > 0) {
	            return this.conditionStack.pop();
	        } else {
	            return this.conditionStack[0];
	        }
	    },

	// produce the lexer rule set which is active for the currently active lexer condition state
	_currentRules:function _currentRules() {
	        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	        } else {
	            return this.conditions["INITIAL"].rules;
	        }
	    },

	// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	topState:function topState(n) {
	        n = this.conditionStack.length - 1 - Math.abs(n || 0);
	        if (n >= 0) {
	            return this.conditionStack[n];
	        } else {
	            return "INITIAL";
	        }
	    },

	// alias for begin(condition)
	pushState:function pushState(condition) {
	        this.begin(condition);
	    },

	// return the number of states currently on the stack
	stateStackSize:function stateStackSize() {
	        return this.conditionStack.length;
	    },
	options: {},
	performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

	var YYSTATE=YY_START;
	switch($avoiding_name_collisions) {
	case 0:return 26;
	break;
	case 1:return 26;
	break;
	case 2:return 26; // regexp with braces or quotes (and no spaces)
	break;
	case 3:return 26;
	break;
	case 4:return 26;
	break;
	case 5:return 26;
	break;
	case 6:return 26;
	break;
	case 7:yy.depth++; return 22
	break;
	case 8:yy.depth == 0 ? this.begin('trail') : yy.depth--; return 24
	break;
	case 9:return 12;
	break;
	case 10:this.popState(); return 29;
	break;
	case 11:return 31;
	break;
	case 12:return 30;
	break;
	case 13:/* */
	break;
	case 14:/* */
	break;
	case 15:this.begin('indented')
	break;
	case 16:this.begin('code'); return 5
	break;
	case 17:return 56
	break;
	case 18:yy.options[yy_.yytext] = true
	break;
	case 19:this.begin('INITIAL')
	break;
	case 20:this.begin('INITIAL')
	break;
	case 21:/* empty */
	break;
	case 22:return 18
	break;
	case 23:this.begin('INITIAL')
	break;
	case 24:this.begin('INITIAL')
	break;
	case 25:/* empty */
	break;
	case 26:this.begin('rules')
	break;
	case 27:yy.depth = 0; this.begin('action'); return 22
	break;
	case 28:this.begin('trail'); yy_.yytext = yy_.yytext.substr(2, yy_.yytext.length-4);return 11
	break;
	case 29:yy_.yytext = yy_.yytext.substr(2, yy_.yytext.length-4); return 11
	break;
	case 30:this.begin('rules'); return 11
	break;
	case 31:/* ignore */
	break;
	case 32:/* ignore */
	break;
	case 33:/* */
	break;
	case 34:/* */
	break;
	case 35:return 12;
	break;
	case 36:yy_.yytext = yy_.yytext.replace(/\\"/g,'"'); return 55;
	break;
	case 37:yy_.yytext = yy_.yytext.replace(/\\'/g,"'"); return 55;
	break;
	case 38:return 33;
	break;
	case 39:return 52;
	break;
	case 40:return 38;
	break;
	case 41:return 38;
	break;
	case 42:return 38;
	break;
	case 43:return 36;
	break;
	case 44:return 37;
	break;
	case 45:return 39;
	break;
	case 46:return 30;
	break;
	case 47:return 40;
	break;
	case 48:return 47;
	break;
	case 49:return 31;
	break;
	case 50:return 48;
	break;
	case 51:this.begin('conditions'); return 27;
	break;
	case 52:return 42;
	break;
	case 53:return 41;
	break;
	case 54:return 53;
	break;
	case 55:yy_.yytext = yy_.yytext.replace(/^\\/g,''); return 53;
	break;
	case 56:return 48;
	break;
	case 57:return 46;
	break;
	case 58:yy.options = {}; this.begin('options');
	break;
	case 59:this.begin('start_condition'); return 14;
	break;
	case 60:this.begin('start_condition'); return 16;
	break;
	case 61:this.begin('rules'); return 5;
	break;
	case 62:return 54;
	break;
	case 63:return 51;
	break;
	case 64:return 22;
	break;
	case 65:return 24;
	break;
	case 66:/* ignore bad characters */
	break;
	case 67:return 8;
	break;
	case 68:return 9;
	break;
	}
	},
	rules: [/^(?:\/\*(.|\n|\r)*?\*\/)/,/^(?:\/\/.*)/,/^(?:\/[^ /]*?['"{}'][^ ]*?\/)/,/^(?:"(\\\\|\\"|[^"])*")/,/^(?:'(\\\\|\\'|[^'])*')/,/^(?:[/"'][^{}/"']+)/,/^(?:[^{}/"']+)/,/^(?:\{)/,/^(?:\})/,/^(?:([a-zA-Z_][a-zA-Z0-9_-]*))/,/^(?:>)/,/^(?:,)/,/^(?:\*)/,/^(?:(\r\n|\n|\r)+)/,/^(?:\s+(\r\n|\n|\r)+)/,/^(?:\s+)/,/^(?:%%)/,/^(?:[a-zA-Z0-9_]+)/,/^(?:([a-zA-Z_][a-zA-Z0-9_-]*))/,/^(?:(\r\n|\n|\r)+)/,/^(?:\s+(\r\n|\n|\r)+)/,/^(?:\s+)/,/^(?:([a-zA-Z_][a-zA-Z0-9_-]*))/,/^(?:(\r\n|\n|\r)+)/,/^(?:\s+(\r\n|\n|\r)+)/,/^(?:\s+)/,/^(?:.*(\r\n|\n|\r)+)/,/^(?:\{)/,/^(?:%\{(.|(\r\n|\n|\r))*?%\})/,/^(?:%\{(.|(\r\n|\n|\r))*?%\})/,/^(?:.+)/,/^(?:\/\*(.|\n|\r)*?\*\/)/,/^(?:\/\/.*)/,/^(?:(\r\n|\n|\r)+)/,/^(?:\s+)/,/^(?:([a-zA-Z_][a-zA-Z0-9_-]*))/,/^(?:"(\\\\|\\"|[^"])*")/,/^(?:'(\\\\|\\'|[^'])*')/,/^(?:\|)/,/^(?:\[(\\\\|\\\]|[^\]])*\])/,/^(?:\(\?:)/,/^(?:\(\?=)/,/^(?:\(\?!)/,/^(?:\()/,/^(?:\))/,/^(?:\+)/,/^(?:\*)/,/^(?:\?)/,/^(?:\^)/,/^(?:,)/,/^(?:<<EOF>>)/,/^(?:<)/,/^(?:\/!)/,/^(?:\/)/,/^(?:\\([0-7]{1,3}|[rfntvsSbBwWdD\\*+()${}|[\]\/.^?]|c[A-Z]|x[0-9A-F]{2}|u[a-fA-F0-9]{4}))/,/^(?:\\.)/,/^(?:\$)/,/^(?:\.)/,/^(?:%options\b)/,/^(?:%s\b)/,/^(?:%x\b)/,/^(?:%%)/,/^(?:\{\d+(,\s?\d+|,)?\})/,/^(?:\{([a-zA-Z_][a-zA-Z0-9_-]*)\})/,/^(?:\{)/,/^(?:\})/,/^(?:.)/,/^(?:$)/,/^(?:(.|(\r\n|\n|\r))+)/],
	conditions: {"code":{"rules":[67,68],"inclusive":false},"start_condition":{"rules":[22,23,24,25,67],"inclusive":false},"options":{"rules":[18,19,20,21,67],"inclusive":false},"conditions":{"rules":[9,10,11,12,67],"inclusive":false},"action":{"rules":[0,1,2,3,4,5,6,7,8,67],"inclusive":false},"indented":{"rules":[27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],"inclusive":true},"trail":{"rules":[26,29,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],"inclusive":true},"rules":{"rules":[13,14,15,16,17,29,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],"inclusive":true},"INITIAL":{"rules":[29,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],"inclusive":true}}
	};
	return lexer;
	})();
	parser.lexer = lexer;
	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();


	if (true) {
	exports.parser = lex;
	exports.Parser = lex.Parser;
	exports.parse = function () { return lex.parse.apply(lex, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(7).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(12)(module)))

/***/ },
/* 36 */,
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var bnf = __webpack_require__(38).parser,
	    ebnf = __webpack_require__(39),
	    jisonlex = __webpack_require__(35);

	exports.parse = function parse (grammar) { return bnf.parse(grammar); };
	exports.transform = ebnf.transform;

	// adds a declaration to the grammar
	bnf.yy.addDeclaration = function (grammar, decl) {
	    if (decl.start) {
	        grammar.start = decl.start;

	    } else if (decl.lex) {
	        grammar.lex = parseLex(decl.lex);

	    } else if (decl.operator) {
	        if (!grammar.operators) grammar.operators = [];
	        grammar.operators.push(decl.operator);

	    } else if (decl.parseParam) {
	        if (!grammar.parseParams) grammar.parseParams = [];
	        grammar.parseParams = grammar.parseParams.concat(decl.parseParam);

	    } else if (decl.include) {
	        if (!grammar.moduleInclude) grammar.moduleInclude = '';
	        grammar.moduleInclude += decl.include;

	    } else if (decl.options) {
	        if (!grammar.options) grammar.options = {};
	        for (var i=0; i < decl.options.length; i++) {
	            grammar.options[decl.options[i]] = true;
	        }
	    }

	};

	// parse an embedded lex section
	var parseLex = function (text) {
	    return jisonlex.parse(text.replace(/(?:^%lex)|(?:\/lex$)/g, ''));
	};



/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.11 */
	/*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var bnf = (function(){
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"spec":3,"declaration_list":4,"%%":5,"grammar":6,"optional_end_block":7,"EOF":8,"CODE":9,"declaration":10,"START":11,"id":12,"LEX_BLOCK":13,"operator":14,"ACTION":15,"parse_param":16,"options":17,"OPTIONS":18,"token_list":19,"PARSE_PARAM":20,"associativity":21,"LEFT":22,"RIGHT":23,"NONASSOC":24,"symbol":25,"production_list":26,"production":27,":":28,"handle_list":29,";":30,"|":31,"handle_action":32,"handle":33,"prec":34,"action":35,"expression_suffix":36,"handle_sublist":37,"expression":38,"suffix":39,"ALIAS":40,"ID":41,"STRING":42,"(":43,")":44,"*":45,"?":46,"+":47,"PREC":48,"{":49,"action_body":50,"}":51,"ARROW_ACTION":52,"action_comments_body":53,"ACTION_BODY":54,"$accept":0,"$end":1},
	terminals_: {2:"error",5:"%%",8:"EOF",9:"CODE",11:"START",13:"LEX_BLOCK",15:"ACTION",18:"OPTIONS",20:"PARSE_PARAM",22:"LEFT",23:"RIGHT",24:"NONASSOC",28:":",30:";",31:"|",40:"ALIAS",41:"ID",42:"STRING",43:"(",44:")",45:"*",46:"?",47:"+",48:"PREC",49:"{",51:"}",52:"ARROW_ACTION",54:"ACTION_BODY"},
	productions_: [0,[3,5],[3,6],[7,0],[7,1],[4,2],[4,0],[10,2],[10,1],[10,1],[10,1],[10,1],[10,1],[17,2],[16,2],[14,2],[21,1],[21,1],[21,1],[19,2],[19,1],[6,1],[26,2],[26,1],[27,4],[29,3],[29,1],[32,3],[33,2],[33,0],[37,3],[37,1],[36,3],[36,2],[38,1],[38,1],[38,3],[39,0],[39,1],[39,1],[39,1],[34,2],[34,0],[25,1],[25,1],[12,1],[35,3],[35,1],[35,1],[35,0],[50,0],[50,1],[50,5],[50,4],[53,1],[53,2]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */

	var $0 = $$.length - 1;
	switch (yystate) {
	case 1:
	          this.$ = $$[$0-4];
	          return extend(this.$, $$[$0-2]);
	        
	break;
	case 2:
	          this.$ = $$[$0-5];
	          yy.addDeclaration(this.$, { include: $$[$0-1] });
	          return extend(this.$, $$[$0-3]);
	        
	break;
	case 5:this.$ = $$[$0-1]; yy.addDeclaration(this.$, $$[$0]);
	break;
	case 6:this.$ = {};
	break;
	case 7:this.$ = {start: $$[$0]};
	break;
	case 8:this.$ = {lex: $$[$0]};
	break;
	case 9:this.$ = {operator: $$[$0]};
	break;
	case 10:this.$ = {include: $$[$0]};
	break;
	case 11:this.$ = {parseParam: $$[$0]};
	break;
	case 12:this.$ = {options: $$[$0]};
	break;
	case 13:this.$ = $$[$0];
	break;
	case 14:this.$ = $$[$0];
	break;
	case 15:this.$ = [$$[$0-1]]; this.$.push.apply(this.$, $$[$0]);
	break;
	case 16:this.$ = 'left';
	break;
	case 17:this.$ = 'right';
	break;
	case 18:this.$ = 'nonassoc';
	break;
	case 19:this.$ = $$[$0-1]; this.$.push($$[$0]);
	break;
	case 20:this.$ = [$$[$0]];
	break;
	case 21:this.$ = $$[$0];
	break;
	case 22:
	            this.$ = $$[$0-1];
	            if ($$[$0][0] in this.$) 
	                this.$[$$[$0][0]] = this.$[$$[$0][0]].concat($$[$0][1]);
	            else
	                this.$[$$[$0][0]] = $$[$0][1];
	        
	break;
	case 23:this.$ = {}; this.$[$$[$0][0]] = $$[$0][1];
	break;
	case 24:this.$ = [$$[$0-3], $$[$0-1]];
	break;
	case 25:this.$ = $$[$0-2]; this.$.push($$[$0]);
	break;
	case 26:this.$ = [$$[$0]];
	break;
	case 27:
	            this.$ = [($$[$0-2].length ? $$[$0-2].join(' ') : '')];
	            if($$[$0]) this.$.push($$[$0]);
	            if($$[$0-1]) this.$.push($$[$0-1]);
	            if (this.$.length === 1) this.$ = this.$[0];
	        
	break;
	case 28:this.$ = $$[$0-1]; this.$.push($$[$0])
	break;
	case 29:this.$ = [];
	break;
	case 30:this.$ = $$[$0-2]; this.$.push($$[$0].join(' '));
	break;
	case 31:this.$ = [$$[$0].join(' ')];
	break;
	case 32:this.$ = $$[$0-2] + $$[$0-1] + "[" + $$[$0] + "]"; 
	break;
	case 33:this.$ = $$[$0-1] + $$[$0]; 
	break;
	case 34:this.$ = $$[$0]; 
	break;
	case 35:this.$ = ebnf ? "'" + $$[$0] + "'" : $$[$0]; 
	break;
	case 36:this.$ = '(' + $$[$0-1].join(' | ') + ')'; 
	break;
	case 37:this.$ = ''
	break;
	case 41:this.$ = {prec: $$[$0]};
	break;
	case 42:this.$ = null;
	break;
	case 43:this.$ = $$[$0];
	break;
	case 44:this.$ = yytext;
	break;
	case 45:this.$ = yytext;
	break;
	case 46:this.$ = $$[$0-1];
	break;
	case 47:this.$ = $$[$0];
	break;
	case 48:this.$ = '$$ =' + $$[$0] + ';';
	break;
	case 49:this.$ = '';
	break;
	case 50:this.$ = '';
	break;
	case 51:this.$ = $$[$0];
	break;
	case 52:this.$ = $$[$0-4] + $$[$0-3] + $$[$0-2] + $$[$0-1] + $$[$0];
	break;
	case 53:this.$ = $$[$0-3] + $$[$0-2] + $$[$0-1] + $$[$0];
	break;
	case 54: this.$ = yytext; 
	break;
	case 55: this.$ = $$[$0-1]+$$[$0]; 
	break;
	}
	},
	table: [{3:1,4:2,5:[2,6],11:[2,6],13:[2,6],15:[2,6],18:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{1:[3]},{5:[1,3],10:4,11:[1,5],13:[1,6],14:7,15:[1,8],16:9,17:10,18:[1,13],20:[1,12],21:11,22:[1,14],23:[1,15],24:[1,16]},{6:17,12:20,26:18,27:19,41:[1,21]},{5:[2,5],11:[2,5],13:[2,5],15:[2,5],18:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{12:22,41:[1,21]},{5:[2,8],11:[2,8],13:[2,8],15:[2,8],18:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{5:[2,9],11:[2,9],13:[2,9],15:[2,9],18:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],11:[2,10],13:[2,10],15:[2,10],18:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],11:[2,11],13:[2,11],15:[2,11],18:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],11:[2,12],13:[2,12],15:[2,12],18:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{12:25,19:23,25:24,41:[1,21],42:[1,26]},{12:25,19:27,25:24,41:[1,21],42:[1,26]},{12:25,19:28,25:24,41:[1,21],42:[1,26]},{41:[2,16],42:[2,16]},{41:[2,17],42:[2,17]},{41:[2,18],42:[2,18]},{5:[1,30],7:29,8:[2,3]},{5:[2,21],8:[2,21],12:20,27:31,41:[1,21]},{5:[2,23],8:[2,23],41:[2,23]},{28:[1,32]},{5:[2,45],11:[2,45],13:[2,45],15:[2,45],18:[2,45],20:[2,45],22:[2,45],23:[2,45],24:[2,45],28:[2,45],30:[2,45],31:[2,45],41:[2,45],42:[2,45],49:[2,45],52:[2,45]},{5:[2,7],11:[2,7],13:[2,7],15:[2,7],18:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{5:[2,15],11:[2,15],12:25,13:[2,15],15:[2,15],18:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15],25:33,41:[1,21],42:[1,26]},{5:[2,20],11:[2,20],13:[2,20],15:[2,20],18:[2,20],20:[2,20],22:[2,20],23:[2,20],24:[2,20],41:[2,20],42:[2,20]},{5:[2,43],11:[2,43],13:[2,43],15:[2,43],18:[2,43],20:[2,43],22:[2,43],23:[2,43],24:[2,43],30:[2,43],31:[2,43],41:[2,43],42:[2,43],49:[2,43],52:[2,43]},{5:[2,44],11:[2,44],13:[2,44],15:[2,44],18:[2,44],20:[2,44],22:[2,44],23:[2,44],24:[2,44],30:[2,44],31:[2,44],41:[2,44],42:[2,44],49:[2,44],52:[2,44]},{5:[2,14],11:[2,14],12:25,13:[2,14],15:[2,14],18:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14],25:33,41:[1,21],42:[1,26]},{5:[2,13],11:[2,13],12:25,13:[2,13],15:[2,13],18:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13],25:33,41:[1,21],42:[1,26]},{8:[1,34]},{8:[2,4],9:[1,35]},{5:[2,22],8:[2,22],41:[2,22]},{15:[2,29],29:36,30:[2,29],31:[2,29],32:37,33:38,41:[2,29],42:[2,29],43:[2,29],48:[2,29],49:[2,29],52:[2,29]},{5:[2,19],11:[2,19],13:[2,19],15:[2,19],18:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19],41:[2,19],42:[2,19]},{1:[2,1]},{8:[1,39]},{30:[1,40],31:[1,41]},{30:[2,26],31:[2,26]},{15:[2,42],30:[2,42],31:[2,42],34:42,36:43,38:45,41:[1,46],42:[1,47],43:[1,48],48:[1,44],49:[2,42],52:[2,42]},{1:[2,2]},{5:[2,24],8:[2,24],41:[2,24]},{15:[2,29],30:[2,29],31:[2,29],32:49,33:38,41:[2,29],42:[2,29],43:[2,29],48:[2,29],49:[2,29],52:[2,29]},{15:[1,52],30:[2,49],31:[2,49],35:50,49:[1,51],52:[1,53]},{15:[2,28],30:[2,28],31:[2,28],41:[2,28],42:[2,28],43:[2,28],44:[2,28],48:[2,28],49:[2,28],52:[2,28]},{12:25,25:54,41:[1,21],42:[1,26]},{15:[2,37],30:[2,37],31:[2,37],39:55,40:[2,37],41:[2,37],42:[2,37],43:[2,37],44:[2,37],45:[1,56],46:[1,57],47:[1,58],48:[2,37],49:[2,37],52:[2,37]},{15:[2,34],30:[2,34],31:[2,34],40:[2,34],41:[2,34],42:[2,34],43:[2,34],44:[2,34],45:[2,34],46:[2,34],47:[2,34],48:[2,34],49:[2,34],52:[2,34]},{15:[2,35],30:[2,35],31:[2,35],40:[2,35],41:[2,35],42:[2,35],43:[2,35],44:[2,35],45:[2,35],46:[2,35],47:[2,35],48:[2,35],49:[2,35],52:[2,35]},{31:[2,29],33:60,37:59,41:[2,29],42:[2,29],43:[2,29],44:[2,29]},{30:[2,25],31:[2,25]},{30:[2,27],31:[2,27]},{49:[2,50],50:61,51:[2,50],53:62,54:[1,63]},{30:[2,47],31:[2,47]},{30:[2,48],31:[2,48]},{15:[2,41],30:[2,41],31:[2,41],49:[2,41],52:[2,41]},{15:[2,33],30:[2,33],31:[2,33],40:[1,64],41:[2,33],42:[2,33],43:[2,33],44:[2,33],48:[2,33],49:[2,33],52:[2,33]},{15:[2,38],30:[2,38],31:[2,38],40:[2,38],41:[2,38],42:[2,38],43:[2,38],44:[2,38],48:[2,38],49:[2,38],52:[2,38]},{15:[2,39],30:[2,39],31:[2,39],40:[2,39],41:[2,39],42:[2,39],43:[2,39],44:[2,39],48:[2,39],49:[2,39],52:[2,39]},{15:[2,40],30:[2,40],31:[2,40],40:[2,40],41:[2,40],42:[2,40],43:[2,40],44:[2,40],48:[2,40],49:[2,40],52:[2,40]},{31:[1,66],44:[1,65]},{31:[2,31],36:43,38:45,41:[1,46],42:[1,47],43:[1,48],44:[2,31]},{49:[1,68],51:[1,67]},{49:[2,51],51:[2,51],54:[1,69]},{49:[2,54],51:[2,54],54:[2,54]},{15:[2,32],30:[2,32],31:[2,32],41:[2,32],42:[2,32],43:[2,32],44:[2,32],48:[2,32],49:[2,32],52:[2,32]},{15:[2,36],30:[2,36],31:[2,36],40:[2,36],41:[2,36],42:[2,36],43:[2,36],44:[2,36],45:[2,36],46:[2,36],47:[2,36],48:[2,36],49:[2,36],52:[2,36]},{31:[2,29],33:70,41:[2,29],42:[2,29],43:[2,29],44:[2,29]},{30:[2,46],31:[2,46]},{49:[2,50],50:71,51:[2,50],53:62,54:[1,63]},{49:[2,55],51:[2,55],54:[2,55]},{31:[2,30],36:43,38:45,41:[1,46],42:[1,47],43:[1,48],44:[2,30]},{49:[1,68],51:[1,72]},{49:[2,53],51:[2,53],53:73,54:[1,63]},{49:[2,52],51:[2,52],54:[1,69]}],
	defaultActions: {34:[2,1],39:[2,2]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    this.lexer.setInput(input);
	    this.lexer.yy = this.yy;
	    this.yy.lexer = this.lexer;
	    this.yy.parser = this;
	    if (typeof this.lexer.yylloc == 'undefined') {
	        this.lexer.yylloc = {};
	    }
	    var yyloc = this.lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = this.lexer.options && this.lexer.options.ranges;
	    if (typeof this.yy.parseError === 'function') {
	        this.parseError = this.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    function lex() {
	        var token;
	        token = self.lexer.lex() || EOF;
	        if (typeof token !== 'number') {
	            token = self.symbols_[token] || token;
	        }
	        return token;
	    }
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (this.lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: this.lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: this.lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(this.lexer.yytext);
	            lstack.push(this.lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = this.lexer.yyleng;
	                yytext = this.lexer.yytext;
	                yylineno = this.lexer.yylineno;
	                yyloc = this.lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                this.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};

	var transform = __webpack_require__(39).transform;
	var ebnf = false;


	// transform ebnf to bnf if necessary
	function extend (json, grammar) {
	    json.bnf = ebnf ? transform(grammar) : grammar;
	    return json;
	}

	/* generated by jison-lex 0.2.1 */
	var lexer = (function(){
	var lexer = {

	EOF:1,

	parseError:function parseError(str, hash) {
	        if (this.yy.parser) {
	            this.yy.parser.parseError(str, hash);
	        } else {
	            throw new Error(str);
	        }
	    },

	// resets the lexer, sets new input
	setInput:function (input) {
	        this._input = input;
	        this._more = this._backtrack = this.done = false;
	        this.yylineno = this.yyleng = 0;
	        this.yytext = this.matched = this.match = '';
	        this.conditionStack = ['INITIAL'];
	        this.yylloc = {
	            first_line: 1,
	            first_column: 0,
	            last_line: 1,
	            last_column: 0
	        };
	        if (this.options.ranges) {
	            this.yylloc.range = [0,0];
	        }
	        this.offset = 0;
	        return this;
	    },

	// consumes and returns one char from the input
	input:function () {
	        var ch = this._input[0];
	        this.yytext += ch;
	        this.yyleng++;
	        this.offset++;
	        this.match += ch;
	        this.matched += ch;
	        var lines = ch.match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno++;
	            this.yylloc.last_line++;
	        } else {
	            this.yylloc.last_column++;
	        }
	        if (this.options.ranges) {
	            this.yylloc.range[1]++;
	        }

	        this._input = this._input.slice(1);
	        return ch;
	    },

	// unshifts one char (or a string) into the input
	unput:function (ch) {
	        var len = ch.length;
	        var lines = ch.split(/(?:\r\n?|\n)/g);

	        this._input = ch + this._input;
	        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
	        //this.yyleng -= len;
	        this.offset -= len;
	        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	        this.match = this.match.substr(0, this.match.length - 1);
	        this.matched = this.matched.substr(0, this.matched.length - 1);

	        if (lines.length - 1) {
	            this.yylineno -= lines.length - 1;
	        }
	        var r = this.yylloc.range;

	        this.yylloc = {
	            first_line: this.yylloc.first_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.first_column,
	            last_column: lines ?
	                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
	                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
	              this.yylloc.first_column - len
	        };

	        if (this.options.ranges) {
	            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	        }
	        this.yyleng = this.yytext.length;
	        return this;
	    },

	// When called from action, caches matched text and appends it on next action
	more:function () {
	        this._more = true;
	        return this;
	    },

	// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	reject:function () {
	        if (this.options.backtrack_lexer) {
	            this._backtrack = true;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });

	        }
	        return this;
	    },

	// retain first n characters of the match
	less:function (n) {
	        this.unput(this.match.slice(n));
	    },

	// displays already matched input, i.e. for error messages
	pastInput:function () {
	        var past = this.matched.substr(0, this.matched.length - this.match.length);
	        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
	    },

	// displays upcoming input, i.e. for error messages
	upcomingInput:function () {
	        var next = this.match;
	        if (next.length < 20) {
	            next += this._input.substr(0, 20-next.length);
	        }
	        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	    },

	// displays the character position where the lexing error occurred, i.e. for error messages
	showPosition:function () {
	        var pre = this.pastInput();
	        var c = new Array(pre.length + 1).join("-");
	        return pre + this.upcomingInput() + "\n" + c + "^";
	    },

	// test the lexed token: return FALSE when not a match, otherwise return token
	test_match:function (match, indexed_rule) {
	        var token,
	            lines,
	            backup;

	        if (this.options.backtrack_lexer) {
	            // save context
	            backup = {
	                yylineno: this.yylineno,
	                yylloc: {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.last_line,
	                    first_column: this.yylloc.first_column,
	                    last_column: this.yylloc.last_column
	                },
	                yytext: this.yytext,
	                match: this.match,
	                matches: this.matches,
	                matched: this.matched,
	                yyleng: this.yyleng,
	                offset: this.offset,
	                _more: this._more,
	                _input: this._input,
	                yy: this.yy,
	                conditionStack: this.conditionStack.slice(0),
	                done: this.done
	            };
	            if (this.options.ranges) {
	                backup.yylloc.range = this.yylloc.range.slice(0);
	            }
	        }

	        lines = match[0].match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno += lines.length;
	        }
	        this.yylloc = {
	            first_line: this.yylloc.last_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.last_column,
	            last_column: lines ?
	                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
	                         this.yylloc.last_column + match[0].length
	        };
	        this.yytext += match[0];
	        this.match += match[0];
	        this.matches = match;
	        this.yyleng = this.yytext.length;
	        if (this.options.ranges) {
	            this.yylloc.range = [this.offset, this.offset += this.yyleng];
	        }
	        this._more = false;
	        this._backtrack = false;
	        this._input = this._input.slice(match[0].length);
	        this.matched += match[0];
	        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	        if (this.done && this._input) {
	            this.done = false;
	        }
	        if (token) {
	            return token;
	        } else if (this._backtrack) {
	            // recover context
	            for (var k in backup) {
	                this[k] = backup[k];
	            }
	            return false; // rule action called reject() implying the next rule should be tested instead.
	        }
	        return false;
	    },

	// return next match in input
	next:function () {
	        if (this.done) {
	            return this.EOF;
	        }
	        if (!this._input) {
	            this.done = true;
	        }

	        var token,
	            match,
	            tempMatch,
	            index;
	        if (!this._more) {
	            this.yytext = '';
	            this.match = '';
	        }
	        var rules = this._currentRules();
	        for (var i = 0; i < rules.length; i++) {
	            tempMatch = this._input.match(this.rules[rules[i]]);
	            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                match = tempMatch;
	                index = i;
	                if (this.options.backtrack_lexer) {
	                    token = this.test_match(tempMatch, rules[i]);
	                    if (token !== false) {
	                        return token;
	                    } else if (this._backtrack) {
	                        match = false;
	                        continue; // rule action called reject() implying a rule MISmatch.
	                    } else {
	                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                        return false;
	                    }
	                } else if (!this.options.flex) {
	                    break;
	                }
	            }
	        }
	        if (match) {
	            token = this.test_match(match, rules[index]);
	            if (token !== false) {
	                return token;
	            }
	            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	            return false;
	        }
	        if (this._input === "") {
	            return this.EOF;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	        }
	    },

	// return next match that has a token
	lex:function lex() {
	        var r = this.next();
	        if (r) {
	            return r;
	        } else {
	            return this.lex();
	        }
	    },

	// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	begin:function begin(condition) {
	        this.conditionStack.push(condition);
	    },

	// pop the previously active lexer condition state off the condition stack
	popState:function popState() {
	        var n = this.conditionStack.length - 1;
	        if (n > 0) {
	            return this.conditionStack.pop();
	        } else {
	            return this.conditionStack[0];
	        }
	    },

	// produce the lexer rule set which is active for the currently active lexer condition state
	_currentRules:function _currentRules() {
	        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	        } else {
	            return this.conditions["INITIAL"].rules;
	        }
	    },

	// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	topState:function topState(n) {
	        n = this.conditionStack.length - 1 - Math.abs(n || 0);
	        if (n >= 0) {
	            return this.conditionStack[n];
	        } else {
	            return "INITIAL";
	        }
	    },

	// alias for begin(condition)
	pushState:function pushState(condition) {
	        this.begin(condition);
	    },

	// return the number of states currently on the stack
	stateStackSize:function stateStackSize() {
	        return this.conditionStack.length;
	    },
	options: {},
	performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

	var YYSTATE=YY_START;
	switch($avoiding_name_collisions) {
	case 0:this.pushState('code');return 5;
	break;
	case 1:return 43;
	break;
	case 2:return 44;
	break;
	case 3:return 45;
	break;
	case 4:return 46;
	break;
	case 5:return 47;
	break;
	case 6:/* skip whitespace */
	break;
	case 7:/* skip comment */
	break;
	case 8:/* skip comment */
	break;
	case 9:yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 40;
	break;
	case 10:return 41;
	break;
	case 11:yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 42;
	break;
	case 12:yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 42;
	break;
	case 13:return 28;
	break;
	case 14:return 30;
	break;
	case 15:return 31;
	break;
	case 16:this.pushState(ebnf ? 'ebnf' : 'bnf'); return 5;
	break;
	case 17:if (!yy.options) yy.options = {}; ebnf = yy.options.ebnf = true;
	break;
	case 18:return 48;
	break;
	case 19:return 11;
	break;
	case 20:return 22;
	break;
	case 21:return 23;
	break;
	case 22:return 24;
	break;
	case 23:return 20;
	break;
	case 24:return 18;
	break;
	case 25:return 13;
	break;
	case 26:/* ignore unrecognized decl */
	break;
	case 27:/* ignore type */
	break;
	case 28:yy_.yytext = yy_.yytext.substr(2, yy_.yyleng-4); return 15;
	break;
	case 29:yy_.yytext = yy_.yytext.substr(2, yy_.yytext.length-4); return 15;
	break;
	case 30:yy.depth = 0; this.pushState('action'); return 49;
	break;
	case 31:yy_.yytext = yy_.yytext.substr(2, yy_.yyleng-2); return 52;
	break;
	case 32:/* ignore bad characters */
	break;
	case 33:return 8;
	break;
	case 34:return 54;
	break;
	case 35:return 54;
	break;
	case 36:return 54; // regexp with braces or quotes (and no spaces)
	break;
	case 37:return 54;
	break;
	case 38:return 54;
	break;
	case 39:return 54;
	break;
	case 40:return 54;
	break;
	case 41:yy.depth++; return 49;
	break;
	case 42:if (yy.depth==0) this.begin(ebnf ? 'ebnf' : 'bnf'); else yy.depth--; return 51;
	break;
	case 43:return 9;
	break;
	}
	},
	rules: [/^(?:%%)/,/^(?:\()/,/^(?:\))/,/^(?:\*)/,/^(?:\?)/,/^(?:\+)/,/^(?:\s+)/,/^(?:\/\/.*)/,/^(?:\/\*(.|\n|\r)*?\*\/)/,/^(?:\[([a-zA-Z][a-zA-Z0-9_-]*)\])/,/^(?:([a-zA-Z][a-zA-Z0-9_-]*))/,/^(?:"[^"]+")/,/^(?:'[^']+')/,/^(?::)/,/^(?:;)/,/^(?:\|)/,/^(?:%%)/,/^(?:%ebnf\b)/,/^(?:%prec\b)/,/^(?:%start\b)/,/^(?:%left\b)/,/^(?:%right\b)/,/^(?:%nonassoc\b)/,/^(?:%parse-param\b)/,/^(?:%options\b)/,/^(?:%lex[\w\W]*?\/lex\b)/,/^(?:%[a-zA-Z]+[^\r\n]*)/,/^(?:<[a-zA-Z]*>)/,/^(?:\{\{[\w\W]*?\}\})/,/^(?:%\{(.|\r|\n)*?%\})/,/^(?:\{)/,/^(?:->.*)/,/^(?:.)/,/^(?:$)/,/^(?:\/\*(.|\n|\r)*?\*\/)/,/^(?:\/\/.*)/,/^(?:\/[^ /]*?['"{}'][^ ]*?\/)/,/^(?:"(\\\\|\\"|[^"])*")/,/^(?:'(\\\\|\\'|[^'])*')/,/^(?:[/"'][^{}/"']+)/,/^(?:[^{}/"']+)/,/^(?:\{)/,/^(?:\})/,/^(?:(.|\n|\r)+)/],
	conditions: {"bnf":{"rules":[0,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],"inclusive":true},"ebnf":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],"inclusive":true},"action":{"rules":[33,34,35,36,37,38,39,40,41,42],"inclusive":false},"code":{"rules":[33,43],"inclusive":false},"INITIAL":{"rules":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],"inclusive":true}}
	};
	return lexer;
	})();
	parser.lexer = lexer;
	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();


	if (true) {
	exports.parser = bnf;
	exports.Parser = bnf.Parser;
	exports.parse = function () { return bnf.parse.apply(bnf, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(7).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(12)(module)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var EBNF = (function(){
	    var parser = __webpack_require__(40);

	    var transformExpression = function(e, opts, emit) {
	        var type = e[0], value = e[1], name = false;

	        if (type === 'xalias') {
	            type = e[1];
	            value = e[2]
	            name = e[3];
	            if (type) {
	                e = e.slice(1,2);
	            } else {
	                e = value;
	                type = e[0];
	                value = e[1];
	            }
	        }

	        if (type === 'symbol') {
	            var n;
	            if (e[1][0] === '\\') n = e[1][1];
	            else if (e[1][0] === '\'') n = e[1].substring(1, e[1].length-1);
	            else n = e[1];
	            emit(n + (name ? "["+name+"]" : ""));
	        } else if (type === "+") {
	            if (!name) {
	                name = opts.production + "_repetition_plus" + opts.repid++;
	            }
	            emit(name);

	            opts = optsForProduction(name, opts.grammar);
	            var list = transformExpressionList([value], opts);
	            opts.grammar[name] = [
	                [list, "$$ = [$1];"],
	                [
	                    name + " " + list,
	                    "$1.push($2);"
	                ]
	            ];
	        } else if (type === "*") {
	            if (!name) {
	                name = opts.production + "_repetition" + opts.repid++;
	            }
	            emit(name);

	            opts = optsForProduction(name, opts.grammar);
	            opts.grammar[name] = [
	                ["", "$$ = [];"],
	                [
	                    name + " " + transformExpressionList([value], opts),
	                    "$1.push($2);"
	                ]
	            ];
	        } else if (type ==="?") {
	            if (!name) {
	                name = opts.production + "_option" + opts.optid++;
	            }
	            emit(name);

	            opts = optsForProduction(name, opts.grammar);
	            opts.grammar[name] = [
	                "", transformExpressionList([value], opts)
	            ];
	        } else if (type === "()") {
	            if (value.length == 1) {
	                emit(transformExpressionList(value[0], opts));
	            } else {
	                if (!name) {
	                    name = opts.production + "_group" + opts.groupid++;
	                }
	                emit(name);

	                opts = optsForProduction(name, opts.grammar);
	                opts.grammar[name] = value.map(function(handle) {
	                    return transformExpressionList(handle, opts);
	                });
	            }
	        }
	    };

	    var transformExpressionList = function(list, opts) {
	        return list.reduce (function (tot, e) {
	            transformExpression (e, opts, function (i) { tot.push(i); });
	            return tot;
	        }, []).
	        join(" ");
	    };

	    var optsForProduction = function(id, grammar) {
	        return {
	            production: id,
	            repid: 0,
	            groupid: 0,
	            optid: 0,
	            grammar: grammar
	        };
	    };

	    var transformProduction = function(id, production, grammar) {
	        var transform_opts = optsForProduction(id, grammar);
	        return production.map(function (handle) {
	            var action = null, opts = null;
	            if (typeof(handle) !== 'string')
	                action = handle[1],
	                opts = handle[2],
	                handle = handle[0];
	            var expressions = parser.parse(handle);

	            handle = transformExpressionList(expressions, transform_opts);

	            var ret = [handle];
	            if (action) ret.push(action);
	            if (opts) ret.push(opts);
	            if (ret.length == 1) return ret[0];
	            else return ret;
	        });
	    };

	    var transformGrammar = function(grammar) {
	        Object.keys(grammar).forEach(function(id) {
	            grammar[id] = transformProduction(id, grammar[id], grammar);
	        });
	    };

	    return {
	        transform: function (ebnf) {
	            transformGrammar(ebnf);
	            return ebnf;
	        }
	    };
	})();

	exports.transform = EBNF.transform;



/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.11 */
	/*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var ebnf = (function(){
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"production":3,"handle":4,"EOF":5,"handle_list":6,"|":7,"expression_suffix":8,"expression":9,"suffix":10,"ALIAS":11,"symbol":12,"(":13,")":14,"*":15,"?":16,"+":17,"$accept":0,"$end":1},
	terminals_: {2:"error",5:"EOF",7:"|",11:"ALIAS",12:"symbol",13:"(",14:")",15:"*",16:"?",17:"+"},
	productions_: [0,[3,2],[6,1],[6,3],[4,0],[4,2],[8,3],[8,2],[9,1],[9,3],[10,0],[10,1],[10,1],[10,1]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */

	var $0 = $$.length - 1;
	switch (yystate) {
	case 1: return $$[$0-1]; 
	break;
	case 2: this.$ = [$$[$0]]; 
	break;
	case 3: $$[$0-2].push($$[$0]); 
	break;
	case 4: this.$ = []; 
	break;
	case 5: $$[$0-1].push($$[$0]); 
	break;
	case 6: this.$ = ['xalias', $$[$0-1], $$[$0-2], $$[$0]]; 
	break;
	case 7: if ($$[$0]) this.$ = [$$[$0], $$[$0-1]]; else this.$ = $$[$0-1]; 
	break;
	case 8: this.$ = ['symbol', $$[$0]]; 
	break;
	case 9: this.$ = ['()', $$[$0-1]]; 
	break;
	}
	},
	table: [{3:1,4:2,5:[2,4],12:[2,4],13:[2,4]},{1:[3]},{5:[1,3],8:4,9:5,12:[1,6],13:[1,7]},{1:[2,1]},{5:[2,5],7:[2,5],12:[2,5],13:[2,5],14:[2,5]},{5:[2,10],7:[2,10],10:8,11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[1,9],16:[1,10],17:[1,11]},{5:[2,8],7:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[2,8],17:[2,8]},{4:13,6:12,7:[2,4],12:[2,4],13:[2,4],14:[2,4]},{5:[2,7],7:[2,7],11:[1,14],12:[2,7],13:[2,7],14:[2,7]},{5:[2,11],7:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11]},{5:[2,12],7:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12]},{5:[2,13],7:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13]},{7:[1,16],14:[1,15]},{7:[2,2],8:4,9:5,12:[1,6],13:[1,7],14:[2,2]},{5:[2,6],7:[2,6],12:[2,6],13:[2,6],14:[2,6]},{5:[2,9],7:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[2,9],17:[2,9]},{4:17,7:[2,4],12:[2,4],13:[2,4],14:[2,4]},{7:[2,3],8:4,9:5,12:[1,6],13:[1,7],14:[2,3]}],
	defaultActions: {3:[2,1]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    this.lexer.setInput(input);
	    this.lexer.yy = this.yy;
	    this.yy.lexer = this.lexer;
	    this.yy.parser = this;
	    if (typeof this.lexer.yylloc == 'undefined') {
	        this.lexer.yylloc = {};
	    }
	    var yyloc = this.lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = this.lexer.options && this.lexer.options.ranges;
	    if (typeof this.yy.parseError === 'function') {
	        this.parseError = this.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    function lex() {
	        var token;
	        token = self.lexer.lex() || EOF;
	        if (typeof token !== 'number') {
	            token = self.symbols_[token] || token;
	        }
	        return token;
	    }
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (this.lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: this.lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: this.lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(this.lexer.yytext);
	            lstack.push(this.lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = this.lexer.yyleng;
	                yytext = this.lexer.yytext;
	                yylineno = this.lexer.yylineno;
	                yyloc = this.lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                this.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};
	/* generated by jison-lex 0.2.1 */
	var lexer = (function(){
	var lexer = {

	EOF:1,

	parseError:function parseError(str, hash) {
	        if (this.yy.parser) {
	            this.yy.parser.parseError(str, hash);
	        } else {
	            throw new Error(str);
	        }
	    },

	// resets the lexer, sets new input
	setInput:function (input) {
	        this._input = input;
	        this._more = this._backtrack = this.done = false;
	        this.yylineno = this.yyleng = 0;
	        this.yytext = this.matched = this.match = '';
	        this.conditionStack = ['INITIAL'];
	        this.yylloc = {
	            first_line: 1,
	            first_column: 0,
	            last_line: 1,
	            last_column: 0
	        };
	        if (this.options.ranges) {
	            this.yylloc.range = [0,0];
	        }
	        this.offset = 0;
	        return this;
	    },

	// consumes and returns one char from the input
	input:function () {
	        var ch = this._input[0];
	        this.yytext += ch;
	        this.yyleng++;
	        this.offset++;
	        this.match += ch;
	        this.matched += ch;
	        var lines = ch.match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno++;
	            this.yylloc.last_line++;
	        } else {
	            this.yylloc.last_column++;
	        }
	        if (this.options.ranges) {
	            this.yylloc.range[1]++;
	        }

	        this._input = this._input.slice(1);
	        return ch;
	    },

	// unshifts one char (or a string) into the input
	unput:function (ch) {
	        var len = ch.length;
	        var lines = ch.split(/(?:\r\n?|\n)/g);

	        this._input = ch + this._input;
	        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
	        //this.yyleng -= len;
	        this.offset -= len;
	        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	        this.match = this.match.substr(0, this.match.length - 1);
	        this.matched = this.matched.substr(0, this.matched.length - 1);

	        if (lines.length - 1) {
	            this.yylineno -= lines.length - 1;
	        }
	        var r = this.yylloc.range;

	        this.yylloc = {
	            first_line: this.yylloc.first_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.first_column,
	            last_column: lines ?
	                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
	                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
	              this.yylloc.first_column - len
	        };

	        if (this.options.ranges) {
	            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	        }
	        this.yyleng = this.yytext.length;
	        return this;
	    },

	// When called from action, caches matched text and appends it on next action
	more:function () {
	        this._more = true;
	        return this;
	    },

	// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	reject:function () {
	        if (this.options.backtrack_lexer) {
	            this._backtrack = true;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });

	        }
	        return this;
	    },

	// retain first n characters of the match
	less:function (n) {
	        this.unput(this.match.slice(n));
	    },

	// displays already matched input, i.e. for error messages
	pastInput:function () {
	        var past = this.matched.substr(0, this.matched.length - this.match.length);
	        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
	    },

	// displays upcoming input, i.e. for error messages
	upcomingInput:function () {
	        var next = this.match;
	        if (next.length < 20) {
	            next += this._input.substr(0, 20-next.length);
	        }
	        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	    },

	// displays the character position where the lexing error occurred, i.e. for error messages
	showPosition:function () {
	        var pre = this.pastInput();
	        var c = new Array(pre.length + 1).join("-");
	        return pre + this.upcomingInput() + "\n" + c + "^";
	    },

	// test the lexed token: return FALSE when not a match, otherwise return token
	test_match:function (match, indexed_rule) {
	        var token,
	            lines,
	            backup;

	        if (this.options.backtrack_lexer) {
	            // save context
	            backup = {
	                yylineno: this.yylineno,
	                yylloc: {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.last_line,
	                    first_column: this.yylloc.first_column,
	                    last_column: this.yylloc.last_column
	                },
	                yytext: this.yytext,
	                match: this.match,
	                matches: this.matches,
	                matched: this.matched,
	                yyleng: this.yyleng,
	                offset: this.offset,
	                _more: this._more,
	                _input: this._input,
	                yy: this.yy,
	                conditionStack: this.conditionStack.slice(0),
	                done: this.done
	            };
	            if (this.options.ranges) {
	                backup.yylloc.range = this.yylloc.range.slice(0);
	            }
	        }

	        lines = match[0].match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno += lines.length;
	        }
	        this.yylloc = {
	            first_line: this.yylloc.last_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.last_column,
	            last_column: lines ?
	                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
	                         this.yylloc.last_column + match[0].length
	        };
	        this.yytext += match[0];
	        this.match += match[0];
	        this.matches = match;
	        this.yyleng = this.yytext.length;
	        if (this.options.ranges) {
	            this.yylloc.range = [this.offset, this.offset += this.yyleng];
	        }
	        this._more = false;
	        this._backtrack = false;
	        this._input = this._input.slice(match[0].length);
	        this.matched += match[0];
	        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	        if (this.done && this._input) {
	            this.done = false;
	        }
	        if (token) {
	            return token;
	        } else if (this._backtrack) {
	            // recover context
	            for (var k in backup) {
	                this[k] = backup[k];
	            }
	            return false; // rule action called reject() implying the next rule should be tested instead.
	        }
	        return false;
	    },

	// return next match in input
	next:function () {
	        if (this.done) {
	            return this.EOF;
	        }
	        if (!this._input) {
	            this.done = true;
	        }

	        var token,
	            match,
	            tempMatch,
	            index;
	        if (!this._more) {
	            this.yytext = '';
	            this.match = '';
	        }
	        var rules = this._currentRules();
	        for (var i = 0; i < rules.length; i++) {
	            tempMatch = this._input.match(this.rules[rules[i]]);
	            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                match = tempMatch;
	                index = i;
	                if (this.options.backtrack_lexer) {
	                    token = this.test_match(tempMatch, rules[i]);
	                    if (token !== false) {
	                        return token;
	                    } else if (this._backtrack) {
	                        match = false;
	                        continue; // rule action called reject() implying a rule MISmatch.
	                    } else {
	                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                        return false;
	                    }
	                } else if (!this.options.flex) {
	                    break;
	                }
	            }
	        }
	        if (match) {
	            token = this.test_match(match, rules[index]);
	            if (token !== false) {
	                return token;
	            }
	            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	            return false;
	        }
	        if (this._input === "") {
	            return this.EOF;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	        }
	    },

	// return next match that has a token
	lex:function lex() {
	        var r = this.next();
	        if (r) {
	            return r;
	        } else {
	            return this.lex();
	        }
	    },

	// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	begin:function begin(condition) {
	        this.conditionStack.push(condition);
	    },

	// pop the previously active lexer condition state off the condition stack
	popState:function popState() {
	        var n = this.conditionStack.length - 1;
	        if (n > 0) {
	            return this.conditionStack.pop();
	        } else {
	            return this.conditionStack[0];
	        }
	    },

	// produce the lexer rule set which is active for the currently active lexer condition state
	_currentRules:function _currentRules() {
	        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	        } else {
	            return this.conditions["INITIAL"].rules;
	        }
	    },

	// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	topState:function topState(n) {
	        n = this.conditionStack.length - 1 - Math.abs(n || 0);
	        if (n >= 0) {
	            return this.conditionStack[n];
	        } else {
	            return "INITIAL";
	        }
	    },

	// alias for begin(condition)
	pushState:function pushState(condition) {
	        this.begin(condition);
	    },

	// return the number of states currently on the stack
	stateStackSize:function stateStackSize() {
	        return this.conditionStack.length;
	    },
	options: {},
	performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

	var YYSTATE=YY_START;
	switch($avoiding_name_collisions) {
	case 0:/* skip whitespace */
	break;
	case 1:return 12;
	break;
	case 2:yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 11;
	break;
	case 3:return 12;
	break;
	case 4:return 12;
	break;
	case 5:return 'bar';
	break;
	case 6:return 13;
	break;
	case 7:return 14;
	break;
	case 8:return 15;
	break;
	case 9:return 16;
	break;
	case 10:return 7;
	break;
	case 11:return 17;
	break;
	case 12:return 5;
	break;
	}
	},
	rules: [/^(?:\s+)/,/^(?:([a-zA-Z][a-zA-Z0-9_-]*))/,/^(?:\[([a-zA-Z][a-zA-Z0-9_-]*)\])/,/^(?:'[^']*')/,/^(?:\.)/,/^(?:bar\b)/,/^(?:\()/,/^(?:\))/,/^(?:\*)/,/^(?:\?)/,/^(?:\|)/,/^(?:\+)/,/^(?:$)/],
	conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12],"inclusive":true}}
	};
	return lexer;
	})();
	parser.lexer = lexer;
	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();


	if (true) {
	exports.parser = ebnf;
	exports.Parser = ebnf.Parser;
	exports.parse = function () { return ebnf.parse.apply(ebnf, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(7).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(12)(module)))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/*! Copyright (c) 2011, Lloyd Hilaiel, ISC License */
	/*
	 * This is the JSONSelect reference implementation, in javascript.  This
	 * code is designed to run under node.js or in a browser.  In the former
	 * case, the "public API" is exposed as properties on the `export` object,
	 * in the latter, as properties on `window.JSONSelect`.  That API is thus:
	 *
	 * Selector formating and parameter escaping:
	 *
	 * Anywhere where a string selector is selected, it may be followed by an
	 * optional array of values.  When provided, they will be escaped and
	 * inserted into the selector string properly escaped.  i.e.:
	 *
	 *   .match(':has(?)', [ 'foo' ], {}) 
	 * 
	 * would result in the seclector ':has("foo")' being matched against {}.
	 *
	 * This feature makes dynamically generated selectors more readable.
	 *
	 * .match(selector, [ values ], object)
	 *
	 *   Parses and "compiles" the selector, then matches it against the object
	 *   argument.  Matches are returned in an array.  Throws an error when
	 *   there's a problem parsing the selector.
	 *
	 * .forEach(selector, [ values ], object, callback)
	 *
	 *   Like match, but rather than returning an array, invokes the provided
	 *   callback once per match as the matches are discovered. 
	 * 
	 * .compile(selector, [ values ]) 
	 *
	 *   Parses the selector and compiles it to an internal form, and returns
	 *   an object which contains the compiled selector and has two properties:
	 *   `match` and `forEach`.  These two functions work identically to the
	 *   above, except they do not take a selector as an argument and instead
	 *   use the compiled selector.
	 *
	 *   For cases where a complex selector is repeatedly used, this method
	 *   should be faster as it will avoid recompiling the selector each time. 
	 */
	(function(exports) {

	    var // localize references
	    toString = Object.prototype.toString;

	    function jsonParse(str) {
	      try {
	          if(JSON && JSON.parse){
	              return JSON.parse(str);
	          }
	          return (new Function("return " + str))();
	      } catch(e) {
	        te("ijs", e.message);
	      }
	    }

	    // emitted error codes.
	    var errorCodes = {
	        "bop":  "binary operator expected",
	        "ee":   "expression expected",
	        "epex": "closing paren expected ')'",
	        "ijs":  "invalid json string",
	        "mcp":  "missing closing paren",
	        "mepf": "malformed expression in pseudo-function",
	        "mexp": "multiple expressions not allowed",
	        "mpc":  "multiple pseudo classes (:xxx) not allowed",
	        "nmi":  "multiple ids not allowed",
	        "pex":  "opening paren expected '('",
	        "se":   "selector expected",
	        "sex":  "string expected",
	        "sra":  "string required after '.'",
	        "uc":   "unrecognized char",
	        "ucp":  "unexpected closing paren",
	        "ujs":  "unclosed json string",
	        "upc":  "unrecognized pseudo class"
	    };

	    // throw an error message
	    function te(ec, context) {
	      throw new Error(errorCodes[ec] + ( context && " in '" + context + "'"));
	    }

	    // THE LEXER
	    var toks = {
	        psc: 1, // pseudo class
	        psf: 2, // pseudo class function
	        typ: 3, // type
	        str: 4, // string
	        ide: 5  // identifiers (or "classes", stuff after a dot)
	    };

	    // The primary lexing regular expression in jsonselect
	    var pat = new RegExp(
	        "^(?:" +
	        // (1) whitespace
	        "([\\r\\n\\t\\ ]+)|" +
	        // (2) one-char ops
	        "([~*,>\\)\\(])|" +
	        // (3) types names
	        "(string|boolean|null|array|object|number)|" +
	        // (4) pseudo classes
	        "(:(?:root|first-child|last-child|only-child))|" +
	        // (5) pseudo functions
	        "(:(?:nth-child|nth-last-child|has|expr|val|contains))|" +
	        // (6) bogusly named pseudo something or others
	        "(:\\w+)|" +
	        // (7 & 8) identifiers and JSON strings
	        "(?:(\\.)?(\\\"(?:[^\\\\\\\"]|\\\\[^\\\"])*\\\"))|" +
	        // (8) bogus JSON strings missing a trailing quote
	        "(\\\")|" +
	        // (9) identifiers (unquoted)
	        "\\.((?:[_a-zA-Z]|[^\\0-\\0177]|\\\\[^\\r\\n\\f0-9a-fA-F])(?:[_a-zA-Z0-9\\-]|[^\\u0000-\\u0177]|(?:\\\\[^\\r\\n\\f0-9a-fA-F]))*)" +
	        ")"
	    );

	    // A regular expression for matching "nth expressions" (see grammar, what :nth-child() eats)
	    var nthPat = /^\s*\(\s*(?:([+\-]?)([0-9]*)n\s*(?:([+\-])\s*([0-9]))?|(odd|even)|([+\-]?[0-9]+))\s*\)/;
	    function lex(str, off) {
	        if (!off) off = 0;
	        var m = pat.exec(str.substr(off));
	        if (!m) return undefined;
	        off+=m[0].length;
	        var a;
	        if (m[1]) a = [off, " "];
	        else if (m[2]) a = [off, m[0]];
	        else if (m[3]) a = [off, toks.typ, m[0]];
	        else if (m[4]) a = [off, toks.psc, m[0]];
	        else if (m[5]) a = [off, toks.psf, m[0]];
	        else if (m[6]) te("upc", str);
	        else if (m[8]) a = [off, m[7] ? toks.ide : toks.str, jsonParse(m[8])];
	        else if (m[9]) te("ujs", str);
	        else if (m[10]) a = [off, toks.ide, m[10].replace(/\\([^\r\n\f0-9a-fA-F])/g,"$1")];
	        return a;
	    }

	    // THE EXPRESSION SUBSYSTEM

	    var exprPat = new RegExp(
	            // skip and don't capture leading whitespace
	            "^\\s*(?:" +
	            // (1) simple vals
	            "(true|false|null)|" + 
	            // (2) numbers
	            "(-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?)|" +
	            // (3) strings
	            "(\"(?:[^\\]|\\[^\"])*\")|" +
	            // (4) the 'x' value placeholder
	            "(x)|" +
	            // (5) binops
	            "(&&|\\|\\||[\\$\\^<>!\\*]=|[=+\\-*/%<>])|" +
	            // (6) parens
	            "([\\(\\)])" +
	            ")"
	    );

	    function is(o, t) { return typeof o === t; }
	    var operators = {
	        '*':  [ 9, function(lhs, rhs) { return lhs * rhs; } ],
	        '/':  [ 9, function(lhs, rhs) { return lhs / rhs; } ],
	        '%':  [ 9, function(lhs, rhs) { return lhs % rhs; } ],
	        '+':  [ 7, function(lhs, rhs) { return lhs + rhs; } ],
	        '-':  [ 7, function(lhs, rhs) { return lhs - rhs; } ],
	        '<=': [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs <= rhs; } ],
	        '>=': [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs >= rhs; } ],
	        '$=': [ 5, function(lhs, rhs) { return is(lhs, 'string') && is(rhs, 'string') && lhs.lastIndexOf(rhs) === lhs.length - rhs.length; } ],
	        '^=': [ 5, function(lhs, rhs) { return is(lhs, 'string') && is(rhs, 'string') && lhs.indexOf(rhs) === 0; } ],
	        '*=': [ 5, function(lhs, rhs) { return is(lhs, 'string') && is(rhs, 'string') && lhs.indexOf(rhs) !== -1; } ],
	        '>':  [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs > rhs; } ],
	        '<':  [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs < rhs; } ],
	        '=':  [ 3, function(lhs, rhs) { return lhs === rhs; } ],
	        '!=': [ 3, function(lhs, rhs) { return lhs !== rhs; } ],
	        '&&': [ 2, function(lhs, rhs) { return lhs && rhs; } ],
	        '||': [ 1, function(lhs, rhs) { return lhs || rhs; } ]
	    };

	    function exprLex(str, off) {
	        var v, m = exprPat.exec(str.substr(off));
	        if (m) {
	            off += m[0].length;
	            v = m[1] || m[2] || m[3] || m[5] || m[6];
	            if (m[1] || m[2] || m[3]) return [off, 0, jsonParse(v)];
	            else if (m[4]) return [off, 0, undefined];
	            return [off, v];
	        }
	    }

	    function exprParse2(str, off) {
	        if (!off) off = 0;
	        // first we expect a value or a '('
	        var l = exprLex(str, off),
	            lhs;
	        if (l && l[1] === '(') {
	            lhs = exprParse2(str, l[0]);
	            var p = exprLex(str, lhs[0]);
	            if (!p || p[1] !== ')') te('epex', str);
	            off = p[0];
	            lhs = [ '(', lhs[1] ];
	        } else if (!l || (l[1] && l[1] != 'x')) {
	            te("ee", str + " - " + ( l[1] && l[1] ));
	        } else {
	            lhs = ((l[1] === 'x') ? undefined : l[2]);
	            off = l[0];
	        }

	        // now we expect a binary operator or a ')'
	        var op = exprLex(str, off);
	        if (!op || op[1] == ')') return [off, lhs];
	        else if (op[1] == 'x' || !op[1]) {
	            te('bop', str + " - " + ( op[1] && op[1] ));
	        }

	        // tail recursion to fetch the rhs expression
	        var rhs = exprParse2(str, op[0]);
	        off = rhs[0];
	        rhs = rhs[1];

	        // and now precedence!  how shall we put everything together?
	        var v;
	        if (typeof rhs !== 'object' || rhs[0] === '(' || operators[op[1]][0] < operators[rhs[1]][0] ) {
	            v = [lhs, op[1], rhs];
	        }
	        else {
	            v = rhs;
	            while (typeof rhs[0] === 'object' && rhs[0][0] != '(' && operators[op[1]][0] >= operators[rhs[0][1]][0]) {
	                rhs = rhs[0];
	            }
	            rhs[0] = [lhs, op[1], rhs[0]];
	        }
	        return [off, v];
	    }

	    function exprParse(str, off) {
	        function deparen(v) {
	            if (typeof v !== 'object' || v === null) return v;
	            else if (v[0] === '(') return deparen(v[1]);
	            else return [deparen(v[0]), v[1], deparen(v[2])];
	        }
	        var e = exprParse2(str, off ? off : 0);
	        return [e[0], deparen(e[1])];
	    }

	    function exprEval(expr, x) {
	        if (expr === undefined) return x;
	        else if (expr === null || typeof expr !== 'object') {
	            return expr;
	        }
	        var lhs = exprEval(expr[0], x),
	            rhs = exprEval(expr[2], x);
	        return operators[expr[1]][1](lhs, rhs);
	    }

	    // THE PARSER

	    function parse(str, off, nested, hints) {
	        if (!nested) hints = {};

	        var a = [], am, readParen;
	        if (!off) off = 0; 

	        while (true) {
	            var s = parse_selector(str, off, hints);
	            a.push(s[1]);
	            s = lex(str, off = s[0]);
	            if (s && s[1] === " ") s = lex(str, off = s[0]);
	            if (!s) break;
	            // now we've parsed a selector, and have something else...
	            if (s[1] === ">" || s[1] === "~") {
	                if (s[1] === "~") hints.usesSiblingOp = true;
	                a.push(s[1]);
	                off = s[0];
	            } else if (s[1] === ",") {
	                if (am === undefined) am = [ ",", a ];
	                else am.push(a);
	                a = [];
	                off = s[0];
	            } else if (s[1] === ")") {
	                if (!nested) te("ucp", s[1]);
	                readParen = 1;
	                off = s[0];
	                break;
	            }
	        }
	        if (nested && !readParen) te("mcp", str);
	        if (am) am.push(a);
	        var rv;
	        if (!nested && hints.usesSiblingOp) {
	            rv = normalize(am ? am : a);
	        } else {
	            rv = am ? am : a;
	        }
	        return [off, rv];
	    }

	    function normalizeOne(sel) {
	        var sels = [], s;
	        for (var i = 0; i < sel.length; i++) {
	            if (sel[i] === '~') {
	                // `A ~ B` maps to `:has(:root > A) > B`
	                // `Z A ~ B` maps to `Z :has(:root > A) > B, Z:has(:root > A) > B`
	                // This first clause, takes care of the first case, and the first half of the latter case.
	                if (i < 2 || sel[i-2] != '>') {
	                    s = sel.slice(0,i-1);
	                    s = s.concat([{has:[[{pc: ":root"}, ">", sel[i-1]]]}, ">"]);
	                    s = s.concat(sel.slice(i+1));
	                    sels.push(s);
	                }
	                // here we take care of the second half of above:
	                // (`Z A ~ B` maps to `Z :has(:root > A) > B, Z :has(:root > A) > B`)
	                // and a new case:
	                // Z > A ~ B maps to Z:has(:root > A) > B
	                if (i > 1) {
	                    var at = sel[i-2] === '>' ? i-3 : i-2;
	                    s = sel.slice(0,at);
	                    var z = {};
	                    for (var k in sel[at]) if (sel[at].hasOwnProperty(k)) z[k] = sel[at][k];
	                    if (!z.has) z.has = [];
	                    z.has.push([{pc: ":root"}, ">", sel[i-1]]);
	                    s = s.concat(z, '>', sel.slice(i+1));
	                    sels.push(s);
	                }
	                break;
	            }
	        }
	        if (i == sel.length) return sel;
	        return sels.length > 1 ? [','].concat(sels) : sels[0];
	    }

	    function normalize(sels) {
	        if (sels[0] === ',') {
	            var r = [","];
	            for (var i = i; i < sels.length; i++) {
	                var s = normalizeOne(s[i]);
	                r = r.concat(s[0] === "," ? s.slice(1) : s);
	            }
	            return r;
	        } else {
	            return normalizeOne(sels);
	        }
	    }

	    function parse_selector(str, off, hints) {
	        var soff = off;
	        var s = { };
	        var l = lex(str, off);
	        // skip space
	        if (l && l[1] === " ") { soff = off = l[0]; l = lex(str, off); }
	        if (l && l[1] === toks.typ) {
	            s.type = l[2];
	            l = lex(str, (off = l[0]));
	        } else if (l && l[1] === "*") {
	            // don't bother representing the universal sel, '*' in the
	            // parse tree, cause it's the default
	            l = lex(str, (off = l[0]));
	        }

	        // now support either an id or a pc
	        while (true) {
	            if (l === undefined) {
	                break;
	            } else if (l[1] === toks.ide) {
	                if (s.id) te("nmi", l[1]);
	                s.id = l[2];
	            } else if (l[1] === toks.psc) {
	                if (s.pc || s.pf) te("mpc", l[1]);
	                // collapse first-child and last-child into nth-child expressions
	                if (l[2] === ":first-child") {
	                    s.pf = ":nth-child";
	                    s.a = 0;
	                    s.b = 1;
	                } else if (l[2] === ":last-child") {
	                    s.pf = ":nth-last-child";
	                    s.a = 0;
	                    s.b = 1;
	                } else {
	                    s.pc = l[2];
	                }
	            } else if (l[1] === toks.psf) {
	                if (l[2] === ":val" || l[2] === ":contains") {
	                    s.expr = [ undefined, l[2] === ":val" ? "=" : "*=", undefined];
	                    // any amount of whitespace, followed by paren, string, paren
	                    l = lex(str, (off = l[0]));
	                    if (l && l[1] === " ") l = lex(str, off = l[0]);
	                    if (!l || l[1] !== "(") te("pex", str);
	                    l = lex(str, (off = l[0]));
	                    if (l && l[1] === " ") l = lex(str, off = l[0]);
	                    if (!l || l[1] !== toks.str) te("sex", str);
	                    s.expr[2] = l[2];
	                    l = lex(str, (off = l[0]));
	                    if (l && l[1] === " ") l = lex(str, off = l[0]);
	                    if (!l || l[1] !== ")") te("epex", str);
	                } else if (l[2] === ":has") {
	                    // any amount of whitespace, followed by paren
	                    l = lex(str, (off = l[0]));
	                    if (l && l[1] === " ") l = lex(str, off = l[0]);
	                    if (!l || l[1] !== "(") te("pex", str);
	                    var h = parse(str, l[0], true);
	                    l[0] = h[0];
	                    if (!s.has) s.has = [];
	                    s.has.push(h[1]);
	                } else if (l[2] === ":expr") {
	                    if (s.expr) te("mexp", str);
	                    var e = exprParse(str, l[0]);
	                    l[0] = e[0];
	                    s.expr = e[1];
	                } else {
	                    if (s.pc || s.pf ) te("mpc", str);
	                    s.pf = l[2];
	                    var m = nthPat.exec(str.substr(l[0]));
	                    if (!m) te("mepf", str);
	                    if (m[5]) {
	                        s.a = 2;
	                        s.b = (m[5] === "odd") ? 1 : 0;
	                    } else if (m[6]) {
	                        s.a = 0;
	                        s.b = parseInt(m[6], 10);
	                    } else {
	                        s.a = parseInt((m[1] ? m[1] : "+") + (m[2] ? m[2] : "1"),10);
	                        s.b = m[3] ? parseInt(m[3] + m[4],10) : 0;
	                    }
	                    l[0] += m[0].length;
	                }
	            } else {
	                break;
	            }
	            l = lex(str, (off = l[0]));
	        }

	        // now if we didn't actually parse anything it's an error
	        if (soff === off) te("se", str);

	        return [off, s];
	    }

	    // THE EVALUATOR

	    function isArray(o) {
	        return Array.isArray ? Array.isArray(o) : 
	          toString.call(o) === "[object Array]";
	    }

	    function mytypeof(o) {
	        if (o === null) return "null";
	        var to = typeof o;
	        if (to === "object" && isArray(o)) to = "array";
	        return to;
	    }

	    function mn(node, sel, id, num, tot) {
	        var sels = [];
	        var cs = (sel[0] === ">") ? sel[1] : sel[0];
	        var m = true, mod;
	        if (cs.type) m = m && (cs.type === mytypeof(node));
	        if (cs.id)   m = m && (cs.id === id);
	        if (m && cs.pf) {
	            if (cs.pf === ":nth-last-child") num = tot - num;
	            else num++;
	            if (cs.a === 0) {
	                m = cs.b === num;
	            } else {
	                mod = ((num - cs.b) % cs.a);

	                m = (!mod && ((num*cs.a + cs.b) >= 0));
	            }
	        }
	        if (m && cs.has) {
	            // perhaps we should augment forEach to handle a return value
	            // that indicates "client cancels traversal"?
	            var bail = function() { throw 42; };
	            for (var i = 0; i < cs.has.length; i++) {
	                try {
	                    forEach(cs.has[i], node, bail);
	                } catch (e) {
	                    if (e === 42) continue;
	                }
	                m = false;
	                break;
	            }
	        }
	        if (m && cs.expr) {
	            m = exprEval(cs.expr, node);
	        }
	        // should we repeat this selector for descendants?
	        if (sel[0] !== ">" && sel[0].pc !== ":root") sels.push(sel);

	        if (m) {
	            // is there a fragment that we should pass down?
	            if (sel[0] === ">") { if (sel.length > 2) { m = false; sels.push(sel.slice(2)); } }
	            else if (sel.length > 1) { m = false; sels.push(sel.slice(1)); }
	        }

	        return [m, sels];
	    }

	    function forEach(sel, obj, fun, id, num, tot) {
	        var a = (sel[0] === ",") ? sel.slice(1) : [sel],
	        a0 = [],
	        call = false,
	        i = 0, j = 0, k, x;
	        for (i = 0; i < a.length; i++) {
	            x = mn(obj, a[i], id, num, tot);
	            if (x[0]) {
	                call = true;
	            }
	            for (j = 0; j < x[1].length; j++) {
	                a0.push(x[1][j]);
	            }
	        }
	        if (a0.length && typeof obj === "object") {
	            if (a0.length >= 1) {
	                a0.unshift(",");
	            }
	            if (isArray(obj)) {
	                for (i = 0; i < obj.length; i++) {
	                    forEach(a0, obj[i], fun, undefined, i, obj.length);
	                }
	            } else {
	                for (k in obj) {
	                    if (obj.hasOwnProperty(k)) {
	                        forEach(a0, obj[k], fun, k);
	                    }
	                }
	            }
	        }
	        if (call && fun) {
	            fun(obj);
	        }
	    }

	    function match(sel, obj) {
	        var a = [];
	        forEach(sel, obj, function(x) {
	            a.push(x);
	        });
	        return a;
	    }

	    function format(sel, arr) {
	        sel = sel.replace(/\?/g, function() {
	            if (arr.length === 0) throw "too few parameters given";
	            var p = arr.shift();
	            return ((typeof p === 'string') ? JSON.stringify(p) : p);
	        });
	        if (arr.length) throw "too many parameters supplied";
	        return sel;
	    } 

	    function compile(sel, arr) {
	        if (arr) sel = format(sel, arr);
	        return {
	            sel: parse(sel)[1],
	            match: function(obj){
	                return match(this.sel, obj);
	            },
	            forEach: function(obj, fun) {
	                return forEach(this.sel, obj, fun);
	            }
	        };
	    }

	    exports._lex = lex;
	    exports._parse = parse;
	    exports.match = function (sel, arr, obj) {
	        if (!obj) { obj = arr; arr = undefined; }
	        return compile(sel, arr).match(obj);
	    };
	    exports.forEach = function(sel, arr, obj, fun) {
	        if (!fun) { fun = obj;  obj = arr; arr = undefined }
	        return compile(sel, arr).forEach(obj, fun);
	    };
	    exports.compile = compile;
	})(false ? (window.JSONSelect = {}) : exports);


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
	  Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
	  Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
	  Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
	  Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	/*global exports:true, generateStatement:true, generateExpression:true, require:true, global:true*/
	(function () {
	    'use strict';

	    var Syntax,
	        Precedence,
	        BinaryPrecedence,
	        SourceNode,
	        estraverse,
	        esutils,
	        isArray,
	        base,
	        indent,
	        json,
	        renumber,
	        hexadecimal,
	        quotes,
	        escapeless,
	        newline,
	        space,
	        parentheses,
	        semicolons,
	        safeConcatenation,
	        directive,
	        extra,
	        parse,
	        sourceMap,
	        FORMAT_MINIFY,
	        FORMAT_DEFAULTS;

	    estraverse = __webpack_require__(43);
	    esutils = __webpack_require__(44);

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ComprehensionBlock: 'ComprehensionBlock',
	        ComprehensionExpression: 'ComprehensionExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportDeclaration: 'ExportDeclaration',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        GeneratorExpression: 'GeneratorExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };

	    Precedence = {
	        Sequence: 0,
	        Yield: 1,
	        Assignment: 1,
	        Conditional: 2,
	        ArrowFunction: 2,
	        LogicalOR: 3,
	        LogicalAND: 4,
	        BitwiseOR: 5,
	        BitwiseXOR: 6,
	        BitwiseAND: 7,
	        Equality: 8,
	        Relational: 9,
	        BitwiseSHIFT: 10,
	        Additive: 11,
	        Multiplicative: 12,
	        Unary: 13,
	        Postfix: 14,
	        Call: 15,
	        New: 16,
	        Member: 17,
	        Primary: 18
	    };

	    BinaryPrecedence = {
	        '||': Precedence.LogicalOR,
	        '&&': Precedence.LogicalAND,
	        '|': Precedence.BitwiseOR,
	        '^': Precedence.BitwiseXOR,
	        '&': Precedence.BitwiseAND,
	        '==': Precedence.Equality,
	        '!=': Precedence.Equality,
	        '===': Precedence.Equality,
	        '!==': Precedence.Equality,
	        'is': Precedence.Equality,
	        'isnt': Precedence.Equality,
	        '<': Precedence.Relational,
	        '>': Precedence.Relational,
	        '<=': Precedence.Relational,
	        '>=': Precedence.Relational,
	        'in': Precedence.Relational,
	        'instanceof': Precedence.Relational,
	        '<<': Precedence.BitwiseSHIFT,
	        '>>': Precedence.BitwiseSHIFT,
	        '>>>': Precedence.BitwiseSHIFT,
	        '+': Precedence.Additive,
	        '-': Precedence.Additive,
	        '*': Precedence.Multiplicative,
	        '%': Precedence.Multiplicative,
	        '/': Precedence.Multiplicative
	    };

	    function getDefaultOptions() {
	        // default options
	        return {
	            indent: null,
	            base: null,
	            parse: null,
	            comment: false,
	            format: {
	                indent: {
	                    style: '    ',
	                    base: 0,
	                    adjustMultilineComment: false
	                },
	                newline: '\n',
	                space: ' ',
	                json: false,
	                renumber: false,
	                hexadecimal: false,
	                quotes: 'single',
	                escapeless: false,
	                compact: false,
	                parentheses: true,
	                semicolons: true,
	                safeConcatenation: false
	            },
	            moz: {
	                comprehensionExpressionStartsWithAssignment: false,
	                starlessGenerator: false,
	                parenthesizedComprehensionBlock: false
	            },
	            sourceMap: null,
	            sourceMapRoot: null,
	            sourceMapWithCode: false,
	            directive: false,
	            raw: true,
	            verbatim: null
	        };
	    }

	    function stringRepeat(str, num) {
	        var result = '';

	        for (num |= 0; num > 0; num >>>= 1, str += str) {
	            if (num & 1) {
	                result += str;
	            }
	        }

	        return result;
	    }

	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }

	    function hasLineTerminator(str) {
	        return (/[\r\n]/g).test(str);
	    }

	    function endsWithLineTerminator(str) {
	        var len = str.length;
	        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
	    }

	    function updateDeeply(target, override) {
	        var key, val;

	        function isHashObject(target) {
	            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
	        }

	        for (key in override) {
	            if (override.hasOwnProperty(key)) {
	                val = override[key];
	                if (isHashObject(val)) {
	                    if (isHashObject(target[key])) {
	                        updateDeeply(target[key], val);
	                    } else {
	                        target[key] = updateDeeply({}, val);
	                    }
	                } else {
	                    target[key] = val;
	                }
	            }
	        }
	        return target;
	    }

	    function generateNumber(value) {
	        var result, point, temp, exponent, pos;

	        if (value !== value) {
	            throw new Error('Numeric literal whose value is NaN');
	        }
	        if (value < 0 || (value === 0 && 1 / value < 0)) {
	            throw new Error('Numeric literal whose value is negative');
	        }

	        if (value === 1 / 0) {
	            return json ? 'null' : renumber ? '1e400' : '1e+400';
	        }

	        result = '' + value;
	        if (!renumber || result.length < 3) {
	            return result;
	        }

	        point = result.indexOf('.');
	        if (!json && result.charCodeAt(0) === 0x30  /* 0 */ && point === 1) {
	            point = 0;
	            result = result.slice(1);
	        }
	        temp = result;
	        result = result.replace('e+', 'e');
	        exponent = 0;
	        if ((pos = temp.indexOf('e')) > 0) {
	            exponent = +temp.slice(pos + 1);
	            temp = temp.slice(0, pos);
	        }
	        if (point >= 0) {
	            exponent -= temp.length - point - 1;
	            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
	        }
	        pos = 0;
	        while (temp.charCodeAt(temp.length + pos - 1) === 0x30  /* 0 */) {
	            --pos;
	        }
	        if (pos !== 0) {
	            exponent -= pos;
	            temp = temp.slice(0, pos);
	        }
	        if (exponent !== 0) {
	            temp += 'e' + exponent;
	        }
	        if ((temp.length < result.length ||
	                    (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
	                +temp === value) {
	            result = temp;
	        }

	        return result;
	    }

	    // Generate valid RegExp expression.
	    // This function is based on https://github.com/Constellation/iv Engine

	    function escapeRegExpCharacter(ch, previousIsBackslash) {
	        // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
	        if ((ch & ~1) === 0x2028) {
	            return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
	        } else if (ch === 10 || ch === 13) {  // \n, \r
	            return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
	        }
	        return String.fromCharCode(ch);
	    }

	    function generateRegExp(reg) {
	        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

	        result = reg.toString();

	        if (reg.source) {
	            // extract flag from toString result
	            match = result.match(/\/([^/]*)$/);
	            if (!match) {
	                return result;
	            }

	            flags = match[1];
	            result = '';

	            characterInBrack = false;
	            previousIsBackslash = false;
	            for (i = 0, iz = reg.source.length; i < iz; ++i) {
	                ch = reg.source.charCodeAt(i);

	                if (!previousIsBackslash) {
	                    if (characterInBrack) {
	                        if (ch === 93) {  // ]
	                            characterInBrack = false;
	                        }
	                    } else {
	                        if (ch === 47) {  // /
	                            result += '\\';
	                        } else if (ch === 91) {  // [
	                            characterInBrack = true;
	                        }
	                    }
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    previousIsBackslash = ch === 92;  // \
	                } else {
	                    // if new RegExp("\\\n') is provided, create /\n/
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    // prevent like /\\[/]/
	                    previousIsBackslash = false;
	                }
	            }

	            return '/' + result + '/' + flags;
	        }

	        return result;
	    }

	    function escapeAllowedCharacter(code, next) {
	        var hex, result = '\\';

	        switch (code) {
	        case 0x08  /* \b */:
	            result += 'b';
	            break;
	        case 0x0C  /* \f */:
	            result += 'f';
	            break;
	        case 0x09  /* \t */:
	            result += 't';
	            break;
	        default:
	            hex = code.toString(16).toUpperCase();
	            if (json || code > 0xFF) {
	                result += 'u' + '0000'.slice(hex.length) + hex;
	            } else if (code === 0x0000 && !esutils.code.isDecimalDigit(next)) {
	                result += '0';
	            } else if (code === 0x000B  /* \v */) { // '\v'
	                result += 'x0B';
	            } else {
	                result += 'x' + '00'.slice(hex.length) + hex;
	            }
	            break;
	        }

	        return result;
	    }

	    function escapeDisallowedCharacter(code) {
	        var result = '\\';
	        switch (code) {
	        case 0x5C  /* \ */:
	            result += '\\';
	            break;
	        case 0x0A  /* \n */:
	            result += 'n';
	            break;
	        case 0x0D  /* \r */:
	            result += 'r';
	            break;
	        case 0x2028:
	            result += 'u2028';
	            break;
	        case 0x2029:
	            result += 'u2029';
	            break;
	        default:
	            throw new Error('Incorrectly classified character');
	        }

	        return result;
	    }

	    function escapeDirective(str) {
	        var i, iz, code, quote;

	        quote = quotes === 'double' ? '"' : '\'';
	        for (i = 0, iz = str.length; i < iz; ++i) {
	            code = str.charCodeAt(i);
	            if (code === 0x27  /* ' */) {
	                quote = '"';
	                break;
	            } else if (code === 0x22  /* " */) {
	                quote = '\'';
	                break;
	            } else if (code === 0x5C  /* \ */) {
	                ++i;
	            }
	        }

	        return quote + str + quote;
	    }

	    function escapeString(str) {
	        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;

	        for (i = 0, len = str.length; i < len; ++i) {
	            code = str.charCodeAt(i);
	            if (code === 0x27  /* ' */) {
	                ++singleQuotes;
	            } else if (code === 0x22  /* " */) {
	                ++doubleQuotes;
	            } else if (code === 0x2F  /* / */ && json) {
	                result += '\\';
	            } else if (esutils.code.isLineTerminator(code) || code === 0x5C  /* \ */) {
	                result += escapeDisallowedCharacter(code);
	                continue;
	            } else if ((json && code < 0x20  /* SP */) || !(json || escapeless || (code >= 0x20  /* SP */ && code <= 0x7E  /* ~ */))) {
	                result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
	                continue;
	            }
	            result += String.fromCharCode(code);
	        }

	        single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
	        quote = single ? '\'' : '"';

	        if (!(single ? singleQuotes : doubleQuotes)) {
	            return quote + result + quote;
	        }

	        str = result;
	        result = quote;

	        for (i = 0, len = str.length; i < len; ++i) {
	            code = str.charCodeAt(i);
	            if ((code === 0x27  /* ' */ && single) || (code === 0x22  /* " */ && !single)) {
	                result += '\\';
	            }
	            result += String.fromCharCode(code);
	        }

	        return result + quote;
	    }

	    /**
	     * flatten an array to a string, where the array can contain
	     * either strings or nested arrays
	     */
	    function flattenToString(arr) {
	        var i, iz, elem, result = '';
	        for (i = 0, iz = arr.length; i < iz; ++i) {
	            elem = arr[i];
	            result += isArray(elem) ? flattenToString(elem) : elem;
	        }
	        return result;
	    }

	    /**
	     * convert generated to a SourceNode when source maps are enabled.
	     */
	    function toSourceNodeWhenNeeded(generated, node) {
	        if (!sourceMap) {
	            // with no source maps, generated is either an
	            // array or a string.  if an array, flatten it.
	            // if a string, just return it
	            if (isArray(generated)) {
	                return flattenToString(generated);
	            } else {
	                return generated;
	            }
	        }
	        if (node == null) {
	            if (generated instanceof SourceNode) {
	                return generated;
	            } else {
	                node = {};
	            }
	        }
	        if (node.loc == null) {
	            return new SourceNode(null, null, sourceMap, generated, node.name || null);
	        }
	        return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap === true ? node.loc.source || null : sourceMap), generated, node.name || null);
	    }

	    function noEmptySpace() {
	        return (space) ? space : ' ';
	    }

	    function join(left, right) {
	        var leftSource = toSourceNodeWhenNeeded(left).toString(),
	            rightSource = toSourceNodeWhenNeeded(right).toString(),
	            leftCharCode = leftSource.charCodeAt(leftSource.length - 1),
	            rightCharCode = rightSource.charCodeAt(0);

	        if ((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode ||
	        esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode) ||
	        leftCharCode === 0x2F  /* / */ && rightCharCode === 0x69  /* i */) { // infix word operators all start with `i`
	            return [left, noEmptySpace(), right];
	        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) ||
	                esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
	            return [left, right];
	        }
	        return [left, space, right];
	    }

	    function addIndent(stmt) {
	        return [base, stmt];
	    }

	    function withIndent(fn) {
	        var previousBase, result;
	        previousBase = base;
	        base += indent;
	        result = fn.call(this, base);
	        base = previousBase;
	        return result;
	    }

	    function calculateSpaces(str) {
	        var i;
	        for (i = str.length - 1; i >= 0; --i) {
	            if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
	                break;
	            }
	        }
	        return (str.length - 1) - i;
	    }

	    function adjustMultilineComment(value, specialBase) {
	        var array, i, len, line, j, spaces, previousBase, sn;

	        array = value.split(/\r\n|[\r\n]/);
	        spaces = Number.MAX_VALUE;

	        // first line doesn't have indentation
	        for (i = 1, len = array.length; i < len; ++i) {
	            line = array[i];
	            j = 0;
	            while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
	                ++j;
	            }
	            if (spaces > j) {
	                spaces = j;
	            }
	        }

	        if (typeof specialBase !== 'undefined') {
	            // pattern like
	            // {
	            //   var t = 20;  /*
	            //                 * this is comment
	            //                 */
	            // }
	            previousBase = base;
	            if (array[1][spaces] === '*') {
	                specialBase += ' ';
	            }
	            base = specialBase;
	        } else {
	            if (spaces & 1) {
	                // /*
	                //  *
	                //  */
	                // If spaces are odd number, above pattern is considered.
	                // We waste 1 space.
	                --spaces;
	            }
	            previousBase = base;
	        }

	        for (i = 1, len = array.length; i < len; ++i) {
	            sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
	            array[i] = sourceMap ? sn.join('') : sn;
	        }

	        base = previousBase;

	        return array.join('\n');
	    }

	    function generateComment(comment, specialBase) {
	        if (comment.type === 'Line') {
	            if (endsWithLineTerminator(comment.value)) {
	                return '//' + comment.value;
	            } else {
	                // Always use LineTerminator
	                return '//' + comment.value + '\n';
	            }
	        }
	        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
	            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
	        }
	        return '/*' + comment.value + '*/';
	    }

	    function addComments(stmt, result) {
	        var i, len, comment, save, tailingToStatement, specialBase, fragment;

	        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
	            save = result;

	            comment = stmt.leadingComments[0];
	            result = [];
	            if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
	                result.push('\n');
	            }
	            result.push(generateComment(comment));
	            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push('\n');
	            }

	            for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
	                comment = stmt.leadingComments[i];
	                fragment = [generateComment(comment)];
	                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    fragment.push('\n');
	                }
	                result.push(addIndent(fragment));
	            }

	            result.push(addIndent(save));
	        }

	        if (stmt.trailingComments) {
	            tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
	            specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
	            for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
	                comment = stmt.trailingComments[i];
	                if (tailingToStatement) {
	                    // We assume target like following script
	                    //
	                    // var t = 20;  /**
	                    //               * This is comment of t
	                    //               */
	                    if (i === 0) {
	                        // first case
	                        result = [result, indent];
	                    } else {
	                        result = [result, specialBase];
	                    }
	                    result.push(generateComment(comment, specialBase));
	                } else {
	                    result = [result, addIndent(generateComment(comment))];
	                }
	                if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                    result = [result, '\n'];
	                }
	            }
	        }

	        return result;
	    }

	    function parenthesize(text, current, should) {
	        if (current < should) {
	            return ['(', text, ')'];
	        }
	        return text;
	    }

	    function maybeBlock(stmt, semicolonOptional, functionBody) {
	        var result, noLeadingComment;

	        noLeadingComment = !extra.comment || !stmt.leadingComments;

	        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
	            return [space, generateStatement(stmt, { functionBody: functionBody })];
	        }

	        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
	            return ';';
	        }

	        withIndent(function () {
	            result = [newline, addIndent(generateStatement(stmt, { semicolonOptional: semicolonOptional, functionBody: functionBody }))];
	        });

	        return result;
	    }

	    function maybeBlockSuffix(stmt, result) {
	        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
	        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
	            return [result, space];
	        }
	        if (ends) {
	            return [result, base];
	        }
	        return [result, newline, base];
	    }

	    function generateVerbatimString(string) {
	        var i, iz, result;
	        result = string.split(/\r\n|\n/);
	        for (i = 1, iz = result.length; i < iz; i++) {
	            result[i] = newline + base + result[i];
	        }
	        return result;
	    }

	    function generateVerbatim(expr, option) {
	        var verbatim, result, prec;
	        verbatim = expr[extra.verbatim];

	        if (typeof verbatim === 'string') {
	            result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, option.precedence);
	        } else {
	            // verbatim is object
	            result = generateVerbatimString(verbatim.content);
	            prec = (verbatim.precedence != null) ? verbatim.precedence : Precedence.Sequence;
	            result = parenthesize(result, prec, option.precedence);
	        }

	        return toSourceNodeWhenNeeded(result, expr);
	    }

	    function generateIdentifier(node) {
	        return toSourceNodeWhenNeeded(node.name, node);
	    }

	    function generatePattern(node, options) {
	        var result;

	        if (node.type === Syntax.Identifier) {
	            result = generateIdentifier(node);
	        } else {
	            result = generateExpression(node, {
	                precedence: options.precedence,
	                allowIn: options.allowIn,
	                allowCall: true
	            });
	        }

	        return result;
	    }

	    function generateFunctionBody(node) {
	        var result, i, len, expr, arrow;

	        arrow = node.type === Syntax.ArrowFunctionExpression;

	        if (arrow && node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
	            // arg => { } case
	            result = [generateIdentifier(node.params[0])];
	        } else {
	            result = ['('];
	            for (i = 0, len = node.params.length; i < len; ++i) {
	                result.push(generatePattern(node.params[i], {
	                    precedence: Precedence.Assignment,
	                    allowIn: true
	                }));
	                if (i + 1 < len) {
	                    result.push(',' + space);
	                }
	            }
	            result.push(')');
	        }

	        if (arrow) {
	            result.push(space);
	            result.push('=>');
	        }

	        if (node.expression) {
	            result.push(space);
	            expr = generateExpression(node.body, {
	                precedence: Precedence.Assignment,
	                allowIn: true,
	                allowCall: true
	            });
	            if (expr.toString().charAt(0) === '{') {
	                expr = ['(', expr, ')'];
	            }
	            result.push(expr);
	        } else {
	            result.push(maybeBlock(node.body, false, true));
	        }
	        return result;
	    }

	    function generateIterationForStatement(operator, stmt, semicolonIsNotNeeded) {
	        var result = ['for' + space + '('];
	        withIndent(function () {
	            if (stmt.left.type === Syntax.VariableDeclaration) {
	                withIndent(function () {
	                    result.push(stmt.left.kind + noEmptySpace());
	                    result.push(generateStatement(stmt.left.declarations[0], {
	                        allowIn: false
	                    }));
	                });
	            } else {
	                result.push(generateExpression(stmt.left, {
	                    precedence: Precedence.Call,
	                    allowIn: true,
	                    allowCall: true
	                }));
	            }

	            result = join(result, operator);
	            result = [join(
	                result,
	                generateExpression(stmt.right, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true
	                })
	            ), ')'];
	        });
	        result.push(maybeBlock(stmt.body, semicolonIsNotNeeded));
	        return result;
	    }

	    function generateLiteral(expr) {
	        var raw;
	        if (expr.hasOwnProperty('raw') && parse && extra.raw) {
	            try {
	                raw = parse(expr.raw).body[0].expression;
	                if (raw.type === Syntax.Literal) {
	                    if (raw.value === expr.value) {
	                        return expr.raw;
	                    }
	                }
	            } catch (e) {
	                // not use raw property
	            }
	        }

	        if (expr.value === null) {
	            return 'null';
	        }

	        if (typeof expr.value === 'string') {
	            return escapeString(expr.value);
	        }

	        if (typeof expr.value === 'number') {
	            return generateNumber(expr.value);
	        }

	        if (typeof expr.value === 'boolean') {
	            return expr.value ? 'true' : 'false';
	        }

	        return generateRegExp(expr.value);
	    }

	    function generateExpression(expr, option) {
	        var result,
	            precedence,
	            type,
	            currentPrecedence,
	            i,
	            len,
	            fragment,
	            multiline,
	            leftCharCode,
	            leftSource,
	            rightCharCode,
	            allowIn,
	            allowCall,
	            allowUnparenthesizedNew,
	            property,
	            isGenerator;

	        precedence = option.precedence;
	        allowIn = option.allowIn;
	        allowCall = option.allowCall;
	        type = expr.type || option.type;

	        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
	            return generateVerbatim(expr, option);
	        }

	        switch (type) {
	        case Syntax.SequenceExpression:
	            result = [];
	            allowIn |= (Precedence.Sequence < precedence);
	            for (i = 0, len = expr.expressions.length; i < len; ++i) {
	                result.push(generateExpression(expr.expressions[i], {
	                    precedence: Precedence.Assignment,
	                    allowIn: allowIn,
	                    allowCall: true
	                }));
	                if (i + 1 < len) {
	                    result.push(',' + space);
	                }
	            }
	            result = parenthesize(result, Precedence.Sequence, precedence);
	            break;

	        case Syntax.AssignmentExpression:
	            allowIn |= (Precedence.Assignment < precedence);
	            result = parenthesize(
	                [
	                    generateExpression(expr.left, {
	                        precedence: Precedence.Call,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space + expr.operator + space,
	                    generateExpression(expr.right, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    })
	                ],
	                Precedence.Assignment,
	                precedence
	            );
	            break;

	        case Syntax.ArrowFunctionExpression:
	            allowIn |= (Precedence.ArrowFunction < precedence);
	            result = parenthesize(generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
	            break;

	        case Syntax.ConditionalExpression:
	            allowIn |= (Precedence.Conditional < precedence);
	            result = parenthesize(
	                [
	                    generateExpression(expr.test, {
	                        precedence: Precedence.LogicalOR,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space + '?' + space,
	                    generateExpression(expr.consequent, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space + ':' + space,
	                    generateExpression(expr.alternate, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    })
	                ],
	                Precedence.Conditional,
	                precedence
	            );
	            break;

	        case Syntax.LogicalExpression:
	        case Syntax.BinaryExpression:
	            currentPrecedence = BinaryPrecedence[expr.operator];

	            allowIn |= (currentPrecedence < precedence);

	            fragment = generateExpression(expr.left, {
	                precedence: currentPrecedence,
	                allowIn: allowIn,
	                allowCall: true
	            });

	            leftSource = fragment.toString();

	            if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F /* / */ && esutils.code.isIdentifierPart(expr.operator.charCodeAt(0))) {
	                result = [fragment, noEmptySpace(), expr.operator];
	            } else {
	                result = join(fragment, expr.operator);
	            }

	            fragment = generateExpression(expr.right, {
	                precedence: currentPrecedence + 1,
	                allowIn: allowIn,
	                allowCall: true
	            });

	            if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
	            expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
	                // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
	                result.push(noEmptySpace());
	                result.push(fragment);
	            } else {
	                result = join(result, fragment);
	            }

	            if (expr.operator === 'in' && !allowIn) {
	                result = ['(', result, ')'];
	            } else {
	                result = parenthesize(result, currentPrecedence, precedence);
	            }

	            break;

	        case Syntax.CallExpression:
	            result = [generateExpression(expr.callee, {
	                precedence: Precedence.Call,
	                allowIn: true,
	                allowCall: true,
	                allowUnparenthesizedNew: false
	            })];

	            result.push('(');
	            for (i = 0, len = expr['arguments'].length; i < len; ++i) {
	                result.push(generateExpression(expr['arguments'][i], {
	                    precedence: Precedence.Assignment,
	                    allowIn: true,
	                    allowCall: true
	                }));
	                if (i + 1 < len) {
	                    result.push(',' + space);
	                }
	            }
	            result.push(')');

	            if (!allowCall) {
	                result = ['(', result, ')'];
	            } else {
	                result = parenthesize(result, Precedence.Call, precedence);
	            }
	            break;

	        case Syntax.NewExpression:
	            len = expr['arguments'].length;
	            allowUnparenthesizedNew = option.allowUnparenthesizedNew === undefined || option.allowUnparenthesizedNew;

	            result = join(
	                'new',
	                generateExpression(expr.callee, {
	                    precedence: Precedence.New,
	                    allowIn: true,
	                    allowCall: false,
	                    allowUnparenthesizedNew: allowUnparenthesizedNew && !parentheses && len === 0
	                })
	            );

	            if (!allowUnparenthesizedNew || parentheses || len > 0) {
	                result.push('(');
	                for (i = 0; i < len; ++i) {
	                    result.push(generateExpression(expr['arguments'][i], {
	                        precedence: Precedence.Assignment,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                    if (i + 1 < len) {
	                        result.push(',' + space);
	                    }
	                }
	                result.push(')');
	            }

	            result = parenthesize(result, Precedence.New, precedence);
	            break;

	        case Syntax.MemberExpression:
	            result = [generateExpression(expr.object, {
	                precedence: Precedence.Call,
	                allowIn: true,
	                allowCall: allowCall,
	                allowUnparenthesizedNew: false
	            })];

	            if (expr.computed) {
	                result.push('[');
	                result.push(generateExpression(expr.property, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: allowCall
	                }));
	                result.push(']');
	            } else {
	                if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
	                    fragment = toSourceNodeWhenNeeded(result).toString();
	                    // When the following conditions are all true,
	                    //   1. No floating point
	                    //   2. Don't have exponents
	                    //   3. The last character is a decimal digit
	                    //   4. Not hexadecimal OR octal number literal
	                    // we should add a floating point.
	                    if (
	                            fragment.indexOf('.') < 0 &&
	                            !/[eExX]/.test(fragment) &&
	                            esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
	                            !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
	                            ) {
	                        result.push('.');
	                    }
	                }
	                result.push('.');
	                result.push(generateIdentifier(expr.property));
	            }

	            result = parenthesize(result, Precedence.Member, precedence);
	            break;

	        case Syntax.UnaryExpression:
	            fragment = generateExpression(expr.argument, {
	                precedence: Precedence.Unary,
	                allowIn: true,
	                allowCall: true
	            });

	            if (space === '') {
	                result = join(expr.operator, fragment);
	            } else {
	                result = [expr.operator];
	                if (expr.operator.length > 2) {
	                    // delete, void, typeof
	                    // get `typeof []`, not `typeof[]`
	                    result = join(result, fragment);
	                } else {
	                    // Prevent inserting spaces between operator and argument if it is unnecessary
	                    // like, `!cond`
	                    leftSource = toSourceNodeWhenNeeded(result).toString();
	                    leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
	                    rightCharCode = fragment.toString().charCodeAt(0);

	                    if (((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode) ||
	                            (esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode))) {
	                        result.push(noEmptySpace());
	                        result.push(fragment);
	                    } else {
	                        result.push(fragment);
	                    }
	                }
	            }
	            result = parenthesize(result, Precedence.Unary, precedence);
	            break;

	        case Syntax.YieldExpression:
	            if (expr.delegate) {
	                result = 'yield*';
	            } else {
	                result = 'yield';
	            }
	            if (expr.argument) {
	                result = join(
	                    result,
	                    generateExpression(expr.argument, {
	                        precedence: Precedence.Yield,
	                        allowIn: true,
	                        allowCall: true
	                    })
	                );
	            }
	            result = parenthesize(result, Precedence.Yield, precedence);
	            break;

	        case Syntax.UpdateExpression:
	            if (expr.prefix) {
	                result = parenthesize(
	                    [
	                        expr.operator,
	                        generateExpression(expr.argument, {
	                            precedence: Precedence.Unary,
	                            allowIn: true,
	                            allowCall: true
	                        })
	                    ],
	                    Precedence.Unary,
	                    precedence
	                );
	            } else {
	                result = parenthesize(
	                    [
	                        generateExpression(expr.argument, {
	                            precedence: Precedence.Postfix,
	                            allowIn: true,
	                            allowCall: true
	                        }),
	                        expr.operator
	                    ],
	                    Precedence.Postfix,
	                    precedence
	                );
	            }
	            break;

	        case Syntax.FunctionExpression:
	            isGenerator = expr.generator && !extra.moz.starlessGenerator;
	            result = isGenerator ? 'function*' : 'function';

	            if (expr.id) {
	                result = [result, (isGenerator) ? space : noEmptySpace(),
	                          generateIdentifier(expr.id),
	                          generateFunctionBody(expr)];
	            } else {
	                result = [result + space, generateFunctionBody(expr)];
	            }

	            break;

	        case Syntax.ArrayPattern:
	        case Syntax.ArrayExpression:
	            if (!expr.elements.length) {
	                result = '[]';
	                break;
	            }
	            multiline = expr.elements.length > 1;
	            result = ['[', multiline ? newline : ''];
	            withIndent(function (indent) {
	                for (i = 0, len = expr.elements.length; i < len; ++i) {
	                    if (!expr.elements[i]) {
	                        if (multiline) {
	                            result.push(indent);
	                        }
	                        if (i + 1 === len) {
	                            result.push(',');
	                        }
	                    } else {
	                        result.push(multiline ? indent : '');
	                        result.push(generateExpression(expr.elements[i], {
	                            precedence: Precedence.Assignment,
	                            allowIn: true,
	                            allowCall: true
	                        }));
	                    }
	                    if (i + 1 < len) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });
	            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '');
	            result.push(']');
	            break;

	        case Syntax.Property:
	            if (expr.kind === 'get' || expr.kind === 'set') {
	                result = [
	                    expr.kind, noEmptySpace(),
	                    generateExpression(expr.key, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    generateFunctionBody(expr.value)
	                ];
	            } else {
	                if (expr.shorthand) {
	                    result = generateExpression(expr.key, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    });
	                } else if (expr.method) {
	                    result = [];
	                    if (expr.value.generator) {
	                        result.push('*');
	                    }
	                    result.push(generateExpression(expr.key, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                    result.push(generateFunctionBody(expr.value));
	                } else {
	                    result = [
	                        generateExpression(expr.key, {
	                            precedence: Precedence.Sequence,
	                            allowIn: true,
	                            allowCall: true
	                        }),
	                        ':' + space,
	                        generateExpression(expr.value, {
	                            precedence: Precedence.Assignment,
	                            allowIn: true,
	                            allowCall: true
	                        })
	                    ];
	                }
	            }
	            break;

	        case Syntax.ObjectExpression:
	            if (!expr.properties.length) {
	                result = '{}';
	                break;
	            }
	            multiline = expr.properties.length > 1;

	            withIndent(function () {
	                fragment = generateExpression(expr.properties[0], {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true,
	                    type: Syntax.Property
	                });
	            });

	            if (!multiline) {
	                // issues 4
	                // Do not transform from
	                //   dejavu.Class.declare({
	                //       method2: function () {}
	                //   });
	                // to
	                //   dejavu.Class.declare({method2: function () {
	                //       }});
	                if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    result = [ '{', space, fragment, space, '}' ];
	                    break;
	                }
	            }

	            withIndent(function (indent) {
	                result = [ '{', newline, indent, fragment ];

	                if (multiline) {
	                    result.push(',' + newline);
	                    for (i = 1, len = expr.properties.length; i < len; ++i) {
	                        result.push(indent);
	                        result.push(generateExpression(expr.properties[i], {
	                            precedence: Precedence.Sequence,
	                            allowIn: true,
	                            allowCall: true,
	                            type: Syntax.Property
	                        }));
	                        if (i + 1 < len) {
	                            result.push(',' + newline);
	                        }
	                    }
	                }
	            });

	            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(base);
	            result.push('}');
	            break;

	        case Syntax.ObjectPattern:
	            if (!expr.properties.length) {
	                result = '{}';
	                break;
	            }

	            multiline = false;
	            if (expr.properties.length === 1) {
	                property = expr.properties[0];
	                if (property.value.type !== Syntax.Identifier) {
	                    multiline = true;
	                }
	            } else {
	                for (i = 0, len = expr.properties.length; i < len; ++i) {
	                    property = expr.properties[i];
	                    if (!property.shorthand) {
	                        multiline = true;
	                        break;
	                    }
	                }
	            }
	            result = ['{', multiline ? newline : '' ];

	            withIndent(function (indent) {
	                for (i = 0, len = expr.properties.length; i < len; ++i) {
	                    result.push(multiline ? indent : '');
	                    result.push(generateExpression(expr.properties[i], {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                    if (i + 1 < len) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });

	            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '');
	            result.push('}');
	            break;

	        case Syntax.ThisExpression:
	            result = 'this';
	            break;

	        case Syntax.Identifier:
	            result = generateIdentifier(expr);
	            break;

	        case Syntax.Literal:
	            result = generateLiteral(expr);
	            break;

	        case Syntax.GeneratorExpression:
	        case Syntax.ComprehensionExpression:
	            // GeneratorExpression should be parenthesized with (...), ComprehensionExpression with [...]
	            // Due to https://bugzilla.mozilla.org/show_bug.cgi?id=883468 position of expr.body can differ in Spidermonkey and ES6
	            result = (type === Syntax.GeneratorExpression) ? ['('] : ['['];

	            if (extra.moz.comprehensionExpressionStartsWithAssignment) {
	                fragment = generateExpression(expr.body, {
	                    precedence: Precedence.Assignment,
	                    allowIn: true,
	                    allowCall: true
	                });

	                result.push(fragment);
	            }

	            if (expr.blocks) {
	                withIndent(function () {
	                    for (i = 0, len = expr.blocks.length; i < len; ++i) {
	                        fragment = generateExpression(expr.blocks[i], {
	                            precedence: Precedence.Sequence,
	                            allowIn: true,
	                            allowCall: true
	                        });

	                        if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
	                            result = join(result, fragment);
	                        } else {
	                            result.push(fragment);
	                        }
	                    }
	                });
	            }

	            if (expr.filter) {
	                result = join(result, 'if' + space);
	                fragment = generateExpression(expr.filter, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true
	                });
	                if (extra.moz.parenthesizedComprehensionBlock) {
	                    result = join(result, [ '(', fragment, ')' ]);
	                } else {
	                    result = join(result, fragment);
	                }
	            }

	            if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
	                fragment = generateExpression(expr.body, {
	                    precedence: Precedence.Assignment,
	                    allowIn: true,
	                    allowCall: true
	                });

	                result = join(result, fragment);
	            }

	            result.push((type === Syntax.GeneratorExpression) ? ')' : ']');
	            break;

	        case Syntax.ComprehensionBlock:
	            if (expr.left.type === Syntax.VariableDeclaration) {
	                fragment = [
	                    expr.left.kind, noEmptySpace(),
	                    generateStatement(expr.left.declarations[0], {
	                        allowIn: false
	                    })
	                ];
	            } else {
	                fragment = generateExpression(expr.left, {
	                    precedence: Precedence.Call,
	                    allowIn: true,
	                    allowCall: true
	                });
	            }

	            fragment = join(fragment, expr.of ? 'of' : 'in');
	            fragment = join(fragment, generateExpression(expr.right, {
	                precedence: Precedence.Sequence,
	                allowIn: true,
	                allowCall: true
	            }));

	            if (extra.moz.parenthesizedComprehensionBlock) {
	                result = [ 'for' + space + '(', fragment, ')' ];
	            } else {
	                result = join('for' + space, fragment);
	            }
	            break;

	        default:
	            throw new Error('Unknown expression type: ' + expr.type);
	        }

	        if (extra.comment) {
	            result = addComments(expr,result);
	        }
	        return toSourceNodeWhenNeeded(result, expr);
	    }

	    function generateStatement(stmt, option) {
	        var i,
	            len,
	            result,
	            node,
	            specifier,
	            allowIn,
	            functionBody,
	            directiveContext,
	            fragment,
	            semicolon,
	            isGenerator;

	        allowIn = true;
	        semicolon = ';';
	        functionBody = false;
	        directiveContext = false;
	        if (option) {
	            allowIn = option.allowIn === undefined || option.allowIn;
	            if (!semicolons && option.semicolonOptional === true) {
	                semicolon = '';
	            }
	            functionBody = option.functionBody;
	            directiveContext = option.directiveContext;
	        }

	        switch (stmt.type) {
	        case Syntax.BlockStatement:
	            result = ['{', newline];

	            withIndent(function () {
	                for (i = 0, len = stmt.body.length; i < len; ++i) {
	                    fragment = addIndent(generateStatement(stmt.body[i], {
	                        semicolonOptional: i === len - 1,
	                        directiveContext: functionBody
	                    }));
	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            });

	            result.push(addIndent('}'));
	            break;

	        case Syntax.BreakStatement:
	            if (stmt.label) {
	                result = 'break ' + stmt.label.name + semicolon;
	            } else {
	                result = 'break' + semicolon;
	            }
	            break;

	        case Syntax.ContinueStatement:
	            if (stmt.label) {
	                result = 'continue ' + stmt.label.name + semicolon;
	            } else {
	                result = 'continue' + semicolon;
	            }
	            break;

	        case Syntax.DirectiveStatement:
	            if (extra.raw && stmt.raw) {
	                result = stmt.raw + semicolon;
	            } else {
	                result = escapeDirective(stmt.directive) + semicolon;
	            }
	            break;

	        case Syntax.DoWhileStatement:
	            // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
	            result = join('do', maybeBlock(stmt.body));
	            result = maybeBlockSuffix(stmt.body, result);
	            result = join(result, [
	                'while' + space + '(',
	                generateExpression(stmt.test, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true
	                }),
	                ')' + semicolon
	            ]);
	            break;

	        case Syntax.CatchClause:
	            withIndent(function () {
	                var guard;

	                result = [
	                    'catch' + space + '(',
	                    generateExpression(stmt.param, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];

	                if (stmt.guard) {
	                    guard = generateExpression(stmt.guard, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    });

	                    result.splice(2, 0, ' if ', guard);
	                }
	            });
	            result.push(maybeBlock(stmt.body));
	            break;

	        case Syntax.DebuggerStatement:
	            result = 'debugger' + semicolon;
	            break;

	        case Syntax.EmptyStatement:
	            result = ';';
	            break;

	        case Syntax.ExportDeclaration:
	            result = 'export ';
	            if (stmt.declaration) {
	                // FunctionDeclaration or VariableDeclaration
	                result = [result, generateStatement(stmt.declaration, { semicolonOptional: semicolon === '' })];
	                break;
	            }
	            break;

	        case Syntax.ExpressionStatement:
	            result = [generateExpression(stmt.expression, {
	                precedence: Precedence.Sequence,
	                allowIn: true,
	                allowCall: true
	            })];
	            // 12.4 '{', 'function' is not allowed in this position.
	            // wrap expression with parentheses
	            fragment = toSourceNodeWhenNeeded(result).toString();
	            if (fragment.charAt(0) === '{' ||  // ObjectExpression
	                    (fragment.slice(0, 8) === 'function' && '* ('.indexOf(fragment.charAt(8)) >= 0) ||  // function or generator
	                    (directive && directiveContext && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
	                result = ['(', result, ')' + semicolon];
	            } else {
	                result.push(semicolon);
	            }
	            break;

	        case Syntax.ImportDeclaration:
	            // ES6: 15.2.1 valid import declarations:
	            //     - import ImportClause FromClause ;
	            //     - import ModuleSpecifier ;
	            // If no ImportClause is present,
	            // this should be `import ModuleSpecifier` so skip `from`
	            //
	            // ModuleSpecifier is StringLiteral.
	            if (stmt.specifiers.length === 0) {
	                // import ModuleSpecifier ;
	                result = [
	                    'import',
	                    space,
	                    generateLiteral(stmt.source)
	                ];
	            } else {
	                // import ImportClause FromClause ;
	                if (stmt.kind === 'default') {
	                    // import ... from "...";
	                    result = [
	                        'import',
	                        noEmptySpace(),
	                        stmt.specifiers[0].id.name,
	                        noEmptySpace()
	                    ];
	                } else {
	                    // stmt.kind === 'named'
	                    result = [
	                        'import',
	                        space,
	                        '{',
	                    ];

	                    if (stmt.specifiers.length === 1) {
	                        // import { ... } from "...";
	                        specifier = stmt.specifiers[0];
	                        result.push(space + specifier.id.name);
	                        if (specifier.name) {
	                            result.push(noEmptySpace() + 'as' + noEmptySpace() + specifier.name.name);
	                        }
	                        result.push(space + '}' + space);
	                    } else {
	                        // import {
	                        //    ...,
	                        //    ...,
	                        // } from "...";
	                        withIndent(function (indent) {
	                            var i, iz;
	                            result.push(newline);
	                            for (i = 0, iz = stmt.specifiers.length; i < iz; ++i) {
	                                specifier = stmt.specifiers[i];
	                                result.push(indent + specifier.id.name);
	                                if (specifier.name) {
	                                    result.push(noEmptySpace() + 'as' + noEmptySpace() + specifier.name.name);
	                                }

	                                if (i + 1 < iz) {
	                                    result.push(',' + newline);
	                                }
	                            }
	                        });
	                        if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                            result.push(newline);
	                        }
	                        result.push(base + '}' + space);
	                    }
	                }

	                result.push('from' + space);
	                result.push(generateLiteral(stmt.source));
	            }
	            result.push(semicolon);
	            break;

	        case Syntax.VariableDeclarator:
	            if (stmt.init) {
	                result = [
	                    generateExpression(stmt.id, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space,
	                    '=',
	                    space,
	                    generateExpression(stmt.init, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    })
	                ];
	            } else {
	                result = generatePattern(stmt.id, {
	                    precedence: Precedence.Assignment,
	                    allowIn: allowIn
	                });
	            }
	            break;

	        case Syntax.VariableDeclaration:
	            result = [stmt.kind];
	            // special path for
	            // var x = function () {
	            // };
	            if (stmt.declarations.length === 1 && stmt.declarations[0].init &&
	                    stmt.declarations[0].init.type === Syntax.FunctionExpression) {
	                result.push(noEmptySpace());
	                result.push(generateStatement(stmt.declarations[0], {
	                    allowIn: allowIn
	                }));
	            } else {
	                // VariableDeclarator is typed as Statement,
	                // but joined with comma (not LineTerminator).
	                // So if comment is attached to target node, we should specialize.
	                withIndent(function () {
	                    node = stmt.declarations[0];
	                    if (extra.comment && node.leadingComments) {
	                        result.push('\n');
	                        result.push(addIndent(generateStatement(node, {
	                            allowIn: allowIn
	                        })));
	                    } else {
	                        result.push(noEmptySpace());
	                        result.push(generateStatement(node, {
	                            allowIn: allowIn
	                        }));
	                    }

	                    for (i = 1, len = stmt.declarations.length; i < len; ++i) {
	                        node = stmt.declarations[i];
	                        if (extra.comment && node.leadingComments) {
	                            result.push(',' + newline);
	                            result.push(addIndent(generateStatement(node, {
	                                allowIn: allowIn
	                            })));
	                        } else {
	                            result.push(',' + space);
	                            result.push(generateStatement(node, {
	                                allowIn: allowIn
	                            }));
	                        }
	                    }
	                });
	            }
	            result.push(semicolon);
	            break;

	        case Syntax.ThrowStatement:
	            result = [join(
	                'throw',
	                generateExpression(stmt.argument, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true
	                })
	            ), semicolon];
	            break;

	        case Syntax.TryStatement:
	            result = ['try', maybeBlock(stmt.block)];
	            result = maybeBlockSuffix(stmt.block, result);

	            if (stmt.handlers) {
	                // old interface
	                for (i = 0, len = stmt.handlers.length; i < len; ++i) {
	                    result = join(result, generateStatement(stmt.handlers[i]));
	                    if (stmt.finalizer || i + 1 !== len) {
	                        result = maybeBlockSuffix(stmt.handlers[i].body, result);
	                    }
	                }
	            } else {
	                stmt.guardedHandlers = stmt.guardedHandlers || [];

	                for (i = 0, len = stmt.guardedHandlers.length; i < len; ++i) {
	                    result = join(result, generateStatement(stmt.guardedHandlers[i]));
	                    if (stmt.finalizer || i + 1 !== len) {
	                        result = maybeBlockSuffix(stmt.guardedHandlers[i].body, result);
	                    }
	                }

	                // new interface
	                if (stmt.handler) {
	                    if (isArray(stmt.handler)) {
	                        for (i = 0, len = stmt.handler.length; i < len; ++i) {
	                            result = join(result, generateStatement(stmt.handler[i]));
	                            if (stmt.finalizer || i + 1 !== len) {
	                                result = maybeBlockSuffix(stmt.handler[i].body, result);
	                            }
	                        }
	                    } else {
	                        result = join(result, generateStatement(stmt.handler));
	                        if (stmt.finalizer) {
	                            result = maybeBlockSuffix(stmt.handler.body, result);
	                        }
	                    }
	                }
	            }
	            if (stmt.finalizer) {
	                result = join(result, ['finally', maybeBlock(stmt.finalizer)]);
	            }
	            break;

	        case Syntax.SwitchStatement:
	            withIndent(function () {
	                result = [
	                    'switch' + space + '(',
	                    generateExpression(stmt.discriminant, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')' + space + '{' + newline
	                ];
	            });
	            if (stmt.cases) {
	                for (i = 0, len = stmt.cases.length; i < len; ++i) {
	                    fragment = addIndent(generateStatement(stmt.cases[i], {semicolonOptional: i === len - 1}));
	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            }
	            result.push(addIndent('}'));
	            break;

	        case Syntax.SwitchCase:
	            withIndent(function () {
	                if (stmt.test) {
	                    result = [
	                        join('case', generateExpression(stmt.test, {
	                            precedence: Precedence.Sequence,
	                            allowIn: true,
	                            allowCall: true
	                        })),
	                        ':'
	                    ];
	                } else {
	                    result = ['default:'];
	                }

	                i = 0;
	                len = stmt.consequent.length;
	                if (len && stmt.consequent[0].type === Syntax.BlockStatement) {
	                    fragment = maybeBlock(stmt.consequent[0]);
	                    result.push(fragment);
	                    i = 1;
	                }

	                if (i !== len && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                    result.push(newline);
	                }

	                for (; i < len; ++i) {
	                    fragment = addIndent(generateStatement(stmt.consequent[i], {semicolonOptional: i === len - 1 && semicolon === ''}));
	                    result.push(fragment);
	                    if (i + 1 !== len && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            });
	            break;

	        case Syntax.IfStatement:
	            withIndent(function () {
	                result = [
	                    'if' + space + '(',
	                    generateExpression(stmt.test, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];
	            });
	            if (stmt.alternate) {
	                result.push(maybeBlock(stmt.consequent));
	                result = maybeBlockSuffix(stmt.consequent, result);
	                if (stmt.alternate.type === Syntax.IfStatement) {
	                    result = join(result, ['else ', generateStatement(stmt.alternate, {semicolonOptional: semicolon === ''})]);
	                } else {
	                    result = join(result, join('else', maybeBlock(stmt.alternate, semicolon === '')));
	                }
	            } else {
	                result.push(maybeBlock(stmt.consequent, semicolon === ''));
	            }
	            break;

	        case Syntax.ForStatement:
	            withIndent(function () {
	                result = ['for' + space + '('];
	                if (stmt.init) {
	                    if (stmt.init.type === Syntax.VariableDeclaration) {
	                        result.push(generateStatement(stmt.init, {allowIn: false}));
	                    } else {
	                        result.push(generateExpression(stmt.init, {
	                            precedence: Precedence.Sequence,
	                            allowIn: false,
	                            allowCall: true
	                        }));
	                        result.push(';');
	                    }
	                } else {
	                    result.push(';');
	                }

	                if (stmt.test) {
	                    result.push(space);
	                    result.push(generateExpression(stmt.test, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                    result.push(';');
	                } else {
	                    result.push(';');
	                }

	                if (stmt.update) {
	                    result.push(space);
	                    result.push(generateExpression(stmt.update, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                    result.push(')');
	                } else {
	                    result.push(')');
	                }
	            });

	            result.push(maybeBlock(stmt.body, semicolon === ''));
	            break;

	        case Syntax.ForInStatement:
	            result = generateIterationForStatement('in', stmt, semicolon === '');
	            break;

	        case Syntax.ForOfStatement:
	            result = generateIterationForStatement('of', stmt, semicolon === '');
	            break;

	        case Syntax.LabeledStatement:
	            result = [stmt.label.name + ':', maybeBlock(stmt.body, semicolon === '')];
	            break;

	        case Syntax.Program:
	            len = stmt.body.length;
	            result = [safeConcatenation && len > 0 ? '\n' : ''];
	            for (i = 0; i < len; ++i) {
	                fragment = addIndent(
	                    generateStatement(stmt.body[i], {
	                        semicolonOptional: !safeConcatenation && i === len - 1,
	                        directiveContext: true
	                    })
	                );
	                result.push(fragment);
	                if (i + 1 < len && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    result.push(newline);
	                }
	            }
	            break;

	        case Syntax.FunctionDeclaration:
	            isGenerator = stmt.generator && !extra.moz.starlessGenerator;
	            result = [
	                (isGenerator ? 'function*' : 'function'),
	                (isGenerator ? space : noEmptySpace()),
	                generateIdentifier(stmt.id),
	                generateFunctionBody(stmt)
	            ];
	            break;

	        case Syntax.ReturnStatement:
	            if (stmt.argument) {
	                result = [join(
	                    'return',
	                    generateExpression(stmt.argument, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    })
	                ), semicolon];
	            } else {
	                result = ['return' + semicolon];
	            }
	            break;

	        case Syntax.WhileStatement:
	            withIndent(function () {
	                result = [
	                    'while' + space + '(',
	                    generateExpression(stmt.test, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];
	            });
	            result.push(maybeBlock(stmt.body, semicolon === ''));
	            break;

	        case Syntax.WithStatement:
	            withIndent(function () {
	                result = [
	                    'with' + space + '(',
	                    generateExpression(stmt.object, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];
	            });
	            result.push(maybeBlock(stmt.body, semicolon === ''));
	            break;

	        default:
	            throw new Error('Unknown statement type: ' + stmt.type);
	        }

	        // Attach comments

	        if (extra.comment) {
	            result = addComments(stmt, result);
	        }

	        fragment = toSourceNodeWhenNeeded(result).toString();
	        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
	            result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
	        }

	        return toSourceNodeWhenNeeded(result, stmt);
	    }

	    function generate(node, options) {
	        var defaultOptions = getDefaultOptions(), result, pair;

	        if (options != null) {
	            // Obsolete options
	            //
	            //   `options.indent`
	            //   `options.base`
	            //
	            // Instead of them, we can use `option.format.indent`.
	            if (typeof options.indent === 'string') {
	                defaultOptions.format.indent.style = options.indent;
	            }
	            if (typeof options.base === 'number') {
	                defaultOptions.format.indent.base = options.base;
	            }
	            options = updateDeeply(defaultOptions, options);
	            indent = options.format.indent.style;
	            if (typeof options.base === 'string') {
	                base = options.base;
	            } else {
	                base = stringRepeat(indent, options.format.indent.base);
	            }
	        } else {
	            options = defaultOptions;
	            indent = options.format.indent.style;
	            base = stringRepeat(indent, options.format.indent.base);
	        }
	        json = options.format.json;
	        renumber = options.format.renumber;
	        hexadecimal = json ? false : options.format.hexadecimal;
	        quotes = json ? 'double' : options.format.quotes;
	        escapeless = options.format.escapeless;
	        newline = options.format.newline;
	        space = options.format.space;
	        if (options.format.compact) {
	            newline = space = indent = base = '';
	        }
	        parentheses = options.format.parentheses;
	        semicolons = options.format.semicolons;
	        safeConcatenation = options.format.safeConcatenation;
	        directive = options.directive;
	        parse = json ? null : options.parse;
	        sourceMap = options.sourceMap;
	        extra = options;

	        if (sourceMap) {
	            if (!exports.browser) {
	                // We assume environment is node.js
	                // And prevent from including source-map by browserify
	                SourceNode = __webpack_require__(47).SourceNode;
	            } else {
	                SourceNode = global.sourceMap.SourceNode;
	            }
	        }

	        switch (node.type) {
	        case Syntax.BlockStatement:
	        case Syntax.BreakStatement:
	        case Syntax.CatchClause:
	        case Syntax.ContinueStatement:
	        case Syntax.DirectiveStatement:
	        case Syntax.DoWhileStatement:
	        case Syntax.DebuggerStatement:
	        case Syntax.EmptyStatement:
	        case Syntax.ExpressionStatement:
	        case Syntax.ForStatement:
	        case Syntax.ForInStatement:
	        case Syntax.ForOfStatement:
	        case Syntax.FunctionDeclaration:
	        case Syntax.IfStatement:
	        case Syntax.LabeledStatement:
	        case Syntax.Program:
	        case Syntax.ReturnStatement:
	        case Syntax.SwitchStatement:
	        case Syntax.SwitchCase:
	        case Syntax.ThrowStatement:
	        case Syntax.TryStatement:
	        case Syntax.VariableDeclaration:
	        case Syntax.VariableDeclarator:
	        case Syntax.WhileStatement:
	        case Syntax.WithStatement:
	            result = generateStatement(node);
	            break;

	        case Syntax.AssignmentExpression:
	        case Syntax.ArrayExpression:
	        case Syntax.ArrayPattern:
	        case Syntax.BinaryExpression:
	        case Syntax.CallExpression:
	        case Syntax.ConditionalExpression:
	        case Syntax.FunctionExpression:
	        case Syntax.Identifier:
	        case Syntax.Literal:
	        case Syntax.LogicalExpression:
	        case Syntax.MemberExpression:
	        case Syntax.NewExpression:
	        case Syntax.ObjectExpression:
	        case Syntax.ObjectPattern:
	        case Syntax.Property:
	        case Syntax.SequenceExpression:
	        case Syntax.ThisExpression:
	        case Syntax.UnaryExpression:
	        case Syntax.UpdateExpression:
	        case Syntax.YieldExpression:

	            result = generateExpression(node, {
	                precedence: Precedence.Sequence,
	                allowIn: true,
	                allowCall: true
	            });
	            break;

	        default:
	            throw new Error('Unknown node type: ' + node.type);
	        }

	        if (!sourceMap) {
	            pair = {code: result.toString(), map: null};
	            return options.sourceMapWithCode ? pair : pair.code;
	        }


	        pair = result.toStringWithSourceMap({
	            file: options.file,
	            sourceRoot: options.sourceMapRoot
	        });

	        if (options.sourceContent) {
	            pair.map.setSourceContent(options.sourceMap,
	                                      options.sourceContent);
	        }

	        if (options.sourceMapWithCode) {
	            return pair;
	        }

	        return pair.map.toString();
	    }

	    FORMAT_MINIFY = {
	        indent: {
	            style: '',
	            base: 0
	        },
	        renumber: true,
	        hexadecimal: true,
	        quotes: 'auto',
	        escapeless: true,
	        compact: true,
	        parentheses: false,
	        semicolons: false
	    };

	    FORMAT_DEFAULTS = getDefaultOptions().format;

	    exports.version = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./package.json\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).version;
	    exports.generate = generate;
	    exports.attachComments = estraverse.attachComments;
	    exports.Precedence = updateDeeply({}, Precedence);
	    exports.browser = false;
	    exports.FORMAT_MINIFY = FORMAT_MINIFY;
	    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/*jslint vars:false, bitwise:true*/
	/*jshint indent:4*/
	/*global exports:true, define:true*/
	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // and plain browser loading,
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.estraverse = {}));
	    }
	}(this, function (exports) {
	    'use strict';

	    var Syntax,
	        isArray,
	        VisitorOption,
	        VisitorKeys,
	        BREAK,
	        SKIP;

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };

	    function ignoreJSHintError() { }

	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }

	    function deepCopy(obj) {
	        var ret = {}, key, val;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                val = obj[key];
	                if (typeof val === 'object' && val !== null) {
	                    ret[key] = deepCopy(val);
	                } else {
	                    ret[key] = val;
	                }
	            }
	        }
	        return ret;
	    }

	    function shallowCopy(obj) {
	        var ret = {}, key;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    ignoreJSHintError(shallowCopy);

	    // based on LLVM libc++ upper_bound / lower_bound
	    // MIT License

	    function upperBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                len = diff;
	            } else {
	                i = current + 1;
	                len -= diff + 1;
	            }
	        }
	        return i;
	    }

	    function lowerBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                i = current + 1;
	                len -= diff + 1;
	            } else {
	                len = diff;
	            }
	        }
	        return i;
	    }
	    ignoreJSHintError(lowerBound);

	    VisitorKeys = {
	        AssignmentExpression: ['left', 'right'],
	        ArrayExpression: ['elements'],
	        ArrayPattern: ['elements'],
	        ArrowFunctionExpression: ['params', 'defaults', 'rest', 'body'],
	        BlockStatement: ['body'],
	        BinaryExpression: ['left', 'right'],
	        BreakStatement: ['label'],
	        CallExpression: ['callee', 'arguments'],
	        CatchClause: ['param', 'body'],
	        ClassBody: ['body'],
	        ClassDeclaration: ['id', 'body', 'superClass'],
	        ClassExpression: ['id', 'body', 'superClass'],
	        ConditionalExpression: ['test', 'consequent', 'alternate'],
	        ContinueStatement: ['label'],
	        DebuggerStatement: [],
	        DirectiveStatement: [],
	        DoWhileStatement: ['body', 'test'],
	        EmptyStatement: [],
	        ExpressionStatement: ['expression'],
	        ForStatement: ['init', 'test', 'update', 'body'],
	        ForInStatement: ['left', 'right', 'body'],
	        ForOfStatement: ['left', 'right', 'body'],
	        FunctionDeclaration: ['id', 'params', 'defaults', 'rest', 'body'],
	        FunctionExpression: ['id', 'params', 'defaults', 'rest', 'body'],
	        Identifier: [],
	        IfStatement: ['test', 'consequent', 'alternate'],
	        Literal: [],
	        LabeledStatement: ['label', 'body'],
	        LogicalExpression: ['left', 'right'],
	        MemberExpression: ['object', 'property'],
	        MethodDefinition: ['key', 'value'],
	        NewExpression: ['callee', 'arguments'],
	        ObjectExpression: ['properties'],
	        ObjectPattern: ['properties'],
	        Program: ['body'],
	        Property: ['key', 'value'],
	        ReturnStatement: ['argument'],
	        SequenceExpression: ['expressions'],
	        SwitchStatement: ['discriminant', 'cases'],
	        SwitchCase: ['test', 'consequent'],
	        ThisExpression: [],
	        ThrowStatement: ['argument'],
	        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
	        UnaryExpression: ['argument'],
	        UpdateExpression: ['argument'],
	        VariableDeclaration: ['declarations'],
	        VariableDeclarator: ['id', 'init'],
	        WhileStatement: ['test', 'body'],
	        WithStatement: ['object', 'body'],
	        YieldExpression: ['argument']
	    };

	    // unique id
	    BREAK = {};
	    SKIP = {};

	    VisitorOption = {
	        Break: BREAK,
	        Skip: SKIP
	    };

	    function Reference(parent, key) {
	        this.parent = parent;
	        this.key = key;
	    }

	    Reference.prototype.replace = function replace(node) {
	        this.parent[this.key] = node;
	    };

	    function Element(node, path, wrap, ref) {
	        this.node = node;
	        this.path = path;
	        this.wrap = wrap;
	        this.ref = ref;
	    }

	    function Controller() { }

	    // API:
	    // return property path array from root to current node
	    Controller.prototype.path = function path() {
	        var i, iz, j, jz, result, element;

	        function addToPath(result, path) {
	            if (isArray(path)) {
	                for (j = 0, jz = path.length; j < jz; ++j) {
	                    result.push(path[j]);
	                }
	            } else {
	                result.push(path);
	            }
	        }

	        // root node
	        if (!this.__current.path) {
	            return null;
	        }

	        // first node is sentinel, second node is root element
	        result = [];
	        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
	            element = this.__leavelist[i];
	            addToPath(result, element.path);
	        }
	        addToPath(result, this.__current.path);
	        return result;
	    };

	    // API:
	    // return array of parent elements
	    Controller.prototype.parents = function parents() {
	        var i, iz, result;

	        // first node is sentinel
	        result = [];
	        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
	            result.push(this.__leavelist[i].node);
	        }

	        return result;
	    };

	    // API:
	    // return current node
	    Controller.prototype.current = function current() {
	        return this.__current.node;
	    };

	    Controller.prototype.__execute = function __execute(callback, element) {
	        var previous, result;

	        result = undefined;

	        previous  = this.__current;
	        this.__current = element;
	        this.__state = null;
	        if (callback) {
	            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
	        }
	        this.__current = previous;

	        return result;
	    };

	    // API:
	    // notify control skip / break
	    Controller.prototype.notify = function notify(flag) {
	        this.__state = flag;
	    };

	    // API:
	    // skip child nodes of current node
	    Controller.prototype.skip = function () {
	        this.notify(SKIP);
	    };

	    // API:
	    // break traversals
	    Controller.prototype['break'] = function () {
	        this.notify(BREAK);
	    };

	    Controller.prototype.__initialize = function(root, visitor) {
	        this.visitor = visitor;
	        this.root = root;
	        this.__worklist = [];
	        this.__leavelist = [];
	        this.__current = null;
	        this.__state = null;
	    };

	    Controller.prototype.traverse = function traverse(root, visitor) {
	        var worklist,
	            leavelist,
	            element,
	            node,
	            nodeType,
	            ret,
	            key,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        worklist.push(new Element(root, null, null, null));
	        leavelist.push(new Element(null, null, null, null));

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                ret = this.__execute(visitor.leave, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }
	                continue;
	            }

	            if (element.node) {

	                ret = this.__execute(visitor.enter, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }

	                worklist.push(sentinel);
	                leavelist.push(element);

	                if (this.__state === SKIP || ret === SKIP) {
	                    continue;
	                }

	                node = element.node;
	                nodeType = element.wrap || node.type;
	                candidates = VisitorKeys[nodeType];

	                current = candidates.length;
	                while ((current -= 1) >= 0) {
	                    key = candidates[current];
	                    candidate = node[key];
	                    if (!candidate) {
	                        continue;
	                    }

	                    if (!isArray(candidate)) {
	                        worklist.push(new Element(candidate, key, null, null));
	                        continue;
	                    }

	                    current2 = candidate.length;
	                    while ((current2 -= 1) >= 0) {
	                        if (!candidate[current2]) {
	                            continue;
	                        }
	                        if ((nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === candidates[current]) {
	                            element = new Element(candidate[current2], [key, current2], 'Property', null);
	                        } else {
	                            element = new Element(candidate[current2], [key, current2], null, null);
	                        }
	                        worklist.push(element);
	                    }
	                }
	            }
	        }
	    };

	    Controller.prototype.replace = function replace(root, visitor) {
	        var worklist,
	            leavelist,
	            node,
	            nodeType,
	            target,
	            element,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel,
	            outer,
	            key;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        outer = {
	            root: root
	        };
	        element = new Element(root, null, null, new Reference(outer, 'root'));
	        worklist.push(element);
	        leavelist.push(element);

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                target = this.__execute(visitor.leave, element);

	                // node may be replaced with null,
	                // so distinguish between undefined and null in this place
	                if (target !== undefined && target !== BREAK && target !== SKIP) {
	                    // replace
	                    element.ref.replace(target);
	                }

	                if (this.__state === BREAK || target === BREAK) {
	                    return outer.root;
	                }
	                continue;
	            }

	            target = this.__execute(visitor.enter, element);

	            // node may be replaced with null,
	            // so distinguish between undefined and null in this place
	            if (target !== undefined && target !== BREAK && target !== SKIP) {
	                // replace
	                element.ref.replace(target);
	                element.node = target;
	            }

	            if (this.__state === BREAK || target === BREAK) {
	                return outer.root;
	            }

	            // node may be null
	            node = element.node;
	            if (!node) {
	                continue;
	            }

	            worklist.push(sentinel);
	            leavelist.push(element);

	            if (this.__state === SKIP || target === SKIP) {
	                continue;
	            }

	            nodeType = element.wrap || node.type;
	            candidates = VisitorKeys[nodeType];

	            current = candidates.length;
	            while ((current -= 1) >= 0) {
	                key = candidates[current];
	                candidate = node[key];
	                if (!candidate) {
	                    continue;
	                }

	                if (!isArray(candidate)) {
	                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
	                    continue;
	                }

	                current2 = candidate.length;
	                while ((current2 -= 1) >= 0) {
	                    if (!candidate[current2]) {
	                        continue;
	                    }
	                    if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
	                        element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
	                    } else {
	                        element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
	                    }
	                    worklist.push(element);
	                }
	            }
	        }

	        return outer.root;
	    };

	    function traverse(root, visitor) {
	        var controller = new Controller();
	        return controller.traverse(root, visitor);
	    }

	    function replace(root, visitor) {
	        var controller = new Controller();
	        return controller.replace(root, visitor);
	    }

	    function extendCommentRange(comment, tokens) {
	        var target;

	        target = upperBound(tokens, function search(token) {
	            return token.range[0] > comment.range[0];
	        });

	        comment.extendedRange = [comment.range[0], comment.range[1]];

	        if (target !== tokens.length) {
	            comment.extendedRange[1] = tokens[target].range[0];
	        }

	        target -= 1;
	        if (target >= 0) {
	            comment.extendedRange[0] = tokens[target].range[1];
	        }

	        return comment;
	    }

	    function attachComments(tree, providedComments, tokens) {
	        // At first, we should calculate extended comment ranges.
	        var comments = [], comment, len, i, cursor;

	        if (!tree.range) {
	            throw new Error('attachComments needs range information');
	        }

	        // tokens array is empty, we attach comments to tree as 'leadingComments'
	        if (!tokens.length) {
	            if (providedComments.length) {
	                for (i = 0, len = providedComments.length; i < len; i += 1) {
	                    comment = deepCopy(providedComments[i]);
	                    comment.extendedRange = [0, tree.range[0]];
	                    comments.push(comment);
	                }
	                tree.leadingComments = comments;
	            }
	            return tree;
	        }

	        for (i = 0, len = providedComments.length; i < len; i += 1) {
	            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
	        }

	        // This is based on John Freeman's implementation.
	        cursor = 0;
	        traverse(tree, {
	            enter: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (comment.extendedRange[1] > node.range[0]) {
	                        break;
	                    }

	                    if (comment.extendedRange[1] === node.range[0]) {
	                        if (!node.leadingComments) {
	                            node.leadingComments = [];
	                        }
	                        node.leadingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        cursor = 0;
	        traverse(tree, {
	            leave: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (node.range[1] < comment.extendedRange[0]) {
	                        break;
	                    }

	                    if (node.range[1] === comment.extendedRange[0]) {
	                        if (!node.trailingComments) {
	                            node.trailingComments = [];
	                        }
	                        node.trailingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        return tree;
	    }

	    exports.version = '1.5.1-dev';
	    exports.Syntax = Syntax;
	    exports.traverse = traverse;
	    exports.replace = replace;
	    exports.attachComments = attachComments;
	    exports.VisitorKeys = VisitorKeys;
	    exports.VisitorOption = VisitorOption;
	    exports.Controller = Controller;
	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	(function () {
	    'use strict';

	    exports.code = __webpack_require__(45);
	    exports.keyword = __webpack_require__(46);
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 45 */
/***/ function(module, exports) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    var Regex;

	    // See also tools/generate-unicode-regex.py.
	    Regex = {
	        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
	        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
	    };

	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }

	    function isHexDigit(ch) {
	        return isDecimalDigit(ch) || (97 <= ch && ch <= 102) || (65 <= ch && ch <= 70);
	    }

	    function isOctalDigit(ch) {
	        return (ch >= 48 && ch <= 55);   // 0..7
	    }

	    // 7.2 White Space

	    function isWhiteSpace(ch) {
	        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
	            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
	    }

	    // 7.3 Line Terminators

	    function isLineTerminator(ch) {
	        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
	    }

	    // 7.6 Identifier Names and Identifiers

	    function isIdentifierStart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	    }

	    function isIdentifierPart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch >= 48 && ch <= 57) ||         // 0..9
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	    }

	    module.exports = {
	        isDecimalDigit: isDecimalDigit,
	        isHexDigit: isHexDigit,
	        isOctalDigit: isOctalDigit,
	        isWhiteSpace: isWhiteSpace,
	        isLineTerminator: isLineTerminator,
	        isIdentifierStart: isIdentifierStart,
	        isIdentifierPart: isIdentifierPart
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    var code = __webpack_require__(45);

	    function isStrictModeReservedWordES6(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isKeywordES5(id, strict) {
	        // yield should not be treated as keyword under non-strict mode.
	        if (!strict && id === 'yield') {
	            return false;
	        }
	        return isKeywordES6(id, strict);
	    }

	    function isKeywordES6(id, strict) {
	        if (strict && isStrictModeReservedWordES6(id)) {
	            return true;
	        }

	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    function isIdentifierName(id) {
	        var i, iz, ch;

	        if (id.length === 0) {
	            return false;
	        }

	        ch = id.charCodeAt(0);
	        if (!code.isIdentifierStart(ch) || ch === 92) {  // \ (backslash)
	            return false;
	        }

	        for (i = 1, iz = id.length; i < iz; ++i) {
	            ch = id.charCodeAt(i);
	            if (!code.isIdentifierPart(ch) || ch === 92) {  // \ (backslash)
	                return false;
	            }
	        }
	        return true;
	    }

	    module.exports = {
	        isKeywordES5: isKeywordES5,
	        isKeywordES6: isKeywordES6,
	        isRestrictedWord: isRestrictedWord,
	        isIdentifierName: isIdentifierName
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(48).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(54).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(56).SourceNode;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64VLQ = __webpack_require__(49);
	  var util = __webpack_require__(51);
	  var ArraySet = __webpack_require__(52).ArraySet;
	  var MappingList = __webpack_require__(53).MappingList;

	  /**
	   * An instance of the SourceMapGenerator represents a source map which is
	   * being built incrementally. You may pass an object with the following
	   * properties:
	   *
	   *   - file: The filename of the generated source.
	   *   - sourceRoot: A root for all relative URLs in this source map.
	   */
	  function SourceMapGenerator(aArgs) {
	    if (!aArgs) {
	      aArgs = {};
	    }
	    this._file = util.getArg(aArgs, 'file', null);
	    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	    this._sources = new ArraySet();
	    this._names = new ArraySet();
	    this._mappings = new MappingList();
	    this._sourcesContents = null;
	  }

	  SourceMapGenerator.prototype._version = 3;

	  /**
	   * Creates a new SourceMapGenerator based on a SourceMapConsumer
	   *
	   * @param aSourceMapConsumer The SourceMap.
	   */
	  SourceMapGenerator.fromSourceMap =
	    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	      var sourceRoot = aSourceMapConsumer.sourceRoot;
	      var generator = new SourceMapGenerator({
	        file: aSourceMapConsumer.file,
	        sourceRoot: sourceRoot
	      });
	      aSourceMapConsumer.eachMapping(function (mapping) {
	        var newMapping = {
	          generated: {
	            line: mapping.generatedLine,
	            column: mapping.generatedColumn
	          }
	        };

	        if (mapping.source != null) {
	          newMapping.source = mapping.source;
	          if (sourceRoot != null) {
	            newMapping.source = util.relative(sourceRoot, newMapping.source);
	          }

	          newMapping.original = {
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          };

	          if (mapping.name != null) {
	            newMapping.name = mapping.name;
	          }
	        }

	        generator.addMapping(newMapping);
	      });
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          generator.setSourceContent(sourceFile, content);
	        }
	      });
	      return generator;
	    };

	  /**
	   * Add a single mapping from original source line and column to the generated
	   * source's line and column for this source map being created. The mapping
	   * object should have the following properties:
	   *
	   *   - generated: An object with the generated line and column positions.
	   *   - original: An object with the original line and column positions.
	   *   - source: The original source file (relative to the sourceRoot).
	   *   - name: An optional original token name for this mapping.
	   */
	  SourceMapGenerator.prototype.addMapping =
	    function SourceMapGenerator_addMapping(aArgs) {
	      var generated = util.getArg(aArgs, 'generated');
	      var original = util.getArg(aArgs, 'original', null);
	      var source = util.getArg(aArgs, 'source', null);
	      var name = util.getArg(aArgs, 'name', null);

	      if (!this._skipValidation) {
	        this._validateMapping(generated, original, source, name);
	      }

	      if (source != null && !this._sources.has(source)) {
	        this._sources.add(source);
	      }

	      if (name != null && !this._names.has(name)) {
	        this._names.add(name);
	      }

	      this._mappings.add({
	        generatedLine: generated.line,
	        generatedColumn: generated.column,
	        originalLine: original != null && original.line,
	        originalColumn: original != null && original.column,
	        source: source,
	        name: name
	      });
	    };

	  /**
	   * Set the source content for a source file.
	   */
	  SourceMapGenerator.prototype.setSourceContent =
	    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	      var source = aSourceFile;
	      if (this._sourceRoot != null) {
	        source = util.relative(this._sourceRoot, source);
	      }

	      if (aSourceContent != null) {
	        // Add the source content to the _sourcesContents map.
	        // Create a new _sourcesContents map if the property is null.
	        if (!this._sourcesContents) {
	          this._sourcesContents = {};
	        }
	        this._sourcesContents[util.toSetString(source)] = aSourceContent;
	      } else if (this._sourcesContents) {
	        // Remove the source file from the _sourcesContents map.
	        // If the _sourcesContents map is empty, set the property to null.
	        delete this._sourcesContents[util.toSetString(source)];
	        if (Object.keys(this._sourcesContents).length === 0) {
	          this._sourcesContents = null;
	        }
	      }
	    };

	  /**
	   * Applies the mappings of a sub-source-map for a specific source file to the
	   * source map being generated. Each mapping to the supplied source file is
	   * rewritten using the supplied source map. Note: The resolution for the
	   * resulting mappings is the minimium of this map and the supplied map.
	   *
	   * @param aSourceMapConsumer The source map to be applied.
	   * @param aSourceFile Optional. The filename of the source file.
	   *        If omitted, SourceMapConsumer's file property will be used.
	   * @param aSourceMapPath Optional. The dirname of the path to the source map
	   *        to be applied. If relative, it is relative to the SourceMapConsumer.
	   *        This parameter is needed when the two source maps aren't in the same
	   *        directory, and the source map to be applied contains relative source
	   *        paths. If so, those relative source paths need to be rewritten
	   *        relative to the SourceMapGenerator.
	   */
	  SourceMapGenerator.prototype.applySourceMap =
	    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	      var sourceFile = aSourceFile;
	      // If aSourceFile is omitted, we will use the file property of the SourceMap
	      if (aSourceFile == null) {
	        if (aSourceMapConsumer.file == null) {
	          throw new Error(
	            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	            'or the source map\'s "file" property. Both were omitted.'
	          );
	        }
	        sourceFile = aSourceMapConsumer.file;
	      }
	      var sourceRoot = this._sourceRoot;
	      // Make "sourceFile" relative if an absolute Url is passed.
	      if (sourceRoot != null) {
	        sourceFile = util.relative(sourceRoot, sourceFile);
	      }
	      // Applying the SourceMap can add and remove items from the sources and
	      // the names array.
	      var newSources = new ArraySet();
	      var newNames = new ArraySet();

	      // Find mappings for the "sourceFile"
	      this._mappings.unsortedForEach(function (mapping) {
	        if (mapping.source === sourceFile && mapping.originalLine != null) {
	          // Check if it can be mapped by the source map, then update the mapping.
	          var original = aSourceMapConsumer.originalPositionFor({
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          });
	          if (original.source != null) {
	            // Copy mapping
	            mapping.source = original.source;
	            if (aSourceMapPath != null) {
	              mapping.source = util.join(aSourceMapPath, mapping.source)
	            }
	            if (sourceRoot != null) {
	              mapping.source = util.relative(sourceRoot, mapping.source);
	            }
	            mapping.originalLine = original.line;
	            mapping.originalColumn = original.column;
	            if (original.name != null) {
	              mapping.name = original.name;
	            }
	          }
	        }

	        var source = mapping.source;
	        if (source != null && !newSources.has(source)) {
	          newSources.add(source);
	        }

	        var name = mapping.name;
	        if (name != null && !newNames.has(name)) {
	          newNames.add(name);
	        }

	      }, this);
	      this._sources = newSources;
	      this._names = newNames;

	      // Copy sourcesContents of applied map.
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          if (aSourceMapPath != null) {
	            sourceFile = util.join(aSourceMapPath, sourceFile);
	          }
	          if (sourceRoot != null) {
	            sourceFile = util.relative(sourceRoot, sourceFile);
	          }
	          this.setSourceContent(sourceFile, content);
	        }
	      }, this);
	    };

	  /**
	   * A mapping can have one of the three levels of data:
	   *
	   *   1. Just the generated position.
	   *   2. The Generated position, original position, and original source.
	   *   3. Generated and original position, original source, as well as a name
	   *      token.
	   *
	   * To maintain consistency, we validate that any new mapping being added falls
	   * in to one of these categories.
	   */
	  SourceMapGenerator.prototype._validateMapping =
	    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                                aName) {
	      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	          && aGenerated.line > 0 && aGenerated.column >= 0
	          && !aOriginal && !aSource && !aName) {
	        // Case 1.
	        return;
	      }
	      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	               && aGenerated.line > 0 && aGenerated.column >= 0
	               && aOriginal.line > 0 && aOriginal.column >= 0
	               && aSource) {
	        // Cases 2 and 3.
	        return;
	      }
	      else {
	        throw new Error('Invalid mapping: ' + JSON.stringify({
	          generated: aGenerated,
	          source: aSource,
	          original: aOriginal,
	          name: aName
	        }));
	      }
	    };

	  /**
	   * Serialize the accumulated mappings in to the stream of base 64 VLQs
	   * specified by the source map format.
	   */
	  SourceMapGenerator.prototype._serializeMappings =
	    function SourceMapGenerator_serializeMappings() {
	      var previousGeneratedColumn = 0;
	      var previousGeneratedLine = 1;
	      var previousOriginalColumn = 0;
	      var previousOriginalLine = 0;
	      var previousName = 0;
	      var previousSource = 0;
	      var result = '';
	      var mapping;

	      var mappings = this._mappings.toArray();

	      for (var i = 0, len = mappings.length; i < len; i++) {
	        mapping = mappings[i];

	        if (mapping.generatedLine !== previousGeneratedLine) {
	          previousGeneratedColumn = 0;
	          while (mapping.generatedLine !== previousGeneratedLine) {
	            result += ';';
	            previousGeneratedLine++;
	          }
	        }
	        else {
	          if (i > 0) {
	            if (!util.compareByGeneratedPositions(mapping, mappings[i - 1])) {
	              continue;
	            }
	            result += ',';
	          }
	        }

	        result += base64VLQ.encode(mapping.generatedColumn
	                                   - previousGeneratedColumn);
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (mapping.source != null) {
	          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
	                                     - previousSource);
	          previousSource = this._sources.indexOf(mapping.source);

	          // lines are stored 0-based in SourceMap spec version 3
	          result += base64VLQ.encode(mapping.originalLine - 1
	                                     - previousOriginalLine);
	          previousOriginalLine = mapping.originalLine - 1;

	          result += base64VLQ.encode(mapping.originalColumn
	                                     - previousOriginalColumn);
	          previousOriginalColumn = mapping.originalColumn;

	          if (mapping.name != null) {
	            result += base64VLQ.encode(this._names.indexOf(mapping.name)
	                                       - previousName);
	            previousName = this._names.indexOf(mapping.name);
	          }
	        }
	      }

	      return result;
	    };

	  SourceMapGenerator.prototype._generateSourcesContent =
	    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	      return aSources.map(function (source) {
	        if (!this._sourcesContents) {
	          return null;
	        }
	        if (aSourceRoot != null) {
	          source = util.relative(aSourceRoot, source);
	        }
	        var key = util.toSetString(source);
	        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
	                                                    key)
	          ? this._sourcesContents[key]
	          : null;
	      }, this);
	    };

	  /**
	   * Externalize the source map.
	   */
	  SourceMapGenerator.prototype.toJSON =
	    function SourceMapGenerator_toJSON() {
	      var map = {
	        version: this._version,
	        sources: this._sources.toArray(),
	        names: this._names.toArray(),
	        mappings: this._serializeMappings()
	      };
	      if (this._file != null) {
	        map.file = this._file;
	      }
	      if (this._sourceRoot != null) {
	        map.sourceRoot = this._sourceRoot;
	      }
	      if (this._sourcesContents) {
	        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	      }

	      return map;
	    };

	  /**
	   * Render the source map being generated to a string.
	   */
	  SourceMapGenerator.prototype.toString =
	    function SourceMapGenerator_toString() {
	      return JSON.stringify(this);
	    };

	  exports.SourceMapGenerator = SourceMapGenerator;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64 = __webpack_require__(50);

	  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
	  // length quantities we use in the source map spec, the first bit is the sign,
	  // the next four bits are the actual value, and the 6th bit is the
	  // continuation bit. The continuation bit tells us whether there are more
	  // digits in this value following this digit.
	  //
	  //   Continuation
	  //   |    Sign
	  //   |    |
	  //   V    V
	  //   101011

	  var VLQ_BASE_SHIFT = 5;

	  // binary: 100000
	  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	  // binary: 011111
	  var VLQ_BASE_MASK = VLQ_BASE - 1;

	  // binary: 100000
	  var VLQ_CONTINUATION_BIT = VLQ_BASE;

	  /**
	   * Converts from a two-complement value to a value where the sign bit is
	   * placed in the least significant bit.  For example, as decimals:
	   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	   */
	  function toVLQSigned(aValue) {
	    return aValue < 0
	      ? ((-aValue) << 1) + 1
	      : (aValue << 1) + 0;
	  }

	  /**
	   * Converts to a two-complement value from a value where the sign bit is
	   * placed in the least significant bit.  For example, as decimals:
	   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	   */
	  function fromVLQSigned(aValue) {
	    var isNegative = (aValue & 1) === 1;
	    var shifted = aValue >> 1;
	    return isNegative
	      ? -shifted
	      : shifted;
	  }

	  /**
	   * Returns the base 64 VLQ encoded value.
	   */
	  exports.encode = function base64VLQ_encode(aValue) {
	    var encoded = "";
	    var digit;

	    var vlq = toVLQSigned(aValue);

	    do {
	      digit = vlq & VLQ_BASE_MASK;
	      vlq >>>= VLQ_BASE_SHIFT;
	      if (vlq > 0) {
	        // There are still more digits in this value, so we must make sure the
	        // continuation bit is marked.
	        digit |= VLQ_CONTINUATION_BIT;
	      }
	      encoded += base64.encode(digit);
	    } while (vlq > 0);

	    return encoded;
	  };

	  /**
	   * Decodes the next base 64 VLQ value from the given string and returns the
	   * value and the rest of the string via the out parameter.
	   */
	  exports.decode = function base64VLQ_decode(aStr, aOutParam) {
	    var i = 0;
	    var strLen = aStr.length;
	    var result = 0;
	    var shift = 0;
	    var continuation, digit;

	    do {
	      if (i >= strLen) {
	        throw new Error("Expected more digits in base 64 VLQ value.");
	      }
	      digit = base64.decode(aStr.charAt(i++));
	      continuation = !!(digit & VLQ_CONTINUATION_BIT);
	      digit &= VLQ_BASE_MASK;
	      result = result + (digit << shift);
	      shift += VLQ_BASE_SHIFT;
	    } while (continuation);

	    aOutParam.value = fromVLQSigned(result);
	    aOutParam.rest = aStr.slice(i);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var charToIntMap = {};
	  var intToCharMap = {};

	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	    .split('')
	    .forEach(function (ch, index) {
	      charToIntMap[ch] = index;
	      intToCharMap[index] = ch;
	    });

	  /**
	   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	   */
	  exports.encode = function base64_encode(aNumber) {
	    if (aNumber in intToCharMap) {
	      return intToCharMap[aNumber];
	    }
	    throw new TypeError("Must be between 0 and 63: " + aNumber);
	  };

	  /**
	   * Decode a single base 64 digit to an integer.
	   */
	  exports.decode = function base64_decode(aChar) {
	    if (aChar in charToIntMap) {
	      return charToIntMap[aChar];
	    }
	    throw new TypeError("Not a valid base 64 digit: " + aChar);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * This is a helper function for getting values from parameter/options
	   * objects.
	   *
	   * @param args The object we are extracting values from
	   * @param name The name of the property we are getting.
	   * @param defaultValue An optional value to return if the property is missing
	   * from the object. If this is not specified and the property is missing, an
	   * error will be thrown.
	   */
	  function getArg(aArgs, aName, aDefaultValue) {
	    if (aName in aArgs) {
	      return aArgs[aName];
	    } else if (arguments.length === 3) {
	      return aDefaultValue;
	    } else {
	      throw new Error('"' + aName + '" is a required argument.');
	    }
	  }
	  exports.getArg = getArg;

	  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
	  var dataUrlRegexp = /^data:.+\,.+$/;

	  function urlParse(aUrl) {
	    var match = aUrl.match(urlRegexp);
	    if (!match) {
	      return null;
	    }
	    return {
	      scheme: match[1],
	      auth: match[2],
	      host: match[3],
	      port: match[4],
	      path: match[5]
	    };
	  }
	  exports.urlParse = urlParse;

	  function urlGenerate(aParsedUrl) {
	    var url = '';
	    if (aParsedUrl.scheme) {
	      url += aParsedUrl.scheme + ':';
	    }
	    url += '//';
	    if (aParsedUrl.auth) {
	      url += aParsedUrl.auth + '@';
	    }
	    if (aParsedUrl.host) {
	      url += aParsedUrl.host;
	    }
	    if (aParsedUrl.port) {
	      url += ":" + aParsedUrl.port
	    }
	    if (aParsedUrl.path) {
	      url += aParsedUrl.path;
	    }
	    return url;
	  }
	  exports.urlGenerate = urlGenerate;

	  /**
	   * Normalizes a path, or the path portion of a URL:
	   *
	   * - Replaces consequtive slashes with one slash.
	   * - Removes unnecessary '.' parts.
	   * - Removes unnecessary '<dir>/..' parts.
	   *
	   * Based on code in the Node.js 'path' core module.
	   *
	   * @param aPath The path or url to normalize.
	   */
	  function normalize(aPath) {
	    var path = aPath;
	    var url = urlParse(aPath);
	    if (url) {
	      if (!url.path) {
	        return aPath;
	      }
	      path = url.path;
	    }
	    var isAbsolute = (path.charAt(0) === '/');

	    var parts = path.split(/\/+/);
	    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	      part = parts[i];
	      if (part === '.') {
	        parts.splice(i, 1);
	      } else if (part === '..') {
	        up++;
	      } else if (up > 0) {
	        if (part === '') {
	          // The first part is blank if the path is absolute. Trying to go
	          // above the root is a no-op. Therefore we can remove all '..' parts
	          // directly after the root.
	          parts.splice(i + 1, up);
	          up = 0;
	        } else {
	          parts.splice(i, 2);
	          up--;
	        }
	      }
	    }
	    path = parts.join('/');

	    if (path === '') {
	      path = isAbsolute ? '/' : '.';
	    }

	    if (url) {
	      url.path = path;
	      return urlGenerate(url);
	    }
	    return path;
	  }
	  exports.normalize = normalize;

	  /**
	   * Joins two paths/URLs.
	   *
	   * @param aRoot The root path or URL.
	   * @param aPath The path or URL to be joined with the root.
	   *
	   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	   *   first.
	   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	   *   is updated with the result and aRoot is returned. Otherwise the result
	   *   is returned.
	   *   - If aPath is absolute, the result is aPath.
	   *   - Otherwise the two paths are joined with a slash.
	   * - Joining for example 'http://' and 'www.example.com' is also supported.
	   */
	  function join(aRoot, aPath) {
	    if (aRoot === "") {
	      aRoot = ".";
	    }
	    if (aPath === "") {
	      aPath = ".";
	    }
	    var aPathUrl = urlParse(aPath);
	    var aRootUrl = urlParse(aRoot);
	    if (aRootUrl) {
	      aRoot = aRootUrl.path || '/';
	    }

	    // `join(foo, '//www.example.org')`
	    if (aPathUrl && !aPathUrl.scheme) {
	      if (aRootUrl) {
	        aPathUrl.scheme = aRootUrl.scheme;
	      }
	      return urlGenerate(aPathUrl);
	    }

	    if (aPathUrl || aPath.match(dataUrlRegexp)) {
	      return aPath;
	    }

	    // `join('http://', 'www.example.com')`
	    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	      aRootUrl.host = aPath;
	      return urlGenerate(aRootUrl);
	    }

	    var joined = aPath.charAt(0) === '/'
	      ? aPath
	      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

	    if (aRootUrl) {
	      aRootUrl.path = joined;
	      return urlGenerate(aRootUrl);
	    }
	    return joined;
	  }
	  exports.join = join;

	  /**
	   * Make a path relative to a URL or another path.
	   *
	   * @param aRoot The root path or URL.
	   * @param aPath The path or URL to be made relative to aRoot.
	   */
	  function relative(aRoot, aPath) {
	    if (aRoot === "") {
	      aRoot = ".";
	    }

	    aRoot = aRoot.replace(/\/$/, '');

	    // XXX: It is possible to remove this block, and the tests still pass!
	    var url = urlParse(aRoot);
	    if (aPath.charAt(0) == "/" && url && url.path == "/") {
	      return aPath.slice(1);
	    }

	    return aPath.indexOf(aRoot + '/') === 0
	      ? aPath.substr(aRoot.length + 1)
	      : aPath;
	  }
	  exports.relative = relative;

	  /**
	   * Because behavior goes wacky when you set `__proto__` on objects, we
	   * have to prefix all the strings in our set with an arbitrary character.
	   *
	   * See https://github.com/mozilla/source-map/pull/31 and
	   * https://github.com/mozilla/source-map/issues/30
	   *
	   * @param String aStr
	   */
	  function toSetString(aStr) {
	    return '$' + aStr;
	  }
	  exports.toSetString = toSetString;

	  function fromSetString(aStr) {
	    return aStr.substr(1);
	  }
	  exports.fromSetString = fromSetString;

	  function strcmp(aStr1, aStr2) {
	    var s1 = aStr1 || "";
	    var s2 = aStr2 || "";
	    return (s1 > s2) - (s1 < s2);
	  }

	  /**
	   * Comparator between two mappings where the original positions are compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same original source/line/column, but different generated
	   * line and column the same. Useful when searching for a mapping with a
	   * stubbed out mapping.
	   */
	  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	    var cmp;

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp || onlyCompareOriginal) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.name, mappingB.name);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    return mappingA.generatedColumn - mappingB.generatedColumn;
	  };
	  exports.compareByOriginalPositions = compareByOriginalPositions;

	  /**
	   * Comparator between two mappings where the generated positions are
	   * compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same generated line and column, but different
	   * source/name/original line and column the same. Useful when searching for a
	   * mapping with a stubbed out mapping.
	   */
	  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
	    var cmp;

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	    if (cmp || onlyCompareGenerated) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp) {
	      return cmp;
	    }

	    return strcmp(mappingA.name, mappingB.name);
	  };
	  exports.compareByGeneratedPositions = compareByGeneratedPositions;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(51);

	  /**
	   * A data structure which is a combination of an array and a set. Adding a new
	   * member is O(1), testing for membership is O(1), and finding the index of an
	   * element is O(1). Removing elements from the set is not supported. Only
	   * strings are supported for membership.
	   */
	  function ArraySet() {
	    this._array = [];
	    this._set = {};
	  }

	  /**
	   * Static method for creating ArraySet instances from an existing array.
	   */
	  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	    var set = new ArraySet();
	    for (var i = 0, len = aArray.length; i < len; i++) {
	      set.add(aArray[i], aAllowDuplicates);
	    }
	    return set;
	  };

	  /**
	   * Add the given string to this set.
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	    var isDuplicate = this.has(aStr);
	    var idx = this._array.length;
	    if (!isDuplicate || aAllowDuplicates) {
	      this._array.push(aStr);
	    }
	    if (!isDuplicate) {
	      this._set[util.toSetString(aStr)] = idx;
	    }
	  };

	  /**
	   * Is the given string a member of this set?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.has = function ArraySet_has(aStr) {
	    return Object.prototype.hasOwnProperty.call(this._set,
	                                                util.toSetString(aStr));
	  };

	  /**
	   * What is the index of the given string in the array?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	    if (this.has(aStr)) {
	      return this._set[util.toSetString(aStr)];
	    }
	    throw new Error('"' + aStr + '" is not in the set.');
	  };

	  /**
	   * What is the element at the given index?
	   *
	   * @param Number aIdx
	   */
	  ArraySet.prototype.at = function ArraySet_at(aIdx) {
	    if (aIdx >= 0 && aIdx < this._array.length) {
	      return this._array[aIdx];
	    }
	    throw new Error('No element indexed by ' + aIdx);
	  };

	  /**
	   * Returns the array representation of this set (which has the proper indices
	   * indicated by indexOf). Note that this is a copy of the internal array used
	   * for storing the members so that no one can mess with internal state.
	   */
	  ArraySet.prototype.toArray = function ArraySet_toArray() {
	    return this._array.slice();
	  };

	  exports.ArraySet = ArraySet;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(51);

	  /**
	   * Determine whether mappingB is after mappingA with respect to generated
	   * position.
	   */
	  function generatedPositionAfter(mappingA, mappingB) {
	    // Optimized for most common case
	    var lineA = mappingA.generatedLine;
	    var lineB = mappingB.generatedLine;
	    var columnA = mappingA.generatedColumn;
	    var columnB = mappingB.generatedColumn;
	    return lineB > lineA || lineB == lineA && columnB >= columnA ||
	           util.compareByGeneratedPositions(mappingA, mappingB) <= 0;
	  }

	  /**
	   * A data structure to provide a sorted view of accumulated mappings in a
	   * performance conscious manner. It trades a neglibable overhead in general
	   * case for a large speedup in case of mappings being added in order.
	   */
	  function MappingList() {
	    this._array = [];
	    this._sorted = true;
	    // Serves as infimum
	    this._last = {generatedLine: -1, generatedColumn: 0};
	  }

	  /**
	   * Iterate through internal items. This method takes the same arguments that
	   * `Array.prototype.forEach` takes.
	   *
	   * NOTE: The order of the mappings is NOT guaranteed.
	   */
	  MappingList.prototype.unsortedForEach =
	    function MappingList_forEach(aCallback, aThisArg) {
	      this._array.forEach(aCallback, aThisArg);
	    };

	  /**
	   * Add the given source mapping.
	   *
	   * @param Object aMapping
	   */
	  MappingList.prototype.add = function MappingList_add(aMapping) {
	    var mapping;
	    if (generatedPositionAfter(this._last, aMapping)) {
	      this._last = aMapping;
	      this._array.push(aMapping);
	    } else {
	      this._sorted = false;
	      this._array.push(aMapping);
	    }
	  };

	  /**
	   * Returns the flat, sorted array of mappings. The mappings are sorted by
	   * generated position.
	   *
	   * WARNING: This method returns internal data without copying, for
	   * performance. The return value must NOT be mutated, and should be treated as
	   * an immutable borrow. If you want to take ownership, you must make your own
	   * copy.
	   */
	  MappingList.prototype.toArray = function MappingList_toArray() {
	    if (!this._sorted) {
	      this._array.sort(util.compareByGeneratedPositions);
	      this._sorted = true;
	    }
	    return this._array;
	  };

	  exports.MappingList = MappingList;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(51);
	  var binarySearch = __webpack_require__(55);
	  var ArraySet = __webpack_require__(52).ArraySet;
	  var base64VLQ = __webpack_require__(49);

	  /**
	   * A SourceMapConsumer instance represents a parsed source map which we can
	   * query for information about the original file positions by giving it a file
	   * position in the generated source.
	   *
	   * The only parameter is the raw source map (either as a JSON string, or
	   * already parsed to an object). According to the spec, source maps have the
	   * following attributes:
	   *
	   *   - version: Which version of the source map spec this map is following.
	   *   - sources: An array of URLs to the original source files.
	   *   - names: An array of identifiers which can be referrenced by individual mappings.
	   *   - sourceRoot: Optional. The URL root from which all sources are relative.
	   *   - sourcesContent: Optional. An array of contents of the original source files.
	   *   - mappings: A string of base64 VLQs which contain the actual mappings.
	   *   - file: Optional. The generated file this source map is associated with.
	   *
	   * Here is an example source map, taken from the source map spec[0]:
	   *
	   *     {
	   *       version : 3,
	   *       file: "out.js",
	   *       sourceRoot : "",
	   *       sources: ["foo.js", "bar.js"],
	   *       names: ["src", "maps", "are", "fun"],
	   *       mappings: "AA,AB;;ABCDE;"
	   *     }
	   *
	   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	   */
	  function SourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    var version = util.getArg(sourceMap, 'version');
	    var sources = util.getArg(sourceMap, 'sources');
	    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	    // requires the array) to play nice here.
	    var names = util.getArg(sourceMap, 'names', []);
	    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	    var mappings = util.getArg(sourceMap, 'mappings');
	    var file = util.getArg(sourceMap, 'file', null);

	    // Once again, Sass deviates from the spec and supplies the version as a
	    // string rather than a number, so we use loose equality checking here.
	    if (version != this._version) {
	      throw new Error('Unsupported version: ' + version);
	    }

	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    sources = sources.map(util.normalize);

	    // Pass `true` below to allow duplicate names and sources. While source maps
	    // are intended to be compressed and deduplicated, the TypeScript compiler
	    // sometimes generates source maps with duplicates in them. See Github issue
	    // #72 and bugzil.la/889492.
	    this._names = ArraySet.fromArray(names, true);
	    this._sources = ArraySet.fromArray(sources, true);

	    this.sourceRoot = sourceRoot;
	    this.sourcesContent = sourcesContent;
	    this._mappings = mappings;
	    this.file = file;
	  }

	  /**
	   * Create a SourceMapConsumer from a SourceMapGenerator.
	   *
	   * @param SourceMapGenerator aSourceMap
	   *        The source map that will be consumed.
	   * @returns SourceMapConsumer
	   */
	  SourceMapConsumer.fromSourceMap =
	    function SourceMapConsumer_fromSourceMap(aSourceMap) {
	      var smc = Object.create(SourceMapConsumer.prototype);

	      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	      smc.sourceRoot = aSourceMap._sourceRoot;
	      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                              smc.sourceRoot);
	      smc.file = aSourceMap._file;

	      smc.__generatedMappings = aSourceMap._mappings.toArray().slice();
	      smc.__originalMappings = aSourceMap._mappings.toArray().slice()
	        .sort(util.compareByOriginalPositions);

	      return smc;
	    };

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  SourceMapConsumer.prototype._version = 3;

	  /**
	   * The list of original sources.
	   */
	  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
	    get: function () {
	      return this._sources.toArray().map(function (s) {
	        return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
	      }, this);
	    }
	  });

	  // `__generatedMappings` and `__originalMappings` are arrays that hold the
	  // parsed mapping coordinates from the source map's "mappings" attribute. They
	  // are lazily instantiated, accessed via the `_generatedMappings` and
	  // `_originalMappings` getters respectively, and we only parse the mappings
	  // and create these arrays once queried for a source location. We jump through
	  // these hoops because there can be many thousands of mappings, and parsing
	  // them is expensive, so we only want to do it if we must.
	  //
	  // Each object in the arrays is of the form:
	  //
	  //     {
	  //       generatedLine: The line number in the generated code,
	  //       generatedColumn: The column number in the generated code,
	  //       source: The path to the original source file that generated this
	  //               chunk of code,
	  //       originalLine: The line number in the original source that
	  //                     corresponds to this chunk of generated code,
	  //       originalColumn: The column number in the original source that
	  //                       corresponds to this chunk of generated code,
	  //       name: The name of the original symbol which generated this chunk of
	  //             code.
	  //     }
	  //
	  // All properties except for `generatedLine` and `generatedColumn` can be
	  // `null`.
	  //
	  // `_generatedMappings` is ordered by the generated positions.
	  //
	  // `_originalMappings` is ordered by the original positions.

	  SourceMapConsumer.prototype.__generatedMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	    get: function () {
	      if (!this.__generatedMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__generatedMappings;
	    }
	  });

	  SourceMapConsumer.prototype.__originalMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	    get: function () {
	      if (!this.__originalMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__originalMappings;
	    }
	  });

	  SourceMapConsumer.prototype._nextCharIsMappingSeparator =
	    function SourceMapConsumer_nextCharIsMappingSeparator(aStr) {
	      var c = aStr.charAt(0);
	      return c === ";" || c === ",";
	    };

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  SourceMapConsumer.prototype._parseMappings =
	    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      var generatedLine = 1;
	      var previousGeneratedColumn = 0;
	      var previousOriginalLine = 0;
	      var previousOriginalColumn = 0;
	      var previousSource = 0;
	      var previousName = 0;
	      var str = aStr;
	      var temp = {};
	      var mapping;

	      while (str.length > 0) {
	        if (str.charAt(0) === ';') {
	          generatedLine++;
	          str = str.slice(1);
	          previousGeneratedColumn = 0;
	        }
	        else if (str.charAt(0) === ',') {
	          str = str.slice(1);
	        }
	        else {
	          mapping = {};
	          mapping.generatedLine = generatedLine;

	          // Generated column.
	          base64VLQ.decode(str, temp);
	          mapping.generatedColumn = previousGeneratedColumn + temp.value;
	          previousGeneratedColumn = mapping.generatedColumn;
	          str = temp.rest;

	          if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
	            // Original source.
	            base64VLQ.decode(str, temp);
	            mapping.source = this._sources.at(previousSource + temp.value);
	            previousSource += temp.value;
	            str = temp.rest;
	            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
	              throw new Error('Found a source, but no line and column');
	            }

	            // Original line.
	            base64VLQ.decode(str, temp);
	            mapping.originalLine = previousOriginalLine + temp.value;
	            previousOriginalLine = mapping.originalLine;
	            // Lines are stored 0-based
	            mapping.originalLine += 1;
	            str = temp.rest;
	            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
	              throw new Error('Found a source and line, but no column');
	            }

	            // Original column.
	            base64VLQ.decode(str, temp);
	            mapping.originalColumn = previousOriginalColumn + temp.value;
	            previousOriginalColumn = mapping.originalColumn;
	            str = temp.rest;

	            if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
	              // Original name.
	              base64VLQ.decode(str, temp);
	              mapping.name = this._names.at(previousName + temp.value);
	              previousName += temp.value;
	              str = temp.rest;
	            }
	          }

	          this.__generatedMappings.push(mapping);
	          if (typeof mapping.originalLine === 'number') {
	            this.__originalMappings.push(mapping);
	          }
	        }
	      }

	      this.__generatedMappings.sort(util.compareByGeneratedPositions);
	      this.__originalMappings.sort(util.compareByOriginalPositions);
	    };

	  /**
	   * Find the mapping that best matches the hypothetical "needle" mapping that
	   * we are searching for in the given "haystack" of mappings.
	   */
	  SourceMapConsumer.prototype._findMapping =
	    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                           aColumnName, aComparator) {
	      // To return the position we are searching for, we must first find the
	      // mapping for the given position and then return the opposite position it
	      // points to. Because the mappings are sorted, we can use binary search to
	      // find the best mapping.

	      if (aNeedle[aLineName] <= 0) {
	        throw new TypeError('Line must be greater than or equal to 1, got '
	                            + aNeedle[aLineName]);
	      }
	      if (aNeedle[aColumnName] < 0) {
	        throw new TypeError('Column must be greater than or equal to 0, got '
	                            + aNeedle[aColumnName]);
	      }

	      return binarySearch.search(aNeedle, aMappings, aComparator);
	    };

	  /**
	   * Compute the last column for each generated mapping. The last column is
	   * inclusive.
	   */
	  SourceMapConsumer.prototype.computeColumnSpans =
	    function SourceMapConsumer_computeColumnSpans() {
	      for (var index = 0; index < this._generatedMappings.length; ++index) {
	        var mapping = this._generatedMappings[index];

	        // Mappings do not contain a field for the last generated columnt. We
	        // can come up with an optimistic estimate, however, by assuming that
	        // mappings are contiguous (i.e. given two consecutive mappings, the
	        // first mapping ends where the second one starts).
	        if (index + 1 < this._generatedMappings.length) {
	          var nextMapping = this._generatedMappings[index + 1];

	          if (mapping.generatedLine === nextMapping.generatedLine) {
	            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	            continue;
	          }
	        }

	        // The last mapping for each line spans the entire line.
	        mapping.lastGeneratedColumn = Infinity;
	      }
	    };

	  /**
	   * Returns the original source, line, and column information for the generated
	   * source's line and column positions provided. The only argument is an object
	   * with the following properties:
	   *
	   *   - line: The line number in the generated source.
	   *   - column: The column number in the generated source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - source: The original source file, or null.
	   *   - line: The line number in the original source, or null.
	   *   - column: The column number in the original source, or null.
	   *   - name: The original identifier, or null.
	   */
	  SourceMapConsumer.prototype.originalPositionFor =
	    function SourceMapConsumer_originalPositionFor(aArgs) {
	      var needle = {
	        generatedLine: util.getArg(aArgs, 'line'),
	        generatedColumn: util.getArg(aArgs, 'column')
	      };

	      var index = this._findMapping(needle,
	                                    this._generatedMappings,
	                                    "generatedLine",
	                                    "generatedColumn",
	                                    util.compareByGeneratedPositions);

	      if (index >= 0) {
	        var mapping = this._generatedMappings[index];

	        if (mapping.generatedLine === needle.generatedLine) {
	          var source = util.getArg(mapping, 'source', null);
	          if (source != null && this.sourceRoot != null) {
	            source = util.join(this.sourceRoot, source);
	          }
	          return {
	            source: source,
	            line: util.getArg(mapping, 'originalLine', null),
	            column: util.getArg(mapping, 'originalColumn', null),
	            name: util.getArg(mapping, 'name', null)
	          };
	        }
	      }

	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    };

	  /**
	   * Returns the original source content. The only argument is the url of the
	   * original source file. Returns null if no original source content is
	   * availible.
	   */
	  SourceMapConsumer.prototype.sourceContentFor =
	    function SourceMapConsumer_sourceContentFor(aSource) {
	      if (!this.sourcesContent) {
	        return null;
	      }

	      if (this.sourceRoot != null) {
	        aSource = util.relative(this.sourceRoot, aSource);
	      }

	      if (this._sources.has(aSource)) {
	        return this.sourcesContent[this._sources.indexOf(aSource)];
	      }

	      var url;
	      if (this.sourceRoot != null
	          && (url = util.urlParse(this.sourceRoot))) {
	        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	        // many users. We can help them out when they expect file:// URIs to
	        // behave like it would if they were running a local HTTP server. See
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	        if (url.scheme == "file"
	            && this._sources.has(fileUriAbsPath)) {
	          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	        }

	        if ((!url.path || url.path == "/")
	            && this._sources.has("/" + aSource)) {
	          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	        }
	      }

	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    };

	  /**
	   * Returns the generated line and column information for the original source,
	   * line, and column positions provided. The only argument is an object with
	   * the following properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *   - column: The column number in the original source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.generatedPositionFor =
	    function SourceMapConsumer_generatedPositionFor(aArgs) {
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: util.getArg(aArgs, 'column')
	      };

	      if (this.sourceRoot != null) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var index = this._findMapping(needle,
	                                    this._originalMappings,
	                                    "originalLine",
	                                    "originalColumn",
	                                    util.compareByOriginalPositions);

	      if (index >= 0) {
	        var mapping = this._originalMappings[index];

	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }

	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    };

	  /**
	   * Returns all generated line and column information for the original source
	   * and line provided. The only argument is an object with the following
	   * properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *
	   * and an array of objects is returned, each with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.allGeneratedPositionsFor =
	    function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	      // When there is no exact match, SourceMapConsumer.prototype._findMapping
	      // returns the index of the closest mapping less than the needle. By
	      // setting needle.originalColumn to Infinity, we thus find the last
	      // mapping for the given line, provided such a mapping exists.
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: Infinity
	      };

	      if (this.sourceRoot != null) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var mappings = [];

	      var index = this._findMapping(needle,
	                                    this._originalMappings,
	                                    "originalLine",
	                                    "originalColumn",
	                                    util.compareByOriginalPositions);
	      if (index >= 0) {
	        var mapping = this._originalMappings[index];

	        while (mapping && mapping.originalLine === needle.originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });

	          mapping = this._originalMappings[--index];
	        }
	      }

	      return mappings.reverse();
	    };

	  SourceMapConsumer.GENERATED_ORDER = 1;
	  SourceMapConsumer.ORIGINAL_ORDER = 2;

	  /**
	   * Iterate over each mapping between an original source/line/column and a
	   * generated line/column in this source map.
	   *
	   * @param Function aCallback
	   *        The function that is called with each mapping.
	   * @param Object aContext
	   *        Optional. If specified, this object will be the value of `this` every
	   *        time that `aCallback` is called.
	   * @param aOrder
	   *        Either `SourceMapConsumer.GENERATED_ORDER` or
	   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	   *        iterate over the mappings sorted by the generated file's line/column
	   *        order or the original's source/line/column order, respectively. Defaults to
	   *        `SourceMapConsumer.GENERATED_ORDER`.
	   */
	  SourceMapConsumer.prototype.eachMapping =
	    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	      var context = aContext || null;
	      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	      var mappings;
	      switch (order) {
	      case SourceMapConsumer.GENERATED_ORDER:
	        mappings = this._generatedMappings;
	        break;
	      case SourceMapConsumer.ORIGINAL_ORDER:
	        mappings = this._originalMappings;
	        break;
	      default:
	        throw new Error("Unknown order of iteration.");
	      }

	      var sourceRoot = this.sourceRoot;
	      mappings.map(function (mapping) {
	        var source = mapping.source;
	        if (source != null && sourceRoot != null) {
	          source = util.join(sourceRoot, source);
	        }
	        return {
	          source: source,
	          generatedLine: mapping.generatedLine,
	          generatedColumn: mapping.generatedColumn,
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: mapping.name
	        };
	      }).forEach(aCallback, context);
	    };

	  exports.SourceMapConsumer = SourceMapConsumer;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * Recursive implementation of binary search.
	   *
	   * @param aLow Indices here and lower do not contain the needle.
	   * @param aHigh Indices here and higher do not contain the needle.
	   * @param aNeedle The element being searched for.
	   * @param aHaystack The non-empty array being searched.
	   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	   */
	  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
	    // This function terminates when one of the following is true:
	    //
	    //   1. We find the exact element we are looking for.
	    //
	    //   2. We did not find the exact element, but we can return the index of
	    //      the next closest element that is less than that element.
	    //
	    //   3. We did not find the exact element, and there is no next-closest
	    //      element which is less than the one we are searching for, so we
	    //      return -1.
	    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	    var cmp = aCompare(aNeedle, aHaystack[mid], true);
	    if (cmp === 0) {
	      // Found the element we are looking for.
	      return mid;
	    }
	    else if (cmp > 0) {
	      // aHaystack[mid] is greater than our needle.
	      if (aHigh - mid > 1) {
	        // The element is in the upper half.
	        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
	      }
	      // We did not find an exact match, return the next closest one
	      // (termination case 2).
	      return mid;
	    }
	    else {
	      // aHaystack[mid] is less than our needle.
	      if (mid - aLow > 1) {
	        // The element is in the lower half.
	        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
	      }
	      // The exact needle element was not found in this haystack. Determine if
	      // we are in termination case (2) or (3) and return the appropriate thing.
	      return aLow < 0 ? -1 : aLow;
	    }
	  }

	  /**
	   * This is an implementation of binary search which will always try and return
	   * the index of next lowest value checked if there is no exact hit. This is
	   * because mappings between original and generated line/col pairs are single
	   * points, and there is an implicit region between each of them, so a miss
	   * just means that you aren't on the very start of a region.
	   *
	   * @param aNeedle The element you are looking for.
	   * @param aHaystack The array that is being searched.
	   * @param aCompare A function which takes the needle and an element in the
	   *     array and returns -1, 0, or 1 depending on whether the needle is less
	   *     than, equal to, or greater than the element, respectively.
	   */
	  exports.search = function search(aNeedle, aHaystack, aCompare) {
	    if (aHaystack.length === 0) {
	      return -1;
	    }
	    return recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var SourceMapGenerator = __webpack_require__(48).SourceMapGenerator;
	  var util = __webpack_require__(51);

	  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	  // operating systems these days (capturing the result).
	  var REGEX_NEWLINE = /(\r?\n)/;

	  // Newline character code for charCodeAt() comparisons
	  var NEWLINE_CODE = 10;

	  // Private symbol for identifying `SourceNode`s when multiple versions of
	  // the source-map library are loaded. This MUST NOT CHANGE across
	  // versions!
	  var isSourceNode = "$$$isSourceNode$$$";

	  /**
	   * SourceNodes provide a way to abstract over interpolating/concatenating
	   * snippets of generated JavaScript source code while maintaining the line and
	   * column information associated with the original source code.
	   *
	   * @param aLine The original line number.
	   * @param aColumn The original column number.
	   * @param aSource The original source's filename.
	   * @param aChunks Optional. An array of strings which are snippets of
	   *        generated JS, or other SourceNodes.
	   * @param aName The original identifier.
	   */
	  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	    this.children = [];
	    this.sourceContents = {};
	    this.line = aLine == null ? null : aLine;
	    this.column = aColumn == null ? null : aColumn;
	    this.source = aSource == null ? null : aSource;
	    this.name = aName == null ? null : aName;
	    this[isSourceNode] = true;
	    if (aChunks != null) this.add(aChunks);
	  }

	  /**
	   * Creates a SourceNode from generated code and a SourceMapConsumer.
	   *
	   * @param aGeneratedCode The generated code
	   * @param aSourceMapConsumer The SourceMap for the generated code
	   * @param aRelativePath Optional. The path that relative sources in the
	   *        SourceMapConsumer should be relative to.
	   */
	  SourceNode.fromStringWithSourceMap =
	    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	      // The SourceNode we want to fill with the generated code
	      // and the SourceMap
	      var node = new SourceNode();

	      // All even indices of this array are one line of the generated code,
	      // while all odd indices are the newlines between two adjacent lines
	      // (since `REGEX_NEWLINE` captures its match).
	      // Processed fragments are removed from this array, by calling `shiftNextLine`.
	      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	      var shiftNextLine = function() {
	        var lineContents = remainingLines.shift();
	        // The last line of a file might not have a newline.
	        var newLine = remainingLines.shift() || "";
	        return lineContents + newLine;
	      };

	      // We need to remember the position of "remainingLines"
	      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

	      // The generate SourceNodes we need a code range.
	      // To extract it current and last mapping is used.
	      // Here we store the last mapping.
	      var lastMapping = null;

	      aSourceMapConsumer.eachMapping(function (mapping) {
	        if (lastMapping !== null) {
	          // We add the code from "lastMapping" to "mapping":
	          // First check if there is a new line in between.
	          if (lastGeneratedLine < mapping.generatedLine) {
	            var code = "";
	            // Associate first line with "lastMapping"
	            addMappingWithCode(lastMapping, shiftNextLine());
	            lastGeneratedLine++;
	            lastGeneratedColumn = 0;
	            // The remaining code is added without mapping
	          } else {
	            // There is no new line in between.
	            // Associate the code between "lastGeneratedColumn" and
	            // "mapping.generatedColumn" with "lastMapping"
	            var nextLine = remainingLines[0];
	            var code = nextLine.substr(0, mapping.generatedColumn -
	                                          lastGeneratedColumn);
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
	                                                lastGeneratedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	            addMappingWithCode(lastMapping, code);
	            // No more remaining code, continue
	            lastMapping = mapping;
	            return;
	          }
	        }
	        // We add the generated code until the first mapping
	        // to the SourceNode without any mapping.
	        // Each line is added as separate string.
	        while (lastGeneratedLine < mapping.generatedLine) {
	          node.add(shiftNextLine());
	          lastGeneratedLine++;
	        }
	        if (lastGeneratedColumn < mapping.generatedColumn) {
	          var nextLine = remainingLines[0];
	          node.add(nextLine.substr(0, mapping.generatedColumn));
	          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	        }
	        lastMapping = mapping;
	      }, this);
	      // We have processed all mappings.
	      if (remainingLines.length > 0) {
	        if (lastMapping) {
	          // Associate the remaining code in the current line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	        }
	        // and add the remaining lines without any mapping
	        node.add(remainingLines.join(""));
	      }

	      // Copy sourcesContent into SourceNode
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          if (aRelativePath != null) {
	            sourceFile = util.join(aRelativePath, sourceFile);
	          }
	          node.setSourceContent(sourceFile, content);
	        }
	      });

	      return node;

	      function addMappingWithCode(mapping, code) {
	        if (mapping === null || mapping.source === undefined) {
	          node.add(code);
	        } else {
	          var source = aRelativePath
	            ? util.join(aRelativePath, mapping.source)
	            : mapping.source;
	          node.add(new SourceNode(mapping.originalLine,
	                                  mapping.originalColumn,
	                                  source,
	                                  code,
	                                  mapping.name));
	        }
	      }
	    };

	  /**
	   * Add a chunk of generated JS to this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.add = function SourceNode_add(aChunk) {
	    if (Array.isArray(aChunk)) {
	      aChunk.forEach(function (chunk) {
	        this.add(chunk);
	      }, this);
	    }
	    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	      if (aChunk) {
	        this.children.push(aChunk);
	      }
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Add a chunk of generated JS to the beginning of this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	    if (Array.isArray(aChunk)) {
	      for (var i = aChunk.length-1; i >= 0; i--) {
	        this.prepend(aChunk[i]);
	      }
	    }
	    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	      this.children.unshift(aChunk);
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Walk over the tree of JS snippets in this node and its children. The
	   * walking function is called once for each snippet of JS and is passed that
	   * snippet and the its original associated source's line/column location.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	    var chunk;
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      chunk = this.children[i];
	      if (chunk[isSourceNode]) {
	        chunk.walk(aFn);
	      }
	      else {
	        if (chunk !== '') {
	          aFn(chunk, { source: this.source,
	                       line: this.line,
	                       column: this.column,
	                       name: this.name });
	        }
	      }
	    }
	  };

	  /**
	   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	   * each of `this.children`.
	   *
	   * @param aSep The separator.
	   */
	  SourceNode.prototype.join = function SourceNode_join(aSep) {
	    var newChildren;
	    var i;
	    var len = this.children.length;
	    if (len > 0) {
	      newChildren = [];
	      for (i = 0; i < len-1; i++) {
	        newChildren.push(this.children[i]);
	        newChildren.push(aSep);
	      }
	      newChildren.push(this.children[i]);
	      this.children = newChildren;
	    }
	    return this;
	  };

	  /**
	   * Call String.prototype.replace on the very right-most source snippet. Useful
	   * for trimming whitespace from the end of a source node, etc.
	   *
	   * @param aPattern The pattern to replace.
	   * @param aReplacement The thing to replace the pattern with.
	   */
	  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	    var lastChild = this.children[this.children.length - 1];
	    if (lastChild[isSourceNode]) {
	      lastChild.replaceRight(aPattern, aReplacement);
	    }
	    else if (typeof lastChild === 'string') {
	      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	    }
	    else {
	      this.children.push(''.replace(aPattern, aReplacement));
	    }
	    return this;
	  };

	  /**
	   * Set the source content for a source file. This will be added to the SourceMapGenerator
	   * in the sourcesContent field.
	   *
	   * @param aSourceFile The filename of the source file
	   * @param aSourceContent The content of the source file
	   */
	  SourceNode.prototype.setSourceContent =
	    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	    };

	  /**
	   * Walk over the tree of SourceNodes. The walking function is called for each
	   * source file content and is passed the filename and source content.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walkSourceContents =
	    function SourceNode_walkSourceContents(aFn) {
	      for (var i = 0, len = this.children.length; i < len; i++) {
	        if (this.children[i][isSourceNode]) {
	          this.children[i].walkSourceContents(aFn);
	        }
	      }

	      var sources = Object.keys(this.sourceContents);
	      for (var i = 0, len = sources.length; i < len; i++) {
	        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	      }
	    };

	  /**
	   * Return the string representation of this source node. Walks over the tree
	   * and concatenates all the various snippets together to one string.
	   */
	  SourceNode.prototype.toString = function SourceNode_toString() {
	    var str = "";
	    this.walk(function (chunk) {
	      str += chunk;
	    });
	    return str;
	  };

	  /**
	   * Returns the string representation of this source node along with a source
	   * map.
	   */
	  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	    var generated = {
	      code: "",
	      line: 1,
	      column: 0
	    };
	    var map = new SourceMapGenerator(aArgs);
	    var sourceMappingActive = false;
	    var lastOriginalSource = null;
	    var lastOriginalLine = null;
	    var lastOriginalColumn = null;
	    var lastOriginalName = null;
	    this.walk(function (chunk, original) {
	      generated.code += chunk;
	      if (original.source !== null
	          && original.line !== null
	          && original.column !== null) {
	        if(lastOriginalSource !== original.source
	           || lastOriginalLine !== original.line
	           || lastOriginalColumn !== original.column
	           || lastOriginalName !== original.name) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	        lastOriginalSource = original.source;
	        lastOriginalLine = original.line;
	        lastOriginalColumn = original.column;
	        lastOriginalName = original.name;
	        sourceMappingActive = true;
	      } else if (sourceMappingActive) {
	        map.addMapping({
	          generated: {
	            line: generated.line,
	            column: generated.column
	          }
	        });
	        lastOriginalSource = null;
	        sourceMappingActive = false;
	      }
	      for (var idx = 0, length = chunk.length; idx < length; idx++) {
	        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	          generated.line++;
	          generated.column = 0;
	          // Mappings end at eol
	          if (idx + 1 === length) {
	            lastOriginalSource = null;
	            sourceMappingActive = false;
	          } else if (sourceMappingActive) {
	            map.addMapping({
	              source: original.source,
	              original: {
	                line: original.line,
	                column: original.column
	              },
	              generated: {
	                line: generated.line,
	                column: generated.column
	              },
	              name: original.name
	            });
	          }
	        } else {
	          generated.column++;
	        }
	      }
	    });
	    this.walkSourceContents(function (sourceFile, sourceContent) {
	      map.setSourceContent(sourceFile, sourceContent);
	    });

	    return { code: generated.code, map: map };
	  };

	  exports.SourceNode = SourceNode;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 57 */,
/* 58 */,
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var key, ref, val;

	  ref = __webpack_require__(3);
	  for (key in ref) {
	    val = ref[key];
	    exports[key] = val;
	  }

	}).call(this);


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.1
	(function() {
	  var CoffeeScript, Module, binary, child_process, ext, findExtension, fork, helpers, i, len, loadFile, path, ref;

	  CoffeeScript = __webpack_require__(3);

	  child_process = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  helpers = __webpack_require__(10);

	  path = __webpack_require__(7);

	  loadFile = function(module, filename) {
	    var answer;
	    answer = CoffeeScript._compileFile(filename, false);
	    return module._compile(answer, filename);
	  };

	  if ((void 0)) {
	    ref = CoffeeScript.FILE_EXTENSIONS;
	    for (i = 0, len = ref.length; i < len; i++) {
	      ext = ref[i];
	      (void 0)[ext] = loadFile;
	    }
	    Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    findExtension = function(filename) {
	      var curExtension, extensions;
	      extensions = path.basename(filename).split('.');
	      if (extensions[0] === '') {
	        extensions.shift();
	      }
	      while (extensions.shift()) {
	        curExtension = '.' + extensions.join('.');
	        if (Module._extensions[curExtension]) {
	          return curExtension;
	        }
	      }
	      return '.js';
	    };
	    Module.prototype.load = function(filename) {
	      var extension;
	      this.filename = filename;
	      this.paths = Module._nodeModulePaths(path.dirname(filename));
	      extension = findExtension(filename);
	      Module._extensions[extension](this, filename);
	      return this.loaded = true;
	    };
	  }

	  if (child_process) {
	    fork = child_process.fork;
	    binary = /*require.resolve*/(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../bin/coffee\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    child_process.fork = function(path, args, options) {
	      if (helpers.isCoffee(path)) {
	        if (!Array.isArray(args)) {
	          options = args || {};
	          args = [];
	        }
	        args = [path].concat(args);
	        path = binary;
	      }
	      return fork(path, args, options);
	    };
	  }

	}).call(this);


/***/ },
/* 61 */,
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(64);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(65);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 65 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }
/******/ ]);