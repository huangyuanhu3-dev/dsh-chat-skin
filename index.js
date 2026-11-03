/**
 * dsh-chat-skin — Host half.
 *
 * Owns exactly three things:
 *   1. one JSON preference document under `$DSH_HOME/dsh-chat-skin/config.json`;
 *   2. an upload directory for local wallpaper files;
 *   3. three small HTTP routes used by the browser half.
 *
 * No DSH package imports: this module must stay loadable even when the
 * composition changes. `webServer` is optional and attached with `ctx.inject`,
 * so a host without it simply never exposes the routes.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { randomBytes } from 'node:crypto'

export const name = 'chat-skin'

/** No hard dependency: routes attach when `webServer` is ready. */
export const inject = []

export const VERSION = (() => {
  try {
    const parsed = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
    if (typeof parsed.version === 'string' && parsed.version !== '') return parsed.version
  } catch {
    /* fall through */
  }
  return '0.0.0'
})()

export const API_ROUTE = '/dsh-chat-skin/api'
export const UPLOAD_ROUTE = '/dsh-chat-skin/upload'
export const ASSET_PREFIX = '/dsh-chat-skin/asset/'

/** Keep these defaults in sync with `client.js` (the browser owns the UI copy). */
export const DEFAULT_CONFIG = {
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

const ENUMS = {
  scope: ['chat', 'global'],
  textMode: ['auto', 'light', 'dark'],
  'chrome.tintMode': ['auto', 'custom'],
  'background.kind': ['preset', 'gradient', 'image', 'solid'],
  'background.fit': ['cover', 'contain', 'tile'],
  'background.position': ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'],
  'animation.name': ['none', 'drift', 'zoom', 'pan', 'breathe', 'aurora'],
  'animation.easing': ['ease', 'ease-in-out', 'linear', 'cubic-bezier(.34,1.2,.64,1)'],
  'font.preset': ['system', 'yahei', 'song', 'kai', 'round', 'mono', 'custom'],
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

function text(value, fallback, max = 2000) {
  if (typeof value !== 'string') return fallback
  const clean = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, max)
  return clean
}

function number(value, fallback, min, max) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function bool(value, fallback) {
  return typeof value === 'boolean' ? value : fallback
}

function oneOf(value, allowed, fallback) {
  return typeof value === 'string' && allowed.includes(value) ? value : fallback
}

function color(value, fallback) {
  const clean = text(value, fallback, 120).trim()
  if (/^#[0-9a-f]{3,8}$/i.test(clean)) return clean
  if (/^(rgb|hsl)a?\([0-9.,%\s/]+\)$/i.test(clean)) return clean
  return fallback
}

function normalizeSection(value, defaults) {
  const source = isObject(value) ? value : {}
  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => {
      const next = source[key]
      if (typeof fallback === 'boolean') return [key, bool(next, fallback)]
      if (typeof fallback === 'number') {
        const min = key === 'letterSpacing' ? -1 : key === 'saturation' || key === 'vignette' || key === 'dim' || key === 'glass' || key === 'bubbleOpacity' || key === 'intensity' ? 0 : 0
        const max = key === 'duration' ? 300 : key === 'intensity' ? 100 : key === 'weight' ? 900 : 1000
        return [key, number(next, fallback, min, max)]
      }
      return [key, text(next, fallback)]
    }),
  )
}

/**
 * Accept partial / hostile JSON and return a complete, bounded document.
 * This runs on every read and write, so a hand-edited config cannot poison
 * the client with `undefined` or unbounded strings.
 */
