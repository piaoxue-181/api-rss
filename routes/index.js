const bing = require('./bing');
const rss = require('./rss');
const status = require('./status');

module.exports = (router) => {
  router.get("/", async (ctx) => {
    ctx.body = ```<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>Tools API</title>
    <link
      rel="shortcut icon"
      href="
<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1691560005838" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8704" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M678.4 573.866667L366.933333 262.4l2.133334-2.133333-55.466667-104.533334L192 61.866667 57.6 196.266667l93.866667 121.6 104.533333 55.466666 2.133333-2.133333L569.6 682.666667l-46.933333 46.933333 211.2 211.2c40.533333 40.533333 108.8 40.533333 149.333333 0l53.333333-53.333333c40.533333-40.533333 40.533333-108.8 0-149.333334L725.333333 526.933333l-46.933333 46.933334z" p-id="8705" fill="#707070"></path><path d="M906.666667 424.533333c68.266667-68.266667 81.066667-172.8 38.4-256l-138.666667 138.666667-91.733333-91.733333L853.333333 78.933333c-83.2-42.666667-185.6-29.866667-256 38.4-57.6 57.6-74.666667 138.666667-55.466666 211.2l-469.333334 469.333334a70.826667 70.826667 0 0 0 0 100.266666L128 949.333333c27.733333 27.733333 72.533333 27.733333 100.266667 0l469.333333-469.333333c72.533333 21.333333 151.466667 2.133333 209.066667-55.466667z" p-id="8706" fill="#707070"></path></svg>"
      type="image/x-icon"
    />
    <link
      rel="stylesheet"
      href="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/all.min.css"
    />
    <style>
      :root {
        --text-color: #000;
        --text-color-gray: #888;
        --text-color-hover: #fff;
        --icon-color: #444;
      }
      html.dark-mode {
        --text-color: #fff;
        --text-color-gray: #888;
        --text-color-hover: #3c3c3c;
        --icon-color: #cbcbcb;
      }
      * {
        margin: 0;
        padding: 0;
        -webkit-user-select: none;
        user-select: none;
      }
      html {
        height: 100%;
      }
      body {
        background-color: var(--text-color-hover);
        color: var(--text-color);
        font-family: "PingFang SC", "Open Sans", "Microsoft YaHei", sans-serif;
        transition: background-color 0.5s, color 0.5s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
      }
      .dark-mode body {
        background-color: #2a2a2a;
      }
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      a {
        text-decoration: none;
        color: var(--text-color-gray);
        transition: all 0.5s ease;
      }
      a:hover {
        color: var(--text-color);
      }
      .ico {
        margin: 4rem 2rem;
        font-size: 6rem;
        color: var(--text-color-gray);
      }
      .title {
        font-size: 2rem;
        font-weight: bold;
      }
      .text {
        margin: 1rem;
      }
      .control button {
        background-color: var(--text-color-hover);
        border: var(--text-color) solid;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        transition: all 0.5s ease;
        margin: 1rem 0.2rem;
        color: var(--text-color);
        cursor: pointer;
      }
      .control button:hover {
        border: var(--text-color) solid;
        background: var(--text-color);
        color: var(--text-color-hover);
      }
      .control button i {
        margin-right: 6px;
      }
      footer {
        line-height: 1.75rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 140px;
      }
      footer .social {
        color: var(--icon-color);
        font-size: 15px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      footer .social i {
        margin: 0 12px;
      }
      footer .point::before {
        content: "·";
        color: var(--text-color-gray);
      }
      .power,
      .icp {
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="ico"><i class="fa-solid fa-screwdriver-wrench"></i></div>
      <div class="title">Tools API</div>
      <div class="text">服务已正常运行</div>
    </main>
    <footer>
      <div class="social">
        <i class="fa-brands fa-github" onclick="socialJump('github')"></i>
        <div class="point"></div>
        <i class="fa-solid fa-house" onclick="socialJump('home')"></i>
        <div class="point"></div>
        <i class="fa-solid fa-envelope" onclick="socialJump('email')"></i>
      </div>
      <div class="power">
        Copyright © 2025
        <script>
          document.write(" - " + new Date().getFullYear());
        </script>
        <a href="https://blog.blowswind.cn/" target="_blank">末雨乘风</a>
      </div>
      <!--<div class="icp">
        <a href="https://beian.miit.gov.cn/" target="_blank"
          >豫ICP备2022018134号-1</a
        >
      </div>-->
    </footer>
    <script>
      // 跟随系统主题
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const toggleDarkMode = (darkModeMediaQuery) => {
        if (darkModeMediaQuery.matches) {
          document.documentElement.classList.add("dark-mode");
        } else {
          document.documentElement.classList.remove("dark-mode");
        }
      };
      darkModeMediaQuery.addListener(toggleDarkMode);
      toggleDarkMode(darkModeMediaQuery);

      // 社交链接跳转
      const socialJump = (type) => {
        switch (type) {
          case "github":
            window.location.href = "https://github.com/piaoxue-181/";
            break;
          case "home":
            window.location.href = "https://blog.blowswind.cn/";
            break;
          case "email":
            window.location.href = "mailto:admin@blowswind.cn";
            break;
          default:
            break;
        }
      };
    </script>
  </body>
</html>
```;
  });
  bing(router);
  rss(router);
  status(router);
};
