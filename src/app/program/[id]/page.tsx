'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { programs } from '../../../data/programs';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Tag, ExternalLink, PlayCircle, Info } from 'lucide-react';

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;

  const program = programs.find((p) => p.id === programId);

  if (!program) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-gray-950 text-zinc-800 transition-colors">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Program Not Found</h1>
          <p className="mb-6 text-zinc-600 dark:text-gray-400">The program you are looking for does not exist.</p>
          <button
            onClick={() => router.back()}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-white font-medium shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/30"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Status badge styling
  const statusColors = {
    'Completed': 'bg-green-500/20 text-green-100 border-green-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-100 border-blue-500/30',
    'Planned': 'bg-gray-500/20 text-gray-100 border-gray-500/30',
  };

  const statusKey = program.status as keyof typeof statusColors;
  const statusStyle = statusColors[statusKey] || statusColors['Planned'];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-950 transition-colors selection:bg-blue-500/30">

      {/* 1. Hero Background (Blurred) */}
      <div className="fixed inset-0 z-0">
        {program.images.length > 0 ? (
          <div className="relative h-full w-full">
            <Image
              src={program.images[0]}
              alt="Background"
              fill
              className="object-cover blur-3xl opacity-40 dark:opacity-20 scale-110 transform"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/90 dark:from-black/40 dark:via-transparent dark:to-gray-950/90" />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950/50" />
        )}
      </div>

      {/* 2. Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-4 py-6 md:px-8 max-w-7xl mx-auto">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full bg-white/70 dark:bg-black/40 px-5 py-2.5 text-sm font-medium shadow-sm backdrop-blur-md border border-white/20 dark:border-white/10 transition-all hover:bg-white dark:hover:bg-black/60 hover:shadow-md hover:scale-[1.02]"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:-translate-x-1 transition-transform" />
          <span className="text-gray-800 dark:text-gray-200">Back to Map</span>
        </Link>
      </nav>

      {/* 3. Main Content Content */}
      <main className="relative z-10 px-4 pb-20 pt-4">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white/80 dark:bg-gray-900/80 shadow-2xl backdrop-blur-xl border border-white/40 dark:border-gray-700/50ring-1 ring-black/5 dark:ring-white/10">

          {/* Hero Image Section */}
          {/* Hero Image Section */}
          <div className="relative h-[300px] md:h-[450px] w-full group overflow-hidden">
            {/* Scalable Container for Image & Gradient */}
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
              {program.images.length > 0 ? (
                <Image
                  src={program.images[0]}
                  alt={program.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <span className="text-gray-400 flex flex-col items-center gap-2">
                    <Info className="h-8 w-8" />
                    No Image Available
                  </span>
                </div>
              )}
              {/* Gradient Overlay scales with image */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
            </div>

            {/* Title & Badges (Fixed position, does not scale) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg max-w-3xl mb-4">
                {program.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border ${statusStyle}`}>
                  {program.status}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-gray-200 text-xs font-medium backdrop-blur-md border border-white/10">
                  <Calendar className="h-3.5 w-3.5" /> {program.year}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-gray-200 text-xs font-medium backdrop-blur-md border border-white/10">
                  <Tag className="h-3.5 w-3.5" /> {program.category}
                </span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

              {/* Left Column: Description & Gallery */}
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                    About the Program
                  </h2>
                  <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {program.description}
                    </p>
                  </div>
                </section>

                {/* Gallery Grid */}
                {program.images.length > 1 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                      Gallery
                    </h2>
                    <div className={`grid gap-4 ${program.images.slice(1).length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {program.images.slice(1).map((img, i) => (
                        <div key={i} className="relative h-48 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all">
                          <Image
                            src={img}
                            alt={`Gallery ${i}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column: Key Info & Actions */}
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Location Card */}
                <div className="p-6 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 backdrop-blur-sm shadow-sm space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Location</label>
                    <div className="flex items-start gap-3 mt-2 text-gray-800 dark:text-gray-200">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium leading-normal mt-1">{program.location.address}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${program.location.lat},${program.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                      <ExternalLink className="h-4 w-4" /> Get Directions
                    </a>
                  </div>
                </div>

                {/* Video Card */}
                {program.videoUrl && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Video Highlight</h3>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-black">
                      <div className="relative aspect-video w-full">
                        <iframe
                          src={program.videoUrl}
                          title={`Embedded YouTube video for ${program.name}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}

                {program.detailsUrl && (
                  <a
                    href={program.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-medium transition-colors border border-blue-100 dark:border-blue-900/30"
                  >
                    <Info className="h-4 w-4" /> Visit Official Website
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
