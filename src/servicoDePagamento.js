export default class ServicoDePagamento {
  #pagamento;

  constructor() {
    this.#pagamento = [];
  }

  pagar(codigoDeBarras, empresa, valor, categoria = "Padrão") {
    const apenasNumeros = /^\d+$/.test(codigoDeBarras);
    if (
      codigoDeBarras.length < 13 ||
      !codigoDeBarras ||
      codigoDeBarras.length > 13
    ) {
      throw new Error("O código de barras precisa ter 13 caracteres");
    } else if (apenasNumeros === false) {
      throw new Error("Código de barras inválido");
    }

    if (!empresa) {
      throw new Error("Preencha o nome da empresa");
    }
    if (valor === undefined || valor === null) {
      throw new Error("Preencha o valor do boleto");
    }

    if (valor > 100) {
      this.#pagamento.push({
        codBarras: codigoDeBarras,
        nomeEmpresa: empresa,
        valorBoleto: valor,
        categoria: "Cara",
      });
    } else {
      this.#pagamento.push({
        codBarras: codigoDeBarras,
        nomeEmpresa: empresa,
        valorBoleto: valor,
        categoria: categoria,
      });
    }

    return "Pagamento realizado com sucesso";
  }

  consultaUltimoPagamento() {
    return this.#pagamento.at(-1);
  }
};
