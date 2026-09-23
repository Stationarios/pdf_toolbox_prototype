# PDF Toolbox

English | [简体中文](README.zh-CN.md)

A local-first, account-free, subscription-free, open-source PDF toolbox. This is still a very early Windows prototype focused on one essential goal: opening real-world PDF files safely and reliably without modifying the originals.

> [!WARNING]
> This is not yet a production-ready PDF reader and should not be used as the only tool in a critical workflow. The prototype can select a PDF, read it, and render its first page. It cannot save or modify PDFs.

## What works today

- Select a PDF through the system file picker.
- Parse and render its first page locally with PDF.js.
- Detect password-protected PDFs and show a clear message instead of attempting to bypass encryption.
- Run inside a Windows desktop window powered by Tauri; documents are never uploaded.

Page navigation, zooming, search, annotations, merging, splitting, and OCR are not implemented yet. They will be added incrementally after the read-only viewer foundation is proven reliable.

## Safety principles

- Inputs are read-only by default and are never changed without an explicit user action.
- Future write operations will use a transactional flow: create a new file, validate it, and only then replace a destination with confirmation.
- Documents stay local. No account or cloud service is required.
- One malformed document must not crash the application or affect other files.
- Generated files must remain standard PDFs that other common readers can open.

Real test documents may contain copyrighted or private material. Files and inventories under `tests/fixtures/private/` are therefore excluded from version control; the public repository only provides instructions for preparing your own fixtures.

## Run locally

The development environment requires Windows 10/11 with WebView2, Node.js 24 or a compatible version, Rust stable with the MSVC toolchain, and the C++ build tools from Visual Studio Build Tools.

```powershell
npm install
npm run tauri dev
```

Basic checks:

```powershell
npm run build
npm audit --audit-level=high
cargo check --manifest-path src-tauri/Cargo.toml
```

## Documentation

Detailed design documentation is currently written primarily in Chinese. Translation is welcome, but the project avoids maintaining incomplete line-by-line translations of rapidly changing early design documents.

- [Product scope (Chinese)](docs/product.md)
- [Architecture (Chinese)](docs/architecture.md)
- [Repository and code guide (Chinese)](docs/repository-guide.md)
- [File and system safety (Chinese)](docs/safety.md)
- [Testing strategy (Chinese)](docs/testing.md)
- [Roadmap (Chinese)](docs/roadmap.md)
- [Rust/Tauri for C programmers (Chinese)](docs/rust-for-c-programmers.md)
- [Architecture decision records (Chinese)](docs/decisions/README.md)
- [Minimal-window validation record (Chinese)](docs/validation/2026-09-23-p1-minimal-window.md)

## Contributing

The project is still laying its foundations. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes and follow [SECURITY.md](SECURITY.md) when reporting a vulnerability. Third-party components and their licenses are summarized in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Issues and pull requests are welcome in either English or Chinese.

PDF Toolbox is licensed under the **GNU General Public License v3.0 or later**; see [LICENSE](LICENSE). The GPL permits use, modification, and commercial distribution, while requiring distributed derivative versions to provide corresponding source code under the GPL. A separate trademark policy may be introduced if the project develops a stable name and visual identity.
