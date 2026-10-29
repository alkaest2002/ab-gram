<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components
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
    <div
        class="flex w-full flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-14"
    >
        <aside
            class="hidden w-full shrink-0 lg:block lg:w-64"
        >
            <PrivacySidebar />
        </aside>

        <div class="min-w-0 flex-1 space-y-8">
            <h1>GDPR e privacy</h1>
            <p>
                La presente informativa descrive, ai sensi del Regolamento (UE)
                2016/679 ("GDPR"), le modalità di trattamento dei dati personali
                degli utenti che consultano questo sito. Ultimo aggiornamento:
                25 ottobre 2026.
            </p>

            <section class="space-y-3">
                <h2 id="titolare" class="scroll-mt-24">1 Titolare del trattamento</h2>
                <p>
                    Il titolare del trattamento è il soggetto che gestisce il
                    presente sito, contattabile all'indirizzo di posta
                    elettronica <a href="mailto:info@ab-gram.com">info@ab-gram.com</a>.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="dati-trattati" class="scroll-mt-24">2 Dati trattati e finalità</h2>
                <p>
                    Il sito non raccoglie, non trasmette e non conserva alcun
                    dato personale. Non prevede registrazioni, moduli inviati a
                    un server, banche dati o sistemi di analisi. Qualunque
                    contenuto inserito dall'utente viene elaborato
                    esclusivamente nel browser, nella memoria del dispositivo, e
                    viene perso alla chiusura o al ricaricamento della pagina.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="base-giuridica" class="scroll-mt-24">3 Base giuridica</h2>
                <p>
                    Poiché il sito non effettua alcun trattamento di dati
                    personali per proprio conto, non è necessaria una base
                    giuridica specifica. Per gli eventuali trattamenti residui
                    effettuati dai fornitori indicati al punto successivo si
                    rinvia alle rispettive informative.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="servizi-terze-parti" class="scroll-mt-24">4 Servizi di terze parti</h2>
                <h3 id="cloudflare" class="scroll-mt-24">4.1 Cloudflare (hosting e CDN)</h3>
                <p>
                    Il sito è ospitato e distribuito tramite Cloudflare, Inc.
                    (hosting e rete di distribuzione dei contenuti, CDN). Quando
                    si visita il sito, la richiesta transita attraverso
                    l'infrastruttura di Cloudflare, che può trattare
                    automaticamente alcuni dati tecnici di navigazione, quali:
                </p>
                <ul class="list-disc space-y-1 pl-6">
                    <li>l'indirizzo IP del dispositivo;</li>
                    <li>
                        le informazioni contenute nella richiesta HTTP (ad
                        esempio URL richiesto, tipo di browser e sistema
                        operativo, lingua, pagina di provenienza);
                    </li>
                    <li>data e ora della richiesta e relativo esito;</li>
                    <li>
                        dati di connessione e di sicurezza (ad esempio
                        informazioni sul protocollo TLS e segnali utili a
                        individuare traffico anomalo o malevolo).
                    </li>
                </ul>
                <p>
                    Questi dati sono trattati al solo scopo di erogare il sito,
                    garantirne la sicurezza e la disponibilità (ad esempio
                    protezione da attacchi DDoS e da traffico automatizzato) e
                    ottimizzarne le prestazioni tramite la memorizzazione
                    temporanea dei contenuti (caching) sui server più vicini
                    all'utente. Il titolare non utilizza tali dati per
                    identificare i visitatori né per finalità di profilazione o
                    marketing.
                </p>
                <p>
                    Per questo trattamento Cloudflare agisce in qualità di
                    responsabile del trattamento per conto del titolare, sulla
                    base di un accordo sul trattamento dei dati (DPA) ai sensi
                    dell'art. 28 GDPR. Per alcune attività necessarie al
                    funzionamento e alla sicurezza della propria rete globale,
                    Cloudflare può trattare i dati tecnici anche in qualità di
                    titolare autonomo. La base giuridica del trattamento è il
                    legittimo interesse a rendere il sito disponibile, sicuro e
                    funzionante (art. 6, par. 1, lett. f, GDPR).
                </p>
                <p>
                    Poiché la rete di Cloudflare è distribuita a livello
                    mondiale, i dati tecnici possono essere trattati anche in
                    Paesi al di fuori dello Spazio economico europeo, tra cui
                    gli Stati Uniti. Tali trasferimenti avvengono sulla base
                    delle garanzie previste dal GDPR, come l'adesione al
                    EU-U.S. Data Privacy Framework e le clausole contrattuali
                    standard approvate dalla Commissione europea. I tempi di
                    conservazione dei log sono stabiliti da Cloudflare e
                    descritti nella sua documentazione.
                </p>
                <p>
                    Per maggiori informazioni si rimanda alla
                    <a
                        href="https://www.cloudflare.com/privacypolicy/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        informativa sulla privacy di Cloudflare
                    </a>
                    e al
                    <a
                        href="https://www.cloudflare.com/cloudflare-customer-dpa/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Data Processing Addendum di Cloudflare
                    </a>.
                </p>

                <h3 id="discord" class="scroll-mt-24">4.2 Discord (community)</h3>
                <p>
                    Il sito contiene un collegamento al server della community
                    su Discord, servizio fornito da Discord Inc. Il semplice
                    accesso al sito non comporta alcuna comunicazione di dati a
                    Discord: il trattamento ha inizio solo se l'utente sceglie
                    di seguire il collegamento e di utilizzare la piattaforma.
                </p>
                <p>
                    Una volta su Discord, il servizio può trattare, ad esempio,
                    i dati dell'account (nome utente, indirizzo email, immagine
                    del profilo), l'indirizzo IP, le informazioni sul
                    dispositivo e sull'utilizzo del servizio, nonché i
                    contenuti pubblicati dall'utente nel server, che possono
                    essere visibili agli altri membri. Discord agisce come
                    titolare autonomo del trattamento, secondo le proprie
                    condizioni e la propria informativa. Il titolare del
                    presente sito non ha accesso ai dati di registrazione
                    dell'account Discord degli utenti e non determina le
                    modalità con cui Discord li tratta.
                </p>
                <p>
                    Discord ha sede negli Stati Uniti: i dati possono quindi
                    essere trasferiti e trattati al di fuori dello Spazio
                    economico europeo, sulla base delle garanzie indicate da
                    Discord nella propria informativa. L'utilizzo del servizio
                    è inoltre soggetto ai requisiti di età e alle condizioni
                    d'uso di Discord. L'iscrizione alla community è facoltativa
                    e non è necessaria per consultare il sito.
                </p>
                <p>
                    Per maggiori informazioni, anche sull'esercizio dei diritti
                    nei confronti di Discord, si rimanda alla
                    <a
                        href="https://discord.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        informativa sulla privacy di Discord
                    </a>
                    e alle
                    <a
                        href="https://discord.com/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        condizioni di servizio di Discord
                    </a>.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="cookie" class="scroll-mt-24">5 Cookie</h2>
                <p>
                    Il sito non utilizza cookie di profilazione né strumenti di
                    analisi di terze parti e non imposta alcun cookie per proprio
                    conto.
                </p>
                <p>
                    Tuttavia, Cloudflare (descritto al punto 4.1) può impostare
                    alcuni cookie tecnici, strettamente necessari, tramite la
                    propria infrastruttura di hosting e CDN, al fine di garantire
                    la sicurezza, l'affidabilità e il corretto funzionamento del
                    sito. Tali cookie non vengono utilizzati per identificare i
                    visitatori né per finalità di profilazione o marketing e, in
                    quanto strettamente necessari, non richiedono il consenso
                    dell'utente ai sensi della normativa applicabile.
                </p>
                <p>In particolare, possono essere impostati i seguenti cookie:</p>
                <ul class="list-disc space-y-1 pl-6">
                    <li>
                        <code>__cf_bm</code>: utilizzato per distinguere gli
                        utenti umani dai bot e proteggere il sito da traffico
                        automatizzato e malevolo;
                    </li>
                    <li>
                        <code>cf_clearance</code>: conserva la prova del
                        superamento di una verifica di sicurezza (challenge) e
                        consente di non ripetere la verifica durante la sessione;
                    </li>
                    <li>
                        <code>__cfruid</code>: cookie di sessione utilizzato
                        dalle funzioni di limitazione della velocità (rate
                        limiting) di Cloudflare per applicare le impostazioni di
                        sicurezza ai singoli client;
                    </li>
                    <li>
                        <code>__cflb</code>: utilizzato dalle funzioni di
                        bilanciamento del carico (load balancing) di Cloudflare
                        per distribuire il traffico tra i server.
                    </li>
                </ul>
                <p>
                    La durata di questi cookie varia in base alla funzione (alcuni
                    sono cookie di sessione e vengono eliminati alla chiusura del
                    browser) ed è determinata da Cloudflare. Per maggiori
                    dettagli si rimanda alla
                    <a
                        href="https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        documentazione di Cloudflare sui cookie
                    </a>.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="conservazione" class="scroll-mt-24">6 Conservazione dei dati</h2>
                <p>
                    Poiché il sito non memorizza dati personali, non è previsto
                    alcun periodo di conservazione. I dati eventualmente
                    elaborati nel browser hanno natura transitoria. La chiusura
                    del browser o il ricaricamento della pagina determina la
                    cancellazione dei dati.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="diritti-interessato" class="scroll-mt-24">7 Diritti dell'interessato</h2>
                <p>
                    Ai sensi degli articoli da 15 a 22 del GDPR, l'interessato
                    ha il diritto di chiedere l'accesso ai propri dati, la
                    rettifica, la cancellazione, la limitazione del trattamento,
                    la portabilità e l'opposizione, nonché di non essere
                    sottoposto a decisioni basate unicamente su un trattamento
                    automatizzato. Poiché il sito non tratta dati personali, tali
                    diritti possono essere esercitati, per quanto di competenza,
                    nei confronti dei fornitori di terze parti indicati al punto
                    4 o rivolgendosi al titolare per qualunque chiarimento.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="diritto-di-reclamo" class="scroll-mt-24">8 Diritto di reclamo</h2>
                <p>
                    L'interessato che ritenga che il trattamento dei propri dati
                    avvenga in violazione del GDPR ha il diritto di proporre
                    reclamo all'autorità di controllo competente, che per
                    l'Italia è il Garante per la protezione dei dati personali.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="modifiche" class="scroll-mt-24">9 Modifiche alla presente informativa</h2>
                <p>
                    La presente informativa può essere aggiornata nel tempo, ad
                    esempio in seguito a modifiche del sito o della normativa.
                    Gli aggiornamenti saranno pubblicati su questa pagina.
                </p>
            </section>
        </div>
    </div>
</template>
