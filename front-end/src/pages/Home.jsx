import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const textClass = theme === 'dark' ? 'text-[#E3E3E3]' : 'text-black';
  const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const bgCardClass = theme === 'dark' ? 'bg-[#2A2B2C]' : 'bg-white';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const buttonClass = theme === 'dark'
    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
    : 'bg-yellow-400 hover:bg-yellow-500 text-black';

  const features = [
    {
      icon: '⚡',
      title: 'Respostas Rápidas',
      description: 'Informações instantâneas sobre o vestibular UTFPR Apucarana'
    },
    {
      icon: '📅',
      title: 'Prazos e Requisitos',
      description: 'Datas de inscrição e tudo que você precisa saber'
    },
    {
      icon: '📋',
      title: 'Detalhes dos Cursos',
      description: 'Informações sobre os cursos disponíveis no campus'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Faça uma Pergunta',
      description: 'Pergunte sobre o vestibular e cursos da UTFPR Apucarana'
    },
    {
      number: '2',
      title: 'Receba Resposta IA',
      description: 'Obtenha respostas detalhadas e precisas'
    },
    {
      number: '3',
      title: 'Se Prepare',
      description: 'Tenha todas as informações para se candidatar com confiança'
    }
  ];

  const technologies = [
    { name: 'React', icon: '⚛️' },
    { name: 'FastAPI', icon: '🚀' },
    { name: 'Groq API', icon: '🤖' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'PostgreSQL', icon: '🗄️' },
    { name: 'Docker', icon: '🐳' }
  ];

  const faqs = [
    {
      question: 'É necessário estar logado?',
      answer: 'Sim, você precisa ter uma conta para acessar o chatbot e manter o histórico de conversas.'
    },
    {
      question: 'Quais informações vocês disponibilizam?',
      answer: 'Informações sobre o vestibular UTFPR Apucarana, cursos disponíveis, prazos de inscrição e requisitos.'
    },
    {
      question: 'As respostas são precisas?',
      answer: 'Usamos IA avançada, mas sempre verifique as informações oficiais no site da UTFPR.'
    },
    {
      question: 'Vocês cobrem todos os campus?',
      answer: 'Este guia é especializado no campus de Apucarana, mas você pode encontrar informações sobre outros campus na UTFPR.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = React.useState(null);

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-[#1E1F20]' : 'bg-gradient-to-b from-gray-50 to-white'} transition-colors`}>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${textClass}`}>
            Guia UTFPR Apucarana
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${subTextClass}`}>
            Seu assistente inteligente para o vestibular UTFPR Campus Apucarana. Informações sobre cursos, prazos de inscrição e tudo que você precisa saber.
          </p>
          <button
            className={`${buttonClass} font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-base sm:text-lg`}
            onClick={() => navigate("/chat")}
          >
            Comece Agora
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className={`border-t border-b ${borderClass} py-16 md:py-24`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${textClass}`}>
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${bgCardClass} p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${textClass}`}>{feature.title}</h3>
                <p className={subTextClass}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${textClass}`}>
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-16 h-16 ${bgCardClass} rounded-full flex items-center justify-center mb-4 shadow-lg border-2 ${borderClass}`}>
                  <span className={`text-2xl font-bold ${textClass}`}>{step.number}</span>
                </div>
                <h3 className={`text-xl font-bold text-center mb-2 ${textClass}`}>{step.title}</h3>
                <p className={`text-center ${subTextClass}`}>{step.description}</p>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-12 h-1 ${borderClass} my-8`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className={`border-t border-b ${borderClass} py-16 md:py-24`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${textClass}`}>
            Sobre o Projeto
          </h2>
          <p className={`text-center max-w-3xl mx-auto mb-12 text-lg leading-relaxed ${subTextClass}`}>
            O Guia UTFPR Apucarana é uma ferramenta criada para ajudar estudantes na jornada para o vestibular. 
            Desenvolvido com tecnologias modernas, oferecemos informações precisas e detalhadas sobre o campus de Apucarana da UTFPR.
          </p>
          
          <h3 className={`text-2xl font-bold text-center mb-8 ${textClass}`}>Stack Tecnológico</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`${bgCardClass} p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow`}
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <p className={`font-semibold text-sm ${textClass}`}>{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${textClass}`}>
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`${bgCardClass} rounded-lg shadow transition-all`}
              >
                <button
                  className={`w-full p-6 text-left flex items-center justify-between hover:${theme === 'dark' ? 'bg-[#353535]' : 'bg-gray-50'} transition-colors`}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <h3 className={`font-semibold text-lg ${textClass}`}>{faq.question}</h3>
                  <span className={`text-2xl transition-transform ${expandedFaq === index ? 'rotate-45' : ''}`}>+</span>
                </button>
                {expandedFaq === index && (
                  <div className={`px-6 pb-6 border-t ${borderClass} ${subTextClass}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className={`border-t ${borderClass} py-16 md:py-24`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${textClass}`}>
            Pronto para começar?
          </h2>
          <p className={`text-lg mb-8 ${subTextClass}`}>
            Comece agora e tenha todas as informações que você precisa para o vestibular UTFPR Apucarana!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className={`${buttonClass} font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
              onClick={() => navigate("/chat")}
            >
              Abrir Chat
            </button>
            <button
              className={`${theme === 'dark' ? 'bg-[#2A2B2C] text-[#E3E3E3] hover:bg-[#353535]' : 'bg-gray-200 text-black hover:bg-gray-300'} font-bold py-3 px-8 rounded-lg shadow transition-all`}
              onClick={() => navigate("/contato")}
            >
              Entre em Contato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
