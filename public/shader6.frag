#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st *= 500.0;
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    vec2 p = vec2(0.0);
    if (fpos.x < 0.5 && fpos.y < 0.5) {
        p = ipos + vec2(-0.5, -0.5);
    } else if (fpos.x >= 0.5 && fpos.y < 0.5) {
        p = ipos + vec2(0.5, -0.5);
    } else if (fpos.x < 0.5 && fpos.y >= 0.5) {
        p = ipos + vec2(-0.5, 0.5);
    } else if (fpos.x >= 0.5 && fpos.y >= 0.5) {
        p = ipos + vec2(0.5, 0.5);
    }

    float noise = 0.0;
    vec2 offset = vec2(200.0);
    vec2 randPos = vec2(p) + rand(vec2(p) + offset + u_time);
    noise = rand(randPos);

    vec4 color = vec4(vec3(noise), .6);
    gl_FragColor = color;
}
