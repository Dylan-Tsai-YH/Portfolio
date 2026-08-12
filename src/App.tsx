import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Mail,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react'
import { achievements, assetUrl, credentials, experience, focusAreas, profile, stats } from './content'

const navItems = [
  { label: 'Profile', href: '#profile' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const shellRef = useRef<HTMLDivElement>(null)
  const gridCanvasRef = useRef<HTMLCanvasElement>(null)
  const gridPointerRef = useRef({ x: 0.62, y: 0.34 })

  const closeMenu = () => setMenuOpen(false)
  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      frame = 0
      const availableScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(availableScroll > 0 ? window.scrollY / availableScroll : 0)
    }
    const scheduleProgress = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', scheduleProgress, { passive: true })
    window.addEventListener('resize', scheduleProgress)
    return () => {
      window.removeEventListener('scroll', scheduleProgress)
      window.removeEventListener('resize', scheduleProgress)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
  useEffect(() => {
    const canvas = gridCanvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let width = 0
    let height = 0
    let pixelRatio = 1
    const cursor = { ...gridPointerRef.current }

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const drawGrid = (time: number, intensity: number, warped: boolean) => {
      const spacing = Math.max(42, Math.min(58, width / 24))
      const sample = 12
      const pointerX = cursor.x * width
      const pointerY = cursor.y * height
      const warpRadius = Math.min(300, Math.max(190, width * 0.22))
      const distort = (x: number, y: number) => {
        if (!warped) return { x, y }
        const offsetX = x - pointerX
        const offsetY = y - pointerY
        const distance = Math.hypot(offsetX, offsetY)
        const influence = Math.exp(-(distance * distance) / (warpRadius * warpRadius))
        const directionX = distance ? offsetX / distance : 0
        const directionY = distance ? offsetY / distance : 0
        const pulse = Math.sin(distance * 0.055 - time * 0.002) * influence * 4
        return {
          x: x + directionX * influence * 25 + pulse,
          y: y + directionY * influence * 25 + pulse,
        }
      }

      context.strokeStyle = `rgba(109, 224, 210, ${intensity})`
      context.lineWidth = warped ? 1.1 : 0.7
      for (let x = -spacing; x <= width + spacing; x += spacing) {
        context.beginPath()
        for (let y = -spacing; y <= height + spacing; y += sample) {
          const point = distort(x, y)
          if (y <= -spacing) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.stroke()
      }
      for (let y = -spacing; y <= height + spacing; y += spacing) {
        context.beginPath()
        for (let x = -spacing; x <= width + spacing; x += sample) {
          const point = distort(x, y)
          if (x <= -spacing) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.stroke()
      }
    }

    const render = (time: number) => {
      frame = 0
      if (reduceMotion.matches) return
      const target = gridPointerRef.current
      cursor.x += (target.x - cursor.x) * 0.11
      cursor.y += (target.y - cursor.y) * 0.11
      context.clearRect(0, 0, width, height)
      const glow = context.createRadialGradient(cursor.x * width, cursor.y * height, 0, cursor.x * width, cursor.y * height, Math.min(360, width * 0.28))
      glow.addColorStop(0, 'rgba(84, 242, 211, 0.13)')
      glow.addColorStop(0.42, 'rgba(77, 178, 220, 0.06)')
      glow.addColorStop(1, 'rgba(77, 178, 220, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)
      drawGrid(time, 0.085, false)
      context.save()
      context.beginPath()
      context.arc(cursor.x * width, cursor.y * height, Math.min(290, Math.max(190, width * 0.2)), 0, Math.PI * 2)
      context.clip()
      drawGrid(time, 0.42, true)
      context.restore()
      frame = window.requestAnimationFrame(render)
    }

    const startMotion = () => {
      if (!reduceMotion.matches && !frame) frame = window.requestAnimationFrame(render)
    }
    const stopMotion = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }
    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stopMotion()
        context.clearRect(0, 0, width, height)
      } else startMotion()
    }

    resizeCanvas()
    startMotion()
    window.addEventListener('resize', resizeCanvas)
    reduceMotion.addEventListener('change', onMotionChange)
    return () => {
      stopMotion()
      window.removeEventListener('resize', resizeCanvas)
      reduceMotion.removeEventListener('change', onMotionChange)
    }
  }, [])
  const handleBackgroundPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const x = Math.min(Math.max(event.clientX / window.innerWidth, 0), 1) * 100
    const y = Math.min(Math.max(event.clientY / window.innerHeight, 0), 1) * 100
    gridPointerRef.current = { x: x / 100, y: y / 100 }
    shellRef.current?.style.setProperty('--cursor-x', `${x}%`)
    shellRef.current?.style.setProperty('--cursor-y', `${y}%`)
    shellRef.current?.style.setProperty('--pointer-shift-x', `${(x / 100 - 0.5) * 26}px`)
    shellRef.current?.style.setProperty('--pointer-shift-y', `${(y / 100 - 0.5) * 18}px`)
  }
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--pointer-x', `${(horizontal + 0.5) * 100}%`)
    event.currentTarget.style.setProperty('--pointer-y', `${(vertical + 0.5) * 100}%`)
    event.currentTarget.style.setProperty('--tilt-x', `${vertical * -4}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${horizontal * 4}deg`)
  }
  const resetPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty('--tilt-x')
    event.currentTarget.style.removeProperty('--tilt-y')
  }

  return (
    <div className="site-shell" ref={shellRef} onPointerMove={handleBackgroundPointerMove}>
      <canvas className="ambient-canvas" ref={gridCanvasRef} aria-hidden="true" />
      <div className="ambient-layer" aria-hidden="true">
        <span className="ambient-orb orb-cyan" />
        <span className="ambient-orb orb-violet" />
        <span className="ambient-orb orb-blue" />
        <span className="ambient-grid" />
      </div>
      <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress})` }} /></div>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Dylan Tsai home" onClick={closeMenu}>
          <span className="wordmark-mark" aria-hidden="true">DT</span>
          <span>Dylan Tsai</span>
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav id="site-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
          ))}
          <a className="nav-contact" href={`mailto:${profile.email}`} onClick={closeMenu}>
            Get in touch <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section id="top" className="hero section-pad" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> {profile.location} · Cybersecurity student</p>
            <h1 id="hero-title">Learning to <span>protect</span> what matters.</h1>
            <p className="hero-intro">{profile.introduction}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#achievements">View achievements <ArrowDownRight size={18} aria-hidden="true" /></a>
              <a className="button button-quiet" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={16} aria-hidden="true" /></a>
            </div>
            <dl className="stats-grid" aria-label="Portfolio highlights">
              {stats.map((stat) => (
                <div key={stat.label} className="stat">
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="hero-visual" aria-label="Professional headshot of Dylan Tsai">
            <div className="visual-orbit orbit-one" aria-hidden="true" />
            <div className="visual-orbit orbit-two" aria-hidden="true" />
            <div className="portrait-frame">
              <img src={assetUrl('headshot.webp')} alt="Dylan Tsai in professional attire" />
            </div>
            <div className="identity-card">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>{profile.role}</span>
            </div>
          </div>
        </section>

        <section id="profile" className="profile-band section-pad" aria-labelledby="profile-title">
          <div className="section-intro motion-slide">
            <p className="eyebrow">Profile / 01</p>
            <h2 id="profile-title">A foundation built around curiosity, evidence, and clear thinking.</h2>
          </div>
          <div className="profile-details motion-scale">
            <p>Currently pursuing a <strong>{profile.programme}</strong> at {profile.school}. My interests sit at the intersection of blue-team operations, digital investigations, and ethical hacking.</p>
            <a className="text-link" href="#experience">Explore my experience <ChevronRight size={17} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="focus-section section-pad" aria-labelledby="focus-title">
          <div className="section-heading motion-slide">
            <div>
              <p className="eyebrow">Focus areas / 02</p>
              <h2 id="focus-title">Building range with intent.</h2>
            </div>
            <p className="section-note">Technical depth is a work in progress. I focus on learning deliberately, then applying concepts in challenges and team settings.</p>
          </div>
          <div className="focus-grid">
            {focusAreas.map((area) => (
              <article className="focus-card interactive-card motion-card" key={area.number} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
                <p className="card-number">{area.number}</p>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <ul className="tag-list" aria-label={`${area.title} skills`}>
                  {area.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="experience-section section-pad" aria-labelledby="experience-title">
          <div className="section-heading section-heading-split motion-sweep">
            <div>
              <p className="eyebrow">Experience / 03</p>
              <h2 id="experience-title">From the classroom to the cybersecurity community.</h2>
            </div>
            <BriefcaseBusiness className="heading-icon" size={36} strokeWidth={1.35} aria-hidden="true" />
          </div>
          <ol className="timeline">
            {experience.map((item) => (
              <li className="motion-timeline" key={`${item.period}-${item.title}`}>
                <p className="timeline-period">{item.period}</p>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p className="timeline-organisation">{item.organisation}</p>
                  <p>{item.description}</p>
                  <ul className="tag-list" aria-label={`${item.title} themes`}>
                    {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="achievements" className="achievements-section section-pad" aria-labelledby="achievements-title">
          <div className="section-heading motion-slide">
            <div>
              <p className="eyebrow">Selected achievements / 04</p>
              <h2 id="achievements-title">Results earned with a team.</h2>
            </div>
            <Award className="heading-icon" size={36} strokeWidth={1.35} aria-hidden="true" />
          </div>
          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <article className="achievement-card interactive-card motion-achievement" key={achievement.title} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
                <img src={achievement.image} alt={achievement.alt} />
                <div className="achievement-overlay" />
                <div className="achievement-content">
                  <p className="eyebrow">{achievement.label}</p>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  <span className="achievement-result"><Check size={16} aria-hidden="true" /> {achievement.result}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="credentials-section section-pad" aria-labelledby="credentials-title">
          <div className="credentials-intro motion-scale">
            <p className="eyebrow">Learning record / 05</p>
            <h2 id="credentials-title">A consistent commitment to the fundamentals.</h2>
            <p>Selected learning milestones are summarised here. Supporting records are available on request.</p>
          </div>
          <div className="credential-columns">
            {credentials.map((group) => (
              <article className="credential-group motion-credential" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => <li key={item}><span aria-hidden="true">/</span>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section section-pad" aria-labelledby="contact-title">
          <div className="motion-contact-left">
            <p className="eyebrow">Contact / 06</p>
            <h2 id="contact-title">Let’s build a safer digital world.</h2>
            <p>I am keen to learn from real teams and contribute with discipline, curiosity, and a growing technical foundation.</p>
          </div>
          <div className="contact-actions motion-contact-right">
            <a className="contact-email" href={`mailto:${profile.email}`}><Mail size={20} aria-hidden="true" />{profile.email}<ArrowUpRight size={20} aria-hidden="true" /></a>
            <a className="contact-linkedin" href={profile.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="footer-location"><GraduationCap size={15} aria-hidden="true" /> {profile.school}</span>
      </footer>
      <a className="scroll-top-button" href="#top" aria-label="Scroll to the top of the page">
        <ArrowUp size={18} aria-hidden="true" />
        <span>Top</span>
      </a>
    </div>
  )
}

export default App
