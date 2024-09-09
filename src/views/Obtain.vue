<template>
    <ContextBox>수주 현황</ContextBox>
    <ObtainSearch />
    <ObtainMain />
</template>

<script setup>
import ObtainSearch from "@/components/page/business/Obtain/ObtainSearch.vue";
import ObtainMain from "@/components/page/business/Obtain/ObtainMain.vue";
import ContextBox from "@/components/common/ContextBox.vue";

const providedValue = ref();
provide("providedValue", providedValue);
</script>
