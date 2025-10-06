
import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const PricingPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Pricing Plans</h1>
        <p className="text-gray-400 mt-2">Choose the plan that's right for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PricingCard
          plan="Starter"
          price="$49"
          description="For individuals and small teams getting started."
          features={[
            '1 Brand to track',
            '5 Keywords',
            'Weekly Reports',
            'Email Support',
          ]}
        />
        <PricingCard
          plan="Business"
          price="$199"
          description="For growing businesses that need more power and flexibility."
          features={[
            '5 Brands to track',
            '50 Keywords',
            'Daily Reports',
            'Priority Email Support',
            'Competitor Tracking',
          ]}
          isPopular={true}
        />
        <PricingCard
          plan="Enterprise"
          price="Custom"
          description="For large organizations with custom needs."
          features={[
            'Unlimited Brands',
            'Unlimited Keywords',
            'Real-time Reports',
            'Dedicated Account Manager',
            'API Access',
          ]}
        />
      </div>
    </div>
  );
};

interface PricingCardProps {
    plan: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, description, features, isPopular = false }) => (
    <Card className={`flex flex-col ${isPopular ? 'border-brand-purple' : ''}`}>
        {isPopular && <div className="bg-brand-purple text-white text-xs font-bold tracking-widest uppercase py-1 px-3 rounded-full self-start -mt-9 -mr-9">Most Popular</div>}
        <h2 className="text-2xl font-bold">{plan}</h2>
        <p className="text-gray-400 mt-2">{description}</p>
        <div className="my-6">
            <span className="text-5xl font-bold">{price}</span>
            <span className="text-gray-400">{price.startsWith('Custom') ? '' : '/ month'}</span>
        </div>
        <ul className="space-y-3 text-gray-300 flex-grow">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                    <IconCheck />
                    <span className="ml-2">{feature}</span>
                </li>
            ))}
        </ul>
        <Button variant={isPopular ? 'primary' : 'secondary'} className="w-full mt-6">
            {plan === 'Enterprise' ? 'Contact Us' : 'Choose Plan'}
        </Button>
    </Card>
);

const IconCheck: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

export default PricingPage;