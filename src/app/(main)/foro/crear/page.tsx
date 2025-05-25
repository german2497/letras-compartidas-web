
"use client"

import { useState, useEffect } from 'react'
import { PostForm } from '@/components/foro/PostForm'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { simulateFetch, placeholderForumPosts, type ForumPost } from '@/lib/placeholder-data'

interface CreatePostData {
  title: string;
  content: string;
  imageFile?: File | null;
  dataAiHint?: string;
  genre?: string;
  category?: string;
}

export default function CrearPostPage() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreatePost = async (data: CreatePostData) => {
    if (!user) {
      toast({ title: "Error de autenticación", description: "Debes iniciar sesión para crear una publicación.", variant: "destructive" });
      router.push('/auth');
      return;
    }

    setIsSubmitting(true)
    try {
      let imageUrl: string | undefined = undefined;
      if (data.imageFile) {
        await simulateFetch(null, 1500); 
        imageUrl = URL.createObjectURL(data.imageFile); 
      }

      await simulateFetch(null, 1000); 
      const newPostId = `post${Date.now()}`; 

      const newPost: ForumPost = {
        id: newPostId,
        title: data.title,
        content: data.content,
        imageUrl: imageUrl,
        author: {
          id: user.uid || `user${Date.now()}`,
          name: user.displayName || 'Usuario Anónimo',
          avatarUrl: user.photoURL || undefined,
        },
        createdAt: new Date().toISOString(),
        commentCount: 0,
        likes: 0,
        dislikes: 0,
        dataAiHint: data.dataAiHint || (imageUrl ? 'discussion topic' : undefined),
        genre: data.genre || undefined,
        category: data.category || undefined,
      };

      placeholderForumPosts.unshift(newPost);

      toast({
        title: "Publicación Creada",
        description: "Tu publicación ha sido creada exitosamente (simulado).",
      })
      router.push(`/foro/${newPostId}`) 
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error al Crear Publicación",
        description: "Hubo un problema al crear tu publicación. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth?redirect=/foro/crear');
      toast({ title: "Acceso Denegado", description: "Por favor, inicia sesión para crear una publicación.", variant: "destructive" });
    }
  }, [user, authLoading, router, toast]);


  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <PostForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
    </div>
  )
}
