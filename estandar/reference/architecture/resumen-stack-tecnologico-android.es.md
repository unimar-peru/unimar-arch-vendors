# Cheat Sheet del Stack Android de Referencia (Específico por Runtime)

> Alcance: este documento **no** es la política universal de arquitectura.
>
> Es una referencia rápida específica para el runtime Android / Kotlin. Las reglas transversales viven en la [Línea Base Agnóstica Universal](stack-tecnologico-autorizado-agnostico.es.md). Las alternativas por runtime viven en los perfiles [.NET](stack-tecnologico-autorizado-dotnet.es.md), [Node.js](stack-tecnologico-autorizado-nodejs.es.md) y [Android](stack-tecnologico-autorizado-android.es.md).

Esta hoja sirve como referencia de herramientas por capa arquitectónica para desarrolladores y agentes autónomos que trabajan en la implementación Android.

---

### 1. Runtime y Lenguaje

- **Entorno de Ejecución:** Kotlin JVM 1.9+
- **Lenguaje:** Kotlin
- **Calidad de Código:** Detekt + ktlint
- **Puertas de Calidad Git:** Husky + lint-staged

### 2. UI / Presentación

- **Framework UI:** Jetpack Compose
- **Navegación:** Navigation Compose
- **Gestión de Estado:** StateFlow / MutableStateFlow
- **DI / Inyección de Dependencias:** Hilt (Dagger)
- **Tema / Estilos:** Material Design 3

### 3. Capa de Red

- **Cliente HTTP:** Retrofit 2 + OkHttp
- **Serialización:** Kotlinx Serialization / Moshi
- **WebSockets:** OkHttp WebSockets
- **Autenticación:** Interceptor JWT en OkHttp

### 4. Capa de Datos Local

- **Base de Datos Local:** Room 2.6+
- **Preferencias:** DataStore (Preferences / Proto)
- **Almacenamiento de Archivos:** File system interno / cache

### 5. Capa de Dominio

- **Patrón Arquitectónico:** Clean Architecture (capas Data / Domain / Presentation)
- **Async / Streams:** Kotlin Coroutines + Flow
- **Manejo de Errores:** Patrón Result sellado (clases selladas / Either)

### 6. Estrategia de Aislamiento por Sucursal

- **Modelo de Aislamiento:** Token JWT con claims `sucursal_id`
- **Contexto de Resolución de Sucursal:** Claims extraídas del token en el interceptor de red
- **Filtrado Local:** Consultas Room filtradas por `sucursal_id` activo

### 7. Seguridad

- **Almacenamiento Seguro:** EncryptedSharedPreferences / Android Keystore
- **Biométricos:** BiometricPrompt (BiometricManager)
- **ProGuard / R8:** Ofuscación activa en builds release
- **SSL Pinning:** CertificatePinner de OkHttp

### 8. Observabilidad

- **Logging:** Timber
- **Monitoreo de Rendimiento:** Firebase Performance / metrics personalizados
- **Crash Reporting:** Firebase Crashlytics

### 9. CI / CD

- **Build:** Gradle Kotlin DSL
- **Automatización:** GitHub Actions
- **Distribución:** Firebase App Distribution / Google Play Console

### 10. Experiencia del Desarrollador (DevEx)

- **Framework de Pruebas Unitarias:** JUnit 5 + MockK
- **Pruebas de UI:** Compose Testing
- **Pruebas de Integración:** MockWebServer (OkHttp) + Testcontainers Android
- **Snapshot Testing:** Paparazzi / Roborazzi

---

[Volver al Índice](README.md)
