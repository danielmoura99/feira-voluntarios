"use client";

import { useState } from "react";
import { Search, User, Phone, Mail, Building, Calendar } from "lucide-react";

interface Voluntario {
  id: string;
  codigo: string;
  nome: string;
  telefone: string;
  email: string;
  casaEspirita: string;
  createdAt: Date;
  disponibilidades: Array<{
    id: string;
    data: string;
    horario: string;
    atividade: string;
  }>;
}

interface Props {
  voluntarios: Voluntario[];
}

export default function ListaVoluntarios({ voluntarios }: Props) {
  const [filtro, setFiltro] = useState("");
  const [filtroAtividade, setFiltroAtividade] = useState("todos");

  const voluntariosFiltrados = voluntarios.filter((voluntario) => {
    const matchTexto =
      voluntario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      voluntario.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      voluntario.casaEspirita.toLowerCase().includes(filtro.toLowerCase());

    if (filtroAtividade === "todos") return matchTexto;

    const temAtividade = voluntario.disponibilidades.some(
      (disp) => disp.atividade === filtroAtividade
    );

    return matchTexto && temAtividade;
  });

  const atividades = [
    { key: "todos", label: "Todas as atividades" },
    { key: "transporte", label: "Transporte/Montagem" },
    { key: "organizacao", label: "Organização" },
    { key: "desmontagem_15h", label: "Desmontagem 15h" },
    { key: "desmontagem_18h", label: "Desmontagem 18h" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        👥 Lista de Voluntários ({voluntarios.length})
      </h2>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, código ou casa espírita..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <select
          value={filtroAtividade}
          onChange={(e) => setFiltroAtividade(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {atividades.map((atividade) => (
            <option key={atividade.key} value={atividade.key}>
              {atividade.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {voluntariosFiltrados.map((voluntario) => (
          <div
            key={voluntario.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Informações do voluntário */}
              <div className="lg:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded text-sm">
                    {voluntario.codigo}
                  </span>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {voluntario.nome}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    {voluntario.casaEspirita}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {voluntario.telefone}
                  </div>
                  <div className="flex items-center sm:col-span-2">
                    <Mail className="w-4 h-4 mr-2" />
                    {voluntario.email}
                  </div>
                </div>
              </div>

              {/* Disponibilidades */}
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium text-gray-700">
                    Disponibilidades ({voluntario.disponibilidades.length})
                  </span>
                </div>

                {voluntario.disponibilidades.length > 0 ? (
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {voluntario.disponibilidades.map((disp, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-gray-100 rounded px-2 py-1"
                      >
                        {disp.data} • {disp.horario} •{" "}
                        {disp.atividade === "transporte"
                          ? "Transp/Mont"
                          : disp.atividade === "organizacao"
                          ? "Organização"
                          : disp.atividade === "desmontagem_15h"
                          ? "Desm 15h"
                          : "Desm 18h"}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Nenhuma disponibilidade cadastrada
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {voluntariosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum voluntário encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
