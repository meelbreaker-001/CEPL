import React from 'react';

interface CollegeIdentityProps {
  collegeName: string;
  logoUrl?: string;
}

const CollegeIdentity: React.FC<CollegeIdentityProps> = ({ collegeName, logoUrl }) => {
  return (
    <section id="college-identity" className="py-12 md:py-20 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 text-center">
        {/* Optional logo placeholder */}
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt={`${collegeName} Logo`} 
            className="h-16 mx-auto mb-4" 
          />
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          {collegeName}
        </h1>
        <p className="mt-2 text-base sm:text-lg opacity-80 font-light">
          Official Event Landing Page
        </p>
      </div>
    </section>
  );
};

export default CollegeIdentity;