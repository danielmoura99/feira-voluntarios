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

// Função para gerar identificador da casa espírita
function gerarIdentificadorCasa(nomeCompleto: string): string {
  // Remover palavras comuns e conectores
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

  const palavras = nomeCompleto
    .toLowerCase()
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas
    .split(/\s+/)
    .filter(
      (palavra) =>
        palavra.length > 2 &&
        !palavrasIgnorar.includes(palavra) &&
        !/^\d+$/.test(palavra) // Remove números puros
    );

  if (palavras.length === 0) {
    // Fallback: usar as primeiras letras do nome original
    return nomeCompleto
      .replace(/[^a-zA-Z\s]/g, "")
      .split(" ")
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 6);
  }

  // Se tem só uma palavra relevante, usar ela
  if (palavras.length === 1) {
    return palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  }

  // Se tem 2 palavras, usar ambas
  if (palavras.length === 2) {
    return palavras.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  }

  // Se tem mais de 2, usar as 2 mais significativas (normalmente as primeiras)
  return palavras
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

async function gerarCodigoVoluntario(casaEspirita: string): Promise<string> {
  try {
    // Gerar identificador da casa
    const identificadorCasa = gerarIdentificadorCasa(casaEspirita);

    // Buscar o próximo número para esta casa
    const ultimoVoluntario = await prisma.voluntario.findFirst({
      where: {
        casaEspirita: casaEspirita,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let proximoNumero = 1;

    if (ultimoVoluntario) {
      // Extrair o número do código atual
      const codigoAtual = ultimoVoluntario.codigo;
      const match = codigoAtual.match(/-(\d+)$/);
      if (match) {
        proximoNumero = parseInt(match[1]) + 1;
      }
    }

    return `${identificadorCasa}-${proximoNumero}`;
  } catch (error) {
    console.error("Erro ao gerar código:", error);
    // Fallback para um código simples baseado em timestamp
    const timestamp = Date.now().toString().slice(-4);
    return `VOL-${timestamp}`;
  }
}

export async function cadastrarVoluntario(data: CadastroVoluntarioData) {
  try {
    // Validações básicas
    if (!data.nome || !data.telefone || !data.email || !data.casaEspirita) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    // Verificar se email já existe
    const emailExistente = await prisma.voluntario.findFirst({
      where: { email: data.email.toLowerCase() },
    });

    if (emailExistente) {
      return { success: false, error: "Este email já está cadastrado" };
    }

    // Gerar código único
    const codigo = await gerarCodigoVoluntario(data.casaEspirita);

    // Criar voluntário
    const voluntario = await prisma.voluntario.create({
      data: {
        codigo,
        nome: data.nome.trim(),
        telefone: data.telefone.replace(/\D/g, ""), // Remove formatação
        email: data.email.toLowerCase().trim(),
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
      },
    };
  } catch (error) {
    console.error("Erro ao cadastrar voluntário:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function buscarVoluntarioPorCodigo(codigo: string) {
  try {
    const voluntario = await prisma.voluntario.findFirst({
      where: { codigo: codigo.toUpperCase() },
      include: {
        disponibilidades: {
          orderBy: [{ data: "asc" }, { horario: "asc" }],
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
