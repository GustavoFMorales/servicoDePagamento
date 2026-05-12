# Serviço de Pagamento

Projeto desenvolvido durante a Pós-graduação em Automação de Testes de Software, com o objetivo de praticar testes automatizados em JavaScript utilizando **Mocha** e **Node.js assert**.

## Tecnologias

- Node.js
- Mocha
- Mochawesome (reporter HTML)

## Estrutura do projeto

```
servicoDePagamento/
├── src/
│   └── servicoDePagamento.js   # Classe principal
├── test/
│   └── servicoDePagamento.test.js  # Testes automatizados
├── package.json
└── .gitignore
```

## Instalação

```bash
npm install
```

## Executar os testes

```bash
npm test
```

O relatório HTML dos testes será gerado em `mochawesome-report/mochawesome.html`.

## Funcionalidades

### `pagar(codigoBarras, empresa, valor, categoria?)`

Registra um pagamento na lista interna.

| Parâmetro      | Tipo     | Obrigatório | Descrição                              |
|----------------|----------|-------------|----------------------------------------|
| `codigoBarras` | `string` | Sim         | Deve ter exatamente 13 dígitos numéricos |
| `empresa`      | `string` | Sim         | Nome da empresa                        |
| `valor`        | `number` | Sim         | Valor do boleto                        |
| `categoria`    | `string` | Não         | Padrão: `"Padrão"`. Automaticamente `"Cara"` se `valor > 100` |

**Retorno:** `"Pagamento realizado com sucesso"`

**Erros lançados:**
- `"O código de barras precisa ter 13 caracteres"` — quando diferente de 13 dígitos
- `"Código de barras inválido"` — quando contém letras
- `"Preencha o nome da empresa"` — quando empresa está vazia
- `"Preencha o valor do boleto"` — quando valor não é fornecido

### `consultaUltimoPagamento()`

Retorna o último pagamento registrado na lista.

## Testes cobertos

- Código de barras com menos de 13 caracteres
- Código de barras com mais de 13 caracteres
- Código de barras com letras
- Nome da empresa não preenchido
- Valor do boleto não preenchido
- Pagamento realizado com sucesso
- Categoria `"Padrão"` para valor até R$ 100,00
- Categoria `"Cara"` para valor acima de R$ 100,00
- Consulta do último pagamento
