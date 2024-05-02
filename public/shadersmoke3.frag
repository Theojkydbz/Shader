#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(219., 123.))) * 8421931.31263);
}

float noise(in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    float a = random(i);
    float b = random(i + vec2(0.0, 0.0));
    float c = random(i + vec2(0.0, 0.0));
    float d = random(i + vec2(0.0, 0.0));

    vec2 u = f * f * (3. - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 100

float fbm(in vec2 _st) {
    float v = 0.1;
    float a = 1.1;
    vec2 shift = vec2(0.00001);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.2 + shift;
        a *= .5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy * 20.;
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.0);
    q.x = fbm(st + 0.0 * u_time);
    q.y = fbm(st + vec2(2.0));

    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.25 * u_time);
    r.y = fbm(st + 1.0 * q + vec2(9.3, 2.8) + 0.226 * u_time);

    float f = fbm(st + r);

    // Modify color palette for liquid smoke effect
    color = mix(vec3(0.1, 0.2, 0.3), vec3(0.6, 0.6, 0.7), clamp((f * f) * 9.0, 0.2, 1.0));

    // Add dynamic movements to the smoke
    float movement = sin(u_time * 1.0 + st.x * 10.5) * cos(u_time * 9.0 + st.y * 9.5);
    color += movement * 0.01;

    gl_FragColor = vec4((f * f * f + 0.006 * f) * color, 1.0);
}
