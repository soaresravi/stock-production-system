# 🏭 Sistema de estoque e produção

<div align="center">

### Sistema completo para controle de estoque e sugestão de produção com priorização por valor

[![Quarkus](https://img.shields.io/badge/Quarkus-3.31.3-4695EB?style=for-the-badge&logo=quarkus)](https://quarkus.io/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-9.2-764ABC?style=for-the-badge&logo=redux)](https://redux.js.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Cypress](https://img.shields.io/badge/Cypress-15.10-17202C?style=for-the-badge&logo=cypress)](https://www.cypress.io/)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar](#-como-executar)
- [Testes](#-testes)
- [API Endpoints](#-api-endpoints)
- [Demonstração](#-demonstração)
- [Requisitos atendidos](#-requisitos-atendidos)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido como parte de um teste prático para a **Projedata - Autoflex**. O objetivo é gerenciar o estoque de matérias-primas e sugerir quais produtos podem ser produzidos com priorização pelos de maior valor.

### O problema

Uma indústria precisa controlar:
- 📦 **Produtos**: código, nome e valor
- 🪵 **Matérias-primas**: código, nome e quantidade em estoque
- 🔗 **Associações**: quais matérias-primas cada produto utiliza e em quais quantidades
- 💡 **Sugestões**: quais produtos podem ser produzidos com o estoque atual, priorizando os de maior valor

---

## 🚀 Tecnologias

### Back-end
| Tecnologia | Descrição | 
|------------|--------|
| [Quarkus](https://quarkus.io/) | Framework Java para microserviços |
| [Hibernate ORM](https://hibernate.org/) | Mapeamento objeto-relacional |
| [MySQL](https://www.mysql.com/) | Banco de dados relacional |
| [RESTEasy Reactive](https://quarkus.io/guides/resteasy-reactive) | - | API REST |
| [Swagger/OpenAPI](https://swagger.io/) | - | Documentação da API |

### Front-end
| Tecnologia | Descrição |
|------------|--------|
| [React](https://reactjs.org/) | Biblioteca para interfaces |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Gerenciamento de estado |
| [TypeScript](https://www.typescriptlang.org/) | Superset tipado do JavaScript |
| [Bootstrap](https://getbootstrap.com/) | Framework CSS |
| [React Router](https://reactrouter.com/) | Roteamento |
| [Axios](https://axios-http.com/) | Cliente HTTP |

### Testes
| Tecnologia | Descrição |
|------------|--------|
| [JUnit](https://junit.org/) | Testes unitários (back-end) |
| [Jest](https://jestjs.io/) | Testes unitários (front-end) |
| [Cypress](https://www.cypress.io/) | Testes de integração E2E |

### Fontes
- **Alatsi**: Títulos e cabeçalhos
- **Cabin**: Textos e labels

---

## ✨ Funcionalidades

### **CRUD completo**
- [x] Cadastro de produtos
- [x] Cadastro de matérias-primas
- [x] Associações entre produtos e matérias-primas

### **Lógica inteligente**
- [x] Sugestão de produção baseada no estoque atual
- [x] Priorização automática pelos produtos de maior valor
- [x] Cálculo do valor total da produção sugerida

### **Interface moderna**
- [x] Design responsivo (mobile/tablet/desktop)
- [x] Paleta de cores Projedata (azul, roxo, verde)
- [x] Componentes estilizados com animações
- [x] Feedback visual para ações do usuário

### **Qualidade garantida**
- [x] Testes unitários (JUnit + Jest)
- [x] Testes de integração (Cypress)
- [x] Código 100% em inglês
- [x] Documentação completa

---

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Java 17+](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8.0+](https://www.mysql.com/) (ou XAMPP)
- [Git](https://git-scm.com/)

---

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/soaresravi/estoque-producao-system.git
cd estoque-producao-system
```

### 2. Configure o Banco de Dados

```sql
CREATE DATABASE stock_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Back-end (Quarkus)

```
cd backend
# Configure o banco em src/main/resources/application.properties
# quarkus.datasource.username=root
# quarkus.datasource.password=sua_senha

# Execute em modo desenvolvimento
./mvnw quarkus:dev
```
- API estará disponível em: http://localhost:8080
- Swagger UI: http://localhost:8080/q/swagger-ui/

### 4. Front-end (React)

```
cd frontend
# Instale as dependências
npm install

# Execute
npm start
```
- A aplicação estará disponível em: http://localhost:3000

---

## 🧪 Testes

Back-end (JUnit)
```
cd backend
./mvnw test
```

Front-end (Jest)
```
cd frontend
npm test
```

Integração
```
# Abrir interface gráfica
npx cypress open

# Rodar em modo headless
npx cypress run
```

---

## 📡 API Endpoints

### Produtos
| Método | Endpoint | Descrição |
|:---:|:---|:---|
| `GET` | `/api/products` | Lista todos os produtos |
| `GET` | `/api/products/{id}` | Busca produto por ID |
| `POST` | `/api/products` | Cria novo produto |
| `PUT` | `/api/products/{id}` | Atualiza produto |
| `DELETE` | `/api/products/{id}` | Remove produto |

### Matérias-primas
| Método | Endpoint | Descrição |
|:---:|:---|:---|
| `GET` | `/api/raw-materials` | Lista todas as matérias-primas |
| `GET` | `/api/raw-materials/{id}` | Busca matéria-prima por ID |
| `POST` | `/api/raw-materials` | Cria nova matéria-prima |
| `PUT` | `/api/raw-materials/{id}` | Atualiza matéria-prima |
| `DELETE` | `/api/raw-materials/{id}` | Remove matéria-prima |

---

## 📊 Demonstração

### Exemplo de Cálculo
**Estoque disponível:**
* **Wood:** 100 unidades
* **Nails:** 500 unidades
* **Paint:** 50 unidades

**Produtos:**
* **Luxury Chair (R$ 299,90):** 8 Wood, 30 Nails, 2 Paint
* **Another Product (R$ 149,90):** 2 Wood

**Resultado da sugestão:**
| Produto | Quantidade | Valor Total |
|:---|:---:|:---|
| Luxury Chair | 12 | R$ 3.598,80 |
| Another Product | 2 | R$ 299,80 |
| **TOTAL** | | **R$ 3.898,60** |

---

## ✅ Requisitos atendidos

### Requisitos Funcionais
- [x] **RF001**: CRUD Produtos (back-end)
- [x] **RF002**: CRUD Matérias-primas (back-end)
- [x] **RF003**: CRUD Associações (back-end)
- [x] **RF004**: Consulta de produção (back-end)
- [x] **RF005**: CRUD Produtos (front-end)
- [x] **RF006**: CRUD Matérias-primas (front-end)
- [x] **RF007**: CRUD Associações (front-end)
- [x] **RF008**: Listagem de sugestões

---

## 👨‍💻 Autor

**Ravi Soares** - Desenvolvedor Full Stack

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/soaresravi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ravi-brocco-soares-03a29827a/)