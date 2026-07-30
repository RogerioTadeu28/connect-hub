Connect Hub – Sistema Full Stack com Autenticação e Persistência em Banco
📌 Sobre o Projeto

O Connect Hub é um sistema full stack desenvolvido como parte do curso TrendsIT2026 – Fase 3. A aplicação foi construída com arquitetura em camadas, integrando interface web responsiva, API RESTful segura e banco de dados relacional (PostgreSQL) para persistência real dos dados.

O sistema permite que usuários realizem cadastro e login com autenticação JWT, gerenciem recursos através de um CRUD completo e acessem apenas dados autorizados. Toda a lógica de negócio é executada no servidor, e os dados são persistidos em banco SQL.

🚀 Demonstração

Acesse a aplicação:
🔗 https://connect-hub-inky.vercel.app/login.html

Credenciais para teste:

    E-mail: teste@email.com

    Senha: 123456

✅ Requisitos Funcionais
ID	Requisito	Descrição	Status
RF01	Cadastro de Usuário	O sistema deve permitir que novos usuários criem uma conta fornecendo nome, e-mail e senha.	✅
RF02	Login de Usuário	O sistema deve autenticar usuários com e-mail e senha, retornando um token JWT válido.	✅
RF03	Proteção de Rotas	O sistema deve bloquear o acesso a páginas e dados privados para usuários não autenticados.	✅
RF04	Criar Registro	O usuário autenticado deve poder adicionar um novo registro (ex: movimentação, post, tarefa).	✅
RF05	Listar Registros	O usuário autenticado deve visualizar todos os seus registros em uma tabela.	✅
RF06	Filtrar Registros	O usuário deve poder filtrar registros por descrição e categoria.	✅
RF07	Editar Registro	O usuário autenticado deve poder editar um registro existente.	✅
RF08	Excluir Registro	O usuário autenticado deve poder excluir um registro.	✅
RF09	Dashboard Resumido	O sistema deve exibir cards com resumo dos dados (ex: entradas, saídas, saldo, maior gasto).	✅
RF10	Gráficos Interativos	O sistema deve exibir gráficos de evolução e distribuição por categoria.	✅
RF11	Mensagens de Feedback	O sistema deve exibir mensagens claras de sucesso ou erro para todas as ações do usuário.	✅
RF12	Segurança de Senhas	As senhas devem ser armazenadas com hash (bcrypt) e não em texto puro.	✅
RF13	Logout	O usuário deve poder encerrar sua sessão com segurança.	✅

⚙️ Requisitos Não Funcionais
ID	Requisito	Descrição	Status
RNF01	Arquitetura Full Stack	O sistema deve ter frontend, backend e banco de dados separados e bem definidos.	✅
RNF02	Organização do Código	O backend deve seguir arquitetura em camadas (controllers, routes, middlewares, models).	✅
RNF03	Segurança	Tokens JWT com expiração; variáveis de ambiente para dados sensíveis; CORS configurado.	✅
RNF04	Persistência Real	Todas as operações CRUD devem refletir no banco de dados PostgreSQL.	✅
RNF05	Integração Frontend-Backend	A interface deve consumir a API de fato, com tratamento de respostas e erros.	✅
RNF06	Responsividade	A interface deve se adaptar a diferentes tamanhos de tela (mobile, tablet, desktop).	✅
RNF07	Publicação	O sistema deve estar publicado e acessível externamente para testes.	✅
RNF08	Versionamento	O código deve estar versionado no GitHub com histórico claro de commits.	✅
RNF09	Tratamento de Erros	O sistema deve capturar e tratar erros, evitando travamentos e exibindo mensagens amigáveis.	✅
RNF10	Manutenibilidade	O código deve ser modular, comentado e de fácil compreensão para futuras manutenções.	✅

🛠️ Tecnologias Utilizadas

Backend
Tecnologia	Finalidade
Node.js	Ambiente de execução JavaScript
Express	Framework web para criação da API
Prisma ORM	Mapeamento objeto-relacional e migrations
PostgreSQL	Banco de dados relacional
JWT	Autenticação e geração de tokens
bcrypt	Hash de senhas
dotenv	Gerenciamento de variáveis de ambiente
cors	Liberação de requisições entre frontend e backend

Frontend
Tecnologia	Finalidade
HTML5	Estrutura das páginas
CSS3	Estilização e responsividade
JavaScript (Vanilla)	Lógica de negócio e interatividade
Chart.js	Gráficos interativos
Ferramentas e Deploy
Ferramenta	Finalidade
Git	Versionamento de código
GitHub	Repositório remoto
Vercel	Hospedagem do frontend e backend
pgAdmin	Gerenciamento visual do PostgreSQL

