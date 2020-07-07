// grunt 的入口文件
// todo
// 样式打包
// js bebel
// html  swing
// 开发环境 server+HMR
// 正式环境  打包+压缩

const sass = require("node-sass");

// require('load-grunt-tasks')(grunt);

module.exports = (grunt) => {
  function getFiles(srcdir, destdir, wildcard, ext) {
    var path = require("path");
    var files = {};
    grunt.file.expand({ cwd: srcdir }, wildcard).forEach(function (relpath) {
      var filename = path.parse(relpath).name + ext;
      files[path.join(destdir, filename)] = path.join(srcdir, relpath);
    });
    return files;
  }

  grunt.initConfig({
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
      },
      dist: {
        // files: getFiles(
        //   "src/assets/styles",
        //   "dist/assets/styles",
        //   "*.scss",
        //   ".css"
        // ),
        // 默认是这种
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      },
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      dist: {
        files: getFiles(
          "src/assets/scripts",
          "dist/assets/scripts",
          "**/*.js",
          ".js"
        ),
      },
    },

    swig: {
      development: {
        init: {
          autoescape: true,
        },
        dest: "dist",
        src: ["src/assets/*.html"],
        // generateSitemap: true,
        // generateRobotstxt: true,
        // // siteUrl: "http://mydomain.net/",
        // production: false,
        // fb_appid: "1349v",
        // ga_account_id: "UA-xxxxxxxx-1",
        // robots_directive: "Disallow /",
        // sitemap_priorities: {
        //   _DEFAULT_: "0.5",
        //   "index.html": "0.8",
        //   "subpage.html": "0.7",
        // },
      },
    },
    swig_render: {
      files: {
        "dist/index.html" : "src/assets/index.html"
      }

      // getFiles(
      //   "src/assets",
      //   "dist/assets",
      //   "*.html",
      //   ".html"
      // ),
    },

    html_template: {
      options: {
          locals:  {
              title: "Allenice"
          },
          beautify: {
              indent_size: 2
          }
      },
      build_html: {
          options: {
              force: false
          },
          expand: true,
          // cwd: "test/demo/tpl",
          src: "src/assets/index.html",
          dest: "dist/index.html"
      }
  },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
      },
      target: {
        files: {
          expand: true, //展开下面*通配符匹配的文件
          cwd: "src/assets/styles", //源文件根目录
          dest: "css", //压缩文件的输出目录
          ext: ".min.css", //压缩文件的后缀名
        },
      },
    },
  });
  // 注册一个任务  使用： yarn grunt foo
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-swig");
  grunt.loadNpmTasks("grunt-swig-render");
  grunt.loadNpmTasks("grunt-html-template");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  // 正确的异步任务  要借助 this 对象的 async 方法
  // grunt.registerTask("sync-task", function () {
  //   const done = this.async();
  //   setTimeout(() => {
  //     console.log("sync-task");
  //     done();
  //   }, 1000);
  // });
  grunt.registerTask("default", ["sass", "babel"]);
  // 注册默认任务，  使用： yarn grunt， 然后会按照后面的数组项顺序加载数组中的任务
  // grunt.registerTask("default", ["foo", "bar", "sync-task"]);
};
