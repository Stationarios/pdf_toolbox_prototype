# 仓库导航与代码地图

这份文档回答三个问题：

1. 仓库里的每个目录是什么；
2. 应用启动和打开 PDF 时，代码如何流动；
3. 要修改某类功能时，应该从哪里开始。

如果第一次进入项目，只需先读本文件，不必一次读完所有设计文档。

## 1. 一分钟总览

PDF Toolbox 当前是一个由两部分组成的 Windows 桌面应用：

```text
┌──────────────────────────────────────────────┐
│ 前端：src/                                  │
│ React + TypeScript + PDF.js                 │
│ 界面、文件选择、PDF 解析、Canvas 页面渲染   │
├──────────────────────────────────────────────┤
│ 桌面外壳：src-tauri/                        │
│ Rust + Tauri + WebView2                     │
│ 创建窗口、限定桌面权限、将前端装进桌面程序   │
└──────────────────────────────────────────────┘
```

目前 Rust 不读取 PDF。用户通过 WebView 的文件选择器明确选择文件，前端获得文件字节并交给 PDF.js。这个设计只用于 P1 的最小安全验证，后续处理超大文件时可能改为受控的 Rust 分段读取。

## 2. 仓库目录树

省略依赖缓存、构建结果和大量图标后，当前结构如下：

```text
pdf_toolbox/
├─ README.md                    英文项目入口和文档索引
├─ README.zh-CN.md              中文项目入口和文档索引
├─ CONTRIBUTING.md              英文贡献指南
├─ CONTRIBUTING.zh-CN.md        中文贡献指南
├─ SECURITY.md                  英文安全报告政策
├─ SECURITY.zh-CN.md            中文安全报告政策
├─ THIRD_PARTY_NOTICES.md       英文第三方许可证摘要
├─ THIRD_PARTY_NOTICES.zh-CN.md 中文第三方许可证摘要
├─ LICENSE                      GPLv3 许可证正文
├─ package.json                 前端依赖与 npm 命令
├─ package-lock.json            前端依赖的精确版本锁
├─ index.html                   WebView 加载的 HTML 入口
├─ vite.config.ts               前端开发服务器和打包配置
├─ tsconfig.json                TypeScript 应用配置
├─ tsconfig.node.json           Vite 配置文件的 TypeScript 配置
├─ .gitignore                   私有样本、依赖和构建产物排除规则
│
├─ src/                         前端源代码
│  ├─ main.tsx                  React 启动入口
│  ├─ App.tsx                   P1 PDF 验证界面和逻辑
│  ├─ App.css                   P1 临时样式
│  ├─ vite-env.d.ts             Vite 类型声明
│  └─ i18n/
│     └─ en.ts                  当前英文界面的集中式文案
│
├─ src-tauri/                   Rust/Tauri 桌面程序
│  ├─ Cargo.toml                Rust 包和依赖声明
│  ├─ Cargo.lock                Rust 依赖的精确版本锁
│  ├─ build.rs                  Tauri 构建入口
│  ├─ tauri.conf.json           窗口、CSP、应用标识和打包配置
│  ├─ capabilities/
│  │  └─ default.json           主窗口允许使用的 Tauri 权限
│  ├─ src/
│  │  ├─ main.rs                Windows 可执行程序入口
│  │  └─ lib.rs                 创建并运行 Tauri 应用
│  └─ icons/                    各平台打包所需应用图标
│
├─ docs/                        产品、架构、安全和验证文档
│  ├─ product.md
│  ├─ architecture.md
│  ├─ repository-guide.md       本文件
│  ├─ safety.md
│  ├─ testing.md
│  ├─ roadmap.md
│  ├─ rust-for-c-programmers.md
│  ├─ decisions/                架构决策记录 ADR
│  └─ validation/               已执行验证的结果记录
│
└─ tests/
   └─ fixtures/
      ├─ README.md              测试样本规则
      ├─ inventory.template.md  样本登记模板
      └─ private/               不得提交的真实 PDF 副本
```

## 3. 哪些目录不是源码

以下目录由工具生成，不应该手动编辑，也不会提交 Git：

