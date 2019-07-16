// tslint:disable:no-any
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { ICellStyleProps } from 'office-ui-fabric-react/lib/DetailsList';
import { IDetailsListProps } from 'office-ui-fabric-react/lib/DetailsList';
import { IDetailsRowProps } from 'office-ui-fabric-react/lib/DetailsList';

/**
 * Extended column render props.
 *
 * {@docCategory DetailsList}
 */
export type IOverrideColumnRenderProps = Pick<IDetailsListProps, 'onRenderItemColumn'> & Pick<IDetailsRowProps, 'cellsByColumn'>;

/**
 * Props interface for the DetailsRowFields component.
 *
 * {@docCategory DetailsList}
 */
export interface IDetailsRowFieldsProps extends IOverrideColumnRenderProps {
  /**
   * Data source for this component
   */
  item: any;

  /**
   * The item index of the collection for the DetailsList
   */
  itemIndex: number;

  /**
   * Index to start for the column
   */
  columnStartIndex: number;

  /**
   * Columns metadata
   */
  columns: IColumn[];

  /**
   * whether to render as a compact field
   */
  compact?: boolean;

  /**
   * Subset of classnames currently generated in DetailsRow that are used within DetailsRowFields.
   */
  rowClassNames: {
    isMultiline: string;
    isRowHeader: string;
    cell: string;
    cellPadded: string;
    cellUnpadded: string;
    fields: string;
  };

  /**
   * Style properties to customize cell render output.
   */
  cellStyleProps?: ICellStyleProps;
}
