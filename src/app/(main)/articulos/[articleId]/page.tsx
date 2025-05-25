
"use client"

import React, { useEffect, useState, ChangeEvent } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { placeholderArticles, type Article, simulateFetch } from '@/lib/placeholder-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Edit3, Save, XCircle, UploadCloud } from 'lucide-react'

function ArticlePageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <Skeleton className="h-10 w-1/4 mb-8" /> {/* Back button */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
          <Skeleton className="h-4 w-1/2 mb-4" /> {/* Meta info */}
        </CardHeader>
        <Skeleton className="aspect-[16/9] w-full rounded-md" /> {/* Image */}
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

// Helper to convert HTML string to plain text with newlines
const htmlToPlainText = (htmlString: string | undefined): string => {
  if (!htmlString) return '';
  // A very basic conversion: replace <p> tags with newlines.
  // For more complex HTML, a proper parser/sanitizer would be needed.
  return htmlString
    .replace(/<\/p>\s*<p>/gi, '\n\n') // Replace closing p and opening p with double newline
    .replace(/<p>/gi, '')            // Remove opening p tags
    .replace(/<\/p>/gi, '')           // Remove closing p tags
    .replace(/<br\s*\/?>/gi, '\n')    // Replace <br> tags with newline
    .trim();                          // Trim leading/trailing whitespace
};

// Helper to convert plain text with newlines to HTML paragraphs
const plainTextToHtml = (plainText: string): string => {
  return plainText
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => `<p>${line.trim()}</p>`)
    .join('');
};

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const articleId = typeof params.articleId === 'string' ? params.articleId : undefined;

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [editableTitle, setEditableTitle] = useState('')
  const [editableExcerpt, setEditableExcerpt] = useState('')
  const [editableImageUrl, setEditableImageUrl] = useState('')
  const [editableContent, setEditableContent] = useState('') // Stores plain text for editing
  const [editableDate, setEditableDate] = useState('') 
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [editableDataAiHint, setEditableDataAiHint] = useState('');


  const [originalValues, setOriginalValues] = useState<Partial<Article & { plainContent?: string, dataAiHint?: string }>>({});


  useEffect(() => {
    if (articleId) {
      const fetchArticleData = async () => {
        setLoading(true)
        let foundArticle = placeholderArticles.find(a => a.id === articleId)
        if (!foundArticle) {
            foundArticle = await simulateFetch(placeholderArticles.find(a => a.id === articleId))
        }
        
        if (foundArticle) {
          setArticle(foundArticle)
          const plainContentForEditing = htmlToPlainText(foundArticle.content);
          setEditableTitle(foundArticle.title)
          setEditableExcerpt(foundArticle.excerpt)
          setEditableImageUrl(foundArticle.imageUrl || '')
          setEditableContent(plainContentForEditing)
          setEditableDate(new Date(foundArticle.date).toISOString().split('T')[0])
          setEditableDataAiHint(foundArticle.dataAiHint || '');

          setOriginalValues({
            title: foundArticle.title,
            excerpt: foundArticle.excerpt,
            imageUrl: foundArticle.imageUrl || '',
            content: foundArticle.content, // Store original HTML content
            plainContent: plainContentForEditing, // Store original plain text for cancel
            date: new Date(foundArticle.date).toISOString().split('T')[0],
            dataAiHint: foundArticle.dataAiHint || '',
          });
          setSelectedImageFile(null); 
        } else {
          toast({ title: "Error", description: "Artículo no encontrado.", variant: "destructive"})
          router.replace('/') 
        }
        setLoading(false)
      }
      fetchArticleData()
    }
  }, [articleId, router, toast])

  const handleEditToggle = () => {
    if (!isEditing) {
      if (article) {
        const plainContentForEditing = htmlToPlainText(article.content);
        setOriginalValues({
          title: article.title,
          excerpt: article.excerpt,
          imageUrl: article.imageUrl || '',
          content: article.content, 
          plainContent: plainContentForEditing,
          date: new Date(article.date).toISOString().split('T')[0],
          dataAiHint: article.dataAiHint || '',
        });
        setEditableTitle(article.title);
        setEditableExcerpt(article.excerpt);
        setEditableImageUrl(article.imageUrl || '');
        setEditableContent(plainContentForEditing);
        setEditableDate(new Date(article.date).toISOString().split('T')[0]);
        setEditableDataAiHint(article.dataAiHint || '');
        setSelectedImageFile(null);
        const fileInput = document.getElementById('articleImageUpload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    }
    setIsEditing(!isEditing);
  };

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
      setEditableImageUrl(URL.createObjectURL(file));
    }
    event.target.value = ''; 
  };

  const handleRemoveImage = () => {
    setEditableImageUrl('');
    setSelectedImageFile(null);
    const fileInput = document.getElementById('articleImageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSave = () => {
    if (!article) return;

    const articleIndex = placeholderArticles.findIndex(a => a.id === article.id);
    if (articleIndex !== -1) {
      const htmlContentFromPlainText = plainTextToHtml(editableContent);
      const updatedArticle: Article = {
        ...placeholderArticles[articleIndex],
        title: editableTitle,
        excerpt: editableExcerpt,
        imageUrl: editableImageUrl || undefined, 
        content: htmlContentFromPlainText, // Save converted HTML
        date: new Date(editableDate).toISOString(), 
        dataAiHint: editableDataAiHint || (editableImageUrl ? 'article theme' : undefined),
      };
      placeholderArticles[articleIndex] = updatedArticle;
      setArticle(updatedArticle); 
      toast({ title: "Artículo Actualizado", description: "Los cambios han sido guardados (simulado)." });
    } else {
      toast({ title: "Error", description: "No se pudo encontrar el artículo para actualizar.", variant: "destructive" });
    }
    setIsEditing(false);
    setSelectedImageFile(null); 
  };

  const handleCancel = () => {
    setEditableTitle(originalValues.title || '');
    setEditableExcerpt(originalValues.excerpt || '');
    setEditableImageUrl(originalValues.imageUrl || '');
    setEditableContent(originalValues.plainContent || ''); // Revert to original plain text for editing
    setEditableDate(originalValues.date || '');
    setEditableDataAiHint(originalValues.dataAiHint || '');
    setSelectedImageFile(null);
    const fileInput = document.getElementById('articleImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    setIsEditing(false);
  };


  if (loading) {
    return <ArticlePageSkeleton />;
  }

  if (!article) {
    return (
      <div className="text-center py-10">
        <p className="text-2xl text-destructive">Artículo no encontrado.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Volver al Inicio</Button>
      </div>
    );
  }

  const displayDate = new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      {user?.isAdmin && (
        <div className="mb-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                <XCircle className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={handleEditToggle} variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" /> Editar Artículo
            </Button>
          )}
        </div>
      )}

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="pb-4">
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="articleTitle">Título del Artículo</Label>
              <Input id="articleTitle" value={editableTitle} onChange={(e) => setEditableTitle(e.target.value)} className="text-3xl font-bold" />
            </div>
          ) : (
            <CardTitle className="text-3xl font-bold text-primary">{article.title}</CardTitle>
          )}
          {!isEditing && (
            <p className="text-sm text-muted-foreground">Por {article.author} - {displayDate}</p>
          )}
          {isEditing && (
             <div className="space-y-2 mt-2">
                <Label htmlFor="articleDate">Fecha de Publicación</Label>
                <Input id="articleDate" type="date" value={editableDate} onChange={(e) => setEditableDate(e.target.value)} />
            </div>
          )}
        </CardHeader>

        {isEditing ? (
          <CardContent className="space-y-4 pt-2">
            <div>
              <Label htmlFor="articleImageUploadButton">Imagen del Artículo</Label>
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
                {editableImageUrl && (
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
              {editableImageUrl && (
                <div className="mt-3 relative w-full max-w-xs aspect-video border rounded-md overflow-hidden">
                  <Image src={editableImageUrl} alt="Previsualización del artículo" fill className="object-cover" data-ai-hint={editableDataAiHint || "article illustration"} />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Sube una imagen (JPG, PNG, GIF, WebP). Máx 2MB.</p>
            </div>
             <div className="space-y-2">
                <Label htmlFor="editableDataAiHint">Palabras clave para la imagen (Opcional)</Label>
                <Input
                    id="editableDataAiHint"
                    value={editableDataAiHint}
                    onChange={(e) => setEditableDataAiHint(e.target.value)}
                    placeholder="Ej: tema artículo, ilustración"
                    maxLength={50}
                />
                <p className="text-xs text-muted-foreground">Máximo 2 palabras clave.</p>
            </div>
            <div>
              <Label htmlFor="articleExcerpt">Extracto</Label>
              <Textarea id="articleExcerpt" value={editableExcerpt} onChange={(e) => setEditableExcerpt(e.target.value)} rows={3} />
            </div>
            <div>
              <Label htmlFor="articleContent">Descripción del artículo</Label>
              <Textarea 
                id="articleContent" 
                value={editableContent} // Edit plain text
                onChange={(e) => setEditableContent(e.target.value)} 
                rows={15} 
                placeholder="Escribe el contenido del artículo aquí. Cada salto de línea será un nuevo párrafo."
              />
            </div>
          </CardContent>
        ) : (
          <>
            {article.imageUrl && (
              <div className="relative aspect-[16/9] w-full my-6 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover"
                  data-ai-hint={article.dataAiHint || "article theme"}
                  priority
                />
              </div>
            )}
            <CardContent className="pt-2">
              <div
                className="prose prose-lg max-w-none text-foreground/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content || '' }} // Display HTML content
              />
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
