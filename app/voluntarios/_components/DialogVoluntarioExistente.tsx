/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { X, User, Hash } from "lucide-react";

interface VoluntarioExistente {
  nome: string;
  codigo: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  voluntario: VoluntarioExistente;
  onRedirecionarParaBusca: () => void;
}

export default function DialogVoluntarioExistente({
  isOpen,
  onClose,
  voluntario,
  onRedirecionarParaBusca,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-2 mr-3">
              <User className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Voluntário já cadastrado
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm mb-3">
              Este email já está cadastrado no sistema:
            </p>

            <div className="space-y-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-600" />
                <span className="font-medium text-gray-800">
                  {voluntario.nome}
                </span>
              </div>

              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-2 text-gray-600" />
                <span className="font-bold text-blue-600 text-lg">
                  {voluntario.codigo}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            Se você deseja editar suas disponibilidades, use o código acima na
            área de busca.
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRedirecionarParaBusca}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Editar Disponibilidades
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
