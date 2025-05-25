
"use client"

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, ShieldAlert, Settings, Link as LinkIcon, Palette, Youtube as YoutubeIcon } from 'lucide-react';

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
}

// Extended interface for what's stored in localStorage, including theme colors
interface StoredSiteSettings extends SiteSettings {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
}

const SETTINGS_STORAGE_KEY = 'letras-compartidas-site-settings';

export const initialSettings: StoredSiteSettings = {
  siteTitle: 'Letras Compartidas',
  siteDescription: 'Un espacio para escribir, leer y compartir ideas en comunidad.',
  contactEmail: 'contacto@letrascompartidas.com',
  facebookUrl: 'https://facebook.com/letrascompartidas',
  twitterUrl: 'https://twitter.com/letrascompartidas',
  instagramUrl: 'https://instagram.com/letrascompartidas',
  linkedinUrl: 'https://linkedin.com/company/letrascompartidas',
  youtubeUrl: 'https://youtube.com/c/letrascompartidas',
  primaryColor: "218 48% 17%", // Azul Oscuro (Predeterminado)
  accentColor: "207 55% 56%", // Azul Claro (Predeterminado)
  backgroundColor: "240 10% 95%", // Blanco Hueso (Predeterminado)
};

const colorOptions = [
  { label: "Azul Oscuro (Predeterminado)", value: "218 48% 17%" }, 
  { label: "Rojo Intenso", value: "0 72% 51%" }, 
  { label: "Verde Bosque", value: "120 39% 30%" },
  { label: "Púrpura Profundo", value: "270 40% 30%" },
  { label: "Naranja Vibrante", value: "30 90% 55%" },
  { label: "Gris Carbón", value: "240 5% 20%" },
  { label: "Azul Marino Clásico", value: "240 60% 25%" },
  { label: "Verde Esmeralda", value: "145 63% 35%" },
  { label: "Borgoña Elegante", value: "340 50% 40%" },
  { label: "Marrón Tierra", value: "30 30% 30%" },
  { label: "Azul Petróleo", value: "180 40% 25%" },
  { label: "Gris Grafito", value: "210 10% 30%" },
];

const accentColorOptions = [
  { label: "Azul Claro (Predeterminado)", value: "207 55% 56%" },
  { label: "Amarillo Dorado", value: "45 100% 51%" },
  { label: "Verde Lima", value: "90 59% 50%" },
  { label: "Lavanda Suave", value: "270 60% 70%" },
  { label: "Rosa Coral", value: "5 80% 65%" },
  { label: "Cian Brillante", value: "180 70% 50%" },
  { label: "Naranja Suave", value: "30 100% 70%" },
  { label: "Turquesa Vibrante", value: "170 70% 45%" },
  { label: "Fucsia Eléctrico", value: "300 80% 60%" },
  { label: "Menta Fresca", value: "150 60% 65%" },
  { label: "Dorado Ocre", value: "40 70% 55%" },
  { label: "Azul Cielo", value: "195 80% 60%" },
];

const backgroundColorOptions = [
    { label: "Blanco Hueso (Predeterminado)", value: "240 10% 95%" },
    { label: "Gris Muy Claro", value: "220 20% 96%" },
    { label: "Azul Pálido", value: "210 60% 97%" },
    { label: "Verde Menta Ligero", value: "150 40% 96%" },
    { label: "Amarillo Crema", value: "60 50% 96%" },
    { label: "Rosa Pálido", value: "340 50% 97%" },
    { label: "Beige Claro", value: "40 30% 95%" },
    { label: "Lavanda Pálido", value: "250 50% 97%" },
];


