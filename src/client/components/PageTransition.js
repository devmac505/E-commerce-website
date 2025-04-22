import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function PageTransition({ children }) {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="page-transition"
        nodeRef={nodeRef}
      >
        <div className="page-wrapper" ref={nodeRef}>
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default PageTransition;
