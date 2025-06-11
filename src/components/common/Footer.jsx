import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto py-4 px-6 text-center">
        <p>© {currentYear} Ferremax - Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}