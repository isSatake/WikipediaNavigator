'use strict'

module.exports = (grunt) ->

  require 'coffee-errors'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'build', [
   'browserify'
   'uglify' if process.env.NODE_ENV is 'production'
  ].filter (i) -> i?

  grunt.registerTask 'default', [ 'build', 'watch' ]

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    browserify:
      build:
        options:
          browserifyOptions:
            transform: 'coffee-reactify'
            debug: process.env.NODE_ENV isnt 'production'
        files:
          'public/javascripts/main.js': [ 'assets/javascripts/**/*.{cjsx,coffee}' ]

    uglify:
      dist:
        files:
          'public/javascripts/main.js': 'public/javascripts/main.js'

    watch:
      options:
        interrupt: yes
      dist:
        files: [
          '**/*.{coffee,cjsx}'
          '!*#*'
          '!lib/**'
          '!node_modules/**'
        ]
        tasks: [ 'build' ]
