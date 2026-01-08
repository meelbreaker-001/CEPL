import React from 'react';

interface CollegeIdentityProps {
  logoUrl: string;
  redirectUrl: string;
}

const CollegeIdentity: React.FC<CollegeIdentityProps> = ({ logoUrl, redirectUrl }) => {
  return (
    <section id="college-identity" className="py-12 md:py-20 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 text-center">
        
        {/* Logo wrapped in an anchor tag for redirection */}
        <a 
          href={redirectUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mb-4 transition-opacity hover:opacity-80"
          aria-label="Go to College Official Website"
        >
          <img 
            src={logoUrl} 
            alt="College Logo" 
            className="h-16 mx-auto" 
          />
        </a>
        
        {/* Removed h1 college name */}
        
        <p className="mt-2 text-base sm:text-lg opacity-80 font-light">
          Official Event Landing Page
        </p>
      </div>
    </section>
  );
};

export default CollegeIdentity;