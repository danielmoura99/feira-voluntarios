# Sistema de Voluntários - Feira do Livro Espírita

Sistema web para cadastro e organização de voluntários da 54ª Feira do Livro Espírita e 31ª Feira do Livro Espírita Infantil.

## 🎯 Funcionalidades

- ✅ Cadastro de voluntários com código único
- ✅ Grade interativa de horários e atividades
- ✅ Dashboard com estatísticas e visualização completa
- ✅ Interface responsiva (desktop e mobile)
- ✅ Sistema de busca e filtros
- ✅ Persistência de dados em PostgreSQL

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco**: PostgreSQL (Neon)
- **Deploy**: Vercel (em breve)

## 📱 Capturas de Tela

### Página Inicial

Interface inicial com acesso ao cadastro e dashboard.

### Cadastro de Voluntários

Formulário para cadastro com geração automática de código único.

### Grade de Horários

Interface interativa para marcar disponibilidade por horário e atividade.

### Dashboard

Visão completa com estatísticas e grade de todos os voluntários.

## 🛠️ Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/feira-voluntarios.git
cd feira-voluntarios

Instale as dependências:

bashnpm install

Configure o banco de dados:

bash# Configure sua URL do Neon no arquivo .env
npx prisma migrate dev
npx prisma generate

Execute o projeto:

bashnpm run dev

Acesse: http://localhost:3000

📋 Estrutura do Projeto
feira-voluntarios/
├── app/
│   ├── (home)/              # Página inicial
│   ├── voluntarios/         # Sistema de cadastro
│   ├── dashboard/           # Painel administrativo
│   └── layout.tsx
├── lib/
│   └── prisma.ts           # Configuração do banco
├── prisma/
│   └── schema.prisma       # Esquema do banco
└── ...
🎨 Design System

Cores principais: Azul (#3B82F6), Verde (#10B981), Amarelo (#F59E0B)
Tipografia: Inter
Componentes: Totalmente responsivos
Acessibilidade: Foco em usabilidade

📈 Próximas Funcionalidades

 Sistema de exportação (Excel/PDF)
 Notificações toast
 Envio de emails automáticos
 Sistema de backup
 Modo escuro

🤝 Contribuição
Este projeto foi desenvolvido para a comunidade espírita de São José dos Campos.
📄 Licença
MIT License - veja o arquivo LICENSE para detalhes.

Feira do Livro Espírita 2025
Praça Ulysses Guimarães, Jardim Aquárius - São José dos Campos
```
