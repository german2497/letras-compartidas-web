
"use client"

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { placeholderCarouselSlides, type CarouselSlide } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, XCircle, ShieldAlert, Trash2, PlusCircle, UploadCloud } from 'lucide-react';

export default function EditarCarruselPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [originalSlides, setOriginalSlides] = useState<CarouselSlide[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin/editar-carrusel');
    } else {
      const initialSlides = JSON.parse(JSON.stringify(placeholderCarouselSlides)) as CarouselSlide[];
      setSlides(initialSlides);
      setOriginalSlides(JSON.parse(JSON.stringify(placeholderCarouselSlides)) as CarouselSlide[]);
    }
  }, [user, authLoading, router]);

  const handleInputChange = (index: number, field: keyof CarouselSlide, value: string) => {
    const newSlides = [...slides];
    // @ts-ignore
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleImageFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "Archivo Demasiado Grande",
          description: "Por favor, selecciona una imagen de menos de 2MB.",
          variant: "destructive",
        });
        event.target.value = ''; // Clear the input
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de Archivo Inválido",
          description: "Por favor, selecciona un archivo de imagen (ej. PNG, JPG, GIF, WebP).",
          variant: "destructive",
        });
        event.target.value = ''; // Clear the input
        return;
      }
      const newSlides = [...slides];
      newSlides[index].imageUrl = URL.createObjectURL(file);
      setSlides(newSlides);
    }
    event.target.value = ''; // Clear input to allow re-selection of the same file
  };

  const handleRemoveImage = (index: number) => {
    const newSlides = [...slides];
    newSlides[index].imageUrl = 'https://placehold.co/1200x600.png'; // Reset to placeholder or an empty string
    setSlides(newSlides);
    // Clear the file input if it exists (though it's hidden, good practice)
    const fileInput = document.getElementById(`imageUrl-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleAddSlide = () => {
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      title: 'Nueva Diapositiva',
      description: 'Descripción de la nueva diapositiva.',
      imageUrl: 'https://placehold.co/1200x600.png',
      linkUrl: '',
      dataAiHint: 'new slide'
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
  };

  const handleSaveChanges = () => {
    // In a real app, this would be an API call.
    // Here, we directly mutate the placeholder data.
    placeholderCarouselSlides.length = 0; 
    slides.forEach(slide => placeholderCarouselSlides.push(slide)); 

    setOriginalSlides(JSON.parse(JSON.stringify(slides))); 
    toast({ title: "Cambios Guardados", description: "El carrusel ha sido actualizado (simulado)." });
  };

  const handleCancelChanges = () => {
    setSlides(JSON.parse(JSON.stringify(originalSlides))); 
    toast({ title: "Cambios Descartados", description: "No se guardaron las modificaciones.", variant: "default" });
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Cargando...</p></div>;
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Acceso Denegado</h1>
        <p className="text-lg text-muted-foreground">No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={() => router.push('/admin')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel de Admin
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Editar Diapositivas del Carrusel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {slides.map((slide, index) => (
            <Card key={slide.id} className="p-4 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Diapositiva {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <div>
                  <Label htmlFor={`imageUrl-upload-button-${index}`}>Imagen de la Diapositiva</Label>
                  <div className="mt-1 flex items-center gap-x-3">
                    <Button
                      type="button"
                      id={`imageUrl-upload-button-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`imageUrl-upload-${index}`)?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {slide.imageUrl && slide.imageUrl !== 'https://placehold.co/1200x600.png' ? 'Cambiar Imagen' : 'Subir Imagen'}
                    </Button>
                    <input
                      type="file"
                      id={`imageUrl-upload-${index}`}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={(e) => handleImageFileChange(index, e)}
                    />
                    {slide.imageUrl && slide.imageUrl !== 'https://placehold.co/1200x600.png' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Eliminar Imagen
                      </Button>
                    )}
                  </div>
                  {slide.imageUrl && (
                    <div className="mt-3 relative w-full aspect-[16/9] border rounded-md overflow-hidden">
                      <Image src={slide.imageUrl} alt={`Vista previa ${slide.title}`} fill className="object-cover" data-ai-hint={slide.dataAiHint || "slide content"} />
                    </div>
                  )}
                   <p className="text-xs text-muted-foreground mt-1">Sube una imagen (JPG, PNG, GIF, WebP). Máx 2MB.</p>
                </div>

                <div>
                  <Label htmlFor={`title-${index}`}>Título</Label>
                  <Input id={`title-${index}`} value={slide.title} onChange={(e) => handleInputChange(index, 'title', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`description-${index}`}>Descripción</Label>
                  <Textarea id={`description-${index}`} value={slide.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} rows={3} />
                </div>
                <div>
                  <Label htmlFor={`linkUrl-${index}`}>URL del Enlace (Opcional)</Label>
                  <Input id={`linkUrl-${index}`} value={slide.linkUrl || ''} onChange={(e) => handleInputChange(index, 'linkUrl', e.target.value)} placeholder="/ruta-interna o https://externo.com" />
                </div>
                <div>
                  <Label htmlFor={`dataAiHint-${index}`}>Palabras Clave IA (Opcional)</Label>
                  <Input id={`dataAiHint-${index}`} value={slide.dataAiHint || ''} onChange={(e) => handleInputChange(index, 'dataAiHint', e.target.value)} placeholder="Ej: tema diapositiva" />
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-4 flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveSlide(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Diapositiva
                </Button>
              </CardFooter>
            </Card>
          ))}
           <Button variant="outline" onClick={handleAddSlide} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Diapositiva
          </Button>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 mt-6 border-t pt-6">
          <Button variant="outline" onClick={handleCancelChanges}>
            <XCircle className="mr-2 h-4 w-4" /> Cancelar Cambios
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
