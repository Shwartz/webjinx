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
					includePaths: require('node-bourbon').includePaths,
					sourceMap: true
				},
				files: {'dev/css/style.css': 'src/scss/style.scss'}
			},
			dist: {
				options: {
					environment: 'production',
					outputStyle: 'compressed' //CSS output mode. Can be: nested, expanded, compact, compressed.
				},
				files: {'style.css': 'style.scss'}
			}
		},
		/*requirejs: {
			// global config
			options: {
				baseUrl: 'js/src',
				mainConfigFile: 'js/src/setup.js',
				paths: {
					app: 'app',
					lib: 'lib'
				}

			},
			dev: {
				// overwrites the default config above
				options: {
					dir: 'dev',
					optimize: 'none' // /!* uglify2|none *!/
				}
			},
			dist: {
				// overwrites the default config above
				options: {
					name: 'lib/require',
					include: ['setup'],


					out: "js/dist/app.min.js",
					optimize: 'uglify2',
					preserveLicenseComments: true, /!*Cannot use preserveLicenseComments and generateSourceMaps together. Either explcitly set preserveLicenseComments to false (default is true) or turn off generateSourceMaps. If you want source maps with license comments, see: http://requirejs.org/docs/errors.html#sourcemapcomments*!/
					generateSourceMaps: false
				}
			}
		},*/
		watch: {
			css: {
				files: ['sass/**/*.scss', 'style.scss', '!sass/sass-libs/**/*'],
				tasks: ['sass:dev']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('default', ['environment']);

	grunt.registerTask('dev', [
		'sass:' + path,
		'watch'
	]);

	grunt.registerTask('dist', [
		'sass:' + path,
		'requirejs:dist'
	]);
};


