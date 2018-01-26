module.exports = function(grunt) {

    var jsSources = ['src/js/utils/constants.js', 
                     'src/js/game/builder.js',
                     'src/js/game/booter.js', 
                     'src/js/game/loader.js'];
    
      // Load modules
      grunt.loadNpmTasks('grunt-contrib-clean');
      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-watch');
    
      // Grunt configuration
      grunt.initConfig({
        clean: ['public/*'],
        copy: {
          dev: {
            files: [
              {src: 'src/index-dev.html', dest: 'public/index.html'}
            ]
          },
          prod: {
            files: [
              {src: 'src/index-prod.html', dest: 'public/index.html'}
            ]
          }
        },
        concat: {
          src: {
            src: jsSources,
            dest: 'public/bundle.js'
          }
        },
        uglify: {
          compile: {
            src: jsSources,
            dest: 'public/bundle.min.js'
          }
        },
        watch: {
          scripts: {
            files: 'src/js/*.js',
            tasks: ['scripts:dev']
          }
        }
      });
    
      // Tasks definition
      grunt.registerTask('default', ['dev', 'watch']);
      grunt.registerTask('dev', ['clean', 'copy:dev', 'scripts:dev']);
      grunt.registerTask('dist', ['clean', 'copy:prod', 'scripts:dist']);
    
      grunt.registerTask('scripts:dev', ['concat:src'])
      grunt.registerTask('scripts:dist', ['uglify:compile'])
    
    };