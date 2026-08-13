---
name: release
description: Use when publishing a new version of @gongxh/fairygui-cc to npm. Handles version bump, changelog, build, git commit, git tag, and npm publish reminder for this single package.
---

# Release

执行 @gongxh/fairygui-cc 完整发版流程：升级版本号 → 生成 CHANGELOG → 构建 → 提交 → 打 tag → 提醒发布。

本仓库是单包，可发布的包在 `source/`，git 仓库根目录是项目根。

## 用法

```
/release [patch|minor|major]
```

- `patch`（默认）— bug 修复，0.0.x → 0.0.x+1
- `minor` — 新功能，0.x.0 → 0.x+1.0
- `major` — 破坏性变更，x.0.0 → x+1.0.0

## 执行步骤

收到 `/release` 命令后，按以下步骤执行：

### 第一步：确认版本类型

如果用户没有指定类型，询问：
> 发版类型是 patch（bug修复）、minor（新功能）还是 major（破坏性变更）？

### 第二步：检查当前状态

在仓库根目录执行：

```bash
git status
git log --oneline -5
```

确认工作区干净（无未提交的修改）。如果有未提交内容，提示用户先提交。

### 第三步：从 package.json 获取当前版本

读取 `source/package.json` 的 `version` 字段，告知用户当前版本和即将升级到的版本，请求确认。

### 第四步：升级版本号

在 `source/` 目录升级本包版本号（不自动打 git tag，tag 由后续步骤处理）：

```bash
cd source && npm version {type} --no-git-tag-version
```

例如 `npm version patch --no-git-tag-version`。

### 第五步：生成 CHANGELOG

**调用 changelog 技能**生成本次发版的 CHANGELOG 条目。

注意：changelog 技能会从 `source/package.json` 读取版本号，此时版本号已在第四步更新，所以 CHANGELOG 条目会使用新版本号。

### 第六步：构建

只编译到 `source/dist`：

```bash
cd source && npm run build
```

如果构建失败，停止流程并报告错误。

### 第七步：提交代码

版本号和 CHANGELOG 都已修改完成，现在在仓库根目录统一提交：

```bash
git add .
git commit -m "chore: release v{NEW_VERSION}"
git push
```

`{NEW_VERSION}` 替换为实际的新版本号。

### 第八步：打 git tag

```bash
git tag v{NEW_VERSION}
git push --tags
```

`{NEW_VERSION}` 替换为实际的新版本号。

### 第九步：提醒发布到 npm

由于 OTP 限制，让用户在终端手动执行：

```bash
cd source && npm publish
```

由 npm 交互式完成 OTP 验证后发布。不要代为执行 `npm publish`。

### 完成

汇报发版结果：包名 `@gongxh/fairygui-cc`、版本号、tag。
