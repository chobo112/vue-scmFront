<template>
    <table>
        <colgroup>
            <col width="15%" />
            <col width="27%" />
            <col width="27%" />
            <col width="15%" />
            <col width="15%" />
        </colgroup>
        <thead>
            <tr>
                <th>제품번호</th>
                <th>제품명</th>
                <th>발주업체</th>
                <th>날짜</th>
                <th>수량</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="isLoading">
                <td colspan="5">잠시만 기다려주세요.</td>
            </tr>
            <tr v-else-if="orderList.orderList.length <= 0">
                <td colspan="4">데이터가 없습니다.</td>
            </tr>
            <tr v-else v-for="order in orderList.orderList" :key="order.seq">
                <td>{{ order.item_code }}</td>
                <td>{{ order.item_name }}</td>
                <td>{{ order.order_company }}</td>
                <td>{{ order.order_date }}</td>
                <td>{{ order.order_count }} 개</td>
            </tr>
        </tbody>
    </table>
    <Pagination
        :totalItems="orderList?.listCount || 0"
        :itemsPerPage="10"
        :maxPagesShown="5"
        :onClick="refetch"
        v-model="cPage"
    />
</template>

<script setup>
import Pagination from "@/components/common/Pagination.vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const searchValue = inject("providedValue");
const cPage = ref(1);
const pageSize = ref(10);

const searchOrderList = async () => {
    const result = await axios.post("/api/direction/orderListJsonVue.do", {
        cpage: cPage.value,
        pageSize: pageSize.value,
        ...searchValue.value
    });
    return result.data;
};

const {
    data: orderList,
    isLoading,
    refetch
} = useQuery({
    queryKey: ["orderList", searchValue],
    queryFn: searchOrderList
});
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;

    th,
    td {
        padding: 8px;
        text-align: left;
        border: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }
}

a {
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: white;
    }
}

button {
    text-align: center;
    text-decoration: none;
    display: block;
    border: none;
    color: white;
    width: 80px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 12px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;
    float: inline-end;

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
