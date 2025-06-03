/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface Disponibilidade {
  id: string;
  data: string;
  horario: string;
  atividade: string;
  slot: number;
  voluntario: {
    codigo: string;
    nome: string;
    casaEspirita: string;
  };
}

interface Props {
  disponibilidades: Disponibilidade[];
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
};

// ✅ MAPEAMENTO ESPECÍFICO DE CORES POR DATA/HORÁRIO
const MAPA_CORES: Record<
  string,
  Record<string, { tipo: string; cor: string; atividade: string }>
> = {
  "13/08": {
    "08h-10h": {
      tipo: "desabilitado",
      cor: "bg-gray-100",
      atividade: "Desabilitado",
    },
    "10h-12h": {
      tipo: "desabilitado",
      cor: "bg-gray-100",
      atividade: "Desabilitado",
    },
    "12h-14h": {
      tipo: "desabilitado",
      cor: "bg-gray-100",
      atividade: "Desabilitado",
    },
    "14h-16h": {
      tipo: "transporte",
      cor: "bg-yellow-200",
      atividade: "Transporte e Montagem",
    },
    "16h-18h": {
      tipo: "transporte",
      cor: "bg-yellow-200",
      atividade: "Transporte e Montagem",
    },
    "18h-20h": {
      tipo: "transporte",
      cor: "bg-yellow-200",
      atividade: "Transporte e Montagem",
    },
  },
  "14/08": {
    "08h-10h": {
      tipo: "decoracao",
      cor: "bg-pink-200",
      atividade: "Decoração",
    },
    "10h-12h": {
      tipo: "decoracao",
      cor: "bg-pink-200",
      atividade: "Decoração",
    },
    "12h-14h": {
      tipo: "decoracao",
      cor: "bg-pink-200",
      atividade: "Decoração",
    },
    "14h-16h": {
      tipo: "decoracao",
      cor: "bg-pink-200",
      atividade: "Decoração",
    },
    "16h-18h": {
      tipo: "decoracao",
      cor: "bg-pink-200",
      atividade: "Decoração",
    },
    "18h-20h": {
      tipo: "transporte_livros",
      cor: "bg-green-200",
      atividade: "Transporte e disposição dos Livros",
    },
  },
  "15/08": {
    "08h-10h": {
      tipo: "organizacao",
      cor: "bg-blue-200",
      atividade: "Organização dos livros nas estantes",
    },
    "10h-12h": {
      tipo: "organizacao",
      cor: "bg-blue-200",
      atividade: "Organização dos livros nas estantes",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "16/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "17/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "18/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "19/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "20/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "21/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "22/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "23/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "18h-20h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
  },
  "24/08": {
    "08h-10h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "10h-12h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "12h-14h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "14h-16h": {
      tipo: "feira_aberta",
      cor: "bg-white",
      atividade: "Feira Aberta",
    },
    "16h-18h": {
      tipo: "desmontagem",
      cor: "bg-gray-200",
      atividade: "Desmontagem à partir das 15h",
    },
    "18h-20h": {
      tipo: "desmontagem",
      cor: "bg-gray-200",
      atividade: "Desmontagem à partir das 15h",
    },
  },
};

export default function GradeDashboard({ disponibilidades }: Props) {
  // ✅ ORGANIZAR DISPONIBILIDADES POR SLOT ESPECÍFICO
  const mapDisponibilidades = disponibilidades.reduce((acc, disp) => {
    const key = `${disp.data}-${disp.horario}-${disp.atividade}-${disp.slot}`;
    acc[key] = disp;
    return acc;
  }, {} as Record<string, Disponibilidade>);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        📅 Grade Completa de Voluntários
      </h2>

      {/* ✅ LEGENDA COMPLETA DAS ATIVIDADES */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Legenda das Atividades
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-3 bg-yellow-200 border border-yellow-300"></div>
            <span className="text-sm text-gray-700">
              Transporte e montagem das estantes
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-3 bg-blue-200 border border-blue-300"></div>
            <span className="text-sm text-gray-700">
              Organização dos livros nas estantes
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-3 bg-pink-200 border border-pink-300"></div>
            <span className="text-sm text-gray-700">Decoração</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-3 bg-green-200 border border-green-300"></div>
            <span className="text-sm text-gray-700">
              Transporte e disposição dos livros
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-3 bg-gray-200 border border-gray-300"></div>
            <span className="text-sm text-gray-700">
              Desmontagem (a partir das 15h)
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-3 bg-white border border-gray-400"></div>
            <span className="text-sm text-gray-700">Feira Aberta</span>
          </div>
        </div>
      </div>

      {/* Grade Responsiva */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
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

          {/* ✅ LINHAS DE HORÁRIOS - 4 SLOTS POR HORÁRIO EM LINHAS SEPARADAS */}
          {DADOS_FEIRA.horarios.map((horario) =>
            [1, 2, 3, 4].map((slot) => (
              <div
                key={`${horario}-slot-${slot}`}
                className="grid grid-cols-13 gap-1 mb-1"
              >
                {/* ✅ COLUNA DO HORÁRIO COM SLOT */}
                <div className="p-2 text-xs font-medium text-gray-700 flex items-center justify-center border-r border-gray-200 bg-gray-50">
                  <div className="text-center">
                    <div className="font-semibold">{horario}</div>
                    <div className="text-[10px] text-gray-500">Slot {slot}</div>
                  </div>
                </div>

                {/* ✅ QUADRADOS POR DATA */}
                {DADOS_FEIRA.datas.map((data) => {
                  const configPeriodo =
                    MAPA_CORES[data.dia as keyof typeof MAPA_CORES]?.[horario];

                  // ✅ BUSCAR VOLUNTÁRIO PARA ESTE SLOT ESPECÍFICO
                  const key = `${data.dia}-${horario}-${
                    configPeriodo?.tipo || "feira_aberta"
                  }-${slot}`;
                  const voluntarioSlot = mapDisponibilidades[key];

                  return (
                    <div
                      key={`${data.key}-${horario}-slot-${slot}`}
                      className={`
                        p-1 rounded border min-h-[35px] text-xs flex items-center justify-center
                        ${configPeriodo?.cor || "bg-white"}
                        ${
                          configPeriodo?.tipo === "desabilitado"
                            ? "opacity-30 border-gray-300"
                            : "border-gray-400"
                        }
                        ${
                          configPeriodo?.cor === "bg-white"
                            ? "border-gray-300"
                            : ""
                        }
                      `}
                      title={configPeriodo?.atividade || "Feira Aberta"}
                    >
                      {voluntarioSlot && (
                        <div
                          className="bg-white bg-opacity-90 rounded px-1 py-0.5 text-xs font-medium shadow-sm cursor-pointer"
                          title={`${voluntarioSlot.voluntario.nome} - ${voluntarioSlot.voluntario.casaEspirita}`}
                        >
                          {voluntarioSlot.voluntario.codigo}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Como ler:</strong> Cada slot mostra os códigos dos
          voluntários disponíveis para aquele horário específico. As cores
          sempre visíveis facilitam a identificação das atividades. Passe o
          mouse sobre os códigos para ver o nome completo e casa espírita.
        </p>
      </div>
    </div>
  );
}
