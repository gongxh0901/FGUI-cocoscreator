# FairyGUI-cocoscreator

适用于 Cocos Creator 的 FairyGUI 框架，配合 [FairyGUI 编辑器](https://www.fairygui.com) 使用。

## 分支

- `ccc3.0`：Cocos Creator 3.4 及以上版本。
- `master`：Cocos Creator 2.4 及以上版本。
- `ccc2.1-2.3`：Cocos Creator 2.1 至 2.3。
- `ccc2.0`：Cocos Creator 2.0。
- `ccc3.0-3.4`：Cocos Creator 3.0 至 3.4。

## 目录

- `source`：`@gongxh/fairygui-cc` 的源码和 npm 包。
- `source/dist`：ESM、压缩 ESM 和 TypeScript 声明，由本仓库跟踪。
- `demo`：可由 Cocos Creator 打开的示例项目。
- `demo/UIProject`：FairyGUI 编辑器工程。

## 安装

```bash
npm install @gongxh/fairygui-cc
```

与 `@gongxh/bit-*` 一起使用时，已安装的这些包使用同一版本，并同步升级。

## 构建和发布

本仓库作为 [bit-framework](https://github.com/gongxh0901/bit-framework) 的 `vendor/fairygui-cc` 子模块参与统一开发和发布。在主仓库根目录通过 mise 执行全量构建：

```bash
mise run build
```

`source/gulpfile.js` 生成 `source/dist/fairygui.mjs`、`fairygui.min.mjs` 和 `fairygui.d.ts`。版本提交包含 `source/CHANGELOG.md` 和实际变化的构建产物。

全部公开包共用同一版本。在主仓库运行 `mise run publish`，自动检查发布分支，通过 Git 原生自动 stash 携带已跟踪的本地修改做仅快进同步。主仓库同步后先使本仓库包含主仓库 gitlink，再同步 `ccc3.0`，最后全量构建，复用或交互生成 Changeset。预检成功后，自动将本仓库全部可提交修改推送到 `ccc3.0`，再将主仓库全部可提交修改及 gitlink 推送到 `main`；包括已暂存、未暂存和未被 Git 忽略的未跟踪文件。

执行该命令即授权上述自动提交和推送，通过已登录的 GitHub CLI 调度主仓库发布工作流并等待结果。分叉、自动恢复冲突或未跟踪文件覆盖保护等无法安全同步时停止，保留修改和 Git 自动 stash，可通过 `git status`、`git stash list` 检查恢复。`mise run changeset` 也可独立使用。

CI 消费 Changeset 并生成统一版本、`source/CHANGELOG.md` 和锁文件，将 FairyGUI 版本提交推到本仓库专用发布分支，再将记录该 gitlink 的版本提交推到主仓库 `main`。上传 npm 前冻结主仓库版本提交，确保 `ccc3.0` 包含本批次 gitlink，必要时快进；已包含该提交的后代分支保持原位，真正分叉时停止，发布仍使用冻结 gitlink 的源码。

npm 发布由主仓库 `publish.yml` 统一执行：固定待发布提交，全部包上传到 `release-candidate` 并校验后提升 `latest`，两个仓库创建相同的 `vX.Y.Z` tag。失败后恢复同一批次，完成前阻止下一版本。凭证、命令和恢复规则见主仓库的 [构建与发布文档](https://github.com/gongxh0901/bit-framework/blob/main/docs/COMMANDS.md)。

## License

MIT
