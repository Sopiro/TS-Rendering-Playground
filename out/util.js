import { Matrix3, Vector2 } from "./math.js";
export function toFixed(value, limit = 1e-13) {
    return Math.round(value / limit) * limit;
}
// Linearly combine(interpolate) the vector using weights u, v
export function lerpVector(a, b, uv) {
    // return a.mul(uv.u).add(b.mul(uv.v));
    return new Vector2(a.x * uv.u + b.x * uv.v, a.y * uv.u + b.y * uv.v);
}
export function random(left = -1, right = 1) {
    if (left > right) {
        let tmp = right;
        right = left;
        left = tmp;
    }
    let range = right - left;
    return Math.random() * range + left;
}
export function clamp(value, min, max) {
    // return Math.max(min, Math.min(value, max));
    if (value < min)
        return min;
    else if (value > max)
        return max;
    else
        return value;
}
export function cross(scalar, vector) {
    return new Vector2(-scalar * vector.y, scalar * vector.x);
}
export function calculateBoxInertia(width, height, mass) {
    return (width * width + height * height) * mass / 12.0;
}
export function calculateCircleInertia(radius, mass) {
    return mass * radius * radius / 2.0;
}
// This function assumes the origin is the rotation axis
export function calculateConvexPolygonInertia(vertices, mass, area = -1) {
    let inertia = 0;
    let count = vertices.length;
    if (area <= 0) {
        area = 0;
        for (let i = 0; i < count; i++) {
            let v1 = vertices[i];
            let v2 = vertices[(i + 1) % count];
            area += Math.abs(v1.cross(v2));
        }
        area *= 0.5;
    }
    for (let i = 0; i < count; i++) {
        let v1 = vertices[i];
        let v2 = vertices[(i + 1) % count];
        let l1 = v1.length;
        let l2 = v2.length;
        let beta = Math.acos(v1.dot(v2) / (l1 * l2)) / 2;
        let partialMass = (Math.abs(v1.cross(v2)) / 2.0) / area * mass;
        inertia += 0.5 * partialMass * l1 * l2 * (1 - 2.0 / 3.0 * Math.sin(beta) * Math.sin(beta));
    }
    return inertia;
}
// Cantor pairing function, ((N, N) -> N) mapping function
// https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
export function make_pair_natural(a, b) {
    return (a + b) * (a + b + 1) / 2 + b;
}
// Reverse version of pairing function
// this guarantees initial pairing order
export function separate_pair(p) {
    let w = Math.floor((Math.sqrt(8 * p + 1) - 1) / 2.0);
    let t = (w * w + w) / 2.0;
    let y = p - t;
    let x = w - y;
    return { p1: x, p2: y };
}
export function squared_distance(a, b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}
export function map(v, left, right, min, max) {
    const per = (v - left) / (right - left);
    return lerp(min, max, per);
}
export function lerp(left, right, per) {
    return left + (right - left) * per;
}
export function mid(a, b) {
    return new Vector2((a.x + b.x) / 2.0, (a.y + b.y) / 2.0);
}
// Create a 2D orthographic projection matrix
export function orth(left, right, bottom, top) {
    let res = new Matrix3();
    // Scale
    res.m00 = 2.0 / (right - left);
    res.m11 = 2.0 / (top - bottom);
    // Translation
    res.m02 = -(right + left) / (right - left);
    res.m12 = -(top + bottom) / (top - bottom);
    return res;
}
// Create a viewport transform matrix
export function viewport(width, height, xStart = 0, yStart = 0) {
    let res = new Matrix3();
    // Scale
    res.m00 = width / 2.0;
    res.m11 = height / 2.0;
    // Translation
    res.m02 = xStart + width / 2.0;
    res.m12 = yStart + height / 2.0;
    return res;
}
export function assert(...test) {
    for (let i = 0; i < test.length; i++)
        if (!test[i])
            throw new Error("Assertion failed");
}
