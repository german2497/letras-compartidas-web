
import Image from 'next/image'
import Link from 'next/link' // Added Link import
import type { Book } from '@/lib/placeholder-data'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={book.coverUrl}
          alt={`Portada de ${book.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover rounded-t-lg"
          data-ai-hint="book cover"
        />
      </div>
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
        <CardDescription className="text-sm">Por {book.author}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-foreground/80 leading-relaxed flex-grow">
        <p className="line-clamp-3">{book.synopsis}</p> 
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/libros/${book.id}`}>Más detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function BookCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <Skeleton className="aspect-[2/3] w-full rounded-t-lg" />
      <CardHeader className="pt-4 pb-2">
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-grow space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
