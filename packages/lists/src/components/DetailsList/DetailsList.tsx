// tslint:disable:no-any
import * as React from 'react';
import { FixedList } from '../FixedList/FixedList';
import { IViewportState } from '../Viewport/Viewport.types';
import { SimpleDetailsRow } from '../SimpleDetailsRow/SimpleDetailsRow';
import { IDetailsRowProps } from '../DetailsRow/DetailsRow.types';
import { IColumn, IDetailsHeaderProps, DetailsListLayoutMode, IDetailsHeader } from 'office-ui-fabric-react/lib/DetailsList';
import DetailsHeader from '../DetailsHeader/DetailsHeader';
import { IRenderFunction, KeyCodes, getRTLSafeKeyCode, EventGroup } from 'office-ui-fabric-react/lib/Utilities';
import { ISelection, SelectionMode } from 'office-ui-fabric-react/lib/utilities/selection/index';
import { IFocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { FocusZone } from '../FocusZone/FocusZone';
import { IOnRenderItemProps } from '../FixedList/FixedList.types';
// import * as ListStyles from './DetailsList.scss';

export interface IDetailsListProps<TItem> {
  onRenderRow?: IRenderFunction<IDetailsRowProps>;
  items: TItem[];
  viewportState: IViewportState;
  viewportOffset: number;
  viewportHeight: number;
  viewportWidth: number;
  compact?: boolean;

  /** selection model to track selection state.  */
  selection: ISelection;

  /** Controls how/if the details list manages selection. Options include none, single, multiple */
  selectionMode?: SelectionMode;

  /**
   * Whether or not to disable the built-in SelectionZone, so the host component can provide its own.
   */
  disableSelectionZone?: boolean;

  /** Given column defitions. If none are provided, default columns will be created based on the item's properties. */
  columns: IColumn[];

  /**
   * An override to render the details header.
   */
  onRenderDetailsHeader?: IRenderFunction<IDetailsHeaderProps>;

  /**
   * Controls the visibility of the details header.
   * @defaultvalue true
   */
  isHeaderVisible?: boolean;

  /** Controls how the columns are adjusted. */
  layoutMode?: DetailsListLayoutMode;

  /** Callback for when an item in the list becomes active by clicking anywhere inside the row or navigating to it with keyboard. */
  onActiveItemChanged?: (item?: any, index?: number, ev?: React.FocusEvent<HTMLElement>) => void;
}

const DETAILS_LIST_ROW_HEIGHT = 43;
const COMPACT_DETAILS_LIST_ROW_HEIGHT = 32;

export class DetailsList<TItem> extends React.Component<IDetailsListProps<TItem>> {
  public static defaultProps = {
    layoutMode: DetailsListLayoutMode.justified,
    selectionMode: SelectionMode.multiple,
    compact: false,
    isHeaderVisible: true
  };

  private _list = React.createRef<typeof FixedList>();
  private _header = React.createRef<IDetailsHeader>();
  private _focusZone = React.createRef<IFocusZone>();
  private _selectionEventGroup: EventGroup;

  // tslint:disable-next-line:no-any
  constructor(props: IDetailsListProps<TItem>, context: any) {
    super(props, context);

    this._selectionEventGroup = new EventGroup(this);
  }

  public shouldComponentUpdate(newProps: IDetailsListProps<TItem>): boolean {
    return (
      newProps.items !== this.props.items || newProps.compact !== this.props.compact || newProps.viewportState !== this.props.viewportState
    );
  }

  public componentDidUpdate(prevProps: IDetailsListProps<TItem>): void {
    if (prevProps.compact !== this.props.compact) {
      if (this._list && this._list.current) {
        // this._list.current.forceUpdate();
      }
    }
  }

  public render(): JSX.Element | null {
    const {
      items,
      viewportState,
      viewportOffset,
      onRenderDetailsHeader = this._onRenderDetailsHeader,
      isHeaderVisible,
      selection,
      selectionMode,
      columns,
      layoutMode,
      compact
    } = this.props;

    if (items.length > 0) {
      // tslint:disable-line:no-non-null-assertion
      return (
        <React.Fragment>
          <div onKeyDown={this._onHeaderKeyDown} role="presentation">
            {isHeaderVisible &&
              onRenderDetailsHeader(
                {
                  componentRef: this._header,
                  selectionMode: selectionMode!,
                  selection: selection,
                  layoutMode: layoutMode!,
                  columns: columns
                },
                this._onRenderDetailsHeader
              )}
          </div>
          <div onKeyDown={this._onContentKeyDown} role="presentation">
            <FocusZone
              componentRef={this._focusZone}
              direction={FocusZoneDirection.vertical}
              isInnerZoneKeystroke={isRightArrow}
              onActiveElementChanged={this._onActiveRowChanged}
              onBlur={this._onBlur}
            >
              <FixedList
                itemCount={items.length}
                itemHeight={compact ? COMPACT_DETAILS_LIST_ROW_HEIGHT : DETAILS_LIST_ROW_HEIGHT}
                onRenderItem={this._onRenderRow}
                viewportState={viewportState}
                viewportWidth={1500}
                viewportHeight={700}
                surfaceTop={viewportOffset + (isHeaderVisible ? 35 : 0)}
                overscanHeight={350}
              />
            </FocusZone>
          </div>
        </React.Fragment>
      );
    }

    return null;
  }

  private _onRenderRow = (props: IOnRenderItemProps) => {
    const { index, style } = props;
    const { items, compact, onRenderRow = this._onRenderDetailsRow, selection, selectionMode, columns } = this.props;

    const item = items[index];

    let RenderedRow: JSX.Element | null = null;
    if (item) {
      const rowProps: IDetailsRowProps = {
        columns: columns,
        selection: selection,
        selectionMode: selectionMode!,
        item: item,
        itemIndex: index,
        compact: compact,
        style: style,
        selectionEventGroup: this._selectionEventGroup
      };

      RenderedRow = onRenderRow(rowProps, this._onRenderDetailsRow); // tslint:disable-line:no-non-null-assertion
    }

    return RenderedRow;
  };

  private _onRenderDetailsRow = (props: IDetailsRowProps, defaultRender?: IRenderFunction<IDetailsRowProps>): JSX.Element => {
    return <SimpleDetailsRow key={props.itemIndex} {...props} />;
  };

  private _onRenderDetailsHeader = (
    detailsHeaderProps: IDetailsHeaderProps,
    defaultRender?: IRenderFunction<IDetailsHeaderProps>
  ): JSX.Element => {
    return <DetailsHeader {...detailsHeaderProps} />;
  };

  private _onHeaderKeyDown = (ev: React.KeyboardEvent<HTMLElement>): void => {
    const { selection } = this.props;

    if (ev.which === KeyCodes.down) {
      if (this._focusZone.current && this._focusZone.current.focus()) {
        // select the first item in list after down arrow key event
        // only if nothing was selected; otherwise start with the already-selected item
        if (selection.getSelectedIndices().length === 0) {
          selection.setIndexSelected(0, true, false);
        }

        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  };

  private _onContentKeyDown = (ev: React.KeyboardEvent<HTMLElement>): void => {
    if (ev.which === KeyCodes.up && !ev.altKey) {
      if (this._header.current && this._header.current.focus()) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  };

  /**
   * Call back function when an element in FocusZone becomes active. It will translate it into item
   * and call onActiveItemChanged callback if specified.
   *
   * @param row - element that became active in Focus Zone
   * @param focus - event from Focus Zone
   */
  private _onActiveRowChanged = (el?: HTMLElement, ev?: React.FocusEvent<HTMLElement>): void => {
    const { items, onActiveItemChanged } = this.props;

    if (!el) {
      return;
    }

    // Check and assign index only if the event was raised from any DetailsRow element
    if (el.getAttribute('data-item-index')) {
      const index = Number(el.getAttribute('data-item-index'));
      if (index >= 0) {
        if (onActiveItemChanged) {
          onActiveItemChanged(items[index], index, ev);
        }
        this.setState({
          focusedItemIndex: index
        });
      }
    }
  };

  private _onBlur = (event: React.FocusEvent<HTMLElement>): void => {
    this.setState({
      focusedItemIndex: -1
    });
  };
}

function isRightArrow(event: React.KeyboardEvent<HTMLElement>): boolean {
  return event.which === getRTLSafeKeyCode(KeyCodes.right);
}
