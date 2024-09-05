<template>
    <ContextBox>공지사항</ContextBox>
    <NoticeSearch />
    <NoticeMain />
</template>

<script>
import ContextBox from "@/components/common/ContextBox.vue";
import NoticeMain from "@/components/page/Board/Notice/NoticeMain.vue";
import NoticeModal from "@/components/page/Board/Notice/NoticeModal.vue";
import NoticeSearch from "@/components/page/Board/Notice/NoticeSearch.vue";
export default {
    name: "Notice",
    components: { NoticeMain, NoticeSearch, NoticeModal, ContextBox }
};
</script>
