# Electric Budget

Protótipo mobile de aplicativo para eletricistas autônomos — orçamentos, agenda, clientes e pagamentos.

## Acesso

**Link:** https://erik-gastao.github.io/electricbudget/

**QR Code:** https://erik-gastao.github.io/electricbudget/qrcode.html

## Telas

| Tela | Descrição |
|------|-----------|
| Home | Dashboard com agenda do dia, orçamentos e pagamentos |
| Clientes | Lista, perfil e cadastro de clientes |
| Materiais | Lista com busca/filtro e cadastro de novos materiais |
| Orçamento | Criação com picker de materiais e mão de obra, totais automáticos |
| Agenda | Calendário mensal, lista de compromissos e detalhes |
| Pagamentos | Lista filtrável e registro de pagamentos |
| Relatório | Gráfico de receita mensal e ranking de clientes |
| Perfil | Dados do eletricista e configurações |

## Funcionalidades

- Cadastro de materiais com categoria, unidade e preço
- Orçamento com seleção de materiais cadastrados e cálculo automático de totais
- Agendamento com visualização por dia/semana e tela de detalhes
- Registro de pagamentos com status (pago, pendente, atrasado)
- Calendário interativo com marcação de dias com evento
- Filtros por categoria e status em todas as listas

## Stack

- HTML + CSS + JS puro (sem framework, sem build)
- Single-page com múltiplas telas `.screen` dentro de `.phone`
- Proporção 9:16 responsiva via `aspect-ratio` + `dvh`
- Navegação via `goTo(id)` em `script.js`

## Equipe

- Erik Gastão
- [Colega](https://github.com/cCarpa25)
