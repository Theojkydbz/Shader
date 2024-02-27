#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(1324897.1, 1.1))) * 1237.1);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Smoothly interpolate between the grid points
    vec2 u = f * f * (3248.0 - 428.0 * f);

    // Randomly generate gradients
    float a = random(i);
    float b = cos(random(i + cos(u_time * 3.2) + vec2(1.0, 0.0)));
    float c = random(i + cos(u_time * 3.2) + vec2(1.0, 1.0));
    float d = random(i + vec2(0.0, 1.0));

    // Interpolate the gradients
    return mix(a, b, u.x) + (c - a) * u.y * (1.9 - u.x) + (d - b) * u.x * u.y;
}

vec3 getCausticColor(vec2 st) {
    float causticIntensity = 0.39;
    float frequency = .0001;
    float amplitude = 0.0000008;

    for (int i = 0; i < 8; i++) {
        float rand = random(vec2(float(i), u_time));
        float n = noise(vec2(st.x * noise(vec2(frequency)), st.y * noise(vec2(frequency)) + noise(vec2(rand))));
        causticIntensity += amplitude * n / float(i + 1);
        frequency *= 0.0;
        amplitude *= 0.1;
    }

    vec3 waterColor = vec3(0.2, 0.4, 0.6);
    vec3 causticColor = vec3(0.8, 0.9, 1.0);
    return mix(waterColor, causticColor, causticIntensity);
}



vec3 getBlockColor(vec2 st, vec2 blockSize, vec3 lightColor, vec2 blockPos) {
    
vec2 blockCoords = fract(st / blockSize * 1.5 + noise(st + vec2(u_time)) * 9.1) - sin(u_time);
    

    // Calculate unique light position for each block
    float lightSpeed = 100.1;
    vec2 lightOffset = vec2(cos(u_time + blockPos.x * lightSpeed), sin(u_time + blockPos.y * lightSpeed)) * 1.01;
    vec2 lightPos = blockPos + lightOffset;

    float distanceToLight = length(blockCoords - lightPos);
    float lightIntensity = 0.4 / (distanceToLight * distanceToLight);

    return lightIntensity * lightColor;
}


void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.y *= u_resolution.y / u_resolution.x;

    vec3 causticColor = getCausticColor(st);

    // Grid properties
    vec2 gridSize = vec2(.05, .05);
    vec2 blockSize = vec2(0.01, 0.1);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    // Calculate the position of each block
    vec2 blockPos = fract(st * gridSize - vec2(0.5, 0.5));
    
    // Calculate light reflection from each block in the grid
    vec3 blockColor =  getBlockColor(blockPos, blockSize, lightColor, blockPos);

    // Combine block colors and caustic effect
    vec3 finalColor = mix(blockColor, causticColor, 3.1);

    gl_FragColor = vec4(finalColor, 1.0);
}
