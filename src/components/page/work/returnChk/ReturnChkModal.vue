<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">반품처리 상세보기</div>
                <div v-if="isLoading">기다려주세요</div>
                <tbody v-else>
                    <table>
                        <colgroup>
                            <col width="15%" />
                            <col width="15%" />
                            <col width="20%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="20%" />
                            <col width="10%" />
                            <col width="10%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">반품코드</th>
                                <th scope="col">상품코드</th>
                                <th scope="col">반품신청일</th>
                                <th scope="col">반품수량</th>
                                <th scope="col">환불은행</th>
                                <th scope="col">환불계좌</th>
                                <th scope="col">계좌예금주</th>
                                <th scope="col">반품상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="returnListDetail">
                                <tr v-for="returnDetail in returnListDetail.returnDetail" :key="returnDetail.seq">
                                    <td>{{ returnDetail.seq }}</td>
                                    <td>{{ returnDetail.item_code }}</td>
                                    <td>{{ returnDetail.return_order_date }}</td>
                                    <td>{{ returnDetail.return_count }}</td>
                                    <td>{{ returnDetail.refund_bank }}</td>
                                    <td>{{ returnDetail.refund_bank_num }}</td>
                                    <td>{{ returnDetail.refund_bank_name }}</td>
                                    <td>{{ returnDetail.signYN }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>

                    <div class="btn-group">
                        <button @click="modalState.setModalState">닫기</button>
                    </div>
                </tbody>
            </div>
        </div>
    </teleport>
</template>
<script setup>
import { useModalStore } from "@/stores/modalState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const modalState = useModalStore();
const queryClient = useQueryClient();
const props = defineProps(["returnSeq"]);
const returnListDetail = ref();

const postSuccess = () => {
    modalState.setModalState();
    // API 호출 성공 후 queryClient를 사용하여 값을 무효화시키고 강제로 공통코드 목록을 재조회 함.
    queryClient.invalidateQueries({
        queryKey: ["listComnGrp"]
    });
};

const returnDetail = () => {
    console.log("props로 받아온 seq => " + props.returnSeq);
    axios.post("/api/work/returnDetailJson.do", { seq: props.returnSeq }).then((res) => {
        console.log("returnDetailJson => ", res.data);
        //saleTopList.value = res.data;
        returnListDetail.value = { ...res.data };
    });
};

onMounted(() => {
    returnDetail();
});

watch(
    () => props.returnSeq,
    (newSeq) => {
        if (newSeq) {
            isLoading.value = true;
            returnDetail();
        }
    }
);
</script>
<style lang="scss" scoped>
.backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 */
    z-index: 1000;
    font-weight: bold;
}

.container {
    background: #ffffff; /* 화이트 배경 */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
    width: 500px;
    max-width: 90%;
    position: relative;
    animation: fadeIn 0.3s ease; /* 빠르고 부드러운 등장 애니메이션 */
}

.header {
    background: #f0f0f0; /* 연한 회색 헤더 */
    color: #333; /* 다크 그레이 텍스트 */
    padding: 10px;
    border-radius: 8px 8px 0 0;
    font-size: 18px;
    text-align: center;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1); /* 내부에 얕은 그림자 */
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 14px;
    text-align: left;

    th,
    td {
        padding: 8px;
        border-bottom: 1px solid #e0e0e0; /* 가벼운 테두리 */
    }

    th {
        background-color: #f8f8f8; /* 매우 연한 회색 */
        color: #555; /* 중간 회색 텍스트 */
    }

    tbody tr:hover {
        background-color: #f9f9f9; /* 호버 시 약간의 변화 */
        cursor: pointer;
    }
}

.btn-group {
    text-align: right;
    margin-top: 15px;
}

button {
    background: #007bff; /* 파란색 버튼 */
    border: none;
    color: white;
    padding: 8px 16px;
    font-size: 14px;
    margin: 5px;
    cursor: pointer;
    border-radius: 4px; /* 둥근 버튼 */
    transition: background-color 0.2s ease;

    &:hover {
        background: #0056b3; /* 어두운 파란색 */
    }

    &:active {
        background: #004494; /* 클릭 시 더 어두운 파란색 */
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
