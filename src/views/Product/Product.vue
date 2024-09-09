<template>
    <ContextBox>제품</ContextBox>
    <ProductSearch></ProductSearch>
    <ProductMain></ProductMain>
</template>

<script>
import ContextBox from '@/components/common/ContextBox.vue';
import ProductMain from '@/components/page/Product/ProductMain.vue';
import ProductSearch from '@/components/page/Product/ProductSearch.vue';

export default {
    name: "Product",
    components: { ProductSearch, ProductMain, ContextBox }
};
</script>