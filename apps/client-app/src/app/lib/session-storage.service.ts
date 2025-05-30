export class SessionStorageService {
  static setUserId(id: string) {
    localStorage.setItem("repayr.uid", id);
  }

  static clear() {
    localStorage.removeItem("repayr.uid");
  }

  static getUserId() {
    return localStorage.getItem("repayr.uid");
  }
}
