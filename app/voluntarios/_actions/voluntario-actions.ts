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
            { slot: "asc" }, // ✅ ORDENAR POR SLOT TAMBÉM
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

export async function salvarDisponibilidade(
  voluntarioId: string,
  disponibilidades: DisponibilidadeData[]
) {
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

    // ✅ VALIDAR DISPONIBILIDADES COM SLOT
    if (disponibilidades.length > 0) {
      for (const disp of disponibilidades) {
        if (!disp.data || !disp.horario || !disp.atividade || !disp.slot) {
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
      }
    }

    await prisma.$transaction(async (tx) => {
      // Deletar disponibilidades existentes do voluntário
      await tx.disponibilidade.deleteMany({
        where: { voluntarioId },
      });

      // ✅ VERIFICAR SE SLOTS JÁ ESTÃO OCUPADOS
      if (disponibilidades.length > 0) {
        for (const disp of disponibilidades) {
          // Verificar se o slot já está ocupado por outro voluntário
          const slotOcupado = await tx.disponibilidade.findFirst({
            where: {
              data: disp.data,
              horario: disp.horario,
              atividade: disp.atividade,
              slot: disp.slot,
              voluntarioId: { not: voluntarioId }, // Excluir o próprio voluntário
            },
          });

          if (slotOcupado) {
            throw new Error(
              `Slot ${disp.slot} já está ocupado para ${disp.data} ${disp.horario}`
            );
          }
        }

        // Criar novas disponibilidades
        await tx.disponibilidade.createMany({
          data: disponibilidades.map((disp) => ({
            ...disp,
            voluntarioId,
          })),
        });
      }
    });

    revalidatePath("/voluntarios");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar disponibilidade:", error);

    if (error instanceof Error && error.message.includes("Slot")) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Erro ao salvar disponibilidade" };
  }
}
