"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Chrome, Facebook } from 'lucide-react' // Chrome for Google icon placeholder
import { useToast } from '@/hooks/use-toast'

export function AuthButtons() {
  const { signInWithGoogle, signInWithFacebook, loading } = useAuth()
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast({ title: "Inicio de sesión con Google exitoso (simulado)" })
      // router.push('/') or handle redirection as needed
    } catch (error) {
      console.error("Google Sign In Error:", error)
      toast({ title: "Error al iniciar sesión con Google", variant: "destructive" })
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook()
      toast({ title: "Inicio de sesión con Facebook exitoso (simulado)" })
      // router.push('/') or handle redirection as needed
    } catch (error) {
      console.error("Facebook Sign In Error:", error)
      toast({ title: "Error al iniciar sesión con Facebook", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleGoogleSignIn} 
        disabled={loading} 
        className="w-full bg-[#DB4437] hover:bg-[#DB4437]/90 text-white"
        aria-label="Iniciar sesión con Google"
      >
        <Chrome className="mr-2 h-5 w-5" /> Continuar con Google
      </Button>
      <Button 
        onClick={handleFacebookSignIn} 
        disabled={loading} 
        className="w-full bg-[#4267B2] hover:bg-[#4267B2]/90 text-white"
        aria-label="Iniciar sesión con Facebook"
      >
        <Facebook className="mr-2 h-5 w-5" /> Continuar con Facebook
      </Button>
    </div>
  )
}
