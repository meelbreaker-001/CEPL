import React from 'react';
import { Event } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Info } from 'lucide-react';

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.name}</DialogTitle>
        </DialogHeader>
        
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
          <Button className="w-full">
            Register / View Button
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            <Info className="w-4 h-4 mr-2" />
            Event Completed
          </Button>
        )}
        
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;