<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <ContextBox>상세보기</ContextBox>
                <table>
                    <thead>
                        <tr>
                            <th>업체이름</th>
                            <th>물품이름</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="orderCompanyDetail in orderCompanyDetailList"
                            :key="orderCompanyDetail.item_code">
                            <td>{{ orderCompanyDetail.company_name }}</td>
                            <td>{{ orderCompanyDetail.item_name }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="item">
                    <label>물품추가</label>
                    <select v-model="item">
                        <option value ="" selected disabled>선택</option>
                        <option 
                            v-for="item in itemList" 
                            :key="item.item_code"
                            :value="item.item_code">
                        {{ item.item_name }}
                    </option>
                    </select>
                </div>
                <div class="button-box">
                    <button @click="itemSave">추가</button>
                    <button @click="handlerDetail">닫기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import ContextBox from '@/components/common/ContextBox.vue';
import axios from 'axios';

const emit = defineEmits(["detailClose"]);
const props = defineProps(["companySeq"]);
const orderCompanyDetailList = ref([]);
const itemList = ref([]);
const item = ref('');

onMounted(()=>{
    searchList(),
    searchItemList()
});

const searchList = () => {
    axios.post('/api/management/orderCompanyDetailJson.do', {company_seq: props.companySeq}).then((res) => {
        orderCompanyDetailList.value = res.data.orderCompanyDetailList;
    })
}
const searchItemList = () => {
    axios.post('/api/management/orderComSelectItemJson.do', {company_seq: props.companySeq}).then((res) => {
        itemList.value = res.data.itemList;
    })
}

const itemSave = () => {
    if(item.value.trim() === ''){
        alert('추가할 물품을 선택하세요.');
        return;
    }
    if(window.confirm('해당 물품을 추가하시겠습니까?')){
        axios.post('/api/management/newItemSaveJson.do', {
            company_seq:props.companySeq,
            item_code:item.value
        }).then((res) => {
            if(res.data === 'success'){
                alert('물품이 추가되었습니다.');
                searchList();
            } else {
                alert('물품 추가 중 오류가 발생하였습니다.');
            }
        })
    } else {
        alert('물품 추가를 취소하였습니다.');
    }
}

const handlerDetail = () => {
    emit("detailClose");
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

.item {
    margin-top:15px;
    text-align:center;
}

label {
    margin-right:10px;
}

select {
    width:150px;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 400px;
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