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

// Utilitário para valores seguros
function safeValue(val) {
  if (val === undefined || val === null) return "-";
  if (typeof val === "string" && val.trim() === "") return "-";
  return val;
}

function TabelaProcessos({ processos, onVoltar, onDetalhes }) {
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
      `"${safeValue(proc.nome_comercial)}"`,
      `"${safeValue(proc.empresa_nome)}"`,
      `"${safeValue(proc.empresa_cnpj)}"`,
      `"${safeValue(proc.principio_ativo)}"`,
      `"${safeValue(proc.n_processo)}"`,
      `"${safeValue(proc.data_expiracao)}"`
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
                    <td className="p-2 border-b">{safeValue(proc.nome_comercial)}</td>
                    <td className="p-2 border-b">{safeValue(proc.empresa_nome)}</td>
                    <td className="p-2 border-b">{safeValue(proc.empresa_cnpj)}</td>
                    <td className="p-2 border-b">{safeValue(proc.principio_ativo)}</td>
                    <td className="p-2 border-b">{safeValue(proc.n_processo)}</td>
                    <td className="p-2 border-b">{safeValue(proc.data_expiracao)}</td>
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
      "Número do Registro",
      "Validade",
      "Apresentação do Produto"
    ];
    const rows = apresentacoes.map(apres => [
      safeValue(processo.nome_comercial),
      safeValue(processo.principio_ativo),
      safeValue(processo.empresa_nome),
      safeValue(processo.empresa_cnpj),
      safeValue(processo.n_processo),
      processo.e_generico ? "Sim" : "Não",
      safeValue(processo.data_expiracao),
      safeValue(apres.n_registro),
      safeValue(apres.validade),
      safeValue(apres.apresentacao)
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
          ) : (
            <>
              {/* Tabela 1: Dados principais do processo/produto */}
              <div className="overflow-x-auto mb-8">
                <table className="min-w-max text-left border">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Empresa</th>
                      <th className="p-2 border-b">CNPJ</th>
                      <th className="p-2 border-b">Nome do Produto</th>
                      <th className="p-2 border-b">Número do Processo</th>
                      <th className="p-2 border-b">Princípio Ativo</th>
                      <th className="p-2 border-b">Genérico</th>
                      <th className="p-2 border-b">Expiração</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b">{safeValue(processo.empresa_nome)}</td>
                      <td className="p-2 border-b">{safeValue(processo.empresa_cnpj)}</td>
                      <td className="p-2 border-b">{safeValue(processo.nome_comercial)}</td>
                      <td className="p-2 border-b">{safeValue(processo.n_processo)}</td>
                      <td className="p-2 border-b">{safeValue(processo.principio_ativo)}</td>
                      <td className="p-2 border-b">{processo.e_generico ? "Sim" : "Não"}</td>
                      <td className="p-2 border-b">{safeValue(processo.data_expiracao)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Tabela 2: Apresentações */}
              <div className="overflow-x-auto">
                <table className="min-w-max text-left border">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Número do Registro</th>
                      <th className="p-2 border-b">Validade</th>
                      <th className="p-2 border-b">Apresentação do produto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apresentacoes.length > 0 ? (
                      apresentacoes.map((apres, idx) => (
                        <tr key={apres.id || idx}>
                          <td className="p-2 border-b">{safeValue(apres.n_registro)}</td>
                          <td className="p-2 border-b">{safeValue(apres.validade)}</td>
                          <td className="p-2 border-b">{safeValue(apres.apresentacao)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-2 border-b text-center text-gray-500">
                          Não há apresentações cadastradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
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
  const [principiosAtivos, setPrincipiosAtivos] = useState([]);
  const [buscaPrincipio, setBuscaPrincipio] = useState("");
  const [principiosFiltrados, setPrincipiosFiltrados] = useState([]);
  const [principiosSelecionados, setPrincipiosSelecionados] = useState([]);
  const [tela, setTela] = useState("filtro");
  const [processos, setProcessos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [processoSelecionado, setProcessoSelecionado] = useState(null);

  const navigate = useNavigate();

  // Carrega empresas
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

  // Carrega princípios ativos
  useEffect(() => {
    fetch("https://medicine-consumer.onrender.com/getPrincipioAtivo")
      .then(res => res.json())
      .then(data => setPrincipiosAtivos(data.filter(p => p && p.trim() !== "")))
      .catch(() => setPrincipiosAtivos([]));
  }, []);

  // Filtro autocomplete empresas
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

  // Filtro autocomplete princípios ativos
  useEffect(() => {
    if (buscaPrincipio.length === 0) {
      setPrincipiosFiltrados([]);
    } else {
      const filtrados = principiosAtivos.filter((p) =>
        p.toLowerCase().includes(buscaPrincipio.toLowerCase())
      );
      setPrincipiosFiltrados(filtrados);
    }
  }, [buscaPrincipio, principiosAtivos]);

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

  const handleRemoveEmpresa = (nome) => {
    setEmpresasSelecionadas((prev) => prev.filter((e) => e !== nome));
  };

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

  const handleRemoveCnpj = (cnpj) => {
    setCnpjsSelecionados((prev) => prev.filter((c) => String(c) !== String(cnpj)));
  };

  const handleAddPrincipio = (nome) => {
    if (
      nome.trim() !== "" &&
      principiosAtivos.includes(nome) &&
      !principiosSelecionados.includes(nome)
    ) {
      setPrincipiosSelecionados((prev) => [...prev, nome]);
    }
    setBuscaPrincipio("");
    setPrincipiosFiltrados([]);
  };

  const handleRemovePrincipio = (nome) => {
    setPrincipiosSelecionados((prev) => prev.filter((p) => p !== nome));
  };

  const handleConsultar = async () => {
    // Prioridade: princípio ativo > empresa/cnpj
    if (
      principiosSelecionados.length === 0 &&
      empresasSelecionadas.length === 0 &&
      cnpjsSelecionados.length === 0
    ) {
      alert("Selecione ao menos uma empresa, CNPJ ou princípio ativo para consultar.");
      return;
    }
    setCarregando(true);

    // Consulta por princípios ativos (pode ser múltiplo)
    if (principiosSelecionados.length > 0) {
      try {
        let todosProcessos = [];
        for (const principio of principiosSelecionados) {
          const res = await fetch(
            `https://medicine-consumer.onrender.com/getProcessosPorPrincipioAtivo/${encodeURIComponent(principio)}`
          );
          const data = await res.json();
          // Buscar nome da empresa pelo CNPJ
          for (const proc of data) {
            let nomeEmpresa = "-";
            try {
              const empresaRes = await fetch(`https://medicine-consumer.onrender.com/empresa/${proc.empresa_cnpj}`);
              const empresaData = await empresaRes.json();
              if (Array.isArray(empresaData) && empresaData.length > 0 && empresaData[0].nome) {
                nomeEmpresa = empresaData[0].nome;
              }
            } catch (e) {}
            proc.empresa_nome = nomeEmpresa;
          }
          todosProcessos = todosProcessos.concat(data);
        }
        setProcessos(todosProcessos);
        setCarregando(false);
        setTela("tabela");
        return;
      } catch (e) {
        setCarregando(false);
        alert("Erro ao buscar processos por princípio ativo.");
        return;
      }
    }

    // Consulta por CNPJ e Empresa
    let resultados = [];
    for (const cnpj of cnpjsSelecionados) {
      try {
        const res = await fetch(`https://medicine-consumer.onrender.com/empresa/${cnpj}/processos`);
        const data = await res.json();

        // Buscar nome da empresa pelo CNPJ
        let nomeEmpresa = "-";
        try {
          const empresaRes = await fetch(`https://medicine-consumer.onrender.com/empresa/${cnpj}`);
          const empresaData = await empresaRes.json();
          if (Array.isArray(empresaData) && empresaData.length > 0 && empresaData[0].nome) {
            nomeEmpresa = empresaData[0].nome;
          }
        } catch (e) {}

        data.forEach(d => {
          d.empresa_nome = nomeEmpresa;
        });
        resultados = resultados.concat(data);
      } catch (e) {}
    }

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

  const handleDetalhes = (proc) => {
    setProcessoSelecionado(proc);
    setTela("detalhes");
  };

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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Consulta de Processos - Empresas, CNPJ e Princípio Ativo
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

            {/* Filtro por Princípio Ativo */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Filtrar por Princípio Ativo
              </Typography>
              <div className="flex gap-2 relative">
                <div className="relative w-full">
                  <Input
                    label="Digite o princípio ativo"
                    value={buscaPrincipio}
                    onChange={(e) => setBuscaPrincipio(e.target.value)}
                  />
                  {principiosFiltrados.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                      {principiosFiltrados.map((p, idx) => (
                        <div
                          key={idx}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                          onClick={() => handleAddPrincipio(p)}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleAddPrincipio(buscaPrincipio)}
                  color="blue"
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {principiosSelecionados.map((nome) => (
                  <Chip
                    key={nome}
                    value={nome}
                    onClose={() => handleRemovePrincipio(nome)}
                    className="bg-purple-100 text-purple-800"
                  />
                ))}
              </div>
            </div>

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