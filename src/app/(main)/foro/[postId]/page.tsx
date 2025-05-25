
"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation' 
import { placeholderForumPosts, placeholderComments, type ForumPost, type Comment, simulateFetch } from '@/lib/placeholder-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CommentSection } from '@/components/foro/CommentSection'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

function PostPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <Skeleton className="h-10 w-1/4 mb-8" /> {/* Back button */}
      <Card className="shadow-xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-1">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="aspect-[16/9] w-full my-4 rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24 ml-2" />
        </CardFooter>
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


export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth() 
  const { toast } = useToast();

  const postId = typeof params.postId === 'string' ? params.postId : undefined;
  
  const [post, setPost] = useState<ForumPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);


  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        setLoading(true)
        const foundPost = await simulateFetch(placeholderForumPosts.find(p => p.id === postId))
        
        if (foundPost) {
          setPost(foundPost)
          setLikes(foundPost.likes);
          setDislikes(foundPost.dislikes);

          if (user) {
            const reaction = localStorage.getItem(`reaction_${user.uid}_${foundPost.id}`);
            if (reaction === 'like' || reaction === 'dislike') {
              setUserReaction(reaction);
            } else {
              setUserReaction(null);
            }
          } else {
            setUserReaction(null);
          }

          const postComments = await simulateFetch(placeholderComments.filter(c => c.postId === postId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setComments(postComments)
        } else {
          router.replace('/foro') 
        }
        setLoading(false)
      }
      fetchPostData()
    }
  }, [postId, router, user]) 

  const handleReaction = (reactionType: 'like' | 'dislike') => {
    if (!user) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para reaccionar.", variant: "destructive" });
      return;
    }
    if (!post) return;

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

  const handleCommentSubmit = async (content: string): Promise<Comment | null> => {
    if (!user || !post) return null;
    const newComment: Comment = {
      id: `comment${Date.now()}`,
      postId: post.id,
      author: {
        id: user.uid || 'unknown-user',
        name: user.displayName || 'Usuario Anónimo',
        avatarUrl: user.photoURL || undefined,
      },
      content,
      createdAt: new Date().toISOString(),
    };
    await simulateFetch(null, 500); 
    
    placeholderComments.unshift(newComment);
    const postIndex = placeholderForumPosts.findIndex(p => p.id === post.id);
    if (postIndex !== -1) {
        placeholderForumPosts[postIndex].commentCount += 1;
        setPost(prevPost => prevPost ? {...prevPost, commentCount: prevPost.commentCount + 1} : null);
    }
    return newComment;
  };

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <p className="text-2xl text-destructive">Publicación no encontrada.</p>
        <Button onClick={() => router.push('/foro')} className="mt-4">Volver al Foro</Button>
      </div>
    );
  }
  
  const postDate = new Date(post.createdAt);
  const formattedDate = postDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + ' a las ' + postDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });


  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-primary mb-2">{post.title}</CardTitle>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{post.author.name}</p>
              <p>{formattedDate}</p>
            </div>
          </div>
          {(post.genre || post.category) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.genre && <Badge variant="secondary">{post.genre}</Badge>}
              {post.category && <Badge variant="outline">{post.category}</Badge>}
            </div>
          )}
          {post.imageUrl && (
            <div className="relative aspect-[16/9] w-full my-6 rounded-lg overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
                data-ai-hint={post.dataAiHint || "discussion topic"}
                priority
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 mt-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction('like')}
                    className={cn("p-1 h-auto text-muted-foreground hover:text-primary", userReaction === 'like' && "text-primary")}
                    aria-label="Me gusta"
                >
                    <ThumbsUp className={cn("h-5 w-5 mr-1", userReaction === 'like' && "fill-primary")} />
                    {likes}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction('dislike')}
                    className={cn("p-1 h-auto text-muted-foreground hover:text-destructive", userReaction === 'dislike' && "text-destructive")}
                    aria-label="No me gusta"
                >
                    <ThumbsDown className={cn("h-5 w-5 mr-1", userReaction === 'dislike' && "fill-destructive")} />
                    {dislikes}
                </Button>
            </div>
        </CardFooter>
      </Card>

      <CommentSection postId={post.id} initialComments={comments} onCommentSubmit={handleCommentSubmit} />
    </div>
  )
}
