<template>
    <div class="search-box">
        <select v-model="searchSelect">
            <option value="name">창고명</option>
            <option value="address">창고위치</option>
        </select>
        <input type="text" v-model="searchTitle"/>
        <button @click="handlerSearch">검색</button>
        <button @click="modalState.setModalState">신규등록</button>
    </div>
</template>

<script setup>
import router from "@/router";
import { useModalStore } from "@/stores/modalState";

const searchSelect = ref("name");
const searchTitle = ref("");
const modalState = useModalStore();

const handlerSearch = () => {

    const query = [];
    !searchSelect.value || query.push(`searchSelect=${searchSelect.value}`);
    !searchTitle.value || query.push(`searchTitle=${searchTitle.value}`);
    const queryString = query.length > 0 ? `?${query.join("&")}` : "";

    router.push(queryString);
};

</script>

<style lang="scss" scoped>
.search-box {
    margin-bottom: 10px;
    display: block;
    float: inline-end;
}

select,
input {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border: none;
    color: white;
    width: 70px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}
</style>
