import * as React from "react";
import { useIsolatedStore } from "react-stores";

const WithStore = () => {
  const store = useIsolatedStore(
    { count: 1 },
    { name: "Isolated", persistence: true }
  );

  const store2 = useIsolatedStore({ count: 1 });

  return (
    <div>
      <button
        onClick={() => {
          store.setState({
            count: store.state.count + 1
          });
          store2.setState({
            count: store2.state.count + 1
          });
        }}
      >
        set +1
      </button>
      {store.state.count}
    </div>
  );
};

export const App = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        set
      </button>

      {show && <WithStore />}
    </div>
  );
};
