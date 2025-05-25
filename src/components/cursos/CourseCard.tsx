
"use client"

import Image from 'next/image'
import Link from 'next/link'
import type { Course } from '@/lib/placeholder-data'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ShoppingCart } from 'lucide-react'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-lg"
            data-ai-hint={course.dataAiHint || "online course education"}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <CardTitle className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {/* Could link to a detail page within the app if one existed */}
            {course.title}
        </CardTitle>
        <CardDescription className="text-sm text-foreground/80 leading-relaxed line-clamp-4 mb-4 flex-grow">
          {course.description}
        </CardDescription>
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full" size="lg">
          <Link href={course.hotmartLink} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-5 w-5" /> Ver en Hotmart <ExternalLink className="ml-2 h-4 w-4 opacity-70"/>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function CourseCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full rounded-t-lg" />
      <CardContent className="p-6 flex-grow flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-full mb-1" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-full mb-1" /> {/* Description line 2 */}
        <Skeleton className="h-4 w-5/6 mb-4" /> {/* Description line 3 */}
        <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Skeleton className="h-11 w-full" /> {/* Button */}
      </CardFooter>
    </Card>
  )
}
