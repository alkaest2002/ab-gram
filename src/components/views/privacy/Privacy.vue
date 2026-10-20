<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import PrivacySidebar from "@/components/views/privacy/PrivacySidebar.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------

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
            class="hidden w-full shrink-0 lg:block lg:w-64 lg:pt-6"
        >
            <PrivacySidebar />
        </aside>

        <div class="min-w-0 flex-1 space-y-8">
            <h1>Informativa privacy</h1>
            <p class="lede">
                La presente informativa descrive, ai sensi del Regolamento (UE)
                2016/679 ("GDPR"), le modalità di trattamento dei dati personali
                degli utenti che consultano questo sito. Ultimo aggiornamento:
                ottobre 2026.
            </p>

            <section class="space-y-3">
                <h2 id="titolare" class="scroll-mt-24">1. Titolare del trattamento</h2>
                <p>
                    Il titolare del trattamento è il soggetto che gestisce il
                    presente sito, contattabile all'indirizzo di posta
                    elettronica indicato nella sezione Contatti
                    (<a href="mailto:info@ab-gram.example">info@ab-gram.example</a>).
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="dati-trattati" class="scroll-mt-24">2. Dati trattati e finalità</h2>
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
                <h2 id="base-giuridica" class="scroll-mt-24">3. Base giuridica</h2>
                <p>
                    Poiché il sito non effettua alcun trattamento di dati
                    personali per proprio conto, non è necessaria una base
                    giuridica specifica. Per gli eventuali trattamenti residui
                    effettuati dai fornitori indicati al punto successivo si
                    rinvia alle rispettive informative.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="servizi-terze-parti" class="scroll-mt-24">4. Servizi di terze parti</h2>
                <h3 id="google-fonts" class="scroll-mt-24">4.1 Google Fonts</h3>
                <p>
                    Il sito utilizza i caratteri tipografici di Google Fonts. Al
                    caricamento di una pagina, il browser dell'utente si collega
                    ai server di Google per scaricare i font e può trasmettere a
                    Google dati tecnici quali l'indirizzo IP e le
                    caratteristiche del browser. Il trattamento è disciplinato
                    dalla
                    <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        informativa sulla privacy di Google
                    </a>
                    e può comportare il trasferimento dei dati al di fuori dello
                    Spazio economico europeo.
                </p>
                <h3 id="github-pages" class="scroll-mt-24">4.2 GitHub Pages (hosting)</h3>
                <p>
                    Il sito è ospitato sulla piattaforma GitHub Pages. GitHub può
                    trattare dati tecnici (ad esempio l'indirizzo IP o i log di
                    accesso) in qualità di fornitore del servizio di hosting. Per
                    maggiori informazioni si rimanda alla
                    <a
                        href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        informativa sulla privacy di GitHub
                    </a>.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="cookie" class="scroll-mt-24">5. Cookie</h2>
                <p>
                    Il sito non utilizza cookie di profilazione né strumenti di
                    analisi di terze parti e non imposta alcun cookie per proprio
                    conto.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="conservazione" class="scroll-mt-24">6. Conservazione dei dati</h2>
                <p>
                    Poiché il sito non memorizza dati personali, non è previsto
                    alcun periodo di conservazione. I dati eventualmente
                    elaborati nel browser hanno natura transitoria. La chiusura
                    del browser o il ricaricamento della pagina determina la
                    cancellazione dei dati.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="diritti-interessato" class="scroll-mt-24">7. Diritti dell'interessato</h2>
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
                <h2 id="diritto-di-reclamo" class="scroll-mt-24">8. Diritto di reclamo</h2>
                <p>
                    L'interessato che ritenga che il trattamento dei propri dati
                    avvenga in violazione del GDPR ha il diritto di proporre
                    reclamo all'autorità di controllo competente, che per
                    l'Italia è il Garante per la protezione dei dati personali.
                </p>
            </section>

            <section class="space-y-3">
                <h2 id="modifiche" class="scroll-mt-24">9. Modifiche alla presente informativa</h2>
                <p>
                    La presente informativa può essere aggiornata nel tempo, ad
                    esempio in seguito a modifiche del sito o della normativa.
                    Gli aggiornamenti saranno pubblicati su questa pagina.
                </p>
            </section>
        </div>
    </div>
</template>
