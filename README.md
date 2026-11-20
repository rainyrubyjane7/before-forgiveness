# 在获得原谅之前

一部中文 Supernatural 同人交互小说。项目使用 React、Vite、TypeScript 和 CSS。阅读进度保存在当前浏览器的 localStorage 中。

## 本地运行

使用 Node.js 22.12 或更新的 Node.js 22 LTS。

```bash
npm ci
npm run dev
```

按终端显示的地址打开预览。云端工作区可在 Codex 的 Desktop（桌面）面板中使用共享 Chrome。运行 `npm run check` 检查类型，`npm run build` 会在 `dist/` 生成静态站点。可用 `npm run preview` 预览构建结果。

## 编辑素材与文本

| 修改项 | 操作 |
| --- | --- |
| 批量导入图片或视频 | 把原素材放在项目内，建议放入 `/workspace/media-source/`，按 `第2章_页首.jpg`、`chapter-05.webm`、`ch七.webp`、`结局1.jpg` 或 `番外.jpg` 命名。也可以把原文件直接作为对话附件上传，保留文件名。执行 `npm run media`。脚本复制已匹配的文件，保留源文件，并生成 `src/imported-media.json` 和 `media-report.json`。 |
| 指定页首图片 | 把图片放进 `public/media/`。在 `src/story.ts` 的对应章节添加 `media: { type: 'image', src: 'media/new-photo.webp' }`。封面上传名为 `封面.jpg` 或 `cover.webp` 的图片后重新导入。 |
| 替换视频 | 在对应章节配置 `media: { type: 'video', src: 'media/scene.mp4', poster: 'media/scene.webp' }`。推荐浏览器兼容的 H.264 MP4 或 WebM。MOV、M4V 等会列在报告中。保留原文件，另存为兼容格式后再导入。 |
| 调整裁剪 | 章节的 `framing` 或手动配置的 `media` 对象支持 `position: '50% 40%'` 和 `mobilePosition: '55% 45%'`。百分比从左、上开始。容器保持 4:3。如果必须完整保留竖图内容，可设置 `mobileFit: 'contain'`。 |
| 改主题颜色 | 编辑 `src/story.ts` 中对应章节的 `theme`，顺序为文字／深色、装饰色、背景色。 |
| 改音乐 | 编辑 `src/story.ts` 中的 `music`。第二章、第五章和两个结局分别有各自的链接。歌曲在新标签页打开。 |
| 更新小说文字 | 更新 Word 原稿后运行 `npm run import:text -- ./text.docx`。也可以直接编辑 `src/manuscript.json` 的段落数组。导入脚本会验证章节顺序和分支边界。若新稿改变了标题结构，需要同步更新脚本的匹配规则。 |

批量导入时，含「封面」「页首」「hero」「poster」的已匹配素材优先。同一章的其他素材可在页首切换。文件名匹配多个章节或无法归类时，原文件保留在原处，可在 `media-report.json` 查看。重新导入后，旧的派生副本可能仍留在 `public/media/imported/`，可按映射报告清理。

## 素材交付清单

工作区收到 Word 原稿和开发要求。上一轮聊天里显示的七张参考图没有对应的源文件。本轮未收到正式原图和视频，文件级盘点见 `media-inventory.tsv`。

| 页面 | 当前状态 |
| --- | --- |
| 封面 | 使用 CSS 底色，待上传封面原图 |
| 第 01–09 章 | 均显示「本章素材待上传」 |
| 两条结局与番外 | 均待上传对应的章首图片或视频 |
| 记忆瓶 | 使用现有 CSS 动画，瓶塞移开、纸条升起并展开 |

上一版的生成图已移出网站资源目录，保留在 `work/previous-illustrations/`。工作区里的视频为上一版的临时测试样片。结局一的歌手在需求中未提供，音乐卡显示曲名。

## 部署到 GitHub Pages

1. 确认原稿内容与媒体的发布范围，创建有权提交的 GitHub 仓库。GitHub Pages 站点可能公开，即使源仓库设为私有，访问控制也取决于 GitHub 方案与组织设置。
2. 将项目源码推送到仓库的 `main` 分支。仓库需要包含 `.github/workflows/pages.yml`、`src/`、`public/` 和依赖锁文件。原始附件和本地临时目录已加入 `.gitignore`，构建产物会包含网站正文。
3. 在仓库的 **Settings → Pages → Build and deployment** 下将 **Source** 设为 **GitHub Actions**。
4. 在 **Actions → Deploy novel to GitHub Pages** 中点击 **Run workflow**，或向 `main` 提交一次修改。部署完成后，Actions 作业会显示站点地址。之后推送到 `main` 会自动重新部署。

相对资源路径支持仓库子路径，章节使用 `#ch01` 等哈希地址，刷新时由同一份静态首页加载。

## 本地验收结果

- TypeScript 类型检查与 Vite 生产构建通过。
- Word 正文按原顺序逐段重组核对。Chromium 对九章、两个结局及番外页面逐段核对。
- 在桌面 1440 × 900、手机 390 × 844 和窄屏 320 × 640 测试文字排版、目录、章节导航、四个指定音乐链接、双结局、开瓶与重看及续读恢复。
- 独立测试目录中的样片用于验证媒体自动匹配、4:3 构图、窄屏裁切设置和视频回退。正式素材的构图待收到源文件后核对。
- 当前仅在共享桌面提供本地预览，尚未执行公开发布。
