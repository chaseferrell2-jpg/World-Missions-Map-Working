
import React from 'react';

export interface Devotional {
  id: number;
  title: string;
  content: string;
}

interface DevotionalPageProps {
  devotional: Devotional;
  onBack: () => void;
}

const DevotionalPage: React.FC<DevotionalPageProps> = ({ devotional, onBack }) => {
  // A simple markdown-to-HTML converter
  const renderMarkdown = (text: string) => {
    const html = text
      .replace(/^## (.*$)/g, '<h2 class="text-2xl font-bold mb-4">$1</h2>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*)__/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-8">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8">
            <header className="border-b-2 border-gray-700 pb-4 mb-6 relative">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-3xl leading-none flex items-center justify-center h-8 w-8"
                    aria-label="Back to Global Heart Page"
                >
                    &larr;
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-center">
                  {devotional.title}
                </h1>
            </header>
            
            <main className="mt-6">
              <div 
                className="prose prose-invert max-w-none text-gray-300 space-y-4"
                dangerouslySetInnerHTML={renderMarkdown(devotional.content)}
              />
            </main>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .prose {
            line-height: 1.8;
        }
      `}</style>
    </div>
  );
};

export default DevotionalPage;
