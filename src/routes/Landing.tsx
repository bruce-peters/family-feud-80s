import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 text-center">
      <h1 className="font-feud text-6xl md:text-8xl text-feud-yellow tracking-widest drop-shadow-[0_0_10px_rgba(245,197,66,0.5)]">
        80s FAMILY FEUD
      </h1>
      <p className="text-feud-cream text-xl max-w-xl">
        APUSH decades project. Open the host panel on your laptop, then pop the audience board into a second window for the projector.
      </p>
      <div className="flex gap-4">
        <Link to="/host" className="px-6 py-4 rounded bg-feud-yellow text-black font-feud text-3xl tracking-wider hover:brightness-110">
          HOST PANEL
        </Link>
        <Link to="/board" className="px-6 py-4 rounded bg-feud-red text-white font-feud text-3xl tracking-wider hover:brightness-110">
          AUDIENCE BOARD
        </Link>
      </div>
    </div>
  );
}
