# 参与贡献

[English](CONTRIBUTING.md) | 简体中文

感谢你愿意帮助 PDF Toolbox。项目仍处在早期原型阶段，当前优先级是安全、可验证和容易理解，而不是快速堆叠功能。

## 开始之前

- 修复小问题可以直接提交变更；新增较大功能前，建议先开 issue 说明使用场景和边界。
- 不要提交受版权保护、含隐私信息或来源不明的 PDF。
- 私有测试样本只放在 `tests/fixtures/private/`；其中除 `README.md` 外的内容都会被忽略。
- 不要在日志、截图或错误报告中泄露 PDF 内容、密码、本机路径或个人信息。
- 欢迎使用中文或英文提交 Issue 和 Pull Request。

## 变更要求

- 保持输入 PDF 只读。任何写入功能都应输出到新文件，并在替换现有文件前得到明确确认。
- 对异常、损坏、加密和超大文件采用可解释的失败方式。
- 新依赖必须说明用途和许可证；优先选择与 GPL-3.0-or-later 兼容、维护活跃的组件。
- 用户可见行为发生变化时，同步更新相关文档和测试说明。

## 提交前检查

```powershell
npm run build
npm audit --audit-level=high
cargo check --manifest-path src-tauri/Cargo.toml
```

如果改动涉及 PDF 解析或渲染，还应按 `docs/testing.md` 使用自己的本地样本完成相应场景验证。公开问题和提交记录中只写匿名化结果，不上传样本本身。
