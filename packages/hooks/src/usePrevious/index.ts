import React from "react";

const usePrevious = <D>(data: D) => {
  const ref = React.useRef(data);

  React.useEffect(() => {
    ref.current = data;
  }, [data]);

  return ref.current;
};

export default usePrevious;
