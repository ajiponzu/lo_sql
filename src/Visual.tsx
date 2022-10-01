import { Outlet } from "react-router-dom";
import Header from "./Visual/Header";
import SideView from "./Visual/SideView";
import { Scrollbars } from "rc-scrollbars";

const MainView = () => {
  return (
    <div className="MainView">
      <div className="Outlet">
        <Outlet />
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="MainLayout">
      <section className="side">
        <Scrollbars>
          <SideView />
        </Scrollbars>
      </section>
      <section className="pad" />
      <section className="main">
        <Scrollbars>
          <MainView />
        </Scrollbars>
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
