import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  buscarTodosVoluntarios,
  buscarEstatisticas,
  buscarDisponibilidadesPorHorario,
} from "./_actions/dashboard-actions";
import EstatisticasCard from "./_components/EstatisticasCard";
import GradeDashboard from "./_components/GradeDashboard";
import ListaVoluntarios from "./_components/ListaVoluntarios";

export default async function DashboardPage() {
  const [voluntariosResult, estatisticasResult, disponibilidadesResult] =
    await Promise.all([
      buscarTodosVoluntarios(),
      buscarEstatisticas(),
      buscarDisponibilidadesPorHorario(),
    ]);

  if (
    !voluntariosResult.success ||
    !estatisticasResult.success ||
    !disponibilidadesResult.success
  ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">Erro ao carregar dados do dashboard.</p>
          <p className="text-red-600 text-sm mt-2">
            {!voluntariosResult.success && voluntariosResult.error}
            <br />
            {!estatisticasResult.success && estatisticasResult.error}
            <br />
            {!disponibilidadesResult.success && disponibilidadesResult.error}
          </p>
        </div>
      </div>
    );
  }

  // Garantir que os dados existem antes de passar para os componentes
  const voluntarios = voluntariosResult.voluntarios || [];
  const estatisticas = estatisticasResult.estatisticas || {
    totalVoluntarios: 0,
    disponibilidadesPorAtividade: [],
    disponibilidadesPorData: [],
    disponibilidadesPorHorario: [],
  };
  const disponibilidades = disponibilidadesResult.disponibilidades || [];

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

        <div className="flex items-center mb-2">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              Dashboard de Voluntários
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Visão geral da organização da feira
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <EstatisticasCard estatisticas={estatisticas} />

      {/* Grade de Horários */}
      <div className="mb-8">
        <GradeDashboard disponibilidades={disponibilidades} />
      </div>

      {/* Lista de Voluntários */}
      <ListaVoluntarios voluntarios={voluntarios} />
    </div>
  );
}
