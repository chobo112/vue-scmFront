<template>
    <table>
        <colgroup>
            <col width="10%" />
            <col width="15%" />
            <col width="20%" />
            <col width="20%" />
            <col width="15%" />
            <col width="10%" />
            <col width="10%" />
        </colgroup>
        <thead>
            <tr>
                <th>주문번호</th>
                <th>주문일자</th>
                <th>고객기업명</th>
                <th>주문제품명</th>
                <th>주문수량</th>
                <th>입금여부</th>
                <th>배송지시서</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="isLoading">
                <td colspan="7">잠시만 기다려주세요.</td>
            </tr>
            <tr v-else-if="obtainList.obtainList <= 0">
                <td colspan="7">데이터가 없습니다.</td>
            </tr>
            <tr v-else v-for="obtain in obtainList.obtainList" :key="obtain.seq">
                <td>{{ obtain.seq }}</td>
                <td>{{ obtain.obtainDate }}</td>
                <td>{{ obtain.custName }}</td>
                <td>{{ obtain.itemName }}</td>
                <td>{{ obtain.obtainCount }}</td>
                <td>{{ obtain.depositYn }}</td>
                <td>
                    <div v-if="obtain.depositYn === 'Y'">
                        <button class="deliveryBtn" @click="handlerModal(obtain.seq)">
                            {{ obtain.delivery ? "상세" : "작성" }}
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
        <ObtainModal v-if="modalState.modalState" :obtainSeqProp="obtainSeqProp"></ObtainModal>
    </table>
    <Pagination
        :totalItems="obtainList?.obtainListCnt || 0"
        :itemsPerPage="5"
        :maxPagesShown="5"
        :onClick="refetch"
        v-model="cPage"
    />
</template>

<script setup>
import Pagination from "@/components/common/Pagination.vue";
import ObtainModal from "./ObtainModal.vue";
import { useModalStore } from "@/stores/modalState";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const cPage = ref(1);
const pageSize = ref(5);
const searchValue = inject("providedValue");
const modalState = useModalStore();
const obtainSeqProp = ref();

const searchObtainList = async () => {
    const result = await axios.post("/api/business/obtainListJson.do", {
        currentPage: cPage.value,
        pageSize: pageSize.value,
        ...searchValue.value
    });

    return result.data;
};

const {
    data: obtainList,
    isLoading,
    refetch
} = useQuery({
    queryKey: ["obtainList", searchValue],
    queryFn: searchObtainList
});

const handlerModal = (obtainSeq) => {
    obtainSeqProp.value = obtainSeq;
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

.deliveryBtn {
    float: none;
    margin: 0 0;
    display: inline-block;
}
</style>
