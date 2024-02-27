#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Smoothly interpolate between the grid points
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    // Randomly generate gradients
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Interpolate the gradients
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 getCausticColor(vec2 st) {
    float causticIntensity = 0.1;
    float frequency = 7.0;
    float amplitude = 0.08;

    for (int i = 0; i < 8; i++) {
        float rand = random(vec2(float(i), u_time));
        float n = noise(vec2(st.x * frequency, st.y * frequency + rand));
        causticIntensity += amplitude * n / float(i + 1);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    vec3 waterColor = vec3(0.2, 0.4, 0.6);
    vec3 causticColor = vec3(0.8, 0.9, 1.0);
    return mix(waterColor, causticColor, causticIntensity);
}

vec3 getBlockColor(vec2 st, vec2 blockSize, vec3 lightColor, vec2 lightPos) {
    vec2 blockCoords = fract(st / blockSize) - 0.5;
    float distanceToLight = length(blockCoords - lightPos);
    float lightIntensity = 1.0 / (distanceToLight * distanceToLight);

    return lightIntensity * lightColor;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.y *= u_resolution.y / u_resolution.x;

    vec3 causticColor = getCausticColor(st);

    // Grid properties
    vec2 gridSize = vec2(1.3, 1.3);
    vec2 blockSize = vec2(0.05, 0.05);
    vec3 lightColor = vec3(0.3, 0.8, 0.5);

    // Calculate time-based animation
    float animationSpeed = 0.0;
    float timeOffset = u_time * animationSpeed;

    // Calculate the position of each block
    vec2 blockPos = fract(st * gridSize - vec2(1.2, 1.2) + vec2(timeOffset, timeOffset));
    
    // Calculate light reflection from each block in the grid
    vec3 blockColor = getBlockColor(blockPos, blockSize, lightColor, blockPos);

    // Combine block colors and caustic effect
    vec3 finalColor = mix(blockColor, causticColor, 3.7);

    gl_FragColor = vec4(finalColor, 1.0);
}
