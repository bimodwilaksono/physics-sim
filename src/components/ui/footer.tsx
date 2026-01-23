import React from 'react';
import { Github } from 'lucide-react';
import { Card } from './pixelact-ui/card';
import { Button } from './pixelact-ui/button';

interface FooterProps {
  githubUrl?: string;
  name?: string;
}

const Footer: React.FC<FooterProps> = ({
  githubUrl = "https://github.com/bimodwilaksono/physics-sim",
  name = "Physics Simulator"
}) => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-12 px-4 mt-auto">
      <Card className="max-w-6xl mx-auto text-center">
        <div className="text-gray-800 text-lg font-medium mb-4">
          Created by Bimo Laksono (A18.2025.00201)
        </div>

        <p className="text-gray-600 text-sm mb-6">
          © 2026 {name}. Built with React and TanStack Router.
        </p>

        <div className='flex-1 text-center'>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Button>
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </Button>
          </a>
        </div>
      </Card>
    </footer>
  );
};

export default Footer;
