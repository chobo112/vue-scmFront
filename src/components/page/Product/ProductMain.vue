<template>
    <div class="divProductList">
        <table>
            <thead>
                <tr>
                    <th>장비구분</th>
                    <th>제품명</th>
                    <th>제조사</th>
                    <th>가격</th>
                    <th></th>
                </tr>
            </thead>
            <tbody v-if="productInfo">
                <tr v-for="product in productInfo" :key="product.item_code">
                    <td>{{ product.equipment_type }} </td>
                    <td>{{ product.item_name }} </td>
                    <td>{{ product.manufac }} </td>
                    <td>{{ product.item_price > 0 ? product.item_price : 0 }} </td>
                    <td><button @click="handlerModal(product.item_code)">구매</button></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="5">조회된 제품이 없습니다.</td>
                </tr>
            </tbody>
        </table>
        <Pagination 
            :totalItems="cnt"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="searchList"
            v-model="cPage"/>
        <ProductModal 
            v-if="modalState.modalState"
            :itemCode="itemCode"
        />
    </div>
</template>

<script setup>
import axios from 'axios';
import Pagination from '@/components/common/Pagination.vue';
import { useModalStore } from '@/stores/modalState';
import ProductModal from './ProductModal.vue';

const cPage = ref(1);
const cnt = ref(0);
const productInfo = ref([]);
const route = useRoute();
const modalState = useModalStore();
const itemCode = ref();

const searchList = () => {
    let param = new URLSearchParams({
        cPage: cPage.value,
        pageSize: 5,
        search_type: route.query.searchType || "",
        search_title: route.query.searchTitle || "",
    });
    
    axios.post('/api/product/productListJson.do', param).then((res) => {
        productInfo.value = res.data.productInfo;
        cnt.value = res.data.cnt;
    });
}

watch(route, searchList);
onMounted(() => {searchList()});

const handlerModal = (item_code) => {
    itemCode.value = item_code;
    modalState.setModalState();
}

</script>

<style lang="scss" scoped>
.divProductList {
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
