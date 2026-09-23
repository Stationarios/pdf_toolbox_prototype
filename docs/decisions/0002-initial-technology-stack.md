# 初始技术栈采用 Tauri、React、TypeScript 与 PDF.js

状态：接受
日期：2026-09-23

## 背景

项目需要桌面文件能力、成熟 PDF 渲染、复杂交互界面以及将来可靠的后台文件处理。开发者熟悉 C，但此前没有使用 Rust。

## 决定

- Tauri 作为 Windows 桌面外壳；
- React 与 TypeScript 实现界面；
- PDF.js 负责解析和渲染；
- Rust 负责本地能力、安全边界和后续后台任务；
- 第一版不引入 qpdf、Tesseract 或 Python 运行时。

## 原因

- 不从零实现 PDF 渲染；
- Web 技术适合页面虚拟化、缩略图和后续框选交互；
- Rust 适合建立文件和任务边界；
- Tauri 不需要随应用打包完整 Chromium；
- 初始依赖的许可证较宽松。

## 后果

- 项目同时包含 TypeScript 和 Rust；
- 需要理解 WebView2 与 Worker 的限制；
- Rust 有学习成本；
- PDF.js 不是完整 PDF 写入引擎，保存功能仍需单独选型。

## 备选方案

- Qt/C++：原生且成熟，但 UI 和 PDF 渲染集成成本更高；
- Electron：开发直接，但安装体积和运行资源较大；
- Python/PyQt：原型快，但打包、运行时体积和 PDF 核心库许可证需要更多处理；
- 全 Rust UI：减少语言数量，但 PDF 查看器界面生态和开发效率不占优势。
