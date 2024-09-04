<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">상세 코드 관리</div>
                <tbody v-if="!isLoding">
                    <tr>
                        <th>그룹 코드 id *</th>
                        <td>
                            <input type="text" readonly :value="props.grpCod" />
                        </td>
                        <th>그룹 코드 명 *</th>
                        <td>
                            <input type="text" readonly :value="props.grpCodNm" />
                        </td>
                    </tr>
                    <tr>
                        <th>상세 코드 id *</th>
                        <td>
                            <input
                                type="text"
                                v-model="detailObject.dtl_cod"
                                :readonly="props.detailProp === 'create' ? false : true"
                            />
                        </td>
                        <th>상세 코드 명 *</th>
                        <td>
                            <input type="text" v-model="detailObject.dtl_cod_nm" />
                        </td>
                    </tr>
                    <tr>
                        <th>코드 설명</th>
                        <td colSpan="3">
                            <input type="text" v-model="detailObject.dtl_cod_eplti" />
                        </td>
                    </tr>
                    <tr>
                        <th>사용 유무 *</th>
                        <td colspan="3">
                            <input type="radio" name="useYn" value="Y" v-model="detailObject.use_poa" />
                            사용
                            <input type="radio" name="useYn" value="N" v-model="detailObject.use_poa" />
                            미사용
                        </td>
                    </tr>
                </tbody>
                <div class="btn-group">
                    <button @click="props.detailProp === 'create' ? comnCodInsert() : comnCodUpdate()">
                        {{ props.detailProp === "create" ? "저장" : "수정" }}
                    </button>
                    <button v-if="props.detailProp !== 'create'" @click="comnCodDelete">삭제</button>
                    <button @click="modalState.setModalState">닫기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from "@/stores/modalState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const modalState = useModalStore();
const props = defineProps(["grpCod", "grpCodNm", "detailProp"]);
const detailObject = ref(new Object()); // 초기값 설정
const queryClient = useQueryClient();

const apiSuccess = () => {
    modalState.setModalState();
    queryClient.invalidateQueries({
        queryKey: ["detailList"]
    });
};

const detailInsert = async () => {
    await axios.post("/api/system/saveComnDtlCodJson.do", {
        dtl_grp_cod: props.grpCod,
        ...detailObject.value
    });
};

const { mutate: comnCodInsert } = useMutation({
    mutationFn: detailInsert,
    onSuccess: apiSuccess
});

const detailUpdate = async () => {
    await axios.post("/api/system/updateComnDtlCodJson.do", {
        dtl_grp_cod: props.grpCod,
        ...detailObject.value
    });
};

const { mutate: comnCodUpdate } = useMutation({
    mutationFn: detailUpdate,
    onSuccess: apiSuccess
});

const detailDelete = async () => {
    await axios.post("/api/system/deleteComnDtlCodJson.do", {
        dtl_grp_cod: props.grpCod,
        dtl_cod: props.detailProp
    });
};

const { mutate: comnCodDelete } = useMutation({
    mutationFn: detailDelete,
    onSuccess: apiSuccess
});

const searchDetail = async () => {
    const result = await axios.post("/api/system/selectComnDtlCod.do", {
        grp_cod: props.grpCod,
        dtl_cod: props.detailProp
    });
    return result.data;
};

const { isLoding } = useQuery({
    queryKey: ["detail", props.detailProp],
    queryFn: searchDetail,
    enabled: props.detailProp !== "create",
    staleTime: 60 * 1000,
    select: (data) => {
        detailObject.value = data.comnDtlCodModel;
    }
});
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
.header {
    background-color: #e0e0e0;
    padding: 10px 100% 10px 0px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 16px;
    font-size: 20px;
    margin-right: auto;
}
label {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
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
    width: 600px;
    height: 300px;
    align-content: center;
}

.btn-group {
    text-align: right;
    margin-top: 10px;
    float: inline-end;
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
