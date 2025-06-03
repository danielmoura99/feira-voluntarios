/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  salvarDisponibilidade,
  DisponibilidadeData,
} from "../_actions/voluntario-actions";
import { Calendar, Clock, Save, Loader2 } from "lucide-react";

interface Props {
  voluntario: any;
}

interface DisponibilidadeExistente {
  data: string;
  horario: string;
  atividade: string;
}

const DADOS_FEIRA = {
  datas: [
    { key: "qua_13", label: "QUA\n13/ago", dia: "13/08" },
    { key: "qui_14", label: "QUI\n14/ago", dia: "14/08" },
    { key: "sex_15", label: "SEX\n15/ago", dia: "15/08" },
    { key: "sab_16", label: "SÁB\n16/ago", dia: "16/08" },
    { key: "dom_17", label: "DOM\n17/ago", dia: "17/08" },
    { key: "seg_18", label: "SEG\n18/ago", dia: "18/08" },
    { key: "ter_19", label: "TER\n19/ago", dia: "19/08" },
    { key: "qua_20", label: "QUA\n20/ago", dia: "20/08" },
    { key: "qui_21", label: "QUI\n21/ago", dia: "21/08" },
    { key: "sex_22", label: "SEX\n22/ago", dia: "22/08" },
    { key: "sab_23", label: "SÁB\n23/ago", dia: "23/08" },
    { key: "dom_24", label: "DOM\n24/ago", dia: "24/08" },
  ],
  horarios: ["08h-10h", "10h-12h", "12h-14h", "14h-16h", "16h-18h", "18h-20h"],
  atividades: [
    {
      key: "transporte",
      label: "Transporte e montagem das estantes",
      cor: "bg-yellow-200",
    },
    {
      key: "organizacao",
      label: "Organização dos livros nas estantes",
      cor: "bg-pink-200",
    },
    {
      key: "desmontagem_15h",
      label: "Desmontagem (a partir das 15h)",
      cor: "bg-purple-200",
    },
    {
      key: "desmontagem_18h",
      label: "Desmontagem (a partir das 18h)",
      cor: "bg-green-200",
    },
  ],
};

export default function GradeHorarios({ voluntario }: Props) {
  const [disponibilidades, setDisponibilidades] = useState<Set<string>>(
    new Set()
  );
  const [loading, setSaving] = useState(false);

  useEffect(() => {
    if (voluntario?.disponibilidades) {
      const disponibilidadesExistentes = new Set<string>(
        voluntario.disponibilidades.map(
          (d: DisponibilidadeExistente) =>
            `${d.data}-${d.horario}-${d.atividade}`
        )
      );
      setDisponibilidades(disponibilidadesExistentes);
    }
  }, [voluntario]);

  const toggleDisponibilidade = (
    data: string,
    horario: string,
    atividade: string
  ) => {
    const key = `${data}-${horario}-${atividade}`;
    const newDisponibilidades = new Set(disponibilidades);

    if (newDisponibilidades.has(key)) {
      newDisponibilidades.delete(key);
    } else {
      newDisponibilidades.add(key);
    }

    setDisponibilidades(newDisponibilidades);
  };

  const salvarAlteracoes = async () => {
    setSaving(true);

    try {
      const disponibilidadesArray: DisponibilidadeData[] = Array.from(
        disponibilidades
      ).map((key) => {
        const [data, horario, atividade] = key.split("-");
        return { data, horario, atividade };
      });

      const result = await salvarDisponibilidade(
        voluntario.id,
        disponibilidadesArray
      );

      if (result.success) {
        alert("Disponibilidades salvas com sucesso!");
      } else {
        alert("Erro ao salvar disponibilidades");
      }
    } catch (error) {
      alert("Erro ao salvar disponibilidades");
    } finally {
      setSaving(false);
    }
  };

  if (!voluntario) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Grade de Horários
            </h2>
            <p className="text-sm text-gray-600">
              Código:{" "}
              <span className="font-bold text-blue-600">
                {voluntario.codigo}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={salvarAlteracoes}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Legenda das Atividades
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DADOS_FEIRA.atividades.map((atividade) => (
            <div key={atividade.key} className="flex items-center">
              <div className={`w-4 h-4 rounded mr-3 ${atividade.cor}`}></div>
              <span className="text-sm text-gray-700">{atividade.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Responsiva */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Cabeçalho das datas */}
          <div className="grid grid-cols-13 gap-1 mb-2">
            <div className="p-2"></div>
            {DADOS_FEIRA.datas.map((data) => (
              <div
                key={data.key}
                className="text-center p-2 bg-blue-100 rounded text-xs font-semibold"
              >
                {data.label.split("\n").map((linha, idx) => (
                  <div key={idx}>{linha}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Linhas de horários e atividades */}
          {DADOS_FEIRA.horarios.map((horario) => (
            <div key={horario}>
              {DADOS_FEIRA.atividades.map((atividade) => (
                <div
                  key={`${horario}-${atividade.key}`}
                  className="grid grid-cols-13 gap-1 mb-1"
                >
                  <div className="p-2 text-xs font-medium text-gray-700 flex flex-col items-start">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {horario}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {atividade.label.length > 20
                        ? `${atividade.label.substring(0, 20)}...`
                        : atividade.label}
                    </span>
                  </div>

                  {DADOS_FEIRA.datas.map((data) => {
                    const key = `${data.dia}-${horario}-${atividade.key}`;
                    const isSelected = disponibilidades.has(key);

                    return (
                      <button
                        key={`${data.key}-${horario}-${atividade.key}`}
                        onClick={() =>
                          toggleDisponibilidade(
                            data.dia,
                            horario,
                            atividade.key
                          )
                        }
                        className={`p-2 rounded border-2 transition-all min-h-[40px] text-xs font-medium ${
                          isSelected
                            ? `${atividade.cor} border-gray-400 font-bold`
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isSelected ? voluntario.codigo : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Como usar:</strong> Clique nos quadrados para marcar os
          horários em que você está disponível. Seu código aparecerá nos
          horários selecionados.
        </p>
      </div>
    </div>
  );
}
