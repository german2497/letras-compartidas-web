
"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { placeholderArticles, type Article, simulateFetch } from '@/lib/placeholder-data'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { UploadCloud, XCircle, Save, Image as ImageIconLucide, ArrowLeft } from 'lucide-react'

export default function CrearArticuloPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('Empieza a escribir tu artículo aquí...')
  const [imageUrl, setImageUrl] = useState('') // Stores blob URL for preview or existing URL
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]) // Default to today
  const [dataAiHint, setDataAiHint] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      toast({ title: "Acceso Denegado", description: "No tienes permisos para crear artículos.", variant: "destructive" })
      router.replace('/')
    }
  }, [user, authLoading, router, toast])

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "Archivo Demasiado Grande",
          description: "Por favor, selecciona una imagen de menos de 2MB.",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de Archivo Inválido",
          description: "Por favor, selecciona un archivo de imagen (ej. PNG, JPG, GIF, WebP).",
          variant: "destructive",
        });
        return;
      }
      setSelectedImageFile(file);
      setImageUrl(URL.createObjectURL(file)); // Preview
    }
    event.target.value = ''; // Clear input to allow re-selection
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setSelectedImageFile(null);
    const fileInput = document.getElementById('articleImageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !user.isAdmin) {
      toast({ title: "Error", description: "No autorizado.", variant: "destructive" })
      return
    }
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast({ title: "Error", description: "Título, extracto y contenido son obligatorios.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    let finalImageUrl = imageUrl; 
    if (selectedImageFile) {
        // finalImageUrl is already set to blob URL from handleImageFileChange
    }

    // Convert plain text content with newlines to simple HTML paragraphs
    const htmlContent = content
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => `<p>${line.trim()}</p>`)
      .join('');

    const newArticle: Article = {
      id: `article-${Date.now()}`, // Simple unique ID
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''), // Basic slug generation
      excerpt,
      imageUrl: finalImageUrl || undefined, 
      author: user.displayName || "Autor Principal",
      date: new Date(publishDate).toISOString(),
      content: htmlContent,
      dataAiHint: dataAiHint || (finalImageUrl ? 'article illustration' : undefined),
    }

    await simulateFetch(null, 700) 

    placeholderArticles.unshift(newArticle) 

    toast({ title: "Artículo Creado", description: `"${newArticle.title}" ha sido publicado (simulado).` })
    setIsSubmitting(false)
    router.push(`/articulos/${newArticle.id}`) 
  }

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Crear Nuevo Artículo</CardTitle>
          <CardDescription>Completa los campos para publicar un nuevo artículo.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="articleTitle" className="text-lg">Título del Artículo</Label>
              <Input
                id="articleTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Un título impactante"
                required
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="articleDate" className="text-lg">Fecha de Publicación</Label>
              <Input
                id="articleDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="articleImageUploadButton" className="text-lg">Imagen del Artículo (Opcional)</Label>
              <div className="mt-1 flex items-center gap-x-3">
                <Button
                  type="button"
                  id="articleImageUploadButton"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('articleImageUpload')?.click()}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {selectedImageFile ? 'Cambiar Imagen' : 'Subir Imagen'}
                </Button>
                <input
                  type="file"
                  id="articleImageUpload"
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleImageFileChange}
                />
                {imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Eliminar Imagen
                  </Button>
                )}
              </div>
              {imageUrl && (
                <div className="mt-3 relative w-full max-w-xs aspect-video border rounded-md overflow-hidden">
                  <Image src={imageUrl} alt="Previsualización del artículo" fill className="object-cover" data-ai-hint="article illustration" />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Sube una imagen (JPG, PNG, GIF, WebP). Máx 2MB.</p>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="dataAiHint" className="text-lg">Palabras clave para la imagen (Opcional)</Label>
                <Input
                  id="dataAiHint"
                  value={dataAiHint}
                  onChange={(e) => setDataAiHint(e.target.value)}
                  placeholder="Ej: escritura creativa, paisaje"
                  maxLength={50}
                />
                <p className="text-sm text-muted-foreground">Máximo 2 palabras clave para ayudar a la IA a entender la imagen.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="articleExcerpt" className="text-lg">Extracto</Label>
              <Textarea
                id="articleExcerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Un resumen breve y atractivo (máx. 300 caracteres)"
                rows={3}
                required
                maxLength={300}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="articleContent" className="text-lg">Contenido del Artículo</Label>
              <Textarea
                id="articleContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe el contenido completo aquí. Cada salto de línea será un nuevo párrafo."
                rows={15}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Publicando...' : 'Publicar Artículo'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
