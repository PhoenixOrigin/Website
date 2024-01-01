export const backgroundVertexShader = `#define PI 3.14159265359

uniform float u_time;
uniform float u_pointsize;
uniform float u_noise_amp_1;
uniform float u_noise_freq_1;
uniform float u_spd_modifier_1;
uniform float u_noise_amp_2;
uniform float u_noise_freq_2;
uniform float u_spd_modifier_2;

float random (in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

mat2 rotate2d(float angle){
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  gl_PointSize = u_pointsize;

  vec3 pos = position;
  pos.z += noise(pos.xy * u_noise_freq_1 + u_time * u_spd_modifier_1) * u_noise_amp_1;
  
  pos.z += noise(rotate2d(PI / 4.) * pos.yx * u_noise_freq_2 - u_time * u_spd_modifier_2 * 0.6) * u_noise_amp_2;

  vec4 mvm = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvm;
}`;

export const backgroundFragmentShader = `#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  vec3 color;
  vec3 color1 = vec3(0.98, 0.63, 0.61);
  vec3 color2 = vec3(0.80, 0.67, 0.90);
  vec3 color3 = vec3(0.49, 0.57, 0.91);

  if (st.y < 0.5) {
    color = mix(color1, color2, st.y * 2.0);
  } else {
    color = mix(color2, color3, (st.y - 0.5) * 2.0);
  }
  
  gl_FragColor = vec4(color, 1.0);
}
`;
