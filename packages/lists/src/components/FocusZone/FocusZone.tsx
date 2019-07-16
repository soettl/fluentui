import * as React from 'react';
import { FocusZone as FocusZoneSlow, IFocusZoneProps } from 'office-ui-fabric-react/lib/FocusZone';

export const FocusZone = React.memo((props: IFocusZoneProps) => {
  return <FocusZoneSlow {...props} />;
});
