#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(32876301.98,21378.233))) * 43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  // Define the grid parameters
  float squareSize = 0.5;
  float spaceBetween = 0.02;
  vec2 gridOffset = vec2(0.0, 0.0);
  vec2 gridCount = vec2(2.0, 2.0);

  // Calculate the size of each cell in the grid
  vec2 cellSize = vec2((1.0 - spaceBetween * (gridCount.x - 1.0)) / gridCount.x,
                       (1.0 - spaceBetween * (gridCount.y - 1.0)) / gridCount.y);

  // Calculate the position of the current cell in the grid
  vec2 cellPos = vec2(floor(st / cellSize));

  // Calculate the position of the square within the current cell
  vec2 squarePos = (st - cellPos * cellSize) / cellSize;

  // Offset the grid to center it on the screen
  squarePos -= vec2(0.5);
  cellPos -= vec2(0.5);

  // Add noise to the animation of each square
  vec2 noiseOffset = vec2(random(cellPos), random(cellPos + vec2(0.1)));
  squarePos += vec2(sin(squarePos.x * 100.0 - noiseOffset.x * 1.0 + u_time * 1.0),
                    sin(squarePos.y * 32.0 - noiseOffset.y * 1. + u_time * 1.0)) * 0.5;

  // Rotate the square around its center
  float angle = atan(squarePos.y, squarePos.x) + u_time;
  squarePos = vec2(length(squarePos) * cos(angle), length(squarePos) * sin(angle));

  // Determine the color of the square
  vec3 color = vec3(1.0);
  if (sin(angle) > 0.0) {
    color = vec3(0.0, 0.0, 0.);
  } else {
    color = vec3(1.0, 1.0, 1.0);
  }

  // Calculate the distance to the mouse position
  float mouseDist = length((st - u_mouse) / u_resolution);

  // Move the squares if the mouse is close to them
  squarePos += vec2(sin(u_time * 90.0 + cellPos.x * 5.0) * 0.05,
                    cos(u_time * 90.0 + cellPos.y * 5.0) * 0.05) * smoothstep(0.1, 0.05, mouseDist);

  // Determine if the current pixel should be colored or not
  float colored = step(length(squarePos), squareSize / 2.0);

  // Output the final color
  gl_FragColor = vec4(color / colored, 1.0);
}
