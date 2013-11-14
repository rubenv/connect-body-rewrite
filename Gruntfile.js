module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-release');

    grunt.initConfig({
        jshint: {
            all: ['index.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        watch: {
            all: {
                files: ['index.js'],
                tasks: ['build']
            }
        }
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['jshint']);
    grunt.registerTask('package', ['build', 'release']);
};
