// multi.js
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// List your env files here
const accounts = [
  "env.account1.txt",
  "env.account2.txt",
  "env.account3.txt",
  "env.account4.txt",
  "env.account5.txt",
  "env.account6.txt"
  // add ".env.account3", etc.
];

accounts.forEach((envFile, i) => {
  const envPath = path.resolve(__dirname, envFile);
  if (!fs.existsSync(envPath)) {
    console.error(`⚠️ Missing ${envFile}`);
    return;
  }

  // Load env file
  const envVars = fs.readFileSync(envPath, "utf8")
    .split("\n")
    .filter(line => line.trim() && !line.startsWith("#"))
    .reduce((acc, line) => {
      const [key, value] = line.split("=");
      acc[key] = value;
      return acc;
    }, {});

  // Give each account a unique PORT
  envVars.PORT = 8080 + i;

  console.log(`🚀 Starting account ${i + 1} (${envFile}) on port ${envVars.PORT}`);

  // Spawn index.js with this env
  const child = spawn("node", ["index.js"], {
    env: { ...process.env, ...envVars },
    stdio: "inherit"
  });

  child.on("exit", code => {
    console.log(`❌ Account ${i + 1} exited with code ${code}`);
  });
});


