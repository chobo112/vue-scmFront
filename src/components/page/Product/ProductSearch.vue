<template>
    <div class="search-box">
        <select v-model="searchType">
            <option value="item_name">제품명</option>
            <option value="equipment_type">장비</option>
            <option value="manufac">제조사</option>
        </select>
        <input type="text" v-model="searchTitle"/>
        <button @click="handlerSearch">검색</button>
    </div>

</template>

<script setup>
import router from '@/router';

const searchType = ref("item_name");
const searchTitle = ref("");

const handlerSearch = () => {
    const query = [];
    if(searchTitle.value !== ""){
        !searchType.value || query.push(`searchType=${searchType.value}`);
    }
    !searchTitle.value || query.push(`searchTitle=${searchTitle.value}`);

    const queryString = query.length > 0 ? `?${query.join("&")}` : "";
    router.push(queryString);
}

</script>

<style lang="scss" scoped>
.search-box {
    margin-bottom: 10px;
    display: block;
    float: inline-end;
}

select {
    width:150px;
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
