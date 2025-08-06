package com.github.andrepenteado.roove.services;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;

public interface SecurityService {

    UserLogin getUserLogin();

    boolean hasPerfil(String nomePerfil);

}
