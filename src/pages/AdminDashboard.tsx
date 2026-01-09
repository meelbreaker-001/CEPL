import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EVENTS, Event } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, LogOut, Edit2, Trash2, Calendar, Image as ImageIcon, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminEventForm from '@/components/AdminEventForm';
import { showSuccess } from '@/utils/toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    showSuccess('Event deleted successfully');
  };

  const handleSaveEvent = (data: any) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...data } : e));
      showSuccess('Event updated successfully');
    } else {
      const newEvent = { ...data, id: Math.random().toString(36).substr(2, 9) };
      setEvents([newEvent, ...events]);
      showSuccess('New event added successfully');
    }
    setIsDialogOpen(false);
  };

  const upcomingEvents = events.filter(e => e.isUpcoming);
  const pastEvents = events.filter(e => !e.isUpcoming);

  const EventList = ({ items, type }: { items: Event[], type: 'upcoming' | 'past' }) => (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground border rounded-lg bg-background">No {type} events found.</p>
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
                  <div className="flex items-center gap-2">
                    {type === 'past' ? (
                      <Button variant="outline" size="sm" className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary" onClick={() => handleEditEvent(event)}>
                        <ImageIcon className="w-4 h-4 mr-2" /> Update Highlights
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Info
                      </Button>
                    )}
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
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <History className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleAddEvent} size="sm">
              <Plus className="w-4 h-4 mr-2" /> New Event
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past Highlights ({pastEvents.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming">
            <EventList items={upcomingEvents} type="upcoming" />
          </TabsContent>
          
          <TabsContent value="past">
            <EventList items={pastEvents} type="past" />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? (editingEvent.isUpcoming ? 'Edit Event Info' : 'Update Past Highlights') : 'Add New Event'}</DialogTitle>
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