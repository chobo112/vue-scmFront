<template>
    <table>
        <colgroup>
            <col width="10%" />
            <col width="30%" />
            <col width="40%" />
            <col width="20%" />
        </colgroup>
        <thead>
            <tr>
                <th>번호</th>
                <th>이름</th>
                <th>위치</th>
                <th>담당자</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="isLoading">
                <td colspan="4">잠시만 기다려주세요.</td>
            </tr>
            <tr v-else-if="storageList.storageList.length <= 0">
                <td colspan="4">데이터가 없습니다.</td>
            </tr>
            <tr
                v-else
                v-for="storage in storageList.storageList"
                :key="storage.storage_code"
                @click="handlerModal(storage.storage_code)"
            >
                <td>{{ storage.storage_code }}</td>
                <td>{{ storage.storage_name }}</td>
                <td>{{ storage.storage_loc }}</td>
                <td>{{ storage.storage_manager }}</td>
            </tr>
        </tbody>
        <StorageModal v-if="modalState.modalState" :storageCodeProp="storageCodePorp"></StorageModal>
    </table>
</template>

<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import StorageModal from "./StorageModal.vue";
import { useModalStore } from "@/stores/modalState";

const searchValue = inject("providedValue");
const modalState = useModalStore();
const storageCodePorp = ref();

const searchStorageList = async () => {
    const result = await axios.post("/api/executives/storageListJson.do", {
        searchTitle: searchValue.value
    });
    return result.data;
};

const {
    data: storageList,
    isLoading,
    refetch
} = useQuery({
    queryKey: ["storageList", searchValue],
    queryFn: searchStorageList
});

const handlerModal = (storageCode) => {
    storageCodePorp.value = storageCode;
    modalState.setModalState();
};
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

a {
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: white;
    }
}

button {
    text-align: center;
    text-decoration: none;
    display: block;
    border: none;
    color: white;
    width: 80px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 12px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;
    float: inline-end;

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
