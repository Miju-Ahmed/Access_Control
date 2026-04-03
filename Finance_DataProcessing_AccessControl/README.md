# Finance Dashboard — Backend API

A **production-ready** Spring Boot 3.4 REST API for a Finance Dashboard with JWT authentication, role-based access control (RBAC), financial record management, and aggregated analytics.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.4.4 / Java 21 |
| Security | Spring Security 6 + JWT (JJWT 0.12) |
| Database | MySQL 8+ (JPA / Hibernate) |
| Validation | Jakarta Bean Validation |
| API Docs | SpringDoc OpenAPI / Swagger UI |
| Build | Maven |

---

## 📁 Project Structure

```
src/main/java/com/miju/Finance_DataProcessing_AccessControl/
├── config/
│   ├── JpaConfig.java               ← @EnableJpaAuditing
│   ├── OpenApiConfig.java           ← Swagger JWT bearer setup
│   └── SecurityConfig.java          ← Security filter chain + RBAC
├── controller/
│   ├── AuthController.java          ← POST /api/auth/**
│   ├── DashboardController.java     ← GET  /api/dashboard/**
│   ├── FinancialRecordController.java ← /api/records/**
│   └── UserController.java          ← /api/users/** (ADMIN)
├── dto/
│   ├── request/                     ← Validated inbound DTOs
│   └── response/                    ← Outbound response DTOs
├── entity/
│   ├── FinancialRecord.java
│   └── User.java
├── enums/
│   ├── RecordType.java              ← INCOME | EXPENSE
│   └── Role.java                    ← VIEWER | ANALYST | ADMIN
├── exception/
│   ├── BadRequestException.java
│   ├── GlobalExceptionHandler.java  ← @RestControllerAdvice
│   └── ResourceNotFoundException.java
├── repository/
│   ├── FinancialRecordRepository.java ← JPQL aggregation queries
│   └── UserRepository.java
├── security/
│   ├── JwtAuthenticationFilter.java ← OncePerRequestFilter
│   ├── JwtTokenProvider.java        ← generate + validate JWT
│   └── UserDetailsServiceImpl.java
└── service/
    ├── AuthService.java
    ├── DashboardService.java
    ├── FinancialRecordService.java
    └── UserService.java
```

---

## ⚙️ Setup & Configuration

### Prerequisites
- Java 21
- Maven 3.9+
- MySQL 8+

### 1. Create the database

```sql
CREATE DATABASE finance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure credentials

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USER
spring.datasource.password=YOUR_MYSQL_PASSWORD

app.jwt.secret=YOUR_256_BIT_BASE64_SECRET
app.jwt.expiration-ms=86400000   # 24 hours
```

> **Generating a secure JWT secret:**
> ```bash
> openssl rand -base64 32
> ```
> Paste the output as the value of `app.jwt.secret`.

### 3. Run the application

```bash
./mvnw spring-boot:run
```

### 4. Run tests

```bash
./mvnw test
```

### 5. Build JAR

```bash
./mvnw clean package -DskipTests
java -jar target/Finance_DataProcessing_AccessControl-0.0.1-SNAPSHOT.jar
```

---

## 🔐 Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Register (public)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "secret123"
}
```

### Login (public)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "token": "eyJhbGci...",
  "tokenType": "Bearer",
  "userId": 1,
  "name": "Alice Smith",
  "email": "alice@example.com",
  "role": "VIEWER"
}
```

---

## 🛡️ Role-Based Access Control (RBAC)

| Endpoint | VIEWER | ANALYST | ADMIN |
|---|:---:|:---:|:---:|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| GET /api/records | ✅ | ✅ | ✅ |
| GET /api/records/{id} | ✅ | ✅ | ✅ |
| POST /api/records | ❌ | ❌ | ✅ |
| PUT /api/records/{id} | ❌ | ❌ | ✅ |
| DELETE /api/records/{id} | ❌ | ❌ | ✅ |
| GET /api/dashboard/summary | ✅ | ✅ | ✅ |
| GET /api/dashboard/recent-transactions | ✅ | ✅ | ✅ |
| GET /api/dashboard/category-totals | ❌ | ✅ | ✅ |
| GET /api/dashboard/monthly-trends | ❌ | ✅ | ✅ |
| GET /api/users | ❌ | ❌ | ✅ |
| POST /api/users | ❌ | ❌ | ✅ |
| PUT /api/users/{id} | ❌ | ❌ | ✅ |
| PATCH /api/users/{id}/deactivate | ❌ | ❌ | ✅ |

