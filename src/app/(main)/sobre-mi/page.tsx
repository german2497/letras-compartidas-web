
"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { placeholderArticles, type Article, simulateFetch } from '@/lib/placeholder-data'
import { ArticleCard, ArticleCardSkeleton } from '@/components/shared/ArticleCard'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Save, XCircle, PlusCircle, Facebook, Instagram, Linkedin, Youtube as YoutubeIcon } from 'lucide-react'
// Import initialSettings for fallback
import { initialSettings as defaultSiteSettings } from '@/app/(main)/admin/configuracion-sitio/page';

const initialCardTitle = "El Autor Detrás de las Letras";
const initialParagraphs = [
  "Soy un apasionado de la palabra escrita, un explorador incansable de las profundidades del lenguaje y un firme creyente en el poder transformador de la educación. Mi trayectoria se ha tejido entre la enseñanza, la investigación y la creación literaria, buscando siempre tender puentes entre el conocimiento y la comunidad.",
  "Este espacio, \"Letras Compartidas\", nace de la convicción de que las ideas florecen cuando se comparten. Es una invitación a leer, escribir, reflexionar y construir juntos un entorno de aprendizaje y crecimiento mutuo.",
  "A lo largo de mi carrera, he tenido el privilegio de publicar diversas obras, participar en congresos académicos y colaborar en proyectos educativos que buscan fomentar el pensamiento crítico y la creatividad. Mi enfoque se centra en la intersección de la literatura, la pedagogía y la filosofía, explorando cómo estas disciplinas pueden enriquecer nuestra comprensión del mundo y de nosotros mismos.",
  "Espero que encuentres en este sitio un rincón de inspiración y diálogo. ¡Bienvenido!"
];

interface SocialLinkSettings {
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
}
const SETTINGS_STORAGE_KEY = 'letras-compartidas-site-settings';

