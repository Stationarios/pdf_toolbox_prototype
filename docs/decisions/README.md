# 技术决策记录（ADR）

ADR 解释“为什么当时这样选择”，不替代描述当前系统的[架构文档](../architecture.md)。重要且长期的产品或技术选择使用短文档记录，避免几个月后只记得结论、不记得原因。

## 当前记录

- [0001：第一版仅实现安全的只读预览](0001-initial-product-boundary.md)
- [0002：初始技术栈采用 Tauri、React、TypeScript 与 PDF.js](0002-initial-technology-stack.md)

## 格式

文件命名：

```text
0003-short-decision-name.md
```

每份 ADR 包含：

```text
# 标题

状态：提议 / 接受 / 废弃 / 被替代
日期：YYYY-MM-DD

## 背景
要解决什么问题，有哪些约束。

## 决定
最终选择什么。

## 原因
为什么适合当前项目。

## 后果
得到什么，又承担什么成本。

## 备选方案
考虑过但没有选择什么。
```

ADR 记录当时合理的决定，后续可以被新 ADR 替代，但不删除历史记录。
