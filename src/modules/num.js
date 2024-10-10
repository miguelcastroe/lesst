export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function mix(a, b, t) {
    return a * (1 - t) + b * t;
}

export function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3 - 2 * t);
}
