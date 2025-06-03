"use server";

import { prisma } from "@/lib/prisma";

export async function buscarTodosVoluntarios() {
  try {
    const voluntarios = await prisma.voluntario.findMany({
      include: {
        disponibilidades: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, voluntarios };
  } catch (error) {
    console.error("Erro ao buscar voluntários:", error);
    return { success: false, error: "Erro ao buscar voluntários" };
  }
}

export async function buscarEstatisticas() {
  try {
    const totalVoluntarios = await prisma.voluntario.count();

    const disponibilidadesPorAtividade = await prisma.disponibilidade.groupBy({
      by: ["atividade"],
      _count: {
        id: true,
      },
    });

    const disponibilidadesPorData = await prisma.disponibilidade.groupBy({
      by: ["data"],
      _count: {
        id: true,
      },
      orderBy: {
        data: "asc",
      },
    });

    const disponibilidadesPorHorario = await prisma.disponibilidade.groupBy({
      by: ["horario"],
      _count: {
        id: true,
      },
    });

    return {
      success: true,
      estatisticas: {
        totalVoluntarios,
        disponibilidadesPorAtividade,
        disponibilidadesPorData,
        disponibilidadesPorHorario,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return { success: false, error: "Erro ao buscar estatísticas" };
  }
}

export async function buscarDisponibilidadesPorHorario() {
  try {
    const disponibilidades = await prisma.disponibilidade.findMany({
      include: {
        voluntario: {
          select: {
            codigo: true,
            nome: true,
            casaEspirita: true,
          },
        },
      },
      orderBy: [{ data: "asc" }, { horario: "asc" }, { atividade: "asc" }],
    });

    return { success: true, disponibilidades };
  } catch (error) {
    console.error("Erro ao buscar disponibilidades:", error);
    return { success: false, error: "Erro ao buscar disponibilidades" };
  }
}
