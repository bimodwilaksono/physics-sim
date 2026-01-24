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
    <footer className="py-20 px-4 mt-10">
      <Card className="bg-transparent border-none shadow-none max-w-6xl mx-auto text-center">
        <p className="text-gray-500 text-lg font-medium mb-4">
          Created by Bimo Laksono (A18.2025.00201)
        </p>

        <p className="text-gray-500 text-sm mb-6">
          © 2026 {name}. Built with React and TanStack Router.
        </p>

        <div className='flex-1 text-center'>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="items-center space-x-2  hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700 hover:text-gray-900 transition-color w-24"
          >
            <Button className='bg-[#ff00ff] w-1/5 rounded-md'>
              <Github className="w-5 h-5" />
              <p className="text-sm font-medium">GitHub</p>
            </Button>
          </a>
        </div>
      </Card>
    </footer>
  );
};

export default Footer;