export default function ConfiguracionSitioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(initialSettings.primaryColor!);
  const [selectedAccentColor, setSelectedAccentColor] = useState(initialSettings.accentColor!);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(initialSettings.backgroundColor!);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin/configuracion-sitio');
    }
    
    if (typeof window !== 'undefined') {
      const storedSettingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
      let activeSettings = { ...initialSettings }; 
      
      if (storedSettingsJson) {
        try {
          const parsedSettings = JSON.parse(storedSettingsJson) as StoredSiteSettings;
          // Merge stored settings with initial settings to ensure all keys are present
          activeSettings = {
            ...initialSettings, // Start with defaults
            ...parsedSettings,  // Override with stored values if they exist
          };
        } catch (error) {
          console.error("Error parsing settings from localStorage", error);
          // Fallback to initialSettings if parsing fails
          activeSettings = { ...initialSettings };
        }
      }
      setSettings({
        siteTitle: activeSettings.siteTitle,
        siteDescription: activeSettings.siteDescription,
        contactEmail: activeSettings.contactEmail,
        facebookUrl: activeSettings.facebookUrl,
        twitterUrl: activeSettings.twitterUrl,
        instagramUrl: activeSettings.instagramUrl,
        linkedinUrl: activeSettings.linkedinUrl,
        youtubeUrl: activeSettings.youtubeUrl,
      });
      setSelectedPrimaryColor(activeSettings.primaryColor!);
      setSelectedAccentColor(activeSettings.accentColor!);
      setSelectedBackgroundColor(activeSettings.backgroundColor!);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--primary', selectedPrimaryColor);
    }
  }, [selectedPrimaryColor]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--accent', selectedAccentColor);
    }
  }, [selectedAccentColor]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--background', selectedBackgroundColor);
    }
  }, [selectedBackgroundColor]);

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const settingsToSave: StoredSiteSettings = {
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      facebookUrl: settings.facebookUrl,
      twitterUrl: settings.twitterUrl,
      instagramUrl: settings.instagramUrl,
      linkedinUrl: settings.linkedinUrl,
      youtubeUrl: settings.youtubeUrl,
      primaryColor: selectedPrimaryColor,
      accentColor: selectedAccentColor,
      backgroundColor: selectedBackgroundColor,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
    }
    
    // Short delay to simulate saving
    await new Promise(resolve => setTimeout(resolve, 700)); 

    toast({
      title: "Configuración Guardada y Tema Aplicado",
      description: `Los cambios se han guardado y el tema se ha actualizado visualmente para esta sesión.`,
    });
    setIsSaving(false);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Cargando...</p></div>;
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Acceso Denegado</h1>
        <p className="text-lg text-muted-foreground">No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={() => router.push('/admin')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel de Admin
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">Configuración del Sitio</CardTitle>
          </div>
          <CardDescription>
            Ajusta la configuración general de la plataforma. Los cambios en el tema visual se aplican inmediatamente y se guardan en localStorage para persistir entre sesiones en este navegador.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Título del Sitio</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                placeholder="Ej: Mi Gran Sitio Literario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descripción Corta del Sitio</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                placeholder="Una breve descripción de tu sitio para motores de búsqueda y redes sociales."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Correo Electrónico de Contacto</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="ejemplo@dominio.com"
              />
            </div>
            
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Enlaces a Redes Sociales</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <Label htmlFor="facebookUrl">Facebook URL</Label>
                        <Input id="facebookUrl" value={settings.facebookUrl} onChange={(e) => handleInputChange('facebookUrl', e.target.value)} placeholder="https://facebook.com/tu_pagina" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="twitterUrl">X (Twitter) URL</Label>
                        <Input id="twitterUrl" value={settings.twitterUrl} onChange={(e) => handleInputChange('twitterUrl', e.target.value)} placeholder="https://twitter.com/tu_usuario" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="instagramUrl">Instagram URL</Label>
                        <Input id="instagramUrl" value={settings.instagramUrl} onChange={(e) => handleInputChange('instagramUrl', e.target.value)} placeholder="https://instagram.com/tu_usuario" />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                        <Input id="linkedinUrl" value={settings.linkedinUrl} onChange={(e) => handleInputChange('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/tu_empresa" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="youtubeUrl">YouTube URL</Label>
                        <Input id="youtubeUrl" value={settings.youtubeUrl} onChange={(e) => handleInputChange('youtubeUrl', e.target.value)} placeholder="https://youtube.com/c/tu_canal" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg text-primary">Opciones de Tema</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Selecciona colores para el tema. Los cambios se aplicarán visualmente de inmediato y se guardarán en localStorage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <Label htmlFor="primaryColor">Color Primario</Label>
                        <Select value={selectedPrimaryColor} onValueChange={setSelectedPrimaryColor}>
                            <SelectTrigger id="primaryColor">
                                <SelectValue placeholder="Selecciona un color primario" />
                            </SelectTrigger>
                            <SelectContent>
                                {colorOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center">
                                            <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: `hsl(${option.value})` }}></span>
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="accentColor">Color de Acento</Label>
                         <Select value={selectedAccentColor} onValueChange={setSelectedAccentColor}>
                            <SelectTrigger id="accentColor">
                                <SelectValue placeholder="Selecciona un color de acento" />
                            </SelectTrigger>
                            <SelectContent>
                                {accentColorOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                       <div className="flex items-center">
                                            <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: `hsl(${option.value})` }}></span>
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="backgroundColor">Color de Fondo</Label>
                         <Select value={selectedBackgroundColor} onValueChange={setSelectedBackgroundColor}>
                            <SelectTrigger id="backgroundColor">
                                <SelectValue placeholder="Selecciona un color de fondo" />
                            </SelectTrigger>
                            <SelectContent>
                                {backgroundColorOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                       <div className="flex items-center">
                                            <span className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: `hsl(${option.value})` }}></span>
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