```text
node_modules/       npm 下载的前端依赖
dist/               Vite 生成的前端生产文件
src-tauri/target/   Cargo 生成的 Rust 编译文件和可执行程序
.cache/             本项目使用的 Cargo 下载缓存
```

如果构建出现异常，可以删除并重新生成这些目录，但删除前仍要确认路径，不能对项目根目录使用递归删除命令。

下面两个锁文件不是垃圾文件，应该保留并提交：

```text
package-lock.json
src-tauri/Cargo.lock
```

它们确保另一台电脑安装的是经过验证的相同依赖版本。

## 4. 应用如何启动

开发模式执行：

```text
npm run tauri dev
```

内部发生的事情：

```text
package.json 中的 tauri 命令
    ↓
Tauri CLI 读取 src-tauri/tauri.conf.json
    ↓
启动 Vite 开发服务器 localhost:1420
    ↓
Cargo 编译并运行 src-tauri/src/main.rs
    ↓
main.rs 调用 pdf_toolbox_lib::run()
    ↓
lib.rs 创建 Tauri 窗口
    ↓
WebView2 加载 Vite 页面
    ↓
index.html 加载 src/main.tsx
    ↓
main.tsx 挂载 React 的 <App />
    ↓
App.tsx 显示 PDF 验证界面
```

生产构建分两层：

- `npm run build`：只检查和打包前端；
- `npm run tauri build`：打包前端、编译 Rust，并生成桌面发行物。

当前阶段只验证开发版，不制作安装包。

## 5. 打开 PDF 时的数据流

当前 P1 流程：

```text
用户点击“选择 PDF”
    ↓
App.tsx 触发隐藏的 <input type="file">
    ↓
WebView2 只返回用户明确选择的 File 对象
    ↓
File.arrayBuffer() 读取文件副本的字节
    ↓
PDF.js getDocument() 创建加载任务和 Worker
    ↓
加密文件：onPassword → 显示“需要密码” → 销毁任务
普通文件：取得 PDFDocumentProxy
    ↓
getPage(1) 读取第一页
    ↓
计算视口和屏幕像素比例
    ↓
PDF.js 将第一页渲染到 <canvas>
    ↓
界面显示文件名、页数和文件大小
```

当前不存在下面这条路径：

```text
前端 → Rust → 修改或保存 PDF
```

因此 P1 验证窗口没有代码路径能够覆盖原文件。

## 6. 当前源文件职责

### `src/main.tsx`

只负责创建 React 根节点并挂载 `App`。通常很少修改。

### `src/App.tsx`

当前同时承担：

- 文件选择；
- PDF.js Worker 配置；
- 文档加载任务生命周期；
- 密码请求识别；
- 第一页渲染；
- UI 状态和错误文字。

这是为了快速验证架构而有意集中在一个文件中，不是长期结构。进入正式预览器开发时，应逐步拆为：

```text
src/
├─ app/                  应用入口和全局布局
├─ features/open-pdf/    打开文件流程
├─ features/viewer/      页面视图、缩放和滚动
├─ pdf/                  PDF.js 适配与文档会话
├─ components/           通用界面组件
├─ styles/               设计变量和全局样式
└─ shared/               错误、格式化及公共类型
```

只有在对应模块真正出现时才创建目录，避免先造空架构。

### `src/App.css`

当前是架构验证用临时样式。绿色圆角按钮没有产品设计意义。正式界面阶段会建立颜色、间距、字体、圆角和阴影等设计变量，再重做工具栏、状态栏和阅读区域。

### `src/i18n/en.ts`

当前原型只提供英文界面，但所有用户可见文案集中在这个文件中，组件不直接硬编码显示文字。界面稳定后可增加 `zh-CN.ts` 和语言选择机制；在此之前不引入完整国际化框架，也不维护两套频繁变化的原型文案。

新增文案时应避免拼接依赖英语语序的句子，也不能用显示文本作为程序状态或错误判断条件。

### `src-tauri/src/main.rs`

Windows 可执行程序的最薄入口。它关闭发行版控制台窗口，然后调用库入口。通常不放业务逻辑。

### `src-tauri/src/lib.rs`

