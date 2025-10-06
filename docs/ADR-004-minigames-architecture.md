# ADR-004: Minigames-Architektur (ohne Bewegung)

**Status**: Akzeptiert
**Datum**: 2025-10-06
**Kontext**: P3.5 – Home & Mini-Spiele (ohne Bewegung)

## Entscheidung

Implementierung von zwei Minigames (OSM-Trivia und Tag-Puzzle) für Beschäftigung zuhause mit XP-Rewards.

## Architektur

### Feature-Struktur

```
src/features/minigames/
├── types.ts                 # Domain-Typen (MinigameType, Difficulty, Session, Result)
├── services/
│   └── MinigameService.ts   # Business-Logik (Session-Management, Scoring)
├── data/
│   ├── osmTriviaQuestions.ts    # OSM-Trivia Fragenkatalog
│   └── tagPuzzleData.ts         # Tag-Puzzle Fragenkatalog
├── components/
│   ├── MinigameCard.tsx         # Minigame-Auswahl-Karte
│   └── QuestionView.tsx         # Fragen-UI & Ergebnis-Ansicht
├── hooks/
│   └── useMinigame.ts           # React-Hook für State-Management
└── __tests__/
    └── MinigameService.test.ts  # Unit-Tests für Scoring
```

### Minigame-Typen

1. **OSM-Trivia**: Multiple-Choice-Fragen über OpenStreetMap Tags
2. **Tag-Puzzle**: "Finde den passenden Tag" - Matching-Game

### Schwierigkeitsgrade

- **EASY**: 10 XP pro richtiger Antwort, Speed-Bonus < 60s
- **MEDIUM**: 20 XP pro richtiger Antwort, Speed-Bonus < 90s
- **HARD**: 30 XP pro richtiger Antwort, Speed-Bonus < 120s

### Reward-System

- **Basis-XP**: Difficulty × korrekte Antworten
- **Perfect Score Bonus**: +50 XP bei 100% Genauigkeit
- **Speed Bonus**: +25 XP bei Perfect + unter Zeitlimit
- **Session**: 5 zufällige Fragen pro Spiel

## Technische Details

### MinigameService

Stateless Service mit folgenden Methoden:
- `startSession(type, difficulty)`: Erstellt neue Session mit 5 zufälligen Fragen
- `answerQuestion(session, questionId, answer)`: Verarbeitet Antwort, aktualisiert Score
- `completeSession(session)`: Berechnet Ergebnis & Rewards

### Scoring-Logik

```typescript
baseXP = correctAnswers × BASE_XP[difficulty]
bonus = perfectScoreBonus (50) + speedBonus (25)
total = baseXP + bonus
```

### UI-Integration

- **HomeScreen**: Neue "Minispiele"-Section mit 4 MinigameCards
- **QuestionView**: Modal mit Fragen, Progress, Ergebnis & Rewards
- **State**: React Hook `useMinigame` für lokales State-Management

## Konsequenzen

### Positiv

- Spieler können zuhause XP sammeln (ohne Bewegung)
- Wissensvermittlung über OSM-Tags
- Klare Trennung von Daten, Logik und UI
- Testbare Business-Logik (11 Unit-Tests)
- Erweiterbar für neue Minigame-Typen

### Negativ

- Statische Fragenkataloge (keine dynamische Generierung)
- Keine Persistierung von High Scores (in P3.5 nicht gefordert)
- Kein Multiplayer oder Bestenlisten

## Alternativen

- **Dynamische Fragen**: Overpass API könnte Live-Fragen generieren (zu komplex für P3.5)
- **Persistierung**: Supabase für High Scores (nicht im Scope)
- **Adaptive Difficulty**: KI-basierte Schwierigkeitsanpassung (Overkill)

## Compliance

- **Addendum A**: Keine Platzhalter, sinnvolle Defaults
- **Addendum B**: 11 Unit-Tests für Scoring-Logik (>80% Coverage)
- **Addendum E**: Design-Tokens & Primitives genutzt
- **Addendum F**: ADR dokumentiert Entscheidungen
