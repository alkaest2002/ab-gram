<script setup>
// --- Imports ------------
//   -- From relative
import BasePage from "../BasePage.vue";

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
    <BasePage>
        <template #default>
            <div class="flex min-h-[235mm] flex-col">
                <!-- Title block, centred in the space left above the notices. -->
                <div class="mt-12">
                    <h1
                        class="mt-6 font-display text-[28pt] leading-[1.05] font-bold tracking-[-0.02em] text-ink"
                    >
                        <span
                            class="relative whitespace-nowrap after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-linear-to-r after:from-accent after:to-reject after:content-['']"
                        >
                            AB-Gram
                        </span>
                        Report
                    </h1>
                </div>

                <!-- Legal notices. -->
                <div class="space-y-8 px-10 pt-12">
                    <section class="space-y-3">
                        <h2
                            class="font-mono text-[10pt] font-semibold tracking-wide uppercase text-ink"
                        >
                            AVVISO DI RISERVATEZZA
                        </h2>
                        <p class="text-[9pt]">
                            Questo documento contiene dati personali. Se ne sei venuto in
                            possesso senza esserne il naturale destinatario, ti
                            invitiamo a interrompere la lettura, a
                            non copiarlo, diffonderlo o fotografarlo e a
                            consegnarlo al legittimo titolare, oppure a restituirlo a chi te
                            l'ha messo a disposizione.</p>
                        <p class="text-[9pt]">
                            La divulgazione o
                            l'utilizzo non autorizzato dei dati qui contenuti può
                            costituire violazione della normativa sulla
                            protezione dei dati personali (Regolamento UE
                            2016/679, GDPR).
                        </p>
                    </section>

                    <section class="space-y-3">
                        <h2
                            class="font-mono text-[10pt] font-semibold tracking-wide uppercase text-ink"
                        >
                            NOTA SUL REPORT E SULLA SUA INTERPRETAZIONE
                        </h2>
                        <p class="text-[9pt]">
                            Il presente report è stato generato automaticamente
                            dall'app AB-Gram sulla base dei dati inseriti
                            dall'utente. Gli indici, i grafici e le
                            rappresentazioni sociometriche in esso contenuti
                            hanno natura puramente descrittiva e rappresentano
                            una fotografia delle relazioni rilevate in un
                            determinato momento e contesto.
                        </p>
                        <p class="text-[9pt]">
                            La lettura e l'interpretazione di questo documento
                            richiedono competenze specifiche in ambito
                            psicologico, pedagogico o educativo. Il report non
                            costituisce una diagnosi, una valutazione clinica o
                            un giudizio sulle persone coinvolte e non deve
                            essere utilizzato come unico fondamento per decisioni
                            che le riguardano. Le informazioni qui riportate
                            vanno sempre lette alla luce di un'osservazione
                            diretta del contesto e, se necessario, integrate con
                            altri strumenti di valutazione.
                        </p>
                        <p class="text-[9pt]">
                            Gli sviluppatori di AB-Gram non rispondono di
                            interpretazioni errate o di usi impropri del
                            contenuto del report da parte di soggetti non
                            qualificati.
                        </p>
                    </section>
                </div>
            </div>
        </template>
    </BasePage>
</template>