🗄️ Modelo de Dados
Tabela User
Campo	Tipo	Descrição
id	Int	Chave primária (auto incremento)
name	String	Nome do usuário
email	String	E-mail único
password	String	Hash da senha (bcrypt)
createdAt	DateTime	Data de criação
updatedAt	DateTime	Data de atualização
Tabela Movimentacao (Exemplo de Entidade)
Campo	Tipo	Descrição
id	Int	Chave primária (auto incremento)
descricao	String	Descrição do registro
valor	Float	Valor monetário
tipo	String	"entrada" ou "saida"
categoria	String	Categoria do registro
data	DateTime	Data do registro
userId	Int	Chave estrangeira (User.id)
createdAt	DateTime	Data de criação
updatedAt	DateTime	Data de atualização

Relacionamento: Um usuário pode ter vários registros (1:N).

📁 Estrutura do Projeto
text

connect-hub/
├── connect-hub-frontend/          # Frontend
│   ├── index.html                 # Dashboard
│   ├── login.html                 # Tela de login
│   ├── style.css                  # Estilos do dashboard
│   ├── script.js                  # Lógica do dashboard
│   ├── login.css                  # Estilos do login
│   └── login.js                   # Lógica do login
│
├── connect-hub-backend/           # Backend (API)
│   ├── server.js                  # Servidor principal
│   ├── package.json               # Dependências
│   ├── .env                       # Variáveis de ambiente (não versionado)
│   ├── .env.example               # Exemplo de variáveis
│   ├── prisma/
│   │   └── schema.prisma          # Modelagem do banco de dados
│   ├── src/
│   │   ├── controllers/           # Lógica das rotas
│   │   │   ├── authController.js
│   │   │   └── movimentacaoController.js
│   │   ├── routes/                # Definição das rotas
│   │   │   ├── authRoutes.js
│   │   │   └── movimentacaoRoutes.js
│   │   ├── middlewares/           # Middlewares (autenticação)
│   │   │   └── authMiddleware.js
│   │   └── prisma/                # Cliente Prisma
│   │       └── index.js
│   └── vercel.json                # Configuração de deploy
│
├── .gitignore                     # Arquivos ignorados pelo Git
└── README.md                      # Documentação do projeto

🔧 Como Rodar Localmente
Pré-requisitos

    Node.js (v18 ou superior)

    PostgreSQL (v14 ou superior)

    pgAdmin (opcional)

1. Clonar o repositório
bash

git clone https://github.com/SEU_USUARIO/connect-hub.git
cd connect-hub

2. Configurar o Backend
bash

cd connect-hub-backend
npm install
cp .env.example .env

Edite o arquivo .env com suas credenciais do PostgreSQL:
env

DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/connecthub"
JWT_SECRET="uma_chave_super_secreta"
PORT=3333

Rodar migrations e gerar o Prisma Client:
bash

npx prisma migrate dev --name init
npx prisma generate

Iniciar o servidor:
bash

npm start

O servidor estará disponível em: http://localhost:3333

3. Configurar o Frontend
bash

cd connect-hub-frontend

    Abra login.html no navegador (ou com Live Server).

Para usar a API local, altere API_URL nos arquivos login.js e script.js:
javascript

const API_URL = 'http://localhost:3333/api';

4. Acessar a Aplicação

    Localmente: http://localhost:3333/

    Login de teste: teste@email.com / 123456

🔒 Segurança
Aspecto	Implementação
Senhas	Hash com bcrypt (não armazenadas em texto puro)
Autenticação	JWT com expiração de 7 dias
Rotas Privadas	Middleware de autenticação em todas as rotas protegidas
Dados Sensíveis	Variáveis de ambiente (.env) não versionadas
CORS	Configurado para permitir comunicação frontend-backend
Validação	Tratamento de erros com try/catch em todas as operações

✅ Critérios de Aceite
Critério	Status
Usuário consegue criar conta e realizar login com sucesso.	✅
Aplicação impede acesso não autorizado a páginas ou dados privados.	✅
CRUD completo funcionando com persistência em banco SQL.	✅
Interface exibe mensagens de erro claros.	✅
Senhas estão criptografadas (bcrypt).	✅
Backend usa JWT para autenticação.	✅
Variáveis sensíveis estão fora do repositório público (.env).	✅
Código segue estrutura organizada (MVC).	✅
Sistema publicado com frontend e backend acessíveis para testes externos.	✅

📝 Licença

Este projeto foi desenvolvido como parte do programa Trends IT 2026 para vaga de residência.

👨‍💻 Autor

Rogerio Tadeu Bento de Souza
Repositório: https://github.com/RogerioTadeu28/connect-hub

📌 Links Úteis

    Site (Frontend): https://connect-hub-inky.vercel.app/login.html

    API (Backend): https://connect-hub-smart-cash.vercel.app/api/health