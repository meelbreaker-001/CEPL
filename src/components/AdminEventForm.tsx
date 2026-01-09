import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Event } from '@/lib/data';
import { ImagePlus, X, Upload, ImageIcon, Plus, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { uploadFile } from '@/utils/supabaseStorage';
import { showError } from '@/utils/toast';

const eventSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(5, "Description is required"),
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
  const [isUploading, setIsUploading] = useState(false);
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

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setPosterPreview(initialData.posterUrl);
      setGalleryPreviews(initialData.galleryUrls || []);
    }
  }, [initialData, form]);

  const isUpcoming = form.watch('isUpcoming');

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const url = await uploadFile(file, 'posters');
        setPosterPreview(url);
        form.setValue('posterUrl', url);
      } catch (error: any) {
        showError("Failed to upload poster: " + error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadPromises = files.map(file => uploadFile(file, 'gallery'));
      const urls = await Promise.all(uploadPromises);
      
      const newGallery = [...galleryPreviews, ...urls];
      setGalleryPreviews(newGallery);
      form.setValue('galleryUrls', newGallery);
    } catch (error: any) {
      showError("Failed to upload gallery images: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(newGallery);
    form.setValue('galleryUrls', newGallery);
  };

  return (
    <ScrollArea className="max-h-[80vh] px-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <ImageIcon className="w-4 h-4" />
              <span>1. Main Event Poster</span>
            </div>
            
            <div className="space-y-2">
              {posterPreview && posterPreview !== "/placeholder.svg" ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-primary/20 bg-muted">
                  <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={() => { setPosterPreview(null); form.setValue('posterUrl', "/placeholder.svg"); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative border-primary/20">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handlePosterChange}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <Loader2 className="h-12 w-12 text-primary/60 animate-spin mb-2" />
                  ) : (
                    <ImagePlus className="h-12 w-12 text-primary/60 mb-2" />
                  )}
                  <p className="text-sm font-medium text-primary/80 text-center">
                    {isUploading ? "Uploading..." : "Click to upload the primary event poster"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">2. Basic Details</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl><Input placeholder="Enter event title" {...field} /></FormControl>
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
                    <FormLabel>Event Date</FormLabel>
                    <FormControl><Input placeholder="e.g. October 26, 2024" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isUpcoming"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-primary/5 border-primary/10">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Is this an upcoming event?</FormLabel>
                    </div>
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
                  <FormLabel>{isUpcoming ? "Description / Call to Action" : "Brief Overview"}</FormLabel>
                  <FormControl><Textarea placeholder="What is this event about?" {...field} className="min-h-[80px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isUpcoming && (
            <>
              <Separator />
              <div className="space-y-4 pt-2 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Upload className="w-4 h-4" />
                  <span>3. Event Highlights Gallery</span>
                </div>
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Success Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How did the event go? Mention key highlights, winners, or guest speakers." 
                          {...field} 
                          className="min-h-[120px]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Gallery Photographs (Bulk Upload)</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryPreviews.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md overflow-hidden border shadow-sm group">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className={`relative aspect-square border-2 border-dashed border-primary/20 rounded-md flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleGalleryChange}
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-primary/60 animate-spin" />
                      ) : (
                        <Plus className="h-8 w-8 text-primary/60 mb-1" />
                      )}
                      <span className="text-[10px] font-semibold text-primary/80">
                        {isUploading ? "Uploading..." : "Add Photos"}
                      </span>
                    </label>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">You can select multiple photos at once.</p>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Discard</Button>
            <Button type="submit" className="flex-1 shadow-lg" disabled={isUploading}>
              {isUploading ? "Please Wait..." : "Save Event Details"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default AdminEventForm;