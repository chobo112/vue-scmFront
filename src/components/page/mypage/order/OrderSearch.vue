<template>
    <div>
        <p class="conTitle">
            <span class="fr">
                <button @click="setToday">오늘</button>
                <button @click="setWeek">일주일</button>
                <button @click="setMonth">한달</button>
                
                <input type="date" id="startDate" v-model="orderParam.startDate">
                ~
                <input type="date" id="endDate" v-model="orderParam.endDate">
            </span>
        </p>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';

const orderParam = ref({
    startDate: '',
    endDate: '',
});
const provider = inject('providedValue');

const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const initializeDates = () => {
    const today = new Date();
    orderParam.value.startDate = formatDate(today);
    orderParam.value.endDate = formatDate(today);
};

const setToday = () => {
    const today = new Date();
    orderParam.value.startDate = formatDate(today);
    orderParam.value.endDate = formatDate(today);
};

const setWeek = () => {
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    orderParam.value.startDate = formatDate(weekAgo);
    orderParam.value.endDate = formatDate(new Date());
};

const setMonth = () => {
    const today = new Date();
    const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
    orderParam.value.startDate = formatDate(monthAgo);
    orderParam.value.endDate = formatDate(new Date());
};

watch(orderParam.value, (newVal) => {
    provider.value = {...newVal};
});

onMounted(() => {
    initializeDates();
});
</script>
<style scoped>
/* Container style */
.container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

/* Table styles */
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
    border: 1px solid #fff;
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

/* Empty message style */
.empty-message {
    text-align: center;
    padding: 20px;
    color: #777;
}

.empty-message td {
    border: none;
    background-color: #f9f9f9;
}

/* Additional styles */
.totalDiv {
    text-align: center;
    margin-top: 20px;
}

.bottomSpan {
    margin: 3px;
}

.countInput {
    width: 50px;
    text-align: center;
}

a {
    cursor: pointer;
}

/* Form styles */
.conTitle {
    font-size: 18px;
    margin-bottom: 20px;
    float: right;
}

.fr {
    display: flex;
    align-items: center;
    gap: 10px;
}

input[type="date"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

button:hover {
    background-color: #0056b3;
    color: white;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

</style>