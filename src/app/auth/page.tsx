
"use client"

import { AuthButtons } from '@/components/auth/AuthButtons'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, LogIn, ShieldCheck } from 'lucide-react' // Added ShieldCheck for secondary admin
import { Separator } from '@/components/ui/separator'

export default function AuthPage() {
  const { user, loading, signInAsAdmin, signInAsSecondaryAdmin } = useAuth()
  const router = useRouter()

  const [primaryAdminEmail, setPrimaryAdminEmail] = useState('');
  const [primaryAdminPassword, setPrimaryAdminPassword] = useState('');
  const [primaryAdminError, setPrimaryAdminError] = useState('');
  const [isLoggingInPrimaryAdmin, setIsLoggingInPrimaryAdmin] = useState(false);

  const [secondaryAdminEmail, setSecondaryAdminEmail] = useState('');
  const [secondaryAdminPassword, setSecondaryAdminPassword] = useState('');
  const [secondaryAdminError, setSecondaryAdminError] = useState('');
  const [isLoggingInSecondaryAdmin, setIsLoggingInSecondaryAdmin] = useState(false);


  useEffect(() => {
    if (!loading && user) {
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || (user.isAdmin ? '/admin' : '/');
      router.push(redirectPath); 
    }
  }, [user, loading, router])

  const handlePrimaryAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrimaryAdminError('');
    setIsLoggingInPrimaryAdmin(true);
    try {
      const success = await signInAsAdmin(primaryAdminEmail, primaryAdminPassword);
      if (success) {
        const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/admin';
        router.push(redirectPath);
      } else {
        setPrimaryAdminError('Credenciales de administrador principal incorrectas.');
      }
    } catch (err) {
      setPrimaryAdminError('Ocurrió un error al intentar iniciar sesión como administrador principal.');
      console.error(err);
    } finally {
      setIsLoggingInPrimaryAdmin(false);
    }
  };

  const handleSecondaryAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecondaryAdminError('');
    setIsLoggingInSecondaryAdmin(true);
    try {
      const success = await signInAsSecondaryAdmin(secondaryAdminEmail, secondaryAdminPassword);
      if (success) {
        const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/admin';
        router.push(redirectPath);
      } else {
        setSecondaryAdminError('Credenciales de administrador secundario incorrectas.');
      }
    } catch (err) {
      setSecondaryAdminError('Ocurrió un error al intentar iniciar sesión como administrador secundario.');
      console.error(err);
    } finally {
      setIsLoggingInSecondaryAdmin(false);
    }
  };

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <p>Cargando...</p>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-lg shadow-2xl"> {/* Increased max-w-lg */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Únete a la Comunidad</CardTitle>
          <CardDescription className="text-md pt-2">
            Inicia sesión para compartir tus escritos, comentar y conectar con otros amantes de las letras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuthButtons />
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O Inicios de Sesión para Administradores
              </span>
            </div>
          </div>

          {/* Primary Admin Login */}
          <form onSubmit={handlePrimaryAdminLoginSubmit} className="space-y-4 border p-4 rounded-md">
            <h3 className="text-center font-semibold text-primary">Acceso Administrador Principal</h3>
            <div>
              <Label htmlFor="primary-admin-email">Correo de Administrador Principal</Label>
              <Input
                id="primary-admin-email"
                type="email"
                value={primaryAdminEmail}
                onChange={(e) => setPrimaryAdminEmail(e.target.value)}
                placeholder="admin.principal@ejemplo.com"
                required
                disabled={isLoggingInPrimaryAdmin}
              />
            </div>
            <div>
              <Label htmlFor="primary-admin-password">Contraseña de Administrador Principal</Label>
              <Input
                id="primary-admin-password"
                type="password"
                value={primaryAdminPassword}
                onChange={(e) => setPrimaryAdminPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoggingInPrimaryAdmin}
              />
            </div>
            {primaryAdminError && <p className="text-sm text-destructive">{primaryAdminError}</p>}
            <Button type="submit" className="w-full" disabled={isLoggingInPrimaryAdmin}>
              <LogIn className="mr-2 h-4 w-4" />
              {isLoggingInPrimaryAdmin ? 'Ingresando...' : 'Ingresar como Admin Principal'}
            </Button>
          </form>

          {/* Secondary Admin Login */}
          <form onSubmit={handleSecondaryAdminLoginSubmit} className="space-y-4 border p-4 rounded-md">
            <h3 className="text-center font-semibold text-primary">Acceso Administrador Secundario</h3>
            <div>
              <Label htmlFor="secondary-admin-email">Correo de Administrador Secundario</Label>
              <Input
                id="secondary-admin-email"
                type="email"
                value={secondaryAdminEmail}
                onChange={(e) => setSecondaryAdminEmail(e.target.value)}
                placeholder="admin.secundario@ejemplo.com"
                required
                disabled={isLoggingInSecondaryAdmin}
              />
            </div>
            <div>
              <Label htmlFor="secondary-admin-password">Contraseña de Administrador Secundario</Label>
              <Input
                id="secondary-admin-password"
                type="password"
                value={secondaryAdminPassword}
                onChange={(e) => setSecondaryAdminPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoggingInSecondaryAdmin}
              />
            </div>
            {secondaryAdminError && <p className="text-sm text-destructive">{secondaryAdminError}</p>}
            <Button type="submit" className="w-full" variant="secondary" disabled={isLoggingInSecondaryAdmin}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              {isLoggingInSecondaryAdmin ? 'Ingresando...' : 'Ingresar como Admin Secundario'}
            </Button>
          </form>


        </CardContent>
        <CardFooter className="flex flex-col items-center pt-6 border-t mt-6">
          <Button variant="outline" onClick={() => router.push('/')} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

    