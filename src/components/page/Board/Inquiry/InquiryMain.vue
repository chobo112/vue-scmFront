<template>
    <InquirySearch @registView="handlerRegist"/>
    <div class="divInquiryList">
        <table>
            <colgroup>
                <col width="10%" />
                <col width="30%" />
                <col width="15%" />
                <col width="15%" />
                <col width="20%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">문의번호</th>
                    <th scope="col">문의제목</th>
                    <th scope="col">카테고리</th>
                    <th scope="col">문의날짜</th>
                    <th scope="col">작성자</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="inquiryList">
                    <template v-if="inquiryList.inquiryCnt > 0">
                        <tr 
                            v-for="inquiry in inquiryList.inquiryList" 
                            :key="inquiry.seq" 
                            @click="handlerDetail(inquiry.seq)">
                            <td>{{ inquiry.seq }}</td>
                            <td>{{ inquiry.post_title }}</td>
                            <td>{{ inquiry.category_name }}</td>
                            <td>{{ inquiry.post_date }}</td>
                            <td>{{ inquiry.loginID }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="5">등록된 문의가 없습니다.</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>  
        <Pagination
            :totalItems="inquiryList?.inquiryCnt"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="searchList"
            v-model="cPage"
        />
    </div>
        <InquiryDetail
            v-show="detailView"
            :inquirySeq="inquirySeq"
            @detailView="detailView = false"
            @postSuccess="inquirySeq = 0"
        />
</template>

<script setup>
import InquirySearch from '@/components/page/Board/Inquiry/InquirySearch.vue';
import axios from 'axios';
import Pagination from '@/components/common/Pagination.vue';
import InquiryDetail from '@/components/page/Board/Inquiry/InquiryDetail.vue';

const route = useRoute();
const inquiryList = ref();
const cPage = ref(1);
const detailView = ref(false);
const inquirySeq = ref(0);

const searchList = () => {
    let param = new URLSearchParams({
        currentPage: cPage.value,
        pageSize: 5,
        searchTitle: route.query.searchTitle || "",
        searchStDate: route.query.searchStDate || "",
        searchEdDate: route.query.searchEdDate || ""
    });

    axios.post("/api/board/inquiryListJson.do", param).then((res) => {
        inquiryList.value = res.data;
        detailView.value = false;
    });
};

watch(route, searchList);

onMounted( () => {searchList()});

const handlerDetail = (seq) => {
    inquirySeq.value = seq;
    detailView.value = true;
}

const handlerRegist = () => {
    inquirySeq.value = 0;
    detailView.value = true;
}

</script>

<style lang="scss" scoped>
.divInquiryList {
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
</style>
