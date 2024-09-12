<template>
    <div class="divComGrpCodList">
        현재 페이지: {{ 0 }}
        <!-- <template v-if="supplyList"> 총 개수: {{ supplyList.supplyCntVue }} </template> -->
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
                    <th scope="col">구분</th>
                    <th scope="col">회사명/성명</th>
                    <th scope="col">담당업무</th>
                    <th scope="col">담당자명</th>
                    <th scope="col">연락처</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="userInfoList">
                    <tr
                        v-for="userInfoList in userInfoList.user"
                        :key="userInfoList.loginID"
                        @click="
                            handlerDetail(
                                userInfoList.loginID,
                                userInfoList.user_type,
                                userInfoList.cust_person,
                                userInfoList.name
                            )
                        "
                    >
                        <td v-if="userInfoList.user_type === 'B' || userInfoList.cust_person != null">기업고객</td>
                        <td v-else>내부 직원</td>
                        <td>{{ userInfoList.name }}</td>
                        <td v-if="userInfoList.user_type === 'A'">임원</td>
                        <td v-else-if="userInfoList.user_type === 'B'">고객</td>
                        <td v-else-if="userInfoList.user_type === 'C'">SCM 관리자</td>
                        <td v-else-if="userInfoList.user_type === 'D'">배송 담당자</td>
                        <td v-else-if="userInfoList.user_type === 'E'">구매 담당자</td>
                        <td
                            v-else-if="
                                userInfoList.user_type != 'A' &&
                                userInfoList.user_type != 'B' &&
                                userInfoList.user_type != 'C' &&
                                userInfoList.user_type != 'D' &&
                                userInfoList.user_type != 'E'
                            "
                        >
                            기타
                        </td>
                        <td>{{ userInfoList.cust_person }}</td>
                        <td>{{ userInfoList.phone }}</td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="5">일치하는 검색 결과가 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            :totalItems="userInfoList?.userCnt"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="searhUserInfoList"
            v-model="cPage"
        />

        <!--<button @click="modalState.setModalState">신규등록</button>-->
        <UserInfoModal
            v-if="modalState.modalState"
            :loginID="loginID"
            :userType="userType"
            :custPerson="custPerson"
            :custName="custName"
            @modalClose="() => (custName = '')"
            @postSuccess="searhUserInfoList"
        ></UserInfoModal>
    </div>
</template>
<script setup>
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { useModalStore } from "@/stores/modalState";
import UserInfoModal from "./UserInfoModal.vue";
import Pagination from "@/components/common/Pagination.vue";

const userInfoList = ref();
const route = useRoute(); //현재 url의 정보
const router = useRouter(); //새로고침 => url비우기용

const cPage = ref(1);
const modalState = useModalStore();

//PROPS로 값 넘기기 loginID + userType
const loginID = ref();

//기업고객 내부직원용 PROPS
const userType = ref();
const custPerson = ref();
const custName = ref(); //모달 수정-등록 확인용 => seq의 역할을 회사이름이 대신해서 custName이 존재하면 수정, 없으면 등록

const handlerDetail = (key, type, cust, name) => {
    loginID.value = key;
    userType.value = type;
    custPerson.value = cust;
    custName.value = name;
    //console.log("props로 잘 넘거가는중이냐?");
    //console.log(loginID.value, userType.value);
    modalState.setModalState();
};

const searhUserInfoList = async () => {
    let param = new URLSearchParams({
        cpage: cPage.value,
        pageSize: 5,
        searchTitle: route.query.searchTitle || ""
    });
    axios.post("/api/management/userListJson.do", param).then((res) => {
        //console.log("페이지네비게이션 확인해보자", res.data);
        userInfoList.value = { ...res.data };
    });
};

// 새로고침 시 URL 파라미터 제거
const clearURLParams = () => {
    //console.log("뭐 들어가있냐 route.query확인", route.query); // 현재 쿼리 파라미터 확인
    //userInfoSearch:router.push(queryString); 넣은 값이 route.query에 들어있음

    if (Object.keys(route.query).length > 0) {
        router.replace({
            path: route.path, // 현재 url은 유지 => url
            query: {} //뒤에 &로 붙는 쿼리만 지워 => route.query안에 값을 지워
        });
    }
};

watch(route, searhUserInfoList);

onMounted(() => {
    clearURLParams();
    searhUserInfoList();
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
