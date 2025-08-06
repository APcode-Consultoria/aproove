package com.github.andrepenteado.roove.services.impl;

import br.unesp.fc.andrepenteado.core.web.dto.UserLogin;
import com.github.andrepenteado.roove.services.SecurityService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class SecurityServiceImpl implements SecurityService {

    @Override
    public UserLogin getUserLogin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getPrincipal() instanceof UserLogin) {
            return (UserLogin) auth.getPrincipal();
        }

        throw new AccessDeniedException("Usuário não autenticado");
    }

    @Override
    public boolean hasPerfil(String nomePerfil) {
        Collection<? extends GrantedAuthority> authorities = getUserLogin().getAuthorities();

        return authorities.stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(auth -> auth.equals(nomePerfil));
    }

}
