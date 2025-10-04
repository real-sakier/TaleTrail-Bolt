# ADR-002: Navigation-Architektur

**Status**: Akzeptiert
**Datum**: 2025-10-04
**Kontext**: P2 – Navigation/Shell

## Entscheidung

Wir verwenden **React Navigation 6.x** mit folgender Architektur:

### Navigator-Struktur

- **RootNavigator** (NativeStackNavigator): Verwaltet Top-Level-Routen
  - `Main`: Haupt-Tab-Navigation (keine Header)
  - `CardDetail`: Detail-Ansicht mit Rücknavigation

- **TabNavigator** (BottomTabNavigator): Haupt-Tabs der App
  - `Home`: Startseite / Dashboard
  - `Quests`: Quest-Übersicht
  - `Packs`: Pack-Verwaltung
  - `Profile`: Profil & Statistiken

### Type-Safety

- Alle Routen sind in `types.ts` typisiert (`RootStackParamList`, `MainTabParamList`)
- Globale TypeScript-Deklaration für autocomplete in der gesamten App
- Typed Navigation Hooks (`useNavigation`, `useRoute`)

### Deep-Linking

- Konfiguration in `linking.ts`
- Unterstützte Schemas: `taletrail://` und `https://taletrail.app`
- Routen:
  - `/home`, `/quests`, `/packs`, `/profile`
  - `/card/:cardId` für Karten-Details

### Error Handling

- `ErrorBoundary`-Komponente fängt React-Fehler app-weit ab
- Zeigt benutzerfreundliche Fehlermeldung
- Im Dev-Mode: zusätzliche Error-Details
- "Erneut versuchen"-Button zum Reset

### Theme-Integration

- Navigator nutzt `useTheme()` für konsistente Farben
- Header-Styles passen sich an Light/Dark-Mode an
- Tab-Bar-Farben folgen Design-Tokens

## Alternativen

- **Expo Router**: Zu neu, weniger stabil für Production
- **React Router Native**: Weniger React Native-spezifisch

## Konsequenzen

### Positiv

- ✅ Type-safe Navigation
- ✅ Deep-Linking out-of-the-box
- ✅ State-Persistenz beim Tab-Wechsel
- ✅ ErrorBoundary schützt vor App-Abstürzen
- ✅ Theme-konsistent
- ✅ Platform-agnostisch (iOS/Android)

### Negativ

- ⚠️ Zusätzliche Dependencies (~24 Packages)
- ⚠️ Lernkurve für komplexere Navigationsszenarien

## Implementierung

- Struktur: `src/app/navigation/`
- Screens: `src/app/screens/`
- ErrorBoundary: `src/shared/ui/ErrorBoundary.tsx`

## Tests

- Type-Check: ✅ Erfolgreich
- ESLint: ✅ Erfolgreich
- Unit-Tests: Konfiguration folgt in P3
- Smoke-Test: Manuell im Simulator
