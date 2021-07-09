module.exports = {
  multiCapabilities: [
      {
        browserName: 'chrome',
        version: 'latest',
        platform: 'macOS 10.13',
        name: 'sscs-chrome-mac-test',
        tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
        extendedDebugging: true,
        capturePerformance: true,
        sharedTestFiles: false,
        maxInstances: 1
      },
      {
        browserName: 'firefox',
        version: 'latest',
        platform: 'macOS 10.13',
        name: 'sscs-firefox-mac-test',
        tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
        extendedDebugging: true,
        capturePerformance: true,
        sharedTestFiles: false,
        maxInstances: 1
      },
     {
      browserName: 'chrome',
      version: 'latest',
      platform: 'Windows 10',
      name: 'sscs-chrome-windows-test',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },
    {
      browserName: 'firefox',
      version: 'latest',
      platform: 'Windows 10',
      name: 'sscs-firefox-windows-test',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },
    {
      browserName: 'safari',
      platform: 'macOS 10.13',
      version: 'latest-1',
      name: 'sscs-safari-mac-test',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1,
    },
    {
      browserName: 'MicrosoftEdge',
      version: 'latest',
      platform: 'Windows 10',
      name: 'sscs-microsoft-edge-windows-test',
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },
    //   {
    //     browserName: 'internet explorer',
    //     version: 'latest',
    //     platform: 'Windows 10',
    //     name: 'sscs-ie11-windows-test',
    //     tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
    //     extendedDebugging: true,
    //     capturePerformance: true,
    //     sharedTestFiles: false,
    //     maxInstances: 1
    //   },
    ],
};
