export const environment = {
  production: true,
  backendURL:  window.location.protocol + '//' + window.location.host,
  portalURL: window.location.protocol + '//' + window.location.host.replace('roove.', 'portal.').replace('30003','30002')
};
