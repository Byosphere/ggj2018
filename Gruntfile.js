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
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-contrib-watch');
    
      // Grunt configuration
      grunt.initConfig({
        clean: ['public/*'],
        copy: {
          dev: {
            files: [
              {src: 'node_modules/phaser-ce/build/phaser.js', dest: 'public/phaser.js'},
              {src: 'src/index-dev.html', dest: 'public/index.html'},
              {src: 'src/css/style.css', dest: 'public/style.css'}
            ]
          },
          prod: {
            files: [
              {src: 'node_modules/phaser-ce/build/phaser.min.js', dest: 'public/phaser.min.js'},
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
        cssmin: {
          target: {
            files: [{
              expand: true,
              cwd: 'src/css',
              src: ['*.css'],
              dest: 'public',
              ext: '.min.css'
            }]
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
      grunt.registerTask('prod', ['clean', 'copy:prod', 'scripts:prod', 'cssmin']);
    
      grunt.registerTask('scripts:dev', ['concat:src']);
      grunt.registerTask('scripts:prod', ['uglify:compile']);
    
    };