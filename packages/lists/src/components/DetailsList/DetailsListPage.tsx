import * as React from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { ExampleCard, IComponentDemoPageProps, ComponentPage } from '@uifabric/example-app-base';

/* tslint:disable:max-line-length */
import { DetailsListDocumentExample } from './examples/DetailsList.Document.Example';

export interface ITilesListPageState {
  size: 'small' | 'large';
}

export class DetailsListPage extends React.Component<IComponentDemoPageProps, ITilesListPageState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      size: 'small'
    };
  }

  public shouldComponentUpdate(nextProps: IComponentDemoPageProps, nextState: ITilesListPageState): boolean {
    return this.state.size !== nextState.size;
  }

  public render(): JSX.Element {
    const { size } = this.state;

    return (
      <ComponentPage
        title="FixedSizeDetailsList"
        componentName="FixedSizeDetailsListExample"
        exampleCards={
          <div>
            <ExampleCard title="DetailsList with document tiles and placeholders when data is missing" isOptIn={true} code={''}>
              <Checkbox label="Use large rows" checked={size === 'large'} onChange={this._onIsLargeChanged} />
              <DetailsListDocumentExample tileSize={size} />
            </ExampleCard>
          </div>
        }
        isHeaderVisible={false}
      />
    );
  }

  private _onIsLargeChanged = (event: React.FormEvent<HTMLInputElement>, checked: boolean): void => {
    this.setState({
      size: checked ? 'large' : 'small'
    });
  };
}
