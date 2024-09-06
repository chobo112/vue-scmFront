<template>
    <ContextBox>발주현황</ContextBox>
    <WorkSearch />
    <WorkMain />
</template>

<script>
import ContextBox from "@/components/common/ContextBox.vue";
import WorkMain from "@/components/page/Work/WorkMain.vue";
import WorkSearch from "@/components/page/Work/WorkSearch.vue";
import WorkModal from "@/components/page/Work/WorkModal.vue";

export default {
    name: "Work",
    components: { ContextBox, WorkMain, WorkSearch, WorkModal }
};
</script>
