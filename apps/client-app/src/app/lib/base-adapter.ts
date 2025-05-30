import { HttpClient } from "./http-client";

export class BaseAdapter {
  protected readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient = HttpClient.getInstance()) {
    this.httpClient = httpClient;
  }
}
