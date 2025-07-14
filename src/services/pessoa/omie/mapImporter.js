const { LISTA_PAISES_OMIE } = require("../../../constants/omie/paises");
const Pessoa = require("../../../models/Pessoa");

const mapImporter = ({ event, caracteristicas }) => {
  const pais = LISTA_PAISES_OMIE.find((e) => e.cCodigo === event?.codigo_pais);
  // const rg = caracteristicas?.find((e) => {});

  console.log("Caracteristicas", caracteristicas);

  const pessoa = {
    codigo_cliente_omie: event.codigo_cliente_omie,
    documento: event.cnpj_cpf,
    // grupo: , // caracteristicas.grupo
    nome: event.razao_social,
    pessoaFisica: {
      // rg: , // caracteristicas
      // apelido //caracteristicas
      // dataNascimento: // caracteristicas
    },
    pessoaJuridica: {
      nomeFantasia: event.nome_fantasia,
      // regimeTributario: ,
    },
    endereco: {
      pais: {
        codigo: pais?.cCodigo,
        nome: pais?.cDescricao,
        sigla: pais?.cCodigoISO,
      },
    },
  };

  return pessoa;
};

module.exports = {
  mapImporter,
};
