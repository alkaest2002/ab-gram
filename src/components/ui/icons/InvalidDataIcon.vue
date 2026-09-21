<template>
    <!-- Cross in a circle: the universal "invalid data" mark, in the
         app's red error colour. -->
    <svg
        viewBox="0 0 64 64"
        class="size-14 shrink-0"
        aria-hidden="true"
    >
        <circle
            cx="32"
            cy="32"
            r="23"
            class="fill-none stroke-reject stroke-[1.5]"
        />
        <path
            d="M24 24l16 16"
            class="stroke-reject stroke-[1.5]"
            stroke-linecap="round"
        />
        <path
            d="M40 24 24 40"
            class="stroke-reject stroke-[1.5]"
            stroke-linecap="round"
        />
    </svg>
</template>
