
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Letras Compartidas. Todos los derechos reservados.</p>
        <p className="mt-1">Inspirado en la comunidad y el amor por la escritura.</p>
        <div className="mt-4">
          <Button variant="link" asChild className="text-xs text-muted-foreground hover:text-primary">
            <Link href="/admin">
              Panel de Administración
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
