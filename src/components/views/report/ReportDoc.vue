<template>
    <div class="w-full max-w-4xl space-y-8">
        <div class="space-y-3">
            <p class="font-mono text-xs font-medium tracking-[0.14em] uppercase text-muted">
                Report
            </p>
            <h1>Il tuo report</h1>
        </div>

        <section class="space-y-3 rounded-lg border border-line bg-canvas p-6">
            <h2>In sintesi</h2>
            <p>
                Il contenuto del report verrà mostrato qui: indici sociometrici,
                letture del sociogramma e indicazioni per il gruppo.
            </p>

            <!-- Skeleton bars: stand in for the charts and tables to come. -->
            <div class="space-y-2 pt-2" aria-hidden="true">
                <div class="h-2 w-3/4 rounded-full bg-line"></div>
                <div class="h-2 w-1/2 rounded-full bg-line"></div>
                <div class="h-2 w-2/3 rounded-full bg-line"></div>
            </div>
        </section>
    </div>
</template>
