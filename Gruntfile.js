module.exports = function (grunt) {

    var jsSourcesCommon = [
        'src/js/data/constants.js',
        'src/js/data/translate-fr.js',
        'src/js/data/translate-en.js',
        'src/js/data/animations.js',
        'src/js/data/worlds-data.js',
        'src/js/utils/helpers.js',
        'src/js/utils/controlsManager.js',
        'src/js/utils/AudioManager.js',
        'src/js/utils/ServerManager.js',
        'src/js/utils/ElectronManager.js',
        'src/js/utils/LocalStorageManager.js',
        'src/js/game/Game.js',
        'src/js/game/states/Parameters.js',
        'src/js/game/states/Booter.js',
        'src/js/game/states/Loader.js',
        'src/js/game/states/MainMenu.js',
        'src/js/game/states/HowToPlay.js',
        'src/js/game/states/ScoreScreen.js',
        'src/js/game/states/LevelSelect.js',
        'src/js/game/states/Scene.js',
        'src/js/game/objects/Button.js',
        'src/js/game/objects/Door.js',
        'src/js/game/objects/Exit.js',
        'src/js/game/objects/Rock.js',
        'src/js/game/objects/Character.js',
        'src/js/game/objects/PauseScreen.js',
        'src/js/game/objects/DisconnectScreen.js',
        'src/js/game/objects/SceneHud.js',
        'src/js/game/objects/GameOverScreen.js',
        'src/js/game/objects/TextMessage.js',
        'src/js/game/objects/ConfirmDialog.js'
    ];

    var jsSourcesDev = ['src/js/utils/var-dev.js'];

    var jsSourcesProd = ['src/js/utils/var-prod.js'];

    // Load modules
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-babel');

    // Grunt configuration
    grunt.initConfig({
        clean: ['public/*'],
        copy: {
            dev: {
                files: [
                    { src: 'node_modules/phaser-ce/build/phaser.js', dest: 'public/js/phaser.js' },
                    { src: 'node_modules/@orange-games/phaser-input/build/phaser-input.js', dest: 'public/js/phaser-input.js' },
                    { src: 'src/game-dev.html', dest: 'public/game.html' },
                    { src: 'src/css/game.css', dest: 'public/css/game.css' },
                    { src: 'src/css/style.css', dest: 'public/css/style.css' },
                    { src: 'src/favicon.ico', dest: 'public/favicon.ico' },
                    { src: 'node_modules/socket.io-client/dist/socket.io.js', dest: 'public/js/socket.io.js' },
                    { src: 'node_modules/jquery/dist/jquery.js', dest: 'public/js/jquery.js' },
                    { src: 'node_modules/bootstrap/dist/css/bootstrap.css', dest: 'public/css/bootstrap.css' },
                    { src: 'node_modules/bootstrap/dist/js/bootstrap.js', dest: 'public/js/bootstrap.js' }
                ]
            },
            prod: {
                files: [
                    { src: 'node_modules/phaser-ce/build/phaser.min.js', dest: 'public/js/phaser.min.js' },
                    { src: 'node_modules/@orange-games/phaser-input/build/phaser-input.min.js', dest: 'public/js/phaser-input.min.js' },
                    { src: 'src/game-prod.html', dest: 'public/game.html' },
                    { src: 'src/favicon.ico', dest: 'public/favicon.ico' },
                    { src: 'node_modules/socket.io-client/dist/socket.io.js', dest: 'public/js/socket.io.js' },
                    { src: 'node_modules/jquery/dist/jquery.min.js', dest: 'public/js/jquery.min.js' },
                    { src: 'node_modules/bootstrap/dist/css/bootstrap.css', dest: 'public/css/bootstrap.css' },
                    { src: 'node_modules/bootstrap/dist/js/bootstrap.min.js', dest: 'public/js/bootstrap.min.js' }
                ]
            },
            assets: {
                files: [{ expand: true, src: ['assets/**'], dest: 'public/' }, { expand: true, src: ['fonts/**'], dest: 'public/' }]
            }
        },
        concat: {
            src: {
                src: jsSourcesCommon.concat(jsSourcesDev),
                dest: 'public/js/bundle.js'
            }
        },
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    src: jsSourcesCommon.concat(jsSourcesProd),
                    dest: "src/js-compiled/",
                    ext: "-compiled.js"
                }]
            }
        },
        uglify: {
            compile: {
                src: "src/js-compiled/**/*-compiled.js",
                dest: 'public/js/bundle.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css'],
                    dest: 'public/css',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['src/**'],
                tasks: ['scripts:dev'],
                options: {
                    livereload: {
                        host: 'localhost',
                        port: 35729,
                    }
                }
            }
        }
    });

    // Tasks definition
    grunt.registerTask('default', ['dev']);
    grunt.registerTask('dev', ['clean', 'copy:dev', 'scripts:dev', 'copy:assets', 'watch:scripts']);
    grunt.registerTask('build', ['clean', 'copy:dev', 'scripts:dev', 'copy:assets']);
    grunt.registerTask('prod', ['clean', 'copy:prod', 'scripts:prod', 'cssmin', 'copy:assets']);

    grunt.registerTask('scripts:dev', ['concat:src']);
    grunt.registerTask('scripts:prod', ['babel', 'uglify:compile']);

};