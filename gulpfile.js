var gulp = require("gulp");
var sass = require("gulp-sass");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var jasmine = require('gulp-jasmine');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csslint = require('gulp-csslint');
var cssnano = require("cssnano");
var htmllint = require("gulp-htmllint");
var imagemin = require("gulp-imagemin");
var bump = require("gulp-bump");
var git = require("gulp-git");
var browserSync = require("browser-sync").create();
var runSequence = require('run-sequence');


//Scripts
//Lints, uglifies, tests
gulp.task("scripts", function(){
	return gulp.src("js/*.js")
	.pipe(jshint())
	.pipe(uglify())
	.pipe(jasmine())
	.pipe(gulp.dest("build/js"))
	.pipe(browserSync.reload({
      stream: true
    }));
});

//CSS
//Sass
gulp.task("sass", function(){
	return gulp.src("sass/**/*.scss")
	.pipe(sass())
	.pipe(csslint())
	.pipe(csslint.formatter())
	.pipe(gulp.dest("css"))
	.pipe(browserSync.reload({
      stream: true
    }));

});

//css Lints, autoprefixes, minifies
gulp.task("styles", function(){
	var processors = [
		autoprefixer,
		cssnano
	];

	return gulp.src("css/main.css")
	.pipe(postcss(processors))
	.pipe(gulp.dest("build/css"));
});

//HTML
//Validates, lints
gulp.task("html", function(){
	return gulp.src("index.html")
	.pipe(htmllint())
	.pipe(gulp.dest("./"));
});

//Images
//Optimizes
gulp.task("images", function(){
	return gulp.src("img/*")
	.pipe(imagemin())
	.pipe(gulp.dest("build/img"));
});

//BrowserSync
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
})

//Watch Tasks
//Watches Sass, JS
gulp.task("watch", ["browserSync", "sass", "scripts"], function(){
	gulp.watch("js/*.js", ["scripts"]);
	gulp.watch("sass/**/*.scss", ["sass"]);
});

//Versioning
gulp.task("version", function () {
  return gulp.src(["./package.json", "./index.html"])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

//Git 
//Run git add 
gulp.task("add", function(){
  return gulp.src(["index.html", "gulpfile.js", "package.json", "build"])
    .pipe(git.add());
});

// Run git commit 
gulp.task("commit", function(){
  return gulp.src(["index.html", "gulpfile.js", "package.json", "build"])
    .pipe(git.commit('initial commit'));
});

// Run git push 
gulp.task("push", function(){
  git.push("origin", "master", function(err) {
    if (err) throw err;
  });
});

// Publishing to git
gulp.task("gitpublish", function(cb){
	runSequence("add", "commit", "push", cb);
	console.log('Pushing files to git');
});

//Default Tasks
gulp.task("default", function(cb){
	runSequence("scripts", "sass", "watch", "styles", "html", cb);
	console.log('Building files');
});