export default function SobreMiPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editableCardTitle, setEditableCardTitle] = useState(initialCardTitle);
  const [editableParagraphs, setEditableParagraphs] = useState<string[]>(initialParagraphs);

  const [originalCardTitle, setOriginalCardTitle] = useState(initialCardTitle);
  const [originalParagraphs, setOriginalParagraphs] = useState<string[]>(initialParagraphs);

  const [socialLinks, setSocialLinks] = useState<SocialLinkSettings>({});

  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      let articlesToDisplay: Article[];

      if (user?.isAdmin && user.displayName) {
        articlesToDisplay = placeholderArticles.filter(
          article => article.author === "Autor Principal" || article.author === user.displayName
        );
      } else {
        articlesToDisplay = placeholderArticles.filter(article => article.author === "Autor Principal");
      }
      
      articlesToDisplay.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const fetchedArticles = await simulateFetch(articlesToDisplay, 700);
      setArticles(fetchedArticles);
      setLoadingArticles(false);
    };
    fetchArticles();

    if (typeof window !== 'undefined') {
      const storedSettingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettingsJson) {
        try {
          const parsedSettings = JSON.parse(storedSettingsJson) as Partial<SocialLinkSettings>; 
          setSocialLinks({
            facebookUrl: parsedSettings.facebookUrl || defaultSiteSettings.facebookUrl,
            twitterUrl: parsedSettings.twitterUrl || defaultSiteSettings.twitterUrl,
            instagramUrl: parsedSettings.instagramUrl || defaultSiteSettings.instagramUrl,
            linkedinUrl: parsedSettings.linkedinUrl || defaultSiteSettings.linkedinUrl,
            youtubeUrl: parsedSettings.youtubeUrl || defaultSiteSettings.youtubeUrl,
          });
        } catch (error) {
          console.error("Error parsing site settings from localStorage:", error);
           setSocialLinks({
            facebookUrl: defaultSiteSettings.facebookUrl,
            twitterUrl: defaultSiteSettings.twitterUrl,
            instagramUrl: defaultSiteSettings.instagramUrl,
            linkedinUrl: defaultSiteSettings.linkedinUrl,
            youtubeUrl: defaultSiteSettings.youtubeUrl,
           });
        }
      } else {
         setSocialLinks({
            facebookUrl: defaultSiteSettings.facebookUrl,
            twitterUrl: defaultSiteSettings.twitterUrl,
            instagramUrl: defaultSiteSettings.instagramUrl,
            linkedinUrl: defaultSiteSettings.linkedinUrl,
            youtubeUrl: defaultSiteSettings.youtubeUrl,
         });
      }
    }
  }, [user]);

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalCardTitle(editableCardTitle);
      setOriginalParagraphs([...editableParagraphs]);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableCardTitle(originalCardTitle);
    setEditableParagraphs(originalParagraphs);
    setIsEditing(false);
  };

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...editableParagraphs];
    newParagraphs[index] = value;
    setEditableParagraphs(newParagraphs);
  };
  
  const displaySocialLinks = 
    socialLinks.facebookUrl || socialLinks.twitterUrl || socialLinks.instagramUrl || socialLinks.linkedinUrl || socialLinks.youtubeUrl;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Sobre Mí
        </h1>
      </header>

      <Card className="overflow-hidden shadow-lg">
        <div className="md:flex">
          <div className="md:w-1/3 md:shrink-0">
            <div className="relative h-64 w-full md:h-full">
              <Image
                src="https://placehold.co/400x500.png"
                alt="Foto del Autor"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                data-ai-hint="author portrait"
                priority
              />
            </div>
          </div>
          <div className="p-6 md:p-8 md:w-2/3">
            <CardHeader className="p-0 mb-4">
              {isEditing ? (
                <Input
                  value={editableCardTitle}
                  onChange={(e) => setEditableCardTitle(e.target.value)}
                  className="text-2xl font-semibold text-primary mb-2"
                  maxLength={100}
                />
              ) : (
                <CardTitle className="text-2xl font-semibold text-primary">
                  {editableCardTitle}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-foreground/80 leading-relaxed">
              {isEditing ? (
                editableParagraphs.map((p, index) => (
                  <Textarea
                    key={index}
                    value={p}
                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                    rows={5}
                    className="mb-2"
                  />
                ))
              ) : (
                editableParagraphs.map((p, index) => (
                  <p key={index}>{p}</p>
                ))
              )}
            </CardContent>
            {user?.isAdmin && (
              <div className="mt-6 flex gap-2 justify-end">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm">
                      <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                    <Button variant="outline" onClick={handleCancel} size="sm">
                      <XCircle className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEditToggle} variant="outline" size="sm">
                    <Edit3 className="mr-2 h-4 w-4" /> Editar Contenido
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {displaySocialLinks && (
        <section className="py-8 text-center border-t border-b">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Sígueme en mis redes sociales
          </h2>
          <div className="flex justify-center items-center space-x-6">
            {socialLinks.facebookUrl && (
              <a href={socialLinks.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={28} />
              </a>
            )}
            {socialLinks.twitterUrl && (
              <a href={socialLinks.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted-foreground hover:text-primary transition-colors">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
              </a>
            )}
            {socialLinks.instagramUrl && (
              <a href={socialLinks.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={28} />
              </a>
            )}
            {socialLinks.linkedinUrl && (
              <a href={socialLinks.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={28} />
              </a>
            )}
            {socialLinks.youtubeUrl && (
              <a href={socialLinks.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                <YoutubeIcon size={28} />
              </a>
            )}
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-primary text-center sm:text-left">
            Mis Artículos
          </h2>
          {user?.isAdmin && (
            <Button asChild>
              <Link href="/articulos/crear">
                <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Artículo
              </Link>
            </Button>
          )}
        </div>
        {loadingArticles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3].map((i) => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            {user?.isAdmin ? "Aún no has publicado ningún artículo." : "No hay artículos para mostrar en este momento."}
          </p>
        )}
      </section>
    </div>
  )
}
    

    