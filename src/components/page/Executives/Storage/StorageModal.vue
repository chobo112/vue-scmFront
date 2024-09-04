<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">창고 상세</div>
                <table>
                    <colgroup>
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>창고이름</th>
                            <th>상품이름</th>
                            <th>상품가격</th>
                            <th>상품개수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="4">기다려주세요.</td>
                        </tr>
                        <tr v-else-if="storageObject.length <= 0">
                            <td colspan="4">데이터가 없습니다.</td>
                        </tr>
                        <tr v-for="storageItem in storageObject" :key="storageItem.item_code">
                            <td>{{ storageItem.storage_name }}</td>
                            <td>{{ storageItem.item_name }}</td>
                            <td>{{ addComma(storageItem.item_price) }} 원</td>
                            <td>{{ addComma(storageItem.inventory_count) }} 개</td>
                        </tr>
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
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const modalState = useModalStore();
const storageObject = ref(new Object());
const { storageCodeProp } = defineProps(["storageCodeProp"]);

const searchStorageDetail = async () => {
    const result = await axios.post("/api/executives/storageDetailJson.do", { storage_code: storageCodeProp });
    return result.data;
};

const { isLoading } = useQuery({
    queryKey: ["storageDetail", storageCodeProp],
    queryFn: searchStorageDetail,
    staleTime: 60 * 1000,
    select: (data) => {
        storageObject.value = data.storageDetailList;
    }
});

const addComma = (val) => {
    return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
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
label {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 700px;
    height: auto;
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
    font-size: 18px;
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
