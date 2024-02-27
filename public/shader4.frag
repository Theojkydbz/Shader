#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D uSampler;


const float PARTICLE_SIZE = 1.;
const float FLOWER_SIZE = .1;
const float BLOOM_INTENSITY = 1.0;
const float NOISE_SCALE = 200.;
const vec3 BACKGROUND_COLOR = vec3(1., 1., 1.);
const vec3 FLOWER_COLOR = vec3(1., 1., 1.);
const vec3 POLLEN_COLOR = vec3(1.0, 1., 1.);
const vec3 BLOOM_COLOR = vec3(1.0, 1.0, 1.0);
const vec3 GRASS_COLOR = vec3(1., 1., 1.);

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(random(i + vec2(1.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
               mix(random(i + vec2(1.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
    // Calculate coordinates and time
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 beePos = vec2(1.1, 0.1);
    float time = u_time * 10.;

    // Calculate noise value for background terrain
    float noiseVal = noise(st * NOISE_SCALE + time);

    // Set background color based on noise value
    vec3 backgroundColor = mix(vec3(.1, .1, .1), GRASS_COLOR, pow(noiseVal, .14));

    // Render background terrain
    gl_FragColor = vec4(backgroundColor, 1.0);

    // Generate and render pollen particles and flowers with bloom effect
    for (float i = 0.0; i < 20.0; i++) {
        vec2 particlePos = beePos + vec2(random(vec2(i, time)), random(vec2(time, i)));
        float dist = distance(st, particlePos);
        if (dist < PARTICLE_SIZE) {
            vec3 pollenColor = mix(FLOWER_COLOR, POLLEN_COLOR, pow(dist / PARTICLE_SIZE, 2.0));
            gl_FragColor.rgb += pollenColor;
        }
        if (dist < FLOWER_SIZE) {
            vec3 bloomColor = BLOOM_COLOR * pow((FLOWER_SIZE - dist) / FLOWER_SIZE, BLOOM_INTENSITY);
            gl_FragColor.rgb += bloomColor;
        }
    }
    // Add bee and its movement
    vec2 beeOffset = vec2(sin(time), cos(time)) * 0.1;
    vec2 beeDir = normalize(vec2(0.5, 0.5) + beeOffset - beePos);
    beePos += beeDir * 0.005;

    // Generate and render flowers
    for (float i = 0.0; i < 100.0; i++) {
    vec2 flowerPos = vec2(random(vec2(i, time)), random(vec2(time, i)));
    vec3 flowerColor = mix(FLOWER_COLOR, POLLEN_COLOR, random(flowerPos));
    float dist = distance(st, flowerPos);
    if (dist < FLOWER_SIZE) {
    vec3 bloomColor = BLOOM_COLOR * pow((FLOWER_SIZE - dist) / FLOWER_SIZE, BLOOM_INTENSITY);
    gl_FragColor.rgb += bloomColor;
    gl_FragColor.rgb += flowerColor;
    }
    }

    // Render honeybee
    for (float i = 0.0; i < 30.0; i++) {
    vec2 beeParticlePos = beePos + vec2(random(vec2(i, time)), random(vec2(time, i)));
    float dist = distance(st, beeParticlePos);
    if (dist < PARTICLE_SIZE) {
    vec3 beeColor = mix(FLOWER_COLOR, POLLEN_COLOR, pow(dist / PARTICLE_SIZE, 2.0));
    gl_FragColor.rgb += beeColor;
    }
    }

    // Render grass on top of the background terrain
    float grass = mix(0.3, 0.9, pow(noiseVal, 3.0));
    gl_FragColor.rgb = mix(backgroundColor, GRASS_COLOR, grass);

    // Add motion blur effect
    float blurAmount = 0.001;
    vec4 colorSum = gl_FragColor;
    for (float i = 1.0; i < 10.0; i++) {
    colorSum += texture2D(uSampler, gl_FragCoord.xy/u_resolution.xy - beeDir * i * blurAmount);
    }
    gl_FragColor = colorSum / 10.0;
}