---

## 📋 API Reference

### Financial Records — `GET /api/records`

| Query Param | Type | Description |
|---|---|---|
| `startDate` | `yyyy-MM-dd` | Filter from this date |
| `endDate` | `yyyy-MM-dd` | Filter up to this date |
| `category` | string | Exact category match (case-insensitive) |
| `type` | `INCOME` / `EXPENSE` | Filter by record type |
| `page` | int (default 0) | Page number |
| `size` | int (default 20) | Page size |

**Sample response:**
```json
{
  "content": [
    {
      "id": 1,
      "amount": 5000.00,
      "type": "INCOME",
      "category": "Salary",
      "date": "2025-03-01",
      "description": "Monthly salary",
      "createdById": 1,
      "createdByName": "Admin",
      "createdAt": "2025-03-01T10:00:00",
      "updatedAt": "2025-03-01T10:00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### Dashboard Summary — `GET /api/dashboard/summary?recentLimit=5`

```json
{
  "totalIncome": 15000.00,
  "totalExpenses": 8500.00,
  "netBalance": 6500.00,
  "categoryTotals": [
    { "category": "Food", "type": "EXPENSE", "total": 1200.00 },
    { "category": "Salary", "type": "INCOME", "total": 15000.00 }
  ],
  "monthlyTrends": [
    { "year": 2025, "month": 1, "type": "INCOME", "total": 5000.00 },
    { "year": 2025, "month": 1, "type": "EXPENSE", "total": 2800.00 }
  ],
  "recentTransactions": [ ... ]
}
```

### Error Response Format

```json
{
  "timestamp": "2025-03-01T10:00:00",
  "status": 422,
  "error": "Validation Failed",
  "message": "One or more fields are invalid",
  "path": "/api/records",
  "fieldErrors": {
    "amount": "Amount must be greater than 0",
    "type": "Type is required (INCOME or EXPENSE)"
  }
}
```

---

## 📖 Swagger UI

Once running, visit:
```
http://localhost:8080/swagger-ui.html
```

1. Call **POST /api/auth/login** → copy the `token` value
2. Click **Authorize** (top right) → paste: `<token>` (no `Bearer` prefix needed in the dialog)
3. All requests will now include the JWT automatically

---

## 🗄️ Database Schema

Tables are auto-created by Hibernate (`ddl-auto=update`). Key schema:

```sql
-- users
CREATE TABLE users (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('VIEWER','ANALYST','ADMIN') NOT NULL,
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

-- financial_records
CREATE TABLE financial_records (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  amount        DECIMAL(15,2) NOT NULL,
  type          ENUM('INCOME','EXPENSE') NOT NULL,
  category      VARCHAR(100) NOT NULL,
  date          DATE NOT NULL,
  description   VARCHAR(500),
  created_by_id BIGINT NOT NULL,
  deleted       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    DATETIME NOT NULL,
  updated_at    DATETIME NOT NULL,
  FOREIGN KEY (created_by_id) REFERENCES users(id),
  INDEX idx_record_date     (date),
  INDEX idx_record_type     (type),
  INDEX idx_record_category (category)
);
```

---

## 🎯 Design Decisions

| Decision | Rationale |
|---|---|
| **Spring Boot 3.4.4** | Replaced 4.0.5 (pre-release candidate) with current stable GA |
| **Soft delete** | Records are hidden (`deleted=true`) not removed, preserving audit history |
| **Self-registration → VIEWER** | Safe default; admin must explicitly elevate roles |
| **BCrypt password encoding** | Industry standard, adaptive work factor |
| **JPQL aggregation queries** | Avoids N+1 via constructor expressions — no in-memory aggregation |
| **`@PreAuthorize` on methods** | Fine-grained RBAC at method level, independent of URL patterns |
| **`open-in-view=false`** | Prevents lazy-loading outside transaction — forces explicit eager fetching |
| **`PagedResponse<T>` wrapper** | Normalised pagination envelope usable by any list endpoint |
