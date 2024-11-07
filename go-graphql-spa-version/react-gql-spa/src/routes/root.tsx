import { Link, Outlet } from "react-router-dom";

export const Root = () => (
  <div className="antialiased bg-gray-950 text-white flex flex-col justify-between min-h-screen min-w-screen border-t-2 border-blue-600">
    <header className="py-4 px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline">
          <Link to="/" className="font-bold text-3xl">
            round<span className="text-blue-600">est</span>
            <span className="text-gray-400 font-extralight pl-2 text-2xl">
              (Go + GraphQL + React SPA)
            </span>
          </Link>
        </div>
        <nav className="flex flex-row items-center gap-8">
          <Link to="/prefetched" className="hover:underline text-lg">
            Turbo Version
          </Link>
          <Link to="/results" className="hover:underline text-lg">
            Results
          </Link>
        </nav>
      </div>
    </header>

    <main className="flex-1">
      <Outlet />
    </main>

    <footer className="font-light text-center py-3 text-gray-500">
      <a
        href="https://github.com/t3dotgg/1app5stacks"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </footer>
  </div>
);
