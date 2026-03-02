import React, { memo, useEffect, useRef } from 'react';
import Context from './Context';
import { useCombinedState } from './CombineState';
import { useAuth } from './AuthContext';

const ContextProvider = (props) => {
  const combinedState = useCombinedState();
  const { registerOnLogout } = useAuth();
  const resetRef = useRef(null);

  resetRef.current = () => {
    combinedState.dashboard?.reset?.();
    combinedState.attendence?.reset?.();
    combinedState.task?.reset?.();
    combinedState.leave?.reset?.();
    combinedState.projects?.reset?.();
    combinedState.aiChat?.reset?.();
    combinedState.login?.reset?.();
  };

  useEffect(() => {
    registerOnLogout?.(() => resetRef.current?.());
    return () => registerOnLogout?.(null);
  }, [registerOnLogout]);

  return <Context.Provider value={combinedState}>{props.children}</Context.Provider>;
};

export default memo(ContextProvider);
