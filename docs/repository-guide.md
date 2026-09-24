# 仓库与代码导航

本文记录“代码在哪里、应该从哪里改”。系统分层、数据流和模块设计由[系统架构](architecture.md)统一说明；需求边界见[产品范围](product.md)。

## 1. 当前目录

省略依赖、构建结果和大量图标后，仓库结构如下：

```text
pdf_toolbox/
├─ README.md / README.zh-CN.md  英文与中文项目入口
├─ CONTRIBUTING*.md             双语贡献指南
├─ SECURITY*.md                 双语安全报告政策
├─ THIRD_PARTY_NOTICES*.md      双语第三方许可证摘要
├─ LICENSE                      GPLv3 正文
├─ package.json                 前端依赖和 npm 命令
├─ package-lock.json            前端依赖版本锁
├─ index.html                   WebView HTML 入口
├─ vite.config.ts               Vite 开发服务器和构建配置
├─ tsconfig*.json               TypeScript 配置
├─ .gitignore                   本地和私有文件排除规则
├─ .gitattributes               仓库换行规则
├─ .editorconfig                编辑器基础格式规则
│
├─ src/
│  ├─ main.tsx                  React 挂载入口
│  ├─ App.tsx                   当前 P1 界面、加载与渲染逻辑
│  ├─ App.css                   当前原型样式
│  ├─ vite-env.d.ts             Vite 类型声明
│  └─ i18n/en.ts                集中的英文界面文案
│
├─ src-tauri/
│  ├─ Cargo.toml / Cargo.lock   Rust 包声明和版本锁
│  ├─ build.rs                  Tauri 构建入口
│  ├─ tauri.conf.json           窗口、CSP、标识和打包配置
│  ├─ capabilities/default.json 主窗口的 Tauri 权限
│  ├─ src/main.rs               Windows 可执行程序入口
│  ├─ src/lib.rs                Tauri 应用创建入口
│  └─ icons/                    应用打包图标
│
├─ docs/
│  ├─ README.md                 按任务导航的文档中心
│  ├─ product.md                产品范围与验收标准
│  ├─ roadmap.md                阶段、进度和退出条件
│  ├─ architecture.md           当前与目标系统架构
│  ├─ repository-guide.md       本文件
│  ├─ safety.md                 文件与系统安全规则
│  ├─ testing.md                测试策略和样本规划
│  ├─ rust-for-c-programmers.md 学习附录
│  ├─ decisions/                架构决策记录
│  └─ validation/               已执行实验的索引与记录
│
└─ tests/fixtures/
   ├─ README.md                 测试样本规则
   ├─ inventory.template.md     样本登记模板
   └─ private/                  不得提交的真实 PDF 副本
```

## 2. 生成目录与锁文件

下列目录由工具生成，不是源码，也不应提交：

```text
node_modules/       npm 依赖
dist/               Vite 前端构建结果
src-tauri/target/   默认 Cargo 构建结果
.cache/             项目本地缓存和替代 Cargo target
```

删除生成目录前仍须确认绝对路径，不对仓库根目录执行递归删除。

下列锁文件应当保留：

```text
package-lock.json
src-tauri/Cargo.lock
```

它们固定经过验证的依赖版本，也是许可证和安全审计的依据。

## 3. 常用命令

从仓库根目录运行：

```powershell
# 启动桌面开发窗口
npm run tauri dev

# TypeScript 检查并构建前端
npm run build

# 检查已知 npm 漏洞
npm audit --audit-level=high

# 检查 Rust 代码
cargo check --manifest-path src-tauri/Cargo.toml
```

`npm run tauri dev` 会依次启动 Vite、编译 Rust/Tauri 并打开窗口。第一次 Rust 编译会处理大量依赖，后续会使用增量缓存。

当前阶段不制作或发布安装包。`npm run tauri build` 属于后续发行验证。

## 4. 当前代码职责

### 前端入口

- `src/main.tsx`：只创建 React 根节点并挂载 `App`。
- `src/App.tsx`：P1 为快速验证而集中管理文件选择、PDF.js Worker、会话编号、密码识别和第一页 Canvas 渲染。
- `src/App.css`：原型布局和视觉样式，尚未形成设计系统。
- `src/i18n/en.ts`：全部用户可见英文文案；组件中不应新增散落的显示字符串。

`App.tsx` 的集中结构是已知的临时状态。进入 P2 时只按真实出现的职责逐步拆分，不预先创建空目录。目标模块边界见 [architecture.md](architecture.md#4-模块职责)。

### Tauri 入口

- `src-tauri/src/main.rs`：最薄的可执行入口，调用库的 `run()`。
- `src-tauri/src/lib.rs`：创建 Tauri 应用；未来从这里注册参数明确的 Rust 命令。
- `src-tauri/tauri.conf.json`：窗口、开发地址、构建目录、CSP 和打包配置。
- `src-tauri/capabilities/default.json`：前端可使用的 Tauri 能力。当前只有基础核心权限。

新增文件系统、Shell、网络或外部链接能力前，必须同步检查 capabilities、CSP 与 [safety.md](safety.md)。

## 5. 修改某项功能从哪里开始

| 任务 | 首先查看 | 还应检查 |
| --- | --- | --- |
| 修改按钮、状态或英文文案 | `src/i18n/en.ts` | 对应 React 组件 |
| 修改颜色和布局 | `src/App.css` | `src/App.tsx` |
| 修改打开 PDF 的流程 | `src/App.tsx` | `architecture.md`、`testing.md` |
| 修改 PDF.js 加载或渲染 | `src/App.tsx` | CSP、任务销毁、真实样本测试 |
| 修改窗口尺寸或标题 | `src-tauri/tauri.conf.json` | 无 |
| 增加桌面系统能力 | `src-tauri/src/lib.rs` | capabilities、CSP、`safety.md` |
| 增加 npm 依赖 | `package.json` | lockfile、许可证、安全审计 |
| 增加 Rust 依赖 | `src-tauri/Cargo.toml` | lockfile、许可证、安全审计 |
| 增加测试 PDF | `tests/fixtures/private/` | 私有清单、`.gitignore` |
| 改变产品范围 | `docs/product.md` | roadmap、必要时新增 ADR |
| 改变系统结构 | `docs/architecture.md` | repository guide、ADR |
| 记录实验结果 | `docs/validation/` | roadmap 中的对应阶段 |

进入 P2 并拆出新模块后，本表和目录树必须随代码一起更新。

## 6. 仓库约定

- 源码、配置和文档使用 UTF-8 与 LF；Windows 批处理脚本例外。
- 代码标识符、文件名和原型 UI 使用英文。
- 关键入口文档提供中英文版本；快速变化的设计文档暂以中文为唯一版本。
- 用户可见文案集中管理，不能作为程序状态或错误判断条件。
- 真实 PDF 只放在被忽略的私有样本目录，不进入日志、截图或提交记录。
- 新权限、新依赖、文件写入或重要架构变化必须同步更新相应权威文档。

## 7. 当前已知技术债务

- `App.tsx` 职责过多；
- 整份 PDF 一次性读入内存；
- 只渲染第一页；
- PDF.js 原始错误尚未统一映射；
- 没有自动化测试；
- 没有正式设计系统；
- 前端主包较大，尚未拆分；
- 尚未自动生成随安装包分发的完整第三方许可证清单。

这些事项由 [roadmap.md](roadmap.md) 安排优先级；本页只记录它们对当前代码导航的影响。
