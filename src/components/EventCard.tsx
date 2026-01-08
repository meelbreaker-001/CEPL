import React from 'react';
import { Event } from '@/lib/data';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  return (
    <Card 
      className="w-[280px] flex-shrink-0 cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={() => onViewDetails(event)}
    >
      <div className="p-0">
        {/* Poster image area (4:3 aspect ratio for poster look) */}
        <div className="aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
          <img 
            src={event.posterUrl} 
            alt={`Poster for ${event.name}`} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{event.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{event.date}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant={event.isUpcoming ? "default" : "outline"} 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation(); 
            onViewDetails(event);
          }}
        >
          {event.isUpcoming ? "View Details" : "View Summary"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;