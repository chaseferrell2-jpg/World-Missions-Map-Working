import React from 'react';
import type { CountryFeature } from '../types';
import AiReporter from './AiReporter';
import CollapsibleSection from './CollapsibleSection';

interface CountryProfileProps {
  country: CountryFeature;
  onBack: () => void;
}

const CountryProfile: React.FC<CountryProfileProps> = ({ country, onBack }) => {
  const { 
    name, 
    peopleGroupCount, 
    christianPercentage,
    unreachedPercentage,
    mainReligion,
    prayerIdeas,
    christianChallenges,
    missionsText,
    supportLink,
  } = country.properties;

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
                <h1 className="text-3xl sm:text-4xl font-bold text-center break-words">{name}</h1>
            </header>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-lg">
              <div className="flex justify-between items-start border-b border-gray-700 py-2">
                <span className="text-gray-400 mr-4">People Groups</span>
                <span className="font-semibold text-right">{peopleGroupCount ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start border-b border-gray-700 py-2">
                <span className="text-gray-400 mr-4">Christian %</span>
                <span className="font-semibold text-right">{christianPercentage !== null ? `${christianPercentage}%` : 'N/A'}</span>
              </div>
               <div className="flex justify-between items-start border-b border-gray-700 py-2">
                <span className="text-gray-400 mr-4">Unreached %</span>
                <span className="font-semibold text-right">{unreachedPercentage !== null ? `${unreachedPercentage}%` : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start border-b border-gray-700 py-2">
                <span className="text-gray-400 mr-4">Main Religion</span>
                <span className="font-semibold text-right">{mainReligion ?? 'N/A'}</span>
              </div>
            </section>

            <section className="space-y-8">
                {missionsText && (
                    <CollapsibleSection title="Missions Overview">
                        <p>{missionsText}</p>
                    </CollapsibleSection>
                )}
                
                <AiReporter countryName={name} />

                {christianChallenges && (
                    <CollapsibleSection title="Challenges for Christians">
                        <p>{christianChallenges}</p>
                    </CollapsibleSection>
                )}
                {prayerIdeas && (
                    <CollapsibleSection title="Prayer Ideas">
                        <p>{prayerIdeas}</p>
                    </CollapsibleSection>
                )}
            </section>

            {supportLink && (
                <section className="mt-10 text-center">
                    <a
                        href={supportLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
                    >
                        Learn More & Get Involved
                    </a>
                </section>
            )}
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
            line-height: 1.7;
        }
        .prose-invert {
            --tw-prose-body: theme(colors.gray[400]);
        }
      `}</style>
    </div>
  );
};

export default CountryProfile;