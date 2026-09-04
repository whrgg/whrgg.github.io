(() => {
  const KEYS = ['site_pv', 'page_pv', 'site_uv']
  const APIS = [
    'https://cn.vercount.one/api/v2/log',
    'https://events.vercount.one/api/v2/log'
  ]
  const PROD_HOST = 'lvren.xyz'
  const TIMEOUT_MS = 8000

  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname)
  const liveUrl = `https://${PROD_HOST}${location.pathname}${location.search}`

  const uvCookieName = () => {
    const host = location.host.replace(/[^a-zA-Z0-9_-]/g, '_')
    return `vercount_uv_${host}`
  }

  const consumeNewUv = () => {
    if (isLocal) return false
    const name = uvCookieName()
    const exists = document.cookie.split('; ').some(item => item.startsWith(`${name}=`))
    if (!exists) {
      document.cookie = `${name}=1; path=/; max-age=31536000; samesite=lax`
      return true
    }
    return false
  }

  const parse = payload => {
    const data = payload && payload.data ? payload.data : payload
    if (!data || typeof data !== 'object') return null
    return {
      site_pv: Number(data.site_pv || 0),
      page_pv: Number(data.page_pv || 0),
      site_uv: Number(data.site_uv || 0)
    }
  }

  const fill = data => {
    KEYS.forEach(key => {
      const valueEl = document.getElementById(`busuanzi_value_${key}`)
      if (valueEl) valueEl.textContent = String(data[key])
      const box = document.getElementById(`busuanzi_container_${key}`)
      if (box) box.style.display = 'inline'
    })
  }

  const fail = () => {
    KEYS.forEach(key => {
      const valueEl = document.getElementById(`busuanzi_value_${key}`)
      if (valueEl && valueEl.querySelector('.fa-spinner, .fa-spin, .fa-solid')) {
        valueEl.textContent = '—'
      }
    })
  }

  const request = async ({ api, method, url, isNewUv = false }) => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    try {
      const res = method === 'GET'
        ? await fetch(`${api}?url=${encodeURIComponent(url)}`, { signal: ctrl.signal })
        : await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, isNewUv }),
          signal: ctrl.signal
        })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return parse(await res.json())
    } finally {
      clearTimeout(timer)
    }
  }

  const attempts = () => {
    const list = []
    if (isLocal) {
      APIS.forEach(api => list.push({ api, method: 'GET', url: liveUrl }))
      APIS.forEach(api => list.push({ api, method: 'GET', url: location.href }))
    } else {
      const isNewUv = consumeNewUv()
      APIS.forEach(api => list.push({ api, method: 'POST', url: location.href, isNewUv }))
      APIS.forEach(api => list.push({ api, method: 'GET', url: location.href }))
    }
    return list
  }

  const run = async () => {
    for (const item of attempts()) {
      try {
        const data = await request(item)
        if (data) {
          fill(data)
          return
        }
      } catch (err) {}
    }
    fail()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    run()
  }
})()
