const mapImporter = async ({ row }) => {
  const pessoa = {
    tipoServicoTomado: row[0],
    descricao: row[1],
    valor: row[2],
    dataContratacao: row[3],
    dataConclusao: row[4],
  };

  return pessoa;
};

module.exports = { mapImporter };
