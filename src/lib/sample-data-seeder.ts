import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const sampleOperators = [
  {
    name: 'CryptoSkins Pro',
    slug: 'cryptoskins-pro',
    logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop&crop=center',
    hero_image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&crop=center',
    tracking_link: 'https://example.com/cryptoskins',
    launch_year: 2022,
    verdict: '<p>CryptoSkins Pro offers an excellent selection of CS2 skins with competitive prices and fast delivery. Their customer support is responsive and they have a proven track record in the community.</p>',
    bonus_terms: '<p>New users get 5% bonus on first deposit. No wagering requirements. Bonus expires in 30 days.</p>',
    fairness_info: '<p>All transactions are recorded on blockchain for full transparency. Provably fair system with open-source verification.</p>',
    categories: ['CS2', 'Trading', 'Premium'],
    pros: ['Fast withdrawals', 'Great customer support', 'Wide selection of skins', 'Competitive prices'],
    cons: ['Limited payment methods', 'Higher fees on small transactions'],
    supported_countries: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia'],
    ratings: {
      overall: 8.5,
      trust: 9.0,
      value: 8.0,
      payments: 7.5,
      offering: 8.5,
      ux: 8.0,
      support: 9.0,
    },
    kyc_required: true,
    published: true,
  },
  {
    name: 'SkinVault',
    slug: 'skinvault',
    logo_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=center',
    hero_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop&crop=center',
    tracking_link: 'https://example.com/skinvault',
    launch_year: 2021,
    verdict: '<p>SkinVault is a reliable platform for skin trading with a focus on security and user experience. They offer competitive rates and have built a strong reputation in the gaming community.</p>',
    bonus_terms: '<p>Welcome bonus of 10% on deposits over $50. Bonus funds can be used immediately for trading.</p>',
    fairness_info: '<p>Regular third-party audits ensure fair trading practices. All trades are secured with multi-signature technology.</p>',
    categories: ['CS2', 'Rust', 'Trading'],
    pros: ['Low trading fees', 'Mobile-friendly interface', 'Quick verification process', 'Large inventory'],
    cons: ['Limited game selection', 'Withdrawal limits for new users'],
    supported_countries: ['United States', 'Canada', 'European Union', 'Australia', 'Japan'],
    ratings: {
      overall: 7.8,
      trust: 8.5,
      value: 8.5,
      payments: 7.0,
      offering: 7.5,
      ux: 8.0,
      support: 7.5,
    },
    kyc_required: false,
    published: true,
  },
  {
    name: 'GameLoot Exchange',
    slug: 'gameloot-exchange',
    logo_url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop&crop=center',
    hero_image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop&crop=center',
    tracking_link: 'https://example.com/gameloot',
    launch_year: 2023,
    verdict: '<p>GameLoot Exchange is a newer platform that has quickly gained popularity due to its innovative features and competitive pricing. They support multiple games and offer advanced trading tools.</p>',
    bonus_terms: '<p>Tiered bonus system: 3% for deposits under $100, 5% for $100-500, 7% for $500+. No expiration date.</p>',
    fairness_info: '<p>Smart contract-based trading ensures transparency. Real-time market data and price protection features.</p>',
    categories: ['CS2', 'Dota2', 'TF2', 'Multi-Game'],
    pros: ['Multi-game support', 'Advanced trading tools', 'No deposit fees', 'Real-time pricing'],
    cons: ['Newer platform', 'Limited customer support hours', 'Beta features may have bugs'],
    supported_countries: ['Global'],
    ratings: {
      overall: 7.2,
      trust: 7.0,
      value: 8.0,
      payments: 7.5,
      offering: 8.5,
      ux: 7.0,
      support: 6.5,
    },
    kyc_required: true,
    published: true,
  }
];

const sampleReviews = [
  {
    operator_id: '', // Will be filled after operators are created
    content: 'Great platform with fast withdrawals. Customer support helped me resolve an issue within minutes. Highly recommended!',
    rating: 9,
    status: 'approved'
  },
  {
    operator_id: '', // Will be filled after operators are created
    content: 'Good selection of skins and competitive prices. The verification process was quick and straightforward.',
    rating: 8,
    status: 'approved'
  },
  {
    operator_id: '', // Will be filled after operators are created
    content: 'User-friendly interface and reliable service. Had a few minor issues but they were resolved quickly.',
    rating: 7,
    status: 'approved'
  }
];

export async function seedSampleData() {
  try {
    // Check if data already exists
    const { data: existingOperators } = await supabase
      .from('operators')
      .select('id')
      .limit(1);

    if (existingOperators && existingOperators.length > 0) {
      toast.info('Sample data already exists');
      return;
    }

    // Insert operators
    const { data: insertedOperators, error: operatorError } = await supabase
      .from('operators')
      .insert(sampleOperators)
      .select('id');

    if (operatorError) throw operatorError;

    if (insertedOperators && insertedOperators.length > 0) {
      // Insert reviews for each operator
      const reviewsToInsert = insertedOperators.flatMap((operator, index) => 
        sampleReviews.map(review => ({
          ...review,
          operator_id: operator.id
        }))
      );

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewsToInsert);

      if (reviewError) throw reviewError;
    }

    toast.success(`Successfully seeded ${sampleOperators.length} operators with sample data!`);
  } catch (error) {
    console.error('Error seeding sample data:', error);
    toast.error('Failed to seed sample data');
    throw error;
  }
}