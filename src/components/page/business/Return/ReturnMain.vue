<template>
    <ReturnModal v-if="modalState.modalState" :history="modalProps"></ReturnModal>
    <table>
        <colgroup></colgroup>
        <thead>
            <tr>
                <th scope="col">반품제품명</th>
                <th scope="col">반품 수량</th>
                <th scope="col">반품 금액</th>
                <th scope="col">반품 신청일</th>
                <th scope="col">반품 완료일</th>
                <th scope="col">반품승인여부</th>
                <th scope="col">은행명</th>
                <th scope="col">계좌번호</th>
                <th scope="col">담당자</th>
                <th scope="col">배송지시서(반품용) 작성</th>
            </tr>
        </thead>
        <tbody>
            <!-- TODO: td 에 출력할 칼럼 이름 제대로 정리하기 -->
            <template v-if="returnHistory">
                <template v-if="returnHistory.length > 0">
                    <tr v-for="history in returnHistory" :key="history.seq">
                        <td>{{ history.item_name }}</td>
                        <td>{{ history.return_count }}</td>
                        <td>￦ {{ Number(history.item_price).toLocaleString() }}</td>
                        <td>{{ formatData(history.return_order_date) }}</td>
                        <td>{{ formatData(history.return_processing_date) }}</td>
                        <td>{{ history.signYN }}</td>
                        <td>{{ history.refund_bank }}</td>
                        <td>{{ history.refund_bank_num }}</td>
                        <td>{{ history.refund_bank_name }}</td>
                        <td>
                            <button @click="handlerDetail(history)" style="white-space: nowrap">
                                반품배송지시서 작성 
                            </button>
                        </td>
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
import ReturnModal from "@/components/page/Business/Return/ReturnModal.vue";
import { useModalStore } from "@/stores/modalState";
import axios from "axios";

const route = useRoute();
const returnHistory = ref();
const modalProps = ref();
const cPage = ref(1);
const modalState = useModalStore();

const formatData = (timeStamp) => {
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
    axios.post("/api/business/returnListJson.do", param).then((res) => {
        returnHistory.value = res.data;
        console.log("return History");
        console.log(returnHistory.value);
        console.log(modalState);
    });
};

const handlerDetail = (history) => {
    modalProps.value = history;
    modalState.setModalState();
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
.search-box {
    margin-bottom: 10px;
    display: block;
    float: inline-end;
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
