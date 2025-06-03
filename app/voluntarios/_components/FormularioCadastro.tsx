/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  cadastrarVoluntario,
  CadastroVoluntarioData,
} from "../_actions/voluntario-actions";
import { Loader2, User, Phone, Mail, Building } from "lucide-react";

// Lista de casas espíritas pré-definidas
const CASAS_PREDEFINIDAS = [
  "SEARA - Centro Espírita Seara de Luz",
  "Divino Mestre - Centro Espírita Divino Mestre",
  "Esperança - Centro Espírita Esperança",
  "Caridade - Casa Espírita da Caridade",
  "Amor e Luz - Centro Espírita Amor e Luz",
  "Paz e Amor - Centro Espírita Paz e Amor",
  "Bezerra de Menezes - Centro Espírita Bezerra de Menezes",
  "Allan Kardec - Centro Espírita Allan Kardec",
  "Emmanuel - Centro Espírita Emmanuel",
  "Chico Xavier - Centro Espírita Chico Xavier",
  "André Luiz - Centro Espírita André Luiz",
  "Lar de Maria - Lar Espírita Lar de Maria",
  "João de Deus - Centro Espírita João de Deus",
  "São Vicente de Paulo - Centro Espírita São Vicente de Paulo",
  "Nosso Lar - Centro Espírita Nosso Lar",
].sort();

interface Voluntario {
  id: string;
  codigo: string;
  nome: string;
}

interface Props {
  onSuccess: (voluntario: Voluntario) => void;
}

export default function FormularioCadastro({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CadastroVoluntarioData>({
    nome: "",
    telefone: "",
    email: "",
    casaEspirita: "",
  });
  const [usarCasaPersonalizada, setUsarCasaPersonalizada] = useState(false);
  const [casaPersonalizada, setCasaPersonalizada] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usar casa personalizada se selecionada, senão usar a do select
      const dadosFinais = {
        ...formData,
        casaEspirita: usarCasaPersonalizada
          ? casaPersonalizada
          : formData.casaEspirita,
      };

      const result = await cadastrarVoluntario(dadosFinais);

      if (result.success && result.voluntario) {
        onSuccess(result.voluntario);
        setFormData({ nome: "", telefone: "", email: "", casaEspirita: "" });
        setUsarCasaPersonalizada(false);
        setCasaPersonalizada("");
      } else {
        alert("Erro ao cadastrar voluntário");
      }
    } catch (error) {
      alert("Erro ao cadastrar voluntário");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: CadastroVoluntarioData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCasaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    if (valor === "PERSONALIZADA") {
      setUsarCasaPersonalizada(true);
      setFormData((prev: CadastroVoluntarioData) => ({
        ...prev,
        casaEspirita: "",
      }));
    } else {
      setUsarCasaPersonalizada(false);
      setCasaPersonalizada("");
      setFormData((prev: CadastroVoluntarioData) => ({
        ...prev,
        casaEspirita: valor,
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 rounded-full p-3 mr-4">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Cadastro de Voluntário
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Casa Espírita
            </label>
            <select
              value={
                usarCasaPersonalizada ? "PERSONALIZADA" : formData.casaEspirita
              }
              onChange={handleCasaChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              required
            >
              <option value="">
                Ex: GEFA, Centro Espírita Seara de Luz...
              </option>
              {CASAS_PREDEFINIDAS.map((casa) => (
                <option key={casa} value={casa}>
                  {casa}
                </option>
              ))}
              <option value="PERSONALIZADA">🔍 Não está na lista</option>
            </select>
          </div>

          {/* Campo personalizado para casa não listada */}
          {usarCasaPersonalizada && (
            <div className="lg:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Digite o nome da sua casa espírita
              </label>
              <input
                type="text"
                value={casaPersonalizada}
                onChange={(e) => setCasaPersonalizada(e.target.value)}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                placeholder="Ex: Centro Espírita Nova Era"
                required
              />
              <p className="text-xs text-blue-600 mt-2">
                💡 Seu código será gerado automaticamente baseado no nome da
                casa
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="(12) 99999-9999"
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              Cadastrando...
            </>
          ) : (
            "Fazer Cadastro"
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>📋 Atenção:</strong> Após o cadastro, você receberá um código
          para marcar seus horários de disponibilidade na grade abaixo.
        </p>
      </div>
    </div>
  );
}
