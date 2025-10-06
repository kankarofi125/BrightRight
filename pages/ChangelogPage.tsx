
import React from 'react';
import Card from '../components/Card';

const ChangelogPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <p className="text-gray-400 mt-2">See what's new in BrightRank.</p>
      </div>

      <Card>
        <ChangelogEntry
          version="v1.2.0"
          date="October 25, 2023"
          changes={{
            new: ['Added Competitor Tracking feature.', 'Introduced PDF report exports.'],
            improved: ['Enhanced sentiment analysis accuracy.', 'Redesigned the main dashboard for better clarity.'],
            fixed: ['Fixed a bug where keyword analysis would occasionally fail.'],
          }}
        />
        <ChangelogEntry
          version="v1.1.0"
          date="October 10, 2023"
          changes={{
            new: ['Launched the Reports page for historical trend analysis.'],
            improved: ['Sidebar navigation is now collapsible.'],
          }}
        />
        <ChangelogEntry
          version="v1.0.0"
          date="September 28, 2023"
          changes={{
            new: ['Initial launch of BrightRank! Welcome!', 'Dashboard and Keyword Tracking features are live.'],
          }}
        />
      </Card>
    </div>
  );
};

interface ChangelogEntryProps {
    version: string;
    date: string;
    changes: {
        new?: string[];
        improved?: string[];
        fixed?: string[];
    };
}

const ChangelogEntry: React.FC<ChangelogEntryProps> = ({ version, date, changes }) => (
    <div className="py-6 border-b border-border-color">
        <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">{version}</h2>
            <p className="text-gray-400">{date}</p>
        </div>
        <div className="mt-4 space-y-4">
            {changes.new && <ChangeList title="New" items={changes.new} color="bg-blue-500" />}
            {changes.improved && <ChangeList title="Improved" items={changes.improved} color="bg-purple-500" />}
            {changes.fixed && <ChangeList title="Fixed" items={changes.fixed} color="bg-green-500" />}
        </div>
    </div>
);

interface ChangeListProps {
    title: string;
    items: string[];
    color: string;
}

const ChangeList: React.FC<ChangeListProps> = ({ title, items, color }) => (
    <div>
        <h3 className={`inline-block text-sm font-semibold text-white px-2 py-1 rounded ${color}`}>{title}</h3>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);

export default ChangelogPage;