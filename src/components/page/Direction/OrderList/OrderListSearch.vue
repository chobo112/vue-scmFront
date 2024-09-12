<template>
    <div class="search-box">
        <label
            >발주업체
            <input type="text" v-model="searchKey.searchTitle" />
        </label>
        <label
            >기간 <input type="date" :max="today" v-model="searchKey.searchStDate" /> ~
            <input type="date" :max="today" v-model="searchKey.searchEdDate" />
        </label>
        <button @click="searchOrder">검색</button>
    </div>
</template>

<script setup>
// 오늘 날짜
const dateNow = new Date();
const today = dateNow.toISOString().slice(0, 10);

const validateSearch = ({ searchStDate, searchEdDate }) => {
    if (searchEdDate < searchStDate) {
        alert("종료일은 시작일 이전으로 설정할 수 없습니다.");
        return false;
    }
    return true;
};

const searchKey = ref({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: ""
});
const searchValue = inject("providedValue");

const searchOrder = () => {
    if (!validateSearch({ ...searchKey.value })) {
        return;
    }
    searchValue.value = { ...searchKey.value };
};
</script>

<style lang="scss" scoped>
.search-box {
    float: inline-end;
    margin: 7px 0;
}

select {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
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
    width: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
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

label {
    margin-right: 7px;
}
</style>
