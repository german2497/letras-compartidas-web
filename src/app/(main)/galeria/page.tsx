
"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { placeholderGalleryImages, type GalleryImage, simulateFetch } from '@/lib/placeholder-data'
import { ImageGridItem, ImageGridItemSkeleton } from '@/components/shared/ImageGridItem'
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

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinkSettings>({});

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const fetchedImages = await simulateFetch(placeholderGalleryImages);
      setImages(fetchedImages);
      setLoading(false);
    };
    fetchImages();

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

  const filteredImages = useMemo(() => {
    if (!searchTerm) {
      return images;
    }
    return images.filter(image =>
      image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  const displaySocialLinks = 
    socialLinks.facebookUrl || socialLinks.twitterUrl || socialLinks.instagramUrl || socialLinks.linkedinUrl || socialLinks.youtubeUrl;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Galería de Arte y Cultura
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-xl mx-auto">
          Un espacio visual para la inspiración, con imágenes que evocan la belleza y la profundidad del arte y la cultura.
        </p>
      </header>

      <div className="relative max-w-lg mx-auto">
        <Input
          type="text"
          placeholder="Buscar imágenes por título o descripción..."
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
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <ImageGridItemSkeleton key={i} />)}
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <ImageGridItem key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">
          {searchTerm ? `No se encontraron imágenes para "${searchTerm}".` : "No hay imágenes para mostrar en este momento."}
        </p>
      )}
    </div>
  )
}
    

    