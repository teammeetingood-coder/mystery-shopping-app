// ──────────────────────────────────────────────
//  Mystery Shopping Manager — app.js
// ──────────────────────────────────────────────

// Dati predefiniti shopper
const DEFAULT_SHOPPERS = {
  CFI: [
    ['1100','GENOVA',   'SOGEGROSS',           'iolcese'],
    ['1101','CATANIA',  'ALTASFERA',            'rrapisarda'],
    ['1102','ROMA',     'AUREKA',               'ldesimone'],
    ['1103','SALERNO',  'MODERNA CASH & CARRY', 'strapane'],
    ['1104','CAGLIARI', 'CENTRO CASH',          'ILAI'],
    ['1108','FIRENZE',  'TOSANO Calenzano',     'ssettime'],
    ['1106','BARI',     'ALTASFERA',            'atest'],
    ['1107','FIRENZE',  'SOGEGROSS',            'pandrenelli'],
  ],
  EUMETRA: [
    ['11','NICHELINO', 'DOCKS',     'abarone'],
    ['02','BOLOGNA',   'C+C',       'gcinquemani'],
    ['16','VERONA',    'TOSANO',    'mcovre'],
    ['12','TRIESTE',   'C+C',       'hbotteri'],
    ['31','PIACENZA',  'C+C',       'mielo'],
    ['25','NERVIANO',  'SOGEGROSS', 'Acoluccia'],
    ['21','ORZINUOVI', 'SOGEGROSS', 'lbresciani'],
    ['22','SEGRATE',   'MIGROSS',   'vspadoni1'],
    ['07','MUGGIO',    'C+C',       'vspadoni1'],
  ]
};

const DEFAULT_SHOPPERS_VERIFICA = {
  CFI: [
    ['101','CATANIA',  'ALTASFERA',            'rrapisarda'],
    ['102','ROMA',     'AUREKA',               'mpiacentini'],
    ['103','SALERNO',  'MODERNA CASH & CARRY', 'Strapane'],
    ['104','CAGLIARI', 'CENTRO CASH',          'ccapra'],
    ['106','BARI',     'ALTASFERA',            'ltursi'],
    ['107','FIRENZE',  'SOGEGROSS',            'Pbattini1'],
    ['108','GENOVA',   'SOGEGROSS',            'Iolcese'],
  ],
  EUMETRA: [
    ['07','MUGGIO',    'C+C',       'vspadoni1'],
    ['02','BOLOGNA',   'C+C',       'agentile'],
    ['16','VERONA',    'TOSANO',    'mcovre'],
    ['12','TRIESTE',   'C+C',       'hbotteri'],
    ['11','NICHELINO', 'DOCKS',     'abarone'],
    ['16','VERONA',    'TOSANO',    'gmargon'],
    ['25','NERVIANO',  'SOGEGROSS', 'vspadoni1'],
  ]
};

// ── Navigazione tab ──
function switchTab(id, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}

// ── Upload file ──
function triggerUpload(inputId) {
  document.getElementById(inputId).click();
}

function fileChosen(input, zoneId) {
  const zone = document.getElementById(zoneId);
  const file = input.files[0];
  const name = file ? file.name : '';
  zone.classList.toggle('has-file', !!name);
  zone.querySelector('.uz-label').textContent = name ? 'File caricato' : 'Carica file';
  const nameEl = zone.querySelector('.uz-name');
  nameEl.textContent = name;
  nameEl.style.display = name ? 'block' : 'none';
}

// ── Shopper table ──
function addShopperRow(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="es. 1100"></td>
    <td><input type="text" placeholder="es. GENOVA"></td>
    <td><input type="text" placeholder="es. SOGEGROSS"></td>
    <td><input type="text" placeholder="username"></td>
    <td><button class="del-row-btn" onclick="this.closest('tr').remove()" title="Rimuovi">✕</button></td>`;
  tbody.appendChild(tr);
  tr.querySelector('input').focus();
}

function fillShopperTable(tbodyId, data) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';
  data.forEach(([code, zona, pv, sh]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${code}"></td>
      <td><input type="text" value="${zona}"></td>
      <td><input type="text" value="${pv}"></td>
      <td><input type="text" value="${sh}"></td>
      <td><button class="del-row-btn" onclick="this.closest('tr').remove()" title="Rimuovi">✕</button></td>`;
    tbody.appendChild(tr);
  });
}

function getShopperData(tbodyId) {
  return Array.from(document.querySelectorAll(`#${tbodyId} tr`)).map(tr => {
    const inputs = tr.querySelectorAll('input');
    return {
      pv_code: inputs[0]?.value?.trim() || '',
      zona:    inputs[1]?.value?.trim() || '',
      pv_nome: inputs[2]?.value?.trim() || '',
      shopper: inputs[3]?.value?.trim() || ''
    };
  }).filter(r => r.pv_code);
}

