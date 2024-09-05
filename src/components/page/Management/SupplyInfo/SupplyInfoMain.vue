<template>
    <div class="divComGrpCodList">
        <SupplyInfoModal v-if="modalState.modalState" :paramId="paramId"></SupplyInfoModal>
        현재 페이지: {{ cPage }}
        <template v-if="supplyList"> 총 개수: {{ supplyList.supplyCntVue }} </template>
        <table>
            <colgroup>
                <col width="25%" />
                <col width="15%" />
                <col width="15%" />
                <col width="15%" />
                <col width="25%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">납품업체명</th>
                    <th scope="col">LOGIN ID</th>
                    <th scope="col">PASSWARD</th>
                    <th scope="col">담당자명</th>
                    <th scope="col">담당자연락처</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="supplyList">
                    <tr v-for="supplyList in supplyList.supplyList" :key="supplyList.cust_id">
                        <td @click="handlerDetail(supplyList.cust_id)">{{ supplyList.cust_name }}</td>
                        <td>{{ supplyList.loginID }}</td>
                        <td>{{ supplyList.password }}</td>
                        <td>{{ supplyList.cust_person }}</td>
                        <td>{{ supplyList.cust_person_ph }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            :totalItems="supplyList?.supplyCntVue"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="searhSupplyList"
            v-model="cPage"
        />
    </div>
</template>
<script setup>
import axios from "axios";
import Pagination from "@/components/common/Pagination.vue";
import SupplyInfoModal from "./SupplyInfoModal.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { useModalStore } from "@/stores/modalState";

const router = useRouter(); //router : 라우터에 등록된 모든 라우트를 나타냄

const route = useRoute(); //현재 url의 정보
const supplyList = ref();
const cPage = ref(1);
const modalState = useModalStore();
const paramId = ref("");

const searhSupplyList = async () => {
    let param = new URLSearchParams({
        cpage: cPage.value,
        pageSize: 5,
        searchTitle: route.query.searchTitle || ""
    });
    axios.post("/api/management/supplySearchJson.do", param).then((res) => {
        console.log(res.data);
        supplyList.value = { ...res.data };
    });
};

// 새로고침 시 URL 파라미터 제거
const clearURLParams = () => {
    console.log("뭐 들어가있냐 route.query확인", route.query); // 현재 쿼리 파라미터 확인
    if (Object.keys(route.query).length > 0) {
        console.log("뭐들어가있냐 Object.keys(route.query)", Object.keys(route.query)); // 쿼리 파라미터의 키들 확인
        // Object.keys(route.query)의 실제 배열 출력
        console.log("뭐들어가있냐 Object.keys(route.query).toString()", Object.keys(route.query).toString());

        router.replace({
            path: route.path, // 현재 url은 유지하고 뒤에 &로 붙는 쿼리만 지워
            query: {} //뒤에 &로 붙는 쿼리만 지워
        });
    }
};

const handlerDetail = (pk) => {
    paramId.value = pk;
    modalState.setModalState();
};

// 라우트 변경 감지
watch(route, searhSupplyList);

// 컴포넌트가 마운트되면 검색 함수 호출
onMounted(() => {
    clearURLParams(); // 마운트 시 URL 파라미터 제거
    searhSupplyList();
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
