<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="title">
                    제품 상세정보
                </div>
                <table>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <th>제품명</th>
                            <td><input type="text" v-model="productInfo.item_name" disabled></td>
                        </tr>
                        <tr>
                            <th>장비구분</th>
                            <td><input type="text" v-model="productInfo.equipment_type" disabled></td>
                        </tr>
                        <tr>
                            <th>제품정보</th>
                            <td><textarea v-model="productInfo.product_detail" disabled></textarea></td>
                        </tr>
                        <tr>
                            <th>제조사</th>
                            <td><input type="text" v-model="productInfo.manufac" disabled></td>
                        </tr>
                        <tr>
                            <th>수량</th>
                            <td><input type="text" v-model="count" @input="validateCount"></td>
                        </tr>
                        <tr>
                            <th>가격</th>
                            <td><input type="text" v-model="productInfo.item_price" disabled></td>
                        </tr>
                        <tr>
                            <th>총 가격</th>
                            <td><input type="text" v-model="total"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <button @click="handlerPay">결제</button>
                    <button @click="handlerCart">담기</button>
                    <button @click="modalState.setModalState">취소</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from '@/stores/modalState';
import axios from 'axios';

const modalState = useModalStore();
const props = defineProps(["itemCode"]);
const productInfo = ref([]);
const count = ref(0);
const total = ref(0);

const itemDetail = () => {
    axios.post('/api/product/productDetail.do', {item_code: props.itemCode}).then((res) => {
        productInfo.value = res.data.productInfo;
    })
}

onMounted(() => {
    itemDetail();
});

// 수량에 숫자만 입력 가능하도록
const validateCount = (event) => {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
    count.value = parseInt(input.value);
}

// 총 가격 계산
const totalPrice = () => {
    if(count.value > 0){
        const price = parseInt(productInfo.value.item_price);
        total.value = count.value * price;
    }
}

watch(count, () => {
    totalPrice();
});

const validChk = (count) => {
    if(Number(count.value) <= 0){
        alert('수량은 1 이상이어야 합니다.');
        return false;
    } else {
        return true;
    }
}

const handlerPay = () => {
    const valid = validChk(count);
    if(valid){
        axios.post('/api/product/productPayJson.do', {
            item_code: props.itemCode,
            count: count.value
        }).then((res) => {
            if(res.data === 'success'){
                alert('결제가 완료되었습니다.');
                modalState.setModalState();
            } else {
                alert('결제 중 오류가 발생하였습니다.');
            }
        })
    }
}

const handlerCart = () => {
    const valid = validChk(count);
    if(valid){
        axios.post('/api/product/productCartJson.do', {
            item_code: props.itemCode,
            obtain_count: count.value
        }).then((res) => {
            if(res.data === 'success'){
                alert('장바구니에 담기가 완료되었습니다.');
                modalState.setModalState();
            } else {
                alert('장바구니에 담는 중 오류가 발생하였습니다.');
            }
        })
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

textarea,
input[type="text"] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

textarea {
    width:73%;
    height:50px;
    resize:none;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 400px;
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
