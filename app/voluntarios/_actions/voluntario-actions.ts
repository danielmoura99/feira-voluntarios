"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CadastroVoluntarioData {
  nome: string;
  telefone: string;
  email: string;
  casaEspirita: string;
}

export interface DisponibilidadeData {
  data: string;
  horario: string;
  atividade: string;
  slot: number;
}

// ✅ MAPEAMENTO CORRETO DE TIPOS PARA ATIVIDADES VÁLIDAS
const TIPO_PARA_ATIVIDADE: Record<string, string> = {
  transporte: "transporte",
  organizacao: "organizacao",
  decoracao: "decoracao",
  transporte_livros: "transporte_livros",
  desmontagem: "desmontagem_15h",
  feira_aberta: "feira_aberta",
  desabilitado: "desabilitado",
};

// Função para gerar identificador da casa espírita
function gerarIdentificadorCasa(nomeCompleto: string): string {
  const palavrasIgnorar = [
    "centro",
    "espirita",
    "espírita",
    "casa",
    "grupo",
    "núcleo",
    "lar",
    "de",
    "da",
    "do",
    "das",
    "dos",
    "e",
    "em",
    "para",
    "com",
    "por",
    "são",
    "santo",
    "santa",
    "nossa",
    "senhora",
  ];

  // ✅ PRIMEIRO: verificar se já tem prefixo (ex: "SEARA - Centro...")
  const temPrefixo = nomeCompleto.includes(" - ");
  if (temPrefixo) {
    const prefixo = nomeCompleto.split(" - ")[0].trim();
    if (prefixo && prefixo.length > 1 && !/^\d+$/.test(prefixo)) {
      return prefixo;
    }
  }

  const palavras = nomeCompleto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)
    .filter(
      (palavra) =>
        palavra.length > 2 &&
        !palavrasIgnorar.includes(palavra) &&
        !/^\d+$/.test(palavra)
    );

  if (palavras.length === 0) {
    return nomeCompleto
      .replace(/[^a-zA-Z\s]/g, "")
      .split(" ")
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 6);
  }

  if (palavras.length === 1) {
    return palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  }

  if (palavras.length === 2) {
    return palavras.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  }

  return palavras
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

async function gerarCodigoVoluntario(casaEspirita: string): Promise<string> {
  try {
    const identificadorCasa = gerarIdentificadorCasa(casaEspirita);

    const ultimoVoluntario = await prisma.voluntario.findFirst({
      where: { casaEspirita: casaEspirita },
      orderBy: { createdAt: "desc" },
    });

    let proximoNumero = 1;
    if (ultimoVoluntario) {
      const codigoAtual = ultimoVoluntario.codigo;
      const match = codigoAtual.match(/-(\d+)$/);
      if (match) {
        proximoNumero = parseInt(match[1]) + 1;
      }
    }

    return `${identificadorCasa}-${proximoNumero}`;
  } catch (error) {
    console.error("Erro ao gerar código:", error);
    const timestamp = Date.now().toString().slice(-4);
    return `VOL-${timestamp}`;
  }
}

