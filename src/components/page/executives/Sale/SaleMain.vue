<template>
    <div class="divComGrpCodList">
        현재 페이지: {{ cPage }} 총 개수: {{ saleList?.salesPage }}
        <table>
            <colgroup>
                <col width="10%" />
                <col width="50%" />
                <col width="30%" />
                <col width="10%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">고객명</th>
                    <th scope="col">매출</th>
                    <th scope="col">미수금</th>
                    <th scope="col">총액</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="saleList">
                    <template v-if="saleList.list.length > 0">
                        <tr v-for="saleList in saleList.list" :key="saleList.cust_id">
                            <td>{{ saleList.cust_name }}</td>
                            <td>{{ saleList.sales }}</td>
                            <td>{{ saleList.accounts_receivable }}</td>
                            <td>{{ saleList.total_sum }}</td>
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
            :totalItems="saleList?.salesPage"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="searchSaleList"
            v-model="cPage"
        />
    </div>
</template>
<script setup>
import Pagination from "@/components/common/Pagination.vue";
import axios from "axios";

const route = useRoute();
const saleList = ref();
const cPage = ref(1); //v-model로 가져오려고, +초기값 1

const searchSaleList = async () => {
    let param = new URLSearchParams({
        cpage: cPage.value,
        pageSize: 5,
        searchTitle: route.query.searchTitle || "",
        searchStDate: route.query.searchStDate || "",
        searchEdDate: route.query.searchEdDate || ""
    });
    axios.post(`/api/executives/salesListJson.do`, param).then((res) => {
        /*console.log("############");
        console.log(res.data.list);
        console.log(res.data);*/
        saleList.value = res.data;
    });
};

watch(route, searchSaleList);

onMounted(() => {
    searchSaleList();
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
