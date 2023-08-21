import { Role } from "./role.model";

export class User {
    id:                       number  | undefined;
    firstname:                string  | undefined;
    lastname:                 string  | undefined;
    email:                    string  | undefined;
    username:                 string  | undefined;
    password:                 string  | undefined;
    token:                    string  | undefined;
    tokenExpiration:          Date    | undefined;
    role:                     string  | undefined;
    avatarLink:               string  | undefined;
    enabled:                  boolean | undefined;
    accountNonExpired:        boolean | undefined;
    accountNonLocked:         boolean | undefined;
    credentialsNonExpired:    boolean | undefined;
    authorities:              Role[]  | undefined;
    initials:                 string  | undefined;
    currentTheme:             string  | undefined;
}
