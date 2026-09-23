# 第三方组件说明

[English](THIRD_PARTY_NOTICES.md) | 简体中文

PDF Toolbox 使用开源第三方组件。本文件是便于查阅的摘要，不替代各组件随发行包提供的许可证正文。

## 直接依赖

| 组件 | 用途 | 许可证 |
| --- | --- | --- |
| [PDF.js / pdfjs-dist](https://github.com/mozilla/pdf.js) | PDF 解析与页面渲染 | Apache-2.0 |
| [React](https://github.com/facebook/react) | 用户界面 | MIT |
| [Vite](https://github.com/vitejs/vite) | 前端开发与构建 | MIT |
| [TypeScript](https://github.com/microsoft/TypeScript) | 前端静态类型检查 | Apache-2.0 |
| [Tauri](https://github.com/tauri-apps/tauri) | Windows 桌面应用外壳 | Apache-2.0 OR MIT |
| [Serde](https://github.com/serde-rs/serde) | Rust 数据序列化 | Apache-2.0 OR MIT |

JavaScript 和 Rust 的传递依赖还包含 MIT、Apache-2.0、BSD、ISC、MPL-2.0、Unicode-3.0 等许可证的软件。它们不会改变 PDF Toolbox 自身采用 GPL-3.0-or-later 的事实，但发布二进制安装包时仍须保留相应版权和许可证告知。

在制作首个可分发安装包前，项目将根据锁文件生成并人工复核完整的第三方许可证清单，将必要的许可证正文随安装包一同提供。锁文件是具体版本与许可证审计的依据。
