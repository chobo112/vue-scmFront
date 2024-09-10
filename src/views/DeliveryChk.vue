<template>
    <ContextBox>배송처리</ContextBox>
    <DeliveryChkSearch />
    <DeliveryChkMain />
</template>

<script setup>
import ContextBox from "@/components/common/ContextBox.vue";
import DeliveryChkMain from "@/components/page/work/DeliveryChk/DeliveryChkMain.vue";
import DeliveryChkSearch from "@/components/page/work/DeliveryChk/DeliveryChkSearch.vue";

const providedValue = ref();
provide("providedValue", providedValue);
</script>
