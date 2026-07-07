import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'ITIL Problem Management Agent',
  subtitle = 'AI-Powered Problem Analysis & Recommendations',
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-slate-300 text-sm">{subtitle}</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-blue-600 rounded-full px-4 py-2 text-sm font-semibold">
              v1.0
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