export function normalizeConfig(input) {
  const source = isObject(input) ? input : {}
  const background = normalizeSection(source.background, DEFAULT_CONFIG.background)
  const animation = normalizeSection(source.animation, DEFAULT_CONFIG.animation)
  const surface = normalizeSection(source.surface, DEFAULT_CONFIG.surface)
  const chrome = normalizeSection(source.chrome, DEFAULT_CONFIG.chrome)
  const font = normalizeSection(source.font, DEFAULT_CONFIG.font)
  const icons = normalizeSection(source.icons, DEFAULT_CONFIG.icons)

  background.kind = oneOf(background.kind, ENUMS['background.kind'], DEFAULT_CONFIG.background.kind)
  background.fit = oneOf(background.fit, ENUMS['background.fit'], DEFAULT_CONFIG.background.fit)
  background.position = oneOf(background.position, ENUMS['background.position'], DEFAULT_CONFIG.background.position)
  background.opacity = number(background.opacity, DEFAULT_CONFIG.background.opacity, 0, 1)
  background.gradient = text(background.gradient, DEFAULT_CONFIG.background.gradient, 4000)
  background.image = text(background.image, '', 4000)
  background.color = color(background.color, DEFAULT_CONFIG.background.color)
  background.tint = color(background.tint, DEFAULT_CONFIG.background.tint)
  background.dim = number(background.dim, DEFAULT_CONFIG.background.dim, 0, 95)
  background.vignette = number(background.vignette, DEFAULT_CONFIG.background.vignette, 0, 100)

  animation.name = oneOf(animation.name, ENUMS['animation.name'], DEFAULT_CONFIG.animation.name)
  animation.easing = oneOf(animation.easing, ENUMS['animation.easing'], DEFAULT_CONFIG.animation.easing)
  animation.duration = number(animation.duration, DEFAULT_CONFIG.animation.duration, 1, 300)
  animation.intensity = number(animation.intensity, DEFAULT_CONFIG.animation.intensity, 0, 100)
  animation.customName = text(animation.customName, '', 80).replace(/[^a-zA-Z0-9_-]/g, '')
  animation.customCss = text(animation.customCss, '', 20000)

  surface.glass = number(surface.glass, DEFAULT_CONFIG.surface.glass, 0, 40)
  surface.bubbleOpacity = number(surface.bubbleOpacity, DEFAULT_CONFIG.surface.bubbleOpacity, 0, 100)

  chrome.tintMode = oneOf(chrome.tintMode, ENUMS['chrome.tintMode'], DEFAULT_CONFIG.chrome.tintMode)
  chrome.tint = color(chrome.tint, DEFAULT_CONFIG.chrome.tint)
  chrome.sidebarOpacity = number(chrome.sidebarOpacity, DEFAULT_CONFIG.chrome.sidebarOpacity, 0, 100)
  chrome.panelOpacity = number(chrome.panelOpacity, DEFAULT_CONFIG.chrome.panelOpacity, 0, 100)
  chrome.blur = number(chrome.blur, DEFAULT_CONFIG.chrome.blur, 0, 40)

  font.preset = oneOf(font.preset, ENUMS['font.preset'], DEFAULT_CONFIG.font.preset)
  font.family = text(font.family, '', 400).replace(/[{};]/g, '')
  font.codeFamily = text(font.codeFamily, '', 400).replace(/[{};]/g, '')
  font.size = number(font.size, DEFAULT_CONFIG.font.size, 10, 22)
  font.lineHeight = number(font.lineHeight, DEFAULT_CONFIG.font.lineHeight, 1, 2.4)
  font.letterSpacing = number(font.letterSpacing, DEFAULT_CONFIG.font.letterSpacing, -1, 4)
  font.weight = number(font.weight, DEFAULT_CONFIG.font.weight, 300, 900)

  for (const key of ['assistant', 'user', 'running']) {
    icons[key] = Array.from(text(icons[key], DEFAULT_CONFIG.icons[key], 32)).slice(0, 8).join('')
  }

  return {
    version: 1,
    enabled: bool(source.enabled, DEFAULT_CONFIG.enabled),
    showLauncher: bool(source.showLauncher, DEFAULT_CONFIG.showLauncher),
    scope: oneOf(source.scope, ENUMS.scope, DEFAULT_CONFIG.scope),
    textMode: oneOf(source.textMode, ENUMS.textMode, DEFAULT_CONFIG.textMode),
    background,
    animation,
    surface,
    chrome,
    font,
    icons,
    customCss: text(source.customCss, '', 60000),
    updatedAt: number(source.updatedAt, 0, 0, Number.MAX_SAFE_INTEGER),
  }
}

