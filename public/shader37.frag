#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float halftonePattern(vec2 uv, float scale) {
    vec2 p = floor(uv * scale);
    vec2 f = fract(uv * scale);
    float rand = random2(p).x;
    return smoothstep(0.4, 0.5, f.x + rand);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    vec3 color = vec3(0.0);

    // Scale
    float scale = 150.0;

    // Calculate the position of the point in the grid
    vec2 gridPos = floor(st * scale) / scale;

    // Apply the Halftone Pattern noise formula
    float halftone = halftonePattern(gridPos, scale);
    color += halftone;

    // Add caustic effect
    float m_dist = halftone;
    float caustic = sin(u_time * 3.0 + m_dist * 10.0);
    color += caustic;

    gl_FragColor = vec4(color, 1.0);
}
