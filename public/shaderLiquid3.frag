#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Function to generate pseudo-random numbers based on input coordinates
vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

// 2D Perlin noise function
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = dot(random2(i), f);
    float b = dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    vec2 u = f*f*(3.0 - 2.0*f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st *= 5.0; // Increasing the scale to make the noise pattern more visible
    float n = 0.5 * noise(st + time * 0.1) + 0.5; // Normalizing and making the noise evolve over time
    vec3 color = vec3(n * 0.5, n * 0.7, n * 0.3); // Mossy green palette, adjust brightness if needed
    gl_FragColor = vec4(color, 1.0); // Output the color
}
