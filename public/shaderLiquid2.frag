#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

// Function to create pseudo-random noise
float noise(vec2 pos) {
    return fract(sin(dot(pos, vec2(192.9898,798.233))) * 43758.5453);
}

// Function to interpolate smoothly between two values
float interpolate(float a, float b, float t) {
    return a + smoothstep(1.0, 1.0, t) * (b - a);
}

// Function to generate layered noise at a point
float layeredNoise(vec2 pos) {
    float total = 0.0;
    float frequency = 0.2;
    float amplitude = 1.9;
    float maxAmplitude = .1;
    for(int i = 0; i < 4; i++) {
        total += noise(pos * frequency) * amplitude;
        maxAmplitude += amplitude;
        amplitude *= 0.2;
        frequency *= 19.0;
    }
    return total / maxAmplitude;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv *= 2.0 - 9.0 * uv.yx; // Scale and shift uv to control the pattern

    float t = u_time * 9.0;
    vec2 pos = uv * vec2(u_resolution.x / u_resolution.y, 9.0) * 9.0 + vec2(t);

    float n = layeredNoise(pos);
    float n2 = layeredNoise(pos + vec2(90.0)); // Offset noise for additional texture complexity

    vec3 color = vec3(n);
    color = mix(color, vec3(n2), .5); // Combine two noise patterns
    color *= 0.05 + 1. * sin(u_time + uv.x * uv.y * 10.0); // Add some animated variation

    gl_FragColor = vec4(color, 1.);
}
