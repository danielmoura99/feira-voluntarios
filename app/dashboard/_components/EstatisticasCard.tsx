/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Users, Calendar, Clock, Activity } from "lucide-react";

interface Estatisticas {
  totalVoluntarios: number;
  disponibilidadesPorAtividade: Array<{
    atividade: string;
    _count: { id: number };
  }>;
  disponibilidadesPorData: Array<{
    data: string;
    _count: { id: number };
  }>;
  disponibilidadesPorHorario: Array<{
    horario: string;
    _count: { id: number };
  }>;
}

interface Props {
  estatisticas: Estatisticas;
}

const ATIVIDADES_LABELS: Record<string, string> = {
  transporte: "Transporte/Montagem",
  organizacao: "Organização",
  desmontagem_15h: "Desmontagem 15h",
  desmontagem_18h: "Desmontagem 18h",
};

export default function EstatisticasCard({ estatisticas }: Props) {
  const totalDisponibilidades =
    estatisticas.disponibilidadesPorAtividade.reduce(
      (total, item) => total + item._count.id,
      0
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total de Voluntários */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {estatisticas.totalVoluntarios}
            </h3>
            <p className="text-gray-600">Voluntários</p>
          </div>
        </div>
      </div>

      {/* Total de Disponibilidades */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {totalDisponibilidades}
            </h3>
            <p className="text-gray-600">Disponibilidades</p>
          </div>
        </div>
      </div>

      {/* Média por Voluntário */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
        <div className="flex items-center">
          <div className="bg-yellow-100 rounded-full p-3 mr-4">
            <Activity className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {estatisticas.totalVoluntarios > 0
                ? Math.round(
                    (totalDisponibilidades / estatisticas.totalVoluntarios) * 10
                  ) / 10
                : 0}
            </h3>
            <p className="text-gray-600">Média/Voluntário</p>
          </div>
        </div>
      </div>

      {/* Dia com Mais Voluntários */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="bg-purple-100 rounded-full p-3 mr-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {estatisticas.disponibilidadesPorData.length > 0
                ? estatisticas.disponibilidadesPorData.sort(
                    (a, b) => b._count.id - a._count.id
                  )[0]?.data || "N/A"
                : "N/A"}
            </h3>
            <p className="text-gray-600">Dia + Popular</p>
          </div>
        </div>
      </div>
    </div>
  );
}
