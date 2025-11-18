import React, { useState } from 'react';
import WorldMap from './components/WorldMap';
import CountryProfile from './components/CountryProfile';
import type { CountryFeature } from './types';
import DevotionalPage, { Devotional } from './components/DevotionalPage';
import GlobalHeartPage from './components/GlobalHeartPage';
import VocabularyPage from './components/VocabularyPage';

const devotionalData: Devotional[] = [
  { 
    id: 1, 
    title: 'The Heart of the Father', 
    content: "## Day 1 — God’s Heart for the Nations\n\n**Scripture:** “In you all the families of the earth shall be blessed.” — Genesis 12:3\n\nGod’s mission didn’t begin in Matthew—it began in Genesis. From the start, God set His eyes on the world, promising Abraham that every family on earth would one day experience His blessing. The gospel is not plan B; it has always been God’s plan A. You are part of a global story God has been writing since the beginning.\n\n**Prayer:** “Father, thank You for inviting the whole world into Your blessing. Help me to see Your global heart.”"
  },
  { 
    id: 2, 
    title: 'Declare His Glory Everywhere', 
    content: "## Day 2 — Declare His Glory Everywhere\n\n**Scripture:** “Declare His glory among the nations.” — Psalm 96:3\n\nGod calls His people to be His messengers. Whether you’re talking to a friend, praying for another country, or posting something that points to Christ—your voice matters. God uses ordinary people to make His glory known. The mission is global, but it moves through individuals who obey moment by moment.\n\n**Prayer:** “Lord, open my eyes to small moments today where I can declare Your goodness.”" 
  },
  { 
    id: 3, 
    title: 'Jesus Sends Us Out', 
    content: "## Day 3 — Jesus Sends Us Out\n\n**Scripture:** “Go therefore and make disciples of all nations.” — Matthew 28:19\n\nJesus didn’t just save you—He sent you. The Great Commission is not a suggestion for the “super spiritual.” It’s a command for every follower of Jesus. God’s love pushes outward, crossing borders, cultures, and comfort zones. When you go, serve, pray, or give—you’re stepping directly into the mission of Jesus.\n\n**Prayer:** “Jesus, help me live with a ‘sent’ mindset today. Use me wherever I am.”" 
  },
  { 
    id: 4, 
    title: 'Pray for the Harvest', 
    content: "## Day 4 — Pray for the Harvest\n\n**Scripture:** “Pray earnestly to the Lord of the harvest.” — Matthew 9:37–38\n\nBefore anyone goes, Jesus says: pray. Prayer is where evangelism begins. You can’t open a heart—but God can. Through prayer you join the Lord of the harvest, asking Him to raise up laborers, open doors, and save those far from Him. Every revival in history began with prayer.\n\n**Prayer:** “Lord of the harvest, lay specific people on my heart today. Teach me to pray faithfully for them.”"
  },
  { 
    id: 5, 
    title: 'Boldness Comes From Prayer', 
    content: "## Day 5 — Boldness Comes From Prayer\n\n**Scripture:** “Pray… that I may declare it boldly.” — Ephesians 6:19\n\nEven Paul—the boldest evangelist in Scripture—asked for prayer. Courage isn’t personality; it’s a gift God supplies. When you feel hesitant, remember: God never expects you to share in your own strength. Prayer fuels boldness. The Spirit empowers ordinary believers to speak extraordinary truth.\n\n**Prayer:** “God, fill me with boldness that doesn’t come from me but from Your Spirit.”"
  },
  { 
    id: 6, 
    title: 'Prayer Opens Doors', 
    content: "## Day 6 — Prayer Opens Doors\n\n**Scripture:** “Pray… that God may open to us a door for the word.” — Colossians 4:3\n\nYou cannot force opportunities—but you can pray for them. Paul saw open hearts, divine appointments, and gospel conversations because he continually prayed for God to create supernatural openings. Ask God for open doors today: a conversation, a question, an unexpected moment.\n\n**Prayer:** “Father, open the right doors today and make me ready when they open.”"
  },
  { 
    id: 7, 
    title: 'God Finishes What He Started', 
    content: "## Day 7 — God Finishes What He Started\n\n**Scripture:** “A great multitude… from every nation.” — Revelation 7:9\n\nHere is the end of the story: the mission succeeds. God’s Word reaches every nation. People from every culture stand before His throne. The global plan of God cannot fail. When you share the gospel or pray for the lost, you are participating in a victory God has already guaranteed.\n\n**Prayer:** “Lord, thank You that Your mission will not fail. Use my life as part of what You are finishing.”" 
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'map' | 'profile' | 'globalHeart' | 'devotional' | 'vocabulary'>('map');
  const [profileCountry, setProfileCountry] = useState<CountryFeature | null>(null);
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleViewProfile = (country: CountryFeature) => {
    setProfileCountry(country);
    setCurrentView('profile');
  };

  const handleBackToMap = () => {
    setProfileCountry(null);
    setCurrentView('map');
  };

  const handleShowGlobalHeartPage = () => {
    setCurrentView('globalHeart');
  };
  
  const handleShowVocabularyPage = () => {
    setCurrentView('vocabulary');
  };

  const handleSelectDevotional = (devotional: Devotional) => {
    setSelectedDevotional(devotional);
    setCurrentView('devotional');
  };

  const handleBackToGlobalHeart = () => {
    setSelectedDevotional(null);
    setCurrentView('globalHeart');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return profileCountry && <CountryProfile country={profileCountry} onBack={handleBackToMap} />;
      case 'globalHeart':
        return <GlobalHeartPage devotionalData={devotionalData} onBack={handleBackToMap} onSelectDevotional={handleSelectDevotional} />;
      case 'devotional':
        return selectedDevotional && <DevotionalPage devotional={selectedDevotional} onBack={handleBackToGlobalHeart} />;
      case 'vocabulary':
        return <VocabularyPage onBack={handleBackToMap} />;
      case 'map':
      default:
        return (
          <>
            <div className="absolute inset-0">
              <WorldMap onViewProfile={handleViewProfile} />
            </div>
            <header className="absolute top-0 left-0 p-4 sm:p-6 text-white z-20">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-gray-800/80 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Open menu"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9h18" />
                            </svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-full mt-2 w-64 bg-gray-800 rounded-lg shadow-2xl overflow-hidden animate-fade-in-fast origin-top-left">
                                <button
                                    onClick={() => { handleShowGlobalHeartPage(); setIsMenuOpen(false); }}
                                    className="block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                                >
                                    Grow Your Heart for the Nations
                                </button>
                                <button
                                    onClick={() => { handleShowVocabularyPage(); setIsMenuOpen(false); }}
                                    className="block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                                >
                                    What Dat Mean?
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="pointer-events-none">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            Interactive Missions Map
                        </h1>
                        <p className="text-sm sm:text-base text-gray-300" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                            Pan with your mouse and scroll to zoom
                        </p>
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
            
            <footer className="absolute bottom-4 right-4 bg-gray-900/80 p-3 rounded-lg shadow-lg text-white w-48 z-10 pointer-events-none">
              <h3 className="text-sm font-bold mb-2 text-center">Christian Population %</h3>
              <div className="w-full h-4 rounded-md bg-gradient-to-r from-[#d6604d] via-[#f7f7f7] to-[#4393c3]"></div>
              <div className="flex justify-between text-xs mt-1 text-gray-300">
                  <span>Low</span>
                  <span>High</span>
              </div>
            </footer>
          </>
        );
    }
  };

  return (
    <main className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      {renderContent()}
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.2s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default App;