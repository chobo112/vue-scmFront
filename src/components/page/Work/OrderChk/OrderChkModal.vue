<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="title">
                    알람
                </div>
                <div class="content">
                    입금하시겠습니까?
                </div>
                <div class="button-box">
                    <button @click="handlerDeposit">입금</button>
                    <button @click="modalState.setModalState">보류</button>
                </div>
            </div>
        </div>
    </teleport>

</template>

<script setup>
import { useModalStore } from '@/stores/modalState';
import axios from 'axios';

const modalState = useModalStore();
const props = defineProps(["orderSeq"]);
const emit = defineEmits(["searchList"]);

const handlerDeposit = () => {
    if(window.confirm('입금확인 처리를 하시겠습니까?')){
        axios.post('/api/work/depositJson.do', {seq: props.orderSeq}).then((res) => {
            if(res.data === 'success'){
                alert('입금확인 처리가 되었습니다.');
                modalState.setModalState();
                emit("searchList");
            } else {
                alert('입금확인 처리 중 오류가 발생하였습니다.');
            }
        })
    } else {
        alert('입금확인 처리를 취소하였습니다.');
    }
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


.container {
    text-align:center;
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
