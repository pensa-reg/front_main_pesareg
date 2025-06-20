import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Componente para exibir a tabela de processos
function TabelaProcessos({ processos, onVoltar, onDetalhes }) {
  // Função para exportar CSV
  const exportarCSV = () => {
    if (!processos.length) return;
    const header = [
      "Nome do Produto",
      "Empresa",
      "CNPJ",
      "Princípio Ativo",
      "Número do Processo",
      "Data da Expiração"
    ];
    const rows = processos.map(proc => [
      `"${proc.nome_comercial || "-"}"`,
      `"${proc.empresa_nome || "-"}"`,
      `"${proc.empresa_cnpj || "-"}"`,
      `"${proc.principio_ativo || "-"}"`,
      `"${proc.n_processo || "-"}"`,
      `"${proc.data_expiracao || "-"}"`
    ]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "processos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Lista de Processos
          </Typography>
          <div className="flex gap-2">
            <Button color="green" onClick={exportarCSV}>Exportar CSV</Button>
            <Button color="gray" onClick={onVoltar}>Voltar</Button>
          </div>
        </CardHeader>
        <CardBody className="px-6 pb-6 pt-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b">Nome do Produto</th>
                  <th className="p-2 border-b">Empresa</th>
                  <th className="p-2 border-b">CNPJ</th>
                  <th className="p-2 border-b">Princípio Ativo</th>
                  <th className="p-2 border-b">Número do Processo</th>
                  <th className="p-2 border-b">Data da Expiração</th>
                </tr>
              </thead>
              <tbody>
                {processos.map((proc) => (
                  <tr
                    key={proc.id}
                    className="hover:bg-blue-50 cursor-pointer"
                    onClick={() => onDetalhes(proc)}
                  >
                    <td className="p-2 border-b">{proc.nome_comercial || "-"}</td>
                    <td className="p-2 border-b">{proc.empresa_nome || "-"}</td>
                    <td className="p-2 border-b">{proc.empresa_cnpj}</td>
                    <td className="p-2 border-b">{proc.principio_ativo}</td>
                    <td className="p-2 border-b">{proc.n_processo}</td>
                    <td className="p-2 border-b">{proc.data_expiracao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {processos.length === 0 && (
              <Typography color="gray" className="mt-4">Nenhum processo encontrado.</Typography>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// NOVO COMPONENTE: Detalhes do Processo/Produto
function DetalhesProcesso({ processo, onVoltar }) {
  const [apresentacoes, setApresentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!processo?.id) return;
    setCarregando(true);
    fetch(`https://medicine-consumer.onrender.com/produtos/${processo.id}`)
      .then(res => res.json())
      .then(data => {
        setApresentacoes(Array.isArray(data) ? data : []);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, [processo]);

  const exportarCSV = () => {
    if (!apresentacoes.length) return;
    const header = [
      "Nome do Produto",
      "Princípio Ativo",
      "Empresa",
      "CNPJ",
      "Número do Processo",
      "Genérico",
      "Expiração",
      "Número do Processo",
      "Número de Registro",
      "Validade",
      "Apresentação do Produto"
    ];
    const rows = apresentacoes.map(apres => [
      processo.nome_comercial || "-",
      processo.principio_ativo || "-",
      processo.empresa_nome || "-",
      processo.empresa_cnpj || "-",
      processo.n_processo || "-",
      processo.e_generico ? "Sim" : "Não",
      processo.data_expiracao || "-",
      processo.n_processo || "-",
      apres.n_registro || "-",
      apres.validade || "-",
      apres.apresentacao || "-"
    ]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "detalhes_produto.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Detalhes do Produto/Processo
          </Typography>
          <div className="flex gap-2">
            <Button color="green" onClick={exportarCSV}>Exportar CSV</Button>
            <Button color="gray" onClick={onVoltar}>Voltar</Button>
          </div>
        </CardHeader>
        <CardBody className="px-6 pb-6 pt-0">
          {carregando ? (
            <div className="flex justify-center items-center h-40">
              <Spinner color="blue" />
            </div>
          ) : apresentacoes.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-max text-left">
                <thead>
                  <tr>
                    <th className="p-2 border-b">Nome do Produto</th>
                    <th className="p-2 border-b">Princípio Ativo</th>
                    <th className="p-2 border-b">Empresa</th>
                    <th className="p-2 border-b">CNPJ</th>
                    <th className="p-2 border-b">Número do Processo</th>
                    <th className="p-2 border-b">Genérico</th>
                    <th className="p-2 border-b">Expiração</th>
                    <th className="p-2 border-b">Número do Processo</th>
                    <th className="p-2 border-b">Número de Registro</th>
                    <th className="p-2 border-b">Validade</th>
                    <th className="p-2 border-b">Apresentação do Produto</th>
                  </tr>
                </thead>
                <tbody>
                  {apresentacoes.map((apres, idx) => (
                    <tr key={apres.id || idx}>
                      <td className="p-2 border-b">{processo.nome_comercial || "-"}</td>
                      <td className="p-2 border-b">{processo.principio_ativo || "-"}</td>
                      <td className="p-2 border-b">{processo.empresa_nome || "-"}</td>
                      <td className="p-2 border-b">{processo.empresa_cnpj || "-"}</td>
                      <td className="p-2 border-b">{processo.n_processo || "-"}</td>
                      <td className="p-2 border-b">{processo.e_generico ? "Sim" : "Não"}</td>
                      <td className="p-2 border-b">{processo.data_expiracao || "-"}</td>
                      <td className="p-2 border-b">{processo.n_processo || "-"}</td>
                      <td className="p-2 border-b">{apres.n_registro || "-"}</td>
                      <td className="p-2 border-b">{apres.validade || "-"}</td>
                      <td className="p-2 border-b">{apres.apresentacao || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Typography color="gray" className="mt-4">Não foi possível carregar os detalhes.</Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function FiltroProcessos() {
  const [empresas, setEmpresas] = useState([]);
  const [buscaEmpresa, setBuscaEmpresa] = useState("");
  const [empresasFiltradas, setEmpresasFiltradas] = useState([]);
  const [empresasSelecionadas, setEmpresasSelecionadas] = useState([]);
  const [cnpjInput, setCnpjInput] = useState("");
  const [cnpjsSelecionados, setCnpjsSelecionados] = useState([]);
  const [tela, setTela] = useState("filtro"); // "filtro" | "tabela" | "detalhes"
  const [processos, setProcessos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [processoSelecionado, setProcessoSelecionado] = useState(null);

  const navigate = useNavigate();

  // Buscar empresas na API
  useEffect(() => {
    fetch("https://medicine-consumer.onrender.com/getEmpresas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && typeof data[0] === "object" && data[0] !== null) {
          setEmpresas(data.map(e => e.nome || e.NOME || ""));
        } else {
          setEmpresas(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Filtrar empresas enquanto digita
  useEffect(() => {
    if (buscaEmpresa.length === 0) {
      setEmpresasFiltradas([]);
    } else {
      const filtradas = empresas.filter((empresa) =>
        empresa.toLowerCase().includes(buscaEmpresa.toLowerCase())
      );
      setEmpresasFiltradas(filtradas);
    }
  }, [buscaEmpresa, empresas]);

  // Adicionar Empresa
  const handleAddEmpresa = (nome) => {
    if (
      nome.trim() !== "" &&
      !empresasSelecionadas.includes(nome) &&
      empresas.includes(nome)
    ) {
      setEmpresasSelecionadas((prev) => [...prev, nome]);
    }
    setBuscaEmpresa("");
    setEmpresasFiltradas([]);
  };

  // Remover Empresa
  const handleRemoveEmpresa = (nome) => {
    setEmpresasSelecionadas((prev) => prev.filter((e) => e !== nome));
  };

  // Adicionar CNPJ
  const handleAddCnpj = () => {
    const regexCnpj = /^\d{14}$/;
    if (!regexCnpj.test(cnpjInput)) {
      alert("CNPJ inválido. Digite apenas números, totalizando 14 dígitos.");
      return;
    }
    if (!cnpjsSelecionados.includes(cnpjInput)) {
      setCnpjsSelecionados((prev) => [...prev, cnpjInput]);
    }
    setCnpjInput("");
  };

  // Remover CNPJ
  const handleRemoveCnpj = (cnpj) => {
    setCnpjsSelecionados((prev) => prev.filter((c) => String(c) !== String(cnpj)));
  };

  // Consultar e mostrar tabela
  const handleConsultar = async () => {
    if (empresasSelecionadas.length === 0 && cnpjsSelecionados.length === 0) {
      alert("Selecione ao menos uma empresa ou insira um CNPJ para consultar.");
      return;
    }
    setCarregando(true);
    let resultados = [];
    // Buscar por CNPJ
    for (const cnpj of cnpjsSelecionados) {
      try {
        const res = await fetch(`https://medicine-consumer.onrender.com/empresa/${cnpj}/processos`);
        const data = await res.json();
        data.forEach(d => {
          d.empresa_nome = "-"; // Não temos o nome da empresa pelo CNPJ
        });
        resultados = resultados.concat(data);
      } catch (e) {}
    }
    // Buscar por nome da empresa
    for (const nome of empresasSelecionadas) {
      try {
        const res = await fetch(`https://medicine-consumer.onrender.com/empresa/${encodeURIComponent(nome)}/processosPorNome`);
        const data = await res.json();
        data.forEach(d => d.empresa_nome = nome);
        resultados = resultados.concat(data);
      } catch (e) {}
    }
    setProcessos(resultados);
    setCarregando(false);
    setTela("tabela");
  };

  // Quando clicar em uma linha da tabela
  const handleDetalhes = (proc) => {
    setProcessoSelecionado(proc);
    setTela("detalhes");
  };

  // Voltar para tela de filtro
  const handleVoltar = () => {
    if (tela === "detalhes") {
      setTela("tabela");
      setProcessoSelecionado(null);
    } else {
      setTela("filtro");
      setProcessos([]);
    }
  };

  if (tela === "detalhes" && processoSelecionado) {
    return (
      <DetalhesProcesso processo={processoSelecionado} onVoltar={handleVoltar} />
    );
  }

  if (tela === "tabela") {
    return carregando ? (
      <div className="flex justify-center items-center h-96"><Spinner color="blue" /></div>
    ) : (
      <TabelaProcessos processos={processos} onVoltar={handleVoltar} onDetalhes={handleDetalhes} />
    );
  }

  // Tela de filtro (original)
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Consulta de Processos - Empresas e CNPJ
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col gap-6">
            {/* Filtro por Empresa */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Filtrar por Empresa
              </Typography>
              <div className="flex gap-2 relative">
                <div className="relative w-full">
                  <Input
                    label="Digite o nome da empresa"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    value={buscaEmpresa}
                    onChange={(e) => setBuscaEmpresa(e.target.value)}
                  />
                  {empresasFiltradas.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                      {empresasFiltradas.map((empresa, index) => (
                        <div
                          key={index}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                          onClick={() => handleAddEmpresa(empresa)}
                        >
                          {empresa}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleAddEmpresa(buscaEmpresa)}
                  color="blue"
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {empresasSelecionadas.map((nome) => (
                  <Chip
                    key={nome}
                    value={nome}
                    onClose={() => handleRemoveEmpresa(nome)}
                    className="bg-blue-100 text-blue-800"
                  />
                ))}
              </div>
            </div>

            {/* Filtro por CNPJ */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Filtrar por CNPJ
              </Typography>
              <div className="flex gap-2">
                <Input
                  label="Digite o CNPJ (somente números)"
                  value={cnpjInput}
                  onChange={(e) => setCnpjInput(e.target.value)}
                />
                <Button onClick={handleAddCnpj} color="blue">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {cnpjsSelecionados.map((cnpj) => (
                  <Chip
                    key={cnpj}
                    value={cnpj}
                    onClose={() => handleRemoveCnpj(cnpj)}
                    className="bg-green-100 text-green-800"
                  />
                ))}
              </div>
            </div>

            {/* Botão Consultar */}
            <div className="flex justify-end">
              <Button
                onClick={handleConsultar}
                color="green"
                className="flex items-center gap-2"
              >
                Consultar
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}