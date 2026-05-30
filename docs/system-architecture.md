# System Architecture - Du Lịch Quảng Bá

## 1. Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Angular 17 SPA (Port 4200)                  │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │   │
│  │  │  Core   │ │ Shared  │ │ Pages   │ │     Admin       │ │   │
│  │  │(Guards, │ │(Comps,  │ │(Home,   │ │   (Dashboard,   │ │   │
│  │  │Intercep,│ │Models,  │ │Dest,    │ │  Dest CRUD,     │ │   │
│  │  │Services)│ │Pipes)   │ │Tour,    │ │  Tour CRUD,     │ │   │
│  │  │         │ │         │ │Article, │ │  Article CRUD,  │ │   │
│  │  │         │ │         │ │Contact, │ │  Users, Reviews,│ │   │
│  │  │         │ │         │ │User,    │ │  Inquiries)     │ │   │
│  │  │         │ │         │ │Chatbot) │ │                 │ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    HTTP/REST (JSON)
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Express.js API (Port 3000)                   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │   │
│  │  │  Auth   │ │Destination│ │  Tour   │ │     Article      │ │   │
│  │  │Module   │ │ Module   │ │ Module  │ │     Module       │ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │   │
│  │  │ Review  │ │ Favorite │ │ Inquiry │ │  Chatbot + Rec   │ │   │
│  │  │ Module  │ │ Module   │ │ Module  │ │    Modules       │ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                  Prisma ORM                                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MySQL 8.0 (Port 3306)                       │   │
│  │  Tables: users, roles, destinations, tours, articles,    │   │
│  │  reviews, favorites, inquiries, chatbot_histories,        │   │
│  │  recommendation_logs, provinces, categories, tags        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Technology Stack

### Frontend
- **Angular 17** - SPA framework
- **Angular Material** - UI component library
- **TypeScript 5** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **SCSS** - CSS preprocessor
- **Angular Router** - Client-side routing

### Backend
- **Node.js 18+** - Runtime
- **Express.js 4** - Web framework
- **Prisma ORM 5** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File upload
- **uuid** - ID generation

### Database
- **MySQL 8.0** - Relational database
- **Prisma Migration** - Schema versioning

## 3. Module Architecture (Backend)

```
backend/src/
├── index.js              # App entry point
├── routes/               # Route definitions
├── middlewares/          # Auth, error, logger
├── utils/                # Prisma client
├── modules/
│   ├── auth/
│   ├── destination/
│   ├── tour/
│   ├── article/
│   ├── review/
│   ├── favorite/
│   ├── inquiry/
│   ├── category/
│   ├── chatbot/
│   └── recommendation/
```

## 4. Module Architecture (Frontend)

```
frontend/src/app/
├── core/                 # Singleton services, guards, interceptors
│   ├── guards/
│   ├── interceptors/
│   └── services/
├── shared/               # Reusable components
│   ├── components/       # Cards, modals, widgets
│   ├── models/           # TypeScript interfaces
│   └── pipes/
├── pages/                # Public page components
│   ├── home/
│   ├── destinations/
│   ├── tours/
│   ├── articles/
│   ├── contact/
│   ├── chatbot/
│   └── auth/
└── admin/                # Admin module
    ├── dashboard/
    ├── destinations/
    ├── tours/
    ├── articles/
    ├── users/
    ├── reviews/
    └── inquiries/
```

## 5. Security Architecture

```
[Client] → [JWT Token] → [API Server]
                               │
                    ┌──────────┴──────────┐
                    │                     │
              [Auth Middleware]     [Role Middleware]
                    │                     │
              Verify Token           Check Role
                    │                     │
                    ▼                     ▼
            [Attach User]          [Allow/Deny]
```

## 6. AI Feature Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Input                            │
│            "Nên đi đâu vào mùa hè?"                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Intent Detection Engine                      │
│    Keywords: [mùa hè] → season + recommend intent      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│           Knowledge Base Query Engine                    │
│    Query destinations by category, region, season        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Rule-Based Scoring Engine                   │
│    - Rating weight: 40%                                 │
│    - Review count: 20%                                  │
│    - Featured: 10%                                     │
│    - Region match: 10%                                 │
│    - Category match: 10%                               │
│    - Budget match: 10%                                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Response Generator                      │
│    Format results + match reasons + suggestions         │
└─────────────────────────────────────────────────────────┘
```
