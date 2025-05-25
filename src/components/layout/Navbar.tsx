
"use client"

import Link from 'next/link'
import { BookText, Home, Image as ImageIcon, Info, LogIn, LogOut, Menu, MessageSquare, User, Shield, GraduationCap, Gamepad2, Video } from 'lucide-react' // Added Video icon
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

const navLinks = [
  { href: '/', label: 'Inicio', icon: <Home className="h-4 w-4" /> },
  { href: '/libros', label: 'Libros', icon: <BookText className="h-4 w-4" /> },
  { href: '/galeria', label: 'Galería', icon: <ImageIcon className="h-4 w-4" /> },
  { href: '/foro', label: 'Foro', icon: <MessageSquare className="h-4 w-4" /> },
  { href: '/cursos', label: 'Cursos', icon: <GraduationCap className="h-4 w-4" /> },
  { href: '/juegos', label: 'Juegos', icon: <Gamepad2 className="h-4 w-4" /> }, 
  { href: '/conferencias', label: 'Conferencias', icon: <Video className="h-4 w-4" /> },
  { href: '/sobre-mi', label: 'Sobre Mí', icon: <Info className="h-4 w-4" /> },
]

export function Navbar() {
  const { user, signOutUser, loading } = useAuth()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const NavLinksContent = ({ isMobileSheet = false }: { isMobileSheet?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Button
          key={link.href}
          variant={isMobileSheet ? "ghost" : "ghost"}
          asChild
          className={`justify-start ${isMobileSheet ? 'w-full text-lg py-3' : 'text-sm'}`}
          onClick={() => isMobileSheet && setMobileMenuOpen(false)}
        >
          <Link 
            href={link.href} 
            className="flex items-center gap-2"
          >
            {isMobileSheet && link.icon}
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookText className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl sm:inline-block">Letras Compartidas</span>
        </Link>

        {isMobile ? (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-6">
              <div className="flex flex-col space-y-4">
                <NavLinksContent isMobileSheet={true} />
                {user && user.isAdmin && (
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start w-full text-lg py-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex items-center gap-2">
            <NavLinksContent />
            {user && user.isAdmin && (
               <Button variant="ghost" asChild className="text-sm">
                <Link href="/admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Admin
                </Link>
              </Button>
            )}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User Avatar"} />
                    <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                {user.isAdmin && <DropdownMenuItem disabled>Rol: Administrador</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOutUser} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
