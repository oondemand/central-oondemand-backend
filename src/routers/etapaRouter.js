const express = require("express");
const router = express.Router();
const EtapaController = require("../controllers/etapa");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { asyncHandler } = require("../utils/helpers");

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.CONFIGURACAO_ETAPA,
  }),
  asyncHandler(EtapaController.criarEtapa)
);
router.get("/ativas", asyncHandler(EtapaController.listarEtapasAtivas));
router.get("/", asyncHandler(EtapaController.listarEtapas));
// router.get("/:id", EtapaController.obterEtapa);

// router.put(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.CONFIGURACAO_ETAPA,
//   }),
//   EtapaController.atualizarEtapa
// );

// router.delete(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.EXCLUIDO,
//     entidade: ENTIDADES.CONFIGURACAO_ETAPA,
//   }),
//   EtapaController.excluirEtapa
// );

module.exports = router;
