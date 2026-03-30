# Mystery Shopping Manager

App web per la gestione delle campagne mystery shopping CFI ed EUMETRA.

## Funzionalità

- **Estrazioni** — genera i file assegnazioni settimanali (location file + foglio 5)
- **Estrazioni verifica** — genera i file assegnazioni per le settimane di verifica
- **Assegnazioni settimanali** — compila i file verifiche con i dati rilevati dagli shopper
- **Assegnazioni verifica** — compila la sezione verifica dei file con i dati dell'export

## Deploy su Vercel (via GitHub)

### 1. Crea il repository su GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/mystery-shopping-app.git
git push -u origin main
```

### 2. Collega a Vercel

1. Vai su [vercel.com](https://vercel.com) e accedi (puoi usare il login GitHub)
2. Clicca **"Add New Project"**
3. Seleziona il repository `mystery-shopping-app`
4. Lascia tutte le impostazioni di default (è un sito statico)
5. Clicca **"Deploy"**

Vercel rileverà automaticamente che è un progetto statico e lo deploierà in ~30 secondi.

### 3. Aggiornamenti futuri

Ogni `git push` sul branch `main` triggera un redeploy automatico su Vercel.

```bash
git add .
git commit -m "descrizione modifica"
git push
```

## Struttura del progetto

```
mystery-shopping-app/
├── index.html      # interfaccia principale
├── style.css       # stili (light + dark mode)
├── app.js          # logica dell'app
├── vercel.json     # configurazione Vercel
└── README.md       # questo file
```

## Come funziona

L'app gira interamente nel browser (nessun backend). Quando premi un pulsante, costruisce un prompt strutturato con tutti i parametri configurati e lo invia a Claude, che elabora i file caricati e restituisce il file Excel scaricabile.

**Nota**: l'app è progettata per essere usata all'interno di Claude.ai. Se aperta in un browser normale, il prompt viene copiato negli appunti per poterlo incollare manualmente.
"# mystery-shopping-app" 
