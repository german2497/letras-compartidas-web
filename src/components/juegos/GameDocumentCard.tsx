
"use client"

import Image from 'next/image'
import Link from 'next/link'
import type { GameDocument } from '@/lib/placeholder-data'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Eye } from 'lucide-react' // Changed icon to Eye for "Ver Detalles"

interface GameDocumentCardProps {
  gameDocument: GameDocument
}

export function GameDocumentCard({ gameDocument }: GameDocumentCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/juegos/${gameDocument.id}`} aria-label={`Ver detalles de ${gameDocument.title}`}>
          <div className="relative aspect-[16/9] w-full cursor-pointer">
            <Image
              src={gameDocument.coverImageUrl}
              alt={gameDocument.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
              data-ai-hint={gameDocument.dataAiHint || "game document"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <CardTitle className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
          <Link href={`/juegos/${gameDocument.id}`}>
            {gameDocument.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-foreground/80 leading-relaxed line-clamp-3 flex-grow">
          {gameDocument.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full" size="lg" variant="outline">
          <Link href={`/juegos/${gameDocument.id}`}>
            <Eye className="mr-2 h-5 w-5" /> Ver Detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function GameDocumentCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full rounded-t-lg" />
      <CardContent className="p-6 flex-grow flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-full mb-1" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-full mb-1" /> {/* Description line 2 */}
        <Skeleton className="h-4 w-5/6 mb-4" /> {/* Description line 3 */}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Skeleton className="h-11 w-full" /> {/* Button */}
      </CardFooter>
    </Card>
  )
}
