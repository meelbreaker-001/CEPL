import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { COLLEGE_INFO, Event } from '@/lib/data';
import CollegeIdentity from '@/components/CollegeIdentity';
import EventSection from '@/components/EventSection';
import AppFooter from '@/components/AppFooter';
import EventDetailsDialog from '@/components/EventDetailsDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
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

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const upcomingEvents = events.filter(e => e.isUpcoming);
  const pastEvents = events.filter(e => !e.isUpcoming);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full shadow-sm" asChild>
          <Link to="/admin">
            <ShieldCheck className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Admin Login</span>
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      <CollegeIdentity 
        collegeName={COLLEGE_INFO.name}
        logoUrl="https://adhiyamaan.ac.in/ace/images/logo33.gif" 
        redirectUrl="https://adhiyamaan.ac.in/ace/" 
      />

      <main className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-muted-foreground">Loading college events...</div>
          </div>
        ) : (
          <>
            <EventSection 
              title="Discover Upcoming Events"
              events={upcomingEvents}
              onViewDetails={handleViewDetails}
              autoplay={true}
            />
            
            <div className="container mx-auto px-4">
              <Separator />
            </div>

            <EventSection 
              title="Past Event Highlights"
              events={pastEvents}
              onViewDetails={handleViewDetails}
            />
          </>
        )}
        
        <div className="container mx-auto px-4 py-4">
          <Separator />
        </div>

        <MadeWithDyad />
      </main>

      <AppFooter info={COLLEGE_INFO} />

      <EventDetailsDialog 
        event={selectedEvent} 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
      />
    </div>
  );
};

export default Index;