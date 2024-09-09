<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">배송지시서</div>
                <div v-if="isLoading">잠시만 기다려주세요.</div>
                <table>
                    <colgroup>
                        <col width="10%" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="10%" />
                        <col width="15%" />
                        <col width="10%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>주문번호</th>
                            <th>주문일자</th>
                            <th>기업명</th>
                            <th>제품명</th>
                            <th>주문수량</th>
                            <th>배송담당자</th>
                            <th>입금여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ obtainObject.seq }}</td>
                            <td>{{ obtainObject.obtainDate }}</td>
                            <td>{{ obtainObject.custName }}</td>
                            <td>{{ obtainObject.itemName }}</td>
                            <td>{{ obtainObject.obtainCount }} 개</td>
                            <td>
                                <select v-model="deliveryPerson" :disabled="deliveryStatus">
                                    <option value="" disabled>전체</option>
                                    <template
                                        v-if="obtainObject?.deliveryPersonList?.length > 0"
                                        v-for="deliveryPerson in obtainObject.deliveryPersonList"
                                        :key="deliveryPerson.loginID"
                                    >
                                        <option :value="deliveryPerson.loginID">
                                            {{ deliveryPerson.name }}
                                        </option>
                                    </template>
                                </select>
                            </td>
                            <td>{{ obtainObject.depositYn }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="selectStorage" v-if="!deliveryStatus">
                    <label>
                        <span>창고</span>
                        <select v-model="storageCode" @change="(e) => handlerStorageChange(e)">
                            <option value="" selected disabled>선택</option>
                            <template
                                v-if="obtainObject?.storageList?.length > 0"
                                v-for="storage in obtainObject.storageList"
                                :key="storage.storage_code"
                            >
                                <option :value="storage.storage_code" :data-inventory-count="storage.inventory_count">
                                    {{ storage.storage_name }}
                                </option>
                            </template>
                        </select>
                    </label>
                    <label>
                        <span>재고수량</span>
                        <input type="text" v-model="inventoryCnt" readonly />
                    </label>
                </div>

                <div class="divDelivery" v-if="obtainObject.delivery">
                    <table>
                        <colgroup>
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="10%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>배송번호</th>
                                <th>배송일자</th>
                                <th>제품명</th>
                                <th>배송수량</th>
                                <th>배송창고</th>
                                <th>출발지역</th>
                                <th>배송지</th>
                                <th>배송담당자</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ obtainObject.deliveryInfo.deliveryNum }}</td>
                                <td>{{ obtainObject.deliveryInfo.deliveryDate }}</td>
                                <td>{{ obtainObject.deliveryInfo.itemName }}</td>
                                <td>{{ obtainObject.deliveryInfo.obtainCount }} 개</td>
                                <td>{{ obtainObject.deliveryInfo.storageName }}</td>
                                <td>{{ obtainObject.deliveryInfo.storageLoc }}</td>
                                <td>{{ obtainObject.deliveryInfo.deliveryEndLoc }}</td>
                                <td>{{ obtainObject.deliveryInfo.deliveryName }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="btn-group">
                    <button v-if="!obtainObject.delivery" @click="deliveryInsert">작성</button>
                    <button v-else-if="obtainObject.delivery && !deliveryStatus" @click="deliveryUpdate">수정</button>
                    <button @click="modalState.setModalState">닫기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { nullCheck } from "@/common/nullCheck";
import { useModalStore } from "@/stores/modalState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const { obtainSeqProp } = defineProps(["obtainSeqProp"]);
const obtainObject = ref(new Object());
const modalState = useModalStore();
const queryClient = useQueryClient();
const inventoryCnt = ref();
const deliveryStatus = ref(false);
const deliveryPerson = ref("");
const storageCode = ref("");

const handlerStorageChange = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const inventoryCount = selectedOption.dataset.inventoryCount || 0;
    inventoryCnt.value = inventoryCount;
};

const postSuccess = () => {
    alert("저장되었습니다.");
    modalState.setModalState();
    queryClient.invalidateQueries({
        queryKey: ["obtainList"]
    });
    obtainSeqProp.value();
};

const searchObtainDetail = async () => {
    const result = await axios.post("/api/business/obtainDetail.do", {
        obtainSeq: obtainSeqProp
    });
    return result.data;
};

const { isLoading } = useQuery({
    queryKey: ["obtainDetail", obtainSeqProp],
    queryFn: searchObtainDetail,
    select: (data) => {
        obtainObject.value = data;
        if (data.delivery) {
            if (data.deliveryInfo.deliveryState === "배송완료") deliveryStatus.value = true;
            deliveryPerson.value = data.deliveryInfo.deliveryId || "";
        }
    }
});

const validateDelivery = () => {
    const checkList = [
        { inval: deliveryPerson?.value, msg: "배송담당자를 선택해주세요." },
        { inval: storageCode?.value, msg: "창고를 선택해주세요." }
    ];

    if (!nullCheck(checkList)) {
        throw new Error();
    }
};

const insertDelivery = async () => {
    validateDelivery();

    await axios.post("/api/business/deliveryInsertJson.do", {
        ...obtainObject.value,
        deliveryId: deliveryPerson.value,
        storageCode: storageCode.value
    });
};

const { mutate: deliveryInsert } = useMutation({
    mutationFn: insertDelivery,
    onSuccess: postSuccess
});

const updateDelivery = async () => {
    validateDelivery();

    await axios.post("/api/business/deliveryUpdateJson.do", {
        ...obtainObject.value,
        deliveryId: deliveryPerson.value,
        storageCode: storageCode.value
    });
};

const { mutate: deliveryUpdate } = useMutation({
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

.selectStorage {
    margin-top: 20px;
    display: flex;
    align-items: center;
}

.selectStorage label {
    margin-right: 10px;
}

.selectStorage input,
select {
    width: 150px;
}

label {
    display: flex;
    flex-direction: column;
}

input[type="text"],
select {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

select {
    width: 150px;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 1300px;
    max-height: 500px;
    align-content: center;
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