// ── Update UI al cambio cliente ──
function updateEstrazioneUI() {
  const cliente = document.getElementById('est-cliente').value;
  document.getElementById('est-visita-row').style.display = cliente ? 'grid' : 'none';
  if (cliente && DEFAULT_SHOPPERS[cliente]) {
    fillShopperTable('shopper-body-est', DEFAULT_SHOPPERS[cliente]);
  }
  // Suggerisci campagna
  if (cliente === 'CFI') document.getElementById('est-campagna').placeholder = 'es. CFI_APRILE_VISITA01';
  if (cliente === 'EUMETRA') document.getElementById('est-campagna').placeholder = 'es. EUMETRA_APR_VISITA01';
}

// ── Status ──
function showStatus(id, type, msg) {
  const el = document.getElementById(id);
  el.className = 'status-bar ' + type;
  el.textContent = msg;
}

// ── Costruttori prompt ──
function buildEstrazioniPrompt() {
  const cliente  = document.getElementById('est-cliente').value;
  const campagna = document.getElementById('est-campagna').value;
  const anno     = document.getElementById('est-anno').value;
  const mese     = document.getElementById('est-mese').value;
  const visita   = document.getElementById('est-visita').value;
  const periodo  = document.getElementById('est-periodo').value;
  const shoppers = getShopperData('shopper-body-est');

  const shopperLines = shoppers.map(s =>
    `  - PV ${s.pv_code} | ${s.zona} | ${s.pv_nome} → shopper: ${s.shopper}`
  ).join('\n');

  const hasExport = document.querySelector('#uz-export-prec.has-file');

  return `Genera il file assegnazioni ${cliente} con questi parametri:

CONFIGURAZIONE:
- Cliente: ${cliente}
- Anno: ${anno} | Mese: ${mese} | Visita: ${visita}
- Campagna: ${campagna}
- Periodo address location file: ${periodo}

SHOPPER PER PDV:
${shopperLines}

ISTRUZIONI:
- Usa il basket prodotti caricato per i prodotti da rilevare
- Usa l'elenco PRG per associare i progressivi (assegna da 3000 per i codici mancanti)
- Usa il template assegnazioni come struttura base
- Store ID formato ${cliente === 'CFI' ? 'ANNO_MESE_[visita][PV_code[1:]]' : 'ANNO_MESE_[visita][PV_code]'}
- Applica la flag "x" automaticamente per i prodotti primo prezzo/prezzo più basso
${hasExport ? '- Aggancia i prezzi precedenti dall\'export caricato (usa il più recente per zona+codice)' : '- Nessun export prezzi fornito, lascia PREZZO PRECEDENTE vuoto'}`;
}

function buildVerificaPrompt() {
  const cliente  = document.getElementById('ver-cliente').value;
  const campagna = document.getElementById('ver-campagna').value;
  const anno     = document.getElementById('ver-anno').value;
  const mese     = document.getElementById('ver-mese').value;
  const prg      = document.getElementById('ver-prg').value;
  const periodo  = document.getElementById('ver-periodo').value;
  const shoppers = getShopperData('shopper-body-ver');

  const shopperLines = shoppers.map(s =>
    `  - PV ${s.pv_code} | ${s.zona} | ${s.pv_nome} → shopper: ${s.shopper}`
  ).join('\n');

  return `Genera il file assegnazioni VERIFICA per ${cliente}:

CONFIGURAZIONE:
- Cliente: ${cliente}
- Anno: ${anno} | Mese: ${mese}
- PRG verifica (fisso): ${prg}
- Campagna: ${campagna}
- Address location file: ${periodo}
- Store ID formato: ${anno}_${mese}_${prg}[PV_CODE]

SHOPPER PER PDV:
${shopperLines}

ISTRUZIONI:
- Usa il file verifiche con i prezzi rilevati come PREZZO PRECEDENTE
- Usa l'elenco PRG per i progressivi
- Usa il template assegnazioni come struttura base
- Applica flag "x" automaticamente dove descrizione/note contengono: PREZZO PIÙ BASSO, PRIMO PREZZO, PIU' BASSO, PREZZO AL KG PIU`;
}

