// src/app/program/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { programs } from '../../../data/programs'; // Using alias, assuming it's configured
import Link from 'next/link';

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;

  const program = programs.find((p) => p.id === programId);

  if (!program) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-100 p-4 text-zinc-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Program Not Found</h1>
          <p className="mt-2">The program you are looking for does not exist.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-auto bg-zinc-100 p-4 md:p-8">
      <Link href="/" className="absolute top-4 left-4 z-10 rounded-lg bg-white p-2 shadow-md hover:bg-zinc-50">
        {'< Back to Map'}
      </Link>

      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg md:p-8">
        <h1 className="mb-4 text-4xl font-bold text-zinc-800">{program.name}</h1>
        <p className="mb-6 text-zinc-600">{program.description}</p>

        {program.images.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-2xl font-semibold text-zinc-700">Gallery</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {program.images.map((src, index) => (
                <div key={index} className="relative h-48 w-full overflow-hidden rounded-lg shadow-md">
                  <Image src={src} alt={program.name} layout="fill" objectFit="cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {program.videoUrl && (
          <div className="mb-6">
            <h2 className="mb-3 text-2xl font-semibold text-zinc-700">Video</h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
              <iframe
                src={program.videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              ></iframe>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-zinc-500">
          <p>
            **Location:** {program.location.address} (Lat: {program.location.lat}, Lng: {program.location.lng})
          </p>
          <p>
            **Category:** {program.category}
          </p>
          {program.detailsUrl && (
            <p>
              **More Info:**{' '}
              <a href={program.detailsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {program.detailsUrl}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
