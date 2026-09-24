# PDF Toolbox

[English](README.md) | 简体中文

一个本地优先、无账号、无订阅的开源 PDF 工具。当前仍是很早期的 Windows 原型，用来先验证一件最重要的事：安全、可靠地打开真实世界里的 PDF，而不修改原文件。

> [!WARNING]
> 当前版本不是成熟阅读器，也不建议用于唯一副本或关键工作流。它只能选择 PDF、读取并显示第一页；不会保存或改写 PDF。

## 当前能做什么

- 从系统文件选择器选择一个 PDF。
- 使用 PDF.js 在本地解析并渲染第一页。
- 遇到加密 PDF 时给出明确提示，而不是尝试绕过密码。
- 在 Windows + Tauri 桌面窗口中运行，文档不会上传到云端。

目前还不能翻页、缩放、搜索、标注、合并、拆分或 OCR。这些功能会在只读预览基础稳定后逐步加入。

## 安全原则

- 默认只读；未经用户明确操作，绝不修改输入文件。
- 将来的写入操作采用“写入新文件、验证结果、再替换目标”的事务式流程。
- 不上传文档，不要求登录，不依赖云服务。
- 单个异常文件不应导致应用崩溃或影响其他文件。
- 输出必须是其他常见 PDF 阅读器可打开的标准 PDF。

测试用的真实 PDF 可能含版权或隐私信息，因此 `tests/fixtures/private/` 中的样本和清单不会进入版本库。公开仓库只包含如何自行准备样本的说明。

## 本地运行

开发环境需要 Windows 10/11 与 WebView2、Node.js 24 或兼容版本、Rust stable（MSVC toolchain），以及 Visual Studio Build Tools 的 C++ 生成工具。

```powershell
npm install
npm run tauri dev
```

基础检查：

```powershell
npm run build
npm audit --audit-level=high
cargo check --manifest-path src-tauri/Cargo.toml
```

## 仓库导览

不知道从哪里开始时，请先看[文档中心](docs/README.md)。也可以直接前往对应的唯一权威来源：

- [产品范围](docs/product.md) — 目标用户、第一版需求、明确排除项和验收标准。
- [开发路线图](docs/roadmap.md) — 当前阶段、后续里程碑及每个阶段的退出条件。
- [系统架构](docs/architecture.md) — 当前与目标结构、数据流、模块边界和关键技术约束。
- [仓库与代码导航](docs/repository-guide.md) — 文件位置、开发命令，以及修改某项功能应从哪里开始。
- [安全规则](docs/safety.md) — 只读保证、资源限制、隐私规则和未来写入协议。
- [测试策略](docs/testing.md) — 样本管理、测试层次、边界情况和验证清单。
- [架构决策记录](docs/decisions/README.md) — 重要产品与技术选择背后的理由。

## 参与开发

项目还在搭地基阶段。提交改动前请先阅读[中文贡献指南](CONTRIBUTING.zh-CN.md)，安全问题请按[中文安全政策](SECURITY.zh-CN.md)报告。第三方组件及许可证见[中文第三方组件说明](THIRD_PARTY_NOTICES.zh-CN.md)。

欢迎使用中文或英文提交 Issue 和 Pull Request。

本项目以 **GNU General Public License v3.0 or later** 发布，详见 [LICENSE](LICENSE)。GPL 允许使用、修改和商业分发，但分发衍生版本时也必须按 GPL 提供相应源代码。项目名称和图标的商标规则可在形成稳定品牌后另行制定。
