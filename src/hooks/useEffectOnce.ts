import * as React from "react";

export const useEffectOnce = (callback: () => boolean, deps: any[] = []) => {
  const refFired = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!refFired.current) {
      refFired.current = callback();
    }
  }, deps);
};