创建 Tauri 应用。未来注册 Rust 命令、受控文件服务和后台任务时从这里连接模块，但实际业务逻辑应拆到其他 Rust 文件。

### `src-tauri/tauri.conf.json`

定义：

- 应用名和唯一标识；
- 开发服务器与生产前端目录；
- 默认窗口尺寸；
- Content Security Policy；
- 打包目标和图标。

修改 CSP 或文件协议属于安全相关变更，必须同步检查 `docs/safety.md`。

### `src-tauri/capabilities/default.json`

定义主窗口可以调用哪些 Tauri 能力。当前只有基础核心能力，没有文件系统、Shell、网络或外链插件权限。

新增权限前必须回答：为什么前端需要它、能否缩小范围、恶意 PDF 能否利用它。

## 7. 修改功能时去哪里

| 想做的事情 | 首先查看 | 通常还会涉及 |
|---|---|---|
| 改颜色、排版和按钮 | `src/App.css` | 将来的 `src/styles/`、组件文件 |
| 改打开 PDF 流程 | `src/App.tsx` | 将来的 `features/open-pdf/` |
| 改页面渲染、缩放 | `src/App.tsx` | 将来的 `pdf/` 和 `features/viewer/` |
| 改窗口尺寸或标题 | `src-tauri/tauri.conf.json` | 无 |
| 新增桌面文件能力 | `src-tauri/src/lib.rs` | capabilities、Rust 模块、安全文档 |
| 新增 npm 依赖 | `package.json` | `package-lock.json`、许可证记录 |
| 新增 Rust 依赖 | `src-tauri/Cargo.toml` | `Cargo.lock`、许可证记录 |
| 调整安全策略 | `tauri.conf.json`、capabilities | `docs/safety.md`、ADR |
| 增加测试 PDF | `tests/fixtures/` | 私有清单、`.gitignore` |
| 记录技术选择 | `docs/decisions/` | `docs/architecture.md` |
| 记录一次验证 | `docs/validation/` | `docs/roadmap.md` |

## 8. 前端和 Rust 如何分工

一个简单判断规则：

### 放在 TypeScript 前端

- 界面和交互；
- 当前可见页面；
- 缩放和滚动；
- PDF.js 页面渲染；
- 文本选择和标注浮层；
- 用户可以立即撤销的临时界面状态。

### 放在 Rust 后端

- 受控文件读取与写入；
- 临时文件和原子提交；
- qpdf、Tesseract 等外部程序调用；
- 大任务的进度、取消和超时；
- 路径规范化和权限边界；
- 不应由不可信页面内容直接控制的系统能力。

### 两边都需要

跨边界数据要使用明确的数据结构，而不是任意字符串命令。例如未来合并操作传递：

```text
MergeRequest {
  inputs,
  page_ranges,
  output,
  overwrite_confirmed
}
```

而不是把一整行 Shell 命令从前端交给 Rust 执行。

## 9. 推荐阅读顺序

### 只想知道项目现在能干什么

1. `README.md`
2. `docs/product.md`
3. `docs/roadmap.md`

### 准备修改前端

1. 本文件
2. `src/main.tsx`
3. `src/App.tsx`
4. `src/App.css`

### 准备修改 Rust/Tauri

1. `docs/rust-for-c-programmers.md`
2. `src-tauri/src/main.rs`
3. `src-tauri/src/lib.rs`
4. `src-tauri/tauri.conf.json`
5. `src-tauri/capabilities/default.json`
6. `docs/safety.md`

### 准备增加 PDF 功能

1. `docs/architecture.md`
2. `docs/safety.md`
3. `docs/testing.md`
4. 对应 ADR 和验证记录

## 10. 当前架构债务

已知但暂不需要立即解决：

- `App.tsx` 职责过多；
- 只支持读取整份文件到内存；
- 只渲染第一页；
- 没有统一错误模型；
- 没有自动化测试；
- 没有正式设计系统；
- 前端主包较大，尚未做代码拆分；
- 已有直接依赖许可证摘要，但尚未建立随发行包生成完整第三方许可证清单的自动流程。

这些问题已经被看见，但应按路线图逐个解决，不进行无目标的大规模重构。
