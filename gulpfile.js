let browserSync = require('browser-sync');
let gulp = require('gulp');

let reload = browserSync.reload;

gulp.task('serve', () => {
    browserSync({
        server: {
            baseDir: 'JavaScript'
        }
    });
    gulp.watch(['**/*'], { cwd: 'JavaScript' }, reload);
});

gulp.task('default', [
    'serve'
]);