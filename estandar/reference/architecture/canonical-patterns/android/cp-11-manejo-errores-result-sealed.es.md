# CP-11: Manejo de Errores con Result Sealed Class

**Tipo:** Patrón Canónico — Android (Kotlin)  
**Estado:** Pendiente

> Este patrón está pendiente de documentación. Se implementará usando una sealed class `Result<T>` que modele éxito, error de red, error de BD y error de dominio como tipos de primera clase en la capa de datos.

## Problema

Las excepciones unchecked en Kotlin/Android no diferencian entre errores de red, errores de base de datos y errores de dominio. Esto dificulta que la UI reaccione adecuadamente a cada tipo de error sin try-catch dispersos.

## Patrón (por definir)

*Sealed class `Result<T>` con subtipos `Success`, `NetworkError`, `DatabaseError`, `DomainError` + mapeo en capa de datos.*

## Pendiente

- [ ] Definir sealed class `Result<T>` con subtipos
- [ ] Implementar mapeo desde Retrofit/Room a Result
- [ ] Documentar consumo desde ViewModel con `when` exhaustivo
