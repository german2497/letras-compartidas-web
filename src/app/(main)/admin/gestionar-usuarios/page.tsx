
"use client"

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft, Users, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GestionarUsuariosPage() {
  const { user, loading: authLoading, addSecondaryAdmin, removeSecondaryAdmin, getSecondaryAdmins } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [secondaryAdmins, setSecondaryAdmins] = useState<{ email: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace('/auth?redirect=/admin/gestionar-usuarios');
    } else if (user && user.isAdmin) {
      setSecondaryAdmins(getSecondaryAdmins());
    }
  }, [user, authLoading, router, getSecondaryAdmins]);

  const handleAddSecondaryAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminPassword.trim()) {
      toast({ title: "Error", description: "Correo y contraseña son obligatorios.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const success = await addSecondaryAdmin(newAdminEmail, newAdminPassword);
    if (success) {
      toast({ title: "Administrador Añadido", description: `Se otorgaron privilegios de administrador a ${newAdminEmail}.` });
      setNewAdminEmail('');
      setNewAdminPassword('');
      setSecondaryAdmins(getSecondaryAdmins()); // Refresh list
    } else {
      toast({ title: "Error al Añadir", description: `El correo ${newAdminEmail} ya podría existir o ser el administrador principal.`, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleRemoveSecondaryAdmin = async (emailToRemove: string) => {
    await removeSecondaryAdmin(emailToRemove);
    toast({ title: "Acceso Revocado", description: `Se revocaron los privilegios de administrador para ${emailToRemove}.` });
    setSecondaryAdmins(getSecondaryAdmins()); // Refresh list
    // Optional: Check if current user was removed and redirect, though AuthContext might handle this
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Cargando...</p></div>;
  }

  if (!user || !user.isAdmin) {
    // This case should ideally be handled by the redirect in useEffect, 
    // but kept as a fallback.
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Acceso Denegado</h1>
        <p className="text-lg text-muted-foreground">No tienes permisos para acceder a esta página.</p>
        <Button onClick={() => router.push('/auth?redirect=/admin/gestionar-usuarios')} className="mt-4">
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  const primaryAdminEmail = "yermanconde@hotmail.com"; // Hardcoded for display, matches AuthContext

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Button variant="outline" onClick={() => router.push('/admin')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel de Admin
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">Gestionar Administradores</CardTitle>
          </div>
          <CardDescription>
            Añadir o revocar privilegios de administrador a otros usuarios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">Administrador Principal</h3>
            <p className="text-sm text-muted-foreground">{primaryAdminEmail} (No se puede revocar)</p>
          </div>

          <form onSubmit={handleAddSecondaryAdmin} className="space-y-4 p-4 border rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-primary mb-2">Añadir Nuevo Administrador Secundario</h3>
            <div className="space-y-2">
              <Label htmlFor="newAdminEmail">Correo Electrónico del Nuevo Admin</Label>
              <Input
                id="newAdminEmail"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newAdminPassword">Contraseña para el Nuevo Admin</Label>
              <Input
                id="newAdminPassword"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Añadiendo...' : 'Añadir Administrador'}
            </Button>
          </form>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-2 mt-6">Administradores Secundarios Actuales</h3>
            {secondaryAdmins.length > 0 ? (
              <ul className="space-y-2">
                {secondaryAdmins.map(admin => (
                  <li key={admin.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <span className="text-sm">{admin.email}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveSecondaryAdmin(admin.email)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Revocar
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay administradores secundarios añadidos.</p>
            )}
          </div>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
                Nota: Los administradores secundarios podrán iniciar sesión usando el formulario de "Iniciar Sesión como Administrador Secundario" en la página de autenticación.
            </p>
         </CardFooter>
      </Card>
    </div>
  );
}

    