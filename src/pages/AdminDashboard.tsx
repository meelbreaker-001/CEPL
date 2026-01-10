import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, LogOut, Edit2, Trash2, Calendar, Image as ImageIcon, History, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminEventForm from '@/components/AdminEventForm';
import { showSuccess, showError } from '@/utils/toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchEvents();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError('Failed to fetch events');
    } else {
      // Map snake_case from DB to camelCase for UI
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleAddUpcomingEvent = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleAddPastHighlight = () => {
    setEditingEvent({
      id: '',
      name: '',
      date: '',
      description: '',
      isUpcoming: false,
      posterUrl: '/placeholder.svg',
      summary: '',
      galleryUrls: []
    } as Event);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      showError('Failed to delete event');
    } else {
      setEvents(events.filter(e => e.id !== id));
      showSuccess('Event deleted successfully');
    }
  };

  const handleSaveEvent = async (formData: any) => {
    const dbData = {
      name: formData.name,
      date: formData.date,
      description: formData.description,
      is_upcoming: formData.isUpcoming,
      poster_url: formData.posterUrl,
      summary: formData.summary,
      gallery_urls: formData.galleryUrls,
    };

    if (editingEvent && editingEvent.id) {
      const { error } = await supabase
        .from('events')
        .update(dbData)
        .eq('id', editingEvent.id);

      if (error) {
        showError('Failed to update event');
      } else {
        showSuccess('Event updated successfully');
        fetchEvents();
      }
    } else {
      const { error } = await supabase
        .from('events')
        .insert([dbData]);

      if (error) {
        showError('Failed to add event');
      } else {
        showSuccess('New event added successfully');
        fetchEvents();
      }
    }
    setIsDialogOpen(false);
  };

  const upcomingEvents = events.filter(e => e.isUpcoming);
  const pastEvents = events.filter(e => !e.isUpcoming);

  const EventList = ({ items, type }: { items: Event[], type: 'upcoming' | 'past' }) => (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground border rounded-lg bg-background">
          {isLoading ? 'Loading events...' : `No ${type} events found.`}
        </p>
      ) : (
        items.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-32 bg-muted flex items-center justify-center p-4">
                {event.posterUrl && event.posterUrl !== "/placeholder.svg" ? (
                  <img src={event.posterUrl} alt="" className="w-full h-20 object-cover rounded shadow-sm" />
                ) : (
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <CardContent className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> {event.date}
                    </p>
                    {type === 'past' && event.galleryUrls && (
                      <p className="text-xs text-primary font-medium flex items-center mt-1">
                        <ImageIcon className="w-3 h-3 mr-1" /> {event.galleryUrls.length} photos in gallery
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                      <Edit2 className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">{type === 'past' ? 'Update Highlights' : 'Edit Info'}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-auto py-3 md:h-16 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <History className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddUpcomingEvent} size="sm">
              <Plus className="w-4 h-4 mr-2" /> New Upcoming Event
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past Highlights ({pastEvents.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="past" className="p-0 m-0 w-full sm:w-auto data-[state=active]:hidden sm:data-[state=active]:block">
              <Button variant="outline" onClick={handleAddPastHighlight} className="border-primary text-primary hover:bg-primary/5 w-full sm:w-auto">
                <Upload className="w-4 h-4 mr-2" /> New Highlight
              </Button>
            </TabsContent>
          </div>
          
          {/* Past Highlights button for mobile when past tab is active */}
          <TabsContent value="past" className="p-0 m-0 w-full sm:w-auto data-[state=inactive]:hidden sm:data-[state=inactive]:hidden">
            <div className="mb-4 flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
              <div>
                <h3 className="font-semibold">Event Gallery & Success Stories</h3>
                <p className="text-sm text-muted-foreground">Share summaries and photos from completed events.</p>
              </div>
              <Button variant="outline" onClick={handleAddPastHighlight} className="border-primary text-primary hover:bg-primary/5">
                <Upload className="w-4 h-4 mr-2" /> New Highlight
              </Button>
            </div>
            <EventList items={pastEvents} type="past" />
          </TabsContent>

          <TabsContent value="upcoming">
            <EventList items={upcomingEvents} type="upcoming" />
          </TabsContent>
          
          <TabsContent value="past" className="data-[state=inactive]:hidden sm:data-[state=inactive]:block">
            <div className="mb-4 hidden sm:flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
              <div>
                <h3 className="font-semibold">Event Gallery & Success Stories</h3>
                <p className="text-sm text-muted-foreground">Share summaries and photos from completed events.</p>
              </div>
              <Button variant="outline" onClick={handleAddPastHighlight} className="border-primary text-primary hover:bg-primary/5">
                <Upload className="w-4 h-4 mr-2" /> New Highlight
              </Button>
            </div>
            <EventList items={pastEvents} type="past" />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent && editingEvent.id 
                ? (editingEvent.isUpcoming ? 'Edit Event Info' : 'Update Past Highlights') 
                : (editingEvent && !editingEvent.isUpcoming ? 'Upload New Past Highlight' : 'Add New Upcoming Event')}
            </DialogTitle>
          </DialogHeader>
          <AdminEventForm 
            initialData={editingEvent}
            onSubmit={handleSaveEvent}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;