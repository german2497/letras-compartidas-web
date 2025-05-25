
"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { placeholderCourses, type Course, simulateFetch } from '@/lib/placeholder-data'
import { CourseCard, CourseCardSkeleton } from '@/components/cursos/CourseCard'
import { Input } from '@/components/ui/input'
import { Search, Facebook, Instagram, Linkedin, Youtube as YoutubeIcon } from 'lucide-react' 
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

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinkSettings>({});

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const fetchedCourses = await simulateFetch(placeholderCourses, 700);
      setCourses(fetchedCourses);
      setLoading(false);
    };
    fetchCourses();

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
  }, []);

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) {
      return courses;
    }
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return courses.filter(course =>
      course.title.toLowerCase().includes(lowerSearchTerm) ||
      course.description.toLowerCase().includes(lowerSearchTerm) ||
      (course.tags && course.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [courses, searchTerm]);

  const displaySocialLinks = 
    socialLinks.facebookUrl || socialLinks.twitterUrl || socialLinks.instagramUrl || socialLinks.linkedinUrl || socialLinks.youtubeUrl;

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Mis Cursos
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Explora mi oferta de cursos diseñados para potenciar tus habilidades de escritura y creatividad. 
          ¡Invierte en tu pasión y lleva tus letras al siguiente nivel!
        </p>
      </header>

      <div className="relative max-w-lg mx-auto">
        <Input
          type="text"
          placeholder="Buscar cursos por título, descripción o etiqueta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 text-base"
        />
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      </div>

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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">
          {searchTerm ? `No se encontraron cursos para "${searchTerm}".` : "Actualmente no hay cursos disponibles. ¡Vuelve pronto!"}
        </p>
      )}
    </div>
  )
}
    

    