import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Error404 from "../pages/404";
import SideBar from "../Layouts/Sidebar";
import Almacenes from "../pages/almacenes";
import Programar from "../pages/programar";
import Salida from "../pages/salida";
import Entrada from "../pages/entrada";
import NuevaEntrada from "../pages/nuevaEntrada";
import NuevoAlmacen from "../pages/nuevoAlmacen";
import Estatus from "../pages/estatus";
import Sestatus from "../pages/sestatus";
import MFAVerification from "../Layouts/mfa";
import ResetPassword from "../pages/ResetPassword";
import EditarAlmacen from "../pages/EditarAlmacen";
import Productos from "../pages/producto";
import NuevaSalida from "../pages/nuevaSalida";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sidebar" element={<SideBar />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/almacenes" element={<Almacenes />} />
        <Route path="/programar" element={<Programar />} />
        <Route path="/salida" element={<Salida />} />
        <Route path="/entrada" element={<Entrada />} />
        <Route path="/nentrada" element={<NuevaEntrada />} />
        <Route path="/nalmacen" element={<NuevoAlmacen />} />
        <Route path="/estatus" element={<Estatus />} />
        <Route path="/sestatus" element={<Sestatus />} />
        <Route path="/mfa" element={<MFAVerification />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/producto" element={<Productos />} />
        <Route path="/nsalida" element={<NuevaSalida />} />
        <Route path="/editar-almacen/:id" element={<EditarAlmacen />} />
         <Route path="/" element={<Login />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
