import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Event, COLLEGE_INFO } from '@/lib/data';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import EventDetailsDialog from '@/components/EventDetailsDialog';
import AppFooter from '@/components/AppFooter';

const AllEventsPage: React.FC = () => {
  const { type } = useParams<{ type: 'upcoming' | 'past' }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isUpcoming = type === 'upcoming';
  const title = isUpcoming ? "All Upcoming Events" : "All Past Event Highlights";

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_upcoming', isUpcoming)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedEvents = data.map((e: any) => ({
          id: e.id,
          name: e.name,
          date: e.date,
          description: e.description,
          isUpcoming: e.is_upcoming,
          posterUrl: e.poster_url,
          summary: e.summary,
          galleryUrls: e.gallery_urls,
        }));
        setEvents(mappedEvents);
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, [isUpcoming]);

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

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
          </div>
        ) : events.length === 0 ? (
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