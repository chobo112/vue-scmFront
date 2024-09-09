<template>
    <div class="container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" @change="toggleAll" :checked="isAllChecked" /></th>
            <th>장비구분</th>
            <th>제품명</th>
            <th>제조사</th>
            <th>가격</th>
            <th>수량</th>
            <th>합계</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listCnt === 0" class="empty-message">
            <td colspan="8">제품을 담아주세요.</td>
          </tr>
          <tr v-else v-for="item in cartInfo" :key="item.item_code">
            <td>
              <!-- 체크박스 상태 관리 -->
              <input
                type="checkbox"
                :value="item.item_code"
                :checked="isChecked(item.item_code)"
                @change="handleCheckboxChange(item)"
              />
            </td>
            <td>{{ item.equipment_type }}</td>
            <td>{{ item.item_name }}</td>
            <td>{{ item.manufac }}</td>
            <td>{{ formatWon(item.item_price) }}</td>
            <td>
              <input
                class="countInput"
                type="number"
                v-model.number="item.count"
                @focusout="countChange(item)"
                @input="updateSelectedItem(item)"
              />
            </td>
            <td>{{ formatWon(item.item_price * item.count) }}</td>
            <td><a @click="removeItem(item.item_code)"><span>X</span></a></td>
          </tr>
        </tbody>
      </table>
      <div class="totalDiv">
        <span class="bottomSpan">결제금액 : </span>
        <span class="bottomSpan">{{ formatWon(totalAmount) }}</span>
        <button @click="productBuy">결제하기</button>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

    // 초기 상태 정의
    const cartInfo = ref([]);
    const listCnt = ref(0);
    const selectedItemCodes = ref([]);
    const router = useRouter();

    // 카트 리스트를 가져오는 함수
    const cartList =  () => {
   
        axios.post('/api/mypage/cartListJson.do')
            .then((res)=>{
                cartInfo.value = res.data.cartInfo;
                listCnt.value = res.data.cnt;
            });
   
    };

    // 페이지가 로드될 때 카트 리스트를 가져옴
    onMounted(() => {
        cartList();
    });

    // 체크된 항목의 총합을 계산하는 계산된 속성
    const totalAmount = computed(() => {
        return selectedItemCodes.value
            .reduce((total, selectedItem) => {
                const item = cartInfo.value.find(item => item.item_code === selectedItem.item_code);
                return item ? total + (item.item_price * item.count) : total;
            }, 0);
    });

    // 체크박스의 체크 상태를 확인하는 함수
    const isChecked = (itemCode) => {
        return selectedItemCodes.value.some(selectedItem => selectedItem.item_code === itemCode);
    };

    // 전체 선택 체크박스의 체크 상태를 확인하는 계산된 속성
    const isAllChecked = computed(() => {
        return cartInfo.value.every(item => isChecked(item.item_code));
    });

    // 체크박스 상태 변경을 처리하는 함수
    const handleCheckboxChange = (item) => {
    if (isChecked(item.item_code)) {
        // 체크가 해제된 경우
        updateSelectedItem({ item_code: item.item_code, count: 0 });
    } else {
        // 체크된 경우
        updateSelectedItem(item);
    }
    };

    // 체크된 항목을 업데이트하거나 초기화하는 함수
    const updateSelectedItem = (item) => {
    const index = selectedItemCodes.value.findIndex(selectedItem => selectedItem.item_code === item.item_code);

    if (item.count > 0) {
        if (index === -1) {
        // 항목이 선택되지 않은 경우 추가
        selectedItemCodes.value.push({ item_code: item.item_code, count: item.count });
        } else {
        // 항목이 선택된 경우 수량을 업데이트
        selectedItemCodes.value[index].count = item.count;
        }
    } else {
        // 수량이 0 이하인 경우 항목을 제거
        if (index !== -1) {
        selectedItemCodes.value.splice(index, 1);
        }
    }
    };

    // 모든 아이템의 체크박스를 토글하는 함수
    const toggleAll = (event) => {
    if (event.target.checked) {
        selectedItemCodes.value = cartInfo.value
        .filter(item => item.count > 0)
        .map(item => ({
            item_code: item.item_code,
            count: item.count
        }));
    } else {
        selectedItemCodes.value = [];
    }
    };

    // 아이템을 제거하는 함수
    const removeItem = (itemCode) => {
        axios.post('/api/mypge/cartDelete.do', {
            item_code : itemCode
        })
        .then(()=>{
            cartList();
        })
    };

    const productBuy = ()=>{
        if(selectedItemCodes.value.length > 0){
            axios.post('/api/mypage/productBuyJson.do', {
            ...selectedItemCodes._value
            })
            .then(()=>{
                alert("결제가 완료되었습니다.")
                router.replace('/vue/mypage/order.do')
            })
        }else{
            alert("결제할 제품이 없습니다.")
        }
    }
    
    const countChange = (item)=>{
        const jsonString = JSON.stringify(item);
        const parsedObject = JSON.parse(jsonString);
        
        axios.post('/api/mypage/cartCountChangeJson.do', {
            item_code : parsedObject.item_code,
            obtain_count : parsedObject.count
        })
    }

    const formatWon = (price) => {
        const result = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${result}` + `원`;
    };

  </script>
  

<style scoped>
  .container {
            width: 100%;
            padding-top: 20px;
            box-sizing: border-box;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            text-align: center;
        }

        thead {
            background-color: #333;
            color: #fff;
        }

        th, td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }

        th {
            font-weight: bold;
            border: 1px solid white;
        }

        tbody tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tbody tr:hover {
            background-color: #ddd;
        }

        input[type="checkbox"] {
            cursor: pointer;
        }

        td {
            vertical-align: middle;
        }

        .empty-message {
            text-align: center;
            padding: 20px;
            color: #777;
        }

        .empty-message td {
            border: none;
            background-color: #f9f9f9;
        }
        .totalDiv{
            text-align: center;
            margin-top: 20px;
        }
        .bottomSpan{
            margin: 3px;
        }
        .countInput{
            width: 50px;
            text-align: center;
        }
        a{
            cursor: pointer;
        }
        button{
            
        }
</style>
