/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FormularioCadastro from "./_components/FormularioCadastro";
import GradeHorarios from "./_components/GradeHorarios";
import { buscarVoluntario } from "./_actions/voluntario-actions";

export default function VoluntariosPage() {
  const [voluntario, setVoluntario] = useState<any>(null);
  const [buscandoCodigo, setBuscandoCodigo] = useState("");

  const handleCadastroSucesso = (novoVoluntario: any) => {
    setVoluntario(novoVoluntario);
  };

  // ✅ NOVA FUNÇÃO PARA REDIRECIONAMENTO DO DIALOG
  const handleRedirecionarParaBusca = () => {
    // Focar no campo de busca quando redirecionar
    setTimeout(() => {
      const campoBusca = document.querySelector(
        'input[placeholder*="Digite seu código"]'
      ) as HTMLInputElement;
      if (campoBusca) {
        campoBusca.focus();
      }
    }, 100);
  };

  const buscarPorCodigo = async () => {
    if (!buscandoCodigo.trim()) return;

    const result = await buscarVoluntario(buscandoCodigo.toUpperCase());
    if (result.success && result.voluntario) {
      setVoluntario(result.voluntario);
    } else {
      alert("Voluntário não encontrado com este código");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Sistema de Voluntários
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Cadastre-se e escolha seus horários de disponibilidade
        </p>
      </div>

      {/* Buscar por código existente */}
      {!voluntario && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Já tem um código? Digite aqui para editar sua disponibilidade:
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={buscandoCodigo}
              onChange={(e) => setBuscandoCodigo(e.target.value.toUpperCase())}
              placeholder="Digite seu código (ex: SEARA-1)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              maxLength={20}
            />
            <button
              onClick={buscarPorCodigo}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {!voluntario ? (
          <FormularioCadastro
            onSuccess={handleCadastroSucesso}
            onRedirecionarParaBusca={handleRedirecionarParaBusca}
          />
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Cadastro realizado com sucesso!
              </h3>
              <p className="text-green-700 text-sm sm:text-base">
                <strong>Nome:</strong> {voluntario.nome}
                <br />
                <strong>Casa Espírita:</strong> {voluntario.casaEspirita}
                <br />
                <strong>Seu código:</strong>{" "}
                <span className="font-bold text-lg">{voluntario.codigo}</span>
              </p>
              <p className="text-green-600 text-sm mt-2">
                Guarde este código! Você pode usá-lo para editar sua
                disponibilidade depois.
              </p>
            </div>
            <GradeHorarios voluntario={voluntario} />
          </>
        )}
      </div>
    </div>
  );
}
