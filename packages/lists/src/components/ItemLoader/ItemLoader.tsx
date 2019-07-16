// import * as React from 'react';
import { ItemRange } from '../FixedList/FixedList.types';
import { IViewportState } from '../Viewport/Viewport.types';

export interface IItemLoaderProps {
  isItemLoaded: (itemIndex: number) => boolean;
  loadItemRange: (itemRange: ItemRange) => Promise<void>;
  loadAheadCount: number;
  viewportState?: IViewportState;
  children: JSX.Element;
}

export const ItemLoader = (props: IItemLoaderProps): JSX.Element => {
  const { children } = props;

  return children;
};
