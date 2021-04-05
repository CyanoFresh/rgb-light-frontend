import { createContext, useState } from 'react';

export const DeviceStateContext = createContext();

export const DeviceStateContextProvider = props => {
  const [state, setState] = useState({
    on: false,
    color: {
      r: 0,
      g: 0,
      b: 0,
    },
    batteryLevel: undefined,
  });

  return (
    <DeviceStateContext.Provider value={[state, setState]}>
      {props.children}
    </DeviceStateContext.Provider>
  );
};
