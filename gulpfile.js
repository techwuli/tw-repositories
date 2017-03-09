var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gulpUglify = require('gulp-uglify');
var gulpRename = require('gulp-rename');

gulp.task('js', function () {
    return gulp.src('src/tw-repositories.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('js_min', function () {
    return gulp.src('src/tw-repositories')
        .pipe(gulpUglify())
        .pipe(gulpRename('tw-repositories.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function () {
    gulp.watch('src/tw-repositories.js', ['js', 'js_min']);

    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: '/example',
        files: [
            'dist/**/*',
            'example/**/*'
        ]
    });
});

gulp.task('serve-sync', ['js', 'js_min', 'serve']);