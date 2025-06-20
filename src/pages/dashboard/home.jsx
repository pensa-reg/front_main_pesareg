import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import {
  BuildingOffice2Icon,
  ChartBarIcon,
  ChartPieIcon,
  ChartBarSquareIcon,
  BeakerIcon,
} from "@heroicons/react/24/solid";

const initialCards = [
  {
    color: "gray",
    icon: BuildingOffice2Icon,
    title: "Total de Empresas Cadastradas",
    value: "0",
    footer: {
      color: "text-green-500",
      value: "0",
      label: "empresas",
    },
  },
];

const statisticsChartsData = [
  {
    color: "blue",
    icon: ChartBarIcon,
    title: "Processos por Empresa (Top 10)",
    description: "Gráfico de barras mostrando as empresas com maior número de processos.",
    footer: "Top 10 empresas com mais processos.",
  },
  {
    color: "green",
    icon: ChartPieIcon,
    title: "Distribuição de Processos por Situação",
    description: "Gráfico de pizza ou barras mostrando status: ativo, vencido, suspenso.",
    footer: "Distribuição por situação dos processos.",
  },
  {
    color: "purple",
    icon: ChartBarSquareIcon,
    title: "Evolução Mensal de Processos Cadastrados",
    description: "Gráfico de linha mostrando o número de processos cadastrados por mês.",
    footer: "Evolução mensal dos cadastros.",
  },
  {
    color: "orange",
    icon: BeakerIcon,
    title: "Produtos por Princípio Ativo (Top 10)",
    description: "Gráfico de barras com os princípios ativos mais frequentes.",
    footer: "Top 10 princípios ativos.",
  },
];

export function Home() {
  const [cards, setCards] = useState(initialCards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmpresas() {
      setLoading(true);
      try {
        const empresasRes = await fetch("https://medicine-consumer.onrender.com/getEmpresas");
        const empresas = await empresasRes.json();
        setCards([
          {
            ...initialCards[0],
            value: empresas.length,
            footer: {
              ...initialCards[0].footer,
              value: empresas.length,
            },
          },
        ]);
      } catch {
        setCards(initialCards);
      }
      setLoading(false);
    }
    fetchEmpresas();
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-4 flex justify-center items-center h-32">
            <Spinner color="blue" />
          </div>
        ) : (
          cards.map(({ icon: Icon, title, footer, ...rest }) => (
            <StatisticsCard
              key={title}
              {...rest}
              icon={<Icon />}
              title={title}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer.color}>{footer.value}</strong>
                  &nbsp;{footer.label}
                </Typography>
              }
            />
          ))
        )}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsChartsData.map(({ icon: Icon, title, description, footer, color }) => (
          <Card key={title} className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 bg-${color}-100`}>
                <Icon className={`h-6 w-6 text-${color}-700`} />
              </div>
              <Typography variant="h6" color="blue-gray">
                {title}
              </Typography>
            </div>
            <Typography variant="small" color="gray" className="mb-2">
              {description}
            </Typography>
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              &nbsp;{footer}
            </Typography>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;