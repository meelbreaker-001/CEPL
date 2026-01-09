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
import { ImagePlus, X, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const eventSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description should be more detailed"),
  isUpcoming: z.boolean().default(true),
  posterUrl: z.string().min(1, "Poster image is required"),
  summary: z.string().optional(),
  galleryUrls: z.array(z.string()).optional(),
});

interface AdminEventFormProps {
  initialData?: Event | null;
  onSubmit: (data: z.infer<typeof eventSchema>) => void;
  onCancel: () => void;
}

const AdminEventForm: React.FC<AdminEventFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [posterPreview, setPosterPreview] = useState<string | null>(initialData?.posterUrl || null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(initialData?.galleryUrls || []);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      name: "",
      date: "",
      description: "",
      isUpcoming: true,
      posterUrl: "/placeholder.svg",
      summary: "",
      galleryUrls: [],
    },
  });

  const isUpcoming = form.watch('isUpcoming');

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPosterPreview(base64String);
        form.setValue('posterUrl', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setGalleryPreviews(prev => {
          const newGallery = [...prev, base64String];
          form.setValue('galleryUrls', newGallery);
          return newGallery;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => {
      const newGallery = prev.filter((_, i) => i !== index);
      form.setValue('galleryUrls', newGallery);
      return newGallery;
    });
  };

  return (
    <ScrollArea className="max-h-[80vh] px-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-2">Basic Information</h3>
            
            <div className="space-y-2">
              <FormLabel>Event Poster</FormLabel>
              {posterPreview && posterPreview !== "/placeholder.svg" ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted">
                  <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => { setPosterPreview(null); form.setValue('posterUrl', "/placeholder.svg"); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePosterChange} />
                  <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload main poster</p>
                </div>
              )}
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/20">
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
                  <FormLabel>Event Description</FormLabel>
                  <FormControl><Textarea {...field} className="min-h-[80px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isUpcoming && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium border-b pb-2 text-primary">Past Event Highlights</h3>
              
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Highlights Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share the key takeaways, winners, or moments from the completed event..." 
                        {...field} 
                        className="min-h-[120px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Event Gallery (Multiple Photos)</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {galleryPreviews.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="relative aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-muted/30 hover:bg-muted transition-colors cursor-pointer">
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleGalleryChange} />
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground">Add Photo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default AdminEventForm;