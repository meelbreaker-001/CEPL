import React from 'react';
import { Event } from '@/lib/data';
import EventCard from './EventCard';

interface EventSectionProps {
  title: string;
  events: Event[];
  onViewDetails: (event: Event) => void;
}

const EventSection: React.FC<EventSectionProps> = ({ title, events, onViewDetails }) => {
  if (events.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">{title}</h2>
        <p className="text-muted-foreground">No events currently listed.</p>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">{title}</h2>
      </div>
      
      {/* Horizontal Scroll Container (Poster-based card layout) */}
      <div className="overflow-x-auto">
        <div className="flex space-x-6 px-4 md:px-8 lg:px-12 py-2">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onViewDetails={onViewDetails} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSection;