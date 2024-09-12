<template>
    <ContextBox>기업고객/직원정보관리</ContextBox>
    <UserInfoSearch></UserInfoSearch>
    <UserInfoMain></UserInfoMain>
</template>
<script setup lang="ts">
import ContextBox from "@/components/common/ContextBox.vue";
import UserInfoMain from "@/components/page/Management/UserInfo/UserInfoMain.vue";
import UserInfoSearch from "@/components/page/Management/UserInfo/UserInfoSearch.vue";
</script>
