#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  // Add some animation based on time
  float displacement = sin(time) * 1.1;
  vec2 distortedUV = vec2(uv.x + displacement, uv.y);
  
  // Create a color gradient using UV coordinates
  vec3 color = vec3(distortedUV.x, distortedUV.y, 0.5);
  
  // Add some noise for a textured effect
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += vec3(noise);
  
  // Apply some pulsating effect
  float pulse = 0.5 + 0.5 * abs(sin(time * 2.0));
  color *= pulse;
  
  // Convert color to black and white
  float average = (color.r + color.g + color.b) / 3.0;
  vec3 blackWhite = vec3(average);
  
  gl_FragColor = vec4(blackWhite, 1.0);
}
