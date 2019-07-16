// tslint:disable:no-any
import * as React from 'react';
import { IDetailsHeaderBaseProps, DetailsHeader as FabricDetailsHeader } from 'office-ui-fabric-react/lib/DetailsList';

export default class DetailsHeader extends React.PureComponent<IDetailsHeaderBaseProps> {
  // tslint:disable-next-line:no-any
  constructor(props: IDetailsHeaderBaseProps, context: any) {
    super(props, context);
  }

  public render(): JSX.Element | null {
    return <FabricDetailsHeader {...this.props} />;
  }
}
