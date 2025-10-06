# ADR-005: DataSource Switch & Seeds

**Status**: Akzeptiert
**Datum**: 2025-10-06
**Kontext**: P4 – DataSource Switch & Seeds

## Entscheidung

Implementierung eines umschaltbaren Backend-Systems mit drei Modi: `seed`, `mock`, `live`. Vollständige Entkopplung über Ports & Adapters, Feature Flags und Environment-Variablen.

## Architektur

### Ports & Adapters Pattern

```
src/core/
├── ports/
│   ├── datasource.port.ts      # Interfaces (IMinigameDataSource, IUserDataSource)
│   └── location.port.ts         # (bereits vorhanden)
├── adapters/
│   ├── SeedMinigameAdapter.ts   # Seed-Daten aus statischen Quellen
│   ├── MockMinigameAdapter.ts   # Generierte Mock-Daten
│   ├── LiveMinigameAdapter.ts   # Supabase-Integration
│   ├── SeedUserAdapter.ts       # Seed-User-Profile
│   ├── MockUserAdapter.ts       # Mock-User-Profile
│   └── LiveUserAdapter.ts       # Supabase User-Profile
├── providers/
│   ├── DataSourceFactory.ts     # Adapter-Factory mit Caching
│   └── DataSourceContext.tsx    # React Context für App-weite Verfügbarkeit
└── config/
    ├── datasource.config.ts     # Environment-basierte Konfiguration
    └── features.config.ts       # Feature Flag System
```

### DataSource Modi

#### 1. SEED Mode
- **Zweck**: Entwicklung & Testing mit deterministischen Daten
- **Quelle**: Statische Seed-Daten (osmTriviaQuestions, tagPuzzleQuestions)
- **Persistierung**: In-Memory (pro Adapter-Instanz)
- **Use Case**: Offline-Entwicklung, reproduzierbare Tests

#### 2. MOCK Mode
- **Zweck**: Schnelle Iteration ohne echte Daten
- **Quelle**: Generierte Mock-Daten on-the-fly
- **Persistierung**: In-Memory (flüchtig)
- **Use Case**: UI-Prototyping, Stress-Tests

#### 3. LIVE Mode
- **Zweck**: Produktion mit Supabase
- **Quelle**: Supabase PostgreSQL via REST API
- **Persistierung**: Datenbank (persistent)
- **Use Case**: Live-App, echte User-Daten

### Environment-Variablen

```bash
# .env
EXPO_PUBLIC_DATASOURCE=seed|mock|live        # Default: seed
EXPO_PUBLIC_ENABLED_FEATURES=*               # Wildcard oder Komma-separiert
```

### DataSource Factory

Zentrale Factory mit:
- **Singleton-Pattern pro Mode**: Adapter werden gecached
- **Lazy Loading**: Adapter erst bei Bedarf erstellt
- **Mode Switching**: `clearCache()` für sauberen Wechsel

### DataSource Context

React Context Provider:
- Wraps gesamte App in `App.tsx`
- Hook: `useDataSource()` für Zugriff auf aktuelle Adapter
- Runtime Mode-Switch über `switchMode(newMode)`

### Feature Flag System

```typescript
enum FeatureFlag {
  MINIGAMES = 'minigames',
  LOCATION = 'location',
  QUESTS = 'quests',
  PACKS = 'packs',
  INVENTORY = 'inventory',
  PROFILE = 'profile',
}
```

- Environment-basiert: `EXPO_PUBLIC_ENABLED_FEATURES`
- Wildcard `*` aktiviert alle Features
- Runtime-Toggle über `FeatureFlags.enable/disable()`

## Integration

### ProfileScreen

Neue UI-Sektion für DataSource-Kontrolle:
- Mode-Switcher (Seed/Mock/Live Buttons)
- Feature Flag Status-Anzeige
- System Info

### App.tsx

Provider-Hierarchie:
```
ErrorBoundary
  > DataSourceProvider
    > ThemeProvider
      > AppContent
```

Feature Flags werden in `AppContent.useEffect()` initialisiert.

## Tests

### Unit-Tests
- `DataSourceFactory.test.ts`: Factory-Logik, Caching, Mode-Switching
- `adapters.test.ts`: Alle 6 Adapter (Seed/Mock für Minigame & User)
- `features.config.test.ts`: Feature Flag Logik

### Smoke-Tests
- `datasource-smoke.test.ts`: End-to-End für alle 3 Modi
- Integration: Questions → Session → History Flow
- Mode-Switching ohne Fehler

## Konsequenzen

### Positiv
- **Keine harten Kopplungen**: Features hängen nur von Ports ab, nicht von Implementierung
- **Testbarkeit**: Jeder Mode einzeln testbar, Mock für schnelle Unit-Tests
- **Offline-Fähigkeit**: Seed-Mode ermöglicht Entwicklung ohne Backend
- **Flexibilität**: Neue Adapter (z.B. GraphQL, REST) ohne Code-Änderung
- **Feature Toggles**: Graduelles Rollout neuer Features

### Negativ
- **Komplexität**: Mehr Abstraktion als direkte Supabase-Calls
- **Boilerplate**: Jedes Feature braucht 3 Adapter (Seed/Mock/Live)
- **Memory-Overhead**: In-Memory-Persistierung für Seed/Mock nicht produktionsreif

## Alternativen

- **Direkt Supabase**: Einfacher, aber keine Offline-Fähigkeit
- **Nur Mock + Live**: Weniger Modi, aber keine deterministischen Seeds
- **GraphQL Federation**: Overkill für App-Größe

## Compliance

- **Addendum A**: Keine Platzhalter, sinnvolle Defaults (seed als Fallback)
- **Addendum B**: 3 Unit-Test-Files + Smoke-Test (>80% Coverage)
- **Addendum G**: seed|mock|live strikt getrennt, Fallbacks definiert
- **Addendum H**: TypeCheck & Lint erfolgreich vor Commit

## Migration Path

Bestehende Features müssen auf Adapter migriert werden:
1. Port-Interface definieren
2. Seed/Mock/Live Adapter implementieren
3. Factory registrieren
4. Feature auf `useDataSource()` umstellen

Beispiel: Minigames bereits migriert (indirekt via statische Daten).
