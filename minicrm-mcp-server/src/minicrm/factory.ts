import type { MinicrmConfig } from "../config.js";
import { MockMinicrmBackend } from "./mock-backend.js";
import { RealMinicrmBackend } from "./real-backend.js";
import type { MinicrmBackend } from "./types.js";

export function createMinicrmBackend(cfg: MinicrmConfig): MinicrmBackend {
  if (cfg.useMock) {
    return new MockMinicrmBackend(cfg.fixturesDir);
  }
  return new RealMinicrmBackend(cfg);
}
