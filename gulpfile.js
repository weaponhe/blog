var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
	browserify('./dashboard/public/js/spa.js', {
			debug: true
		})
		.bundle().on('error', function(e) {
			console.log(e);
		})
		.pipe(source('script.js'))
		.pipe(gulp.dest('./dashboard/public/dist/'));
});

gulp.task('watch', function() {
	gulp.watch('./dashboard/public/js/*.js', ['build']);
});