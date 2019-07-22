import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useDebouncedTimeout } from './useDebouncedTimeout';
import { usePreviousValueRef } from './usePreviousValue';

import { Vector2D, ScrollDirection, Axis, IScrollContainerProps, IScrollContainerState } from './ScrollContainer.types';
import { useDebouncedScroll } from './useDebouncedScroll';

const SCROLL_DISTANCE_ORIGIN: Vector2D<number> = [0, 0];
const NO_SCROLL_DIRECTION: Vector2D<ScrollDirection> = [ScrollDirection.none, ScrollDirection.none];

const STOPPED_SCROLLING_TIMEOUT_IN_MILLISECONDS = 200;

/**
 * Determines the scroll direction based on the given current and previous scroll distance.
 * @param scrollDistance The new scroll distance
 * @param prevScrollDistance The previous scroll distance
 */
function getScrollDirection(scrollDistance: number, prevScrollDistance: number): ScrollDirection {
  let scrollDirection = ScrollDirection.none;
  if (scrollDistance > prevScrollDistance) {
    scrollDirection = ScrollDirection.forward;
  } else if (scrollDistance < prevScrollDistance) {
    scrollDirection = ScrollDirection.backward;
  }

  return scrollDirection;
}

/**
 * ScrollContainer represents a scrollable container that maintains information about its current scroll state.
 * The component takes a function component as its child component, using the current scroll state as its only argument.
 *
 * Note: The caller may wish to wrap this component with React.memo, in case they make sure that the 'children' function
 * doesn't mutate on every render.
 */
export const ScrollContainer = (props: IScrollContainerProps): JSX.Element => {
  const { height, width, children, enableHardwareAccelleration = true } = props;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [scrollContainerState, setScrollContainerState] = useState<IScrollContainerState>({
    isScrolling: false,
    scrollDistance: SCROLL_DISTANCE_ORIGIN,
    scrollDirection: NO_SCROLL_DIRECTION
  });
  const prevScrollContainerStateRef = usePreviousValueRef(scrollContainerState);

  const [scheduleStoppedScrollingTimeout, clearStoppedScrollingTimeout] = useDebouncedTimeout(() => {
    setScrollContainerState((currentScrollContainerState: IScrollContainerState) => {
      return {
        isScrolling: false,
        scrollDistance: currentScrollContainerState.scrollDistance,
        scrollDirection: NO_SCROLL_DIRECTION
      };
    });
  }, STOPPED_SCROLLING_TIMEOUT_IN_MILLISECONDS);

  const [onDebouncedScroll, clearOnDebouncedScroll] = useDebouncedScroll((scrollX: number, scrollY: number) => {
    const prevScrollContainerState = prevScrollContainerStateRef.current;

    const scrollDirectionX = getScrollDirection(
      scrollX,
      (prevScrollContainerState && prevScrollContainerState.scrollDistance[Axis.X]) || SCROLL_DISTANCE_ORIGIN[Axis.X]
    );
    const scrollDirectionY = getScrollDirection(
      scrollY,
      (prevScrollContainerState && prevScrollContainerState.scrollDistance[Axis.Y]) || SCROLL_DISTANCE_ORIGIN[Axis.Y]
    );

    setScrollContainerState({
      isScrolling: true,
      scrollDistance: [scrollX, scrollY],
      scrollDirection: [scrollDirectionX, scrollDirectionY]
    });

    scheduleStoppedScrollingTimeout();
  });

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener<'scroll'>('scroll', onDebouncedScroll, {
        // TODO: does this actually have an effect since scroll events are non-cancelable by default?
        passive: true // https://developers.google.com/web/updates/2016/06/passive-event-listeners
      });

      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', onDebouncedScroll);
        }

        clearOnDebouncedScroll();
        clearStoppedScrollingTimeout();
      };
    }
  }, []);

  const style: React.CSSProperties = {
    position: 'relative', // TODO: do we have perf benefits setting this to 'absolute'?
    height,
    width,
    overflow: 'auto',

    // Enable momentum-based scrolling for iOS browsers
    WebkitOverflowScrolling: 'touch',

    willChange: enableHardwareAccelleration ? 'transform' : undefined
  };

  return (
    <div
      ref={scrollContainerRef}
      data-is-scrollable={true} // some Fabric components need this to detect their parent scroll container more efficiently
      style={style} // tslint:disable-line:jsx-ban-props
    >
      {children(scrollContainerState)}
    </div>
  );
};
