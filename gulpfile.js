var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('css/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('css/'));
});

//Watch task
gulp.task('default', function() {
  gulp.watch('css/**/*.scss', ['sass']);
});
