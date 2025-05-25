
"use client"

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { placeholderConferences, type Conference } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, XCircle, ShieldAlert, Trash2, PlusCircle, UploadCloud, Video } from 'lucide-react';

export default function GestionarConferenciasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [conferences, setConferences] = useState<Conference[]>([]);
  const [originalConferences, setOriginalConferences] = useState<Conference[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin/gestionar-conferencias');
    } else {
      const initialConferences = JSON.parse(JSON.stringify(placeholderConferences)) as Conference[];
      setConferences(initialConferences);
      setOriginalConferences(JSON.parse(JSON.stringify(placeholderConferences)) as Conference[]);
    }
  }, [user, authLoading, router]);

  const handleInputChange = (index: number, field: keyof Conference, value: string) => {
    const newConferences = [...conferences];
    // @ts-ignore
    newConferences[index][field] = value;
    setConferences(newConferences);
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
      const newConferences = [...conferences];
      newConferences[index].thumbnailUrl = URL.createObjectURL(file);
      setConferences(newConferences);
    }
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newConferences = [...conferences];
    newConferences[index].thumbnailUrl = 'https://placehold.co/600x338.png'; // Reset to placeholder
    setConferences(newConferences);
    const fileInput = document.getElementById(`thumbnailUrl-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAddConference = () => {
    const newConference: Conference = {
      id: `conf-${Date.now()}`,
      title: 'Nueva Conferencia',
      description: 'Descripción de la nueva conferencia.',
      videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_NUEVO',
      thumbnailUrl: 'https://placehold.co/600x338.png',
      dataAiHint: 'new conference',
      date: new Date().toISOString().split('T')[0], // Default to today
    };
    setConferences([...conferences, newConference]);
  };

  const handleRemoveConference = (index: number) => {
    const newConferences = conferences.filter((_, i) => i !== index);
    setConferences(newConferences);
  };

  const handleSaveChanges = () => {
    placeholderConferences.length = 0;
    conferences.forEach(conf => placeholderConferences.push(conf));
    setOriginalConferences(JSON.parse(JSON.stringify(conferences)));
    toast({ title: "Cambios Guardados", description: "Las conferencias han sido actualizadas (simulado)." });
  };

  const handleCancelChanges = () => {
    setConferences(JSON.parse(JSON.stringify(originalConferences)));
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
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">Gestionar Conferencias</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {conferences.map((conf, index) => (
            <Card key={conf.id} className="p-4 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Conferencia {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <div>
                  <Label htmlFor={`thumbnailUrl-upload-button-${index}`}>Miniatura de la Conferencia</Label>
                  <div className="mt-1 flex items-center gap-x-3">
                    <Button
                      type="button"
                      id={`thumbnailUrl-upload-button-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`thumbnailUrl-upload-${index}`)?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {(conf.thumbnailUrl && conf.thumbnailUrl !== 'https://placehold.co/600x338.png' && !conf.thumbnailUrl.startsWith('blob:')) ? 'Cambiar Imagen' : (conf.thumbnailUrl.startsWith('blob:') ? 'Cambiar Imagen' : 'Subir Imagen')}
                    </Button>
                    <input
                      type="file"
                      id={`thumbnailUrl-upload-${index}`}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={(e) => handleImageFileChange(index, e)}
                    />
                    {conf.thumbnailUrl && conf.thumbnailUrl !== 'https://placehold.co/600x338.png' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Eliminar Miniatura
                      </Button>
                    )}
                  </div>
                  {conf.thumbnailUrl && (
                    <div className="mt-3 relative w-full aspect-[16/9] border rounded-md overflow-hidden">
                      <Image src={conf.thumbnailUrl} alt={`Vista previa ${conf.title}`} fill className="object-cover" data-ai-hint={conf.dataAiHint || "conference thumbnail"} />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Sube una imagen (JPG, PNG, GIF, WebP). Máx 2MB. Recomendado 16:9.</p>
                </div>

                <div>
                  <Label htmlFor={`title-${index}`}>Título de la Conferencia</Label>
                  <Input id={`title-${index}`} value={conf.title} onChange={(e) => handleInputChange(index, 'title', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`description-${index}`}>Descripción de la Conferencia</Label>
                  <Textarea id={`description-${index}`} value={conf.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} rows={3} />
                </div>
                <div>
                  <Label htmlFor={`videoUrl-${index}`}>URL del Video (Embed)</Label>
                  <Input id={`videoUrl-${index}`} value={conf.videoUrl} onChange={(e) => handleInputChange(index, 'videoUrl', e.target.value)} placeholder="Ej: https://www.youtube.com/embed/VIDEO_ID" />
                </div>
                <div>
                  <Label htmlFor={`date-${index}`}>Fecha de la Conferencia</Label>
                  <Input id={`date-${index}`} type="date" value={conf.date} onChange={(e) => handleInputChange(index, 'date', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`dataAiHint-${index}`}>Palabras Clave IA para Miniatura (Opcional)</Label>
                  <Input id={`dataAiHint-${index}`} value={conf.dataAiHint || ''} onChange={(e) => handleInputChange(index, 'dataAiHint', e.target.value)} placeholder="Ej: tecnología educación" />
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-4 flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveConference(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Conferencia
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Button variant="outline" onClick={handleAddConference} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Conferencia
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
