<template>
    <!-- Warning triangle: the universal "something went wrong" mark,
         in the app's red error colour. -->
    <svg
        viewBox="0 0 64 64"
        class="size-14 shrink-0"
        aria-hidden="true"
    >
        <path
            d="M32 8 59 55 H5 Z"
            class="fill-none stroke-reject stroke-[1.5]"
            stroke-linejoin="round"
        />
        <path
            d="M32 27v14"
            class="stroke-reject stroke-[1.5]"
            stroke-linecap="round"
        />
        <circle cx="32" cy="49" r="1.6" class="fill-reject" />
    </svg>
</template>
