<template>
<div class="divOrderCompanyList">
    <div class="button-box">
        <button @click="modalState.setModalState">업체등록</button>
    </div>
    <table>
        <thead>
            <tr>
                <th>업체번호</th>
                <th>업체이름</th>
            </tr>
        </thead>
        <tbody>
            <tr 
                v-for="orderCompany in orderCompanyList"
                :key="orderCompany.company_seq"
                @click="handlerDetail(orderCompany.company_seq)"
            >
                <td>{{ orderCompany.company_seq }}</td>
                <td>{{ orderCompany.company_name }}</td>
            </tr>
        </tbody>
    </table>
    <OrderCompanyModal v-if="modalState.modalState" @searchList="searchList"/>
    <OrderCompanyDetailModal v-if="detailView" :companySeq="companySeq" @detailClose="detailView = false"/>
</div>
</template>

<script setup>
import OrderCompanyModal from './OrderCompanyModal.vue';
import { useModalStore } from '@/stores/modalState';
import axios from 'axios';
import OrderCompanyDetailModal from './OrderCompanyDetailModal.vue';

const orderCompanyList = ref([]);
const modalState = useModalStore();
const detailView = ref(false);
const companySeq = ref(0);

onMounted(() => {searchList()});

const searchList = () => {
    axios.post('/api/management/orderCompanyListJson.do', {}).then((res) => {
        orderCompanyList.value = res.data.orderCompanyList;
    });
}

const handlerDetail = (seq) => {
    detailView.value = !detailView.value;
    companySeq.value = seq;
}


</script>

<style lang="scss" scoped>
.divOrderCompanyList {
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
