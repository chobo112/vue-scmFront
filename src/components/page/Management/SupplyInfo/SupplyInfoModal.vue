<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">납품업체 제품정보</div>
                <table>
                    <colgroup>
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">제품번호</th>
                            <th scope="col">제품명</th>
                            <th scope="col">제품단가</th>
                            <th scope="col">제품수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="supplyInfoListDetail">
                            <tr
                                v-for="custProdutList in supplyInfoListDetail.custProductList"
                                :key="custProdutList.noti_seq"
                            >
                                <td>{{ custProdutList.item_code }}</td>
                                <td>{{ custProdutList.item_name }}원</td>
                                <td>{{ Number(custProdutList.item_price).toLocaleString() }}원</td>
                                <td>{{ custProdutList.obtain_count }}개</td>
                            </tr>
                        </template>
                    </tbody>
                </table>

                <div class="btn-group">
                    <button @click="modalState.setModalState">닫기</button>
                </div>
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
const props = defineProps(["paramId"]);
const supplyInfoListDetail = ref();

const supplyInfoDetail = () => {
    console.log("props에 paramId 잘 들어가 있냐 ? ", props.paramId);
    axios.post("/api/management/custProductJson.do", { paramId: props.paramId }).then((res) => {
        console.log("returnDetailJson => ", res.data);
        //saleTopList.value = res.data;
        supplyInfoListDetail.value = { ...res.data };
        console.log("supplyInfoListDetail.value => 한번 더타냐 ?", supplyInfoListDetail.value);
    });
};

onMounted(() => {
    supplyInfoDetail();
});

/*
const postSuccess = () => {
    modalState.setModalState();
    // API 호출 성공 후 queryClient를 사용하여 값을 무효화시키고 강제로 공통코드 목록을 재조회 함.
    queryClient.invalidateQueries({
        queryKey: ["listComnGrp"]
    });
};






watch(
    () => props.returnSeq,
    (newSeq) => {
        if (newSeq) {
            isLoading.value = true;
            returnDetail();
        }
    }
);
*/
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
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    font-weight: bold;
}

.container {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 500px;
    max-width: 90%;
    position: relative;
    animation: fadeIn 0.3s ease;
}

.header {
    background: #f0f0f0;
    color: #333;
    padding: 10px;
    border-radius: 8px 8px 0 0;
    font-size: 18px;
    text-align: center;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
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
        border-bottom: 1px solid #e0e0e0;
    }

    th {
        background-color: #f8f8f8;
        color: #555;
    }

    tbody tr:hover {
        background-color: #f9f9f9;
        cursor: pointer;
    }
}

.btn-group {
    text-align: right;
    margin-top: 15px;
}

button {
    background: #007bff;
    border: none;
    color: white;
    padding: 8px 16px;
    font-size: 14px;
    margin: 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
        background: #0056b3;
    }

    &:active {
        background: #004494;
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
