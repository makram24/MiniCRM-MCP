export type HttpMethod = "GET" | "POST" | "PUT";

export type MinicrmRequest = {
  method: HttpMethod;
  /** Path only, e.g. `/Api/R3/Contact` */
  pathname: string;
  /** Query string without leading `?` */
  search?: string;
  body?: unknown;
};

export type MinicrmResponse = {
  status: number;
  bodyText: string;
};

export interface MinicrmBackend {
  request(req: MinicrmRequest): Promise<MinicrmResponse>;
}
