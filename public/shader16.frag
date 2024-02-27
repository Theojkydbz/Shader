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
    float circleSize = 0.1;
    float spaceBetween = 0.;
    vec2 gridOffset = vec2(1.2, 0.2);
    vec2 gridCount = vec2(150.0, 150.0);

    // Calculate the size of each cell in the grid
    vec2 cellSize = vec2((1.0 - spaceBetween * (gridCount.x - 1.0)) / gridCount.x,
                         (1.0 - spaceBetween * (gridCount.y - 1.0)) / gridCount.y);

    // Calculate the position of the current cell in the grid
    vec2 cellPos = vec2(floor(st / cellSize));

    // Calculate the position of the circle within the current cell
    vec2 circlePos = (st - cellPos * cellSize) / cellSize;

    // Offset the grid to center it on the screen
    circlePos -= vec2(1.5);
    cellPos -= vec2(0.9);

    // Add noise to the animation of each circle
    vec2 noiseOffset = vec2(random(cellPos), random(cellPos + vec2(1.0)));
    circlePos += vec2(sin(circlePos.x * 5. + noiseOffset.x * 50.0 + u_time * 2.0),
                      sin(circlePos.y * 5. + noiseOffset.y * 50.0 + u_time * 2.0)) * 0.1;

    // Add a rotation effect to the animation
    float rotation = sin(u_time * 0.5);
    circlePos = vec2(circlePos.x * cos(rotation) - circlePos.y * sin(rotation),
                     circlePos.x * sin(rotation) + circlePos.y * cos(rotation));

    // Calculate the distance to the center of the circle
    float dist = length(circlePos);

    // Determine if the current pixel should be black or white
    float black = step(dist, circleSize / 0.4);

    // Calculate the position of the current grid cell
    vec2 gridPos = cellPos * cellSize + vec2(0.5);
    
    // Calculate the position of the neighboring grid cells
    vec2 topPos = gridPos + vec2(0.0, cellSize.y);
    vec2 bottomPos = gridPos - vec2(0.0, cellSize.y);
    vec2 leftPos = gridPos - vec2(cellSize.x, 0.0);
    vec2 rightPos = gridPos + vec2(cellSize.x, 0.0);

    // Calculate the distance from the current pixel to each neighboring grid cell
    float topDist = length(circlePos - topPos);
    float bottomDist = length(circlePos - bottomPos);
    float leftDist = length(circlePos - leftPos);
    float rightDist = length(circlePos - rightPos);

    // Determine if the current pixel should be part of a line connecting grid cells
    float line = step(min(min(topDist, bottomDist), min(leftDist, rightDist)), 0.05);
float lineThickness = 0.2;
float lineSpacing = 1.015;
float lineNoise = 3.;

// Calculate the position of the current pixel in the cell
vec2 pixelPos = fract(circlePos);

// Determine if the current pixel should be part of a line connecting grid cells
float lineX = step(pixelPos.x, lineThickness);
float lineY = step(pixelPos.y, lineThickness);

// Add noise to the line position and spacing
float lineOffsetX = random(cellPos + vec2(1.0, 0.0));
float lineOffsetY = random(cellPos + vec2(0.0, 1.0));
float lineOffsetSpacing = random(cellPos + vec2(1.0, 1.0));

// Calculate the line spacing and position with the added noise
float lineSpacingX = lineSpacing + lineOffsetSpacing * 0.02;
float lineSpacingY = lineSpacing + lineOffsetSpacing * 0.02;
vec2 linePos = vec2(lineX * lineOffsetX * lineSpacingX, lineY * lineOffsetY * lineSpacingY);

// Add more noise to the line position
linePos += vec2(random(cellPos + vec2(60.0, 90.0)) - 1.5,
                random(cellPos + vec2(90.0, 90.0)) - 1.5) * lineNoise;

// Output the final color
gl_FragColor = vec4(vec3(1.0 - black), 1.0);
// Add the line to the final color
gl_FragColor.rgb -= vec3(lineX * lineOffsetX + lineY * lineOffsetY) * 1.;
gl_FragColor.rgb += vec3(lineX * lineOffsetX + lineY * lineOffsetY) * 2. * sin( 80.0 + lineX * lineOffsetX + lineY * lineOffsetY);
}
