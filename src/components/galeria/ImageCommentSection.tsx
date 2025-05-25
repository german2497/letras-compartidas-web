
"use client"

import React, { useState, FormEvent } from 'react'
import type { ImageComment } from '@/lib/placeholder-data'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Send } from 'lucide-react'

interface ImageCommentSectionProps {
  imageId: string;
  initialComments: ImageComment[];
  onCommentSubmit: (content: string) => Promise<ImageComment | null>;
}

export function ImageCommentSection({ imageId, initialComments, onCommentSubmit }: ImageCommentSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<ImageComment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Error", description: "Debes iniciar sesión para comentar.", variant: "destructive" })
      return
    }
    if (!newComment.trim()) {
      toast({ title: "Error", description: "El comentario no puede estar vacío.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    const submittedComment = await onCommentSubmit(newComment)
    if (submittedComment) {
      setComments(prevComments => [submittedComment, ...prevComments])
      setNewComment('')
      toast({ title: "Comentario añadido a la imagen" })
    } else {
       toast({ title: "Error", description: "No se pudo añadir el comentario.", variant: "destructive" })
    }
    setIsSubmitting(false)
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-semibold text-primary border-b pb-2">Comentarios sobre la Imagen ({comments.length})</h3>
      
      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex items-start space-x-3">
             <Avatar className="h-10 w-10 mt-1">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario sobre esta imagen..."
              rows={3}
              className="flex-grow"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
            </Button>
          </div>
        </form>
      )}
      {!user && <p className="text-muted-foreground">Debes <a href="/auth" className="text-primary hover:underline">iniciar sesión</a> para dejar un comentario.</p>}

      <div className="space-y-6">
        {comments.length > 0 ? comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3 p-4 bg-card rounded-lg shadow-sm">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-semibold text-primary">{comment.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            </div>
          </div>
        )) : (
          <p className="text-muted-foreground text-center py-4">No hay comentarios aún para esta imagen. ¡Sé el primero en comentar!</p>
        )}
      </div>
    </div>
  )
}
