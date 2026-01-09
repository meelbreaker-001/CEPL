import React, { useState, useEffect } from 'react';
import { Event } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Info, ArrowLeft } from 'lucide-react';
import RegistrationForm from './RegistrationForm';

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
      <DialogContent className="sm:max-w-[425px] md:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
            <DialogTitle className="text-2xl">
              {isRegistering ? "Registration" : event.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        {!isRegistering ? (
          <>
            <div className="space-y-4 py-2">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={event.posterUrl} 
                  alt={`Poster for ${event.name}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-medium">{event.date}</span>
              </div>

              <h3 className="font-semibold text-lg mt-4">
                {event.isUpcoming ? "Event Description" : "Event Summary"}
              </h3>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.isUpcoming ? event.description : event.summary}
              </p>
            </div>
            
            {event.isUpcoming ? (
              <Button className="w-full" onClick={() => setIsRegistering(true)}>
                Register Now
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                <Info className="w-4 h-4 mr-2" />
                Event Completed
              </Button>
            )}
          </>
        ) : (
          <RegistrationForm 
            eventName={event.name} 
            onSuccess={onClose} 
            onCancel={() => setIsRegistering(false)} 
          />
        )}
        
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;