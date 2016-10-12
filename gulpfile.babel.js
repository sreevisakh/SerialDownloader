var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
// import print from 'gulp-debug';
import newer from 'gulp-newer';
import nodemon from 'gulp-nodemon';
import buffer from 'vinyl-buffer';

gulp.task('browserify', function() {
    return browserify('src/client/app.js', { debug: true })
        .transform(babelify, { sourceMaps: true })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('lib/client/'))
        .on('error', () => console.log('Error'));
});
gulp.task('copy', (done) => {
    gulp.src('src/**/*.html').pipe(gulp.dest('lib'))
    gulp.src('src/**/*.css').pipe(gulp.dest('lib'))
    done()
});

gulp.task('babel:server', () => {
    return gulp.src('src/server/**/*.js')
        .pipe(newer('lib/'))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('lib/server')).on('error', (error) => console.log(error));
});

gulp.task('build', gulp.parallel('browserify', 'babel:server', 'copy'));

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

    gulp.watch('src/client/**/*.js', gulp.series('browserify'));
    gulp.watch('src/**/*.{html,css}', gulp.series('copy'));
    gulp.watch('src/server/**/*.js', gulp.series('babel:server'));
    done();
}));