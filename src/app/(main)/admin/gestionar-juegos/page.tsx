
"use client"

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { placeholderGameDocuments, type GameDocument } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, XCircle, ShieldAlert, Trash2, PlusCircle, UploadCloud, FileText, GripVertical } from 'lucide-react';

export default function GestionarJuegosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [gameDocs, setGameDocs] = useState<GameDocument[]>([]);
  const [originalGameDocs, setOriginalGameDocs] = useState<GameDocument[]>([]);
  // State to store selected PDF files before "saving"
  const [selectedPdfFiles, setSelectedPdfFiles] = useState<Record<number, File | null>>({});


  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin/gestionar-juegos');
    } else {
      const initialDocs = JSON.parse(JSON.stringify(placeholderGameDocuments)) as GameDocument[];
      setGameDocs(initialDocs);
      setOriginalGameDocs(JSON.parse(JSON.stringify(placeholderGameDocuments)) as GameDocument[]);
      setSelectedPdfFiles({});
    }
  }, [user, authLoading, router]);

  const handleInputChange = (index: number, field: keyof GameDocument, value: string) => {
    const newDocs = [...gameDocs];
    // @ts-ignore
    newDocs[index][field] = value;
    setGameDocs(newDocs);
  };

  const handleCoverImageFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
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
      const newDocs = [...gameDocs];
      newDocs[index].coverImageUrl = URL.createObjectURL(file); 
      setGameDocs(newDocs);
    }
    event.target.value = ''; 
  };

  const handleRemoveCoverImage = (index: number) => {
    const newDocs = [...gameDocs];
    newDocs[index].coverImageUrl = 'https://placehold.co/400x300.png'; 
    setGameDocs(newDocs);
    const fileInput = document.getElementById(`coverImageUrl-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePdfFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: "Tipo de Archivo Inválido",
          description: "Por favor, selecciona un archivo PDF.",
          variant: "destructive",
        });
        event.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for PDFs, adjust as needed
        toast({
          title: "Archivo Demasiado Grande",
          description: "El PDF no debe exceder los 10MB.",
          variant: "destructive",
        });
        event.target.value = '';
        return;
      }
      const newDocs = [...gameDocs];
      newDocs[index].pdfUrl = URL.createObjectURL(file); // Store blob URL for preview/download
      newDocs[index].pdfFileName = file.name; // Store file name for display
      setGameDocs(newDocs);
      setSelectedPdfFiles(prev => ({...prev, [index]: file}));

    }
    event.target.value = ''; // Clear input to allow re-selection of the same file
  };

  const handleRemovePdfFile = (index: number) => {
    const newDocs = [...gameDocs];
    newDocs[index].pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; // Reset to placeholder or empty
    newDocs[index].pdfFileName = undefined;
    setGameDocs(newDocs);
    setSelectedPdfFiles(prev => ({...prev, [index]: null}));
    const fileInput = document.getElementById(`pdfUrl-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleAddGameDoc = () => {
    const newDoc: GameDocument = {
      id: `gamedoc-${Date.now()}`,
      title: 'Nuevo Juego/Recurso',
      description: 'Descripción corta del nuevo juego o recurso.',
      longDescription: 'Descripción larga y detallada del nuevo juego o recurso.',
      coverImageUrl: 'https://placehold.co/400x300.png',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
      commentCount: 0,
      dataAiHint: 'new game document'
    };
    setGameDocs([...gameDocs, newDoc]);
  };

  const handleRemoveGameDoc = (index: number) => {
    const newDocs = gameDocs.filter((_, i) => i !== index);
    setGameDocs(newDocs);
    // Also remove from selectedPdfFiles if it exists
    const newSelectedPdfs = {...selectedPdfFiles};
    delete newSelectedPdfs[index];
    // Adjust keys for subsequent items
    for (let i = index; i < gameDocs.length -1; i++) {
        if (newSelectedPdfs[i+1] !== undefined) {
            newSelectedPdfs[i] = newSelectedPdfs[i+1];
            delete newSelectedPdfs[i+1];
        }
    }
    setSelectedPdfFiles(newSelectedPdfs);
  };

  const handleSaveChanges = () => {
    placeholderGameDocuments.length = 0; 
    gameDocs.forEach(doc => placeholderGameDocuments.push(doc)); 

    setOriginalGameDocs(JSON.parse(JSON.stringify(gameDocs))); 
    setSelectedPdfFiles({}); // Clear selected files after "saving"
    toast({ title: "Cambios Guardados", description: "Los documentos de juego han sido actualizados (simulado)." });
  };

  const handleCancelChanges = () => {
    setGameDocs(JSON.parse(JSON.stringify(originalGameDocs))); 
    setSelectedPdfFiles({});
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
          <CardTitle className="text-2xl font-bold text-primary">Gestionar Documentos de Juegos y Recursos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {gameDocs.map((doc, index) => (
            <Card key={doc.id} className="p-4 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Documento {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <div>
                  <Label htmlFor={`coverImageUrl-upload-button-${index}`}>Imagen de Portada</Label>
                  <div className="mt-1 flex items-center gap-x-3">
                    <Button
                      type="button"
                      id={`coverImageUrl-upload-button-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`coverImageUrl-upload-${index}`)?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {doc.coverImageUrl && doc.coverImageUrl !== 'https://placehold.co/400x300.png' && !doc.coverImageUrl.startsWith('blob:') ? 'Cambiar Imagen' : (doc.coverImageUrl.startsWith('blob:') ? 'Cambiar Imagen' : 'Subir Imagen')}
                    </Button>
                    <input
                      type="file"
                      id={`coverImageUrl-upload-${index}`}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={(e) => handleCoverImageFileChange(index, e)}
                    />
                    {doc.coverImageUrl && doc.coverImageUrl !== 'https://placehold.co/400x300.png' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCoverImage(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Quitar Imagen
                      </Button>
                    )}
                  </div>
                  {doc.coverImageUrl && (
                    <div className="mt-3 relative w-full aspect-[16/9] max-w-xs border rounded-md overflow-hidden">
                      <Image src={doc.coverImageUrl} alt={`Vista previa ${doc.title}`} fill className="object-cover" data-ai-hint={doc.dataAiHint || "game cover"} />
                    </div>
                  )}
                   <p className="text-xs text-muted-foreground mt-1">Sube una imagen (JPG, PNG, GIF, WebP). Máx 2MB.</p>
                </div>

                <div>
                  <Label htmlFor={`title-${index}`}>Título</Label>
                  <Input id={`title-${index}`} value={doc.title} onChange={(e) => handleInputChange(index, 'title', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`description-${index}`}>Descripción Corta</Label>
                  <Textarea id={`description-${index}`} value={doc.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} rows={2} />
                </div>
                <div>
                  <Label htmlFor={`longDescription-${index}`}>Descripción Larga (Opcional)</Label>
                  <Textarea id={`longDescription-${index}`} value={doc.longDescription || ''} onChange={(e) => handleInputChange(index, 'longDescription', e.target.value)} rows={4} />
                </div>
                
                <div>
                  <Label htmlFor={`pdfUrl-upload-button-${index}`}>Archivo PDF del Juego</Label>
                  <div className="mt-1 flex items-center gap-x-3">
                    <Button
                      type="button"
                      id={`pdfUrl-upload-button-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`pdfUrl-upload-${index}`)?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {doc.pdfFileName || (doc.pdfUrl && !doc.pdfUrl.startsWith('blob:') && doc.pdfUrl !== 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf') ? 'Cambiar PDF' : 'Subir PDF'}
                    </Button>
                    <input
                      type="file"
                      id={`pdfUrl-upload-${index}`}
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handlePdfFileChange(index, e)}
                    />
                    {(doc.pdfFileName || (doc.pdfUrl && doc.pdfUrl !== 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')) && (
                       <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePdfFile(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Quitar PDF
                      </Button>
                    )}
                  </div>
                  {doc.pdfFileName && (
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-2 h-4 w-4 text-primary" />
                      <span>{doc.pdfFileName}</span>
                    </div>
                  )}
                  {!doc.pdfFileName && doc.pdfUrl && !doc.pdfUrl.startsWith('blob:') && doc.pdfUrl !== 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' && (
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-2 h-4 w-4 text-primary" />
                      <span>Enlace PDF actual: <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{doc.pdfUrl.substring(0,50)}...</a></span>
                    </div>
                  )}
                   <p className="text-xs text-muted-foreground mt-1">Sube un archivo PDF (Máx 10MB).</p>
                </div>

                <div>
                  <Label htmlFor={`dataAiHint-${index}`}>Palabras Clave IA (Opcional)</Label>
                  <Input id={`dataAiHint-${index}`} value={doc.dataAiHint || ''} onChange={(e) => handleInputChange(index, 'dataAiHint', e.target.value)} placeholder="Ej: juego misterio" />
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-4 flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveGameDoc(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Documento
                </Button>
              </CardFooter>
            </Card>
          ))}
           <Button variant="outline" onClick={handleAddGameDoc} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Documento de Juego
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
