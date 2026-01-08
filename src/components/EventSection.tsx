import React from 'react';
import { Event } from '@/lib/data';
import EventCard from './EventCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <section className="py-8 md:py-12 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">{title}</h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        {/* We use padding on the outer div and negative margin/padding on CarouselContent/Item to achieve edge-to-edge scrolling while respecting container padding */}
        <div className="px-4 md:px-8 lg:px-12">
          <CarouselContent className="-ml-6">
            {events.map((event) => (
              <CarouselItem 
                key={event.id} 
                // Ensure the item takes up the space needed for the 280px card plus padding
                className="pl-6 basis-auto min-w-[280px] max-w-[280px]"
              >
                <EventCard 
                  event={event} 
                  onViewDetails={onViewDetails} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        
        {/* Navigation buttons for desktop/larger screens */}
        <CarouselPrevious className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2" />
        <CarouselNext className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2" />
      </Carousel>
    </section>
  );
};

export default EventSection;