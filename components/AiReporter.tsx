import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import CollapsibleSection from './CollapsibleSection';

interface AiReporterProps {
  countryName: string;
}

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

const AiReporter: React.FC<AiReporterProps> = ({ countryName }) => {
  const [summary, setSummary] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateNewsSummary = async () => {
      setLoading(true);
      setError(null);
      setSummary('');
      setSources([]);

      try {
        if (!process.env.API_KEY) {
          throw new Error("API key is not configured.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Using Google Search, find the most recent news articles about the difficulties for Christians in ${countryName}. Summarize the top three stories into a quick, numbered list.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        setSummary(response.text);
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        setSources(groundingChunks);

      } catch (e) {
        console.error("Error generating news summary:", e);
        setError("Could not load the latest news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    generateNewsSummary();
  }, [countryName]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-gray-400"></div>
          <span>Fetching news...</span>
        </div>
      );
    }
  
    if (error) {
      return <p className="text-red-400">{error}</p>;
    }
  
    const summaryLines = summary.split('\n').filter(line => line.trim() !== '');
  
    return (
      <div className="prose prose-invert max-w-none">
        {summaryLines.length > 0 ? (
          <ul className="list-none p-0 m-0 space-y-2">
              {summaryLines.map((line, index) => (
                  <li key={index}>{line}</li>
              ))}
          </ul>
        ) : (
          <p>No recent news found for this country.</p>
        )}
  
        {sources.length > 0 && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider not-prose">Sources</h4>
            <ul className="list-none p-0 mt-2 space-y-1">
              {sources.map((chunk, index) => (
                chunk.web && (
                  <li key={index} className="text-sm truncate not-prose">
                    <a 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:underline hover:text-blue-300 transition-colors no-underline"
                      title={chunk.web.title}
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <CollapsibleSection title="AI Reporter: Recent News">
      {renderContent()}
    </CollapsibleSection>
  );
};

export default AiReporter;