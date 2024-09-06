<template>
    <ContextBox>창고정보관리</ContextBox>
    <WarehouseInfoSearch></WarehouseInfoSearch>
    <WarehouseInfoMain></WarehouseInfoMain>
</template>

<script>
import ContextBox from '@/components/common/ContextBox.vue';
import WarehouseInfoMain from '@/components/page/Management/WarehouseInfo/WarehouseInfoMain.vue';
import WarehouseInfoSearch from '@/components/page/Management/WarehouseInfo/WarehouseInfoSearch.vue';

export default {
    name: "WarehouseInfo",
    components: { WarehouseInfoSearch, WarehouseInfoMain, ContextBox }
};
</script>
