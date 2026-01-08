import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS, Event, COLLEGE_INFO } from '@/lib/data';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EventDetailsDialog from '@/components/EventDetailsDialog';
import AppFooter from '@/components/AppFooter';

const AllEventsPage: React.FC = () => {
  const { type } = useParams<{ type: 'upcoming' | 'past' }>();
  
  const isUpcoming = type === 'upcoming';
  const title = isUpcoming ? "All Upcoming Events" : "All Past Event Highlights";
  
  const events = MOCK_EVENTS.filter(e => e.isUpcoming === isUpcoming);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
        </div>

        {events.length === 0 ? (
          <p className="text-muted-foreground mt-8">No {isUpcoming ? 'upcoming' : 'past'} events currently listed.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {events.map((event) => (
              <div key={event.id} className="flex justify-center">
                <EventCard 
                  event={event} 
                  onViewDetails={handleViewDetails} 
                />
              </div>
            ))}
          </div>
        )}

        <EventDetailsDialog 
          event={selectedEvent} 
          isOpen={isDialogOpen} 
          onClose={handleCloseDialog} 
        />
      </main>
      <AppFooter info={COLLEGE_INFO} />
    </div>
  );
};

export default AllEventsPage;