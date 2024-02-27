#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Define the grid parameters
    float circleSize = .1;
    float spaceBetween = 0.;
    vec2 gridOffset = vec2(0.2, 0.2);
    vec2 gridCount = vec2(90.0, 90.0);

    // Calculate the size of each cell in the grid
    vec2 cellSize = vec2((1.0 - spaceBetween * (gridCount.x - 1.0)) / gridCount.x,
                         (1.0 - spaceBetween * (gridCount.y - 1.0)) / gridCount.y);

    // Calculate the position of the current cell in the grid
    vec2 cellPos = vec2(floor(st / cellSize));

    // Calculate the position of the circle within the current cell
    vec2 circlePos = (st - cellPos * cellSize) / cellSize;

    // Offset the grid to center it on the screen
    circlePos -= vec2(0.5);
    cellPos -= vec2(0.9);

    // Add noise to the animation of each circle
    vec2 noiseOffset = vec2(random(cellPos), random(cellPos + vec2(1.0)));
    circlePos += vec2(sin(circlePos.x * 10.0 + noiseOffset.x * 10.0 + u_time * 2.0),
                      sin(circlePos.y * 10.0 + noiseOffset.y * 10.0 + u_time * 2.0)) * 0.1;

    // Calculate the distance to the center of the circle
    float dist = length(circlePos);

    // Determine if the current pixel should be black or white
    float black = step(dist, circleSize / 0.4);

    // Output the final color
    gl_FragColor = vec4(vec3(1.0 - black), 1.0);
}