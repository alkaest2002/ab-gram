<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import PrivacySidebar from "@/components/views/privacy/PrivacySidebar.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <div class="flex w-full flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-14">
    <aside class="hidden w-full shrink-0 lg:block lg:w-64">
      <PrivacySidebar />
    </aside>

    <div class="min-w-0 flex-1 space-y-8 [&>section+section]:pt-2 [&_h3]:pt-5">
      <h1>GDPR e privacy</h1>
      <p class="text-sm text-muted">
        Questa informativa spiega quali dati personali sono utilizzati quando visiti AB-Gram, usi
        l'applicazione o contatti il gestore, secondo il Regolamento (UE) 2016/679 (GDPR). Ultimo
        aggiornamento: <time datetime="2026-11-20">20 novembre 2026</time>.
      </p>
      <p>
        <span class="font-semibold">In breve</span>: i dati dei tuoi progetti vengono elaborati nel
        browser e non sono inviati al gestore. La visita al sito comporta comunque il trattamento di
        alcuni dati tecnici da parte di Cloudflare e, nella documentazione, di jsDelivr. Se scrivi
        un'email, accedi alla community o fai una donazione, vengono utilizzati anche i dati
        necessari a queste attività, come spiegato di seguito.
      </p>

      <section class="space-y-3">
        <h2 id="titolare" class="scroll-mt-24">1 Chi gestisce il sito e come contattarlo</h2>
        <p>
          Il titolare del trattamento è il gestore di AB-Gram: è il soggetto che decide come e
          perché utilizzare i dati relativi alla gestione del sito e alle richieste ricevute. Per
          domande sulla privacy o per esercitare i tuoi diritti, puoi scrivere a
          <a href="mailto:info@ab-gram.com">info@ab-gram.com</a>.
        </p>
      </section>

      <section class="space-y-3">
        <h2 id="dati-trattati" class="scroll-mt-24">2 Quali dati vengono utilizzati e perché</h2>
        <h3>Dati dei progetti</h3>
        <p>
          AB-Gram permette di inserire o importare nomi o codici dei partecipanti, preferenze e
          relazioni di gruppo, per creare sociogrammi e report. Questi contenuti e i risultati
          dell'analisi vengono elaborati sul tuo dispositivo, nella memoria del browser. Non vengono
          caricati su un server, né sono accessibili al gestore attraverso l'applicazione. Non serve
          creare un account.
        </p>
        <p>
          L'applicazione non salva automaticamente i progetti in un archivio online o nella memoria
          permanente del browser. Se scarichi un progetto o un report, il file rimane invece sul tuo
          dispositivo finché non lo elimini. Trovi maggiori dettagli sui tempi di conservazione al
          punto 6.
        </p>
        <p>
          Se utilizzi dati di altre persone, devi avere titolo per farlo e rispettare gli obblighi
          applicabili, compresi quelli di informazione e sicurezza, anche quando i dati restano sul
          tuo dispositivo. Questo vale anche per dati di studenti o minorenni. Quando possibile, usa
          codici al posto dei nomi e inserisci solo le informazioni necessarie: un codice non rende
          anonimi i dati se permette comunque di risalire a una persona. L'elaborazione locale non
          sostituisce questi obblighi.
        </p>

        <h3>Dati di navigazione</h3>
        <p>
          Per mostrarti le pagine e proteggere il sito, l'infrastruttura di Cloudflare tratta dati
          tecnici, tra cui l'indirizzo IP e le informazioni sulle richieste del browser. Questi dati
          possono essere dati personali e sono distinti dai contenuti dei tuoi progetti. Nella
          documentazione viene inoltre utilizzato jsDelivr per caricare il software che visualizza
          le formule. I due servizi sono descritti ai punti 4.1 e 4.4.
        </p>

        <h3>Messaggi e richieste di assistenza</h3>
        <p>
          Se scrivi al gestore, vengono utilizzati il tuo indirizzo email, l'eventuale nome e il
          contenuto del messaggio per risponderti e gestire la richiesta. Il collegamento email apre
          il tuo programma di posta: il messaggio viene inviato solo se scegli di spedirlo. Non
          allegare progetti, report o dati identificativi di altre persone se non sono necessari;
          per segnalare un problema, preferisci esempi con dati fittizi.
        </p>
        <p>
          Il gestore non usa i dati per pubblicità personalizzata o profilazione commerciale. I
          calcoli dell'applicazione servono a produrre le analisi che richiedi: il gestore non usa i
          risultati per prendere decisioni automatizzate sulle persone con effetti giuridici o
          analogamente significativi. Chi utilizza i report deve valutarne contenuti e limiti prima
          di prendere decisioni sui partecipanti.
        </p>
      </section>

      <section class="space-y-3">
        <h2 id="base-giuridica" class="scroll-mt-24">3 Su quali basi vengono trattati i dati</h2>
        <p>Il GDPR richiede un motivo giuridico per utilizzare dati personali. In questo caso:</p>
        <ul class="list-disc space-y-1 pl-6">
          <li>
            i dati tecnici necessari a distribuire e proteggere il sito, comprese le risorse della
            documentazione, sono trattati per il legittimo interesse del gestore a offrire un
            servizio sicuro e funzionante (art. 6, par. 1, lett. f);
          </li>
          <li>
            i dati delle email sono trattati per il legittimo interesse a rispondere alle richieste
            ricevute (art. 6, par. 1, lett. f) o, se la richiesta riguarda un contratto o misure
            precontrattuali richieste da te, per queste finalità (lett. b);
          </li>
          <li>
            gli eventuali dati ricevuti per gestire una donazione sono trattati per dare seguito al
            relativo rapporto, quando necessario alla sua esecuzione (art. 6, par. 1, lett. b), e
            per gli obblighi di legge applicabili, ad esempio contabili o fiscali (lett. c).
          </li>
        </ul>
        <p>
          I dati tecnici sono necessari per accedere al sito. Scrivere un'email, usare Discord o
          fare una donazione è facoltativo: senza i dati necessari a queste attività non è possibile
          rispondere alla richiesta o completare l'operazione, ma puoi comunque usare AB-Gram. Per i
          dati dei partecipanti elaborati localmente, chi li utilizza deve individuare la base
          giuridica adatta al proprio contesto.
        </p>
      </section>

      <section class="space-y-3">
        <h2 id="servizi-terze-parti" class="scroll-mt-24">4 Servizi esterni</h2>
        <h3 id="cloudflare" class="scroll-mt-24">4.1 Cloudflare: distribuzione e sicurezza</h3>
        <p>
          Il sito è ospitato e distribuito tramite Cloudflare, Inc. Le richieste del browser passano
          attraverso la sua rete, che può trattare:
        </p>
        <ul class="list-disc space-y-1 pl-6">
          <li>l'indirizzo IP del dispositivo;</li>
          <li>
            la pagina richiesta e le informazioni inviate dal browser, come tipo di browser, sistema
            operativo, lingua e, se trasmessa, pagina di provenienza;
          </li>
          <li>data, ora ed esito delle richieste;</li>
          <li>dati di connessione e segnali utili a rilevare bot, attacchi o altri abusi.</li>
        </ul>
        <p>
          Questi dati servono a consegnare le pagine, renderle più veloci e mantenere il sito
          disponibile e sicuro. Cloudflare può conservare copie temporanee dei contenuti del sito
          sui propri server per velocizzarne il caricamento: questo non comporta l'invio dei
          progetti elaborati nel browser.
        </p>
        <p>
          Per i trattamenti svolti per conto del gestore, Cloudflare opera come responsabile del
          trattamento secondo il proprio accordo sul trattamento dei dati (DPA), previsto dall'art.
          28 GDPR. Per alcune finalità proprie, come la sicurezza della sua rete, può operare anche
          come titolare autonomo.
        </p>
        <p>
          La rete è globale: i dati tecnici possono essere trattati anche fuori dallo Spazio
          economico europeo (SEE), inclusi gli Stati Uniti. Nel proprio DPA, Cloudflare descrive le
          garanzie previste per i trasferimenti, tra cui il Data Privacy Framework UE-USA, quando
          applicabile, e le clausole contrattuali standard approvate dalla Commissione europea.
          Trovi i dettagli sui rispettivi ambiti di applicazione nella
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            informativa privacy di Cloudflare
          </a>
          e nel suo
          <a
            href="https://www.cloudflare.com/cloudflare-customer-dpa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            accordo sul trattamento dei dati (DPA)</a
          >.
        </p>

        <h3 id="discord" class="scroll-mt-24">4.2 Discord: community</h3>
        <p>
          Il sito contiene un collegamento alla community su Discord. Non integra una chat o un
          widget Discord: visitare AB-Gram non invia dati a Discord. Se apri il collegamento, accedi
          invece a un servizio esterno, il cui uso è facoltativo.
        </p>
        <p>
          Discord tratta i dati secondo la propria informativa, come titolare autonomo. Questi
          possono includere nome utente, email, immagine del profilo, indirizzo IP, informazioni sul
          dispositivo e sull'uso del servizio, oltre ai messaggi e ai file che condividi. I
          contenuti pubblicati nella community possono essere visibili agli altri membri e ai
          moderatori. Il gestore di AB-Gram non riceve i dati di registrazione del tuo account
          tramite il sito.
        </p>
        <p>
          Discord può trattare dati fuori dal SEE, anche negli Stati Uniti, con le garanzie
          descritte nella propria informativa. Prima di usarlo, consulta la
          <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
            informativa privacy di Discord
          </a>
          e le
          <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer">
            condizioni di servizio</a
          >, che indicano anche i requisiti di età. Non pubblicare dati identificativi dei
          partecipanti o report riservati nella community.
        </p>

        <h3 id="stripe" class="scroll-mt-24">4.3 Stripe: donazioni</h3>
        <p>
          Se scegli di fare una donazione, il sito apre una pagina esterna di Stripe. AB-Gram non
          contiene moduli di pagamento e non raccoglie i dati della carta attraverso l'applicazione.
          Stripe tratta i dati necessari al pagamento, che possono includere nome, email,
          informazioni sul metodo di pagamento, importo e dati tecnici, anche per prevenire frodi e
          rispettare obblighi di legge.
        </p>
        <p>
          Il beneficiario può ricevere informazioni sulla donazione, come importo, stato del
          pagamento e dati del donatore, secondo le informazioni fornite e le impostazioni del
          servizio. Questi dati sono distinti dai progetti di AB-Gram. I ruoli di Stripe, i tempi di
          conservazione, gli eventuali trasferimenti fuori dal SEE e le relative garanzie sono
          descritti nella
          <a href="https://stripe.com/it/privacy" target="_blank" rel="noopener noreferrer">
            informativa privacy di Stripe</a
          >. La donazione non è necessaria per utilizzare il sito.
        </p>

        <h3 id="jsdelivr" class="scroll-mt-24">4.4 jsDelivr: formule nella documentazione</h3>
        <p>
          Quando apri la documentazione, il sito carica la libreria MathJax da jsDelivr, un servizio
          esterno di distribuzione di file. La libreria serve a visualizzare le formule matematiche.
          Il browser si collega a <code>cdn.jsdelivr.net</code> e comunica i dati tecnici necessari
          alla richiesta, come indirizzo IP, file richiesto e informazioni inviate dal browser. Non
          è necessario aprire un collegamento esterno: il caricamento avviene automaticamente nella
          documentazione.
        </p>
        <p>
          Il sito non invia i contenuti dei progetti a questo servizio. Per conoscere il gestore del
          servizio, i destinatari dei dati, i tempi di conservazione e le informazioni sugli
          eventuali trasferimenti internazionali, consulta la
          <a
            href="https://www.jsdelivr.com/terms/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            informativa privacy di jsDelivr</a
          >.
        </p>

        <h3>Altri collegamenti e destinatari</h3>
        <p>
          Il sito può contenere altri collegamenti esterni, ad esempio al codice sorgente su GitHub.
          Quando apri un sito esterno, si applica la sua informativa privacy. I fornitori di posta
          elettronica trattano i messaggi per recapitarli e gestire la corrispondenza. Nei casi
          previsti dalla legge, i dati possono inoltre essere comunicati alle autorità competenti.
        </p>
      </section>

      <section class="space-y-3">
        <h2 id="cookie" class="scroll-mt-24">5 Cookie</h2>
        <p>
          I cookie sono piccoli file salvati nel browser per ricordare informazioni o riconoscere
          una visita. Alcuni sono necessari al funzionamento e alla sicurezza di un servizio; altri
          servono, ad esempio, a misurarne l'uso o a personalizzare la pubblicità. Qui distinguiamo
          i cookie del sito da quelli dei servizi esterni.
        </p>
        <p>
          Puoi controllare ed eliminare i cookie dalle impostazioni del browser. Bloccare quelli
          necessari può impedire alcune funzioni o richiedere nuove verifiche di sicurezza. Per i
          cookie facoltativi dei servizi esterni, usa anche i controlli messi a disposizione da
          ciascun servizio: le preferenze espresse su una piattaforma non valgono automaticamente
          per le altre.
        </p>

        <h3 id="cookie-ab-gram" class="scroll-mt-24">5.1 Sito AB-Gram</h3>
        <p>
          L'applicazione AB-Gram non imposta cookie propri, non usa cookie di profilazione
          pubblicitaria e non integra strumenti di analisi del traffico di terze parti. I contenuti
          dei progetti sono elaborati nella memoria del browser, non nei cookie. Questo non esclude
          i cookie tecnici che possono essere impostati dall'infrastruttura Cloudflare, descritti di
          seguito.
        </p>

        <h3 id="cookie-cloudflare" class="scroll-mt-24">5.2 Cloudflare</h3>
        <p>
          Cloudflare può impostare cookie tecnici necessari alla sicurezza e al funzionamento del
          sito, a seconda delle funzionalità attive e delle verifiche richieste durante la visita.
          Tra quelli previsti dalla sua documentazione ci sono:
        </p>
        <ul class="list-disc space-y-1 pl-6">
          <li>
            <code>__cf_bm</code>: aiuta a distinguere le persone dai bot; scade dopo 30 minuti di
            inattività continua;
          </li>
          <li>
            <code>cf_clearance</code>: memorizza l'esito delle verifiche di sicurezza, per evitare
            di ripeterle finché la verifica resta valida; la durata dipende dalle impostazioni del
            servizio;
          </li>
          <li>
            <code>__cfruid</code> e <code>_cfuvid</code>: possono essere usati dalle funzioni che
            limitano il numero di richieste e distinguono i visitatori, anche quando condividono lo
            stesso indirizzo IP;
          </li>
          <li>
            <code>__cflb</code>: mantiene le richieste sullo stesso server quando è attiva questa
            funzione di bilanciamento del traffico; la durata configurabile va da pochi secondi a 24
            ore.
          </li>
        </ul>
        <p>
          Questo elenco descrive possibili cookie di Cloudflare: non significa che siano tutti
          presenti durante ogni visita. La loro presenza e durata dipendono dalle funzioni attive.
          Non sono usati dal gestore per pubblicità o per seguirti tra siti diversi. I cookie
          strettamente necessari non richiedono il tuo consenso preventivo.
        </p>
        <p>
          Per le funzioni e le durate aggiornate, consulta la
          <a
            href="https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/"
            target="_blank"
            rel="noopener noreferrer"
          >
            documentazione sui cookie di Cloudflare</a
          >.
        </p>

        <h3 id="cookie-discord" class="scroll-mt-24">5.3 Discord</h3>
        <p>
          AB-Gram contiene solo un collegamento alla community: non incorpora chat o widget di
          Discord. La semplice visita al sito non attiva cookie di Discord. Se scegli di aprire il
          collegamento e accedere alla piattaforma, Discord può usare cookie e tecnologie simili
          secondo le proprie regole e le tue preferenze.
        </p>
        <p>
          Queste tecnologie possono servire al funzionamento del servizio, alla gestione
          dell'accesso e della sicurezza, alle preferenze e ad altre finalità descritte da Discord.
          Per conoscere categorie, durate e modalità di gestione del consenso, consulta la
          <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
            informativa privacy di Discord</a
          >, che rimanda anche alla sua informativa sui cookie. Puoi usare AB-Gram senza accedere a
          Discord.
        </p>

        <h3 id="cookie-jsdelivr" class="scroll-mt-24">5.4 jsDelivr</h3>
        <p>
          Nella documentazione, AB-Gram carica automaticamente da jsDelivr la libreria MathJax per
          visualizzare le formule. L'applicazione non usa cookie per questo caricamento e non
          utilizza il CDN come strumento di profilazione o analisi dei visitatori.
        </p>
        <p>
          Anche senza cookie, la richiesta al CDN comunica dati tecnici, come l'indirizzo IP e il
          file richiesto. L'assenza di cookie non significa quindi assenza di trattamento di dati.
          Per le informazioni sul servizio e sulle sue modalità di trattamento, consulta la
          <a
            href="https://www.jsdelivr.com/terms/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            informativa privacy di jsDelivr</a
          >. Il trattamento dei dati tecnici è descritto anche al punto 4.4.
        </p>

        <h3 id="cookie-stripe" class="scroll-mt-24">5.5 Stripe</h3>
        <p>
          Il collegamento per le donazioni apre una pagina esterna di Stripe. AB-Gram non incorpora
          moduli o script di pagamento e non attiva cookie di Stripe durante la semplice visita. I
          cookie e le tecnologie di Stripe possono entrare in uso quando scegli di aprire la pagina
          di donazione, anche se poi non completi il pagamento.
        </p>
        <p>
          Stripe può usare queste tecnologie per consentire il pagamento, prevenire frodi, ricordare
          preferenze e per altre finalità indicate nelle proprie informative. Non tutti i cookie
          usati dai servizi esterni sono necessariamente tecnici: quelli facoltativi sono soggetti
          alle scelte e alle regole sul consenso applicabili sulla piattaforma. Per finalità, durate
          e controlli disponibili, consulta la
          <a href="https://stripe.com/it/privacy" target="_blank" rel="noopener noreferrer">
            informativa privacy di Stripe</a
          >, che rimanda anche alla sua informativa sui cookie. Fare una donazione è facoltativo e
          non è necessario per usare AB-Gram.
        </p>
      </section>

      <section class="space-y-3">
        <h2 id="conservazione" class="scroll-mt-24">6 Per quanto tempo restano i dati</h2>
        <ul class="list-disc space-y-1 pl-6">
          <li>
            <strong>Progetti aperti nel browser:</strong> restano nella memoria dell'applicazione
            durante l'uso. Ricaricare la pagina o chiudere la scheda normalmente fa perdere questi
            dati; non esiste una copia sul server da recuperare.
          </li>
          <li>
            <strong>File importati, scaricati o stampati:</strong> restano dove li hai salvati,
            comprese eventuali copie o backup. Chiudere AB-Gram non li elimina. Sei tu a gestirne la
            conservazione, la condivisione e la cancellazione.
          </li>
          <li>
            <strong>Dati tecnici e cookie:</strong> per Cloudflare, i tempi dipendono dal servizio
            utilizzato e dalle relative impostazioni; per jsDelivr valgono i criteri descritti nella
            sua informativa. Non coincidono necessariamente con la durata della visita o del
            progetto aperto.
          </li>
          <li>
            <strong>Email:</strong> sono conservate per il tempo necessario a gestire la richiesta e
            gli eventuali seguiti, o più a lungo quando serve per un obbligo di legge o per
            accertare, esercitare o difendere un diritto.
          </li>
          <li>
            <strong>Donazioni e servizi esterni:</strong> gli eventuali dati ricevuti dal
            beneficiario sono conservati per gestire l'operazione e per i termini richiesti dagli
            obblighi applicabili. Per i dati conservati da Stripe e Discord valgono anche i tempi e
            i criteri indicati nelle loro informative.
          </li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 id="diritti-interessato" class="scroll-mt-24">7 I tuoi diritti</h2>
        <p>Nei casi e con i limiti previsti dagli articoli da 15 a 22 del GDPR, puoi:</p>
        <ul class="list-disc space-y-1 pl-6">
          <li>sapere se vengono trattati dati che ti riguardano e ottenerne una copia;</li>
          <li>chiedere di correggere dati inesatti o completare quelli incompleti;</li>
          <li>chiedere la cancellazione o la limitazione del trattamento;</li>
          <li>
            ricevere i dati in un formato utilizzabile e trasmetterli a un altro titolare, quando è
            previsto il diritto alla portabilità;
          </li>
          <li>
            opporti, per motivi legati alla tua situazione, ai trattamenti basati sul legittimo
            interesse;
          </li>
          <li>
            non essere sottoposto a decisioni basate solo su trattamenti automatizzati che producano
            effetti giuridici o analogamente significativi, salvo le eccezioni di legge;
          </li>
          <li>
            revocare un eventuale consenso in qualsiasi momento, senza pregiudicare la liceità del
            trattamento svolto prima della revoca.
          </li>
        </ul>
        <p>
          Per i trattamenti di competenza del gestore, scrivi a
          <a href="mailto:info@ab-gram.com">info@ab-gram.com</a>. La risposta è di norma gratuita e
          arriva entro un mese dalla richiesta. Nei casi previsti dal GDPR, il termine può essere
          prorogato di altri due mesi: in tal caso riceverai una comunicazione entro il primo mese,
          con i motivi della proroga. Se necessario, potranno essere chieste solo le informazioni
          utili a verificare la tua identità.
        </p>
        <p>
          Il gestore non può recuperare o cancellare a distanza i progetti e i file rimasti sul tuo
          dispositivo. Se i tuoi dati sono stati inseriti da un'altra persona o da
          un'organizzazione, rivolgiti a chi li utilizza. Per i trattamenti che i fornitori esterni
          svolgono come titolari autonomi, puoi usare i contatti indicati nelle rispettive
          informative. Per i trattamenti svolti per conto del gestore di AB-Gram, puoi invece
          rivolgerti direttamente al gestore.
        </p>
      </section>

      <section class="space-y-3">
        <h2 id="diritto-di-reclamo" class="scroll-mt-24">8 Come presentare un reclamo</h2>
        <p>
          Se ritieni che i tuoi dati siano trattati in violazione del GDPR, puoi presentare un
          reclamo a un'autorità di controllo, in particolare nel Paese in cui vivi, lavori o dove
          ritieni sia avvenuta la violazione. In Italia puoi rivolgerti al
          <a href="https://www.garanteprivacy.it/" target="_blank" rel="noopener noreferrer">
            Garante per la protezione dei dati personali</a
          >. Non è necessario contattare prima il gestore per esercitare questo diritto.
        </p>
      </section>

      <section class="space-y-3">
        <h2 id="modifiche" class="scroll-mt-24">9 Aggiornamenti dell'informativa</h2>
        <p>
          Questa informativa può cambiare se cambiano il sito, i servizi utilizzati o le norme
          applicabili. La versione aggiornata viene pubblicata su questa pagina, con la data
          dell'ultima modifica.
        </p>
      </section>
    </div>
  </div>
</template>
