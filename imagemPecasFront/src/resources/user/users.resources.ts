export class User {
  name?: string;
  email?: string;
  password?: string;
}

export class Credentials {
  email?: string;
  password?: string;
}

export class AccessToken {
  accessToken?: string;
}

export class UserSessionToken {
  name?: string;
  email?: string;
  accessToken?: string;
  expiration?: number; // segundos desde 01/01/1970 (claim "exp" do JWT)
}
