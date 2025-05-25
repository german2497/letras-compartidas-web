
"use client"

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { placeholderForumPosts, type ForumPost, simulateFetch } from '@/lib/placeholder-data'
import { PostCard, PostCardSkeleton } from '@/components/foro/PostCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, ThumbsUp, Trophy, UserCircle, Search, Award } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface RankedAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
  totalLikes: number;
  postCount: number;
}

interface CurrentUserRankingInfo {
  rank: number;
  stats: RankedAuthor;
  isTopX: boolean;
}

function RankingSkeleton() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <Skeleton className="h-7 w-1/2 mb-1" /> {/* Title */}
        <Skeleton className="h-4 w-3/4" /> {/* Description */}
      </CardHeader>
      <CardContent>
        {/* Simulating a fixed height for skeleton that might scroll */}
        <div className="h-80 overflow-hidden"> 
          <ol className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => ( 
              <li key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" /> 
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-24" /> 
                </div>
                <Skeleton className="h-5 w-16" /> 
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

const MAX_DISPLAYED_CONTRIBUTORS = 200; 

export default function ForoPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [allRankedAuthors, setAllRankedAuthors] = useState<RankedAuthor[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [currentUserRankingInfo, setCurrentUserRankingInfo] = useState<CurrentUserRankingInfo | null>(null);

  useEffect(() => {
    const fetchForumData = async () => {
      setLoadingPosts(true);
      setLoadingRanking(true);
      setCurrentUserRankingInfo(null); 

      const allFetchedPosts = await simulateFetch(placeholderForumPosts, 800); 
      setPosts(allFetchedPosts);
      setLoadingPosts(false);

      const authorStats: Record<string, { name: string; avatarUrl?: string; totalLikes: number; postCount: number }> = {};
      allFetchedPosts.forEach(post => {
        if (!post.author || !post.author.id) return; // Skip if author or author.id is undefined
        if (!authorStats[post.author.id]) {
          authorStats[post.author.id] = {
            name: post.author.name || 'Usuario Anónimo',
            avatarUrl: post.author.avatarUrl,
            totalLikes: 0,
            postCount: 0,
          };
        }
        authorStats[post.author.id].totalLikes += post.likes || 0;
        authorStats[post.author.id].postCount += 1;
      });

      const sortedAuthors = Object.entries(authorStats)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => {
          if (b.totalLikes !== a.totalLikes) {
            return b.totalLikes - a.totalLikes;
          }
          return a.name.localeCompare(b.name); 
        });
      
      setAllRankedAuthors(sortedAuthors);

      if (user) {
        const userRankIndex = sortedAuthors.findIndex(author => author.id === user.uid);
        if (userRankIndex !== -1) {
          setCurrentUserRankingInfo({
            rank: userRankIndex + 1,
            stats: sortedAuthors[userRankIndex],
            isTopX: userRankIndex < MAX_DISPLAYED_CONTRIBUTORS,
          });
        } else {
             // User might not have posts yet, or posts with 0 likes.
             // Create a default stat for them.
             setCurrentUserRankingInfo({
                rank: sortedAuthors.length + 1, // They are after everyone else for now
                stats: {
                    id: user.uid,
                    name: user.displayName || 'Tú',
                    avatarUrl: user.photoURL || undefined,
                    totalLikes: 0, // Default to 0 if no posts or likes
                    postCount: 0,  // Default to 0 if no posts
                },
                isTopX: false, // They are not in the top X if not found in sorted list of posters
             });
        }
      }
      setLoadingRanking(false);
    };
    fetchForumData();
  }, [user]);

  const topRankedAuthorsToDisplay = useMemo(() => {
    return allRankedAuthors.slice(0, MAX_DISPLAYED_CONTRIBUTORS);
  }, [allRankedAuthors]);

  const filteredPosts = useMemo(() => {
    let currentPosts = [...posts];

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      currentPosts = currentPosts.filter(post =>
        post.title.toLowerCase().includes(lowerSearchTerm) ||
        post.content.toLowerCase().includes(lowerSearchTerm) ||
        (post.author.name && post.author.name.toLowerCase().includes(lowerSearchTerm)) ||
        (post.genre && post.genre.toLowerCase().includes(lowerSearchTerm)) || 
        (post.category && post.category.toLowerCase().includes(lowerSearchTerm)) 
      );
    }
    
    return currentPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, searchTerm]);


  return (
    <div className="space-y-8">

      <section className="mb-8">
        {loadingRanking ? (
          <RankingSkeleton />
        ) : topRankedAuthorsToDisplay.length > 0 ? (
          <Card className="shadow-xl border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="h-7 w-7" />
                <CardTitle className="text-2xl sm:text-3xl font-bold">Top Contribuidores</CardTitle>
              </div>
              <CardDescription>Los {Math.min(topRankedAuthorsToDisplay.length, MAX_DISPLAYED_CONTRIBUTORS)} miembros más valorados por la comunidad.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80"> {/* Reduced height to h-80 (20rem) */}
                <ol className="space-y-1 pr-4">
                  {topRankedAuthorsToDisplay.map((author, index) => (
                    <li 
                      key={author.id} 
                      className="rounded-lg transition-colors hover:bg-accent/50"
                    >
                      <Link href={`/perfil/${author.id}`} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-primary w-8 text-center">
                            {index + 1}
                          </span>
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={author.avatarUrl} alt={author.name} />
                            <AvatarFallback>
                              {author.name ? author.name.split(' ').map(n => n[0]).join('').toUpperCase() : <UserCircle size={20} />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{author.name}</span>
                            <span className="text-xs text-muted-foreground">{author.postCount} {author.postCount === 1 ? 'publicación' : 'publicaciones'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-primary font-medium">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{author.totalLikes}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          !loadingRanking && <p className="text-center text-muted-foreground">Aún no hay suficientes datos para mostrar un ranking.</p>
        )}

        {user && currentUserRankingInfo && !loadingRanking && (
          <Card className="mt-6 shadow-md bg-accent/10 border-accent/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <p className="text-md font-semibold text-primary">
                  Tu posición actual en el ranking: #{currentUserRankingInfo.rank}
                </p>
                <p className="text-sm text-muted-foreground">
                  Con {currentUserRankingInfo.stats.totalLikes} 'Me gusta' en {currentUserRankingInfo.stats.postCount} {currentUserRankingInfo.stats.postCount === 1 ? 'publicación' : 'publicaciones'}.
                  {currentUserRankingInfo.isTopX && currentUserRankingInfo.rank <= MAX_DISPLAYED_CONTRIBUTORS ? ` ¡Estás entre los ${MAX_DISPLAYED_CONTRIBUTORS} primeros! Sigue así.` : " ¡Sigue participando para subir!"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
      
      <Separator />

      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Foro de la Comunidad
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            Comparte tus ideas, escritos y dialoga con otros miembros.
          </p>
        </div>
        {user && (
          <Button asChild size="lg">
            <Link href="/foro/crear">
              <PlusCircle className="mr-2 h-5 w-5" /> Crear Nueva Publicación
            </Link>
          </Button>
        )}
      </header>

      <Card className="my-6 shadow-md">
        <CardHeader>
            <CardTitle className="text-xl">Buscar y Filtrar Publicaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative">
                <Label htmlFor="search-input" className="sr-only">Buscar</Label>
                <Input
                    id="search-input"
                    type="text"
                    placeholder="Buscar publicaciones por título, contenido o autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-base"
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
        </CardContent>
      </Card>


      {loadingPosts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              {searchTerm ? `No se encontraron publicaciones para "${searchTerm}".` : "Aún no hay publicaciones."}
            </p>
            {!searchTerm && ( 
                user ? (
                    <p className="mt-2 text-muted-foreground">¡Sé el primero en compartir algo!</p>
                ) : (
                    <p className="mt-2 text-muted-foreground">
                        <Link href="/auth" className="text-primary hover:underline">Inicia sesión</Link> para crear una publicación.
                    </p>
                )
            )}
        </div>
      )}
    </div>
  )

    