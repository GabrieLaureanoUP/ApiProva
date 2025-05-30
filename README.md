# ApiEstoque - Sistema de Gerenciamento de Estoque

Alunos: Gabriel Laureano Soares da Silva(38525071),
        \n Marcos Maues
        João Pedro
        Rafael Santos Correia

## Visão Geral do Projeto

Este projeto consiste em uma API RESTful desenvolvida para a gestão de acervo de produtos em um estoque. O objetivo é fornecer uma interface robusta e eficiente para operações de consulta, cadastro e exclusão de itens, sendo aplicável em contextos que demandam agilidade no controle de inventário.

## Tecnologias Utilizadas

* **C#**
* **.NET**
* **Entity Framework Core** (para acesso a dados)
* **SQL Lite**


## Endpoints da API

A API oferece os seguintes endpoints para gerenciar produtos:

| Método   | Rota               | Descrição                           |
| :------- | :----------------- | :---------------------------------- |
| `GET`    | `/api/produtos`    | Retorna uma lista de todos os produtos no estoque. |
| `GET`    | `/api/produtos/{id}` | Retorna um produto específico pelo seu ID. |
| `POST`   | `/api/produtos`    | Adiciona um novo produto ao estoque. |
| `DELETE` | `/api/produtos/{id}` | Remove um produto existente pelo seu ID. |

## Modelagem de Dados

A entidade principal do projeto é `Produto`, com os seguintes atributos:

* `Id`: (int, Chave Primária, Autoincremento)
* `Nome`: (string) - Nome do produto.
* `Quantidade`: (int) - Quantidade em estoque.
* `Preco`: (decimal) - Preço unitário do produto.
* `Descricao`: (string) - Descrição detalhada do produto.

## Estrutura do Código

O projeto está organizado em componentes com responsabilidades claras:

* `Models/Produto.cs`: Define a estrutura da entidade `Produto`.
* `Models/ProdutosContext.cs`: Responsável pela configuração do contexto do banco de dados e integração com o Entity Framework.
* `Rotas/ROTA_GET.cs`: Contém a lógica para as operações de listagem e consulta de produtos por ID.
* `Rotas/ROTA_POST.css`: Gerencia a adição de novos produtos.
* `Rotas/ROTA_DELETE.cs.cs`: Implementa a funcionalidade de remoção de produtos.
* `Program.cs`: Arquivo de inicialização da aplicação, onde serviços e rotas são configurados.
