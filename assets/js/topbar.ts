/*
 * Small TS rewrite of topbar:
 *
 * @license MIT
 * topbar 1.0.0, 2021-01-06
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */

interface TopbarOpts {
  autoRun?: boolean
  barThickness?: number
  barColors?: Map<number, string>
  shadowBlur?: number
  shadowColor?: string
  className?: string | null
}

interface TopbarConfig {
  autoRun: boolean
  barThickness: number
  barColors: Map<number, string>
  shadowBlur: number
  shadowColor: string
  className: string | null
}

export class Topbar {
  private canvas: HTMLCanvasElement | null = null
  private showing: boolean = false
  private fadeTimerID: number | null = null
  private progressTimerID: number | null = null
  private currentProgress: number = 0

  private readonly config: TopbarConfig

  constructor(config: TopbarOpts) {
    this.config = {
      autoRun: true,
      barThickness: 3,
      barColors: new Map([
        [0, 'rgba(26,  188, 156, .9)'],
        [0.25, 'rgba(52,  152, 219, .9)'],
        [0.5, 'rgba(241, 196, 15,  .9)'],
        [0.75, 'rgba(230, 126, 34,  .9)'],
        [1.0, 'rgba(211, 84,  0,   .9)']
      ]),
      shadowBlur: 10,
      shadowColor: 'rgba(0,   0,   0,   .6)',
      className: null,
      ...config
    }
  }

  show() {
    if (this.showing) {
      return
    }
    this.showing = true
    if (this.fadeTimerID != null) {
      cancelAnimationFrame(this.fadeTimerID)
    }
    if (!this.canvas) {
      this.canvas = this.createCanvas()
    }
    this.canvas.style.opacity = '1'
    this.canvas.style.display = 'block'
    this.progress(0)

    if (this.config.autoRun) {
      const loop = () => {
        this.progressTimerID = requestAnimationFrame(loop)
        this.progress(
          '+' + 0.05 + Math.pow(1 - Math.sqrt(this.currentProgress), 2)
        )
      }

      loop()
    }
  }

  private loop() {
    this.progressTimerID = requestAnimationFrame(this.loop.bind(this))
    this.progress('+' + 0.05 + Math.pow(1 - Math.sqrt(this.currentProgress), 2))
  }

  private progress(): number | null
  private progress(to: number): number | null
  private progress(to: string): number | null
  private progress(to?: number | string): number | null {
    if (to == null) {
      return this.currentProgress
    }

    if (typeof to === 'string') {
      to =
        (to.indexOf('+') >= 0 || to.indexOf('-') >= 0
          ? this.currentProgress
          : 0) + parseFloat(to)
    }

    this.currentProgress = to > 1 ? 1 : to
    this.repaint()
    return this.currentProgress
  }

  hide() {
    if (!this.showing) {
      return
    }

    this.showing = false

    if (this.progressTimerID != null) {
      cancelAnimationFrame(this.progressTimerID)
      this.progressTimerID = null
    }

    const loop = () => {
      const progress = this.progress('+.1')
      if (progress && progress >= 1) {
        const opacity = parseFloat(this.canvas!.style.opacity) - 0.05
        this.canvas!.style.opacity = `${opacity}`

        if (opacity <= 0.05) {
          this.canvas!.style.display = 'none'
          this.fadeTimerID = null
          return
        }
      }

      this.fadeTimerID = requestAnimationFrame(loop)
    }

    loop()
  }

  private repaint() {
    if (!this.canvas) {
      return
    }

    this.canvas.width = window.innerWidth
    this.canvas.height = this.config.barThickness * 5

    const ctx = this.canvas.getContext('2d')
    if (!ctx) return
    ctx.shadowBlur = this.config.shadowBlur
    ctx.shadowColor = this.config.shadowColor

    const lineGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0)

    for (const [stop, color] of this.config.barColors)
      lineGradient.addColorStop(stop, color)

    ctx.lineWidth = this.config.barThickness
    ctx.beginPath()
    ctx.moveTo(0, this.config.barThickness / 2)
    ctx.lineTo(
      Math.ceil(this.currentProgress * this.canvas.width),
      this.config.barThickness / 2
    )
    ctx.strokeStyle = lineGradient
    ctx.stroke()
  }

  private createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.right = '0'
    canvas.style.left = '0'
    canvas.style.margin = '0'
    canvas.style.padding = '0'
    canvas.style.zIndex = '100_001'
    canvas.style.display = 'none'
    if (this.config.className) canvas.classList.add(this.config.className)
    document.body.appendChild(canvas)
    window.addEventListener('resize', this.repaint.bind(this), false)
    return canvas
  }
}
