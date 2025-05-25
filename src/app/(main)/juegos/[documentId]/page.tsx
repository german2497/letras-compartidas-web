
"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation' 
import { placeholderGameDocuments, placeholderGameDocumentComments, type GameDocument, type GameDocumentComment, simulateFetch } from '@/lib/placeholder-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GameDocumentCommentSection } from '@/components/juegos/GameDocumentCommentSection'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Download, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

function GameDocumentDetailPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <Skeleton className="h-10 w-1/4 mb-8" /> {/* Back button */}
      <Card className="shadow-xl overflow-hidden">
        <Skeleton className="aspect-[16/9] w-full rounded-t-lg" />
        <CardHeader className="p-6">
          <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-12 w-full mt-6" /> {/* Download button */}
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


export default function GameDocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth() 
  const { toast } = useToast()
  
  const documentId = typeof params.documentId === 'string' ? params.documentId : undefined;
  
  const [documentItem, setDocumentItem] = useState<GameDocument | null>(null)
  const [comments, setComments] = useState<GameDocumentComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (documentId) {
      const fetchDocumentData = async () => {
        setLoading(true)
        const foundDocument = await simulateFetch(placeholderGameDocuments.find(doc => doc.id === documentId))
        
        if (foundDocument) {
          setDocumentItem(foundDocument)
          const documentCommentsData = await simulateFetch(placeholderGameDocumentComments.filter(c => c.documentId === documentId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setComments(documentCommentsData)
        } else {
          router.replace('/juegos') 
        }
        setLoading(false)
      }
      fetchDocumentData()
    }
  }, [documentId, router])

  const handleCommentSubmit = async (content: string): Promise<GameDocumentComment | null> => {
    if (!user || !documentItem) return null;
    const newComment: GameDocumentComment = {
      id: `gamedoccomment${Date.now()}`,
      documentId: documentItem.id,
      author: {
        id: user.uid || 'unknown-user',
        name: user.displayName || 'Usuario Anónimo',
        avatarUrl: user.photoURL || undefined,
      },
      content,
      createdAt: new Date().toISOString(),
    };
    await simulateFetch(null, 500); 
    
    placeholderGameDocumentComments.unshift(newComment);
    const docIndex = placeholderGameDocuments.findIndex(doc => doc.id === documentItem.id);
    if (docIndex !== -1) {
        placeholderGameDocuments[docIndex].commentCount += 1;
        setDocumentItem(prevDoc => prevDoc ? {...prevDoc, commentCount: prevDoc.commentCount + 1} : null);
    }
    return newComment;
  };

  const handleDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      event.preventDefault(); 
      toast({
        title: "Acceso Restringido",
        description: "Debes iniciar sesión para descargar este archivo.",
        variant: "destructive",
      });
    } else if (documentItem) {
      toast({
        title: "Descarga Iniciada",
        description: `Se está descargando "${documentItem.title}".`,
      });
    }
  };


  if (loading) {
    return <GameDocumentDetailPageSkeleton />;
  }

  if (!documentItem) {
    return (
      <div className="text-center py-10">
        <p className="text-2xl text-destructive">Documento no encontrado.</p>
        <Button onClick={() => router.push('/juegos')} className="mt-4">Volver a Juegos</Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <Card className="shadow-xl overflow-hidden">
        {documentItem.coverImageUrl && (
            <div className="relative aspect-[16/9] w-full">
            <Image
                src={documentItem.coverImageUrl}
                alt={documentItem.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover rounded-t-lg bg-muted/20"
                data-ai-hint={documentItem.dataAiHint || "game document cover"}
                priority
            />
            </div>
        )}
        <CardHeader className="p-6">
          <CardTitle className="text-3xl font-bold text-primary">{documentItem.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="prose max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap mb-6">
            <p>{documentItem.longDescription || documentItem.description}</p>
          </div>

          {user ? (
            <Button asChild className="w-full" size="lg">
              <a 
                href={documentItem.pdfUrl} 
                download 
                onClick={handleDownload}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-5 w-5" /> Descargar PDF
              </a>
            </Button>
          ) : (
            <Button className="w-full" size="lg" disabled>
              <Lock className="mr-2 h-5 w-5" /> Inicia sesión para Descargar
            </Button>
          )}
        </CardContent>
      </Card>

      <GameDocumentCommentSection documentId={documentItem.id} initialComments={comments} onCommentSubmit={handleCommentSubmit} />
    </div>
  )
}
