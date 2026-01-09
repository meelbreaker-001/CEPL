import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Event } from '@/lib/data';
import { ImagePlus, X } from 'lucide-react';

const eventSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description should be more detailed"),
  isUpcoming: z.boolean().default(true),
  posterUrl: z.string().min(1, "Poster image is required"),
  summary: z.string().optional(),
});

interface AdminEventFormProps {
  initialData?: Event | null;
  onSubmit: (data: z.infer<typeof eventSchema>) => void;
  onCancel: () => void;
}

const AdminEventForm: React.FC<AdminEventFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [preview, setPreview] = useState<string | null>(initialData?.posterUrl || null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        form.setValue('posterUrl', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    form.setValue('posterUrl', "/placeholder.svg");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Poster Upload Section */}
        <div className="space-y-2">
          <FormLabel>Event Poster</FormLabel>
          {preview && preview !== "/placeholder.svg" ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
              <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click or drag to upload poster</p>
            </div>
          )}
          <FormMessage>{form.formState.errors.posterUrl?.message}</FormMessage>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <FormLabel className="text-sm">Upcoming Event?</FormLabel>
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
              <FormControl><Textarea {...field} className="min-h-[100px]" /></FormControl>
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