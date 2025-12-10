import ClientOnlyMap from './../components/ClientOnlyMap';
import Header from './../components/Header';
import { MapProvider } from './../context/MapContext';
import ZoomControl from './../components/ZoomControl';

export default function Home() {
  return (
    <MapProvider>
      <main className="relative h-screen w-screen">
        <ClientOnlyMap />
        <Header />
        <div className="absolute bottom-4 right-4 z-[1000]">
          <ZoomControl />
        </div>
      </main>
    </MapProvider>
  );
}
