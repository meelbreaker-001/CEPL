import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { MOCK_EVENTS, COLLEGE_INFO, Event } from '@/lib/data';
import CollegeIdentity from '@/components/CollegeIdentity';
import EventSection from '@/components/EventSection';
import AppFooter from '@/components/AppFooter';
import EventDetailsDialog from '@/components/EventDetailsDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Filter events based on status
  const upcomingEvents = MOCK_EVENTS.filter(e => e.isUpcoming);
  const pastEvents = MOCK_EVENTS.filter(e => !e.isUpcoming);

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
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      
      {/* Top right actions */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full shadow-sm" asChild>
          <Link to="/admin">
            <ShieldCheck className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Admin Login</span>
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      {/* 1. College Identity Section (has its own border-b) */}
      <CollegeIdentity 
        collegeName={COLLEGE_INFO.name}
        logoUrl="https://adhiyamaan.ac.in/ace/images/logo33.gif" 
        redirectUrl="https://adhiyamaan.ac.in/ace/" 
      />

      <main className="flex-grow">
        
        {/* 2. Discover Events Section */}
        <EventSection 
          title="Discover Upcoming Events"
          events={upcomingEvents}
          onViewDetails={handleViewDetails}
          autoplay={true}
        />
        
        <div className="container mx-auto px-4">
          <Separator />
        </div>

        {/* 3. Past Events Section */}
        <EventSection 
          title="Past Event Highlights"
          events={pastEvents}
          onViewDetails={handleViewDetails}
        />
        
        <div className="container mx-auto px-4 py-4">
          <Separator />
        </div>

        <MadeWithDyad />
      </main>

      {/* 4. Footer Section (has its own border-t) */}
      <AppFooter info={COLLEGE_INFO} />

      {/* Event Details Dialog */}
      <EventDetailsDialog 
        event={selectedEvent} 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
      />
    </div>
  );
};

export default Index;