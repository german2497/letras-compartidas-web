
"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation' 
import { placeholderBooks, placeholderBookComments, type Book, type BookComment, simulateFetch } from '@/lib/placeholder-data'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BookCommentSection } from '@/components/libros/BookCommentSection'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Facebook, Twitter, Linkedin, Copy, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

function BookPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-10 w-1/4 mb-8" /> {/* Back button */}
      <Card className="shadow-xl overflow-hidden md:flex">
        <div className="md:w-1/3">
          <Skeleton className="aspect-[2/3] w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" />
        </div>
        <div className="md:w-2/3 p-6">
          <CardHeader className="p-0 pb-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
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
        </div>
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


export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth() 
  const { toast } = useToast()
  
  const bookId = typeof params.bookId === 'string' ? params.bookId : undefined;
  
  const [book, setBook] = useState<Book | null>(null)
  const [comments, setComments] = useState<BookComment[]>([])
  const [loading, setLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (bookId) {
      const fetchBookData = async () => {
        setLoading(true)
        const foundBook = await simulateFetch(placeholderBooks.find(b => b.id === bookId))
        
        if (foundBook) {
          setBook(foundBook)
          const bookComments = await simulateFetch(placeholderBookComments.filter(c => c.bookId === bookId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setComments(bookComments)
        } else {
          router.replace('/libros') 
        }
        setLoading(false)
      }
      fetchBookData()
    }
  }, [bookId, router])

  const handleCommentSubmit = async (content: string): Promise<BookComment | null> => {
    if (!user || !book) return null;
    const newComment: BookComment = {
      id: `bcomment${Date.now()}`,
      bookId: book.id,
      author: {
        id: user.uid || 'unknown-user',
        name: user.displayName || 'Usuario Anónimo',
        avatarUrl: user.photoURL || undefined,
      },
      content,
      createdAt: new Date().toISOString(),
    };
    await simulateFetch(null, 500); 
    
    placeholderBookComments.unshift(newComment);
    const bookIndex = placeholderBooks.findIndex(b => b.id === book.id);
    if (bookIndex !== -1) {
        placeholderBooks[bookIndex].commentCount += 1;
        setBook(prevBook => prevBook ? {...prevBook, commentCount: prevBook.commentCount + 1} : null);
    }
    return newComment;
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setIsCopied(true);
        toast({ title: "Enlace copiado", description: "El enlace a este libro ha sido copiado al portapapeles." });
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        toast({ title: "Error", description: "No se pudo copiar el enlace.", variant: "destructive" });
        console.error('Failed to copy: ', err);
      });
    }
  };

  if (loading) {
    return <BookPageSkeleton />;
  }

  if (!book) {
    return (
      <div className="text-center py-10">
        <p className="text-2xl text-destructive">Libro no encontrado.</p>
        <Button onClick={() => router.push('/libros')} className="mt-4">Volver a Libros</Button>
      </div>
    );
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = book ? `Recomiendo este libro: "${book.title}" por ${book.author}` : 'Echa un vistazo a este libro';
  const encodedPageUrl = encodeURIComponent(pageUrl);
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareTextAndUrl = encodeURIComponent(`${shareText} ${pageUrl}`);

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <Card className="shadow-xl overflow-hidden md:flex">
        <div className="md:w-1/3 md:shrink-0">
          <div className="relative aspect-[2/3] w-full h-full">
            <Image
              src={book.coverUrl}
              alt={`Portada de ${book.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover md:rounded-l-lg md:rounded-r-none rounded-t-lg"
              data-ai-hint="book cover"
              priority
            />
          </div>
        </div>
        <div className="p-6 md:p-8 md:w-2/3">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-3xl font-bold text-primary mb-1">{book.title}</CardTitle>
            <p className="text-lg text-muted-foreground">Por {book.author}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="prose max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap mb-6">
              <p>{book.synopsis}</p>
            </div>

            {/* Share Buttons Section */}
            <div className="pt-4 border-t">
              <h4 className="text-md font-semibold mb-3 text-primary">Compartir este libro:</h4>
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
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedPageUrl}&title=${encodeURIComponent(book.title)}&summary=${encodedShareText}`}
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
        </div>
      </Card>

      <BookCommentSection bookId={book.id} initialComments={comments} onCommentSubmit={handleCommentSubmit} />
    </div>
  )
}
