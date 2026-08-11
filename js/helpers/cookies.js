
/*
    this file is helper to authorize a user
      1. write cookie used only to write the token 
      2. erase cookie used to delete the token for logging ouy
      3. getCookie used to get the token to query the data
*/
export function writeCookie(name = '', value = '', expiresInDays, path = '/') {
    const date = new Date();
    date.setTime(date.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=${path}`;
}

export function eraseCookie(name = '', path = '/') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`;
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}