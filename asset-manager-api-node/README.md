# Asset Manager API

API desenvolvida para teste técnico de gerenciamento de Assets 3D.

O projeto permite cadastrar, listar, consultar, editar, excluir, fazer upload e fazer download de arquivos `.glb`.

---

## Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- Multer
- Swagger

---

## Versões utilizadas

Este projeto foi desenvolvido e testado com:

~~~txt
Node.js: v24.18.0
npm: 11.16.0
Express: 5.2.1
TypeScript: 6.0.3
Prisma CLI: 6.19.0
Prisma Client: 6.19.0
SQLite: provider sqlite via Prisma
Multer: 2.2.0
Swagger UI Express: não instalado
Swagger JSDoc: não instalado
CORS: 2.8.6
Dotenv: 17.4.2
ts-node-dev: 2.0.0
~~~

Recomendado: Node.js 20 ou superior.

---

## O que precisa instalar

Antes de rodar o projeto, é necessário ter instalado:

- Git
- Node.js
- npm

Para verificar:

~~~bash
git --version
node -v
npm -v
~~~

O SQLite é utilizado via Prisma com arquivo local `.db`, então não é necessário instalar SQLite separadamente para rodar este projeto.

---

## Como rodar o projeto

Após clonar o repositório, entre na pasta da API:

~~~bash
cd asset-manager-api-node
~~~

Instale as dependências:

~~~bash
npm install
~~~

Crie o arquivo `.env` na raiz da pasta `asset-manager-api-node`:

~~~bash
cat > .env <<'ENV'
DATABASE_URL="file:./dev.db"
PORT=3000
ENV
~~~

Execute as migrations do Prisma:

~~~bash
npx prisma migrate dev
~~~

Rode a API:

~~~bash
npm run dev
~~~

A API ficará disponível em:

~~~txt
http://localhost:3000
~~~

---

## Documentação Swagger

A documentação interativa está disponível em:

~~~txt
http://localhost:3000/api-docs
~~~

Pelo Swagger é possível testar os endpoints diretamente pelo navegador, incluindo upload de arquivo `.glb`.

---

## Funcionalidades implementadas

- Cadastro de asset 3D
- Upload de arquivo `.glb`
- Listagem de assets
- Consulta de asset por ID
- Atualização dos dados do asset
- Exclusão de asset
- Remoção do arquivo físico ao excluir
- Download do arquivo original
- Documentação Swagger

---

## Endpoints disponíveis

~~~txt
GET    /api/assets
GET    /api/assets/{id}
POST   /api/assets
PUT    /api/assets/{id}
DELETE /api/assets/{id}
GET    /api/assets/{id}/download
~~~

---

## Como criar um arquivo fake para teste

Caso não tenha um arquivo `.glb` real, crie um arquivo fake apenas para testar o fluxo de upload, listagem e download:

~~~bash
echo "arquivo fake para teste de upload" > teste.glb
~~~

Esse arquivo não é um modelo 3D válido, mas serve para testar o fluxo da API.

---

## Teste rápido com curl

Com a API rodando, crie um asset:

~~~bash
curl -X POST http://localhost:3000/api/assets \
  -F "name=Asset Teste" \
  -F "description=Teste de upload com arquivo fake" \
  -F "category=Teste" \
  -F "tags=glb,upload,multer" \
  -F "file=@teste.glb"
~~~

Liste os assets:

~~~bash
curl http://localhost:3000/api/assets
~~~

Busque um asset por ID:

~~~bash
curl http://localhost:3000/api/assets/ID_DO_ASSET
~~~

Atualize um asset:

~~~bash
curl -X PUT http://localhost:3000/api/assets/ID_DO_ASSET \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Asset Atualizado",
    "description": "Descrição atualizada",
    "category": "Teste",
    "tags": "glb,updated",
    "status": "AVAILABLE"
  }'
~~~

Baixe o arquivo original:

~~~bash
curl -OJ http://localhost:3000/api/assets/ID_DO_ASSET/download
~~~

Exclua um asset:

~~~bash
curl -X DELETE http://localhost:3000/api/assets/ID_DO_ASSET
~~~

Resposta esperada:

~~~json
{
  "message": "Asset excluído com sucesso."
}
~~~

---

## Scripts disponíveis

Rodar em desenvolvimento:

~~~bash
npm run dev
~~~

Compilar o projeto:

~~~bash
npm run build
~~~

Rodar versão compilada:

~~~bash
npm start
~~~

---

## Prisma

Rodar migrations:

~~~bash
npx prisma migrate dev
~~~

Abrir Prisma Studio:

~~~bash
npx prisma studio
~~~
