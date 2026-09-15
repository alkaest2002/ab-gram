<script setup>
import PageTransition from "@/components/ui/PageTransition.vue";
import SociogramNavigation from "@/components/sociogram/SociogramNavigation.vue";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

const {
    currentIndex,
    hasPrevious,
    hasNext,
    canGoNext,
    goPrevious,
    goNext,
    restart,
} = useSociogramNavigation();
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>
        <router-view v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </router-view>
        <SociogramNavigation
            :show-previous="hasPrevious"
            :show-next="hasNext"
            :show-restart="currentIndex > 0"
            :enable-previous="true"
            :enable-next="canGoNext"
            :enable-restart="true"
            @sociogram-step-previous="goPrevious"
            @sociogram-step-next="goNext"
            @sociogram-step-restart="restart"
        />
    </div>
</template>
