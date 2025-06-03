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
}

function gerarCodigo(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function cadastrarVoluntario(data: CadastroVoluntarioData) {
  try {
    let codigo = gerarCodigo();

    // Verificar se o código já existe
    let existeCodigo = await prisma.voluntario.findUnique({
      where: { codigo },
    });

    // Gerar novo código se já existir
    while (existeCodigo) {
      codigo = gerarCodigo();
      existeCodigo = await prisma.voluntario.findUnique({
        where: { codigo },
      });
    }

    const voluntario = await prisma.voluntario.create({
      data: {
        ...data,
        codigo,
      },
    });

    revalidatePath("/voluntarios");
    return { success: true, voluntario };
  } catch (error) {
    console.error("Erro ao cadastrar voluntário:", error);
    return { success: false, error: "Erro ao cadastrar voluntário" };
  }
}

export async function salvarDisponibilidade(
  voluntarioId: string,
  disponibilidades: DisponibilidadeData[]
) {
  try {
    // Deletar disponibilidades existentes
    await prisma.disponibilidade.deleteMany({
      where: { voluntarioId },
    });

    // Criar novas disponibilidades
    if (disponibilidades.length > 0) {
      await prisma.disponibilidade.createMany({
        data: disponibilidades.map((disp) => ({
          ...disp,
          voluntarioId,
        })),
      });
    }

    revalidatePath("/voluntarios");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar disponibilidade:", error);
    return { success: false, error: "Erro ao salvar disponibilidade" };
  }
}

export async function buscarVoluntario(codigo: string) {
  try {
    const voluntario = await prisma.voluntario.findUnique({
      where: { codigo },
      include: {
        disponibilidades: true,
      },
    });

    return { success: true, voluntario };
  } catch (error) {
    console.error("Erro ao buscar voluntário:", error);
    return { success: false, error: "Erro ao buscar voluntário" };
  }
}
