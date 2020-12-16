// Type definitions for retry
// Project: retry
// Definitions by: j3ddesign <https://github.com/j3ddesign>

export as namespace retry;

interface TimeoutOps {
  retries?: number;
  factor?: number;
  minTimeout?: number;
  maxTimeout?: number;
  randomize?: boolean;
}

interface OperationArgs extends TimeoutOps {
  forever?: boolean;
  unref?: boolean;
}

interface AttemptTimeoutOps {
  timeout?: number;
  cb?: () => any;
}

interface Operation {
  attempt: (cb: (currentAttempts: () => number) => any, timeoutOps?: AttemptTimeoutOps) => void;
  attempts: () => number;
  retry: (error: any) => boolean;
  stop: () => void;
}

export function operation(args?: OperationArgs): Operation;

export function timeouts(args: TimeoutOps[]): any[];
export function timeouts(args: TimeoutOps): number[];

export function createTimeout(attempt: number, opts?: TimeoutOps): number;

export function wrap(obj: any, options?: OperationArgs, methodNames?: string[]): void;
