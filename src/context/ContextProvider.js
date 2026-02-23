import React, { memo } from 'react';
import Context from './Context';
import { useCombinedState } from './CombineState'

const ContextProvider = (props) => {
    const combinedState = useCombinedState();

    return <Context.Provider value={combinedState}>{props.children}</Context.Provider>
}

export default memo(ContextProvider);
