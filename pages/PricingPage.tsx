
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const BillingToggle: React.FC<{
  billingCycle: 'monthly' | 'annually';
  setBillingCycle: (cycle: 'monthly' | 'annually') => void;
}> = ({ billingCycle, setBillingCycle }) => {
  return (
    <div className="inline-flex items-center gap-2 p-1 bg-gray-500/10 rounded-full">
      <Button
        variant="ghost"
        onClick={() => setBillingCycle('monthly')}
        className={`px-4 py-1.5 text-sm !rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-light-card dark:bg-dark-card shadow-md !text-gray-900 dark:!text-white' : '!bg-transparent !text-gray-500'}`}
      >
        Monthly
      </Button>
      <Button
        variant="ghost"
        onClick={() => setBillingCycle('annually')}
        className={`px-4 py-1.5 text-sm !rounded-full transition-all flex items-center ${billingCycle === 'annually' ? 'bg-light-card dark:bg-dark-card shadow-md !text-gray-900 dark:!text-white' : '!bg-transparent !text-gray-500'}`}
      >
        Annually
        <span className="text-xs font-semibold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full ml-2">Save 20%</span>
      </Button>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-color">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <span className="font-semibold">{question}</span>
                <IconChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-400 animate-fade-in">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const FeatureComparisonTable = () => {
    const featureData = [
        { category: 'Core Tracking', features: [
            { name: 'Brands Tracked', starter: '1', business: '5', enterprise: 'Unlimited' },
            { name: 'Keywords per Brand', starter: '10', business: '50', enterprise: 'Unlimited' },
            { name: 'Competitors per Brand', starter: '3', business: '25', enterprise: 'Unlimited' },
            { name: 'Data Refresh Rate', starter: 'Weekly', business: 'Daily', enterprise: 'Real-time' },
        ]},
        { category: 'Analysis & Insights', features: [
            { name: 'Basic Sentiment Analysis', starter: true, business: true, enterprise: true },
            { name: 'Advanced Sentiment Analysis', starter: false, business: true, enterprise: true },
            { name: 'Actionable Insights', starter: false, business: true, enterprise: true },
            { name: 'Historical Data Access', starter: '90 days', business: '1 year', enterprise: 'Unlimited' },
        ]},
        { category: 'Reporting & Export', features: [
            { name: 'PDF Report Export', starter: true, business: true, enterprise: true },
            { name: 'CSV Data Export', starter: false, business: true, enterprise: true },
            { name: 'API Access', starter: false, business: false, enterprise: true },
        ]},
        { category: 'Team & Support', features: [
            { name: 'Team Seats', starter: '1', business: '3', enterprise: 'Custom' },
            { name: 'Email Support', starter: true, business: true, enterprise: true },
            { name: 'Priority Support', starter: false, business: true, enterprise: true },
            { name: 'Dedicated Account Manager', starter: false, business: false, enterprise: true },
            { name: 'Single Sign-On (SSO)', starter: false, business: false, enterprise: true },
        ]}
    ];

    const renderValue = (value: string | boolean) => {
        if (typeof value === 'boolean') {
            return value ? <IconCheck className="mx-auto" /> : <IconCross className="mx-auto" />;
        }
        return <span className="text-sm">{value}</span>;
    };

    return (
        <div className="overflow-x-auto bg-dark-card p-6 rounded-2xl border border-border-color">
            <table className="w-full min-w-max text-left">
                <thead>
                    <tr className="border-b border-border-color">
                        <th className="p-4 font-semibold text-lg">Features</th>
                        <th className="p-4 font-semibold text-center">Starter</th>
                        <th className="p-4 font-semibold text-center">Business</th>
                        <th className="p-4 font-semibold text-center">Enterprise</th>
                    </tr>
                </thead>
                <tbody>
                    {featureData.map(section => (
                        <React.Fragment key={section.category}>
                            <tr>
                                <td colSpan={4} className="p-4 pt-6 font-bold text-brand-purple tracking-wider uppercase text-sm">{section.category}</td>
                            </tr>
                            {section.features.map(feature => (
                                <tr key={feature.name} className="border-b border-border-color/50 hover:bg-gray-500/10">
                                    <td className="p-4 text-gray-300">{feature.name}</td>
                                    <td className="p-4 text-center">{renderValue(feature.starter)}</td>
                                    <td className="p-4 text-center">{renderValue(feature.business)}</td>
                                    <td className="p-4 text-center">{renderValue(feature.enterprise)}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  return (
    <div className="space-y-16 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold">Flexible plans for every team</h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Choose the plan that's right for you. Cancel or upgrade at any time.</p>
        <div className="mt-8">
          <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <PricingCard
          plan="Starter"
          monthlyPrice={49}
          annualPrice={470}
          billingCycle={billingCycle}
          description="For individuals and small teams dipping their toes into AI visibility tracking."
          features={[
            '1 Brand Tracked',
            '10 Keywords',
            '3 Competitors',
            'Weekly Data Refresh',
            'Basic Sentiment Analysis',
            'Email Support',
          ]}
        />
        <PricingCard
          plan="Business"
          monthlyPrice={199}
          annualPrice={1910}
          billingCycle={billingCycle}
          description="For growing businesses that need more power and flexibility."
          features={[
            '5 Brands to track',
            '50 Keywords',
            '25 Competitors',
            'Daily Data Refresh',
            'Advanced Sentiment Analysis',
            'Actionable Insights',
            'Priority Email Support',
            'Team Collaboration (3 seats)',
          ]}
          isPopular={true}
        />
        <PricingCard
          plan="Enterprise"
          price="Custom"
          description="For large organizations with custom needs and high-volume tracking."
          features={[
            'Unlimited Brands',
            'Unlimited Keywords',
            'Unlimited Competitors',
            'Real-time Data Monitoring',
            'API Access & Integrations',
            'Dedicated Account Manager',
            'Single Sign-On (SSO)',
            'Custom Onboarding & Training',
          ]}
        />
      </div>
        
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
        <FeatureComparisonTable />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem
            question="Can I try BrightRank before committing?"
            answer="Yes! We offer a 14-day free trial on our Starter and Business plans. You can explore all the features and see how AI visibility tracking can benefit your brand."
          />
          <FAQItem
            question="What happens if I exceed my plan's limits?"
            answer="We'll notify you when you're approaching your limits. You can easily upgrade to a higher plan from your settings page at any time. Your billing will be prorated."
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="We accept all major credit cards, including Visa, Mastercard, and American Express. For Enterprise plans, we also support invoicing and bank transfers."
          />
           <FAQItem
            question="Can I change my plan later?"
            answer="Absolutely. You can upgrade, downgrade, or cancel your plan at any time through your account settings. Changes will take effect at the end of your current billing cycle."
          />
        </div>
      </div>
    </div>
  );
};

interface PricingCardProps {
    plan: string;
    price?: "Custom";
    monthlyPrice?: number;
    annualPrice?: number;
    billingCycle?: 'monthly' | 'annually';
    description: string;
    features: string[];
    isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, monthlyPrice, annualPrice, billingCycle, description, features, isPopular = false }) => {
    const displayPrice = price === 'Custom' ? 'Custom' : (billingCycle === 'annually' ? annualPrice : monthlyPrice);
    const period = price !== 'Custom' ? (billingCycle === 'annually' ? '/year' : '/month') : null;

    return (
        <Card className={`flex flex-col h-full ${isPopular ? 'border-brand-purple ring-2 ring-brand-purple' : ''}`}>
            {isPopular && <div className="bg-brand-purple text-white text-xs font-bold tracking-widest uppercase py-1 px-3 rounded-full self-start -mt-9 -mr-9 shadow-lg">Most Popular</div>}
            <h2 className="text-2xl font-bold">{plan}</h2>
            <p className="text-gray-400 mt-2 flex-grow">{description}</p>
            <div className="my-6">
                {price === 'Custom' ? (
                    <span className="text-4xl font-bold">Custom</span>
                ) : (
                    <>
                        <span className="text-4xl font-bold">${displayPrice}</span>
                        <span className="text-gray-400">{period}</span>
                    </>
                )}
            </div>
            <ul className="space-y-3 text-gray-300 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <IconCheck className="flex-shrink-0" />
                        <span className="ml-3">{feature}</span>
                    </li>
                ))}
            </ul>
            <Button variant={isPopular ? 'primary' : 'secondary'} className="w-full mt-8">
                {plan === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
            </Button>
        </Card>
    );
};

const IconCheck: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-green-500 mt-0.5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconChevronDown: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const IconCross: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 mt-0.5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default PricingPage;
