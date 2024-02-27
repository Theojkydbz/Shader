#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float fractalNoise(vec2 p) {
  float f = 1.0;
  float s = 1.0;
  for (int i = 0; i < 4; i++) {
    f += sin(s * p.x + u_time) * cos(s * p.y + u_time);
    s *= 2.0;
    p *= 2.0;
  }
  return f;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 grid = vec2(200.0, 200.0);
  vec2 cell = vec2(1.0 / grid.x, 1.0 / grid.y);
  vec2 p = fract(st * grid) / cell;
  vec2 center = (floor(st * grid) + 0.5 * cell) / grid;
  float dist = length(u_mouse - center * u_resolution);
  float scale = mix(3.0, 2.0, smoothstep(500.0, 700.0, dist));
  vec2 offset = vec2(fractalNoise(center * scale), fractalNoise(vec2(center.y, center.x) * scale));
  vec2 uv = fract(p + offset * 0.2);
  float shape = step(uv.x, 1.) * step(1.0 - uv.x, 0.8) * step(uv.y, 9.) * step(.9 - uv.y, 6.9);
  vec3 color = mix(vec3(1.0), vec3(0.0), shape);
  gl_FragColor = vec4(color, 1.0);
}
