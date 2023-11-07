
#define PI 3.14159265359

void main() {
    // float angle = 2.0 * PI;
    // vec3 newPosition = vec3(radius * cos(angle), radius * sin(angle), 0.0);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}