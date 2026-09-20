<template>
    <div
        role="status"
        class="flex w-full max-w-xl flex-col items-center gap-6 text-center"
    >
        <!-- Spinner: a faint full ring with a blue arc sweeping around it. -->
        <svg
            viewBox="0 0 64 64"
            class="size-16 shrink-0 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
        >
            <circle
                cx="32"
                cy="32"
                r="24"
                class="fill-none stroke-line stroke-2"
            />
            <path
                d="M32 8a24 24 0 0 1 24 24"
                class="fill-none stroke-accent stroke-2"
                stroke-linecap="round"
            />
        </svg>

        <div class="space-y-3">
            <p class="font-mono text-xs font-medium tracking-[0.14em] uppercase text-muted">
                Report
            </p>
            <h1>Generazione in corso</h1>
            <p class="mx-auto max-w-[46ch] text-base sm:text-[1.0625rem]">
                Il report è in fase di generazione. L'operazione può richiedere
                qualche istante.
            </p>
        </div>

        <span class="sr-only">Generazione del report in corso</span>
    </div>
</template>
