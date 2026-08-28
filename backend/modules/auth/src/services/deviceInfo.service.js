import { UAParser } from "ua-parser-js";

function getDeviceInfo(req) {
  const userAgent = req.headers["user-agent"];

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    ipAddress:
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      req.ip,

    userAgent,

    browser: {
      name: result.browser.name || "Unknown",
      version: result.browser.version || "Unknown",
    },

    os: {
      name: result.os.name || "Unknown",
      version: result.os.version || "Unknown",
    },

    device: {
      type: result.device.type || "desktop",
      model: result.device.model || "Unknown",
      vendor: result.device.vendor || "Unknown",
    },

    cpu: {
      architecture: result.cpu.architecture || "Unknown",
    },

    engine: {
      name: result.engine.name || "Unknown",
      version: result.engine.version || "Unknown",
    },

    time: {
      timestamp: Date.now(),
      iso: new Date().toISOString(),
      local: new Date().toLocaleString(),
    },
  };
}

export default getDeviceInfo;