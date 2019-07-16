import * as React from 'react';
import { DetailsList } from '../DetailsList';
import { Selection, SelectionZone } from 'office-ui-fabric-react/lib/Selection';
// import { MarqueeSelection } from '../../MarqueeSelection/MarqueeSelection';
import { Viewport } from '../../Viewport/Viewport';
import { IViewportState } from '../../Viewport/Viewport.types';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

declare class DetailsListClass extends DetailsList<IDocument> {}

const DetailsListType: typeof DetailsListClass = DetailsList;

export interface ITilesListDocumentExampleState {}

export interface ITilesListDocumentExampleProps {
  tileSize: 'large' | 'small';
}

export interface IDocument {
  key: string;
  name: string;
  value: string;
  iconName: string;
  fileType: string;
  modifiedBy: string;
  dateModified: string;
  dateModifiedValue: number;
  fileSize: string;
  fileSizeRaw: number;
}

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px'
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden'
      }
    }
  },
  fileIconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px'
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  exampleToggle: {
    display: 'inline-block',
    marginBottom: '10px',
    marginRight: '30px'
  },
  selectionDetails: {
    marginBottom: '20px'
  }
});

const COLUMNS: IColumn[] = [
  {
    key: 'column1',
    name: 'File Type',
    className: classNames.fileIconCell,
    iconClassName: classNames.fileIconHeaderIcon,
    ariaLabel: 'Column operations for File type, Press to sort on File type',
    iconName: 'Page',
    isIconOnly: true,
    fieldName: 'name',
    minWidth: 16,
    maxWidth: 36,
    calculatedWidth: 36,
    onRender: (item: IDocument) => {
      return <img src={item.iconName} className={classNames.fileIconImg} alt={item.fileType + ' file icon'} />;
    }
  },
  {
    key: 'column2',
    name: 'Name',
    fieldName: 'name',
    minWidth: 210,
    maxWidth: 350,
    calculatedWidth: 350,
    isRowHeader: true,
    isResizable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: (item: IDocument) => {
      return <span>{item.name}</span>;
    },
    isPadded: true
  },
  {
    key: 'column3',
    name: 'Date Modified',
    fieldName: 'dateModifiedValue',
    minWidth: 70,
    maxWidth: 90,
    calculatedWidth: 90,
    isResizable: true,
    data: 'number',
    onRender: (item: IDocument) => {
      return <span>{item.dateModified}</span>;
    },
    isPadded: true
  },
  {
    key: 'column4',
    name: 'Modified By',
    fieldName: 'modifiedBy',
    minWidth: 70,
    maxWidth: 90,
    calculatedWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: IDocument) => {
      return <span>{item.modifiedBy}</span>;
    },
    isPadded: true
  },
  {
    key: 'column5',
    name: 'File Size',
    fieldName: 'fileSizeRaw',
    minWidth: 70,
    maxWidth: 90,
    calculatedWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'number',
    onRender: (item: IDocument) => {
      return <span>{item.fileSize}</span>;
    }
  }
];

export class DetailsListDocumentExample extends React.Component<ITilesListDocumentExampleProps, ITilesListDocumentExampleState> {
  private _selection: Selection;
  private _items: IDocument[];

  constructor(props: ITilesListDocumentExampleProps) {
    super(props);

    this._items = _generateDocuments();

    this._selection = new Selection({
      getKey: (item: { key: string }) => item.key,
      onSelectionChanged: this._onSelectionChange
    });

    this._selection.setItems(this._items);
  }

  public shouldComponentUpdate(nextProps: ITilesListDocumentExampleProps, nextState: ITilesListDocumentExampleState): boolean {
    return this.props.tileSize !== nextProps.tileSize;
  }

  public render(): JSX.Element {
    const width = 1500;
    const height = 700;

    return (
      // tslint:disable:jsx-ban-props
      <div style={{ padding: '4px' }}>
        <Viewport width={width} height={height}>
          {this._renderViewport}
        </Viewport>
      </div>
    );
  }

