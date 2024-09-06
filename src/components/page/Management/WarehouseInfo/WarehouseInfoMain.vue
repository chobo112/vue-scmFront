<template>
    <div class="divWarehouseInfoList">
        <table>
            <thead>
                <tr>
                    <th>창고번호</th>
                    <th>창고이름</th>
                    <th>창고위치</th>
                    <th>담당자</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="warehouseList">
                    <template v-if="warehouseList.length > 0">
                        <tr
                            v-for="warehouse in warehouseList"
                            :key="warehouse.storage_code"
                            @click="handlerDetailView(warehouse.storage_code)">
                        <td>{{ warehouse.storage_code }}</td>
                        <td>{{ warehouse.storage_name }}</td>
                        <td>{{ warehouse.storage_loc }}</td>
                        <td>{{ warehouse.storage_manager }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="4">조회된 창고가 없습니다.</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <WarehouseInfoModal v-if="modalState.modalState" @postSuccess="searchList"/>
        <WarehouseInfoDetailModal v-if="detailView" @detailView="detailView = !detailView" :storage_code = "storage_code"/>
    </div>
</template>

<script setup>
import axios from 'axios';
import WarehouseInfoModal from './WarehouseInfoModal.vue';
import WarehouseInfoDetailModal from './WarehouseInfoDetailModal.vue'
import { useModalStore } from '@/stores/modalState';

const warehouseList = ref();
const route = useRoute();
const modalState = useModalStore();
const detailView = ref(false);
const storage_code = ref();

const searchList = () => {
    let param = new URLSearchParams({
        searchSelect: route.query.searchSelect || "",
        searchTitle: route.query.searchTitle || ""
    });
    
    axios.post('/api/management/warehouseListJson.do', param).then((res) => {
        warehouseList.value = res.data.list;
    })
}

const handlerDetailView = (storageCode) => {
    storage_code.value = storageCode;
    detailView.value = !detailView.value;
}

watch(route, searchList);
onMounted( () => {searchList()});

</script>

<style lang="scss" scoped>
.divWarehouseInfoList {
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
