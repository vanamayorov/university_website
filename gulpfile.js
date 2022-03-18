const gulp = require("gulp"),
    concat = require("gulp-concat"),
    autoprefix = require("gulp-autoprefixer"),
    cleanCSS = require("gulp-clean-css"),
    uglify = require("gulp-uglify"),
    del = require("del"),
    cache = require("gulp-cached"),
    sass = require("gulp-sass")(require('sass')),
    browserSync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    imagemin = require("gulp-imagemin"),
    svgSprite = require("gulp-svg-sprite"),
    config = {
        server: {
            baseDir: "./build",
        },
        tunnel: false,
        host: "localhost",
        port: 3333,
        notify: false,
    },
    src = {
        html: "src/*.html",
        partsHtml: "src/parts/**/*.html",
        csslib: "src/scss/plugins/*.*",
        cssdev: "src/scss/**/*.scss",
        cssBootstrap: "src/scss/bootstrap/*.*",
        icons: "src/img/icons/*.svg",
        jslib: "src/js/plugins/*.js",
        jsdev: "src/js/*.js",
        images: "src/img/**/*.*",
    },
    build = {
        images: "build/img",
        css: "build/css/",
        js: "build/js",
        html: "build/",
    };

function spriteSvg() {
    return gulp
        .src("./src/img/icons/**.svg")
        .pipe(
            svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg",
                    },
                },
            })
        )
        .pipe(gulp.dest("src/img/"));
}

function img() {
    return gulp
        .src(src.images)
        .pipe(cache())
        .pipe(gulp.dest(build.images))
        .pipe(browserSync.stream());
}

function imgmin() {
    return gulp.src(src.images).pipe(imagemin()).pipe(gulp.dest(build.images));
}

function html() {
    return gulp
        .src(src.html)
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(gulp.dest(build.html))
        .pipe(browserSync.stream());
}

function pluginsCSS() {
    return gulp
        .src(src.csslib)
        .pipe(cache())
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("plugins.css"))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(gulp.dest(build.css));
}

function devBootstrap() {
    return gulp
        .src(src.cssBootstrap)
        .pipe(cache())
        .pipe(concat("bootstrap.min.css"))
        .pipe(gulp.dest(build.css))
        .pipe(browserSync.stream());
}

function devCSS() {
    return gulp
        .src(src.cssdev)
        .pipe(cache())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefix({ overrideBrowserslist: ["last 10 versions"], grid: true }))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest(build.css))
        .pipe(browserSync.stream());
}

function pluginsJS() {
    return gulp
        .src(src.jslib)
        .pipe(cache())
        .pipe(concat("plugins.js"))
        .pipe(
            uglify({
                toplevel: true,
            })
        )
        .pipe(gulp.dest(build.js));
}

function devJS() {
    return gulp
        .src(src.jsdev)
        .pipe(cache())
        .pipe(gulp.dest(build.js))
        .pipe(browserSync.stream());
}

function cleanBuild() {
    return del(["build/*"]);
}

function watch() {
    browserSync.init(config);
    gulp.watch(src.cssBootstrap, devBootstrap);
    gulp.watch(src.cssdev, devCSS);
    gulp.watch(src.jsdev, devJS).on("change", browserSync.reload);
    gulp.watch(src.images, img).on("change", browserSync.reload);
    gulp.watch(src.html, html).on("change", browserSync.reload);
    gulp.watch(src.partsHtml, html).on("change", browserSync.reload);
    gulp.watch(src.icons, spriteSvg);
}

gulp.task("img", img);
gulp.task("imgmin", imgmin);
gulp.task("html", html);
gulp.task("cleanBuild", cleanBuild);
gulp.task("devBootstrap", devBootstrap);
gulp.task("pluginsCSS", pluginsCSS);
gulp.task("devCSS", devCSS);
gulp.task("pluginsJS", pluginsJS);
gulp.task("devJS", devJS);
gulp.task("watch", watch);
gulp.task("spriteSvg", spriteSvg);
gulp.task(
    "build",
    gulp.series(
        gulp.parallel(
            "devBootstrap",
            "devCSS",
            "pluginsCSS",
            "devJS",
            "pluginsJS",
            "html",
            "img",
        )
    )
);
gulp.task("default", gulp.series("build", "watch"));