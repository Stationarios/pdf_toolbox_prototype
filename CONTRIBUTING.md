# Contributing

English | [简体中文](CONTRIBUTING.zh-CN.md)

Thank you for helping PDF Toolbox. The project is still an early prototype, so safety, verifiability, and clarity take priority over adding features quickly.

## Before you begin

- Small fixes can be proposed directly. Please open an issue before starting a substantial feature so its use case and boundaries can be discussed.
- Do not commit copyrighted, private, or questionably sourced PDF files.
- Keep private fixtures under `tests/fixtures/private/`; everything there except `README.md` is ignored.
- Do not expose PDF contents, passwords, local paths, or personal information in logs, screenshots, or bug reports.
- Issues and pull requests are welcome in either English or Chinese.

## Requirements for changes

- Keep input PDFs read-only. Any future write operation must create a new output and require explicit confirmation before replacing an existing file.
- Fail safely and explain errors involving malformed, damaged, encrypted, or very large files.
- Explain the purpose and license of every new dependency. Prefer actively maintained dependencies compatible with GPL-3.0-or-later.
- Update the relevant documentation and test notes when user-visible behavior changes.

## Checks before submission

```powershell
npm run build
npm audit --audit-level=high
cargo check --manifest-path src-tauri/Cargo.toml
```

Changes involving PDF parsing or rendering should also be exercised against your own local fixtures according to `docs/testing.md`. Record only anonymized results in public issues and commits; never upload the original fixtures.
