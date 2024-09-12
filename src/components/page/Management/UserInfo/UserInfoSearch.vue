<template>
    <div class="select-container">
        <div class="search-box">
            <!-- v-model을 이용하여 양방향 바인딩을 쉽게 할 수 있다. -->
            회사명/성명<input v-model="keyword" />
            <!-- v-on:click="" 또는 @click=""으로 이벤트를 설정한다. -->
            <button @click="handlerSearch">검색</button>
            <button @click="modalState.setModalState">신규등록</button>
        </div>
    </div>
</template>

<script setup>
import router from "@/router";
import axios from "axios";
import { useModalStore } from "@/stores/modalState";

const modalState = useModalStore();
const keyword = ref("");

const handlerSearch = () => {
    // 1. url 파라미터 생성
    const query = [];
    !keyword.value || query.push(`searchTitle=${keyword.value}`);

    const queryString = query.length > 0 ? `?${query.join("&")}` : "";

    // 2. 라우터에 파라미터 push
    router.push(queryString);
    console.log(router);
};
</script>

<style lang="scss" scoped>
.select-container {
    margin-bottom: 10px;
    display: block;
}

select {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 12px;
    background-color: white;
    color: #333;
    width: 160px;
    height: 40px;
    box-shadow: 0 2px #999;
    cursor: pointer;

    &:hover {
        background-color: #f1f1f1;
    }

    &:active {
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }

    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
}

.search-box {
    margin-bottom: 10px;
    display: block;
    float: inline-end;
}

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
