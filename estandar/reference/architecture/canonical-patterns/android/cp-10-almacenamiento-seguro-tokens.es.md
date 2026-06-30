# CP-10: Almacenamiento Seguro de Tokens

**Tipo:** Patrón Canónico — Android (Kotlin)  
**Estado:** Aceptado

---

## Problema

Las aplicaciones Android almacenan tokens JWT, refresh tokens y credenciales de sesión. SharedPreferences estándar no es seguro. Se necesita un mecanismo cifrado que cumpla con políticas de seguridad corporativas.

---

## Patrón

Usar `EncryptedSharedPreferences` para persistencia cifrada en reposo y `Android Keystore` para el material criptográfico. Se define un `TokenRepository` que abstrae el almacenamiento y renovación de tokens.

```
TokenRepository
     │
     ├── EncryptedSharedPreferences   (cifrado AES-256 en reposo)
     │       │
     │       └── Master Key en Android Keystore (hardware-backed)
     │
     └── TokenInterceptor (OkHttp)    →  inyecta Bearer token en requests
```

---

## Implementación

```kotlin
class TokenRepository(context: Context) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs = EncryptedSharedPreferences.create(
        context,
        "secure_token_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
    )

    fun saveTokens(accessToken: String, refreshToken: String) {
        prefs.edit()
            .putString(KEY_ACCESS, accessToken)
            .putString(KEY_REFRESH, refreshToken)
            .apply()
    }

    fun getAccessToken(): String? = prefs.getString(KEY_ACCESS, null)

    fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH, null)

    fun clear() {
        prefs.edit().clear().apply()
    }

    private companion object {
        const val KEY_ACCESS = "access_token"
        const val KEY_REFRESH = "refresh_token"
    }
}
```

---

## Token Interceptor OkHttp

```kotlin
class TokenInterceptor(
    private val tokenRepo: TokenRepository,
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val token = tokenRepo.getAccessToken()
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            chain.request()
        }
        return chain.proceed(request)
    }
}
```

---

## Reglas

| Regla | Descripción |
|-------|-------------|
| `EncryptedSharedPreferences` obligatorio | No usar `SharedPreferences` estándar ni DataStore para tokens |
| Master Key en Keystore | Aprovecha hardware-backed storage cuando esté disponible |
| Tokens en memoria solo durante el request | No cachear en propiedades estáticas persistentes |
| Clear en logout | Eliminar todos los tokens al cerrar sesión |

---

## Patrones Relacionados

- [CP-09: Repositorio Offline-First con Room](cp-09-repositorio-offline-first-room.es.md)
