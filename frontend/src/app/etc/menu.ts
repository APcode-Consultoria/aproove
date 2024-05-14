import { Menu } from "@andrepenteado/ngx-apcore";

export const MENU: Menu[] = [
  {
    id: "dashboard", texto: "Dashboard", icone: "speedometer", path: "/dashboard", subMenus: [
      { texto: "Dashboard", path: "/dashboard" }
    ]
  },
  {
    id: "paciente", texto: "Paciente", icone: "person-lines-fill", path: "/paciente/pesquisar", subMenus: [
      { texto: "Pesquisar", path: "/paciente/pesquisar" },
      { texto: "Incluir", path: "/paciente/cadastro" }
    ]
  }

];
