import React from 'react';

interface VocabularyPageProps {
  onBack: () => void;
}

const VocabularyPage: React.FC<VocabularyPageProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full bg-gray-900 text-white animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-8">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8">
            <header className="border-b-2 border-gray-700 pb-4 mb-6 relative">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-3xl leading-none flex items-center justify-center h-8 w-8"
                    aria-label="Back to Map"
                >
                    &larr;
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-center">
                  Mission Vocabulary and Terms
                </h1>
            </header>
            <main className="space-y-6 text-gray-300">
                <div>
                    <h3 className="font-bold text-white text-lg">People Group Count</h3>
                    <p>A people group is an ethnolinguistic group of people who share a common language, culture, and ethnicity. The count represents distinct groups within a country, many of whom may not have a self-sustaining Christian community.</p>
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Christian %</h3>
                    <p>This is the estimated percentage of the population that identifies as Christian (including all denominations). The map is color-coded based on this data: red indicates a lower percentage, and blue indicates a higher percentage.</p>
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Unreached %</h3>
                    <p>This figure represents the estimated percentage of the population that is considered "unreached"—individuals who have likely never had a meaningful opportunity to hear the Gospel message in a way they can understand. These are often people in groups with no indigenous, self-sustaining Christian community.</p>
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Main Religion</h3>
                    <p>The largest religious group in the country by population.</p>
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Information Source</h3>
                    <p>The data for these cards has been compiled and fact-checked from a variety of respected missions and demographic research sources, including The Joshua Project, Open Doors, Operation World, and others.</p>
                </div>
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
      `}</style>
    </div>
  );
};

export default VocabularyPage;