export async function cadastrarVoluntario(data: CadastroVoluntarioData) {
  try {
    if (!data.nome || !data.telefone || !data.email || !data.casaEspirita) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    const emailNormalizado = data.email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalizado)) {
      return { success: false, error: "Formato de email inválido" };
    }

    const emailExistente = await prisma.voluntario.findFirst({
      where: { email: emailNormalizado },
    });

    if (emailExistente) {
      return {
        success: false,
        error: "EMAIL_JA_CADASTRADO",
        voluntarioExistente: {
          nome: emailExistente.nome,
          codigo: emailExistente.codigo,
        },
      };
    }

    const codigo = await gerarCodigoVoluntario(data.casaEspirita);

    const voluntario = await prisma.voluntario.create({
      data: {
        codigo,
        nome: data.nome.trim(),
        telefone: data.telefone.replace(/\D/g, ""),
        email: emailNormalizado,
        casaEspirita: data.casaEspirita.trim(),
      },
    });

    revalidatePath("/voluntarios");
    revalidatePath("/dashboard");

    return {
      success: true,
      voluntario: {
        id: voluntario.id,
        codigo: voluntario.codigo,
        nome: voluntario.nome,
        casaEspirita: voluntario.casaEspirita,
      },
    };
  } catch (error) {
    console.error("Erro ao cadastrar voluntário:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function buscarVoluntario(codigo: string) {
  try {
    if (!codigo?.trim()) {
      return { success: false, error: "Código é obrigatório" };
    }

    const voluntario = await prisma.voluntario.findFirst({
      where: { codigo: codigo.toUpperCase().trim() },
      include: {
        disponibilidades: {
          orderBy: [
            { data: "asc" },
            { horario: "asc" },
            { atividade: "asc" },
            { slot: "asc" },
          ],
        },
      },
    });

    if (!voluntario) {
      return { success: false, error: "Voluntário não encontrado" };
    }

    return { success: true, voluntario };
  } catch (error) {
    console.error("Erro ao buscar voluntário:", error);
    return { success: false, error: "Erro ao buscar voluntário" };
  }
}

export async function buscarVoluntarioPorCodigo(codigo: string) {
  return buscarVoluntario(codigo);
}

// ✅ FUNÇÃO AUXILIAR PARA NORMALIZAR ATIVIDADE
function normalizarAtividade(tipoOriginal: string): string {
  const atividade = TIPO_PARA_ATIVIDADE[tipoOriginal] || tipoOriginal;
  console.log(`🔄 Normalizando atividade: ${tipoOriginal} -> ${atividade}`);
  return atividade;
}

export async function salvarDisponibilidade(
  voluntarioId: string,
  disponibilidades: DisponibilidadeData[]
) {
  console.log("🚀 Iniciando salvamento de disponibilidades...");
  console.log("📊 Dados recebidos:", { voluntarioId, disponibilidades });

  try {
    if (!voluntarioId?.trim()) {
      return { success: false, error: "ID do voluntário é obrigatório" };
    }

    const voluntarioExiste = await prisma.voluntario.findUnique({
      where: { id: voluntarioId },
    });

    if (!voluntarioExiste) {
      return { success: false, error: "Voluntário não encontrado" };
    }

    // ✅ NORMALIZAR E VALIDAR DISPONIBILIDADES
    const disponibilidadesNormalizadas: DisponibilidadeData[] = [];

    if (disponibilidades.length > 0) {
      for (const disp of disponibilidades) {
        if (!disp.data || !disp.horario || !disp.atividade || !disp.slot) {
          console.error("❌ Disponibilidade inválida:", disp);
          return {
            success: false,
            error: "Todos os campos de disponibilidade são obrigatórios",
          };
        }

        // Validar que slot está entre 1 e 4
        if (disp.slot < 1 || disp.slot > 4) {
          return {
            success: false,
            error: "Slot deve estar entre 1 e 4",
          };
        }

        // ✅ NORMALIZAR ATIVIDADE
        const atividadeNormalizada = normalizarAtividade(disp.atividade);

        disponibilidadesNormalizadas.push({
          ...disp,
          atividade: atividadeNormalizada,
        });
      }
    }

    console.log(
      "✅ Disponibilidades normalizadas:",
      disponibilidadesNormalizadas
    );

    // ✅ VERIFICAR DUPLICATAS INTERNAS NO ARRAY
    const keysUnicas = new Set();
    for (const disp of disponibilidadesNormalizadas) {
      const key = `${disp.data}-${disp.horario}-${disp.atividade}-${disp.slot}`;
      if (keysUnicas.has(key)) {
        console.error("❌ Duplicata detectada:", key);
        return {
          success: false,
          error: `Duplicata detectada: ${disp.data} ${disp.horario} slot ${disp.slot}`,
        };
      }
      keysUnicas.add(key);
    }

    await prisma.$transaction(async (tx) => {
      // 1. Deletar disponibilidades existentes do voluntário
      console.log("🗑️ Removendo disponibilidades existentes...");
      await tx.disponibilidade.deleteMany({
        where: { voluntarioId },
      });

      // 2. Verificar conflitos com outros voluntários
      if (disponibilidadesNormalizadas.length > 0) {
        console.log("🔍 Verificando conflitos com outros voluntários...");

        for (const disp of disponibilidadesNormalizadas) {
          const slotOcupado = await tx.disponibilidade.findFirst({
            where: {
              data: disp.data,
              horario: disp.horario,
              atividade: disp.atividade,
              slot: disp.slot,
              voluntarioId: { not: voluntarioId },
            },
            include: {
              voluntario: {
                select: { codigo: true, nome: true },
              },
            },
          });

          if (slotOcupado) {
            throw new Error(
              `Slot ${disp.slot} já está ocupado por ${slotOcupado.voluntario.codigo} (${slotOcupado.voluntario.nome}) para ${disp.data} ${disp.horario}`
            );
          }
        }

        // 3. Criar novas disponibilidades
        console.log("💾 Criando novas disponibilidades...");
        const dadosParaCriar = disponibilidadesNormalizadas.map((disp) => ({
          data: disp.data,
          horario: disp.horario,
          atividade: disp.atividade,
          slot: disp.slot,
          voluntarioId,
        }));

        console.log("📝 Dados a serem criados:", dadosParaCriar);

        await tx.disponibilidade.createMany({
          data: dadosParaCriar,
        });

        console.log("✅ Disponibilidades criadas com sucesso!");
      }
    });

    revalidatePath("/voluntarios");
    revalidatePath("/dashboard");

    console.log("🎉 Salvamento concluído com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao salvar disponibilidade:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("Slot") &&
        error.message.includes("já está ocupado")
      ) {
        return { success: false, error: error.message };
      }

      if (error.message.includes("Unique constraint")) {
        return {
          success: false,
          error:
            "Conflito de disponibilidade. Verifique se não há duplicatas selecionadas.",
        };
      }
    }

    return { success: false, error: "Erro ao salvar disponibilidade" };
  }
}
