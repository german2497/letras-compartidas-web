
"use client"

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { placeholderGalleryImages, type GalleryImage } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, XCircle, ShieldAlert, Trash2, PlusCircle, UploadCloud } from 'lucide-react';

export default function GestionarGaleriaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [originalGalleryItems, setOriginalGalleryItems] = useState<GalleryImage[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin/gestionar-galeria');
    } else {
      const initialItems = JSON.parse(JSON.stringify(placeholderGalleryImages)) as GalleryImage[];
      setGalleryItems(initialItems);
      setOriginalGalleryItems(JSON.parse(JSON.stringify(placeholderGalleryImages)) as GalleryImage[]);
    }
  }, [user, authLoading, router]);

  const handleInputChange = (index: number, field: keyof GalleryImage, value: string) => {
    const newItems = [...galleryItems];
    // @ts-ignore
    newItems[index][field] = value;
    setGalleryItems(newItems);
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
        event.target.value = ''; 
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de Archivo Inválido",
          description: "Por favor, selecciona un archivo de imagen (ej. PNG, JPG, GIF, WebP).",
          variant: "destructive",
        });
        event.target.value = ''; 
        return;
      }
      const newItems = [...galleryItems];
      newItems[index].src = URL.createObjectURL(file);
      setGalleryItems(newItems);
    }
    event.target.value = ''; 
  };

  const handleRemovePreviewImage = (index: number) => {
    const newItems = [...galleryItems];
    newItems[index].src = 'https://placehold.co/400x400.png'; // Reset to placeholder
    setGalleryItems(newItems);
    const fileInput = document.getElementById(`src-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleAddImage = () => {
    const newItem: GalleryImage = {
      id: `gallery-${Date.now()}`,
      src: 'https://placehold.co/400x400.png',
      alt: 'Nueva Imagen',
      shortDescription: 'Descripción corta de la nueva imagen.',
      longDescription: 'Descripción larga y detallada de la nueva imagen.',
      commentCount: 0,
      dataAiHint: 'new image'
    };
    setGalleryItems([...galleryItems, newItem]);
  };

  const handleRemoveGalleryItem = (index: number) => {
    const newItems = galleryItems.filter((_, i) => i !== index);
    setGalleryItems(newItems);
  };

  const handleSaveChanges = () => {
    placeholderGalleryImages.length = 0; 
    galleryItems.forEach(item => placeholderGalleryImages.push(item)); 

    setOriginalGalleryItems(JSON.parse(JSON.stringify(galleryItems))); 
    toast({ title: "Cambios Guardados", description: "La galería ha sido actualizada (simulado)." });
  };

  const handleCancelChanges = () => {
    setGalleryItems(JSON.parse(JSON.stringify(originalGalleryItems))); 
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
          <CardTitle className="text-2xl font-bold text-primary">Gestionar Imágenes de la Galería</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {galleryItems.map((item, index) => (
            <Card key={item.id} className="p-4 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Imagen {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <div>
                  <Label htmlFor={`src-upload-button-${index}`}>Imagen</Label>
                  <div className="mt-1 flex items-center gap-x-3">
                    <Button
                      type="button"
                      id={`src-upload-button-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`src-upload-${index}`)?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {item.src && item.src !== 'https://placehold.co/400x400.png' ? 'Cambiar Imagen' : 'Subir Imagen'}
                    </Button>
                    <input
                      type="file"
                      id={`src-upload-${index}`}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={(e) => handleImageFileChange(index, e)}
                    />
                    {item.src && item.src !== 'https://placehold.co/400x400.png' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePreviewImage(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Quitar Imagen
                      </Button>
                    )}
                  </div>
                  {item.src && (
                    <div className="mt-3 relative w-48 h-48 border rounded-md overflow-hidden">
                      <Image src={item.src} alt={`Vista previa ${item.alt}`} fill className="object-cover" data-ai-hint={item.dataAiHint || "gallery image"} />
                    </div>
                  )}
                   <p className="text-xs text-muted-foreground mt-1">Sube una imagen (JPG, PNG, GIF, WebP). Máx 2MB.</p>
                </div>

                <div>
                  <Label htmlFor={`alt-${index}`}>Título (Texto Alternativo)</Label>
                  <Input id={`alt-${index}`} value={item.alt} onChange={(e) => handleInputChange(index, 'alt', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`shortDescription-${index}`}>Descripción Corta</Label>
                  <Textarea id={`shortDescription-${index}`} value={item.shortDescription} onChange={(e) => handleInputChange(index, 'shortDescription', e.target.value)} rows={2} />
                </div>
                <div>
                  <Label htmlFor={`longDescription-${index}`}>Descripción Larga</Label>
                  <Textarea id={`longDescription-${index}`} value={item.longDescription} onChange={(e) => handleInputChange(index, 'longDescription', e.target.value)} rows={4} />
                </div>
                <div>
                  <Label htmlFor={`dataAiHint-${index}`}>Palabras Clave IA (Opcional)</Label>
                  <Input id={`dataAiHint-${index}`} value={item.dataAiHint || ''} onChange={(e) => handleInputChange(index, 'dataAiHint', e.target.value)} placeholder="Ej: arte abstracto" />
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-4 flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveGalleryItem(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar de Galería
                </Button>
              </CardFooter>
            </Card>
          ))}
           <Button variant="outline" onClick={handleAddImage} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Imagen a Galería
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
