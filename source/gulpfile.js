const gulp = require('gulp')
const rollup = require('rollup')
const ts = require('gulp-typescript');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const dts = require('dts-bundle')
const fs = require('fs');
const tsProject = ts.createProject('tsconfig.json', { declaration: true });

const packageName = "@gongxh/fairygui-cc";
const legacyPackageName = "fairygui-cc";

const onwarn = warning => {
    // Silence circular dependency warning for moment package
    if (warning.code === 'CIRCULAR_DEPENDENCY')
        return

    console.warn(`(!) ${warning.message}`)
}

gulp.task('buildJs', () => {
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest('./build'));
})

gulp.task("rollup", async function () {
    const subTask = await rollup.rollup({
        input: "build/FairyGUI.js",
        external: ['cc', 'cc/env']
    });
    await subTask.write({
        file: 'dist/fairygui.mjs',
        format: 'esm',
        extend: true,
        name: 'fgui',
    });
});

gulp.task("uglify", function () {
    return gulp.src("dist/fairygui.mjs")
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify(/* options */))
        .pipe(gulp.dest("dist/"));
});

gulp.task('buildDts', function () {
    return new Promise(function (resolve, reject) {
        dts.bundle({ name: packageName, main: "./build/FairyGUI.d.ts", out: "../dist/fairygui.d.ts" });

        const dtsFile = "./dist/fairygui.d.ts";
        const packageDeclarations = fs.readFileSync(dtsFile, "utf8");
        const legacyDeclarations = packageDeclarations.replaceAll(packageName, legacyPackageName);
        fs.writeFileSync(dtsFile, `${packageDeclarations}\n${legacyDeclarations}`);

        resolve();
    });
})

gulp.task('build', gulp.series(
    'buildJs',
    'rollup',
    'uglify',
    'buildDts'
))
