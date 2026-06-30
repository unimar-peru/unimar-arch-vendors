# CP-09: Repositorio Offline-First con Room

**Tipo:** Patrón Canónico — Android (Kotlin)  
**Estado:** Aceptado

---

## Problema

Las aplicaciones operativas industriales requieren funcionar sin conectividad. Los repositorios deben sincronizar datos locales (Room) con el servidor remoto de manera transparente para la UI.

---

## Patrón

El repositorio expone un `Flow<T>` que emite desde Room (fuente de verdad local). Las operaciones de escritura persisten primero en Room y luego sincronizan con el servidor. La UI siempre lee de Room.

```
UI (ViewModel)
     │
     ▼
Repositorio (offline-first)
     │
     ├── Room (fuente de verdad local)
     │       │
     │       └── Consumer: Flow<List<Entity>>
     │
     └── Remote (API)
             │
             └── Sincronización en segundo plano
```

---

## Implementación

```kotlin
interface ManifiestoRepository {
    fun observeManifiestos(): Flow<List<Manifiesto>>
    suspend fun registrar(manifiesto: Manifiesto): Result<Manifiesto>
}
```

```kotlin
class ManifiestoRepositoryImpl(
    private val dao: ManifiestoDao,
    private val api: ManifiestoApi,
    private val connectivity: ConnectivityChecker,
) : ManifiestoRepository {

    override fun observeManifiestos(): Flow<List<Manifiesto>> =
        dao.observeAll().map { entities -> entities.map { it.toDomain() } }

    override suspend fun registrar(manifiesto: Manifiesto): Result<Manifiesto> {
        val entity = manifiesto.toEntity(syncStatus = SyncStatus.PENDING)
        dao.insert(entity)

        if (!connectivity.isOnline()) {
            return Result.success(manifiesto) // Pendiente de sincronización
        }

        return try {
            val response = api.create(manifiesto)
            dao.updateSyncStatus(entity.id, SyncStatus.SYNCED)
            Result.success(response.toDomain())
        } catch (e: Exception) {
            dao.updateSyncStatus(entity.id, SyncStatus.FAILED)
            Result.failure(e)
        }
    }
}
```

---

## Sincronización en Background

```kotlin
class SyncWorker(
    private val dao: ManifiestoDao,
    private val api: ManifiestoApi,
) : CoroutineWorker() {

    override suspend fun doWork(): Result {
        val pending = dao.getBySyncStatus(SyncStatus.PENDING, SyncStatus.FAILED)
        for (entity in pending) {
            try {
                api.create(entity.toDomain())
                dao.updateSyncStatus(entity.id, SyncStatus.SYNCED)
            } catch (e: Exception) {
                return Result.retry()
            }
        }
        return Result.success()
    }
}
```

---

## Reglas

| Regla | Descripción |
|-------|-------------|
| Room es la única fuente de verdad local | La UI nunca lee directo de la API |
| Toda escritura persiste primero en Room | Luego sincroniza con el servidor |
| SyncStatus tracking | `PENDING` → `SYNCED` / `FAILED` |
| Worker periódico con WorkManager | Reintenta operaciones fallidas con backoff exponencial |

---

## Patrones Relacionados

- [CP-10: Almacenamiento Seguro de Tokens](cp-10-almacenamiento-seguro-tokens.es.md)
