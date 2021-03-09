declare module 'match-all' {
  interface Result {
    input: string;
    regex: RegExp;
    next: void;
    toArray: () => any[];
    reset: void;
  }
  export default function matchAll(s: string, r: RegExp): Result;
}
