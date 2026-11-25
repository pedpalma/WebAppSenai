# ImagemPeças

Álbum online de imagens de peças industriais: cadastro/login com JWT, publicação de imagens (PNG, JPEG, GIF) com nome e tags, e galeria com pesquisa por nome/tag e formato.

| Pasta              | Conteúdo                                                                  |
| ------------------ | ------------------------------------------------------------------------- |
| `imagemPecasBack`  | API REST — Spring Boot 4 (Java 25), Spring Security, Spring Data JPA, JJWT |
| `imagemPecasFront` | Front-end — Next.js 16, React 19, TypeScript, Tailwind CSS, Formik + Yup   |
| `docs`             | Roteiros das aulas (requisitos, casos de uso, diagramas)                   |

## Rodando tudo com Docker (RNF05)

```bash
docker compose up -d --build
```

| Serviço    | Endereço                                          |
| ---------- | ------------------------------------------------- |
| `app`      | http://localhost:3000 (front-end)                 |
| `sbootapp` | http://localhost:8080 (API)                       |
| `db`       | localhost:5432 (PostgreSQL 16, banco `imagelite`) |
| `pgadmin`  | http://localhost:15432 (admin@admin.com / admin)  |

Defina `JWT_SECRET` (mín. 32 caracteres) no ambiente para usar uma chave própria de assinatura dos tokens.

## Rodando em modo de desenvolvimento

```bash
# banco + pgAdmin
cd imagemPecasBack && docker compose up -d

# API (porta 8080)
./mvnw spring-boot:run

# front-end (porta 3000), em outro terminal
cd imagemPecasFront && npm install && npm run dev
```

Testes da API (usam H2 em memória, não precisam do PostgreSQL): `cd imagemPecasBack && ./mvnw test`

## API

| Método | Rota                                 | Token | Descrição                                       |
| ------ | ------------------------------------ | ----- | ----------------------------------------------- |
| POST   | `/v1/users`                          | não   | Cadastro (`201`, `409` se o e-mail já existe)   |
| POST   | `/v1/users/auth`                     | não   | Login, devolve `{ "accessToken": "..." }`       |
| POST   | `/v1/images` (multipart)             | sim   | Publica imagem (`file`, `name`, `tags`) — `201` |
| GET    | `/v1/images?query=&extension=`       | não   | Pesquisa por nome/tags e formato                |
| GET    | `/v1/images/{id}`                    | não   | Imagem em tamanho real                          |

Regras de negócio: senha com no mínimo 8 caracteres; arquivo com até 4 MB; somente PNG, JPEG e GIF; nome e tags obrigatórios com até 50 caracteres; token válido por 60 minutos.
