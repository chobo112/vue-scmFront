<template>
    <ContextBox>발주업체관리</ContextBox>
    <OrderCompanyMain/>
</template>

<script>
import ContextBox from '@/components/common/ContextBox.vue';
import OrderCompanyMain from '@/components/page/Management/OrderCompany/OrderCompanyMain.vue';

export default {
    name: "OrderCompany",
    components: { OrderCompanyMain, ContextBox }
};
</script>