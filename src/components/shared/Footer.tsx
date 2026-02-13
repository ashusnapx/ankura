import Link from "next/link";

export function Footer() {
  return (
    <footer className='w-full bg-secondary border-t border-gold-dark/10 py-16 px-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-indigo rounded flex items-center justify-center text-white font-black text-xs'>
              A
            </div>
            <span className='text-lg font-black text-indigo tracking-tighter'>
              Ankura
            </span>
          </div>
          <p className='text-sm font-medium text-indigo/40 leading-relaxed'>
            Live local. Speak natural. Ankura helps you bridge the gap between
            learning and living in Bangalore.
          </p>
        </div>

        <div>
          <h4 className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.2em] mb-6'>
            Learning
          </h4>
          <ul className='space-y-4'>
            <li>
              <Link
                href='/missions'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Stories
              </Link>
            </li>
            <li>
              <Link
                href='/garden'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Garden
              </Link>
            </li>
            <li>
              <Link
                href='/practice/shadow-speaking'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Shadowing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.2em] mb-6'>
            Community
          </h4>
          <ul className='space-y-4'>
            <li>
              <Link
                href='#'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Namma Area
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Cultural Notes
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Feedback
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.2em] mb-6'>
            Legal
          </h4>
          <ul className='space-y-4'>
            <li>
              <Link
                href='#'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-sm font-bold text-indigo/60 hover:text-indigo transition-colors'
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='max-w-7xl mx-auto mt-16 pt-8 border-t border-gold-dark/10 flex flex-col md:flex-row justify-between items-center gap-4'>
        <p className='text-[10px] font-bold text-indigo/20 uppercase tracking-widest'>
          © 2026 Ankura. Made with ❤️ in Bengaluru.
        </p>
        <div className='flex gap-6'>
          <span className='text-[10px] font-black text-indigo/10 tracking-tighter'>
            Designed for Flow
          </span>
        </div>
      </div>
    </footer>
  );
}
