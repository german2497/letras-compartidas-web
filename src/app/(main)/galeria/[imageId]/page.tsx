
"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation' 
import { placeholderGalleryImages, placeholderImageComments, type GalleryImage, type ImageComment, simulateFetch } from '@/lib/placeholder-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageCommentSection } from '@/components/galeria/ImageCommentSection'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Facebook, Twitter, Linkedin, Copy, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

function ImageDetailPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-10 w-1/4 mb-8" /> {/* Back button */}
      <Card className="shadow-xl overflow-hidden">
        <Skeleton className="aspect-video w-full rounded-t-lg" />
        <CardHeader className="p-6">
          <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          {/* Skeleton for share buttons */}
          <div className="mt-6 pt-4 border-t">
            <Skeleton className="h-5 w-1/4 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <Skeleton className="h-6 w-1/3 mb-4" /> {/* Comments title */}
        <Skeleton className="h-20 w-full mb-4" /> {/* Comment form */}
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className="flex space-x-3 p-4 bg-card rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


export default function ImageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth() 
  const { toast } = useToast()
  
  const imageId = typeof params.imageId === 'string' ? params.imageId : undefined;
  
  const [imageItem, setImageItem] = useState<GalleryImage | null>(null)
  const [comments, setComments] = useState<ImageComment[]>([])
  const [loading, setLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (imageId) {
      const fetchImageData = async () => {
        setLoading(true)
        const foundImage = await simulateFetch(placeholderGalleryImages.find(img => img.id === imageId))
        
        if (foundImage) {
          setImageItem(foundImage)
          const imageCommentsData = await simulateFetch(placeholderImageComments.filter(c => c.imageId === imageId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setComments(imageCommentsData)
        } else {
          router.replace('/galeria') 
        }
        setLoading(false)
      }
      fetchImageData()
    }
  }, [imageId, router])

  const handleCommentSubmit = async (content: string): Promise<ImageComment | null> => {
    if (!user || !imageItem) return null;
    const newComment: ImageComment = {
      id: `imgcomment${Date.now()}`,
      imageId: imageItem.id,
      author: {
        id: user.uid || 'unknown-user',
        name: user.displayName || 'Usuario Anónimo',
        avatarUrl: user.photoURL || undefined,
      },
      content,
      createdAt: new Date().toISOString(),
    };
    await simulateFetch(null, 500); 
    
    placeholderImageComments.unshift(newComment);
    const imageIndex = placeholderGalleryImages.findIndex(img => img.id === imageItem.id);
    if (imageIndex !== -1) {
        placeholderGalleryImages[imageIndex].commentCount += 1;
        setImageItem(prevImage => prevImage ? {...prevImage, commentCount: prevImage.commentCount + 1} : null);
    }
    return newComment;
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setIsCopied(true);
        toast({ title: "Enlace copiado", description: "El enlace a esta imagen ha sido copiado al portapapeles." });
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        toast({ title: "Error", description: "No se pudo copiar el enlace.", variant: "destructive" });
        console.error('Failed to copy: ', err);
      });
    }
  };

  if (loading) {
    return <ImageDetailPageSkeleton />;
  }

  if (!imageItem) {
    return (
      <div className="text-center py-10">
        <p className="text-2xl text-destructive">Imagen no encontrada.</p>
        <Button onClick={() => router.push('/galeria')} className="mt-4">Volver a la Galería</Button>
      </div>
    );
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = imageItem ? `¡Mira esta imagen!: ${imageItem.alt}` : '¡Mira esta imagen!';
  const encodedPageUrl = encodeURIComponent(pageUrl);
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareTextAndUrl = encodeURIComponent(`${shareText} ${pageUrl}`);


  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <Card className="shadow-xl overflow-hidden">
        <div className="relative aspect-video w-full">
          <Image
            src={imageItem.src}
            alt={imageItem.alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain rounded-t-lg bg-muted/20"
            data-ai-hint={imageItem.dataAiHint || "art culture"}
            priority
          />
        </div>
        <CardHeader className="p-6">
          <CardTitle className="text-3xl font-bold text-primary">{imageItem.alt}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="prose max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            <p>{imageItem.longDescription}</p>
          </div>

          {/* Share Buttons Section */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-md font-semibold mb-3 text-primary">Compartir en:</h4>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                aria-label="Compartir en Facebook"
              >
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Facebook className="mr-2 h-4 w-4" /> Facebook
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                aria-label="Compartir en X"
              >
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodedPageUrl}&text=${encodedShareText}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Twitter className="mr-2 h-4 w-4" /> X
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                aria-label="Compartir en WhatsApp"
              >
                <a 
                  href={`https://wa.me/?text=${encodedShareTextAndUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                aria-label="Compartir en LinkedIn"
              >
                <a 
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedPageUrl}&title=${encodeURIComponent(imageItem.alt)}&summary=${encodedShareText}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyLink}
                aria-label="Copiar enlace"
                className="flex items-center"
              >
                <Copy className="mr-2 h-4 w-4" /> {isCopied ? '¡Copiado!' : 'Copiar Enlace'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImageCommentSection imageId={imageItem.id} initialComments={comments} onCommentSubmit={handleCommentSubmit} />
    </div>
  )
}
