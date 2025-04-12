import { Menu } from "@andre.penteado/ngx-apcore";
import { PREFIXO_PERFIL_SISTEMA } from "./layout";

export const MENU: Menu[] = [
  {
    id: "dashboard", texto: "Dashboard", icone: "chart-line", path: "/dashboard", roles: [`${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`], subMenus: []
  },
  {
    id: "paciente", texto: "Paciente", icone: "hospital-user", path: "/paciente/pesquisar", roles: [`${PREFIXO_PERFIL_SISTEMA}FISIOTERAPEUTA`], subMenus: []
  }

];
