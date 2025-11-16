import React from 'react';
import { Toaster } from './ui/toaster';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