  private _renderViewport = (viewportState: IViewportState): JSX.Element => {
    const width = 1500;
    const height = 700;

    return (
      <SelectionZone selection={this._selection} onItemInvoked={this._onItemInvoked} enterModalOnTouch={true}>
        <div style={{ height: 100 }}>
          <h1>Files Section 1</h1>
        </div>
        <DetailsListType
          items={this._items}
          viewportState={viewportState}
          viewportOffset={100}
          selection={this._selection}
          columns={COLUMNS}
          compact={this.props.tileSize === 'small'}
          viewportWidth={width}
          viewportHeight={height}
        />
      </SelectionZone>
    );
  };

  private _onSelectionChange = (): void => {
    this.setState({
      isModalSelection: this._selection.isModal()
    });
  };

  private _onItemInvoked = (item: { key: string }, index: number, event: Event): void => {
    event.stopPropagation();
    event.preventDefault();

    alert(`Invoked item '${item.key}'`);
  };
}

function _generateDocuments(): IDocument[] {
  const noOfItems = 20000;
  const items: IDocument[] = new Array(noOfItems);
  for (let i = 0; i < noOfItems; i++) {
    const randomDate = _randomDate(new Date(2012, 0, 1), new Date());
    const randomFileSize = _randomFileSize();
    const randomFileType = _randomFileIcon();
    let fileName = _lorem(2) + ' ' + i;
    fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1).concat(`.${randomFileType.docType}`);
    let userName = _lorem(2);
    userName = userName
      .split(' ')
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(' ');
    items[i] = {
      key: i.toString(),
      name: fileName,
      value: fileName,
      iconName: randomFileType.url,
      fileType: randomFileType.docType,
      modifiedBy: userName,
      dateModified: randomDate.dateFormatted,
      dateModifiedValue: randomDate.value,
      fileSize: randomFileSize.value,
      fileSizeRaw: randomFileSize.rawSize
    };
  }
  return items;
}

let dateTimeFormat: Intl.DateTimeFormat | undefined = undefined;
function _randomDate(start: Date, end: Date): { value: number; dateFormatted: string } {
  const date: Date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  let dateFormatted: string | undefined;
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    if (!dateTimeFormat) {
      dateTimeFormat = new Intl.DateTimeFormat();
    }

    dateFormatted = dateTimeFormat.format(date);
  } else {
    dateFormatted = date.toLocaleDateString();
  }

  return {
    value: date.valueOf(),
    dateFormatted: dateFormatted
  };
}

const FILE_ICONS: { name: string }[] = [
  { name: 'accdb' },
  { name: 'csv' },
  { name: 'docx' },
  { name: 'dotx' },
  { name: 'mpt' },
  { name: 'odt' },
  { name: 'one' },
  { name: 'onepkg' },
  { name: 'onetoc' },
  { name: 'pptx' },
  { name: 'pub' },
  { name: 'vsdx' },
  { name: 'xls' },
  { name: 'xlsx' },
  { name: 'xsn' }
];

function _randomFileIcon(): { docType: string; url: string } {
  const docType: string = FILE_ICONS[Math.floor(Math.random() * FILE_ICONS.length)].name;
  return {
    docType,
    url: `https://static2.sharepointonline.com/files/fabric/assets/brand-icons/document/svg/${docType}_16x1.svg`
  };
}

function _randomFileSize(): { value: string; rawSize: number } {
  const fileSize: number = Math.floor(Math.random() * 100) + 30;
  return {
    value: `${fileSize} KB`,
    rawSize: fileSize
  };
}

const LOREM_IPSUM = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut ' +
  'aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
  'eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt '
).split(' ');
let loremIndex = 0;
function _lorem(wordCount: number): string {
  const startIndex = loremIndex + wordCount > LOREM_IPSUM.length ? 0 : loremIndex;
  loremIndex = startIndex + wordCount;
  return LOREM_IPSUM.slice(startIndex, loremIndex).join(' ');
}
