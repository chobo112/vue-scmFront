<template>
    <ContextBox>발주지시서</ContextBox>
    <OrderListSearch />
    <OrderListMain />
</template>

<script setup>
import ContextBox from "@/components/common/ContextBox.vue";
import OrderListMain from "@/components/page/Direction/OrderList/OrderListMain.vue";
import OrderListSearch from "@/components/page/Direction/OrderList/OrderListSearch.vue";

const providedValue = ref();
provide("providedValue", providedValue);
</script>
