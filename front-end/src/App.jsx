import './index.css';
import Chatbot from '@/components/Chatbot';
import Sidebar from './components/Sidebar';
import { useTheme } from './ThemeContext';

function App() {
  const { theme } = useTheme();

  // Classes para cada tema
  const bgClass = theme === 'dark'
    ? 'bg-[#1E1F20] text-[#E3E3E3]'
    : 'bg-white text-black';
  const headerClass = theme === 'dark'
    ? 'bg-[#1E1F20]'
    : 'bg-yellow-400';

  return (
    <div className={`flex flex-col h-screen ${bgClass}`}>
      <header className={`shrink-0 z-20 ${headerClass} shadow-sm`}>
        <div className='w-full max-w-7xl mx-auto px-4'>
          <div className='flex h-16 w-full items-center'>
            <a href="#">
              <h1 className='font-urbanist text-[1.65rem] font-semibold'>
                Chatbot UTFPR
              </h1>
            </a>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1">
          <Chatbot />
        </main>
      </div>
    </div>
  );
}

export default App;