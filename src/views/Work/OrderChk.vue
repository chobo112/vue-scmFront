<template>
    <ContextBox>발주서현황</ContextBox>
    <OrderChkSearch/>
    <OrderChkMain/>
</template>

<script>
import ContextBox from '@/components/common/ContextBox.vue';
import OrderChkSearch from '@/components/page/work/OrderChk/OrderChkSearch.vue';
import OrderChkMain from '@/components/page/work/OrderChk/OrderChkMain.vue';

export default {
    name: "OrderChk",
    components: { OrderChkSearch, OrderChkMain, ContextBox }
};
</script>