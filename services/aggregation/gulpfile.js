var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	livereload = require('gulp-livereload');


gulp.task('run', function() {
	livereload.listen();
	nodemon({
		script: 'server.js',
		stdout: false
	}).on('readable', function() {
		this.stdout.on('data', function(chunk) {
			if(/^Express server listening on port/.test(chunk)){
        		livereload.changed(__dirname);
      		}
		});
		this.stdout.pipe(process.stdout);
    	this.stderr.pipe(process.stderr);
	});
});

gulp.task('default', ['run']);