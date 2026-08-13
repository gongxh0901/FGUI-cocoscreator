---
name: changelog
description: Use when generating a CHANGELOG entry for @gongxh/fairygui-cc based on git commits since the last tag.
---

# Changelog

根据 git log 自动生成 CHANGELOG 条目，追加到仓库根目录 `CHANGELOG.md` 文件顶部。

版本号以 `source/package.json` 为准。

## 用法

```
/changelog
```

## 执行步骤

### 第一步：获取上一个 tag

在仓库根目录执行：

```bash
git describe --tags --abbrev=0
```

如果没有 tag，使用第一个 commit 作为起点：
```bash
git rev-list --max-parents=0 HEAD
```

### 第二步：获取 commits

```bash
git log {last_tag}..HEAD --oneline --no-merges
```

### 第三步：分类整理

将 commits 按前缀分类：

| 前缀 | 分类 |
|------|------|
| `feat` | Added（新增功能）|
| `fix` | Fixed（Bug 修复）|
| `refactor` | Changed（重构/改动）|
| `docs` | Documentation（文档）|
| `chore` | Chore（构建/版本/配置）|
| 其他 | Changed |

过滤掉纯版本 bump 的 commit（`chore: bump version`、`chore: release`）。

### 第四步：获取当前版本号

读取 `source/package.json` 的 `version` 字段。

### 第五步：生成 CHANGELOG 条目

格式：

```markdown
## [x.x.x] - YYYY-MM-DD

### Added
- feat: xxx (commit hash)

### Fixed
- fix: xxx (commit hash)

### Changed
- refactor: xxx (commit hash)

### Chore
- chore: xxx (commit hash)
```

日期使用今天的日期。只包含有内容的分类。

### 第六步：写入文件

写入仓库根目录 `CHANGELOG.md`。

如果 `CHANGELOG.md` 不存在，创建并写入：
```markdown
# Changelog

{新条目}
```

如果已存在，将新条目插入到第一个 `## [` 之前（保留文件头部的标题）。

### 完成

展示生成的 CHANGELOG 条目内容，告知已写入文件。
