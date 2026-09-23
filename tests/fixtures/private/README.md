# 私有样本

将真实 PDF 的副本放在此目录。

此目录中的 PDF、密码文件和其他真实样本不会被 Git 跟踪。不要删除或修改项目根目录 `.gitignore` 中对应规则。

建议文件名使用简单编号，避免在测试报告中泄露论文或教材标题，例如：

```text
encrypted-01.pdf
textbook-01.pdf
slides-01.pdf
paper-single-column-01.pdf
paper-double-column-01.pdf
scan-01.pdf
```

如果要专门测试中文或 emoji 路径，可以额外复制一个普通、非敏感样本并命名为：

```text
中文 文件名（测试）.pdf
论文测试-🧪.pdf
```

真实密码不要写在本目录的 README 或未来的 Git 文件中。测试阶段可使用临时的本地记录，或者为测试副本设置一个专用、非敏感密码。
