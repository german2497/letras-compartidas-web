
"use client"

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { placeholderArticles, type Article, simulateFetch, placeholderCarouselSlides, placeholderForumPosts, type ForumPost } from '@/lib/placeholder-data'
import { ArticleCard, ArticleCardSkeleton } from '@/components/shared/ArticleCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, Facebook, Instagram, Linkedin, Youtube as YoutubeIcon } from 'lucide-react' 
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { PostCard, PostCardSkeleton } from '@/components/foro/PostCard'
import { Card, CardContent } from '@/components/ui/card'
// Import initialSettings for fallback
import { initialSettings as defaultSiteSettings } from '@/app/(main)/admin/configuracion-sitio/page';

interface SocialLinkSettings {
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string; 
}
const SETTINGS_STORAGE_KEY = 'letras-compartidas-site-settings';


export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loadingForumPosts, setLoadingForumPosts] = useState(true);
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }))
  const [socialLinks, setSocialLinks] = useState<SocialLinkSettings>({});


  useEffect(() => {
    const fetchPageData = async () => {
      setLoadingArticles(true);
      setLoadingForumPosts(true);

      const fetchedArticles = await simulateFetch(placeholderArticles.slice(0, 3)); 
      setArticles(fetchedArticles);
      setLoadingArticles(false);

      const fetchedForumPosts = await simulateFetch(placeholderForumPosts.slice(0, 6));
      setForumPosts(fetchedForumPosts);
      setLoadingForumPosts(false);
    };
    fetchPageData();

    if (typeof window !== 'undefined') {
      const storedSettingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettingsJson) {
        try {
          const parsedSettings = JSON.parse(storedSettingsJson) as Partial<SocialLinkSettings>;
          // Merge defaults with parsed settings to ensure all keys are present
          setSocialLinks({
            ...defaultSiteSettings, // Start with all defaults
            ...parsedSettings     // Override with any stored values
          });
        } catch (error) {
          console.error("Error parsing site settings from localStorage:", error);
          setSocialLinks({ ...defaultSiteSettings }); 
        }
      } else {
         setSocialLinks({ ...defaultSiteSettings }); 
      }
    }
  }, []);

  const displaySocialLinks = 
    socialLinks.facebookUrl || socialLinks.twitterUrl || socialLinks.instagramUrl || socialLinks.linkedinUrl || socialLinks.youtubeUrl;

  return (
    <div className="space-y-8">
      {displaySocialLinks && (
        <div className="flex justify-center items-center space-x-6 py-4 border-b mb-6">
          {socialLinks.facebookUrl && (
            <a href={socialLinks.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook size={22} />
            </a>
          )}
          {socialLinks.twitterUrl && (
            <a href={socialLinks.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted-foreground hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
            </a>
          )}
          {socialLinks.instagramUrl && (
            <a href={socialLinks.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram size={22} />
            </a>
          )}
          {socialLinks.linkedinUrl && (
            <a href={socialLinks.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={22} />
            </a>
          )}
          {socialLinks.youtubeUrl && (
            <a href={socialLinks.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
              <YoutubeIcon size={22} />
            </a>
          )}
        </div>
      )}

      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Bienvenido a Letras Compartidas por Azael Correa
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
          Un espacio dedicado a la escritura, la lectura y la educación. Explora, comparte y conecta.
        </p>
      </section>

      <section className="w-full">
        <Carousel
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {placeholderCarouselSlides.map((slide, index) => (
              <CarouselItem key={slide.id}>
                <div className="p-1">
                  <Card className="overflow-hidden shadow-lg">
                    <CardContent className="relative flex aspect-[16/9] items-center justify-center p-0">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        data-ai-hint={slide.dataAiHint || "community site"}
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{slide.title}</h3>
                        <p className="text-xs sm:text-sm md:text-base mt-2 max-w-prose">{slide.description}</p>
                        {slide.linkUrl && (
                            <Button asChild className="mt-4" variant="secondary">
                                <Link href={slide.linkUrl}>Saber más</Link>
                            </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 text-white bg-black/30 hover:bg-black/50 border-none disabled:opacity-30" />
          <CarouselNext className="right-2 sm:right-4 text-white bg-black/30 hover:bg-black/50 border-none disabled:opacity-30" />
        </Carousel>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center sm:text-left text-primary">
          Artículos Recientes del Autor
        </h2>
        {loadingArticles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
           <p className="text-muted-foreground text-center">No hay artículos del autor para mostrar.</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center sm:text-left text-primary">
          Publicaciones Recientes de la Comunidad
        </h2>
        {loadingForumPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : forumPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forumPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Aún no hay publicaciones en el foro.</p>
        )}
         <div className="text-center mt-8">
            <Button asChild>
              <Link href="/foro">
                Ver todas las publicaciones del foro <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
      </section>

    </div>
  )
}
