import { createBrowserRouter } from "react-router-dom";
import LayoutMenu from "./components/Layout/layout_menu" // Общая обертка (меню, шапка)

// import { Home } from '/pages/Home/home'; // Главная страница
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutMenu />, // Общий шаблон для всех страниц
    children: [
      //   {
      //     path: '', // Главная страница (домен/)
      //     element: <Home />,
      //   },
    ],
  },
  //   {
  //     path: '*', // Если роут не найден, показываем 404 отдельно
  //     element: <NotFound />,
  //   },
]);
