<template>
    <ContextBox>구매내역</ContextBox>
    <OrderSearch></OrderSearch>
    <OrderMain></OrderMain>
    
</template>

<script setup>
import ContextBox from '@/components/common/ContextBox.vue';
import OrderMain from '@/components/page/mypage/order/OrderMain.vue';
import OrderSearch from '@/components/page/mypage/order/OrderSearch.vue';

const providedValue = ref();
provide("providedValue", providedValue);
</script>

<style></style>
