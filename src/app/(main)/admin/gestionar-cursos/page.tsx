
"use client"

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { placeholderCourses, type Course } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, XCircle, ShieldAlert, Trash2, PlusCircle, UploadCloud } from 'lucide-react';

export default function GestionarCursosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [originalCourses, setOriginalCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin/gestionar-cursos');
    } else {
      // Deep copy to prevent direct mutation of placeholder data
      const initialCourses = JSON.parse(JSON.stringify(placeholderCourses)) as Course[];
      setCourses(initialCourses);
      setOriginalCourses(JSON.parse(JSON.stringify(placeholderCourses)) as Course[]);
    }
  }, [user, authLoading, router]);

  const handleInputChange = (index: number, field: keyof Course, value: string | string[]) => {
    const newCourses = [...courses];
    if (field === 'tags') {
      // @ts-ignore
      newCourses[index][field] = (value as string).split(',').map(tag => tag.trim()).filter(tag => tag);
    } else {
      // @ts-ignore
      newCourses[index][field] = value;
    }
    setCourses(newCourses);
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
      const newCourses = [...courses];
      newCourses[index].imageUrl = URL.createObjectURL(file); // Create a blob URL for preview
      setCourses(newCourses);
    }
    event.target.value = ''; // Clear input to allow re-selection of the same file
  };

  const handleRemoveImage = (index: number) => {
    const newCourses = [...courses];
    newCourses[index].imageUrl = 'https://placehold.co/600x400.png'; // Reset to placeholder
    setCourses(newCourses);
    const fileInput = document.getElementById(`imageUrl-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleAddCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: 'Nuevo Curso',
      description: 'Descripción del nuevo curso.',
      imageUrl: 'https://placehold.co/600x400.png',
      hotmartLink: 'https://hotmart.com/es/',
      tags: [],
      dataAiHint: 'new course'
    };
    setCourses([...courses, newCourse]);
  };

  const handleRemoveCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const handleSaveChanges = () => {
    // In a real app, this would be an API call.
    // Here, we directly mutate the placeholder data for simulation.
    placeholderCourses.length = 0; 
    courses.forEach(course => placeholderCourses.push(course)); 

    setOriginalCourses(JSON.parse(JSON.stringify(courses))); // Update original state
    toast({ title: "Cambios Guardados", description: "Los cursos han sido actualizados (simulado)." });
  };

  const handleCancelChanges = () => {
    setCourses(JSON.parse(JSON.stringify(originalCourses))); // Revert to original state
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
          <CardTitle className="text-2xl font-bold text-primary">Gestionar Cursos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {courses.map((course, index) => (
            <Card key={course.id} className="p-4 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Curso {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <div>
                  <Label htmlFor={`imageUrl-upload-button-${index}`}>Imagen del Curso</Label>
                  <div className="mt-1 flex items-center gap-x-3">
                    <Button
                      type="button"
                      id={`imageUrl-upload-button-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`imageUrl-upload-${index}`)?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {(course.imageUrl && course.imageUrl !== 'https://placehold.co/600x400.png' && !course.imageUrl.startsWith('blob:')) ? 'Cambiar Imagen' : (course.imageUrl.startsWith('blob:') ? 'Cambiar Imagen' : 'Subir Imagen')}
                    </Button>
                    <input
                      type="file"
                      id={`imageUrl-upload-${index}`}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={(e) => handleImageFileChange(index, e)}
                    />
                    {course.imageUrl && course.imageUrl !== 'https://placehold.co/600x400.png' && (
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
                  {course.imageUrl && (
                    <div className="mt-3 relative w-full aspect-[16/9] border rounded-md overflow-hidden">
                      <Image src={course.imageUrl} alt={`Vista previa ${course.title}`} fill className="object-cover" data-ai-hint={course.dataAiHint || "course material"} />
                    </div>
                  )}
                   <p className="text-xs text-muted-foreground mt-1">Sube una imagen (JPG, PNG, GIF, WebP). Máx 2MB.</p>
                </div>

                <div>
                  <Label htmlFor={`title-${index}`}>Título del Curso</Label>
                  <Input id={`title-${index}`} value={course.title} onChange={(e) => handleInputChange(index, 'title', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`description-${index}`}>Descripción del Curso</Label>
                  <Textarea id={`description-${index}`} value={course.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} rows={3} />
                </div>
                <div>
                  <Label htmlFor={`hotmartLink-${index}`}>Enlace de Hotmart</Label>
                  <Input id={`hotmartLink-${index}`} value={course.hotmartLink} onChange={(e) => handleInputChange(index, 'hotmartLink', e.target.value)} placeholder="https://hotmart.com/..." />
                </div>
                 <div>
                  <Label htmlFor={`tags-${index}`}>Etiquetas (separadas por comas)</Label>
                  <Input id={`tags-${index}`} value={(course.tags || []).join(', ')} onChange={(e) => handleInputChange(index, 'tags', e.target.value)} placeholder="Ej: Escritura, Creatividad, Novela" />
                </div>
                <div>
                  <Label htmlFor={`dataAiHint-${index}`}>Palabras Clave IA (Opcional)</Label>
                  <Input id={`dataAiHint-${index}`} value={course.dataAiHint || ''} onChange={(e) => handleInputChange(index, 'dataAiHint', e.target.value)} placeholder="Ej: curso online" />
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-4 flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveCourse(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Curso
                </Button>
              </CardFooter>
            </Card>
          ))}
           <Button variant="outline" onClick={handleAddCourse} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Curso
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
