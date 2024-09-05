<template>
    <div class="divComGrpCodList">
        <table>
            <colgroup>
                <col width="20%" />
                <col width="27%" />
                <col width="27%" />
                <col width="23%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col" @click="setSort('cust_name')">
                        고객명
                        <span v-if="sortKey === 'cust_name'"></span>
                    </th>
                    <th scope="col" @click="setSort('sales')">
                        매출▼
                        <span v-if="sortKey === 'sales'"></span>
                    </th>
                    <th scope="col" @click="setSort('accounts_receivable')">
                        미수금▼
                        <span v-if="sortKey === 'accounts_receivable'"></span>
                    </th>
                    <th scope="col" @click="setSort('total_sum')">
                        총액▼
                        <span v-if="sortKey === 'total_sum'"></span>
                    </th>
                </tr>
            </thead>

            <tbody>
                <template v-if="saleTopList">
                    <template v-if="saleTopList.length > 0">
                        <tr v-for="saleTopList in saleTopList" :key="saleTopList.cust_id">
                            <td>{{ saleTopList.cust_name }}</td>
                            <td>{{ Number(saleTopList.sales).toLocaleString() }}원</td>
                            <td>{{ Number(saleTopList.accounts_receivable).toLocaleString() }}원</td>
                            <td>{{ Number(saleTopList.total_sum).toLocaleString() }}원</td>
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
    </div>
</template>
<script setup>
import axios from "axios";

//정렬이벤트
const saleTopList = ref();
//const saleTopList = ref([]);

const sortPlz = ref("sales"); // 기본 정렬 기준

const searchSaleTopList = async () => {
    axios
        .post(`/api/executives/salesTopListJson.do`, {
            orderBy: sortPlz.value
        })
        .then((res) => {
            console.log(res.data);
            //saleTopList.value = res.data;
            saleTopList.value = res.data.list;
        });
};

// 정렬 기준과 순서를 설정하는 함수
const setSort = (key) => {
    sortPlz.value = key;
    searchSaleTopList(); // 정렬된 데이터를 요청
};

onMounted(() => {
    searchSaleTopList();
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
