# 聊天外观工坊 · dsh-chat-skin

给 DSH 的聊天区换一层真正属于你的背景：氛围渐变 / 自定义图片、遮罩深浅、毛玻璃、CSS 动画、字体、emoji 头像与运行图标。所有调整**实时生效**，配置保存在本机，重启后仍在。

> 这是给 DeepSeek Harness Web / Desktop 使用的客户端插件（bundle + client 双半），不依赖任何第三方运行时包。

## 功能

- **背景**
  - 8 套内置氛围：深海鲸歌、极光夜航、樱花微光、赛博霓虹、纸感留白、苔原森林、落日航线、极夜极简。
  - 自定义 CSS 渐变、纯色、图片 URL。
  - 上传本地壁纸（PNG / JPEG / WebP / GIF / AVIF，最大 12 MiB），文件只保存在本机。
  - 铺法（铺满 / 完整 / 平铺）、位置、不透明度、亮度、饱和度、对比度、模糊、暗角。
- **整个 DSH 的界面**
  - 作用范围可切「聊天区」或「整个应用」。
  - 「整个应用」下侧边栏、设置面板、右侧栏共用同一套玻璃材质：色调、侧栏透明度、设置面板透明度、模糊、描边、阴影都可调。
  - 面板色调可跟随背景自动取色，也可以单独指定。
  - 聊天区变为透明背景，真正让壁纸铺到侧栏和设置页后面，而不是只换聊天框。
- **深浅与玻璃**
  - 遮罩深浅 0–95%，遮罩颜色可调。
  - 文字明暗自动跟随背景亮度，也可强制浅色字 / 深色字，避免浅色主题下看不清。
  - 聊天气泡与输入框的毛玻璃、气泡不透明度、描边、阴影。
- **CSS 动画**
  - 内置缓慢漂移 / 呼吸缩放 / 横向移动 / 轻轻起伏 / 极光流动。
  - 周期、幅度、缓动可调；自动尊重系统「减少动态效果」。
  - 高级自定义 CSS：可写 `@keyframes` 和任意选择器。
- **字体**
  - 系统 / 微软雅黑 / 宋体 / 楷体 / 圆体 / 等宽，或自定义 `font-family` 栈。
  - 字号、行高、字间距、字重；代码字体单独设置。
- **图标**
  - 助手 / 用户 / 运行中三个 emoji 图标。
  - 可选消息头像（窄屏自动隐藏）。
  - 运行中的鲸鱼图标可替换成任意 emoji。
- **入口**
  - 设置 →「聊天外观」完整页面。
  - 右上角 🎨 快捷面板：开关、4 套预设、遮罩、模糊、动画、字体。

## 安装

将整个 `dsh-chat-skin` 目录放进当前 profile 的 bundle 列表即可。插件管理器安装本地目录的方式等价于：

1. 把包放进 profile 可解析的位置（例如 `$DSH_HOME/profiles/<profile>/vendor/dsh-chat-skin`）。
2. 在 profile 的 `package.json` 里加入依赖：
   ```json
   "dsh-chat-skin": "file:./vendor/dsh-chat-skin"
   ```
3. 把 `"dsh-chat-skin"` 加入 `dsh.profile.bundles`。
4. 重启 DSH（或让插件管理器热加载 bundle）。

包自带 `cordis.patch.yml`，会插入 `chat-skin` 这一行；不需要手写 Host/Client 行。

## 数据位置

- 配置：`$DSH_HOME/dsh-chat-skin/config.json`
- 上传壁纸：`$DSH_HOME/dsh-chat-skin/assets/`
- 浏览器即时缓存：`localStorage["dsh-chat-skin:v1"]`

Host 只注册三条同源路由：

| 路由 | 用途 |
|---|---|
| `GET/POST /dsh-chat-skin/api` | 读取 / 保存配置 |
| `POST /dsh-chat-skin/upload?name=…` | 上传壁纸 |
| `GET /dsh-chat-skin/asset/<file>` | 读取壁纸 |

写请求有同源检查；上传只接受白名单图片类型；静态文件路径做了 `basename` 逃逸防护。

## 自定义 CSS 示例

在「高级 → 自定义 CSS」里可以直接写：

```css
/* 让背景缓慢左右流动 */
[data-conversation-region="chat"]::before {
  animation: myFlow 22s ease-in-out infinite alternate !important;
}
@keyframes myFlow {
  from { transform: scale(1.08) translate3d(-2%, 0, 0); }
  to   { transform: scale(1.12) translate3d(2%, 0, 0); }
}

/* 给助手消息加一条左侧光线 */
[data-chat-flow-kind="assistant"] {
  border-left: 1px solid color-mix(in srgb, #22d3ee 38%, transparent);
  padding-left: 14px;
}
```

自定义 CSS 会追加在插件样式之后，可以覆盖内置规则。它只影响本机 UI，不会进入对话或模型上下文。

## 稳定性设计

- 只使用 DSH 的稳定 DOM 钩子：`data-conversation-region="chat"`、`data-conversation-scroll`、`data-composer-seat`、`data-chat-flow-kind`，不绑定构建时哈希类名。
- 气泡/输入框用 `[class*="_bubble"]`、`[class*="_composer"]` 这类子串探针做渐进增强；选择器不匹配时只是少一层玻璃，不会报错。
- Host 半边零依赖、只用 `node:` 内建；`webServer` 缺失时安静降级。
- 客户端所有样式/监听/定时器都由 `ctx.effect` 清理；插件卸载会移除样式和 `data-dcs-*` 标记。
- 动画遵守 `prefers-reduced-motion`。

## 已知限制

- 聊天区的玻璃效果依赖 DSH 现有的 `_bubble` / `_composer` 类名片段；未来大改版若改名，背景、字体和图标仍工作，玻璃可能失效。
- 「全局（实验）」模式会把背景铺到 `#root`，但侧栏、菜单等不透明面板仍可能遮住部分背景。
- 本地壁纸不会同步到其他设备；配置也不含任何凭据。
- 插件没有修改 DSH 的主题 token，因此 light / dark 切换仍由 DSH 自身负责；建议在两种主题下各看一次对比度。

## License

MIT
