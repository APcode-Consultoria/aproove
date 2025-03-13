import { Menu } from "@andre.penteado/ngx-apcore";

export const MENU: Menu[] = [
  {
    id: "dashboard", texto: "Dashboard", icone: "chart-line", path: "/dashboard", subMenus: []
  },
  {
    id: "paciente", texto: "Paciente", icone: "hospital-user", path: "/paciente/pesquisar", subMenus: []
  }

];
