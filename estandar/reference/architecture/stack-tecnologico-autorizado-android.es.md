# Stack Tecnológico Autorizado: Ecosistema Android & Kotlin

**Tipo de Documento:** Apéndice de Runtime
**Prerrequisito:** DEBE leerse después de la **[Línea Base Agnóstica](stack-tecnologico-autorizado-agnostico.es.md)**.
**ADR Primario:** [ADR-0042 — Arquitectura Móvil Canónica Android](./adrs/android/0042-arquitectura-movil-canonica-android.es.md).
**Ecosistema Objetivo:** Clientes móviles con resiliencia offline, periféricos personalizados (lectores de código de barras, impresoras portátiles), aplicaciones críticas de campo en almacenes y operaciones logísticas.

---

## 1. Matriz de Cumplimiento Ejecutiva (Mandatos para Proveedores)

Todas las escuadras de ingeniería que desarrollen dentro del ecosistema Android DEBEN imponer estrictamente los artefactos autorizados a continuación. Cualquier intento de reemplazo exige un ADR aprobado ANTES de escribir código.

| Categoría | Herramienta / Framework Aprobado | Versión Validada | ¿ADR Requerido para Cambiar? | Alternativas Explícitamente Rechazadas |
| :--- | :--- | :--- | :--- | :--- |
| **Runtime Base** | **Kotlin (JVM)** | 1.9+ | **Sí** | Java (Android Nativo) |
| **Async / Streams** | **Kotlin Coroutines + Flow** | Última | **Sí** | RxJava 2/3 |
| **Arquitectura** | **MVVM + Clean Architecture** | — | **Sí** | MVC, MVP, actividades hinchadas |
| **Framework UI** | **Jetpack Compose** | Última | **Sí** | XML Views / DataBinding |
| **Inyección de Dependencias** | **Hilt (Dagger)** | Última | **Sí** | Koin (solo prototipos), manual DI |
| **Navegación** | **Jetpack Navigation Compose** | Última | **No** | Fragment Navigation, rutas manuales |
| **Base de Datos Local** | **Room** | 2.6.x+ | **No** | Realm, SQLite Raw |
| **Cifrado Local** | **SQLCipher** (para PII) | Última | **Sí** | Cifrado manual, Conceal |
| **Red / HTTP** | **Retrofit + OkHttp** | Última | **Sí** | Ktor (requiere ADR), Volley |
| **Serialización** | **Kotlinx Serialization** | Última | **No** | Gson, Moshi |
| **Carga de Imágenes** | **Coil (Compose-friendly)** | Última | **No** | Glide, Picasso |
| **Trabajos en Segundo Plano** | **WorkManager** | Última | **Sí** | Servicios en primer plano, AlarmManager |
| **Almacenamiento de Preferencias** | **DataStore (Preferences/Proto)** | Última | **No** | SharedPreferences |
| **Pruebas Unitarias** | **JUnit 5 + MockK + Turbine** | Última | **Sí** | Mockito (Java), JUnit 4 |
| **Pruebas de UI** | **Compose UI Test** | Última | **Sí** | Espresso, Robolectric (solo para lógica no-Compose) |
| **Pruebas E2E** | **Maestro** | Última | **Sí** | Detox, Appium |
| **Manejo de Errores** | **Sealed class Result\<T\> (dominio) + kotlin.Result** | — | **Sí** | Excepciones propagadas sin sellar |
| **Caché Remota** | **Redis** (vía API BFF; no directo desde móvil) | — | **Sí** | Caché local sin respaldo |
| **Observabilidad** | **Sentry** (crash reporting) + **OpenTelemetry** (traces) | Última | **Sí** | Firebase Crashlytics (solo si hay restricción de presupuesto) |
| **Linting** | **Detekt + ktlint** | Última | **No** | Android Lint únicamente |
| **Compilación** | **Gradle Kotlin DSL + Version Catalog** | Última | **Sí** | Groovy DSL, `buildSrc` (deprecado) |

---

## 2. Guía de Herramientas — Propósito, Cuándo, Por Qué y Referencias

