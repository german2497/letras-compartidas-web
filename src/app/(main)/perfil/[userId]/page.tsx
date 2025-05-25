
"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { placeholderForumPosts, type ForumPost, placeholderComments, type Comment, simulateFetch } from '@/lib/placeholder-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostCard, PostCardSkeleton } from '@/components/foro/PostCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { User as UserIcon, Edit3, MessageSquare, ArrowLeft } from 'lucide-react'

interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  description?: string; // Added description field
  posts: ForumPost[];
}

function UserProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-10 w-1/4 mb-6" /> {/* Back button */}
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center border-b pb-6">
          <Skeleton className="h-32 w-32 rounded-full mb-4" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-5 w-3/4" /> {/* Placeholder for name */}
          <Skeleton className="h-4 w-2/3 mt-1" /> {/* Placeholder for description */}
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-7 w-1/3 mb-6" /> {/* Posts title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: loggedInUser } = useAuth();
  const userId = typeof params.userId === 'string' ? params.userId : undefined;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
        setLoading(true);
        await simulateFetch(null, 700);

        let userAuthorData = null;
        const userPosts: ForumPost[] = [];

        placeholderForumPosts.forEach(post => {
          if (post.author.id === userId) {
            userPosts.push(post);
            if (!userAuthorData) {
              userAuthorData = post.author;
            }
          }
        });
        
        if (!userAuthorData) {
          for (const comment of placeholderComments) {
            if (comment.author.id === userId) {
                userAuthorData = comment.author;
                break;
            }
          }
        }

        if (userAuthorData) {
          let description: string | undefined = undefined;
          // If viewing own profile, get description from AuthContext
          if (loggedInUser && userAuthorData.id === loggedInUser.uid) {
            description = loggedInUser.description;
          }

          setProfile({
            id: userAuthorData.id,
            name: userAuthorData.name,
            avatarUrl: userAuthorData.avatarUrl,
            description: description, // Set description
            posts: userPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
          });
        }
        setLoading(false);
      };
      fetchUserProfile();
    } else {
      router.replace('/foro');
    }
  }, [userId, router, loggedInUser]); // Added loggedInUser to dependency array

  if (loading) {
    return <UserProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <UserIcon className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-3">Usuario no encontrado</h1>
        <p className="text-lg text-muted-foreground mb-6">
          No pudimos encontrar el perfil del usuario solicitado.
        </p>
        <Button onClick={() => router.push('/foro')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Foro
        </Button>
      </div>
    );
  }

  const isOwnProfile = loggedInUser?.uid === profile.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="items-center text-center border-b pb-6 bg-card">
          <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-md mb-4">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="text-4xl">
              {profile.name ? profile.name.charAt(0).toUpperCase() : <UserIcon size={48} />}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-primary">{profile.name}</CardTitle>
          
          {profile.description ? (
            <p className="text-muted-foreground mt-2 max-w-prose text-sm leading-relaxed whitespace-pre-wrap">{profile.description}</p>
          ) : (
            <p className="text-muted-foreground mt-2 italic text-sm">
              {isOwnProfile ? "Aún no has añadido una descripción." : "Este usuario no ha añadido una descripción."}
            </p>
          )}

          {isOwnProfile && (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/perfil">
                <Edit3 className="mr-2 h-4 w-4" /> Editar mi perfil
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-8">
          <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center">
            <MessageSquare className="mr-3 h-6 w-6" />
            Publicaciones de {profile.name} ({profile.posts.length})
          </h2>
          {profile.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              {profile.name} aún no ha realizado ninguna publicación.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
