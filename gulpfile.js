var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
	browserify('./public/javascripts/admin/spa.js', {
			debug: true
		})
		.bundle().on('error', function(e) {
			console.log(e);
		})
		.pipe(source('script.js'))
		.pipe(gulp.dest('./public/javascripts/dist/'));
});

gulp.task('watch', function() {
	gulp.watch('./public/javascripts/admin/*.js', ['build']);
});