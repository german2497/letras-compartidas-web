
"use client"

import Image from 'next/image'
import Link from 'next/link'
import type { Conference } from '@/lib/placeholder-data'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PlayCircle } from 'lucide-react'

interface ConferenceCardProps {
  conference: Conference
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={conference.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver conferencia: ${conference.title}`}>
          <div className="relative aspect-[16/9] w-full group cursor-pointer">
            <Image
              src={conference.thumbnailUrl}
              alt={conference.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={conference.dataAiHint || "conference presentation"}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <CardTitle className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
          <Link href={conference.videoUrl} target="_blank" rel="noopener noreferrer">
            {conference.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2">
          Fecha: {new Date(conference.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <CardDescription className="text-sm text-foreground/80 leading-relaxed line-clamp-3 flex-grow">
          {conference.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full" variant="outline">
          <Link href={conference.videoUrl} target="_blank" rel="noopener noreferrer">
            <PlayCircle className="mr-2 h-5 w-5" /> Ver Conferencia
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ConferenceCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full rounded-t-lg" />
      <CardContent className="p-6 flex-grow flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-1/2 mb-3" /> {/* Date */}
        <Skeleton className="h-4 w-full mb-1" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-full mb-1" /> {/* Description line 2 */}
        <Skeleton className="h-4 w-5/6 mb-4" /> {/* Description line 3 */}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Skeleton className="h-10 w-full" /> {/* Button */}
      </CardFooter>
    </Card>
  )
}
