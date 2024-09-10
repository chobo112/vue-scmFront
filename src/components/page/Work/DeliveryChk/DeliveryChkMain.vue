<template>
    <table>
        <colgroup>
            <col width="10%" />
            <col width="15%" />
            <col width="15%" />
            <col width="30%" />
            <col width="15%" />
            <col width="15%" />
        </colgroup>
        <thead>
            <tr>
                <th>배송번호</th>
                <th>배송담당자</th>
                <th>출발지</th>
                <th>목적지</th>
                <th>배송결과</th>
                <th>상세보기</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="isLoading">
                <td colspan="6">잠시만 기다려주세요.</td>
            </tr>
            <tr v-else-if="deliveryList.deliveryList.length <= 0">
                <td colspan="6">데이터가 없습니다.</td>
            </tr>
            <tr v-else v-for="delivery in deliveryList.deliveryList" :key="delivery.delivery_num">
                <td>{{ delivery.delivery_num }}</td>
                <td>{{ delivery.delivery_name }}</td>
                <td>{{ delivery.storage_name }}</td>
                <td>{{ delivery.delivery_end_loc }}</td>
                <td :style="{ color: delivery.delivery_state === '배송중' ? 'blue' : 'green' }">
                    {{ delivery.delivery_state }}
                </td>
                <td><button class="orderDetailBtn" @click="handlerModal(delivery.delivery_num)">상세보기</button></td>
            </tr>
        </tbody>
    </table>
    <DeliveryChkModal v-if="modalState.modalState" :deliveryNumProp="deliveryNumProp"></DeliveryChkModal>
    <Pagination
        :totalItems="deliveryList?.deliveryListCnt || 0"
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
import DeliveryChkModal from "./DeliveryChkModal.vue";
import { useModalStore } from "@/stores/modalState";

const searchValue = inject("providedValue");
const cPage = ref(1);
const pageSize = ref(10);
const modalState = useModalStore();
const deliveryNumProp = ref();

const searchDeliveryList = async () => {
    const result = await axios.post("/api/work/deliveryListJson.do", {
        currentPage: cPage.value,
        pageSize: pageSize.value,
        ...searchValue.value
    });
    return result.data;
};

const {
    data: deliveryList,
    isLoading,
    refetch
} = useQuery({
    queryKey: ["deliveryList", searchValue],
    queryFn: searchDeliveryList
});

const handlerModal = (deliveryNum) => {
    deliveryNumProp.value = deliveryNum;
    modalState.setModalState();
};
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
        height: 37px;
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

.orderDetailBtn {
    float: none;
    margin: 0 0;
    display: inline-block;
}
</style>
