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

## 正式素材

封面和九章章首图使用从正式素材生成的 WebP，映射位于 `src/imported-media.json`。两个结局使用纯文字排版。完成任意一个结局后，读者可通过独立的番外入口观看 `public/media/end.mp4`。番外正文中的玻璃瓶使用 CSS 分层动画，场景包含 `public/media/bottle.webp`。

正式正文由 Word 原稿导入。公开仓库只包含提取后的段落和网站使用的媒体文件。

## 部署到 GitHub Pages

1. 确认原稿内容与媒体的公开发布范围，并使用对现有仓库有写入权限的 GitHub 账号。
2. 将项目源码推送到仓库的 `main` 分支。仓库需要包含 `.github/workflows/pages.yml`、`src/`、`public/` 和依赖锁文件。原始附件和本地临时目录已加入 `.gitignore`，构建产物会包含网站正文。
3. 在仓库的 **Settings → Pages → Build and deployment** 下将 **Source** 设为 **GitHub Actions**。
4. 在 **Actions → Deploy novel to GitHub Pages** 中点击 **Run workflow**，或向 `main` 提交一次修改。部署完成后，Actions 作业会显示站点地址。之后推送到 `main` 会自动重新部署。

相对资源路径支持仓库子路径，章节使用 `#ch01` 等哈希地址，刷新时由同一份静态首页加载。
