import React, { useState, useRef, useLayoutEffect } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initialHeight?: number; // in pixels
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, initialHeight = 120 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Use useLayoutEffect to measure the content height before the browser paints
  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const isOverflowing = contentHeight > initialHeight;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3 text-gray-300">{title}</h2>
      <div className="bg-gray-900/50 p-4 rounded-md">
        <div
          className="prose prose-invert max-w-none text-gray-400 relative overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: isExpanded ? `${contentHeight}px` : `${initialHeight}px` }}
        >
          <div ref={contentRef}>
            {children}
          </div>
          {!isExpanded && isOverflowing && (
             <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
          )}
        </div>
        {isOverflowing && (
          <div className="text-left mt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleSection;
