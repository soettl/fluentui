import { IScrollContainerState } from '../ScrollContainer/ScrollContainer.types';

/**
 * Type representing an item range, where the first element is the start index (inclusive)
 * and the second element is the end index (exclusive).
 */
export type ItemRange = [number, number];
export enum ItemRangeIndex {
  startIndex = 0,
  endIndex = 1
}

export type OnGetMaterializedRangesCallbackProps = { visibleRange: ItemRange; materializedRange: ItemRange };
export type OnGetMaterializedRangesCallback = (props: OnGetMaterializedRangesCallbackProps) => IMaterializedItemRange;

export interface IOnRenderItemProps {
  index: number;
  style: React.CSSProperties;
}

export interface IOnItemsRenderedProps {
  visibleRange: ItemRange;
  materializedRange: ItemRange;
  focusedRange?: ItemRange;
}

export interface IOnRenderListSurfaceProps {
  style: React.CSSProperties;
  children: React.ReactNode;
}

export interface IMaterializedItemRange {
  materializedRange: ItemRange;
  focusedRange?: ItemRange;
}

export interface IEqualItemSizeListProps {
  /**
   * The total number of items contained in the list.
   */
  itemCount: number;

  /**
   * The fixed height of each item in the list.
   */
  itemHeight: number;

  /**
   * The current scrollContainer state.
   */
  scrollContainerState: IScrollContainerState;

  /**
   * The height of the scrollContainer this list is mounted in.
   */
  scrollContainerHeight: number;

  /**
   * The width of the scrollContainer this list is mounted in.
   */
  scrollContainerWidth: number;

  /**
   * The distance of the top of the scrollContainer surface to the top of the list surface.
   */
  surfaceTop: number;

  /**
   * The height of item overscan before and after the visible area of the scrollContainer.
   */
  overscanRatio: number;
  scrollOverscanRatio?: number;

  /**
   * Callback used to render an item with the given index.
   */
  onRenderItem: (props: IOnRenderItemProps) => JSX.Element | null;

  onItemsRendered?: (props: IOnItemsRenderedProps) => void;

  /**
   * Callback used to modify the list's calculated materialized range, for example in order to always render
   * a focused item, no matter whether it is currently in view or not.
   */
  onGetMaterializedRanges?: OnGetMaterializedRangesCallback;

  enableHardwareAccelleration?: boolean;

  onRenderListSurface?: (props: IOnRenderListSurfaceProps) => React.ReactNode;
}
