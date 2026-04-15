# Gestión de Productos Financieros

Aplicación móvil desarrollada con **React Native** y **Expo** para la gestión de productos financieros bancarios. Permite listar, crear, editar y eliminar productos mediante una interfaz intuitiva conectada a una API REST.

## Stack Tecnológico

| Tecnología             | Versión   | Uso                               |
| ---------------------- | --------- | --------------------------------- |
| React Native           | 0.81.5    | Framework UI móvil                |
| Expo                   | 54        | Plataforma de desarrollo          |
| Expo Router            | 6         | Navegación basada en archivos     |
| TypeScript             | 5.9       | Tipado estático                   |
| Jest + Testing Library | 29 / 12.9 | Testing unitario y de componentes |

## Arquitectura

El proyecto sigue **Clean Architecture** con separación en capas:

```
src/
├── domain/                  # Capa de dominio (reglas de negocio)
│   ├── entities/
│   │   └── Product.ts       # Entidad Product
│   └── repositories/
│       └── ProductRepository.ts  # Interfaz del repositorio
├── data/                    # Capa de datos (implementaciones)
│   ├── config.ts            # Configuración de la API (host/puerto)
│   └── repositories/
│       └── HttpProductRepository.ts  # Implementación HTTP del repositorio
└── presentation/            # Capa de presentación
    ├── di/
    │   └── RepositoryContext.tsx  # Inyección de dependencias vía Context
    └── hooks/
        ├── useProductList.ts     # Hook para listado y búsqueda
        └── useProductForm.ts     # Hook para formulario con validación

app/                         # Pantallas (file-based routing)
├── _layout.tsx              # Layout raíz con providers
└── (products)/
    ├── index.tsx             # Listado de productos
    ├── add.tsx               # Crear producto
    └── [id]/
        ├── index.tsx         # Detalle del producto
        └── edit.tsx          # Editar producto

components/                  # Componentes reutilizables
├── ProductCard.tsx           # Tarjeta de producto en el listado
├── FormField.tsx             # Campo de formulario con validación y formato de fecha
├── DeleteModal.tsx           # Modal de confirmación de eliminación
└── SkeletonCard.tsx          # Placeholder animado durante la carga
```

## Funcionalidades

- **Listado de productos** con búsqueda por nombre y descripción
- **Creación de productos** con validación de campos (longitud, formato de fecha, verificación de ID único)
- **Edición de productos** con campos prellenados
- **Eliminación de productos** con modal de confirmación
- **Fecha de revisión automática** calculada a +1 año desde la fecha de liberación
- **Skeleton loading** animado mientras se cargan los datos
- **Soporte tema claro/oscuro** automático
- **Tipografía personalizada** con Roboto Slab

## Requisitos Previos

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- API REST de productos corriendo en el puerto **3002** (el host se ajusta automáticamente según la plataforma: `localhost` para iOS/web, `10.0.2.2` para emulador Android)

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd pruebaReactNative

# Instalar dependencias
npm install
```

## Ejecución

```bash
# Iniciar el servidor de desarrollo
npx expo start

# Ejecutar directamente en una plataforma
npm run android
npm run ios
npm run web
```

## Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

El proyecto requiere un mínimo de **70%** de cobertura en statements, branches, functions y lines.

### Archivos de test

| Archivo                                                         | Qué cubre                       |
| --------------------------------------------------------------- | ------------------------------- |
| `src/data/repositories/__tests__/HttpProductRepository.test.ts` | Repositorio HTTP (fetch mock)   |
| `src/presentation/hooks/__tests__/useProductList.test.ts`       | Hook de listado y filtrado      |
| `src/presentation/hooks/__tests__/useProductForm.test.ts`       | Hook de formulario y validación |
| `components/__tests__/components.test.tsx`                      | Componentes de UI               |

## API

La aplicación consume los siguientes endpoints (`http://<host>:3002/bp/products`):

| Método   | Endpoint                        | Descripción                  |
| -------- | ------------------------------- | ---------------------------- |
| `GET`    | `/bp/products`                  | Obtener todos los productos  |
| `GET`    | `/bp/products/:id`              | Obtener producto por ID      |
| `POST`   | `/bp/products`                  | Crear producto               |
| `PUT`    | `/bp/products/:id`              | Actualizar producto          |
| `DELETE` | `/bp/products/:id`              | Eliminar producto            |
| `GET`    | `/bp/products/verification/:id` | Verificar si un ID ya existe |

## Scripts Disponibles

| Script          | Comando                | Descripción                      |
| --------------- | ---------------------- | -------------------------------- |
| `start`         | `expo start`           | Inicia el servidor de desarrollo |
| `android`       | `expo start --android` | Inicia en emulador Android       |
| `ios`           | `expo start --ios`     | Inicia en simulador iOS          |
| `web`           | `expo start --web`     | Inicia en navegador web          |
| `test`          | `jest`                 | Ejecuta los tests                |
| `test:coverage` | `jest --coverage`      | Tests con reporte de cobertura   |
| `lint`          | `expo lint`            | Ejecuta el linter                |
