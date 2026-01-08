import React from 'react';

interface CollegeIdentityProps {
  collegeName: string;
  logoUrl: string;
  redirectUrl: string;
}

const CollegeIdentity: React.FC<CollegeIdentityProps> = ({ logoUrl, redirectUrl }) => {
  return (
    <section id="college-identity" className="py-8 md:py-12 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 text-center">
        
        {/* Logo wrapped in an anchor tag for redirection */}
        <a 
          href={redirectUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block transition-opacity hover:opacity-80"
          aria-label="Go to College Official Website"
        >
          <img 
            src={logoUrl} 
            alt="College Logo" 
            className="h-16 mx-auto" 
          />
        </a>
        
      </div>
    </section>
  );
};

export default CollegeIdentity;