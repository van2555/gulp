import { src, dest, watch, series } from "gulp"
import fileInclude from "gulp-file-include"
import browser from "browser-sync"
import htmlmin from "gulp-htmlmin"

const bs = browser.create()
function js() {
    return src(["src/**/*.js"]).pipe(dest("dist"))
}
function css() {
    return src(["src/**/*.css"]).pipe(dest("dist"))
}
function html() {
    return src(["src/**/*.html", "!src/ui/**/*.html"]).pipe(
        fileInclude({
            prefix: "@@",
            basepath: "src",
        }),
    ).pipe(
        htmlmin({
            collapseWhitespace: true,
            removeComments: true,
        }),
    ).pipe(dest("dist"))
}
function imgs() {
    return src(["src/**/*.{png,jpg,webp}"], { encoding: false }).pipe(dest("dist"))
}
function server(done) {
    bs.init({
        server: {
            baseDir: "dist",

        },
        notify: false,
    })
    done()
}
function reload(done) {
    bs.reload();
    done();
}

function watcher() {
    // Тут была проблема не было css в watch
    watch("src/**/*.html", series(html, reload));
    watch("src/**/*.{png,jpg,webp}", series(imgs, reload));
    watch("src/**/*.js", series(js, reload));
    watch("src/**/*.css", series(css, reload))
}
export default series(imgs, html, css, js, server, watcher);