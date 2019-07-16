import * as React from 'react';
import { styled } from 'office-ui-fabric-react/lib/Utilities';
import { IDetailsRowProps, IDetailsRowBaseProps, IDetailsRowStyleProps, IDetailsRowStyles } from './DetailsRow.types';
import { DetailsRowBase } from './DetailsRow.base';
import { getStyles } from './DetailsRow.styles';

export { IDetailsRowProps, IDetailsRowBaseProps };

const DetailsRowSlow: React.FunctionComponent<IDetailsRowBaseProps> = styled<
  IDetailsRowBaseProps,
  IDetailsRowStyleProps,
  IDetailsRowStyles
>(DetailsRowBase, getStyles, undefined, {
  scope: 'DetailsRow'
});

export const DetailsRow = React.memo((props: IDetailsRowBaseProps) => {
  return <DetailsRowSlow {...props} />;
});
