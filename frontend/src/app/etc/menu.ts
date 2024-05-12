export const MENU = [
  {
    id: "dashboard", texto: "Dashboard", icone: "speedometer", path: "/dashboard", subMenu: [
      { texto: "Dashboard", path: "/dashboard" }
    ]
  },
  {
    id: "paciente", texto: "Paciente", icone: "person-lines-fill", path: "/paciente/pesquisar", subMenu: [
      { texto: "Pesquisar", path: "/paciente/pesquisar" },
      { texto: "Incluir", path: "/paciente/cadastro" }
    ]
  }

];
