module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    concat:
      dist:
        src: ['lib/jquery.js']
        dest: 'dist/jquery.popover.js'

    uglify:
      dist:
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'

    coffee:
      options:
        bare: yes
      glob_to_multiple:
        expand: true
        cwd: 'src'
        src: ['*.coffee']
        dest: 'lib'
        ext: '.js'

    watch:
      src:
        files: ['src/**/*.coffee']
        tasks: ['coffee']

  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee',  'concat', 'uglify']
