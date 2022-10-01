import { Outlet } from "react-router-dom";
import Header from "./Visual/Header";
import SideView from "./Visual/SideView";

const MainView = () => {
  return (
    <div className="MainView">
      <Outlet />
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="MainLayout">
      <section className="side">
        <SideView />
      </section>
      <section className="main">
        <MainView />
      </section>
    </div>
  );
};

const Visual = () => {
  return (
    <div className="Visual">
      <Header />
      <MainLayout />
    </div>
  );
};

export default Visual;
