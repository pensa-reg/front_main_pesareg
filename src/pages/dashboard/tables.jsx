import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Select,
  Option,
  Button,
  IconButton,
} from "@material-tailwind/react";
import Papa from "papaparse";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export function Tables() {
  const [activeTab, setActiveTab] = useState("medicamentos");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Filtros temporários (antes de aplicar)
  const [tempSearchEmpresa, setTempSearchEmpresa] = useState("");
  const [tempSearchMedicamento, setTempSearchMedicamento] = useState("");
  const [tempSearchCategoria, setTempSearchCategoria] = useState("");
  const [tempSearchProcesso, setTempSearchProcesso] = useState("");

  // Filtros aplicados
  const [searchEmpresa, setSearchEmpresa] = useState("");
  const [searchMedicamento, setSearchMedicamento] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [searchProcesso, setSearchProcesso] = useState("");

  // Lista de categorias únicas para filtros
  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    // Carregar o CSV quando o componente montar
    fetch("/dataframe.csv")
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            complete: (results) => {
              setData(results.data);

              // Extrair categorias e empresas únicas para os filtros
              const uniqueCategorias = [...new Set(results.data.map(item => item.Categoria_regulatória))].filter(Boolean);
              const uniqueEmpresas = [...new Set(results.data.map(item => item.Empresa))].filter(Boolean);

              setCategorias(uniqueCategorias);
              setEmpresas(uniqueEmpresas);

              // Aplicar a remoção de duplicatas antes de definir os dados filtrados iniciais
              const medicamentosUnicos = removeDuplicatedMedicamentos(results.data);
              setFilteredData(medicamentosUnicos);
              setLoading(false);
            },
            error: (error) => {
              console.error("Erro ao analisar o CSV:", error);
              setLoading(false);
            }
          });
        })
        .catch((error) => {
          console.error("Erro ao carregar o arquivo CSV:", error);
          setLoading(false);
        });
  }, []);

  // Função otimizada para remover entradas duplicadas
  const removeDuplicatedMedicamentos = (medicamentos) => {
    // Usar um Set para rastrear chaves únicas
    const seen = new Set();

    // Filtrar apenas itens únicos com base em uma chave composta
    return medicamentos.filter(item => {
      // Criar uma chave única que considera todos os campos relevantes
      const key = `${item["Princípio_ativo"] || ""}|${item["Nome_do_produto"] || ""}|${item.Categoria_regulatória || ""}`;

      // Se a chave já foi vista, filtrar este item
      if (seen.has(key)) {
        return false;
      }

      // Caso contrário, adicionar à lista de chaves vistas e manter o item
      seen.add(key);
      return true;
    });
  };

  // Aplicar filtros com base na aba ativa
  useEffect(() => {
    if (data.length === 0) return;

    let filtered = [...data];

    // Filtros específicos para cada aba
    if (activeTab === "empresas" && searchEmpresa) {
      filtered = filtered.filter(item =>
          item.Empresa && item.Empresa.toLowerCase().includes(searchEmpresa.toLowerCase())
      );
    }

    if (activeTab === "medicamentos") {
      if (searchMedicamento) {
        filtered = filtered.filter(item =>
            (item["Princípio_ativo"] && item["Princípio_ativo"].toLowerCase().includes(searchMedicamento.toLowerCase())) ||
            (item["Nome_do_produto"] && item["Nome_do_produto"].toLowerCase().includes(searchMedicamento.toLowerCase()))
        );
      }

      if (searchCategoria && searchCategoria !== "todos") {
        filtered = filtered.filter(item => item.Categoria_regulatória === searchCategoria);
      }

      // Remover duplicatas para a aba de medicamentos
      filtered = removeDuplicatedMedicamentos(filtered);
    }

    if (activeTab === "processos" && searchProcesso) {
      filtered = filtered.filter(item => {
        // Verificar múltiplos formatos possíveis do número do processo
        return (
            (item["Numero_do_processo"] && item["Numero_do_processo"].includes(searchProcesso)) ||
            (item["Numero Processo"] && item["Numero Processo"].includes(searchProcesso))
        );
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  }, [activeTab, data, searchEmpresa, searchMedicamento, searchCategoria, searchProcesso]);

  const applyFilters = () => {
    // Transferir valores dos filtros temporários para os aplicados
    setSearchEmpresa(tempSearchEmpresa);
    setSearchMedicamento(tempSearchMedicamento);
    setSearchCategoria(tempSearchCategoria);
    setSearchProcesso(tempSearchProcesso);
  };

  const resetFilters = () => {
    // Limpar todos os filtros
    setSearchEmpresa("");
    setSearchMedicamento("");
    setSearchCategoria("");
    setSearchProcesso("");
    setTempSearchEmpresa("");
    setTempSearchMedicamento("");
    setTempSearchCategoria("");
    setTempSearchProcesso("");

    // Redefinir dados filtrados e página
    const filteredByTab = activeTab === "medicamentos" ? removeDuplicatedMedicamentos(data) : data;
    setFilteredData(filteredByTab);
    setCurrentPage(1);
  };

  // Calculando índices para paginação
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Navegação de páginas
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para exportar os dados para CSV
  const exportToCsv = () => {
    let dataToExport = [];
    let headers = [];
    let filename = "dados_";

    // Definir o cabeçalho e os dados com base na aba ativa
    if (activeTab === "medicamentos") {
      headers = ["Princípio Ativo", "Nome Comercial", "Categoria", "Empresa", "Apresentação"];
      dataToExport = filteredData.map(item => ({
        "Princípio Ativo": item["Princípio_ativo"] || "",
        "Nome Comercial": item["Nome_do_produto"] || "",
        "Categoria": item.Categoria_regulatória || "",
        "Empresa": item.Empresa || "",
        "Apresentação": item.Apresentacao || ""
      }));
      filename += "medicamentos";
    }
    else if (activeTab === "empresas") {
      headers = ["Empresa", "CNPJ", "Total de Medicamentos"];

      // Processar dados para a aba empresas (agrupar por empresa)
      const empresasAgrupadas = Array.from(new Set(filteredData.map(item => item.Empresa)))
          .filter(Boolean)
          .map(empresa => {
            const empresaItems = filteredData.filter(item => item.Empresa === empresa);
            const cnpj = empresaItems[0]?.CNPJ || "";
            return {
              "Empresa": empresa,
              "CNPJ": cnpj,
              "Total de Medicamentos": empresaItems.length.toString()
            };
          });

      dataToExport = empresasAgrupadas;
      filename += "empresas";
    }
    else if (activeTab === "processos") {
      headers = ["Número Processo", "Data", "Situação", "Tipo", "Expediente"];
      dataToExport = filteredData.map(item => ({
        "Número Processo": item["Numero_do_processo"] || item["Numero Processo"] || "",
        "Data": item.Data || "",
        "Situação": item.Situacao || "",
        "Tipo": item.Tipo_de_peticao || item.Tipo || "",
        "Expediente": item.Expediente || ""
      }));
      filename += "processos";
    }

    filename += "_" + new Date().toISOString().slice(0, 10) + ".csv";

    // Converter para CSV
    const csv = Papa.unparse({
      fields: headers,
      data: dataToExport
    });

    // Criar um blob e link para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
          <Typography variant="h5" color="blue-gray">
            Carregando dados...
          </Typography>
        </div>
    );
  }

  return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Base de Dados de Medicamentos ANVISA
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
              <TabsHeader className="bg-transparent">
                <Tab value="medicamentos">Medicamentos</Tab>
                <Tab value="empresas">Empresas</Tab>
                <Tab value="processos">Processos</Tab>
              </TabsHeader>

              <TabsBody>
                {/* Aba de Medicamentos */}
                <TabPanel value="medicamentos">
                  <div className="mb-6 flex flex-col md:flex-row gap-4 p-4">
                    <div className="w-full md:w-1/3">
                      <Input
                          label="Buscar por princípio ativo ou nome comercial"
                          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                          value={tempSearchMedicamento}
                          onChange={(e) => setTempSearchMedicamento(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-1/3">
                      <Select
                          label="Filtrar por categoria"
                          value={tempSearchCategoria}
                          onChange={(value) => setTempSearchCategoria(value)}
                      >
                        <Option value="todos">Todas as categorias</Option>
                        {categorias.map((cat, index) => (
                            <Option key={index} value={cat}>{cat}</Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={applyFilters} color="blue">
                        Aplicar Filtro
                      </Button>
                      <Button onClick={resetFilters} color="blue" variant="text">
                        Limpar Filtros
                      </Button>
                      <Button onClick={exportToCsv} color="green">
                        Exportar CSV
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] table-auto">
                      <thead>
                      <tr>
                        {["Princípio Ativo", "Nome Comercial", "Categoria", "Empresa", "Apresentação"].map((el) => (
                            <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                              <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                {el}
                              </Typography>
                            </th>
                        ))}
                      </tr>
                      </thead>
                      <tbody>
                      {paginatedData.map((item, index) => (
                          <tr key={index}>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item["Princípio_ativo"] || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item["Nome_do_produto"] || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item.Categoria_regulatória || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item.Empresa || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item.Apresentacao || "-"}
                              </Typography>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                    <div className="p-4 flex justify-between items-center">
                      <Typography variant="small" color="blue-gray">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
                      </Typography>
                      <div className="flex gap-2">
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                        </IconButton>
                        <Typography variant="small" className="flex items-center px-2">
                          Página {currentPage} de {totalPages || 1}
                        </Typography>
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                          <ArrowRightIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* Aba de Empresas */}
                <TabPanel value="empresas">
                  <div className="mb-6 flex flex-col md:flex-row gap-4 p-4">
                    <div className="w-full md:w-1/2">
                      <Input
                          label="Buscar por nome da empresa"
                          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                          value={tempSearchEmpresa}
                          onChange={(e) => setTempSearchEmpresa(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={applyFilters} color="blue">
                        Aplicar Filtro
                      </Button>
                      <Button onClick={resetFilters} color="blue" variant="text">
                        Limpar Filtros
                      </Button>
                      <Button onClick={exportToCsv} color="green">
                        Exportar CSV
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] table-auto">
                      <thead>
                      <tr>
                        {["Empresa", "CNPJ", "Total de Medicamentos"].map((el) => (
                            <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                              <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                {el}
                              </Typography>
                            </th>
                        ))}
                      </tr>
                      </thead>
                      <tbody>
                      {/* Agrupar dados por empresa */}
                      {Array.from(new Set(filteredData.map(item => item.Empresa)))
                          .filter(Boolean)
                          .slice(startIndex, endIndex)
                          .map((empresa, index) => {
                            const empresaItems = filteredData.filter(item => item.Empresa === empresa);
                            const cnpj = empresaItems[0]?.CNPJ || "-";
                            return (
                                <tr key={index}>
                                  <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                      {empresa}
                                    </Typography>
                                  </td>
                                  <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                      {cnpj}
                                    </Typography>
                                  </td>
                                  <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                      {empresaItems.length}
                                    </Typography>
                                  </td>
                                </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    <div className="p-4 flex justify-between items-center">
                      <Typography variant="small" color="blue-gray">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
                      </Typography>
                      <div className="flex gap-2">
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                        </IconButton>
                        <Typography variant="small" className="flex items-center px-2">
                          Página {currentPage} de {totalPages || 1}
                        </Typography>
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                          <ArrowRightIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* Aba de Processos */}
                <TabPanel value="processos">
                  <div className="mb-6 flex flex-col md:flex-row gap-4 p-4">
                    <div className="w-full md:w-1/2">
                      <Input
                          label="Buscar por número de processo"
                          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                          value={tempSearchProcesso}
                          onChange={(e) => setTempSearchProcesso(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={applyFilters} color="blue">
                        Aplicar Filtro
                      </Button>
                      <Button onClick={resetFilters} color="blue" variant="text">
                        Limpar Filtros
                      </Button>
                      <Button onClick={exportToCsv} color="green">
                        Exportar CSV
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] table-auto">
                      <thead>
                      <tr>
                        {["Número Processo", "Data", "Situação", "Tipo", "Expediente"].map((el) => (
                            <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                              <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                {el}
                              </Typography>
                            </th>
                        ))}
                      </tr>
                      </thead>
                      <tbody>
                      {paginatedData.map((item, index) => (
                          <tr key={index}>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item["Numero_do_processo"] || item["Numero Processo"] || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item.Data || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item.Situacao || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item.Tipo_de_peticao || item.Tipo || "-"}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {item.Expediente || "-"}
                              </Typography>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                    <div className="p-4 flex justify-between items-center">
                      <Typography variant="small" color="blue-gray">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
                      </Typography>
                      <div className="flex gap-2">
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                        </IconButton>
                        <Typography variant="small" className="flex items-center px-2">
                          Página {currentPage} de {totalPages || 1}
                        </Typography>
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                          <ArrowRightIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>
      </div>
  );
}

export default Tables;