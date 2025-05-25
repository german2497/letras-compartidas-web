
"use client"

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Edit3, Save, Image as ImageIcon, UploadCloud, Camera } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function PerfilPage() {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(''); // Used for current display URL (original or preview)
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth?redirect=/perfil');
    } else if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
      setDescription(user.description || '');
      setSelectedPhotoFile(null); // Reset file on user change
    }
  }, [user, authLoading, router]);

  const handlePhotoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation (e.g., 2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Archivo Demasiado Grande",
          description: "Por favor, selecciona una imagen de menos de 2MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedPhotoFile(file);
      setPhotoURL(URL.createObjectURL(file)); // Set for preview
      // Clear the input value so the same file can be selected again if removed then re-added
      e.target.value = '';
    }
  };

  const handleTakePhotoPlaceholder = () => {
    toast({
      title: "Función no disponible",
      description: "La opción para tomar una foto con la cámara estará disponible próximamente.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
      setDescription(user.description || '');
    }
    setSelectedPhotoFile(null);
    const fileInput = document.getElementById('photoFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // photoURL already holds the new blob URL if a file was selected,
      // or the original/manually-set URL.
      // In a real app, if selectedPhotoFile is set, you would upload it here
      // and get a new persistent URL to save.
      await updateUserProfile({
        displayName,
        photoURL, // This will be the blob URL if a new file was uploaded
        description,
      });
      toast({ title: "Perfil Actualizado", description: "Tus cambios han sido guardados." });
      setIsEditing(false);
      setSelectedPhotoFile(null); // Reset after successful save
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Error", description: "No se pudo actualizar el perfil.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Tu Perfil
        </h1>
        <p className="mt-2 text-lg text-foreground/80">
          Gestiona tu información personal y cómo te presentas a la comunidad.
        </p>
      </header>

      <Card className="shadow-xl">
        <form onSubmit={handleSaveProfile}>
          <CardHeader className="items-center">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-md">
                <AvatarImage src={photoURL || undefined} alt={displayName || 'Avatar del usuario'} />
                <AvatarFallback className="text-4xl">
                  {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon size={48} />}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer bg-accent text-accent-foreground p-2 rounded-full shadow-md hover:bg-accent/80 transition-colors absolute bottom-0 right-0 h-10 w-10"
                        aria-label="Cambiar foto de perfil"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => document.getElementById('photoFileInput')?.click()}
                        className="cursor-pointer"
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Subir foto
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleTakePhotoPlaceholder}
                        className="cursor-pointer"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Tomar foto
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Input
                    type="file"
                    id="photoFileInput"
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={handlePhotoFileChange}
                  />
                </>
              )}
            </div>
            <CardTitle className="text-3xl">{displayName || 'Usuario'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-lg">Nombre para mostrar</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu nombre en la comunidad"
                    maxLength={50}
                  />
                </div>
                {/* The old photoURL input is removed. Image changes via Dropdown. */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg">Tu descripción (como escritor/a)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cuéntanos un poco sobre ti, tus intereses literarios, etc."
                    rows={5}
                    maxLength={300}
                  />
                  <p className="text-sm text-muted-foreground">Máximo 300 caracteres.</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-primary">Descripción</h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {description || <span className="text-muted-foreground italic">Aún no has añadido una descripción.</span>}
                  </p>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
