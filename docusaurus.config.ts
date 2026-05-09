import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "Hệ thống Quản lý Thư viện Trường học",
  tagline:
    "Tài liệu kỹ thuật cho hệ thống quản lý thư viện Desktop Application sử dụng ElectronJS, React và Better-SQLite3.",
  favicon: "img/favicon.ico",
  url: "https://library.edu.vn",
  baseUrl: "/",
  organizationName: "library",
  projectName: "he-thong-quan-ly-thu-vien",
  onBrokenLinks: "throw",
  i18n: {
    defaultLocale: "vi",
    locales: ["vi"],
  },
  plugins: ["docusaurus-plugin-image-zoom"],
  future: {
    v4: true,
  },
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC",
      crossorigin: "anonymous",
    },
  ],
  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: "img/favicon.ico",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Quản lý Thư viện",
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tài liệu",
        },
        {
          to: "/docs/kien-truc/tong-quan-kien-truc",
          label: "Kiến trúc",
          position: "right",
        },
        {
          to: "/docs/chuc-nang/quan-ly-sach",
          label: "Chức năng",
          position: "right",
        },
        {
          to: "/docs/huong-dan-phat-trien/cai-dat-moi-truong",
          label: "Phát triển",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Điểm bắt đầu",
          items: [
            {
              label: "Tổng quan hệ thống",
              to: "/docs/intro",
            },
            {
              label: "Kiến trúc tổng thể",
              to: "/docs/kien-truc/tong-quan-kien-truc",
            },
            {
              label: "Quản lý sách",
              to: "/docs/chuc-nang/quan-ly-sach",
            },
          ],
        },
        {
          title: "Nhóm tài liệu",
          items: [
            {
              label: "Chức năng hệ thống",
              to: "/docs/chuc-nang/quan-ly-sach",
            },
            {
              label: "Thiết kế giao diện",
              to: "/docs/giao-dien/thiet-ke-ui-ux",
            },
            {
              label: "Hướng dẫn phát triển",
              to: "/docs/huong-dan-phat-trien/cai-dat-moi-truong",
            },
          ],
        },
        {
          title: "Kỹ thuật",
          items: [
            {
              label: "Thiết kế Database",
              to: "/docs/kien-truc/database-design",
            },
            {
              label: "Tích hợp thiết bị",
              to: "/docs/thiet-bi/ma-vach",
            },
            {
              label: "Triển khai",
              to: "/docs/trien-khai/build-va-package",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hệ thống Quản lý Thư viện Trường học`,
    },
    zoom: {
      selector: ".markdown :not(em) > img",
      background: {
        light: "rgb(255, 255, 255)",
        dark: "rgb(50, 50, 50)",
      },
      config: {
        margin: 24,
        scrollOffset: 0,
      },
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: { light: "neutral", dark: "forest" },
      options: {
        fontFamily: '"Be Vietnam Pro", sans-serif',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
