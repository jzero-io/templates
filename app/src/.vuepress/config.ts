// @ts-ignore
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "{{.APP}}",
      description: "{{.APP}} 文档",
    },
    "/en/": {
      lang: "en-US",
      title: "{{.APP}}",
      description: "docs for {{.APP}}",
    },
  },

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
