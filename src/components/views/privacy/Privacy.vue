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
            <h1>Informativa privacy</h1>
            <p>
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
                <h3 id="cloudflare" class="scroll-mt-24">4.1 Cloudflare (hosting e CDN)</h3>
                <p>
                    Il sito è ospitato e distribuito tramite Cloudflare (hosting
                    e rete di distribuzione dei contenuti, CDN), che può trattare
                    dati tecnici (ad esempio l'indirizzo IP o i log di accesso)
                    necessari per la sicurezza e la distribuzione dei contenuti.
                    Per maggiori informazioni si rimanda alla
                    <a
                        href="https://www.cloudflare.com/privacypolicy/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        informativa sulla privacy di Cloudflare
                    </a>.
                </p>

                <h3 id="discord" class="scroll-mt-24">4.2 Discord (community)</h3>
                <p>
                    Tramite il sito è possibile accedere al server della community
                    su Discord. Discord può trattare dati personali (ad esempio
                    l'indirizzo IP, i dati dell'account o le informazioni relative
                    all'utilizzo del servizio) in qualità di titolare autonomo del
                    trattamento. Per maggiori informazioni si rimanda alla
                    <a
                        href="https://discord.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        informativa sulla privacy di Discord
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
