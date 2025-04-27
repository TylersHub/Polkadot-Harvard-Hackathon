import { Loan } from "../types";
import { CATEGORIES } from "../config";

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomCategory = (): string => {
  return getRandomElement(CATEGORIES).id;
};

const getRandomTitle = (category: string): string => {
  const titles: Record<string, string[]> = {
    'car': [
      'Vintage Car Restoration Project', 
      'Electric Vehicle Charging Station', 
      'Luxury Car Rental Service',
      'Used Car Dealership Expansion'
    ],
    'bakery': [
      'Artisan Bakery in Downtown', 
      'Organic Pastry Shop', 
      'Vegan Dessert Cafe', 
      'Gluten-Free Bakery Business'
    ],
    'real-estate': [
      'Commercial Property Development', 
      'Residential Apartment Building', 
      'Vacation Rental Property', 
      'Office Space Renovation'
    ],
    'tech': [
      'Tech Startup Expansion', 
      'Mobile App Development', 
      'Software as a Service Platform', 
      'AI Research Initiative'
    ],
    'retail': [
      'Fashion Boutique Launch', 
      'Online Retail Store Expansion', 
      'Pop-up Shop Concept', 
      'Sustainable Retail Business'
    ],
    'other': [
      'Film Production Funding', 
      'Healthcare Service Launch', 
      'Educational Platform Development', 
      'Fitness Center Upgrade'
    ]
  };
  
  return getRandomElement(titles[category] || titles['other']);
};

const getRandomDescription = (category: string): string => {
  const descriptions: Record<string, string[]> = {
    'car': [
      'Looking for investment to expand our premium car service to new locations.',
      'Need funding to purchase new vehicles for our growing car rental business.',
      'Seeking capital to launch an innovative vehicle maintenance service.',
    ],
    'bakery': [
      'Expanding our popular bakery to a second location in the heart of the city.',
      'Need funding to purchase new equipment for our growing artisan bakery.',
      'Capital needed to launch a specialized dessert delivery service from our established bakery.',
    ],
    'real-estate': [
      'Seeking funding for a promising commercial property development in a high-growth area.',
      'Investment opportunity for a residential apartment complex with projected high returns.',
      'Capital needed for renovation of a historic building into modern office spaces.',
    ],
    'tech': [
      'Expanding our successful SaaS platform to new markets and industries.',
      'Seeking investment to scale our AI-powered solution and hire additional developers.',
      'Capital needed to launch our innovative tech product after successful prototype phase.',
    ],
    'retail': [
      'Expanding our popular retail brand to new locations with proven business model.',
      'Investment needed to increase inventory and marketing for our growing online store.',
      'Capital required to launch our innovative retail concept with strong market validation.',
    ],
    'other': [
      'Seeking funding to grow our profitable business with strong track record.',
      'Investment opportunity with clear path to return and established market position.',
      'Capital needed to scale operations and meet growing customer demand.',
    ]
  };
  
  return getRandomElement(descriptions[category] || descriptions['other']);
};

const getRandomImageForCategory = (category: string): string => {
  const images: Record<string, string[]> = {
    'car': [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
      'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    ],
    'bakery': [
      'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg',
      'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg',
      'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg',
    ],
    'real-estate': [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
    ],
    'tech': [
      'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
      'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    ],
    'retail': [
      'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
      'https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg',
      'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg',
    ],
    'other': [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    ]
  };
  
  return getRandomElement(images[category] || images['other']);
};

// Generate random loans
export const getMockListings = (): Promise<Loan[]> => {
  const now = Math.floor(Date.now() / 1000);
  const loans: Loan[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const category = getRandomCategory();
    const principal = (Math.floor(Math.random() * 10) + 1) + '000000000000000000'; // 1-10 ETH
    const startBps = Math.floor(Math.random() * 1500) + 500; // 5-20%
    const minBps = Math.floor(startBps * 0.4); // 40% of startBps
    const maturity = now + (Math.floor(Math.random() * 60) + 15) * 24 * 3600; // 15-75 days in the future
    const funded = Math.random() > 0.5 
      ? (Number(principal) * Math.random() * 0.8).toString() 
      : '0';
      
    loans.push({
      _id: `mock-${i}`,
      loanId: i,
      borrower: `0x${Math.random().toString(16).substring(2, 42)}`,
      principal,
      startBps,
      minBps,
      maturity,
      funded,
      category,
      title: getRandomTitle(category),
      description: getRandomDescription(category),
      imageUrl: getRandomImageForCategory(category),
      __v: 0
    });
  }
  
  return Promise.resolve(loans);
};

// Mock a fund transaction
export const mockFundTransaction = (
  loanId: number,
  investor: string,
  amount: string
): Promise<{ txHash: string }> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const txHash = `0x${Math.random().toString(16).substring(2, 42)}`;
      resolve({ txHash });
    }, 1500);
  });
};

// Mock a withdraw transaction
export const mockWithdrawTransaction = (
  loanId: number,
  investor: string
): Promise<{ txHash: string }> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const txHash = `0x${Math.random().toString(16).substring(2, 42)}`;
      resolve({ txHash });
    }, 1500);
  });
};