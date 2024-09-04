import Login from "@/views/Login.vue";
import { createRouter, createWebHistory } from "vue-router";
import Notice from "@/views/Notice.vue";
import DashBoard from "@/views/DashBoard.vue";
import ComnCodMgr from "@/views/ComnCodMgr.vue";
import ComnCodMgrDetail from "@/components/page/ComnCodMgr/ComnCodMgrDetail.vue";
import Sale from "@/views/Sale.vue";
import SaleTop from "@/views/SaleTop.vue";

const routes = [
    {
        path: "/",
        name: "login",
        component: Login
    },
    {
        path: "/vue",
        name: "vue",
        component: DashBoard,
        children: [
            {
                path: "board",
                name: "board",
                children: [
                    {
                        path: "notice.do",
                        name: "notice",
                        component: Notice
                    }
                ]
            },
            {
                path: "system",
                name: "system",
                children: [
                    {
                        path: "comnCodMgr.do",
                        name: "comnCodMgr",
                        component: ComnCodMgr
                    },
                    {
                        path: ":id",
                        name: "comnCodMgrDetail",
                        component: ComnCodMgrDetail
                    }
                ]
            },
            {
                path: "executives",
                name: "executives",
                children: [
                    {
                        path: "sales.do",
                        name: "sale",
                        component: Sale
                    },
                    {
                        path: "salesTop.do",
                        name: "saleTop",
                        component: SaleTop
                    }
                ]
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory("/"),
    routes
});

export default router;
