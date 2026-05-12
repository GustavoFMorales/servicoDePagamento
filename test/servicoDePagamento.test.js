import ServicoDePagamento from "../src/servicoDePagamento.js";
import assert from "node:assert";

describe("Classe Serviçoo de Pagamento", () => {
  let servicoDePagamento;
  beforeEach(() => {
    servicoDePagamento = new ServicoDePagamento();
  });
  describe("Código de barras", () => {
    it("Deve validar se a mensagem de erro é exibida quando o código de barras possuir menos de 13 caracteres.", () => {
      assert.throws(
        () => {
          servicoDePagamento.pagar("1234566", "PGATS", 99.99);
        },
        {
          message: "O código de barras precisa ter 13 caracteres",
        },
      );
    });
    it("Deve validar se a mensagem de erro é exibida quando o código de barras possuir mais de 13 caracteres.", () => {
      assert.throws(
        () => {
          servicoDePagamento.pagar(
            "12345678910111213",
            "PGATS",
            99.99,
          );
        },
        {
          message: "O código de barras precisa ter 13 caracteres",
        },
      );
    });
    it("Deve validar se a mensagem é exibida com o código de barras possui letras ao invés de números apenas", () => {
      assert.throws(
        () => {
          servicoDePagamento.pagar("1A23456789123", "PGATS", 99.99);
        },
        {
          message: "Código de barras inválido",
        },
      );
    });
  });
  describe("Nome Empresa", () => {
    it("Deve validar se a mensagem de erro é apresentada quando o nome da empresa não for preenchido.", () => {
      assert.throws(
        () => {
          servicoDePagamento.pagar("1223456789123", "", 99.99);
        },
        {
          message: "Preencha o nome da empresa",
        },
      );
    });
  });
  describe("Valor do boleto", () => {
    it("Deve validar se a mensagem de erro está sendo apresentada quando o valor do boleto não for preenchido", () => {
      assert.throws(
        () => {
          servicoDePagamento.pagar("1223456789123", "teste");
        },
        {
          message: "Preencha o valor do boleto",
        },
      );
    });
  });
  describe("Pagamento com sucesso", () => {
    it("Deve validar se a mensagem de sucesso está sendo apresentada quando os dados forem preenchidos corretamente.", () => {
      const pagamento = servicoDePagamento.pagar(
        "1223456789123",
        "PGATS",
        99.0,
      );

      assert.equal(pagamento, "Pagamento realizado com sucesso");
    });
    it("Deve validar se a categoria está sendo preenchida como Padrão quando o valor for de até 100 reais.", () => {
      const pagamento = servicoDePagamento.pagar(
        "1223456789123",
        "PGATS",
        99.0,
      );

      const consulta = servicoDePagamento.consultaUltimoPagamento();

      assert.equal(consulta.categoria, "Padrão");
    });
    it("Deve validar se a categoria está sendo preenchida como Cara quando o valor for de até 100 reais.", () => {
      const pagamento = servicoDePagamento.pagar(
        "1223456789123",
        "PGATS",
        100.01,
      );

      const consulta = servicoDePagamento.consultaUltimoPagamento();

      assert.equal(consulta.categoria, "Cara");
    });
    it('Deve validar o retorno das informações do ultimo elemento da lista', () => {
        const pagamento = servicoDePagamento.pagar(
        "7891234567890",
        "PGATS Julio",
        100.01,
      );

      const consulta = servicoDePagamento.consultaUltimoPagamento();

      assert.equal(consulta.codigoBarras,"7891234567890");
      assert.equal(consulta.empresa, "PGATS Julio");
      assert.equal(consulta.valor, 100.01);
      assert.equal(consulta.categoria, "Cara");
    })
  });
});
