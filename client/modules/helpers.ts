import { Vec2 } from './math';

export const radiansToDegrees = (radians: number): number => {
    return radians * 180 / Math.PI;
}

export const degreesToRadians = (degrees: number): number => {
    return degrees * Math.PI / 180;
}

// a clamp function that returns a number between min and max; whole number
export const randInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const randFloat = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}