import * as React from 'react';
import { MarqueeSelection as MarqueeSelectionSlow, IMarqueeSelectionProps } from 'office-ui-fabric-react/lib/MarqueeSelection';

export const MarqueeSelection = React.memo((props: IMarqueeSelectionProps) => {
  return <MarqueeSelectionSlow {...props} />;
});
