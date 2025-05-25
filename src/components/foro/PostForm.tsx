
"use client"

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation' 
import Image from 'next/image'
import { UploadCloud, X } from 'lucide-react'

interface PostFormData {
  title: string;
  content: string;
  imageFile?: File | null;
  dataAiHint?: string;
  genre?: string;
  category?: string;
}

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => Promise<void>;
  isSubmitting: boolean;
}

const literaryGenres = [
  "Aventura", "Biografía", "Ciencia Ficción", "Comedia", "Drama", "Ensayo", 
  "Fantasía", "Histórico", "Infantil", "Juvenil", "Misterio", "Novela Negra", 
  "Poesía", "Realismo Mágico", "Romance", "Terror", "Thriller", "Otro"
];

const forumCategories = [
  "Análisis Literario", "Ayuda Escritura", "Compartir Escritos (General)", 
  "Compartir Novela/Capítulo", "Compartir Poesía", "Compartir Relato Corto",
  "Comunidad", "Debate", "Desafíos Creativos", "Discusión General", 
  "Inspiración y Motivación", "Noticias y Eventos Literarios", 
  "Preguntas y Respuestas", "Recomendaciones", "Reseñas de Libros", 
  "Técnicas de Escritura", "Otro"
];

export function PostForm({ initialData, onSubmit, isSubmitting }: PostFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)
  const [dataAiHint, setDataAiHint] = useState(initialData?.dataAiHint || '')
  const [genre, setGenre] = useState(initialData?.genre || '')
  const [category, setCategory] = useState(initialData?.category || '')

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "Error", description: "La imagen no debe exceder los 5MB.", variant: "destructive" });
        return;
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Error", description: "Debes iniciar sesión para publicar.", variant: "destructive" })
      router.push('/auth')
      return
    }
    if (!title.trim() || !content.trim()) {
      toast({ title: "Error", description: "El título y el contenido son obligatorios.", variant: "destructive" })
      return
    }
    await onSubmit({ title, content, imageFile, dataAiHint, genre, category })
  }

  if (!user) {
    return <p>Debes iniciar sesión para crear una publicación.</p>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          {initialData ? 'Editar Publicación' : 'Crear Nueva Publicación'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Un título atractivo para tu publicación"
              maxLength={100}
              required
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-lg">Género (Opcional)</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger id="genre" className="text-base">
                  <SelectValue placeholder="Selecciona un género" />
                </SelectTrigger>
                <SelectContent>
                  {literaryGenres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg">Categoría (Opcional)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="text-base">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {forumCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-lg">Contenido</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí tus ideas, reflexiones o historias..."
              rows={10}
              required
              className="text-base leading-relaxed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUpload" className="text-lg">Imagen (Opcional)</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleImageChange}
              className="text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {imagePreview && (
              <div className="mt-4 relative w-full max-w-md aspect-video border rounded-md overflow-hidden group">
                <Image src={imagePreview} alt="Vista previa de la imagen" layout="fill" objectFit="cover" />
                 <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Eliminar imagen"
                  >
                    <X className="h-4 w-4" />
                  </Button>
              </div>
            )}
             <p className="text-sm text-muted-foreground">Tamaño máximo: 5MB. Formatos: JPG, PNG, GIF.</p>
          </div>
           <div className="space-y-2">
            <Label htmlFor="dataAiHint" className="text-lg">Palabras clave para la imagen (Opcional)</Label>
            <Input
              id="dataAiHint"
              value={dataAiHint}
              onChange={(e) => setDataAiHint(e.target.value)}
              placeholder="Ej: tema discusión, naturaleza"
              maxLength={50}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">Máximo 2 palabras clave para ayudar a la IA a entender la imagen. Ej: "playa verano" o "montaña nieve".</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
            {isSubmitting ? (initialData ? 'Guardando Cambios...' : 'Publicando...') : (initialData ? 'Guardar Cambios' : 'Publicar')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
