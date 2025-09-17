import React from 'react';
import { CardViewProvider } from './CardViewContext';
import type {  RenderCardViewProps } from '../InterfacesForCardView';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import RenderCardViewElements from './RenderCardViewElements';

const RenderCardView: React.FC<RenderCardViewProps  > = (props) => {
    return (
    
     <CardViewProvider
      options={props.options}
      refForFunctionalities={props.refForFunctionalities}
    >
      <ErrorBoundary>
         <RenderCardViewElements />
      </ErrorBoundary>
    </CardViewProvider>
  );
};

export default RenderCardView;