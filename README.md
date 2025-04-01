Esse projeto está sendo desenvolvido para o hackaton do curso de Pós Graduação de Desenvolvimento Fullstack da Fiap.

Utiliza Node JS com Fastify, Typescript, TypeORM, PostgreSQL e Zod, além do JWT como midlleware de validação de rotas.

Os módulos possuem a seguinte estrutura:
    - controllers: onde estão as regras de negócio e validações dos dados recebidos através do Zod;
    - entities: as tabelas necessárias para o módulo, criadas no padrão do TypeORM;
    - interfaces: são os DTOs chamados pelos repositórios e use-cases;
    - repositories: funções responsáveis por interagir com as bases de dados;
    - routes: contém as rotas do módulo;
    - services: são os use-cases chamados pelos controllers, para acesso aos repositórios;
        - factory: é a interface entre o controller e o use-case;

As configurações do TypeORM e do JWT estão na pasta config e a pasta shared armazena as funções auxiliares.