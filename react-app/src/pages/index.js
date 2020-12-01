import { HomePage } from "./HomePage";
import { AddItem } from "./AddItem";
export const routes = () => [
    {
        path: "/",
        exact: true,
        component: HomePage,
    },
    {
        path: "/add-item/:id?",
        component: AddItem,
    },
    // {
    //   path: "/list-rest",
    //   component: ListRest,
    // },
    // {
    //   path: "/restaurant",
    //   component: RestaurantPage,
    // },
    // {
    //   path: "/restaurant-menu",
    //   component: RestaurantMenu,
    // },
    // {
    //   path: "/restaurant-modif",
    //   component: RestaurantModif,
    // },
    // {
    //   path: "/restaurant-delivery",
    //   component: RestaurantDelivery,
    // },
    // {
    //   path: "/restaurant-discount",
    //   component: RestaurantDiscount,
    // },
    // {
    //   path: "/restaurant-order",
    //   component: RestaurantOrder,
    // },
];
