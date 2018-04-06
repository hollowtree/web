let browserSync = require('browser-sync');
let gulp = require('gulp');

let reload = browserSync.reload;

gulp.task('serve', () => {
    browserSync({
        server: {
            baseDir: 'JavaScript'
        },
        // port: 443,
        // https: {
        //     key: "localhost.key",
        //     cert: "localhost.cert"
        // }
    });
    gulp.watch(['**/*'], { cwd: 'JavaScript' }, reload);
});

gulp.task('default', [
    'serve'
]);