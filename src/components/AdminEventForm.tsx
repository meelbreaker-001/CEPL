import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Event } from '@/lib/data';

const eventSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description should be more detailed"),
  isUpcoming: z.boolean().default(true),
  posterUrl: z.string().url("Must be a valid URL").or(z.literal("/placeholder.svg")),
  summary: z.string().optional(),
});

interface AdminEventFormProps {
  initialData?: Event | null;
  onSubmit: (data: z.infer<typeof eventSchema>) => void;
  onCancel: () => void;
}

const AdminEventForm: React.FC<AdminEventFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      name: "",
      date: "",
      description: "",
      isUpcoming: true,
      posterUrl: "/placeholder.svg",
      summary: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl><Input placeholder="e.g. Oct 25, 2024" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isUpcoming"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel>Upcoming Event?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!form.watch('isUpcoming') && (
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Past Event Summary</FormLabel>
                <FormControl><Textarea placeholder="Highlights of the completed event..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="flex-1">Save Event</Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminEventForm;