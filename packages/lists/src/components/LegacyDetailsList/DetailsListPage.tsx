import * as React from 'react';
import { ExampleCard, IComponentDemoPageProps, ComponentPage } from '@uifabric/example-app-base';

/* tslint:disable:max-line-length */
import { DetailsListDocumentsExample } from './examples/DetailsList.Document.Example';

export interface ITilesListPageState {
  size: 'small' | 'large';
}

export class DetailsListPage extends React.Component<IComponentDemoPageProps, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <ComponentPage
        title="LegacyDetailsList"
        componentName="LegacyDetailsListExample"
        exampleCards={
          <div>
            <ExampleCard title="DetailsList with document tiles and placeholders when data is missing" isOptIn={true} code={''}>
              <DetailsListDocumentsExample />
            </ExampleCard>
          </div>
        }
        isHeaderVisible={false}
      />
    );
  }
}
