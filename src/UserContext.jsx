import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const DEFAULT_USER = {
  name: '',
  profession: '',
  interests: [],
  experienceLevel: '',
  onboardingComplete: false,
};

const DEFAULT_INTERESTS = ['Trending', 'Markets', 'Business', 'Technology'];

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('etNavigatorUser');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('etNavigatorChatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('etNavigatorUser', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('etNavigatorChatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const extractUserData = (history) => {
    const extracted = { ...DEFAULT_USER };
    const fullText = history.map(m => m.content.toLowerCase()).join(' ');
    
    // Extract name from user messages
    for (const msg of history) {
      if (msg.role === 'user') {
        const namePatterns = [
          /(?:my name is|i'm|i am|call me|it's|name's)\s+([a-zA-Z]+)/i,
          /^([A-Z][a-z]+)$/,
        ];
        for (const pattern of namePatterns) {
          const match = msg.content.match(pattern);
          if (match && match[1] && match[1].length > 1 && match[1].length < 20) {
            extracted.name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
            break;
          }
        }
        // Also check if single word response (likely a name)
        if (!extracted.name && msg.content.trim().split(/\s+/).length === 1) {
          const word = msg.content.trim();
          if (/^[A-Za-z]{2,15}$/.test(word)) {
            extracted.name = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
        }
        if (extracted.name) break;
      }
    }

    // Extract profession
    const professionKeywords = {
      Student: ['student', 'studying', 'college', 'university', 'school'],
      Professional: ['working', 'work at', 'job', 'employed', 'engineer', 'developer', 'manager', 'analyst'],
      Entrepreneur: ['entrepreneur', 'startup', 'founder', 'business owner', 'freelancer'],
      Investor: ['investor', 'trader', 'trading', 'investing'],
      Retired: ['retired', 'retirement'],
    };

    for (const [profession, keywords] of Object.entries(professionKeywords)) {
      if (keywords.some(k => fullText.includes(k))) {
        extracted.profession = profession;
        break;
      }
    }

    // Extract interests
    const interestKeywords = {
      'Markets': ['market', 'stocks', 'trading', 'equity', 'shares', 'nifty', 'sensex', 'investment'],
      'Geopolitics': ['geopolitics', 'politics', 'global', 'international', 'world affairs'],
      'Technology': ['technology', 'tech', 'software', 'ai', 'artificial intelligence', 'digital'],
      'Crypto': ['crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'web3'],
      'Finance': ['finance', 'money', 'wealth', 'personal finance', 'tax', 'banking'],
      'Business': ['business', 'corporate', 'companies', 'industry', 'enterprise'],
      'Learning': ['learning', 'courses', 'education', 'skills', 'masterclass', 'upskill'],
      'News': ['news', 'current affairs', 'updates', 'daily', 'headlines'],
    };

    const foundInterests = [];
    for (const [interest, keywords] of Object.entries(interestKeywords)) {
      if (keywords.some(k => fullText.includes(k))) {
        foundInterests.push(interest);
      }
    }
    extracted.interests = foundInterests.length > 0 ? foundInterests : DEFAULT_INTERESTS;

    // Extract experience level
    if (fullText.includes('beginner') || fullText.includes('new to') || fullText.includes('just started')) {
      extracted.experienceLevel = 'Beginner';
    } else if (fullText.includes('intermediate') || fullText.includes('some experience')) {
      extracted.experienceLevel = 'Intermediate';
    } else if (fullText.includes('expert') || fullText.includes('experienced') || fullText.includes('advanced')) {
      extracted.experienceLevel = 'Advanced';
    }

    return extracted;
  };

  const completeOnboarding = () => {
    const extracted = extractUserData(chatHistory);
    setUser({ ...extracted, onboardingComplete: true });
  };

  const resetUser = () => {
    setUser(DEFAULT_USER);
    setChatHistory([]);
    localStorage.removeItem('etNavigatorUser');
    localStorage.removeItem('etNavigatorChatHistory');
  };

  const getDisplayInterests = () => {
    return user.interests.length > 0 ? user.interests : DEFAULT_INTERESTS;
  };

  return (
    <UserContext.Provider value={{
      user,
      chatHistory,
      setChatHistory,
      updateUser,
      completeOnboarding,
      resetUser,
      getDisplayInterests,
      DEFAULT_INTERESTS,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
