'use strict';

import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const src = 'source/yaf';
const dest = '../php-learning/yaf/public';

gulp.task('imgmin', () => {
    gulp.src(src + '/images/*')
        .pipe($.newer(dest + '/img'))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(dest + '/img'))
        .pipe($.size({
            title: 'image-min'
        }))
});
gulp.task('build-css', () => {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];
    gulp.src(src + '/css/*')
        .pipe($.newer(dest + '/css'))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest(dest + '/css'))
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.size({
            title: 'build sass to css'
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dest + '/css'));
});

gulp.task('scripts', () => {

})

gulp.task('html', () => {
    gulp.src(src + '/views/**/*.html')
        .pipe($.useref())
        // Minify any HTML
        .pipe($.if('*.html', $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true
        })))
        // Output files
        .pipe($.if('*.html', $.size({
            title: 'html',
            showFiles: true
        })))
        .pipe(gulp.dest(dest + '../application/views'));
});


gulp.task('server', ['build-css', 'imgmin', 'html'], () => {
    browserSync({
        notify: false,
        // Customize the Browsersync console logging prefix
        logPrefix: 'Jonty',
        // Allow scroll syncing across breakpoints
        scrollElementMapping: ['main', '.mdl-layout'],
        proxy: 'yaf/'
    });
    gulp.watch([src + '/css/*'], ['build-css', reload]);
    gulp.watch([src + '/images/*'], ['imgmin', reload]);
    gulp.watch([src + '/views/**/*.html'], ['html', reload]);
});