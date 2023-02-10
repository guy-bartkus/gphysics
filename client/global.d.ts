export {};

declare global {
    declare module '*.glsl';
    type PolarityType = 'ERB' | 'PRB'; //Electron Reflective Bit or Proton Reflective Bit
    type Color = [number, number, number];
}