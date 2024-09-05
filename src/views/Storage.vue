<template>
    <ContextBox>창고 현황</ContextBox>
    <StorageSearch />
    <StorageMain />
</template>

<script setup>
import StorageMain from "@/components/page/Executives/Storage/StorageMain.vue";
import StorageSearch from "@/components/page/Executives/Storage/StorageSearch.vue";
import ContextBox from "@/components/common/ContextBox.vue";

const providedValue = ref();
provide("providedValue", providedValue);
</script>
