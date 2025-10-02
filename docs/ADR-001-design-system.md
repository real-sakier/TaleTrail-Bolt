# ADR-001: Design System & Token-Architektur

## Status
Akzeptiert

## Kontext
Taletrail benötigt ein konsistentes Design-System für die gesamte App, das sowohl Light- als auch Dark-Mode unterstützt und spezielle Rarity-Abstufungen für Sammelkarten bietet.

## Entscheidung

### Design-Tokens
Wir implementieren ein vollständiges Token-System mit:

- **Farben**: 6 Farb-Rampen (Primary/Secondary/Success/Warning/Error/Neutral) mit je 10 Abstufungen für beide Themes
- **Typographie**: 3 Font-Weights, 9 Font-Größen, Line-Height-System (Tight 120% / Normal 150%)
- **Spacing**: 8px-Grid-System (0-128px)
- **Radius**: 8 Abstufungen (none bis full)
- **Elevation**: 6 Shadow-Level für Tiefe

### Rarity-System
4 Seltenheitsstufen mit individuellen Farben, Gradienten und Glow-Effekten:

- **Common** (60%): Neutral-Grau
- **Rare** (25%): Blau
- **Epic** (10%): Lila
- **Legendary** (5%): Orange-Gold

Jede Stufe definiert Buff-Werte (Min/Max-Boost, Duration, Cooldown).

### UI-Primitives
Wiederverwendbare Basis-Komponenten:

- **Text**: 8 Varianten (h1-h4, body, bodyLarge/Small, caption, button)
- **Button**: 4 Varianten (primary/secondary/outline/ghost), 3 Größen, Loading-State
- **Card**: 3 Varianten (default/elevated/outlined), flexibles Padding, optional pressable
- **Badge**: Rarity-Support mit automatischen Farben, 2 Größen
- **Progress**: Animierte Progress-Bar mit Accessibility-Support

### Theme-System
React Context-basierte Theme-Provider:

- Automatischer Farbwechsel zwischen Light/Dark
- Toggle-Funktion für User-Präferenz
- TypeScript-typisierte Color-Palette

### Accessibility
- ESLint jsx-a11y Plugin aktiv
- Alle interaktiven Elemente mit accessibility-Attributen
- Progress-Komponenten mit progressbar-Role
- AA-Kontrast-Compliance

## Konsequenzen

### Positiv
- Konsistente UI über alle Features
- Type-Safe Design-Tokens
- Einfache Theme-Umschaltung
- Wiederverwendbare Komponenten reduzieren Boilerplate
- A11y von Anfang an integriert

### Negativ
- Tests mit React Native + Jest komplex (vorerst deaktiviert, später mit Expo Testing Library)
- Initiale Token-Definition erfordert Planung

## Alternativen
- Styled-System: Mehr Overhead, weniger RN-nativ
- Tailwind RN: Externe Dependency, weniger Kontrolle über Tokens

## Nächste Schritte (P2)
- Feature-Slices aufbauen (Adventure, Quests, Packs, Location)
- DI mit tsyringe einrichten
- MMKV Storage integrieren
- Tests mit Expo Testing Library nachziehen
