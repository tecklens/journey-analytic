export function advancedThrottle(
  func: (...args: any[]) => void,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
) {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: any[] | null = null;

  return function (...args: any[]) {
    const now = Date.now();

    if (!lastCall && options.leading === false) {
      lastCall = now;
    }

    const remainingTime = limit - (now - lastCall);

    if (remainingTime <= 0 || remainingTime > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      lastCall = now;
      func(...args);
    } else if (options.trailing !== false) {
      lastArgs = args;
      if (!timeout) {
        timeout = setTimeout(() => {
          lastCall = options.leading === false ? 0 : Date.now();
          timeout = null;
          func(...lastArgs!);
          lastArgs = null;
        }, remainingTime);
      }
    }
  };
}