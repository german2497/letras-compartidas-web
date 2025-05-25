
"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import type { ForumPost } from '@/lib/placeholder-data'
import { placeholderForumPosts } from '@/lib/placeholder-data'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquareText, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: ForumPost
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    if (user) {
      const reaction = localStorage.getItem(`reaction_${user.uid}_${post.id}`);
      if (reaction === 'like' || reaction === 'dislike') {
        setUserReaction(reaction);
      }
    }
    setLikes(post.likes);
    setDislikes(post.dislikes);
  }, [post.id, post.likes, post.dislikes, user]);


  const handleReaction = (reactionType: 'like' | 'dislike') => {
    if (!user) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para reaccionar.", variant: "destructive" });
      return;
    }

    let newLikes = likes;
    let newDislikes = dislikes;
    let newReaction: 'like' | 'dislike' | null = userReaction;

    const postIndex = placeholderForumPosts.findIndex(p => p.id === post.id);
    if (postIndex === -1) return; 

    if (reactionType === 'like') {
      if (userReaction === 'like') { 
        newLikes--;
        newReaction = null;
      } else {
        newLikes++;
        if (userReaction === 'dislike') newDislikes--; 
        newReaction = 'like';
      }
    } else { 
      if (userReaction === 'dislike') { 
        newDislikes--;
        newReaction = null;
      } else {
        newDislikes++;
        if (userReaction === 'like') newLikes--; 
        newReaction = 'dislike';
      }
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserReaction(newReaction);

    placeholderForumPosts[postIndex].likes = newLikes;
    placeholderForumPosts[postIndex].dislikes = newDislikes;
    
    if (newReaction) {
      localStorage.setItem(`reaction_${user.uid}_${post.id}`, newReaction);
    } else {
      localStorage.removeItem(`reaction_${user.uid}_${post.id}`);
    }
  };

  const postDate = new Date(post.createdAt);
  const formattedDate = postDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + ' a las ' + postDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        {post.imageUrl && (
          <div className="relative aspect-[16/9] w-full mb-4">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
              data-ai-hint={post.dataAiHint || "writing discussion"}
            />
          </div>
        )}
        <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
          <Link href={`/foro/${post.id}`}>{post.title}</Link>
        </CardTitle>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{post.author.name}</span>
          <span>&bull;</span>
          <span>{formattedDate}</span>
        </div>
         {(post.genre || post.category) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.genre && <Badge variant="secondary">{post.genre}</Badge>}
            {post.category && <Badge variant="outline">{post.category}</Badge>}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/80 leading-relaxed line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 pt-4">
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center text-sm text-muted-foreground">
            <MessageSquareText className="h-4 w-4 mr-1" />
            {post.commentCount} comentarios
            </div>
            <Button variant="link" asChild className="text-primary hover:text-accent p-0 text-sm">
            <Link href={`/foro/${post.id}`}>
                Leer y comentar <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            </Button>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-border/50 w-full mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('like')}
            className={cn("p-1 h-auto text-muted-foreground hover:text-primary", userReaction === 'like' && "text-primary")}
            aria-label="Me gusta"
          >
            <ThumbsUp className={cn("h-4 w-4 mr-1", userReaction === 'like' && "fill-primary")} />
            {likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('dislike')}
            className={cn("p-1 h-auto text-muted-foreground hover:text-destructive", userReaction === 'dislike' && "text-destructive")}
            aria-label="No me gusta"
          >
            <ThumbsDown className={cn("h-4 w-4 mr-1", userReaction === 'dislike' && "fill-destructive")} />
            {dislikes}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export function PostCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <Skeleton className="aspect-[16/9] w-full mb-4 rounded-t-lg" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 pt-4">
        <div className="flex justify-between items-center w-full">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-border/50 w-full mt-2">
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-6 w-10" />
        </div>
      </CardFooter>
    </Card>
  )
}
