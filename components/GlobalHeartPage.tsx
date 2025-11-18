import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import type { Devotional } from './DevotionalPage';

interface GlobalHeartPageProps {
  onBack: () => void;
  onSelectDevotional: (devotional: Devotional) => void;
  devotionalData: Devotional[];
}

const GlobalHeartPage: React.FC<GlobalHeartPageProps> = ({ onBack, onSelectDevotional, devotionalData }) => {
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
                  A Heart for the Nations: Prayer and Discipleship
                </h1>
            </header>
            
            <main className="space-y-8 mt-6">
              <CollapsibleSection title="God's Global Plan">
                  <div className="space-y-4">
                      <p><strong>God’s Global Plan for His Word to Reach the Whole World</strong></p>
                      <p>From the beginning, God has revealed that His purpose is not limited to one nation but extends to all peoples. When He called Abraham, He promised, “in you all the families of the earth shall be blessed” (Genesis 12:3). This blessing ultimately points to the gospel—God’s plan to redeem every nation through Christ.</p>
                      <p>The Psalms echo this global vision: “Declare His glory among the nations, His marvelous works among all peoples” (Psalm 96:3). God’s heart is that every nation would know Him, worship Him, and turn to Him.</p>
                      <p>Jesus made this mission unmistakably clear. Before He ascended, He commanded, “Go therefore and make disciples of all nations” (Matthew 28:19) and “Go into all the world and proclaim the gospel to the whole creation” (Mark 16:15). The goal is global: every tribe, every language, every person.</p>
                      <p>The New Testament shows that this is not a new plan but the fulfillment of what God always intended. Paul writes that God’s desire is that “all people be saved and come to the knowledge of the truth” (1 Timothy 2:4). The message is for everyone, everywhere.</p>
                      <p>And Scripture closes with the vision of the plan completed—“a great multitude… from every nation, from all tribes and peoples and languages” standing before the throne (Revelation 7:9). God’s Word will reach the ends of the earth, and people from every corner of the world will respond in worship.</p>
                  </div>
              </CollapsibleSection>

              <CollapsibleSection title="The Power of Prayer">
                  <div className="space-y-4">
                      <p><strong>The Power of Prayer in God’s Mission to Save the Lost</strong></p>
                      <p>Scripture shows that prayer is not optional in evangelism—it is the power behind it. Jesus Himself taught that reaching people begins with prayer. He said, “The harvest is plentiful, but the laborers are few; therefore pray earnestly to the Lord of the harvest to send out laborers into His harvest” (Matthew 9:37–38). Before anyone goes, God calls His people to pray.</p>
                      <p>Paul modeled this dependence on prayer. He asked believers to pray that God would “open to us a door for the word” (Colossians 4:3) and that he would proclaim the gospel “boldly” (Ephesians 6:19). Effective evangelism requires God to open hearts and empower His messengers, and prayer is how we seek that power.</p>
                      <p>Prayer also prepares the hearts of unbelievers. Paul reminds us that only God can “shine in our hearts to give the light of the knowledge of the glory of God” (2 Corinthians 4:6). Evangelism is spiritual work, and only God can give spiritual sight—so we pray for Him to move.</p>
                      <p>Even the early church advanced through prayer. Before the gospel spread past Jerusalem, they “devoted themselves to prayer” (Acts 1:14). After praying, “they were all filled with the Holy Spirit and continued to speak the word of God with boldness” (Acts 4:31). Prayer preceded power.</p>
                      <p>Ultimately, prayer aligns our hearts with God’s mission. When we pray, we join His heart for the lost and seek His strength, not our own. As Jesus promised, “Apart from Me you can do nothing” (John 15:5)—but through prayer, God does what we never could.</p>
                  </div>
              </CollapsibleSection>
              
              {/* Box 3: Daily Devotionals */}
              <div>
                  <h2 className="text-2xl font-semibold mb-3 text-gray-300">Daily Devotionals</h2>
                  <div className="bg-gray-900/50 p-4 rounded-md">
                      <div className="prose prose-invert max-w-none text-gray-400">
                          <p>A collection of short readings designed to help grow your passion for global missions.</p>
                      </div>
                      <ul className="space-y-3 mt-4">
                        {devotionalData.map(devotional => (
                          <li key={devotional.id} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-md">
                              <span>{devotional.title}</span>
                              <button 
                                onClick={() => onSelectDevotional(devotional)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors"
                              >
                                Read
                              </button>
                          </li>
                        ))}
                      </ul>
                  </div>
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
        .prose {
            line-height: 1.7;
        }
      `}</style>
    </div>
  );
};

export default GlobalHeartPage;
