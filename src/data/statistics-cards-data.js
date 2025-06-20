import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Total de Processos Ativos",
    value: "0",
    footer: {
      color: "text-green-500",
      value: "0",
      label: "processos",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total de Empresas Cadastradas",
    value: "0",
    footer: {
      color: "text-green-500",
      value: "0",
      label: "empresas",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Produtos Próximos do Vencimento",
    value: "0",
    footer: {
      color: "text-orange-500",
      value: "0",
      label: "produtos",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Total de Apresentações Cadastradas",
    value: "0",
    footer: {
      color: "text-blue-500",
      value: "0",
      label: "apresentações",
    },
  },
];

export default statisticsCardsData;