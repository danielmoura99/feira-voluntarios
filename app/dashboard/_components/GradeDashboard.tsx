/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface Disponibilidade {
  id: string;
  data: string;
  horario: string;
  atividade: string;
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

export default function GradeDashboard({ disponibilidades }: Props) {
  // Organizar disponibilidades em um mapa para fácil acesso
  const mapDisponibilidades = disponibilidades.reduce((acc, disp) => {
    const key = `${disp.data}-${disp.horario}-${disp.atividade}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(disp);
    return acc;
  }, {} as Record<string, Disponibilidade[]>);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        📅 Grade Completa de Voluntários
      </h2>

      {/* Legenda */}
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
                      <span className="font-semibold">{horario}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {atividade.label.length > 25
                        ? `${atividade.label.substring(0, 25)}...`
                        : atividade.label}
                    </span>
                  </div>

                  {DADOS_FEIRA.datas.map((data) => {
                    const key = `${data.dia}-${horario}-${atividade.key}`;
                    const voluntariosNestePeriodo =
                      mapDisponibilidades[key] || [];

                    return (
                      <div
                        key={`${data.key}-${horario}-${atividade.key}`}
                        className={`p-1 rounded border min-h-[50px] text-xs ${
                          voluntariosNestePeriodo.length > 0
                            ? `${atividade.cor} border-gray-400`
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="space-y-1">
                          {voluntariosNestePeriodo.map((disp, idx) => (
                            <div
                              key={disp.id}
                              className="bg-white bg-opacity-80 rounded px-1 py-0.5 text-xs font-medium"
                              title={`${disp.voluntario.nome} - ${disp.voluntario.casaEspirita}`}
                            >
                              {disp.voluntario.codigo}
                            </div>
                          ))}
                          {voluntariosNestePeriodo.length > 0 && (
                            <div className="text-xs text-gray-600 font-semibold">
                              ({voluntariosNestePeriodo.length})
                            </div>
                          )}
                        </div>
                      </div>
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
          <strong>💡 Como ler:</strong> Cada célula mostra os códigos dos
          voluntários disponíveis para aquele horário e atividade. Passe o mouse
          sobre os códigos para ver o nome completo e casa espírita.
        </p>
      </div>
    </div>
  );
}
