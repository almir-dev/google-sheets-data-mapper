export interface PersistenceManagerConfig {
  scope: PersistenceManagerScope;
  clientId: string;
  apiKey: string;
}

export enum PersistenceManagerScope {
  READ_ONLY = "https://www.googleapis.com/auth/spreadsheets.readonly",
  FULL = "https://www.googleapis.com/auth/spreadsheets"
}

class PersistenceManagerImpl {
  private readonly discoveryDocs = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4"
  ];

  init(config: PersistenceManagerConfig): void {
    gapi.load("client:auth2", () => this.initClient(config));
  }

  private initClient(config: PersistenceManagerConfig) {
    const { scope, apiKey, clientId } = config;
    return gapi.client
      .init({
        apiKey,
        clientId,
        scope,
        discoveryDocs: this.discoveryDocs
      })
      .then(this.handleSignIn, this.handleFailedClientInit)
      .catch(this.handleFailedClientInit);
  }

  private readonly handleSignIn = () => {
    if (!this.isSignedIn()) {
      this.signIn();
    }
  };

  private readonly handleFailedClientInit = (reason: string) => {
    Promise.resolve("Failed to initialized google client:auth2 " + reason);
  };

  private readonly signIn = (): Promise<gapi.auth2.GoogleUser> => {
    return gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(
        response => Promise.resolve(response),
        (reason: string) =>
          Promise.reject("Failed to sign into google account " + reason)
      )
      .catch((reason: string) =>
        Promise.reject("Failed to log into google account" + reason)
      );
  };

  private isSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  private getCurrentUser() {
    return gapi.auth2.getAuthInstance().currentUser.get();
  }
}

export const PersistenceManager = new PersistenceManagerImpl();
