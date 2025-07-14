const ClienteService = require("../../omie/clienteService");
const BaseOmie = require("../../../models/BaseOmie");
const GenericError = require("../../errors/generic");
const { mapImporter } = require("./mapImporter");
const { mapExporter } = require("./mapExporter");
const Pessoa = require("../../../models/Pessoa");

const importarDoOmie = async ({ event }) => {
  console.log("RUNNING");

  const baseOmie = await BaseOmie.findOne({
    status: "ativo",
  });

  if (!baseOmie) throw new GenericError("Base omie não encontrada", 404);

  const caracteristicas = await ClienteService.consultarCaracteristicas({
    appKey: baseOmie.appKey,
    appSecret: baseOmie.appSecret,
    codigo_cliente_omie: event?.codigo_cliente_omie,
  });

  const pessoaObj = mapImporter({
    event,
    caracteristicas,
  });

  const pessoa = await Pessoa.findOneAndUpdate(
    {
      $and: [
        {
          $or: [
            { codigo_cliente_omie: pessoaObj?.codigo_cliente_omie },
            { documento: pessoaObj?.documento },
          ],
          status: { $nin: ["arquivado" || "inativo"] },
        },
      ],
    },
    pessoaObj,
    { new: true }
  );

  await pessoa.save();
};

const exportarParaOmie = async ({ pessoa }) => {
  // if (!pessoa.documento) return;

  const baseOmie = await BaseOmie.findOne({
    status: "ativo",
  });

  const { pessoa: pessoaObj, caracteristicas: caracteristicasObj } =
    mapExporter({
      pessoa,
    });

  let pessoaOmie;

  if (pessoa?.codigo_cliente_omie) {
    pessoaOmie = await ClienteService.pesquisarCodIntegracao(
      baseOmie.appKey,
      baseOmie.appSecret,
      pessoa?.codigo_cliente_omie
    );
  }

  if (!pessoaOmie) {
    pessoaOmie = await ClienteService.pesquisarPorCNPJ(
      baseOmie.appKey,
      baseOmie.appSecret,
      pessoa.documento
    );
  }

  if (!pessoaOmie) {
    const fornecedorCadastrado = await ClienteService.incluir(
      baseOmie.appKey,
      baseOmie.appSecret,
      { codigo_cliente_integracao: pessoa._id, ...pessoaObj }
    );

    pessoa.codigo_cliente_omie = fornecedorCadastrado.codigo_cliente_omie;
  }

  if (pessoaOmie) {
    const fornecedorCadastrado = await ClienteService.update(
      baseOmie.appKey,
      baseOmie.appSecret,
      pessoaObj
    );

    pessoa.codigo_cliente_omie = fornecedorCadastrado.codigo_cliente_omie;
  }

  for (const [key, value] of Object.entries(caracteristicasObj)) {
    if (!value) continue;
    const caracteristicas = await ClienteService.alterarCaracteristicas({
      appKey: baseOmie.appKey,
      appSecret: baseOmie.appSecret,
      campo: key,
      codigo_cliente_omie: pessoa.codigo_cliente_omie,
      conteudo: value,
    });
  }

  // const caracteristicasPromises = Object.entries(caracteristicasObj)
  //   .filter(([, value]) => value)
  //   .map(([key, value]) =>
  //     ClienteService.alterarCaracteristicas({
  //       appKey: baseOmie.appKey,
  //       appSecret: baseOmie.appSecret,
  //       campo: key,
  //       codigo_cliente_omie: pessoa.codigo_cliente_omie,
  //       conteudo: value,
  //     })
  //   );

  // const resultados = await Promise.all(caracteristicasPromises);
  // console.log("caracteristicas:", resultados);
};

module.exports = { importarDoOmie, exportarParaOmie };
