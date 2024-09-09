<template>
    <div class="search-box">
        <select v-model="searchSelect">
            <option value="company">업체</option>
            <option value="product">제품</option>
        </select>
        <input type="text" v-model="searchTitle">
        <label>기간</label>
        <input type="date" v-model="searchStDate">
        <label>~</label>
        <input type="date" v-model="searchEdDate">
        <button @click="handlerSearch">검색</button>

    </div>
</template>

<script setup>
import router from '@/router';

const searchSelect = ref('company');
const searchTitle = ref('');
const searchStDate = ref('');
const searchEdDate = ref('');

const handlerSearch = () => {
    const query = [];
    if(searchTitle.value){
        query.push(`searchSelect=${searchSelect.value}`);
        query.push(`searchTitle=${searchTitle.value}`);
    }
    !searchStDate.value || query.push(`searchStDate=${searchStDate.value}`);
    !searchEdDate.value || query.push(`searchEdDate=${searchEdDate.value}`);
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

select,
input {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

select {
    width:100px;
}

input[type="text"]{
    margin-right:10px;
}


input[type="date"]{
    margin: 10px;
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
