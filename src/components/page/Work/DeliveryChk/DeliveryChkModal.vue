<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">배송 상세</div>
                <table>
                    <colgroup>
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="35%" />
                        <col width="10%" />
                        <col width="15%" />
                        <col width="10%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>배송번호</th>
                            <th>제품명</th>
                            <th>수량</th>
                            <th>배송지</th>
                            <th>담당자</th>
                            <th>배송일</th>
                            <th>배송상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="7">데이터가 없습니다.</td>
                        </tr>
                        <tr v-else>
                            <td>{{ deliveryObject.deliveryNum }}</td>
                            <td>{{ deliveryObject.itemName }}</td>
                            <td>{{ deliveryObject.obtainCount }} 개</td>
                            <td>{{ deliveryObject.deliveryEndLoc }}</td>
                            <td>{{ deliveryObject.deliveryName }}</td>
                            <td>{{ deliveryObject.deliveryDate }}</td>
                            <td>{{ deliveryObject.deliveryState }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="btn-group">
                    <button v-if="deliveryObject.deliveryState !== '배송완료'" @click="handlerUpdateDelivery">
                        배송완료
                    </button>
                    <button @click="modalState.setModalState">닫기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from "@/stores/modalState";
import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import axios from "axios";

const deliveryObject = ref(new Object());
const queryClient = useQueryClient();
const modalState = useModalStore();
const { deliveryNumProp } = defineProps(["deliveryNumProp"]);

const searchDeliveryDetail = async () => {
    const result = await axios.post("/api/work/deliveryDetailJson.do", { deliveryNum: deliveryNumProp });
    return result.data;
};

const { isLoading } = useQuery({
    queryKey: ["deliveryDetail", deliveryNumProp],
    queryFn: searchDeliveryDetail,
    staleTime: 60 * 1000,
    select: (data) => {
        deliveryObject.value = data;
    }
});

const handlerUpdateDelivery = () => {
    if (!confirm("배송완료 처리하시겠습니까?")) {
        return;
    }
    updateDeliveryDone();
};

const updateDelivery = () => {
    axios.post("/api/work/updateDeliveryDoneJson.do", { deliveryNum: deliveryNumProp });
};

const postSuccess = () => {
    alert("배송 완료되었습니다.");

    modalState.setModalState();
    queryClient.invalidateQueries({
        queryKey: ["deliveryList"]
    });
    queryClient.setQueryData(["deliveryDetail", deliveryNumProp], (deliveryObject) => {
        deliveryObject.deliveryState = "배송완료";
        return { ...deliveryObject };
    });
};

const { mutate: updateDeliveryDone } = useMutation({
    mutationFn: updateDelivery,
    onSuccess: postSuccess
});
</script>

<style lang="scss" scoped>
.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrep;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    font-weight: bold;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 1100px;
    max-height: 500px;
    align-content: center;
}

.header {
    background-color: #e0e0e0;
    padding: 10px 100% 10px 0px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 16px;
    font-size: 20px;
    margin-right: auto;
}

.btn-group {
    text-align: right;
    margin-top: 10px;
    float: inline-end;
}

button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: right;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 16px;
    text-align: left;

    display: inline-table;
    max-height: 300px;
    overflow-y: scroll;

    th,
    td {
        padding: 8px;
        text-align: left;
        border: 1px solid #ddd;
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
