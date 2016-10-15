import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
// import print from 'gulp-debug';
import newer from 'gulp-newer';
import gutil from 'gutil';
var webpack = require('webpack-stream');
gulp.task('babel:server', () => {
    return gulp.src('src/server/**/*.js')
        .pipe(newer('lib/'))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('lib/server')).on('error', (error) => gutil.log('[babel:server]', error));
});

gulp.task('copy', () => {
    return gulp.src(['src/client/index.html', 'src/client/bootstrap.min.css']).pipe(gulp.dest('lib/client'));
})
gulp.task('webpack', function() {
    return gulp.src('src/client/app.js')
        .pipe(webpack(require('./webpack.config.js')).on('error', (error) => gutil.log('[webpack]', error)))
        .pipe(gulp.dest('lib/client/')).on('error', (error) => gutil.log(error));
});

gulp.task('build', gulp.parallel('webpack', 'babel:server', 'copy'));

gulp.task('serve', gulp.series('build', (done) => {
    // var stream = nodemon({
    //     script: 'lib/server/app.js',
    //     watch: 'src/server/',
    //     ext: 'html js',
    //     debug: true,
    //     tasks: ['babel:server']
    // })

    // stream
    //     .on('restart', function() {
    //         //console.log('restarted!')
    //     })
    //     .on('crash', function() {
    //         // console.error('Application has crashed!\n')
    //         stream.emit('restart', 10) // restart the server in 10 seconds 
    //     })

    gulp.watch('src/client/**/*.js', gulp.series('webpack'));
    gulp.watch('src/server/**/*.js', gulp.series('babel:server'));
    done();
}));