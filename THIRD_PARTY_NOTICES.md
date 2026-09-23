# Third-Party Notices

English | [简体中文](THIRD_PARTY_NOTICES.zh-CN.md)

PDF Toolbox uses open-source third-party components. This file is a convenient summary and does not replace the license texts distributed with those components.

## Direct dependencies

| Component | Purpose | License |
| --- | --- | --- |
| [PDF.js / pdfjs-dist](https://github.com/mozilla/pdf.js) | PDF parsing and page rendering | Apache-2.0 |
| [React](https://github.com/facebook/react) | User interface | MIT |
| [Vite](https://github.com/vitejs/vite) | Frontend development and build tooling | MIT |
| [TypeScript](https://github.com/microsoft/TypeScript) | Static type checking for the frontend | Apache-2.0 |
| [Tauri](https://github.com/tauri-apps/tauri) | Windows desktop application shell | Apache-2.0 OR MIT |
| [Serde](https://github.com/serde-rs/serde) | Rust data serialization | Apache-2.0 OR MIT |

Transitive JavaScript and Rust dependencies also include software under the MIT, Apache-2.0, BSD, ISC, MPL-2.0, Unicode-3.0, and other licenses. These dependencies do not change PDF Toolbox's own GPL-3.0-or-later license, but binary distributions must preserve all required copyright and license notices.

Before the first distributable installer is produced, the project will generate and manually review a complete third-party license inventory from the lockfiles and include all required license texts with the installer. The lockfiles are the source of truth for auditing concrete dependency versions.
