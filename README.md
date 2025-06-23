# PENSA REG - Dashboard de Indicadores Regulatórios

Este repositório contém o **frontend** do projeto desenvolvido para a disciplina de Empreendedorismo Digital do IME-USP, realizado pela startup **PENSA REG**. O objetivo do sistema é fornecer uma plataforma de visualização e análise de dados regulatórios do setor farmacêutico, facilitando a gestão de processos, empresas, produtos e apresentações.

## Sobre o Projeto

O PENSA REG é uma solução inovadora para monitoramento e análise de processos regulatórios, permitindo que empresas do setor farmacêutico acompanhem indicadores-chave, visualizem gráficos e recebam alertas sobre vencimentos e status de registros.

O dashboard apresenta:

- Indicadores de processos, empresas, produtos e apresentações.
- Gráficos dinâmicos sobre evolução, distribuição e top 10 de empresas e princípios ativos.
- Tabelas e filtros para facilitar a busca e análise dos dados.

## Arquitetura do Código

O frontend foi desenvolvido em **React** com uso de **Material Tailwind** para a interface e **Heroicons** para os ícones. A estrutura principal do projeto é:

```
src/
├── components/           # Componentes reutilizáveis
├── data/                 # Dados estáticos e mocks para gráficos e tabelas
├── pages/
│   └── dashboard/        # Páginas principais do dashboard (home, tables, etc)
├── widgets/              # Cards, gráficos e outros widgets visuais
├── App.jsx               # Componente principal de rotas
└── index.js              # Ponto de entrada da aplicação
```

A comunicação com o backend é feita via **fetch** para endpoints REST, como por exemplo:

- `/getEmpresas` para obter empresas cadastradas
- `/processos` para obter processos regulatórios
- `/produtos/:id` para detalhes de apresentações de produtos

Os indicadores e gráficos são atualizados dinamicamente a partir dessas requisições.

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para rodar o frontend

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/pensa-reg-frontend.git
   cd pensa-reg-frontend
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   # ou
   yarn install
   ```

3. **Execute o projeto:**
   ```sh
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

O frontend irá consumir os dados do backend já configurado (verifique se o backend está disponível e acessível).

---

## Contato

Projeto desenvolvido para a disciplina de Empreendedorismo Digital - IME-USP  
Startup: **PENSA REG**  
Dúvidas e sugestões: [contato@pensareg.com.br](mailto:contato@pensareg.com.br)
