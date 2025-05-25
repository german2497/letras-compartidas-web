
"use client"

import type { User } from 'firebase/auth'; // Using User type for consistency
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const ADMIN_EMAIL = 'yermanconde@hotmail.com';
const ADMIN_PASSWORD = 'Conde1997';

const SECONDARY_ADMINS_STORAGE_KEY = 'letras-compartidas-secondary-admins';

interface SecondaryAdminCredentials {
  email: string;
  password_hash: string; // Simulate a hashed password for storage conceptually
}

// Placeholder user type
interface AppUser extends Partial<User> {
  name?: string | null; 
  isAdmin?: boolean;
  description?: string; 
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signOutUser: () => Promise<void>
  updateUserProfile: (profileData: Partial<AppUser>) => Promise<void>;
  signInAsAdmin: (email: string, pass: string) => Promise<boolean>; // Primary Admin
  // New functions for secondary admins
  signInAsSecondaryAdmin: (email: string, pass: string) => Promise<boolean>;
  addSecondaryAdmin: (email: string, pass: string) => Promise<boolean>;
  removeSecondaryAdmin: (email: string) => Promise<void>;
  getSecondaryAdmins: () => { email: string }[]; // Only return emails for display
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Basic conceptual "hashing" - DO NOT USE FOR REAL SECURITY
const conceptualHash = async (password: string): Promise<string> => {
    // In a real app, use a strong hashing library like bcrypt or Argon2
    // For simulation, we'll just reverse it and add a prefix
    await new Promise(resolve => setTimeout(resolve, 50)); // simulate async work
    return `sim_hash_${password.split('').reverse().join('')}`;
};

const conceptualVerify = async (password: string, hash: string): Promise<boolean> => {
    const rehashed = await conceptualHash(password);
    return rehashed === hash;
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulate auth state persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('letras-compartidas-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const getStoredSecondaryAdmins = (): SecondaryAdminCredentials[] => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(SECONDARY_ADMINS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    return [];
  };

  const saveStoredSecondaryAdmins = (admins: SecondaryAdminCredentials[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SECONDARY_ADMINS_STORAGE_KEY, JSON.stringify(admins));
    }
  };


  const createAndSetUserSession = (userData: Partial<AppUser>, isAdminOverride: boolean = false) => {
    let finalIsAdmin = isAdminOverride;
    if (!isAdminOverride) { // Only check other admin conditions if not explicitly set to admin
        const secondaryAdmins = getStoredSecondaryAdmins();
        finalIsAdmin = userData.email === ADMIN_EMAIL || 
                       secondaryAdmins.some(admin => admin.email === userData.email);
    }

    const appUser: AppUser = {
      ...userData,
      description: userData.description || '',
      isAdmin: finalIsAdmin,
    };
    setUser(appUser);
    if (typeof window !== 'undefined') {
        localStorage.setItem('letras-compartidas-user', JSON.stringify(appUser));
    }
    return appUser;
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    const mockUserData = { 
        uid: `google${Date.now()}`, 
        email: 'user.g@example.com', // Generic email
        displayName: 'Google User', 
        photoURL: 'https://placehold.co/100x100.png?text=GU', 
        description: 'Amante de la lectura y escritura.' 
    };
    createAndSetUserSession(mockUserData);
    setLoading(false)
  }

  const signInWithFacebook = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUserData = { 
        uid: `facebook${Date.now()}`, 
        email: 'user.fb@example.com', // Generic email
        displayName: 'Facebook User', 
        photoURL: 'https://placehold.co/100x100.png?text=FU', 
        description: 'Entusiasta de las palabras.' 
    };
    createAndSetUserSession(mockUserData);
    setLoading(false)
  }

  const signOutUser = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setUser(null)
    if (typeof window !== 'undefined') {
        localStorage.removeItem('letras-compartidas-user');
    }
    setLoading(false)
  }

  const updateUserProfile = async (profileData: Partial<AppUser>) => {
    setLoading(true);
    if (user) {
      const updatedUser = { ...user, ...profileData };
      // Re-evaluate isAdmin status in case email changed, though not typical in profile update
      createAndSetUserSession(updatedUser, updatedUser.isAdmin); 
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setLoading(false);
  };

  const signInAsAdmin = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      const adminUserData: AppUser = {
        uid: `primary-admin-${Date.now()}`,
        email: email,
        displayName: 'Administrador Principal',
        photoURL: 'https://placehold.co/100x100.png?text=PA',
        description: 'Gestionando la plataforma Letras Compartidas.',
      };
      createAndSetUserSession(adminUserData, true); // Force isAdmin true
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const signInAsSecondaryAdmin = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const secondaryAdmins = getStoredSecondaryAdmins();
    const adminCredentials = secondaryAdmins.find(admin => admin.email === email);

    if (adminCredentials && await conceptualVerify(pass, adminCredentials.password_hash)) {
      const secondaryAdminUserData: AppUser = {
        uid: `secondary-admin-${Date.now()}`,
        email: email,
        displayName: `Admin: ${email.split('@')[0]}`, // Or a default name
        photoURL: 'https://placehold.co/100x100.png?text=SA',
        description: 'Administrador secundario de la plataforma.',
      };
      createAndSetUserSession(secondaryAdminUserData, true); // Force isAdmin true
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const addSecondaryAdmin = async (email: string, pass: string): Promise<boolean> => {
    if (!email || !pass) return false;
    const secondaryAdmins = getStoredSecondaryAdmins();
    if (secondaryAdmins.some(admin => admin.email === email) || email === ADMIN_EMAIL) {
      // Email already exists as primary or secondary admin
      return false; 
    }
    const hashedPassword = await conceptualHash(pass);
    secondaryAdmins.push({ email, password_hash: hashedPassword });
    saveStoredSecondaryAdmins(secondaryAdmins);
    return true;
  };

  const removeSecondaryAdmin = async (emailToRemove: string): Promise<void> => {
    let secondaryAdmins = getStoredSecondaryAdmins();
    secondaryAdmins = secondaryAdmins.filter(admin => admin.email !== emailToRemove);
    saveStoredSecondaryAdmins(secondaryAdmins);
     // If the currently logged-in user is the one being removed, log them out.
    if (user && user.email === emailToRemove && user.isAdmin) {
        // Check if they are not the primary admin before logging out
        if (user.email !== ADMIN_EMAIL) {
            await signOutUser();
        }
    }
  };

  const getSecondaryAdmins = (): { email: string }[] => {
    return getStoredSecondaryAdmins().map(admin => ({ email: admin.email }));
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        loading, 
        signInWithGoogle, 
        signInWithFacebook, 
        signOutUser, 
        updateUserProfile, 
        signInAsAdmin,
        signInAsSecondaryAdmin,
        addSecondaryAdmin,
        removeSecondaryAdmin,
        getSecondaryAdmins
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

    