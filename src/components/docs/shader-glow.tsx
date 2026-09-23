import { useEffect, useRef } from 'react'

interface ShaderGlowProps {
  color?: [number, number, number]
  base?: [number, number, number]
  speed?: number
  className?: string
}

const defaultColor: [number, number, number] = [0.9, 0.34, 0.18]
const defaultBase: [number, number, number] = [0.063, 0.063, 0.063]

const vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentSource = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uBase;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.1, 9.7);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;
  float t = uTime;

  vec2 warp = vec2(
    fbm(p * 1.6 + vec2(t * 0.11, -t * 0.07)),
    fbm(p * 1.6 + vec2(-t * 0.09, t * 0.13) + 4.2)
  );
  float field = fbm(p * 1.2 + warp * 1.8 + t * 0.04);

  vec2 origin = vec2(0.05 + 0.08 * sin(t * 0.21), 1.02 + 0.06 * cos(t * 0.17));
  vec2 delta = uv - origin;
  delta.x *= uResolution.x / uResolution.y;
  float reach = length(delta) - field * 0.55;
  float glow = 1.0 - smoothstep(0.05, 0.95, reach);
  glow = pow(glow, 1.6);

  float core = 1.0 - smoothstep(0.0, 0.35, reach);
  vec3 color = mix(uBase, uColor, glow * 0.72);
  color = mix(color, mix(uColor, vec3(1.0), 0.2), core * 0.35);

  float grain = (hash(gl_FragCoord.xy + fract(t)) - 0.5) * 0.035;
  gl_FragColor = vec4(color + grain, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function ShaderGlow({
  color = defaultColor,
  base = defaultBase,
  speed = 1,
  className = '',
}: ShaderGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!canvas || !gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uTime = gl.getUniformLocation(program, 'uTime')
    gl.uniform3fv(gl.getUniformLocation(program, 'uColor'), color)
    gl.uniform3fv(gl.getUniformLocation(program, 'uBase'), base)

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let visible = true
    const start = performance.now()

    const draw = (now: number) => {
      gl.uniform1f(uTime, reducedMotion ? 8 : ((now - start) / 1000) * speed)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      draw(now)
      if (visible && !reducedMotion) frame = requestAnimationFrame(loop)
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible && !reducedMotion) frame = requestAnimationFrame(loop)
    })
    intersectionObserver.observe(canvas)

    resize()
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [color, base, speed])

  return (
    <canvas aria-hidden className={`pointer-events-none size-full ${className}`} ref={canvasRef} />
  )
}
