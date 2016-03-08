/*global module:false*/
module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            vendor: {
                src: ["wwwroot/vendor/**"]
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
                ],
            },
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
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        parallel: {
            vendor: {
                options: {
                    grunt: true
                },
                tasks: ['copy:vendor', 'uglify:vendor', 'cssmin:vendor']
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

    // Default task.
    grunt.registerTask('build:vendor', ['clean:vendor', 'bower_concat:vendor', 'parallel:vendor']);
    grunt.registerTask('build', ['build:vendor']);
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
