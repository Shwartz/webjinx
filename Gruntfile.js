module.exports = function (grunt) {
	/*
	 * Usage:
	 * grunt dev  --target=dev      //=> run development tasks (default watch:tasks)
	 * grunt dist --target=dist //=> run distribution tasks, creates /dist/styles and minify CSS
	 *
	 * --target=dev (default)
	 * --target=dist (removes all backgrounds and devHelpers)
	 *
	 * http://requirejs.org/docs/optimization.html
	 * http://stackoverflow.com/questions/13567312/working-project-structure-that-uses-grunt-js-to-combine-javascript-files-using-r
	 *
	 * https://github.com/sindresorhus/grunt-sass
	 * http://sass-compatibility.github.io/
	 * https://github.com/haithembelhaj/compass-importer
	 * */

	var path = grunt.option('target') || 'dev';


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dev: {
				options: {
					require: 'susy',
					includePaths: require('node-bourbon').includePaths,
					sourceMap: true
				},
				files: {'dev/css/style.css': 'src/scss/style.scss'}
			},
			dist: {
				options: {
					environment: 'production',
					includePaths: require('node-bourbon').includePaths,
					outputStyle: 'compressed', //CSS output mode. Can be: nested, expanded, compact, compressed.
					sourceMap: true
				},
				files: {'dist/css/style.css': 'src/scss/style.scss'}
			}
		},
		copy: {
			htmlDev: {
				expand: true,
				cwd: 'src/html/',
				src: ['*.html'],
				dest: 'dev/',
				options: {
					process: function(content, srcpath) {
						content = content.replace(/@@gruntDataMain/, 'data-main="js/setup"');
						content = content.replace(/@@gruntDataPath/, 'js/lib/require.js');
						return content;
					}
				}
			},
			htmlDist: {
				expand: true,
				cwd: 'src/html/',
				src: ['*.html'],
				dest: 'dist/',
				options: {
					process: function(content, srcpath) {
						content = content.replace(/@@gruntDataMain/, '');
						content = content.replace(/@@gruntDataPath/, 'js/app.min.js');
						return content;
					}
				}
			},
			assetsDev: {
				expand: true,
				cwd: 'src/assets/',
				src: ['**'],
				dest: 'dev/assets/'
			},
			assetsDist: {
				expand: true,
				cwd: 'src/assets/',
				src: ['**'],
				dest: 'dist/assets/'
			}
		},
		clean: {
			dev: {
				src: ['dev/']
			},
			dist: {
				src: ['dist/']
			}
		},
		requirejs: {
			// global config
			options: {
				baseUrl: 'src/js',
				mainConfigFile: 'src/js/setup.js',
				paths: {
					app: 'app',
					lib: 'lib'
				}

			},
			dev: {
				// overwrites the default config above
				options: {
					dir: 'dev/js',
					optimize: 'none' // /* uglify2|none */
				}
			},
			dist: {
				// overwrites the default config above
				options: {
					name: 'lib/require',
					include: ['setup'],
					out: "dist/js/app.min.js",
					optimize: 'uglify2',
					preserveLicenseComments: false, /*Cannot use preserveLicenseComments and generateSourceMaps together. Either explcitly set preserveLicenseComments to false (default is true) or turn off generateSourceMaps. If you want source maps with license comments, see: http://requirejs.org/docs/errors.html#sourcemapcomments*/
					generateSourceMaps: true
				}
			}
		},
		watch: {
			css: {
				files: ['src/scss/**/*.scss'],
				tasks: ['sass:dev']
			},
			html: {
				files: ['src/html/**/*.html'],
				tasks: ['copy:htmlDev']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['requirejs:dev']
			},
			img: {
				files: ['src/assets/**'],
				tasks: ['copy:assetsDev']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', function () {
		var msg = 'Use $:grunt dev or $grunt:dist, more info at Gruntfile.js or readme.md';
		grunt.log.write(msg);
	});

	grunt.registerTask('dev', [
		'clean:dev',
		'sass:dev',
		'copy:htmlDev',
		'copy:assetsDev',
		'requirejs:dev',
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean:dist',
		'sass:dist',
		'copy:htmlDist',
		'copy:assetsDist',
		'requirejs:dist'
	]);
};


