const mapExporter = ({ pessoa }) => {
  const pessoaOmie = {
    cnpj_cpf: pessoa?.documento,
    codigo_pais: pessoa?.endereco?.pais?.codigo,
    razao_social: pessoa?.nome,
    importado_api: "S",
    codigo_cliente_omie: pessoa?.codigo_cliente_omie,
    nome_fantasia: pessoa?.pessoaJuridica?.nomeFantasia,
  };

  if (pessoa?.tipo === "ext") {
    pessoaOmie.estado = "EX";
    pessoaOmie.cidade = "EX";
    pessoaOmie.exterior = "S";
    pessoaOmie.nif = documento;
  }

  const caracteristicas = {
    rg: pessoa?.pessoaFisica?.rg,
    apelido: pessoa?.pessoaFisica?.apelido,
    dataNascimento: pessoa?.pessoaFisica?.dataNascimento,
    grupo: pessoa?.grupo,
    regimeTributario: pessoa?.pessoaJuridica?.regimeTributario,
  };

  return { pessoa: pessoaOmie, caracteristicas };
};

module.exports = {
  mapExporter,
};
