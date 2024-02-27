#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(257.7356, 334.85644)))* 95.);
}

float noise (in vec2 st, float t) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(1.-2.*f);
    float seed = t * .00002;

    return mix(mix(random(i + seed),random(i+vec2(7.0,28.0) + seed),u.x),
               mix(random(i+vec2(123.,123.0) + seed),random(i+vec2(1.0,1.0) + seed),u.x),u.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // Generate animated TV noise
    float noiseValue = noise(st*15.0, u_time);
    noiseValue *= 2.5;
    noiseValue -=0.8;

    // Add color to noise
    vec3 color = vec3(0.1, 0.1, 0.9) + noiseValue*vec3(.9, 0.9, 0.9);

    // Output final color
    gl_FragColor = vec4(color, 1.0);
}
