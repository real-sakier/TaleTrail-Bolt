# ADR-003: Location Service & Permissions

**Status**: Akzeptiert
**Datum**: 2025-10-04
**Kontext**: P3 – Location & Permissions

## Entscheidung

Wir implementieren einen **Standortservice mit Port/Adapter-Architektur** basierend auf Clean Architecture Prinzipien.

### Architektur

#### Port (Interface)
`src/core/ports/location.port.ts` definiert:
- `ILocationService`: Interface für Standortabfragen
- `LocationPosition`, `Coordinates`: Datentypen
- `PermissionStatus`: Enum (GRANTED, DENIED, UNDETERMINED)
- `LocationError`: Custom Error mit ErrorCode

#### Adapter-Implementierungen

1. **ExpoLocationAdapter** (`src/core/adapters/ExpoLocationAdapter.ts`)
   - Nutzt `expo-location` für reale Standortdaten
   - Mappt Expo-Typen auf Port-Interface
   - Für Production und echte Geräte

2. **MockLocationAdapter** (`src/core/adapters/MockLocationAdapter.ts`)
   - Liefert voreingestellte Koordinaten (Berlin, München, Hamburg, Köln)
   - Simuliert Permission-States und Fehlerszenarien
   - Für Tests, Emulator und Entwicklung

### Permission-Flow

1. **Check Permission**: Prüft aktuellen Status ohne User-Interaktion
2. **Request Permission**: Fordert Permission vom User
3. **Get Position**: Liefert Standort nur bei GRANTED-Status
4. **Error Handling**:
   - `PERMISSION_DENIED`: User hat abgelehnt
   - `LOCATION_DISABLED`: Location-Services aus
   - `POSITION_UNAVAILABLE`: GPS-Fehler
   - `TIMEOUT`: Request Timeout
   - `UNKNOWN`: Unbekannte Fehler

### Hook: useLocation

`src/features/location/hooks/useLocation.ts` bietet:

```typescript
interface UseLocationState {
  position: LocationPosition | null;
  permission: LocationPermission | null;
  isLoading: boolean;
  error: LocationError | null;
}

interface UseLocationActions {
  requestPermission: () => Promise<void>;
  getCurrentPosition: () => Promise<LocationPosition>;
  checkPermission: () => Promise<LocationPermission>;
  clearError: () => void;
}
```

### Datenquellen-Schalter

- Umgebungsvariable `EXPO_PUBLIC_DATASOURCE`:
  - `mock`: MockLocationAdapter (Berlin als Default)
  - `seed` oder `live`: ExpoLocationAdapter
- Ermöglicht Tests und Entwicklung ohne echte GPS-Hardware

### Fallbacks

- Bei Permission-Denied: Klare Fehlermeldung, kein Absturz
- Bei Location-Disabled: Hinweis auf System-Einstellungen
- Bei Timeout: Retry-Option über UI
- Mock-Adapter garantiert funktionierende Demo im Emulator

## Alternativen

- **React Native Geolocation**: Veraltet, keine Expo-Integration
- **Native APIs direkt**: Hoher Maintenance-Aufwand für iOS/Android
- **Fest kodierte Fallback-Koordinaten**: Keine Flexibilität für Tests

## Konsequenzen

### Positiv

- ✅ Port/Adapter-Architektur: Austauschbare Implementierungen
- ✅ Type-Safe: Vollständige TypeScript-Typisierung
- ✅ Testbar: Mock-Adapter für Unit-/E2E-Tests
- ✅ Fehler-Resilient: Alle Permission-States abgedeckt
- ✅ Emulator-Ready: Mock-Daten ohne echte Hardware
- ✅ Clean Architecture: Klare Abhängigkeitsrichtung (Domain → Infrastruktur)

### Negativ

- ⚠️ Zusätzliche Abstraktionsschicht
- ⚠️ Mock und Real-Adapter müssen synchron gehalten werden

## Implementierung

- Port: `src/core/ports/location.port.ts`
- Adapter: `src/core/adapters/ExpoLocationAdapter.ts`, `MockLocationAdapter.ts`
- Hook: `src/features/location/hooks/useLocation.ts`
- Demo: HomeScreen zeigt Permission-Status und Koordinaten

## Tests

- Type-Check: ✅ Erfolgreich
- ESLint: ✅ Erfolgreich
- Mock-Funktionalität: ✅ Im Emulator testbar
- Permission-Flows: Manuell im Simulator getestet

## Sicherheit & Privacy

- Permission-Request nur wenn notwendig
- Keine automatische Hintergrund-Verfolgung
- Koordinaten nur während App-Nutzung
- Keine Persistierung von Standortdaten (aktuell)
