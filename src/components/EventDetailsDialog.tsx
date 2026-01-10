import React, { useState, useEffect } from 'react';
import { Event } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Info, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import RegistrationForm from './RegistrationForm';
import { ScrollArea } from './ui/scroll-area';

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ event, isOpen, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsRegistering(false);
    }
  }, [isOpen]);

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2">
            {isRegistering && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsRegistering(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-2xl font-bold line-clamp-1">
              {isRegistering ? "Registration" : event.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-grow">
          <div className="p-6 pt-2">
            {!isRegistering ? (
              <div className="space-y-6">
                {/* Poster Image - Set to full ratio (h-auto) */}
                <div className="w-full bg-muted rounded-xl border shadow-sm overflow-hidden">
                  <img 
                    src={event.posterUrl} 
                    alt={`Poster for ${event.name}`} 
                    className="w-full h-auto block"
                  />
                </div>
                
                <div className="flex items-center text-sm font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full w-fit">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{event.date}</span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-lg border-b pb-1">
                    {event.isUpcoming ? "About the Event" : "Success Story & Highlights"}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {event.isUpcoming ? event.description : (event.summary || event.description)}
                  </p>
                </div>

                {/* Gallery Section for Past Events */}
                {!event.isUpcoming && event.galleryUrls && event.galleryUrls.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <ImageIcon className="w-4 h-4" />
                      <span>Event Gallery</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {event.galleryUrls.map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border shadow-sm bg-muted group cursor-zoom-in">
                          <img 
                            src={url} 
                            alt={`Gallery ${idx}`} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <RegistrationForm 
                eventName={event.name} 
                onSuccess={onClose} 
                onCancel={() => setIsRegistering(false)} 
              />
            )}
          </div>
        </ScrollArea>
        
        {!isRegistering && (
          <div className="p-6 border-t bg-muted/20">
            {event.isUpcoming ? (
              <Button className="w-full shadow-lg" size="lg" onClick={() => setIsRegistering(true)}>
                Register Now
              </Button>
            ) : (
              <Button variant="outline" className="w-full cursor-default" disabled>
                <Info className="w-4 h-4 mr-2" />
                Event Successfully Completed
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;