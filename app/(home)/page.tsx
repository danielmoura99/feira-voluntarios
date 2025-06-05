import Link from "next/link";
import { BookOpen, Users, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 rounded-full p-4">
            <BookOpen className="w-12 h-12 text-blue-900" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          54ª Feira do Livro Espírita
        </h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">
          31ª Feira do Livro Espírita Infantil
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Praça Ulysses Guimarães, Jardim Aquárius - São José dos Campos
        </p>
        <div className="bg-white rounded-lg p-6 shadow-lg inline-block">
          <p className="text-lg font-semibold text-red-600">
            🚨 ATENÇÃO - NÃO PERCA AS ATIVIDADES DA FLE / FLEI - SEJA UM
            VOLUNTÁRIO
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/voluntarios" className="group">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">
                Cadastrar-se como Voluntário
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Faça seu cadastro e escolha os horários em que deseja ajudar na
              feira.
            </p>
            <div className="text-blue-500 font-semibold group-hover:text-blue-700">
              Começar cadastro →
            </div>
          </div>
        </Link>

        <Link href="/dashboard" className="group">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-green-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">
                Visualizar Programação
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Veja a programação completa e quem está disponível para cada
              atividade.
            </p>
            <div className="text-green-500 font-semibold group-hover:text-green-700">
              Ver dashboard →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
