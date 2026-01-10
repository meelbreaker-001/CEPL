import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Registration } from '@/types/registration';
import { Button } from '@/components/ui/button';

interface EventRegistrationsDialogProps {
  eventId: string | null;
  eventName: string;
  isOpen: boolean;
  onClose: () => void;
}

const EventRegistrationsDialog: React.FC<EventRegistrationsDialogProps> = ({ eventId, eventName, isOpen, onClose }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations(eventId);
    }
  }, [isOpen, eventId]);

  const fetchRegistrations = async (id: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', id)
      .order('registered_at', { ascending: true });

    if (error) {
      showError('Failed to fetch registrations.');
      console.error('Fetch registrations error:', error);
      setRegistrations([]);
    } else {
      setRegistrations(data as Registration[]);
    }
    setIsLoading(false);
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      showError("No data to export.");
      return;
    }

    const headers = ["Full Name", "Email", "Phone", "Department", "Year", "Registered At"];
    const rows = registrations.map(reg => [
      reg.full_name,
      reg.email,
      reg.phone,
      reg.department,
      reg.year,
      new Date(reg.registered_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${eventName.replace(/\s/g, '_')}_registrations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Registrations for "{eventName}"
          </DialogTitle>
          <DialogDescription>
            Total Registrants: {registrations.length}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow min-h-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-full py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No registrations found for this event yet.
            </div>
          ) : (
            <>
              <div className="mb-4 text-right">
                <Button onClick={handleExportCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
              </div>
              <ScrollArea className="h-[60vh] border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Registered At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.full_name}</TableCell>
                        <TableCell>{reg.email}</TableCell>
                        <TableCell>{reg.phone}</TableCell>
                        <TableCell>{reg.department.toUpperCase()}</TableCell>
                        <TableCell>{reg.year}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {new Date(reg.registered_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationsDialog;