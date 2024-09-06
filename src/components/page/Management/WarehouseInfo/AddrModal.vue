<template>
    <div>
      <button @click="openPostcode">주소찾기</button>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';

const emit = defineEmits(["selectedAddr"]);
const addr = ref(new Object({
    zonecode: '',
    address: ''
}));


const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
        addr.value.zonecode = data.zonecode;
        addr.value.address = data.address;
        emit("selectedAddr", addr.value);
    }
  }).open();
};
</script>


<style lang="scss" scoped>
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