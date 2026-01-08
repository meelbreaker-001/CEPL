import React from 'react';
import { COLLEGE_INFO, SocialLink } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Mail, Clock, Send } from 'lucide-react';

interface AppFooterProps {
  info: typeof COLLEGE_INFO;
}

const CONTACT_PAGE_URL = "https://adhiyamaan.ac.in/ace/contactkeyperson.php";

const AppFooter: React.FC<AppFooterProps> = ({ info }) => {
  return (
    <footer id="footer" className="bg-card text-card-foreground border-t mt-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Address */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-primary">Address</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {info.address.split(',').join(',\n')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-primary">Contact</h4>
            <div className="space-y-2">
              
              {/* Email */}
              <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href={`mailto:${info.email}`} className="hover:text-primary transition-colors">{info.email}</a>
              </div>

              {/* Working Hours */}
              <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{info.workingHours}</span>
              </div>

              {/* Contact Page Button */}
              <div className="pt-4">
                <Button asChild size="sm">
                  <a href={CONTACT_PAGE_URL} target="_blank" rel="noopener noreferrer">
                    <Send className="w-4 h-4 mr-2" />
                    Get in Touch
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-2 text-primary">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-3">
              {info.socials.map((link: SocialLink) => (
                <Button key={link.name} variant="ghost" size="icon" asChild className="hover:bg-accent">
                  <a href={link.url} aria-label={link.name} target="_blank" rel="noopener noreferrer">
                    <link.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {info.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;