| Herramienta | Capas (Clean Architecture) | Propósito | Cuándo usarlo | Por qué esta recomendación | ADR | Referencias / Tendencias |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Kotlin JVM** | Todas | Lenguaje moderno con null-safety, corrutinas, extensiones | Todo proyecto Android nuevo | 100% interoperable con Java; lenguaje oficial de Google para Android desde 2019 | ADR-0042 | [Kotlin Docs](https://kotlinlang.org/docs/home.html); [Google I/O 2019: Kotlin-first](https://developer.android.com/kotlin/first) |
| **Coroutines + Flow** | Todas | Async nativo sin callbacks; streams reactivos tipo-safe | Toda operación asíncrona (BD, red, UI) | Más liviano que RxJava; integración nativa con Room, Retrofit, Compose | ADR-0042 | [Kotlin Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html); tendencia 2022-2026: RxJava en declive, Coroutines/Flow estándar |
| **Jetpack Compose** | Presentación | UI declarativa reactiva con renderizado eficiente | Todas las pantallas nuevas; migración progresiva de XML Views | Menos código boilerplate; previews en IDE; estado inmutable; theming type-safe | ADR-0042 | [Jetpack Compose docs](https://developer.android.com/compose); tendencia 2023-2026: Compose es el estándar Android |
| **MVVM + Clean Architecture** | Todas | Separación de concerns: UI (View), Estado (ViewModel), Reglas (Domain), Datos (Data) | Toda aplicación Android nueva | ViewModel sobrevive cambios de configuración; Domain puro Kotlin testeable sin Android | ADR-0042 | [Guide to app architecture (developer.android.com)](https://developer.android.com/topic/architecture); Clean Architecture + MVVM es el estándar recomendado por Google |
| **Hilt (Dagger)** | Todas (DI) | Inyección de dependencias automatizada con scope definido | Toda inyección en la app (ViewModel, Repository, UseCase, OkHttp) | Dagger es el más maduro; Hilt reduce boilerplate respecto a Dagger puro | ADR-0042 | [Hilt docs](https://developer.android.com/training/dependency-injection/hilt-android); [Dagger](https://dagger.dev/); estándar DI Android 2024-2026 |
| **Room** | Data | ORM local con Flow reactivo, migraciones, SQLCipher | Persistencia de datos transaccionales offline-first | Single Source of Truth offline; consultas reactivas vía Flow; cifrado PII con SQLCipher | ADR-0042 | [Room docs](https://developer.android.com/training/data-storage/room); patrón Offline-First ver CP-09 |
| **Retrofit + OkHttp** | Data | Cliente HTTP type-safe con interceptors, logging, caching | Toda comunicación con APIs REST | Retrofit: interfaz declarativa; OkHttp: interceptors, caching, timeouts, logging | — | [Retrofit](https://square.github.io/retrofit/); [OkHttp](https://square.github.io/okhttp/); estándar de facto HTTP en Android |
| **Kotlinx Serialization** | Data | Serialización JSON/Protobuf nativa de Kotlin | Parseo de respuestas API y persistencia JSON | Compilación segura (no reflection); multiplataforma; integración Retrofit | — | [Kotlinx Serialization](https://github.com/Kotlin/kotlinx.serialization); tendencia 2024-2026: reemplaza a Gson/Moshi |
| **Coil** | Presentación | Carga de imágenes con caching, placeholders y transformaciones | Toda imagen remota en Compose | Nativo Compose (no requiere wrapper); caching en disco/memoria; SVG soportado | — | [Coil docs](https://coil-kt.github.io/coil/); tendencia 2023-2026: preferido sobre Glide por integración Compose |
| **WorkManager** | Data | Ejecución diferida de tareas en segundo plano con garantía de ejecución | Sincronización offline, subida de archivos, procesos batch | Garantiza ejecución incluso si la app se cierra; respeta restricciones de batería/red | ADR-0004 | [WorkManager docs](https://developer.android.com/topic/libraries/architecture/workmanager); esencial para resiliencia offline |
| **DataStore** | Data | Almacenamiento de preferencias con Async Flow y type safety | Preferencias de usuario, tokens no críticos, config local | Reemplaza SharedPreferences (síncrono, propenso a errores); soporta Proto DataStore para datos tipados | — | [DataStore docs](https://developer.android.com/topic/libraries/architecture/datastore); Google recomienda DataStore sobre SharedPreferences desde 2022 |
| **Sentry** | Presentación + Data | Crash reporting con contexto enriquecido y breadcrumbs | Toda aplicación en producción | Dashboard corporativo unificado; breadcrumbs automáticos con OkHttp | — | [Sentry Android](https://docs.sentry.io/platforms/android/); [OpenTelemetry Android](https://opentelemetry.io/docs/languages/android/) |
| **Detekt + ktlint** | Herramienta | Análisis estático de código Kotlin | CI/CD y pre-commit hooks | Detekt: reglas configurables de complejidad, estilo, rendimiento; ktlint: formateo obligatorio | — | [Detekt](https://detekt.dev/); [ktlint](https://pinterest.github.io/ktlint/); estándar linting Kotlin 2024-2026 |
| **Gradle Kotlin DSL + Version Catalog** | Compilación | Scripts de build type-safe + catálogo centralizado de dependencias | Todo proyecto Android nuevo | Kotlin DSL: autocompletado y compilación; Version Catalog: evita duplicación de versiones | — | [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html); [Version Catalog](https://docs.gradle.org/current/userguide/platforms.html); tendencia 2023-2026: estándar |

---

## 3. Implementación Arquitectónica (MVVM + Clean Architecture)

Para cumplir con el mandato general de [Arquitectura Hexagonal](stack-tecnologico-autorizado-agnostico.es.md#1-restricciones-ejecutivas-y-no-negociables) y el [ADR-0042](./adrs/android/0042-arquitectura-movil-canonica-android.es.md), se aplica la siguiente estructura de capas en el módulo de la aplicación:

### 3.1 Estructura de Paquetes por Capa

| Módulo / Paquete | Capa Clean Architecture | Contenido | Dependencias Permitidas | Prohibiciones |
| :--- | :--- | :--- | :--- | :--- |
| **`:domain`** | Núcleo de Dominio | Entidades puras, UseCases, Puertos (interfaces de repositorio), Result sellado | Solo Kotlin stdlib | Cero dependencias Android, Hilt, Room, Retrofit |
| **`:data`** | Capa de Datos | Implementaciones de repositorios, DAOs Room, Retrofit services, DTOs, mappers | `domain`, Room, Retrofit, Hilt, WorkManager | Sin referencias a UI o ViewModels |
| **`:presentation`** | Capa de UI | ViewModels, Compose screens, UI state, navegación | `domain`, `data`, Hilt, Compose, Navigation | Sin lógica de negocio; solo orquestación de estado |

### 3.2 Offline-First (Estrategia)

Siguiendo el [ADR-0042](./adrs/android/0042-arquitectura-movil-canonica-android.es.md), toda aplicación Android DEBE implementar el patrón **Offline-First**:

1. **Room como Single Source of Truth:** La UI observa Flow desde Room.
2. **Network-first / Cache-first:** La capa de datos decide la estrategia de sincronización.
3. **WorkManager para sincronización en segundo plano:** Las escrituras offline se encolan y sincronizan cuando hay conectividad.

```kotlin
// Repository — patrón Offline-First
class OrderRepositoryImpl @Inject constructor(
    private val db: OrderDao,
    private val api: OrderApi,
) : OrderRepository {

    // La UI observa este Flow — siempre desde Room
    override fun getOrders(sucursalId: String): Flow<List<Order>> =
        db.observeBySucursal(sucursalId)

    // Escritura local inmediata + sync asíncrona
    override suspend fun createOrder(order: Order): Result<Unit> {
        db.insert(order)
        WorkManager.getInstance().enqueue(
            OneTimeWorkRequestBuilder<SyncWorker>()
                .setConstraints(Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build())
                .build()
        )
        return Result.success(Unit)
    }
}
```

Ver Patrón Canónico CP-09 para la implementación detallada.

### 3.3 Inyección de Dependencias (Hilt)

```kotlin
@HiltAndroidApp
class UnimarApp : Application()

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { UnimarTheme { AppNavGraph() } }
    }
}

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides @Singleton
    fun provideOkHttpClient(): OkHttpClient =
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()

    @Provides @Singleton
    fun provideRetrofit(client: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(client)
            .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
            .build()
}
```

### 3.4 Manejo de Errores

Para el control de flujo de errores en la capa de dominio, DEBE utilizarse una **Sealed class Result\<T\>** que modele explícitamente los estados de éxito y error, en línea con el Patrón Canónico CP-11:

```kotlin
// :domain/Result.kt
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: DomainError) : Result<Nothing>()
}

sealed class DomainError {
    data class Network(val message: String, val cause: Throwable? = null) : DomainError()
    data class Database(val message: String, val cause: Throwable? = null) : DomainError()
    data class Validation(val errors: List<String>) : DomainError()
    data object NotFound : DomainError()
}

// Uso en UseCase
class GetOrderUseCase @Inject constructor(
    private val repo: OrderRepository
) {
    suspend operator fun invoke(orderId: String): Result<Order> {
        return try {
            val order = repo.getOrderById(orderId)
                ?: return Result.Error(DomainError.NotFound)
            Result.Success(order)
        } catch (e: IOException) {
            Result.Error(DomainError.Network("Network error", e))
        }
    }
}
```

---

## 4. Persistencia Local

### 4.1 Room — Single Source of Truth

```kotlin
@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey val id: String,
    val sucursalId: String,
    val customerName: String,
    val total: Double,
    val status: String,
    val syncedAt: Long? = null
)

@Dao
interface OrderDao {
    @Query("SELECT * FROM orders WHERE sucursalId = :sucursalId ORDER BY createdAt DESC")
    fun observeBySucursal(sucursalId: String): Flow<List<Order>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(order: OrderEntity)

    @Query("SELECT * FROM orders WHERE syncedAt IS NULL")
    suspend fun getPendingSync(): List<OrderEntity>
}
```

### 4.2 Cifrado con SQLCipher

Cuando la entidad contenga datos personales (PII) según clasificación del [ADR-0065](./adrs/dotnet/0065-pipeline-serilog-seguro-pii-dotnet.es.md) (aplicable por analogía), la base de datos DEBE usar **SQLCipher**:

```kotlin
// En RoomDatabase.Builder
Room.databaseBuilder(context, AppDatabase::class.java, "unimar.db")
    .openHelperFactory(SupportFactory(passphrase)) // SQLCipher
    .build()
```

---

## 5. Networking y Sincronización

### 5.1 Retrofit + Kotlinx Serialization

```kotlin
interface OrderApi {
    @GET("api/v1/orders")
    suspend fun getOrders(
        @Query("sucursalId") sucursalId: String
    ): List<OrderDto>

    @POST("api/v1/orders")
    suspend fun createOrder(@Body order: OrderDto): OrderDto
}
```

### 5.2 Sincronización con WorkManager

Para resiliencia offline (ver CP-12):

```kotlin
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val api: OrderApi,
    private val db: OrderDao
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val pending = db.getPendingSync()
        pending.forEach { entity ->
            try {
                api.createOrder(entity.toDto())
                db.markSynced(entity.id)
            } catch (e: Exception) {
                return Result.retry()
            }
        }
        return Result.success()
    }
}
```

---

## 6. Navegación

Usar **Jetpack Navigation Compose** con rutas tipadas:

```kotlin
sealed class Screen(val route: String) {
    object OrderList : Screen("orders")
    object OrderDetail : Screen("orders/{orderId}") {
        fun createRoute(orderId: String) = "orders/$orderId"
    }
}

@Composable
fun AppNavGraph(navController: NavHostController = rememberNavController()) {
    NavHost(navController, startDestination = Screen.OrderList.route) {
        composable(Screen.OrderList.route) { OrderListScreen(navController) }
        composable(
            Screen.OrderDetail.route,
            arguments = listOf(navArgument("orderId") { type = NavType.StringType })
        ) { backStackEntry ->
            OrderDetailScreen(backStackEntry.arguments?.getString("orderId") ?: "")
        }
    }
}
```

---

## 7. Pruebas

La pirámide de pruebas sigue el [ADR-0018](./adrs/core/0018-piramide-pruebas-gates-calidad.es.md).

| Tipo | Framework | Aislamiento | ADR |
| :--- | :--- | :--- | :--- |
| **Unitarias (Domain)** | JUnit 5 + MockK + Turbine | UseCases y ViewModel con mocks de repositorios | ADR-0052 |
| **Unitarias (Data)** | JUnit 5 + MockK | Room DAOs con base en memoria; Retrofit con MockWebServer | ADR-0052 |
| **UI (Compose)** | Compose UI Test | Pantallas Compose con ViewModel inyectado | ADR-0053 |
| **E2E** | Maestro | Flujo completo en dispositivo/emulador real | — |

```kotlin
// Ejemplo — Test de ViewModel con Turbine (Flow testing)
@Test
fun `when getOrders succeeds, state is Success`() = runTest {
    val fakeOrders = listOf(Order("1", "Test", 100.0))
    val repo = mockk<OrderRepository> {
        coEvery { getOrders(any()) } returns flowOf(fakeOrders)
    }
    val vm = OrderListViewModel(repo)
    vm.orders.test {
        assertEquals(fakeOrders, awaitItem())
    }
}
```

---

## 8. Herramientas de Compilación y Calidad

| Herramienta | Propósito | Referencia |
| :--- | :--- | :--- |
| **Gradle Kotlin DSL** | Scripts de build type-safe con autocompletado IDE | [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) |
| **Version Catalog (`libs.versions.toml`)** | Catálogo centralizado de dependencias; evita duplicación de versiones | [Gradle Version Catalog](https://docs.gradle.org/current/userguide/platforms.html) |
| **Detekt** | Análisis estático de complejidad, estilo, y rendimiento Kotlin | [Detekt](https://detekt.dev/) |
| **ktlint** | Formateo obligatorio de código Kotlin | [ktlint](https://pinterest.github.io/ktlint/) |
| **Maestro** | Pruebas E2E declarativas en dispositivo real o emulador | [Maestro](https://maestro.mobile.dev/) |

---

## 9. Advertencia Final de Integración para Proveedores

No satisfacer estas definiciones de herramientas estáticas bloqueará automáticamente la aceptación del código de integración.

-> Volver al **[Índice Maestro Global](../navigation/MASTER_INDEX.md)**

---

[Volver al Índice](README.md)
