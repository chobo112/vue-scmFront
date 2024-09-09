<template>
    <div class="divOrderChkList">
        <table>
            <thead>
                <th>발주번호</th>
                <th>발주회사</th>
                <th>제품명</th>
                <th>가격</th>
                <th>개수</th>
                <th>총액</th>
                <th>주문날짜</th>
                <th>임원승인여부</th>
                <th>입금확인</th>
                <th></th>
            </thead>
            <tbody>
                <template v-if="list">
                    <template v-if="listCnt > 0">
                        <tr
                            v-for="order in list"
                            :key="order.seq">
                            <td>{{ order.seq }}</td>
                            <td>{{ order.company_name }}</td>
                            <td>{{ order.product_name }}</td>
                            <td>{{ order.item_price.toLocaleString('ko-KR') + '원' }}</td>
                            <td>{{ order.order_count }}</td>
                            <td>{{ order.total_price ?  order.total_price.toLocaleString('ko-KR') + '원' : '0원' }}</td>
                            <td>{{ fomatData(order.order_date) }}</td>
                            <td :style="{color: order.signYN === 'Y' ? 'blue' : 'red'}">{{ order.signYN }}</td>
                            <td :style="{color: order.depositYN === 'Y' ? 'blue' : 'red'}">{{ order.depositYN }}</td>
                            <td v-if="order.depositYN === 'N' && order.signYN === 'Y'"><button @click="handlerDeposit(order.seq)">입금확인</button></td>
                            <td v-else></td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="10">조회된 결과가 없습니다.</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <Pagination 
            :totalItems="listCnt"
            :itemsPerPage="10"
            :maxPagesShown="5"
            :onclick="searchList"
            v-model="currentPage"/>
    </div>
    <OrderChkModal 
        v-if="modalState.modalState"
        :orderSeq = orderSeq
        @searchList="searchList"
    />
</template>

<script setup>
import axios from 'axios';
import Pagination from '@/components/common/Pagination.vue';
import OrderChkModal from './OrderChkModal.vue';
import { useModalStore } from '@/stores/modalState';

const currentPage = ref(1);
const list = ref([]);
const listCnt = ref(0);
const route = useRoute();
const modalState = useModalStore();
const orderSeq = ref(0);

const searchList = () => {
    let param = new URLSearchParams({
        currentPage: currentPage.value,
        pageSize: 10,
        searchSelect: route.query.searchSelect || "",
        searchTitle: route.query.searchTitle || "",
        searchStDate: route.query.searchStDate || "",
        searchEdDate: route.query.searchEdDate || ""
    });

    axios.post('/api/work/orderListJson.do', param).then((res) => {
        list.value = res.data.list;
        listCnt.value = res.data.cnt;
    })
}

const fomatData = (timeStamp) => {
    const date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const handlerDeposit = (seq) => {
    orderSeq.value = seq;
    modalState.setModalState();
}

onMounted(() => {
    searchList();
});

watch(route, searchList);

</script>

<style lang="scss" scoped>
.divOrderChkList {
    margin-bottom: 40px;
}
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

    select,
    input {
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-right: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
}
.button-box {
    margin-top:-50px;
    text-align:right;
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
