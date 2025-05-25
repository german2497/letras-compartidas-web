
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Newspaper, Info, Image as ImageIconLucide, Gamepad2, GraduationCap, Settings, Users, MessageSquare, Edit3, Video } from 'lucide-react';
import Link from 'next/link';

interface AdminSection {
  title: string;
  description: string;
  icon: React.ElementType;
  link?: string;
  disabled?: boolean;
  actionLabel?: string;
}

const adminSections: AdminSection[] = [
  { title: "Gestionar Artículos", description: "Crear, editar y eliminar artículos del blog.", icon: Newspaper, link: "/sobre-mi", actionLabel: "Ir a Artículos", disabled: false },
  { title: "Editar 'Sobre Mí'", description: "Actualizar la información de la página 'Sobre Mí'.", icon: Info, link: "/sobre-mi", actionLabel: "Ver Página", disabled: false },
  { title: "Gestionar Carrusel", description: "Modificar las imágenes y textos del carrusel principal.", icon: ImageIconLucide, link: "/admin/editar-carrusel", actionLabel: "Editar Carrusel", disabled: false },
  { title: "Gestionar Galería", description: "Subir y organizar imágenes en la galería.", icon: ImageIconLucide, link: "/admin/gestionar-galeria", actionLabel: "Gestionar Galería", disabled: false },
  { title: "Gestionar Juegos (PDFs)", description: "Subir y administrar documentos PDF de juegos.", icon: Gamepad2, link: "/admin/gestionar-juegos", actionLabel: "Gestionar Juegos", disabled: false },
  { title: "Gestionar Cursos", description: "Añadir y editar la información de los cursos.", icon: GraduationCap, link: "/admin/gestionar-cursos", actionLabel: "Gestionar Cursos", disabled: false },
  { title: "Gestionar Conferencias", description: "Añadir y editar videos de conferencias.", icon: Video, link: "/admin/gestionar-conferencias", actionLabel: "Gestionar Conferencias", disabled: false },
  { title: "Gestionar Foro", description: "Moderar publicaciones y comentarios del foro.", icon: MessageSquare, link: "/foro", actionLabel: "Moderar Foro", disabled: false },
  { title: "Configuración del Sitio", description: "Ajustes generales de la plataforma.", icon: Settings, link: "/admin/configuracion-sitio", actionLabel: "Ajustes", disabled: false },
  { title: "Gestionar Usuarios", description: "Ver y administrar roles de usuarios.", icon: Users, link: "/admin/gestionar-usuarios", actionLabel: "Gestionar Usuarios", disabled: false },
];


export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin'); 
    }
  }, [user, loading, router]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Acceso Denegado</h1>
        <p className="text-lg text-muted-foreground mb-6">
          No tienes permisos para acceder a esta página. Serás redirigido para iniciar sesión.
        </p>
        <Button onClick={() => router.push('/auth?redirect=/admin')}>Ir a Iniciar Sesión</Button>
      </div>
    );
  }

  // Contenido de la página de administrador si el usuario es admin
  return (
    <div className="space-y-8">
      <header className="text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Panel de Administración
        </h1>
        <p className="mt-2 text-lg text-foreground/80">
          Gestiona el contenido y la configuración del sitio.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Card key={section.title} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="flex-row items-center gap-4 pb-4">
              <section.icon className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{section.description}</CardDescription>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild variant={section.disabled ? "secondary" : "outline"} className="w-full" disabled={section.disabled}>
                {section.link && !section.disabled ? (
                  <Link href={section.link}>
                    <Edit3 className="mr-2 h-4 w-4" /> {section.actionLabel || "Gestionar"}
                  </Link>
                ) : (
                  <span><Edit3 className="mr-2 h-4 w-4" /> {section.actionLabel || "Gestionar"}</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <Card className="mt-8 bg-muted/30">
        <CardHeader>
            <CardTitle className="text-lg text-primary">Nota Importante sobre la Edición de Contenido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
                La funcionalidad completa de edición y gestión de contenido (crear nuevos artículos, modificar carrusel, gestionar usuarios con roles, etc.)
                requiere un backend y una base de datos, los cuales no están implementados en esta demostración frontend.
            </p>
            <p>
                Las páginas de "gestión" o "edición" para secciones como Carrusel, Galería, Juegos, Cursos y Conferencias permiten modificar datos
                en memoria para la sesión actual (simulando los cambios), que se reflejarán en el sitio hasta que se recargue la página.
                Para la gestión de artículos, los cambios en "Sobre Mí" y la creación/edición de artículos también son simulados y afectan a <code className="bg-primary/10 text-primary px-1 rounded">placeholderArticles</code> en memoria.
            </p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Artículos del Autor:</strong> Edita/crea desde la página <code className="bg-primary/10 text-primary px-1 rounded">Sobre Mí</code> o la página de detalle del artículo.</li>
                <li><strong>Página 'Sobre Mí':</strong> Edita el contenido directamente en la página <code className="bg-primary/10 text-primary px-1 rounded">Sobre Mí</code>.</li>
                <li><strong>Carrusel Principal:</strong> Usa la página <code className="bg-primary/10 text-primary px-1 rounded">admin/editar-carrusel</code>.</li>
                <li><strong>Galería de Imágenes:</strong> Usa la página <code className="bg-primary/10 text-primary px-1 rounded">admin/gestionar-galeria</code>.</li>
                <li><strong>Juegos (PDFs):</strong> Usa la página <code className="bg-primary/10 text-primary px-1 rounded">admin/gestionar-juegos</code>.</li>
                <li><strong>Cursos:</strong> Usa la página <code className="bg-primary/10 text-primary px-1 rounded">admin/gestionar-cursos</code>.</li>
                <li><strong>Conferencias:</strong> Usa la página <code className="bg-primary/10 text-primary px-1 rounded">admin/gestionar-conferencias</code>.</li>
                <li><strong>Contenido del Foro (Publicaciones/Comentarios):</strong> Los "Me gusta" se guardan en localStorage, el resto es en memoria. La moderación real no está implementada.</li>
                <li><strong>Configuración del Sitio:</strong> La página de "Configuración del Sitio" es puramente conceptual y los cambios de tema visual son temporales para la sesión y se guardan en localStorage.</li>
                <li><strong>Gestión de Usuarios:</strong> La página de "Gestionar Usuarios" es conceptual y no permite modificaciones reales de roles o usuarios.</li>
            </ul>
            <p className="mt-2">
                Para persistir los cambios de manera definitiva, sería necesario conectar la aplicación a una base de datos y desarrollar la lógica de backend correspondiente.
            </p>
        </CardContent>
       </Card>
    </div>
  );
}