function homeDir() {
  const configured = typeof process.env.DSH_HOME === 'string' && process.env.DSH_HOME.trim() !== ''
    ? process.env.DSH_HOME.trim()
    : path.join(os.homedir(), '.dsh')
  return path.resolve(configured)
}

function dataPaths() {
  const root = path.join(homeDir(), 'dsh-chat-skin')
  return {
    root,
    config: path.join(root, 'config.json'),
    assets: path.join(root, 'assets'),
  }
}

function readConfig() {
  const paths = dataPaths()
  try {
    const parsed = JSON.parse(fs.readFileSync(paths.config, 'utf8'))
    return { config: normalizeConfig(parsed), persisted: true }
  } catch {
    return { config: normalizeConfig(DEFAULT_CONFIG), persisted: false }
  }
}

function writeConfig(config) {
  const paths = dataPaths()
  fs.mkdirSync(paths.root, { recursive: true, mode: 0o700 })
  const value = normalizeConfig({ ...config, updatedAt: Date.now() })
  const body = `${JSON.stringify(value, null, 2)}\n`
  const temp = `${paths.config}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`
  fs.writeFileSync(temp, body, { mode: 0o600 })
  try {
    fs.renameSync(temp, paths.config)
  } catch {
    fs.copyFileSync(temp, paths.config)
    fs.rmSync(temp, { force: true })
  }
  return value
}

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

function listAssets() {
  const paths = dataPaths()
  try {
    return fs.readdirSync(paths.assets)
      .filter((entry) => Object.hasOwn(MIME, path.extname(entry).toLowerCase()))
      .map((entry) => {
        const stat = fs.statSync(path.join(paths.assets, entry))
        return { name: entry, url: `${ASSET_PREFIX}${encodeURIComponent(entry)}`, size: stat.size, mtime: stat.mtimeMs }
      })
      .sort((a, b) => b.mtime - a.mtime)
  } catch {
    return []
  }
}

function json(res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

function sameOrigin(req) {
  try {
    const headers = req.headers || {}
    const site = String(headers['sec-fetch-site'] || '').toLowerCase()
    if (site === 'cross-site') return false
    const origin = headers.origin
    if (typeof origin === 'string' && origin !== '' && origin !== 'null') {
      const host = String(headers.host || '')
      if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) return false
    }
    return true
  } catch {
    return false
  }
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let total = 0
    let settled = false
    const fail = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }
    req.on('data', (chunk) => {
      total += chunk.length
      if (total > limit) {
        fail(Object.assign(new Error('body too large'), { code: 'E_TOO_LARGE' }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      resolve(Buffer.concat(chunks))
    })
    req.on('error', fail)
    req.on('aborted', () => fail(Object.assign(new Error('aborted'), { code: 'E_ABORTED' })))
  })
}

function uploadExtension(name, type) {
  const typeMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif',
  }
  if (typeMap[type]) return typeMap[type]
  const ext = path.extname(String(name || '')).toLowerCase()
  return Object.hasOwn(MIME, ext) ? ext : ''
}

function safeName(value) {
  return String(value || 'wallpaper')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48) || 'wallpaper'
}

/**
 * Register routes. Every failure is contained: a broken route must not take
 * the Host (and therefore the whole UI) down.
 */
