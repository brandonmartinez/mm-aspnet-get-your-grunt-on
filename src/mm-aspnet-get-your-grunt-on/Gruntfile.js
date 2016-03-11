/// <binding AfterBuild='build' />
/*global require, module:false*/

module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            vendor: {
                src: ['wwwroot/vendor/**']
            },
            app: {
                src: ['wwwroot/app/**']
            }
        },
        copy: {
            vendor: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/fonts/',
                        src: ['**'],
                        dest: 'wwwroot/vendor/fonts',
                        filter: 'isFile'
                    }
                ]
            }
        },
        bower_concat: {
            vendor: {
                dest: {
                    js: 'wwwroot/vendor/scripts.js',
                    css: 'wwwroot/vendor/styles.css'
                },
                bowerOptions: {
                    relative: false
                },
                mainFiles: {
                    'bootstrap': ['dist/css/bootstrap.css', 'dist/css/bootstrap-theme.css', 'dist/js/bootstrap.js']
                },
                process: function(src) {
                    // Changing relative pathing to point at vendor subfolder
                    return src.replace(new RegExp('../fonts/', 'g'), '../vendor/fonts/');
                }
            }
        },
        uglify: {
            vendor: {
                src: 'wwwroot/vendor/scripts.js',
                dest: 'wwwroot/vendor/scripts.min.js'
            },
            app: {
                options: {
                    sourceMap: true,
                },
                src: [
                    'wwwroot/js/app.js',
                    'wwwroot/js/**/*.js'
                ],
                dest: 'wwwroot/app/scripts.min.js'
            }
        },
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            app: {
                files: {
                    'wwwroot/app/styles.min.css': 'wwwroot/css/styles.scss'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            vendor: {
                files: {
                    'wwwroot/vendor/styles.min.css': 'wwwroot/vendor/styles.css'
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                latedef: true,
                noarg: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: false,
                browser: true,
                globals: {
                    jQuery: true
                },
                reporter: require('jshint-stylish').toString()
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            app: {
                src: ['wwwroot/js/**/*.js']
            }
        },
        parallel: {
            vendor: {
                options: {
                    grunt: true
                },
                tasks: ['copy:vendor', 'uglify:vendor', 'cssmin:vendor']
            },
            app: {
                options: {
                    grunt: true
                },
                tasks: ['uglify:app', 'sass:app']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'nodeunit']
            }
        }
    });

    // Register Custom Grunt Tasks
    grunt.registerTask('build:vendor', ['clean:vendor', 'bower_concat:vendor', 'parallel:vendor']);

    grunt.registerTask('build:app', ['clean:app', 'jshint:app', 'parallel:app']);

    grunt.registerTask('build', ['build:vendor', 'build:app']);

    grunt.registerTask('default', 'build');
};
