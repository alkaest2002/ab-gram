<template>
    <div class="page">
        <h1>Docs</h1>

        <section class="card">
            <h2>Struttura delle cartelle</h2>
            <ul class="list-disc pl-5">
                <li>
                    <code>components/layout</code> — intestazione, piè di
                    pagina, logo
                </li>
                <li>
                    <code>components/ui</code> — elementi d'interfaccia
                    riutilizzabili
                </li>
                <li>
                    <code>composables</code> — logica riusabile in stile
                    Composition API
                </li>
                <li><code>layouts</code> — cornice comune alle pagine</li>
                <li>
                    <code>router</code>, <code>stores</code>, <code>views</code>
                </li>
            </ul>
        </section>

        <section class="card">
            <h2>Convenzioni</h2>
            <ul class="list-disc pl-5">
                <li>Componenti in PascalCase e con nome composto</li>
                <li>Viste con suffisso <code>View</code></li>
                <li>Composable con prefisso <code>use</code></li>
                <li>
                    Store Pinia in stile options: <code>state</code>,
                    <code>getters</code>, <code>actions</code>
                </li>
            </ul>
        </section>
    </div>
</template>
