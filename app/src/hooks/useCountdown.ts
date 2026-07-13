import { useEffect, useRef, useState } from 'react';

export function formatMs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface UseCountdownOptions {
  onDone?: () => void;
  warnBelowMs?: number;
}

interface UseCountdownResult {
  label: string;
  isWarning: boolean;
}

export function useCountdown(
  endsAt: number | null | undefined,
  { onDone, warnBelowMs = 20000 }: UseCountdownOptions = {}
): UseCountdownResult {
  const [label, setLabel] = useState('0:00');
  const [isWarning, setIsWarning] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!endsAt) {
      setLabel('0:00');
      setIsWarning(false);
      return;
    }

    let done = false;
    const tick = () => {
      const remaining = endsAt - Date.now();
      setLabel(formatMs(remaining));
      setIsWarning(remaining > 0 && remaining <= warnBelowMs);
      if (remaining <= 0 && !done) {
        done = true;
        clearInterval(handle);
        onDoneRef.current?.();
      }
    };

    tick();
    const handle = setInterval(tick, 200);
    return () => clearInterval(handle);
  }, [endsAt, warnBelowMs]);

  return { label, isWarning };
}
