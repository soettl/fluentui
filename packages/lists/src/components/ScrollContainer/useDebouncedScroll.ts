import { useRef } from 'react';

const NO_TIMEOUT_PENDING_ID = -1;

export function useDebouncedScroll(callback: (scrollX: number, scrollY: number) => void): [(event: Event) => void, () => void] {
  const timeoutId = useRef(NO_TIMEOUT_PENDING_ID);

  let scrollX: number | undefined;
  let scrollY: number | undefined;

  return [
    (event: Event) => {
      // tslint:disable-next-line:no-any
      ({ scrollLeft: scrollX, scrollTop: scrollY } = ((event as any) as React.UIEvent<HTMLDivElement>).currentTarget);

      if (timeoutId.current !== NO_TIMEOUT_PENDING_ID) {
        return;
      }

      timeoutId.current = window.requestAnimationFrame(() => {
        callback(scrollX!, scrollY!);

        timeoutId.current = NO_TIMEOUT_PENDING_ID;
      });
    },
    () => {
      if (timeoutId.current !== NO_TIMEOUT_PENDING_ID) {
        window.cancelAnimationFrame(timeoutId.current);
      }
    }
  ];
}
