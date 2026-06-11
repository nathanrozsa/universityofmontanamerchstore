'use client';

import dynamic from 'next/dynamic';

const MapEmbed = dynamic(() => import('./MapEmbed'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
      Loading map...
    </div>
  ),
});

export default function MapWrapper() {
  return <MapEmbed />;
}
