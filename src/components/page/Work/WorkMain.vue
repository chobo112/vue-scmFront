<template>
    <WorkModal v-if="modalState.modalState" :orderList="orderObj"></WorkModal>
    현재 페이지: {{ cPage }} 총 개수: {{ orderList?.orderList.length }}
    <table>
        <colgroup>
            <col width="50px" />
            <col width="50px" />
            <col width="50px" />
            <col width="50px" />
            <col width="50px" />
            <col width="60px" />
        </colgroup>
        <thead>
            <tr>
                <th scope="col">주문번호</th>
                <th scope="col">주문일자</th>
                <th scope="col">주문기업명</th>
                <th scope="col">주문제품명</th>
                <th scope="col">주문개수</th>
                <th scope="col">발주지시서 작성</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="orderList">
                <template v-if="orderList.orderList.length > 0">
                    <!-- v-bind:key="" 또는 :key=""를 사용하여 속성의 속성값을 바꿀 수 있다. (v-bind:속성="값" 또는 :속성="값") -->
                    <tr v-for="order in orderList.orderList" :key="order.seq">
                        <td>{{ order.seq }}</td>
                        <td>{{ fomatData(order.obtain_date) }}</td>
                        <td>{{ order.cust_name }}</td>
                        <td>{{ order.item_name }}</td>
                        <td>{{ order.obtain_count }}</td>
                        <td><button @click="handlerDetail(order)">발주지시서작성</button></td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="7">일치하는 검색 결과가 없습니다</td>
                    </tr>
                </template>
            </template>
        </tbody>
    </table>
</template>

<script setup>
import Pagination from "@/components/common/Pagination.vue";
import WorkModal from "./WorkModal.vue";
import axios from "axios";
import { useModalStore } from "@/stores/modalState";

const route = useRoute();
const orderList = ref();
const cPage = ref(1);
const modalState = useModalStore();
const orderObj = ref();
const emitTest = ref(1);

const fomatData = (timeStamp) => {
    const date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const searchList = () => {
    let param = new URLSearchParams({
        searchStDate: route.query.searchStDate || "",
        searchEdDate: route.query.searchEdDate || "",
        cpage: cPage.value,
        pageSize: 5
    });

    axios.post("/api/business/orderListJson.do", param).then((res) => {
        orderList.value = res.data;
    });
};

const handlerDetail = (order) => {
    orderObj.value = order;
    modalState.setModalState();
};

const testFun = () => {
    emitTest.value += 1;
};

onMounted(() => {
    searchList();
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
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }

    /* 테이블 올렸을 때 */
    tbody tr:hover {
        background-color: #d3d3d3;
        opacity: 0.9;
        cursor: pointer;
    }
}
</style>
