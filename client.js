/**
 * dsh-chat-skin — browser half.
 *
 * One global style tag does the painting; React only edits a small persisted
 * document. The style targets DSH's stable data attributes
 * (`data-conversation-region="chat"`, `data-conversation-scroll`,
 * `data-composer-seat`, `data-chat-flow-kind`) rather than hashed CSS-module
 * class names, with `[class*="_bubble"]` style probes as a resilient fallback.
 */
window.__ModuleLoader__.load({
  id: 'dsh-chat-skin',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'chat-skin'
    const API = '/dsh-chat-skin/api'
    const UPLOAD = '/dsh-chat-skin/upload'
    const STORAGE_KEY = 'dsh-chat-skin:v1'

    const DEFAULTS = {
      version: 1,
      enabled: true,
      showLauncher: true,
      scope: 'chat',
      textMode: 'auto',
      background: {
        kind: 'preset',
        preset: 'deep-sea',
        color: '#071421',
        gradient: 'linear-gradient(135deg, #030b16 0%, #071f33 45%, #0b3b4a 100%)',
        image: '',
        fit: 'cover',
        position: 'center',
        opacity: 1,
        blur: 0,
        brightness: 100,
        saturation: 100,
        contrast: 100,
        dim: 32,
        tint: '#000000',
        vignette: 18,
      },
      animation: {
        name: 'none',
        duration: 28,
        easing: 'ease-in-out',
        intensity: 35,
        customName: '',
        customCss: '',
      },
      surface: {
        glass: 10,
        bubbleOpacity: 76,
        border: true,
        shadow: true,
      },
      chrome: {
        enabled: true,
        tintMode: 'auto',
        tint: '#0b1220',
        sidebarOpacity: 58,
        panelOpacity: 82,
        blur: 18,
        border: true,
        shadow: true,
      },
      font: {
        preset: 'system',
        family: '',
        codeFamily: '',
        size: 14,
        lineHeight: 1.7,
        letterSpacing: 0,
        weight: 400,
      },
      icons: {
        assistant: '🐋',
        user: '🫧',
        running: '🐋',
        showAvatars: false,
      },
      customCss: '',
      updatedAt: 0,
    }

    const PRESET_BG = {
      'deep-sea': 'radial-gradient(1100px 700px at 12% 8%, rgba(34,211,238,.24), transparent 62%), linear-gradient(135deg, #030b16 0%, #071f33 45%, #0b3b4a 100%)',
      aurora: 'radial-gradient(900px 620px at 18% 18%, rgba(52,211,153,.32), transparent 64%), radial-gradient(980px 680px at 86% 12%, rgba(139,92,246,.34), transparent 62%), linear-gradient(160deg, #07111f, #0d1b2a 52%, #102a43)',
      sakura: 'radial-gradient(820px 560px at 82% 12%, rgba(251,113,133,.32), transparent 62%), radial-gradient(760px 540px at 12% 82%, rgba(244,114,182,.22), transparent 64%), linear-gradient(135deg, #1b1020, #3a1d2e 52%, #5b2a44)',
      cyber: 'radial-gradient(760px 520px at 85% 16%, rgba(34,211,238,.24), transparent 58%), linear-gradient(135deg, #060714, #160b2e 42%, #3b0764 72%, #0e7490)',
      paper: 'radial-gradient(900px 600px at 18% 12%, rgba(255,255,255,.55), transparent 62%), linear-gradient(135deg, #f7f3ea, #e9e0cf 55%, #d8cbb5)',
      forest: 'radial-gradient(820px 560px at 78% 10%, rgba(74,222,128,.22), transparent 62%), linear-gradient(135deg, #04140f, #0b2e22 52%, #134e3a)',
      sunset: 'radial-gradient(860px 560px at 18% 18%, rgba(251,191,36,.28), transparent 60%), linear-gradient(160deg, #1b1035, #6b1d4a 45%, #c2410c 100%)',
      midnight: 'radial-gradient(760px 520px at 72% 16%, rgba(255,255,255,.09), transparent 60%), linear-gradient(180deg, #05070d, #0b1220 58%, #111827)',
    }

    const PRESETS = [
      { id: 'deep-sea', name: '深海鲸歌', sub: '冷蓝 · 微光', color: '#071421', dim: 34, tint: '#000000', blur: 0, animation: 'drift', duration: 30, font: 'system', assistant: '🐋', user: '🫧', running: '🐋' },
      { id: 'aurora', name: '极光夜航', sub: '绿紫 · 流动', color: '#07111f', dim: 30, tint: '#000000', blur: 2, animation: 'aurora', duration: 36, font: 'yahei', assistant: '🌌', user: '✨', running: '🌌' },
      { id: 'sakura', name: '樱花微光', sub: '粉紫 · 柔软', color: '#1b1020', dim: 24, tint: '#000000', blur: 4, animation: 'breathe', duration: 26, font: 'round', assistant: '🌸', user: '🫧', running: '🌸' },
      { id: 'cyber', name: '赛博霓虹', sub: '紫青 · 脉冲', color: '#060714', dim: 38, tint: '#05010f', blur: 0, animation: 'pan', duration: 24, font: 'mono', assistant: '⚡', user: '🛰️', running: '⚡' },
      { id: 'paper', name: '纸感留白', sub: '暖白 · 安静', color: '#e9e0cf', dim: 10, tint: '#3b2f1e', blur: 0, animation: 'none', duration: 28, font: 'song', assistant: '🖋️', user: '🫧', running: '🖋️' },
      { id: 'forest', name: '苔原森林', sub: '墨绿 · 呼吸', color: '#04140f', dim: 30, tint: '#02100b', blur: 2, animation: 'zoom', duration: 34, font: 'kai', assistant: '🌿', user: '🍃', running: '🌿' },
      { id: 'sunset', name: '落日航线', sub: '橙紫 · 缓慢', color: '#1b1035', dim: 26, tint: '#120818', blur: 0, animation: 'drift', duration: 40, font: 'yahei', assistant: '🌅', user: '🧡', running: '🌅' },
      { id: 'midnight', name: '极夜极简', sub: '近黑 · 专注', color: '#05070d', dim: 44, tint: '#000000', blur: 0, animation: 'none', duration: 28, font: 'system', assistant: '🐋', user: '·', running: '🐋' },
    ]

    const FONTS = {
      system: {
        ui: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
        code: '"SF Mono", "JetBrains Mono", "Cascadia Code", Consolas, "Liberation Mono", Menlo, monospace',
      },
      yahei: {
        ui: '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Segoe UI", sans-serif',
        code: '"Cascadia Code", "Microsoft YaHei", Consolas, monospace',
      },
      song: {
        ui: '"Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", Georgia, serif',
        code: '"SF Mono", Consolas, "Songti SC", monospace',
      },
      kai: {
        ui: '"Kaiti SC", "STKaiti", "KaiTi", "Noto Serif CJK SC", serif',
        code: '"Cascadia Code", "KaiTi", Consolas, monospace',
      },
      round: {
        ui: '"YouYuan", "Yuanti SC", "Hiragino Maru Gothic ProN", "PingFang SC", "Microsoft YaHei", sans-serif',
        code: '"SF Mono", "YouYuan", Consolas, monospace',
      },
      mono: {
        ui: '"JetBrains Mono", "Cascadia Code", "SF Mono", Consolas, "Microsoft YaHei", monospace',
        code: '"JetBrains Mono", "Cascadia Code", "SF Mono", Consolas, monospace',
      },
    }

    const FIT = { cover: 'cover', contain: 'contain', tile: 'auto' }
    const REPEAT = { cover: 'no-repeat', contain: 'no-repeat', tile: 'repeat' }
    const POSITIONS = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']
    const EMOJI_IDEAS = ['🐋', '🫧', '🌌', '🪐', '🌸', '🦋', '⚡', '🌿', '🖋️', '🤖', '🐱', '🧡']

    const ANIMATIONS = [
      ['none', 'animNone'],
      ['drift', 'animDrift'],
      ['zoom', 'animZoom'],
      ['pan', 'animPan'],
      ['breathe', 'animBreathe'],
      ['aurora', 'animAurora'],
    ]

    const DICT_ZH = {
      nav: '聊天外观',
      title: '聊天外观工坊',
      subtitle: '给对话换一层背景。背景、深浅、毛玻璃、动画、字体和图标都会实时生效，并保存在本机。',
      enabled: '启用外观',
      reset: '恢复默认',
      saved: '已保存',
      saving: '保存中…',
      local: '仅本机缓存',
      error: '保存失败',
      offline: '离线模式',
      preview: '实时预览',
      previewHint: '预览只用于看配色与字体；实际效果会铺满聊天区。',
      background: '背景',
      backgroundHint: '选一个氛围，或上传自己的壁纸。图片只保存在本机。',
      source: '来源',
      preset: '氛围',
      gradient: '渐变',
      image: '图片',
      solid: '纯色',
      upload: '上传壁纸',
      uploading: '上传中…',
      uploaded: '已应用新壁纸',
      uploadFail: '上传失败',
      tooBig: '图片超过 12 MiB',
      unsupported: '仅支持 PNG / JPEG / WebP / GIF / AVIF',
      imageUrl: '图片地址',
      imageUrlHint: '也可以粘贴 https:// 图片地址，或 DSH 的 /dsh-chat-skin/asset/ 地址。',
      gradientCss: 'CSS 渐变',
      gradientHint: '例如 linear-gradient(135deg, #0f172a, #1e3a8a)。',
      solidColor: '背景颜色',
      fit: '铺法',
      fitCover: '铺满',
      fitContain: '完整',
      fitTile: '平铺',
      position: '位置',
      opacity: '背景不透明度',
      blur: '背景模糊',
      brightness: '亮度',
      saturation: '饱和度',
      contrast: '对比度',
      dim: '遮罩深浅',
      dimHint: '数值越大，背景越暗、文字越清楚。',
      tint: '遮罩颜色',
      vignette: '暗角',
      depth: '深度与玻璃',
      depthHint: '让气泡和输入框浮在背景上，而不是糊成一片。',
      glass: '气泡毛玻璃',
      bubbleOpacity: '气泡不透明度',
      border: '气泡描边',
      shadow: '气泡阴影',
      animation: '动画',
      animationHint: '尊重系统的“减少动态效果”设置；不必担心晕动症。',
      animationName: '动画类型',
      animNone: '无',
      animDrift: '缓慢漂移',
      animZoom: '呼吸缩放',
      animPan: '横向移动',
      animBreathe: '轻轻起伏',
      animAurora: '极光流动',
      duration: '周期',
      seconds: ' 秒',
      easing: '缓动',
      intensity: '幅度',
      font: '字体',
      fontHint: '只影响聊天区，不改侧栏和设置页。',
      fontPreset: '字体方案',
      fontSystem: '系统默认',
      fontYahei: '微软雅黑',
      fontSong: '宋体 / 衬线',
      fontKai: '楷体',
      fontRound: '圆体',
      fontMono: '等宽',
      fontCustom: '自定义字体栈',
      customFamily: '正文字体栈',
      customCode: '代码字体栈',
      customFamilyHint: '直接写 CSS font-family，例如 "LXGW WenKai", "Microsoft YaHei", sans-serif。',
      size: '正文字号',
      lineHeight: '行高',
      letterSpacing: '字间距',
      weight: '字重',
      icons: '图标',
      iconsHint: '用 emoji 当头像或运行图标；不想要就留空。',
      assistantIcon: '助手图标',
      userIcon: '你的图标',
      runningIcon: '运行中图标',
      showAvatars: '显示消息头像',
      avatarHint: '会在消息一侧留出头像位，窄屏自动隐藏。',
      ideas: '灵感',
      advanced: '高级',
      advancedHint: 'CSS 会追加到插件样式之后，可以写自己的关键帧和选择器。',
      scope: '作用范围',
      scopeChat: '聊天区',
      scopeGlobal: '全局（实验）',
      scopeHint: '全局模式尝试把背景铺到整个应用；部分面板本身不透明，效果取决于当前主题。',
      textMode: '文字明暗',
      textAuto: '自动',
      textLight: '浅色字 / 深背景',
      textDark: '深色字 / 浅背景',
      textModeHint: '自动会按背景亮度选择；如果文字看不清，可以在这里强制。',
      chrome: '侧栏与设置',
      chromeHint: '把侧栏、设置面板、右侧栏也做成同一套玻璃材质；仅在「整个应用」范围生效。',
      chromeEnable: '个性化侧栏 / 设置 / 面板',
      chromeTint: '面板色调',
      chromeTintAuto: '跟随背景',
      chromeTintCustom: '自定义',
      sidebarOpacity: '侧栏不透明度',
      panelOpacity: '设置面板不透明度',
      panelBlur: '面板模糊',
      panelBorder: '面板描边',
      panelShadow: '面板阴影',
      chromeScopeHint: '当前是「聊天区」范围。把作用范围切到「整个应用」后，这里的侧栏和设置材质才会生效。',
      showLauncher: '显示右上角快捷按钮',
      customCss: '自定义 CSS',
      customCssHint: '进阶：可写 @keyframes。示例： [data-conversation-region="chat"]::before { animation: myFlow 18s linear infinite; } @keyframes myFlow { ... }',
      quickTitle: '聊天外观',
      quickHint: '快捷调色 · 完整设置在「设置 → 聊天外观」',
      close: '关闭',
      more: '更多设置请到「设置 → 聊天外观」',
      resetConfirm: '恢复默认外观？当前的背景、动画和字体设置会被清空。',
      on: '开',
      off: '关',
      scopeLabel: '范围',
      uploadTip: '本地图片不会离开这台电脑。',
      sampleAssistant: '晚上好。我已经把背景、深度和字体都准备好了。',
      sampleUser: '试试深海蓝，再加一点毛玻璃。',
      sampleComposer: '问点什么…',
      sampleName: 'DSH',
      sampleStatus: '在线',
      saveNote: '配置保存在 $DSH_HOME/dsh-chat-skin/config.json；浏览器里另有一份即时缓存。',
      theme: '当前主题',
      themeAuto: '跟随 DSH',
    }

    const DICT_EN = {
      nav: 'Chat Skin',
      title: 'Chat Skin Studio',
      subtitle: 'Give the conversation its own backdrop. Background, depth, glass, motion, fonts and icons apply live and stay on this machine.',
      enabled: 'Enable skin',
      reset: 'Reset',
      saved: 'Saved',
      saving: 'Saving…',
      local: 'Local cache',
      error: 'Save failed',
      offline: 'Offline',
      preview: 'Live preview',
      previewHint: 'The preview shows colors and type; the real skin fills the chat area.',
      background: 'Background',
      backgroundHint: 'Pick a mood or upload your own wallpaper. Images stay on this machine.',
      source: 'Source',
      preset: 'Presets',
      gradient: 'Gradient',
      image: 'Image',
      solid: 'Solid',
      upload: 'Upload wallpaper',
      uploading: 'Uploading…',
      uploaded: 'New wallpaper applied',
      uploadFail: 'Upload failed',
      tooBig: 'Image is larger than 12 MiB',
      unsupported: 'Only PNG / JPEG / WebP / GIF / AVIF',
      imageUrl: 'Image URL',
      imageUrlHint: 'Paste an https:// image URL, or a DSH /dsh-chat-skin/asset/ URL.',
      gradientCss: 'CSS gradient',
      gradientHint: 'For example linear-gradient(135deg, #0f172a, #1e3a8a).',
      solidColor: 'Background color',
      fit: 'Fit',
      fitCover: 'Cover',
      fitContain: 'Contain',
      fitTile: 'Tile',
      position: 'Position',
      opacity: 'Background opacity',
      blur: 'Background blur',
      brightness: 'Brightness',
      saturation: 'Saturation',
      contrast: 'Contrast',
      dim: 'Shade depth',
      dimHint: 'Higher values darken the backdrop and make text easier to read.',
      tint: 'Shade color',
      vignette: 'Vignette',
      depth: 'Depth & glass',
      depthHint: 'Keep bubbles and the composer floating above the backdrop.',
      glass: 'Bubble glass',
      bubbleOpacity: 'Bubble opacity',
      border: 'Bubble outline',
      shadow: 'Bubble shadow',
      animation: 'Motion',
      animationHint: 'Respects the system reduce-motion preference.',
      animationName: 'Animation',
      animNone: 'None',
      animDrift: 'Slow drift',
      animZoom: 'Breathing zoom',
      animPan: 'Lateral pan',
      animBreathe: 'Soft float',
      animAurora: 'Aurora flow',
      duration: 'Cycle',
      seconds: ' s',
      easing: 'Easing',
      intensity: 'Amount',
      font: 'Typography',
      fontHint: 'Only the chat area changes; sidebar and settings keep their type.',
      fontPreset: 'Font preset',
      fontSystem: 'System',
      fontYahei: 'Microsoft YaHei',
      fontSong: 'Song / serif',
      fontKai: 'Kai',
      fontRound: 'Rounded',
      fontMono: 'Monospace',
      fontCustom: 'Custom stack',
      customFamily: 'Body font stack',
      customCode: 'Code font stack',
      customFamilyHint: 'Write a CSS font-family, e.g. "LXGW WenKai", "Microsoft YaHei", sans-serif.',
      size: 'Body size',
      lineHeight: 'Line height',
      letterSpacing: 'Letter spacing',
      weight: 'Weight',
      icons: 'Icons',
      iconsHint: 'Use emoji as avatars or the running icon; leave blank to hide.',
      assistantIcon: 'Assistant icon',
      userIcon: 'Your icon',
      runningIcon: 'Running icon',
      showAvatars: 'Show message avatars',
      avatarHint: 'Reserves a small avatar column; hidden on narrow screens.',
      ideas: 'Ideas',
      advanced: 'Advanced',
      advancedHint: 'CSS is appended after the skin styles, so you can add keyframes and selectors.',
      scope: 'Scope',
      scopeChat: 'Chat area',
      scopeGlobal: 'Whole app (experimental)',
      scopeHint: 'Whole-app mode paints the backdrop behind the shell; opaque panels may still cover parts of it.',
      textMode: 'Text contrast',
      textAuto: 'Auto',
      textLight: 'Light text / dark backdrop',
      textDark: 'Dark text / light backdrop',
      textModeHint: 'Auto follows backdrop luminance. Force it if text is hard to read.',
      chrome: 'Sidebar & settings',
      chromeHint: 'Give the sidebar, settings panel and right sidebar the same glass material. Applies in Whole-app scope.',
      chromeEnable: 'Personalize sidebar / settings / panels',
      chromeTint: 'Panel tint',
      chromeTintAuto: 'Follow backdrop',
      chromeTintCustom: 'Custom',
      sidebarOpacity: 'Sidebar opacity',
      panelOpacity: 'Settings opacity',
      panelBlur: 'Panel blur',
      panelBorder: 'Panel outline',
      panelShadow: 'Panel shadow',
      chromeScopeHint: 'Scope is Chat area. Switch Scope to Whole app to apply the sidebar and settings materials.',
      showLauncher: 'Show the quick button',
      customCss: 'Custom CSS',
      customCssHint: 'Advanced: keyframes welcome. Example: [data-conversation-region="chat"]::before { animation: myFlow 18s linear infinite; } @keyframes myFlow { ... }',
      quickTitle: 'Chat skin',
      quickHint: 'Quick tint · full controls in Settings → Chat Skin',
      close: 'Close',
      more: 'Full controls: Settings → Chat Skin',
      resetConfirm: 'Reset the skin? Background, motion and typography will return to defaults.',
      on: 'On',
      off: 'Off',
      scopeLabel: 'Scope',
      uploadTip: 'Local images never leave this computer.',
      sampleAssistant: 'Good evening. The backdrop, depth and type are ready.',
      sampleUser: 'Try deep sea with a little frosted glass.',
      sampleComposer: 'Ask something…',
      sampleName: 'DSH',
      sampleStatus: 'online',
      saveNote: 'Saved to $DSH_HOME/dsh-chat-skin/config.json, with an instant browser cache.',
      theme: 'Theme',
      themeAuto: 'Follow DSH',
    }

    // ── helpers ────────────────────────────────────────────────────────────

    const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

    function merge(base, patch) {
      if (!isObject(patch)) return patch === undefined ? base : patch
      const out = Array.isArray(base) ? base.slice() : { ...base }
      for (const [key, value] of Object.entries(patch)) {
        out[key] = isObject(value) && isObject(out[key]) ? merge(out[key], value) : value
      }
      return out
    }

    function clamp(value, min, max, fallback) {
      const n = typeof value === 'number' ? value : Number(value)
      if (!Number.isFinite(n)) return fallback
      return Math.min(max, Math.max(min, n))
    }

    function bool(value, fallback) {
      return typeof value === 'boolean' ? value : fallback
    }

    function cleanText(value, fallback, max = 4000) {
      if (typeof value !== 'string') return fallback
      return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, max)
    }

    function sanitizeFamily(value, fallback) {
      const clean = cleanText(value, '', 400).replace(/[{};]/g, '').replace(/[\r\n]/g, ' ').trim()
      return clean === '' ? fallback : clean
    }

    function sanitizeColor(value, fallback) {
      const clean = cleanText(value, '', 120).trim()
      if (/^#[0-9a-f]{3,8}$/i.test(clean)) return clean
      if (/^(rgb|hsl)a?\([0-9.,%\s/]+\)$/i.test(clean)) return clean
      return fallback
    }

    function sanitizeCss(value, fallback) {
      const clean = cleanText(value, '', 60000).replace(/[{}]/g, '').trim()
      return clean === '' ? fallback : clean
    }

    function sanitizeGradient(value, fallback) {
      const clean = cleanText(value, '', 4000).replace(/[{};]/g, '').trim()
      return clean === '' ? fallback : clean
    }

    function sanitizeUrl(value) {
      const clean = cleanText(value, '', 4000).trim()
      if (clean === '') return ''
      if (!/^(https?:\/\/|\/|data:image\/(png|jpe?g|webp|gif|avif);)/i.test(clean)) return ''
      return clean.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]/g, '')
    }

    function sanitizeEmoji(value, fallback) {
      const clean = cleanText(value, '', 32).replace(/["\\{};]/g, '').trim()
      return clean === '' ? fallback : Array.from(clean).slice(0, 8).join('')
    }

    function cssString(value) {
      return '"' + String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]/g, ' ') + '"'
    }

    function normalize(input) {
      const source = isObject(input) ? input : {}
      const background = merge(DEFAULTS.background, isObject(source.background) ? source.background : {})
      const animation = merge(DEFAULTS.animation, isObject(source.animation) ? source.animation : {})
      const surface = merge(DEFAULTS.surface, isObject(source.surface) ? source.surface : {})
      const chrome = merge(DEFAULTS.chrome, isObject(source.chrome) ? source.chrome : {})
      const font = merge(DEFAULTS.font, isObject(source.font) ? source.font : {})
      const icons = merge(DEFAULTS.icons, isObject(source.icons) ? source.icons : {})

      background.kind = ['preset', 'gradient', 'image', 'solid'].includes(background.kind) ? background.kind : 'preset'
      background.preset = typeof background.preset === 'string' ? background.preset : DEFAULTS.background.preset
      background.fit = ['cover', 'contain', 'tile'].includes(background.fit) ? background.fit : 'cover'
      background.position = POSITIONS.includes(background.position) ? background.position : 'center'
      background.opacity = clamp(background.opacity, 0, 1, 1)
      background.blur = clamp(background.blur, 0, 40, 0)
      background.brightness = clamp(background.brightness, 20, 180, 100)
      background.saturation = clamp(background.saturation, 0, 220, 100)
      background.contrast = clamp(background.contrast, 20, 180, 100)
      background.dim = clamp(background.dim, 0, 95, 32)
      background.vignette = clamp(background.vignette, 0, 100, 18)
      background.color = sanitizeColor(background.color, DEFAULTS.background.color)
      background.tint = sanitizeColor(background.tint, DEFAULTS.background.tint)
      background.gradient = sanitizeGradient(background.gradient, DEFAULTS.background.gradient)
      background.image = cleanText(background.image, '', 4000).trim()

      animation.name = ['none', 'drift', 'zoom', 'pan', 'breathe', 'aurora'].includes(animation.name) ? animation.name : 'none'
      animation.easing = ['ease', 'ease-in-out', 'linear', 'cubic-bezier(.34,1.2,.64,1)'].includes(animation.easing)
        ? animation.easing
        : 'ease-in-out'
      animation.duration = clamp(animation.duration, 1, 300, 28)
      animation.intensity = clamp(animation.intensity, 0, 100, 35)
      animation.customName = cleanText(animation.customName, '', 80).replace(/[^a-zA-Z0-9_-]/g, '')
      animation.customCss = cleanText(animation.customCss, '', 20000)

      surface.glass = clamp(surface.glass, 0, 40, 10)
      surface.bubbleOpacity = clamp(surface.bubbleOpacity, 0, 100, 76)
      surface.border = bool(surface.border, true)
      surface.shadow = bool(surface.shadow, true)

      chrome.enabled = bool(chrome.enabled, true)
      chrome.tintMode = chrome.tintMode === 'custom' ? 'custom' : 'auto'
      chrome.tint = sanitizeColor(chrome.tint, DEFAULTS.chrome.tint)
      chrome.sidebarOpacity = clamp(chrome.sidebarOpacity, 0, 100, 58)
      chrome.panelOpacity = clamp(chrome.panelOpacity, 0, 100, 82)
      chrome.blur = clamp(chrome.blur, 0, 40, 18)
      chrome.border = bool(chrome.border, true)
      chrome.shadow = bool(chrome.shadow, true)

      font.preset = ['system', 'yahei', 'song', 'kai', 'round', 'mono', 'custom'].includes(font.preset) ? font.preset : 'system'
      font.family = cleanText(font.family, '', 400).replace(/[{};]/g, '')
      font.codeFamily = cleanText(font.codeFamily, '', 400).replace(/[{};]/g, '')
      font.size = clamp(font.size, 10, 22, 14)
      font.lineHeight = clamp(font.lineHeight, 1, 2.4, 1.7)
      font.letterSpacing = clamp(font.letterSpacing, -1, 4, 0)
      font.weight = clamp(font.weight, 300, 900, 400)

      icons.assistant = sanitizeEmoji(icons.assistant, DEFAULTS.icons.assistant)
      icons.user = sanitizeEmoji(icons.user, DEFAULTS.icons.user)
      icons.running = sanitizeEmoji(icons.running, DEFAULTS.icons.running)
      icons.showAvatars = bool(icons.showAvatars, false)

      return {
        version: 1,
        enabled: bool(source.enabled, true),
        showLauncher: bool(source.showLauncher, true),
        scope: source.scope === 'global' ? 'global' : 'chat',
        textMode: ['auto', 'light', 'dark'].includes(source.textMode) ? source.textMode : 'auto',
        background,
        animation,
        surface,
        chrome,
        font,
        icons,
        customCss: cleanText(source.customCss, '', 60000),
        updatedAt: clamp(source.updatedAt, 0, Number.MAX_SAFE_INTEGER, 0),
      }
    }

    function fontOf(config) {
      const preset = config.font.preset
      const base = FONTS[preset] || FONTS.system
      return {
        ui: preset === 'custom' ? sanitizeFamily(config.font.family, base.ui) : base.ui,
        code: sanitizeFamily(config.font.codeFamily, base.code),
      }
    }

    function isLightColor(value) {
      return relativeLuma(value) > 170 / 255
    }

    // Relative luminance of a hex color, 0..1. Returns -1 for unparseable input.
    function relativeLuma(value) {
      const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value || '').trim())
      if (!match) return -1
      let hex = match[1]
      if (hex.length === 3) hex = hex.split('').map((part) => part + part).join('')
      const n = parseInt(hex, 16)
      const r = (n >> 16) & 255
      const g = (n >> 8) & 255
      const b = n & 255
      return (r * 299 + g * 587 + b * 114) / 1000 / 255
    }

    function backgroundImage(config) {
      const bg = config.background
      if (bg.kind === 'solid') return 'none'
      if (bg.kind === 'image') {
        const url = sanitizeUrl(bg.image)
        return url === '' ? 'none' : 'url("' + url + '")'
      }
      if (bg.kind === 'gradient') return sanitizeGradient(bg.gradient, DEFAULTS.background.gradient)
      return PRESET_BG[bg.preset] || PRESET_BG['deep-sea']
    }

    function backgroundBase(config) {
      return sanitizeColor(config.background.color, '#071421')
    }

    // Decide light-on-dark vs dark-on-light text. For images we use the
    // measured average luminance of the (possibly blurred/brightened/dimmed)
    // background if available; otherwise we fall back to the fallback color so
    // the text is at least legible while the image is being analysed.
    function resolveTextMode(config) {
      if (config.textMode === 'light' || config.textMode === 'dark') return config.textMode
      const bg = config.background
      if (bg.kind === 'image') {
        const measured = imageLumaCache.get(bg.image)
        if (measured && measured.known) {
          const bright = measured.avg * (bg.brightness / 100)
          const tint = Math.max(0, relativeLuma(bg.tint))
          const alpha = bg.dim / 100
          const effective = bright * (1 - alpha) + tint * alpha
          return effective > 0.58 ? 'dark' : 'light'
        }
        // Not measured yet — use fallback color so the very first paint is
        // legible instead of defaulting to invisible white text.
        return isLightColor(backgroundBase(config)) && bg.dim < 45 ? 'dark' : 'light'
      }
      const lightBase = bg.kind === 'preset'
        ? bg.preset === 'paper'
        : isLightColor(backgroundBase(config))
      return lightBase && bg.dim < 45 ? 'dark' : 'light'
    }

    function chromeTintOf(config) {
      return config.chrome.tintMode === 'custom' ? config.chrome.tint : backgroundBase(config)
    }

    /**
     * App-wide glass material for the sidebar, settings panel and right rail.
     * These class fragments (`_sidebarCol`, `_centerCol`, `_rightbarCol`) and
     * the settings dialog's `data-shortcut-modal` are stable package-level
     * hooks, not build hashes.
     */
    function chromeCss(config, textMode) {
      const c = config.chrome
      if (config.scope !== 'global' || !c.enabled) return ''
      const tint = chromeTintOf(config)
      const sidebarBg = 'color-mix(in srgb, ' + tint + ' ' + c.sidebarOpacity + '%, transparent)'
      const panelBg = 'color-mix(in srgb, ' + tint + ' ' + c.panelOpacity + '%, transparent)'
      const borderColor = textMode === 'light' ? 'rgba(255,255,255,.14)' : 'rgba(23,32,51,.12)'
      const border = c.border ? '1px solid ' + borderColor : '0'
      const shadow = c.shadow ? '0 24px 80px rgba(0,0,0,.28)' : 'none'
      const blur = 'blur(' + c.blur + 'px) saturate(1.15)'
      return [
        '#root [class*="_frame"]{background:transparent !important;}',
        '#root [class*="_sidebarCol"]{background:' + sidebarBg + ' !important;backdrop-filter:' + blur + ';-webkit-backdrop-filter:' + blur + ';border-right:' + border + ' !important;box-shadow:' + shadow + ';}',
        '#root [class*="_sidebarCol"] [class*="_root"]{background:transparent !important;}',
        '#root [class*="_centerCol"]{background:transparent !important;}',
        '#root [class*="_rightbarCol"]{background:' + panelBg + ' !important;backdrop-filter:' + blur + ';-webkit-backdrop-filter:' + blur + ';border-left:' + border + ' !important;box-shadow:' + shadow + ';}',
        '[data-shortcut-modal="settings"]{background:' + panelBg + ' !important;backdrop-filter:' + blur + ';-webkit-backdrop-filter:' + blur + ';border:' + border + ' !important;box-shadow:' + shadow + ';}',
        '[data-shortcut-modal="settings"] [class*="_nav"]{background:color-mix(in srgb, ' + tint + ' 38%, transparent) !important;}',
        '[data-shortcut-modal="settings"] [class*="_content"], [data-shortcut-modal="settings"] [class*="_header"]{background:transparent !important;}',
      ].join('\n')
    }

    function rgba(hex, alpha) {
      const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim())
      if (!match) return 'rgba(0,0,0,' + alpha + ')'
      let value = match[1]
      if (value.length === 3) value = value.split('').map((part) => part + part).join('')
      const n = parseInt(value, 16)
      const r = (n >> 16) & 255
      const g = (n >> 8) & 255
      const b = n & 255
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
    }

    function animationValue(config) {
      const a = config.animation
      if (a.name === 'none') return 'none'
      if (a.name === 'custom' && a.customName !== '') return a.customName + ' ' + a.duration + 's ' + a.easing + ' infinite alternate'
      return 'dcs-' + a.name + ' ' + a.duration + 's ' + a.easing + ' infinite alternate'
    }

    function keyframes(config) {
      const i = config.animation.intensity
      const drift = Math.max(0.4, i / 18)
      const zoom = 1 + i / 120
      const pan = Math.max(0.4, i / 7)
      const breathe = 1 + i / 500
      return [
        '@keyframes dcs-drift{0%{transform:scale(' + (1.035 + i / 900) + ') translate3d(-' + drift + '%,-' + (drift * 0.55) + '%,0)}100%{transform:scale(' + (1.07 + i / 700) + ') translate3d(' + drift + '%,' + (drift * 0.55) + '%,0)}}',
        '@keyframes dcs-zoom{0%{transform:scale(1.01)}100%{transform:scale(' + zoom.toFixed(3) + ')}}',
        '@keyframes dcs-pan{0%{transform:scale(1.08) translate3d(-' + pan + '%,0,0)}100%{transform:scale(1.08) translate3d(' + pan + '%,0,0)}}',
        '@keyframes dcs-breathe{0%{transform:scale(1.01)}100%{transform:scale(' + breathe.toFixed(3) + ')}}',
        '@keyframes dcs-aurora{0%{background-position:0% 50%;transform:scale(1.04)}50%{background-position:100% 50%;transform:scale(1.08)}100%{background-position:0% 50%;transform:scale(1.04)}}',
      ].join('')
    }

    /**
     * Pure CSS compiler: no DOM access, so it is also exercised by tests.
     * @param {object} raw persisted document
     * @returns {string} stylesheet text
     */
    function compileCss(raw) {
      const config = normalize(raw)
      if (!config.enabled) return ''
      const font = fontOf(config)
      const bg = config.background
      const image = backgroundImage(config)
      const base = backgroundBase(config)
      const anim = animationValue(config)
      const size = config.font.size
      const secondary = size <= 14 ? Math.max(10, size - 1) : Math.max(11, size - 2)
      const secondaryDelta = secondary - 13
      const fit = FIT[bg.fit] || 'cover'
      const repeat = REPEAT[bg.fit] || 'no-repeat'
      const position = POSITIONS.includes(bg.position) ? bg.position : 'center'
      const dim = (bg.dim / 100).toFixed(3)
      const vignette = bg.vignette
      const glass = config.surface.glass
      const bubble = config.surface.bubbleOpacity
      const border = config.surface.border
        ? '1px solid color-mix(in srgb, var(--dsw-alias-border-l2, rgba(255,255,255,.24)) 70%, transparent)'
        : '0'
      const shadow = config.surface.shadow ? '0 10px 34px rgba(0,0,0,.18)' : 'none'
      const letter = config.font.letterSpacing
      const weight = config.font.weight
      const line = config.font.lineHeight
      const textMode = resolveTextMode(config)
      const textTokens = textMode === 'light'
        ? 'color:var(--dsw-alias-label-primary);--dsw-alias-label-primary:#f8fafc;--dsw-alias-label-secondary:rgba(248,250,252,.78);--dsw-alias-label-tertiary:rgba(248,250,252,.58);--dsw-alias-label-caption:rgba(248,250,252,.5);--dsw-alias-label-dimmed:rgba(248,250,252,.65);--dsw-alias-link:#8ab4ff;--dsw-alias-border-l1:rgba(255,255,255,.12);--dsw-alias-border-l2:rgba(255,255,255,.2);--dsw-alias-border-l3:rgba(255,255,255,.28);--dsw-alias-bg-layer-1:rgba(15,23,42,.62);--dsw-alias-bg-layer-2:rgba(15,23,42,.52);--dsw-alias-bg-layer-3:rgba(15,23,42,.44);--dsw-alias-interactive-bg-hover:rgba(255,255,255,.08);--dsw-specific-sidebar-fill:transparent;--dsw-specific-sidebar-nav-item-active:rgba(255,255,255,.12);--dsw-specific-sidebar-nav-item-hover:rgba(255,255,255,.07);'
        : 'color:var(--dsw-alias-label-primary);--dsw-alias-label-primary:#172033;--dsw-alias-label-secondary:rgba(23,32,51,.74);--dsw-alias-label-tertiary:rgba(23,32,51,.56);--dsw-alias-label-caption:rgba(23,32,51,.48);--dsw-alias-label-dimmed:rgba(23,32,51,.66);--dsw-alias-link:#2457d6;--dsw-alias-border-l1:rgba(23,32,51,.08);--dsw-alias-border-l2:rgba(23,32,51,.16);--dsw-alias-border-l3:rgba(23,32,51,.24);--dsw-alias-bg-layer-1:rgba(255,255,255,.78);--dsw-alias-bg-layer-2:rgba(255,255,255,.66);--dsw-alias-bg-layer-3:rgba(255,255,255,.56);--dsw-alias-interactive-bg-hover:rgba(23,32,51,.06);--dsw-specific-sidebar-fill:transparent;--dsw-specific-sidebar-nav-item-active:rgba(23,32,51,.1);--dsw-specific-sidebar-nav-item-hover:rgba(23,32,51,.05);'
      const isGlobal = config.scope === 'global'
      const layerSelector = isGlobal
        ? 'html[data-dcs-on="true"][data-dcs-scope="global"] body::before'
        : 'html[data-dcs-on="true"] [data-conversation-region="chat"]::before'
      const shadeSelector = isGlobal
        ? 'html[data-dcs-on="true"][data-dcs-scope="global"] body::after'
        : 'html[data-dcs-on="true"] [data-conversation-region="chat"]::after'

      const css = []
      css.push(':root{--dcs-font:' + font.ui + ';--dcs-font-code:' + font.code + ';--dcs-icon-assistant:' + cssString(config.icons.assistant) + ';--dcs-icon-user:' + cssString(config.icons.user) + ';--dcs-icon-running:' + cssString(config.icons.running) + ';}')
      css.push(keyframes(config))

      if (isGlobal) {
        css.push('html[data-dcs-on="true"][data-dcs-scope="global"] body{background-color:' + base + ' !important;}')
        css.push('html[data-dcs-on="true"][data-dcs-scope="global"] #root{position:relative;z-index:1;background:transparent !important;}')
        css.push('html[data-dcs-on="true"][data-dcs-scope="global"] [data-conversation-region="chat"]{background:transparent !important;' + textTokens + '--dsh-content-font-size:' + size + 'px;--dsh-content-font-delta:' + (size - 14) + 'px;--dsh-content-font-size-secondary:' + secondary + 'px;--dsh-content-font-delta-secondary:' + secondaryDelta + 'px;font-family:var(--dcs-font) !important;}')
        css.push('#root [class*="_frame"], [data-shortcut-modal="settings"]{' + textTokens + '}')
        css.push(chromeCss(config, textMode))
      } else {
        css.push('html[data-dcs-on="true"] [data-conversation-region="chat"]{position:relative;isolation:isolate;background-color:' + base + ' !important;' + textTokens + '--dsh-content-font-size:' + size + 'px;--dsh-content-font-delta:' + (size - 14) + 'px;--dsh-content-font-size-secondary:' + secondary + 'px;--dsh-content-font-delta-secondary:' + secondaryDelta + 'px;font-family:var(--dcs-font) !important;}')
        css.push('html[data-dcs-on="true"] [data-conversation-region="chat"]>[data-conversation-scroll]{position:relative;z-index:1;}')
      }

      const layerBody = [
        'content:""',
        'position:' + (isGlobal ? 'fixed' : 'absolute'),
        'inset:' + (isGlobal ? '0' : '-3%'),
        'z-index:0',
        'pointer-events:none',
        'background-color:' + base,
        'background-image:' + image,
        'background-size:' + (bg.fit === 'tile' ? 'auto' : fit),
        'background-position:' + position,
        'background-repeat:' + repeat,
        'opacity:' + bg.opacity,
        'filter:blur(' + bg.blur + 'px) brightness(' + bg.brightness + '%) saturate(' + bg.saturation + '%) contrast(' + bg.contrast + '%)',
        'transform-origin:center',
        'will-change:transform,background-position',
        'animation:' + anim,
      ].join(';')
      css.push(layerSelector + '{' + layerBody + ';}')

      const shadeBody = [
        'content:""',
        'position:' + (isGlobal ? 'fixed' : 'absolute'),
        'inset:0',
        'z-index:0',
        'pointer-events:none',
        'background:' + rgba(bg.tint, dim),
        'box-shadow:inset 0 0 ' + (vignette * 2.4) + 'px ' + vignette + 'px rgba(0,0,0,' + (vignette / 100) + ')',
        'backdrop-filter:blur(' + bg.blur + 'px)',
        '-webkit-backdrop-filter:blur(' + bg.blur + 'px)',
      ].join(';')
      css.push(shadeSelector + '{' + shadeBody + ';}')

      // Typography — scoped to the chat surface.
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"]{font-family:var(--dcs-font) !important;}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_markdown"],html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_bubble"],html[data-dcs-on="true"] [data-composer-seat]{font-family:var(--dcs-font) !important;}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_markdown"] :where(h1,h2,h3,h4,h5,h6){font-family:var(--dcs-font) !important;}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_markdown"] :where(code,pre,kbd,samp),html[data-dcs-on="true"] [data-conversation-region="chat"] :where(pre,code,kbd,samp){font-family:var(--dcs-font-code) !important;}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_markdown"]{font-weight:' + weight + ';letter-spacing:' + letter + 'px;}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_markdown"] :where(p,li){line-height:' + line + ';}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_bubble"]{letter-spacing:' + letter + 'px;}')

      // Frosted bubbles + composer.
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_bubble"]{background:color-mix(in srgb, var(--dsw-alias-bg-layer-2, #ffffff) ' + bubble + '%, transparent) !important;border:' + border + ' !important;box-shadow:' + shadow + ' !important;backdrop-filter:blur(' + glass + 'px) saturate(1.12);-webkit-backdrop-filter:blur(' + glass + 'px) saturate(1.12);}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [data-chat-flow-kind="user"] [class*="_bubble"]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) ' + Math.min(100, bubble + 10) + '%, transparent) !important;color:var(--dsw-alias-label-primary-foreground, #ffffff) !important;}')
      css.push('html[data-dcs-on="true"] [data-composer-seat] [class*="_composer"],html[data-dcs-on="true"] [data-composer-seat] [class*="_card"]{background:color-mix(in srgb, var(--dsw-alias-bg-layer-2, #ffffff) ' + Math.max(45, bubble) + '%, transparent) !important;backdrop-filter:blur(' + Math.max(6, glass) + 'px) saturate(1.1);-webkit-backdrop-filter:blur(' + Math.max(6, glass) + 'px) saturate(1.1);border-color:color-mix(in srgb, var(--dsw-alias-border-l2, rgba(255,255,255,.2)) 72%, transparent) !important;}')

      // Readability safety net — a soft text shadow keeps message text legible
      // when it sits directly on a busy background image (e.g. assistant replies
      // that have no frosted bubble). Light text gets a dark halo and vice-versa.
      const textShadow = textMode === 'light'
        ? '0 1px 2px rgba(0,0,0,.55),0 0 8px rgba(0,0,0,.32)'
        : '0 1px 2px rgba(255,255,255,.7),0 0 8px rgba(255,255,255,.32)'
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_markdown"] :where(p,li,h1,h2,h3,h4,h5,h6,blockquote,td,th),html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="_markdown"]{text-shadow:' + textShadow + ';}')

      // Optional message avatars.
      if (config.icons.showAvatars) {
        css.push('html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="assistant"],html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="user"]{position:relative;}')
        css.push('html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="assistant"]{padding-left:42px;}')
        css.push('html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="user"]{padding-right:42px;}')
        css.push('html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="assistant"]::before,html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="user"]::before{position:absolute;top:2px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:9px;font-size:17px;line-height:1;background:color-mix(in srgb, var(--dsw-alias-bg-layer-2, #ffffff) 62%, transparent);border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2, rgba(255,255,255,.2)) 70%, transparent);box-shadow:0 4px 16px rgba(0,0,0,.12);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}')
        css.push('html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="assistant"]::before{content:var(--dcs-icon-assistant);left:0;}')
        css.push('html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="user"]::before{content:var(--dcs-icon-user);right:0;}')
      }

      // Running whale → emoji.
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="runningIcon"]>svg,html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="runningIcon"]>img,html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="runningWhale"]{display:none !important;}')
      css.push('html[data-dcs-on="true"] [data-conversation-region="chat"] [class*="runningIcon"]::before{content:var(--dcs-icon-running);font-size:14px;line-height:1;display:inline-flex;align-items:center;justify-content:center;}')

      if (config.customCss.trim() !== '') css.push(config.customCss)
      css.push('@media (prefers-reduced-motion: reduce){html[data-dcs-on="true"] [data-conversation-region="chat"]::before,html[data-dcs-on="true"][data-dcs-scope="global"] body::before{animation:none !important;}}')
      css.push('@media (max-width:720px){html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="assistant"],html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="user"]{padding-left:0;padding-right:0;}html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="assistant"]::before,html[data-dcs-on="true"][data-dcs-avatars="true"] [data-conversation-region="chat"] [data-chat-flow-kind="user"]::before{display:none;}}')
      return css.join('\n')
    }

    // ── store ──────────────────────────────────────────────────────────────

    function readLocal() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return normalize(JSON.parse(raw))
      } catch {
        return null
      }
    }

    function writeLocal(config) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      } catch {
        /* private mode / quota */
      }
    }

    let state = normalize(readLocal() || DEFAULTS)
    let status = 'local'
    let touched = false
    let revision = 0
    let saveTimer = 0
    let renderFrame = 0
    let hydrated = false
    let disposed = false
    const listeners = new Set()
    const statusListeners = new Set()

    // Average luminance (0..255) measured from uploaded background images.
    // Keyed by the same URL string stored in background.image. When an image
    // is set we measure it asynchronously, cache the result, and repaint so
    // resolveTextMode() can pick light or dark text that is actually legible.
    const imageLumaCache = new Map()

    // Measure the average luminance of an image by drawing it onto a tiny
    // canvas and reading the pixel data. Works for same-origin and data URLs.
    // Cross-origin images without CORS taint the canvas and throw — we catch
    // and mark the entry unknown so the caller falls back to the color hint.
    function analyzeImage(url) {
      const clean = sanitizeUrl(url)
      if (clean === '' || imageLumaCache.has(clean)) return
      // Reserve a placeholder immediately so we don't queue duplicate loads.
      imageLumaCache.set(clean, { avg: 0, known: false })
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = function () {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = 32
            canvas.height = 32
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            ctx.drawImage(img, 0, 0, 32, 32)
            const data = ctx.getImageData(0, 0, 32, 32).data
            let total = 0
            let count = 0
            for (let i = 0; i < data.length; i += 4) {
              const a = data[i + 3] / 255
              if (a < 0.05) continue
              const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000
              total += lum * a
              count += a
            }
            const avg = count > 0 ? total / count : 0
            imageLumaCache.set(clean, { avg, known: true })
            if (!disposed) schedulePaint()
          } catch {
            imageLumaCache.set(clean, { avg: 0, known: false })
          }
        }
        img.onerror = function () {
          imageLumaCache.set(clean, { avg: 0, known: false })
        }
        img.src = clean
      } catch {
        imageLumaCache.set(clean, { avg: 0, known: false })
      }
    }

    // Ensure the background image luminance is being analysed for the current
    // config so the next paint reflects a measured (rather than guessed) mode.
    function ensureImageAnalysis(config) {
      if (config.background.kind === 'image') analyzeImage(config.background.image)
    }

    function emit() {
      for (const listener of listeners) {
        try {
          listener(state)
        } catch {
          /* a broken consumer must not stop the skin */
        }
      }
    }

    function emitStatus() {
      for (const listener of statusListeners) {
        try {
          listener(status)
        } catch {
          /* ignore */
        }
      }
    }

    function ensureStyle(id, css) {
      let tag = document.getElementById(id)
      if (!tag) {
        tag = document.createElement('style')
        tag.id = id
        document.head.appendChild(tag)
      }
      if (tag.textContent !== css) tag.textContent = css
      return tag
    }

    function paint() {
      renderFrame = 0
      if (disposed || typeof document === 'undefined') return
      const root = document.documentElement
      root.setAttribute('data-dcs-on', state.enabled ? 'true' : 'false')
      root.setAttribute('data-dcs-scope', state.scope)
      root.setAttribute('data-dcs-avatars', state.icons.showAvatars ? 'true' : 'false')
      ensureImageAnalysis(state)
      ensureStyle('dsh-chat-skin-style', compileCss(state))
    }

    function schedulePaint() {
      if (disposed || renderFrame !== 0) return
      renderFrame = window.requestAnimationFrame(paint)
    }

    function setStatus(next) {
      status = next
      emitStatus()
    }

    async function persist() {
      saveTimer = 0
      const snapshotRevision = revision
      setStatus('saving')
      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: state }),
        })
        const payload = await res.json()
        if (!res.ok || !payload || payload.ok !== true) throw new Error(payload && payload.error || 'save failed')
        if (disposed) return
        if (revision === snapshotRevision) {
          state = normalize(payload.config)
          writeLocal(state)
          emit()
          schedulePaint()
        }
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }

    function scheduleSave() {
      if (saveTimer !== 0) window.clearTimeout(saveTimer)
      saveTimer = window.setTimeout(() => {
        void persist()
      }, 380)
    }

    function update(patch) {
      touched = true
      revision += 1
      state = normalize(merge(state, patch))
      state.updatedAt = Date.now()
      writeLocal(state)
      emit()
      schedulePaint()
      scheduleSave()
    }

    function reset() {
      touched = true
      revision += 1
      state = normalize({ ...DEFAULTS, updatedAt: Date.now() })
      writeLocal(state)
      emit()
      schedulePaint()
      scheduleSave()
    }

    async function hydrate() {
      try {
        const res = await fetch(API, { cache: 'no-store' })
        if (!res.ok) throw new Error('status ' + res.status)
        const payload = await res.json()
        if (!payload || payload.ok !== true) throw new Error('bad payload')
        if (disposed) return
        hydrated = true
        if (touched) {
          setStatus('local')
          return
        }
        const server = normalize(payload.config)
        const local = readLocal()
        if (server.updatedAt <= 0 && local && local.updatedAt > 0) {
          state = local
          setStatus('local')
          scheduleSave()
        } else {
          state = server
          writeLocal(state)
          setStatus(payload.persisted ? 'saved' : 'local')
        }
        emit()
        schedulePaint()
      } catch {
        hydrated = false
        setStatus('offline')
      }
    }

    async function uploadImage(file) {
      if (!file) throw new Error('no file')
      if (!/^image\/(png|jpeg|webp|gif|avif)$/i.test(file.type)) {
        const error = new Error('unsupported')
        error.code = 'UNSUPPORTED'
        throw error
      }
      if (file.size > 12 * 1024 * 1024) {
        const error = new Error('too-big')
        error.code = 'TOO_BIG'
        throw error
      }
      const res = await fetch(UPLOAD + '?name=' + encodeURIComponent(file.name || 'wallpaper'), {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      const payload = await res.json()
      if (!res.ok || !payload || payload.ok !== true) throw new Error(payload && payload.error || 'upload failed')
      update({ background: { ...state.background, kind: 'image', image: payload.url } })
      return payload.url
    }

    function subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }

    function subscribeStatus(listener) {
      statusListeners.add(listener)
      return () => statusListeners.delete(listener)
    }

    // ── React hooks and small controls ─────────────────────────────────────

    function useSkin() {
      const [snapshot, setSnapshot] = React.useState(state)
      React.useEffect(() => subscribe(setSnapshot), [])
      return snapshot
    }

    function useSkinStatus() {
      const [snapshot, setSnapshot] = React.useState(status)
      React.useEffect(() => subscribeStatus(setSnapshot), [])
      return snapshot
    }

    function Field(props) {
      return h('div', { className: 'dcs-field' },
        h('div', { className: 'dcs-field-head' },
          h('span', { className: 'dcs-label' }, props.label),
          props.value !== undefined && props.value !== null
            ? h('span', { className: 'dcs-value' }, props.value)
            : null),
        props.hint ? h('div', { className: 'dcs-hint' }, props.hint) : null,
        props.children)
    }

    function Range(props) {
      return h(Field, {
        label: props.label,
        value: props.format ? props.format(props.value) : props.value,
        hint: props.hint,
      }, h('input', {
        className: 'dcs-range',
        type: 'range',
        min: props.min,
        max: props.max,
        step: props.step || 1,
        value: props.value,
        onChange: (event) => props.onChange(Number(event.currentTarget.value)),
      }))
    }

    function Toggle(props) {
      return h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': props.checked ? 'true' : 'false',
        className: 'dcs-switch' + (props.checked ? ' is-on' : ''),
        onClick: () => props.onChange(!props.checked),
        title: props.title || '',
      }, h('span', { className: 'dcs-knob' }))
    }

    function Select(props) {
      return h(Field, { label: props.label, hint: props.hint },
        h('select', {
          className: 'dcs-select',
          value: props.value,
          onChange: (event) => props.onChange(event.currentTarget.value),
        }, props.options.map(([value, label]) => h('option', { key: value, value }, label))))
    }

    function Segmented(props) {
      return h('div', { className: 'dcs-seg', role: 'tablist' },
        props.options.map(([value, label]) => h('button', {
          key: value,
          type: 'button',
          role: 'tab',
          'aria-selected': props.value === value ? 'true' : 'false',
          className: 'dcs-seg-btn' + (props.value === value ? ' is-active' : ''),
          onClick: () => props.onChange(value),
        }, label)))
    }

    function Section(props) {
      return h('section', { className: 'dcs-card' },
        h('div', { className: 'dcs-section-head' },
          h('div', null,
            h('h3', { className: 'dcs-section-title' }, props.title),
            props.desc ? h('p', { className: 'dcs-section-desc' }, props.desc) : null),
          props.right || null),
        h('div', { className: 'dcs-section-body' }, props.children))
    }

    function ColorField(props) {
      return h('label', { className: 'dcs-color' },
        h('input', {
          type: 'color',
          value: /^#[0-9a-f]{6}$/i.test(props.value) ? props.value : '#000000',
          onChange: (event) => props.onChange(event.currentTarget.value),
        }),
        h('span', null, props.label),
        h('code', null, props.value))
    }

    function statusLabel(t, value) {
      if (value === 'saving') return t('saving')
      if (value === 'saved') return t('saved')
      if (value === 'error') return t('error')
      if (value === 'offline') return t('offline')
      return t('local')
    }

    function applyPreset(preset) {
      update({
        background: {
          ...state.background,
          kind: 'preset',
          preset: preset.id,
          color: preset.color,
          dim: preset.dim,
          tint: preset.tint,
          blur: preset.blur,
        },
        animation: {
          ...state.animation,
          name: preset.animation,
          duration: preset.duration,
        },
        font: { ...state.font, preset: preset.font },
        icons: {
          ...state.icons,
          assistant: preset.assistant,
          user: preset.user,
          running: preset.running,
        },
      })
    }

    function PresetGrid(props) {
      return h('div', { className: 'dcs-presets' },
        PRESETS.map((preset) => h('button', {
          key: preset.id,
          type: 'button',
          className: 'dcs-preset' + (props.value === preset.id ? ' is-active' : ''),
          onClick: () => props.onPick(preset),
          title: preset.name,
        },
          h('span', {
            className: 'dcs-preset-swatch',
            style: { backgroundImage: PRESET_BG[preset.id], backgroundColor: preset.color },
          }),
          h('span', { className: 'dcs-preset-copy' },
            h('span', { className: 'dcs-preset-name' }, preset.name),
            h('span', { className: 'dcs-preset-sub' }, preset.sub)))))
    }

    function ImagePicker(props) {
      const t = props.t
      const fileRef = React.useRef(null)
      const [busy, setBusy] = React.useState(false)
      const [message, setMessage] = React.useState('')
      const [error, setError] = React.useState(false)

      async function onFile(event) {
        const file = event.currentTarget.files && event.currentTarget.files[0]
        event.currentTarget.value = ''
        if (!file) return
        setBusy(true)
        setMessage(t('uploading'))
        setError(false)
        try {
          await uploadImage(file)
          setMessage(t('uploaded'))
        } catch (err) {
          setError(true)
          setMessage(err && err.code === 'TOO_BIG' ? t('tooBig') : err && err.code === 'UNSUPPORTED' ? t('unsupported') : t('uploadFail'))
        } finally {
          setBusy(false)
        }
      }

      return h('div', { className: 'dcs-upload' },
        h('button', {
          type: 'button',
          className: 'dcs-btn',
          disabled: busy,
          onClick: () => fileRef.current && fileRef.current.click(),
        }, busy ? t('uploading') : t('upload')),
        h('input', {
          ref: fileRef,
          type: 'file',
          accept: 'image/png,image/jpeg,image/webp,image/gif,image/avif',
          style: { display: 'none' },
          onChange: onFile,
        }),
        h('span', { className: 'dcs-upload-note' + (error ? ' is-error' : '') }, message || t('uploadTip')))
    }

    function Preview(props) {
      const t = props.t
      const config = props.config
      const image = backgroundImage(config)
      const font = fontOf(config)
      const light = resolveTextMode(config) === 'dark'
      const text = light ? '#172033' : '#f8fafc'
      const muted = light ? 'rgba(23,32,51,.62)' : 'rgba(248,250,252,.68)'
      const bubble = light ? 'rgba(255,255,255,.62)' : 'rgba(255,255,255,.12)'
      return h('div', { className: 'dcs-preview-card' },
        h('div', { className: 'dcs-preview-head' },
          h('span', null, t('preview')),
          h('span', { className: 'dcs-preview-status' }, statusLabel(t, props.status))),
        h('div', { className: 'dcs-preview-frame' },
          h('div', {
            className: 'dcs-preview-bg',
            style: {
              backgroundImage: image,
              backgroundColor: backgroundBase(config),
              backgroundSize: config.background.fit === 'tile' ? 'auto' : FIT[config.background.fit],
              backgroundRepeat: REPEAT[config.background.fit],
              backgroundPosition: config.background.position,
              opacity: config.background.opacity,
            },
          }),
          h('div', {
            className: 'dcs-preview-dim',
            style: {
              background: rgba(config.background.tint, config.background.dim / 100),
              boxShadow: 'inset 0 0 ' + (config.background.vignette * 2) + 'px ' + config.background.vignette + 'px rgba(0,0,0,' + (config.background.vignette / 100) + ')',
            },
          }),
          h('div', { className: 'dcs-preview-content', style: { color: text, fontFamily: font.ui } },
            h('div', { className: 'dcs-preview-bar' },
              h('span', { className: 'dcs-preview-brand' }, '◈ ' + t('sampleName')),
              h('span', { className: 'dcs-preview-dot' }, t('sampleStatus'))),
            h('div', { className: 'dcs-preview-msg assistant' },
              h('span', { className: 'dcs-preview-avatar', style: { background: bubble } }, config.icons.assistant),
              h('div', { className: 'dcs-preview-bubble', style: { background: bubble, color: text, backdropFilter: 'blur(' + config.surface.glass + 'px)' } },
                h('div', { className: 'dcs-preview-title', style: { color: text } }, t('sampleAssistant')),
                h('div', { className: 'dcs-preview-lines', style: { color: muted } }, '背景 · 深度 · 字体 · 动画'))),
            h('div', { className: 'dcs-preview-msg user' },
              h('div', { className: 'dcs-preview-bubble user', style: { background: light ? 'rgba(77,107,254,.82)' : 'rgba(77,107,254,.72)', color: '#fff', backdropFilter: 'blur(' + config.surface.glass + 'px)' } },
                t('sampleUser')),
              h('span', { className: 'dcs-preview-avatar', style: { background: bubble } }, config.icons.user)),
            h('div', { className: 'dcs-preview-composer', style: { background: bubble, color: muted } },
              h('span', null, t('sampleComposer')),
              h('span', { className: 'dcs-preview-send' }, config.icons.running)))))
    }

    // ── settings page ─────────────────────────────────────────────────────

    function SettingsPage(props) {
      const t = props.t
      const skin = useSkin()
      const status = useSkinStatus()
      const bg = skin.background
      const font = skin.font

      return h('div', { className: 'dcs-page' },
        h('header', { className: 'dcs-hero' },
          h('div', { className: 'dcs-hero-main' },
            h('div', { className: 'dcs-eyebrow' }, 'DSH · CHAT SKIN'),
            h('h2', { className: 'dcs-title' }, t('title')),
            h('p', { className: 'dcs-subtitle' }, t('subtitle')),
            h('div', { className: 'dcs-badges' },
              h('span', { className: 'dcs-badge' }, 'CSS'),
              h('span', { className: 'dcs-badge' }, 'LIVE'),
              h('span', { className: 'dcs-badge' }, 'LOCAL'))),
          h('div', { className: 'dcs-hero-side' },
            h('div', { className: 'dcs-enable' },
              h('span', { className: 'dcs-enable-label' }, t('enabled')),
              h(Toggle, {
                checked: skin.enabled,
                onChange: (value) => update({ enabled: value }),
              })),
            h('div', { className: 'dcs-status' + (status === 'error' ? ' is-error' : '') },
              h('span', { className: 'dcs-status-dot' }),
              statusLabel(t, status)),
            h('button', {
              type: 'button',
              className: 'dcs-btn dcs-btn-ghost',
              onClick: () => {
                if (window.confirm(t('resetConfirm'))) reset()
              },
            }, t('reset')))),

        h('div', { className: 'dcs-grid' },
          h('main', { className: 'dcs-col' },
            h(Section, { title: t('background'), desc: t('backgroundHint') },
              h('div', { className: 'dcs-source-row' },
                h('span', { className: 'dcs-label' }, t('source')),
                h(Segmented, {
                  value: bg.kind,
                  options: [
                    ['preset', t('preset')],
                    ['gradient', t('gradient')],
                    ['image', t('image')],
                    ['solid', t('solid')],
                  ],
                  onChange: (value) => update({ background: { ...bg, kind: value } }),
                })),
              bg.kind === 'preset'
                ? h(PresetGrid, { value: bg.preset, onPick: applyPreset })
                : null,
              bg.kind === 'gradient'
                ? h(Field, { label: t('gradientCss'), hint: t('gradientHint') },
                  h('textarea', {
                    className: 'dcs-textarea',
                    rows: 3,
                    value: bg.gradient,
                    onChange: (event) => update({ background: { ...bg, gradient: event.currentTarget.value } }),
                  }))
                : null,
              bg.kind === 'image'
                ? h('div', { className: 'dcs-stack' },
                  h(Field, { label: t('imageUrl'), hint: t('imageUrlHint') },
                    h('input', {
                      className: 'dcs-input',
                      type: 'url',
                      value: bg.image,
                      placeholder: 'https://…',
                      onChange: (event) => update({ background: { ...bg, image: event.currentTarget.value } }),
                    })),
                  h(ImagePicker, { t }),
                  h(Select, {
                    label: t('fit'),
                    value: bg.fit,
                    options: [['cover', t('fitCover')], ['contain', t('fitContain')], ['tile', t('fitTile')]],
                    onChange: (value) => update({ background: { ...bg, fit: value } }),
                  }),
                  h(Select, {
                    label: t('position'),
                    value: bg.position,
                    options: POSITIONS.map((value) => [value, value]),
                    onChange: (value) => update({ background: { ...bg, position: value } }),
                  }))
                : null,
              bg.kind === 'solid'
                ? h(ColorField, {
                  label: t('solidColor'),
                  value: bg.color,
                  onChange: (value) => update({ background: { ...bg, color: value } }),
                })
                : null,
              h('div', { className: 'dcs-grid-2' },
                h(Range, {
                  label: t('dim'),
                  value: bg.dim,
                  min: 0,
                  max: 95,
                  onChange: (value) => update({ background: { ...bg, dim: value } }),
                  format: (value) => value + '%',
                  hint: t('dimHint'),
                }),
                h(Range, {
                  label: t('opacity'),
                  value: Math.round(bg.opacity * 100),
                  min: 0,
                  max: 100,
                  onChange: (value) => update({ background: { ...bg, opacity: value / 100 } }),
                  format: (value) => value + '%',
                }),
                h(Range, {
                  label: t('blur'),
                  value: bg.blur,
                  min: 0,
                  max: 40,
                  onChange: (value) => update({ background: { ...bg, blur: value } }),
                  format: (value) => value + 'px',
                }),
                h(Range, {
                  label: t('vignette'),
                  value: bg.vignette,
                  min: 0,
                  max: 100,
                  onChange: (value) => update({ background: { ...bg, vignette: value } }),
                  format: (value) => value + '%',
                }),
                h(Range, {
                  label: t('brightness'),
                  value: bg.brightness,
                  min: 20,
                  max: 180,
                  onChange: (value) => update({ background: { ...bg, brightness: value } }),
                  format: (value) => value + '%',
                }),
                h(Range, {
                  label: t('saturation'),
                  value: bg.saturation,
                  min: 0,
                  max: 220,
                  onChange: (value) => update({ background: { ...bg, saturation: value } }),
                  format: (value) => value + '%',
                }),
                h(Range, {
                  label: t('contrast'),
                  value: bg.contrast,
                  min: 20,
                  max: 180,
                  onChange: (value) => update({ background: { ...bg, contrast: value } }),
                  format: (value) => value + '%',
                }),
                h(ColorField, {
                  label: t('tint'),
                  value: bg.tint,
                  onChange: (value) => update({ background: { ...bg, tint: value } }),
                }))),

            h(Section, { title: t('depth'), desc: t('depthHint') },
              h(Select, {
                label: t('textMode'),
                value: skin.textMode,
                hint: t('textModeHint'),
                options: [['auto', t('textAuto')], ['light', t('textLight')], ['dark', t('textDark')]],
                onChange: (value) => update({ textMode: value }),
              }),
              h('div', { className: 'dcs-grid-2' },
                h(Range, {
                  label: t('glass'),
                  value: skin.surface.glass,
                  min: 0,
                  max: 40,
                  onChange: (value) => update({ surface: { ...skin.surface, glass: value } }),
                  format: (value) => value + 'px',
                }),
                h(Range, {
                  label: t('bubbleOpacity'),
                  value: skin.surface.bubbleOpacity,
                  min: 0,
                  max: 100,
                  onChange: (value) => update({ surface: { ...skin.surface, bubbleOpacity: value } }),
                  format: (value) => value + '%',
                })),
              h('div', { className: 'dcs-row' },
                h('span', { className: 'dcs-label' }, t('border')),
                h(Toggle, {
                  checked: skin.surface.border,
                  onChange: (value) => update({ surface: { ...skin.surface, border: value } }),
                }),
                h('span', { className: 'dcs-label dcs-gap' }, t('shadow')),
                h(Toggle, {
                  checked: skin.surface.shadow,
                  onChange: (value) => update({ surface: { ...skin.surface, shadow: value } }),
                }))),

            h(Section, { title: t('chrome'), desc: t('chromeHint') },
              h('div', { className: 'dcs-row dcs-between' },
                h('span', { className: 'dcs-label' }, t('chromeEnable')),
                h(Toggle, {
                  checked: skin.chrome.enabled,
                  onChange: (value) => update({ chrome: { ...skin.chrome, enabled: value } }),
                })),
              h(Segmented, {
                value: skin.chrome.tintMode,
                options: [['auto', t('chromeTintAuto')], ['custom', t('chromeTintCustom')]],
                onChange: (value) => update({ chrome: { ...skin.chrome, tintMode: value } }),
              }),
              skin.chrome.tintMode === 'custom'
                ? h(ColorField, {
                  label: t('chromeTint'),
                  value: skin.chrome.tint,
                  onChange: (value) => update({ chrome: { ...skin.chrome, tint: value } }),
                })
                : null,
              h('div', { className: 'dcs-grid-2' },
                h(Range, {
                  label: t('sidebarOpacity'),
                  value: skin.chrome.sidebarOpacity,
                  min: 0,
                  max: 100,
                  onChange: (value) => update({ chrome: { ...skin.chrome, sidebarOpacity: value } }),
                  format: (value) => value + '%',
                }),
                h(Range, {
                  label: t('panelOpacity'),
                  value: skin.chrome.panelOpacity,
                  min: 0,
                  max: 100,
                  onChange: (value) => update({ chrome: { ...skin.chrome, panelOpacity: value } }),
                  format: (value) => value + '%',
                }),
                h(Range, {
                  label: t('panelBlur'),
                  value: skin.chrome.blur,
                  min: 0,
                  max: 40,
                  onChange: (value) => update({ chrome: { ...skin.chrome, blur: value } }),
                  format: (value) => value + 'px',
                }),
                h('div', { className: 'dcs-row' },
                  h('span', { className: 'dcs-label' }, t('panelBorder')),
                  h(Toggle, {
                    checked: skin.chrome.border,
                    onChange: (value) => update({ chrome: { ...skin.chrome, border: value } }),
                  }),
                  h('span', { className: 'dcs-label dcs-gap' }, t('panelShadow')),
                  h(Toggle, {
                    checked: skin.chrome.shadow,
                    onChange: (value) => update({ chrome: { ...skin.chrome, shadow: value } }),
                  }))),
              skin.scope !== 'global' ? h('p', { className: 'dcs-hint' }, t('chromeScopeHint')) : null),

            h(Section, { title: t('animation'), desc: t('animationHint') },
              h(Select, {
                label: t('animationName'),
                value: skin.animation.name,
                options: ANIMATIONS.map(([value, key]) => [value, t(key)]),
                onChange: (value) => update({ animation: { ...skin.animation, name: value } }),
              }),
              h('div', { className: 'dcs-grid-2' },
                h(Range, {
                  label: t('duration'),
                  value: skin.animation.duration,
                  min: 4,
                  max: 120,
                  onChange: (value) => update({ animation: { ...skin.animation, duration: value } }),
                  format: (value) => value + t('seconds'),
                }),
                h(Range, {
                  label: t('intensity'),
                  value: skin.animation.intensity,
                  min: 0,
                  max: 100,
                  onChange: (value) => update({ animation: { ...skin.animation, intensity: value } }),
                  format: (value) => value + '%',
                })),
              h(Select, {
                label: t('easing'),
                value: skin.animation.easing,
                options: [['ease', 'ease'], ['ease-in-out', 'ease-in-out'], ['linear', 'linear'], ['cubic-bezier(.34,1.2,.64,1)', 'soft spring']],
                onChange: (value) => update({ animation: { ...skin.animation, easing: value } }),
              })),

            h(Section, { title: t('font'), desc: t('fontHint') },
              h(Select, {
                label: t('fontPreset'),
                value: font.preset,
                options: [
                  ['system', t('fontSystem')],
                  ['yahei', t('fontYahei')],
                  ['song', t('fontSong')],
                  ['kai', t('fontKai')],
                  ['round', t('fontRound')],
                  ['mono', t('fontMono')],
                  ['custom', t('fontCustom')],
                ],
                onChange: (value) => update({ font: { ...font, preset: value } }),
              }),
              font.preset === 'custom'
                ? h('div', { className: 'dcs-stack' },
                  h(Field, { label: t('customFamily'), hint: t('customFamilyHint') },
                    h('input', {
                      className: 'dcs-input',
                      value: font.family,
                      placeholder: '"LXGW WenKai", "Microsoft YaHei", sans-serif',
                      onChange: (event) => update({ font: { ...font, family: event.currentTarget.value } }),
                    })),
                  h(Field, { label: t('customCode') },
                    h('input', {
                      className: 'dcs-input',
                      value: font.codeFamily,
                      placeholder: '"JetBrains Mono", Consolas, monospace',
                      onChange: (event) => update({ font: { ...font, codeFamily: event.currentTarget.value } }),
                    })))
                : null,
              h('div', { className: 'dcs-grid-2' },
                h(Range, {
                  label: t('size'),
                  value: font.size,
                  min: 10,
                  max: 22,
                  onChange: (value) => update({ font: { ...font, size: value } }),
                  format: (value) => value + 'px',
                }),
                h(Range, {
                  label: t('lineHeight'),
                  value: font.lineHeight,
                  min: 1,
                  max: 2.4,
                  step: 0.05,
                  onChange: (value) => update({ font: { ...font, lineHeight: value } }),
                  format: (value) => value.toFixed(2),
                }),
                h(Range, {
                  label: t('letterSpacing'),
                  value: font.letterSpacing,
                  min: -1,
                  max: 4,
                  step: 0.1,
                  onChange: (value) => update({ font: { ...font, letterSpacing: value } }),
                  format: (value) => value.toFixed(1) + 'px',
                }),
                h(Select, {
                  label: t('weight'),
                  value: String(font.weight),
                  options: [['300', '300'], ['400', '400'], ['500', '500'], ['600', '600']],
                  onChange: (value) => update({ font: { ...font, weight: Number(value) } }),
                }))),

            h(Section, { title: t('icons'), desc: t('iconsHint') },
              h('div', { className: 'dcs-grid-3' },
                h(Field, { label: t('assistantIcon') },
                  h('input', {
                    className: 'dcs-input dcs-emoji',
                    maxLength: 12,
                    value: skin.icons.assistant,
                    onChange: (event) => update({ icons: { ...skin.icons, assistant: event.currentTarget.value } }),
                  })),
                h(Field, { label: t('userIcon') },
                  h('input', {
                    className: 'dcs-input dcs-emoji',
                    maxLength: 12,
                    value: skin.icons.user,
                    onChange: (event) => update({ icons: { ...skin.icons, user: event.currentTarget.value } }),
                  })),
                h(Field, { label: t('runningIcon') },
                  h('input', {
                    className: 'dcs-input dcs-emoji',
                    maxLength: 12,
                    value: skin.icons.running,
                    onChange: (event) => update({ icons: { ...skin.icons, running: event.currentTarget.value } }),
                  }))),
              h('div', { className: 'dcs-row dcs-wrap' },
                h('span', { className: 'dcs-label' }, t('ideas')),
                EMOJI_IDEAS.map((emoji) => h('button', {
                  key: emoji,
                  type: 'button',
                  className: 'dcs-emoji-btn',
                  onClick: () => update({ icons: { ...skin.icons, assistant: emoji } }),
                }, emoji))),
              h('div', { className: 'dcs-row' },
                h('span', { className: 'dcs-label' }, t('showAvatars')),
                h(Toggle, {
                  checked: skin.icons.showAvatars,
                  onChange: (value) => update({ icons: { ...skin.icons, showAvatars: value } }),
                }),
                h('span', { className: 'dcs-hint dcs-gap' }, t('avatarHint')))),

            h(Section, { title: t('advanced'), desc: t('advancedHint') },
              h(Segmented, {
                value: skin.scope,
                options: [['chat', t('scopeChat')], ['global', t('scopeGlobal')]],
                onChange: (value) => update({ scope: value }),
              }),
              h('p', { className: 'dcs-hint' }, t('scopeHint')),
              h('div', { className: 'dcs-row' },
                h('span', { className: 'dcs-label' }, t('showLauncher')),
                h(Toggle, {
                  checked: skin.showLauncher,
                  onChange: (value) => update({ showLauncher: value }),
                })),
              h(Field, { label: t('customCss'), hint: t('customCssHint') },
                h('textarea', {
                  className: 'dcs-textarea dcs-code',
                  rows: 7,
                  spellCheck: false,
                  value: skin.customCss,
                  placeholder: '[data-conversation-region="chat"]::before { animation: myFlow 18s linear infinite; }',
                  onChange: (event) => update({ customCss: event.currentTarget.value }),
                })),
              h('p', { className: 'dcs-note' }, t('saveNote')))),

          h('aside', { className: 'dcs-aside' },
            h(Preview, { t, config: skin, status }),
            h('div', { className: 'dcs-card dcs-tip' },
              h('h3', { className: 'dcs-section-title' }, t('preview')),
              h('p', { className: 'dcs-section-desc' }, t('previewHint')),
              h('p', { className: 'dcs-note' }, t('uploadTip'))))))
    }

    // ── quick panel ───────────────────────────────────────────────────────

    function QuickLayer(props) {
      const t = props.t
      const skin = useSkin()
      const [open, setOpen] = React.useState(false)
      const rootRef = React.useRef(null)

      React.useEffect(() => {
        const onOpen = () => setOpen(true)
        window.addEventListener('dcs:open', onOpen)
        return () => window.removeEventListener('dcs:open', onOpen)
      }, [])

      React.useEffect(() => {
        if (!open) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape') setOpen(false)
        }
        const onDown = (event) => {
          if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
        }
        document.addEventListener('keydown', onKey)
        document.addEventListener('mousedown', onDown)
        return () => {
          document.removeEventListener('keydown', onKey)
          document.removeEventListener('mousedown', onDown)
        }
      }, [open])

      if (!skin.showLauncher) return null

      return h('div', { className: 'dcs-quick', ref: rootRef },
        h('button', {
          type: 'button',
          className: 'dcs-fab' + (open ? ' is-open' : ''),
          title: t('quickTitle'),
          'aria-label': t('quickTitle'),
          onClick: () => setOpen(!open),
        }, '🎨'),
        open ? h('div', { className: 'dcs-pop', role: 'dialog', 'aria-label': t('quickTitle') },
          h('div', { className: 'dcs-pop-head' },
            h('div', null,
              h('div', { className: 'dcs-pop-title' }, t('quickTitle')),
              h('div', { className: 'dcs-pop-sub' }, t('quickHint'))),
            h('button', {
              type: 'button',
              className: 'dcs-icon-btn',
              'aria-label': t('close'),
              onClick: () => setOpen(false),
            }, '×')),
          h('div', { className: 'dcs-pop-body' },
            h('div', { className: 'dcs-row dcs-between' },
              h('span', { className: 'dcs-label' }, t('enabled')),
              h(Toggle, { checked: skin.enabled, onChange: (value) => update({ enabled: value }) })),
            h(Segmented, {
              value: skin.scope,
              options: [['chat', t('scopeChat')], ['global', t('scopeGlobal')]],
              onChange: (value) => update({ scope: value }),
            }),
            h('div', { className: 'dcs-pop-presets' },
              PRESETS.slice(0, 4).map((preset) => h('button', {
                key: preset.id,
                type: 'button',
                className: 'dcs-pop-preset' + (skin.background.preset === preset.id && skin.background.kind === 'preset' ? ' is-active' : ''),
                title: preset.name,
                style: { backgroundImage: PRESET_BG[preset.id] },
                onClick: () => applyPreset(preset),
              }, h('span', null, preset.name)))),
            h(Range, {
              label: t('dim'),
              value: skin.background.dim,
              min: 0,
              max: 95,
              onChange: (value) => update({ background: { ...skin.background, dim: value } }),
              format: (value) => value + '%',
            }),
            h(Range, {
              label: t('blur'),
              value: skin.background.blur,
              min: 0,
              max: 40,
              onChange: (value) => update({ background: { ...skin.background, blur: value } }),
              format: (value) => value + 'px',
            }),
            h(Select, {
              label: t('animationName'),
              value: skin.animation.name,
              options: ANIMATIONS.map(([value, key]) => [value, t(key)]),
              onChange: (value) => update({ animation: { ...skin.animation, name: value } }),
            }),
            h(Select, {
              label: t('fontPreset'),
              value: skin.font.preset,
              options: [
                ['system', t('fontSystem')],
                ['yahei', t('fontYahei')],
                ['song', t('fontSong')],
                ['kai', t('fontKai')],
                ['round', t('fontRound')],
                ['mono', t('fontMono')],
              ],
              onChange: (value) => update({ font: { ...skin.font, preset: value } }),
            })),
          h('div', { className: 'dcs-pop-foot' },
            h('button', {
              type: 'button',
              className: 'dcs-btn dcs-btn-ghost',
              onClick: () => {
                if (window.confirm(t('resetConfirm'))) reset()
              },
            }, t('reset')),
            h('span', { className: 'dcs-pop-note' }, t('more')))) : null)
    }

    // ── plugin lifecycle ──────────────────────────────────────────────────

    const UI_CSS = `
.dcs-page{--dcs-card:color-mix(in srgb, var(--dsw-alias-bg-layer-1, #fff) 86%, transparent);display:flex;flex-direction:column;gap:18px;max-width:1080px;padding:2px 0 42px;color:var(--dsw-alias-label-primary,#172033);font-family:var(--dsw-font-family,system-ui,sans-serif)}
.dcs-hero{position:relative;overflow:hidden;display:flex;gap:24px;justify-content:space-between;align-items:flex-start;padding:24px 26px;border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 72%, transparent);border-radius:22px;background:linear-gradient(135deg,color-mix(in srgb, var(--dsw-alias-bg-layer-1,#fff) 92%, transparent),color-mix(in srgb, var(--dsw-alias-bg-layer-2,#f4f6fa) 78%, transparent));box-shadow:0 18px 50px rgba(9,20,40,.08)}
.dcs-hero:before{content:"";position:absolute;right:-80px;top:-120px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(79,70,229,.22),transparent 66%);pointer-events:none}
.dcs-hero:after{content:"";position:absolute;right:120px;bottom:-150px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,.16),transparent 68%);pointer-events:none}
.dcs-hero-main{position:relative;z-index:1;min-width:0}
.dcs-hero-side{position:relative;z-index:1;display:flex;flex-direction:column;align-items:flex-end;gap:12px;min-width:172px}
.dcs-eyebrow{font-size:11px;letter-spacing:.18em;font-weight:600;color:var(--dsw-alias-label-tertiary,#738096);margin-bottom:8px}
.dcs-title{font-size:26px;line-height:1.2;font-weight:650;letter-spacing:-.02em;margin:0 0 8px}
.dcs-subtitle{font-size:13px;line-height:1.7;color:var(--dsw-alias-label-secondary,#4b576b);max-width:560px;margin:0}
.dcs-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}
.dcs-badge{font-size:10px;font-weight:600;letter-spacing:.08em;padding:3px 7px;border-radius:999px;color:var(--dsw-alias-label-tertiary,#738096);background:color-mix(in srgb, var(--dsw-alias-bg-layer-2,#f4f6fa) 82%, transparent);border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 58%, transparent)}
.dcs-enable{display:flex;align-items:center;gap:10px}
.dcs-enable-label{font-size:12px;color:var(--dsw-alias-label-secondary,#4b576b)}
.dcs-status{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--dsw-alias-label-tertiary,#738096);white-space:nowrap}
.dcs-status.is-error{color:var(--dsw-alias-label-error,#d33)}
.dcs-status-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.14)}
.dcs-status.is-error .dcs-status-dot{background:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.14)}
.dcs-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:18px;align-items:start}
.dcs-col{display:flex;flex-direction:column;gap:16px;min-width:0}
.dcs-aside{position:sticky;top:12px;display:flex;flex-direction:column;gap:14px;min-width:0}
.dcs-card{border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 66%, transparent);border-radius:16px;background:var(--dcs-card);padding:18px;min-width:0}
.dcs-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px}
.dcs-section-title{font-size:14px;font-weight:600;margin:0;line-height:1.4}
.dcs-section-desc{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary,#738096);margin:4px 0 0}
.dcs-section-body{display:flex;flex-direction:column;gap:14px}
.dcs-field{display:flex;flex-direction:column;gap:7px;min-width:0}
.dcs-field-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
.dcs-label{font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary,#4b576b)}
.dcs-value{font-size:11px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary,#738096)}
.dcs-hint{font-size:11px;line-height:1.55;color:var(--dsw-alias-label-tertiary,#738096)}
.dcs-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dcs-between{justify-content:space-between}
.dcs-wrap{flex-wrap:wrap}
.dcs-gap{margin-left:4px}
.dcs-stack{display:flex;flex-direction:column;gap:12px}
.dcs-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 18px}
.dcs-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.dcs-range{width:100%;accent-color:var(--dsw-alias-state-business-primary,#4d6bfe);height:18px;cursor:pointer}
.dcs-input,.dcs-select,.dcs-textarea{box-sizing:border-box;width:100%;border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 82%, transparent);border-radius:9px;background:color-mix(in srgb, var(--dsw-alias-bg-base,#fff) 76%, transparent);color:var(--dsw-alias-label-primary,#172033);font:inherit;font-size:12px;line-height:1.5;padding:8px 10px;outline:none}
.dcs-input:focus,.dcs-select:focus,.dcs-textarea:focus{border-color:var(--dsw-alias-state-business-primary,#4d6bfe);box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary,#4d6bfe) 18%, transparent)}
.dcs-textarea{resize:vertical;min-height:64px;font-family:var(--ds-font-family-code,"SF Mono",Consolas,monospace);font-size:11px}
.dcs-code{line-height:1.65}
.dcs-emoji{font-size:20px;text-align:center;padding:5px 8px}
.dcs-color{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--dsw-alias-label-secondary,#4b576b);min-height:34px}
.dcs-color input[type=color]{width:30px;height:26px;padding:0;border:1px solid var(--dsw-alias-border-l2,#d7dce5);border-radius:7px;background:transparent;cursor:pointer}
.dcs-color code{font-size:10px;color:var(--dsw-alias-label-tertiary,#738096)}
.dcs-btn{appearance:none;border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 80%, transparent);border-radius:9px;background:color-mix(in srgb, var(--dsw-alias-bg-layer-2,#f4f6fa) 82%, transparent);color:var(--dsw-alias-label-primary,#172033);font:inherit;font-size:12px;font-weight:500;padding:7px 12px;cursor:pointer;transition:background .16s ease,border-color .16s ease,transform .16s ease;white-space:nowrap}
.dcs-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06));border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary,#4d6bfe) 40%, transparent)}
.dcs-btn:active{transform:translateY(1px)}
.dcs-btn:disabled{opacity:.5;cursor:default}
.dcs-btn-ghost{background:transparent}
.dcs-switch{position:relative;width:38px;height:22px;padding:0;border:0;border-radius:999px;background:color-mix(in srgb, var(--dsw-alias-label-tertiary,#9aa4b5) 38%, transparent);cursor:pointer;transition:background .18s ease;flex:none}
.dcs-switch.is-on{background:var(--dsw-alias-state-business-primary,#4d6bfe)}
.dcs-knob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.24);transition:transform .18s cubic-bezier(.34,1.3,.64,1)}
.dcs-switch.is-on .dcs-knob{transform:translateX(16px)}
.dcs-seg{display:inline-flex;align-items:center;gap:3px;padding:3px;border-radius:10px;background:color-mix(in srgb, var(--dsw-alias-bg-layer-2,#f4f6fa) 86%, transparent);border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 56%, transparent);flex-wrap:wrap}
.dcs-seg-btn{appearance:none;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-tertiary,#738096);font:inherit;font-size:12px;padding:5px 10px;cursor:pointer;transition:background .16s ease,color .16s ease}
.dcs-seg-btn:hover{color:var(--dsw-alias-label-primary,#172033)}
.dcs-seg-btn.is-active{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#172033);box-shadow:0 1px 5px rgba(9,20,40,.12)}
.dcs-source-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.dcs-presets{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.dcs-preset{appearance:none;display:flex;align-items:center;gap:10px;text-align:left;border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 62%, transparent);border-radius:12px;background:color-mix(in srgb, var(--dsw-alias-bg-base,#fff) 58%, transparent);padding:7px;cursor:pointer;transition:border-color .16s ease,transform .16s ease,box-shadow .16s ease;min-width:0}
.dcs-preset:hover{transform:translateY(-1px);border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary,#4d6bfe) 42%, transparent)}
.dcs-preset.is-active{border-color:var(--dsw-alias-state-business-primary,#4d6bfe);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary,#4d6bfe) 16%, transparent)}
.dcs-preset-swatch{width:54px;height:38px;border-radius:8px;background-size:cover;background-position:center;flex:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
.dcs-preset-copy{display:flex;flex-direction:column;gap:2px;min-width:0}
.dcs-preset-name{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary,#172033);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dcs-preset-sub{font-size:10px;color:var(--dsw-alias-label-tertiary,#738096);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dcs-upload{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dcs-upload-note{font-size:11px;color:var(--dsw-alias-label-tertiary,#738096)}
.dcs-upload-note.is-error{color:var(--dsw-alias-label-error,#d33)}
.dcs-emoji-btn{appearance:none;border:1px solid transparent;border-radius:8px;background:transparent;font-size:17px;line-height:1;padding:4px 5px;cursor:pointer;transition:background .14s ease,transform .14s ease}
.dcs-emoji-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06));transform:translateY(-1px)}
.dcs-note{font-size:11px;line-height:1.6;color:var(--dsw-alias-label-tertiary,#738096);margin:0}
.dcs-preview-card{border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 64%, transparent);border-radius:16px;background:var(--dcs-card);padding:12px}
.dcs-preview-head{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary,#4b576b);padding:2px 2px 10px}
.dcs-preview-status{font-weight:400;color:var(--dsw-alias-label-tertiary,#738096)}
.dcs-preview-frame{position:relative;height:340px;border-radius:12px;overflow:hidden;background:#0b1220;border:1px solid rgba(255,255,255,.08)}
.dcs-preview-bg{position:absolute;inset:-6%;background-size:cover;background-position:center}
.dcs-preview-dim{position:absolute;inset:0}
.dcs-preview-content{position:relative;z-index:1;display:flex;flex-direction:column;gap:12px;height:100%;padding:14px;box-sizing:border-box;font-size:11px;line-height:1.55}
.dcs-preview-bar{display:flex;justify-content:space-between;align-items:center;font-size:10px;font-weight:600;letter-spacing:.06em;opacity:.9;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,.12)}
.dcs-preview-dot{font-weight:400;opacity:.65}
.dcs-preview-msg{display:flex;align-items:flex-start;gap:8px;min-width:0}
.dcs-preview-msg.user{justify-content:flex-end;margin-top:2px}
.dcs-preview-avatar{width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;flex:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.16)}
.dcs-preview-bubble{border-radius:11px;padding:9px 11px;max-width:82%;box-shadow:0 8px 24px rgba(0,0,0,.12);border:1px solid rgba(255,255,255,.12);font-size:11px}
.dcs-preview-bubble.user{max-width:86%}
.dcs-preview-title{font-weight:500;margin-bottom:4px}
.dcs-preview-lines{font-size:10px;opacity:.9}
.dcs-preview-composer{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:8px;border-radius:11px;padding:9px 11px;border:1px solid rgba(255,255,255,.14);font-size:11px}
.dcs-preview-send{width:22px;height:22px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.14);font-size:12px}
.dcs-tip .dcs-keyhint{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--dsw-alias-label-tertiary,#738096);flex-wrap:wrap;margin-top:10px}
.dcs-tip kbd{font-family:var(--ds-font-family-code,Consolas,monospace);font-size:9px;padding:1px 5px;border-radius:4px;border:1px solid var(--dsw-alias-border-l2,#d7dce5);background:var(--dsw-alias-bg-layer-2,#f4f6fa)}
.dcs-quick{position:fixed;z-index:9500;right:16px;top:76px;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
.dcs-fab{appearance:none;width:38px;height:38px;border-radius:12px;border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 72%, transparent);background:color-mix(in srgb, var(--dsw-alias-bg-layer-1,#fff) 82%, transparent);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);box-shadow:0 10px 30px rgba(9,20,40,.16);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .18s ease,box-shadow .18s ease}
.dcs-fab:hover{transform:translateY(-2px) rotate(-4deg);box-shadow:0 14px 36px rgba(9,20,40,.22)}
.dcs-fab.is-open{transform:rotate(8deg)}
.dcs-pop{width:334px;max-height:calc(100vh - 140px);overflow:auto;border:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 72%, transparent);border-radius:16px;background:color-mix(in srgb, var(--dsw-alias-bg-layer-1,#fff) 92%, transparent);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);box-shadow:0 24px 70px rgba(9,20,40,.26);padding:14px;color:var(--dsw-alias-label-primary,#172033);box-sizing:border-box}
.dcs-pop-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding-bottom:10px;border-bottom:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 52%, transparent)}
.dcs-pop-title{font-size:13px;font-weight:650}
.dcs-pop-sub{font-size:10px;line-height:1.5;color:var(--dsw-alias-label-tertiary,#738096);margin-top:2px}
.dcs-icon-btn{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-tertiary,#738096);font-size:18px;line-height:1;cursor:pointer;padding:2px 4px;border-radius:6px}
.dcs-icon-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}
.dcs-pop-body{display:flex;flex-direction:column;gap:12px;padding:12px 0}
.dcs-pop .dcs-seg{width:100%}
.dcs-pop .dcs-seg-btn{flex:1;text-align:center}
.dcs-pop-presets{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.dcs-pop-preset{appearance:none;position:relative;height:52px;border-radius:9px;border:1px solid rgba(255,255,255,.18);cursor:pointer;overflow:hidden;background-size:cover;background-position:center;padding:0;text-align:left}
.dcs-pop-preset span{position:absolute;left:7px;bottom:5px;font-size:10px;font-weight:600;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.6)}
.dcs-pop-preset.is-active{box-shadow:0 0 0 2px var(--dsw-alias-state-business-primary,#4d6bfe)}
.dcs-pop-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:10px;border-top:1px solid color-mix(in srgb, var(--dsw-alias-border-l2,#d7dce5) 52%, transparent)}
.dcs-pop-note{font-size:9px;line-height:1.4;color:var(--dsw-alias-label-tertiary,#738096);text-align:right;max-width:170px}
@media (max-width:900px){.dcs-grid{grid-template-columns:minmax(0,1fr)}.dcs-aside{position:static}.dcs-hero{flex-direction:column}.dcs-hero-side{align-items:flex-start;flex-direction:row;flex-wrap:wrap;min-width:0}}
@media (max-width:620px){.dcs-grid-2,.dcs-grid-3{grid-template-columns:minmax(0,1fr)}.dcs-presets{grid-template-columns:minmax(0,1fr)}.dcs-quick{top:64px;right:10px}.dcs-pop{width:min(334px,calc(100vw - 20px))}}
`

    function boot() {
      if (typeof document === 'undefined') return
      disposed = false
      if (!document.getElementById('dsh-chat-skin-ui')) {
        const tag = document.createElement('style')
        tag.id = 'dsh-chat-skin-ui'
        tag.dataset.plugin = 'dsh-chat-skin'
        tag.textContent = UI_CSS
        document.head.appendChild(tag)
      }
      paint()
      void hydrate()
    }

    function teardown() {
      disposed = true
      if (saveTimer !== 0) window.clearTimeout(saveTimer)
      if (renderFrame !== 0) window.cancelAnimationFrame(renderFrame)
      saveTimer = 0
      renderFrame = 0
      for (const id of ['dsh-chat-skin-style', 'dsh-chat-skin-ui']) {
        const tag = document.getElementById(id)
        if (tag) tag.remove()
      }
      const root = document.documentElement
      root.removeAttribute('data-dcs-on')
      root.removeAttribute('data-dcs-scope')
      root.removeAttribute('data-dcs-avatars')
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const offZh = ctx.locale.register(NS, 'zh', DICT_ZH)
          const offEn = ctx.locale.register(NS, 'en', DICT_EN)
          const t = ctx.locale.bind(NS)
          boot()

          const safeSlot = (name, factory) => {
            try {
              return ctx.slots.inject(name, () => {
                try {
                  return factory()
                } catch (error) {
                  try {
                    ctx.logger?.warn?.(`[chat-skin] ${name} registration skipped: ${String(error && error.message || error)}`)
                  } catch {
                    /* logging is optional */
                  }
                  return () => {}
                }
              })
            } catch (error) {
              try {
                ctx.logger?.warn?.(`[chat-skin] ${name} slot unavailable: ${String(error && error.message || error)}`)
              } catch {
                /* logging is optional */
              }
              return () => {}
            }
          }

          const offSettings = safeSlot('settings.section', () => ctx.slots.register({
            name: 'settings.section',
            id: 'chat-skin',
            order: 55,
            label: () => t('nav'),
            locale: NS,
          }, () => h(SettingsPage, { t })))

          const offQuick = safeSlot('shell.overlay', () => ctx.slots.register({
            name: 'shell.overlay',
            id: 'chat-skin-quick',
            order: 88,
            locale: NS,
          }, () => h(QuickLayer, { t })))

          return () => {
            for (const off of [offSettings, offQuick, offZh, offEn]) {
              try {
                off && off()
              } catch {
                /* already disposed */
              }
            }
            teardown()
          }
        })
      },
      __test: {
        DEFAULTS,
        PRESETS,
        PRESET_BG,
        FONTS,
        normalize,
        compileCss,
        fontOf,
        backgroundImage,
        backgroundBase,
        animationValue,
        sanitizeUrl,
        resolveTextMode,
        SettingsPage,
        QuickLayer,
        Preview,
      },
    }
  },
})
