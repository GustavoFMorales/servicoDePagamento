# Serviço de Pagamento

Projeto desenvolvido durante a **Pós-graduação em Automação de Testes de Software**, com o objetivo de praticar testes unitários automatizados em JavaScript utilizando **Mocha** e **Node.js assert**, além de integração com pipelines de CI/CD via **GitHub Actions** e notificações via **Discord**.

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18.x / 24.x | Runtime JavaScript |
| [Mocha](https://mochajs.org/) | ^11.7.5 | Framework de testes |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | ^7.1.4 | Reporter HTML dos testes |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD automatizado |
| [Discord Webhook](https://discord.com/developers/docs/resources/webhook) | — | Notificações de pipeline |

---

## Estrutura do projeto

```
servicoDePagamento/
├── .github/
│   └── workflows/
│       ├── 01-testes-unitarios-push-exec.yaml      # Execução via push na main
│       ├── 02-testes-unitarios-manual-exec.yaml    # Execução manual via GitHub UI
│       └── 03-testes-unitarios-schedule-exec.yaml  # Execução agendada (diária)
├── src/
│   └── servicoDePagamento.js    # Classe principal com a lógica de negócio
├── test/
│   └── servicoDePagamento.test.js  # Testes unitários automatizados
├── mochawesome-report/          # Relatórios HTML gerados (ignorado pelo git)
├── .gitignore
├── package.json
└── package-lock.json
```

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd servicoDePagamento
npm install
```

---

## Executar os testes

```bash
npm test
```

O relatório HTML dos testes será gerado em `mochawesome-report/relatorio.html`. Abra o arquivo no navegador para visualizar os resultados de forma detalhada.

---

## Funcionalidades

### `pagar(codigoBarras, empresa, valor, categoria?)`

Registra um pagamento na lista interna da instância.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `codigoBarras` | `string` | Sim | Deve ter exatamente 13 dígitos numéricos |
| `empresa` | `string` | Sim | Nome da empresa beneficiária |
| `valor` | `number` | Sim | Valor do boleto |
| `categoria` | `string` | Não | Padrão: `"Padrão"`. Automaticamente `"Cara"` se `valor > 100` |

**Retorno em caso de sucesso:** `"Pagamento realizado com sucesso"`

**Erros lançados:**

| Condição | Mensagem de erro |
|---|---|
| Código de barras com número diferente de 13 dígitos | `"O código de barras precisa ter 13 caracteres"` |
| Código de barras com letras ou caracteres não numéricos | `"Código de barras inválido"` |
| Campo empresa vazio | `"Preencha o nome da empresa"` |
| Valor não fornecido (`undefined` ou `null`) | `"Preencha o valor do boleto"` |

**Exemplo de uso:**

```javascript
import ServicoDePagamento from "./src/servicoDePagamento.js";

const servico = new ServicoDePagamento();

// Pagamento padrão (valor <= 100)
servico.pagar("1223456789123", "Empresa XPTO", 99.0);
// Retorna: "Pagamento realizado com sucesso"
// categoria: "Padrão"

// Pagamento caro (valor > 100)
servico.pagar("7891234567890", "Empresa XPTO", 150.00);
// Retorna: "Pagamento realizado com sucesso"
// categoria: "Cara"
```

---

### `consultaUltimoPagamento()`

Retorna o objeto do último pagamento registrado na lista interna.

**Retorno:**

```javascript
{
  codigoBarras: "7891234567890",
  empresa: "Empresa XPTO",
  valor: 150.00,
  categoria: "Cara"
}
```

---

## Testes unitários

O arquivo [test/servicoDePagamento.test.js](test/servicoDePagamento.test.js) contém **9 casos de teste**, organizados em 4 grupos:

### Código de barras

| # | Cenário | Resultado esperado |
|---|---|---|
| 1 | Código com menos de 13 caracteres | Lança erro `"O código de barras precisa ter 13 caracteres"` |
| 2 | Código com mais de 13 caracteres | Lança erro `"O código de barras precisa ter 13 caracteres"` |
| 3 | Código com letras | Lança erro `"Código de barras inválido"` |

### Nome da empresa

| # | Cenário | Resultado esperado |
|---|---|---|
| 4 | Empresa não preenchida | Lança erro `"Preencha o nome da empresa"` |

### Valor do boleto

| # | Cenário | Resultado esperado |
|---|---|---|
| 5 | Valor não fornecido | Lança erro `"Preencha o valor do boleto"` |

### Pagamento com sucesso

| # | Cenário | Resultado esperado |
|---|---|---|
| 6 | Dados válidos | Retorna `"Pagamento realizado com sucesso"` |
| 7 | Valor de R$ 99,00 | Categoria definida como `"Padrão"` |
| 8 | Valor de R$ 100,01 | Categoria definida como `"Cara"` |
| 9 | Consulta do último pagamento | Retorna todos os campos do registro corretamente |

---

## CI/CD — GitHub Actions

O projeto possui três pipelines configuradas na pasta [.github/workflows/](.github/workflows/).

### 1. Testes via Push — `01-testes-unitarios-push-exec.yaml`

**Gatilho:** push na branch `main`
**Node.js:** 18.x

Executada automaticamente sempre que um novo código é enviado para a branch principal.

```
push → main
  └─ Notifica início no Discord
  └─ npm install
  └─ npm run test
  └─ Publica relatório como artefato
  └─ Notifica sucesso ou falha no Discord
```

---

### 2. Testes Manuais — `02-testes-unitarios-manual-exec.yaml`

**Gatilho:** execução manual via interface do GitHub (`workflow_dispatch`)
**Node.js:** 18.x

Permite disparar os testes a qualquer momento pela aba **Actions** do repositório no GitHub, sem necessidade de fazer push.

```
GitHub UI (Actions tab) → Run workflow
  └─ Notifica início no Discord
  └─ npm install
  └─ npm run test
  └─ Publica relatório como artefato
  └─ Notifica sucesso ou falha no Discord
```

---

### 3. Testes Agendados — `03-testes-unitarios-schedule-exec.yaml`

**Gatilho:** cron diário às **13:47 UTC** (`47 13 * * *`)
**Node.js:** 24.x

Executa os testes automaticamente todos os dias no horário configurado, garantindo monitoramento contínuo da saúde do projeto.

```
Cron: 13:47 UTC (diário)
  └─ Notifica início no Discord
  └─ npm install
  └─ npm run test
  └─ Publica relatório como artefato
  └─ Notifica sucesso ou falha no Discord
```

---

## Notificações via Discord

Todas as pipelines enviam notificações para um canal do Discord em três momentos:

| Evento | Condição | Cor |
|---|---|---|
| Início do processo | Sempre | — |
| Pipeline concluída com sucesso | `if: success()` | Verde `#28A745` |
| Pipeline falhou | `if: failure()` | Vermelho `#DC3545` |

### Configuração do Webhook

Para ativar as notificações, é necessário configurar o secret `DISCORD_WEBHOOK_URL` no repositório:

1. Acesse **Settings → Secrets and variables → Actions** no GitHub
2. Clique em **New repository secret**
3. Nome: `DISCORD_WEBHOOK_URL`
4. Valor: URL do webhook do seu canal no Discord

Para criar um webhook no Discord: **Configurações do Servidor → Integrações → Webhooks → Novo Webhook**.

---

## Artefatos gerados

Após cada execução da pipeline, o relatório HTML dos testes é publicado como artefato chamado `relatorio-testes` e pode ser baixado diretamente pela aba **Actions** do GitHub.

---

## Secrets necessários

| Secret | Descrição |
|---|---|
| `DISCORD_WEBHOOK_URL` | URL do webhook do Discord para envio de notificações |
