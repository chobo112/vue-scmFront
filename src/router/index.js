import Login from "@/views/Login.vue";
import { createRouter, createWebHistory } from "vue-router";
import Notice from "@/views/Board/Notice.vue";
import DashBoard from "@/views/DashBoard.vue";
import ComnCodMgr from "@/views/ComnCodMgr.vue";
import ComnCodMgrDetail from "@/components/page/ComnCodMgr/ComnCodMgrDetail.vue";
import Inquiry from "@/views/Board/Inquiry.vue";
import Cart from "@/views/mypage/Cart.vue";
import Test from "@/views/test.vue";
import Sale from "@/views/Sale.vue";
import SaleTop from "@/views/SaleTop.vue";
import ReturnChk from "@/views/ReturnChk.vue";
import Storage from "@/views/Storage.vue";
import SupplyInfo from "@/views/SupplyInfo.vue";
import WarehouseInfo from "@/views/Management/WarehouseInfo.vue";
import OrderCompany from "@/views/Management/OrderCompany.vue";
import Product from "@/views/Product/Product.vue";
import Order from "@/views/mypage/Order.vue";
import Obtain from "@/views/Obtain.vue";
import OrderChk from "@/views/Work/OrderChk.vue";
import OrderList from "@/views/direction/OrderList.vue";
import Return from "@/views/mypage/Return.vue";

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
                    },
                    {
                        path: "inquiry.do",
                        name: "inquiry",
                        component: Inquiry
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
                path: "mypage",
                name: "mypage",
                children: [
                    {
                        path: "cart.do",
                        name: "cart",
                        component: Cart
                    },
                    {
                        path: "order.do",
                        name: "order",
                        component: Order
                    },
                    {
                        path: "return.do",
                        name: "return",
                        component: Return
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
                    },
                    {
                        path: "storage.do",
                        name: "storage",
                        component: Storage
                    }
                ]
            },
            {
                path: "work",
                name: "work",
                children: [
                    {
                        path: "returnChk.do",
                        name: "returnChk",
                        component: ReturnChk
                    },
                    {
                        path: "orderChk.do",
                        name: "orderChk",
                        component: OrderChk
                    }
                ]
            },
            {
                path: "management",
                name: "management",
                children: [
                    {
                        path: "supplyInfo.do",
                        name: "supplyInfo",
                        component: SupplyInfo
                    },
                    {
                        path: "warehouseInfo.do",
                        name: "warehouseInfo",
                        component: WarehouseInfo
                    },
                    {
                        path: "orderCompany.do",
                        name: "orderCompany",
                        component: OrderCompany
                    }
                ]
            },
            {
                path: "product",
                name: "product",
                children: [
                    {
                        path: "product.do",
                        name: "product",
                        component: Product
                    }
                ]
            },
            {
                path: "business",
                name: "business",
                children: [
                    {
                        path: "obtain.do",
                        name: "obtain",
                        component: Obtain
                    }
                ]
            },
            {
                path: "direction",
                name: "direction",
                children: [
                    {
                        path: "orderList.do",
                        name: "orderList",
                        component: OrderList
                    }
                ]
            }
        ]
    },
    {
        path: "/test",
        name: "test",
        component: Test
    }
];

const router = createRouter({
    history: createWebHistory("/"),
    routes
});

export default router;
