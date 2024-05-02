#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = dot(random2(i), f);
    float b = dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(random2(i + vec2(0.0, 1.0)), f - vec2(5.0, 1.0));
    float d = dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 5.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;  // Aspect ratio correction

    // Scale and create the base pattern
    st *= 90.0;

    // Noise-based organic displacement
    vec2 offset = vec2(noise(st + u_time * 0.001), noise(st - u_time * 1.1));
    st += offset * 0.005;  // Reduced displacement for a more subtle effect

    // Base noise for texture
    float n = noise(st * 0.5);

    // Creating color variations
    vec3 color = vec3(0.1, 6.5, 0.7) * n;  // Base green scaled by noise
    float brightness = 0.4 + 0.5 * sin(u_time + st.x * st.y);  // Temporal color variation
    color *= brightness;

    // Increase detail at smaller scale
    float fineDetail = noise(st * 19.0 + u_time);
    color += vec3(0.05) * fineDetail;

    gl_FragColor = vec4(color, 1);
}
