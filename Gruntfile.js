module.exports = function(grunt) {

    grunt.initConfig({
        clean: ['build/'],
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'build/'
                }, {
                    expand: true,
                    src: ['bower_components/**/*.js', 'bower_components/**/*.css'],
                    dest: 'build/'
                }]
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'build/',
                }
            }
        },
        karma: {
            unit: {
                configFile: 'config/karma.conf.js',
                background: true
            }
        },
        watch: {
            options: {
                livereload: true                
            },
            karma: {
                files: ['src/**/*.js', 'test/unit/**/*.js'],
                tasks: ['karma:unit:run']
            },
            app: {
                files: ['src/**/*'],
                tasks: ['copy']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('devmode', ['karma:unit', 'watch']);
    grunt.registerTask('server', ['clean', 'copy', 'connect', 'watch:app']);
};