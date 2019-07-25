import * as React from 'react';
import { FocusZone as FocusZoneSlow, IFocusZoneProps } from 'office-ui-fabric-react/lib/FocusZone';

export const FocusZone = (props: IFocusZoneProps) => {
  return <FocusZoneSlow {...props} />;
};
