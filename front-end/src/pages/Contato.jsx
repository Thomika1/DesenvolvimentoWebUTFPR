import React, { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { developers as developersConfig } from "../config/developers";

export default function Contato() {
  const { theme } = useTheme();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(null);
  
  const textClass = theme === 'dark' ? 'text-[#E3E3E3]' : 'text-black';
  const bgCardClass = theme === 'dark' ? 'bg-[#2A2B2C]' : 'bg-white';
  const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const buttonClass = theme === 'dark'
    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
    : 'bg-yellow-400 hover:bg-yellow-500 text-black';

  const copyToClipboard = (email, index) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(index);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const devData = await Promise.all(
          developersConfig.map(async (user) => {
            try {
              const response = await fetch(`https://api.github.com/users/${user.github}`);
              const data = await response.json();
              return {
                name: user.name,
                github: user.github,
                email: user.email,
                github_name: data.name || user.name,
                avatar_url: data.avatar_url,
                profile_url: data.html_url,
                bio: 'Desenvolvedor',
                company: data.company || '',
                location: data.location || ''
              };
            } catch (error) {
              console.error(`Erro ao buscar ${user.github}:`, error);
              return {
                name: user.name,
                github: user.github,
                email: user.email,
                github_name: user.name,
                avatar_url: null,
                profile_url: `https://github.com/${user.github}`,
                bio: 'Desenvolvedor',
                company: '',
                location: ''
              };
            }
          })
        );

        setDevelopers(devData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados dos desenvolvedores:', error);
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-[#1E1F20]' : 'bg-gradient-to-b from-gray-50 to-white'} transition-colors pt-20 pb-16`}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${textClass}`}>
            Entre em Contato
          </h1>
          <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${subTextClass}`}>
            Conheça a equipe por trás do desenvolvimento do Guia UTFPR - um projeto de Desenvolvimento Web na UTFPR-Apucarana
          </p>
        </div>
      </div>

      {/* Developers Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${textClass}`}>
          Equipe de Desenvolvimento
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <p className={textClass}>Carregando perfis...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {developers.map((dev, index) => (
              <div
                key={index}
                className={`${bgCardClass} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105`}
              >
                <div className="p-8 flex flex-col items-center text-center">
                  {/* Avatar */}
                  {dev.avatar_url && (
                    <img
                      src={dev.avatar_url}
                      alt={dev.github_name}
                      className="w-24 h-24 rounded-full mb-4 border-4 border-yellow-500 shadow-lg"
                    />
                  )}

                  {/* Nome */}
                  <h3 className={`text-2xl font-bold mb-1 ${textClass}`}>
                    {dev.github_name}
                  </h3>

                  {/* Bio */}
                  {dev.bio && (
                    <p className={`text-sm mb-3 ${subTextClass}`}>
                      {dev.bio}
                    </p>
                  )}

                  {/* Localização e Empresa */}
                  <div className={`text-sm mb-6 space-y-1 ${subTextClass}`}>
                    {dev.location && (
                      <p>📍 {dev.location}</p>
                    )}
                    {dev.company && (
                      <p>🏢 {dev.company}</p>
                    )}
                  </div>

                  {/* Email */}
                  {dev.email && (
                    <div className="w-full mb-4 p-4 rounded-lg bg-yellow-500 bg-opacity-15">
                      <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-[#1A1B1C]' : 'bg-gray-900'}`}>
                        <span className={`font-mono text-sm break-all ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-200'}`}>{dev.email}</span>
                        <button
                          onClick={() => copyToClipboard(dev.email, index)}
                          className={`ml-2 py-1 px-3 rounded transition-all whitespace-nowrap text-xs font-semibold ${
                            copiedEmail === index
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-500 text-black hover:bg-yellow-600'
                          }`}
                        >
                          {copiedEmail === index ? '✓ Copiado' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* GitHub Link */}
                  <a
                    href={dev.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonClass} font-bold py-2 px-6 rounded-lg shadow transition-all inline-flex items-center justify-center gap-2 w-full`}
                  >
                    <span>👤 GitHub</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className={`text-sm ${subTextClass}`}>
          Este projeto foi desenvolvido como trabalho avaliativo da disciplina de Desenvolvimento Web na UTFPR.
        </p>
      </div>
    </div>
  );
}
