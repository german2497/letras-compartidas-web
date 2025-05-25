
"use client"

import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/placeholder-data'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight } from 'lucide-react'

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        {article.imageUrl && (
          <div className="relative aspect-[16/9] w-full mb-4">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
              data-ai-hint="article writing"
            />
          </div>
        )}
        <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
          <Link href={`/articulos/${article.id}`}>{article.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm mb-2">{new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} - Por {article.author}</p>
        <p className="text-foreground/80 leading-relaxed line-clamp-4">{article.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="text-primary hover:text-accent p-0">
          <Link href={`/articulos/${article.id}`}>
            Leer más <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ArticleCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <Skeleton className="aspect-[16/9] w-full mb-4 rounded-t-lg" />
        <Skeleton className="h-6 w-3/4 mb-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  )
}
