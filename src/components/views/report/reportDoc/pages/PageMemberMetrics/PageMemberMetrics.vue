<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

//   -- From relative
import BasePage from "../BasePage.vue";
import MemberEgoPlot from "./MemberEgoPlot.vue";
import MemberStats from "./MemberStats.vue";

// --- Props --------------
const props = defineProps({
    // The member this page reports on (`{ id, name, ... }`).
    member: { type: Object, default: null },
    // All the members in the report.
    members: { type: Array, default: () => [] },
    // Max members count
    maxMembersCount: { type: Number },
    // The Moreno ego plot for this member (`{ memberId, svg }`).
    egoPlot: { type: Object, default: null },
    // Individual-level Moreno metrics (likes + dislikes combined).
    morenoMetrics: { type: Object, default: () => ({}) },
    // Individual-level SNA metrics for the choice ("likes") network.
    snaMetrics: { type: Object, default: () => ({}) },
    // `getEdgeTypes` result, exposing `memberInEdges`.
    edgeTypes: { type: Object, default: () => ({}) },
    // `getSnaComponents` result for the choice ("likes") network, exposing
    // `memberInComponents`.
    likesComponents: { type: Object, default: () => ({}) },
    // `getSnaComponents` result for the rejection ("dislikes") network, exposing
    // `memberInComponents`.
    dislikesComponents: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
const receivedLikesScore = computed(() => {
  const memberId = props.member.id;
  return props.members
    .filter(m => m.id !== memberId && m.likes.includes(memberId))
    .reduce((acc, m) => {
      const idx = m.likes.indexOf(memberId);
      return acc + (props.maxMembersCount - idx);
    }, 0);
});

const receivedDislikesScore = computed(() => {
  const memberId = props.member.id;
  return props.members
    .filter(m => m.id !== memberId && m.dislikes.includes(memberId))
    .reduce((acc, m) => {
      const idx = m.dislikes.indexOf(memberId);
      return acc + (props.maxMembersCount - idx);
    }, 0);
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt] truncate">
                <span class="text-muted">Membro {{ props.member.id }} |</span>
                {{ props.member.name }}
            </h2>
        </template>

        <template #default>
            <div v-if="egoPlot?.svg" class="member-layout">
                <!-- TOP: the ego graph. -->
                <MemberEgoPlot :svg="egoPlot.svg" />

                <!-- BOTTOM: the member's metrics, shares and status. -->
                <MemberStats
                    :member-id="props.member.id"
                    :moreno-metrics="morenoMetrics"
                    :sna-metrics="snaMetrics"
                    :edge-types="edgeTypes"
                    :likes-components="likesComponents"
                    :dislikes-components="dislikesComponents"
                    :received-likes-score="receivedLikesScore"
                    :received-dislikes-score="receivedDislikesScore"
                />
            </div>

            <p v-else class="font-mono text-[9pt] text-muted italic">
                nessun grafico ego disponibile
            </p>
        </template>
    </BasePage>
</template>

<style scoped>
.member-layout {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