function buildAssegnazioniPrompt() {
  const cliente  = document.getElementById('ass-cliente').value;
  const campagna = document.getElementById('ass-campagna').value;

  return `Compila il file verifiche ${cliente} con i dati dell'export Shopmetrics.

CAMPAGNA: ${campagna}

ISTRUZIONI:
- Chiave di join: ZONA COMPETITOR + PUNTO VENDITA COMPETITOR + CODICE ARTICOLO (6 cifre zfill)
- NUOVO PREZZO RILEVATO: prezzo numerico dall'export (vuoto se ASSENTE o ALTRO FORMATO con prezzo = 0)
- PRESENZA (colonna .1): vuoto=PRESENTE, 1=IN PROMOZIONE, 0=ASSENTE, 2=ALTRO FORMATO
- ASSENTE (colonna .1): 1=NON IN ASSORTIMENTO, 2=NON PRESENTE A SCAFFALE, 3=DESCRIZIONE NON CHIARA (solo se ASSENTE)
- NOTE.2: unione di "Brand primo prezzo/ALTRO FORMATO" + "Nota" shopper separati da " | "
- Color coding celle compilate: verde=presente, giallo=promo, rosso=assente, arancio=altro formato`;
}

function buildAssVerificaPrompt() {
  const cliente  = document.getElementById('assv-cliente').value;
  const campagna = document.getElementById('assv-campagna').value;
  const hasPrec  = document.querySelector('#uz-assv-prec.has-file');

  return `Compila il file verifiche ${cliente} con i dati dell'export verifica Shopmetrics.

CAMPAGNA: ${campagna}

ISTRUZIONI:
- Stessa logica delle assegnazioni settimanali
- Compila le colonne della sezione verifica: NUOVO PREZZO RILEVATO, PRESENZA.1, ASSENTE.1, NOTE.2
- Chiave di join: ZONA COMPETITOR + PUNTO VENDITA COMPETITOR + CODICE ARTICOLO (6 cifre zfill)
- PRESENZA.1: vuoto=PRESENTE, 1=IN PROMOZIONE, 0=ASSENTE, 2=ALTRO FORMATO
- ASSENTE.1: 1=NON IN ASSORTIMENTO, 2=NON PRESENTE A SCAFFALE, 3=DESCRIZIONE NON CHIARA
- NOTE.2: unione Brand + Nota
- Color coding sulle 4 celle compilate
${hasPrec ? '- Aggiorna PREZZO PRECEDENTE con il prezzo più recente dall\'export precedente caricato (usa timestamp per scegliere il più recente per zona+codice)' : ''}`;
}

// ── Validazione e invio ──
function validate(requiredIds, statusId) {
  for (const id of requiredIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.tagName === 'SELECT' && !el.value) {
      showStatus(statusId, 'error', 'Seleziona il cliente prima di procedere.');
      return false;
    }
    if (el.tagName === 'INPUT' && !el.value.trim()) {
      const label = el.previousElementSibling?.textContent || id;
      showStatus(statusId, 'error', `Campo obbligatorio mancante: ${label}`);
      el.focus();
      return false;
    }
  }
  return true;
}

function runEstrazioni() {
  if (!validate(['est-cliente', 'est-campagna', 'est-anno', 'est-mese'], 'status-est')) return;
  showStatus('status-est', 'info', 'Invio configurazione a Claude — carica i file nella finestra di chat e attendi la risposta...');
  sendPromptDelayed(buildEstrazioniPrompt(), 'status-est');
}

function runVerifica() {
  if (!validate(['ver-cliente', 'ver-campagna', 'ver-anno', 'ver-mese'], 'status-ver')) return;
  showStatus('status-ver', 'info', 'Invio configurazione a Claude...');
  sendPromptDelayed(buildVerificaPrompt(), 'status-ver');
}

function runAssegnazioni() {
  if (!validate(['ass-cliente', 'ass-campagna'], 'status-ass')) return;
  showStatus('status-ass', 'info', 'Invio istruzioni a Claude...');
  sendPromptDelayed(buildAssegnazioniPrompt(), 'status-ass');
}

function runAssVerifica() {
  if (!validate(['assv-cliente', 'assv-campagna'], 'status-assv')) return;
  showStatus('status-assv', 'info', 'Invio istruzioni a Claude...');
  sendPromptDelayed(buildAssVerificaPrompt(), 'status-assv');
}

// Piccolo delay per far vedere lo status prima del prompt
function sendPromptDelayed(prompt, statusId) {
  setTimeout(() => {
    if (typeof sendPrompt === 'function') {
      sendPrompt(prompt);
    } else {
      // Fuori da Claude.ai: mostra il prompt in un alert o lo copia negli appunti
      navigator.clipboard?.writeText(prompt).then(() => {
        showStatus(statusId, 'success', 'Prompt copiato negli appunti! Incollalo in Claude.ai per procedere.');
      }).catch(() => {
        console.log('PROMPT:\n', prompt);
        showStatus(statusId, 'info', 'Prompt generato — controlla la console del browser (F12).');
      });
    }
  }, 300);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Avvisa se file input viene cliccato dall'overlay già gestito
  document.querySelectorAll('.upload-zone input[type="file"]').forEach(input => {
    input.addEventListener('click', e => e.stopPropagation());
  });
});
