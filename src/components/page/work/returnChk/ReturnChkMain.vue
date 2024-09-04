<template>
    <div class="divComGrpCodList">
        <ReturnChkModal v-if="modalState.modalState" :returnSeq="returnSeq"></ReturnChkModal>
        현재 페이지: {{ cPage }}
        <template v-if="returnList"> 총 개수: {{ returnList.returnCnt }} </template>
        <table>
            <colgroup>
                <col width="15%" />
                <col width="25%" />
                <col width="15%" />
                <col width="15%" />
                <col width="15%" />
                <col width="15%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">반품번호</th>
                    <th scope="col">상품명</th>
                    <th scope="col">상품수량</th>
                    <th scope="col">반품날짜</th>
                    <th scope="col">반품결과</th>
                    <th scope="col">비고</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="returnList">
                    <template v-if="returnList.returnList.length > 0">
                        <tr v-for="returnList in returnList.returnList" :key="returnList.seq">
                            <td>{{ returnList.seq }}</td>
                            <td>{{ returnList.item_code }}</td>
                            <td>{{ returnList.return_count }}</td>
                            <td>{{ returnList.return_order_date }}</td>
                            <td>{{ returnList.signYN }}</td>
                            <td @click="handlerDetail(returnList.seq)">상세보기</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="4">일치하는 검색 결과가 없습니다</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <Pagination
            :totalItems="returnList?.returnCnt"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="searchReturnList"
            v-model="cPage"
        />
    </div>
</template>
<script setup>
import axios from "axios";
import Pagination from "@/components/common/Pagination.vue";
import ReturnChkModal from "./ReturnChkModal.vue";
import { useModalStore } from "@/stores/modalState";

const route = useRoute();
const returnList = ref();
const cPage = ref(1);
const modalState = useModalStore();
const returnSeq = ref(0);

const handlerDetail = (seq) => {
    returnSeq.value = seq;
    modalState.setModalState();
};

const searchReturnList = async () => {
    let param = new URLSearchParams({
        cpage: cPage.value,
        pageSize: 5,
        searchTitle: route.query.searchTitle || "",
        searchStDate: route.query.searchStDate || "",
        searchEdDate: route.query.searchEdDate || ""
    });
    axios.post(`/api/work/returnListJson.do`, param).then((res) => {
        console.log("res.data나온거 ", res.data);
        //saleTopList.value = res.data;
        returnList.value = { ...res.data };
    });
};

watch(route, searchReturnList);

onMounted(() => {
    searchReturnList();
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
