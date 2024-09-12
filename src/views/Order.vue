<template>
    <ContextBox>발주현황</ContextBox>
    <OrderSearch />
    <OrderMain />
</template>

<script setup>
import ContextBox from "@/components/common/ContextBox.vue";
import OrderMain from "@/components/page/Business/Order/OrderMain.vue";
import OrderSearch from "@/components/page/Business/Order/OrderSearch.vue";
import OrderModal from "@/components/page/Business/Order/OrderModal.vue";

</script>
