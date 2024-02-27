#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 getColor(vec2 st) {
    vec3 color1 = vec3(0.3, 0.7, 0.9);
    vec3 color2 = vec3(0.9, 0.2, 0.4);
    vec3 color3 = vec3(0.8, 0.9, 0.2);
    
    vec3 blend1 = mix(color1, color2, st.x);
    vec3 blend2 = mix(blend1, color3, st.y);
    
    return blend2;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // Grid properties
    float gridSize = 200.0;
    float circleSize = 0.04;

    // Calculate the position in the grid
    vec2 gridPos = floor(st * gridSize) / gridSize;

    // Calculate the distance to the center of the grid cell
    vec2 cellCenter = gridPos + 0.5 / gridSize;
    float dist = length(st - cellCenter);

    // Calculate the circle shape
    float circleShape = smoothstep(circleSize - 0.005, circleSize + 0.005, dist);

    // Get color based on position
    vec3 color = getColor(st);

    gl_FragColor = vec4(color * circleShape, 1.0);
}
