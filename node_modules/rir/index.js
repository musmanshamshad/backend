
// forks from:
// https://github.com/troygoode/node-require-directory

'use strict';

var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;
var dirname = require('path').dirname;

var defaultOptions = {
	extensions: ['js', 'json', 'coffee'],
	recurse: true,
	isAttachFileName: false,

	rename: function (name) {
		return name;
	},

	visit: function (obj) {
		return obj;
	}
};

var check = {
	inArray: function(path, filename, arr, isDirectory, True) {
		var False = !True;

		if (arr instanceof RegExp) {
			if (arr.test(path) === False) return false;
		}

		if (arr instanceof Array) {
			if ((arr.indexOf(filename) === -1 && arr.indexOf(filename.split('.')[0]) === -1) === True) return false;
		}

		if (typeof arr === 'function') {
			if (arr(path, filename, isDirectory) === False) return false;
		}

		return true;
	},

	inclusion: function(path, filename, options, isDirectory) {
		if (options.include) {
			return this.inArray(path, filename, options.include, isDirectory, true);
		}

		if (options.exclude) {
			return this.inArray(path, filename, options.exclude, isDirectory, false);
		}

		return true;
	},

	fileInclusion: function(path, filename, options) {
		if (options.extensions) {
			var reg = new RegExp('\\.(' + options.extensions.join('|') + ')$', 'i');
			if (!reg.test(filename)) return false;
		}

		return this.inclusion(path, filename, options);
	},

	dirInclusion: function(path, filename, options) {
		return this.inclusion(path, filename, options, true);
	}
};

var requireDirectory = function(m, path, options) {
	var retval = {};

	// path is optional
	if (path && !options && typeof path !== 'string') {
		options = path;
		path = null;
	}

	// default options
	options = options || {};
	for (var prop in defaultOptions) {
		if (typeof options[prop] === 'undefined') {
			options[prop] = defaultOptions[prop];
		}
	}

	if (typeof options.exclude === 'string') {
		options.exclude = [options.exclude];
	}

	if (typeof options.include === 'string') {
		options.include = [options.include];
	}

	var vfn = options.virtualIndexFn;
	var isAttachFileName = options.isAttachFileName;

	// if no path was passed in, assume the equivelant of __dirname from caller
	// otherwise, resolve path relative to the equivalent of __dirname
	path = !path ? dirname(m.filename) : resolve(dirname(m.filename), path);

	// get the path of each file in specified directory, append to current tree node, recurse
	fs.readdirSync(path).forEach(function (filename) {

		// Known issue:
		// 		File names are sorted according to unicode encoding. When multiple file names
		// 		contain uppercase and lowercase letters, the sort results are not as expected.

		// For example:

		// The file names order in directory like blow:
		//		a.js
		//		B.js
		//		c.js

		// The file names order with fs.readdirSync like below:
		//		B.js
		//		a.js
		//		c.js

		var joined = join(path, filename),
			files,
			key,
			obj;

		// this node is a directory
		if (fs.statSync(joined).isDirectory()) {
			if (!check.dirInclusion(joined, filename, options)) return;

			if (options.recurse) {

				// load valid Node.js directory if the index.js is not in options.exclude
				if (fs.existsSync(joined + '/index.js') && check.fileInclusion(joined, 'index.js', options)) {
					files = require(joined);
				}
				else {
					// load all sub-directories in this directory
					files = requireDirectory(m, joined, options);

					// if a virtual index function is specified (e.g., in kdo), apply it
					if (vfn) {

						// pass joined and filename to vfn
						files = vfn(files, joined, filename);
					}
				}
			}
			else {
				// load valid Node.js directory
				if (fs.existsSync(joined + '/index.js')) {
					files = require(joined);
				}
			}

			// for module.exports.__proto__ = {a: 1, b: 2, c: 3}
			if (files && !Object.keys(files).length && Object.keys(files.__proto__).length) {
				files = files.__proto__;
			}

			// exclude empty directories
			if (files && (typeof files === 'function' || Object.keys(files).length)) {
				retval[options.rename(filename, joined, filename)] = files;
			}
		}
		else if (joined !== m.filename && check.fileInclusion(joined, filename, options)) {
			// hash node key shouldn't include file extension
			key = filename.substring(0, filename.lastIndexOf('.'));
			obj = require(joined);

			retval[options.rename(key, joined, filename)] = options.visit(obj, joined, filename) || obj;
		}
	});

	return retval;
};

module.exports = requireDirectory;
module.exports.defaults = defaultOptions;
