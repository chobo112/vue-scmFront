<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <table>
                    <thead>
                        <tr>
                            <th colspan="2">발주 업체 등록</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>업체이름</th>
                            <td><input type="text" v-model="companyName"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <button @click="orderCompanySave">저장</button>
                    <button @click="handlerModal">취소</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from '@/stores/modalState';
import axios from 'axios';

const modalState = useModalStore();
const companyName = ref('');
const emit = defineEmits(["searchList"]);

const orderCompanySave = () => {
    if(companyName.value.trim() === ''){
        alert('업체이름을 입력하세요.');
    }
    if(window.confirm('발주 업체를 등록하시겠습니까?')){
        axios.post('/api/management/newCompanySaveJson.do', {company_name: companyName.value}).then((res) => {
            if(res.data === 'success'){
                alert('등록되었습니다.');
                handlerModal();
                emit("searchList");
            } else {
                alert('등록 중 오류가 발생하였습니다.');
            }
        })
    } else {
        alert('등록을 취소하였습니다.');
    }
}

const handlerModal = () => {
    modalState.setModalState(!modalState);
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
        text-align:left;
    }
}

input[type="text"] {
    width:93%;
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
