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

// ✅ CORREÇÃO DO BUG DE DUPLICAÇÃO NO CÓDIGO
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

  // ✅ PRIMEIRO: verificar se já tem prefixo (ex: "SEARA - Centro...")
  const temPrefixo = nomeCompleto.includes(" - ");
  if (temPrefixo) {
    const prefixo = nomeCompleto.split(" - ")[0].trim();
    // Se o prefixo é válido (não vazio e não é só números), usar ele
    if (prefixo && prefixo.length > 1 && !/^\d+$/.test(prefixo)) {
      return prefixo;
    }
  }

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

    // Normalizar email
    const emailNormalizado = data.email.toLowerCase().trim();

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalizado)) {
      return { success: false, error: "Formato de email inválido" };
    }

    // ✅ VERIFICAR SE EMAIL JÁ EXISTE E RETORNAR DADOS DO VOLUNTÁRIO
    const emailExistente = await prisma.voluntario.findFirst({
      where: {
        email: emailNormalizado,
      },
    });

    if (emailExistente) {
      return {
        success: false,
        error: "EMAIL_JA_CADASTRADO", // ✅ Tipo específico de erro
        voluntarioExistente: {
          nome: emailExistente.nome,
          codigo: emailExistente.codigo,
        },
      };
    }

    // Gerar código único
    const codigo = await gerarCodigoVoluntario(data.casaEspirita);

    // Criar voluntário
    const voluntario = await prisma.voluntario.create({
      data: {
        codigo,
        nome: data.nome.trim(),
        telefone: data.telefone.replace(/\D/g, ""), // Remove formatação
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
    if (!codigo || !codigo.trim()) {
      return { success: false, error: "Código é obrigatório" };
    }

    const voluntario = await prisma.voluntario.findFirst({
      where: {
        codigo: codigo.toUpperCase().trim(),
      },
      include: {
        disponibilidades: {
          orderBy: [{ data: "asc" }, { horario: "asc" }, { atividade: "asc" }],
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
    // Validações
    if (!voluntarioId || !voluntarioId.trim()) {
      return { success: false, error: "ID do voluntário é obrigatório" };
    }

    // Verificar se voluntário existe
    const voluntarioExiste = await prisma.voluntario.findUnique({
      where: { id: voluntarioId },
    });

    if (!voluntarioExiste) {
      return { success: false, error: "Voluntário não encontrado" };
    }

    // Validar disponibilidades
    if (disponibilidades.length > 0) {
      for (const disp of disponibilidades) {
        if (!disp.data || !disp.horario || !disp.atividade) {
          return {
            success: false,
            error: "Todos os campos de disponibilidade são obrigatórios",
          };
        }
      }
    }

    // Usar transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      // Deletar disponibilidades existentes
      await tx.disponibilidade.deleteMany({
        where: { voluntarioId },
      });

      // Criar novas disponibilidades
      if (disponibilidades.length > 0) {
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
    return { success: false, error: "Erro ao salvar disponibilidade" };
  }
}
