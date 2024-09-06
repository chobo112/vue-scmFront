<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <table>
                    <thead>
                        <tr>
                            <th colspan="4">새 창고 등록</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>창고이름</th>
                            <td><input type="text" v-model="storageName"></td>
                            <th>우편번호</th>
                            <td>
                                <input type="text" class="zip_code" v-model="zonecode" disabled><AddrModal @selectedAddr="setAddr" class="addr_modal"/>
                            </td>
                        </tr>
                        <tr>
                            <th>담당자</th>
                            <td><input type="text" v-model="storageManager"></td>
                            <th>주소</th>
                            <td><input type="text" class="address" v-model="address" disabled></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                            <th>상세주소</th>
                            <td><input type="text" class="address" v-model="detailAddress"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <button @click="warehouseSave">저장</button>
                    <button @click="handlerModal">취소</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from '@/stores/modalState';
import AddrModal from './AddrModal.vue';
import axios from 'axios';

const modalState = useModalStore();
const storageName = ref('');
const storageManager = ref('');
const detailAddress = ref('');
const zonecode = ref('');
const address = ref('');
const emit = defineEmits(["selectedAddr", "postSuccess"]);

const setAddr = (selectedAddr) => {
  zonecode.value = selectedAddr.zonecode;
  address.value = selectedAddr.address;
};

const warehouseSave = () => {
    if(storageName.value.trim() === ''){
        alert('창고이름을 입력하세요.');
        return;
    }
    if(window.confirm('창고를 등록하시겠습니까?')){
        axios.post('/api/management/newStorageSaveJson.do', {
            storage_name: storageName.value,
            storage_loc: address.value,
            storage_detail_loc: detailAddress.value,
            storage_loc_num: zonecode.value,
            storage_manager: storageManager.value
        }).then((res) => {
            if(res.data === 'success'){
                alert('창고가 등록되었습니다.');
                handlerModal();
                emit("postSuccess");
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