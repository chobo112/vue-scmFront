<template>
    <ContextBox>1:1문의</ContextBox>
    <InquiryMain />
</template>

<script>

import ContextBox from "@/components/common/ContextBox.vue";
import InquiryMain from "@/components/page/Board/Inquiry/InquiryMain.vue";
import InquirySearch from "@/components/page/Board/Inquiry/InquirySearch.vue";
import InquiryDetail from "@/components/page/Board/Inquiry/InquiryDetail.vue";

export default {
    name: "Inquiry",
    components: {  InquiryMain, InquirySearch, InquiryDetail, ContextBox }
};
</script>