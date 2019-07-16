import * as React from 'react';
import { IDetailsRowProps, IDetailsRowBaseProps } from '../DetailsRow/DetailsRow.types';
import { IColumn, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { SelectionMode, SELECTION_CHANGE } from 'office-ui-fabric-react/lib/utilities/selection/interfaces';
import * as RowStyles from './SimpleDetailsRow.scss';
import * as CheckStyles from './ForkedCheck.scss';
import { css } from 'office-ui-fabric-react/lib/Utilities';

export { IDetailsRowProps, IDetailsRowBaseProps };

// tslint:disable-next-line:no-any
const getCellText = (item: any, column: IColumn): string => {
  let value = item && column && column.fieldName ? item[column.fieldName] : '';

  if (value === null || value === undefined) {
    value = '';
  }

  return value;
};

export const SimpleDetailsRow: React.FunctionComponent<IDetailsRowBaseProps> = React.memo(
  (props: IDetailsRowBaseProps): JSX.Element | null => {
    const {
      columns,
      item,
      itemIndex,
      onRenderItemColumn,
      cellsByColumn,
      selectionMode,
      checkboxVisibility,
      style,
      compact,
      selection,
      checkButtonAriaLabel,
      selectionEventGroup
    } = props;
    if (!columns) {
      return null;
    }

    const [isSelected, setIsSelected] = React.useState(!!selection && selection.isIndexSelected(itemIndex));
    const [isSelectionModal, setIsSelectionModal] = React.useState(!!selection && !!selection.isModal && selection.isModal());

    const onSelectionChanged = React.useCallback(() => {
      setIsSelected(!!selection && selection.isIndexSelected(itemIndex));
      setIsSelectionModal(!!selection && !!selection.isModal && selection.isModal());
    }, []);

    React.useEffect(() => {
      if (selectionEventGroup) {
        selectionEventGroup.on(selection, SELECTION_CHANGE, onSelectionChanged);
      }

      return () => {
        if (selectionEventGroup) {
          selectionEventGroup.off(selection, SELECTION_CHANGE, onSelectionChanged);
        }
      };
    }, []);

    const canSelect = !!selection && selection.canSelectItem!(item, itemIndex);

    const showCheckbox = selectionMode !== SelectionMode.none && checkboxVisibility !== CheckboxVisibility.hidden;
    const columnStartIndex = (showCheckbox ? 1 : 0) + columns.length;

    // const ariaLabel = getRowAriaLabel ? getRowAriaLabel(item) : undefined;
    // const ariaDescribedBy = getRowAriaDescribedBy ? getRowAriaDescribedBy(item) : undefined;
    const ariaSelected = selectionMode === SelectionMode.none ? undefined : isSelected;

    return (
      // TODO: do we need hidden checkbox cover?
      <div
        className={css(
          RowStyles.root,
          isSelected ? RowStyles.isSelected : undefined,
          compact ? RowStyles.compact : undefined,
          isSelectionModal ? RowStyles.anySelected : undefined
        )}
        data-automationid="DetailsRow"
        role="row"
        // aria-label={ariaLabel}
        // aria-describedby={ariaDescribedBy}
        data-is-focusable={true}
        data-selection-index={itemIndex}
        data-item-index={itemIndex}
        aria-rowindex={itemIndex + 1}
        aria-selected={ariaSelected}
        style={style} // tslint:disable-line:jsx-ban-props
      >
        {showCheckbox && (
          <div role="gridcell" aria-colindex={1} data-selection-toggle={true} className={RowStyles.checkCell}>
            {renderCheckbox({
              selected: isSelected,
              anySelected: isSelectionModal,
              title: checkButtonAriaLabel,
              canSelect,
              compact,
              isVisible: checkboxVisibility === CheckboxVisibility.always
            })}
          </div>
        )}

        {columns.map(
          (column: IColumn, columnIndex: number): JSX.Element => {
            const { onRender = onRenderItemColumn } = column;
            const cellContentsRender =
              cellsByColumn && column.key in cellsByColumn
                ? cellsByColumn[column.key]
                : onRender
                ? onRender(item, itemIndex, column)
                : getCellText(item, column);

            return (
              <div
                className={css(
                  RowStyles.cell,
                  columnIndex === columns.length - 1 ? RowStyles.lastCell : undefined,
                  column.isRowHeader ? RowStyles.isRowHeader : undefined,
                  column.isPadded ? RowStyles.cellPadded : RowStyles.cellUnpadded
                )}
                key={columnIndex}
                role={column.isRowHeader ? 'rowheader' : 'gridcell'}
                aria-colindex={columnIndex + columnStartIndex + 1}
                data-automationid="DetailsRowCell"
                data-automation-key={column.key}
                // tslint:disable-next-line:jsx-ban-props
                style={{
                  width: columnIndex !== columns.length - 1 ? column.maxWidth : undefined
                }}
              >
                {cellContentsRender}
              </div>
            );
          }
        )}

        <span role="checkbox" className={RowStyles.checkCover} aria-checked={isSelected} data-selection-toggle={true} />
      </div>
    );
  },
  (prevProps: IDetailsRowBaseProps, nextProps: IDetailsRowBaseProps): boolean => {
    return (
      prevProps.columns === nextProps.columns &&
      prevProps.item === nextProps.item &&
      prevProps.itemIndex === nextProps.itemIndex &&
      prevProps.onRenderItemColumn === nextProps.onRenderItemColumn &&
      prevProps.cellsByColumn === nextProps.cellsByColumn &&
      prevProps.selectionMode === nextProps.selectionMode &&
      prevProps.checkboxVisibility === nextProps.checkboxVisibility &&
      prevProps.style === nextProps.style
    );
  }
);

interface IDetailsRowCheckProps extends React.HTMLAttributes<HTMLElement> {
  isVisible?: boolean;
  canSelect?: boolean;
  anySelected?: boolean;
  selected?: boolean;
  compact?: boolean;
}

function renderCheckbox(props: IDetailsRowCheckProps): JSX.Element | null {
  const { isVisible = false, canSelect = false, anySelected = false, selected = false, compact, ...buttonProps } = props;
  const isCheckVisible = isVisible || selected || anySelected;

  return canSelect ? (
    <div
      className={css(RowStyles.detailsRowCheck, isCheckVisible ? RowStyles.isCheckVisible : undefined)}
      {...buttonProps}
      role="checkbox"
      aria-checked={selected}
      data-selection-toggle={true}
      data-automationid="DetailsRowCheck"
    >
      <DetailsRowCheck checked={selected} />
    </div>
  ) : (
    <div {...buttonProps} className={css(RowStyles.check)} />
  );
}

const DetailsRowCheck = (props: { checked: boolean }) => {
  const { checked } = props;

  return (
    <div className={css(CheckStyles.root, checked ? CheckStyles.rootIsChecked : undefined)}>
      <FontIcon iconCode={IconsCode.CircleRing} className={CheckStyles.circle} />
      <FontIcon iconCode={IconsCode.StatusCircleCheckmark} className={CheckStyles.check} />
    </div>
  );
};

interface IFontIconProps extends React.HTMLAttributes<HTMLElement> {
  iconCode: IconsCode;
  className?: string;
}

const enum IconsCode {
  StatusCircleCheckmark = '\uF13E',
  CircleRing = '\uEA3A'
}

const FontIcon: React.FunctionComponent<IFontIconProps> = (props: IFontIconProps): JSX.Element | null => {
  const { iconCode, className, ...nativeProps } = props;

  return (
    <i role={'presentation'} aria-hidden="true" {...nativeProps} className={css('ms-Icon', RowStyles.fontIcon, className)}>
      {iconCode}
    </i>
  );
};
