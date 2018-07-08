let browserSync = require('browser-sync');
let gulp = require('gulp');

let reload = browserSync.reload;

gulp.task('serve', () => {
    browserSync({
        server: true,
        // port: 443,
        // https: {
        //     key: "localhost.key",
        //     cert: "localhost.cert"
        // }
    });
    gulp.watch(['**/*'], { cwd: './' }, reload);
});

gulp.task('default', [
    'serve'
]);