export function apply(ctx) {
  const log = (level, message) => {
    try {
      ctx.logger?.[level]?.(`[${name}] ${message}`)
    } catch {
      /* logging is optional */
    }
  }

  ctx.inject(['webServer'], (child) => {
    child.effect(() => {
      const disposers = []
      const register = (route) => {
        try {
          const off = child.webServer.register(route)
          if (typeof off === 'function') disposers.push(off)
        } catch (error) {
          log('warn', `route ${route.path} unavailable: ${String(error && error.message || error)}`)
        }
      }

      register({
        kind: 'exact',
        path: API_ROUTE,
        handler: async (req, res) => {
          const method = String(req.method || 'GET').toUpperCase()
          if (method === 'GET' || method === 'HEAD') {
            const { config, persisted } = readConfig()
            json(res, 200, { ok: true, version: VERSION, persisted, config, assets: listAssets() })
            return
          }
          if (method !== 'POST') {
            json(res, 405, { ok: false, error: 'use GET or POST' })
            return
          }
          if (!sameOrigin(req)) {
            json(res, 403, { ok: false, error: 'cross-site write rejected' })
            return
          }
          try {
            const body = await readBody(req, 700 * 1024)
            const parsed = body.length === 0 ? {} : JSON.parse(body.toString('utf8'))
            const incoming = isObject(parsed && parsed.config) ? parsed.config : parsed
            const saved = writeConfig(incoming)
            json(res, 200, { ok: true, version: VERSION, persisted: true, config: saved })
          } catch (error) {
            const code = error && error.code
            const status = code === 'E_TOO_LARGE' ? 413 : 400
            json(res, status, { ok: false, error: String(error && error.message || error) })
          }
        },
      })

      register({
        kind: 'exact',
        path: UPLOAD_ROUTE,
        handler: async (req, res) => {
          if (String(req.method || 'GET').toUpperCase() !== 'POST') {
            json(res, 405, { ok: false, error: 'use POST' })
            return
          }
          if (!sameOrigin(req)) {
            json(res, 403, { ok: false, error: 'cross-site upload rejected' })
            return
          }
          try {
            const requestUrl = new URL(String(req.url || '/'), 'http://local')
            const original = requestUrl.searchParams.get('name') || 'wallpaper'
            const type = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase()
            const ext = uploadExtension(original, type)
            if (ext === '') {
              json(res, 415, { ok: false, error: '仅支持 PNG / JPEG / WebP / GIF / AVIF' })
              return
            }
            const body = await readBody(req, 12 * 1024 * 1024)
            if (body.length === 0) {
              json(res, 400, { ok: false, error: 'empty upload' })
              return
            }
            const paths = dataPaths()
            fs.mkdirSync(paths.assets, { recursive: true, mode: 0o700 })
            const filename = `${Date.now()}-${randomBytes(5).toString('hex')}-${safeName(path.basename(original, path.extname(original)))}${ext}`
            fs.writeFileSync(path.join(paths.assets, filename), body, { mode: 0o600 })
            json(res, 200, {
              ok: true,
              url: `${ASSET_PREFIX}${encodeURIComponent(filename)}`,
              assets: listAssets(),
            })
          } catch (error) {
            const code = error && error.code
            json(res, code === 'E_TOO_LARGE' ? 413 : 400, {
              ok: false,
              error: code === 'E_TOO_LARGE' ? '图片超过 12 MiB' : String(error && error.message || error),
            })
          }
        },
      })

      register({
        kind: 'prefix',
        // The host's prefix matcher appends its own `/`, so a trailing slash
        // here would turn the match into `//` and never reach the handler.
        path: ASSET_PREFIX.replace(/\/+$/, ''),
        handler: (req, res) => {
          const method = String(req.method || 'GET').toUpperCase()
          if (method !== 'GET' && method !== 'HEAD') {
            res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end('use GET')
            return
          }
          try {
            const requestUrl = new URL(String(req.url || '/'), 'http://local')
            const raw = decodeURIComponent(requestUrl.pathname.slice(ASSET_PREFIX.length))
            const name = path.basename(raw)
            const ext = path.extname(name).toLowerCase()
            if (name !== raw || !Object.hasOwn(MIME, ext)) {
              res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
              res.end('not found')
              return
            }
            const file = path.join(dataPaths().assets, name)
            const stat = fs.statSync(file)
            if (!stat.isFile()) throw new Error('not a file')
            res.writeHead(200, {
              'Content-Type': MIME[ext],
              'Content-Length': stat.size,
              'Cache-Control': 'public, max-age=31536000, immutable',
            })
            if (method === 'HEAD') {
              res.end()
              return
            }
            fs.createReadStream(file).pipe(res)
          } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end('not found')
          }
        },
      })

      log('info', `v${VERSION} ready — settings and wallpapers at ${dataPaths().root}`)
      return () => {
        for (const dispose of disposers.splice(0)) {
          try {
            dispose()
          } catch {
            /* already gone */
          }
        }
      }
    })
  })
}
