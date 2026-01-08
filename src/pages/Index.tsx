import React, { useState } from 'react';
import { MOCK_EVENTS, COLLEGE_INFO, Event } from '@/lib/data';
import CollegeIdentity from '@/components/CollegeIdentity';
import EventSection from '@/components/EventSection';
import AppFooter from '@/components/AppFooter';
import EventDetailsDialog from '@/components/EventDetailsDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* 1. College Identity Section */}
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
        />
        
        {/* Separator for visual clarity */}
        <div className="container mx-auto px-4">
          <hr className="border-t border-border" />
        </div>

        {/* 3. Past Events Section */}
        <EventSection 
          title="Past Event Highlights"
          events={pastEvents}
          onViewDetails={handleViewDetails}
        />
        
        <MadeWithDyad />
      </main>

      {/* 4. Footer Section */}
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