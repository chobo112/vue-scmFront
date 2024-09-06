<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <table>
                    <thead>
                        <tr>
                            <th colspan="4">창고별 현황</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>창고이름</th>
                            <th>상품이름</th>
                            <th>상품가격</th>
                            <th>상품개수</th>
                        </tr>
                        <tr v-for="detail in warehouseDetail.warehouseDetail"
                            :key="detail.item_code">
                            <td>{{ detail.storage_name }}</td>
                            <td>{{ detail.item_name }}</td>
                            <td>{{ detail.item_price }}</td>
                            <td>{{ detail.inventory_count }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <button @click="handlerClose">닫기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import axios from 'axios';

const emit = defineEmits(["detailView"]);
const props = defineProps(["storage_code"]);
const warehouseDetail = ref({});

const searchDetail = () => {
    axios.post('/api/management/warehouseDetailJson.do', { storage_code: props.storage_code }).then((res) => {
        warehouseDetail.value = res.data
    })
}

onMounted(() => {searchDetail()});

const handlerClose = () => {
    emit("detailView");
}
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

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;

    table thead tr th{
        background-color: #2676bf;
    }

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

    td {
        text-align:center;
    }
}

input[type="text"] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}


.zip_code {
    margin-right:10px;
}

.addr_modal {
    display:inline-block;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 800px;
}

.address {
    width:300px;
}

.button-box {
    text-align: center;
    margin-top: 10px;
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
</style>