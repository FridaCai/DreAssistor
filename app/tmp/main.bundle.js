/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** multi main ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./app/src/main.js */1);


/***/ },
/* 1 */
/*!*************************!*\
  !*** ./app/src/main.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _uiMainviewJs = __webpack_require__(/*! ./ui/mainview.js */ 2);
	
	var _uiMainviewJs2 = _interopRequireDefault(_uiMainviewJs);
	
	(function () {
		ReactDOM.render(React.createElement(_uiMainviewJs2["default"], null), $("#domContainer")[0]);
	})();

/***/ },
/* 2 */
/*!********************************!*\
  !*** ./app/src/ui/mainview.js ***!
  \********************************/
/***/ function(module, exports) {

	"use strict";
	
	var MainView = React.createClass({
	    displayName: "MainView",
	
	    getInitialState: function getInitialState() {
	        return {};
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            "Hello world!"
	        );
	    }
	});
	
	module.exports = MainView;

/***/ }
/******/ ]);
//# sourceMappingURL=main.bundle.js.map