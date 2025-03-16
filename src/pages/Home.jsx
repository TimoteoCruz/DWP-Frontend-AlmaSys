import "../styles/Home.css";
import Sidebar from "../Layouts/Sidebar";

const Home = () => {
  return (
    <div className="home-container flex">
      <Sidebar />
      <main className="p-6 flex-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="card">Almacén A</div>
          <div className="card">Almacén B</div>
          <div className="card">Almacén C</div>
        </div>
      </main>
    </div>
  );
};

export default Home;
