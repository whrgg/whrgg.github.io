(() => {
  const PAGES = [
    {
      when: '2026 · 春',
      walking: { text: 'RAG · 检索增强', href: '/2026/04/02/RAG-LLM-%E6%A3%80%E7%B4%A2%E5%A2%9E%E5%BC%BA%E7%94%9F%E6%88%90%E6%B7%B1%E5%BA%A6%E6%8C%87%E5%8D%97/' },
      pack: [
        { text: 'Spring', href: '/tags/spring/' },
        { text: 'Redis', href: '/tags/redis/' },
        { text: 'LLM', href: '/categories/AI-LLM/' }
      ],
      note: '我自有火，何羡他人光'
    },
    {
      when: '2025 · 春',
      walking: { text: '大文件上传 · 分片', href: '/2025/04/08/%E5%A4%A7%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0/' },
      pack: [
        { text: 'Java', href: '/categories/javaweb/' },
        { text: '面试', href: '/tags/%E9%9D%A2%E8%AF%95/' }
      ],
      note: '整包丢上去会把信道堵死，得切开走。'
    },
    {
      when: '2025 · 早春',
      walking: { text: '分布式 · CAP', href: '/2025/03/23/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E5%9F%BA%E6%9C%AC%E5%8E%9F%E7%90%86-CAP/' },
      pack: [
        { text: '一致性', href: '/tags/%E5%88%86%E5%B8%83%E5%BC%8F/' },
        { text: '基本原理', href: '/tags/%E5%9F%BA%E6%9C%AC%E5%8E%9F%E7%90%86/' }
      ],
      note: '三选二不是口号，是下单那一瞬间的取舍。'
    },
    {
      when: '2025 · 冬尽',
      walking: { text: 'DDIA · 数据库', href: '/2025/02/15/DDIA%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86/' },
      pack: [
        { text: '架构', href: '/tags/%E6%9E%B6%E6%9E%84/' },
        { text: '数据库', href: '/tags/%E6%95%B0%E6%8D%AE%E5%BA%93/' }
      ],
      note: '先搞清楚数据怎么躺进库里，再谈漂亮的上层。'
    },
    {
      when: '2024 · 冬',
      walking: { text: '手写 Spring', href: '/2024/12/06/%E6%89%8B%E5%86%99%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95spirng%E6%A1%86%E6%9E%B6/' },
      pack: [
        { text: 'IOC', href: '/tags/spring/' },
        { text: 'AOP', href: '/tags/%E5%8E%9F%E7%90%86%E5%AE%9E%E7%8E%B0/' },
        { text: 'MVC', href: '/categories/%E6%A1%86%E6%9E%B6/' }
      ],
      note: '技术栈也是栈。框架不是魔法，是一层层压上去的。'
    },
    {
      when: '2024 · 夏',
      walking: { text: 'Vue 与页面', href: '/2024/07/26/vue3/' },
      pack: [
        { text: 'Vue3', href: '/tags/vue3/' },
        { text: 'Vue2', href: '/tags/Vue2%E5%9F%BA%E7%A1%80/' }
      ],
      note: '页面会过时，把交互拆开看就不会慌。'
    },
    {
      when: '2024 · 初夏',
      walking: { text: '数据底座', href: '/2024/05/05/mysql%E5%9F%BA%E7%A1%80/' },
      pack: [
        { text: 'MySQL', href: '/tags/mysql/' },
        { text: 'Redis', href: '/tags/redis/' },
        { text: 'JDBC', href: '/2024/05/06/jdbc%E5%85%A5%E9%97%A8/' }
      ],
      note: '从底下开始压。晴耕雨读，笔耕不辍。'
    },
    {
      when: '2022 · 秋',
      walking: { text: '图与算法', href: '/2022/11/12/%E5%9B%BE/' },
      pack: [
        { text: '算法', href: '/tags/%E7%AE%97%E6%B3%95/' },
        { text: '图', href: '/tags/%E5%9B%BE/' }
      ],
      note: '人生如逆旅，我亦是行人。'
    }
  ]

  const ageClass = ageIndex => {
    if (ageIndex <= 0) return 'age-0'
    if (ageIndex === 1) return 'age-1'
    if (ageIndex === 2) return 'age-2'
    if (ageIndex === 3) return 'age-3'
    if (ageIndex === 4) return 'age-4'
    return 'age-5'
  }

  const packHtml = pack => pack.map(item => `<a href="${item.href}">${item.text}</a>`).join('')

  const sheetHtml = (page, ageIndex, isTop) => `
    <div class="waymark-sheet ${ageClass(ageIndex)}" data-role="sheet">
      ${isTop ? '<span class="waymark-tape" aria-hidden="true"></span>' : ''}
      <span class="waymark-when">${page.when}</span>
      <div class="waymark-row">
        <span class="waymark-label">此刻在走</span>
        <a href="${page.walking.href}">${page.walking.text}</a>
      </div>
      <div class="waymark-row">
        <span class="waymark-label">背包里有</span>
        <span class="waymark-pack">${packHtml(page.pack)}</span>
      </div>
      <p class="waymark-quote">${page.note}</p>
    </div>
  `

  const padHtml = remain => {
    const lines = Math.max(remain - 1, 0)
    return `<div class="waymark-pad" aria-hidden="true">${'<span></span>'.repeat(Math.min(lines, 8))}</div>`
  }

  const mount = root => {
    let cursor = 0
    let tearing = false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const render = () => {
      const remain = PAGES.slice(cursor)
      const visible = remain.slice(0, 3)
      root.innerHTML = `
        <div class="item-headline"><i class="fas fa-map-signs"></i><span>路签</span></div>
        <div class="waymark-stage">
          <div class="waymark-stack" aria-live="polite">
            ${visible.map((page, i) => sheetHtml(page, cursor + i, i === 0)).join('')}
          </div>
          ${padHtml(remain.length)}
        </div>
        <p class="waymark-hint">${remain.length > 1 ? '翻开过去的一页' : '当一段故事结束的时候，我们总会想起它的开头'}</p>
      `

      const sheets = [...root.querySelectorAll('[data-role="sheet"]')]
      sheets.forEach((sheet, i) => {
        sheet.classList.toggle('is-top', i === 0)
        sheet.classList.toggle('is-next', i === 1)
        sheet.classList.toggle('is-deep', i >= 2)
        if (i === 0) {
          sheet.setAttribute('role', 'button')
          sheet.tabIndex = 0
          sheet.setAttribute(
            'aria-label',
            remain.length > 1 ? `翻开过去的一页，${remain[0].when}` : `当一段故事结束的时候，我们总会想起它的开头`
          )
        } else {
          sheet.setAttribute('aria-hidden', 'true')
        }
      })

      const top = sheets[0]
      if (!top) return

      const tear = () => {
        if (remain.length <= 1 || tearing) return
        tearing = true
        const finish = () => {
          cursor += 1
          tearing = false
          render()
        }
        if (reduceMotion) {
          finish()
          return
        }
        top.classList.add('is-tearing')
        top.addEventListener('animationend', finish, { once: true })
      }

      top.addEventListener('click', event => {
        if (event.target.closest('a')) return
        tear()
      })
      top.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        tear()
      })
    }

    render()
  }

  const DEFAULT_COVERS = ['/img/shenzi.jpg', '/img/ke.jpg']

  const hasSpecifiedImage = el => {
    if (el.matches('img[src]')) {
      const src = (el.getAttribute('src') || '').trim()
      if (src && !/friend_404|deflaut|default-bg/i.test(src)) return true
    }
    const style = el.getAttribute('style') || ''
    const urls = [...style.matchAll(/url\(\s*(['"]?)([^)'"]+?)\1\s*\)/gi)].map(m => m[2].trim())
    return urls.some(url => url && url !== 'none' && !url.startsWith('var('))
  }

  const applyCoverDefaults = () => {
    const header = document.getElementById('page-header')
    if (header && header.classList.contains('post-bg') && !hasSpecifiedImage(header)) {
      header.style.backgroundImage = 'url(/img/shenzi.jpg)'
    }

    const paintList = selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (hasSpecifiedImage(el)) return
        el.classList.add('cover-fallback')
        el.style.backgroundImage = `url(${DEFAULT_COVERS[i % 2]})`
        el.style.backgroundSize = 'cover'
        el.style.backgroundPosition = 'center'
      })
    }

    paintList('.relatedPosts-list .cover')
    paintList('#pagination.pagination-post .cover')
  }

  const boot = () => {
    document.querySelectorAll('.card-waymark').forEach(mount)
    document.querySelectorAll('#footer .copyright').forEach(el => {
      el.innerHTML = '&copy;2022 - 2026 By 旅人'
    })
    applyCoverDefaults()
  }

  const copyText = async text => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (_) {
      const input = document.createElement('textarea')
      input.value = text
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.left = '-9999px'
      document.body.appendChild(input)
      input.select()
      const ok = document.execCommand('copy')
      input.remove()
      return ok
    }
  }

  document.addEventListener('click', async event => {
    const btn = event.target.closest('[data-copy]')
    if (!btn) return
    event.preventDefault()
    const text = btn.getAttribute('data-copy')
    if (!text) return
    const ok = await copyText(text)
    if (!ok) return
    const original = btn.dataset.label || btn.textContent
    btn.dataset.label = original
    btn.textContent = '已复制'
    window.setTimeout(() => {
      btn.textContent = original
    }, 1400)
  })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true })
  } else {
    boot()
  }
  document.addEventListener('pjax:complete', applyCoverDefaults)
})()
