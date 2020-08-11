declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

declare module '*.json';

declare module '*.css';

declare module 'natural-compare-lite' {
  export default function (a: string, b: string): number;
}

declare module 'color-contrast' {
  export default function (a: string, b: string): number;
}
