<template>
    <div class="backdrop">
        <div class="container">
            <div class="header">
                <strong>반품 신청</strong>
                <span class="font_red">* 필수항목</span>
            </div>
            <div class="content">
                <table class="row">
                    <tbody>
                        <tr>
                            <th scope="row">제품명</th>
                            <td>
                                <input type="text" class="inputTxt p100" id="item_name" readonly="readonly" v-model="props.props.item_name"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">제조사</th>
                            <td colspan="3">
                                <input type="text" class="inputTxt p100" id="manufac" readonly="readonly" v-model="props.props.manufac"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">수량</th>
                            <td colspan="3">
                                <input type="text" class="inputTxt p100" name="count" id="count" readonly="readonly" v-model="props.props.obtain_count"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">환불 가격</th>
                            <td colspan="3">
                                <input type="text" class="inputTxt p100" name="total" id="total" readonly="readonly" v-model="price"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">은행명<span class="font_red">*</span></th>
                            <td colspan="3">
                                <input type="text" class="inputTxt p100" name="refund_bank" id="refund_bank" placeholder="은행명을 입력해주세요" v-model="param.refund_bank"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">송금자명<span class="font_red">*</span></th>
                            <td colspan="3">
                                <input type="text" class="inputTxt p100" name="refund_bank_name" id="refund_bank_name" placeholder="송금자명을 입력해주세요" v-model="param.refund_bank_name"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">계좌번호<span class="font_red">*</span></th>
                            <td colspan="3">
                                <input type="text" class="inputTxt p100" name="refund_bank_num" id="refund_bank_num" placeholder="계좌번호를 입력해주세요" v-model="param.refund_bank_num"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="btn_areaC mt30">
                    <button class="btn-primary" @click="orderReturn">반품</button>
                    <button class="btn-secondary" @click="modalState.setModalState()">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modalState';
import axios from 'axios';


    const modalState = useModalStore();
    const props = defineProps(['props']);
    const price = props.props.item_price * props.props.obtain_count;
    const param = ref({
        refund_bank: '',
        refund_bank_name: '',
        refund_bank_num: ''
    });

    const orderReturn = ()=>{
        if(param.value.refund_bank === '' || param.value.refund_bank === null){
            document.getElementById('refund_bank').focus();
            alert('은행명을 확인해주세요')
            return
        }
        if(param.value.refund_bank_name === '' || param.value.refund_bank_name === null){
            document.getElementById('refund_bank_name').focus();
            alert('송금자명을 확인해주세요')
            return
        }
        if(param.value.refund_bank_num === '' || param.value.refund_bank_num === null){
            document.getElementById('refund_bank_num').focus();
            alert('계좌번호를 확인해주세요')
            return
        }
        axios
            .post(`/api/mypage/orderReturn.do`, {
                ...props.props,
                ...param.value
            })
            .then((res)=>{
                if(res.data === 1){
                    alert("반품신청이 완료되었습니다.")
                    modalState.setModalState();
                    window.location.reload();
                }else{
                    alert("죄송합니다. 다시 신청해주세요.")
                    modalState.setModalState();
                    window.location.reload();
                }
            })
    }

</script>

<style scoped>
/* Backdrop style */
.backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    font-weight: bold;
}

/* Container style */
.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

/* Header style */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

/* Font color for mandatory fields */
.font_red {
    color: red;
}

/* Table and input styles */
.table {
    width: 100%;
    border-collapse: collapse;
}

th {
    text-align: left;
    padding-right: 10px;
    white-space: nowrap;
}

td {
    padding: 8px 0;
}

.inputTxt {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

/* Button area styles */
.btn_areaC {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

/* Margin for buttons */
.mt30 {
    margin-top: 30px;
}
</style>
