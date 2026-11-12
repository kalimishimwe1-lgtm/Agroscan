import { Link } from 'react-router-dom';

const links = [
  ['Learn', '/learn'],
  ['Lessons', '/lessons'],
  ['Quizzes', '/quizzes'],
  ['Progress', '/progress'],
  ['Dictionary', '/dictionary'],
  ['Translation', '/translation'],
  ['Tutors', '/tutors'],
  ['Forum', '/forum'],
  ['Resources', '/resources'],
  ['Pricing', '/pricing'],
  ['Contact', '/contact'],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-black tracking-tight text-emerald-700">
          Kinyarwanda<span className="text-slate-800">Learn</span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 lg:flex">
          {links.map(([label, path]) => (
            <Link key={path} to={path} className="transition hover:text-emerald-700">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
            Login
          </Link>
          <Link to="/register" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
