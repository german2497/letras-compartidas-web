
import Image from 'next/image'
import Link from 'next/link'
import type { GalleryImage } from '@/lib/placeholder-data'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface ImageGridItemProps {
  image: GalleryImage
}

export function ImageGridItem({ image }: ImageGridItemProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={image.src}
            alt={image.alt} // Use alt as the primary alt text for accessibility
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={image.dataAiHint || "art culture"}
          />
        </div>
      </CardContent>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">{image.alt}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {image.shortDescription}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/galeria/${image.id}`}>
            Más detalles <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ImageGridItemSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-5 w-3/4 mb-1" />
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}
