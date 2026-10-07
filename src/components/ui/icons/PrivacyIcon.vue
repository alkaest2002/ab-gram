<template>
    <!-- Shield: privacy/security mark.
         Left half filled white, right half dark (#888); stroke inherits currentColor. -->
    <svg
        class="size-5 shrink-0"
        viewBox="0 0 24 24"
        fill="url(#shield-half)"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="shield-half" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="white" />
                <stop offset="50%" stop-color="white" />
                <stop offset="50%" stop-color="#888" />
                <stop offset="100%" stop-color="#888" />
            </linearGradient>
        </defs>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
</template>
