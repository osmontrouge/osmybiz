Ausführungsreihenfolge:

1. node filter_presets

    Die Presets vom iD-Editor, presets.json, werden nach den gegebenen Gruppen gefiltert.
    Gleich danach werden auch die Fields ein bisschen aufgeräumt, damit keine doppelten Inputfelder auftauchen.

2. node addOptions

    Die zusätzlichen Fields haben noch spezielle Optionen, die in diesem File richtig geladen werden.

3. node translate

    Die gefilterten Presets werden mit dem de.json abgeglichen und übersetzt.
    Für andere Sprachen einfach Input-File ändern.